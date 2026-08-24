# Theme token contract

Two files decide how a render looks, and they do different jobs.

- **`themes/_base.css`** is structure. Every colour, font, radius and rule
  weight in it is a `var(--token)`. **No value in it is a brand value**, and
  `tests/test_render.py::TestTheme::test_no_brand_value_survives_in_the_engine`
  fails on a literal hex anywhere in the file.
- **`profiles/<handle>/theme.json`** is the tokens. It is the only source of
  brand values in the system, and it is the documented input contract PRD §1.1
  refers to.

`render.py`'s `theme_css()` reads the second and emits the `:root` block the
first consumes. There is no per-brand stylesheet, because a stylesheet named
after a company is a company string in skill logic.

## The nine keys, and the tenth

PRD §10 freezes theme.json at nine keys. `logo` is a tenth and it is optional,
because `build_html` used to hard-require a logo file to render at all.

| Key | Becomes | Used for |
| :- | :- | :- |
| `bg` | `--bg` | canvas ground; every surface and rule steps from it |
| `fg` | `--ink` | primary text |
| `accent` | `--accent` | the one hue: numbers, bars, rings, ticks, leader lines |
| `muted` | `--muted` | captions, meta, the footer source line |
| `font_head` | `--font-head` | headline, labels, numerals, section titles |
| `font_body` | `--font-body` | prose, descriptions, card bodies, details |
| `scale` | `--space` | `airy` -> 1, `dense` -> 0.72, over padding and gaps |
| `radius` | `--radius` | every rectangle. `0px` means square |
| `rule_weight` | `--rule` | the hairline. Structural borders are multiples of it |
| `logo` *(optional)* | `--mark` | footer mark, base64-embedded. **Absent means no mark**, which is the correct default |

`logo` is a path **inside the profile**, resolved relative to the profile
directory. A logo outside the profile is refused: it would make a render depend
on a file the repo does not carry. A logo is a brand asset and a brand asset
belongs to a profile, not to skill logic, which is the same reason no icon set
ships here either.

## Derived tokens

Everything else `_base.css` needs is derived, so nine keys stay nine keys.

All of it is `color-mix(in oklab, ...)` evaluated by the browser, always
stepping from `--bg` toward `--fg` or `--accent`, so a dark theme inverts
correctly with no second palette:

| Token | Derivation | Use |
| :- | :- | :- |
| `--ink-soft` | ink 82% toward bg | secondary text: sub, body |
| `--line` | bg 86% toward ink | hairline dividers, card borders |
| `--surface` | bg 96% toward ink | cards |
| `--surface-2` | bg 88% toward accent | tinted zone |
| `--accent-deep` | accent 76% toward ink | `**bold**` spans, labels |
| `--accent-wash` | accent 30% toward bg | the headline highlight box |

**`--on-accent` is the one derivation Python has to make**, because CSS cannot
branch on luminance. Reversed labels set globally to white is a measured failure
(VISUALS §5.4: white on `#FFD401` measured under 3:1), so `theme_css()` compares
WCAG contrast of the accent against both `fg` and `bg` and takes the winner.

**Multi-band tints are one hue through luminances, never one hue per band.** The
funnel ramp and the comparison-panel column washes both step the accent, per
VISUALS §3.9: a band index is an ordinal, and an ordinal is a luminance
dimension rather than a hue dimension. A fixed multi-hue ramp would also have
been a brand value living in Python.

## Shell zones (render.py owns these; archetype builders fill only `.core`)

- **head**: `<h1 class="h1">` (a `**highlight**` phrase takes `--accent-wash`)
  plus an italic `<p class="sub">`. NO eyebrow.
- **core**: the archetype layout, one Python builder each.
- **footbar**: the signature. Optional mark, then `wordmark` (the author's name,
  which the workflow reads off `identity.md`), then `footer` (a source line on a
  data image, else empty). **Every string is spec-supplied and there is no
  default**, because an engine shipping a default tagline ships somebody's
  tagline. Never a follow-and-repost bar, per PRD §10.3.

## Adding an archetype (engine surface)

1. Write `def <name>_html(block) -> str` returning the `.core` inner HTML.
2. Register in `CORE_BUILDERS` and add required fields to `REQUIRED`.
3. If it needs a new list key, add it to `LIST_KEYS`.
4. Add a CSS block in `_base.css` with a unique class prefix, using only the
   tokens above.
5. Add grammar and a rubric to `reference/archetypes.md`, an example spec, and a
   row to `workflows/infographic.md`'s signature-to-template map.
