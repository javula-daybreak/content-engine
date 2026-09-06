# Infographic

`/content-engine infographic <topic>` lands here.

**This file owns pipeline steps 4, 6 and 7: the draft, the design gate, and the
render.** Steps 1, 2, 3, 5 and 8 belong to the router in `SKILL.md`. A line here
that restates one of them is a bug, because two copies of a rule is two places
for it to be wrong.

The renderer is `render/imagegen/`, stdlib Node calling an image-generation model
through OpenRouter. Nothing to install. **Changed 2026-09-06:** it was
`render/infographic/`, Python driving headless Chrome over HTML templates, which
is now in `archive/2026-09-06-html-renderers/`. Throughout, `<P>` is
`profiles/<handle>` and `<R>` is `<P>/runs/<slug>`.

## Step 4a: select the form

**`content-engine-VISUALS.md` §2 is the procedure and this file does not restate
it.** Read it and run it: §2.3's sixteen steps, §2.5's clearance filter, §2.4's
refusal, §2.1's archetype lock. Its §3 catalog is the authority on what each
signature requires and what disqualifies it, and it outranks
`render/imagegen/reference/prompts-infographic.md`, which describes prompts
rather than signatures.

Two things this file owns.

**The archetype value.** The router created `<R>/brief.md` at step 3 with
`archetype:` empty. Fill it here, before any draft token is spent, per VISUALS
§2.3 step 15. It is the only line this workflow writes into the brief.

**Which signatures have a template.**

**All fifteen of VISUALS §3's signatures have a prompt recipe.** The
signature-to-recipe map lives in `render/imagegen/reference/prompts-infographic.md`
and is maintained beside the code rather than copied here, because a second copy
is a second place to go stale — which is exactly what happened to the five-row
table this replaced. That table also mapped **stratified container to `funnel`,
"taper only, no per-stratum counts,"** and that mapping was a defect: a funnel
band carries one label and no chip cluster, so a shape narrowing across tiers
that hold equal counts is precisely the structure lie §6.2 exists to catch.
`stratified-container` is its own builder now.

**The no-template refusal path is dead on this path.** VISUALS §2.4's refusal
still fires, but only for the reasons §2.4 actually names — every candidate
disqualified, a closed-set deficit, or the clearance filter emptying the set —
never for a missing recipe. VISUALS §8's "three refusals naming the same
template" trigger has nothing left to count.

`hybrid-playbook` and `annotated-diagram` map to no §3 signature and **selection
never reaches them.** They are explicit-request-only: a run that uses one says so
in its report. `hybrid-playbook` is a hero-number band, which §9.1 refuses once
the number is the payload, and it requires a `footer:` source line because it
exists to print numbers (PRD §4.2).

## Step 4b: draft the spec

The spec **is** the draft. Write it to `<R>/draft.md`, which is what the router
gates at step 5, so the words on the canvas go through `gate --report` like any
other draft.

The renderer's input contract, exactly as it stands:

```
---
title: <window/PNG title>
wordmark: <the author's name, read off identity.md>
footer: <source line on a data image, else omit>
---

:: <archetype>
headline: A functional descriptor with one **highlight** phrase
sub: One italic line of scope
items:
- [icon] Field | Field | sub-item; sub-item
```

| Rule | |
| :- | :- |
| One block | Front matter plus exactly one `:: <archetype>` block. Two is an error. |
| Field syntax | `\|` separates compound fields, `;` separates sub-items inside one, `**bold**` takes the accent, `[icon]` names a file in `<P>/icons/` and fails soft when absent. |
| No defaults, no `kicker`, no `theme:` | `wordmark` and `footer` are empty unless set. There is no eyebrow zone. The theme comes from `--profile`. |
| Grammar and budgets | `render/imagegen/reference/prompts-infographic.md`, and `--check` enforces them. Exceeding a budget is what overloads a frame. |

Three craft rules bind the copy, all in VISUALS §5: the headline is three to
eight words and never a third line (§5.1), the subtitle carries scope and
provenance and never payload (§5.2), and the load-bearing number never sits only
in body copy (§5.5). The claim has to be complete in the headline plus the
structure, because everything else dies at feed size.

**Never invent a beat to fill a slot.** Twenty chip slots will accept twenty
words nobody stands behind. If a panel cannot be filled honestly from the anchor
and its supports, cut the panel or ask §2.3 step 11's one question.

## The theme.json bootstrap

Per PRD §7a **the first visual run writes `theme.json` once**, and that is the
only profile-file write on this path. Where the profile still carries
`_template`'s defaults: ask for the nine keys before drafting rather than after
rendering, write the file once, and say so in one line. The keys are listed in
`render/imagegen/reference/themes.md`, along with the two optional ones, `logo`
and `style_reference`, whose paths must both sit inside the profile. Neither
being set means no reference image beyond the prompt's text description of the
palette, which is correct and not a degraded state.

Rendering from `_template` defaults produces the "looks like a template because
it is one" failure VISUALS §5.1 names. Do not skip this and render anyway.

## Step 6: the design gate

**Rewritten 2026-09-06.** The gate used to read generated HTML as text, because
PRD §4 prices one look at an image at roughly 1,900 tokens and reading the markup
was the cheaper substitute. There is no HTML any more. The image is the only
artifact, so the gate reads the image. That cost is real, it is not hidden, and
it is the price of the format change.

Cheap first. `--check` costs nothing and refuses nothing to the API:

```
node render/imagegen/render.js infographic <R>/draft.md \
  --profile <P> --out <R>/final.png --check
```

`--check` validates spec grammar and the theme: required fields per archetype,
the no-kicker rule, per-archetype count and character budgets, the `footer`
source line on a form that prints numbers, that every archetype named has a
prompt recipe, and that every file `theme.json` references exists. **It does not
judge language.** `reference/ai-tells.md` at step 5 is the sole authority there,
and on a visual run `draft.md` *is* this spec, so the gate already read every
word that reaches the canvas.

**`--check` no longer runs VISUALS §3's exact-arithmetic disqualifiers** — sum
to 100, residual closure, monotonic strata, rings increasing outward, an empty
quadrant. They were `check_spec`'s and they went to the archive with it. Read
for them by eye against §3's own signature entries until they come back; a run
shipping without them mechanically checked says so, the same way the carousel
path has always said so about `check_layout`.

Then render, then read the PNG. **The order is render, gate, ship**, and the
existence check is unchanged: step 7 does not present anything before
`runs/<slug>/design-gate.md` exists.

**The five-item checklist, read against the actual image:**

1. **Every word on the image matches `draft.md`'s words.** No invented, dropped,
   altered, or re-punctuated claim. A generative model can paraphrase text it was
   told to render verbatim, and this is the check that catches it.
2. **Text is legible and correctly spelled**, including inside chips, labels and
   axis ticks.
3. **The visible colours are the profile's** `bg` / `fg` / `accent`, not a
   palette the model substituted, and the accent sits on one object.
4. **Nothing that would embarrass the post**: a garbled logo, a fabricated
   third-party logo or trademark the prompt never asked for, a watermark, a
   distorted hand or face.
5. **Structure honesty, exactly as VISUALS §6.1 states it.** A taper claims
   filtering, equal tiles claim peer status, nesting claims containment, an
   arrow claims necessity, a segmented bar claims exhaustiveness. Read the image
   against the same standard the HTML was read against.

Also read `reference/design-tells.md`'s `[infographic]` and `[both]` entries.
Every rule there still holds; only the artifact it is read against changed.

**One policy covers every failure on that list.** A failure on 1 or 2 is a
redraft of the prompt with the wording problem named as a constraint. A failure
on 3, 4 or 5 is a retry with a more constrained prompt. Both use the same flag:

```
node render/imagegen/render.js infographic <R>/draft.md --profile <P> \
  --out <R>/final-2.png --note "The word 'boundary' was misspelled. Spell it exactly."
```

**Bounded at 3 attempts per image**, the same bound this pipeline uses
everywhere else, and each attempt writes its own file so there is something to
choose between. Past three, ship the attempt that reads best against the
checklist and name what is unresolved in one line. **No run ends without an
artifact.**

Picking the best of three is a judgment, not an arithmetic comparison. The text
gate's bound 3 has `gate --compare`; there is no image equivalent and this file
does not invent a scoring function to pretend otherwise. It is the same kind of
call step 5b already makes between two drafts.

**Never hand-patch a generated image.** The old rule was "do not patch the HTML,
it is generated." The new artifact inherits it: a fix regenerates the image from
an edited prompt or an edited spec, never edits pixels.

Write the verdict to `runs/<slug>/design-gate.md`: what was checked, what
changed, what was accepted on purpose, and what each attempt cost.

## Step 7: render

```
node render/imagegen/render.js infographic <R>/draft.md \
  --profile <P> --out <R>/final.png
```

One PNG, **1152x1536 at 3:4**, at `<R>/final.png`. `--profile` and `--out` are
both required and `--out` must resolve inside `--profile`; the renderer refuses
otherwise, per PRD §1.3. It writes exactly one file. There is no HTML beside it
any more, because step 6 reads the PNG.

**3:4 rather than 4:5, and it is a real craft deviation.** OpenRouter's route for
this model accepts `1:1, 3:2, 2:3, 4:3, 3:4, 16:9, 9:16, 21:9, auto`, and 4:5 is
not on that list. 3:4 is the closest available (0.75 against 0.80). Padding or
cropping to force 4:5 was considered and rejected: one adds visible bars, the
other crops a composition the model laid out edge to edge. VISUALS §5's craft
rules are unaffected; only the pixel target moved.

**Every call costs money and the renderer prints what it cost**, read off
OpenRouter's own `cost` field. Roughly $0.05 an image at the time of writing, so
a three-attempt image is roughly $0.15. Put the number in `design-gate.md`.

**When the render fails** it exits nonzero rather than writing a broken file:

| Failure | What to do |
| :- | :- |
| `--out is not inside --profile` | fix the path, never the guard |
| `theme.json is missing theme keys: ...` | a hand-edited theme. Run the bootstrap above |
| `theme.json names logo '<x>', not found` | fix the path or drop the key |
| `OPENROUTER_API_KEY is not set` | the key lives in the repo-root `.env`, gitignored. Never paste it into a file this repo tracks |
| `OpenRouter returned 4xx` | a refused prompt or a malformed request, printed verbatim. A content-policy refusal counts as one of the three attempts; retry with the offending phrasing named in `--note` |
| `OpenRouter returned 429/5xx` | the client already retried twice with backoff. Past that it counts as one attempt; wait and retry |

Bound the fix loop at three passes. A layout still missing its rubric after
three ships as the closest version with one line naming the gap, the same way
step 5's bound 3 works. **No run ends without an artifact**: if nothing renders
at all, say which failure fired and ship the spec's words as a short post.


## What this file does not do

It does not load the profile, select the anchor, check the locks, generate the
angles, write the brief beyond the `archetype:` line, run the language gate,
print the angle line or the rejects, or ask the ship question. Those are steps 1,
2, 3, 5 and 8, and they run identically for every format.

The visual path's output line is `angle · archetype · anchor · job`, one field
wider than the short post's, and the router prints it. The disqualified forms and
the runners-up print underneath it per VISUALS §2.3 step 16, **in addition to**
the four rejected angles and never instead of them.
