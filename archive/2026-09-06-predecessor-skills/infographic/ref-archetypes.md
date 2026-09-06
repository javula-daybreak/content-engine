# Archetypes — grammar + visual rubric (all 7)

Every spec is front-matter + exactly ONE `:: <archetype>` block. Shared
front-matter: `theme: daybreak`, `title:` (window/PNG title), `footer:`
(default "AI labor for enterprise planning"), optional `wordmark:` (default
"daybreak"). Shared block fields: `headline:` (functional descriptor with one
`**highlight**` phrase) and `sub:` (italic one-liner). NO `kicker` (ERROR).

`**bold**` -> brand accent/highlight. `[slug]` prefixes an item with a brand
icon (fail-soft if the slug is unknown). `|` separates compound fields; `;`
separates sub-items inside a field.

Available icon slugs: 2018, 2020, 2022, 2024, automation, autonomy, c,
collaborative, data-centric, domain-specific-graphic, easy-to-use, f, growth,
human-judgement, intervention, o, organizational-barriers, performance-barriers,
probabilities, purpose, recognition, technology-barriers, u.

---

## numbered-steps  (inspo 1779796813326.jpeg)
Sequential / ordered process.
- Required: `headline`, `items`.
- Item: `[icon] Title | Lead-in | pill; pill; pill` (icon, lead-in, pills optional).
- Render: double tinted rings (STEP 0N) alternating right/left, one solid
  serpentine connector (node + arrowheads + rounded U-turns), bordered ► pills.
- Budget: 3-6 steps; title <= 5 words; lead-in <= 8 words; 3-4 pills/step.
- Rubric: alternating rings + serpentine line (no dotted diagonal); every step
  has pills; descriptive highlight title; light footer; nothing clipped.

## card-grid  (inspo 1780315210934.jpeg)
Parallel set of items / options / types.
- Required: `headline`, `items`.
- Item: `[icon] Title | Body`.
- Render: 2-col grid of numbered cards (accent number square + optional icon +
  bold title + body), rows stretch to fill the frame, content centered.
- Budget: 4-10 cards (8-10 fills best); title <= 5 words; body <= 22 words.
- Rubric: 2-col numbered cards fill the frame; bold title + readable body;
  white cards + hairline border; highlight title; light footer.

## comparison-panel  (inspo 1781611179828.jpeg)
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

## icon-list  (inspo 1781783838222.jpeg)
A flat list of tactics / principles / reasons / signals.
- Required: `headline`, `items`.
- Item: `[icon] Title | Description`.
- Render: 2-col NUMBERED list (col 1 = items 1..k, col 2 = k+1..n), each row =
  accent number + prominent brand icon tile + bold title + short description,
  hairline dividers. Lighter than card-grid.
- Budget: 8-12 items; title <= 4 words; description <= 14 words.
- Rubric: 2-col numbered icon rows fill the frame; reads lighter than cards;
  highlight title; light footer.

## hybrid-playbook  (inspo 1781697366045.jpeg)
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

## funnel  (inspo 1781351818496.jpeg)
A narrowing / conversion / qualification.
- Required: `headline`, `items`.
- Item: `[icon] Label | Detail` (top item = widest stage).
- Render: 4-6 stacked interlocking trapezoid bands narrowing top->bottom, green
  tint ramp (lime2 -> green -> forest2), centered white label + detail.
- Budget: 4-6 stages; label <= 4 words; detail <= 10 words.
- Rubric: clearly reads as a narrowing funnel; green progression; legible white
  text; highlight title; light footer.

## annotated-diagram  (inspo 1779105621604.jpeg)
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

## Engine surface (for maintainers)
`render.py` -> `CORE_BUILDERS` (archetype -> builder), `REQUIRED` (archetype ->
required fields), `LIST_KEYS` (`items`, `left`, `right`, `col1`, `col2`, `col3`,
`stats`). Each builder returns the `.core` inner HTML; the shell (head + light
footer) is owned by `render_canvas`. CSS lives in `themes/_base.css` (one block
per archetype, unique class prefix); tokens in `themes/daybreak.css`.
