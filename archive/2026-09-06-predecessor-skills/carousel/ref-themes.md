# Themes: Token Contract, Adding a Theme, Font Embedding

Loaded on demand by the `carousel` skill. Themes own **look** (a flat list of CSS custom-property tokens). `themes/_base.css` owns **structure** and consumes those tokens via `var(--…)`. Swap the theme file, the whole deck re-skins.

**Source of truth:** the token list below was derived by grepping `var(--…)` out of `themes/_base.css` (the structural consumer) plus the two theme self-references and the one token `render.py` reads. The CODE wins. Note: the token block in the design doc (`docs/plans/2026-06-10-carousel-skill-design.md`) is aspirational and does NOT match the engine. It names tokens like `--eyebrow-style` and `--rule` that the code never reads, and omits the on-color roles the code requires. Use THIS list, not the design doc's.

## The token contract

A new theme must define these. Anything `_base.css` reads as `var(--x)` falls back to nothing if undefined, so a missing token silently breaks a layout. Define all of them.

### Palette (8)

| Token | Role |
|---|---|
| `--bg` | page background |
| `--ink` | primary text |
| `--ink-soft` | secondary text (leads, row detail, captions) |
| `--accent` | the brand accent: rules, ticks, win-card fill, step number, progress fill, cta chip |
| `--accent-deep` | deeper accent: kicker/eyebrow text, `**bold**` headline span, the giant `stat` number |
| `--accent-light` | light accent: consumed by the quote `.q` and the dark-slide variants in the theme file |
| `--muted` | de-emphasized text: counter, flaw-card title, step detail |
| `--line` | hairline rules / row dividers |

### Surfaces + hero (2)

| Token | Role |
|---|---|
| `--hero-bg` | the dark-slide (cover/cta) base, plus quote/strip backgrounds |
| `--surface-2` | the losing/flaw `compare` card background |

### On-color text roles (5)

These set text color on top of accent or dark fills. Getting them wrong yields invisible text.

| Token | Role |
|---|---|
| `--on-dark` | text on the dark hero (cover/cta) |
| `--on-accent` | text on an accent fill: win-card items, the step number digit |
| `--on-accent-soft` | softer text on accent: win-card title |
| `--on-accent-strong` | strong text on the accent cta chip |
| `--note` | the `.note` line color (cover/cta/statement) |

### Wayfinding (1)

| Token | Role |
|---|---|
| `--seg-off` | the unfilled progress-bar segments |

### Typography + identity (3)

| Token | Role |
|---|---|
| `--font` | the font stack. The embedded family must lead (e.g. `'Manrope', …`) |
| `--accent-on-headline` | the color of the `**bold**` span in a headline. Consumed by a rule the THEME file defines (`.deck .h1 .g{color:var(--accent-on-headline)}`), not by `_base.css`. Define it AND ship that rule. |
| `--wordmark` | the footer wordmark text, quoted, e.g. `'daybreak'`. Read by `render.py` (regex on the theme CSS, line ~291), not by CSS. |

Plus the SVG logo, which is not a single token but a pair of rules:

- **`--mark`**: a `url("data:image/svg+xml,…")` for the light-slide logo, painted into `.mark`.
- A **`.slide.dark .mark{ background:url(…) }`** override in the theme file for the dark-slide logo variant.

### Optional / vestigial

`--surface` and `--mint` (the latter daybreak-only) are defined by the shipped themes but consumed by nothing in the current `_base.css`. You may define `--surface` for parity, but neither is required. Do not assume they do anything.

## The dark-slide treatment lives in the theme, not the base

`_base.css` deliberately omits the dark-slide colors. Each theme ships its own `.slide.dark { … }` block: the background (a gradient/glow over `--hero-bg`) plus per-element overrides so headlines, labels, bullets, the stat number, the wordmark, the counter, the progress segments, and the mark all read on the dark field. Copy the structure of daybreak's or personal's `.slide.dark` block when building a new theme; do not expect the base to handle dark.

## How to add a new theme

1. **Copy `themes/daybreak.css` to `themes/<name>.css`.** It is the cleanest token-block reference: an `@import` of the font, a `:root` with every token above, the `.deck .h1 .g` accent rule, and the `.slide.dark` block.
2. **Set every token** in `:root`. Use real values, not `inherit`. Decide your one accent and derive `--accent-deep` / `--accent-light` from it (the `personal` theme collapses all three to a single lime; that is allowed).
3. **Set the on-color roles** so text reads on both your accent fill and your dark hero. This is where themes break; check the win-card and cta chip explicitly.
4. **Embed your font** (recipe below) into `fonts/<family>.css`, `@import` it at the top of the theme, and lead `--font` with that family.
5. **Build the SVG mark.** Inline `data:image/svg+xml,…` (URL-encoded). Provide the light `--mark` and a `.slide.dark .mark` override.
6. **Ship the `.slide.dark` block** with the per-element overrides.
7. **Render the example through your theme** and read the PDF back:
   ```bash
   python3 ~/.claude/skills/gtm-content-carousel/render.py \
     ~/.claude/skills/gtm-content-carousel/examples/innovators-dilemma.md \
     theme=<name> --out /tmp/theme-test.pdf
   ```
   Walk all nine slides for invisible text, broken dark slides, and a missing font (system-font fallback means your embed or `@import` failed).

The theme is then selectable via `theme: <name>` in front-matter or `theme=<name>` on the CLI.

## Font-embed recipe (base64)

Headless Chrome on macOS lacks Manrope / Bricolage / Aeonik, and Chrome's `--print-to-pdf` does NOT reliably block on an `@import`-ed stylesheet before paint. So fonts are **base64-embedded** as `@font-face` `src: url(data:font/woff2;base64,…)`. `render.py` then **inlines** the theme's `@import` of that font file at render time (`_inline_imports`, line ~342) so the `@font-face` is present in the document before Chrome paints. You author the clean `@import`; the engine resolves it.

The shipped `fonts/manrope.css` and `fonts/bricolage.css` each hold a **single variable `@font-face`** (one woff2, a `font-weight` range like `200 800`, `font-display:block`). The base used `200 800` (Manrope) and `400 800` (Bricolage); cover the weights the layout uses (`_base.css` ranges 500-800).

To add a font:

1. **Get a woff2.** A variable woff2 is ideal (one file spans all weights). Google Fonts' CSS API serves per-weight `.woff2` files; download the woff2 you need, or use a variable-font woff2 from the foundry / a Google Fonts mirror.
   ```bash
   # Example: fetch a woff2 URL that a Google Fonts CSS response points to
   curl -sL "https://fonts.gstatic.com/s/<family>/<…>.woff2" -o /tmp/<family>.woff2
   ```
2. **Base64-encode it** (no line wraps) and build the data URI:
   ```bash
   B64=$(base64 -i /tmp/<family>.woff2 | tr -d '\n')
   printf "@font-face{font-family:'<Family>';font-style:normal;font-weight:400 800;font-display:block;src:url(data:font/woff2;base64,%s) format('woff2');}\n" "$B64" \
     > ~/.claude/skills/gtm-content-carousel/fonts/<family>.css
   ```
   (`base64` on macOS uses `-i <file>`; the `tr -d '\n'` strips newlines so the data URI is one unbroken string.)
3. **Reference it** from the theme: `@import url("../fonts/<family>.css");` at the top, and lead `--font` with `'<Family>', …`.

Embedding is what makes the PDF self-contained and reproducible. Never rely on a system-installed or network-fetched font; if the rendered PDF shows the wrong typeface, the embed or the `@import` path is the first thing to check.
