# Design tells

The visual gate. PRD section 3 binds it, PRD section 10.3 is the specification,
and this file is the working list. It runs on every rendered frame before that
frame ships, on carousel slides and on single-frame infographics alike, and it is
not advisory. A frame that fails is respecified and re-rendered, then re-read.

**Nothing here is new.** Every entry is consolidated from PRD section 10.3,
`content-engine-VISUALS.md` sections 1, 4.2, 5.1 to 5.6, 6.1 and 6.2, and the
per-signature structure-honesty clauses in VISUALS section 3. The source is cited
on every entry, because a rule whose origin is lost is a rule nobody can
overturn. Where an entry consolidates two bullets that say the same thing in
different words, it says so.

## What it reads, and what it never reads

**Changed 2026-09-06: the generated image itself.** This section used to read:

> **Rendered HTML, as text.** Never a screenshot. PRD section 4 prices one
> 1080x1350 image at roughly 1,900 tokens every time it is looked at, and a whole
> deck's budget goes on looking at what the HTML already says in words. Both
> renderers keep the generated HTML beside their output for exactly this reason:
> `render/infographic/render.py` writes `final.png.html`, `render/carousel/render.py`
> writes `deck.html`.
>
> **The PNG or the PDF is read back at most once**, after this gate is clean, and
> only where the geometry cannot be settled from the markup.

Both renderers were replaced by `render/imagegen/`, which calls an
image-generation model. **There is no HTML.** The image is the only artifact, so
this gate reads the image, once per frame, before the human sees it. PRD section
4's token argument is unchanged and still correct; the cheaper alternative it
recommended no longer exists, and the cost increase is accepted rather than
hidden. The five-item checklist that runs alongside these entries is in
`docs/superpowers/specs/2026-09-06-imagegen-infographics-design.md` section 5.2,
and in the step 6 section of each workflow file.

**Every entry below is unchanged.** Only the artifact they are read against
changed, and an entry that named HTML as its evidence now names the pixels. Two
entries lost their mechanical backstop when `check_layout` was archived —
contrast and thumbnail legibility are read by eye on both paths now, where the
infographic path used to have them measured. A frame shipping without them
mechanically checked says so.

**This file serves both visual paths.** No entry may assume a single frame. An
entry tagged `[carousel]` is read per slide *and* across the deck; an entry
tagged `[both]` is read once per frame. The two paths differ in what a failure
costs, not in what a failure is: an infographic cannot be edited after posting,
and a deck's slide 1 decides whether anything after it is seen.

## Precedence: theme.json wins

A tell that would fire on a value `theme.json` legitimately sets does not fire.
The nine keys plus `logo` are the only source of brand values in the system, per
PRD section 10, and a gate that second-guesses them is a gate arguing with the
one file that knows what this person's work looks like. A square radius, a warm
ground, a hairline rule weight and a serif display face are decisions, not tells.

**What this does not excuse** is a value that fails a measurement: a tint that
collapses into the ground and a reversed label under 3:1 are failures whatever
the theme intended, and the renderer's own checks catch both.

**And this file is never edited for a person.** It ships identical to everyone
with every rule on. See Maintenance.

## The three bounds

1. **The generated HTML is never patched.** PRD section 10: the HTML is a build
   artifact of the spec, and hand-editing it puts the shipped image out of step
   with the `draft.md` the language gate read. Every fix is a new spec, then a
   re-render. There is no repair class on this path and that is the single
   biggest difference from `reference/ai-tells.md`.
2. **Structure honesty is checked against the material, not against the
   picture.** VISUALS section 5.5: geometry makes claims independently of the
   words, so the question is never "does this look right" but "does the material
   have the relationship this geometry asserts". If it does not, the fix is a
   different form, which sends the run back to VISUALS section 2's selection and
   possibly to its section 2.4 refusal.
3. **Every run of this gate leaves an artifact.** `runs/<slug>/design-gate.md`:
   what was checked, what changed, and what was accepted on purpose. The render
   is not written before that file exists, the same existence check pipeline step
   5 uses on `gate-report.md`.

## How to read an entry

Each tell is a `### <id>` heading with a scope tag. The id is what
`design-gate.md` prints and what a suppression in
`profiles/<handle>/gate-calibration.md` would have to name.

**Owner** is the same split PRD section 9 draws for language:

- `engine` means a mechanical check in a renderer. The tag in parentheses is the
  check that owns it, and several of these are guaranteed by construction: the
  template cannot emit the failure.
- `model` means a judgment. Nothing deterministic can produce it.
- `both` means the mechanical half is caught by a check and the open category is
  yours.

**Action** is one of three, and the absence of a fourth is deliberate:

- **Reject.** The frame does not ship in this form. Either the geometry lies
  about the material, in which case selection runs again, or a required piece of
  provenance is missing, in which case the fact is fetched or the digit does not
  ship. A reject is never talked past.
- **Redraft the spec.** The form is right and the spec is wrong: a budget, a
  count, a label, a tier, a hue. Fix the spec and re-render.
- **Flag.** Information for the human. Nothing changes and the gate still
  passes, which is why a flag is reported beside the pass rather than swallowed
  by it.

**There is no repair class**, because there is no artifact to patch. Bound 1 is
what makes that structural rather than stylistic.

---

## Structure honesty

**The strongest category in the file, and it is a class rather than a bullet**
(PRD section 10.3). Geometry claims things independently of the words: a taper
claims filtering, nesting claims containment, equal tiles claim peer status, a
bar claims independent magnitude, a shared axis claims comparability, depth
claims permanence, an `=` claims equivalence, an arrow claims necessity. **If the
material lacks the relationship the geometry asserts, the image lies while every
word on it stays true.** No language gate catches this.

### geometry-without-the-relation `[both]`

**Fires on:** any frame whose geometry asserts a relationship the material does
not have. The list of assertions is the paragraph above.
**Owner:** model. VISUALS section 5.5, PRD section 10.3.
**Reject:** and re-select. This is the one entry that can send a run to VISUALS
section 2.4's refusal, and the refusal is the honest output when nothing fits.

### counts-not-tracking-the-container `[infographic]`

**Fires on:** equal item counts across tiers of a shape whose width changes.
**Owner:** engine (`check_spec`, the stratified-container monotonicity clause).
VISUALS section 6.2, section 5.5's first corollary, section 3.10.
**Reject:** a shape that changes width with equal counts per stratum is
wallpaper behind three plain lists.

### symmetric-asymmetry `[infographic]`

**Fires on:** symmetric item counts in a perception-versus-reality image.
**Owner:** engine (`check_spec`, the perception-split count clause). VISUALS
section 6.2, section 5.5's second corollary, section 3.5.
**Reject:** equal labels on both sides means there is no thesis left; the image
reads as a neutral two-column comparison.

### truncated-baseline `[both]`

**Fires on:** a y-axis truncated above zero on a magnitude claim.
**Owner:** engine (the trend poster starts its axis at zero by construction).
VISUALS section 6.2, section 3.1.
**Reject:** a truncated baseline is a lie the geometry tells while every word on
the canvas stays true.

### parts-that-are-not-a-partition `[infographic]`

**Fires on:** a segmented bar whose parts do not sum to the stated whole, or
whose parts overlap or are a selection rather than a partition.
**Owner:** engine (`check_spec`, the composition-split sum clause). VISUALS
section 3.12, section 5.5.
**Reject:** a segmented bar asserts exhaustiveness. Either draw the remainder or
say "top 4 of n".

### absorbed-residual `[infographic]`

**Fires on:** a waterfall whose contributions do not close the gap, with the
difference folded into the last bar or dropped.
**Owner:** engine (`check_spec`, the variance-bridge residual clause). VISUALS
section 3.14.
**Reject:** an unexplained residue drawn as if it were explained is what makes a
waterfall dishonest. Draw it and label it. This is the one place in the catalog
where a rounding decision is a truth claim.

### arrow-without-necessity `[infographic]`

**Fires on:** a chain whose links the author would not defend as "remove X and Y
does not happen", or correlation drawn as causation with no stated mechanism.
**Owner:** model. VISUALS section 3.16.
**Reject:** otherwise the arrow is a sequence arrow wearing a causal one's
clothes, and the honest form is a stage stack.

### empty-quadrant `[infographic]`

**Fires on:** a 2x2 with a quadrant holding no real named item.
**Owner:** engine (`check_spec`, the quadrant-map occupancy clause). VISUALS
section 3.15.
**Reject:** an empty quadrant means the two axes are not independent, and the
honest form is a ranked list on whichever axis is doing the work. The related
failure this gate **cannot** see is a top-right quadrant holding only the
author's own position: axis selection is unfalsifiable, so no design gate catches
it and the printed placement rule is the only counterweight.

### repeated-structure-without-substance `[both]`

**Fires on:** a repeated slot filled to reach the count rather than because the
material had that many parts.
**Owner:** model. VISUALS section 5.5's third corollary, section 3.9's notes.
**Redraft the spec:** twenty chip slots will accept twenty words nobody stands
behind. If a stage cannot fill its row honestly, cut the stage.

---

## The two-layer law

Measured across fourteen images at 220px, which is roughly the size a LinkedIn
image first appears at in feed. Body text died in all fourteen. **The claim must
be complete in the headline plus the structure.** PRD section 10.1 generalizes it
to carousels unchanged: slide 1 has to survive at 220px or the swipe is never
earned.

### claim-below-the-feed-layer `[both]`

**Fires on:** a claim-carrying text node too small to survive 220px.
**Owner:** engine (`check_layout`, the thumbnail check). VISUALS section 1,
section 6.3 row 1.
**Redraft the spec:** shorten the headline so it can be set larger, or move the
claim up a tier. The threshold is `[UNVERIFIED 2026-08-17, owner Joseph]` and
the check warns with the measured number rather than failing the build, per
VISUALS section 1's instruction to tune it on the first ten renders.

### load-bearing-number-in-body-copy `[both]`

**Fires on:** the single most valuable fact on the frame set at body size.
**Owner:** model. VISUALS section 6.2, section 3.7's notes.
**Redraft the spec:** the load-bearing number belongs in a label, the headline,
or a badge. In the reference image it sat at 20px in a body paragraph, which the
thumbnail test proves is invisible.

### unscoped-frame `[both]`

**Fires on:** a frame with neither a subtitle nor an in-diagram scoping device
(zone labels, numbered banners, column headers).
**Owner:** model. VISUALS section 5.2.
**Flag** on a concept frame, **reject** on a data frame. The subtitle carries
scope and provenance and never payload; it is illegible at feed size in all
eight images that have one, and that is correct.

### slide-one-that-is-only-a-title `[carousel]`

**Fires on:** a first slide that carries a label rather than a claim.
**Owner:** model. PRD section 10.3, and PRD section 10.1 names this as the tell
the two-layer law was reaching for.
**Redraft the spec:** slide 1 is the hook and it must stand alone at 220px.

---

## Chart and diagram furniture

Deduplicated from all fourteen teardowns, VISUALS section 6.2. Each is a failure
someone would actually ship.

### unearned-legend `[both]`

**Fires on:** a legend restating names already printed on the marks, or a legend
of any kind for a single series. VISUALS carries these as two bullets; they are
one rule with two forms.
**Owner:** model.
**Redraft the spec:** a legend is earned only when the series identity is not on
the mark itself.

### every-point-labelled `[both]`

**Fires on:** data labels printed on every point.
**Owner:** both (the trend poster prints the terminal value only; any other mark
is yours). VISUALS section 6.2, section 3.1.
**Redraft the spec:** annotate the terminal point or nothing.

### area-fill-under-one-line `[both]`

**Fires on:** an area fill under a single line.
**Owner:** engine (the plot canvas never emits one). VISUALS section 6.2.
**Reject.**

### nice-round-axis-max `[both]`

**Fires on:** on the plot canvas only, an axis maximum rounded up to a nice
number rather than pinned just above the top datum.
**Owner:** engine (`y_max` is raised to 1.15x the top datum and no further).
VISUALS section 6.2, section 3.1.
**Flag:** the ranked bar list has no axis at all, by section 3.2, so this never
applies there.

### value-outside-the-bar `[infographic]`

**Fires on:** a bar value printed outside the bar on a ragged track.
**Owner:** engine (bar rows print the value inside the right end). VISUALS
section 6.2, section 3.2.
**Reject:** an outside gutter shortens every bar and flattens the gaps that are
the whole point. The fixed-track variant is exempt and uses a numeral column.

### rank-numeral-in-a-badge `[both]`

**Fires on:** rank numerals wrapped in circles, pills, or badges.
**Owner:** model. VISUALS section 6.2.
**Redraft the spec.**

### pie-or-donut `[infographic]`

**Fires on:** a pie or a donut, with or without a legend.
**Owner:** engine (the composition split draws one horizontal stacked bar and
nothing else). VISUALS section 3.12.
**Reject:** a pie forces angular comparison, which people read badly, and a
segmented donut with a legend is a design tell in its own right.

### smuggled-quantitative-claim `[both]`

**Fires on:** a bar or line mark carrying a colour ramp or a directional arrow
with no labelled values and no source line.
**Owner:** model. VISUALS section 4.2's second anti-pattern.
**Reject:** the middle state is a smuggled fabrication. Either carry labelled
values plus a source, or carry no ramp and no arrow.

---

## Colour

Measured hue counts across the fourteen: 1, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 6,
7. Median 3. The 6-hue and 7-hue images are the two borrowing third-party brand
colours and both carry the longest failure-mode lists in the set. VISUALS
section 5.4.

### hue-count-over-three `[both]`

**Fires on:** more than three hues where hue is not encoding a stated dimension.
**Owner:** model. VISUALS section 5.4.
**Redraft the spec:** an ordinal is a luminance dimension, not a hue dimension.
Step one hue through luminances instead.

### decorative-accent `[both]`

**Fires on:** an accent whose appearances do not form a coherent reading route.
**Owner:** model. VISUALS section 5.4, and it is the best single rule in that
section.
**Redraft the spec:** list every element carrying the accent. In the working
images the list reads like a path (highlighted headline span, then the term pill,
then the footer prompt); in the failing case it reads like a shuffle. Measured
discipline: the two accent values in the trend poster sum to 4% of
non-background pixels.

### tint-against-the-background `[both]`

**Fires on:** a panel or band fill within a few percent of the page ground in
OKLab lightness.
**Owner:** engine (`check_layout`, the tint check, over every generated ramp).
VISUALS section 5.4, section 6.3 row 2.
**Redraft the spec:** tints are checked against the page background, never
against each other. Measured failure: two panel fills collapsing to white at
220px, so an image promising four steps showed two. The 0.04 threshold is
`[UNVERIFIED 2026-08-17, owner Joseph]`, so the check warns with the measured
delta.

### reversed-label-set-globally-white `[both]`

**Fires on:** reversed text whose contrast against its own fill falls below
4.5:1 for body or 3:1 for large text.
**Owner:** engine (`check_layout`, the contrast check; `theme_css` also derives
`--on-accent` from whichever of fg and bg actually contrasts). VISUALS
section 5.4, section 6.3 row 3.
**Reject:** reversed labels are luminance-switched per fill, never set globally
to white. Measured failure: a white numeral on `#FFD401`, under 3:1 and
effectively unreadable. This is the one layout check that fails the build, because
4.5:1 and 3:1 are WCAG rather than one of VISUALS section 3's untagged ratios.

### announced-and-abandoned-colour `[both]`

**Fires on:** a colour assigned in a header that does not appear at least twice
more in the body.
**Owner:** model. VISUALS section 5.4's threshold, cited by sections 3.4 and 6.2.
**Redraft the spec:** the code was announced and abandoned.

### tint-with-no-rule `[both]`

**Fires on:** a tint assigned with no semantic rule and no visibly regular
repeat.
**Owner:** model. VISUALS section 6.2.
**Redraft the spec:** it makes the reader hunt for a meaning that does not exist.

### opaque-chip-on-a-tint `[infographic]`

**Fires on:** opaque label chips on a tinted field.
**Owner:** engine (the banded cluster's chips are a `color-mix` toward
transparent). VISUALS section 6.2, section 3.11.
**Redraft the spec:** an opaque chip kills the field's grouping signal. 40 to 55%
alpha.

---

## Type

Two weights do the work; a third is a hedge on hierarchy. Measured
headline-to-body cap-height ratios cluster at 3x to 3.5x. VISUALS section 5.3.

### rotated-text `[both]`

**Fires on:** text rotated 90 degrees, and any y-axis title.
**Owner:** engine (no template emits rotated text; the quadrant map states its
vertical poles as two horizontal labels). VISUALS section 5.3, section 6.2.
**Reject:** bake the unit into every tick and state it once in the subtitle.

### hierarchy-outside-3x `[both]`

**Fires on:** a headline-to-body cap-height ratio outside roughly 2x to 5x.
**Owner:** model. VISUALS section 5.3, PRD section 10.3's "what good looks like".
**Flag:** target 3x to 3.5x. Above 5x the body has become a footnote the author
still expects to be read; the set's own 1.75x image is the one whose teardown
reports the weakest separation.

### three-line-headline `[both]`

**Fires on:** a headline over eight words, or one running to a third line.
**Owner:** both (the word count is `check_spec`; the rendered line count is
VISUALS section 6.3 row 5, which is not built). VISUALS section 5.1.
**Redraft the spec:** three to eight words, median five, and never a third line.
The two that run two lines break at a grammatical seam.

### highlight-on-both-lines `[both]`

**Fires on:** typographic emphasis on both lines of a two-line headline, or on
more than one span.
**Owner:** model. VISUALS section 5.1.
**Redraft the spec:** one span, and on a two-line headline the highlight goes on
the shorter line. Highlighting everything is bolding a whole paragraph.

### all-caps-outside-condensed-display `[both]`

**Fires on:** all-caps display type at anything other than an ultra-heavy
condensed weight.
**Owner:** model. VISUALS section 5.3.
**Flag:** sentence case throughout is the safe default and four of the strongest
images use nothing else.

---

## Layout and alignment

### centered-content-layer `[both]`

**Fires on:** a body of comparable items centered rather than aligned to a
shared edge.
**Owner:** model. **This is the revision of the "everything centered" entry**,
which was violated by 9 of 14 reference images including every strongest one.
VISUALS section 6.1, PRD section 10.3, which accepts it as the one revision of
the two proposed.
**Redraft the spec:** centering a *title stack* is correct, because a headline
and subtitle are full-width single objects with nothing to compare against.
Centering a *radially symmetric diagram* is structurally required; a bullseye
with an off-axis center is broken. The tell is narrower than the old rule:
centering a comparable set destroys the shared baseline that makes it scannable.

### three-cards-to-fill-space `[both]`, PROPOSED and not enforced

**Fires on:** a trio invented to fill space rather than a genuine enumeration
that happens to have three parts.
**Owner:** model. VISUALS section 6.1, PRD section 10.3.
**Flag only.** Held as a proposal pending PRD section 13.2 step 4's negative
control. Its evidence is two images, both explained after the fact, and its
proposed test (does removing one card remove information) is a judgment the model
would apply to its own output. Converting a hard gate entry into a
self-assessment is the failure PRD section 9's "zero tolerance is a promise only
the deterministic half can keep" exists to prevent. **Do not enforce this entry
until the control runs.**

### default-safe-margin `[both]`

**Fires on:** a side margin that landed on a default rather than on a decision.
**Owner:** model. VISUALS section 5.1's margin finding.
**Flag:** full bleed (measured L0.0 R0.0) and a generous margin (measured 7.3% to
11.8%) are both decisions. The band between them is where an untouched template
lands, and the tell is the unchosen inset rather than any number.

### inset-divider `[both]`

**Fires on:** a divider inset to the content margin rather than bled to both
canvas edges.
**Owner:** engine (the split panel's divider and the mirrored rings' equator both
bleed). VISUALS section 6.2, section 3.5's notes.
**Redraft the spec:** an inset rule reads as a section break and lets one panel's
frame carry into the next.

### polite-leader-line `[infographic]`

**Fires on:** a leader line that stops at a shape's outline rather than crossing
into it.
**Owner:** engine (the split panel's leaders start inside the slot and cross its
edge). VISUALS section 6.2, section 3.5's notes.
**Redraft the spec:** a line that stops politely reads as a floating arrow rather
than as pointing at a part.

### uniform-border-weight `[both]`

**Fires on:** one border weight across header rules, column rules and body rules.
**Owner:** model. VISUALS section 6.2.
**Redraft the spec.**

### identically-drawn-tier-boundaries `[infographic]`

**Fires on:** a tiered layout whose boundaries are all drawn identically.
**Owner:** engine (the banded cluster draws one boundary heavier). VISUALS
section 6.2, section 3.10's notes.
**Redraft the spec:** a ranked diagram that claims tiers has to draw at least
one of them.

### label-repeated-on-every-row `[both]`

**Fires on:** a label repeated identically on every row.
**Owner:** model. VISUALS section 6.2.
**Redraft the spec:** it belongs in a column header.

### row-label-not-derivable `[both]`

**Fires on:** a row label that someone seeing only that row could not derive
from its contents.
**Owner:** model. VISUALS section 6.2.
**Redraft the spec:** the symptom is that the reader's eye stops crossing the
column rule.

### slots-out-of-order `[both]`

**Fires on:** a comparison layout whose rows do not share an identical slot
order.
**Owner:** model. VISUALS section 6.2, section 3.6.
**Reject:** rows drifting out of parallel is the failure where the left cell
answers the dimension and the right cell answers something else.

### uniform-chip-lengths `[infographic]`

**Fires on:** uniform chip lengths inside a wrapping cluster.
**Owner:** model. VISUALS section 6.2, section 3.10's notes.
**Flag:** all-equal-width chips reflow into a rigid grid and the pile stops
reading as assembled by a person. The longest item should be at least twice the
shortest.

### ornament-that-fits-only-some `[both]`

**Fires on:** an in-element ornament that only fits some instances.
**Owner:** model. VISUALS section 6.2.
**Redraft the spec:** it fits the smallest instance or it appears on none.

### parallel-list-of-n `[both]`

**Fires on:** a perfectly parallel list of N items, all sharing one grammar and
one line count.
**Owner:** model. VISUALS section 6.2, and it is the visual twin of PRD
section 9's ban on perfectly parallel bullet structure.
**Redraft the spec:** break the format on one item deliberately, which is what
the perception split's fifth item and the tile taxonomy's varied bodies do.

---

## Provenance

Both places are load-bearing and neither substitutes for the other: the subtitle
answers how it was measured, the footer answers who says so. VISUALS section 4.2.

### digit-with-no-source-region `[both]`

**Fires on:** any digit in body copy on a frame whose layout has no source
region, and any data archetype with an empty source line.
**Owner:** engine (`check_spec`, `SOURCE_REQUIRED`). VISUALS section 4.2's first
anti-pattern, section 4.1 step 7.
**Reject:** no line, no render. If the layout has no room for a source region,
the digit does not ship.

### missing-method-in-the-subtitle `[both]`

**Fires on:** a data frame whose subtitle does not state the measure, the sample
and the window.
**Owner:** model. VISUALS section 4.2, section 5.2.
**Reject:** this is the half that dies at feed size and it is what makes the
claim honest to anyone who stops.

### fabricated-attribution `[infographic]`

**Fires on:** a publisher, a title, or a report name on the canvas that has not
been verified.
**Owner:** model. VISUALS section 3.8, section 4, PRD section 14.
**Reject:** the sourced shelf has the highest fabrication surface in the catalog
and a fabricated report title is the most checkable lie on it. A wrong number
inside a rendered PNG cannot be edited after posting, which is why this path gets
the strictest gate in the system.

---

## Furniture the engine will not draw

Each of these is refused rather than judged, and the template is what enforces
it. They are listed because a request for one arrives about once a month.

### quote-card `[both]`

**Fires on:** a sentence in large type on a coloured rectangle, with or without a
numeral in it.
**Owner:** engine (VISUALS section 2.4 makes the engine structurally incapable of
producing one; no archetype draws it).
**Reject:** it carries no information the post text does not, and it is the most
common AI-made LinkedIn image in existence. It is the visual em dash.

### follow-and-repost-bar `[both]`

**Fires on:** a dark full-bleed strip asking for a follow or a repost.
**Owner:** engine (the footer is a signature; the posture is hardcoded). VISUALS
section 5.6, PRD section 10.3.
**Reject:** it is the densest band on the canvases that carry one and entirely
illegible at feed size, so it only ever addresses a reader who already stopped.

### generated-avatar `[both]`

**Fires on:** a generated avatar, an emoji face, or an anonymous silhouette
standing in for a real headshot.
**Owner:** engine (no template draws a face). VISUALS section 6.2, section 5.6,
section 9.
**Reject:** drop the circle and keep the italic name. A placeholder beside a real
name is worse than absence.

### eyebrow `[both]`

**Fires on:** a kicker or eyebrow above the headline.
**Owner:** engine (`check_spec` errors on `kicker`, and there is no eyebrow
zone).
**Reject.**

### template-default-theme `[both]`

**Fires on:** a frame rendered from `profiles/_template`'s defaults.
**Owner:** model. VISUALS section 5.1's "looks like a template because it is
one", PRD section 7a, which makes the first visual run the one write that creates
`theme.json`.
**Reject:** ask for the nine keys before drafting, write the file once, and say
so in one line.

---

## Carousel structure

`[carousel]`, and these are the entries that read across frames rather than
within one. PRD section 10.3.

### slide-carrying-two-beats

**Fires on:** an interior slide carrying more than one beat.
**Owner:** model. PRD section 10.3.
**Redraft the spec:** slides 2 through N each carry one beat.

### final-slide-is-a-cta

**Fires on:** a final slide that asks rather than concludes.
**Owner:** model. PRD section 10.3.
**Redraft the spec:** the final slide is a takeaway.

### one-frame-holding-a-deck

**Fires on:** a single frame carrying eight beats, or a deck whose material needs
no sequence across frames.
**Owner:** model. VISUALS section 9's "carousels dressed as infographics".
**Reject:** if the material needs sequence across frames it is a carousel, and a
single frame holding eight beats is a carousel someone forgot to cut. The
infographic forms are single-frame by construction.

---

## The mechanical checks

VISUALS section 6.3 specifies five for the infographic renderer, and PRD
section 10.3 names four of them plus the overflow check the carousel renderer
already had. What exists, as of 2026-08-24:

| Check | Where | State |
| :- | :- | :- |
| Thumbnail legibility | `render.py check_layout` | **Built.** Declared font size of every `data-layer="claim"` node, scaled to 220px. WARN, because the 40px floor is `[UNVERIFIED]` |
| Tint against background | `render.py check_layout` | **Built.** Every generated ramp step re-mixed in OKLab against the page ground. WARN, because 0.04 is `[UNVERIFIED]` |
| Reversed-label contrast | `render.py check_layout` | **Built.** ERROR, and it refuses the render: 4.5:1 and 3:1 are WCAG |
| Required-parameter fill | `render.py check_spec` | **Built.** Required fields, item counts, character budgets, and the source line on every archetype that prints a number |
| Line-budget overflow | none | **Not built.** It needs a rendered line count, which needs glyph metrics for a font `theme.json` only names. A character-count proxy for it is the required-parameter check under another name |

**The first is the one worth having even if the others slip.** It is the only
mechanical test of the two-layer law, and the two-layer law is the finding the
whole visual system rests on.

**A check that warns is still a check.** Two of the three thresholds are tagged
`[UNVERIFIED 2026-08-17, owner Joseph]` in VISUALS, and blocking a render on a
number the specification itself calls a starting value would be marking our own
homework. Both print the measured number beside the threshold, which is what
lets the first ten renders settle them.

---

## Testing this file

There is no fixture corpus for design tells and that is a real gap, not an
omission with a reason. `reference/ai-tells.md` has `gate-fixtures/`: twenty
known-AI posts with an expected catch each, which is what makes its recall a
number rather than a claim. The equivalent here would be a set of rendered HTML
frames with an expected catch each, and the honest place to get them is the first
ten runs of each renderer rather than by writing failures on purpose.

What is testable today, and is tested:

```
python3 -m unittest discover -s render/infographic/tests
```

The engine-owned entries above are asserted there, one test per clause: the
counts, the sums, the monotonic orderings, the empty quadrant, the source line,
the character budgets, the contrast failure, the collapsing tint ramp, and the
claim layer's existence. **An entry marked `engine` with no test is a claim with
no test**, which is the same bar `ai-tells.md` sets, and it is the bar to hold
when this file grows.

---

## Maintenance

Living file. When Joseph spots a tell in the wild he says so, and it is appended
here with the date. The same rule `ai-tells.md` carries applies: a tell with no
test is a claim with no test, so an `engine`-owned entry arrives with its assert.

**Nothing in this file is retired because it fired on one person.** It ships
identical to every install, per PRD section 1.2, so striking a rule here because
it over-fires on one person's visual habits hardcodes those habits into every
future install. That is the portability defect `ai-tells.md`'s maintenance
section names, arriving on the visual path.

**The escape hatch is the one that already exists, and it is not a second
mechanism.** A rule that over-fires for a person is suppressed for them in
`profiles/<handle>/gate-calibration.md`, with the evidence that did it, under the
five conditions PRD section 9 sets: evidence or nothing, absence means everything
fires, reported and never silent, only the class that edits something the person
chose, and the shipped file untouched. That file is already the gate's
per-profile suppression layer, and a design-tell id belongs in it the same way a
language-tell id does.

**One consequence, stated because it is the only place the two gates diverge on
mechanics.** A language suppression is written at setup, from the negative
control over the samples the person pasted (PRD section 6.2). There is no
equivalent corpus for design: nobody arrives with rendered frames, so **no
design-tell line can exist at setup, and an absent one means the rule is live**,
which is condition 2 and the correct default. The evidence has to come from this
person's own shipped frames, which makes the writer `/content-engine review`'s
re-measure, the same path PRD section 7a already gives that file. Setup writes no
design line and must not invent one; a suppression somebody typed is a rule
switched off by preference and is indistinguishable in the file from one switched
off by measurement.

**Two things follow from PRD section 9's fourth condition, and they are the whole
of what is suppressible here.** Only the class that edits something the person
chose is suppressible, and a reject never is.

- **Suppressible:** the `flag` and `redraft` entries that are `model`-owned and
  are matters of visual habit. `centered-content-layer`,
  `hierarchy-outside-3x`, `all-caps-outside-condensed-display`,
  `default-safe-margin`, `uniform-chip-lengths` and
  `three-cards-to-fill-space` are the realistic candidates: each could contradict
  a documented habit of somebody whose work is good.
- **Never suppressible:** every `reject`, which is structure honesty, provenance,
  and the furniture the engine will not draw. No volume of evidence about a
  person's taste is evidence that a taper may claim filtering the material does
  not contain, or that a digit may ship without a source. That is PRD section 9's
  clearance carve-out applied to geometry, and the reasoning transfers exactly:
  what a reject guards is not a matter of taste.

Before suppressing anything, check precedence first: a tell contradicted by a
value `theme.json` legitimately sets does not fire at all, and no calibration
line is needed for it.

**Retirement still exists, for one case only:** a rule that is wrong *as a rule*,
which means wrong about design rather than inconvenient for one person. Struck by
strikethrough on the heading, `### ~~tell-id~~`, with the date and the reason, so
it stops firing and stays visible. The test to apply is whether striking it would
be correct for a stranger who has never used this engine. Deleting a struck entry
is the mistake to avoid: the next person to notice the same pattern re-adds it,
and the reason it failed is gone.

**One scoping rule, from VISUALS section 6.1.** The entries derived from the
fourteen single-frame infographics enter tagged `[infographic]` and do not reach
carousels until carousel evidence exists. Overturning or extending a shared rule
from a sample holding none of the artifact it governs is not sufficient, whatever
the count. An entry moves to `[both]` when it has been read against real decks,
and the move is recorded below.

### Changes

- **2026-08-24.** File created, at the build step PRD section 1.2's ships list
  named and PRD section 3 binds the design gate to. 57 entries, none new:
  consolidated from PRD section 10.3, VISUALS sections 1, 3, 4.2, 5.1 to 5.6,
  6.1 and 6.2. Both visual workflows had been pointing at PRD section 10.3 and
  VISUALS section 5 directly, because this file did not exist.
- **2026-08-24.** `centered-content-layer` lands as the revision of "everything
  centered", per VISUALS section 6.1 and PRD section 10.3.
  `three-cards-to-fill-space` lands as a flag and is explicitly not enforced,
  pending PRD section 13.2 step 4's negative control.
- **2026-08-24.** Three of VISUALS section 6.3's five mechanical checks built in
  `render/infographic/render.py`; row 5 recorded as not built, with the reason
  and the upgrade path. The contrast check found and fixed one live failure in a
  shipped template on the day it was built: `--muted` stat labels on the tinted
  band measured 2.91:1 at 19px.
- **2026-09-06.** **The gate reads the image, not the markup.** Both HTML
  renderers were replaced by `render/imagegen/`, which calls an image-generation
  model, so there is no `final.png.html` and no `deck.html` to read instead of
  the picture. **No entry changed and no entry was added or removed**: the rules
  are the rules and only their evidence moved. Two entries lost the mechanical
  backstop the previous line records — contrast and thumbnail legibility are
  read by eye on both paths now. A five-item verbatim-text and artifact
  checklist runs alongside these entries on every frame; it lives in each
  workflow's step 6 and in
  `docs/superpowers/specs/2026-09-06-imagegen-infographics-design.md` section
  5.2, not here, because it checks the render against the spec rather than
  against taste.
