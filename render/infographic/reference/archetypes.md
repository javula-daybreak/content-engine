# Archetypes: grammar + visual rubric (all 19)

Every spec is front-matter + exactly ONE `:: <archetype>` block. There is no
`theme:` field: the theme comes from `--profile`, per `reference/themes.md`.

Shared front-matter, all optional and all empty by default:
`title:` (window/PNG title), `wordmark:` (the author's name, which
`workflows/infographic.md` reads off `identity.md`), `footer:` (a source line on
a data image). **Nothing here has a default string.** An engine that ships a
default tagline ships somebody's tagline.

Shared block fields: `headline:` (functional descriptor with one `**highlight**`
phrase) and `sub:` (italic one-liner). NO `kicker` (ERROR).

`**bold**` -> the accent-wash highlight. `[slug]` prefixes an item with an icon
from `profiles/<handle>/icons/<slug>.png`, and fails soft to no icon when the
profile carries none, which is the default: no icon set ships with the engine,
because an icon set is a brand asset. `|` separates compound fields; `;`
separates sub-items inside a field.

---

## numbered-steps
Sequential / ordered process.
- Required: `headline`, `items`.
- Item: `[icon] Title | Lead-in | pill; pill; pill` (icon, lead-in, pills optional).
- Render: double tinted rings (STEP 0N) alternating right/left, one solid
  serpentine connector (node + arrowheads + rounded U-turns), bordered ► pills.
- Budget: 3-6 steps; title <= 5 words; lead-in <= 8 words; 3-4 pills/step.
- Rubric: alternating rings + serpentine line (no dotted diagonal); every step
  has pills; descriptive highlight title; light footer; nothing clipped.

## card-grid
Parallel set of items / options / types.
- Required: `headline`, `items`.
- Item: `[icon] Title | Body`.
- Render: 2-col grid of numbered cards (accent number square + optional icon +
  bold title + body), rows stretch to fill the frame, content centered.
- Budget: 4-10 cards (8-10 fills best); title <= 5 words; body <= 22 words.
- Rubric: 2-col numbered cards fill the frame; bold title + readable body;
  white cards + hairline border; highlight title; light footer.

## comparison-panel
A vs B (vs C); before/after; old-way/new-way.
- Required: `headline`, `col1`, `col2` (`col3` optional -> 2 or 3 columns).
- Column: FIRST list item = column header (tinted bar; tints rotate
  green-wash / skyline / lime). Following items = `Label | value` rows; a
  `;`-delimited value -> ► bullet list, else a single line.
- Optional: `verdict_label` + `verdict` -> bottom summary band.
- `vs` badges render automatically between columns.
- Budget: header <= 3 words; 3-5 rows/col; bullets <= 4, each <= 3 words.
- Rubric: tinted header bars + `vs` badges; uppercase labels + bullet/line
  values; optional verdict band; highlight title; light footer.

## icon-list
A flat list of tactics / principles / reasons / signals.
- Required: `headline`, `items`.
- Item: `[icon] Title | Description`.
- Render: 2-col NUMBERED list (col 1 = items 1..k, col 2 = k+1..n), each row =
  accent number + prominent icon tile + bold title + short description,
  hairline dividers. Lighter than card-grid.
- Budget: 8-12 items; title <= 4 words; description <= 14 words.
- Rubric: 2-col numbered icon rows fill the frame; reads lighter than cards;
  highlight title; light footer.

## hybrid-playbook
Mixed stats + sections in one piece (a dominant number or two).
- Required: `headline`, `stats`, `items`.
- `stats:` list of `Value | Label` (2-4) -> hero number callouts.
- `items:` list of `[icon] Title | Body` (3-5) -> titled sections (auto 3-wide
  when the count is a multiple of 3, else 2-wide).
- Render: top tinted band of big-number callouts, then a section grid.
- Budget: stat value <= 5 chars; stat label <= 4 words; section title <= 4
  words; section body <= 16 words.
- Rubric: hero stat band + titled icon sections read as one coherent playbook;
  highlight title; light footer.

## funnel
A narrowing / conversion / qualification.
- Required: `headline`, `items`.
- Item: `[icon] Label | Detail` (top item = widest stage).
- Render: 4-6 stacked interlocking trapezoid bands narrowing top->bottom, green
  tint ramp (lime2 -> green -> forest2), centered white label + detail.
- Budget: 4-6 stages; label <= 4 words; detail <= 10 words.
- Rubric: clearly reads as a narrowing funnel; green progression; legible white
  text; highlight title; light footer.

## annotated-diagram
One central concept decomposed into labeled parts.
- Required: `headline`, `center`, `items`.
- `center:` scalar = the central hub label (<= 3 words).
- `items:` list of `[icon] Title | Detail` = the callouts (4-6).
- Render: central green hub node; callouts split left/right; each joined to the
  hub rim by a thin leader line with endpoint dots (deterministic Python
  geometry; > 6 callouts are clipped to 6).
- Budget: center <= 3 words; callout title <= 4 words; detail <= 10 words.
- Rubric: one legible central hub; 4-6 balanced callouts with clean leader
  lines; highlight title; light footer.

---

# The VISUALS section 3 signatures

Twelve more archetypes, added 2026-08-24, one per signature in
`content-engine-VISUALS.md` section 3. **That file outranks this one on what a
signature requires and what disqualifies it**; this section is the grammar and
the budget, which is what a draft needs.

One name per signature even where two share a builder, because `archetype:` in
`brief.md` is what PRD section 3's archetype lock counts and two signatures under
one name are indistinguishable to it.

**Six of them are data archetypes** (`trend-poster`, `distribution-strip`,
`ranked-bars`, `composition-split`, `variance-bridge`, `sourced-shelf`) and so is
`hybrid-playbook`, because it exists to print large numbers. All seven require
`footer:` to carry the source, per VISUALS section 4.2: no line, no render. The
subtitle carries the method and the sample; the footer carries who says so;
neither substitutes for the other.

**`--check` enforces the counts, the sums and the character budgets** below, and
it distinguishes the two classes deliberately: an exact clause (a count, a sum,
a monotonic ordering, an empty quadrant) is an ERROR, and every clause resting on
one of section 3's `[UNVERIFIED]` ratios is a WARN that prints the measured
number beside the threshold. **The layout checks run at build time**, on the
generated HTML, and print alongside the render. See the maintainer note below.

## perception-split
`argue`. The audience's model on top collapsed to one statement, the
practitioner's underneath as the same object subdivided into five.
- Required: `headline`, `naive_headline`, `naive_statement`, `real_headline`,
  `items`, `punchline`.
- `items:` exactly **4** parallel one-liners. `punchline:` is the fifth and it
  deliberately breaks their format. Four plus one, never five plus five: the
  asymmetry is the content and a symmetric spec is an ERROR.
- Optional: `naive_callout` (<= 40 chars, the aside on the naive panel).
- Budget: panel headlines <= 36 chars, statement and items <= 60.
- Rubric: one slot above against five below, same object width, leader lines
  crossing the object's edge, the divider bled to both canvas edges.

## causal-chain
`diagnose`. Root cause to mechanism to symptom to the cost somebody feels.
- Required: `headline`, `items`, `terminal_cost`.
- `items:` 3-4 nodes of `Label | gloss`. `terminal_cost:` is the last node and
  is a cost somebody feels, never a category.
- Optional: `break_after` (which link the argument cuts, 1-based) +
  `break_label`.
- Budget: 3-4 nodes; label <= 17 chars; item <= 80 chars.
- Rubric: one unbroken thread, no branches, the arrowheads reading downward, the
  terminal node visibly the payoff, the break bar on the named link.

## trend-poster
`quantify`. One numeric series, plotted alone.
- Required: `headline`, `sub`, `items`, `footer`.
- `items:` 6-12 points of `Label | value`, labels <= 4 chars.
- Optional: `y_max` (raised automatically to 1.15x the top datum if it is
  lower), `ticks` (4-5), `units` (e.g. `(in millions)`).
- Budget: 6-12 points; `sub` <= 60 chars; item <= 24.
- Rubric: zero baseline, no area fill, no legend, one value on the terminal
  point and nowhere else, tick labels larger than the subtitle.

## distribution-strip
`quantify`. Many observations of one measure against the value everyone assumes.
- Required: `headline`, `sub`, `observations`, `reference_value`,
  `reference_label`, `footer`.
- `observations:` 8-30 numbers on one line, comma or space separated.
- Optional: `unit`, `anonymize: true` (drops the two extreme annotations as well
  as any label, per VISUALS 2.5).
- Budget: 8-30 observations; `sub` <= 60 chars; `reference_label` <= 40.
- Rubric: one axis, one dot per observation, a labelled rule at the reference
  value, the two extremes annotated, nothing else.

## ranked-bars
`quantify`. Named categories, counts, longest first.
- Required: `headline`, `sub`, `items`, `footer`.
- `items:` 4-8 rows of `Label | value`, sorted descending by the author.
- Optional: `highlight` (1-based), `track: fixed` + `remainder_label` for the
  share-of-own-denominator variant (8-11 rows, square caps, numeral column).
- Budget: 4-11 rows; `sub` <= 46 chars; item <= 48.
- Rubric: no axis, no gridlines, no legend, values inside the right end of each
  bar on the ragged track, a ragged right edge legible with the numbers off.

## composition-split
`quantify`. Named parts of one stated whole, as one stacked bar.
- Required: `headline`, `sub`, `items`, `expectation`, `footer`.
- `items:` 2-5 parts of `Label | pct`, summing to 100 (+/-1). A sum that is not
  100 is an ERROR: a segmented bar asserts exhaustiveness.
- Optional: `leader` (1-based, the part that takes the accent).
- Budget: 2-5 parts; `sub` and `expectation` <= 72 chars; item <= 30.
- Rubric: one full-width bar, square edges, labels in a two-column list below
  and never inside a segment, no pie and no donut.

## variance-bridge
`diagnose`. A predicted value, an actual value, and what reconciles them.
- Required: `headline`, `sub`, `start`, `end`, `items`, `footer`.
- `start:` and `end:` are `Label | value`. `items:` 3-6 signed contributions of
  `Label | +n`.
- Optional: `payoff` (1-based, the contribution the author did not see coming),
  `residual_label` (**required** if the contributions do not close the gap).
- Budget: 3-6 contributions; `sub` <= 72 chars; item <= 26.
- Rubric: start and end grounded at zero, everything between floating,
  connector rules at each step's foot, the residual drawn and labelled.

## sourced-shelf
`enumerate`. Nine published items, grouped three and three and three.
- Required: `headline`, `sub`, `sections`, `items`, `footer`.
- `sections:` exactly 3 reader-voice questions, `;` separated. `items:` exactly
  9 cards of `Publisher | Title | Finding`, in section order, three per section.
- Budget: 9 cards; `sub` <= 64 chars; item <= 150; question <= 36.
- Rubric: publisher as the card's visual anchor, three tinted bands, questions
  rather than noun labels. **Highest fabrication surface in the catalog**: every
  publisher and title has to be real, per VISUALS section 4.

## analogy-rows
`transform`. Jargon as an everyday object on the left, the real thing right.
- Required: `headline`, `sub`, `items`.
- `items:` 3-5 rows of `Term | Equation | fact; fact`. All equations share one
  base noun, or the set is unrelated flashcards.
- Budget: 3-5 rows; `sub` <= 52 chars; item <= 90; term <= 14; equation <= 16.
- Rubric: identical slot order in every row, no illustration column, the
  equations reviewable as a set before publish.

## quadrant-map
`compare`. Many items crossed on two independent dimensions.
- Required: `headline`, `sub`, `quadrants`, `x_axis`, `y_axis`, `items`.
- `sub:` carries the placement rule, in one sentence the author will defend.
- `quadrants:` 4 names, `;` separated, in reading order: top-left, top-right,
  bottom-left, bottom-right. `x_axis:`/`y_axis:` are `low | high`.
- `items:` 6-12 of `Label | x | y`, x and y in 0-100. **All four quadrants must
  hold an item**; an empty one is an ERROR, because the axes are not
  independent.
- Optional: `highlight` (1-based).
- Budget: 6-12 items; `sub` <= 120 chars; item <= 30.
- Rubric: the four names carrying the payload, no rotated text, the cross
  heavier than the frame.

## stratified-container
`diagnose`. Named items sorted into ordered strata, in a shape whose width
tracks the counts.
- Required: `headline`, `items`, `notes`.
- `items:` 3-5 strata of `Label | chip; chip; ...`, 18-26 chips in total, counts
  changing monotonically by at least 2 per step. A flat ladder is an ERROR.
- `notes:` 3-5 author opinions, `;` separated, set in a distinct voice.
- Optional: `container: iceberg` puts the heavy boundary under the first
  stratum; anything else puts it at the last. `nested-arcs` is accepted and is
  **not** drawn as arcs.
- Budget: 3-5 strata; item <= 220 chars; chip <= 21.
- Rubric: width tracking the counts, one boundary heavier than the others,
  ordinals on every band, chips translucent over the tint, notes visibly not
  part of the data.

## mirrored-rings
`diagnose`. Three nested causal layers, split at the equator.
- Required: `headline`, `items`, `good_label`, `bad_label`.
- `items:` exactly 3 layers of `Label | good; good; ... | bad; bad; ...`, 4-7 per
  side, counts **increasing strictly outward** on both sides. Equal or
  decreasing counts are an ERROR: ring area grows as the square of the radius.
- Budget: 3 layers; item <= 240 chars; chip <= 21.
- Rubric: layer 1 innermost against the equator, ordinals on every band, the
  good half in the accent and the failure twin in an ink neutral, chips
  translucent. Sign is a luminance step because `accent_2` is VISUALS section 10
  decision 2 and it is open.

---

## Engine surface (for maintainers)
`render.py` -> `CORE_BUILDERS` (archetype -> builder), `REQUIRED` (archetype ->
required fields), `BUDGETS` (archetype -> item count and character ceilings),
`SOURCE_REQUIRED` (the archetypes that print numbers and so need a source line),
`LIST_KEYS` (`items`, `left`, `right`, `col1`, `col2`, `col3`, `stats`). Each
builder returns the `.core` inner HTML; the shell (head + light footer) is owned
by `render_canvas`.

**Nineteen archetypes over sixteen builders.** The plot canvas serves the trend
poster and the distribution strip, bar rows serve the ranked list and the
composition split, and the banded cluster serves the stratified container with
the mirrored rings as its reflection mode, per VISUALS section 8's table.

**`check_layout(doc, theme)`** is three of VISUALS section 6.3's five mechanical
checks, reading the built document as text: thumbnail legibility over every
`data-layer="claim"` node, generated tint ramps (`data-ramp`) against the page
ground in OKLab, and reversed-label contrast. It runs on `--html-only` and on a
full render; a contrast ERROR refuses the render, and the two checks whose
thresholds VISUALS tags `[UNVERIFIED]` warn instead. Row 4, required-parameter
fill, is `check_spec`. **Row 5, line-budget overflow, is not built**: it needs a
rendered line count, which needs glyph metrics for a font `theme.json` only
names. `check_layout`'s docstring holds the honest statement and the upgrade
path.

Two conventions the builders owe the checks: mark the claim atoms
`data-layer="claim"` (the thumbnail check has no operand otherwise), and never
redeclare `color` on a child class that also appears inside a filled parent, or
the class map disagrees with what the browser paints. CSS lives in `themes/_base.css` (one block
per archetype, unique class prefix); tokens come from
`profiles/<handle>/theme.json` via `theme_css()`, per `reference/themes.md`.
