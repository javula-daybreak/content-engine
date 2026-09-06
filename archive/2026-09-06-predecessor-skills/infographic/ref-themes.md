# Theme token contract

The only theme in v1 is **daybreak**. Structure lives in `themes/_base.css`;
every color/font is a `var(--token)` defined in `themes/daybreak.css`. All values
trace to the Daybreak Brand Kit (`daybreak_brand_colors.md`); the font is the
brand-kit Manrope, base64-embedded via `@import` in `fonts/manrope.css`. The
footer `--mark` (sunrise logo) is injected at render time by `render.py` from
`assets/logo/mark.png`. See memory `[[infographic-skill-assets-from-brand-kit]]`.

## Palette (canonical)
| Token | Hex | Role |
|---|---|---|
| `--green` | #39B15A | Primary Daybreak Green |
| `--lime` | #D9EC98 | Supporting lime (title highlight box) |
| `--forest` | #DAE6DC | Supporting forest |
| `--skyline` | #D1E6E4 | Supporting skyline (alt tint) |
| `--lime2` | #B1D93C | Accent lime 2 |
| `--forest2` | #257A3F | Accent forest 2 (deep accent) |
| `--skyline2` | #3B9CD9 | Accent skyline 2 |
| `--light` | #F6F6F6 | Light background |
| `--dark` | #222222 | Dark text |
| `--grey1/2/3` | #383838 / #858585 / #D4D4D4 | greys |

## Semantic roles (what layouts consume)
| Token | Maps to | Use |
|---|---|---|
| `--bg` | light | canvas background |
| `--ink` | dark | primary text |
| `--ink-soft` | grey1 | secondary text (sub, body) |
| `--muted` | grey2 | captions, meta, footer tagline |
| `--line` | #E4E6E2 | hairline dividers, card borders |
| `--surface` | #FFFFFF | cards |
| `--surface-2` | #EEF4EC | tinted zone (green wash) |
| `--surface-3` | skyline | alt tinted zone |
| `--accent` | green | numbers, bars, rules, ticks, leader lines |
| `--accent-deep` | forest2 | `**bold**` spans, labels, deep accents |
| `--accent-bright` | lime2 | high-energy highlight |
| `--on-accent` | #FFFFFF | text on a green fill |
| `--font` | Manrope | all type |

## Shell zones (render.py owns these; archetype builders fill only `.core`)
- **head**: `<h1 class="h1">` (highlight-box `**bold**`) + italic `<p class="sub">`. NO eyebrow.
- **core**: the archetype layout (one builder per archetype).
- **footbar**: LIGHT bar (transparent + top hairline) with the sunrise mark +
  "daybreak" wordmark + tagline. No dark bar, no CTA/URL.

## Adding an archetype (engine surface)
1. Write `def <name>_html(block) -> str` returning the `.core` inner HTML.
2. Register in `CORE_BUILDERS` and add required fields to `REQUIRED`.
3. If it needs a new list key, add it to `LIST_KEYS`.
4. Add a CSS block in `_base.css` with a unique class prefix.
5. Add grammar + a visual rubric to `reference/archetypes.md` and lock it in
   `_state/spec-contract.md`.
