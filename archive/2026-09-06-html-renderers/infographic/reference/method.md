# Method — layout selection, copy budgets, density doctrine

## The one decision that matters: which layout?

**`content-engine-VISUALS.md` section 2 is the procedure and this file does not
restate it.** Fifteen signatures, each stating what it requires and what
disqualifies it; a disqualifier is fatal and no question clears it. What follows
is the signature-to-archetype map, so a selected signature reaches a template.

| VISUALS signature | Archetype |
| :- | :- |
| Trend poster 3.1 | `trend-poster` |
| Ranked bar list 3.2 | `ranked-bars` (`track: fixed` for the share variant) |
| Comparison table 3.4 | `comparison-panel` |
| Perception split 3.5 | `perception-split` |
| Analogy rows 3.6 | `analogy-rows` |
| Tile taxonomy 3.7 | `card-grid` (6-10 items) or `icon-list` (8-12) |
| Sourced shelf 3.8 | `sourced-shelf` |
| Stage stack 3.9 | `numbered-steps`, or `funnel` for the funnel variant |
| Stratified container 3.10 | `stratified-container` |
| Mirrored rings 3.11 | `mirrored-rings` |
| Composition split 3.12 | `composition-split` |
| Distribution strip 3.13 | `distribution-strip` |
| Variance bridge 3.14 | `variance-bridge` |
| Quadrant map 3.15 | `quadrant-map` |
| Causal chain 3.16 | `causal-chain` |

**Two archetypes map to no signature: `hybrid-playbook` and
`annotated-diagram`.** They render and they are kept, and selection never
reaches them. They are available **by explicit request only**, and a run that
uses one records that fact, because nothing in VISUALS section 2 chose it. A
request for either is a request for a form outside the catalog: `hybrid-playbook`
is a stats band over a section grid, which section 9.1 refuses as "a single
dominant number ... the quote card with a numeral in it" once the number is the
payload, and `annotated-diagram` is a hub with 4-6 parts, which is section 9.1's
flat list of four or five peers with a label in the middle. Neither has a
thumbnail contract in section 3 and neither has been measured against one.

**`funnel` is not the stratified container.** An earlier mapping sent section
3.10 to `funnel`, "taper only, no per-stratum counts". That is section 6.2's
named tell: a shape whose width changes across tiers with equal counts per tier
is decoration. `stratified-container` computes each band's width from its own
item count, which is what section 3.10 requires.

The older shape-first reading below still works for the seven original templates
and is kept for that:

- **It walks through ordered stages** ("first... then... finally", numbered
  steps, a process) -> `numbered-steps`.
- **It enumerates parallel things** (a set of N options/types/plays, no order)
  -> `card-grid`.
- **It contrasts named alternatives** (old way vs new way, A vs B vs C,
  before/after) -> `comparison-panel`.
- **It lists flat tactics / principles / reasons / signals** (no order, light
  items) -> `icon-list`.
- **Its hero is one or two numbers, plus supporting sections** -> `hybrid-playbook`.
- **It narrows a population to an outcome** (funnel, qualification, conversion)
  -> `funnel`.
- **It decomposes ONE concept into labeled parts** (a loop, a system, a hub with
  inputs) -> `annotated-diagram`.

### Tie-breakers
- Explicit ordinals present -> numbered-steps beats icon-list.
- Named competing options -> comparison-panel beats card-grid.
- A dominant stat -> hybrid-playbook.
- A single central object with parts -> annotated-diagram.
- Two still fit -> choose the one whose density the source can fill. A 3-point
  source should not be forced into a 10-card grid; a 12-point source should not
  be crammed into 5 steps.

## Density doctrine
These are dense by design: the reference set behind VISUALS §1 is
information-rich, not minimal posters. Fill the frame. The failure mode to avoid is the sparse
"minimal poster" look. But density never beats legibility: respect the budgets
below so nothing clips at 1080x1350.

## Copy budgets (per archetype)
| Archetype | Count | Key limits |
|---|---|---|
| numbered-steps | 3-6 steps | title <= 5 words; lead-in <= 8 words; 3-4 pills/step |
| card-grid | 4-10 cards | title <= 5 words; body <= 22 words (8-10 best fills the frame) |
| comparison-panel | 2-3 cols x 3-5 rows | header <= 3 words; bullet items <= 4, each <= 3 words; single-line value <= 10 words |
| icon-list | 8-12 items | title <= 4 words; description <= 14 words |
| funnel | 4-6 stages | label <= 4 words; detail <= 10 words |
| hybrid-playbook | 2-4 stats + 3-5 sections | stat value <= 5 chars; stat label <= 4 words; section title <= 4 words; body <= 16 words |
| annotated-diagram | 4-6 callouts | center <= 3 words; callout title <= 4 words; detail <= 10 words |
| perception-split | 4 items + 1 punchline | panel headlines <= 36 chars; items <= 60 |
| causal-chain | 3-4 nodes + terminal | label <= 17 chars; item <= 80 |
| trend-poster | 6-12 points | x labels <= 4 chars; sub <= 60; needs `footer` |
| distribution-strip | 8-30 observations | sub <= 60; reference_label <= 40; needs `footer` |
| ranked-bars | 4-8 rows (fixed track 8-11) | sub <= 46; item <= 48; needs `footer` |
| composition-split | 2-5 parts summing to 100 | sub and expectation <= 72; item <= 30; needs `footer` |
| variance-bridge | 3-6 contributions | sub <= 72; item <= 26; needs `footer` |
| sourced-shelf | 3 questions x 3 cards | sub <= 64; item <= 150; needs `footer` |
| analogy-rows | 3-5 rows | sub <= 52; item <= 90 |
| quadrant-map | 6-12 items, 4 quadrants filled | sub <= 120 (the placement rule); item <= 30 |
| stratified-container | 3-5 strata, 18-26 chips | item <= 220; chip <= 21; counts monotonic by 2 |
| mirrored-rings | 3 layers, 4-7 per side | item <= 240; chip <= 21; counts increase outward |

## Title doctrine (all archetypes)
The headline is a **functional descriptor of what the graphic shows**, with one
key phrase in `**...**` (renders as an accent-wash highlight box). It is never the
source post's hook. The shape, with the slots empty rather than filled from one industry:
- Source hook: a provocation. -> Title: `<N> Questions That Turn a **<thing>**
  Into <outcome>`.
- Source hook: a claim about a shift. -> Title: `The <N>-Step **<name>** Shift`.

## Gating discipline
Three tiers, cheap before expensive.

1. **`--check`** validates spec grammar, required fields, the no-kicker rule, the
   item counts and the character budgets, and the section 3 clauses that are
   exact arithmetic. It launches nothing. **It does not judge language**: on a
   visual run `draft.md` *is* the spec, so `reference/ai-tells.md` at pipeline
   step 5 already reads every word that reaches the canvas.
2. **The layout checks**, which run at build time on the generated HTML and
   print with the render: thumbnail legibility, tint against the page ground,
   reversed-label contrast. A contrast ERROR refuses the render. Reading the
   HTML as text is what keeps the gate cheap, per PRD section 4.
3. **The PNG**, read back once, and only after the first two are clean.

Bound fixes to ~3 loops; if a layout still misses its rubric, ship the closest
version and note the gap rather than thrash.

## Where the output lands
`profiles/<handle>/runs/<slug>/final.png`, per PRD §5, plus
`final.png.html` beside it, which is what the design gate reads. `render.py`
refuses an `--out` that is not inside `--profile`, per PRD §1.3.
