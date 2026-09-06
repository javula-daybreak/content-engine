/**
 * test_prompt.js — pure unit tests for prompt.js. No network, no cost, no files.
 *
 * Runs on every change, the same property reference/engine.js's self-test has.
 * The paid path has exactly one test and a human runs it: `render.js --live-test`.
 *
 *   node render/imagegen/render.js test
 *   node render/imagegen/tests/test_prompt.js
 */

'use strict';

const assert = require('assert');
const P = require('../prompt.js');

const THEME = {
  bg: '#FBFBF9', fg: '#12100E', accent: '#2F5BEA', muted: '#8A8880',
  font_head: "Georgia, 'Times New Roman', serif",
  font_body: "-apple-system, Helvetica, Arial, sans-serif",
  scale: 'airy', radius: '0px', rule_weight: '1px',
};

const INFOGRAPHIC = `---
title: Test
wordmark: A Name
---

:: card-grid
headline: Four moves, **in order**
sub: One italic line of scope
items:
- [shield] Guard the input | Validate at the boundary; never inside
- Second card | A body line
- Third card | Another body line
- Fourth card | And another
`;

const DECK = `---
aspect: 4x5
footer: A source line
---
:: cover
eyebrow: The label
headline: One line with **one accent span**
body: The lead line.
:: compare
headline: One canvas, **two documents**
left: The feed layer
- Headline and structure
- Survives the thumbnail
right: The stop layer
- Body and labels
- Invisible until the tap
`;

const CASES = {

  'parses front matter and one block'() {
    const { meta, blocks } = P.parseSpec(INFOGRAPHIC);
    assert.equal(meta.wordmark, 'A Name');
    assert.equal(blocks.length, 1);
    assert.equal(blocks[0].archetype, 'card-grid');
    assert.equal(blocks[0].items.length, 4);
    assert.equal(blocks[0].sub, 'One italic line of scope');
  },

  'parses a deck, and left/right keep their titles and their own bullets'() {
    const { blocks } = P.parseSpec(DECK);
    assert.equal(blocks.length, 2);
    assert.equal(blocks[1].left_title, 'The feed layer');
    assert.deepEqual(blocks[1].right_items,
      ['Body and labels', 'Invisible until the tap']);
    // A side's bullets must NOT leak into `items`.
    assert.ok(!blocks[1].items || blocks[1].items.length === 0);
  },

  'the prompt carries every theme colour'() {
    const { meta, blocks } = P.parseSpec(INFOGRAPHIC);
    const out = P.buildPrompt({ format: 'infographic', block: blocks[0], meta, theme: THEME });
    for (const c of [THEME.bg, THEME.fg, THEME.accent, THEME.muted]) {
      assert.ok(out.includes(c), `prompt is missing ${c}`);
    }
    assert.ok(/1152x1536/.test(out), 'prompt is missing the canvas size');
    assert.ok(/3:4/.test(out), 'prompt is missing the aspect ratio');
  },

  'the prompt selects that archetype recipe and no other'() {
    const { meta, blocks } = P.parseSpec(INFOGRAPHIC);
    const out = P.buildPrompt({ format: 'infographic', block: blocks[0], meta, theme: THEME });
    assert.ok(out.includes(P.RECIPES.infographic['card-grid']));
    assert.ok(!out.includes(P.RECIPES.infographic['funnel']));
    assert.ok(out.includes('LAYOUT: card-grid'));
  },

  'an unknown archetype throws rather than prompting for nothing'() {
    assert.throws(
      () => P.buildPrompt({ format: 'infographic', block: { archetype: 'nope' }, theme: THEME }),
      /no prompt recipe/);
  },

  'accent markers become an instruction, never literal asterisks'() {
    const { meta, blocks } = P.parseSpec(DECK);
    const out = P.buildPrompt({
      format: 'carousel', block: blocks[0], meta, theme: THEME,
      slide: { index: 1, count: 2 },
    });
    assert.ok(!out.includes('**'), 'raw ** markers reached the prompt');
    assert.ok(out.includes('"one accent span"'), 'the accent phrase was not named');
    assert.ok(out.includes('"One line with one accent span"'),
      'the headline did not survive marker stripping');
  },

  'compound item fields and the icon token are expanded, not printed raw'() {
    const line = P.renderItem('[shield] Guard the input | Validate; never inside');
    assert.ok(line.startsWith('glyph shield, '));
    assert.ok(!line.includes('|'), 'a pipe reached the canvas text');
    assert.ok(!line.includes('['), 'an icon bracket reached the canvas text');
    assert.ok(line.includes('sub-items "Validate", "never inside"'));
  },

  'layout directives never enter the verbatim text contract'() {
    const { lines } = P.textLines({
      archetype: 'ranked-bars', headline: 'A claim', highlight_index: '2',
      track: 'fixed', bg: 'dark',
    });
    const joined = lines.join('\n');
    assert.ok(joined.includes('HEADLINE'));
    for (const k of ['HIGHLIGHT INDEX', 'TRACK', 'BG', 'ARCHETYPE']) {
      assert.ok(!joined.includes(k), `${k} was offered to the model as canvas text`);
    }
  },

  'a slide past the cover is told to match the cover reference'() {
    const { meta, blocks } = P.parseSpec(DECK);
    const first = P.buildPrompt({ format: 'carousel', block: blocks[0], meta, theme: THEME, slide: { index: 1, count: 2 } });
    const second = P.buildPrompt({ format: 'carousel', block: blocks[1], meta, theme: THEME, slide: { index: 2, count: 2 } });
    assert.ok(!/cover-slide reference/.test(first));
    assert.ok(/cover-slide reference/.test(second));
  },

  'a retry note reaches the prompt'() {
    const { meta, blocks } = P.parseSpec(INFOGRAPHIC);
    const out = P.buildPrompt({
      format: 'infographic', block: blocks[0], meta, theme: THEME,
      note: 'The word "boundary" was misspelled. Spell it exactly.',
    });
    assert.ok(out.includes('misspelled'));
    assert.ok(out.includes('FAILED PREVIOUS ATTEMPT'));
  },

  'font stacks reduce to one adjective'() {
    assert.equal(P.faceAdjective(THEME.font_head), 'serif');
    assert.equal(P.faceAdjective(THEME.font_body), 'sans-serif');
    assert.equal(P.faceAdjective('Manrope, sans-serif'), 'sans-serif');
    // A monospace head face is a visible brand decision, not a sans in disguise.
    assert.equal(P.faceAdjective("'SF Mono', Menlo, Consolas, monospace"), 'monospace');
  },

  '--check catches a missing required field'() {
    const { meta, blocks } = P.parseSpec(':: card-grid\nsub: no headline here\n');
    const out = P.checkSpec('infographic', meta, blocks);
    assert.ok(out.some(f => f.level === 'ERROR' && /missing required field 'headline'/.test(f.msg)));
    assert.ok(out.some(f => f.level === 'ERROR' && /missing required field 'items'/.test(f.msg)));
  },

  '--check catches an unknown archetype'() {
    const { meta, blocks } = P.parseSpec(':: not-a-form\nheadline: x\n');
    const out = P.checkSpec('infographic', meta, blocks);
    assert.ok(out.some(f => f.level === 'ERROR' && /unknown archetype/.test(f.msg)));
  },

  '--check enforces item counts'() {
    const spec = ':: causal-chain\nheadline: A claim\nterminal_cost: A felt cost\nitems:\n'
      + ['a', 'b', 'c', 'd', 'e'].map(x => `- ${x}`).join('\n');
    const out = P.checkSpec('infographic', ...Object.values(P.parseSpec(spec)));
    assert.ok(out.some(f => /5 items, budget is 3 to 4/.test(f.msg)));
  },

  '--check enforces character budgets'() {
    const spec = `:: ranked-bars\nheadline: A claim\nfooter: Source\nsub: ${'x'.repeat(50)}\n`
      + 'items:\n- a\n- b\n- c\n- d\n';
    const out = P.checkSpec('infographic', ...Object.values(P.parseSpec(spec)));
    assert.ok(out.some(f => /sub is 50 chars, budget is 46/.test(f.msg)));
  },

  '--check requires a source line on a form that prints numbers'() {
    const spec = ':: ranked-bars\nheadline: A claim\nsub: short\nitems:\n- a\n- b\n- c\n- d\n';
    const out = P.checkSpec('infographic', ...Object.values(P.parseSpec(spec)));
    assert.ok(out.some(f => /needs a 'footer' source line/.test(f.msg)));
  },

  '--check accepts a valid spec of each format'() {
    const info = P.parseSpec(INFOGRAPHIC);
    assert.deepEqual(
      P.checkSpec('infographic', info.meta, info.blocks).filter(f => f.level === 'ERROR'), []);
    const deck = P.parseSpec(DECK);
    assert.deepEqual(
      P.checkSpec('carousel', deck.meta, deck.blocks).filter(f => f.level === 'ERROR'), []);
  },

  'a carousel stat slide is satisfied by either of its two number fields'() {
    const withStat = P.parseSpec(':: stat\nstat: 40px\ncaption: A caption\n');
    assert.deepEqual(
      P.checkSpec('carousel', withStat.meta, withStat.blocks).filter(f => f.level === 'ERROR'), []);
    const neither = P.parseSpec(':: stat\ncaption: A caption\n');
    assert.ok(P.checkSpec('carousel', neither.meta, neither.blocks)
      .some(f => /needs one of stat or headline/.test(f.msg)));
  },

  'every archetype the checker knows has a prompt recipe'() {
    for (const format of ['infographic', 'carousel']) {
      for (const arch of Object.keys(P.REQUIRED[format])) {
        assert.ok(P.RECIPES[format][arch],
          `${format} archetype '${arch}' has no prompt recipe`);
      }
      for (const arch of Object.keys(P.RECIPES[format])) {
        assert.ok(P.REQUIRED[format][arch],
          `${format} recipe '${arch}' has no required-field entry`);
      }
    }
  },

};

function run() {
  const failures = [];
  for (const [name, fn] of Object.entries(CASES)) {
    try {
      fn();
    } catch (e) {
      failures.push(`FAIL  ${name}\n      ${e.message.split('\n')[0]}`);
    }
  }
  const total = Object.keys(CASES).length;
  if (failures.length) {
    process.stdout.write(failures.join('\n') + '\n');
    process.stdout.write(`${failures.length} of ${total} failed\n`);
    process.exitCode = 1;
    return false;
  }
  process.stdout.write(`ok  ${total} tests, no network, no cost\n`);
  return true;
}

if (require.main === module) run();

module.exports = { run, CASES };
