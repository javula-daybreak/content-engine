# Infographic

`/content-engine infographic <topic>` lands here.

**This file owns pipeline steps 4, 6 and 7: the draft, the design gate, and the
render.** Steps 1, 2, 3, 5 and 8 belong to the router in `SKILL.md`. A line here
that restates one of them is a bug, because two copies of a rule is two places
for it to be wrong.

The renderer is `render/infographic/`, stdlib Python driving headless Chrome.
Nothing to install. Throughout, `<P>` is `profiles/<handle>` and `<R>` is
`<P>/runs/<slug>`.

## Step 4a: select the form

**`content-engine-VISUALS.md` §2 is the procedure and this file does not restate
it.** Read it and run it: §2.3's sixteen steps, §2.5's clearance filter, §2.4's
refusal, §2.1's archetype lock. Its §3 catalog is the authority on what each
signature requires and what disqualifies it, and it outranks
`render/infographic/reference/archetypes.md`, which describes templates rather
than signatures.

Two things this file owns.

**The archetype value.** The router created `<R>/brief.md` at step 3 with
`archetype:` empty. Fill it here, before any draft token is spent, per VISUALS
§2.3 step 15. It is the only line this workflow writes into the brief.

**Which signatures have a template.**

**All fifteen of VISUALS §3's signatures have a template, as of 2026-08-24.**
The signature-to-builder map lives in `render/infographic/reference/method.md`
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
never for a missing template. VISUALS §8's "three refusals naming the same
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
| Grammar and budgets | `render/infographic/reference/archetypes.md` and `reference/method.md`. Exceeding a budget is what clips a layout. |

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
`render/infographic/reference/themes.md`, along with the optional `logo`, whose
path must sit inside the profile. No `logo` means a footer with no mark, which is
correct and not a degraded state.

Rendering from `_template` defaults produces the "looks like a template because
it is one" failure VISUALS §5.1 names. Do not skip this and render anyway.

## Step 6: the design gate

**The gate runs on the rendered HTML as text, never on a screenshot.** Looking at
a 1080x1350 image costs roughly 1,900 tokens per look and there is deliberately
no infographic token budget yet, per PRD §4. Cheap first, then the HTML:

```
python3 render/infographic/render.py <R>/draft.md --check
python3 render/infographic/render.py <R>/draft.md \
  --profile <P> --out <R>/final.png --html-only
```

`--check` validates spec grammar and layout: required fields, the no-kicker rule,
per-archetype count and character budgets, and the §3 disqualifiers that are
exact arithmetic — sum-to-100, residual closure, monotonic strata, rings
increasing outward, an empty quadrant. **It does not judge language.** It checked
em dashes until 2026-08-20; that copy was removed because `reference/ai-tells.md`
at step 5 is the sole authority and on a visual run `draft.md` *is* this spec, so
the gate already reads every word that reaches the canvas. `--html-only` writes
`<R>/final.png.html` and launches no browser.

**ERROR is reserved for exact clauses.** Any clause resting on one of §3's
`[UNVERIFIED]` ratios is a WARN that prints the measured number beside the
threshold, because blocking a render on a number the spec itself calls a starting
value is marking our own homework.

**The rules are already written and this file adds none.** Read the HTML against
`reference/design-tells.md`, which consolidates them with a citation on every
entry: VISUALS §5's craft rules, §6.1 and §6.2's taste rules, and PRD §10.3.
Entries are tagged, and this path reads the `[infographic]` and `[both]` ones.

**Write the verdict to `runs/<slug>/design-gate.md`, and do not render before it
exists.** That mirrors step 5's own existence check, and `design-tells.md` bound
3 requires it on both visual paths.

**Structure honesty is what to read for first.** Geometry claims things
independently of the words: a taper claims filtering, equal tiles claim peer
status, nesting claims containment. If the material lacks the relationship the
geometry asserts, the image lies while every word on it stays true, and no
language gate catches that.

A failure goes back to step 4b and the spec is redrafted. **Do not patch the
HTML**: it is generated, so an edit to it is gone on the next render.

**Four of VISUALS §6.3's five mechanical checks are built** and run inside
`check_layout(doc, theme)`, which reads the built HTML as text per PRD §4's cost
argument: thumbnail legibility, tint-against-background, reversed-label contrast,
and required-parameter fill. A contrast failure is an ERROR and refuses the
render, because 4.5:1 and 3:1 are WCAG rather than taste; the other thresholds
warn, since they are `[UNVERIFIED]`.

**The fifth, line-budget overflow, is deliberately not built.** It needs a
rendered line count per slot, which needs glyph metrics for a face `theme.json`
only ever *names* and Chrome resolves at render time. A character-count proxy
would be the budget check wearing the overflow check's name, and §6.3 is explicit
that row 5 exists because row 4 already covers budgets. The upgrade path, costed
and not taken: inject a script writing `getClientRects().length` onto each slot,
run Chrome with `--dump-dom`, read the attributes back — a second Chrome launch
per render.

Check 1's stated ceiling: it reads the **declared** font size against a 0.70 cap
ratio, so it cannot see a wrap, a shrink-to-fit, or a face whose real cap ratio
differs. §6.3 row 1 asks for rendered cap height; this is the honest
approximation, and it says so in its own docstring.

## Step 7: render

```
python3 render/infographic/render.py <R>/draft.md --profile <P> --out <R>/final.png
```

One PNG, 1080x1350 at 2x, so 2160x2700, at `<R>/final.png`. `--profile` and
`--out` are both required and `--out` must resolve inside `--profile`; the
renderer refuses otherwise, per PRD §1.3. It writes exactly two files, the PNG
and `final.png.html` beside it, and keeps the HTML because step 6 reads it.

**When the render fails** it raises rather than writing a broken file, and it is
one of four things:

| Failure | What to do |
| :- | :- |
| `--out is not inside --profile` | fix the path, never the guard |
| `theme.json is missing theme keys: ...` | a hand-edited theme. Run the bootstrap above |
| `theme.json names logo '<x>', not found` | fix the path or drop the key |
| `Chrome render failed (exit N)` | report the exit and Chrome's stderr verbatim, retry once at most |

Bound the fix loop at three passes. A layout still missing its rubric after three
ships as the closest version with one line naming the gap, the same way step 5's
bound 3 works. **No run ends without an artifact**: if nothing renders at all,
say which failure fired and ship the spec's words as a short post.

## What this file does not do

It does not load the profile, select the anchor, check the locks, generate the
angles, write the brief beyond the `archetype:` line, run the language gate,
print the angle line or the rejects, or ask the ship question. Those are steps 1,
2, 3, 5 and 8, and they run identically for every format.

The visual path's output line is `angle · archetype · anchor · job`, one field
wider than the short post's, and the router prints it. The disqualified forms and
the runners-up print underneath it per VISUALS §2.3 step 16, **in addition to**
the four rejected angles and never instead of them.
