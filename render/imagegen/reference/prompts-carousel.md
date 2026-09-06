# Prompt catalog, carousel slides

One entry per slide partial in `render/carousel/reference/archetypes.md`, which
stays the field reference: it is a **separate catalog** from VISUALS §3's
infographic signatures and the two have never been name-for-name compatible.
Twelve slide types, and `prompt.js` carries one recipe per type.

**Source of truth: `prompt.js`.** `RECIPES.carousel` holds the sentences and
`REQUIRED.carousel` holds the fields, both derived from
`render/carousel/reference/archetypes.md`. If they disagree, re-derive this
file; **the CODE wins.**

Everything in `prompts-infographic.md`'s "What every prompt carries" section
applies here unchanged: same canvas, same palette block, same verbatim contract,
same hard constraints.

## The catalog

| Archetype | Required | Optional | Geometry |
| :- | :- | :- | :- |
| `cover` | headline | eyebrow, body, cue | Dark full-bleed. Oversized headline in the upper two thirds, small uppercase letter-spaced eyebrow above, one lead line under a short rule, swipe cue at the bottom edge. |
| `statement` | headline | kicker, body, items, note | Light. Kicker with an accent tick, one large headline, one lead line, optional short bullets, a muted closing note. |
| `bullets` | headline, items | kicker, body, note | Light. A flat bullet list of peer points at even spacing. No numerals, no ranking. |
| `compare` | headline, left, right | kicker, note | Light. Two cards side by side, **the right card filled with the accent**, each a title over a short list. The winning side is the right card. |
| `before-after` | headline, left, right | kicker, note | Light. Two columns, each a title over one short paragraph rather than a list, the right column in the accent. The shift across time is the claim. |
| `stat` | stat *or* headline, caption | kicker, note | Light. One giant centred figure, a caption beneath, an optional sub-line. No headline line renders; the number is the hero. |
| `steps` | headline, items | kicker, note | Light. Numbered rows auto-numbered from one, bold label plus detail. Equal row heights, strict order. |
| `cta` | headline | eyebrow, items, note, cta | Dark full-bleed. Eyebrow, a headline that re-lands the claim, optional short points, one small accent chip only where a destination is given. |
| `quote-spotlight` | quote, attribution | kicker, eyebrow | Light. One oversized quote vertically centred behind a large accent quotation glyph, thick accent bar to its left, attribution beneath in the accent. |
| `image-bg` | image | headline, body, kicker, scrim | The supplied photograph edge to edge under a gradient scrim, short headline and one lead line over it. |
| `index` | items | headline, kicker | Light. Section titles each preceded by a two-digit accent numeral, generously spaced. One column up to six, two balanced columns past six. |
| `logo-wall` | items | headline, note, kicker | Light. Text labels centred in subtly bordered tinted cards. Two columns up to four labels, three past that. **Text labels only**: no company logos and no invented marks. |

`attribution` is required on `quote-spotlight` rather than optional, unchanged
from the retired renderer: VISUALS §2.4 bans the quote card, and a source is
what separates a sourced pull-quote from one.

## `image-bg` on this path

The retired renderer base64-embedded the photograph into the HTML. There is no
HTML now, so the file is sent as an `input_reference` and the model composes
around it. It is **first** in the three-image priority order, ahead of the cover
and ahead of the theme's own references, because a slide whose whole point is
one photograph must be shown that photograph.

The consequence, stated rather than discovered later: the model reconstructs the
image rather than compositing the file, so the output is *based on* the
photograph and is not the photograph. For a screenshot whose pixels are the
payload, that is a real limitation and the honest answer is a different slide
type. §5.2's visual check reads for it.

## Generation order, and why it is three commands

```
render.js carousel <spec.md> --profile <P> --out <R>/deck.pdf --cover
  ... run the visual check on slide-01.png, and only then:
render.js carousel <spec.md> --profile <P> --out <R>/deck.pdf --rest
  ... run the visual check on slides 2..N, then:
render.js carousel <spec.md> --profile <P> --out <R>/deck.pdf --assemble
```

The cover is gated before anything else is generated **because the cover becomes
every other slide's reference image**. A cover that fails and gets redrafted
would otherwise have already propagated its flaws into every downstream slide
and wasted every one of those calls. `--rest` refuses to run if `slide-01.png`
does not exist yet.

Slides land in `<R>/slides/slide-NN.png`. `--slide N` regenerates exactly one,
which with `--note` is the retry path for a single failed slide; the other
slides are untouched and no call is repaid.

`--assemble` writes the minimal HTML shell, one `<img>` per page at 1152x1536,
and prints it to PDF through the installed Chrome. Same technique the retired
`render/carousel/render.py` used, reimplemented here rather than shared, so no
dependency was traded for a new one. There is still nothing to `pip install`,
ever, and now nothing to `npm install` either.

**One honest difference from the retired renderer.** That one printed a *vector*
PDF because Chrome was drawing text and shapes. This one prints a raster image
per page into a PDF container of the same 3:4 page geometry. The deck still
uploads as one LinkedIn document post and reads the same in the feed, but the
type is no longer selectable and the file is larger: roughly 1.3MB a slide,
about 8MB for a six-slide deck, well inside LinkedIn's limit.
