# Retired: the HTML/Chrome visual renderers

Archived 2026-09-06, superseded by `render/imagegen/`. Design:
`docs/superpowers/specs/2026-09-06-imagegen-infographics-design.md`.

Moved rather than deleted, matching this repo's convention of striking outdated
work rather than silently dropping it. Nothing here runs any more, and nothing in
the live tree imports it.

## What is in here

| Path | Was |
| :- | :- |
| `infographic/render.py` | 2,138 lines of stdlib Python driving headless Chrome over hand-built HTML/CSS. Nineteen archetype builders, `check_spec`, `check_layout` |
| `infographic/assets/`, `infographic/themes/` | the icon set and `_base.css` |
| `infographic/tests/` | `test_render.py` |
| `infographic/reference/` | `archetypes.md`, `method.md`, `themes.md` |
| `carousel/render.py` | 848 lines. Twelve HTML partials assembled and printed to a vector PDF through Chrome |
| `carousel/archetypes/`, `carousel/themes/`, `carousel/fonts/` | the partials, `_base.css`, the embedded faces |
| `carousel/tests/` | seven test modules |
| `carousel/themes.md.reference` | was `render/carousel/reference/themes.md` |

## Why

Output quality. The templates read as templates, and a second profile's visual
needs were going to diverge from what CSS templates can express. Both problems
have one fix: stop drawing the pixels and call an image-generation model.

## What survived the move, and where it lives now

- **`render/carousel/reference/archetypes.md`** stays in place. It is the field
  reference for the twelve slide types and `render/imagegen/reference/prompts-carousel.md`
  derives from it.
- **`render/infographic/examples/` and `render/carousel/examples/`** stay in
  place. They are valid spec grammar, they still pass
  `render/imagegen/render.js --check`, and the design spec §6 leaves the decision
  about their long-term home to a follow-up.
- **The theme contract** is now `render/imagegen/reference/themes.md`. Same nine
  keys, same optional `logo`, plus one new optional `style_reference`.
- **The print-to-PDF technique**, reimplemented independently in
  `render/imagegen/render.js`. No code was carried over.

## What was lost, deliberately

`check_layout()`'s four mechanical checks — thumbnail legibility,
tint-against-background, reversed-label contrast, required-parameter fill — read
the generated HTML as text. There is no HTML now. Design spec §5.2 replaces them
with the model reading the PNG directly against a five-item checklist, which is
a real cost increase per PRD §4's own arithmetic and is accepted as the price of
the format change.

`check_spec()`'s exact-arithmetic disqualifiers — sum-to-100, residual closure,
monotonic strata, rings increasing outward, an empty quadrant — were **not**
carried into `render/imagegen/prompt.js`'s `checkSpec()`, which implements the
design spec §7's stated list (required fields, referenced files, item and word
budgets) and no more. `_structure()` in `infographic/render.py` is where they
live if they are ever wanted back.
