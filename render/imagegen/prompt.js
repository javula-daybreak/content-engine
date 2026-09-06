/**
 * prompt.js — parsed spec + theme.json -> one prompt string.
 *
 * Pure. No network, no filesystem, no process. Everything here is a function of
 * its arguments, which is what lets tests/test_prompt.js run for free on every
 * change (design spec section 9).
 *
 * THE CODE WINS. reference/prompts-infographic.md and
 * reference/prompts-carousel.md document the recipes below; if the two disagree,
 * re-derive the markdown from RECIPES, the same rule
 * render/carousel/reference/archetypes.md already states about render.py.
 */

'use strict';

// --------------------------------------------------------------------------- //
// spec parsing — a port of parse_spec() from both retired render.py files
// --------------------------------------------------------------------------- //

// Keys whose `key:` line opens a `- ` bullet list. The union of the two retired
// parsers' LIST_KEYS: one parser serves both formats because the grammar is one
// grammar, and a key that never appears in a format costs nothing.
//
// `sections`, `observations`, `quadrants` and `notes` are FOUR MORE than the
// retired parsers carried. Every shipped example writes them as one
// semicolon-separated scalar, which still parses (as a one-element list), but
// the retired parsers routed any `- ` bullet under them into `items` instead,
// silently corrupting the item count on four archetypes that require both.
// They are list-shaped in `REQUIRED`, so they are list keys here.
const LIST_KEYS = new Set(['items', 'left', 'right', 'col1', 'col2', 'col3',
  'stats', 'sections', 'observations', 'quadrants', 'notes']);

// `left:` / `right:` carry a title on the `key: value` line and collect their
// bullets separately, which is the one place the carousel grammar diverges.
const SIDE_KEYS = new Set(['left', 'right']);

/** Parse spec text into { meta, blocks }. */
function parseSpec(text) {
  text = String(text).replace(/\r\n/g, '\n');
  const meta = {};
  let body = text;
  const m = /^---\n([\s\S]*?)\n---(?:\n([\s\S]*))?$/.exec(text);
  if (m) {
    for (const line of m[1].split('\n')) {
      if (line.includes(':') && !line.trim().startsWith('#')) {
        const i = line.indexOf(':');
        meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
      }
    }
    body = m[2] || '';
  }

  const blocks = [];
  let cur = null;
  let curList = null;
  for (const raw of body.split('\n')) {
    const line = raw.replace(/\s+$/, '');
    if (line.startsWith(':: ')) {
      cur = { archetype: line.slice(3).trim() };
      blocks.push(cur);
      curList = null;
      continue;
    }
    if (cur === null) continue;
    if (line.trim().startsWith('#')) continue;
    if (line.trim().startsWith('- ')) {
      const target = curList && LIST_KEYS.has(curList)
        ? (SIDE_KEYS.has(curList) ? curList + '_items' : curList)
        : 'items';
      (cur[target] = cur[target] || []).push(line.trim().slice(2).trim());
      continue;
    }
    if (line.includes(':')) {
      const i = line.indexOf(':');
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();
      if (LIST_KEYS.has(k)) {
        curList = k;
        if (SIDE_KEYS.has(k)) {
          cur[k + '_title'] = v;
          cur[k + '_items'] = cur[k + '_items'] || [];
        } else {
          cur[k] = cur[k] || [];
          if (v) cur[k].push(v);
        }
      } else {
        cur[k] = v;
        curList = null;
      }
    }
  }
  return { meta, blocks };
}

// --------------------------------------------------------------------------- //
// archetype recipes
// --------------------------------------------------------------------------- //
//
// One geometry sentence plus the structure-honesty clause the form asserts, read
// off content-engine-VISUALS.md section 3 (infographics) and
// render/carousel/reference/archetypes.md (carousel slides). The honesty clause
// is in the prompt rather than only in the gate because a model that is told
// what the geometry claims draws a geometry that claims it.

const RECIPES = {
  infographic: {
    '_smoke': 'A single centred headline on an empty field. Nothing else.',
    'numbered-steps': 'Ordered numbered rows down the canvas, one row per step, each row a large numeral, a bold step label and a detail line, with small pill-shaped chips for the sub-items. Equal row heights. The order is the claim: the rows read strictly top to bottom.',
    'card-grid': 'A grid of equal rectangular cards, two or three across, one card per item, each holding a short bold title over a short body. Equal card sizes assert that every item is a peer of every other; nothing may look ranked.',
    'comparison-panel': 'Two or three vertical columns of equal width under coloured header cells, with a shared row rail down the left naming each dimension, and one full-width merged row for the shared-ground answer. A symmetric grid promises a balanced comparison, so neither column may be drawn as the loser.',
    'icon-list': 'A dense two-column list of short items, each a small monoline glyph, a bold title and a one-line description. Flat, unranked, no numerals.',
    'funnel': 'Stacked horizontal bands narrowing from top to bottom, one band per stage, each band a bold label and a detail line. The narrowing claims filtering: each band must be visibly narrower than the one above it, and the widths must track the stated values where values are given.',
    'hybrid-playbook': 'A band of two to four large hero numbers across the top, each with a short label, over a grid of titled sections beneath. The numbers are the payload and carry the visual weight.',
    'annotated-diagram': 'One central labelled object with four to six leader lines radiating to short titled callouts. Leader lines start inside the central shape and cross its edge rather than stopping at the outline.',
    'perception-split': 'Two stacked panels split by a rule that bleeds to both canvas edges. The top panel holds one simple shape with a single statement; the bottom panel holds the same shape subdivided, with five leader-lined items. The asymmetry is the content: one label above, five below, never matched counts.',
    'causal-chain': 'A left-to-right chain of four or five labelled nodes joined by arrows, terminating in a distinct terminal node holding the felt cost. Each arrow asserts necessity, so the chain is a single thread with no branching and no converging inputs.',
    'trend-poster': 'One line chart on a plot canvas, a single series, y-axis starting at zero with four or five tick labels set large enough to survive a thumbnail, x labels short. The late inflection in the curve is the point and must be visible in silhouette.',
    'distribution-strip': 'One horizontal axis with a dot per observation and slight vertical jitter, a labelled vertical rule at the reference value, and only the two extreme observations annotated. Nothing else on the plot.',
    'ranked-bars': 'Horizontal bars sorted longest first, no axis line, no gridlines, no tick labels and no legend. Values sit inside the right end of each bar. The ragged right edge is the payload, so the length differences must be plainly visible.',
    'composition-split': 'One full-width horizontal stacked bar of two to five named parts, the leading segment in the accent and the rest in luminance steps of a single hue, with the labels in a two-column list below the bar. Never a pie and never a donut. The bar asserts exhaustiveness: the segments fill the whole width.',
    'variance-bridge': 'A waterfall of floating bars stepping from the start value to the end value, connector rules between bar tops, positive and negative contributions in two different hues, the payoff bar in the accent. Start and end bars are grounded at zero and everything between floats.',
    'sourced-shelf': 'Three tinted horizontal bands, each headed by a question in the reader\'s voice, each holding three cards. Each card sets the publisher name as its largest element, then the title, then the one-line finding. Grouping is by stepping one hue through three luminances, never by drawing boxes.',
    'analogy-rows': 'Three to five rows, each with the term and a short equation pill on the left and two short facts on the right, identical slot order in every row. A monoline glyph appears only where the silhouette distinguishes the row. No photographic or hand-drawn illustration.',
    'quadrant-map': 'A two-axis cross filling the canvas, the four quadrants named in large type, items plotted as small labelled dots. Every quadrant holds at least one item. The four quadrant names carry the payload and are set large enough to survive a thumbnail.',
    'stratified-container': 'One container shape divided into three to five ordered horizontal strata, each stratum holding a wrapping cluster of small text chips, with the stratum widths tracking the chip counts. At least one boundary differs in weight or style from the others. Author notes sit in a typographically distinct voice, clearly separated from the taxonomy.',
    'mirrored-rings': 'Three concentric arcs split at a horizontal equator, the good state above and its failure twin below, ordinal numbers 1, 2, 3 on the layers. Chip counts increase strictly outward because ring area grows with the square of the radius. Chips over a tinted field are translucent, not opaque.',
  },
  carousel: {
    'cover': 'A dark full-bleed slide. An oversized headline occupying the upper two thirds, a small uppercase letter-spaced eyebrow label above it, one lead line under a short rule, and a small swipe cue at the bottom edge.',
    'statement': 'A light slide. A small uppercase kicker with an accent tick, one large headline, one lead line, an optional short bullet list, and a closing note in muted type.',
    'bullets': 'A light slide. Kicker, large headline, then a flat bullet list of peer points at even spacing. No numerals and no ranking; the points are equals.',
    'compare': 'A light slide. Kicker and headline over two cards side by side, the right card filled with the accent colour. Each card carries a title and a short list. The winning side is the right card.',
    'before-after': 'A light slide. Kicker and headline over two columns, each a title over one short paragraph rather than a list, the right column set in the accent colour. The shift across time is the claim.',
    'stat': 'A light slide. One giant centred figure filling the middle of the canvas, a supporting caption line beneath it, an optional small sub-line, and a kicker at the top. No headline line renders; the number is the hero.',
    'steps': 'A light slide. Kicker and headline over numbered rows, auto-numbered from one, each row a bold label and a detail line. Equal row heights, strict top-to-bottom order.',
    'cta': 'A dark full-bleed slide. An eyebrow label, a headline that re-lands the claim, optional short points, and one small accent chip only where a destination is given.',
    'quote-spotlight': 'A light slide. One oversized quote set vertically centred behind a large accent quotation glyph, with a thick accent bar to its left and the attribution line beneath in the accent colour.',
    'image-bg': 'The supplied reference photograph fills the slide edge to edge, under a gradient scrim for legibility, with a short headline and one lead line over the scrim.',
    'index': 'A light slide. A list of section titles, each preceded by a two-digit accent numeral, generously spaced. One column up to six items, two balanced columns past six.',
    'logo-wall': 'A light slide. A grid of text labels, each centred in a subtly bordered tinted card. Two columns up to four labels, three columns past that. Text labels only; no company logos and no invented marks.',
  },
};

// --------------------------------------------------------------------------- //
// field rendering
// --------------------------------------------------------------------------- //

// Keys that steer the layout rather than print on the canvas. Anything else in a
// block is canvas text and goes under the verbatim contract. Kept as one small
// set rather than a per-archetype field map, because a per-archetype map is a
// second copy of the catalog and a second place for it to go stale.
const DIRECTIVE_KEYS = new Set(['archetype', 'theme', 'aspect', 'title', 'bg',
  'scrim', 'image', 'track', 'container', 'anonymize', 'divider_y_pct',
  'tint_ramp', 'positive_ramp', 'negative_ramp', 'divider_style',
  'y_axis_max', 'y_tick_count',
  // The seven the shipped examples actually use. Missing here until 2026-09-06,
  // so `highlight: 1` printed the literal line `HIGHLIGHT: "1"` onto the canvas
  // on seven of the nineteen examples. The five names above them are VISUALS §3
  // vocabulary that no example writes: accepted and ignored, so a spec written
  // from the old doc degrades to a plain render instead of a captioned one.
  'highlight', 'leader', 'payoff', 'break_after', 'y_max', 'ticks', 'unit']);

const isDirective = k => DIRECTIVE_KEYS.has(k) || k.endsWith('_index');

// A directive is not canvas text, but most of these still have to reach the
// model or the layout they name never happens: `container: iceberg` was being
// dropped, so every stratified-container render got the generic recipe. One
// sentence each, emitted under LAYOUT rather than under the verbatim contract.
const DIRECTIVE_TEXT = {
  highlight: v => `Item ${v} is the one emphasised object: set it in the accent colour and leave every other item in ink.`,
  leader: v => `Segment ${v} is the leading share: set it in the accent colour.`,
  payoff: v => `Bar ${v} is the payoff bar: set it in the accent colour and seat it on the baseline, not floating.`,
  break_after: v => `Break the chain after link ${v}: that one gap is where the sequence stops, and it carries the break label.`,
  container: v => `The containing shape is: ${v}.`,
  y_max: v => `The value axis tops out at ${v}, above the highest datum, never equal to it.`,
  ticks: v => `Draw ${v} value-axis gridlines, each with its number.`,
  unit: v => `Suffix every number printed on the plot with ${JSON.stringify(String(v))}.`,
  anonymize: v => (/^(true|yes|1)$/i.test(String(v).trim())
    ? 'Print no numeric values on the plot: the shape of the spread is the whole claim.'
    : null),
};

// Canvas text in a stable order, so a prompt is reproducible from a spec and a
// diff between two prompts is readable. Unlisted keys follow in spec order.
const FIELD_ORDER = ['eyebrow', 'kicker', 'headline', 'headline_naive',
  'naive_headline', 'headline_real', 'real_headline', 'stat', 'sub', 'subtitle',
  'body', 'caption', 'lead', 'quote', 'attribution', 'expectation', 'center',
  'start', 'end', 'x_axis', 'y_axis', 'good_label', 'bad_label',
  'reference_value', 'reference_label', 'naive_callout', 'naive_statement',
  'punchline', 'terminal_cost', 'break_label', 'cue', 'cta', 'left', 'right',
  'col1', 'col2', 'col3', 'quadrants', 'sections', 'stats', 'items',
  'observations', 'series', 'notes', 'note', 'footer', 'wordmark'];

/** Strip `**...**` markers and report which phrases they marked. */
function splitAccent(s) {
  const spans = [];
  const text = String(s == null ? '' : s).replace(/\*\*(.+?)\*\*/g, (_, inner) => {
    spans.push(inner);
    return inner;
  });
  return { text, spans };
}

/** One item line -> a quoted, part-labelled string. */
function renderItem(raw) {
  const { text } = splitAccent(raw);
  const icon = /^\s*\[([^\]]+)\]\s*/.exec(text);
  const rest = icon ? text.slice(icon[0].length) : text;
  const parts = rest.split('|').map(p => p.trim()).filter(Boolean);
  const out = [];
  parts.forEach((part, i) => {
    if (part.includes(';')) {
      const subs = part.split(';').map(s => s.trim()).filter(Boolean);
      // `;` inside a piped compound field separates that field's sub-items. On
      // a field with no pipe (`sections:`, `notes:`, `quadrants:`) it separates
      // the field's own top-level entries, and calling those "sub-items" tells
      // the model to nest three section headings under nothing.
      out.push((parts.length > 1 ? 'sub-items ' : '')
        + subs.map(s => JSON.stringify(s)).join(', '));
    } else {
      out.push((i === 0 ? '' : 'then ') + JSON.stringify(part));
    }
  });
  return (icon ? `glyph ${icon[1]}, ` : '') + out.join('; ');
}

/** A block's layout directives, as instruction lines. Never canvas text. */
function directiveLines(block) {
  const out = [];
  for (const k of Object.keys(block)) {
    const fn = DIRECTIVE_TEXT[k];
    if (!fn) continue;
    const v = block[k];
    if (v == null || v === '') continue;
    const line = fn(v);
    if (line) out.push(line);
  }
  return out;
}

/** A block's canvas text, as prompt lines, plus every accent phrase found. */
function textLines(block) {
  const keys = Object.keys(block).filter(k => !isDirective(k));
  keys.sort((a, b) => {
    const ia = FIELD_ORDER.indexOf(a);
    const ib = FIELD_ORDER.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const lines = [];
  const accents = [];
  for (const k of keys) {
    const v = block[k];
    if (v == null || v === '' || (Array.isArray(v) && v.length === 0)) continue;
    const label = k.toUpperCase().replace(/_/g, ' ');
    if (Array.isArray(v)) {
      v.forEach((item, i) => {
        accents.push(...splitAccent(item).spans);
        lines.push(`${label} ${i + 1}: ${renderItem(item)}`);
      });
    } else {
      const { text, spans } = splitAccent(v);
      accents.push(...spans);
      lines.push(`${label}: ${JSON.stringify(text)}`);
    }
  }
  return { lines, accents };
}

// --------------------------------------------------------------------------- //
// the prompt
// --------------------------------------------------------------------------- //

// theme.json's font strings are CSS stacks. The model needs an adjective, not a
// stack, so the first family name decides serif vs sans and nothing else is read.
// Order matters: "sans-serif" contains "serif", and a monospace stack usually
// names a proportional fallback before it.
function faceAdjective(stack) {
  const s = String(stack || '').toLowerCase();
  if (/mono/.test(s)) return 'monospace';
  if (/sans/.test(s)) return 'sans-serif';
  if (/serif/.test(s)) return 'serif';
  return 'sans-serif';
}

const CANVAS_W = 1152;
const CANVAS_H = 1536;

/**
 * Build the prompt for one image.
 *
 * opts: { format, block, meta, theme, note, slide: {index, count} }
 * `note` is the extra constraint a failed visual check adds on a retry
 * (design spec section 5.2). It is appended last so it outranks nothing and
 * qualifies everything above it.
 */
function buildPrompt(opts) {
  const { format, block, meta = {}, theme = {}, note = '', slide = null } = opts;
  const arch = block.archetype;
  const recipe = (RECIPES[format] || {})[arch];
  if (!recipe) {
    throw new Error(`no prompt recipe for ${format} archetype '${arch}'`);
  }

  const { lines, accents } = textLines(block);
  const meta_lines = [];
  for (const k of ['wordmark', 'footer']) {
    if (meta[k] && !(k in block)) {
      meta_lines.push(`${k.toUpperCase()}: ${JSON.stringify(meta[k])}`);
    }
  }

  const what = format === 'carousel'
    ? `slide ${slide ? slide.index : 1} of ${slide ? slide.count : 1} of a LinkedIn carousel`
    : 'a single LinkedIn infographic';

  const p = [];
  p.push(`Produce ${what}: one finished ${CANVAS_W}x${CANVAS_H} portrait image, 3:4, flat editorial vector design, print quality.`);
  p.push('');
  p.push('PALETTE AND TYPE');
  p.push(`Background ${theme.bg}. Ink ${theme.fg} for all primary text. Muted ${theme.muted} for secondary text and hairlines. Accent ${theme.accent}, used on at most one object on the canvas.`);
  p.push(`Headline type is ${faceAdjective(theme.font_head)} and heavy. Body type is ${faceAdjective(theme.font_body)} and regular. Two weights only, and the headline is at least three times the body size.`);
  if (accents.length) {
    p.push(`Set exactly these phrases in the accent colour, and nothing else: ${accents.map(a => JSON.stringify(a)).join(', ')}.`);
  }
  p.push('');
  p.push(`LAYOUT: ${arch}`);
  p.push(recipe);
  p.push(...directiveLines(block));
  p.push('Fill the frame. This is a dense, information-rich editorial graphic, not a minimal poster.');
  p.push('');
  p.push('TEXT ON THE CANVAS');
  p.push('Render each string below exactly as written, character for character, and render no other text anywhere on the image.');
  p.push(...lines, ...meta_lines);
  p.push('');
  p.push('HARD CONSTRAINTS');
  p.push('- Do not paraphrase, shorten, expand, translate, correct, or invent any text. Spelling must be exact.');
  p.push('- No text on the canvas beyond the strings listed above.');
  p.push('- No company logos, brand marks, trademarks, watermarks, signatures, or invented third-party names.');
  p.push('- No photography, no 3D rendering, no drop shadows, no bevels, no stock-icon clip art, no decorative gradients.');
  p.push('- No people, hands, or faces.');
  p.push('- Where a glyph is named above, draw one simple monoline symbol in the ink colour.');
  p.push('- The geometry must be true to the content: do not draw a taper, a ranking, a nesting, or a proportion the listed text does not contain.');
  if (slide && slide.index > 1) {
    p.push('- Match the supplied cover-slide reference image exactly for palette, type treatment, margins, and furniture. This slide belongs to the same deck.');
  }
  if (note) {
    p.push('');
    p.push('CORRECTION FROM A FAILED PREVIOUS ATTEMPT. Everything above still applies; this must hold as well:');
    p.push(note);
  }
  return p.join('\n');
}

// --------------------------------------------------------------------------- //
// --check — spec validation, pure half
// --------------------------------------------------------------------------- //
//
// Ported from the retired render.py files' REQUIRED / BUDGETS / SOURCE_REQUIRED
// tables, unchanged. A tuple member means "at least one of these".

const REQUIRED = {
  infographic: {
    '_smoke': ['headline'],
    'numbered-steps': ['headline', 'items'],
    'card-grid': ['headline', 'items'],
    'comparison-panel': ['headline', 'col1', 'col2'],
    'icon-list': ['headline', 'items'],
    'funnel': ['headline', 'items'],
    'hybrid-playbook': ['headline', 'stats', 'items'],
    'annotated-diagram': ['headline', 'center', 'items'],
    'perception-split': ['headline', 'naive_headline', 'naive_statement',
      'real_headline', 'items', 'punchline'],
    'causal-chain': ['headline', 'items', 'terminal_cost'],
    'trend-poster': ['headline', 'sub', 'items'],
    'distribution-strip': ['headline', 'sub', 'observations', 'reference_value',
      'reference_label'],
    'ranked-bars': ['headline', 'sub', 'items'],
    'composition-split': ['headline', 'sub', 'items', 'expectation'],
    'variance-bridge': ['headline', 'sub', 'start', 'end', 'items'],
    'sourced-shelf': ['headline', 'sub', 'sections', 'items'],
    'analogy-rows': ['headline', 'sub', 'items'],
    'quadrant-map': ['headline', 'sub', 'quadrants', 'x_axis', 'y_axis', 'items'],
    'stratified-container': ['headline', 'items', 'notes'],
    'mirrored-rings': ['headline', 'items', 'good_label', 'bad_label'],
  },
  carousel: {
    'cover': ['headline'],
    'statement': ['headline'],
    'cta': ['headline'],
    'bullets': ['headline', 'items'],
    'compare': ['headline', 'left', 'right'],
    'before-after': ['headline', 'left', 'right'],
    'steps': ['headline', 'items'],
    'stat': [['stat', 'headline'], 'caption'],
    'quote-spotlight': ['quote', 'attribution'],
    'image-bg': ['image'],
    'index': ['items'],
    'logo-wall': ['items'],
  },
};

// VISUALS section 4.2: a form that prints a number carries its source line on
// the canvas. No line, no render.
const SOURCE_REQUIRED = new Set(['trend-poster', 'distribution-strip',
  'ranked-bars', 'composition-split', 'variance-bridge', 'sourced-shelf',
  'hybrid-playbook']);

// `_items` is the (min, max) item count; every other key is a character ceiling
// for that field, applied per item on a list.
const BUDGETS = {
  'perception-split': { _items: [4, 4], naive_headline: 36, real_headline: 36, naive_callout: 40, naive_statement: 60, items: 60, punchline: 60 },
  'causal-chain': { _items: [3, 4], items: 80, terminal_cost: 80 },
  'trend-poster': { _items: [6, 12], sub: 60, items: 24, units: 24 },
  'distribution-strip': { sub: 60, reference_label: 40 },
  'ranked-bars': { _items: [4, 11], sub: 46, items: 48 },
  'composition-split': { _items: [2, 5], sub: 72, expectation: 72, items: 30 },
  'variance-bridge': { _items: [3, 6], sub: 72, items: 26 },
  'sourced-shelf': { _items: [9, 9], sub: 64, items: 150 },
  'analogy-rows': { _items: [3, 5], sub: 52, items: 90 },
  'quadrant-map': { _items: [6, 12], sub: 120, items: 30 },
  'stratified-container': { _items: [3, 5], items: 220 },
  'mirrored-rings': { _items: [3, 3], items: 240 },
  'numbered-steps': { _items: [3, 6] },
  'card-grid': { _items: [4, 10] },
  'icon-list': { _items: [8, 12] },
  'funnel': { _items: [4, 6] },
  'annotated-diagram': { _items: [4, 6] },
};

const present = (block, name) => {
  const v = block[name];
  if (Array.isArray(v)) return v.length > 0;
  // `left:` / `right:` are satisfied by a title, bullets, or both.
  if (name === 'left' || name === 'right') {
    return Boolean(block[name + '_title']) || (block[name + '_items'] || []).length > 0;
  }
  return v != null && String(v).trim() !== '';
};

/**
 * Validate a parsed spec. Pure: no filesystem, no theme. Returns findings as
 * `{ level: 'ERROR'|'WARN', msg }`, most severe first at the caller's discretion.
 */
function checkSpec(format, meta, blocks) {
  const out = [];
  const known = REQUIRED[format];
  if (!known) return [{ level: 'ERROR', msg: `unknown format '${format}'` }];
  if (!blocks.length) return [{ level: 'ERROR', msg: 'spec has no `:: <archetype>` block' }];
  if (format === 'infographic' && blocks.length > 1) {
    out.push({ level: 'ERROR', msg: `an infographic spec carries exactly one block, found ${blocks.length}` });
  }
  if (format === 'carousel' && (blocks.length < 6 || blocks.length > 10)) {
    out.push({ level: 'WARN', msg: `a deck is 6 to 10 slides, found ${blocks.length}` });
  }

  blocks.forEach((b, i) => {
    const tag = format === 'carousel' ? `slide ${i + 1} (${b.archetype})` : b.archetype;
    if (!known[b.archetype]) {
      out.push({ level: 'ERROR', msg: `${tag}: unknown archetype` });
      return;
    }
    for (const field of known[b.archetype]) {
      if (Array.isArray(field)) {
        if (!field.some(f => present(b, f))) {
          out.push({ level: 'ERROR', msg: `${tag}: needs one of ${field.join(' or ')}` });
        }
      } else if (!present(b, field)) {
        out.push({ level: 'ERROR', msg: `${tag}: missing required field '${field}'` });
      }
    }
    if (SOURCE_REQUIRED.has(b.archetype) && !b.footer && !meta.footer) {
      out.push({ level: 'ERROR', msg: `${tag}: prints numbers, so it needs a 'footer' source line` });
    }
    if (b.kicker && format === 'infographic') {
      out.push({ level: 'ERROR', msg: `${tag}: there is no eyebrow zone on an infographic, drop 'kicker'` });
    }

    const budget = BUDGETS[b.archetype];
    if (!budget) return;
    for (const [key, limit] of Object.entries(budget)) {
      if (key === '_items') {
        const n = (b.items || []).length;
        if (n && (n < limit[0] || n > limit[1])) {
          out.push({ level: 'ERROR', msg: `${tag}: ${n} items, budget is ${limit[0]} to ${limit[1]}` });
        }
        continue;
      }
      const v = b[key];
      if (v == null) continue;
      const vals = Array.isArray(v) ? v : [v];
      vals.forEach((s, j) => {
        const len = splitAccent(s).text.length;
        if (len > limit) {
          const where = Array.isArray(v) ? `${key} ${j + 1}` : key;
          out.push({ level: 'ERROR', msg: `${tag}: ${where} is ${len} chars, budget is ${limit}` });
        }
      });
    }
  });

  // Craft rule VISUALS 5.1, the one budget that binds every archetype.
  blocks.forEach((b, i) => {
    if (!b.headline) return;
    const words = splitAccent(b.headline).text.trim().split(/\s+/).length;
    if (words > 8) {
      const tag = format === 'carousel' ? `slide ${i + 1}` : b.archetype;
      out.push({ level: 'WARN', msg: `${tag}: headline is ${words} words, VISUALS 5.1 says three to eight` });
    }
  });

  return out;
}

module.exports = {
  parseSpec, buildPrompt, checkSpec, splitAccent, renderItem, textLines,
  faceAdjective, RECIPES, REQUIRED, BUDGETS, LIST_KEYS, CANVAS_W, CANVAS_H,
  directiveLines, DIRECTIVE_KEYS,
};
