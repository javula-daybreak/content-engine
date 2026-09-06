# Carousel

`/content-engine carousel <topic>` lands here.

**This file owns pipeline steps 4, 6 and 7: the draft as slide beats, the
design gate, and the render.** Steps 1, 2, 3, 5 and 8 belong to the router in
`SKILL.md`. A line here that restates one of them is a bug, because two copies
of a rule is two places for it to be wrong.

A carousel is a PDF uploaded as a LinkedIn document post. The deliverable is
one PDF at 3:4, plus the caption that rides above it.

**Changed 2026-09-06.** It used to be a *vector* PDF at 4:5, printed by Chrome
from HTML templates. The renderer is now `render/imagegen/`, which generates one
image per slide and prints those into a PDF of the same page geometry. The type
is no longer selectable and the file is larger, roughly 1.3MB a slide. 4:5 went
to 3:4 because the model's route does not offer 4:5; `workflows/infographic.md`
step 7 carries the reasoning and it is the same reasoning here.

## The renderer's input contract

`render/imagegen/render.js` takes the same **Markdown spec** and emits a PDF.
That is the whole contract, and it is the renderer's, not this file's to change.

```
runs/<slug>/spec.md  +  profiles/<handle>/theme.json  ->  render.js  ->  slides/*.png, deck.pdf
```

Front matter, then one `:: <archetype>` block per slide of `key: value` lines:

```markdown
---
aspect: 4x5               # inert: every slide renders 3:4. Kept so old specs parse
footer: <one line>        # optional, the bottom-bar line on body slides
---
:: cover
eyebrow: <label>
headline: One line with **one accent span.**
```

| Rule | Detail |
| :- | :- |
| Fields | Every archetype's required and optional fields are in `render/carousel/reference/archetypes.md`. Not restated here. |
| Lists | `- ` lines attach to the open list field (`items`, or `left` / `right`). `steps` items use a pipe: `Label \| detail`. |
| Accent | `**bold**` in a headline names that phrase as the accent phrase, one span per headline, and nothing else on the slide may take the accent. **`bg: dark` / `bg: light` is now inert**: the treatment is fixed per archetype in the prompt recipe, dark on `cover` and `cta` and light everywhere else. A per-slide override would need a recipe parameter and no run has wanted one yet. |
| Furniture | The footer line and any wordmark are described to the model per slide. **The page counter and the progress bar are gone**: a generative model cannot be trusted to count to eight, and a wrong counter on slide 6 is the exact "artifact that would embarrass the post" the visual check exists to catch. If they are wanted back, they belong in a post-pass over the PNGs, not in a prompt. |
| Flags | `--check` validates spec and theme with no network and no cost, `--cover` / `--rest` / `--assemble` are the three generation phases, `--slide N` regenerates one slide, `--note "<constraint>"` folds a failed check's correction into the prompt. `--profile` and `--out` are required. |

## Step 4: the draft as slide beats

`brief.md` already exists, written at step 3. Read it and draft to it.

**6 to 10 slides**, one idea each. Fewer reads thin for a document post, more
loses the swipe, and a slide carrying two ideas gets split or cut.

Slide 1 is the hook and it stands alone. **It must survive 220px**, which is
`content-engine-VISUALS.md` §1's two-layer law and holds for a deck unchanged:
the claim is complete in the headline plus the structure, and the body copy is
reward for the tap. Slides 2 through N each carry one beat. The final slide is
a **takeaway, not a call to action**, per PRD §10.3.

On-slide copy is signage, not prose: **headline 3 to 8 words and never a third
line** (VISUALS §5.1), lead two short lines, bullet about six words. `--check`
warns past those without blocking, and they are also the only overflow
protection the layouts have, so an accepted warning is a decision rather than an
oversight. A label plus one clause is a good bullet and trips the warn.

Two writes, in this order:

1. **`runs/<slug>/draft.md`** — the caption, then the slide copy as plain
   lines. Step 5's gate reads this file, so every word a reader will see has to
   be in it: words that never reached `draft.md` are words no gate ever saw.
2. **`runs/<slug>/spec.md`** — the same words in the syntax above, derived. A
   fix goes into `draft.md` and the spec is rewritten from it, never the other
   way round, and a redraft at step 5 rewrites both.

Then hand back to the router for step 5.

### Choosing the archetypes

**`content-engine-VISUALS.md` §2 is the authority and this file does not
restate it.** Write the claim first, read the shape of the material, discard on
disqualifiers, and take §2.4's refusal path when nothing fits: the engine offers
a short post rather than improvising. §2.5's clearance filter runs before
selection rather than after drafting, because an image cannot be edited after
posting, and it is what decides whether `logo-wall` is available at all.

Two things the carousel path adds. **§3's catalog does not cover slide
layouts**: its fifteen signatures are single-frame infographic forms, so what
transfers is §2's procedure, §5's craft rules and §2.4's refusal, never a
name-for-name mapping. And **§2.4's quote-card prohibition binds the deck rather
than the beat**: a deck whose payload is sentences in large type is the visual
em dash and is refused, while one `quote-spotlight` carrying a real attributed
quote is a beat, never slide 1 and never the takeaway.

**Lock 4 is the router's to check and yours to respect.** `brief.md` carries one
`archetype:`, and on a carousel it names the deck's **spine**: the interior
archetype that carries the argument. `cover` and `cta` are furniture, every deck
has them, and neither is ever the spine.

Inside one deck, **no partial appears on two consecutive slides**, and PRD §3's
verbatim rule reads slide to slide as well as piece to piece: a span of eight or
more words repeated from an earlier slide is the repetition, and rewording it is
still the repetition. Cut the slide.

## Step 6: the design gate

**Rewritten 2026-09-06.** The gate used to read `deck.html` as text, because PRD
§4 prices one look at an image at roughly 1,900 tokens and a whole deck's budget
would go on looking at what the markup already said in words. There is no HTML
any more. The slides are the only artifact, so the gate reads the slides. That
cost is real, it is not hidden, and it is the price of the format change.

Cheap first. `--check` costs nothing and calls nothing:

```
node render/imagegen/render.js carousel <R>/spec.md \
  --profile <P> --out <R>/deck.pdf --check
```

It validates every slide's required fields, the copy budgets, that every
archetype named has a prompt recipe, that any `image:` path resolves, and that
every file `theme.json` references exists.

**On a first visual run, `profiles/<handle>/theme.json` does not exist yet**, and
PRD §7a makes the first visual run the one write that creates it. Ask for the
nine keys in one turn, offer `_template/theme.json`'s values as the fallback for
any they have no answer to, confirm in the same turn, write it once;
`render/imagegen/reference/themes.md` holds the contract, including the two
optional keys `logo` and `style_reference`. Never render against the template
file itself. Rendering early decks off shipped defaults is the "looks like a
template because it is one" failure this writer exists to prevent.

### Generation is sequential and gated, cover first

**The cover becomes every other slide's reference image**, which is what keeps an
eight-slide deck looking like one object instead of eight unrelated generations.
So it is gated before anything else is generated: a cover that fails and gets
redrafted would otherwise already have propagated its flaws into every
downstream slide and wasted every one of those calls.

```
node render/imagegen/render.js carousel <R>/spec.md --profile <P> --out <R>/deck.pdf --cover
```

Read `<R>/slides/slide-01.png` against the checklist below. Only once it passes:

```
node render/imagegen/render.js carousel <R>/spec.md --profile <P> --out <R>/deck.pdf --rest
```

`--rest` refuses to run if `slide-01.png` does not exist. Read each remaining
slide as it lands. Then, and only then:

```
node render/imagegen/render.js carousel <R>/spec.md --profile <P> --out <R>/deck.pdf --assemble
```

### The checklist, read against each actual slide

1. **Every word on the slide matches `draft.md`'s words.** No invented, dropped,
   altered or re-punctuated claim. A generative model can paraphrase text it was
   told to render verbatim, and this is the check that catches it.
2. **Text is legible and correctly spelled**, in labels and card items as well as
   headlines.
3. **The visible colours are the profile's** `bg` / `fg` / `accent`, not a
   palette the model substituted, and the accent sits on one object.
4. **Nothing that would embarrass the post**: a garbled logo, a fabricated
   third-party logo or trademark the prompt never asked for, a watermark, a
   distorted hand or face.
5. **Structure honesty**, exactly as VISUALS §5.5 states it. A taper claims
   filtering, two equal cards claim comparable options, numbered rows claim
   order.
6. **Across the deck**: does slide 4 look like it belongs to slide 1? Same
   margins, same type treatment, same furniture. This is the one check that is
   per-deck rather than per-slide, and it is the one the cover-as-reference
   mechanism exists to pass.

Then read `reference/design-tells.md`'s `[carousel]` and `[both]` entries. Every
rule there still holds; only the artifact it is read against changed. The
sources behind them, for anyone tracing an entry back:

| Source | What it governs |
| :- | :- |
| PRD §10.3 | the carousel entries, "what good looks like", the slide-1 / interior / takeaway structure |
| VISUALS §1 | the two-layer law, read against slide 1 |
| VISUALS §5.1 - §5.4 | headline length and form, the subtitle's job, two type weights, 3x to 3.5x hierarchy, three hues, the accent-route test |
| VISUALS §5.5 | structure honesty: geometry claims what the material may not contain |
| VISUALS §5.6 | a signature, not a follow-and-repost bar |

**Corrected 2026-08-24**, and it still holds: §6's `[infographic]`-tagged entries
are scoped away from this path, but the file also carries `[both]` entries drawn
from §5 and PRD §10.3, and those have always applied here. Read the tag, not the
section number.

**The mechanical checks are gone from both paths now.** `check_layout`'s
contrast and thumbnail passes read HTML as text and went to the archive with it,
so the contrast and legibility questions are read by eye here, as they always
were on this path. A deck shipping without them mechanically checked says so.

### Fixing a slide

**One policy covers every failure.** A wording failure is a redraft of the
prompt with the problem named as a constraint; a colour, artifact or structure
failure is a retry with a more constrained prompt. Both use the same two flags,
and `--slide N` means the other slides are untouched and no call is repaid:

```
node render/imagegen/render.js carousel <R>/spec.md --profile <P> --out <R>/deck.pdf \
  --slide 4 --note "The kicker read 'THE TWO-LAYERS'. It must read exactly 'The two layers'."
```

**Bounded at 3 attempts per slide.** Past three, keep the attempt that reads best
against the checklist and name what is unresolved in one line. **No run ends
without an artifact.** A deck where every slide needs all three attempts costs
roughly 3x, which at about $0.05 a slide and eight slides is a $1.20 worst case:
trivial at this volume, but real, and it belongs in the number written down.

**Never hand-patch a generated image.** A fix regenerates the slide from an
edited prompt or an edited spec, never edits pixels. Content fixes go into
`draft.md`, then `spec.md`, then regenerate.

Write `runs/<slug>/design-gate.md`, **one verdict per slide, cover first**: what
was checked, what changed, what was accepted on purpose, and what the run cost.
**Never assemble the PDF before that file exists**, the same existence check step
5 uses on `gate-report.md`.

## Step 7: assemble

```
node render/imagegen/render.js carousel <R>/spec.md \
  --profile <P> --out <R>/deck.pdf --assemble
```

It refuses if any slide is missing, naming which. It writes the minimal HTML
shell, one page per slide at 1152x1536, and prints it through the installed
Chrome. Nothing to install; the same browser the retired renderer drove.

The run directory ends up holding `brief.md`, `draft.md`, `gate-report.md`,
`spec.md`, `design-gate.md`, `slides/slide-NN.png` and `deck.pdf`. Nothing lands
outside `profiles/<handle>/`, per PRD §1.3, which is why the slides and the
transient assembly HTML both go to the output directory.

**When it fails**, say which of these it was and stop. Do not improvise a
fallback format and never present a deck nobody rendered.

| Failure | What it means |
| :- | :- |
| `--check` reports ERROR | unknown archetype, a missing required field, or an `image:` path that does not resolve. Fix the spec. |
| `theme.json is missing theme keys` | the theme is incomplete. Fix the profile, never the renderer. |
| `OPENROUTER_API_KEY is not set` | the key lives in the repo-root `.env`, gitignored. Never paste it into a file this repo tracks. |
| `OpenRouter returned 4xx` | a refused prompt or a malformed request, printed verbatim. A content-policy refusal counts as one of the three attempts for that slide. |
| `OpenRouter returned 429/5xx` | the client already retried twice with backoff. Past that it counts as one attempt. |
| `slide 1 has not been generated yet` | `--rest` ran before `--cover`. Generate and gate the cover first; that ordering is the point. |
| `Chrome render failed` | Chrome's own stderr is in the message. `CHROME=<path>` if the binary lives elsewhere. |

`spec.md` and the generated slides survive all of them, which is what keeps PRD
§9 bound 3 true on the visual path: the run still ends with an artifact and a
named reason.

Then hand back to the router for step 8. The visual path prints one field more,
`<angle> · <archetype> · <anchor> · <job>`, and the PDF is what the human
uploads.
