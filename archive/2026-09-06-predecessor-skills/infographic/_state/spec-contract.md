# SPEC CONTRACT — gtm-content-infographic

The locked spec format (the engine contract). Content values are generated per
article; this structure does not change per article. Read by every later phase
instead of re-deriving.

## HARD RULES (apply to EVERY archetype; enforce in check_spec + builders)
1. **No eyebrows.** A `kicker` field is never rendered and is a `--check` ERROR.
   There is no eyebrow zone in any layout.
2. **Title is a plain functional descriptor, NOT the source post's hook.** The
   headline names *what the infographic shows* (e.g. inspo: "The 5-Step AI
   Content Generation Process"; ours: "The 5-Step Planner-to-Manager Shift").
   Never repurpose the article's hook/headline as the infographic title. A key
   phrase in the title is wrapped in `**...**` → rendered as a brand highlight
   box (lime fill, dark text), mimicking the inspo highlight.
3. **Light footer only.** Sunrise mark + "daybreak" wordmark + tagline on the
   light background with a top hairline. No dark/black footer bar. No URL/CTA
   pill (the mark already carries the brand; daybreak.ai is redundant).

## Front-matter (deck-wide)
- `theme:` daybreak (only theme in v1)
- `title:` used as the PNG/window title
- `footer:` footer tagline (default "AI labor for enterprise planning")
- `wordmark:` optional, defaults "daybreak"

## Block (exactly ONE per spec)
`:: <archetype>` then `key: value` scalars and `- ` list items.
- `**bold**` in a title → brand highlight box; in body text → deep-accent span.
- Lists open under a LIST_KEY (`items`, `left`, `right`, `col1`, `col2`, `col3`).
- Compound items use `|`: fields are pipe-separated. Trailing fields optional.
- Hard rules (--check ERRORs/WARNs): no em-dash (ERROR); no `kicker`/eyebrow
  (ERROR); banned words leverage/delve/synergy/pivotal/foster (WARN).

## Shared shell (render.py owns this; partials own only `.core`)
- head: `headline` (h1, highlight-box accent) + `sub` (italic). NO eyebrow.
- core: the archetype layout
- footbar: LIGHT bar (transparent + top hairline) with sunrise mark + wordmark
  + tagline. No dark bar, no CTA/URL.

## Archetype: numbered-steps  [Phase 1 — TEMPLATE, RE-LOCKED 2026-06-19]
Calibrated to inspo `1779796813326.jpeg` (exact-mimic mandate).
- Required: `headline`, `items`.
- Item grammar: `[icon] Title | Lead-in | pill; pill; pill`
  (icon, lead-in, pills all optional; pills are `;`-separated).
  - `[icon]` = a slug from the registry; unknown slug fails soft (no icon).
- Render (absolute geometry, deterministic):
  - **Double rings** `STEP 0N` (bold inner + thin outer ring, slight tint fill,
    bold deep-green label+number), alternating RIGHT/LEFT (steps 1,3,5 right).
  - **One solid serpentine connector**: square start node, a horizontal run into
    each ring ending in an **arrowhead**, rounded U-turn down the ring's rail to
    the next row. Rings paint opaque on top so the line reads as entering/leaving
    each ring. NOT a dotted diagonal.
  - Each body: icon + bold title, a lead-in line, then a row of **bordered ►
    pills** (the density element).
- Copy budget: title ≤ ~5 words; lead-in ≤ ~8 words; 3-4 pills/step (kept to one
  row at the body width); 3-6 steps fit the 4:5 frame.
- Geometry constants (render.py): `_R=52` ring radius, `_PITCH=196`,
  `_CONTENT_BOTTOM=138`. Pitch ≥ ring + body height so a left ring never
  collides with the prior (left-side) body's pills.

### Visual rubric (numbered-steps)
- [ ] head: descriptive title (NOT the post hook) w/ highlight box + italic sub; no eyebrow
- [ ] 3–6 double rings, alternating sides, bold STEP + 0N, tint fill
- [ ] ONE solid serpentine line: start node + arrowheads + rounded U-turns (no dotted diagonal)
- [ ] every step carries bordered ► pills (reads dense, not "text + an icon")
- [ ] brand palette only (green accents, lime highlight, #222 ink, #F6F6F6 bg)
- [ ] LIGHT footer: mark + "daybreak" + tagline; no black bar, no URL
- [ ] dense but nothing clipped/overlapping the 1080×1350 frame
- [ ] no em-dash; Manrope throughout

## Archetype: card-grid  [Phase 2 — LOCKED 2026-06-19]
Calibrated to inspo `1780315210934.jpeg`.
- Required: `headline`, `items`.
- Item grammar: `[icon] Title | Body` (icon + body optional). Auto-numbered.
- Render: 2-column grid; each card = accent number square (`NN`) + optional brand
  icon + bold title + short body paragraph. Cards are white with a hairline
  border + soft shadow; rows stretch to fill the 4:5 frame, card content
  vertically centered.
- Copy budget: title ≤ ~5 words; body ≤ ~22 words. 4-10 cards (even count fills
  the 2-col grid cleanly; density rises with card count — 8-10 best mimics the
  inspo's full-bleed feel).

### Visual rubric (card-grid)
- [ ] descriptive highlight-box title; no eyebrow; italic sub
- [ ] 2-col grid of numbered cards (accent number square), fills the frame
- [ ] bold title + readable body per card; optional brand icon beside title
- [ ] white cards, hairline border; brand palette only
- [ ] LIGHT footer; no dark bar / URL; nothing clipped; Manrope; no em-dash

## Archetype: comparison-panel  [Phase 2 — LOCKED 2026-06-19]
Calibrated to inspo `1781611179828.jpeg`.
- Required: `headline`, `col1`, `col2` (`col3` optional → 2 or 3 columns).
- Column grammar: the FIRST `- ` item in a `colN` list is the column HEADER
  (rendered as a tinted header bar; tints rotate green-wash / skyline / lime).
  Every following item is a `Label | value` row; a `;`-delimited value renders
  as a ► bullet list, a single value renders as one line. Labels render as small
  uppercase deep-accent labels.
- Optional bottom band: `verdict_label` + `verdict` → a tinted summary band
  (mimics the inspo's "WHICH MATTERS MOST?").
- `vs` badges render automatically between columns.
- Copy budget: header ≤ ~3 words; 3-5 rows/column; bullet values ≤ 4 items,
  each ≤ ~3 words; row single-line values ≤ ~10 words.

### Visual rubric (comparison-panel)
- [ ] descriptive highlight-box title; no eyebrow; italic sub
- [ ] 2-3 columns with tinted header bars + `vs` badges between
- [ ] each column: uppercase row labels + ► bullet lists / single-line values
- [ ] optional verdict band reads as the takeaway
- [ ] brand palette; LIGHT footer; nothing clipped; Manrope; no em-dash

## Archetype: icon-list  [Phase 3 — LOCKED 2026-06-19]
Inspo `1781783838222.jpeg`. Required: `headline`, `items`. Item: `[icon] Title |
Description`. 2-col numbered list (1..k left, k+1..n right), accent number +
brand icon tile + bold title + short desc, hairline dividers; lighter than
card-grid; fills the frame. Budget: 8-12 items; title <= 4 words; desc <= 14
words. New CSS prefix `.iconlist`/`.il*`. No new LIST_KEYS.

## Archetype: funnel  [Phase 3 — LOCKED 2026-06-19]
Inspo `1781351818496.jpeg`. Required: `headline`, `items`. Item: `[icon] Label |
Detail` (top = widest). 4-6 interlocking trapezoid bands narrowing top->bottom,
green ramp lime2->green->forest2 (computed in Python), centered white label +
detail. Budget: 4-6 stages; label <= 4 words; detail <= 10 words. CSS prefix
`.funnel`/`.f*`. No new LIST_KEYS.

## Archetype: hybrid-playbook  [Phase 3 — LOCKED 2026-06-19]
Inspo `1781697366045.jpeg`. Required: `headline`, `stats`, `items`. `stats:` =
`Value | Label` (2-4 hero callouts); `items:` = `[icon] Title | Body` (3-5
sections, auto 3-wide on multiples of 3 else 2-wide). Top tinted stat band +
section grid. Budget: stat value <= 5 chars; stat label <= 4 words; section
title <= 4 words; body <= 16 words. CSS prefix `.playbook`/`.pb-`. **Adds
`stats` to LIST_KEYS.**

## Archetype: annotated-diagram  [Phase 3 — LOCKED 2026-06-19]
Inspo `1779105621604.jpeg`. Required: `headline`, `center`, `items`. `center:` =
hub label (<= 3 words); `items:` = `[icon] Title | Detail` callouts (4-6,
clipped to 6). Central green hub + left/right callouts joined to the hub rim by
thin leader lines with endpoint dots (deterministic Python geometry, reuses
`_rounded_path`). Budget: center <= 3 words; callout title <= 4 words; detail <=
10 words. CSS prefix `.diagram`/`.di*`. No new LIST_KEYS (`center` is a scalar).

## Design tokens (traced to daybreak_brand_colors.md)
green #39B15A · forest2 #257A3F · lime2 #B1D93C · light #F6F6F6 · dark #222222 ·
grey1 #383838 · grey2 #858585 · grey3 #D4D4D4 · skyline #D1E6E4
