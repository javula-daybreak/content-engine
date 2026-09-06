#!/usr/bin/env node
/**
 * render.js — the image-gen renderer for both visual formats.
 *
 *   node render/imagegen/render.js infographic <draft.md> --profile <P> --out <R>/final.png
 *   node render/imagegen/render.js carousel <spec.md> --profile <P> --out <R>/deck.pdf --cover
 *   node render/imagegen/render.js carousel <spec.md> --profile <P> --out <R>/deck.pdf --rest
 *   node render/imagegen/render.js carousel <spec.md> --profile <P> --out <R>/deck.pdf --assemble
 *
 * Flags: --check (validate, no network, no cost) · --note "<constraint>" (a
 * failed visual check's correction, folded into the prompt) · --slide N
 * (regenerate one carousel slide) · test · --live-test.
 *
 * The carousel is three commands rather than one on purpose: the cover has to
 * pass the visual check BEFORE it becomes every other slide's reference image,
 * or a flawed cover propagates into every downstream call. Design spec 5.3.
 *
 * Nothing to install. Node's built-in fetch for the API, the installed Chrome
 * for print-to-PDF, the same browser the retired renderers drove.
 */

'use strict';

const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const P = require('./prompt');
const client = require('./client');

const REPO_ROOT = path.resolve(__dirname, '..', '..');
const CHROME = process.env.CHROME
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const THEME_KEYS = ['bg', 'fg', 'accent', 'muted', 'font_head', 'font_body',
  'scale', 'radius', 'rule_weight'];

const die = msg => { process.stderr.write(msg + '\n'); process.exit(1); };
const say = msg => process.stdout.write(msg + '\n');

// --------------------------------------------------------------------------- //
// the key
// --------------------------------------------------------------------------- //

/**
 * OPENROUTER_API_KEY from the environment, else from the repo-root .env.
 *
 * Reading .env here rather than making every caller remember
 * `node --env-file=...` removes the one place a workflow step could run with no
 * key and no clear error. The file is gitignored and is the only place the key
 * lives; it is never written into a workflow file or this repo's history.
 */
function apiKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  const envFile = path.join(REPO_ROOT, '.env');
  if (!fs.existsSync(envFile)) return '';
  for (const line of fs.readFileSync(envFile, 'utf8').split('\n')) {
    const m = /^\s*(?:export\s+)?OPENROUTER_API_KEY\s*=\s*(.*)$/.exec(line);
    if (m) return m[1].trim().replace(/^['"]|['"]$/g, '');
  }
  return '';
}

// --------------------------------------------------------------------------- //
// theme
// --------------------------------------------------------------------------- //

function loadTheme(profileDir) {
  const p = path.join(profileDir, 'theme.json');
  if (!fs.existsSync(p)) die(`${p} not found. The first visual run writes it, per PRD 7a.`);
  const theme = JSON.parse(fs.readFileSync(p, 'utf8'));
  const missing = THEME_KEYS.filter(k => !(k in theme));
  if (missing.length) die(`${p} is missing theme keys: ${missing.join(', ')}`);
  theme._profile = profileDir;
  return theme;
}

/** The optional reference images a theme names, checked to exist. */
function themeReferences(theme) {
  const out = [];
  for (const key of ['style_reference', 'logo']) {
    const rel = theme[key];
    if (!rel) continue;
    const abs = path.resolve(theme._profile, rel);
    if (!abs.startsWith(path.resolve(theme._profile) + path.sep)) {
      die(`theme.json ${key} '${rel}' resolves outside the profile directory`);
    }
    if (!fs.existsSync(abs)) die(`theme.json names ${key} '${rel}', not found`);
    out.push(abs);
  }
  return out;
}

/** PRD 1.3: nothing a run writes lands outside profiles/<handle>/. */
function guardOut(profileDir, outPath) {
  const prof = fs.realpathSync(profileDir);
  const out = path.resolve(outPath);
  if (!out.startsWith(prof + path.sep)) {
    die(`--out is not inside --profile:\n  --out     ${out}\n  --profile ${prof}`);
  }
  return out;
}

// --------------------------------------------------------------------------- //
// generation
// --------------------------------------------------------------------------- //

async function generateTo(prompt, refs, outFile, key, label) {
  const { buffer, cost, model } = await client.generate(prompt, refs, key);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, buffer);
  say(`${label}: ${outFile}  ${(buffer.length / 1024).toFixed(0)}KB  $${cost.toFixed(5)}  ${model}`);
  return cost;
}

// --------------------------------------------------------------------------- //
// PDF assembly — the retired carousel renderer's technique, reimplemented
// --------------------------------------------------------------------------- //

function assemblePdf(pngs, outPdf) {
  if (!pngs.length) die('nothing to assemble: no slide PNGs found');
  const pages = pngs.map(f => {
    const b64 = fs.readFileSync(f).toString('base64');
    return `<div class="p"><img src="data:image/png;base64,${b64}"></div>`;
  }).join('\n');
  const doc = `<!doctype html><meta charset="utf-8"><style>
@page { size: ${P.CANVAS_W}px ${P.CANVAS_H}px; margin: 0 }
html,body { margin:0; padding:0; background:#fff }
.p { width:${P.CANVAS_W}px; height:${P.CANVAS_H}px; overflow:hidden;
     page-break-after:always; break-after:page }
.p:last-child { page-break-after:auto; break-after:auto }
img { display:block; width:${P.CANVAS_W}px; height:${P.CANVAS_H}px }
</style>${pages}`;

  // The temp file lands in the OUTPUT directory, never in this one: PRD 1.3
  // puts every write a run makes inside profiles/<handle>/.
  const tmp = path.join(path.dirname(outPdf), `.assemble-${process.pid}.html`);
  fs.writeFileSync(tmp, doc);
  try {
    execFileSync(CHROME, ['--headless=new', '--disable-gpu', '--no-pdf-header-footer',
      '--run-all-compositor-stages-before-draw', '--virtual-time-budget=12000',
      `--print-to-pdf=${outPdf}`, `file://${tmp}`], { stdio: 'pipe' });
  } catch (e) {
    const err = (e.stderr || Buffer.alloc(0)).toString().trim();
    die(`Chrome render failed (exit ${e.status}):\n${err}`);
  } finally {
    fs.rmSync(tmp, { force: true });
  }
  say(`deck: ${outPdf}  ${pngs.length} pages`);
}

// --------------------------------------------------------------------------- //
// checks
// --------------------------------------------------------------------------- //

function report(findings) {
  for (const f of findings) say(`${f.level}  ${f.msg}`);
  const errors = findings.filter(f => f.level === 'ERROR').length;
  say(errors ? `--check: ${errors} ERROR, ${findings.length - errors} WARN`
    : `--check: clean${findings.length ? `, ${findings.length} WARN` : ''}`);
  return errors;
}

function runCheck(format, meta, blocks, theme, specDir) {
  const findings = P.checkSpec(format, meta, blocks);
  // A themeless --check is a pure spec check, which is the whole point of
  // running it before a profile exists or before any key is configured.
  if (theme) themeReferences(theme); // dies naming the key if a file is absent
  for (const b of blocks) {
    if (!b.image) continue;
    const abs = path.resolve(specDir, b.image);
    if (!fs.existsSync(abs)) findings.push({ level: 'ERROR', msg: `image '${b.image}' not found` });
  }
  // A recipe is as required as a field: a spec naming an archetype with no
  // prompt template renders nothing, and --check is where that should surface.
  for (const b of blocks) {
    if (b.archetype && !(P.RECIPES[format] || {})[b.archetype]) {
      findings.push({ level: 'ERROR', msg: `no prompt recipe for archetype '${b.archetype}'` });
    }
  }
  return report(findings);
}

// --------------------------------------------------------------------------- //
// the two formats
// --------------------------------------------------------------------------- //

async function infographic(specPath, opts) {
  const { meta, blocks } = P.parseSpec(fs.readFileSync(specPath, 'utf8'));
  const theme = opts.check && !opts.profile ? null : loadTheme(opts.profile);
  const errors = runCheck('infographic', meta, blocks, theme, path.dirname(specPath));
  if (opts.check) process.exit(errors ? 1 : 0);
  if (errors) die('refusing to spend an API call on a spec with errors.');
  const out = guardOut(opts.profile, opts.out);
  const prompt = P.buildPrompt({ format: 'infographic', block: blocks[0], meta, theme, note: opts.note });
  await generateTo(prompt, themeReferences(theme), out, apiKey(), 'image');
}

const slideFile = (outPdf, i) =>
  path.join(path.dirname(outPdf), 'slides', `slide-${String(i).padStart(2, '0')}.png`);

async function carousel(specPath, opts) {
  const specDir = path.dirname(specPath);
  const { meta, blocks } = P.parseSpec(fs.readFileSync(specPath, 'utf8'));
  const theme = opts.check && !opts.profile ? null : loadTheme(opts.profile);

  if (opts.check) {
    process.exit(runCheck('carousel', meta, blocks, theme, specDir) ? 1 : 0);
  }

  const out = guardOut(opts.profile, opts.out);

  if (opts.assemble) {
    const files = blocks.map((_, i) => slideFile(out, i + 1));
    const missing = files.filter(f => !fs.existsSync(f));
    if (missing.length) die(`cannot assemble, ${missing.length} slide(s) not generated:\n  ${missing.join('\n  ')}`);
    return assemblePdf(files, out);
  }

  if (runCheck('carousel', meta, blocks, theme, specDir)) {
    die('refusing to spend API calls on a spec with errors.');
  }

  const key = apiKey();
  const themeRefs = themeReferences(theme);
  const cover = slideFile(out, 1);

  // Which slides this invocation generates.
  let indices;
  if (opts.slide) indices = [opts.slide];
  else if (opts.cover) indices = [1];
  else if (opts.rest) indices = blocks.map((_, i) => i + 1).slice(1);
  else die('carousel needs one of --cover, --rest, --slide N, or --assemble');

  if (indices.some(i => i > 1) && !fs.existsSync(cover)) {
    die(`slide 1 has not been generated yet: ${cover}\n`
      + 'The cover is every other slide\'s reference image and is gated first. Run --cover, '
      + 'run the visual check on it, then --rest.');
  }

  let total = 0;
  for (const i of indices) {
    const block = blocks[i - 1];
    if (!block) die(`--slide ${i}: the deck has ${blocks.length} slides`);
    // At most three references, in priority order: this slide's own photograph,
    // the cover (the deck's identity anchor), then the theme's own two.
    const refs = [];
    if (block.image) refs.push(path.resolve(specDir, block.image));
    if (i > 1) refs.push(cover);
    refs.push(...themeRefs);
    const prompt = P.buildPrompt({
      format: 'carousel', block, meta, theme, note: opts.note,
      slide: { index: i, count: blocks.length },
    });
    total += await generateTo(prompt, refs.slice(0, 3), slideFile(out, i), key,
      `slide ${i}/${blocks.length}`);
  }
  say(`total: $${total.toFixed(5)}`);
  if (indices.length > 1 || opts.rest) {
    say(`next: run the visual check on each slide, then --assemble to write ${out}`);
  }
}

// --------------------------------------------------------------------------- //
// --live-test: one real, paid request. Never run automatically.
// --------------------------------------------------------------------------- //

async function liveTest() {
  const theme = JSON.parse(
    fs.readFileSync(path.join(REPO_ROOT, 'profiles', '_template', 'theme.json'), 'utf8'));
  const block = { archetype: '_smoke', headline: 'Connectivity check' };
  const prompt = P.buildPrompt({ format: 'infographic', block, meta: {}, theme });
  const out = path.join(os.tmpdir(), `imagegen-live-test-${Date.now()}.png`);
  say('--live-test makes ONE real, paid API call. This is a connectivity smoke');
  say('test and never a render: its output ships nowhere.');
  await generateTo(prompt, [], out, apiKey(), 'live-test');
}

// --------------------------------------------------------------------------- //
// CLI
// --------------------------------------------------------------------------- //

function parseArgs(argv) {
  const opts = { positional: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') opts.check = true;
    else if (a === '--cover') opts.cover = true;
    else if (a === '--rest') opts.rest = true;
    else if (a === '--assemble') opts.assemble = true;
    else if (a === '--live-test') opts.liveTest = true;
    else if (a === '--profile') opts.profile = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a === '--note') opts.note = argv[++i];
    else if (a === '--slide') opts.slide = Number(argv[++i]);
    else if (a.startsWith('--')) die(`unknown flag ${a}`);
    else opts.positional.push(a);
  }
  return opts;
}

const USAGE = `usage:
  render.js infographic <draft.md> --profile <P> --out <P>/runs/<slug>/final.png
  render.js carousel <spec.md> --profile <P> --out <P>/runs/<slug>/deck.pdf --cover
  render.js carousel <spec.md> --profile <P> --out <P>/runs/<slug>/deck.pdf --rest
  render.js carousel <spec.md> --profile <P> --out <P>/runs/<slug>/deck.pdf --assemble
  render.js test          pure unit tests, no network, no cost
  render.js --live-test   ONE real paid call, connectivity only

  --check   validate spec and theme, no network, no cost
  --note    a failed visual check's correction, folded into the prompt
  --slide N regenerate one carousel slide`;

async function main(argv) {
  const opts = parseArgs(argv);
  const cmd = opts.positional[0];

  if (cmd === 'test') {
    require('./tests/test_prompt.js').run();
    return;
  }
  if (opts.liveTest) return liveTest();
  if (cmd !== 'infographic' && cmd !== 'carousel') die(USAGE);

  const spec = opts.positional[1];
  if (!spec) die(`${cmd} needs a spec path\n\n${USAGE}`);
  if (!fs.existsSync(spec)) die(`spec not found: ${spec}`);
  // --check spends nothing and paints nothing, so it needs neither.
  if (!opts.check) {
    if (!opts.profile) die('--profile is required');
    if (!opts.out) die('--out is required');
  }
  if (opts.profile && !fs.existsSync(opts.profile)) die(`--profile not found: ${opts.profile}`);

  if (cmd === 'infographic') return infographic(spec, opts);
  return carousel(spec, opts);
}

if (require.main === module) {
  main(process.argv.slice(2)).catch(e => die(e.message));
}

module.exports = { apiKey, loadTheme, guardOut, assemblePdf, parseArgs };
