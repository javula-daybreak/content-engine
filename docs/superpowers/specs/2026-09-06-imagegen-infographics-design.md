# Image-gen visuals: design

Status: draft, pending approval. Owner: content-engine.

## 1. Problem

`render/infographic/` and `render/carousel/` draw visuals deterministically:
Python drives headless Chrome over hand-built HTML/CSS templates. Output
quality is the complaint driving this change: the templates read as
templates. Separately, every visual run is currently locked to one brand,
one `theme.json` per profile, one set of HTML templates. That is correct
today, but it was going to need re-solving the moment a second profile's
visual needs diverged from what CSS templates can express.

Both problems have one fix: stop drawing the pixels ourselves and call an
image-generation model instead. A spike already confirmed the chosen model
(§3) produces a correctly-spelled, on-brand, well-composed infographic from a
text prompt. See `test-output.png` in this session's scratchpad, cost
$0.0497.

## 2. Scope

**In scope:** replacing step 6 (design gate) and step 7 (render) in
`workflows/infographic.md` and `workflows/carousel.md`. A new
`render/imagegen/` module. One new optional `theme.json` key. Retiring the
Python/Chrome HTML renderers for these two formats.

**Out of scope, explicitly:**
- Steps 1-5 and 8 (profile load, anchor/locks, angle crossing, brief, the
  language gate, log-and-ship). Nothing here changes what `draft.md` is or
  when the gate reads it.
- Archetype selection logic and the craft rules in `VISUALS.md` §2 and §5.
  Confirmed with the user: this is a renderer swap, not a redesign of which
  shape gets picked or what a shape has to earn.
- A multi-model router. One model is hardcoded (§3). Seedream 5 Pro is noted
  as a follow-up experiment for carousel identity-lock, not built now.
- Changing how a carousel gets uploaded (still one `deck.pdf`, still a
  LinkedIn document post).
- `render/carousel`'s and `render/infographic`'s cover/slide *content*
  grammar. `draft.md` and `spec.md` keep their current shape.

## 3. Model and channel

**`openai/gpt-image-2`, called through OpenRouter.** Chosen over two rounds
of research: a general scan of current image-gen models, then an adversarial
pass specifically against the strongest Chinese contenders (Seedream 5 Pro,
Qwen-Image, GLM-Image), scored on the stated priorities: quality first, cost
second. GPT Image 2 won independent text-accuracy and
information-hierarchy comparisons. At Daybreak's volume, roughly 16
carousels times 8 slides plus 16 infographics, call it 150-200 images a
month, every candidate lands under $40/month, so cost never became the
deciding factor.

Endpoint: `POST https://openrouter.ai/api/v1/images`, bearer auth via
`OPENROUTER_API_KEY`. Confirmed live against OpenRouter's current docs and a
real test call (§1).

**The key lives in a repo-root `.env` file, gitignored, never in a workflow
file or in this repo's tracked history.** `render.js` reads it from
`process.env` at startup and reads `.env` itself if the variable is not
already set, the same handful of lines any zero-dependency Node script needs
for this, so every invocation shown below works without a caller having to
remember `node --env-file=...` by hand. That is different from how the
spike was run in this session (with an explicit `--env-file` flag); folding
the read into `render.js` removes the one place a workflow step could
silently run with no key and no clear error.

**Aspect ratio: 3:4, not 4:5.** OpenRouter's OpenAI route accepts only
`1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9, auto`; 4:5 is not on that list.
3:4 is the closest available (0.75 vs. 0.80). The test call's native output
was 1152x1536px. **Decision: standardize on 1152x1536 as the visual canvas
size for both formats, and drop the 2160x2700 / 4:5 figure `VISUALS.md`
currently states.** Padding or cropping to force exact 4:5 was considered
and rejected: it either adds visible bars or crops a composed image the
model already laid out edge to edge. `VISUALS.md` §5's craft rules
(headline length, subtitle job, structure honesty) are unaffected, only the
literal pixel target changes, and that edit is called out in §8's file list.

## 4. Brand adaptation

Reuses `theme.json` as-is, no migration needed. The image-gen path reads a
subset of its nine keys and ignores the rest:

| Key | Used how |
| :- | :- |
| `bg`, `fg`, `accent`, `muted` | Named explicitly in the prompt text ("background `#FBFBF9`, ink `#12100E`, one accent `#2F5BEA`") |
| `logo` | If set, the logo file is sent as one of the model's `input_references` images |
| `font_head`, `font_body` | Reduced to one adjective each (serif/sans, weight) folded into the prompt's type description |
| `scale`, `radius`, `rule_weight` | Not used. These are CSS layout tokens (corner rounding, rule thickness, whitespace density) with no image-gen equivalent. Left in the schema; the retired HTML renderers were the only thing that ever read them, so this is inert, not a breaking change |

**One new optional key: `style_reference`.** A path to an example image
inside the profile directory (a past post, a brand deck page, anything the
model should match style to), same optional/no-default pattern as `logo`:
absent means no reference beyond the text description, which is correct and
not a degraded state, exactly as `logo`'s absence already is. Documented in
`render/imagegen/reference/themes.md` (new file, mirrors the existing
`themes.md` per renderer).

A single call sends at most three reference images: `style_reference`,
`logo`, and (on carousel slides after the first) the cover slide's own
output. Comfortably under the roughly 16-image limit the model research
found, so no image-selection logic is needed to stay under a cap.

## 5. Architecture

New sibling directory. One module serves both formats, which is a real
deviation from the existing one-directory-per-format convention
(`render/infographic/`, `render/carousel/`), made deliberately: both formats
now share the same underlying mechanism (call OpenRouter, apply the theme,
retry against the visual check), and only the prompt-template catalog
differs between them. One HTTP client and one retry policy beats two copies
of both.

```
render/imagegen/
  render.js              # the CLI, see §7
  prompt.js              # spec -> prompt text, per archetype/slide type
  client.js               # the OpenRouter HTTP call, retries, cost logging
  reference/
    themes.md             # theme.json contract for this renderer (mirrors existing themes.md files)
    prompts-infographic.md # prompt template per VISUALS.md §3 signature
    prompts-carousel.md    # prompt template per render/carousel/reference/archetypes.md slide type
  tests/
    test_prompt.js         # pure unit tests, no network (see §9)
```

Node, built-in `fetch`, no new dependency: same posture as
`reference/engine.js`.

**Two separate catalogs, not one.** `VISUALS.md` §3 lists 15-17 single-frame
infographic signatures. `render/carousel/reference/archetypes.md` is a
separate catalog of twelve slide-type partials (cover, statement, stat,
before-after, compare, bullets, steps, quote-spotlight, index, logo-wall,
cta, and one more this spec did not fully enumerate). They have never been
name-for-name compatible (`workflows/carousel.md` says so explicitly), so
`prompt.js` needs one template set per catalog, not one shared set. The
implementation plan should re-read `render/carousel/reference/archetypes.md`
in full before writing `prompts-carousel.md`; this spec only confirms the
split exists, not the full field list.

### 5.1 Infographics (`workflows/infographic.md`, steps 6-7)

Unchanged: step 4a picks the archetype, step 4b writes `draft.md` in the
existing grammar (front matter plus one `:: <archetype>` block plus
headline/sub/items), step 5 gates it.

Changed: step 6 stops running `check_layout` on generated HTML, there is no
HTML anymore. Step 7 stops calling `render/infographic/render.py`. Both
collapse into one call:

```
node render/imagegen/render.js infographic <R>/draft.md --profile <P> --out <R>/final.png
```

Internally: `prompt.js` reads the parsed `draft.md` block (archetype,
headline, sub, items) and that archetype's entry in
`render/imagegen/reference/prompts-infographic.md`, and produces one prompt
string. `client.js` calls OpenRouter with that prompt, `theme.json`'s colors
folded in, `logo` and `style_reference` (if set) as `input_references`,
aspect ratio `3:4`. The PNG is written to `<R>/final.png`.

### 5.2 The visual check (replaces "the design gate" mechanically; keeps the name and the pipeline slot)

`check_layout`'s mechanical checks (contrast ratios, thumbnail legibility)
read HTML as text specifically because a screenshot was too expensive to
look at directly (PRD §4's cost argument, roughly 1,900 tokens per look).
That argument does not disappear, but the alternative it was avoiding,
looking at the actual image, is now unavoidable: there is no HTML to
substitute for it. **The model reads the generated PNG itself, once per
image, against a short fixed checklist, before the human sees it:**

1. Every word the model can read on the image matches `draft.md`'s words.
   No invented, dropped, or altered claims. A generative model can
   paraphrase text it was told to render verbatim.
2. Text is legible and correctly spelled.
3. The visible colors are recognizably the profile's `bg`/`fg`/`accent`, not
   a different palette the model substituted.
4. No artifact that would embarrass the post: a garbled logo, a fabricated
   third-party logo or trademark the prompt never asked for, distorted
   hands/faces if any figure appears, a watermark.
5. Structure honesty still applies exactly as `VISUALS.md` §6.1 states it:
   a taper claims filtering, equal tiles claim peer status. The model reads
   the image against the same standard it read HTML against before.

Written to `runs/<slug>/design-gate.md`, same file name, same existence
check before the human sees a draft, same "never render before it exists"
rule.

**One policy covers every failure on this checklist, not two.** A failure on
1 or 2 is a redraft of the prompt with the wording problem named as a
constraint. A failure on 3, 4, or 5 is a retry with a more constrained
prompt. Either way: bounded at 3 attempts total per image, same bound this
pipeline already uses everywhere else. Past that, ship the attempt that
scores best against the checklist, with one line naming what is unresolved.
No run ends without an artifact.

**"Best of the attempts" is a model judgment here, not a deterministic
comparator.** The text gate's bound 3 has `gate --compare`, an exact,
repeatable arithmetic tiebreak. No equivalent exists for images: the model
looks at up to 3 generated PNGs and picks, the same kind of call the reader
step already makes between two drafts at step 5b. This spec does not invent
a scoring function to paper over that difference.

**Worst-case cost is 3x one image, per image, not per run.** A deck where
every slide needs its full 3 attempts costs roughly 3x normal to generate.
At $0.05/image and 8 slides that is a $1.20 worst case for one carousel,
still trivial at this volume, but the multiplier is real and belongs in
anyone's cost math, not just the median case.

**Never a hand patch of a generated image.** The same "do not patch the
HTML, it's generated" rule from the old design gate applies to the new
artifact: a fix always regenerates the image from an edited prompt, never
edits pixels.

This is a real cost increase per PRD §4's own arithmetic, the image now
gets looked at directly, and it is accepted as the price of the format
change, not hidden.

### 5.3 Carousels (`workflows/carousel.md`, steps 6-7)

Unchanged: step 4 writes `draft.md` (the words) and derives `spec.md` (the
same words in the `:: <archetype>` slide grammar), step 5 gates `draft.md`.

Changed: `spec.md`'s slides are each rendered as one image, not one PDF page
drawn by Chrome from CSS.

**Generation is sequential and gated, cover first, precisely because the
cover becomes every other slide's reference image.** The order is:

1. Generate the cover slide. Its only references are `logo` and
   `style_reference`, if set; there is no prior slide to anchor to yet.
2. Run the visual check (§5.2) on the cover **before generating anything
   else**. A cover that fails and gets redrafted would otherwise already
   have propagated its flaws into every downstream slide, wasting every one
   of those calls. Gating here is what avoids that.
3. Once the cover passes, generate slides 2 through N. Each one's
   `input_references` carries the cover's own output PNG (base64-encoded),
   plus `logo`/`style_reference` if set. The cover is what keeps an 8-slide
   deck looking like one object instead of eight unrelated generations, a
   concrete anchor beats repeating a text description of the palette on
   every call.
4. Run the visual check on each remaining slide as it completes.

```
node render/imagegen/render.js carousel <R>/spec.md --profile <P> --out <R>/deck.pdf
```

**Assembly into one PDF reuses a technique this repo already depends on,
rather than adding a library dependency.** N generated PNGs need to become
one `deck.pdf`. `render/carousel/render.py` already depends on headless
Chrome to print HTML to PDF (there is nothing to `pip install`, ever, is an
existing hard rule), and the new `render.js` does the same thing for a much
simpler input: it writes a minimal HTML shell, one `<img>` per page sized
to 1152x1536, and print-to-PDFs it via its own headless Chrome invocation.
No code from the old Python renderer is reused, it is retired outright
along with the rest of `render/carousel/render.py` (§6); only the
print-to-PDF *technique* is repeated, in the new Node module, so this
doesn't trade one dependency for a new one.

`design-gate.md` records one verdict per slide, cover first.

## 6. What gets retired

`render/infographic/render.py`, its `assets/`, `themes/`, `tests/`, and
`reference/archetypes.md`/`method.md` (superseded by
`render/imagegen/reference/prompts-infographic.md`).
`render/carousel/render.py` in its entirety, including its Chrome-print-to-PDF
step (superseded by a new, independent implementation of the same technique
in `render/imagegen/render.js`, per §5.3, not a shared or reused file).

Moved to `archive/`, not deleted, matching this repo's existing convention:
the 2026-08-25 dogfood run was archived rather than discarded. A follow-up
task, not this one: decide whether the fifteen shipped example specs under
`render/infographic/examples/` get archived alongside or kept as
prompt-design references for the new `prompts-infographic.md`.

`VISUALS.md` §6.3 (the five mechanical `check_layout` checks) and §4's
"roughly 1,900 tokens per screenshot, so read the HTML instead" argument are
superseded by §5.2 above and need a documentation pass, listed in §8.

## 7. CLI contract

Mirrors the existing renderers' flag shape so the workflow files change as
little as possible:

| Flag | Behavior |
| :- | :- |
| `infographic <draft.md>` / `carousel <spec.md>` | which format |
| `--profile <dir>` | required, same as today; `--out` must resolve inside it, same guard, same error |
| `--out <path>` | required |
| `--check` | validates the spec and the theme (required keys present, referenced files exist, item/word budgets) without calling the API: no cost, no network |
| `test` | runs `tests/test_prompt.js`'s pure unit tests, no network, no cost (mirrors `engine.js test`) |
| `--live-test` | fires one real, paid request against a fixed prompt, using `profiles/_template/theme.json`'s values as a placeholder palette (no `--profile` needed); purely a connectivity smoke test, never a real render, so it does not trigger the "looks like a template because it is one" rule that governs actual renders off template defaults; never run automatically (see §9) |

## 8. Docs to update once this ships

- `SKILL.md`: step 6/7 table entries stay the same shape (owner: workflow,
  visual: yes), no row changes, just what they do underneath.
- `workflows/infographic.md` and `workflows/carousel.md`: steps 6-7 rewritten
  per §5.1/§5.2/§5.3.
- `VISUALS.md`: §3's catalog stays (archetype selection is unchanged) but
  every archetype's declared output size changes from 2160x2700/4:5 to
  1152x1536/3:4; §4's screenshot-cost argument and §6.3's five mechanical
  checks are superseded by §5.2 and should be marked retired with the date
  and reason, per this repo's own convention of striking rather than
  silently deleting outdated rules.
- `content-engine-PRD.md` §4 and §10.3 likely reference the same figures,
  not audited in this spec, flagged for the implementation plan.

## 9. Testing

No test should make a real paid API call automatically. `engine.js`'s
existing self-test suite runs on every change and must stay free and fast;
this module keeps the same property.

- `render/imagegen/tests/test_prompt.js`: pure functions only. Given a
  parsed spec plus a `theme.json` object, does `prompt.js` produce the
  expected prompt string? Colors present, correct archetype template
  selected, item/word budgets enforced, `--check` catches a missing
  required field. No network.
- `--live-test`: one real call, one fixed prompt, run by a human on demand.
  This is exactly what the scratchpad spike already did. Documented as
  costing real money, not part of the automatic `test` suite.

## 10. Risks, named rather than hidden

- **Text-on-canvas is no longer deterministic.** The old renderer guaranteed
  `draft.md`'s exact words reached the pixels. GPT Image 2 is very good at
  this but not perfect: the spike's one test rendered every word correctly,
  but §5.2 check 1 exists because "very good" is not "guaranteed," and a
  human still confirms before shipping (the existing "Shipped as written?
  [y/n]" step is unchanged).
- **Cost is per-image and now visible in the gate.** OpenRouter's response
  carries a real `cost` field; §5.2's per-image visual check means every
  run's token cost also goes up (PRD §4's own math). Both are logged, not
  hidden, but this is a real recurring cost this pipeline did not have
  before.
- **3:4 vs. 4:5 is a real craft deviation**, called out in §3 rather than
  buried. If it reads wrong in practice, the fix is renegotiating the ratio
  with OpenRouter's other providers for this model, not silently padding.
- **Single model, no fallback wired in.** Nano Banana Pro was named a
  fallback in conversation but is not implemented in this spec (YAGNI until
  GPT Image 2 actually fails in practice). If OpenRouter's
  `openai/gpt-image-2` route degrades or goes away, this pipeline has no
  automatic second option yet. Worth a one-line TODO in `client.js`, not a
  built abstraction.
- **Carousel identity-lock via a chained reference image is untested at
  scale.** The spike validated one single infographic image, not an
  8-slide chain. The implementation plan should validate this specifically,
  since it is the mechanism the whole "doesn't look like ten unrelated
  pictures" claim rests on.
- **Content-policy refusals and rate limits are unhandled in this spec.** An
  image model can refuse a prompt on safety grounds, unpredictably, or
  return a 429 under load. Both fold into §5.2's existing 3-attempt bound
  (a refusal or a 429 counts as a failed attempt and triggers the same
  retry-then-ship-best path) rather than needing a separate mechanism, but
  neither was tested in the spike and both are worth exercising early in
  the implementation.
