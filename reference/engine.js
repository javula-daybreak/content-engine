#!/usr/bin/env node
'use strict';

// Deterministic checks for the content engine. PRD section 13.1.
//
// Six mechanisms in sections 3 and 9 are exact string and number work: 8-gram
// overlap, the lexical list, contraction rate, sentence-length stdev, hashtag
// counts, and the lock read. A model does these unreliably and reports clean
// when it fails, and the gate report is written by the same model that missed
// the character. This file owns them so the report is auditable rather than
// self-witnessed.
//
// Node, no dependencies. It reads and never writes, which is stronger than
// section 13.1's "writes nothing outside profiles/<handle>/". The one
// exception is `test`, which builds fixtures under os.tmpdir() and removes
// them.
//
// Usage:
//   node reference/engine.js overlap <draft.md> <profile-dir>
//   node reference/engine.js lexical <draft.md> [--short]
//   node reference/engine.js stats   <draft.md> [profile-dir]
//   node reference/engine.js locks   <profile-dir>
//   node reference/engine.js test
//
// Every subcommand prints one JSON object to stdout and exits 0. Exit 1 means
// the arguments or the filesystem were wrong, never that a check failed.
// gate-report.md quotes this JSON, so the JSON has to arrive.

const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');

// Written as escapes so the repo-wide "zero dashes in any file" check stays
// meaningful. This is the one file that has to contain them to detect them.
const EM_DASH = '\u2014';
const EN_DASH = '\u2013';
const CURLY_OPEN = '\u201c';
const CURLY_CLOSE = '\u201d';
const APOS = '\u2019';

// Section 3: any shared run of 8+ words is a hard fail.
const NGRAM = 8;
// Section 3: more than ~15% sentence-level similarity to a single prior piece.
const SENTENCE_SIM_LIMIT = 0.15;
// ponytail: two sentences count as the same sentence at Jaccard 0.6 over their
// word sets. A knob, not a measured constant. Tune it against the ten posts at
// section 13 step 8, alongside the rewrite cap.
const SENTENCE_MATCH = 0.6;
// Section 3: the anchor lock. An item is off limits until 10 other pieces ship.
const ANCHOR_LOCK = 10;
// Section 3: hook pattern, no reuse in the trailing 8, no more than twice in 20.
const HOOK_RECENT = 8;
const HOOK_WINDOW = 20;
const HOOK_WINDOW_MAX = 2;
// Section 3: no archetype reuse within the trailing 5 shipped visual pieces.
const ARCHETYPE_LOCK = 5;
// Section 3: the same thesis x hook pair is locked 30 days.
const PAIR_LOCK_DAYS = 30;
// Section 12.1: below 11 unlocked anchors the 10-post rotation cannot turn.
const ROTATION_FLOOR = 11;
// Section 9: hashtag stacks at the bottom. Three is a stack.
const HASHTAG_STACK = 3;
// Section 9's voice floor: flag at more than 25% below the value in voice.md.
const VOICE_FLOOR = 0.75;
// Section 13.1: the diff corpus is the last 20 shipped pieces.
const PRIOR_LIMIT = 20;

// Section 9's lexical list, verbatim. Single words match on a word boundary
// and allow suffixes, so "leveraged" and "unpacking" both fire. Phrases match
// literally.
const BANNED = [
  'delve', 'unpack', 'dive in', 'leverage', 'robust', 'seamless', 'landscape',
  'realm', 'testament', 'tapestry', 'navigate the complexities',
  'at the end of the day', 'game-changer', 'no-brainer', 'double down',
  'moving the needle', "in today's fast-paced world", 'the reality is',
  'let that sink in',
];

// Section 9's announcement register. Literal strings only. The announcement
// *shape* is a judgment and stays with the model, per section 9's split of
// which half is deterministic.
const ANNOUNCEMENT = [
  "we're excited to share", "we're thrilled to", "we're proud to",
  'join us', 'stay tuned', 'more in the comments',
];

const PATTERNS = [
  { tag: 'not-only-but-also', re: /\bnot only\b[\s\S]{0,80}?\bbut also\b/gi },
  { tag: 'at-company-we-believe', re: /\bat [A-Z][\w.&' ]{1,30}, we believe\b/g },
];

// Possessive 's and contracted 's are the same two characters. This is the
// short list of the contracted ones; every other 's is read as a possessive.
// Getting it wrong shifts contraction_rate enough to move section 9's voice
// floor, and voice.md's frozen baseline is measured by this same function, so
// the two stay comparable either way.
const S_CONTRACTIONS = new Set([
  "it's", "that's", "there's", "here's", "what's", "who's", "he's", "she's",
  "let's", "how's", "where's", "when's", "one's", "everyone's", "nothing's",
  "something's", "everything's", "somebody's", "nobody's",
]);

// ---------------------------------------------------------------- primitives

function readFile(p) {
  return fs.readFileSync(p, 'utf8');
}

function readIfPresent(p) {
  try { return fs.readFileSync(p, 'utf8'); } catch (e) { return ''; }
}

function listDirs(p) {
  try {
    return fs.readdirSync(p, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
  } catch (e) { return []; }
}

function normalizeApos(s) {
  return s.split(APOS).join("'");
}

// Lowercase token stream with source offsets, so a matched span can be quoted
// back in the writer's own casing rather than in the normalized form.
function tokenize(text) {
  const out = [];
  const re = new RegExp("[A-Za-z0-9][A-Za-z0-9'\\u2019]*", 'g');
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push({ t: normalizeApos(m[0]).toLowerCase(), start: m.index, end: m.index + m[0].length });
  }
  return out;
}

function words(text) {
  return tokenize(text).map(o => o.t);
}

// A line break ends a sentence. LinkedIn posts are mostly fragments on their
// own lines, and a splitter that only knows about terminal punctuation reads a
// twelve-line post as one 90-word sentence.
function sentences(text) {
  const lines = text.split(/\r?\n/);
  const out = [];
  for (const line of lines) {
    const trimmed = line.replace(/^\s*(?:[-*+]|\d+[.)])\s+/, '').trim();
    if (!trimmed) continue;
    for (const part of trimmed.split(new RegExp('(?<=[.!?])["\'\\u201d)]*\\s+'))) {
      const s = part.trim();
      if (s && /[A-Za-z0-9]/.test(s)) out.push(s);
    }
  }
  return out;
}

function stdev(nums) {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  const v = nums.reduce((a, b) => a + (b - mean) * (b - mean), 0) / nums.length;
  return Math.sqrt(v);
}

function round(n, places) {
  const f = Math.pow(10, places);
  return Math.round(n * f) / f;
}

function shingles(tokens, n) {
  const out = [];
  for (let i = 0; i + n <= tokens.length; i++) {
    out.push({ i, key: tokens.slice(i, i + n).map(o => o.t).join(' ') });
  }
  return out;
}

function shingleSet(text, n) {
  const set = new Set();
  for (const s of shingles(tokenize(text), n)) set.add(s.key);
  return set;
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0;
  let shared = 0;
  for (const x of a) if (b.has(x)) shared++;
  return shared / (a.size + b.size - shared);
}

// ------------------------------------------------------------------ parsers
//
// These files have schemas this repo wrote, so targeted extractors beat a YAML
// subset parser. Anything a parser here cannot read is a schema drift bug and
// should be loud, not silently absorbed.

// Every profile file documents its own schema in a fenced block, and that
// example is a syntactically perfect item. Strip fences before reading items,
// or "<short-kebab-slug>" ships as a real anchor. voice.md is the exception
// and is read fence-and-all, because its frozen measurements live inside one.
function stripFences(text) {
  return text.replace(/^```[\s\S]*?^```/gm, '');
}

function stripValue(raw) {
  const v = raw.trim();
  if (/^\[.*\]$/.test(v)) {
    return v.slice(1, -1).split(',')
      .map(s => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  return v.replace(/\s+#.*$/, '').trim().replace(/^["']|["']$/g, '');
}

// brief.md front matter. Accepts a --- fenced block or a bare leading block.
function frontMatter(text) {
  const fenced = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const body = fenced ? fenced[1] : text;
  const out = {};
  let key = null;
  for (const raw of body.split(/\r?\n/)) {
    if (!fenced && !raw.trim() && key) break;
    const m = raw.match(/^([A-Za-z_][\w-]*):\s*(.*)$/);
    if (m) { key = m[1]; out[key] = stripValue(m[2]); continue; }
    if (key && /^\s+\S/.test(raw) && typeof out[key] === 'string') {
      out[key] = (out[key] + ' ' + raw.trim()).trim();
    }
  }
  return out;
}

// inventory.md items. Blocks starting at "- id:" under any heading.
function inventoryItems(text) {
  const items = [];
  const blocks = stripFences(text).split(/\n(?=\s*-\s+id:)/);
  for (const block of blocks) {
    if (!/^\s*-\s+id:/.test(block)) continue;
    const item = {};
    let key = null;
    for (const raw of block.split(/\r?\n/)) {
      if (/^\s*```/.test(raw)) break;
      const m = raw.match(/^\s*(?:-\s+)?([A-Za-z_][\w-]*):\s*(.*)$/);
      if (m) { key = m[1]; item[key] = stripValue(m[2]); continue; }
      if (key && raw.trim() && typeof item[key] === 'string') {
        item[key] = (item[key] + ' ' + raw.trim()).trim();
      }
    }
    if (item.id) items.push(item);
  }
  return items;
}

// shipped-history.md entries. "text: |" blocks under "- posted_at:".
function shippedHistory(text) {
  const out = [];
  const blocks = stripFences(text).split(/\n(?=\s*-\s+posted_at:)/);
  for (const block of blocks) {
    if (!/^\s*-\s+posted_at:/.test(block)) continue;
    const at = (block.match(/posted_at:\s*(.*)/) || [, ''])[1].trim();
    const m = block.match(/\n\s*text:\s*\|\s*\r?\n([\s\S]*?)(?=\n\s*\w+:\s|\n\s*```|$)/);
    if (!m) continue;
    const body = m[1].split(/\r?\n/).map(l => l.replace(/^\s{0,6}/, '')).join('\n').trim();
    if (body) out.push({ posted_at: at, text: body });
  }
  return out;
}

// voice.md's four frozen measurements. Section 6, frozen at setup.
function voiceMeasures(text) {
  const out = {};
  for (const key of ['avg_sentence_length', 'sentence_length_stdev', 'contraction_rate']) {
    const m = text.match(new RegExp('^\\s*' + key + ':\\s*(.*)$', 'm'));
    const v = m ? m[1].trim() : '';
    out[key] = v && !isNaN(parseFloat(v)) ? parseFloat(v) : null;
  }
  const f = text.match(/^\s*uses_fragments:\s*(.*)$/m);
  const fv = f ? f[1].trim() : '';
  out.uses_fragments = /^(yes|no)$/.test(fv) ? fv : null;
  return out;
}

// The usable inventory pool. Section 7: append-only, so exclusion is by
// annotation rather than deletion. Superseded, withdrawn, and do-not-publish
// items are all out of the draft-time load.
function usableInventory(profile) {
  const items = inventoryItems(readIfPresent(path.join(profile, 'inventory.md')));
  const superseded = new Set();
  for (const it of items) if (it.supersedes) superseded.add(it.supersedes);
  return items.filter(it =>
    !superseded.has(it.id) &&
    !it.withdrawn &&
    it.clearance !== 'do-not-publish');
}

// Shipped briefs, oldest first. The run directory is YYYY-MM-DD-<slug>, so the
// directory name carries the date and sorts chronologically on its own. No
// join to posts.csv is needed for ordering.
function shippedBriefs(profile) {
  const runsDir = path.join(profile, 'runs');
  const out = [];
  for (const name of listDirs(runsDir).sort()) {
    const m = name.match(/^(\d{4}-\d{2}-\d{2})-/);
    if (!m) continue;
    const briefPath = path.join(runsDir, name, 'brief.md');
    if (!fs.existsSync(briefPath)) continue;
    const fm = frontMatter(readFile(briefPath));
    if (fm.status !== 'shipped') continue;
    out.push({ slug: name, date: m[1], fm });
  }
  return out;
}

// ------------------------------------------------------------------ overlap

function overlap(draftPath, profile) {
  const draft = readFile(draftPath);
  const draftTokens = tokenize(draft);

  // Section 13.1: strip any span appearing verbatim in inventory content or
  // thesis.md before comparing. Without this the check destroys the one story
  // the person legitimately retells, and they turn it off. "Before comparing"
  // covers both halves below, the 8-gram scan and the sentence similarity, so
  // the test is one normalized-substring check used by each.
  const exemptCorpus = [
    ...usableInventory(profile).map(it => it.content || ''),
    readIfPresent(path.join(profile, 'thesis.md')),
  ].map(s => ' ' + words(s).join(' ') + ' ').join('\n');
  const isExemptKey = key => key.length > 0 && exemptCorpus.includes(' ' + key + ' ');
  const isExempt = text => isExemptKey(words(text).join(' '));

  // The diff corpus: the last 20 shipped pieces, plus pre-engine posts.
  const priors = [];
  const runsDir = path.join(profile, 'runs');
  const shippedDirs = listDirs(runsDir)
    .filter(n => /^\d{4}-\d{2}-\d{2}-/.test(n))
    .filter(n => fs.existsSync(path.join(runsDir, n, 'shipped.md')))
    .sort();
  for (const name of shippedDirs.slice(-PRIOR_LIMIT)) {
    priors.push({ slug: name, text: readFile(path.join(runsDir, name, 'shipped.md')) });
  }
  for (const h of shippedHistory(readIfPresent(path.join(profile, 'shipped-history.md')))) {
    priors.push({ slug: 'shipped-history:' + (h.posted_at || 'undated'), text: h.text });
  }

  const index = new Map();
  for (const p of priors) {
    for (const key of shingleSet(p.text, NGRAM)) {
      if (!index.has(key)) index.set(key, p.slug);
    }
  }

  // Detect first, classify after. Stripping exempt shingles before the scan
  // would satisfy the pass/fail rule but lose the citation warning that
  // section 13.1 also asks for.
  //
  // Adjacent shingles merge only when they agree on exemption. Token adjacency
  // runs straight through a paragraph break, so merging on contiguity alone
  // welds a retold inventory sentence onto the unrelated sentence beside it and
  // reports the legitimate half as a violation. That is the exact failure
  // section 13.1 says ends with the check being turned off.
  const spans = [];
  let lastIndex = -2;
  for (const sh of shingles(draftTokens, NGRAM)) {
    const slug = index.get(sh.key);
    if (!slug) { continue; }
    const exempt = isExemptKey(sh.key);
    const last = spans[spans.length - 1];
    if (last && last.slug === slug && last.exempt === exempt && sh.i === lastIndex + 1) {
      last.endToken = sh.i + NGRAM;
    } else {
      spans.push({ slug, exempt, startToken: sh.i, endToken: sh.i + NGRAM });
    }
    lastIndex = sh.i;
  }

  for (const s of spans) {
    s.words = s.endToken - s.startToken;
    s.text = draft.slice(draftTokens[s.startToken].start, draftTokens[s.endToken - 1].end);
    delete s.startToken;
    delete s.endToken;
  }

  // Section 3's second half: more than ~15% sentence-level similarity to a
  // single prior piece. Catches the paraphrase an 8-gram walks past.
  const allSentences = sentences(draft);
  const draftSentences = allSentences.filter(s => !isExempt(s)).map(s => new Set(words(s)));
  const similar = [];
  for (const p of priors) {
    const priorSentences = sentences(p.text).map(s => new Set(words(s)));
    let hits = 0;
    for (const d of draftSentences) {
      if (priorSentences.some(ps => jaccard(d, ps) >= SENTENCE_MATCH)) hits++;
    }
    const ratio = allSentences.length ? hits / allSentences.length : 0;
    if (ratio > SENTENCE_SIM_LIMIT) {
      similar.push({ slug: p.slug, matched_sentences: hits, ratio: round(ratio, 3) });
    }
  }

  const failures = spans.filter(s => !s.exempt);
  const warnings = spans.filter(s => s.exempt);
  return {
    check: 'overlap',
    pass: failures.length === 0 && similar.length === 0,
    priors_compared: priors.length,
    ngram: NGRAM,
    failures: failures.map(s => ({ prior: s.slug, words: s.words, text: s.text })),
    warnings: warnings.map(s => ({
      prior: s.slug, words: s.words, text: s.text,
      note: 'traceable to inventory or thesis, cited rather than failed',
    })),
    sentence_similarity: similar,
  };
}

// ------------------------------------------------------------------ lexical

// Section 9 rule 4: the gate never rewrites inside quotation marks. A hit in a
// quote is reported under "not rewritten: quoted or factual" and left alone.
// A silently edited quote from a named person is section 14's most important
// rule broken by section 9's own mechanism.
function quotedRanges(text) {
  const ranges = [];
  const pairs = [['"', '"'], [CURLY_OPEN, CURLY_CLOSE]];
  for (const [open, close] of pairs) {
    let i = 0;
    while (i < text.length) {
      const a = text.indexOf(open, i);
      if (a === -1) break;
      const b = text.indexOf(close, a + 1);
      if (b === -1) break;
      ranges.push([a, b + 1]);
      i = b + 1;
    }
  }
  return ranges;
}

function inQuote(ranges, at) {
  return ranges.some(([a, b]) => at >= a && at < b);
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scan(text, term, tag) {
  // Single words allow suffixes: "leveraged" and "unpacking" are the same tell.
  const body = escapeRe(term).split("'").join("['\\u2019]");
  const re = /\s/.test(term)
    ? new RegExp('\\b' + body, 'gi')
    : new RegExp('\\b' + body + '\\w*', 'gi');
  const out = [];
  let m;
  while ((m = re.exec(text)) !== null) out.push({ tag, term, at: m.index, match: m[0] });
  return out;
}

function lexical(draftPath, opts) {
  const draft = readFile(draftPath);
  const quotes = quotedRanges(draft);
  const hits = [];

  for (const term of BANNED) hits.push(...scan(draft, term, 'banned'));
  for (const term of ANNOUNCEMENT) hits.push(...scan(draft, term, 'announcement'));
  for (const p of PATTERNS) {
    let m;
    p.re.lastIndex = 0;
    while ((m = p.re.exec(draft)) !== null) {
      hits.push({ tag: p.tag, term: p.tag, at: m.index, match: m[0] });
    }
  }

  // Section 9: em dash, zero tolerance. En dash too, except between digits.
  let at = -1;
  while ((at = draft.indexOf(EM_DASH, at + 1)) !== -1) {
    hits.push({ tag: 'em-dash', term: EM_DASH, at, match: EM_DASH });
  }
  at = -1;
  while ((at = draft.indexOf(EN_DASH, at + 1)) !== -1) {
    const between = /\d/.test(draft[at - 1] || '') && /\d/.test(draft[at + 1] || '');
    if (!between) hits.push({ tag: 'en-dash', term: EN_DASH, at, match: EN_DASH });
  }

  // Section 9: semicolons, in short posts only.
  if (opts.short) {
    at = -1;
    while ((at = draft.indexOf(';', at + 1)) !== -1) {
      hits.push({ tag: 'semicolon', term: ';', at, match: ';' });
    }
  }

  // Section 9: Title Case Headers Inside A Post.
  // ponytail: a short unpunctuated line of 3+ words where most words are
  // capitalized. It cannot separate a header from a line of proper nouns, so
  // the ceiling is a false positive on a name list. Raise the word-ratio bar
  // if that fires in practice.
  let offset = 0;
  for (const line of draft.split(/\r?\n/)) {
    const t = line.trim();
    const w = t.split(/\s+/).filter(Boolean);
    if (t && t.length < 60 && w.length >= 3 && !/[.!?:,]$/.test(t) && !/^#/.test(t)) {
      const caps = w.filter(x => /^[A-Z][a-z]/.test(x)).length;
      if (caps >= Math.ceil(w.length * 0.7)) {
        hits.push({ tag: 'title-case-header', term: t, at: offset, match: t });
      }
    }
    offset += line.length + 1;
  }

  const hashtags = draft.match(/(^|\s)#[A-Za-z][\w]*/g) || [];

  // Section 9: a draft containing any literal string in brief.md's
  // private_terms is rejected and redrafted, not rewritten. brief.md sits
  // beside draft.md in the run directory.
  const brief = frontMatter(readIfPresent(path.join(path.dirname(draftPath), 'brief.md')));
  const privateTerms = Array.isArray(brief.private_terms) ? brief.private_terms : [];
  const privateHits = [];
  const lower = draft.toLowerCase();
  for (const term of privateTerms) {
    let i = -1;
    while ((i = lower.indexOf(String(term).toLowerCase(), i + 1)) !== -1) {
      privateHits.push({ term, at: i });
      break;
    }
  }

  for (const h of hits) h.protected = inQuote(quotes, h.at);
  hits.sort((a, b) => a.at - b.at);
  const rewritable = hits.filter(h => !h.protected);
  const protectedHits = hits.filter(h => h.protected);

  return {
    check: 'lexical',
    pass: rewritable.length === 0 && hashtags.length < HASHTAG_STACK && privateHits.length === 0,
    format: opts.short ? 'short' : 'any',
    action: privateHits.length ? 'reject' : (rewritable.length ? 'rewrite' : 'none'),
    rewrite_count: rewritable.length,
    hits: rewritable,
    not_rewritten_quoted_or_factual: protectedHits,
    hashtags: { count: hashtags.length, stack: hashtags.length >= HASHTAG_STACK },
    private_terms: {
      checked: privateTerms.length,
      violations: privateHits,
      note: 'a private_terms hit is a redraft, not a rewrite. Section 9.',
    },
  };
}

// -------------------------------------------------------------------- stats

function contractionCount(tokens) {
  let n = 0;
  for (const t of tokens) {
    if (!t.includes("'")) continue;
    if (/'(t|re|ve|ll|d|m)$/.test(t)) { n++; continue; }
    if (S_CONTRACTIONS.has(t)) n++;
  }
  return n;
}

// ponytail: named people, companies, and dates are approximated by numerals
// plus non-sentence-initial capitalized words. The ceiling is that it counts a
// capitalized common noun and misses a lowercase brand. It is a floor check
// ("this draft names nothing at all"), not a census, and section 9 only ever
// asks whether the count is zero.
function countSpecifics(text) {
  let n = (text.match(/\$\d[\d,.]*|\b\d[\d,.]*%?\b/g) || []).length;
  for (const s of sentences(text)) {
    const w = s.split(/\s+/).filter(Boolean);
    for (let i = 1; i < w.length; i++) {
      const t = w[i].replace(/^[^A-Za-z]+/, '').replace(/[^A-Za-z]+$/, '');
      if (t.length > 1 && /^[A-Z][a-z]/.test(t)) n++;
    }
  }
  return n;
}

function measure(text) {
  const ss = sentences(text);
  const lengths = ss.map(s => words(s).length).filter(n => n > 0);
  const total = lengths.reduce((a, b) => a + b, 0);
  const tokens = words(text);
  return {
    sentences: lengths.length,
    words: total,
    avg_sentence_length: lengths.length ? round(total / lengths.length, 2) : 0,
    sentence_length_stdev: round(stdev(lengths), 2),
    contraction_rate: total ? round((contractionCount(tokens) / total) * 100, 2) : 0,
    comma_density: total ? round(((text.match(/,/g) || []).length / total) * 100, 2) : 0,
    specifics: countSpecifics(text),
    shortest_sentence: lengths.length ? Math.min(...lengths) : 0,
    longest_sentence: lengths.length ? Math.max(...lengths) : 0,
  };
}

function stats(draftPath, profile) {
  const m = measure(readFile(draftPath));
  const flags = [];

  // Section 9's specifics floor. A draft naming nothing is redrafted, not
  // rewritten: an abstraction cannot be patched into an instance.
  if (m.specifics === 0) {
    flags.push({ rule: 'specifics-floor', action: 'redraft', detail: 'no named people, companies, dates, or numerals' });
  }

  // Section 9's voice floor.
  let baseline = null;
  if (profile) {
    baseline = voiceMeasures(readIfPresent(path.join(profile, 'voice.md')));
    for (const key of ['sentence_length_stdev', 'contraction_rate']) {
      const b = baseline[key];
      if (b === null || b === 0) continue;
      if (m[key] < b * VOICE_FLOOR) {
        flags.push({
          rule: 'voice-floor', action: 'flag', metric: key,
          draft: m[key], baseline: b, floor: round(b * VOICE_FLOOR, 2),
        });
      }
    }
  }
  const haveBaseline = baseline && (baseline.sentence_length_stdev !== null || baseline.contraction_rate !== null);
  if (!haveBaseline) {
    // Section 9's fallback where no samples exist.
    if (m.sentences && m.shortest_sentence >= 6) {
      flags.push({ rule: 'voice-floor-absolute', action: 'flag', detail: 'no sentence under 6 words' });
    }
    if (m.sentences && m.longest_sentence <= 25) {
      flags.push({ rule: 'voice-floor-absolute', action: 'flag', detail: 'no sentence over 25 words' });
    }
  }

  return {
    check: 'stats',
    pass: flags.length === 0,
    measured: m,
    baseline: baseline,
    baseline_source: haveBaseline ? 'voice.md' : 'none, absolute floors applied',
    flags,
  };
}

// -------------------------------------------------------------------- locks

function locks(profile) {
  const briefs = shippedBriefs(profile);
  const recent = arr => arr.slice(-1)[0];
  const tail = n => briefs.slice(Math.max(0, briefs.length - n));

  const pool = usableInventory(profile);
  const lockedAnchors = new Map();
  for (const b of tail(ANCHOR_LOCK)) {
    if (b.fm.anchor) lockedAnchors.set(b.fm.anchor, b.slug);
  }
  const unlocked = pool.map(it => it.id).filter(id => !lockedAnchors.has(id));

  const hookRecent = new Set();
  for (const b of tail(HOOK_RECENT)) if (b.fm.hook_id) hookRecent.add(b.fm.hook_id);
  const hookCounts = {};
  for (const b of tail(HOOK_WINDOW)) {
    if (b.fm.hook_id) hookCounts[b.fm.hook_id] = (hookCounts[b.fm.hook_id] || 0) + 1;
  }
  const hookAtLimit = Object.keys(hookCounts).filter(h => hookCounts[h] >= HOOK_WINDOW_MAX);

  const visual = briefs.filter(b => b.fm.archetype);
  const archetypeLocked = new Set();
  for (const b of visual.slice(Math.max(0, visual.length - ARCHETYPE_LOCK))) {
    archetypeLocked.add(b.fm.archetype);
  }

  const cutoff = new Date(Date.now() - PAIR_LOCK_DAYS * 86400000);
  const pairs = [];
  for (const b of briefs) {
    if (!b.fm.thesis_id || !b.fm.hook_id) continue;
    if (new Date(b.date + 'T00:00:00Z') < cutoff) continue;
    pairs.push({ pair: b.fm.thesis_id + ' x ' + b.fm.hook_id, slug: b.slug, date: b.date });
  }

  // ponytail: the PRD prints "N unlocked anchors, M posts of runway at current
  // cadence" (section 12) and never defines M anywhere. This is the buffer
  // above the stall point: with a 10-post anchor lock, a pool of P sustains
  // the rotation for P - 10 more pieces before it must reuse a locked anchor,
  // and section 12.1's floor of 11 falls straight out of it. Reported to the
  // PRD as an undefined term rather than settled here.
  const runway = Math.max(0, pool.length - ANCHOR_LOCK);

  return {
    check: 'locks',
    shipped_pieces: briefs.length,
    inventory_pool: pool.length,
    unlocked_anchors: unlocked,
    unlocked_count: unlocked.length,
    locked_anchors: Array.from(lockedAnchors, ([id, slug]) => ({ id, by: slug })),
    runway_posts: runway,
    rotation_healthy: unlocked.length >= ROTATION_FLOOR,
    hook_locked_recent: Array.from(hookRecent),
    hook_counts_trailing_20: hookCounts,
    hook_at_window_limit: hookAtLimit,
    archetype_locked: Array.from(archetypeLocked),
    thesis_hook_pairs_locked_30d: pairs,
    last_shipped: briefs.length ? recent(briefs).slug : null,
    run_start_line: unlocked.length + ' unlocked anchors, ' + runway + ' posts of runway.',
  };
}

// --------------------------------------------------------------- self-check

function writeFixture(root, rel, body) {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, body);
  return p;
}

function selfTest() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'engine-test-'));
  try {
    // A known 13-word run, which is 6 overlapping 8-grams.
    const RUN = 'the shadow spreadsheet is where the real planning happens every single week here';
    assert.strictEqual(RUN.split(' ').length, 13, 'fixture run must be 13 words');

    const profile = path.join(root, 'profiles', 'fixture');
    writeFixture(profile, 'runs/2026-01-05-prior/shipped.md',
      'Nobody admits it in the QBR.\n\n' + RUN + '.\n\nThat is the whole finding.');
    writeFixture(profile, 'runs/2026-01-05-prior/brief.md',
      'anchor: shadow-spreadsheet\nhook_id: confession\nthesis_id: t1\nstatus: shipped\n');
    writeFixture(profile, 'thesis.md', '# Thesis\n\nNothing overlapping lives here.\n');

    const draftDir = path.join(root, 'run');
    const draft = writeFixture(draftDir, 'draft.md',
      'I sat in on a planning call at Acme in March 2026.\n\n' +
      RUN + '.\n\nEveryone in the room already knew.\n');

    // ---- overlap: the section 13.2 assert, both directions ----
    writeFixture(profile, 'inventory.md', '## Items\n\n- id: unrelated\n  content: A completely different sentence about pallets.\n  clearance: public\n');
    const untraceable = overlap(draft, profile);
    assert.strictEqual(untraceable.pass, false, 'a 13-word run from a prior must fail');
    assert.strictEqual(untraceable.failures.length, 1, 'the run is one merged span');
    assert.strictEqual(untraceable.failures[0].words, 13, 'span is the full 13 words');
    assert.strictEqual(untraceable.failures[0].prior, '2026-01-05-prior', 'span names the prior slug');

    writeFixture(profile, 'inventory.md',
      '## Items\n\n- id: shadow-spreadsheet\n  content: ' + RUN + '.\n  clearance: public\n');
    const traceable = overlap(draft, profile);
    assert.strictEqual(traceable.pass, true, 'the same run sourced from inventory must pass');
    assert.strictEqual(traceable.failures.length, 0, 'nothing left to fail');
    assert.strictEqual(traceable.warnings.length, 1, 'it is still cited as a warning');
    assert.strictEqual(traceable.warnings[0].prior, '2026-01-05-prior', 'the warning names the prior');

    // Adjacency must not defeat the exemption. The prior's next sentence is
    // reproduced too, and token adjacency runs through the paragraph break, so
    // a contiguity-only merge welds the two into one failing span and reports
    // the traceable half as a violation.
    const adjacent = writeFixture(draftDir, 'adjacent.md',
      RUN + '.\n\nThat is the whole finding.\n');
    const adj = overlap(adjacent, profile);
    assert.strictEqual(adj.warnings.length, 1, 'the traceable run stays a warning beside a failure');
    assert.ok(adj.warnings[0].text.includes('shadow spreadsheet'), 'the warning is the inventory run');
    assert.ok(adj.failures.length >= 1, 'the untraceable neighbour still fails');
    assert.ok(!adj.failures.some(f => f.text.startsWith('the shadow spreadsheet')),
      'no failure span swallows the traceable sentence whole');

    // A draft sharing nothing must pass with the same corpus in place.
    const clean = writeFixture(draftDir, 'clean.md',
      'A different observation about pallet turns at Acme in March 2026.\nNobody measures it.\n');
    assert.strictEqual(overlap(clean, profile).pass, true, 'unrelated draft passes');

    // ---- lexical ----
    const lexDir = path.join(root, 'lex');
    writeFixture(lexDir, 'brief.md', 'anchor: a\nprivate_terms: [Northwind, 41%]\nstatus: drafted\n');
    const lexDraft = writeFixture(lexDir, 'draft.md',
      'We are going to leverage this' + EM_DASH + ' and it is robust.\n' +
      'She said "we should double down on that" in the review.\n' +
      'A Perfectly Balanced Header Line\n' +
      'It cost us 41% of the quarter; we moved on.\n' +
      '#supplychain #ops #logistics\n');
    const lex = lexical(lexDraft, { short: true });
    assert.strictEqual(lex.pass, false, 'a draft this loud cannot pass');
    assert.strictEqual(lex.action, 'reject', 'a private_terms hit rejects rather than rewrites');
    assert.strictEqual(lex.private_terms.violations.length, 1, '41% is a private term in the draft');
    const tags = lex.hits.map(h => h.tag);
    assert.ok(tags.includes('em-dash'), 'em dash caught');
    assert.ok(tags.includes('banned'), 'banned list caught');
    assert.ok(tags.includes('semicolon'), 'semicolon caught in a short post');
    assert.ok(tags.includes('title-case-header'), 'title case header caught');
    assert.strictEqual(lex.hashtags.count, 3, 'three hashtags counted');
    assert.ok(lex.hashtags.stack, 'three hashtags is a stack');
    // Section 9 rule 4: the quoted "double down" is reported, never rewritten.
    const quoted = lex.not_rewritten_quoted_or_factual.map(h => h.match.toLowerCase());
    assert.ok(quoted.some(t => t.startsWith('double down')), 'quoted ban is protected');
    assert.ok(!lex.hits.some(h => h.match.toLowerCase().startsWith('double down')),
      'a protected hit is never counted as a rewrite');
    // The semicolon rule is short-post only.
    assert.ok(!lexical(lexDraft, { short: false }).hits.some(h => h.tag === 'semicolon'),
      'semicolons are legal outside short posts');

    // ---- stats ----
    const statDir = path.join(root, 'stat');
    // Four sentences: 3, 14, 5 and 20 words.
    const statDraft = writeFixture(statDir, 'draft.md',
      'It never worked.\n' +
      "We shipped the Acme pilot in March and it fell over on day two.\n" +
      'Nobody wanted to say it.\n' +
      'The honest version is that we had built the whole thing for a buyer who had already left the company.\n');
    const st = stats(statDraft, null);
    assert.strictEqual(st.measured.sentences, 4, 'four sentences');
    assert.strictEqual(st.measured.words, 3 + 14 + 5 + 20, 'word count');
    assert.strictEqual(st.measured.longest_sentence, 20, 'longest is 20 words');
    assert.strictEqual(st.measured.shortest_sentence, 3, 'shortest is 3 words');
    assert.ok(st.measured.contraction_rate === 0, 'no contractions in this fixture');
    // Contracted 's and possessive 's are the same two characters, and only one
    // of them is a contraction. 3 of 11 words here, with Acme's excluded.
    const contr = writeFixture(statDir, 'contractions.md',
      "It's Acme's call now.\nWe didn't ship and they haven't asked.\n");
    assert.strictEqual(stats(contr, null).measured.words, 11, 'eleven words');
    assert.strictEqual(stats(contr, null).measured.contraction_rate, round(3 / 11 * 100, 2),
      "three contractions, and Acme's is not one of them");
    const poss = writeFixture(statDir, 'possessive.md', "Acme's board met.\nThe team's answer was no.\n");
    assert.strictEqual(stats(poss, null).measured.contraction_rate, 0,
      'a possessive is never counted as a contraction');
    assert.ok(st.measured.specifics > 0, 'Acme and March are specifics');
    assert.ok(st.measured.sentence_length_stdev > 0, 'varied lengths give nonzero stdev');
    // Section 9's specifics floor fires on an abstraction.
    const empty = writeFixture(statDir, 'empty.md', 'Everything is about alignment.\nIt always has been.\n');
    assert.ok(stats(empty, null).flags.some(f => f.rule === 'specifics-floor'),
      'a draft naming nothing trips the specifics floor');
    // Section 9's voice floor fires against a recorded baseline.
    writeFixture(profile, 'voice.md',
      'avg_sentence_length: 12\nsentence_length_stdev: 20\ncontraction_rate: 8\nuses_fragments: yes\n');
    assert.ok(stats(statDraft, profile).flags.some(f => f.rule === 'voice-floor' && f.metric === 'contraction_rate'),
      'zero contractions against a baseline of 8 trips the voice floor');

    // ---- locks ----
    const lockProfile = path.join(root, 'profiles', 'locks');
    writeFixture(lockProfile, 'inventory.md',
      '## Schema\n\n```\n- id: <short-kebab-slug>\n  type: story | belief | number\n' +
      '  content: one to three sentences\n  clearance: public | anonymized | do-not-publish\n```\n\n' +
      '## Items\n\n' +
      ['a', 'b', 'c', 'd'].map(id => '- id: ' + id + '\n  content: item ' + id + '\n  clearance: public\n').join('\n') +
      '\n- id: e\n  content: retired item\n  clearance: do-not-publish\n' +
      '\n- id: f\n  content: withdrawn item\n  clearance: public\n  withdrawn: 2026-02-01 retracted\n');
    const mk = (date, slug, fm) => writeFixture(lockProfile, 'runs/' + date + '-' + slug + '/brief.md', fm);
    mk('2026-01-01', 'one', 'anchor: a\nhook_id: confession\nthesis_id: t1\nstatus: shipped\n');
    mk('2026-01-02', 'two', 'anchor: b\nhook_id: confession\nthesis_id: t2\nstatus: shipped\n');
    mk('2026-01-03', 'three', 'anchor: c\nhook_id: number\nthesis_id: t1\narchetype: bar\nstatus: shipped\n');
    mk('2026-01-04', 'four', 'anchor: d\nhook_id: number\nthesis_id: t1\nstatus: drafted\n');
    const lk = locks(lockProfile);
    assert.strictEqual(lk.shipped_pieces, 3, 'the drafted brief is not shipped');
    assert.strictEqual(lk.inventory_pool, 4, 'do-not-publish and withdrawn are out of the pool');
    assert.ok(!lk.unlocked_anchors.includes('<short-kebab-slug>'),
      "the fenced schema example is documentation, not an item");
    assert.deepStrictEqual(lk.unlocked_anchors, ['d'], 'a, b and c are locked by the trailing 10');
    assert.strictEqual(lk.runway_posts, 0, 'a pool of 4 has no runway above the 10-post lock');
    assert.strictEqual(lk.rotation_healthy, false, 'one unlocked anchor cannot turn the rotation');
    assert.ok(lk.hook_locked_recent.includes('confession'), 'confession is inside the trailing 8');
    assert.strictEqual(lk.hook_counts_trailing_20.confession, 2, 'confession used twice in 20');
    assert.ok(lk.hook_at_window_limit.includes('confession'), 'twice in 20 is the limit');
    assert.ok(!lk.hook_at_window_limit.includes('number'), 'once in 20 is not');
    assert.deepStrictEqual(lk.archetype_locked, ['bar'], 'the one shipped visual piece locks its archetype');
    assert.strictEqual(lk.last_shipped, '2026-01-03-three', 'ordering is by directory date');
    // An empty profile must not throw.
    const bare = path.join(root, 'profiles', 'bare');
    fs.mkdirSync(bare, { recursive: true });
    assert.strictEqual(locks(bare).shipped_pieces, 0, 'a fresh profile reads as zero, not an error');

    return { check: 'test', pass: true, subcommands: ['overlap', 'lexical', 'stats', 'locks'] };
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ----------------------------------------------------------------------- cli

function need(p, what) {
  if (!p) die('missing ' + what);
  if (!fs.existsSync(p)) die('no such ' + what + ': ' + p);
  return p;
}

function die(msg) {
  process.stderr.write('engine.js: ' + msg + '\n');
  process.exit(1);
}

function main(argv) {
  const cmd = argv[0];
  const rest = argv.slice(1);
  const flags = { short: rest.includes('--short') };
  const args = rest.filter(a => !a.startsWith('--'));

  switch (cmd) {
    case 'overlap':
      return overlap(need(args[0], 'draft'), need(args[1], 'profile directory'));
    case 'lexical':
      return lexical(need(args[0], 'draft'), flags);
    case 'stats':
      return stats(need(args[0], 'draft'), args[1] ? need(args[1], 'profile directory') : null);
    case 'locks':
      return locks(need(args[0], 'profile directory'));
    case 'test':
      return selfTest();
    default:
      die('usage: engine.js overlap|lexical|stats|locks|test (see the header)');
  }
}

if (require.main === module) {
  process.stdout.write(JSON.stringify(main(process.argv.slice(2)), null, 2) + '\n');
}

module.exports = { overlap, lexical, stats, locks, measure, selfTest };
