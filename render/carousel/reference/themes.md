# Themes: the theme.json token contract

Loaded on demand by `workflows/carousel.md`. **`theme.json` is the only theme
input this renderer has.** There is no per-brand CSS file and no theme name to
select: `themes/_base.css` owns structure and reads every colour, font, radius
and rule weight as a CSS custom property, and `render.py`'s `theme_css()`
writes those properties from one profile's `theme.json`.

```
profiles/<handle>/theme.json  ->  theme_css()  ->  :root{ --bg: … }  ->  _base.css  ->  archetypes/*.html
```

Point a render at one with `--theme profiles/<handle>/theme.json`, or with a
`theme:` line in the spec's front matter. A CLI `--theme` path resolves against
the shell's working directory; a front-matter `theme:` path resolves against
the **spec file's** directory, the same rule an `image-bg` `image:` path
follows, so a run directory holding a spec stays self-contained.

## The keys

The first nine are PRD section 10's frozen contract, and all nine are
required. A missing key or a non-hex colour fails the load with the key named,
because a theme that half-loads renders invisible text.

| Key | Type | What it drives |
| :- | :- | :- |
| `bg` | hex | page background, and which end of the palette is "light" |
| `fg` | hex | primary text, and the dark cover field on a light theme |
| `accent` | hex | rules, ticks, the win card, step numbers, progress fill, the footer mark |
| `muted` | hex | counter, flaw-card title, step detail |
| `font_head` | CSS font stack | `.h1`, the giant `stat` number, the pull quote, the wordmark |
| `font_body` | CSS font stack | everything else |
| `scale` | `airy` \| `dense` | `airy` renders the `d-spartan` density (fewer words, larger type), `dense` renders `d-comfortable`. Two vocabularies, one knob; a spec's own `density:` line overrides it |
| `radius` | CSS length | compare cards, logo cells, the cta chip, the quote card |
| `rule_weight` | CSS length | the accent rule, the kicker tick, row and index hairlines, the pull-quote bar |

**One optional key: `wordmark`.** The string in the footer beside the accent
mark. It is optional rather than added, because a tenth key is a PRD amendment
and not a renderer's to make. Absent, the footer shows the mark and no name,
and a single deck can still set `wordmark:` in its own front matter.

Colours must be `#RGB` or `#RRGGBB`. Hex only, on purpose: the derivations
below mix and measure colours, and a named colour cannot be measured without a
full CSS colour parser.

## What is derived, and why you never write it

A profile states four colours. The stylesheet reads about twenty tokens. The
rest are computed in `theme_css()` so that nobody hand-tunes a palette, and so
that a light theme and a dark theme both work from the same four values.

| Token | Derivation |
| :- | :- |
| `--ink-soft` | `fg` 78% toward `bg`: leads, row detail, captions |
| `--line`, `--surface-2`, `--seg-off` | `fg` at 12% / 6% / 18% toward `bg`: hairlines, the flaw card, unfilled progress |
| `--accent-deep` | accent as *text*: deepened on a light ground, lifted on a dark one |
| `--accent-light` | accent as text *on the dark field* |
| `--hero-bg`, `--on-dark` | the dark cover/cta field and its text: `fg` on `bg` for a light theme, and `bg` on `fg` for a dark one, so a profile gets one palette rather than a second hidden one |
| `--on-accent`, `--on-accent-soft`, `--on-accent-strong` | text on an accent fill: whichever end of the palette the accent sits furthest from, measured by WCAG luminance |
| `--note` | the muted line on the dark field |
| `--seg-off-dark`, `--line-dark`, `--surface-dark` | the three translucent surfaces the dark field needs |
| `--mark` | the footer disc: an inline SVG circle in the accent |
| `--hero-glow` | the accent glow under the dark field |
| `--scrim-dark`, `--scrim-light` | the `image-bg` gradients, built from the same two ends |

**The dark-slide treatment lives in `_base.css`**, at the bottom, and reads
only these tokens. It used to live in each brand's own CSS file; with
`theme.json` as the only input there is no such file.

## Fonts

`font_head` and `font_body` are ordinary CSS font stacks, and a stack of system
families needs nothing installed. If a stack names a family that `fonts/*.css`
carries as an embedded `@font-face`, `theme_css()` inlines that face into the
document, so the PDF carries the typeface instead of falling back. Nothing is
ever fetched at render time and nothing is installed. Chrome's `--print-to-pdf`
does not reliably block on an `@import` before paint, which is why the face is
inlined rather than linked.

To add a face: base64-encode a woff2 into a one-rule `fonts/<family>.css`, then
name that family first in `font_head` or `font_body`.

```bash
B64=$(base64 -i /tmp/<family>.woff2 | tr -d '\n')
printf "@font-face{font-family:'<Family>';font-style:normal;font-weight:400 800;font-display:block;src:url(data:font/woff2;base64,%s) format('woff2');}\n" "$B64" \
  > render/carousel/fonts/<family>.css
```

## Checking a theme

```bash
cd render/carousel
python3 render.py examples/nine-slide-deck.md --theme ../../profiles/<handle>/theme.json --out /tmp/theme-check.pdf
python3 -m unittest discover -s tests
```

The nine-slide example exercises the dark cover, the accent fill, the hairlines
and the progress bar in one pass, and `tests/test_assemble.py`'s `ThemeTokens`
asserts that every token `_base.css` reads has a value. A token with no value
is silent: the layout renders, and the text is invisible.
