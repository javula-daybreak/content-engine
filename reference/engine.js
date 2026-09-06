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
//   node reference/engine.js lexical <draft.md> [profile-dir] [--short]
//   node reference/engine.js stats   <draft.md> [profile-dir]
//   node reference/engine.js locks   <profile-dir>
//   node reference/engine.js gate    [fixtures-dir]
//   node reference/engine.js gate    --report <draft.md> [profile-dir] [--long]
//   node reference/engine.js gate    --negative <profile-dir>
//   node reference/engine.js gate    --compare <first.md> <redraft.md> [profile-dir]
//   node reference/engine.js gate    --hooks [hooks.md]
//   node reference/engine.js gate    --tells [ai-tells.md]
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
// Section 9: zero contractions is a tell. Below this many words it is not
// evidence of anything, so a two-line post does not fire it.
const CONTRACTION_FLOOR_WORDS = 40;
// Section 9 bound 3. Tuned at section 13.2 step 8 against ten real posts.
// The cap has changed job: it bounded a rewrite budget and it now bounds
// repairs, because repair is all the editing section 9 leaves. The redraft
// happens once, and above the cap the run goes back to brief.md.
const REWRITE_CAP_PER = 3;
const REWRITE_CAP_WORDS = 200;
// Section 9: "every paragraph the same number of lines". Three paragraphs is
// the fewest that shows a pattern rather than a coincidence.
const UNIFORM_PARA_MIN = 3;
// A one-line-paragraph post is a documented human habit, named in
// inspiration.md as a usable extraction, so uniformity only reads as machine
// output at two lines and above.
const UNIFORM_PARA_LINES = 2;
// Section 9's voice floor: flag at more than 25% below the value in voice.md.
// Reused by the three distribution checks below, in both directions: 25% below
// a baseline is b * VOICE_FLOOR and 25% above it is b / VOICE_FLOOR.
const VOICE_FLOOR = 0.75;

// Section 9's three Phase 2 checks, and the absolute fallbacks that apply where
// gate-calibration.md carries no baseline for the person. Each is a knob tuned
// at section 13.2 step 8, not a measured constant.
//
// ponytail: burstiness benchmarks are 0.60-1.00 for human text and 0.15-0.30
// for AI text, and this floor sits between the two bands rather than at the
// bottom of the human one. The ceiling is that a genuinely flat 0.50 draft
// walks past; the alternative fires on real short posts, and section 9's
// maintenance rule is that precision can only decay.
const BURSTINESS_FLOOR = 0.45;
// Marks per 100 words. Below two there is no clause structure left at all.
const PUNCT_DENSITY_FLOOR = 2.0;
// Nominalisations per 100 words, and this one is a ceiling rather than a floor.
const NOMINALISATION_CEILING = 5.0;
// All three are distributions, and three sentences is not one. Below these the
// coefficient of variation is noise and firing on noise is the false positive
// section 9 says costs a rewrite of good writing on every future draft forever.
const DIST_MIN_WORDS = 100;
const DIST_MIN_SENTENCES = 5;
// profiles/<handle>/gate-calibration.md. Written by setup and by
// /content-engine review, read here, never written here.
const CALIBRATION_FILE = 'gate-calibration.md';
// Section 13.1: the diff corpus is the last 20 shipped pieces.
const PRIOR_LIMIT = 20;
// Section 13.2 step 4: gate-fixtures/ holds 20 known-AI posts.
const FIXTURE_COUNT = 20;

// Section 9's tells, one row each: the half that owns it, the tag the gate
// report prints, and the action it carries. `reference/ai-tells.md` carries the
// prose, and `gate --tells` is what keeps the two in step.
//
// owner 'engine' means a literal or a count, and section 9's "zero tolerance"
// is a promise this file keeps for it. 'model' means a judgment, and the tag is
// null because nothing here can produce it. 'both' means the forms section 9
// names by name are caught here and the open category is not, which is the
// honest reading of section 9's split rather than a softening of it.
//
// action is section 9's "detect, then repair or redraft", decided 2026-08-19.
// Which class a tell carries is spec, not a call made at run time:
//
//   'rewrite'  section 9's *repair*. One token swapped for its documented
//              substitute, bounded by the protected spans in bound 4 and capped
//              by bound 3. Cannot restructure a sentence by construction.
//   'redraft'  anything that would restructure prose. Back to brief.md, once,
//              with the tripped ids as drafting constraints. No span patching,
//              ever.
//   'reject'   clearance and private terms. Rewriting a disclosure only
//              produces a better-written disclosure.
//   'flag'     the absolute half of section 9's voice floor. Information for
//              the human, no word changed, and it does not fail the gate. Both
//              halves retire the moment voice.md carries measurements.
//
// Why the line falls there. Berkeley's *Voice Under Revision* (arXiv:2604.22142)
// measured drift at the sentence and structure level across 300 narratives and
// three frontier models, and the load-bearing finding is the qualifier on all of
// it: voice-preserving prompts reduce the magnitude of the changes and do not
// eliminate their direction. Swapping one word for its documented substitute
// restructures nothing. Rewriting "it's not X, it's Y" restructures the
// sentence, which is the level the drift was measured at.
//
// The repair class is spelled 'rewrite' and not 'repair' on purpose. It is the
// string gate-report.md already prints, the string section 13.2 step 4's
// negative control bar is written in ("zero rewrites on the person's own
// samples"), and the string gate-calibration.md rule 4 names as the only
// suppressible class. Renaming it is section 8's hook_id failure exactly: every
// prior reference still resolves, just not to its own rule.
//
// em-dash and semicolon are repairs, and neither appears in section 9's
// enumerated repair list, because that list was written expecting both to be
// retired globally. They are not retired: they are suppressible per profile, in
// profiles/<handle>/gate-calibration.md. Their class is settled by bound 2,
// which names the em dash as its own worked example of a substitution and
// forbids the sentence split that would make it a restructure.
const TELLS = [
  { id: 'antithesis', owner: 'both', tag: 'antithesis', action: 'redraft' },
  { id: 'unearned-rule-of-three', owner: 'model', tag: null, action: 'redraft' },
  { id: 'parallel-bullets', owner: 'model', tag: null, action: 'redraft' },
  { id: 'rhetorical-fragment', owner: 'engine', tag: 'rhetorical-fragment', action: 'redraft' },
  { id: 'restating-close', owner: 'model', tag: null, action: 'redraft' },
  { id: 'engagement-bait-close', owner: 'engine', tag: 'engagement-bait-close', action: 'redraft' },
  { id: 'thinking-opener', owner: 'engine', tag: 'thinking-opener', action: 'redraft' },
  { id: 'uniform-paragraphs', owner: 'engine', tag: 'uniform-paragraphs', action: 'redraft' },
  { id: 'em-dash', owner: 'engine', tag: 'em-dash', action: 'rewrite' },
  { id: 'en-dash', owner: 'engine', tag: 'en-dash', action: 'rewrite' },
  { id: 'semicolon', owner: 'engine', tag: 'semicolon', action: 'rewrite' },
  { id: 'banned-lexicon', owner: 'engine', tag: 'banned', action: 'rewrite' },
  { id: 'not-only-but-also', owner: 'engine', tag: 'not-only-but-also', action: 'redraft' },
  { id: 'hedged-opener', owner: 'both', tag: 'hedged-opener', action: 'redraft' },
  { id: 'announcement-phrase', owner: 'engine', tag: 'announcement', action: 'redraft' },
  { id: 'at-company-we-believe', owner: 'engine', tag: 'at-company-we-believe', action: 'redraft' },
  { id: 'we-with-no-human', owner: 'engine', tag: 'we-with-no-human', action: 'redraft' },
  { id: 'announcement-shape', owner: 'model', tag: null, action: 'redraft' },
  { id: 'testimonial-quote', owner: 'model', tag: null, action: 'redraft' },
  { id: 'no-fragments', owner: 'engine', tag: 'no-fragments', action: 'flag' },
  { id: 'no-long-sentence', owner: 'engine', tag: 'no-long-sentence', action: 'flag' },
  { id: 'zero-contractions', owner: 'engine', tag: 'zero-contractions', action: 'redraft' },
  { id: 'all-contractions', owner: 'model', tag: null, action: 'redraft' },
  { id: 'emoji-bullets', owner: 'engine', tag: 'emoji-bullets', action: 'rewrite' },
  { id: 'hashtag-stack', owner: 'engine', tag: 'hashtag-stack', action: 'rewrite' },
  { id: 'title-case-header', owner: 'engine', tag: 'title-case-header', action: 'rewrite' },
  { id: 'specifics-floor', owner: 'engine', tag: 'specifics-floor', action: 'redraft' },
  { id: 'voice-floor', owner: 'engine', tag: 'voice-floor', action: 'redraft' },
  // Section 9's three Phase 2 checks. Counts, not judgments, and all three are
  // redraft-class: a distribution is a property of the whole draft and there is
  // no span to patch. Punctuation density shipped last, and the thing that
  // unblocked it was not a retirement. See statsText.
  { id: 'burstiness', owner: 'engine', tag: 'burstiness', action: 'redraft' },
  { id: 'punctuation-density', owner: 'engine', tag: 'punctuation-density', action: 'redraft' },
  { id: 'nominalisation-rate', owner: 'engine', tag: 'nominalisation-rate', action: 'redraft' },
  { id: 'clearance', owner: 'model', tag: null, action: 'reject' },
  { id: 'private-terms', owner: 'engine', tag: 'private-terms', action: 'reject' },
  // 2026-09-06: no-ai-slop incorporation. The globally-installed skill of that
  // name is a general-purpose human-editor pass, and this repo already had a
  // stricter, per-profile-calibrated version of most of it. These six rows are
  // the patterns it named that had no home here yet. Literal forms went into
  // BANNED and PHRASED under existing or new tags, same as every tell above;
  // the remaining five are judgment calls with no reliable literal form, which
  // is exactly what owner: model already means in this table.
  { id: 'puffery-attribution', owner: 'engine', tag: 'puffery-attribution', action: 'redraft' },
  { id: 'synonym-cycling', owner: 'model', tag: null, action: 'redraft' },
  { id: 'superficial-analysis', owner: 'model', tag: null, action: 'redraft' },
  { id: 'colon-reveal', owner: 'model', tag: null, action: 'redraft' },
  { id: 'formatting-slop', owner: 'model', tag: null, action: 'redraft' },
  { id: 'dramatic-fragmentation', owner: 'model', tag: null, action: 'redraft' },
];

const tellById = new Map(TELLS.map(x => [x.id, x]));
// One tag per tell and one tell per tag, which is what lets a hit carry its id
// back. Pinned by assert, because a duplicated tag would silently route a
// suppression or an action to the wrong rule.
const tellByTag = new Map(TELLS.filter(x => x.tag).map(x => [x.tag, x]));

// The table owns the class. Every emitting site reads it here instead of
// repeating the literal, so `gate --tells`'s promise holds for the actions and
// not only for the ids: a row changed in one place cannot disagree with itself.
const actionOf = id => (tellById.get(id) || {}).action || 'flag';

// gate-calibration.md rule 4: only a rewrite-class rule is suppressible. A
// reject never is, and a redraft or a flag edits no word the person wrote, so
// there is nothing to suppress. Enforced twice on purpose. parseCalibration
// refuses a file that names anything else, and every consult site asks this
// function rather than the list, so no caller can honour a suppression the
// parser would have refused. The material `reject` guards is the kind section 9
// says a tired human approves at 8am, and a file inside the profile is not a
// consent form for disclosing it.
function suppressible(id) {
  const t = tellById.get(id);
  return !!t && t.action === 'rewrite';
}

function isSuppressed(cal, id) {
  return !!cal && !!id && cal.suppressed.indexOf(id) !== -1 && suppressible(id);
}

// Section 9's lexical list, verbatim. Single words match on a word boundary
// and allow suffixes, so "leveraged" and "unpacking" both fire. Phrases match
// literally.
const BANNED = [
  'delve', 'unpack', 'dive in', 'leverage', 'robust', 'seamless', 'landscape',
  'realm', 'testament', 'tapestry', 'navigate the complexities',
  'at the end of the day', 'game-changer', 'no-brainer', 'double down',
  'moving the needle', "in today's fast-paced world", 'the reality is',
  'let that sink in',
  // 2026-09-06: no-ai-slop's banned-outright list, minus the terms already
  // above. Same treatment: single words match with suffixes, phrases match
  // literally.
  'foster', 'utilize', 'facilitate', 'empower', 'streamline', 'cutting-edge',
  'paradigm shift', 'beacon', 'multifaceted', 'meticulous', 'intricate',
  'paramount', 'transformative', 'elevate', 'embark', 'supercharge', 'harness',
  'ever-evolving',
  // Carries no propositional content, so deleted rather than substituted,
  // same reasoning as "let that sink in" above.
  'this is huge', 'this changes everything',
  // no-ai-slop's remaining often-empty phrases, not already covered by a
  // hedged-opener or announcement entry. Deleted, not substituted: each is
  // pure throat-clearing around a claim that stands fine on its own.
  'when it comes to', 'at its core', "in the age of", 'in the world of',
  'in terms of', 'with regard to', 'in order to', 'going forward',
];

// Section 9's announcement register. Literal strings only. The announcement
// *shape* is a judgment and stays with the model, per section 9's split of
// which half is deterministic.
const ANNOUNCEMENT = [
  "we're excited to share", "we're thrilled to", "we're proud to",
  'join us', 'stay tuned', 'more in the comments',
];

// Section 9's remaining literal phrases. Separate from BANNED because each
// carries its own tag: gate-report.md is read per tell, and "banned" printed
// against a hedged opener says nothing about what to change.
//
// Position is not checked. Section 9 writes two of these as "opening with" and
// "ending on", but the phrase is the tell wherever it sits, and a position test
// only adds a way to miss one.
const PHRASED = [
  { term: "i've been thinking a lot about", tag: 'thinking-opener' },
  { term: 'in many ways,', tag: 'hedged-opener' },
  { term: "it's worth noting that", tag: 'hedged-opener' },
  { term: 'thoughts?', tag: 'engagement-bait-close' },
  { term: "what's your take?", tag: 'engagement-bait-close' },
  { term: 'the result?', tag: 'rhetorical-fragment' },
  { term: 'the kicker?', tag: 'rhetorical-fragment' },
  { term: "here's the thing", tag: 'rhetorical-fragment' },
  // 2026-09-06: no-ai-slop's rhetorical and faux-insight setups. Same remedy
  // as the three above, drop the drum roll and state the claim, so they join
  // the same tag rather than mint a new one.
  { term: 'what if i told you', tag: 'rhetorical-fragment' },
  { term: 'plot twist:', tag: 'rhetorical-fragment' },
  { term: 'think about it:', tag: 'rhetorical-fragment' },
  { term: "here's what nobody tells you", tag: 'rhetorical-fragment' },
  { term: 'what most people get wrong', tag: 'rhetorical-fragment' },
  { term: 'the part everyone misses', tag: 'rhetorical-fragment' },
  // 2026-09-06: no-ai-slop's importance puffery and weasel attribution. New
  // tag: the remedy is "state the fact plainly" or "name the source", neither
  // of which matches an existing tag's fix.
  { term: 'marks a pivotal moment', tag: 'puffery-attribution' },
  { term: 'plays a vital role', tag: 'puffery-attribution' },
  { term: 'solidifies its position', tag: 'puffery-attribution' },
  { term: 'underscores its significance', tag: 'puffery-attribution' },
  { term: 'experts agree', tag: 'puffery-attribution' },
  { term: 'industry reports suggest', tag: 'puffery-attribution' },
  { term: 'widely regarded as', tag: 'puffery-attribution' },
  { term: 'studies show', tag: 'puffery-attribution' },
];

// A spec/brief `key:` or `key: value` line -- render/*/render.py's own
// required field syntax (`items:`, `title: One Hex Code`, ...). Structural,
// not prose: a bare list-opener key reads as a rhetorical fragment and a
// Title Case field value reads as a title-case header below, so every valid
// visual spec failed both checks unconditionally, on every archetype (T1-2).
const SPEC_KEY_LINE = /^[a-z][a-z0-9_]*:(\s|$)/;

const PATTERNS = [
  // "but also" is not how the second half actually lands. A model writes "but
  // we also" and "but they also" more often than the adjacent form section 9
  // quotes, and an adjacent-only match catches the version nobody writes. The
  // "not only" anchor is what carries the precision here.
  { tag: 'not-only-but-also', re: /\bnot only\b[\s\S]{0,80}?\bbut\b[\w\s]{0,14}?\balso\b/gi },
  // Case-insensitive on "at", capital still required on the company. This tell
  // opens a sentence nearly every time it appears, so a lowercase-only match
  // missed the only position it occurs in. The capital after it is what
  // separates a company from a preposition.
  { tag: 'at-company-we-believe', re: /\b[Aa]t [A-Z][\w.&' ]{1,30}, we believe\b/g },

  // Section 9's antithesis, in the two forms it names. The open form stays with
  // the model per section 9's split, and section 13.2's CI check over hooks.md
  // names this tell by name, so the named forms have to be a regex rather than
  // an intention.
  //
  // Both require the second clause to open on a determiner. "I'm not sure, it's
  // complicated" is a sentence a person writes and this tell is not in it;
  // section 9's own maintenance rule is that precision can only decay, so a
  // miss the model can still catch costs less than a rewrite of good writing on
  // every future draft forever.
  // "not" is its own word and "n't" is glued to the verb, so there is no one
  // word boundary that reaches both. Spelling out the two forms is the whole
  // fix; a leading \b silently matches only the first, which is the half a
  // model writes least often.
  { tag: 'antithesis',
    re: /(?:\bnot|n['\u2019]t)\s+(?:just\s+|only\s+|really\s+)?[^,.!?\n]{2,70},\s*(?:it|this|that|they)\s?(?:['\u2019]s|s|\s?is|\s?are)\s+(?:a|an|the|about|that|how|why|what)\b/gi },
  { tag: 'antithesis',
    re: /\b(?:is|are|was|were)n(?:['\u2019])t\s+the\s+(?:problem|issue|point|hard part)\.\s+[A-Z][^.!?\n]{1,60}\s(?:is|are)\./g },
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
// or "<short-kebab-slug>" ships as a real anchor.
//
// This strips for every caller with no exception, voice.md included: its
// Samples fence holds the same placeholder schema, and keeping it would hand
// section 13.2 step 4's negative control a corpus of "<verbatim>". The one
// reader that keeps fences is voiceMeasures, which reaches past this function
// and never calls it, because section 6's four frozen measurements are typed
// inside a fence and stripping it would erase the baseline the voice floor
// measures against. Both halves are pinned by assert, in both directions.
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

// Indented key/value blocks led by "- <leadKey>:", under any heading. Two
// schemas in this repo have that shape: inventory.md's items, led by `id`, and
// gate-calibration.md's suppressions, led by `rule`. One parser reads both.
// Fences are stripped for the same reason everywhere else: every one of these
// files documents its own schema in a fence, and that example is a
// syntactically perfect item.
function blockItems(text, leadKey) {
  const items = [];
  const head = new RegExp('^\\s*-\\s+' + leadKey + ':');
  const blocks = stripFences(text).split(new RegExp('\\n(?=\\s*-\\s+' + leadKey + ':)'));
  for (const block of blocks) {
    if (!head.test(block)) continue;
    const item = {};
    let key = null;
    for (const raw of block.split(/\r?\n/)) {
      if (/^\s*```/.test(raw)) break;
      const m = raw.match(/^\s*(?:-\s+)?([A-Za-z_][\w-]*):\s*(.*)$/);
      if (m) { key = m[1]; item[key] = stripValue(m[2]); continue; }
      // The continuation line must be INDENTED, which is the same guard
      // frontMatter uses. Without it any non-empty line that is not a key:
      // match gets glued onto the previous field, so the `## baselines`
      // heading that follows the last suppression in gate-calibration.md
      // landed inside its `sample:` value, and an inventory item followed by
      // prose absorbed the prose. Fixed 2026-08-24.
      if (key && /^\s+\S/.test(raw) && typeof item[key] === 'string') {
        item[key] = (item[key] + ' ' + raw.trim()).trim();
      }
    }
    if (item[leadKey]) items.push(item);
  }
  return items;
}

function inventoryItems(text) {
  return blockItems(text, 'id');
}

// "text: |" blocks under a "- <leadKey>:" line. shipped-history.md and
// voice.md's Samples section are the same shape on purpose: both hold verbatim
// human text, and section 13.2 step 4's negative control reads both.
function pastedBlocks(text, leadKey) {
  const out = [];
  const head = new RegExp('^\\s*-\\s+' + leadKey + ':');
  const blocks = stripFences(text).split(new RegExp('\\n(?=\\s*-\\s+' + leadKey + ':)'));
  for (const block of blocks) {
    if (!head.test(block)) continue;
    const label = (block.match(new RegExp(leadKey + ':\\s*(.*)')) || [, ''])[1].trim();
    const m = block.match(/\n\s*text:\s*\|\s*\r?\n([\s\S]*?)(?=\n\s*\w+:\s|\n\s*```|$)/);
    if (!m) continue;
    const kind = (block.match(/\n\s*kind:\s*(.*)/) || [, ''])[1].trim();
    const body = m[1].split(/\r?\n/).map(l => l.replace(/^\s{0,6}/, '')).join('\n').trim();
    if (body) out.push({ label, kind, text: body });
  }
  return out;
}

// shipped-history.md entries, named by posted_at.
function shippedHistory(text) {
  return pastedBlocks(text, 'posted_at')
    .map(b => ({ posted_at: b.label, text: b.text }));
}

// voice.md's pasted samples. Section 9's precedence rests on this file, and
// section 13.2 step 4 measures the gate's false-positive rate against exactly
// these, so an unparseable Samples section retires the whole negative control.
function voiceSamples(text) {
  return pastedBlocks(text, 'source').filter(b => b.label === 'pasted');
}

// voice.md's four frozen measurements. Section 6, frozen at setup.
//
// First *parseable* value wins, not first match. The template ships these keys
// with empty values inside a labelled fence, so a first-match read returns null
// for any profile whose numbers were appended below that fence rather than
// typed into it. Section 9's voice floor then never fires and the JSON reports
// "no samples", which is a false statement about a check the gate counts on.
function voiceMeasures(text) {
  const pick = (key, ok) => {
    const re = new RegExp('^[ \\t]*' + key + ':[ \\t]*(.*)$', 'gm');
    let m;
    while ((m = re.exec(text)) !== null) {
      const v = m[1].trim();
      if (ok(v)) return v;
    }
    return null;
  };
  const out = {};
  for (const key of ['avg_sentence_length', 'sentence_length_stdev', 'contraction_rate']) {
    const v = pick(key, s => s !== '' && !isNaN(parseFloat(s)));
    out[key] = v === null ? null : parseFloat(v);
  }
  out.uses_fragments = pick('uses_fragments', s => /^(yes|no)$/.test(s));
  return out;
}

// profiles/<handle>/gate-calibration.md, the per-profile layer over a
// person-independent rule set.
//
// `reference/ai-tells.md` ships identical to everyone with every rule on. It is
// never edited for a person: striking a rule there because it over-fires on one
// corpus hardcodes one person's punctuation habits into every future install of
// a portable engine. Rules are suppressed per profile, in the profile, with the
// evidence that did it, and this is the read path for that file. Setup and
// /content-engine review write it. Nothing here writes it.
//
// The five rules, and where each one lives:
//   1. Evidence only: a `fired:` count over 0 on the person's own corpus, and
//      the sample that did it. Enforced below. `gate --negative` produces it.
//   2. Absent file, or absent key, means nothing is suppressed and every rule
//      fires. Enforced by returning an empty list rather than throwing, and a
//      missing calibration is reported by name so it cannot read as a clean
//      pass.
//   3. A suppressed rule is reported, never silent: `gate --report` names it and
//      `gate` recall states it, because recall measured over a suppressed rule
//      is a number the engine did not earn.
//   4. Rewrite-class only. `suppressible` above, and a throw here.
//   5. The tell table and ai-tells.md stay in lockstep, because neither of them
//      changes per person. `gate --tells` is unaffected by this file.
//
// Fences are stripped before anything is read, and that is load bearing rather
// than tidy: `profiles/_template/gate-calibration.md` carries its whole schema
// inside a fence, so the shipped template cannot be read as a real suppression.
// This is the same trap voice.md's Samples section documents, in the other
// direction: there a filled-in fence yields an empty corpus, here it yields an
// empty suppression list, and in both cases the safe answer is the one a
// mistake lands on.
function parseCalibration(text) {
  const body = stripFences(text);
  const meta = frontMatter(body);
  const evidence = [];
  for (const row of blockItems(body, 'rule')) {
    const id = String(row.rule);
    const tell = tellById.get(id);
    if (!tell) {
      throw new Error(CALIBRATION_FILE + ': "' + id + '" is not a tell in ' +
        'engine.js\'s table. A suppression naming nothing suppresses nothing, ' +
        'and reading it as a clean pass is rule 2\'s whole failure mode.');
    }
    if (!suppressible(id)) {
      throw new Error(CALIBRATION_FILE + ': "' + id + '" is ' + tell.action +
        '-class and is never suppressible. Rule 4. Only a repair edits a word ' +
        'the person wrote, so only a repair can be wrong about them; a reject ' +
        'guards a disclosure and a redraft edits nothing.');
    }
    const fired = parseFloat(row.fired);
    if (!(fired > 0) || !row.sample) {
      throw new Error(CALIBRATION_FILE + ': "' + id + '" is suppressed with no ' +
        'evidence. Rule 1 wants a fired: count over 0 and the sample: that did ' +
        'it, from gate --negative. A hand-edited suppression is a rule switched ' +
        'off because it was inconvenient rather than because it was wrong.');
    }
    evidence.push({ rule: id, fired, sample: String(row.sample), note: row.note || null });
  }
  // The baselines block. frontMatter in its bare mode reads a run of key: value
  // lines and stops at the blank line before the next heading, which is exactly
  // this section's shape, so there is no third parser here either.
  const tail = body.split(/^##[ \t]+baselines[ \t]*$/mi)[1] || '';
  const baselines = {};
  for (const [k, v] of Object.entries(frontMatter(tail))) {
    const n = parseFloat(v);
    if (!isNaN(n)) baselines[k] = n;
  }
  return {
    suppressed: evidence.map(e => e.rule),
    evidence,
    baselines,
    measured_at: meta.measured_at || null,
    samples: meta.samples ? parseFloat(meta.samples) : null,
  };
}

function readCalibration(profile) {
  const empty = { suppressed: [], evidence: [], baselines: {}, measured_at: null, samples: null };
  if (!profile) {
    return { file: 'no profile directory was passed', ...empty,
      note: 'no calibration was read, so every rule fires. This is not a clean pass.' };
  }
  const p = path.join(profile, CALIBRATION_FILE);
  if (!fs.existsSync(p)) {
    return { file: 'absent', ...empty,
      note: 'rule 2: an absent gate-calibration.md means every rule fires. It is not a clean pass, and it is not a suppression of anything.' };
  }
  return { file: 'found', ...parseCalibration(readFile(p)) };
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

// Takes text rather than a path, because `gate` scans a fixture corpus and a
// profile's pasted samples, and neither has a run directory to hold brief.md.
//
// opts.calibration is the profile's gate-calibration.md, or absent. Absent
// suppresses nothing, per rule 2: every caller that does not pass one gets the
// whole rule set, which is the answer a mistake has to land on.
function lexicalText(draft, opts, privateTerms, briefFound) {
  const cal = opts.calibration || null;
  const quotes = quotedRanges(draft);
  const hits = [];

  for (const term of BANNED) hits.push(...scan(draft, term, 'banned'));
  for (const term of ANNOUNCEMENT) hits.push(...scan(draft, term, 'announcement'));
  for (const ph of PHRASED) hits.push(...scan(draft, ph.term, ph.tag));
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
    if (t && t.length < 60 && w.length >= 3 && !/[.!?:,]$/.test(t) && !/^#/.test(t) &&
        !SPEC_KEY_LINE.test(t)) {
      const caps = w.filter(x => /^[A-Z][a-z]/.test(x)).length;
      if (caps >= Math.ceil(w.length * 0.7)) {
        hits.push({ tag: 'title-case-header', term: t, at: offset, match: t });
      }
    }

    // Section 9: emoji used as bullet points. Matched by Unicode property so
    // this file stays free of literal emoji, the same reason the dashes above
    // are escapes.
    if (/^\s*[-*]?\s*\p{Extended_Pictographic}/u.test(line) && w.length > 1) {
      hits.push({ tag: 'emoji-bullets', term: 'emoji bullet', at: offset, match: t.slice(0, 40) });
    }

    // Section 9: the one-word or two-word rhetorical paragraph. PHRASED above
    // holds the three section 9 names; this is the shape.
    //
    // ponytail: a numeral anywhere on the line disqualifies it, so a date used
    // as a section marker ("March 2026:") is not read as rhetoric. The ceiling
    // is a two-word rhetorical line containing a number, which the model still
    // owns.
    if (t && w.length <= 2 && /[?:]$/.test(t) && /[A-Za-z]/.test(t) &&
        !/\d/.test(t) && !/^#/.test(t) && !/^[-*>]/.test(t) && !SPEC_KEY_LINE.test(t)) {
      const isPhrased = PHRASED.some(ph => t.toLowerCase().startsWith(ph.term.slice(0, 12)));
      if (!isPhrased) {
        hits.push({ tag: 'rhetorical-fragment', term: t, at: offset, match: t });
      }
    }
    offset += line.length + 1;
  }

  const hashtags = draft.match(/(^|\s)#[A-Za-z][\w]*/g) || [];

  const privateHits = [];
  const lower = draft.toLowerCase();
  for (const term of privateTerms) {
    let i = -1;
    while ((i = lower.indexOf(String(term).toLowerCase(), i + 1)) !== -1) {
      privateHits.push({ term, at: i });
      break;
    }
  }

  // Every hit carries its tell id and its class from the table. Section 9's
  // split is the whole point of the inversion: a repair swaps a token and a
  // redraft goes back to brief.md, and a hit that cannot say which one it is
  // gets whichever the caller assumes.
  for (const h of hits) {
    h.protected = inQuote(quotes, h.at);
    const tell = tellByTag.get(h.tag);
    h.tell = tell ? tell.id : null;
    h.action = tell ? tell.action : 'rewrite';
  }
  hits.sort((a, b) => a.at - b.at);

  // gate-calibration.md. A suppressed rule does not fire, and it is reported
  // rather than dropped, per rule 3: a rule that vanishes from the output is
  // indistinguishable from a rule that passed.
  const suppressed = hits.filter(h => isSuppressed(cal, h.tell));
  const live = hits.filter(h => !isSuppressed(cal, h.tell));
  const scanned = live.filter(h => !h.protected);
  const rewritable = scanned.filter(h => h.action === 'rewrite');
  const redraftable = scanned.filter(h => h.action === 'redraft');
  const protectedHits = live.filter(h => h.protected);

  // A hashtag stack is one repair. Section 9 bound 2's "substitute, never
  // subtract" is scoped to the substitutions, so deleting the stack is the fix
  // rather than a defect in the fix. Counting it here is what lets bound 3's
  // cap see it, and what stops `action` reporting 'none' on a draft this same
  // object has already marked failed.
  const stack = hashtags.length >= HASHTAG_STACK && !isSuppressed(cal, 'hashtag-stack');

  return {
    check: 'lexical',
    pass: rewritable.length === 0 && redraftable.length === 0 && !stack &&
      privateHits.length === 0,
    format: opts.short ? 'short' : 'any',
    // Precedence, highest first, the same order gate --report prints.
    action: privateHits.length ? 'reject'
      : (redraftable.length ? 'redraft' : ((rewritable.length || stack) ? 'rewrite' : 'none')),
    // The cap's operand. Repairs only: a redraft is not budgeted, it happens
    // once, so counting one here would spend a repair allowance on it.
    rewrite_count: rewritable.length + (stack ? 1 : 0),
    redraft_count: redraftable.length,
    // Ids rather than tags, because the redraft injects them as drafting
    // constraints and ai-tells.md is read per id.
    redraft_tells: [...new Set(redraftable.map(h => h.tell))].sort(),
    hits: scanned,
    not_rewritten_quoted_or_factual: protectedHits,
    suppressed_by_calibration: suppressed.map(h => ({ tell: h.tell, at: h.at, match: h.match })),
    hashtags: { count: hashtags.length, stack },
    private_terms: {
      // "checked: 0" reads as "nothing to guard". Say which one it was.
      brief: briefFound ? 'found' : 'missing',
      checked: privateTerms.length,
      violations: privateHits,
      note: 'a private_terms hit is a rejection, never a repair, and it is never suppressible. Section 9, and gate-calibration.md rule 4.',
    },
  };
}

// Section 9: a draft containing any literal string in brief.md's private_terms
// is rejected and redrafted, not rewritten. brief.md sits beside draft.md in
// the run directory.
function lexical(draftPath, opts) {
  const briefPath = path.join(path.dirname(draftPath), 'brief.md');
  const briefFound = fs.existsSync(briefPath);
  const brief = frontMatter(readIfPresent(briefPath));
  // A bare `private_terms: Northwind, 41%` is the drift a model actually
  // writes, and reading it as absent leaves this guarding nothing on exactly
  // the material section 9 says a tired human approves at 8am.
  const rawTerms = brief.private_terms;
  const privateTerms = Array.isArray(rawTerms)
    ? rawTerms
    : (rawTerms
        ? String(rawTerms).replace(/^\[|\]$/g, '').split(',').map(s => s.trim()).filter(Boolean)
        : []);
  return lexicalText(readFile(draftPath), opts, privateTerms, briefFound);
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
//
// Counted over the split sentences rather than the raw text, so a numbered
// list does not clear the floor on its own numbering. That draft is the exact
// abstraction section 9 says cannot be patched into an instance.
function capitalizedMid(text) {
  let n = 0;
  for (const s of sentences(text)) {
    const w = s.split(/\s+/).filter(Boolean);
    for (let i = 1; i < w.length; i++) {
      const t = w[i].replace(/^[^A-Za-z]+/, '').replace(/[^A-Za-z]+$/, '');
      if (t.length > 1 && /^[A-Z][a-z]/.test(t)) n++;
    }
  }
  return n;
}

function countSpecifics(text) {
  const joined = sentences(text).join(' ');
  const numerals = (joined.match(/\$\d[\d,.]*|\b\d[\d,.]*%?\b/g) || []).length;
  return numerals + capitalizedMid(text);
}

// Paragraphs are blank-line separated, and the count is lines each holds.
// Section 9's tell is that every one holds the same number.
function paragraphLines(text) {
  return text.split(/\r?\n\s*\r?\n/)
    .map(b => b.split(/\r?\n/).filter(l => l.trim()).length)
    .filter(n => n > 0);
}

// Section 9's punctuation density counts exactly the four marks it names:
// commas, semicolons, parentheses and dashes. Not colons, not question marks.
// A hyphen counts only when it is standing in for a dash, which is a hyphen
// with a space on both sides; inside a compound it is spelling, not clause
// structure.
function punctuationMarks(text) {
  const re = new RegExp('[,;()]|' + EM_DASH + '|' + EN_DASH + '|(?<= )-(?= )', 'g');
  return (text.match(re) || []).length;
}

// ponytail: a word of six letters or more ending in one of section 9's six
// suffixes. Six is what keeps "city" and "unity" out of the count. The ceiling
// is that "moment" and "entity" are in it, which is a rate error rather than a
// census error, and section 9 only ever asks whether the rate is inflated.
const NOMINAL_SUFFIX = /(?:tion|ment|ness|ity|ance|ence)s?$/;
function nominalisations(tokens) {
  return tokens.filter(t => t.length >= 6 && NOMINAL_SUFFIX.test(t)).length;
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
    // Section 9's three Phase 2 counts. Burstiness is the coefficient of
    // variation of sentence length, which is stdev over mean and therefore one
    // division on numbers this function already had.
    burstiness: lengths.length > 1 && total
      ? round(stdev(lengths) / (total / lengths.length), 3) : 0,
    punctuation_density: total ? round((punctuationMarks(text) / total) * 100, 2) : 0,
    nominalisation_rate: total ? round((nominalisations(tokens) / total) * 100, 2) : 0,
    specifics: countSpecifics(text),
    proper_nouns: capitalizedMid(text),
    first_person_plural: (text.match(/\b(?:we|us|our|ours|we['\u2019]re|we['\u2019]ve)\b/gi) || []).length,
    paragraph_lines: paragraphLines(text),
    shortest_sentence: lengths.length ? Math.min(...lengths) : 0,
    longest_sentence: lengths.length ? Math.max(...lengths) : 0,
  };
}

// Takes text and an already-read baseline, for the same reason lexicalText
// does: `gate` measures a corpus, not a run directory. `cal` is the profile's
// gate-calibration.md, or absent, and absent suppresses nothing.
//
// Every action here is read out of the tell table rather than written in as a
// literal, so section 9's classes live in exactly one place. Nothing in this
// function is repair-class, and that is not an omission: an absence, a
// distribution and a distance from a baseline are all properties of the whole
// draft, and there is no span to swap a token in. That is the whole reason
// section 9 lists all of them under redraft.
function statsText(text, baseline, cal) {
  const m = measure(text);
  const flags = [];

  // Section 9's specifics floor. A draft naming nothing is redrafted, not
  // rewritten: an abstraction cannot be patched into an instance.
  if (m.specifics === 0) {
    flags.push({ rule: 'specifics-floor', action: actionOf('specifics-floor'), detail: 'no named people, companies, dates, or numerals' });
  }

  // Section 9: every paragraph the same number of lines.
  const pl = m.paragraph_lines;
  if (pl.length >= UNIFORM_PARA_MIN && pl[0] >= UNIFORM_PARA_LINES &&
      pl.every(n => n === pl[0])) {
    flags.push({
      rule: 'uniform-paragraphs', action: actionOf('uniform-paragraphs'),
      detail: pl.length + ' paragraphs of ' + pl[0] + ' lines each',
    });
  }

  // Section 9: first-person plural with no named human anywhere in the post.
  //
  // ponytail: "no named human" is approximated by no capitalized word in any
  // non-sentence-initial position, which is the same rule the specifics floor
  // uses. It under-fires, because a post naming Acme and no person passes here.
  // A capitalized word is not evidence of a person and section 9 hands the
  // announcement shape to the model anyway, so this is the floor and the model
  // reads the rest.
  if (m.first_person_plural > 0 && m.proper_nouns === 0) {
    flags.push({
      rule: 'we-with-no-human', action: actionOf('we-with-no-human'),
      detail: m.first_person_plural + ' first-person-plural uses and nobody named',
    });
  }

  // Section 9's voice floor.
  if (baseline) {
    for (const key of ['sentence_length_stdev', 'contraction_rate']) {
      const b = baseline[key];
      if (b === null || b === 0) continue;
      if (m[key] < b * VOICE_FLOOR) {
        flags.push({
          rule: 'voice-floor', action: actionOf('voice-floor'), metric: key,
          draft: m[key], baseline: b, floor: round(b * VOICE_FLOOR, 2),
        });
      }
    }
  }
  // Section 9: zero contractions is a tell on its own, not only as a distance
  // below a baseline. voice.md wins: a person whose measured rate is 0 writes
  // that way, and the gate records the override rather than rewriting them
  // into contractions they never use.
  if (m.contraction_rate === 0 && m.words >= CONTRACTION_FLOOR_WORDS &&
      !(baseline && baseline.contraction_rate === 0)) {
    flags.push({
      rule: 'zero-contractions', action: actionOf('zero-contractions'),
      detail: 'no contraction in ' + m.words + ' words',
      override_available: baseline ? 'voice.md records ' + baseline.contraction_rate : 'no baseline on file',
    });
  }

  const haveBaseline = baseline && (baseline.sentence_length_stdev !== null || baseline.contraction_rate !== null);
  if (!haveBaseline) {
    // Section 9's fallback where no samples exist.
    if (m.sentences && m.shortest_sentence >= 6) {
      flags.push({ rule: 'no-fragments', action: actionOf('no-fragments'), detail: 'no sentence under 6 words' });
    }
    if (m.sentences && m.longest_sentence <= 25) {
      flags.push({ rule: 'no-long-sentence', action: actionOf('no-long-sentence'), detail: 'no sentence over 25 words' });
    }
  }

  // Section 9's three Phase 2 checks, floored against gate-calibration.md's
  // baseline for this person with an absolute fallback where no baseline
  // exists, which is the pattern the voice floor above already implements.
  //
  // "Floored" in section 9 means measured against this person rather than
  // against a constant, and the *direction* is per metric because the drift is
  // per metric: burstiness and punctuation density flatten downward and
  // nominalisation inflates upward. A floor on nominalisation would be a check
  // that cannot fire on the text it was written to catch.
  //
  // Punctuation density was blocked, and what unblocked it was not a
  // retirement. A density floor cannot bind while two of its four inputs are
  // banned at zero tolerance *globally*, which is what the old plan assumed and
  // is why this check was scheduled after a global strike of the em dash and the
  // semicolon. Under gate-calibration.md nothing is struck globally: the floor
  // is measured against the person's own baseline, and if the em dash or the
  // semicolon is suppressed for them then the mark is theirs to use and the
  // density it produces is theirs to be measured against. The contradiction was
  // never in the two rules. It was in retiring them for everybody.
  //
  // All three need enough text to be a distribution, per DIST_MIN_*.
  const bl = (cal && cal.baselines) || {};
  if (m.words >= DIST_MIN_WORDS && m.sentences >= DIST_MIN_SENTENCES) {
    const band = (rule, metric, absolute, over) => {
      const raw = bl[metric];
      const b = typeof raw === 'number' && raw > 0 ? raw : null;
      const limit = b === null ? absolute
        : round(over ? b / VOICE_FLOOR : b * VOICE_FLOOR, 3);
      if (over ? m[metric] > limit : m[metric] < limit) {
        flags.push({
          rule, action: actionOf(rule), metric,
          draft: m[metric], baseline: b, limit,
          direction: over ? 'above' : 'below',
          source: b === null
            ? 'absolute fallback, gate-calibration.md carries no baseline for this metric'
            : 'gate-calibration.md',
        });
      }
    };
    band('burstiness', 'burstiness', BURSTINESS_FLOOR, false);
    band('punctuation-density', 'punctuation_density', PUNCT_DENSITY_FLOOR, false);
    band('nominalisation-rate', 'nominalisation_rate', NOMINALISATION_CEILING, true);
  }

  // gate-calibration.md rule 4, at the one place every rule leaves this
  // function. Nothing here is rewrite-class, so `suppressible` refuses all of
  // them and this filter is provably empty today; it is the enforcement point
  // if a rule ever changes class, and the thing that decides is the table,
  // never the file.
  const live = flags.filter(f => !isSuppressed(cal, f.rule));

  return {
    check: 'stats',
    pass: live.length === 0,
    measured: m,
    baseline: baseline,
    baseline_source: haveBaseline ? 'voice.md' : 'none, absolute floors applied',
    // The voice floor keeps reading voice.md's frozen four and not this file.
    // voice.md is frozen at setup and gate-calibration.md is re-measured, so
    // drift is only detectable against the first one. The calibration baselines
    // serve the three checks above, which voice.md has no keys for.
    distribution_baselines: bl,
    flags: live,
    suppressed_by_calibration: flags.filter(f => isSuppressed(cal, f.rule)).map(f => f.rule),
  };
}

function stats(draftPath, profile, cal) {
  const baseline = profile
    ? voiceMeasures(readIfPresent(path.join(profile, 'voice.md')))
    : null;
  return statsText(readFile(draftPath), baseline, cal || readCalibration(profile));
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

  // Section 12: runway is the pool that has never anchored a shipped piece,
  // printed in posts and read as weeks against the cadence.
  //
  // Not "pool minus the lock window". The anchor lock is a rolling window, so
  // every post frees the anchor falling out of it: a pool above 10 turns
  // forever and a pool at or below 10 stalls dead. That is a cliff rather than
  // a runway, and above the cliff it prints unlocked_count a second time.
  // Never-used is the only number here that falls when a piece ships and rises
  // on a top-up, which is the shape the line is asked for.
  const everUsed = new Set();
  for (const b of briefs) if (b.fm.anchor) everUsed.add(b.fm.anchor);
  const fresh = pool.map(it => it.id).filter(id => !everUsed.has(id));
  const runway = fresh.length;

  return {
    check: 'locks',
    shipped_pieces: briefs.length,
    inventory_pool: pool.length,
    unlocked_anchors: unlocked,
    unlocked_count: unlocked.length,
    locked_anchors: Array.from(lockedAnchors, ([id, slug]) => ({ id, by: slug })),
    never_used_anchors: fresh,
    runway_posts: runway,
    rotation_healthy: unlocked.length >= ROTATION_FLOOR,
    hook_locked_recent: Array.from(hookRecent),
    hook_counts_trailing_20: hookCounts,
    hook_at_window_limit: hookAtLimit,
    archetype_locked: Array.from(archetypeLocked),
    thesis_hook_pairs_locked_30d: pairs,
    last_shipped: briefs.length ? recent(briefs).slug : null,
    // Sections 3, 12 and SKILL.md all print this line with the trailing
    // "at current cadence"; section 7b's worked example is the one place that
    // drops it. Matching the three.
    run_start_line: unlocked.length + ' unlocked anchors, ' + runway +
      ' posts of runway at current cadence.',
  };
}

// --------------------------------------------------------------------- gate

// Section 13.2 step 4. Four questions in one subcommand, because they are read
// together and three of them share one scan:
//
//   gate [dir]              does the gate catch known-AI writing (recall)
//   gate --negative <prof>  does it stay off this person's own writing
//   gate --hooks [file]     does the hook library ship a line the gate rewrites
//   gate --tells [file]     the ownership table, and whether ai-tells.md agrees
//
// Recall counts engine-owned tells only. Scoring a model-judged tell as caught
// because a fixture happens to list it would report a number this file did not
// earn, which is the self-witnessing problem section 13.1 exists to stop.

function firedTags(text, baseline, short, cal) {
  const lx = lexicalText(text, { short: short !== false, calibration: cal }, [], false);
  const st = statsText(text, baseline, cal);
  const tags = new Set();
  for (const h of lx.hits) tags.add(h.tag);
  if (lx.hashtags.stack) tags.add('hashtag-stack');
  for (const f of st.flags) tags.add(f.rule);
  return { tags: [...tags], rewrite_count: lx.rewrite_count, protected: lx.not_rewritten_quoted_or_factual.length };
}

// `profile` is optional and it changes what the number means, not how it is
// computed. gate-calibration.md rule 3: recall measured over a suppressed rule
// is a number the engine did not earn, so a suppressed expectation leaves the
// scored set and is named under recall_not_earned instead of quietly counting
// as a catch or quietly counting as a miss. With no profile, nothing is
// suppressed and this is the corpus-wide recall it has always been.
function gateFixtures(dir, profile) {
  const cal = readCalibration(profile);
  // Rows are `NN: tell-id, tell-id  # why`. The expected catch lives in one
  // manifest rather than in each fixture's front matter, so a fixture file is
  // only ever the post: authors stripped means nothing else in there either.
  const manifest = readIfPresent(path.join(dir, 'expected.md'));
  const expected = new Map();
  const re = /^(\d{2}):[ \t]*([a-z0-9,\- ]+?)(?:[ \t]+#.*)?[ \t]*$/gm;
  let m;
  while ((m = re.exec(manifest)) !== null) {
    expected.set(m[1], m[2].split(',').map(s => s.trim()).filter(Boolean));
  }

  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => /^\d{2}\.md$/.test(f)).sort()
    : [];
  const errors = [];
  const per = [];
  const suppressedSeen = [];
  let owed = 0;
  let caught = 0;

  for (const f of files) {
    const want = expected.get(f.slice(0, 2));
    if (!want) { errors.push(f + ': no row in expected.md'); continue; }
    const got = firedTags(readFile(path.join(dir, f)), null, true, cal);
    const wantTags = new Set();
    const engineWanted = [];
    const judged = [];
    const missed = [];
    const notEarned = [];
    for (const id of want) {
      const tell = tellById.get(id);
      if (!tell) { errors.push(f + ': unknown tell "' + id + '"'); continue; }
      if (!tell.tag) { judged.push(id); continue; }
      if (isSuppressed(cal, id)) { notEarned.push(id); wantTags.add(tell.tag); continue; }
      wantTags.add(tell.tag);
      engineWanted.push(id);
      if (!got.tags.includes(tell.tag)) missed.push(id);
    }
    owed += engineWanted.length;
    caught += engineWanted.length - missed.length;
    for (const id of notEarned) if (!suppressedSeen.includes(id)) suppressedSeen.push(id);
    per.push({
      fixture: f,
      expected_engine: engineWanted,
      expected_judged: judged,
      expected_suppressed: notEarned,
      missed,
      also_fired: got.tags.filter(x => !wantTags.has(x)),
    });
  }

  for (const id of expected.keys()) {
    if (!files.includes(id + '.md')) errors.push(id + '.md: listed in expected.md and absent');
  }

  return {
    check: 'gate',
    mode: 'fixtures',
    pass: errors.length === 0 && owed > 0 && caught === owed && files.length === FIXTURE_COUNT,
    fixtures: files.length,
    fixtures_required: FIXTURE_COUNT,
    deterministic_expected: owed,
    deterministic_caught: caught,
    judged_expected: per.reduce((n, r) => n + r.expected_judged.length, 0),
    calibration: cal.file,
    suppressed_for_profile: cal.suppressed,
    recall_not_earned: suppressedSeen,
    errors,
    per_fixture: per,
    note: 'a judged tell is the model half of section 9 and is listed, never scored. A tell suppressed for this profile is listed under recall_not_earned and is not scored either, per gate-calibration.md rule 3: recall over a rule that cannot fire is a number the engine did not earn.',
  };
}

// The negative control, and the producer of the evidence gate-calibration.md is
// written from. It stays a pure read: setup and /content-engine review write
// that file, and section 1.3's write constraint is that every write lands
// inside profiles/<handle>/ by the half of the system that owns writing.
//
// It runs with every rule on, always, including rules already suppressed for
// this profile. A control that applied the suppressions could never re-confirm
// one, and a suppression nobody can re-measure is a rule switched off forever on
// evidence nobody can see again. Already-suppressed fires are reported and do
// not fail the control, because a suppressed rule edits nothing.
function gateNegative(profile) {
  const cal = readCalibration(profile);
  const voiceText = readIfPresent(path.join(profile, 'voice.md'));
  const baseline = voiceMeasures(voiceText);
  const corpus = voiceSamples(voiceText).map(s => ({ from: 'voice.md', ...s }))
    .concat(pastedBlocks(readIfPresent(path.join(profile, 'shipped-history.md')), 'posted_at')
      // Spread first, override after. pastedBlocks returns a kind of '' when
      // the block does not declare one, and a trailing spread hands that empty
      // string straight over the top of this line: every shipped post stops
      // being a post and the absence checks quietly never run on any of them.
      .map(s => ({ ...s, from: 'shipped-history.md', kind: 'linkedin post' })));

  // Section 13.2's bar is "zero rewrites on the person's own samples", and the
  // wording is load bearing. A specifics-floor hit is a redraft and a voice
  // floor is a flag; neither edits a word the person wrote, and neither is
  // evidence that a rule is wrong. Only rewrites count against the control, and
  // the rest is reported so it stays visible.
  // A sample needs a name a suppression can be traced back to. voice.md's lead
  // key is `source:` and voiceSamples keeps only the ones labelled `pasted`, so
  // every voice.md label is the literal string "pasted" and five samples would
  // name themselves identically. shipped-history.md's lead key is `posted_at:`,
  // which is a real label already. So: the declared kind plus its ordinal
  // within the file for voice.md, the date for shipped-history.md, and an
  // ordinal on either if two collide. Evidence that cannot be traced back to
  // one sample is not evidence, which is gate-calibration.md rule 1.
  const used = new Map();
  const nameOf = s => {
    const base = s.from === 'shipped-history.md'
      ? (s.label || 'undated')
      : (s.kind ? s.kind.trim().replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '') : 'sample');
    const key = s.from + '/' + base;
    const n = (used.get(key) || 0) + 1;
    used.set(key, n);
    return s.from + ':' + base + (s.from === 'shipped-history.md' && n === 1 ? '' : '-' + n);
  };

  // Per rule, the count and the first sample that produced it: the two things
  // gate-calibration.md rule 1 asks for. "Your own writing tripped this 36
  // times" is the argument for a suppression, and "it tripped at least once"
  // is not, so this is a count and not a set.
  const candidates = new Map();
  const candidate = (rule, sample) => {
    if (!suppressible(rule)) return;
    const c = candidates.get(rule) || { rule, fired: 0, sample, samples: 0 };
    c.fired++;
    if (c.last !== sample) { c.samples++; c.last = sample; }
    candidates.set(rule, c);
  };

  const fires = [];
  const flagged = [];
  for (const s of corpus) {
    const isPost = s.kind === 'linkedin post';
    // Section 9 bans semicolons in short posts only, so an email or a slack
    // message is not scanned for them. Firing there would strike a live rule
    // over a sample the rule never claimed.
    const lx = lexicalText(s.text, { short: isPost }, [], false);
    const name = nameOf(s);
    const counts = {};
    for (const h of lx.hits) {
      counts[h.tell || h.tag] = (counts[h.tell || h.tag] || 0) + 1;
      candidate(h.tell, name);
    }
    if (lx.hashtags.stack) {
      counts['hashtag-stack'] = 1;
      candidate('hashtag-stack', name);
    }
    if (lx.rewrite_count > 0 || lx.hashtags.stack) {
      const rules = [...new Set(lx.hits.filter(h => h.action === 'rewrite').map(h => h.tell))]
        .concat(lx.hashtags.stack ? ['hashtag-stack'] : []);
      const live = rules.filter(r => !isSuppressed(cal, r));
      fires.push({
        sample: name,
        kind: s.kind || 'unspecified',
        fired: [...new Set(lx.hits.map(h => h.tag))],
        counts,
        rewrites: lx.rewrite_count,
        rewrite_rules: rules,
        // Already off for this profile, so it edits nothing and fails nothing.
        already_suppressed: rules.filter(r => isSuppressed(cal, r)),
        blocking: live.length > 0,
      });
    }
    // The absence checks measure a whole post: paragraph uniformity, a
    // specifics count, a distance from a baseline. A three-line slack message
    // is not a post and running them on one measures the sample rather than
    // the rule.
    if (!isPost) continue;
    for (const f of statsText(s.text, baseline, cal).flags) {
      if (f.action === 'rewrite') {
        candidate(f.rule, name);
        fires.push({
          sample: name, kind: s.kind, fired: [f.rule], counts: { [f.rule]: 1 },
          rewrites: 1, rewrite_rules: [f.rule],
          already_suppressed: isSuppressed(cal, f.rule) ? [f.rule] : [],
          blocking: !isSuppressed(cal, f.rule),
        });
      } else {
        flagged.push({ sample: name, rule: f.rule, action: f.action });
      }
    }
  }

  // The four baselines gate-calibration.md records, measured over the corpus as
  // one body of text rather than per sample, because a coefficient of variation
  // over the three sentences of one slack message is noise. Two of the four keys
  // also exist in voice.md, frozen at setup, and those are the authority for the
  // voice floor; these are what the three distribution checks measure against.
  const joined = corpus.map(s => s.text).join('\n\n');
  const jm = measure(joined);
  const baselines = corpus.length ? {
    burstiness: jm.burstiness,
    punctuation_density: jm.punctuation_density,
    contraction_rate: jm.contraction_rate,
    sentence_length_stdev: jm.sentence_length_stdev,
  } : {};

  for (const c of candidates.values()) delete c.last;

  return {
    check: 'gate',
    mode: 'negative-control',
    // "fires: 0" over an empty corpus reads as a clean pass. Say which it was.
    corpus: corpus.length ? 'present' : 'empty, no pasted sample on file',
    samples: corpus.length,
    posts: corpus.filter(s => s.kind === 'linkedin post').length,
    pass: corpus.length > 0 && !fires.some(f => f.blocking),
    fires,
    also_flagged: flagged,
    // The frozen four from voice.md, plus the two keys the distribution checks
    // need and voice.md has no field for, so setup writes gate-calibration.md
    // from one call and invents no key of its own.
    baseline: { ...baseline, burstiness: corpus.length ? jm.burstiness : null,
      punctuation_density: corpus.length ? jm.punctuation_density : null },
    // What a calibration file is written from. Nothing here writes it.
    calibration: {
      file: cal.file,
      suppressed: cal.suppressed,
      candidates: [...candidates.values()].sort((a, b) => b.fired - a.fired),
      baselines,
      writes: 'nothing. This mode is a pure read. Setup and /content-engine review write profiles/<handle>/gate-calibration.md from these numbers, per section 1.3: every write lands inside profiles/<handle>/ and the engine is not the half that writes.',
      note: 'rule 1: a candidate is a rewrite-class rule with a fired count over 0 and the sample that did it. rule 4: a reject or a redraft is never a candidate, so it never appears here however often it fires.',
    },
    bar: 'section 13.2 step 4: zero rewrites on the person\'s own samples. Every rewrite is a rule bug, suppressed for this profile in gate-calibration.md rather than struck in ai-tells.md, because ai-tells.md ships identical to everyone. A redraft or a flag is listed under also_flagged and does not fail the control, because neither edits a word the person wrote. A rewrite whose rule is already suppressed here is reported with blocking: false for the same reason.',
    reads: 'voice.md source: pasted blocks and shipped-history.md. Absence checks run on kind: linkedin post only. The inspiration corpus is not here: section 6 discards that text at the end of setup, so its half of the control runs once, at setup, before the discard.',
  };
}

function gateHooks(file) {
  // Section 13.2 step 4: every example line in hooks.md is checked against the
  // gate. A pattern the gate would rewrite cannot ship in the library, or the
  // user watches the tool argue with itself on run two.
  //
  // An example line is a blockquote line. hooks.md does not exist until step 5,
  // so this reports blocked rather than passing on an empty scan.
  if (!fs.existsSync(file)) {
    return {
      check: 'gate', mode: 'hooks', pass: false,
      hooks_file: 'absent', example_lines: 0, violations: [],
      blocked_on: file + ', built at section 13 step 5. This check goes live the day it lands.',
      convention: 'an example line is a line starting with "> ".',
    };
  }
  // Consecutive blockquote lines are one example, joined before scanning. An
  // example that wraps is the normal case in a file kept under 80 columns, and
  // scanning the halves separately splits every pattern that straddles the
  // break: "isn't the problem." on one line and "X is." on the next clears a
  // check that exists to be uncircumventable.
  const lines = readFile(file).split(/\r?\n/);
  const examples = [];
  lines.forEach((line, i) => {
    if (!/^\s*>\s+\S/.test(line)) return;
    const body = line.replace(/^\s*>\s+/, '').trim();
    const prev = examples[examples.length - 1];
    if (prev && prev.end === i - 1) {
      prev.text += ' ' + body;
      prev.end = i;
    } else {
      examples.push({ line: i + 1, end: i, text: body });
    }
  });

  const violations = [];
  const n = examples.length;
  examples.forEach(ex => {
    const body = ex.text;
    const got = firedTags(body, null, true);
    // The absence checks measure a whole post. One quoted hook line has no
    // paragraphs, no baseline and nothing to name, so they are not violations
    // here, only the presence tells are.
    const real = got.tags.filter(x => !['specifics-floor', 'no-fragments',
      'no-long-sentence', 'zero-contractions', 'we-with-no-human',
      'uniform-paragraphs', 'burstiness', 'punctuation-density',
      'nominalisation-rate'].includes(x));
    if (real.length) violations.push({ line: ex.line, text: body, fired: real });
  });
  return {
    check: 'gate', mode: 'hooks',
    pass: n > 0 && violations.length === 0,
    hooks_file: 'found',
    example_lines: n,
    violations,
    convention: 'an example line is a line starting with "> ".',
  };
}

// Section 13.2 step 5: gate-report.md logs gate_catch_count, a per-tell tag
// list, and gate_passes. All three are counts over the two scans this file
// already runs, and a count the model derives by adding two JSON arrays is the
// self-witnessed number section 13.1 exists to stop. One call returns the whole
// audit trail so gate-report.md quotes one object rather than stitching three.
//
// It reports the twenty-three engine-owned tells. The seven judged ones are
// named in model_owned, so a clean report cannot be read as a clean draft.
//
// Lock 5, verbatim overlap, runs here as well. SKILL.md step 2 defers it
// because it has no draft yet, and step 6 is the design gate on visual runs
// only, so a short post reaches no other caller: this is its invocation site.
// It stays out of `tags` and `gate_catch_count`, which section 13.2 step 5
// defines over the tell table, and reports as its own block instead, because a
// failure names a prior slug and a span and neither survives a tag list.
function gateReport(draftPath, profile, format) {
  // Only 'long' opts out. An absent format and a misspelled one both land on
  // 'short', because short is the stricter scope: section 9's semicolon rule
  // is short-post only, and a typo that silently widened the format would
  // retire a live rule without anyone asking for it.
  const fmt = format === 'long' ? 'long' : 'short';
  const cal = readCalibration(profile || null);
  const lx = lexical(draftPath, { short: fmt === 'short', calibration: cal });
  const st = stats(draftPath, profile ? profile : null, cal);

  // Section 3's only hard fail. With no profile there is no prior corpus, so
  // the block says it did not run and carries no verdict at all: a check that
  // reports `pass: true` on nothing it read is the same defect as "fires: 0"
  // over an empty corpus, which the negative control already guards against.
  const ov = profile ? { ran: true, ...overlap(draftPath, profile) } : {
    check: 'overlap',
    ran: false,
    reason: 'no profile directory was passed, so no prior corpus was read. ' +
      'Lock 5 did not run on this draft, and this is not a pass.',
  };
  const overlapFails = ov.ran && !ov.pass;

  const tags = new Set();
  for (const h of lx.hits) tags.add(h.tag);
  if (lx.hashtags.stack) tags.add('hashtag-stack');
  // private_terms violations sit outside hits because they are a rejection
  // rather than a rewrite. They are still a tell and still belong in the list.
  if (lx.private_terms.violations.length) tags.add('private-terms');
  for (const f of st.flags) tags.add(f.rule);

  const catches = lx.hits.length + lx.private_terms.violations.length +
    st.flags.length + (lx.hashtags.stack ? 1 : 0);

  // Section 9 bound 3, "cap rewrites at 3 per 200 words", read as a rate with
  // the first bucket whole: a 140-word post gets 3 and a 250-word post gets 6.
  // Rounding the fraction down instead puts the cap at 1 on a normal short
  // post and fires the redraft path on almost every run. The 3 is a knob
  // section 13.2 step 8 tunes against ten real posts, not a measured constant.
  const words = st.measured.words;
  const cap = REWRITE_CAP_PER * Math.max(1, Math.ceil(words / REWRITE_CAP_WORDS));

  // A repeated span is a redraft. Patching it produces a differently worded
  // repetition, and it discloses nothing, so it is neither a rewrite nor a
  // rejection. Overlap *warnings* are the spans section 13.1 traces back to
  // inventory or thesis.md, and those are citations: they never fail anything.
  const redraft = st.flags.some(f => f.action === 'redraft') ||
    lx.redraft_count > 0 || overlapFails;
  // Repairs, and only repairs. The stats term is empty by construction today,
  // because nothing statsText emits is repair-class; it stays so a rule that
  // changes class cannot silently stop being counted against the cap.
  const rewrites = lx.rewrite_count + st.flags.filter(f => f.action === 'rewrite').length;
  const constraints = [...new Set([
    ...lx.redraft_tells,
    ...st.flags.filter(f => f.action === 'redraft').map(f => f.rule),
  ])].sort();
  const reject = lx.private_terms.violations.length > 0;
  const flagged = st.flags.filter(f => f.action === 'flag').length;

  return {
    check: 'gate', mode: 'report',
    // An edit was required, of any kind. A flag is information for the human
    // and changes no word, so it does not fail the gate. `flagged` is reported
    // beside this, so a pass carrying a voice floor is never read as silence.
    // A lock 5 failure joins this through `redraft`, because section 3 calls it
    // a hard fail and the run has to go back to brief.md either way.
    gate_passes: !reject && !redraft && rewrites === 0,
    gate_catch_count: catches,
    tags: [...tags].sort(),
    // Precedence, highest first: reject > redraft > rewrite > flag > none.
    // Each verdict sends the run somewhere different, so the order is the
    // whole content of this line and it is written out rather than implied.
    action: reject ? 'reject' : (redraft ? 'redraft' : (rewrites ? 'rewrite' : (flagged ? 'flag' : 'none'))),
    rewrites_required: rewrites,
    rewrite_cap: cap,
    over_cap: rewrites > cap,
    // Section 9's redraft class. These are the ids the single redraft carries
    // back to brief.md as drafting constraints, and there is no span-patching
    // path for any of them. Ids rather than tags, because ai-tells.md is read
    // per id and the redraft prompt quotes it.
    redraft_constraints: constraints,
    flagged,
    words,
    format: fmt,
    // Zero priors is the real state of run one and it reads exactly like a
    // clean comparison unless the number is on the surface. null means the
    // check never ran, which is a third thing again.
    overlap_priors_compared: ov.ran ? ov.priors_compared : null,
    // Section 9 bound 4. Reported under its own heading, never edited.
    not_rewritten_quoted_or_factual: lx.not_rewritten_quoted_or_factual,
    lexical: lx,
    stats: st,
    overlap: ov,
    model_owned: TELLS.filter(x => !x.tag).map(x => x.id),
    // gate-calibration.md rule 3: a suppressed rule is reported, never silent.
    // Named here even when the list is empty, because "nothing was suppressed"
    // and "no calibration was read" are different states and only one of them
    // is a clean pass.
    calibration: {
      file: cal.file,
      suppressed: cal.suppressed,
      evidence: cal.evidence,
      baselines: cal.baselines,
      measured_at: cal.measured_at,
      note: cal.note || 'these rules did not fire on this draft because they are suppressed for this profile, on the evidence above. They are not retired: reference/ai-tells.md ships identical to everyone with every rule on.',
    },
    note: 'gate_catch_count and tags are engine-owned tells only. rewrites_required is repairs, which is all the editing section 9 leaves, and over_cap true is bound 3: return to brief.md and redraft once with redraft_constraints as the constraints. The redraft happens once; if it still trips, gate --compare picks which of the two ships. Lock 5 is reported under overlap and is counted nowhere else, so read that block rather than the tag list for it.',
  };
}

// Section 9 bound 3's comparator, and the reason it is here rather than left to
// the model: a comparison performed by adding two JSON arrays is exactly the
// self-witnessed number section 13.1 exists to stop. The redraft happens once.
// If it still trips, both drafts are re-measured, the better one ships, and the
// run prints one line naming what is unresolved. No run ends without an
// artifact.
//
// Fewer catches wins. A tie breaks on distance from the voice floor, summed as
// a relative shortfall across whichever metrics tripped, because the absolute
// numbers are a stdev and a percentage and adding those together compares
// nothing. A total tie ships the first draft: the redraft was composed under
// constraints and did not measurably improve on it, so there is nothing to
// prefer it for, and the draft the gate did not touch carries no unproven
// change.
function voiceFloorDistance(report) {
  let d = 0;
  for (const f of report.stats.flags) {
    if (f.rule !== 'voice-floor') continue;
    const floor = f.floor || f.limit || 0;
    if (floor > 0) d += Math.max(0, (floor - f.draft) / floor);
  }
  return round(d, 4);
}

function gateCompare(firstPath, redraftPath, profile, format) {
  const a = gateReport(firstPath, profile, format);
  const b = gateReport(redraftPath, profile, format);
  const da = voiceFloorDistance(a);
  const db = voiceFloorDistance(b);
  const better = b.gate_catch_count < a.gate_catch_count ||
    (b.gate_catch_count === a.gate_catch_count && db < da);
  const ships = better ? 'redraft' : 'first';
  const won = better ? b : a;
  return {
    check: 'gate', mode: 'compare',
    ships,
    // The line section 9 asks the run to print. Tags rather than counts,
    // because the human is being told what is still wrong with what shipped.
    unresolved: won.tags,
    // Lock 5 has no tell id, so it cannot enter a tag list. Section 3 calls it
    // a hard fail, and a hard fail that ships has to say so on its own line.
    unresolved_overlap: won.overlap.ran === true && won.overlap.pass === false,
    artifact: true,
    comparator: 'fewer catches wins; a tie breaks on distance from the voice floor; a total tie ships the first draft',
    catches: { first: a.gate_catch_count, redraft: b.gate_catch_count },
    voice_floor_distance: { first: da, redraft: db },
    first: a,
    redraft: b,
    note: 'section 9 bound 3. Both drafts are re-measured here, which is bound 1: this compares two measured drafts and not one measured draft and one assumption. The redraft happens once, so there is no third round and no run ends without an artifact.',
  };
}

function gateTells(file) {
  const doc = readIfPresent(file);
  const inDoc = [];
  const re = /^###\s+~{0,2}([a-z0-9-]+)~{0,2}\s*$/gm;
  let m;
  while ((m = re.exec(doc)) !== null) inDoc.push(m[1]);
  const ids = TELLS.map(x => x.id);
  const missingFromDoc = ids.filter(id => !inDoc.includes(id));
  const missingFromCode = inDoc.filter(id => !ids.includes(id));
  return {
    check: 'gate', mode: 'tells',
    // The doc check is redundant while TELLS holds anything: an absent file
    // reports every id missing on its own. It stays because the day someone
    // empties the table is the day this would report a clean pass on no file
    // at all, and it costs nothing to keep.
    pass: doc !== '' && !missingFromDoc.length && !missingFromCode.length,
    ai_tells_md: doc ? 'found' : 'absent',
    total: TELLS.length,
    engine_owned: TELLS.filter(x => x.tag).length,
    model_owned: TELLS.filter(x => !x.tag).length,
    missing_from_ai_tells_md: missingFromDoc,
    missing_from_engine_js: missingFromCode,
    note: 'ai-tells.md carries the prose, this table carries the ownership. A tell in one and not the other is drift, and the engine-owned count is what section 9\'s zero tolerance actually covers.',
    tells: TELLS,
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

    // Wrapped across two lines, because that is how a three-sentence content
    // field is actually written. A parser that keeps only the first line
    // exempts half the story and fails the person on the other half.
    writeFixture(profile, 'inventory.md',
      '## Items\n\n- id: shadow-spreadsheet\n' +
      '  content: the shadow spreadsheet is where the real\n' +
      '    planning happens every single week here.\n  clearance: public\n');
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

    // A brief that never shipped, and a directory under runs/ that is not a
    // run. Admitting the first invents overlap against text nobody published;
    // admitting the second reads a file that need not exist.
    writeFixture(profile, 'runs/2026-01-06-unshipped/brief.md', 'anchor: x\nstatus: drafted\n');
    writeFixture(profile, 'runs/scratch/shipped.md', RUN + '.\n');
    assert.strictEqual(overlap(clean, profile).priors_compared, 1,
      'only dated run directories holding a shipped.md are priors');

    // Section 3 says 8+ words, so 7 shared words must pass. This pins the
    // threshold from below; the 13-word run above pins it from above. Without
    // both, NGRAM is a number no test can see.
    const seven = writeFixture(draftDir, 'seven.md',
      'I keep finding where the real planning happens every time I look at a rollout.\n' +
      'Acme, March 2026, and nobody wrote it down.\n');
    const sevenR = overlap(seven, profile);
    assert.strictEqual(sevenR.pass, true, 'a 7-word shared run is not a violation');
    assert.strictEqual(sevenR.failures.length + sevenR.warnings.length, 0, 'and forms no span');

    // Section 3's other half: more than ~15% sentence similarity to one prior.
    // These sentences share no 8-gram at all, so this can only pass if the
    // paraphrase check is doing its own work.
    const para = writeFixture(draftDir, 'paraphrase.md',
      'In the QBR nobody admits it.\nAcme said so in March 2026.\n');
    const paraR = overlap(para, profile);
    assert.strictEqual(paraR.failures.length, 0, 'a reordered short sentence forms no 8-gram');
    assert.strictEqual(paraR.sentence_similarity.length, 1, 'but it is the same sentence');
    assert.strictEqual(paraR.pass, false, 'and section 3 calls that a hard fail');

    // Section 13.1 caps the corpus at the last 20 shipped runs, and "last"
    // is the half that matters: a cap that kept the oldest 20 would stop
    // seeing anything the person wrote this quarter. The 23rd run repeats the
    // 22nd verbatim, so the span is also proof that the oldest use is the one
    // named, which is the citation a warning is supposed to point at.
    const capProfile = path.join(root, 'profiles', 'cap');
    const capLine = n => 'prior number ' + n + ' said absolutely nothing at all that week.\n';
    for (let i = 1; i <= 22; i++) {
      writeFixture(capProfile, 'runs/2026-02-' + String(i).padStart(2, '0') + '-p' + i + '/shipped.md', capLine(i));
    }
    writeFixture(capProfile, 'runs/2026-02-23-dup/shipped.md', capLine(22));
    const capDraft = writeFixture(draftDir, 'cap.md', capLine(22));
    const cap = overlap(capDraft, capProfile);
    assert.strictEqual(cap.priors_compared, 20, 'the corpus is capped at 20 runs');
    assert.ok(cap.failures.some(f => f.prior === '2026-02-22-p22'),
      'the cap keeps the newest 20, and the oldest use of a span is the one named');

    // shipped-history.md is the whole diff corpus until 20 engine posts exist,
    // which is every week that matters most. Its own profile, no runs/ at all.
    const histProfile = path.join(root, 'profiles', 'history');
    const HIST = 'we lost the renewal because nobody read the implementation notes until the quarter closed';
    writeFixture(histProfile, 'shipped-history.md',
      '```\n- posted_at:\n  text: |\n    <verbatim>\n  source: pasted\n```\n\n' +
      '- posted_at: 2025-11-02\n  text: |\n    ' + HIST + '.\n  source: pasted\n');
    const histDraft = writeFixture(draftDir, 'hist.md', HIST + '.\nAcme, March 2026.\n');
    const hist = overlap(histDraft, histProfile);
    assert.strictEqual(hist.priors_compared, 1, 'the schema fence is not a prior, the entry is');
    assert.strictEqual(hist.pass, false, 'a pre-engine post is still the diff corpus');
    assert.strictEqual(hist.failures[0].prior, 'shipped-history:2025-11-02', 'named by its posted_at');

    // ---- lexical ----
    const lexDir = path.join(root, 'lex');
    writeFixture(lexDir, 'brief.md',
      'anchor: a\nprivate_terms: ["Northwind", "41%"]\nstatus: drafted\n');
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
    assert.strictEqual(lex.private_terms.violations[0].term, '41%', 'quoted list items lose their quotes');
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
    // Section 9's carve-outs are the false-positive half, and section 12.1
    // metric 4 says a fire on the person's own writing is a defect, not a
    // tuning signal. An en dash between digits is legal, a curly-quoted ban is
    // reported rather than rewritten, and a stem on the list catches suffixes.
    const carveDir = path.join(root, 'carve');
    writeFixture(carveDir, 'brief.md',
      'anchor: a\narchetype: bar     # visual runs only\n' +
      'private_terms: [Northwind,\n  Contoso]\nstatus: drafted\n');
    const carveDraft = writeFixture(carveDir, 'draft.md',
      'Revenue ran 2024' + EN_DASH + '2025 and margin held near 10' + EN_DASH + '15 percent.\n' +
      'He said ' + CURLY_OPEN + 'we kept unpacking it' + CURLY_CLOSE + ' in the Northwind review.\n' +
      'Then we spent a week unpacking the same deck.\n');
    const cv = lexical(carveDraft, { short: true });
    assert.ok(!cv.hits.some(h => h.tag === 'en-dash'), 'an en dash between digits is legal');
    assert.strictEqual(cv.hits.filter(h => h.tag === 'banned').length, 1,
      'the stem catches "unpacking", and only the unquoted one is rewritable');
    assert.ok(cv.not_rewritten_quoted_or_factual.some(h => h.tag === 'banned'),
      'a curly-quoted ban is protected, and curly is what every real keyboard emits');
    assert.strictEqual(cv.private_terms.checked, 2, 'a wrapped bracket list is still two terms');
    assert.strictEqual(cv.private_terms.violations.length, 1, 'and it still guards');
    assert.strictEqual(cv.private_terms.violations[0].term, 'Northwind',
      'and the bracket is not part of the term');
    // An en dash between words is still a tell.
    const enWords = writeFixture(carveDir, 'enwords.md',
      'The plan' + EN_DASH + 'if you can call it that' + EN_DASH + 'was late.\n');
    assert.ok(lexical(enWords, { short: true }).hits.some(h => h.tag === 'en-dash'),
      'an en dash between words is not exempt');

    // The semicolon rule is short-post only.
    assert.ok(!lexical(lexDraft, { short: false }).hits.some(h => h.tag === 'semicolon'),
      'semicolons are legal outside short posts');
    // An unbracketed private_terms list is the drift that would otherwise turn
    // section 9's one non-negotiable string match into a no-op.
    const bareBriefDir = path.join(root, 'lexbare');
    writeFixture(bareBriefDir, 'brief.md', 'anchor: a\nprivate_terms: Northwind, 41%\nstatus: drafted\n');
    const bareDraft = writeFixture(bareBriefDir, 'draft.md', 'It cost us 41% of the quarter.\n');
    const bareLex = lexical(bareDraft, { short: false });
    assert.strictEqual(bareLex.private_terms.checked, 2, 'both unbracketed terms parsed');
    assert.strictEqual(bareLex.action, 'reject', 'an unbracketed list still rejects');
    // A missing brief.md is not the same answer as a brief that declared none.
    const noBrief = writeFixture(path.join(root, 'nobrief'), 'draft.md', 'Acme shipped in March.\n');
    assert.strictEqual(lexical(noBrief, { short: false }).private_terms.brief, 'missing',
      'an absent brief.md is reported, not read as zero private terms');

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
    // LinkedIn posts are mostly unpunctuated fragments on their own lines. A
    // splitter that only knows terminal punctuation reads this as one sentence
    // and every distribution rule in section 9 is then measured on n = 1.
    const frag = writeFixture(statDir, 'fragments.md',
      'Three years in supply chain\nNobody told me this\nIt still surprises me\n');
    assert.strictEqual(stats(frag, null).measured.sentences, 3, 'a line break ends a sentence');
    const oneLine = writeFixture(statDir, 'oneline.md', 'It never worked. Nobody said so at all.\n');
    assert.strictEqual(stats(oneLine, null).measured.sentences, 2,
      'and a full stop still ends one inside a line');
    assert.ok(st.measured.specifics > 0, 'Acme and March are specifics');
    assert.ok(st.measured.sentence_length_stdev > 0, 'varied lengths give nonzero stdev');
    // Slack, Gmail and macOS all autocorrect to a curly apostrophe, so a
    // straight-quote-only contraction test measures nothing that ever arrives.
    const curly = writeFixture(statDir, 'curly.md',
      'It' + APOS + 's late.\nWe didn' + APOS + 't ship.\n');
    const cu = stats(curly, null).measured;
    assert.strictEqual(cu.words, 5, 'five words');
    assert.strictEqual(cu.contraction_rate, round(2 / 5 * 100, 2), 'a curly apostrophe still contracts');
    // Section 9 counts numerals as specifics. A list numbering itself is not
    // one of them, or every abstraction clears the floor by wearing bullets.
    const numeric = writeFixture(statDir, 'numeric.md', 'we cut it 41 percent in one quarter\n');
    assert.ok(!stats(numeric, null).flags.some(f => f.rule === 'specifics-floor'),
      'a numeral alone clears the specifics floor');
    const listed = writeFixture(statDir, 'listed.md',
      '1. everything is about alignment\n2. it always has been\n3. it always will be\n');
    assert.ok(stats(listed, null).flags.some(f => f.rule === 'specifics-floor'),
      'a list numbering itself names nothing');
    // Section 9's specifics floor fires on an abstraction.
    const empty = writeFixture(statDir, 'empty.md', 'Everything is about alignment.\nIt always has been.\n');
    assert.ok(stats(empty, null).flags.some(f => f.rule === 'specifics-floor'),
      'a draft naming nothing trips the specifics floor');
    // Section 9's voice floor fires against a recorded baseline.
    writeFixture(profile, 'voice.md',
      'avg_sentence_length: 12\nsentence_length_stdev: 20\ncontraction_rate: 8\nuses_fragments: yes\n');
    assert.ok(stats(statDraft, profile).flags.some(f => f.rule === 'voice-floor' && f.metric === 'contraction_rate'),
      'zero contractions against a baseline of 8 trips the voice floor');
    // The template ships those keys empty inside a fence. A profile whose real
    // numbers were appended below it still has a baseline, and reporting "no
    // samples" there would silently retire the voice floor.
    const appended = path.join(root, 'profiles', 'voice-appended');
    writeFixture(appended, 'voice.md',
      '```\navg_sentence_length:\nsentence_length_stdev:\ncontraction_rate:\n' +
      'uses_fragments: yes | no\n```\n\n' +
      'avg_sentence_length: 12\nsentence_length_stdev: 20\ncontraction_rate: 8\nuses_fragments: yes\n');
    const app = stats(statDraft, appended);
    assert.strictEqual(app.baseline.contraction_rate, 8, 'an empty placeholder is not a value');
    assert.strictEqual(app.baseline.uses_fragments, 'yes', 'and neither is "yes | no"');
    assert.strictEqual(app.baseline_source, 'voice.md', 'the baseline is found, not fallen back from');
    assert.ok(app.flags.some(f => f.rule === 'voice-floor'), 'the floor fires off it');

    // ---- locks ----
    const lockProfile = path.join(root, 'profiles', 'locks');
    writeFixture(lockProfile, 'inventory.md',
      '## Schema\n\n```\n- id: <short-kebab-slug>\n  type: story | belief | number\n' +
      '  content: one to three sentences\n  clearance: public | anonymized | do-not-publish\n```\n\n' +
      '## Items\n\n' +
      ['a', 'b', 'c', 'd'].map(id => '- id: ' + id + '\n  content: item ' + id + '\n  clearance: public\n').join('\n') +
      '\n- id: e\n  content: retired item\n  clearance: do-not-publish\n' +
      '\n- id: f\n  content: withdrawn item\n  clearance: public\n  withdrawn: 2026-02-01 retracted\n' +
      '\n- id: g\n  content: corrected item d\n  clearance: public\n  supersedes: d\n');
    const mk = (date, slug, fm) => writeFixture(lockProfile, 'runs/' + date + '-' + slug + '/brief.md', fm);
    mk('2026-01-01', 'one', 'anchor: a\nhook_id: confession\nthesis_id: t1\nstatus: shipped\n');
    mk('2026-01-02', 'two', 'anchor: b\nhook_id: confession\nthesis_id: t2\nstatus: shipped\n');
    // The template schemas carry trailing comments and a model copying that
    // shape writes them into brief.md too.
    mk('2026-01-03', 'three',
      'anchor: c\nhook_id: number\nthesis_id: t1\narchetype: bar   # visual runs only\nstatus: shipped\n');
    mk('2026-01-04', 'four', 'anchor: d\nhook_id: number\nthesis_id: t1\nstatus: drafted\n');
    const lk = locks(lockProfile);
    assert.strictEqual(lk.shipped_pieces, 3, 'the drafted brief is not shipped');
    assert.strictEqual(lk.inventory_pool, 4,
      'do-not-publish, withdrawn and superseded are all out of the pool');
    assert.ok(!lk.unlocked_anchors.includes('<short-kebab-slug>'),
      "the fenced schema example is documentation, not an item");
    // Section 7 corrects by appending a supersedes row, never by rewriting, so
    // the superseded id has to leave the pool or a correction ships twice.
    assert.deepStrictEqual(lk.unlocked_anchors, ['g'],
      'a, b and c are anchor-locked, and d was superseded by g');
    assert.strictEqual(lk.runway_posts, 1, 'only g has never anchored a shipped piece');
    assert.strictEqual(lk.rotation_healthy, false, 'one unlocked anchor cannot turn the rotation');
    assert.ok(lk.hook_locked_recent.includes('confession'), 'confession is inside the trailing 8');
    assert.strictEqual(lk.hook_counts_trailing_20.confession, 2, 'confession used twice in 20');
    assert.ok(lk.hook_at_window_limit.includes('confession'), 'twice in 20 is the limit');
    assert.ok(!lk.hook_at_window_limit.includes('number'), 'once in 20 is not');
    assert.deepStrictEqual(lk.archetype_locked, ['bar'], 'the one shipped visual piece locks its archetype');
    assert.strictEqual(lk.last_shipped, '2026-01-03-three', 'ordering is by directory date');
    assert.deepStrictEqual(lk.thesis_hook_pairs_locked_30d, [],
      'every fixture brief above is older than 30 days, so no pair is locked');

    // The pair lock is the only lock with a clock, so its fixture dates are
    // relative. Fixed dates pass on the day they are written and then quietly
    // stop reaching the window, which is how a lock ends up with no coverage.
    const pairProfile = path.join(root, 'profiles', 'pairs');
    const daysAgo = n => new Date(Date.now() - n * 86400000).toISOString().slice(0, 10);
    writeFixture(pairProfile, 'runs/' + daysAgo(60) + '-old/brief.md',
      'anchor: b\nhook_id: number\nthesis_id: t2\nstatus: shipped\n');
    writeFixture(pairProfile, 'runs/' + daysAgo(3) + '-recent/brief.md',
      'anchor: a\nhook_id: confession\nthesis_id: t1\nstatus: shipped\n');
    const pl = locks(pairProfile);
    assert.strictEqual(pl.shipped_pieces, 2, 'both pair briefs are shipped');
    assert.deepStrictEqual(pl.thesis_hook_pairs_locked_30d.map(x => x.pair), ['t1 x confession'],
      'a pair 3 days old is locked and one 60 days old is not');

    // Runway and unlocked anchors have to be different numbers, or section
    // 12.1 prints one number twice. An item last used 12 posts ago is unlocked
    // and is not runway: the rotation can reach it, and reaching it is the
    // engine retelling a story rather than telling one.
    const runwayProfile = path.join(root, 'profiles', 'runway');
    writeFixture(runwayProfile, 'inventory.md', '## Items\n\n' +
      ['old', 'n1', 'n2'].map(id => '- id: ' + id + '\n  content: item ' + id + '\n  clearance: public\n').join('\n'));
    for (let i = 1; i <= 12; i++) {
      writeFixture(runwayProfile, 'runs/2026-03-' + String(i).padStart(2, '0') + '-r' + i + '/brief.md',
        'anchor: ' + (i === 1 ? 'old' : 'x' + i) + '\nstatus: shipped\n');
    }
    const rw = locks(runwayProfile);
    assert.strictEqual(rw.unlocked_count, 3, 'old fell out of the trailing 10, so all three are unlocked');
    assert.strictEqual(rw.runway_posts, 2, 'but old has been told, so it is not runway');
    assert.deepStrictEqual(rw.never_used_anchors, ['n1', 'n2'], 'runway names the untold ones');

    // An empty profile must not throw.
    const bare = path.join(root, 'profiles', 'bare');
    fs.mkdirSync(bare, { recursive: true });
    assert.strictEqual(locks(bare).shipped_pieces, 0, 'a fresh profile reads as zero, not an error');

    // ------------------------------------------------------ section 9's tells
    //
    // Every tell added at step 4 gets one assert. A tell in ai-tells.md that
    // no test can see is a rule the gate claims and does not keep, and the two
    // widened at step 4 were both live and inert until the fixture corpus made
    // them fire on nothing.
    const tellDir = path.join(root, 'tells');
    const firedIn = (body, short) => {
      const f = writeFixture(tellDir, 'draft.md', body);
      const lx = lexical(f, { short: short !== false });
      const st = stats(f, null);
      const out = lx.hits.map(h => h.tag).concat(st.flags.map(x => x.rule));
      if (lx.hashtags.stack) out.push('hashtag-stack');
      return out;
    };

    // Section 9 names two antithesis forms. "not" stands alone and "n't" is
    // glued to the verb, so one leading word boundary reaches only the first,
    // and the glued one is the form a model writes most.
    assert.ok(firedIn("It's not a process problem, it's a memory problem.\n").includes('antithesis'),
      'the "it is not X, it is Y" form fires');
    assert.ok(firedIn("This isn't just a tooling gap, it's a trust gap.\n").includes('antithesis'),
      'and so does the contracted one, which no leading word boundary reaches');
    assert.ok(firedIn('Speed isn' + APOS + 't the problem. Sequencing is.\n').includes('antithesis'),
      'and the second form section 9 names, with a curly apostrophe');
    assert.ok(!firedIn("I'm not sure, it's complicated.\n").includes('antithesis'),
      'but a person saying they are unsure is not this tell: the second clause ' +
      'has to open on a determiner or precision decays on every future draft');

    assert.ok(firedIn('We shipped late.\n\nThe result?\n\nNobody noticed.\n').includes('rhetorical-fragment'),
      'the named rhetorical fragment fires');
    assert.ok(firedIn('We shipped late.\n\nWhy?\n\nNobody wrote it down.\n').includes('rhetorical-fragment'),
      'and so does the shape, which is the half section 9 does not enumerate');
    assert.ok(!firedIn('We shipped late.\n\nMarch 2026:\n\nNobody wrote it down.\n').includes('rhetorical-fragment'),
      'a date used as a section marker is not rhetoric');

    assert.ok(firedIn('Acme shipped in March.\nThoughts?\n').includes('engagement-bait-close'),
      'engagement bait fires');
    assert.ok(firedIn("I've been thinking a lot about pipelines.\n").includes('thinking-opener'),
      'and the announcement that thinking occurred');
    assert.ok(firedIn('In many ways, Acme was right.\n').includes('hedged-opener'),
      'and a hedged opener');

    // Section 9's announcement register. This one was inert from step 3 until
    // the fixture corpus fired it on nothing: the tell opens a sentence nearly
    // every time it appears, and a lowercase-only match never saw that.
    assert.ok(firedIn('At Northwind, we believe data should work for people.\n')
      .includes('at-company-we-believe'), 'sentence-initial "At <Company>, we believe" fires');
    assert.ok(firedIn('Here at Northwind, we believe in shipping.\n')
      .includes('at-company-we-believe'), 'and so does the mid-sentence position');

    // Also inert from step 3. Section 9 quotes the adjacent form and a model
    // writes "but we also", so an adjacent-only match caught the version
    // nobody writes.
    assert.ok(firedIn('Not only did we miss the cleanup, but we also missed the schema.\n')
      .includes('not-only-but-also'), 'the drifted "but we also" form fires');
    assert.ok(firedIn('Not only the cleanup but also the schema.\n')
      .includes('not-only-but-also'), 'and the adjacent form section 9 quotes');

    assert.ok(firedIn('Three lessons:\n\n\u{1F680} ship fast\n\u2705 write it down\n')
      .includes('emoji-bullets'), 'an emoji opening a line is a bullet');

    // Section 9: every paragraph the same number of lines. The two-line floor
    // is the whole precision of this rule.
    assert.ok(firedIn('one here\ntwo here\n\nthree here\nfour here\n\nfive here\nsix here\n')
      .includes('uniform-paragraphs'), 'three paragraphs of two lines each fires');
    assert.ok(!firedIn('Acme shipped.\n\nNobody noticed.\n\nThat was March.\n')
      .includes('uniform-paragraphs'),
      'but one-line paragraphs throughout is a habit inspiration.md names as usable');

    // Section 9's texture pair, split at step 4. One tag covering both let a
    // fixture expecting fragments pass on the sentence-length half instead.
    const flat = 'Acme did not ship the integration in March 2026 because the team had not ' +
      'agreed on the sequence of the work, and it is now the second quarter that has ' +
      'passed without a decision from any of the people who were in that room.\n';
    assert.ok(firedIn(flat).includes('zero-contractions'), 'no contraction in 40+ words fires');
    assert.ok(firedIn(flat).includes('no-fragments'), 'and no sentence under 6 words');
    assert.ok(!firedIn(flat).includes('no-long-sentence'), 'but that sentence is over 25 words');
    assert.ok(!firedIn('It did not ship.\n').includes('zero-contractions'),
      'and four words without a contraction is evidence of nothing');

    // voice.md wins, per section 9's precedence. Someone who never contracts is
    // not producing a tell by continuing not to.
    const zeroCon = path.join(root, 'profiles', 'zerocon');
    writeFixture(zeroCon, 'voice.md',
      'avg_sentence_length: 20\nsentence_length_stdev: 8\ncontraction_rate: 0\nuses_fragments: no\n');
    const zcDraft = writeFixture(tellDir, 'flat.md', flat);
    assert.ok(!stats(zcDraft, zeroCon).flags.some(f => f.rule === 'zero-contractions'),
      'a measured rate of 0 in voice.md overrides the zero-contraction tell');

    assert.ok(firedIn('we grew 40% and we are proud of the whole team this quarter.\n')
      .includes('we-with-no-human'), 'first-person plural naming nobody fires');
    assert.ok(!firedIn('Acme grew 40% and we are proud of Dana for it.\n')
      .includes('we-with-no-human'), 'and naming one person clears it');

    // ------------------------------------------------------------- gate modes
    //
    // Section 13.2 step 4. The corpus that ships is the one under test, because
    // a synthetic corpus would prove the runner and not the gate.
    const gf = gateFixtures(path.join(__dirname, 'gate-fixtures'));
    assert.strictEqual(gf.errors.length, 0, 'no fixture is unlisted and no listed tell is unknown');
    assert.strictEqual(gf.fixtures, FIXTURE_COUNT, 'the corpus holds 20 posts');
    assert.ok(gf.deterministic_expected > 0, 'and expects something deterministic of them');
    assert.strictEqual(gf.deterministic_caught, gf.deterministic_expected,
      'every engine-owned expected catch fires');
    assert.strictEqual(gf.pass, true, 'so the corpus passes');

    const noCorpus = gateFixtures(path.join(root, 'no-such-corpus'));
    assert.strictEqual(noCorpus.pass, false,
      'and an empty corpus fails rather than passing on nothing, which is the ' +
      'shape "checked: 0" already got wrong once');

    // ai-tells.md and the TELLS table have to name the same set, or the file
    // documents a gate that is not the one running.
    const tl = gateTells(path.join(__dirname, 'ai-tells.md'));
    assert.strictEqual(tl.ai_tells_md, 'found', 'ai-tells.md ships');
    assert.deepStrictEqual(tl.missing_from_ai_tells_md, [], 'every tell in the table is documented');
    assert.deepStrictEqual(tl.missing_from_engine_js, [], 'and every documented tell is in the table');
    assert.strictEqual(tl.total, TELLS.length, 'the count is the table');
    assert.strictEqual(gateTells(path.join(root, 'nope.md')).pass, false,
      'and an absent ai-tells.md is a failure, not a clean table');

    // ---------------------------- voice.md's two readers, and their split
    //
    // One file, two parsers, opposite fence behaviour, and each is correct.
    // Nobody reading one can see the other, so the split is pinned from both
    // sides: unifying it empties either the negative control's corpus or
    // section 9's voice floor, and both failures are silent.
    const F = '`' + '`' + '`';
    const voiceBoth =
      '## The four measured values\n\n' +
      F + '\navg_sentence_length: 14\nsentence_length_stdev: 9\n' +
      'contraction_rate: 6\nuses_fragments: yes\n' + F + '\n\n' +
      '## Samples\n\n' +
      F + '\n- source: pasted\n  kind: <slack message>\n  text: |\n    <verbatim>\n' + F + '\n\n' +
      '- source: pasted\n  kind: slack message\n  text: |\n' +
      '    the deck was late. Dana found the error.\n';

    const vmBoth = voiceMeasures(voiceBoth);
    assert.strictEqual(vmBoth.avg_sentence_length, 14,
      'voiceMeasures reads a number typed inside the fence, because it never strips one');
    assert.strictEqual(vmBoth.uses_fragments, 'yes', 'and the same for the yes/no key');

    const vsBoth = voiceSamples(voiceBoth);
    assert.strictEqual(vsBoth.length, 1, 'while voiceSamples strips, so the schema example is not a sample');
    assert.ok(!vsBoth.some(x => x.text.includes('<verbatim>')),
      'the placeholder never reaches the corpus, which is what makes zero fires mean something');
    assert.ok(vsBoth[0].text.startsWith('the deck was late'), 'only the entry below the fence is read');

    // The template ships the four keys empty inside that fence, so a
    // first-match read returns null for every profile whose numbers were
    // appended below it rather than typed into it.
    const voiceTemplate =
      F + '\navg_sentence_length:\nsentence_length_stdev:\ncontraction_rate:\n' +
      'uses_fragments: yes | no\n' + F + '\n\n' +
      'avg_sentence_length: 17\nsentence_length_stdev: 11\n' +
      'contraction_rate: 4\nuses_fragments: no\n';
    const vmTemplate = voiceMeasures(voiceTemplate);
    assert.strictEqual(vmTemplate.avg_sentence_length, 17,
      'first parseable value wins over first match, or the placeholder is the baseline');
    assert.strictEqual(vmTemplate.uses_fragments, 'no', 'and "yes | no" is a prompt, not an answer');

    // The negative control. Zero fires is the pass bar, and an empty corpus is
    // not zero fires.
    const negProfile = path.join(root, 'profiles', 'negative');
    writeFixture(negProfile, 'voice.md',
      'avg_sentence_length: 14\nsentence_length_stdev: 9\ncontraction_rate: 6\nuses_fragments: yes\n');
    const negEmpty = gateNegative(negProfile);
    assert.strictEqual(negEmpty.samples, 0, 'no sample is on file');
    assert.strictEqual(negEmpty.pass, false, 'so the control passes on nothing and says so');
    assert.strictEqual(negEmpty.corpus, 'empty, no pasted sample on file', 'by name');

    writeFixture(negProfile, 'voice.md',
      'avg_sentence_length: 14\nsentence_length_stdev: 9\ncontraction_rate: 6\nuses_fragments: yes\n\n' +
      '## Samples\n\n' +
      '```\n- source: pasted\n  kind: <slack message>\n  text: |\n    <verbatim>\n```\n\n' +
      '- source: pasted\n  kind: slack message\n  text: |\n' +
      "    it's the third time this week. nobody read the notes.\n" +
      '    Dana found it in the end.\n');
    const negClean = gateNegative(negProfile);
    assert.strictEqual(negClean.samples, 1, 'the fenced schema is not a sample, the entry is');
    assert.deepStrictEqual(negClean.fires, [], 'and ordinary writing fires nothing');
    assert.strictEqual(negClean.pass, true, 'which is the pass bar');

    // A sample that does fire has to be reported, or the control cannot find
    // the rule bug it exists to find.
    writeFixture(negProfile, 'shipped-history.md',
      '- posted_at: 2025-11-02\n  text: |\n' +
      "    Let's unpack this. It's not a tooling gap, it's a trust gap.\n" +
      '    Dana said so in March.\n');
    const negFires = gateNegative(negProfile);
    assert.strictEqual(negFires.samples, 2, 'shipped-history.md is part of the control');
    assert.strictEqual(negFires.pass, false, 'and one fire on the person\'s own writing fails it');
    assert.ok(negFires.fires.some(f => f.fired.includes('banned') && f.fired.includes('antithesis')),
      'naming every rule that fired, because each one is a candidate to strike');

    // The hooks.md check. It is blocked rather than passing while the file is
    // absent, because passing an empty scan is how a CI check goes quiet.
    const hooksAbsent = gateHooks(path.join(root, 'hooks.md'));
    assert.strictEqual(hooksAbsent.pass, false, 'an absent hooks.md is blocked, not passed');
    assert.strictEqual(hooksAbsent.hooks_file, 'absent', 'and says which');

    // Section 13.2 names both of these: the gate bans them and they are both
    // natural hook shapes, so the library is where they leak in.
    const hooksBad = writeFixture(tellDir, 'hooks.md',
      '# Hooks\n\n## The correction\n\n> It' + APOS + 's not a process problem, it' + APOS +
      's a memory problem.\n\n## The drum roll\n\n> The result?\n');
    const hb = gateHooks(hooksBad);
    assert.strictEqual(hb.example_lines, 2, 'a blockquote line is an example line');
    assert.strictEqual(hb.violations.length, 2, 'and both of section 13.2\'s named patterns are caught');
    assert.strictEqual(hb.pass, false, 'so a library shipping them fails');

    const hooksOk = writeFixture(tellDir, 'hooks-ok.md',
      '# Hooks\n\n## The correction\n\n> The documentation was fine. The context was gone.\n');
    assert.strictEqual(gateHooks(hooksOk).pass, true, 'and a clean example line passes');
    assert.strictEqual(gateHooks(hooksOk).violations.length, 0, 'with nothing to report');

    // An example wrapping to a second line is one example, not two. Scanning
    // the halves separately is how the same banned pattern above ships anyway,
    // and hooks.md wraps its longer examples, so this is live rather than
    // hypothetical.
    //
    // Three lines rather than two, so the reported line number can be wrong.
    // On a two-line example the opening line and the closing index are the same
    // number by coincidence, and an assert against it proves nothing.
    const hooksWrap = writeFixture(tellDir, 'hooks-wrap.md',
      '# Hooks\n\n## The correction\n\n> It' + APOS + 's not a process\n> problem, it' + APOS +
      's a memory\n> problem here.\n');
    const hw = gateHooks(hooksWrap);
    assert.strictEqual(hw.example_lines, 1, 'a run of blockquote lines is one example');
    assert.strictEqual(hw.violations.length, 1, 'and the pattern across the breaks is caught');
    assert.strictEqual(hw.violations[0].line, 5, 'reported at the line the example opens on');
    assert.ok(/process problem, it/.test(hw.violations[0].text), 'joined with single spaces');

    // ---- gate --report ----
    //
    // Section 13.2 step 5's three logged values. Every fixture below isolates
    // one condition, because a draft that trips three rules cannot show which
    // of the three the report is actually reading.
    const REPBODY = 'I checked the numbers again on Monday morning, and the gap between ' +
      'what the forecast said and what the warehouse actually moved turned out to ' +
      'be wider than anyone in that room wanted to admit out loud.';
    const HELD = '\n\nIt didn' + APOS + 't hold.\n';
    const PT = 'anchor: a\nprivate_terms: ["Northwind"]\nstatus: drafted\n';
    let repN = 0;
    const rep = (body, brief) => {
      const d = path.join(root, 'rep' + (++repN));
      if (brief) writeFixture(d, 'brief.md', brief);
      return gateReport(writeFixture(d, 'draft.md', body), null);
    };

    const rClean = rep('Acme shipped 41 units.\n\n' + REPBODY + HELD);
    assert.strictEqual(rClean.gate_passes, true, 'a draft tripping nothing passes');
    assert.strictEqual(rClean.gate_catch_count, 0, 'with no catches');
    assert.deepStrictEqual(rClean.tags, [], 'and an empty tag list');
    assert.strictEqual(rClean.action, 'none', 'and nothing for the run to do');
    assert.strictEqual(rClean.rewrite_cap, 3, 'a short post gets the first whole bucket of bound 3');

    // Every sentence at or over 6 words with one over 25, so the fragment floor
    // fires alone. A flag changes no word, which is the one distinction in this
    // report that a reader can get backwards in both directions.
    const rFlag = rep('Acme shipped 41 units in March and nobody noticed.\n\n' + REPBODY +
      '\n\nIt didn' + APOS + 't hold up when the auditors came through in April.\n');
    assert.strictEqual(rFlag.gate_passes, true, 'a flag edits no word, so the gate still passes');
    assert.strictEqual(rFlag.action, 'flag', 'and the run is told there is something to read');
    assert.strictEqual(rFlag.flagged, 1, 'reported beside the pass rather than swallowed by it');
    assert.strictEqual(rFlag.gate_catch_count, 1, 'and counted, because a pass is not silence');
    assert.deepStrictEqual(rFlag.tags, ['no-fragments'], 'tagged by id, per section 13.2 step 5');

    // Each of the three failing verdicts alone. Section 9 gives them different
    // repairs, so a report that collapses any two of them sends the run to the
    // wrong one.
    const rReject = rep('Northwind shipped 41 units.\n\n' + REPBODY + HELD, PT);
    assert.strictEqual(rReject.action, 'reject', 'a private term rejects');
    assert.strictEqual(rReject.gate_passes, false, 'and cannot pass');
    assert.strictEqual(rReject.gate_catch_count, 1, 'counted, though it is not in hits');
    assert.deepStrictEqual(rReject.tags, ['private-terms'], 'and tagged, though it is not a rewrite');

    const rRedraft = rep('I did not check the numbers again on monday morning, and the gap ' +
      'between what the forecast said and what the warehouse actually moved turned out ' +
      'to be wider than anyone in that room wanted to admit out loud.' + HELD);
    assert.strictEqual(rRedraft.action, 'redraft', 'naming nothing is a redraft, not a rewrite');
    assert.strictEqual(rRedraft.gate_passes, false, 'and it fails the gate');
    assert.deepStrictEqual(rRedraft.tags, ['specifics-floor'], 'tagged alone');

    const rRewrite = rep('Acme shipped 41 units.\n\nI checked the robust numbers again on ' +
      'Monday morning, and the gap between what the forecast said and what the warehouse ' +
      'actually moved turned out to be wider than anyone in that room wanted to admit ' +
      'out loud.' + HELD);
    assert.strictEqual(rRewrite.action, 'rewrite', 'one banned word is a rewrite');
    assert.strictEqual(rRewrite.gate_passes, false, 'and an edit is a failure');
    assert.strictEqual(rRewrite.rewrites_required, 1, 'counted once');

    // Precedence. A draft that is both rejected and redrafted is rejected:
    // rewriting a disclosure only produces a better-written disclosure.
    const rBoth = rep('Northwind did not hold up.\n\nnothing else here names a thing or ' +
      'counts one, and the sentence runs on long enough that the floor for a long ' +
      'sentence does not fire on this draft either.\n\nIt didn' + APOS + 't work.\n', PT);
    assert.strictEqual(rBoth.action, 'reject', 'reject outranks redraft');
    assert.strictEqual(rBoth.gate_catch_count, 2, 'and both are still counted');

    // A stats finding is a redraft, not a rewrite. Three paragraphs of two lines
    // each, with nothing lexical in them, so the catch can only have come from
    // stats. This block asserted `rewrites_required: 1` and `action: 'rewrite'`
    // until 2026-08-24, which was the pre-inversion model: uniform paragraphs is
    // a property of the whole draft, there is no span to patch, and the tell
    // table now carries it as redraft. The intent of the assert is unchanged and
    // is now stated more precisely -- a catch with zero repairs proves the
    // finding came from the stats pass rather than the lexical one.
    const rUniform = rep('Acme shipped 41 units in March.\nIt didn' + APOS + 't hold.\n\n' +
      'The warehouse team checked every pallet against the manifest before the truck ' +
      'left the yard that afternoon and found nothing wrong with any of them at all.\n' +
      'Nobody said anything.\n\nI checked again on Monday.\nThe gap was still there.\n');
    assert.strictEqual(rUniform.lexical.rewrite_count, 0, 'nothing lexical in this draft');
    assert.strictEqual(rUniform.rewrites_required, 0, 'a redraft-class rule repairs nothing');
    assert.strictEqual(rUniform.gate_catch_count, 1, 'so the catch came from stats');
    assert.deepStrictEqual(rUniform.tags, ['uniform-paragraphs'], 'and names which stats rule');
    assert.strictEqual(rUniform.action, 'redraft', 'and it is a redraft, not a rewrite');
    assert.strictEqual(rUniform.gate_passes, false, 'a redraft is still a failure');

    // Bound 3's cap, and the semicolon rule, which is short-post scoped and is
    // therefore the rule the format argument is measured on, two blocks below.
    const rSemi = rep('Acme shipped 41 units.\n\nI checked the robust numbers again on ' +
      'Monday morning; the gap between what the forecast said and what the warehouse ' +
      'actually moved turned out to be wider than anyone in that room wanted to admit ' +
      'out loud.' + HELD);
    assert.deepStrictEqual(rSemi.tags, ['banned', 'semicolon'],
      'a report is read across runs, so the tag list is sorted and the semicolon fires');

    // Format is an argument, not an assumption. The semicolon is the one rule
    // scoped to short posts, so it is the only thing that can prove the flag
    // reached `lexical` rather than only the reported string. Same file, same
    // bytes, both ways round, because a format that changed only the label
    // would pass an assert on the label alone.
    const fmtDraft = writeFixture(path.join(root, 'repfmt'), 'draft.md',
      'Acme shipped 41 units.\n\nI checked the numbers again on Monday morning; the gap ' +
      'between what the forecast said and what the warehouse actually moved turned out to ' +
      'be wider than anyone in that room wanted to admit out loud.' + HELD);
    const fShort = gateReport(fmtDraft, null);
    const fLong = gateReport(fmtDraft, null, 'long');
    assert.strictEqual(fShort.format, 'short', 'an omitted format is short, which every caller relies on');
    assert.deepStrictEqual(fShort.tags, ['semicolon'], 'and a semicolon in a short post is a catch');
    assert.strictEqual(fShort.gate_passes, false, 'so the draft does not pass');
    assert.strictEqual(fLong.format, 'long', 'the report names the format it was asked for');
    assert.deepStrictEqual(fLong.tags, [], 'and the same semicolon in a long piece is not a catch');
    assert.strictEqual(fLong.gate_catch_count, 0, 'nothing left to count');
    assert.strictEqual(fLong.gate_passes, true, 'so the same bytes pass at the other format');
    assert.strictEqual(gateReport(fmtDraft, null, 'novella').format, 'short',
      'and an unknown format falls back to the stricter scope rather than retiring a rule');

    const rOver = rep('Acme shipped 41 units.\n\nI checked the robust numbers again on ' +
      'Monday morning, and the seamless gap between what the forecast said and what the ' +
      'warehouse actually moved turned out to be a testament to how they leverage that ' +
      'yard.' + HELD);
    assert.strictEqual(rOver.rewrites_required, 4, 'four banned words');
    assert.strictEqual(rOver.rewrite_cap, 3, 'against a cap of three');
    assert.strictEqual(rOver.over_cap, true, 'so bound 3 sends this one back to the brief');

    // A hashtag stack is not in `hits` and is still a rewrite. Before this
    // fixture existed the report said `gate_passes: false` and `action: none`,
    // which tells a run something is wrong and not what to do about it.
    const rTags = rep('Acme shipped 41 units.\n\n' + REPBODY + HELD +
      '\n#supplychain #ops #logistics\n');
    assert.strictEqual(rTags.gate_catch_count, 1, 'the stack is one catch');
    assert.deepStrictEqual(rTags.tags, ['hashtag-stack'], 'tagged');
    assert.strictEqual(rTags.rewrites_required, 1, 'and one rewrite, so bound 3 can see it');
    assert.strictEqual(rTags.action, 'rewrite', 'with something for the run to actually do');

    // An empty draft.md is a real state: a crash between step 3 and step 4
    // leaves one. The cap keeps its first bucket rather than going to zero.
    const rEmpty = rep('');
    assert.strictEqual(rEmpty.words, 0, 'an empty draft measures zero words');
    assert.strictEqual(rEmpty.rewrite_cap, 3, 'and still reports a usable cap');

    // The cap is a rate, and the second bucket is where the arithmetic shows.
    const repLong = writeFixture(path.join(root, 'replong'), 'draft.md',
      'Acme moved 41 units in March. ' +
      ('The warehouse team checked every pallet against the manifest before the ' +
       'truck left the yard that afternoon. ').repeat(12));
    const rl = gateReport(repLong, null);
    assert.ok(rl.words > 200, 'fixture is past the first bucket');
    assert.strictEqual(rl.rewrite_cap, 6, 'so the cap is two buckets, not one');
    assert.strictEqual(rl.model_owned.length, 12, 'and the judged tells are named, not implied clean');

    // ---------------------------------------------- gate --report: lock 5
    //
    // Section 3's only hard fail, and until this call site existed it had
    // none: step 2 defers it for want of a draft and step 6 is visual only, so
    // a short post cleared lock 5 by never being checked against it. All three
    // states are pinned, because the dangerous one is the third.
    const lock5 = path.join(root, 'profiles', 'lock5');
    const LOCKRUN = 'the shadow spreadsheet is where the real planning happens every single week here';
    writeFixture(lock5, 'runs/2026-03-02-prior/shipped.md',
      'Nobody wrote any of it down at the time.\n\n' + LOCKRUN + '.\n');
    writeFixture(lock5, 'inventory.md',
      '## Items\n\n- id: unrelated\n  content: A different sentence about pallets.\n' +
      '  clearance: public\n');
    const lock5Draft = writeFixture(path.join(root, 'replock5'), 'draft.md',
      'Acme shipped 41 units in March 2026.\n\n' + LOCKRUN + '.\n\n' + REPBODY + HELD);

    const rOv = gateReport(lock5Draft, lock5);
    assert.strictEqual(rOv.overlap.ran, true, 'a profile is a corpus, so lock 5 runs');
    assert.strictEqual(rOv.overlap.failures.length, 1, 'a run repeated from a shipped prior is one span');
    assert.strictEqual(rOv.overlap.failures[0].prior, '2026-03-02-prior', 'named by the prior it came from');
    assert.strictEqual(rOv.overlap.pass, false, 'so lock 5 fails');
    assert.strictEqual(rOv.gate_passes, false, 'and section 3 calls that a hard fail of the gate');
    assert.strictEqual(rOv.action, 'redraft',
      'repeating yourself verbatim is fixed at the brief, so it is a redraft and not a rewrite');
    assert.strictEqual(rOv.overlap_priors_compared, 1, 'against a corpus whose size is on the surface');
    assert.deepStrictEqual(rOv.tags, [], 'lock 5 is not a tell, so it does not enter the tag list');
    assert.strictEqual(rOv.gate_catch_count, 0,
      'nor the tell count, which is why the overlap block is read and not inferred from these');

    // The same span, now traceable to an inventory item. Section 13.1 cites it
    // instead of failing it, and a citation that failed the gate is how the
    // person ends up turning the check off.
    writeFixture(lock5, 'inventory.md',
      '## Items\n\n- id: shadow-spreadsheet\n  content: ' + LOCKRUN + '.\n  clearance: public\n');
    const rOvWarn = gateReport(lock5Draft, lock5);
    assert.strictEqual(rOvWarn.overlap.failures.length, 0, 'nothing left to fail');
    assert.strictEqual(rOvWarn.overlap.warnings.length, 1, 'the span is still cited');
    assert.strictEqual(rOvWarn.overlap.pass, true, 'and lock 5 clears');
    assert.strictEqual(rOvWarn.gate_passes, true, 'so a warning does not fail the gate');
    assert.strictEqual(rOvWarn.action, 'none', 'and sends the run nowhere');

    // No profile, no corpus. This must not read as a clean lock 5, which is
    // the same failure shape as "fires: 0" over an empty negative control.
    assert.strictEqual(rClean.overlap.ran, false, 'without a profile there is nothing to compare against');
    assert.ok(!('pass' in rClean.overlap), 'so the block carries no verdict at all');
    assert.ok(/did not run/.test(rClean.overlap.reason), 'and says so in words a report can quote');
    assert.strictEqual(rClean.overlap_priors_compared, null,
      'null is not zero here: zero priors is a comparison, null is the absence of one');

    // ------------------------------------- the false-positive half of step 4
    //
    // Section 12.1 metric 4 is the false-positive rate, and section 9 says a
    // rule that is wrong costs a rewrite of good writing on every future draft
    // forever. Every narrowing below is a promise, so every narrowing gets an
    // assert that fails if it is widened back.
    assert.ok(!firedIn('at least, we believe the number was wrong.\n')
      .includes('at-company-we-believe'),
      'the capital after "at" is what separates a company from a preposition');
    assert.ok(!firedIn('We shipped it.\n\nWhat we learned:\n\nNobody read it.\n')
      .includes('rhetorical-fragment'),
      'section 9 says one word or two, and three is a real subheading');
    assert.ok(!firedIn('The chart went up 40% last quarter \u{1F680} and nobody noticed.\n')
      .includes('emoji-bullets'), 'an emoji inside a sentence is not a bullet');
    assert.ok(!firedIn('one here\ntwo here\n\nthree here\nfour here\n')
      .includes('uniform-paragraphs'), 'two matching paragraphs is a coincidence');
    assert.ok(!firedIn('one here\ntwo here\n\nonly one\n\nthree here\nfour here\nfive here\n')
      .includes('uniform-paragraphs'),
      'and every paragraph has to match, not merely one of them');
    assert.ok(!firedIn('the deck was late and nobody read it before the meeting started.\n')
      .includes('we-with-no-human'),
      'a post naming nobody and claiming nothing collectively is not the announcement tell');
    assert.ok(firedIn('The result? Nobody at Acme noticed for a week.\n')
      .includes('rhetorical-fragment'),
      'the named phrase fires inline too, where the standalone-line shape cannot see it');

    // --------------------------------------------- the gate's own error paths
    //
    // The shipping corpus is clean by construction, so it cannot exercise a
    // miss, an unknown id, an unlisted file, or a row pointing at nothing. A
    // recall number that cannot report a miss is not a recall number.
    const synth = path.join(root, 'synth');
    writeFixture(synth, '01.md', 'Acme shipped in March 2026 and nobody wrote it down.\n');
    writeFixture(synth, '02.md', 'Contoso did the same in April, and Dana noticed it first.\n');
    writeFixture(synth, '04.md', 'Listed nowhere.\n');
    writeFixture(synth, 'expected.md',
      '01: em-dash                              # 01.md has none, so this is a miss\n' +
      '02: announcement-shape, not-a-real-tell  # judged, plus an id that exists nowhere\n' +
      '03: em-dash                              # no 03.md on disk\n');
    const sy = gateFixtures(synth);
    assert.strictEqual(sy.deterministic_expected, 1, 'only the engine-owned row is scored');
    assert.strictEqual(sy.deterministic_caught, 0, 'and a tell the post lacks is a miss');
    assert.strictEqual(sy.judged_expected, 1, 'the judged row is counted apart from it');
    assert.deepStrictEqual(sy.per_fixture.find(r => r.fixture === '01.md').missed, ['em-dash'],
      'the miss is named, not just totalled');
    assert.deepStrictEqual(sy.per_fixture.find(r => r.fixture === '02.md').expected_engine, [],
      'a judged tell is never scored as engine work, or the recall number is a lie');
    assert.ok(sy.errors.some(e => e.startsWith('04.md') && /no row/.test(e)),
      'a fixture with no row is an error');
    assert.ok(sy.errors.some(e => e.startsWith('03.md') && /absent/.test(e)),
      'and so is a row with no fixture');
    assert.ok(sy.errors.some(e => /not-a-real-tell/.test(e)),
      'and an id in neither ai-tells.md nor the table');
    assert.strictEqual(sy.pass, false, 'so none of that passes');

    // Section 13.2 asks for 20. A corpus that catches everything it claims and
    // holds one post is still not the corpus the step needs.
    const oneOnly = path.join(root, 'onefixture');
    writeFixture(oneOnly, '01.md',
      'It' + APOS + 's not a tooling gap, it' + APOS + 's a trust gap. Dana said so in March.\n');
    writeFixture(oneOnly, 'expected.md', '01: antithesis\n');
    const oo = gateFixtures(oneOnly);
    assert.deepStrictEqual(oo.errors, [], 'the rows are clean');
    assert.strictEqual(oo.deterministic_caught, oo.deterministic_expected, 'and the tell fires');
    assert.strictEqual(oo.pass, false, 'and one post is still not twenty');

    // ------------------------------------------------- drift, in both directions
    //
    // ai-tells.md is where a tell is read and engine.js is where it fires. One
    // holding an entry the other does not is the failure that makes the
    // document describe a gate other than the one running.
    const driftExtra = writeFixture(root, 'drift-extra.md',
      TELLS.map(x => '### ' + x.id).join('\n\n') + '\n\n### invented-tell\n');
    const de = gateTells(driftExtra);
    assert.deepStrictEqual(de.missing_from_ai_tells_md, [], 'every implemented tell is documented');
    assert.deepStrictEqual(de.missing_from_engine_js, ['invented-tell'],
      'and a documented tell nothing implements is named');
    assert.strictEqual(de.pass, false, 'which is drift');

    const driftShort = writeFixture(root, 'drift-short.md',
      TELLS.slice(1).map(x => '### ' + x.id).join('\n\n') + '\n');
    const ds = gateTells(driftShort);
    assert.deepStrictEqual(ds.missing_from_ai_tells_md, [TELLS[0].id],
      'and an implemented tell nobody documented');
    assert.strictEqual(ds.pass, false, 'which is drift the other way');

    const hooksEmpty = writeFixture(tellDir, 'hooks-empty.md', '# Hooks\n\nNothing yet.\n');
    const he = gateHooks(hooksEmpty);
    assert.strictEqual(he.example_lines, 0, 'no blockquote is no example line');
    assert.strictEqual(he.pass, false,
      'and a check that scanned nothing reports blocked, not clean');

    // ------------------------------------ what the negative control has to see
    const neg2 = path.join(root, 'profiles', 'negative2');
    writeFixture(neg2, 'voice.md',
      'avg_sentence_length: 14\nsentence_length_stdev: 9\ncontraction_rate: 6\n' +
      'uses_fragments: yes\n\n## Samples\n\n' +
      // voice.md's Habits section marks its entries source: derived. Reading one
      // as a pasted sample measures the engine's summary of the person instead
      // of the person, which is the one thing this control cannot afford.
      '- source: derived\n  text: |\n    opens mid story; leans on fragments.\n\n' +
      '- source: pasted\n  kind: linkedin post\n  text: |\n' +
      '    the deck was late; nobody read it.\n    Dana found the error.\n');
    const n2 = gateNegative(neg2);
    assert.strictEqual(n2.samples, 1, 'a derived habit is not a pasted sample');
    assert.strictEqual(n2.posts, 1, 'and kind: is read, or nothing is ever a post');
    assert.ok(n2.fires.some(f => f.fired.includes('semicolon')),
      'section 9 bans semicolons in short posts, so a post-kind sample is scanned for them');

    // Stats findings do not fail the control, and after the 2026-08-24 inversion
    // that is a property of the tell table rather than a concession. This block
    // asserted the opposite -- that a rewrite-action flag from stats fails the
    // control -- on the reasoning that reading all of stats as exempt would
    // silently retire section 9's texture rules from it. The reasoning was right
    // and the case it guarded is now unreachable: every rewrite-class rule is
    // mechanical and lexical, so no stats rule can produce one. The assert below
    // pins that invariant at the table, which is where it can actually break: add
    // a rewrite-class rule that statsText produces and this fails loudly instead
    // of quietly widening what the negative control forgives.
    const neg3 = path.join(root, 'profiles', 'negative3');
    writeFixture(neg3, 'shipped-history.md',
      '- posted_at: 2025-09-01\n  text: |\n' +
      '    the review slipped again\n    nobody owned the date\n\n' +
      '    the deck was ready\n    the decision was not\n\n' +
      '    that was the whole quarter\n    and it repeated in the next one\n');
    const n3 = gateNegative(neg3);
    assert.ok(!n3.fires.some(f => f.fired.includes('uniform-paragraphs')),
      'uniform paragraphs is redraft-class, so it does not fail the control');
    assert.ok(n3.also_flagged.some(f => f.rule === 'uniform-paragraphs'),
      'it is reported instead, because a redraft edits no word they wrote');
    assert.ok(!n3.fires.some(f => f.fired.includes('specifics-floor')),
      'because section 13.2 counts rewrites, and a redraft edits nothing');

    // blockItems: a heading after the last field is not a continuation of it.
    const bi = blockItems(
      '## suppressed\n\n- rule: em-dash\n  fired: 36\n  sample: voice.md:2\n\n' +
      '## baselines\n\nburstiness: 0.71\n', 'rule');
    assert.strictEqual(bi.length, 1, 'one suppression parsed');
    assert.strictEqual(bi[0].sample, 'voice.md:2',
      'a continuation line must be indented, or the next heading lands in the ' +
      'field and a suppression cites evidence that does not exist');

    // The invariant that makes the three asserts above true rather than lucky.
    assert.deepStrictEqual(
      TELLS.filter(t => t.action === 'rewrite').map(t => t.id).sort(),
      ['banned-lexicon', 'em-dash', 'emoji-bullets', 'en-dash', 'hashtag-stack',
       'semicolon', 'title-case-header'],
      'the repair class is exactly section 9\'s mechanical rules: a rule that ' +
      'cannot restructure a sentence. Adding one here means deciding what it ' +
      'does to the negative control and to gate-calibration.md suppression');

    return {
      check: 'test',
      pass: true,
      subcommands: ['overlap', 'lexical', 'stats', 'locks', 'gate'],
    };
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
      return lexical(need(args[0], 'draft'), {
        short: flags.short,
        // A profile is optional here and is what makes a suppression visible to
        // the per-check command. Without it this command would report a rule
        // firing that `gate --report` on the same draft says is suppressed.
        calibration: readCalibration(args[1] ? need(args[1], 'profile directory') : null),
      });
    case 'stats':
      return stats(need(args[0], 'draft'), args[1] ? need(args[1], 'profile directory') : null);
    case 'locks':
      return locks(need(args[0], 'profile directory'));
    case 'gate': {
      const here = f => path.join(__dirname, f);
      if (rest.includes('--report')) {
        return gateReport(need(args[0], 'draft'), args[1] || null,
          rest.includes('--long') ? 'long' : 'short');
      }
      if (rest.includes('--compare')) {
        return gateCompare(need(args[0], 'first draft'), need(args[1], 'redraft'),
          args[2] || null, rest.includes('--long') ? 'long' : 'short');
      }
      if (rest.includes('--tells')) return gateTells(args[0] || here('ai-tells.md'));
      if (rest.includes('--hooks')) return gateHooks(args[0] || here('hooks.md'));
      if (rest.includes('--negative')) return gateNegative(need(args[0], 'profile directory'));
      return gateFixtures(need(args[0] || here('gate-fixtures'), 'fixtures directory'),
        args[1] || null);
    }
    case 'test':
      return selfTest();
    default:
      die('usage: engine.js overlap|lexical|stats|locks|gate|test (see the header)');
  }
}

if (require.main === module) {
  process.stdout.write(JSON.stringify(main(process.argv.slice(2)), null, 2) + '\n');
}

module.exports = {
  overlap, lexical, stats, locks, measure, selfTest,
  gateFixtures, gateNegative, gateHooks, gateTells, gateReport, gateCompare,
  parseCalibration, readCalibration, TELLS,
};
