# Prompt catalog, infographics

One entry per `content-engine-VISUALS.md` §3 signature, plus the two
explicit-request-only forms. Each entry is the geometry sentence `prompt.js`
puts in the prompt under `LAYOUT: <archetype>`, and the required fields
`--check` enforces.

**Source of truth: `prompt.js`.** `RECIPES.infographic` holds the sentences and
`REQUIRED.infographic` holds the fields. If this file and that object disagree,
re-derive this file; **the CODE wins**, the same rule
`render/carousel/reference/archetypes.md` has always stated about its own
renderer.

**This file is a prompt reference, not a selection guide.** Which signature a
run gets is decided by `content-engine-VISUALS.md` §2's procedure and §5's craft
rules. VISUALS §3 remains the authority on what each signature requires and what
disqualifies it; nothing about selection changed when the renderer did.

## What every prompt carries, before the layout sentence

Assembled by `buildPrompt()`, identical for every archetype:

- **Canvas.** One 1152x1536 portrait image, 3:4, flat editorial vector, print
  quality. §3 of the design spec records why 3:4 rather than 4:5.
- **Palette and type.** The four theme colours as literal hex, the two faces as
  one adjective each, two weights only, headline at least 3x body per VISUALS
  §5.3. Every `**marked**` phrase is named as the accent phrase and nothing else
  may take the accent.
- **Density.** "Fill the frame. This is a dense, information-rich editorial
  graphic, not a minimal poster," which is `method.md`'s density doctrine
  carried over intact.
- **The verbatim contract.** Every string from the spec, quoted, under an
  instruction to render each one exactly and render no other text anywhere.
- **The hard constraints.** No paraphrase, no invented text, no logos or
  trademarks or watermarks, no photography or 3D or drop shadows or clip art, no
  people or hands or faces, and no geometry the listed text does not contain.

The last of those is VISUALS §6.1's structure-honesty rule moved upstream: the
gate still reads for it (§5.2 of the design spec, check 5), but a model told
what a taper claims draws fewer tapers that lie.

## The catalog

| Archetype | Required fields | Geometry, and what it claims |
| :- | :- | :- |
| `trend-poster` | headline, sub, items, footer | One line chart, single series, y-axis from zero, four or five large tick labels. The late inflection is the point and must read in silhouette. |
| `ranked-bars` | headline, sub, items, footer | Horizontal bars sorted longest first. No axis, gridlines, ticks or legend. Values inside the right end. The ragged right edge is the payload. |
| `comparison-panel` | headline, col1, col2 | Two or three equal columns under coloured headers, a shared row rail, one full-width merged shared-ground row. Symmetry promises balance, so neither column is drawn as the loser. |
| `perception-split` | headline, naive_headline, naive_statement, real_headline, items, punchline | Two panels split by a rule bleeding to both edges. One statement above, five leader-lined items below. **The asymmetry is the content**; matched counts destroy the thesis. |
| `analogy-rows` | headline, sub, items | Three to five rows, term and equation pill left, two short facts right, identical slot order. Monoline glyph only where the silhouette distinguishes the row. |
| `card-grid` | headline, items | Equal rectangular cards, two or three across. Equal sizes assert peer status; nothing may look ranked. |
| `icon-list` | headline, items | A dense two-column list, glyph plus bold title plus one line. Flat, unranked, no numerals. |
| `sourced-shelf` | headline, sub, sections, items, footer | Three tinted bands headed by reader-voice questions, three cards each, the publisher name set as each card's largest element. One hue through three luminances, never drawn boxes. |
| `numbered-steps` | headline, items | Numbered rows, numeral plus bold label plus detail plus chips. Equal row heights, strict top-to-bottom order. |
| `funnel` | headline, items | Bands narrowing top to bottom. The narrowing claims filtering: each band visibly narrower, widths tracking the values where values are given. |
| `stratified-container` | headline, items, notes | One container in three to five ordered strata of text chips, **stratum widths tracking the chip counts**. At least one boundary differs in weight. Author notes typographically separated from the taxonomy. |
| `mirrored-rings` | headline, items, good_label, bad_label | Three concentric arcs split at an equator, good above and its failure twin below, ordinals 1/2/3 mandatory. Chip counts increase strictly outward because ring area grows with the square of the radius. |
| `composition-split` | headline, sub, items, expectation, footer | One full-width stacked bar of two to five parts, leader in the accent, labels below in two columns. **No pie and no donut.** The bar asserts exhaustiveness. |
| `distribution-strip` | headline, sub, observations, reference_value, reference_label, footer | One axis, one jittered dot per observation, a labelled rule at the reference value, only the two extremes annotated. Nothing else. |
| `variance-bridge` | headline, sub, start, end, items, footer | A waterfall of floating bars from start to end, connector rules between bar tops, two hues for sign, the payoff bar in the accent. Start and end grounded at zero. |
| `quadrant-map` | headline, sub, quadrants, x_axis, y_axis, items | A two-axis cross filling the canvas, four named quadrants set large, items as small labelled dots. Every quadrant holds at least one item; the four names carry the payload. |
| `causal-chain` | headline, items, terminal_cost | Four or five labelled nodes joined by arrows into a distinct terminal node. Each arrow asserts necessity: one thread, no branching, no converging inputs. |

Two forms map to no §3 signature and **selection never reaches them**. They are
available by explicit request only, and a run that uses one says so, unchanged
from the rule the retired `method.md` carried
(`archive/2026-09-06-html-renderers/infographic/reference/method.md`):

| Archetype | Required fields | Geometry |
| :- | :- | :- |
| `hybrid-playbook` | headline, stats, items, footer | Two to four hero numbers across the top over a grid of titled sections. The numbers carry the visual weight. |
| `annotated-diagram` | headline, center, items | One central labelled object, four to six leader lines to short titled callouts. Leader lines start inside the shape and cross its edge. |

`_smoke` is an internal single-headline form used by `--live-test`. It is never
selected and never ships.

## Source lines

`trend-poster`, `distribution-strip`, `ranked-bars`, `composition-split`,
`variance-bridge`, `sourced-shelf` and `hybrid-playbook` print numbers, so
VISUALS §4.2 requires a `footer` source line on the canvas. `--check` makes a
missing one an ERROR: no line, no render. That rule survived the renderer swap
unchanged.

## Retries

A failed visual check adds `--note "<constraint>"`, which lands at the end of
the prompt under a heading naming it as a correction from a failed attempt. The
note qualifies everything above it and overrides nothing. Bounded at three
attempts per image, per the design spec §5.2.

Write retries to `final-2.png` and `final-3.png` rather than over `final.png`,
so "ship the attempt that scores best" has more than one attempt left to choose
between.
