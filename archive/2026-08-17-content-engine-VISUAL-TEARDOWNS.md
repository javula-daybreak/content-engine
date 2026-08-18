# Visual teardowns: 14 LinkedIn infographics, three creators
Companion to `content-engine-VISUALS.md`. Each teardown is forensic, not evaluative: one agent per image, reading the full-resolution file and a 220px feed-size thumbnail, with pixel-measured metrics (background, ink coverage, content bounding box, dominant non-background colors, twenty-band vertical ink profile) supplied so no color or proportion is eyeballed.
Source images live in `~/Downloads/Infographics/`. The niches are irrelevant; the forms are the point.

---

## 1. single-series hockey-stick poster
**File:** `CrustData/1778681978009.jpeg` · **Creator:** CrustData

A full-bleed lavender poster whose entire payload is one orange hockey-stick line chart, topped by a five-word question headline and closed by a one-line data credit.

**Information job.** "Is the thing I keep hearing about actually growing, and by how much since when?" — it converts a rumor into a dated magnitude (roughly 145M to 825M across nine months, with the bend at Feb).

### Where the idea came from

**Likely origin.** Proprietary dataset they own. Crustdata sells company/web-traffic data; the image is a free sample of the inventory.

**Evidence in the image.** The only credit on the canvas is "Data from:" plus their own logo and wordmark at 93-95% height — the source and the seller are the same party. The metric is a single company's monthly web traffic over exactly nine months, i.e. a slice pulled from a subscription feed, not a public stat with a well-known citation. The headline is phrased as the question a reader would already be asking, and the dataset is the answer.

**The generative question, portable to any niche.** Which single metric in the dataset I already own has changed shape in the last 6-12 months, such that plotting it alone answers a question people in my niche are already asking out loud? Plot that one series, phrase the question as the headline, and credit yourself as the source.

### Headline and subtitle

> Everyone is using Claude now?

- **Words:** 5
- **Form:** Question — specifically an overheard-claim-plus-question-mark, which lets the chart do the confirming instead of the copy. No typographic emphasis at all: one weight, one color (#010206), sentence case, no highlighter, no color-split, no underline. Set in two centered lines with tight tracking at very heavy weight, filling 5-19% of canvas height.
- **Promise:** Read on and you get the actual curve with a dated magnitude, so you can stop guessing whether the hype is real.
- **Subtitle:** "Monthly web traffic, claude.ai - August 2025 to April 2026 / (in millions)"
- **What the subtitle does that the headline cannot:** Everything the headline is legally and numerically vague about: which metric (monthly web traffic), which entity (claude.ai), the exact window (August 2025 to April 2026), and the units (in millions) that the y-axis ticks only abbreviate as "M". Removing it leaves "800M" of an unnamed quantity over an unnamed period.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 0-5% | Dead top margin | Keeps the heavy headline from touching the crop edge and from colliding with the LinkedIn author row above it in feed. | Nothing. Band 0 measures 0% ink; measured top content edge is 5.3%. |
| 5-19% | Headline block | The hook. Carries the entire scroll-stop job by itself, because it is the only thing set large enough to survive the thumbnail. | "Everyone is using" / "Claude now?" — two centered lines, black weight, #010206. Bands 1-3 read 26 / 13 / 12, the highest sustained ink block on the canvas. |
| 19-25% | Subtitle / scoping line | Turns the headline from an opinion into a measurable claim: metric, entity, date range, units. | "Monthly web traffic, claude.ai - August 2025 to April 2026" over "(in millions)", centered, regular weight, near-black #131322. Band 4 = 18. |
| 25-33% | Accent glyph gutter | Marks the endpoint of the curve and reserves headroom above the last data point so the line does not appear clipped by the top of the plot. Also the only non-text, non-chart mark in the image. | A radial hand-drawn-style starburst of ~14 tapered spokes in #D2785D / #B97463, roughly 90px, right-aligned over the final data point near x=93% of canvas. Bands 5-6 = 4 / 3 — almost empty, which is the point. |
| 33-85% | Chart plot area | The payload. One series, five horizontal gridlines, nine markers, zero legend, zero data labels. | Right-aligned y tick labels "800M" "600M" "400M" "200M" "0M" at ~36 / 48.5 / 60 / 72 / 84% height, each with a hairline #656678 gridline running to the right edge; a ~6px round-capped smoothed #D2785D path with 9 filled circular markers rising from ~145M to ~825M. Band spikes at 7 (=7), 9 (=9), 12 (=5), 14 (=16, the 200M gridline plus the flat left segment of the series lying almost on top of it), 16 (=3, the 0M baseline). Gutter bands 8, 10, 13 read 1 / 1 / 2 — the empty upper-left triangle the flat-then-spike shape creates. |
| 85-88% | X-axis category row | Time labels. Set larger than the subtitle so the window is readable at feed size even when the subtitle is not. | "Aug Sep Oct Nov Dec Jan Feb Mar Apr", nine 3-char labels, evenly spaced, #131322. Band 17 = 9. |
| 92-96% | Source credit | Attribution and the only branding. Reads as a citation, not a CTA. | "Data from:" in bold, then a small dark hexagonal-cube logo mark, then the "Crustdata" wordmark, centered. Band 18 = 6, band 19 = 0; measured bottom content edge 95.3%. |

### Reusable skeleton

```
+----------------------------------------------+  0%
|                (empty)                       |
+----------------------------------------------+  5%
|   HEADLINE LINE 1  (centered, black wt)      |
|   HEADLINE LINE 2  (question mark)           |
+----------------------------------------------+ 19%
|   subtitle: metric, entity, date range       |
|   (units)                                    |
+----------------------------------------------+ 25%
|                                    *  <- accent
|                                   glyph over  | 33%
|  800M  - - - - - - - - - - - - - - -/- - - - | 36%
|                                    /         |
|  600M  - - - - - - - - - - - - - -o- - - - - | 48%
|                                  /           |
|  400M  - - - - - - - - - - - - -/- - - - - - | 60%
|                               /              |
|  200M  - -o-----o--o--o---o--o- - - - - - -  | 72%
|        o-/                                   |
|   0M  +--------------------------------------| 84%
|        L1  L2  L3  L4  L5  L6  L7  L8  L9    | 88%
|                                              |
|            Data from: [mark] BRAND           | 94%
+----------------------------------------------+100%
left margin 11.8% (y-tick labels)  right margin 9.6%
```

### Type system

- **Families.** One grotesque sans family across the whole canvas, no serif, no mono. Double-story 'a' and single-story 'g' in the headline rule out geometric families like Poppins/Futura. Guess: Inter Black or Archivo Black for the headline, same family Regular/SemiBold for everything else — this is a guess from letterform shape, not a confirmed identification. Tabular-looking figures in the y ticks, though with only one digit per tick it cannot be verified.

- **Headline : body.** Headline cap-height ~3.2x the subtitle. Note the inversion in the middle of the stack: the axis labels (~1.4x subtitle) are LARGER than the subtitle that explains them.

- **Weights.** Three: Black/ExtraBold (headline), SemiBold/Bold ("Data from:" and the wordmark), Regular (subtitle, all axis labels).

- **Case.** Sentence case throughout. No all-caps anywhere — no eyebrow, no kicker, no caps label. Month abbreviations are title case.

- **Typographic moves.** Tight negative tracking on the headline at large size, so two lines of 17 and 11 characters read as one dense mass. Ragged-centered two-line headline broken at a grammatical seam ("using" / "Claude"). Unit suffix baked into each tick label ("800M") instead of a rotated y-axis title. Bold-then-regular pairing inside the single footer line to separate the label from the source name.

- **Hard line limits.** Headline exactly 2 lines, longest line 17 characters. Subtitle exactly 2 lines, longest string 58 characters. Axis tick labels max 4 characters. Footer one line, ~20 characters total. Nothing on the canvas wraps to a third line.

### Color logic

- **Roles.** Page background: a near-flat vertical gradient from #F1F0FE (top, the sampled bg) into the lavender family that shows up as #D6D6EE at 35% of "non-bg" pixels and #CCCBDA at 2% — i.e. a third of the measured "ink" is actually the lower half of the background gradient plus its antialiasing, not content. Primary ink: #010206 (33%) — headline only. Secondary ink: #131322 (2%) — subtitle, axis labels, footer. Chart series and markers: #D2785D (2%). Accent glyph: #B97463 (2%), a fractionally darker/duller cast of the same orange. Gridlines and hairlines: #656678 (2%) at low opacity, plus #B6B6CF (5%) as the antialiased blend of those hairlines into the lavender field.
- **Distinct hues.** 3
- **Does color mean anything.** Semantic but minimal. Orange is reserved absolutely for the one thing being measured — the series, its nine markers, and the glyph marking its endpoint. Black/near-black is reserved for language. Grey-violet is reserved for structure that must recede (gridlines). No red/green good-bad coding, no per-point highlighting, no fill under the curve.
- **Accent discipline.** Extreme. The two orange values sum to 4% of non-background pixels, and the background gradient family alone is 42%. There is exactly one accent object in the image (the series) plus its endpoint glyph. Nothing else — not the headline, not the footer, not a single tick — borrows the accent.

### Data dependency

- **Needs external data.** yes
- **What would have to be true.** Nine monthly values of one metric for one entity across a named window: claude.ai monthly web visits, August 2025 through April 2026, reading roughly 145 / 155 / 197 / 180 / 175 / 205 / 295 / 615 / 825 million. The shape claim is load-bearing in three ways: a flat plateau for the first six points, a bend at the seventh, and a terminal value ~5.7x the first.
- **Provenance shown on the image.** "Data from:" followed by the Crustdata cube mark and wordmark, centered at 92-96% canvas height, in body size. That is the entire provenance — no URL, no methodology note, no "estimated" qualifier, no retrieval date.
- **Fabrication risk.** High and highly visible. An AI producing this class of image without real numbers would be inventing the plateau level, the inflection month, and the terminal multiple — and all three are checkable against public traffic estimators, so a wrong inflection month or an implausible 5-6x in three months is falsifiable by any reader who cares. The secondary risk is subtler: keeping real endpoints but smoothing the middle, which invents an inflection that was actually a step. The archetype offers no place to hide a fabrication, because the curve IS the content.

### Attribution

"Data from:" set bold, then a ~28px dark hexagonal-cube logo mark, then the "Crustdata" wordmark — one centered line at 92-96% height, roughly the same cap-height as the subtitle (about 0.3x the headline). Reads unambiguously as a signature/citation, not a CTA: no headshot, no @handle, no "follow me for more", no repost prompt, no arrow, no URL, no colored button. The label "Data from:" frames the brand as the evidence source rather than as the author, which is the whole point — the credit doubles as a product ad without asking for anything.

### Density

- **Words:** 33 · **Discrete elements:** 6 · **Words per element:** ~5.5 words per element, but the split matters: 19 words are prose (headline 5, subtitle 11, footer 3) and 14 are axis tick labels (5 y ticks + 9 month labels). Prose-only density is ~3 words per element.
- **Whitespace read.** Measured 7.0% ink, and roughly 42 of every 100 "non-background" pixels are just the lower half of the lavender gradient — so true content coverage is nearer 4%. The image nonetheless does not feel sparse, because the emptiness is structured rather than scattered: the flat-then-spike series shape parks a large empty triangle in the upper-left of the plot area (bands 8, 10, 13 measure 1 / 1 / 2), and that void reads as meaning — "nothing was happening" — instead of as unused canvas. Side margins are asymmetric (L11.8 / R9.6) because the y-tick column pushes the left content edge in; the plot itself runs nearly to the right crop, which is what keeps the terminal spike from feeling boxed.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** The headline, completely readable at both lines. The curve shape — flat run, sharp bend, near-vertical finish — is the most legible object in the frame. The orange starburst survives as a bright terminal mark. The y-tick ladder "800M / 600M / 400M / 200M / 0M" is still readable, so the magnitude claim survives. The footer survives as a shape that means "there is a source here" even when unreadable.
- **Dies.** The subtitle is gone — at 220px both of its lines are a grey smear, so metric, entity and the date window "August 2025 to April 2026" are all lost. The nine month labels degrade to indistinct three-letter blobs; you can count nine ticks but not tell that the series starts in August or ends in April. The nine point markers merge into the stroke, so the reader cannot see it is monthly rather than continuous. "Data from: Crustdata" is unreadable as words. The starburst loses its hand-drawn spoke structure and flattens to a blob.
- **Rule this proves.** Only two layers may carry the argument: the headline and the curve silhouette. Anything that must be read to make the claim land has to live in one of those two, or be set at axis-label size or larger — which is exactly why the y ticks are set LARGER than the subtitle. The corollary rule: never put the date range only in the subtitle if the recency of the data is part of the hook; and never rely on point markers to communicate the sampling interval.

### Why it works, and what breaks without it

- **The headline is a question that quotes what the reader already suspects, so the chart's only job is verdict delivery rather than education. "Everyone is using Claude now?" asks nothing the reader has to learn first.**
  Without it: Replace it with the descriptive label the data actually supports — "claude.ai monthly web traffic, Aug 2025-Apr 2026" — and the image becomes a reference exhibit with no reason to stop scrolling; the curve becomes the answer to a question nobody was asked.
- **Exactly one accent hue (#D2785D at 2% of non-bg pixels) and exactly one accent object. Because nothing else in the frame is orange, the eye lands on the series before it lands on any word.**
  Without it: Color the headline or the footer accent too and the reading order inverts into a scan-for-the-loudest-thing; add a second series and the single-color logic collapses into needing a legend, which is a fourth text layer the 220px thumbnail cannot carry.
- **The y-axis starts at 0M and every tick carries its unit suffix, so the 5.7x rise is a true visual proportion and needs no annotation to be believed.**
  Without it: Truncate the axis at 100M and the same data draws an even steeper wall that overstates the multiple — a reader who checks will catch it, and the credit line at the bottom is what they will discredit. Strip the "M" suffixes and the magnitude claim moves entirely into the subtitle, which dies at thumbnail size.
- **Axis tick labels are set larger than the subtitle (~1.4x), inverting the usual hierarchy. The numbers that make the claim quantitative are in the surviving size tier; the prose that merely scopes it is not.**
  Without it: Set ticks at conventional caption size and the thumbnail loses the scale entirely — the reader sees a rising line with no idea whether it is 8 million or 800 million, which is the difference between a claim and a squiggle.
- **The flat-then-spike shape parks a large deliberate void in the upper-left of the plot (bands measuring 1-2% ink), and the accent glyph occupies the one place that void does not cover — directly above the terminal point.**
  Without it: Remove the glyph and the terminal point sits ~20px below the 800M gridline with 3% of the canvas empty above it, reading as a chart that was cropped mid-rise. Move the glyph anywhere else and it becomes decoration competing with the endpoint instead of pointing at it.

### Reachable in HTML + CSS + inline SVG: **FULL**

**Blockers.**

- The Crustdata cube logo mark in the footer is a specific brand asset. Not drawable generically.
- The starburst reads as a hand-drawn brand glyph (irregular spoke lengths, tapered organic strokes, slight rotational jitter) — and in this specific case it is a trademarked mark, so copying it exactly is a licensing problem rather than a rendering one.
- The near-flat lavender background gradient is doing real work at 42% of non-bg pixels; a flat fill is visibly a different image, and banding in an 8-bit CSS gradient across 1350px is a real risk.

**Honest substitutes.**

- Footer mark: inline SVG of the actual brand's mark if you own it; otherwise drop the mark and set the wordmark in the bold weight beside "Data from:". The information job (naming the source) survives at full strength without any glyph.
- Endpoint glyph: build a generic radial spark as inline SVG — 12-16 <line> or tapered <path> spokes on a shared center, alternating lengths (e.g. r between 0.6R and 1.0R), 3-5px round-capped strokes, each rotated by 360/n degrees plus 2-4 degrees of pseudo-random jitter, filled with the accent hex. Reads as a marker, not as a stock icon. Do NOT substitute an emoji or an icon-font asterisk — both read as clip art at full res and as a blob at 220px, which is worse than absence.
- Background: linear-gradient(180deg, #F1F0FE 0%, #D6D6EE 100%) plus a 1-2% opacity SVG fractal-noise overlay to kill banding; if banding still shows at 1080x1350, ship the flat #F1F0FE and lose nothing the reader can name.

**Implementation notes.** Single CSS grid on <body> with explicit rows matching the measured bands: 5% spacer / auto headline / auto subtitle / 8% glyph gutter / 1fr chart / auto x-labels / auto footer / 4.7% spacer. Headline: font-size clamped so the longest line fits inside 1080 - 2*90px of padding, letter-spacing about -0.02em, line-height ~0.95, text-align center. Chart: one inline SVG with viewBox="0 0 756 645" (plot box only) and a real linear mapping — x = i * (W/(n-1)), y = H * (1 - v/yMax) — never eyeballed coordinates. Gridlines: 5 <line> elements at y = H*k/4 for k=0..4, stroke #656678 at 0.35 opacity, 1.5px, plus a slightly stronger baseline at k=0. Tick labels sit OUTSIDE the SVG in a right-aligned flex column so they use the page font stack, or inside as <text text-anchor="end"> with dominant-baseline="middle" — either is fine, pick one and keep the 4-char width budget. Series: one <path> smoothed with Catmull-Rom-to-cubic-Bezier conversion (tension 0.5), stroke-width 6, stroke-linecap and stroke-linejoin round, fill none, no area fill. Use a monotone variant if any segment overshoots — the flat plateau will visibly dip below its own minimum with plain Catmull-Rom. Markers: <circle r="7"> per point, fill = accent, no stroke. X labels: a flex row with space-between under the SVG, first and last label allowed to sit flush with the plot edges. Glyph: absolutely positioned inline SVG whose center is computed from the last point's x and sits ~4% of canvas height above its y. Nothing here needs JS beyond the template's own coordinate arithmetic; render at devicePixelRatio 2 and downscale, because 1.5px gridlines alias badly at 1x.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline` | string | 2 lines, 4-7 words, 34 characters total max, longest single line 19 characters. Must break at a grammatical seam. Question form or bare claim; no colon, no eyebrow, no dash-appended explainer. | Everyone is using Claude now? |
| `subtitle_scope` | string | One line, 40-60 characters. Must contain metric name, entity name, and date range. Assume it is unreadable at thumbnail size — never put the hook here. | Monthly web traffic, claude.ai - August 2025 to April 2026 |
| `subtitle_units` | string | One line, max 18 characters, parenthesized. Optional but omit only if the tick suffix is fully self-explanatory. | (in millions) |
| `series` | list<{label,value}> | 6-12 points, 9 is the tested count. Labels max 4 characters (they must not rotate). Values non-negative. The form requires shape: terminal value >= 2x the median of the first half, or the headline overclaims. Fewer than 6 points reads as a sparkline; more than 12 collides the x labels. | Aug 145, Sep 155, Oct 197, Nov 180, Dec 175, Jan 205, Feb 295, Mar 615, Apr 825 |
| `y_axis_max` | integer | Must be a round number >= max(series) with 10-15% headroom for the glyph. Axis MUST start at 0 — non-zero baselines break mechanism 3. | 800M top tick with the terminal point sitting just above it |
| `y_tick_count` | integer | 4 or 5 including the 0 baseline. Each label max 4-5 characters including the unit suffix. | 5 (0M, 200M, 400M, 600M, 800M) |
| `unit_suffix` | string | 1-2 characters appended to every tick label. Required — no rotated axis title. | M |
| `accent_hex` | hex | One hue only, mid-saturation, must hold >=4.5:1 contrast against bg_hex at 6px stroke. Used for the series, its markers, and the endpoint glyph — nothing else. | #D2785D |
| `bg_hex_top / bg_hex_bottom` | hex | Two values within ~8% luminance of each other, both light enough that #010206 text holds. A wider spread stops reading as a tinted field and starts reading as a gradient (a design tell). | #F1F0FE to #D6D6EE |
| `ink_hex / muted_ink_hex / gridline_hex` | hex | Three fixed structural values: near-black for the headline, a second near-black for body/axes, a desaturated violet-grey at 30-40% opacity for gridlines. Gridlines must never approach accent or ink saturation. | #010206 / #131322 / #656678 |
| `endpoint_glyph` | enum | one of: spark \| dot \| none. Placed only above the final data point, center at last-point-x, ~4% canvas height above last-point-y. Never placed elsewhere. | spark (14-spoke radial starburst, ~90px, accent hue) |
| `source_label` | string | Max 12 characters, bold, ends with a colon. Framing word only. | Data from: |
| `source_name` | string | Max 16 characters. Optional 28px inline-SVG mark before it. Must read as a citation, not a CTA — no handle, no URL, no follow verb. | Crustdata |

### Design-tell audit against PRD §10

**Violates (1).**

- "everything centered" — the headline, the subtitle, and the footer are all center-aligned on the same axis, three stacked centered blocks.

**Avoids (8).**

- purple-to-blue gradients — the background is a single-family lavender shift of roughly 8% luminance (#F1F0FE to #D6D6EE), close enough to the tell that it deserves naming, but it never crosses a hue boundary and never reads as a gradient object
- three equal cards in a row — no cards at all
- default Inter or Poppins with no adjustment — if this is Inter, it has been adjusted: Black weight, negative tracking, 0.95 line-height
- drop shadows on every element — zero shadows anywhere
- generic icon sets used decoratively — the only non-text marks are the series, its markers, and one endpoint glyph, all load-bearing
- emoji standing in for icons — none
- slide 1 that is just a title with no information — this is a single image and it carries the full argument
- eyebrows of any sort — no kicker, no caps label, no category tag

**New tells this image implies, not currently on the list (8).**

- Axis tick labels set smaller than body text. This image inverts it (ticks ~1.4x the subtitle) because ticks must survive the 220px thumbnail and the subtitle need not. Rule: tick labels are a primary tier, not a caption tier.
- A legend for a single series. There is none here and none is needed; the series identity lives in the subtitle. Rule: one series means zero legend.
- A y-axis truncated above zero on a growth claim. Rule: if the headline asserts magnitude, the baseline is 0 or the chart is not made.
- A rotated vertical axis title. Replaced here by baking the unit into every tick and stating it once as "(in millions)". Rule: never rotate text 90 degrees on a social image.
- Data labels printed on every point. None here — the tick ladder plus the shape carries it. Rule: annotate at most the terminal point, or nothing.
- An area fill under a single line. Absent here; a fill would raise the accent from 4% of non-bg pixels to a dominant mass and flatten the void that makes the plateau readable.
- A decorative flourish placed for balance rather than at a data location. The glyph here is anchored to the last point. Rule: every non-text mark must have coordinates derived from the data.
- Putting the recency of the data only in the subtitle. This image does it and pays for it — the date window is entirely lost at thumbnail size.

### Failure modes when copied badly

- The series is flat or noisy with no late inflection, so the silhouette says nothing while the headline still asserts a shift — the reader's first two seconds produce a contradiction and the credit line takes the blame.
- The inflection lands in the middle of the series instead of near the end, so the curve reads as an old step change and the whole recency framing evaporates.
- Twelve-plus points with 5-9 character labels, so the x-axis row either collides, shrinks below thumbnail legibility, or gets rotated 45 degrees.
- y_axis_max set to exactly max(series), so the terminal point and the endpoint glyph collide with the top gridline or get clipped.
- The endpoint glyph rendered as an emoji or an icon-font asterisk — reads as clip art at full resolution and as an unexplained blob at 220px.
- A second series added "for context", which forces a legend, kills the single-accent rule, and fills the empty upper-left triangle that made the plateau legible.
- Catmull-Rom smoothing applied without a monotone guard, so the flat plateau visibly dips below its own minimum and invents a decline that is not in the data.
- The headline names the magnitude ("Claude traffic up 5.7x") as well as the chart, so the chart becomes redundant illustration and the reader has no reason to look down.
- Gridlines set at full-strength ink, so five horizontal bars compete with the one line that matters.
- Subtitle stretched past ~60 characters and wrapping to three lines, which eats the glyph gutter and pushes the plot area down into the footer.

### Topic fit

- **Fits when.** One metric, one entity, one time axis, and a shape that is self-evidently surprising — a hockey stick, a cliff, a crossover that happens late. Best when you own or can cite the data and the reader has already heard the claim as gossip, so the chart functions as confirmation rather than instruction. Also strong when the magnitude is large enough to state in round units (hundreds of millions, 10x, from 4% to 40%).
- **Breaks when.** The point is a comparison (two things, before/after, us vs them), a composition (parts of a whole), a taxonomy or definition, a process, or a list of tips. Also breaks when the change is real but small — a 12% rise drawn from a zero baseline is a nearly flat line, and the archetype has no annotation layer to explain why 12% matters. And it breaks when the data is genuinely uncertain: there is no room on this canvas for an error band, a methodology note, or an 'estimated' qualifier.
- **Input signature that should trigger selecting it.** Select this archetype when the raw material is: a single numeric series of 6-12 sequential points, one series only, all values >= 0, where the final value is at least 2x the median of the first half AND the largest period-over-period jump occurs in the last third of the series — plus a nameable source and a metric that can be stated in under 60 characters.

<details>
<summary>All visible text, in reading order</summary>

Everyone is using Claude now? | Monthly web traffic, claude.ai - August 2025 to April 2026 | (in millions) | 800M | 600M | 400M | 200M | 0M | Aug | Sep | Oct | Nov | Dec | Jan | Feb | Mar | Apr | Data from: | Crustdata

</details>

---

## 2. ranked survey bar list
**File:** `CrustData/1784833060224.jpeg` · **Creator:** CrustData

A centered title over five left-aligned, numbered horizontal bars that rank the top five complaints from a 178-respondent survey, with the #1 bar flipped to orange and every bar's raw count printed inside its right end.

**Information job.** "Of all the things that could be wrong, which one is worst, and by how much does it beat the runner-up?" The reader gets an ordered top-5 plus the magnitude of the gaps in a single scan.

### Where the idea came from

**Likely origin.** Proprietary dataset they own — a first-party survey run by the company (n=178) whose respondents are exactly the audience being sold to.

**Evidence in the image.** The subtitle states the method and sample size verbatim ("Based on a Survey With 178 Recruiting Agencies"), the footer credits "Data from: Crustdata" rather than a third party, and all five ranked items are pain points a data-provider sells against (slow sourcing, keyword-only search, missing talent data, tools too expensive, disconnected tools). The list is a self-serving problem inventory, which is what proprietary survey content is for.

**The generative question, portable to any niche.** Ask your own audience one open question — "what is the single biggest problem you face doing X?" — bucket the answers into 5 phrases, count how many respondents named each, then rank them longest-first and state n in the subtitle. Works for any niche where you can survey or tally: support-ticket categories, churn reasons, interview rejection reasons, why deals stall.

### Headline and subtitle

> The Biggest Problems Recruiting Agencies Face

- **Words:** 6
- **Form:** Declarative noun phrase / bare superlative label. No typographic emphasis at all: one weight, one color (#0C0B23), two lines set centered with tight tracking and tight leading (line gap smaller than cap height). The superlative "Biggest" is the only rhetorical device.
- **Promise:** You will learn which problem in this named audience's world is the largest, and see the ranked others beneath it.
- **Subtitle:** "Based on a Survey With 178 Recruiting Agencies"
- **What the subtitle does that the headline cannot:** Provenance and method. It converts the headline from an opinion into a measurement by naming the instrument (survey), the sample size (178), and the population (recruiting agencies) — which is also what licenses the bare unitless numbers 66/58/49/45/44 inside the bars to be read as respondent counts.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 0-6.6% | top margin | Hard empty band so the headline is the first thing that resolves at thumbnail size. | Nothing. Band 0 measures 0% ink; measured top margin is 6.6%. |
| 6.6-19% | headline block | The claim, centered, at ~2.6x body cap height. | "The Biggest Problems" / "Recruiting Agencies Face" — 2 lines, centered, near-black #0C0B23. Bands 1-3 = 23/27/17% ink, the densest text in the piece. |
| 19-22.5% | subtitle | Method + sample size; downshifts to grey-ink so it does not compete. | "Based on a Survey With 178 Recruiting Agencies", centered, #2D2A41. Band 4 = 4% ink. |
| 22.5-30% | dead gutter | Separates the title stack from the data stack; the single largest empty run in the layout. | Nothing. Band 5 = 0% ink. |
| 30-85% | ranked bar rows (5x) | The data. Each row is a two-part unit: a thin label line, then a thick solid bar with the value printed inside its right end. | Row 1 label+bar (bands 6-7, 15/75% ink, orange #FF7A1A, value 66, full plot width); row 2 (bands 8-9, 9/70%, #5D4DEE, 58); row 3 (bands 10-11, 9/54%, 49); row 4 (bands 12-13, 15/44%, 45); row 5 (bands 14-16, 17/39/17%, 44). Rank numerals sit outside/left of the label text: "1" in orange, "2"-"5" in violet. Left edge of every bar and every numeral is the same x (measured L margin 7.3%); bar right ends vary. |
| 85-92% | dead gutter | Isolates the footer credit from the last bar so the bar stack reads as closed. | Nothing. Band 17 = 0% ink. |
| 92-96% | source footer | Attribution as data provenance, centered. | "Data from:" in bold near-black, then a violet #5D4DEE line-art cube glyph, then the "Crustdata" wordmark in #0C0B23. Bands 18-19 = 8/1% ink; measured bottom margin 4.1%. |

### Reusable skeleton

```
+--------------------------------------------------+
|                                                  |  0-6.6  empty
|          HEADLINE LINE ONE  (centered)           |
|          HEADLINE LINE TWO  (centered)           |  6.6-19
|            subtitle: method + n (centered)       |  19-22.5
|                                                  |  22.5-30 empty
|  1  Label text one                               |  30-33
|  [########################################] 66   |  33-40  ACCENT bar, 100% w
|                                                  |
|  2  Label text two                               |
|  [##################################] 58         |  45-50
|                                                  |
|  3  Label text three                             |
|  [############################] 49               |  55-60
|                                                  |
|  4  Label text four                              |
|  [##########################] 45                 |  65-70
|                                                  |
|  5  Label text five                              |
|  [#########################] 44                  |  75-82
|                                                  |  85-92 empty
|         Data from:  [glyph] Wordmark             |  92-96
+--------------------------------------------------+
 left rail = one x for numerals + labels + bar starts
```

### Type system

- **Families.** One family throughout: a geometric-leaning grotesque with a double-storey 'a', single-storey 'g', straight-tailed 'y', lining figures, and noticeably tight default tracking at display size. Not Inter and not Poppins. Guess: Gilroy / TT Norms / Greycliff class — I am guessing. Nearest Google Fonts stand-ins: Archivo ExtraBold or Manrope ExtraBold for the headline, same family at 700 for labels.

- **Headline : body.** headline ~2.6x row-label cap height; row label ~1.25x subtitle; in-bar value ~1.15x row label

- **Weights.** Two only: ExtraBold/Black (headline, row labels, rank numerals, in-bar values, "Data from:") and Medium/SemiBold (subtitle). No light or regular weight anywhere.

- **Case.** Sentence case everywhere. Headline and subtitle use Title Case on most words ("Based on a Survey With 178 Recruiting Agencies" title-cases even "With"); row labels are pure sentence case. Zero all-caps, zero small-caps, no eyebrow/kicker.

- **Typographic moves.** Negative tracking on the two headline lines; leading tighter than 1.05 so the two lines read as one mass. Values reversed to white and set INSIDE the bar, right-aligned with a consistent inset — no external value labels, so the bar geometry never grows to accommodate text. Curly apostrophe in "isn't". Rank numerals are the same weight as the label but a different hue, which is the entire numbering device — no circles, pills, or badges.

- **Hard line limits.** Headline: exactly 2 lines, 20 and 24 characters. Subtitle: 1 line, 46 characters. Row labels: 1 line each, never wrapping; longest is "The talent they need isn't in the data" at 38 characters. In-bar values: 2 digits.

### Color logic

- **Roles.** Page background #EFEAFF (pale lavender — a tint of the accent, not white). Primary ink #0C0B23 (headline, row labels, wordmark), with #030218 1% and #2D2A41 2% as the subtitle's slightly-lifted grey-ink and antialias family. Default bar fill and rank numerals 2-5: #5D4DEE at 51% of all ink — the single dominant color, with #5F4FD6 2% and #D2CFE8 1% as its antialias/edge artifacts. Highlight fill for rank 1 and its numeral: #FF7A1A 14% plus #FD7B1F 3% (same orange, JPEG-split). Value text inside bars is white/near-background reversed out of the fill. No tints, no gradients, no strokes, no shadows.
- **Distinct hues.** 3
- **Does color mean anything.** Yes, one job only: orange marks rank 1. It is not a category color and does not recur anywhere else in the piece except numeral "1", so orange means "this is the winner". Violet is the neutral default, not a meaning. Bar LENGTH carries the quantity; color carries only rank-1 emphasis.
- **Accent discipline.** Inverted from the usual: the brand violet is the bulk (51% of ink) and the true accent is orange at 14+3% = 17% of ink, spent on exactly two objects — one bar and one numeral. Because bar 1 is the longest bar it needs no extra size or weight to win; recoloring the largest object is the whole emphasis budget.

### Data dependency

- **Needs external data.** yes
- **What would have to be true.** Five response counts from a real survey with a stated n. Specifically: 178 respondents, and 66 / 58 / 49 / 45 / 44 of them naming each of five problems, pre-sorted descending. The counts must be raw respondent counts (multi-select, since they sum to 262 > 178) and the labels must be the actual answer buckets.
- **Provenance shown on the image.** Twice. Method and sample in the subtitle, "Based on a Survey With 178 Recruiting Agencies", directly under the headline; source owner in the centered footer, "Data from:" plus the Crustdata cube glyph and wordmark, at 92-96% height. No date, no link, no methodology note, no unit label on the numbers.
- **Fabrication risk.** High and nearly invisible. There is no axis, no unit, no percentage, and no total shown next to the bars, so invented counts cannot be cross-checked against n from the image alone; only the sum-exceeds-n arithmetic hints at multi-select. An AI inventing this would produce the tell-tale smooth decay (66, 58, 49, 45, 44 is plausibly uneven; a fabricated set tends to read 70, 60, 50, 40, 30) and a suspiciously round n. The label phrasings are the second risk: real survey buckets are blunt and slightly awkward ("The talent they need isn't in the data"), fabricated ones come out as parallel marketing clauses.

### Attribution

"Data from:" set in the body-label weight and size in near-black #0C0B23, followed on the same baseline by a violet #5D4DEE line-art cube mark and the "Crustdata" wordmark in #0C0B23 at roughly headline-minus scale (larger than the row labels, smaller than the headline). Horizontally centered, sitting alone in the 92-96% band after a 7%-tall empty gutter. No headshot, no @handle, no "follow me for more", no repost prompt, no URL. It reads unambiguously as a source citation rather than a CTA — the words "Data from:" frame the logo as the origin of the numbers, which is the same reason it can be centered and bold without competing with the headline.

### Density

- **Words:** 57 · **Discrete elements:** 8 · **Words per element:** ~7.1 words per element (57/8); within a row: 1 numeral + 4-8 label words + 1 value
- **Whitespace read.** 22.2% ink but reads open, and the reason is that almost all of it is five solid rectangles rather than text. Text is only about a third of the ink; the bars are pure filled area, which registers as one shape each instead of something to read. Reinforced by 14.5% total side margin, a 7.5%-tall empty gutter under the subtitle, a 7%-tall empty gutter above the footer, and the fact that no row has anything to its right except background — every bar's right end terminates into empty space, so the eye gets a clean ragged edge to compare lengths against.

### Thumbnail test at 220px: **PASS**

- **Survives.** The two-line headline is fully readable at 220px — it is the only thing sized for this. The five-bar ranked shape reads instantly, including that bar 1 is orange and full-width and that bars 3-5 are near-equal. The rank numerals 1-5 survive as position markers. Row labels are at the legibility edge: word shapes and the first two or three words of each resolve ("Sourcing is slow...", "Too many disconnected tools"), enough to know the list is about problems. The centered footer reads as a logo lockup.
- **Dies.** The subtitle is gone — "Based on a Survey With 178 Recruiting Agencies" is a grey smear, so the sample size and the entire method claim are invisible at feed size. The in-bar values 66/58/49/45/44 are white blobs; you can tell numbers are there but not read them, so the magnitudes are carried entirely by bar length. The longer labels ("Search matches keywords, not real fit", "The talent they need isn't in the data") lose their back halves. The cube glyph and the "Crustdata" wordmark are unreadable — the brand does not survive the thumbnail.
- **Rule this proves.** The headline must carry the whole proposition alone, and the ranking must be legible from bar geometry with the numbers switched off. Corollary: never let a number inside a bar be the only place a magnitude lives, and never put load-bearing information (n, units, source) in the subtitle or footer. Second corollary: the accent color is what does the thumbnail's pointing — at 220px "orange bar on top" is readable when "66" is not.

### Why it works, and what breaks without it

- **Bar 1 is pinned to 100% of the plot width, so the scale is defined by the maximum value rather than a round axis maximum, and every other bar is a true proportion of it (58/66 measures 918px of 1045px, 49/66 measures 776px — both within 2px of the linear prediction).**
  Without it: Anchor to an arbitrary max like 100 and the longest bar fills ~63% of the plot, leaving a permanent empty column on the right; the ragged right edge that the eye uses to compare lengths collapses toward the left and the gaps between ranks 1, 2, and 3 stop being visible at thumbnail size.
- **Values are reversed out INSIDE the right end of each bar instead of sitting outside it, so bar length and value occupy the same pixels and no bar is shortened or padded to make room for text.**
  Without it: External value labels force either a reserved right gutter (shrinking every bar and compressing the differences) or labels that collide with the background at different x positions, creating a second ragged edge that competes with the real one.
- **One accent recolor on the single largest object, spending 17% of ink on exactly two things (bar 1, numeral 1) and leaving 51% of ink as a single flat violet.**
  Without it: Give each of the five bars its own hue and length stops being the comparison channel — the reader starts decoding a legend that does not exist, and at 220px the ranking becomes five equally loud stripes with no entry point.
- **A single left rail: rank numerals, label text, and every bar's left edge start at the same x (7.3% margin), and nothing is ever placed to the right of a bar.**
  Without it: Center the rows, or indent labels off the bars, and the bars no longer share a zero — length comparison requires the eye to measure both ends of each bar instead of just tracking one moving right edge, which is the specific thing that survives the thumbnail.
- **The method claim is split out into a subordinate grey-ink subtitle ("Based on a Survey With 178 Recruiting Agencies") rather than being crammed into the headline.**
  Without it: Fold n and method into the headline and it runs past two lines at display size, losing the tight two-line mass that is the only thing fully legible at 220px; drop the subtitle entirely and the unitless numbers 66/58/49 have no referent and the piece reads as an opinion list.

### Reachable in HTML + CSS + inline SVG: **FULL**

**Blockers.**

- The exact Crustdata cube mark. It is a specific brand logo — reproducible as inline SVG only if someone hands over the path data; it is not derivable and not in any icon set available to the renderer.
- The exact typeface. The headline face is a proprietary geometric grotesque (Gilroy/TT Norms class), not on Google Fonts, so the specific letterforms and default tight tracking cannot be matched exactly.

**Honest substitutes.**

- Logo: accept the mark as a template parameter — either inline SVG path data supplied by the user, or fall back to a text-only wordmark in the primary ink at ~1.3x the row-label size. Do NOT substitute a generic cube/box icon; a wrong glyph next to a real company name is worse than no glyph, and the information job (who vouches for these numbers) is fully carried by the words.
- Type: Archivo or Manrope at 800/900 for the headline with letter-spacing: -0.02em and line-height: 1.02 to recover the tight two-line mass; same family at 700 for row labels and values, 500-600 for the subtitle. The ratio and the two-weights-only rule matter more than the family.

**Implementation notes.** Body at 1080x1350 (ratio 0.80, matches the measured 0.799) with background #EFEAFF and padding: 6.6% 7.2% 4.1% 7.3%. Title stack: two centered <div>s (headline, subtitle) with a fixed 7.5vh spacer below. Bar stack: a flex column, gap ~4% of height; each row is a plain block containing (a) a label line built as flex with a fixed-width numeral cell so all label text starts at one x, and (b) the bar. Bar = a single div, height ~4.6% of canvas, border-radius ~10px, width: calc(var(--v) / var(--vmax) * 100%) — no SVG needed, no chart library, and the linear mapping is literally that one calc. Value sits inside the bar as a right-aligned span with padding-right ~1.5% and color #EFEAFF (reverse out to the page color, not pure white, to match the measured absence of a bright white in the color table). Rank-1 row gets a --fill override to #FF7A1A applied to both the bar background and the numeral color; all other rows use #5D4DEE. Footer: one centered flex row, baseline-aligned, holding the "Data from:" text, an inline SVG mark at ~1.4em, and the wordmark. Zero shadows, zero gradients, zero borders anywhere. Because the whole chart is div widths, this renders identically headless with no font-metric dependence in the geometry — only the text can reflow, which is why the label character cap below is a hard constraint.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline` | string | 34-50 characters total, must break into exactly 2 lines of 18-26 characters each; no colon, no dash, no subtitle smuggled in. Superlative or ranking word strongly preferred ("Biggest", "Most Common", "Top"). | The Biggest Problems Recruiting Agencies Face |
| `subtitle` | string | 1 line, 30-52 characters, must fit on one line at ~0.38x headline size. Must name the method and the sample size or period. Omit only if there is genuinely no measurement behind the numbers, in which case the archetype is the wrong choice. | Based on a Survey With 178 Recruiting Agencies |
| `items` | list<{label,value}> | Exactly 5 items (4 minimum, 6 absolute maximum before bar height must drop below 4% and the thumbnail test fails). Must be pre-sorted descending by value. Label: 20-40 characters, one line, sentence case, no trailing punctuation, no wrapping allowed. Value: integer, 1-4 digits. The lowest value must be at least 55% of the highest, or bars 3-5 become visually identical; if it is below that, the tail items should be cut rather than shown. | [{"Sourcing is slow and manual",66},{"Search matches keywords, not real fit",58},{"The talent they need isn't in the data",49},{"Data tools are too expensive to scale",45},{"Too... |
| `value_unit_suffix` | string | 0-1 characters ("%" or empty). This image uses empty, which is only defensible because the subtitle states the sample size. If the subtitle does not state n, this must be non-empty. | "" (bare counts: 66, 58, 49, 45, 44) |
| `highlight_index` | integer | Exactly one index, and it must be 1 (the top-ranked row) unless there is a stated reason to point elsewhere. Never highlight two rows — the accent's entire meaning is uniqueness. | 1 |
| `bg_color` | hex | A very pale tint of accent_color, not white. Luminance high enough that primary ink passes contrast and low enough that a white bar value would look wrong. | #EFEAFF |
| `accent_color` | hex | Default bar fill and rank numerals 2-n. Must hold reversed background-colored text at the bar's right end, so it needs to be mid-dark. | #5D4DEE |
| `highlight_color` | hex | Used on exactly two objects: the highlighted bar and its numeral. Must be a different hue family from accent_color, not a lighter or darker shade of it, or the emphasis reads as an accident. | #FF7A1A |
| `ink_color` | hex | Headline, row labels, wordmark. Near-black, not pure black. | #0C0B23 |
| `muted_ink_color` | hex | Subtitle only. Must sit between ink_color and bg_color, closer to ink. | #2D2A41 |
| `source_prefix` | string | 8-16 characters, ends with a colon. Frames the logo as provenance, not as a follow prompt. | Data from: |
| `source_name` | string | 4-14 characters. One word preferred, since it sits at ~1.3x row-label size on a centered line. | Crustdata |
| `source_mark_svg` | string | Optional inline SVG path data for a single-color mark, rendered at ~1.4em in accent_color. Leave empty rather than substituting a generic icon. | violet line-art cube glyph left of the wordmark |

### Design-tell audit against PRD §10

**Violates (1).**

- "everything centered" — partially. The headline, subtitle, and footer are all centered; only the data block is left-aligned. Verdict: the rule is too broad. Centering is correct here precisely because the title stack and footer are full-width single objects with nothing to compare against, while the bars are a comparison set and therefore must share a left zero. The tell should be "everything centered including comparison sets", and this image obeys that stricter version.

**Avoids (7).**

- No purple-to-blue gradient — the violet #5D4DEE is a flat fill with no second stop anywhere; the background #EFEAFF is a static tint, not a gradient.
- No three-equal-cards row — the entire body is one column of unequal-length bars, and the inequality IS the content.
- No drop shadows: the color table contains no soft mid-tones between bar fill and background, only antialias hexes (#5F4FD6, #D2CFE8) at 2% and 1%.
- No decorative icon set and no emoji — the only non-text glyph in the image is the brand cube in the footer.
- No eyebrow, kicker, or category label above the headline: band 0 is 0% ink, the headline is the first mark on the page.
- No title-only opener — every pixel of the single frame is information; there is no wasted cover slide.
- No default Inter/Poppins — a proprietary grotesque with negative tracking and sub-1.05 leading, adjusted at display size.

**New tells this image implies, not currently on the list (7).**

- Bar values printed outside the bar. Putting the number to the right of the bar reserves a gutter and shortens every bar; reverse it inside the right end instead.
- Bar chart max not pinned to the largest datum. Rounding the axis up to 100 or the next nice number wastes the right third of the canvas and flattens the visible gaps.
- Axis lines, gridlines, tick labels, or a legend on a 5-item ranked bar list. This image has none of the four and loses nothing — every one of them is ink that competes with the ragged right edge.
- Rank numerals wrapped in circles, pills, or badges. Here the numeral is bare, same weight as the label, differentiated by hue alone.
- More than two type weights in a single-frame infographic. Two do all the work; a third weight always turns out to be a hedge on hierarchy.
- Load-bearing information placed in the subtitle or the footer. Both are illegible at 220px, so sample size, units, and source must be treated as second-read content, never as the thing that makes the headline true at a glance.
- A ranked list whose tail items differ by less than a few percent (49/45/44 here) shown at full length anyway — the bottom of this chart carries no information and invites the reader to see a ranking that the data does not support.

### Failure modes when copied badly

- Tail bars land within a few percent of each other (this image already has 49/45/44) and the bottom three rows read as identical length, so the "ranking" below position 2 is visual noise the reader cannot resolve.
- A label runs past ~40 characters, wraps to two lines, and that one row grows taller than the other four — the even vertical rhythm breaks and the stack stops reading as a single comparison set.
- Bars are drawn from a hand-picked max instead of the top value, so the longest bar stops short of the right margin and the empty right column makes the whole block look like it was cropped wrong.
- The number is placed outside the bar because it "didn't fit", producing two competing ragged edges — bar ends and label ends — at different x positions.
- The highlight color gets applied to two or three rows "for balance", which destroys the only signal that says which row is the answer.
- Six or seven items get forced in, bar height drops below ~4% of canvas, and at 220px the block turns into hairline stripes.
- The subtitle omits n or the method, leaving bare unitless integers inside the bars with nothing to anchor them — the reader cannot tell if 66 is a count, a percent, or a score.
- Labels get rewritten into parallel marketing clauses of matched length and rhythm, which reads as authored rather than tallied and quietly kills the survey's credibility.
- Background set to pure white, which strands the pale-tint relationship — the flat violet bars then read as raw UI blue instead of as a palette.

### Topic fit

- **Fits when.** You have a genuine frequency count over a small set of named categories from one measurement, and the point of the post is the ORDER plus the size of the gap at the top. Best when the top item beats the runner-up by a visible margin and the categories are phrases a reader recognizes as complaints, causes, or choices from their own life.
- **Breaks when.** The values are a time series (order is chronological, not ranked, so a bar list destroys the trend), a part-to-whole set that must sum to 100 (bars imply independent magnitudes and this image's own numbers sum to 262 of 178), a two-sided comparison (belief vs reality, before vs after — needs a split, not a ranking), a process with sequence, or a concept with no counts at all. Also breaks when the categories need more than ~40 characters each to be meaningful, or when the spread is so flat that the ranking is an artifact of sampling.
- **Input signature that should trigger selecting it.** 4-6 labeled categories, each 20-40 characters, each with one integer count from a single stated measurement of stated size n; sortable descending; lowest value >= 55% of highest; no time dimension, no requirement that the values sum to a total.

<details>
<summary>All visible text, in reading order</summary>

The Biggest Problems Recruiting Agencies Face | Based on a Survey With 178 Recruiting Agencies | 1 | Sourcing is slow and manual | 66 | 2 | Search matches keywords, not real fit | 58 | 3 | The talent they need isn't in the data | 49 | 4 | Data tools are too expensive to scale | 45 | 5 | Too many disconnected tools | 44 | Data from: | Crustdata

</details>

---

## 3. logo-tipped ranked bars
**File:** `CrustData/1785348475450.jpeg` · **Creator:** CrustData

A landscape bar chart that answers "where did this company's employees work before?" by ranking seven prior employers, each bar tipped with that employer's own logo instead of a text label.

**Information job.** "I know this company — who did they poach their people from, and who is the single biggest feeder?" The reader wants a ranked list of source organizations with real counts, and wants to recognize each source without reading.

### Where the idea came from

**Likely origin.** Proprietary dataset they own. Crustdata sells people/company enrichment data; this is a single query (employees of company X, grouped by previous employer) rendered as a chart, and the chart exists to demonstrate the dataset.

**Evidence in the image.** The footer lockup reads "Data from: Crustdata" — the creator credits itself as the data source, not a third party. The subtitle states the exact population and method: "Based on 74 OpenRouter employees, grouped by the company they worked at before joining, July 2026". A grouped-by phrasing plus n=74 plus a month stamp is the shape of a database query result, not a hand-collected list. The subject (OpenRouter) is a currently-watched company, i.e. the topic is chosen for attention while the form is chosen for the dataset.

**The generative question, portable to any niche.** Pick an organization your audience is currently curious about. Using a roster you actually have, group its people by some prior affiliation (previous employer, university, prior tool, former vendor) and rank the top 5-8 groups by headcount. Headline it as the question the ranking answers.

### Headline and subtitle

> Where Does [openrouter logo + wordmark] Hire Its Talent From?

- **Words:** 7
- **Form:** Question — a direct interrogative in two lines, set in heavy black grotesque, tight tracking, centered. The typographic trick is that the subject of the sentence is not typed, it is the entity's own logo lockup (violet rounded mark + lowercase "openrouter" wordmark) placed inline in the first line, sized to the cap height of the surrounding words. Line 1 = "Where Does" + logo; line 2 = "Hire Its Talent From?". No highlighter, no color-split, no underline; the only color in the headline is the borrowed logo violet.
- **Promise:** Read the top bar and you have the answer to the question in the headline — the single largest talent feeder — plus the six runners-up with exact counts.
- **Subtitle:** "Based on 74 OpenRouter employees, grouped by the company they worked at before joining, July 2026"
- **What the subtitle does that the headline cannot:** It does three things the headline cannot: states the population size (74), states the grouping rule that makes the bars mean anything ("grouped by the company they worked at before joining"), and timestamps it ("July 2026"). Without it the bars are unsourced assertions; with it they are a checkable claim. It is also the only place the method appears — there is no axis title anywhere.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 0-5% | top dead margin | Separates the headline from the feed chrome; measured band 0 is literally 0 ink. | nothing |
| 5-21% | headline block | States the question and names the subject via its logo. | Two centered lines of heavy black grotesque with the openrouter logo lockup inline in line 1. Bands 1-4 rise 27 / 34 / 39 / 40 as the second, longer line lands. |
| 23-28% | subtitle line | Method, sample size, date — turns the chart into evidence. | One centered line of regular-weight body sans, ~97 characters, no wrap. |
| 28-34% | breathing gap | Detaches the verbal header from the graphic; the only true vertical rest inside the composition. | empty field (bands 5-7 still read 48 / 57 / 57 only because the lavender vignette counts as non-background ink — see whitespace_verdict) |
| 34-38% | legend row | Maps the seven fill colors to seven names in one horizontal line. | 7 chips left-to-right in bar order: filled circle + bold label — "OpenSea", "Grove Collaborative", "Google", "Amazon", "Paddle", "IBM", "Notion". Centered as a group, not aligned to the bar track. |
| 38-83% | plot area | The payload: seven sorted bars, each with its count and its brand logo. | 7 full-bleed-left horizontal bars, no gaps between rows (bars touch), sorted 9/6/5/5/4/3/3. Value numeral in white bold inside the right end of each bar; brand logo immediately right of the bar end, sitting on the background. 5 vertical gridlines at ticks 2/4/6/8/10. Band 8 = 79 (widest bar), then 69/71/71/70/68/65/62 as bars shorten. |
| 83-86% | x axis | Gives the bars a scale so lengths are quantities, not decoration. | "0  2  4  6  8  10" in bold, first tick flush with the bar origin, last tick at the right content edge. Band 16 = 51. |
| 86-91% | gap | Isolates the credit from the chart so it does not read as a data label. | empty field (band 17 = 28, again vignette not marks) |
| 91-95% | source footer | Attribution and provenance in one centered lockup. | "Data from:" + Crustdata cube mark + "Crustdata" wordmark, centered. Band 18 = 13. |
| 95-100% | bottom dead margin | Symmetry with the top margin; band 19 = 0 ink. | nothing |

### Reusable skeleton

```
+----------------------------------------------------------------+  0%
|                                                                |
|            HEADLINE L1  [ENTITY LOGO INLINE]                   |  5-21%
|            HEADLINE L2 ends in "?"                             |
|                                                                |
|        subtitle: n = __, grouping rule, date  (1 line)         |  23-28%
|                                                                |
|                          (rest)                                |  28-34%
|      * lbl  * lbl  * lbl  * lbl  * lbl  * lbl  * lbl           |  34-38%
| +------------------------------------------+ .  .  . [LOGO 1]  |  38%
| |################################ v1 |     .  .  .             |
| +-------------------------------+ v2 | .  .  .  [LOGO 2]       |
| |#############################        .  .  .                  |
| +--------------------------+ v3 |  .  .  .  [LOGO 3]           |
| |########################         .  .  .                      |  plot
| +--------------------------+ v4 |  .  .  .  [LOGO 4]           |  38-83%
| |########################         .  .  .                      |
| +---------------------+ v5 |   .  .  .  [LOGO 5]               |
| |###################        .  .  .                            |
| +----------------+ v6 |  .  .  .  [LOGO 6]                     |
| |###############       .  .  .                                 |
| +----------------+ v7 |  .  .  .  [LOGO 7]                     |
| 0        t1       t2       t3       t4              tmax       |  83-86%
|                  Data from: [SOURCE LOGO]                      |  91-95%
+----------------------------------------------------------------+ 100%
(bars share a left origin, touch vertically, sorted descending;
 dotted verticals = gridlines; value numeral sits INSIDE bar right end)
```

### Type system

- **Families.** Two families. Headline and all bold chart type: a heavy geometric-leaning grotesque with tight negative tracking at display size, double-story 'a', horizontally-cut 'e' terminal, near-flat-sided 'o' — my guess is Archivo Black or Degular Black, and it is a guess; Archivo Black is the free Google Fonts stand-in and is close. Body/subtitle: a neutral humanist-grotesque UI sans, Inter-like, regular weight. Legend labels, value numerals and axis numerals are in the display family's bold, not the body family.

- **Headline : body.** headline cap-height ~3.5x subtitle cap-height (headline ~100px cap on a 1465px canvas vs subtitle ~28px). Legend labels ~0.8x subtitle. Value numerals ~0.85x subtitle. Axis numerals ~1.0x subtitle. Footer ~1.0x subtitle.

- **Weights.** Three: 900/Black (headline, axis, legend labels, bar values), 400/Regular (subtitle), and the medium weight inside the borrowed logo wordmarks which is not the designer's choice.

- **Case.** Headline in Title Case, not caps — the question mark does the emphasis work instead. Subtitle sentence case. Legend labels in the brands' own casing ("IBM" caps, "Amazon" title). No small caps, no all-caps anywhere except inside borrowed logos ("COLLABORATIVE").

- **Typographic moves.** 1) Logo set inline in the headline as a word, optically matched to cap height. 2) White bold numeral reversed out of the bar fill, right-aligned inside the bar with ~14px inset — no leader lines needed. 3) Axis numerals bold, so the scale reads at the same weight as the data. 4) Tight tracking on the display line so the two-line headline stays as one block. 5) Bars butted with zero row gap, so the seven fills form one staircase silhouette rather than seven separate objects.

- **Hard line limits.** Headline: exactly 2 lines, ~22 characters per line including the logo's optical width ("Hire Its Talent From?" = 21 chars). Subtitle: 1 line, 97 characters, must not wrap. Legend: 1 row, longest label "Grove Collaborative" = 19 chars. Value labels: 1-2 characters. Footer: 1 line, "Data from:" + wordmark.

### Color logic

- **Roles.** Page ground: a low-contrast lavender vignette running from a near-white in the corners to #D8D8F1 through the middle and edges — #D8D8F1 is 49% of all "non-background" pixels, i.e. half the measured ink is the gradient itself, and the sampled flat background is ~#F1F0FE. Primary ink: #020205 (headline, subtitle, axis numerals, legend labels) which doubles as the Notion series fill, so #020205's 9% share is text plus one bar. Gridlines: a slightly darker tint of the #D8D8F1 family, no separate hue. Chart series, top to bottom: #0385FF (OpenSea, 9%, also the largest bar so it owns the most area), #033B4C (Grove, 6%), #3AAC56 (Google, 5%), #FE9A04 (Amazon, 5%), #FFD401 (Paddle, 4%), #2375C6 (IBM, 3%), #020205 (Notion). Value numerals are white reversed out of every fill. No fill tints, no strokes, no shadows.
- **Distinct hues.** 6
- **Does color mean anything.** Color is identity, not measurement. Each bar wears its own organization's brand color, and the legend dot repeats it — so hue answers "which company" while length answers "how many". Nothing is red-bad / green-good, and no single series is highlighted as the hero; the hero is established by sort order and length instead. Consequence: the palette is dictated by the topic, not by the designer, which is why two blues (#0385FF and #2375C6) coexist and are only distinguishable because their bars are far apart vertically.
- **Accent discipline.** There is no designer-chosen accent — and that is the discipline. Every saturated pixel belongs to the data (the seven series total 41% of content pixels), the ground is a single desaturated lavender family (49%), and text is one black (#020205). Zero color is spent on decoration: no colored headline word, no tinted panels, no colored rules, no badge. The violet in the headline is borrowed from the subject's logo, not invented.

### Data dependency

- **Needs external data.** yes
- **What would have to be true.** A roster of the subject organization's current employees (n stated as 74) with a prior-affiliation field per person, aggregated into counts: OpenSea 9, Grove Collaborative 6, Google 5, Amazon 5, Paddle 4, IBM 3, Notion 3. The seven shown sum to 35 of 74, so a long tail is silently omitted and never acknowledged on the image.
- **Provenance shown on the image.** Two places. In the subtitle, verbatim: "Based on 74 OpenRouter employees, grouped by the company they worked at before joining, July 2026" — population, grouping rule, date. In the footer, centered at 91-95%: "Data from:" followed by the Crustdata cube mark and wordmark. There is no methodology note about the omitted tail and no link.
- **Fabrication risk.** High and highly visible. An AI without a roster would have to invent both the membership of the list and the counts. The membership is the tell: "Grove Collaborative" at #2 is a non-obvious, non-prestige answer that only a real roster would produce, and a fabricated version would default to Google/Meta/OpenAI/Stripe — a list any reader in the niche recognizes as generic. The counts are independently checkable on LinkedIn in minutes, and the stated n=74 must reconcile with the bars. Ranks 3/4 tie at 5 and ranks 6/7 tie at 3; invented data rarely produces ties, so tie-free integers plus a round n is a fabrication smell.

### Attribution

"Data from:" + Crustdata cube mark + \"Crustdata\" wordmark, centered on the horizontal axis of the canvas at 91-95% vertical, set at roughly body size (~1.0x subtitle) in the display family's medium/bold. No headshot, no personal byline, no @handle, no \"follow me for more\", no repost prompt, no URL, no border or panel around it. It reads unambiguously as a source citation and signature, not as a CTA — the verb is \"Data from\", which credits rather than asks. The only other branding on the page is the subject's own logo in the headline, which is content, not attribution. Net effect: 55 words on the page and zero of them are self-promotion, so the credit is legible as neutral provenance; that is what buys the counts their credibility.

### Density

- **Words:** 55 · **Discrete elements:** 25 · **Words per element:** 2.2 words per element (55 words / 25 elements). Excluding the header block, the chart body carries 29 words across 22 elements = 1.3 words each — almost every chart element is a single word or a single numeral.
- **Whitespace read.** Measured 47.3% ink, yet it reads as an open page. Two reasons, both structural. First, roughly half that figure is not marks at all: #D8D8F1 is 49% of "non-background" pixels and it is the lavender vignette, so the true mark coverage is closer to 24%. Second, the real marks are organized as one object — seven butted bars forming a single staircase — and everything to the right of each bar end is empty field, which for rows 2 through 7 is 15-55% of the row width. Add two genuinely empty bands (28-34% and 86-95%) and 5% dead margin top and bottom, and the composition has four large rests despite heavy local ink. The bars themselves are the densest possible mark (100% saturated fill, no gaps), which is why the numbers say crowded and the eye says otherwise.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** At 220px I can read both headline lines — "Where Does [logo] openrouter" / "Hire Its Talent From?" — and the violet logo mark survives as a recognizable colored glyph. The seven-step descending staircase of colored bars is unmistakable, so "one thing dominates, then a long tail" transmits fully. Three bar-end logos survive as shapes: the multicolor "Google", the orange "amazon" swoosh-word, and the dark "Grove" wordmark. The legend reads as a row of colored specks (dots survive, text does not). The footer survives as a centered lockup silhouette; "Crustdata" is at the edge of legibility.
- **Dies.** The entire subtitle is gone — n=74, the grouping rule and the July 2026 date all vanish, which is the whole evidentiary basis. Every legend label is illegible. Every value numeral (9, 6, 5, 5, 4, 3, 3) is gone, including the white "4" on the yellow bar which is already low-contrast at full size. All six axis numerals are gone, so the bars have no scale. The "paddle", "IBM" and "Notion" wordmarks are unreadable smudges, meaning ranks 5, 6 and 7 have no identity at thumbnail size. Gridlines disappear entirely.
- **Rule this proves.** Design rule: in this archetype the headline and the bar staircase must carry the whole message alone, because every number on the page dies at feed size. So (a) the headline must be a complete question, not a fragment that needs the chart to parse; (b) the ranking must be visible as silhouette, which requires the top bar to be at least ~1.4x the second (here 9 vs 6) — near-equal bars produce a thumbnail that says nothing; (c) identity for the top three rows must be carried by something that survives at 220px, which here is high-chroma logo color, not letterforms; (d) never put the payload in a numeral. The numerals are second-read reward for someone who already stopped scrolling.

### Why it works, and what breaks without it

- **Descending sort on a single metric with bars sharing one left origin and zero row gap, so the seven fills form one staircase silhouette.**
  Without it: Unsorted or gapped bars force pairwise length comparison. The "who is #1" answer — the thing the headline promises — stops being pre-attentive and has to be computed, and at 220px it becomes unavailable entirely because the staircase shape is what survives the downscale.
- **Entity identity carried by each organization's own logo placed just outside the bar end, with no left-hand category column at all.**
  Without it: A text category axis would eat 18-22% of the canvas width on the left ("Grove Collaborative" is 19 characters), shortening every bar and shrinking the 9-vs-6 length difference that the chart exists to show. It would also convert recognition into reading, which is a slower operation than the scroll allows.
- **Landscape 1.311 aspect — the only non-4:5 in the set — giving the bar track ~86% of 1920px of horizontal resolution.**
  Without it: At 4:5 the same seven rows plus header plus axis would compress the track to roughly half the pixel length, so a 3-unit gap between rank 1 and rank 2 would read as a small nudge. The format is a deliberate trade: it sacrifices feed height (and therefore scroll-stopping area) to buy length resolution, and the whole argument lives in length.
- **Headline is an interrogative that the top bar literally answers, and the subject is named by inlining its logo rather than typing it.**
  Without it: Turn it into a declarative label ("OpenRouter hiring sources") and the image becomes a table with no argument — nothing in it needs resolving, so there is no reason to stop. Remove the inline logo and the headline needs 3-4 more words to identify the subject, pushing it to three lines and out of the 5-21% band.
- **Subtitle states population, grouping rule and date in one 97-character line: "Based on 74 OpenRouter employees, grouped by the company they worked at before joining, July 2026".**
  Without it: The seven integers become assertions with no denominator. A reader cannot tell whether 9 is out of 20 or out of 2000, cannot tell whether "from" means most recent employer or any prior employer, and cannot date the claim — so the counts get read as vibes and the footer credit has nothing to certify.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- The seven bar-end brand logos: OpenSea's blue circular sailboat mark + wordmark, the "Grove / COLLABORATIVE" serif lockup, Google's four-color wordmark, the "amazon" wordmark with the orange swoosh, the "paddle" wordmark with its custom p, the IBM striped monogram, and the Notion cube + "Notion". These are proprietary vector assets. The CSP-free renderer has no external asset fetch, no icon library, and none of these are reproducible from Google Fonts glyphs.
- The openrouter logo lockup inline in the headline — a custom violet rounded-Q mark plus a specific wordmark face. Same problem, and it is more load-bearing than the bar logos because it identifies the subject of the sentence.
- The Crustdata cube mark in the footer.
- The exact display face. The headline weight and letterform (heavy grotesque, tight tracking, flat-sided o) is likely a licensed family (Degular/Archivo-class). Archivo Black from Google Fonts is close but not identical; the negative tracking must be dialed in manually to match the two-line block width.

**Honest substitutes.**

- Bar-end logos → a per-row identity chip that keeps the recognition job: a filled rounded-square (44x44 at 1080 width, radius 10) in the series hex, containing the entity's initial(s) in white 900-weight, followed by the entity name in 900-weight #020205 at body size. This preserves what the logo did — name the row without a left axis column, and stay color-coded to the bar — and it survives the thumbnail better than a small wordmark does. It loses brand recognition-at-a-glance, which is a real loss, but a missing label is worse than a text label.
- Inline headline logo → set the entity name in the display face at headline size and color it with the entity's brand hex, optionally preceded by the same rounded-square initial chip scaled to cap height. The headline stays two lines and the subject stays visually distinct from the surrounding black words.
- Footer source mark → "Data from: NAME" with NAME in 900-weight and, if a mark is wanted, a 22px rounded-square initial chip in a single neutral (#020205). Drop any attempt at a bespoke glyph — a fake mark reads as a broken image.
- Display face → Archivo Black via Google Fonts with letter-spacing: -0.02em on the headline; body/subtitle in Inter 400. Declare a real fallback stack (Archivo Black, 'Helvetica Neue', Arial Black, sans-serif).

**Implementation notes.** Page: a flex column, 1080x1350, background: radial-gradient(120% 90% at 50% 45%, #F1F0FE 0%, #D8D8F1 100%) to reproduce the lavender vignette — note this changes the aspect from the source's 1.311 landscape to 0.8 portrait, so either accept ~40% less bar-length resolution or render at 1350x1030 and accept the non-standard feed crop. Plot: one wrapper with position:relative and a left/right padding that defines the track (left origin at 8.5%, track ends at 95%). Gridlines: repeating-linear-gradient(to right, rgba(2,2,5,.10) 0 1px, transparent 1px) with background-size set to (100/ticks)% — cheaper and pixel-aligned versus five absolutely-positioned divs, and it inherits the track padding. Rows: CSS grid, grid-template-rows: repeat(n, 1fr), row-gap: 0 so bars butt exactly as in the source. Each row is a flex line: the bar is a div with width: calc(var(--v) / var(--max) * 100%), background: var(--hex), no radius, and the identity chip sits immediately after it in normal flow so it self-positions at the bar end with no absolute math. Value numeral: a span inside the bar, margin-left:auto, padding-right:14px, color:#fff, font-weight:900 — and add a guard: for light fills (#FFD401, #3AAC56) set the numeral to #020205 instead, because the source's white 4 on yellow is already near-illegible at full size and fails outright in the thumbnail. Axis: a flex row with the same left/right padding as the plot, justify-content: space-between, so tick labels land on the gridlines without magic numbers; give the first and last labels transform: translateX(-50%) / translateX(50%) compensation only if you center them on the tick. Inline SVG is unnecessary here — every mark is a rectangle, a line, or text — and would cost you text wrapping and font metrics. Reserve SVG for the case where you need a non-linear scale or a tick that is not evenly spaced. Define the whole palette as tokens on bare :root; this design commits to a single light look, so paint body background explicitly rather than relying on the host theme.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline_line_1` | string | Max 14 characters. Must be the opening clause of a question and must end where the entity name begins; the entity token is appended to this line, so line 1 total (text + entity name) must stay under ~24 characters. | Where Does |
| `entity_name` | string | Max 12 characters. Rendered in the entity's brand hex at headline size on line 1. Longer than 12 and the headline spills to three lines and breaks the 5-21% band. | openrouter |
| `entity_hex` | hex | Must pass 4.5:1 against #F1F0FE, since it carries headline text. Borrow from the subject's real brand, do not invent. | #7C3BEC (the violet of the openrouter mark; not in the measured palette because the logo occupies too few pixels to rank) |
| `headline_line_2` | string | Max 22 characters, must terminate the question with "?". Exactly one line — no wrap. | Hire Its Talent From? |
| `subtitle` | string | Max 105 characters, single line, no wrap. Must contain three things: population size, the grouping rule, and a date. Drop any of the three and the chart loses its denominator. | Based on 74 OpenRouter employees, grouped by the company they worked at before joining, July 2026 |
| `items` | list<{label,value,hex}> | 5 to 8 items, pre-sorted descending by value. Below 5 the plot band (38-83%) leaves bars absurdly thick; above 8 the bars fall under ~55px at 1350 height, the identity chips start to collide vertically, and the legend row wraps to two lines and eats the gap band. Top value must be >= 1.4x the second value or the staircase dies at thumbnail size. Ties are allowed and expected (this image has two). | [{OpenSea, 9, #0385FF}, {Grove Collaborative, 6, #033B4C}, {Google, 5, #3AAC56}, {Amazon, 5, #FE9A04}, {Paddle, 4, #FFD401}, {IBM, 3, #2375C6}, {Notion, 3, #020205}] |
| `items[].label` | string | Max 20 characters (longest here, "Grove Collaborative", is 19 and fills its legend chip). Appears twice: in the legend row and next to the bar end. | Grove Collaborative |
| `items[].value` | integer | 1-3 digits. Rendered inside the bar right end, so a bar shorter than ~9% of track width cannot hold a 2-digit numeral and the label must flip outside the bar. | 9 |
| `items[].hex` | hex | One per item, saturated, taken from the real entity's brand. No two adjacent rows may share a hue family; the two blues here (#0385FF, #2375C6) only survive because they sit 5 rows apart. Any fill lighter than ~55% relative luminance forces the value numeral to #020205 instead of white. | #0385FF |
| `axis_max` | integer | Must exceed max(values) by at least 10% of the track so the top bar never touches the right edge and its identity chip has room. Round to a value divisible by the tick count. Here max value 9, axis_max 10. | 10 |
| `axis_ticks` | list<string> | 5 or 6 labels including 0, evenly spaced. Rendered bold at body size. More than 6 and the gridlines start reading as texture behind the bars. | 0 \| 2 \| 4 \| 6 \| 8 \| 10 |
| `source_credit` | string | Max 24 characters after the fixed prefix "Data from:". One line, centered, body size. Names who owns the data, not who made the graphic. | Crustdata |
| `show_legend` | enum | true \| false. Set false whenever the bar-end labels are text rather than logos, otherwise every row is stated three times (legend, chip, value) and the 34-38% band is spent on nothing. | true (justified in the source only because the bar-end marks are logos, not names) |

### Design-tell audit against PRD §10

**Violates (2).**

- "everything centered" — the headline, subtitle, legend row and footer are all centered on the same axis, four stacked centered blocks. The creator got away with it, and the reason is instructive rather than lucky: the plot area beneath is aggressively left-anchored and right-ragged (bars share a left origin, right ends stagger from 86% down to 26%), so the page as a whole is not axial. The centered header reads as a masthead sitting on top of an asymmetric graphic. Copy the centering without the asymmetric chart underneath and the tell bites.
- "purple-to-blue gradients" — soft violation. The ground is a lavender vignette from near-white to #D8D8F1 on a #F1F0FE base, which is the same family as the tell, just desaturated to the point of near-invisibility and used as a field rather than a feature. It contributes zero information and could be a flat #F1F0FE with nothing lost, so the rule is not wrong here; the execution is quiet enough to escape it.

**Avoids (7).**

- Three equal cards in a row — no cards at all.
- Default Inter/Poppins with no adjustment for display type: the headline is a heavy grotesque with visibly tightened tracking. Inter-class type is confined to the subtitle where it belongs.
- Drop shadows — zero shadows on any element, including the bars and the logos.
- Generic decorative icon sets — every mark on the page is either data, type, or a real brand logo doing identification work.
- Emoji standing in for icons — none.
- A title-only slide with no information — this is a single frame that carries headline, method, data and source together.
- Eyebrows — no kicker, no category tag, no "INSIGHT" label above the headline.

**New tells this image implies, not currently on the list (5).**

- Redundant legend. Seven legend chips at 34-38% restate names that already appear beside every bar. It costs a full horizontal band and dies completely at thumbnail size. New rule: a legend is only earned when the series identity is NOT printed on the mark itself.
- White numeral on a light fill. The "4" is white on #FFD401 and the "5" is white on #3AAC56 — both are under 3:1 and the yellow one is effectively unreadable. New rule: reversed value labels must be luminance-switched per fill, never set globally to white.
- Silent long tail. The seven bars sum to 35 of a stated 74, so more than half the population is unrepresented with no "other" bar and no note. New rule: when a stated n exceeds the sum of plotted values, either add the remainder explicitly or say "top 7 of n".
- Identity delegated entirely to third-party assets. There is no category axis; if a logo is missing, unrecognized, or renders badly, the row becomes anonymous. New rule: any row's label must be readable as text at final size even when a logo is present.
- Landscape in a portrait feed. At 1.311 this occupies materially less vertical scroll area than a 4:5 frame, trading stopping power for bar-length resolution. New rule: only go landscape when the encoding is length-critical, and never for text-led layouts.

### Failure modes when copied badly

- Flat data. Values like 5/5/4/4/4/3/3 produce a staircase with no step — the silhouette that carries the whole thumbnail read goes flat and the headline's question has no visible answer. The form demands a dominant #1.
- Too many rows. Push past 8 and bars drop under ~55px at 1350 height, identity chips overlap vertically, the legend wraps to two lines and consumes the 28-34% rest band, and the page goes from one staircase to a striped mat.
- Bar touching the right edge. Set axis_max equal to the top value and the #1 bar runs to the content edge with nowhere for its identity chip, which then either overlaps the bar or pushes outside the margin.
- White-on-light value labels. Any fill above ~55% luminance (yellows, mid-greens, light oranges) makes the reversed numeral vanish. The source image already fails this on the yellow row; a copy with three light fills fails on three rows.
- Long labels with the legend left on. Two or three 20-character names in a 7-chip legend row force a wrap, and the wrapped legend collides with the first bar.
- Triple-stated rows. Replacing logos with text chips while keeping show_legend true means each entity is named twice and quantified once in the same horizontal line — the row reads as clutter and the reader's eye stops scanning.
- Subtitle without a denominator. Dropping the n or the grouping rule turns seven integers into unverifiable claims, and the footer credit ends up certifying nothing.
- Unsourced counts. This form's only defense is that the numbers are checkable; ship it with invented counts against a real, named organization and the first person in that niche who counts for themselves destroys it.
- Portrait recrop. Forcing the layout to 4:5 without reducing the row count halves the effective bar length, so a 9-vs-6 gap that reads as decisive in landscape reads as a nudge.
- Two same-family hues on adjacent rows. Brand-dictated palettes routinely collide (two blues, two greens); adjacent near-identical fills make the legend the only way to tell rows apart, and the legend is illegible at feed size.

### Topic fit

- **Fits when.** One entity, one countable metric, and a set of 5-8 named organizations or products that the audience already recognizes on sight — so that borrowed brand color and logo do the labeling work. It is right when the interesting content is the membership and order of the list, not the magnitude of the numbers (the numbers here are 3 to 9 and that is fine, because the surprise is that Grove Collaborative outranks Google). Also right when the creator owns the underlying data and wants the chart to advertise that ownership.
- **Breaks when.** The categories are abstract concepts, internal process steps, or unbranded groupings — the identity chips then carry no recognition value, the palette becomes arbitrary decoration, and a plain labeled bar chart does the same job with less machinery. It also breaks on time series (bars imply comparison across peers, not sequence), on part-to-whole where the omitted tail matters, on 2+ metrics per category (this form has one bar per row and no room for a second), on more than ~8 categories, and on flat distributions where no row dominates.
- **Input signature that should trigger selecting it.** Trigger this archetype when the raw material is: a count aggregated over one categorical dimension, 5 to 8 categories after truncation, every category name being a recognizable brand or organization, top value >= 1.4x the second value, a stated total population, and a named data source. If any of {recognizable brands, dominant #1, stated n} is missing, pick a different form.

<details>
<summary>All visible text, in reading order</summary>

Where Does | openrouter | Hire Its Talent From? | Based on 74 OpenRouter employees, grouped by the company they worked at before joining, July 2026 | OpenSea | Grove Collaborative | Google | Amazon | Paddle | IBM | Notion | 9 | OpenSea | 6 | Grove | COLLABORATIVE | 5 | Google | 5 | amazon | 4 | paddle | 3 | IBM | 3 | Notion | 0 | 2 | 4 | 6 | 8 | 10 | Data from: | Crustdata

</details>

---

## 4. fixed-track share leaderboard
**File:** `CrustData/1785766430320.jpeg` · **Creator:** CrustData

A ranked list of ten companies where each row is a same-length two-color pill showing what share of that company's sales team came from one specific former employer, with the exact percentage printed at the right.

**Information job.** "Across all the places this one thing shows up, who has the most of it, and how much is 'the most' in absolute terms?" It answers a ranking question and a magnitude question at once, where the magnitude is a share of a whole rather than a raw count.

### Where the idea came from

**Likely origin.** Proprietary dataset they own. Crustdata sells employment-graph data and this image is a query result: prior-employer counts joined to verified GTM headcount per company. It exists to prove the query is possible at all.

**Evidence in the image.** The subtitle states a method rather than a fact ('measured against its verified go-to-market headcount'); 'verified' is a vendor claim about data quality. The footer reads 'Data from:' plus the vendor wordmark instead of a public source. Values carry one decimal (18.1%, 6.7%), implying row-level computation. The row set mixes AI labs, data infra and sales-tech vendors, i.e. a filter over a company list rather than a curated story.

**The generative question, portable to any niche.** Pick one origin (a company, a school, a certification, a tool, a prior role) and one population you can count (a team, an industry, a cohort). Across 8-11 named organizations, what percentage of that population came from that single origin, ranked high to low? The chart is the ranking; the headline names the origin as an institution that manufactures people.

### Headline and subtitle

> The Salesforce Talent Factory

- **Words:** 4
- **Form:** Bare noun-phrase label with a metaphor as the operative word ('Factory'). No verb, no number, no punctuation. Single line, near-black #17161E, heaviest weight on the page, tracking visibly tightened, centered, spanning 88% of the canvas width.
- **Promise:** A named institution is quietly staffing the industry, and you are about to see the receipts for exactly who it staffed.
- **Subtitle:** "Number of ex-Salesforce sellers in each company's sales & GTM team, measured against its verified go-to-market headcount."
- **What the subtitle does that the headline cannot:** Supplies the denominator and the unit that the headline metaphor omits. It defines what the percentage is a percentage OF ('measured against its verified go-to-market headcount'), and its one bolded near-black span, 'ex-Salesforce sellers', names the numerator. Without it every number on the page is unfalsifiable.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 0-6% | Top gutter | Dead space before the headline; keeps the title off the feed crop edge. | Empty. Band 0 ink = 0. |
| 6-12% | Headline | Naming hook. | 'The Salesforce Talent Factory', one centered line. Bands 1-2 ink 24/16. |
| 13-19% | Subtitle / method line | Defines numerator, denominator and unit. | Two centered lines in muted violet with one bold near-black span. Band 3 ink drops to 7 as the second line is shorter. |
| 21-23.5% | Column header strip | Labels the value column once so no row has to repeat the unit. | 'ex-Salesforce', small, right-aligned over the value column at x 80-92%. Band 4 ink 4. |
| 24-84% | Row stack | The ranking itself. | 10 rows on a 92px pitch (6.0% of height each): logo card at x 8.6-14.3%, name at x 15.5%, pill track at x 39.3-77.1%, value right-aligned to x 92.4%. Bands 5-16 ink 32,35,32,27,25,27,34,37,31,26,26,25. |
| 84-92% | Bottom gutter | Isolates the attribution so it cannot read as an eleventh row. | Empty. Band 17 ink = 0. |
| 93-98% | Source footer | Provenance. | 'Data from:' plus the Crustdata mark and wordmark, centered. Bands 18-19 ink 2/4. |

### Reusable skeleton

```
+----------------------------------------------+
|                  (empty 6%)                  |
|          H E A D L I N E   (1 line)          |
|      subtitle line 1 with **bold span**      |
|            subtitle line 2 (shorter)         |
|                                              |
|                            [value col label] |
|  [ico] Name    [======TRACK=====|###]  18.1% |
|  [ico] Name    [======TRACK====|####]  15.5% |
|  [ico] Name    [=====TRACK=====|####]  14.5% |
|  [ico] Name    [======TRACK====|###]   12.3% |
|  [ico] Name    [======TRACK====|###]   10.9% |
|  [ico] Name    [======TRACK====|###]    9.9% |
|  [ico] Name    [=======TRACK===|##]     8.2% |
|  [ico] Name    [=======TRACK===|##]     8.2% |
|  [ico] Name    [=======TRACK===|##]     6.7% |
|  [ico] Name    [=======TRACK===|##]     4.1% |
|                                              |
|                  (empty 8%)                  |
|            Data from: [logo] Brand           |
+----------------------------------------------+
cols: 7.4 | icon 8.6-14.3 | name 15.5 | track 39.3-77.1 | value ->92.4
```

### Type system

- **Families.** One family throughout: a tight geometric grotesque. Guess: Inter Tight or Helvetica Now Display at display size; the tight apertures and the flat-terminal 'y' in 'Factory' rule out Poppins. Numerals are lining, near-tabular width. No serif, no mono, no second family.

- **Headline : body.** Headline cap-height ~62px vs row-label cap ~24px vs subtitle cap ~19px, so headline ~2.6x row label and ~3.3x subtitle. Value numerals ~34px cap, ~1.4x the row label.

- **Weights.** Three: ExtraBold/Black for the headline, Bold for row names, values, the subtitle's one highlighted span and 'Data from:', Medium/SemiBold for the subtitle body, the column header and the in-bar 'OTHERS'.

- **Case.** Title case headline, sentence case subtitle, brand-native case for row names (OpenAI, HubSpot), ALL CAPS with wide letterspacing only for the in-bar 'OTHERS' label at ~13px.

- **Typographic moves.** One bold near-black span inside an otherwise muted violet subtitle acts as an inline highlighter with no background fill. Tracking is negative on the headline and strongly positive on the tiny caps label. Values are right-aligned so decimal points stack. The value column header sits above the column like a table head with no rule.

- **Hard line limits.** Headline must fit one line (29 characters here at 88% width). Subtitle runs exactly 2 lines, second shorter than first, 120 characters total. Longest row label 'Databricks' = 10 characters. In-bar label 6 characters.

### Color logic

- **Roles.** Page bg #EFEDF9 (flat lavender, near-white). Primary ink / headline / row names / values #0E0D14-#23212C family (measured #17161E on the headline, #16141F on the values). Accent, and the single largest ink block, #6B63D9 at 56% of all non-bg pixels: it fills the 'OTHERS' remainder of every pill and also colors the subtitle body text in a lighter mix (measured ~#8886AE where thin strokes blend to bg). #6B62E3 / #6B64BC / #7267D4 at 1-2% each are JPEG compression variants of that same purple, not separate hues. Muted #D4D1E9 at 2% is the lightest tint, used for the column header and the soft edges of the white logo cards. The measured subject segment is #0E0D13, the darkest value on the page. Logo cards are near-white on the lavender ground.
- **Distinct hues.** 2
- **Does color mean anything.** Load-bearing. Near-black = the subject being measured (ex-Salesforce share), purple = everything else ('OTHERS'). The subject is deliberately the darkest, highest-contrast element so the eye reads the black tips as the data. The row logo marks import third-party brand colors (red, orange, cyan, maroon) but only inside 70px white cards, which quarantines them from the two-hue system.
- **Accent discipline.** Inverted from the usual rule: the accent is not sparing, it is the ground of the data layer at 56% of ink, and the SCARCE color is the near-black subject segment at roughly 8% of ink. Scarcity still does the work, just assigned to black instead of to the brand hue. Outside the pills the accent appears only twice: subtitle body text and the footer mark.

### Data dependency

- **Needs external data.** yes
- **What would have to be true.** For each of 10 named companies: a count of current GTM employees whose employment history includes one specific prior employer, divided by a verified count of that company's total GTM headcount, expressed to one decimal place. Ten ordered percentages ranging 4.1-18.1, plus the ten company identities and their logos.
- **Provenance shown on the image.** Footer, centered, bottom 5% of canvas: 'Data from:' in bold near-black followed by the Crustdata diamond mark and wordmark. No date, no sample size, no methodology link. The word 'verified' inside the subtitle is the only other credibility signal.
- **Fabrication risk.** High and effectively invisible. One-decimal percentages against an unnamed headcount base cannot be checked by any reader, and a fabricated set would look identical: nothing on the image discloses n, the date, or the query. The only visible tell would be an implausible ordering (e.g. a company known to be tiny topping the list). An AI recreating this class without data would invent both the percentages and the ranking, and the one-decimal precision would make the invention look more authoritative than a rounded number would.

### Attribution

"Data from:" set in bold near-black, followed by the Crustdata diamond glyph and the "Crustdata" wordmark at roughly row-label size, centered on the bottom axis at 93-98% height, isolated by an 8% empty band. No headshot, no handle, no follow or repost prompt, no URL. It reads as a source citation attached to the data, not as a signature on the design and not as a CTA. The vendor's brand purple is the same #6B63D9 that fills every bar, so the sponsorship is asserted by the palette rather than by the footer.

### Density

- **Words:** 55 · **Discrete elements:** 13 · **Words per element:** 4.2 words per element (55 words / 13 units: 10 data rows + headline block + column header + footer)
- **Whitespace read.** Measured ink is 20.8%, which is mid-range, yet the page reads as sparse because 56% of that ink is one flat purple fill repeated in ten identical pills. It is one shape ten times, not detail. Reinforcing this: 33px of empty gutter between 59px-tall bars on a 92px pitch, a full empty band at 84-92%, and only 55 words on a 1228x1536 canvas. Density is high in pixel terms and low in decision terms, because the reader parses one row and then only tracks the black tip.

### Thumbnail test at 220px: **PASS**

- **Survives.** The headline is fully legible at 220px. All ten percentage values are readable (18.1% down to 4.1%). Row names are readable, though 'Databricks' and 'Snowflake' are at the edge of resolution. The staircase of black tips descending left-to-right down the right edge of the bars is the clearest signal in the thumbnail and communicates 'ranked, declining' without any text. The two-color split of each pill is unmistakable. The logo column reads as ten distinct colored chips even where the marks themselves are unresolvable.
- **Dies.** The 'OTHERS' caps label inside every bar is a gray smear at 220px, so 10 of 55 words are lost outright. The entire two-line subtitle is illegible, which means the denominator and the method vanish at feed size. The 'ex-Salesforce' column header above the values is gone. The Salesforce cloud glyph inside the top three black segments is a blue speck. 'Data from: Crustdata' is only inferable from the purple mark, not readable.
- **Rule this proves.** Everything that must survive scrolling is carried by three things: the headline, the right-hand numeral column, and the black-tip staircase. Any recreation must put the ranking claim in the headline and the values in a large right-aligned numeral column, and must accept that in-bar labels, subtitles and column headers are decoration at feed size. Corollary: never let the in-bar label carry information that is not repeated elsewhere.

### Why it works, and what breaks without it

- **Every bar track is the identical fixed length (measured x 482-947px, 465px, on all ten rows), so the only thing that varies is where the black segment starts. The eye compares ten tip positions on a shared baseline instead of ten bar lengths.**
  Without it: With variable-length bars the shared left edge stops meaning anything and the ranking has to be read from the numerals; the descending staircase that survives the 220px thumbnail disappears entirely.
- **A dedicated right-aligned numeral column at 1.4x the row-label size, carrying the exact value to one decimal.**
  Without it: The bar encoding alone is a lie at the low end: 4.1% is drawn as a 37px segment on a 465px track, i.e. 8%, because the pill's rounded end cap enforces a minimum width. Sierra at 18.1% draws honestly at 18.3%. Remove the numerals and the bottom four rows become visually indistinguishable and overstated.
- **Role inversion of the palette: the accent #6B63D9 is the background of the data layer at 56% of ink and the near-black #0E0D14 is the measured subject at roughly 8%. The subject is the darkest, scarcest, highest-contrast thing on a lavender ground.**
  Without it: Swap the roles and the brand purple becomes the signal while black becomes a field; the eye then reads the long purple runs as the data, which is the complement of the intended value, and the ranking inverts perceptually.
- **Headline is a metaphor label with zero numbers ('The Salesforce Talent Factory') while the subtitle carries the full method sentence including the denominator.**
  Without it: If the headline stated a metric it would compete with the value column for the same reading job and lose at thumbnail size. If the subtitle were dropped, the percentages have no denominator and the chart makes an unfalsifiable claim.
- **A 70px white rounded card holding a brand mark opens every row at a constant x, giving a non-textual entry point per row.**
  Without it: At 220px the 9-10 character company names blur; the colored chips are what keeps the rows individuated. Remove the column and the left 7% of each row is empty and each row degrades to a single text line, so the reader must decode type to navigate.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- Ten third-party company logos as vector brand marks (Sierra, Anthropic, Databricks, Snowflake, OpenAI, Outreach, HubSpot, Gong, Salesloft, Rippling). No icon library, no external assets, and hand-authoring ten accurate brand SVGs is not reproducible per-topic.
- The Salesforce cloud glyph rendered inside the black segment on the top three rows only.
- The Crustdata diamond mark in the footer.

**Honest substitutes.**

- Replace the logo column with a 70px white rounded card containing the entity's first letter or two-letter monogram in a per-row hue, at ~28px Bold. This keeps the information job (a non-textual, color-coded row handle that survives 220px) and keeps the constant left column. It loses brand recognition, which for a leaderboard of named entities is a real loss but not a fatal one because the name is printed 8px to its right.
- Drop the in-bar glyph entirely. It appears on only 3 of 10 rows (wherever the segment is wide enough), which already reads as inconsistent; the column header already labels what the black segment means.
- Footer mark: substitute a CSS-drawn shape (a rotated square with a border, or a single letterform in a rounded tile) plus the wordmark as live type, or drop the mark and set the brand name in bold.

**Implementation notes.** One CSS grid, grid-template-columns: 70px 1fr 465px 130px with align-items:center and row-gap 33px, ten rows. The pill: a track div, height 59px, border-radius 999px, background var(--accent), overflow:hidden, display:flex, justify-content:flex-end; inside it a black div with width: calc(var(--pct) * 1%) and no radius of its own, so the track's overflow clip supplies the rounded right cap and the left edge stays square. This exactly reproduces the observed geometry. The centered 'OTHERS' caps label is a span absolutely positioned at 50% of the track with letter-spacing:0.12em, z-index above the fill but below nothing else. Guard the low end explicitly: min-width on the black div is what created the 8%-floor distortion in the original, so either set no min-width and accept a 19px sliver, or keep the floor and treat the numeral column as the authority. Values use font-variant-numeric: tabular-nums and text-align:right. The subtitle's bold span is a plain <strong> with color:#17161E inside a paragraph colored in the muted violet. Logo cards: background #FFF, border-radius 18px, box-shadow 0 2px 6px rgba(14,13,20,.06). Background is a flat #EFEDF9 on body. No gradients anywhere, nothing to fake.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline` | string | 3-5 words, 22-34 characters. Must fit one line at ~62px cap height across 88% of a 1080px canvas. No digits, no colon, no trailing punctuation. | The Salesforce Talent Factory |
| `subtitle` | string | 100-140 characters, must wrap to exactly 2 centered lines with the second line shorter. Must name both the numerator and the denominator. | Number of ex-Salesforce sellers in each company's sales & GTM team, measured against its verified go-to-market headcount. |
| `subtitle_bold_span` | string | 2-4 words, max 24 characters, must be a verbatim substring of subtitle, must be the numerator phrase. | ex-Salesforce sellers |
| `value_column_label` | string | 1-2 words, max 16 characters. Sits right-aligned above the value column. Should restate the numerator, not the unit. | ex-Salesforce |
| `remainder_label` | string | One word, 4-8 characters, rendered ALL CAPS with wide tracking inside every bar. Must be generic, since it repeats on every row and is illegible at thumbnail size. | OTHERS |
| `rows` | list<{label, value_pct, mono, hue}> | 8 to 11 items, sorted strictly descending by value_pct. Below 8 the 92px pitch leaves an unbalanced bottom gutter; above 11 the row label must drop below the 220px legibility floor. Ties are permitted but must be adjacent. | [{Sierra,18.1},{Anthropic,15.5},{Databricks,14.5},{Snowflake,12.3},{OpenAI,10.9},{Outreach,9.9},{HubSpot,8.2},{Gong,8.2},{Salesloft,6.7},{Rippling,4.1}] |
| `row.label` | string | Max 11 characters, one word preferred. Longest observed is 'Databricks' at 10. Preserve brand-native casing. | Databricks |
| `row.value_pct` | string | Number with exactly one decimal plus '%', 4-5 glyphs. Range should span at least 3x from top to bottom (18.1 vs 4.1 here) or the staircase flattens. Max value must be under ~45% or the black segment swallows the remainder label. | 18.1% |
| `row.mono` | string | 1-2 characters, the monogram substituted for a real logo. Uppercase. | S (for Sierra) |
| `row.hue` | hex | One hex per row for the monogram glyph only. Confined to the 70px white card; never appears on the bar. | #E8532B (Databricks red) |
| `accent_hex` | hex | One hue. Must be mid-dark enough to hold white caps text at 13px and light enough to be clearly distinct from the near-black subject segment. | #6B63D9 |
| `subject_hex` | hex | The darkest value on the page; used for the measured segment AND for the headline, row names and values. | #0E0D14 |
| `bg_hex` | hex | A near-white tint of accent_hex. Must stay above ~92% lightness so the white logo cards remain distinguishable from it. | #EFEDF9 |
| `source_prefix` | string | Max 12 characters, bold, precedes the brand name in the footer. | Data from: |
| `source_name` | string | Max 16 characters. Rendered at row-label size. | Crustdata |

### Design-tell audit against PRD §10

**Violates (2).**

- 'everything centered' - the headline, subtitle and footer are all center-aligned on the same axis while the entire data layer is a left-anchored grid. The rule is right in general but the creator got away with it here: the centered block is only 3 of 13 elements and it sits above a strongly gridded body, so the centering reads as a masthead rather than as a default. If the rows were also centered it would collapse.
- 'default Inter or Poppins with no adjustment' - partially. The family is a stock grotesque, plausibly Inter Tight, but it is adjusted: negative tracking on the headline, positive tracking on the caps label, three weights, tabular figures. The rule targets unadjusted defaults, and this is adjusted, so the tell does not land.

**Avoids (7).**

- No purple-to-blue gradient; the background is a flat #EFEDF9 and the bar fill is a flat #6B63D9 with zero gradient anywhere.
- No three-equal-cards row.
- No drop shadows on every element; the only shadow is a faint one under the 70px logo cards, and the bars, text and footer are shadowless.
- No decorative icons; every mark on the page is either a brand identity in the row column or the source mark in the footer, both informational.
- No emoji.
- No eyebrow label above the headline; the headline is the first ink on the page.
- No title-only slide; this is a single image carrying its full payload.

**New tells this image implies, not currently on the list (5).**

- A rounded-cap fixed-track bar silently inflates small values: 4.1% draws at 8% of the track because the pill radius sets a minimum segment width. Gate rule: if the value range dips below ~10% of the track, either square the segment cap or declare the numeral column authoritative and never let the bar be read alone.
- A per-row label repeated identically on every row ('OTHERS' x10) is 10 words of zero information that also die at thumbnail size. Gate rule: a label that is the same on every row belongs in the column header or a one-time legend, not inside every shape.
- A decorative glyph that only fits on some rows (the Salesforce cloud appears in 3 of 10 black segments) reads as a rendering bug, not as a design choice. Gate rule: any in-element ornament must either fit the smallest instance or appear on none.
- Third-party brand logos as the row handle make the template non-reusable in a no-asset renderer. Gate rule: design the row handle as a monogram tile from the start, so the same template works whether or not real marks are available.
- Ties displayed without a tiebreak (HubSpot 8.2% and Gong 8.2%) look like duplicated data unless the rows are visually distinguished. Gate rule: with ties, sort the tied group alphabetically so the ordering is defensible.

### Failure modes when copied badly

- The value range is too narrow (say 11.2% to 9.8%): all ten black tips land within a few pixels of each other, the staircase vanishes, and the chart becomes ten identical pills with a numeral column doing all the work.
- A value exceeds roughly 45%: the black segment reaches the centered remainder label and either overprints it or pushes it into the shrinking purple half, breaking every row's shared label position.
- Low values with a rounded-cap minimum width: every value under about 8% renders as the same sliver, so the bottom of the leaderboard is drawn as a tie when it isn't.
- Row labels over 11 characters collide with the track's left edge at x 39.3%, forcing a font-size drop that puts the names below the 220px legibility floor.
- Monogram substitution applied to ten rows with no per-row hue: a column of ten identical gray tiles occupying 6% of the width and encoding nothing, which is worse than deleting the column.
- The subtitle runs to three lines: the row stack starts lower, the last row eats the 84-92% empty band, and the footer stops reading as separate from the data.
- Rows not sorted descending: the entire visual argument disappears, because a fixed-track chart with a shuffled order gives the eye nothing to follow.
- More than 11 rows: the pitch drops below 92px, the 33px gutters close, and the ten pills merge into a striped block.

### Topic fit

- **Fits when.** You have one origin/attribute and a set of named entities, and the metric is a SHARE of each entity's own total, not a raw count. Works best when the shares span at least 3x from top to bottom, all sit under ~45%, and the entity names are short and recognizable enough to matter without explanation. Also fits penetration rates, adoption rates, composition percentages, and any 'what fraction of X is Y' question.
- **Breaks when.** The metric is a raw count with orders-of-magnitude spread (the fixed track destroys the comparison, since every row is normalized to 100%). When shares exceed ~50% the two-color pill stops reading as 'subject inside a whole'. When entities are unfamiliar, because the row labels carry no explanation and there is no room for one. When there are more than two categories per row, since the design has exactly one split point. When the values are close together, since the fixed track's whole advantage is tip-position comparison.
- **Input signature that should trigger selecting it.** 8-11 named entities, each with exactly one percentage in the range roughly 3-45%, where all percentages are shares of that same entity's own denominator, the top value is at least 3x the bottom, and the list can be sorted descending. Plus a single sentence that states what the numerator and denominator are.

<details>
<summary>All visible text, in reading order</summary>

The Salesforce Talent Factory | Number of ex-Salesforce sellers in each company's sales & GTM team, measured against its verified go-to-market headcount. | ex-Salesforce | Sierra | OTHERS | 18.1% | Anthropic | OTHERS | 15.5% | Databricks | OTHERS | 14.5% | Snowflake | OTHERS | 12.3% | OpenAI | OTHERS | 10.9% | Outreach | OTHERS | 9.9% | HubSpot | OTHERS | 8.2% | Gong | OTHERS | 8.2% | Salesloft | OTHERS | 6.7% | Rippling | OTHERS | 4.1% | Data from: Crustdata

</details>

---

## 5. term-to-analogy translation rows
**File:** `Johnny Tooze/1785761247307.jpeg` · **Creator:** Johnny Tooze

A full-bleed poster that decodes four confusable jargon terms by giving each one its own horizontal row: a human-body analogy sketch on the left, the term plus a lime "equals" pill and two one-line bullets in the middle, an arrow, and the literal technical object with a boxed caption on the right.

**Information job.** "These four terms get used interchangeably around me and I cannot tell them apart. Give me one mental image per term that I could repeat out loud to my boss." It answers both "what is each one" and "how do they differ", because the four rows share an identical slot order so every difference lands in the same x-position.

### Where the idea came from

**Likely origin.** A term everyone uses wrong — specifically a recurring explaining-to-executives problem the creator has repeatedly, stated outright in the subtitle.

**Evidence in the image.** The subtitle names the audience and the constraint verbatim: "How to Explain AI Systems to Leaders in simple words". The equations are all phrased as additions to one base unit ("= Brain", "= Brain + Books", "= Brain + Hands"), which is the shape of an explanation refined by repetition in front of a live audience, not the shape of a dataset. There is no number, no date, and no source line anywhere on the canvas — nothing here came from research.

**The generative question, portable to any niche.** Pick 4 terms in your field that outsiders swap for one another. For each, write one everyday physical analogy of 3 words or fewer, built so the analogies stack on one shared base object (X, X + Y, X + Z). Give each term exactly 2 one-line bullets: what it does, then what it is. Show the everyday analogy on the left and the real thing on the right.

### Headline and subtitle

> AI ACRONYMS ANALOGY

- **Words:** 3
- **Form:** Bare label — noun phrase, no verb, no claim. Typographic emphasis does the work: "AI ACRONYMS" sits on a lime highlighter block (#D4F24F) running x~4.5% to x~58%, "ANALOGY" sits on the bare #F8F8EE page. Ultra-condensed heavy all-caps, edge-to-edge with ~4% side padding, letter-spacing near zero so the letters physically touch the marker edges.
- **Promise:** You will leave with a one-image translation table you can reuse in conversation. The unhighlighted word "ANALOGY" is the actual promise — not definitions, comparisons.
- **Subtitle:** "How to Explain AI Systems to Leaders in simple words"
- **What the subtitle does that the headline cannot:** Names the audience ("Leaders") and the use case ("Explain", "in simple words") — the scoping the three-word headline cannot carry. It converts a label into a job to be done and pre-excuses the technical imprecision of the analogies.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 2-11% | Full-bleed headline with partial highlighter | Stop the scroll with one legible word-block; the two-tone split separates subject from treatment | "AI ACRONYMS" on a #D4F24F marker block + "ANALOGY" unmarked, one line, cap height ~90px. Bands 1-2 measure 40 then 74, the densest content bands on the page. |
| 11-15% | Italic subtitle line | Scope audience and promise; the drop to bands 13 and 11 is the breathing gap that lets the headline read as a single mass | "How to Explain AI Systems to Leaders in simple words", bold italic, one line, centered |
| 15-36% | Row 1 (three-column analogy row) | Establish the row grammar: human analogy -> term + equation + 2 bullets -> literal object | left: head with lime brain and radiating spark lines; middle: "LLM" + pill "= Brain" + bullets "Text generation by reasoning", "Core Intelligence"; curved arrow; right: brain-on-a-chip sketch + boxed caption "LLM". Bands 24, 20, 8, 9 — term line loaded, tail empty, hairline at ~36%. |
| 36-57% | Row 2 | Show the analogy stacking (base plus one thing), which is what makes four rows a system rather than four cards | left: person reading a green book; middle: "RAG" + pill "= Brain + Books" + "LLM + external knowledge", "Uses docs & databases"; arrow; right: brain on a stack of books + boxed caption "RAG". Bands 38, 27, 22, 9. |
| 57-77% | Row 3 | Second stacking step; the only two-word term, proving the term slot tolerates a phrase | left: person with both hands raised; middle: "AI Agent" + pill "= Brain + Hands" + "Takes actions", "Uses memory & tools"; arrow; right: phone with robot grabber arms + boxed caption "AI Agent". Bands 33, 16, 13, 10. |
| 77-95% | Row 4 | Terminal row — the widest pill and the most abstract analogy go last, after the reader trusts the pattern | left: full-body nervous system in lime; middle: "MCP" + pill "= Nervous System" + "Connects everything", "Connecting foundation layer"; arrow; right: server racks joined by a lime node graph + boxed caption "MCP". Bands 40, 25, 14. |
| 95-100% | Dark full-bleed footer CTA bar | Attribution and two explicit asks, quarantined in a different color family so it cannot be misread as a fifth row | #111425 bar, band 20 ink density 90: "Useful? Follow" + circular headshot + "Jonny Tooze" \| repost glyph + "Repost to your network" |

### Reusable skeleton

```
+==========================================================+ 0%
| ##HIGHLIGHT WORDS## PLAIN WORD     (full-bleed caps, 1ln) |
|      bold italic subtitle, one line, centered             | 15%
+----------------------------------------------------------+
|  [ANALOGY ]   TERM 1 [= equation pill]  --arrow-->  [OBJ ]|
|  [ SKETCH ]     * bullet one                        [SKCH]|
|  [  left  ]     * bullet two                        [TERM]| 36%
+--------------------- hairline ----------------------------+
|  [ANALOGY ]   TERM 2 [= equation pill]  --arrow-->  [OBJ ]|
|  [ SKETCH ]     * bullet one                        [SKCH]|
|  [  left  ]     * bullet two                        [TERM]| 57%
+--------------------- hairline ----------------------------+
|  [ANALOGY ]   TERM 3 [= equation pill]  --arrow-->  [OBJ ]|
|  [ SKETCH ]     * bullet one                        [SKCH]|
|  [  left  ]     * bullet two                        [TERM]| 77%
+--------------------- hairline ----------------------------+
|  [ANALOGY ]   TERM 4 [= equation pill]  --arrow-->  [OBJ ]|
|  [ SKETCH ]     * bullet one                        [SKCH]|
|  [  left  ]     * bullet two                        [TERM]| 95%
+==========================================================+
|## Useful? Follow (o) NAME   |  (icon) Repost to network ##|
+==========================================================+ 100%
columns:  x 4-26%    |     x 29-70%        |    x 72-97%
```

### Type system

- **Families.** Three. (1) Headline: ultra-condensed heavy grotesque, all caps, flat terminals, near-zero sidebearings — my guess is Anton (Google Fonts), possibly Archivo Black condensed; a guess. (2) Terms, bullets, captions: humanist/geometric sans at bold-to-extrabold, double-storey g, tall x-height — my guess is Nunito Sans or a Museo Sans Rounded ExtraBold; a guess. (3) Subtitle: the same body family in bold italic. No serif, no mono anywhere.

- **Headline : body.** headline ~3.4x body (headline cap height ~90px, bullet cap height ~26px). Terms sit between at ~2.1x body; equation pill text ~1.1x body; boxed right-hand caption ~1.0x body; footer ~1.0x body.

- **Weights.** Headline black/ultra. Terms extrabold. Bullets bold. Pill text bold. Subtitle bold italic. Footer regular for connective words, bold for "Jonny Tooze" and "Repost". No light or regular weight appears in the content area at all — that is why 26.8% ink still reads as type rather than texture.

- **Case.** Headline all caps. Everything else sentence case, including bullets ("Text generation by reasoning", not Title Case). Acronyms keep native caps (LLM, RAG, MCP); the one non-acronym term is title case ("AI Agent"). No all-caps eyebrow, no all-caps labels.

- **Typographic moves.** Highlighter block behind the first two headline words only, sized to the text box rather than the line box so it hugs cap height. Lime pill badges (~8px radius) wrapping each equation, vertically centered on the term baseline. Bold italic used exactly once, for the subtitle, so italic reads as "this line is the caption". Right-hand captions set inside hand-drawn rounded rects so the label reads as a physical tag on the object, not as another text run.

- **Hard line limits.** Headline 1 line, hard. Subtitle 1 line; 52 characters observed and it nearly touches both margins. Term 1 line, longest "AI Agent" (8 chars). Pill 1 line, longest "= Nervous System" (16 chars). Bullets exactly 2 per row, 1 line each, longest "Connecting foundation layer" (27 chars) — a two-line bullet would collide with the next hairline.

### Color logic

- **Roles.** page bg #F8F8EE (warm off-white, not white). primary ink #040403 at 23% of ink — headline, terms, bullets, sketch outlines. footer bar fill #111425 at 14% of ink — a near-black with a blue cast, deliberately different from the text black. accent lime #C9EA7E at 8% — the four equation pills plus the lime fills inside the analogy sketches (brain, book, nerves, graph nodes). higher-chroma accent #D4F24F at 3% — the headline marker block only. pencil-shading greys #D6D6CF 5%, #B9B9B2 4%, #9D9E96 3%, #81817A 3% — 15% of all ink is illustration hatching plus the three hairline dividers, making the drawings the single largest non-text ink consumer. Arrows and bullet dots are a darker olive derived from the lime; that value is not resolved in the measured palette, so I will not name a hex for it.
- **Distinct hues.** 2
- **Does color mean anything.** Semantic and consistent. Lime marks "this is the plain-language translation" and appears in exactly three places: the highlighted headline words, every equation pill, and inside every left-hand analogy sketch. Following only the lime through the image gives you the entire argument. The greys carry no meaning, they are shading. #111425 is a container color, not content.
- **Accent discipline.** Lime is 11% of ink total (8% + 3%), roughly 3% of the canvas. It never fills a row background, never sits behind a bullet, and never appears in the right-hand technical sketches except as node dots. The four pills are the only accent-filled shapes larger than a stroke, and there are exactly four of them.

### Data dependency

- **Needs external data.** no
- **What would have to be true.** None, it is a concept. The only truth claim is that each analogy is a defensible reading of each term, which is editorial judgement rather than data. Nothing here is measurable, so nothing here can be checked.
- **Provenance shown on the image.** No source line, no date, no method, no citation anywhere on the canvas. The only attribution is authorial, in the footer bar: "Useful? Follow" + "Jonny Tooze". The author is the source.
- **Fabrication risk.** Low on numbers, non-trivial on substance. There are no figures to invent, so nothing can be numerically wrong. The failure is a fluent but wrong analogy: a model filling this template will produce mappings practitioners reject, and the form offers no hedge — the pill says "=", not "is roughly like". That error is invisible to the target reader and obvious to an expert, which is the worst combination for a byline. Every generated instance needs its four equations reviewed as a set by someone who knows the domain before publish.

### Attribution

A #111425 full-bleed bar occupying the bottom 5% (band 20, ink density 90, the densest band on the page), carrying two asks separated by a gap. Left: "Useful? Follow" in off-white regular, a ~44px circular photographic headshot, then "Jonny Tooze" in lime bold. Right: a green two-arrow repost glyph, "Repost" in lime bold, "to your network" in off-white regular. Type is ~1.0x body size, subordinate to every content string. This reads as CTA, not signature — imperative used twice, two distinct actions requested, the name set in accent as the click target. No logo, no handle, no URL. Because the bar is a different color family from the entire content area above it, it detaches cleanly and can be swapped without touching the layout.

### Density

- **Words:** 60 · **Discrete elements:** 38 · **Words per element:** 1.6 words per element (60 words across 38 elements: headline, subtitle, 4 rows x 8 parts, 3 hairlines, footer bar)
- **Whitespace read.** 26.8% ink reads as uncrowded because the ink is deliberately clumped. The bands alternate loaded and empty — 40, 74 then 13, 11; 38, 27, 22 then 9; 33, 16, 13 then 10; 40, 25, 14 — so every row's heavy term line is followed by a sub-10 gutter band before its hairline. The illustrations also carry ~15% of total ink as low-contrast grey hatching, which registers as tone rather than as content, so perceived text density is far below the pixel measurement. 60 words on 1080x1350 is a very low word count for this much ink.

### Thumbnail test at 220px: **PASS**

- **Survives.** "AI ACRONYMS ANALOGY" is fully legible at 220px including the highlighter split. All four terms LLM / RAG / AI Agent / MCP are legible. The four lime pills are visible as pills and the short ones read as text ("= Brain", "= Brain + Books", "= Brain + Hands"). The four-row rhythm and the three-column structure are unmistakable. The four left-hand analogy sketches survive as silhouettes — a head, a person reading, a person with hands up, a standing figure — so the analogy sequence is guessable before any body copy is read. Lime is the only color and it reads as four horizontal beats down the page. The dark footer reads as a bar.
- **Dies.** All eight bullet lines are illegible (~5px cap height). The subtitle is illegible, so the audience-scoping is entirely lost at feed size. "= Nervous System" is at the edge of legibility — the longest pill fails first. The four boxed right-hand captions read as empty tags, not words. The right-hand technical sketches turn to grey mush; the chip, the racks and the phone-with-arms are indistinguishable from each other. All footer text is gone, including the name.
- **Rule this proves.** Term, pill, and left silhouette must carry the whole idea; bullets and subtitle are second-read reward nobody sees while scrolling. Concretely: keep the equation under ~14 characters, make the term the second-largest type on the page, and put the shape-legible illustration on the left where the eye lands. If the archetype is rebuilt with the analogy as text only, it loses its second thumbnail signal and becomes a wall of small grey rows.

### Why it works, and what breaks without it

- **A fixed four-slot row grammar repeated verbatim four times: [analogy image][TERM + equation pill][2 bullets] -> [literal object + boxed caption]. Every difference between the terms appears in the same x-position, so comparison is a vertical eye movement with zero re-orientation cost.**
  Without it: Vary the slot order or drop a slot from one row and the reader re-parses each row independently. The image degrades into four unrelated definitions and the comparison job — the actual reason to open it — disappears.
- **The equation pill compresses the whole analogy into under 16 characters and stacks additively on one base unit (Brain, Brain + Books, Brain + Hands). Four items become one item plus three modifiers, which fits in working memory.**
  Without it: Give each row an unrelated analogy ("= a library", "= a switchboard", "= a chef") and nothing accumulates. Retention collapses to whichever row was read last, and the bullets have to carry the differentiation at a size that is invisible in the feed.
- **Left-to-right semantic direction inside each row: everyday human thing on the left, arrow, technical thing on the right, with the arrow drawn short and at roughly the same x in all four rows.**
  Without it: Remove the arrow, or put the technical object on the left, and the two illustrations read as decoration flanking text rather than as a translation. The reader loses track of which side is metaphor and which is referent.
- **Accent lime restricted to translation elements only — headline word cluster, four pills, analogy sketch fills — at roughly 3% of canvas. Everything structural is #040403, grey, or #F8F8EE.**
  Without it: Extend lime to bullet backgrounds or row fills and the four pills stop being findable. The reader loses the scan path that makes this usable in three seconds, and 26.8% ink starts reading as clutter.
- **Full-bleed edge-to-edge headline with a marker block on a warm #F8F8EE ground, with no side margins at all (measured L0 R0, T2.1).**
  Without it: Pad the headline into a card and the cap height must shrink to fit the same three words. At 220px the headline stops being legible — and it is currently the one element that is legible in the feed for certain.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- Eight hand-drawn pencil illustrations with cross-hatched grey shading (#D6D6CF / #B9B9B2 / #9D9E96 / #81817A account for 15% of all ink). These are drawings with variable line weight, overshooting strokes and interior hatching, not icon-set shapes. Not reproducible in CSS or hand-authored SVG at anything near this quality.
- The circular photographic headshot in the footer bar.
- The hand-drawn double-stroke rounded rectangles around the four right-hand captions, and the wobble in the four arrows. The irregularity is the point; a perfect rounded rect reads as a different design language.
- The headline face if it is not Anton. It is an ultra-condensed black grotesque with near-zero sidebearings; Google Fonts offers Anton and Archivo Black, but if the real face is a licensed condensed black the edge-to-edge fit changes and the line may not fill the width.

**Honest substitutes.**

- Illustrations: keep the two-column analogy structure but hand-author inline SVG monoline glyphs, ~2.5px stroke, round caps and joins, accent fill on the one part the analogy names (brain, books, nerves). Accept losing the hatching and grey tone — the information job (human thing vs technical thing) survives, the drawn texture does not. Do not reach for a generic icon set: uniform icon geometry makes both sides look like the same class of thing and destroys the metaphor-vs-referent read.
- Right-hand column, if glyph authoring is too expensive: drop the object sketch and keep only the boxed caption, moved left to sit at the arrow head. The row still reads as term -> literal name. A real downgrade at thumbnail size (one silhouette instead of two) but honest, and the four-row rhythm survives intact.
- Headshot: drop it. Use a lime circle with two-letter initials in the body font at bold. Never substitute an emoji face — it reads as a placeholder and undercuts the byline.
- Hand-drawn caption boxes: 1.5px solid #040403 border, 6px radius, #F8F8EE fill, plus box-shadow: 2px 2px 0 #040403 for a sketch-ish double line. Arrows: an inline SVG quadratic path with a head made of two short round-capped lines, not an SVG marker — markers look mechanical.
- Headline face: Anton via Google Fonts with letter-spacing:-0.01em, and a scaleX transform if the string falls short of full width. Do not center it; force it to the 4% margins.

**Implementation notes.** Fixed 1080x1350 body, background #F8F8EE, zero page padding. Outer container display:grid with grid-template-rows: auto auto repeat(4, 1fr) auto so the four rows self-equalize and the footer pins to the bottom. Each row is its own grid: grid-template-columns: 22% 1fr 25%, align-items:center. Highlighter: wrap the highlighted words in a span with background:#D4F24F, padding:0 .06em, tight line-height so the block hugs cap height rather than the line box, plus box-decoration-break:clone if it can ever wrap. Equation pill: inline-flex span, background:#C9EA7E, border-radius:8px, padding:6px 14px, sitting in a flex row with the term at align-items:center and a 14px gap. Bullets: ul with list-style:none and a ::before dot in the olive accent, 20px gap between the two items, white-space:nowrap to make an overlong bullet fail loudly at build time instead of silently wrapping into the hairline. Hairlines: border-bottom:1px solid #B9B9B2 on rows 1-3, inset 4% left and right. Footer: full-bleed div, background:#111425, height:5%, display:flex, justify-content:center, gap ~48px. Every illustration is an inline svg with a viewBox and width:100% so it scales with its column. No external assets beyond one Google Fonts link.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline_highlighted` | string | 1-2 words, max 11 characters including spaces. Must be the subject noun. Receives the marker block. | AI ACRONYMS |
| `headline_plain` | string | 1 word, max 8 characters, names the treatment not the subject. Full headline must be <= 20 characters or it will not fit one full-bleed line at the required cap height. | ANALOGY |
| `subtitle` | string | One line, 40-52 characters hard max. Must name the audience and the use case. Bold italic. A wrap eats into row 1. | How to Explain AI Systems to Leaders in simple words |
| `rows` | list<{term,equation,bullets,analogy_glyph,object_glyph}> | Exactly 4 items. Not 3 (leaves a dead band the grid cannot absorb), not 5+ (forces bullets below ~22px and kills the second-read layer). | LLM / RAG / AI Agent / MCP |
| `rows[].term` | string | Max 9 characters, one line. Acronyms keep native caps, multi-word terms title case. Second-largest type on the page and the primary thumbnail signal. | AI Agent |
| `rows[].equation` | string | Max 16 characters including the leading "= ", max 3 content words. Must stack additively across all 4 rows: one shared base noun plus a modifier (X, X + Y, X + Z). Over 14 characters it stops being legible at 220px. | = Brain + Books |
| `rows[].bullets` | list<string> | Exactly 2 per row, max 28 characters each, sentence case, no terminal period, must fit one line. Bullet 1 verb-led (what it does), bullet 2 noun-led (what it is). | ["Uses docs & databases", "LLM + external knowledge"] |
| `rows[].analogy_glyph` | enum | One of a hand-authored inline-SVG set of human/everyday shapes. Must be silhouette-legible at 48px wide, and the 4 chosen glyphs must be distinguishable from each other as silhouettes. One part of it takes the accent fill. | person reading a book, accent fill on the book |
| `rows[].object_glyph` | enum | One of a hand-authored inline-SVG set of literal/technical objects, paired with a boxed caption repeating rows[].term verbatim. Optional — the row degrades acceptably to caption-only. | brain on a stack of books, captioned "RAG" |
| `accent` | hex | One hue, two values: a legible-on-light tint for pills (#C9EA7E here) and a higher-chroma sibling for the headline marker (#D4F24F here). #040403 text must stay legible on both. Total accent coverage under ~4% of canvas. | #C9EA7E pills, #D4F24F marker |
| `page_bg` | hex | Warm off-white, never #FFFFFF. Stay within ~4% luminance of #F8F8EE or the grey illustration tones stop separating from the ground. | #F8F8EE |
| `footer_bar_color` | hex | Near-black, visibly distinct from the text black. Bar height fixed at 5% of canvas. | #111425 |
| `footer_prompt` | string | Max 16 characters, off-white regular, precedes the avatar. | Useful? Follow |
| `footer_name` | string | Max 14 characters, accent-colored bold, paired with a circular avatar or initials monogram. | Jonny Tooze |
| `footer_second_cta` | string | Max 22 characters, verb rendered in accent bold and the remainder in off-white regular. Illegible at thumbnail size by design. | Repost to your network |

### Design-tell audit against PRD §10

**Violates (2).**

- "emoji standing in for icons" — borderline. The footer repost glyph is a two-arrow loop, very likely the recolored platform emoji or something indistinguishable from it. The creator gets away with it: it sits in a 5% dark bar at ~1.0x body size where nothing is legible in the feed anyway, and it is a platform-convention symbol rather than decoration. The rule holds for content areas and does not need to extend into an attribution bar.
- "generic icon sets used decoratively" — not violated literally (these are hand drawings, not a set), but the right-hand column is close to decorative in effect. It restates information the boxed caption already gives in words, and at 220px it is grey mush. The honest read is that the left column earns its 22% and the right column mostly does not.

**Avoids (7).**

- purple-to-blue gradients — zero gradients anywhere, 2 hues total
- everything centered — the four rows are hard left-aligned on a 3-column grid; only headline, subtitle and footer are centered
- three equal cards in a row — no cards at all; rows are separated by 1px hairlines, never by borders, fills, or panels
- default Inter or Poppins with no adjustment — an ultra-condensed black grotesque paired with an extrabold humanist sans, plus a deliberate single-use bold italic
- drop shadows on every element — no shadow on anything, including the pills and the caption boxes
- slide 1 that is just a title with no information — single image; the headline band shares the canvas with all four rows
- eyebrows of any sort — no kicker, no all-caps label above the headline, no category tag

**New tells this image implies, not currently on the list (6).**

- A comparison layout whose rows do not share an identical slot order. If slot positions drift row to row the form fails at its only job and should be rejected at build time.
- An "=" claim on content that is editorial rather than measured, with no hedge available in the layout. The template should surface all four equations together for domain review before publish.
- A right-hand column that only restates the left column in a second image. Redundant illustration is dead ink; if the caption already says it, the glyph must add a distinguishing silhouette or be dropped.
- Body text below ~24px cap height on a 1080x1350 canvas is guaranteed illegible in-feed, so it can only carry second-read detail, never the differentiating claim.
- Pure #FFFFFF page background. This creator uses #F8F8EE, and the warm ground is what lets low-contrast grey illustration tone register at all.
- An analogy set that does not stack on a shared base. Four unrelated metaphors defeat the memory mechanism even when every individual row is correct.

### Failure modes when copied badly

- The four equations do not share a base unit, so the pills read as four unrelated jokes and nothing survives past the last row read.
- A pill string runs past ~16 characters ("= Distributed Nervous System"), wraps or auto-shrinks, and the four pills lose their identical visual weight — the scan path down the page breaks.
- A bullet wraps to two lines, its row grows, the four 1fr rows go unequal, and row 4 collides with the footer bar.
- Illustrations are replaced with a uniform icon set, so the human analogy and the technical object render in identical visual language and the arrow reads as decoration between two matching icons instead of as a translation.
- Right-hand glyphs are chosen that are indistinguishable as silhouettes (four grey boxes: server, chip, phone, crate), so a quarter of the canvas contributes nothing at any viewing size.
- Accent is applied to row backgrounds or bullet dots "for consistency", the pills stop being the only accent shapes, and the three-second read is gone.
- The headline is padded into a centered card with margins, cap height drops to fit, and the one element that was legible at 220px stops being legible.
- Five or six terms are forced in because the source list had six; bullets shrink below 22px and the image becomes a dense grey table.
- The analogies are fluent but technically wrong, a practitioner corrects a pill in the comments, and the credibility cost lands on the byline in the footer.
- The subtitle is cut as redundant, so the image no longer names who it is for, and the deliberately loose analogies read as ignorance instead of translation.
- The four left-hand analogies are drawn at different scales or crops, so the silhouette column stops reading as a single vertical series and the thumbnail signal degrades to noise.

### Topic fit

- **Fits when.** Four terms in one domain that outsiders conflate, where each maps honestly onto a single everyday physical object, and where the four mappings stack on one shared base (X, X + Y, X + Z, X + W). Best when the audience is explicitly non-expert and the creator's value is the translation rather than the data.
- **Breaks when.** Terms that are genuinely orthogonal with no shared base — the additive pill mechanism dies and you are left with four flashcards. Anything quantitative (a trend, a magnitude comparison, a before/after) breaks it, because there is no slot for a number anywhere in the layout. Topics where a physical analogy is misleading enough to be worth arguing about break it too, since "=" leaves no room to qualify. Also breaks at 2 terms (rows look stranded) and at 6+ (type falls below thumbnail legibility).
- **Input signature that should trigger selecting it.** Exactly 4 terms readers confuse, each reducible to a <=3-word physical analogy, where all 4 analogies share one base noun; plus exactly 2 one-line facts per term (one verb-led, one noun-led) at <=28 characters each. If the analogies do not share a base, or any term needs more than 2 supporting facts, select a different archetype.

<details>
<summary>All visible text, in reading order</summary>

AI ACRONYMS ANALOGY | How to Explain AI Systems to Leaders in simple words | LLM | = Brain | Text generation by reasoning | Core Intelligence | LLM | RAG | = Brain + Books | LLM + external knowledge | Uses docs & databases | RAG | AI Agent | = Brain + Hands | Takes actions | Uses memory & tools | AI Agent | MCP | = Nervous System | Connects everything | Connecting foundation layer | MCP | Useful? Follow | Jonny Tooze | Repost | to your network

</details>

---

## 6. tinted section report-shelf
**File:** `Johnny Tooze/1785847782917.jpeg` · **Creator:** Johnny Tooze

A single-page digest that groups nine third-party research reports into three color-coded question bands, each band holding three source cards with a logo, a report title, and a one-sentence finding.

**Information job.** "Twelve new reports dropped in two months and I cannot read them all — who published what, and what is the one sentence each one actually says?" It answers both the aggregation question (what exists) and the compression question (what it means) in one scroll-stop.

### Where the idea came from

**Likely origin.** A recurring client objection the creator keeps answering — 'we spent the budget, where is the return?' — resolved by curating a public corpus (consultancy and analyst reports published in a named two-month window) rather than by original data.

**Evidence in the image.** The subtitle names a count and a date range ('12 reports that landed in June & July'), the three section headers are written as first-person client questions ('Where did our AI budget actually go?', 'Can we afford to run agents?'), and every card is sourced to an outside firm — nothing on the page is the creator's own measurement. Nine cards are shown against a claimed twelve, i.e. the curation is editorial, not exhaustive.

**The generative question, portable to any niche.** Pick a window of the last 60 days in your niche. List every report, ruling, release, or funding round that landed in it. Now write the three questions your buyer is actually asking this quarter, sort the items under those three questions (three items each), and reduce each item to its publisher, its title, and one plain sentence of what it says.

### Headline and subtitle

> HALF OF 2026 IS GONE WHERE'S THE ROI?

- **Words:** 8
- **Form:** Declarative setup plus a question, split across two lines. Typographic emphasis is asymmetric: line 1 ('HALF OF 2026 IS GONE') sits on a full-bleed lime highlighter block (#D4F250 / #D5F15B) that runs edge to edge; line 2 ('WHERE'S THE ROI?') sits bare on the #EFF2DF page. Both lines are set in the same ultra-heavy condensed caps and optically justified to the full canvas width, so the letterforms touch both edges.
- **Promise:** The reader will be told, with receipts, why the money has not produced returns yet.
- **Subtitle:** "12 reports that landed in June & July, and what they actually say"
- **What the subtitle does that the headline cannot:** Scopes and dates the corpus (count = 12, window = June & July) and declares the editorial method ('what they actually say' = the cards are interpretations, not quotes). Without it the nine cards look like a random logo wall with no inclusion rule.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 0-10% | Highlighted headline line 1 | Thumbnail-scale hook; the lime block is the only saturated mass in the top third and carries the scroll-stop | "HALF OF 2026 IS GONE" in black caps on a full-bleed lime highlighter band (bands 1-2 measure 65 and 87 ink, the densest region above the footer) |
| 10-21% | Headline line 2, unhighlighted | Completes the hook as a question and creates figure/ground alternation with line 1 | "WHERE'S THE ROI?" black caps directly on page background (bands 3-4 drop to 42 and 46 because the highlighter is gone, not because the type shrank) |
| 21.5-25.5% | Subtitle pill | Scope, date range, and method contract | A full-width white (#FFFFFF) rounded stadium with a thin dark hairline stroke; inside, letterspaced dark-olive text "12 reports that landed in June & July, and what they actually say" (band 5 = 29 ink) |
| 27-31% | Section panel 01 — header bar | Names the question the next three cards answer; the tint is the section's identity color | Rounded pink bar (#F7CBC6, sampled #F8CBC5) full panel width; a black circular badge reading "01" at left, then "Where did our AI budget actually go?" in bold rounded sans (band 6 = 60 ink) |
| 31-49% | Section panel 01 — 3-card row | Three sources, each reduced to logo + title + one finding | Pale pink panel (#FFE7E3) holding three equal cards on near-white pink tint (#FBF5F5) with hairline borders: BAIN & COMPANY / "Automation and AI Pathfinder Survey"; BCG / "CEOs Are Starting to See Value from AI"; KPMG / "Global AI Pulse Q2 2026", each with a 2-3 line body (bands 7-10 = 28, 16, 17, 23 — the low middle bands are the logo whitespace inside the cards) |
| 50-54% | Section panel 02 — header bar | Second question, second identity color | Rounded light-blue bar (#BED3FE), black "02" badge, "Why isn't any of this landing?" (band 11 = 68, the ink spike that marks a new band) |
| 54-70% | Section panel 02 — 3-card row | Same card grammar, blue family | Pale blue panel (#DBE6FC) with three cards on #F8F9FD / #D8E6FF tint: McKinsey & Company / "From Adoption to Impact"; McKinsey & Company / "Six Shifts to the Agentic Organisation"; Deloitte. / "State of AI in the Enterprise 2026" (bands 12-14 = 12, 15, 22) |
| 72-76% | Section panel 03 — header bar | Third question, third identity color | Rounded light-green bar (#C6EE88, sampled #C4EE8A), black "03" badge, "Can we afford to run agents?" (band 15 = 71) |
| 76-93% | Section panel 03 — 3-card row | Same card grammar, green family; ends on the forward-looking question | Pale green panel (#D9EFCB) with three cards: McKinsey & Company / "Is That AI Agent Worth It?"; Gartner. / "Agentic AI forecast"; McKinsey & Company / "State of AI Trust in 2026" (bands 16-19 = 28, 15, 15, 12) |
| 95-100% | Dark CTA strip | Attribution and two explicit asks, quarantined from the content so it never competes with a card | Full-bleed near-black bar (#111425) containing "Useful? Follow" in cream, a small circular headshot, "Jonny Tooze" in lime, then a repost glyph, "Repost" in lime and "to your network" in cream (band 20 = 98 ink, the densest band on the page) |

### Reusable skeleton

```
┌──────────────────────────────────────────┐ 0%
│███ HEADLINE LINE 1 ON HIGHLIGHT ███ full │
│    HEADLINE LINE 2 (no highlight)        │ 21%
│ ( ·  subtitle pill, white, hairline  · ) │ 25%
│ ┌── panel tint A ──────────────────────┐ │ 27%
│ │ (01) Section question bar (tint A+)  │ │ 31%
│ │ ┌──────┐ ┌──────┐ ┌──────┐           │ │
│ │ │LOGO  │ │LOGO  │ │LOGO  │           │ │
│ │ │Title │ │Title │ │Title │           │ │
│ │ │body  │ │body  │ │body  │           │ │
│ │ └──────┘ └──────┘ └──────┘           │ │
│ └──────────────────────────────────────┘ │ 49%
│ ┌── panel tint B ──────────────────────┐ │ 50%
│ │ (02) Section question bar (tint B+)  │ │
│ │ ┌──────┐ ┌──────┐ ┌──────┐           │ │
│ │ └──────┘ └──────┘ └──────┘           │ │
│ └──────────────────────────────────────┘ │ 70%
│ ┌── panel tint C ──────────────────────┐ │ 72%
│ │ (03) Section question bar (tint C+)  │ │
│ │ ┌──────┐ ┌──────┐ ┌──────┐           │ │
│ │ └──────┘ └──────┘ └──────┘           │ │
│ └──────────────────────────────────────┘ │ 93%
│██ dark strip: Follow @name · Repost ██████ 100%
└──────────────────────────────────────────┘
```

### Type system

- **Families.** Three families. (1) Headline: ultra-heavy condensed grotesque, all caps, near-zero tracking, letters nearly touching — a Druk/Knockout-class face; Google Fonts nearest guess is Anton (guess). (2) Subtitle, section-header questions, and card titles: a rounded geometric sans with a single-story g and circular bowls, Poppins/Nunito-class (guess). (3) Card body: a narrower humanist/neo-grotesque at regular weight with tighter width than the headers, so body never reads as a small header (guess).

- **Headline : body.** Headline cap-height ~92-100px against ~19px body cap-height, i.e. headline ~4.8x body. Section-header questions sit at ~30px, ~1.6x body. Card titles ~21px, ~1.1x body but bold.

- **Weights.** Headline: single ultra/black weight. Section questions and card titles: bold (700). Card body: regular (400). Subtitle: medium (500) with positive letterspacing. Section number badges: bold small caps-height digits reversed out of black circles.

- **Case.** Headline all caps. Everything else sentence case, including the section questions — no caps anywhere below the fold, which is what keeps the headline the only shouting element. No all-caps eyebrows.

- **Typographic moves.** Full-bleed lime highlighter behind headline line 1 only (a background-block treatment, not an underline). Optical justification of both headline lines to the exact canvas width. Letterspaced subtitle inside a stadium pill with hairline stroke. Numbered black circular badges as row anchors. Card titles set 1-2 lines with a manual break so they stack rather than rag. Brand wordmarks used as the card's visual header in place of an icon.

- **Hard line limits.** Headline: exactly 2 lines, each 3-4 words, ~20 characters per line max at this weight and width. Subtitle: 1 line, 64 characters observed — that is the ceiling. Section question: 1 line, longest observed 36 characters ("Where did our AI budget actually go?"). Card title: 1-2 lines, longest observed 38 characters ("Six Shifts to the Agentic Organisation"). Card body: 3 lines, longest observed 85 characters.

### Color logic

- **Roles.** Page background: #EFF2DF (pale sage-cream), covering ~61% of pixels. Primary ink: #020203 at 26% (headline mass, section questions, card titles, badges). Secondary near-black: #111425 at 12% (the footer CTA strip and hairline card borders). Highlighter / brand accent: #D4F250 5% and #D5F15B 3% (the headline block, plus the lime name and 'Repost' word in the dark footer). Section identity tints, saturated: #F7CBC6 7% (section 01 bar), #BED3FE 8% (section 02 bar), #C6EE88 7% (section 03 bar). Section panel washes, sampled: #FFE7E3, #DBE6FC, #D9EFCB. Card fills, sampled near-white tints of the same hue: #FBF5F5, #F8F9FD / #D8E6FF 3%. Card interiors are the only white-adjacent surfaces; pure #FFFFFF appears once, in the subtitle pill.
- **Distinct hues.** 4
- **Does color mean anything.** Color is categorical, not evaluative: each of the three questions owns a hue (pink, blue, green) and that hue is stepped down twice — saturated in the header bar, washed in the panel, near-white in the card — so a card's tint tells you which question it answers even when the header bar is off-screen. Nothing is red-for-bad or green-for-good. The imported brand logo colors (Bain red, BCG green, KPMG blue, Gartner navy) sit outside the system and are tolerated as provenance, not palette.
- **Accent discipline.** The lime is spent almost entirely in one place: the ~8% of pixels forming the headline block, plus two words in the footer. It never touches a card, a section bar, or a body sentence. The three pastel tints together are ~22% of ink but at low chroma, so the single lime block stays the only high-chroma mass on the page.

### Data dependency

- **Needs external data.** yes
- **What would have to be true.** Nine real publications must exist, each attributable to a named firm, each with a real title, and each with a finding the creator can compress to one sentence. Six of the nine findings carry hard numbers that must be true: 11-20% targeted savings vs under 10% achieved, 'only a quarter' past pilot, '1 in 4 companies' with visibility into monthly AI cost, 'only 11%' having redesigned work, agents inside '40% of the software you have already bought'. The date window (June & July) and the count (12) must also hold.
- **Provenance shown on the image.** Provenance is the design: each card's top zone is the publisher's own logo, and the bold line under it is the report's actual title (e.g. "Global AI Pulse Q2 2026", "State of AI in the Enterprise 2026"). There is no source line at the bottom of the page — sourcing is distributed into the nine cards. No URLs, no dates per card; the only date is in the subtitle.
- **Fabrication risk.** Very high and very cheap to check. Nine firm-attributed titles and six statistics are individually falsifiable, and the logos assert institutional authorship. An AI filling this form without real inputs would invent plausible-sounding report titles ('Global AI Pulse Q2 2026' is exactly the shape of an invented title) and round statistics, and would attach them to real brands — which is misattribution, not just error. The layout also pressures fabrication structurally: it needs exactly 3+3+3 items, so a missing ninth report tempts invention to keep the grid square.

### Attribution

"Useful? Follow [circular headshot] Jonny Tooze     [repost glyph] Repost to your network" — one full-bleed #111425 strip across the bottom 5% (band 20 = 98 ink), centered, split into two asks separated by a wide gap. Body-sized type (~24px, roughly 1.2x card body, far below the 30px section questions), so it is legible but subordinate. The name is set in lime #D4F250-family bold; the framing words ('Useful? Follow', 'to your network') are cream at regular weight; 'Repost' is lime bold beside a small two-arrow glyph. A ~30px circular photo sits inline before the name. This reads as CTA, not signature: it uses second-person imperatives, two separate verbs, and a reversed strip that visually detaches from the content. There is no logo and no handle anywhere else on the page — zero attribution inside the content area.

### Density

- **Words:** 245 · **Discrete elements:** 15 · **Words per element:** ~16 words per container (9 cards average ~23 words each: 1-3 word wordmark + 3-8 word title + 12-16 word body)
- **Whitespace read.** 38.6% ink coverage with zero margins on three sides is objectively dense, and yet the page does not read crowded, for two measurable reasons. First, the ink is front-loaded and back-loaded: bands 1-2 (65, 87) and band 20 (98) hold the extremes, while the entire card area sits at 12-28 with only the three header-bar bands (60, 68, 71) spiking. Those spikes act as ruled dividers, so the eye gets three hard stops instead of one long field. Second, most of the counted ink is low-chroma pastel panel fill rather than glyphs — the tinted panels register as ink in the measurement but as background to the reader. The genuinely airy zones are inside the cards, where each logo sits in its own empty upper third; that is where the band values collapse to 12-17.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** The headline is fully legible at 220px — both lines, and the lime block is the first thing the eye lands on. All six brand logos are identifiable (BAIN, BCG, KPMG, McKinsey & Company, Deloitte, Gartner) because logos are shape-recognized, not read. The three-band structure and the three pastel colors survive completely. The section questions are marginally readable — you can tell they are questions and catch the shape of 'Where did our AI budget actually go?' and 'Can we afford to run agents?'. The dark footer strip reads as a follow/repost CTA, with 'Jonny Tooze' and 'Repost' picked out by the lime.
- **Dies.** Every card body sentence — all nine, i.e. ~130 of the 245 words, roughly 53% of the text — is grey noise. All card titles are gone as text (they survive only as a bold darker line under the logo). The subtitle pill is unreadable, so the '12 reports' count and the June/July window are lost at feed size. The 01/02/03 badges reduce to black dots. The Deloitte green period and the Gartner registered mark vanish.
- **Rule this proves.** The archetype only needs three things to work at 220px: a two-line ultra-heavy headline with a colored block behind one line, three tinted bands, and recognizable logos. Everything else is post-click reward. Consequently the logos are load-bearing at thumbnail scale — a version of this template that substitutes typographic source names loses its only mid-page thumbnail signal and must compensate by making the source name much larger (near card-title size) rather than treating it as a caption.

### Why it works, and what breaks without it

- **The three section headers are written as first-person buyer questions ('Where did our AI budget actually go?'), not as topic labels ('Budget', 'Adoption', 'Cost'). Each question is the reader's own sentence handed back to them.**
  Without it: With noun labels the page becomes a taxonomy of a research market — a logo wall. The reader has no reason to descend into any specific band because no band claims to answer something they were already asking.
- **Three-step tint laddering: header bar saturated (#F7CBC6 / #BED3FE / #C6EE88), panel washed (#FFE7E3 / #DBE6FC / #D9EFCB), card near-white (#FBF5F5 / #F8F9FD). The same hue at three chromas builds the containment hierarchy without a single drawn border between groups.**
  Without it: If all nine cards sat on one background, the measured band pattern would flatten into a uniform field and the reader would face nine peer items with no grouping — the 3x3 grid would read as an undifferentiated list and the questions would lose their scope.
- **Publisher logo occupies the card's top zone where an icon normally goes, so provenance is the visual furniture. The empty space around each logo is what produces the low ink bands (12-17) inside otherwise dense rows.**
  Without it: Replace logos with generic icons and the page's entire claim — that these are outside findings, not the creator's opinions — evaporates; the one-sentence bodies become unsourced assertions. It also removes the only element that stays legible at 220px between the headline and the footer.
- **Highlighter on headline line 1 only. One saturated lime block against a low-chroma page, spending ~8% of pixels, with the same lime reappearing only in the footer name and the word 'Repost'.**
  Without it: Highlight both lines and the block becomes a masthead — an area, not a point — and the feed thumbnail loses its single bright anchor. Highlight neither and the top 21% is undifferentiated black type on cream, competing with the dark footer strip for first fixation.
- **A subtitle that states a count and a date window ('12 reports that landed in June & July') establishes an inclusion rule, converting nine cherry-picked cards into a bounded survey.**
  Without it: Without the rule the selection looks arbitrary and the obvious objection — 'you picked the reports that agreed with you' — has nothing to push against. The page also loses its recency claim, which is what makes it worth posting this month rather than any month.
- **The CTA is quarantined in a reversed full-bleed strip below the last panel rather than floated over content.**
  Without it: Put the follow/repost ask inside or beside a card and it competes with the card titles for the same reading weight; the reader starts discounting the findings as promotional. The reversed strip also gives the page a hard bottom edge, so the eye knows the list ended rather than was cropped by the feed.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- Six third-party brand logos rendered as real marks: Bain & Company (custom serif wordmark plus red circular compass glyph), BCG (custom green ligatured letterforms), KPMG (blue italic wordmark inside four boxes), McKinsey & Company (a specific didone serif lockup, used four times), Deloitte with its green period, Gartner with its navy wordmark and registered mark. These are licensed vector assets; HTML+CSS cannot approximate them, and hand-rolling SVG paths of a company's logo is both inaccurate and a trademark problem.
- The circular photographic headshot in the footer strip. No image generation and no external asset host means there is no honest way to produce a real person's face.
- The headline face itself is likely a licensed condensed display type (Druk/Knockout class). Google Fonts has no true match; the closest available faces are noticeably different in width and terminal shape.

**Honest substitutes.**

- Replace each logo with a typographic source lockup: the publisher name set at card-title size or larger (~26-30px) in a serif for institutions and a bold grotesque for analysts, letterspaced, on its own line, with a 1px rule underneath, occupying the same top zone and the same generous whitespace the logo had. This keeps the information job (who said this) fully intact and loses only brand recognition. Do NOT shrink it to a caption — the thumbnail test shows this zone is the only mid-page signal at 220px, so the substitute must be large enough to survive there.
- Replace the headshot with a lime-filled circle carrying the creator's initials in near-black at ~14px, same diameter, same inline position. Loses face recognition, keeps the signature-object role and the strip's rhythm. Do not drop the circle entirely — without it the footer collapses into one undifferentiated line of text.
- Set the headline in Anton (Google Fonts) at ~96-104px with letter-spacing about -0.02em and transform: scaleY(1.06) to recover the vertical proportion, or Archivo Black with a horizontal scale under 0.9. Accept a small width difference; the mechanism that matters (one ultra-heavy caps line, optically justified edge to edge, on a colored block) is fully reachable.

**Implementation notes.** Body at 1080x1350 with zero padding and background #EFF2DF. Headline: two block-level lines; line 1 gets its own full-bleed div with background #D4F250 and about 0.06em vertical padding so the block hugs the caps; line 2 is a plain div. Achieve edge-to-edge optical justification by fixing font-size per line and nudging letter-spacing — do not use text-align: justify on a single line, and do not use transform: scaleX to force fit unless the distortion stays under 4%. Subtitle pill: a flex row, background #FFFFFF, border 1.5px solid #111425 at ~30% alpha, border-radius 999px, letter-spacing 0.04em, color a dark olive derived from the background family. Each section panel: one div with border-radius ~18px and the wash tint, ~14px internal padding; the header bar inside it is another div with the saturated tint, border-radius ~12px, display flex, align-items center, gap 14px, holding a 34px border-radius:50% background #020203 span with the two-digit number in white ~15px bold. Card row: display grid; grid-template-columns: repeat(3, 1fr); gap 14px; each card background the near-white tint, border 1px solid rgba(17,20,37,0.12), border-radius 12px, padding 16px, and display:flex; flex-direction:column so the source lockup can sit in a fixed-height top zone (min-height ~72px, centered) with title and body flowing beneath. Footer: a full-bleed flex row, background #111425, justify-content center, gap ~70px. The repost glyph is inline SVG — two horizontal arrows offset vertically with arrowheads as closed paths, stroke #D4F250, stroke-width 2.2, 20x20 viewBox. No shadows, no gradients, no border-radius on the outer canvas. Uniform card heights come free from the grid; guard against ragged bodies by capping body text at 90 characters.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline_line_1` | string | 3-4 words, max 20 characters including spaces, uppercase; this is the line that gets the highlighter, so it must be the shorter or equal line | HALF OF 2026 IS GONE |
| `headline_line_2` | string | 3-4 words, max 20 characters including spaces, uppercase; should be the question or the turn | WHERE'S THE ROI? |
| `subtitle` | string | exactly 1 line, 50-64 characters; must contain a count and a time window or other explicit inclusion rule | 12 reports that landed in June & July, and what they actually say |
| `sections` | list<{question, tint_saturated, tint_wash, tint_card, cards}> | exactly 3 items; fewer than 3 leaves dead space below the last panel, more than 3 forces card bodies below legible size | three sections: budget, adoption, cost of running agents |
| `section.question` | string | 1 line, 24-38 characters, must end in a question mark and be phrased in the reader's voice (our/we/this) | Where did our AI budget actually go? |
| `section.number_label` | string | exactly 2 characters, zero-padded digits, rendered in a 34px black circle | 01 |
| `section.tint_saturated` | hex | pastel, luminance 0.80-0.92 so black text stays readable on it; one per section, three distinct hues at least 60 degrees apart | #F7CBC6 |
| `section.tint_wash` | hex | same hue as tint_saturated, lightened toward the page background; must be distinguishable from both the page #EFF2DF and the card fill | #FFE7E3 |
| `section.tint_card` | hex | same hue at 3-6% chroma, near-white; must be lighter than tint_wash | #FBF5F5 |
| `cards` | list<{source_name, source_kind, title, finding}> | exactly 3 per section, 9 total; the grid is not tolerant of 2 or 4 | Bain / BCG / KPMG in section 01 |
| `card.source_name` | string | max 22 characters; occupies the fixed ~72px top zone; repeat allowed (McKinsey appears 4 times across 9 cards) | McKinsey & Company |
| `card.source_kind` | enum | institution \| analyst \| vendor \| publication — selects serif vs grotesque for the typographic lockup that replaces a logo | institution |
| `card.title` | string | 1-2 lines, 19-38 characters; the real name of the thing being cited, never a paraphrase | Six Shifts to the Agentic Organisation |
| `card.finding` | string | 1 sentence or 2 short ones, 60-90 characters, wraps to exactly 3 lines at body size; plain language, no jargon, at most one number | The six things that have to change before agents are worth paying for. |
| `accent_hex` | hex | one high-chroma color used only behind headline_line_1 and on two words in the footer; must reach 0.85+ luminance so black caps stay legible on it | #D4F250 |
| `page_bg_hex` | hex | low-chroma, luminance 0.90-0.96, must NOT be pure white or the card tints disappear | #EFF2DF |
| `footer_bg_hex` | hex | near-black, luminance under 0.15; full bleed, 5% of canvas height | #111425 |
| `creator_name` | string | max 18 characters, set in accent_hex bold | Jonny Tooze |
| `creator_initials` | string | 1-2 characters, substitute for the headshot in the accent circle | JT |
| `cta_primary` | string | max 16 characters before the name | Useful? Follow |
| `cta_secondary` | string | max 28 characters total including the highlighted verb | Repost to your network |

### Design-tell audit against PRD §10

**Violates (3).**

- "three equal cards in a row" — violated three times over: the page is a literal 3x3 grid of equal-width, equal-height cards. The creator got away with it rather than the rule being wrong, and the escape has two parts: the cards are nested inside a tinted panel with a question bar, so the trio reads as an answer set rather than as three parallel features, and the card interiors are heterogeneous (different logo shapes, 1 vs 2 line titles) so the row does not look stamped. Copy the grid without the panel and the tell reappears immediately.
- "everything centered" — partially violated. The subtitle pill text and the whole footer strip are centered; the headline, section questions, card titles and bodies are all left-aligned. Centering is confined to the two full-width chrome elements, which is why it does not register as the default-everything-centered look.
- "default Inter or Poppins with no adjustment" — brushed, not broken. The subtitle/header family is Poppins-class, but it is adjusted: positive letterspacing on the subtitle, sentence case throughout, and a different narrower family for body text so headers and bodies do not share a face.

**Avoids (6).**

- No purple-to-blue gradients; no gradients at all — every surface is flat fill.
- No drop shadows anywhere; separation is done with 1px hairlines and tint steps.
- No generic icon set used decoratively; the only glyphs are the repost arrows (functional) and the numbered badges.
- No emoji standing in for icons.
- No title-only slide — this is a single canvas that carries all nine data points; the headline shares the page with content.
- No eyebrow label above the headline; the deck sits below it and does scoping work rather than category-labelling.

**New tells this image implies, not currently on the list (6).**

- Full-bleed type with literally zero side margin (measured L0.0 R0.0) is a deliberate move, not an accident. AI layouts almost always inset the headline by a safe 5-8%, which instantly reads as template. New rule: for the hook line, set font-size so the caps touch both canvas edges, and use vertical padding on the highlight block as the only breathing room.
- A colored background block behind one headline line only. The common failure is highlighting both lines or the whole block. New rule: highlight exactly one line, and make it the shorter one.
- Three-step same-hue tint laddering (bar / panel / card) as the grouping device instead of borders or dividers. New rule: when grouping N items under a label, step one hue through three luminances rather than drawing boxes.
- Provenance placed where an icon would go. New rule: if the content is sourced, the source name is the card's visual anchor at header size, not a 10px footnote.
- Section headers phrased as questions in the reader's voice. New rule: ban noun-label section headers in any multi-band layout.
- The CTA gets its own reversed full-bleed strip at the exact bottom 5%, containing two asks and nothing else. New rule: never place the follow ask inside the content area.

### Failure modes when copied badly

- Card bodies written to different lengths, so one wraps to 2 lines and another to 5; the grid stretches every card in the row to the tallest, and the row develops a visible dead zone under the short cards.
- Source names substituted for logos but set at caption size (12-14px), which empties the card's top zone, kills the only mid-page thumbnail signal, and leaves three cards that look like naked paragraphs.
- Section headers written as noun labels ('Budget', 'Adoption', 'Cost') because they are easier to fit in 38 characters; the page becomes a filing cabinet and no band gives the reader a reason to enter it.
- Three tints chosen too close in hue or too saturated — either the bands stop being distinguishable at 220px, or the pastels compete with the accent block and the headline stops being the first fixation.
- Highlighter applied to both headline lines, or to a headline that runs 3+ lines; the colored area grows past ~15% of the canvas and reads as a solid header banner with no focal point.
- Headline forced to fit the edge-to-edge look with a long phrase, so it is set at 60px instead of 96px; at 220px thumbnail the hook goes illegible and the whole archetype's only surviving element is lost.
- Nine slots filled by padding out a real six with invented or duplicated items, producing two cards that say the same thing in different words — visible instantly because the bodies are only one sentence each.
- A fourth section added; either the card bodies drop below ~16px or the footer strip is pushed off canvas.
- Findings written in the source's own marketing language ('unlocking transformative value') instead of the plain compression the subtitle promised; the cards stop being a service and become a press-release wall.

### Topic fit

- **Fits when.** There is a recent glut of externally-authored items the reader cannot keep up with — reports, rulings, product releases, papers, funding rounds, policy changes — and they cluster naturally under exactly three questions the audience is already asking. It is strongest when the source names carry authority the creator does not have, so borrowing the names is the point.
- **Breaks when.** The content is one continuous argument, a process with ordered steps, a before/after comparison, or a single dataset. Sequence dies in this form because the 3x3 grid asserts that all nine items are peers within their band and that the bands are parallel, not consecutive. It also breaks when all nine items come from one source (the nine-lockup wall becomes visual repetition with no provenance payoff), and when any item needs more than one sentence to be true — the 90-character body cap will force an oversimplification that a knowledgeable reader will catch.
- **Input signature that should trigger selecting it.** 9 externally-sourced items (publisher + real title + one-sentence takeaway each), partitionable 3/3/3 under three reader-voice questions, all drawn from a nameable recency window. Trigger this archetype when you have >=9 such items and >=3 distinct grouping questions; if items are ordered or interdependent, choose a different form.

<details>
<summary>All visible text, in reading order</summary>

HALF OF 2026 IS GONE | WHERE'S THE ROI? | 12 reports that landed in June & July, and what they actually say | 01 | Where did our AI budget actually go? | BAIN & COMPANY | Automation and AI Pathfinder Survey | Companies aimed for 11-20% savings. Most got under 10%. They are raising budgets anyway. | BCG | CEOs Are Starting to See Value from AI | Nearly every CEO sees value somewhere. Only a quarter has moved it past the pilot. | KPMG | Global AI Pulse Q2 2026 | Only 1 in 4 companies can see what it costs them to run AI each month. | 02 | Why isn't any of this landing? | McKinsey & Company | From Adoption to Impact | Your people are ready. Your company is not. Only 11% have redesigned the work. | McKinsey & Company | Six Shifts to the Agentic Organisation | The six things that have to change before agents are worth paying for. | Deloitte. | State of AI in the Enterprise 2026 | Far more people have the tools now. The same small group actually uses them. | 03 | Can we afford to run agents? | McKinsey & Company | Is That AI Agent Worth It? | Agents cost far more to run than chat. Most business cases were priced for chat. | Gartner. | Agentic AI forecast | Agents are about to appear inside 40% of the software you have already bought. | McKinsey & Company | State of AI Trust in 2026 | Agents are getting more freedom than the controls around them can handle. | Useful? Follow | Jonny Tooze | Repost | to your network

</details>

---

## 7. analogy decoder stack
**File:** `Johnny Tooze/infographic 1.jpeg` · **Creator:** Johnny Tooze

A cream-paper poster that stacks four jargon terms as identical rows, each pairing a hand-drawn workplace scene, a highlighted everyday analogy, two short consequences, and a sketched technical schematic.

**Information job.** "I keep hearing these four terms thrown around and I do not know what each one actually is, how they differ, or why I should care" — answered by giving each term one human analogy plus two consequences, in one glance, without defining anything technically.

### Where the idea came from

**Likely origin.** A recurring client objection / a set of terms everyone in the audience's meetings uses without understanding — the creator teaches this as a framework to non-technical leaders.

**Evidence in the image.** The subtitle scopes the audience explicitly: "explained for leaders". Every analogy is drawn from office life (job description, notes from last week, hour four of the workshop) rather than from software, and the row 4 analogy "Hour Four Of The Workshop" is a workshop-facilitator's own experience — the tell of someone who runs these sessions and keeps re-explaining the same four words.

**The generative question, portable to any niche.** Pick 4 terms your audience hears constantly and cannot define. For each, give (a) one everyday non-work-jargon analogy that a stranger would instantly get, (b) two consequences of it in under 6 words each, and (c) the literal technical object it maps to. Same four-slot shape for all four terms, no exceptions.

### Headline and subtitle

> AI MEMORY ANALOGY

- **Words:** 3
- **Form:** Bare label / noun phrase, no verb, no promise in the words themselves. All-caps ultra-heavy condensed, set edge-to-edge as a single line. Typographic emphasis: a #D4F062 lime highlighter block sits behind the first two words only ("AI MEMORY"), splitting the line 2+1 so the eye lands on the subject before the framing device.
- **Promise:** Four confusing AI terms will be handed to you as things you already understand — you will be able to hold the mental model after one scroll.
- **Subtitle:** "Why your AI Keeps forgetting, explained for leaders"
- **What the subtitle does that the headline cannot:** Does three jobs the headline cannot: converts the label into a felt problem ("Keeps forgetting"), names the audience ("for leaders"), and pre-authorises the reader to skip technical depth. Set in italic, sentence case, ~40% of headline cap height, which visually demotes it so the headline keeps the size hierarchy.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 1-11% | Headline block | Stop the scroll and name the subject at the largest possible size, with the highlighter carrying the only saturated colour in the top fifth. | "AI MEMORY ANALOGY" in one line of black condensed caps, near-full-bleed left to right (~3% side inset), lime highlighter behind "AI MEMORY". Matches bands 1-2 (46, 73 ink) — band 2 is the densest non-footer band in the image. |
| 11-15% | Subtitle line | Reframe the label as a problem and scope the audience. | "Why your AI Keeps forgetting, explained for leaders", italic, centred, single line. Band 3 = 16 ink. |
| 15-17% | Gutter | Separate header lockup from the repeating body so the header reads as a unit. | Empty cream. Band 4 = 8, the lowest band above the footer. |
| 17-35% | Row 1 — SYSTEM PROMPT | First instance of the repeating unit; establishes the three-column reading pattern (scene → term/analogy/consequences → schematic). | Left: pencil scene of a manager handing a sheet labelled "JOB DESCRIPTION" across a desk. Centre: "SYSTEM PROMPT" title, lime pill "= The Job Description", bullets "Who it is, what it does" / "Set once, applies to everything". Right: sketched document with an arrow into a microchip, boxed caption "SYSTEM PROMPT". Bands 5-8 = 34, 35, 23, 18 (dense at top where title+scene sit, thinning into the row's bottom gutter). |
| 36-55% | Row 2 — CONTEXT WINDOW | Second instance; the overload idea gets the most physical illustration (a stack about to topple). | Left: man straining under a stack of ring-binders and books with motion ticks. Centre: "CONTEXT WINDOW", pill "= What They Hold In Their Head", bullets "Everything it can see at once" / "Overfill it and things drop out". Right: overflowing metal bin of documents (some lime-tinted) with one page falling out, boxed caption "CONTEXT WINDOW". Bands 9-12 = 46, 39, 19, 10. 1px hairline divider (~#D8D6CC) at the top of the row. |
| 55-74% | Row 3 — MEMORY | Third instance; the only calm scene in the set, which is itself the semantic point (memory = retrieval, not strain). | Left: man reading a tabbed notebook with a mug and scattered papers. Centre: "MEMORY", pill "= Notes From Last Week", bullets "Carries context between sessions" / "Without it, every chat is day one". Right: tabbed notebook wired to a three-disc database cylinder, boxed caption "MEMORY". Bands 13-16 = 34, 40, 18, 16. |
| 74-95% | Row 4 — CONTEXT ROT | Payoff row; the only row whose right column is a chart rather than an object, so the sequence ends on a trend instead of a noun. | Left: man asleep at a littered workshop table, "Z z z ..." above his head, sticky notes on the wall behind. Centre: "CONTEXT ROT", pill "= Hour Four Of The Workshop", bullets "Attention fades as input grows" / "Quality drops before the limit does". Right: five hatched bars descending left to right (green → lime → yellow → orange → red) on a ground line, with a dashed curving arrow sweeping down over them to an arrowhead; boxed caption "CONTEXT ROT". Bands 17-19 = 49, 40, 17. |
| 95-100% | Attribution bar | Convert attention into follow + repost at the exact moment the reader finishes. | Full-bleed #111425 bar, ~65px tall: "Useful? Follow" (white) + circular photo headshot + "Jonny Tooze" (lime bold) \| repost glyph + "Repost" (lime bold) + "to your network" (white). Band 20 = 99 ink, the highest band in the image. |

### Reusable skeleton

```
+------------------------------------------------------+
| [HL-WORDS highlighted] REST-OF-HEADLINE   (1 line)   |  1-11%
|        italic subtitle, one line, centred            |  11-15%
|                                                      |  gutter
|  +--------+   TERM TITLE          +---------------+  |
|  | SCENE  |   [= ANALOGY pill]    |   SCHEMATIC   |  |  17-35%
|  |  art   |   * consequence 1     |   (SVG art)   |  |
|  |        |   * consequence 2     |  [ CAPTION ]  |  |
|  +--------+                       +---------------+  |
|- - - - - - - - - hairline divider - - - - - - - - - -|
|  +--------+   TERM TITLE          +---------------+  |
|  | SCENE  |   [= ANALOGY pill]    |   SCHEMATIC   |  |  36-55%
|  |        |   * c1  * c2          |  [ CAPTION ]  |  |
|  +--------+                       +---------------+  |
|- - - - - - - - - hairline divider - - - - - - - - - -|
|  +--------+   TERM TITLE          +---------------+  |
|  | SCENE  |   [= ANALOGY pill]    |   SCHEMATIC   |  |  55-74%
|  |        |   * c1  * c2          |  [ CAPTION ]  |  |
|  +--------+                       +---------------+  |
|- - - - - - - - - hairline divider - - - - - - - - - -|
|  +--------+   TERM TITLE          +---------------+  |
|  | SCENE  |   [= ANALOGY pill]    | CHART or art  |  |  74-95%
|  |        |   * c1  * c2          |  [ CAPTION ]  |  |
|  +--------+                       +---------------+  |
+======================================================+
|  Useful? Follow (o) NAME   |  [icon] Repost to your  |  95-100%
+------------------------------------------------------+
cols:  ~0-36%      ~38-64%          ~66-98%
```

### Type system

- **Families.** Two families only. Display: an ultra-heavy compressed grotesque for the headline, row titles and boxed captions — very short side bearings, flat terminals, near-zero aperture on S and C. Guess: Anton or a Druk/Archivo-Black-condensed relative; I am not certain. Text: a humanist/geometric sans for subtitle, pill and bullets, with a true italic used for the subtitle. Guess: something in the Museo Sans / Nunito Sans family; also a guess. Boxed schematic captions reuse the display face at small size with letter-spacing opened up, which is why they stay readable when shrunk.

- **Headline : body.** headline ~5x body cap-height (headline caps ~90px, bullet caps ~17px). Row titles ~1.8x body. Pill text ~1.15x body. Boxed captions ~1.0x body. Subtitle ~1.5x body.

- **Weights.** Three: display black (headline, row titles, captions, "Jonny Tooze", "Repost"), semibold (pill text), regular/medium (bullets, subtitle italic, footer connective words).

- **Case.** ALL CAPS for headline, row titles and boxed schematic captions. Title Case for every pill ("= The Job Description", "= What They Hold In Their Head"). Sentence case for all bullets and the subtitle. Footer mixes sentence case with a Title-Case name. The case tier is doing hierarchy work that size alone is not.

- **Typographic moves.** 1) Lime highlighter block behind a word subset of the headline, not the whole line. 2) The analogy is set inside a lime rounded pill prefixed with a literal "= " so the equivalence is read as an equation, not a subhead. 3) Tight tracking on the headline, loose tracking on the small caps captions. 4) Bullet markers are small filled circles in accent green, not glyphs. 5) Ragged-right, hard-wrapped bullets that break at grammatical joints ("Set once, applies / to everything").

- **Hard line limits.** Headline: exactly 1 line (17 chars incl. spaces here) — a 2-line headline would eat the row-1 gutter. Subtitle: 1 line, 50 chars. Row title: 1 line, max 14 chars observed ("CONTEXT WINDOW"). Pill: 1 line, 30 chars incl. "= " ("= What They Hold In Their Head"). Bullets: 1-2 lines, longest string 35 chars ("Quality drops before the limit does"). Boxed caption: 1 line, max 14 chars.

### Color logic

- **Roles.** Page background: #F8F6EA warm cream (paper, not white). Primary ink: #040503 at 18% of pixels — headline, row titles, bullets, all illustration linework. Second-darkest and completely isolated: #111425 near-black navy at 13%, used for nothing except the full-bleed footer bar (band 20 = 99% ink), which is why the footer reads as a different surface rather than a section. Accent: #D4F062 lime at 5% — headline highlighter, the four analogy pills, footer name and "Repost". Illustration mid-tones are five desaturated warm greys/olives doing pencil shading: #D8D6CC 6%, #BBB9B0 5%, #CCCBBC 4%, #9E9D95 4%, #B1B19D 4% — 23% of pixels total, none of them saturated, which is what keeps the 5% lime dominant despite being outnumbered four to one. #D8D6CC also serves as the hairline row dividers. Row 4's chart adds a warm ramp (green/lime/yellow/orange/red) that appears nowhere else in the poster.
- **Distinct hues.** 5
- **Does color mean anything.** Mostly positional, one place semantic. The lime is a fixed role marker ("this text is the analogy"), not a meaning — it says the same thing in all four rows. The illustration olive-green is a single-hue tint on the drawings, decoration. The only semantic colour in the image is the row-4 bar ramp, where green→red encodes degradation; that ramp is also the one place where colour asserts a claim the image supplies no data for.
- **Accent discipline.** Lime is 5% of pixels and appears in exactly three roles: two headline words, four pills, two footer words. It never touches a row title, a bullet, or a divider. Every lime element is also a piece of the reader's shortest path (subject → analogy → follow), so the accent is functioning as a route map. Break the discipline — put lime on the row titles too — and the pills stop reading as a separate content tier.

### Data dependency

- **Needs external data.** no
- **What would have to be true.** None. This is a concept mapping: four terms, four analogies, eight assertions. Everything on the page is claimable from domain knowledge. The row-4 bar chart carries no axis, no tick labels, no numbers and no units — it is an illustration of a direction, not a plot of values.
- **Provenance shown on the image.** None whatsoever. No source line, no date, no methodology note anywhere on the canvas. The only credential offered is the creator's face and name in the footer bar.
- **Fabrication risk.** Concentrated entirely in the row-4 chart. An AI copying this form will draw five descending bars with a traffic-light ramp and a dashed arrow, and a reader will import a quantitative claim ("quality falls ~85% by input five") that nobody measured. The lie is barely visible because there are no axes to contradict — which makes it worse, not better. Rule for reproduction: either the chart is value-free and axis-free (as here, and then it must never carry a number, a percentage, or a tick), or it carries real values plus a visible source line. Never the middle state of a labelled y-axis with invented numbers. The analogy pills and bullets are opinion and safe; the boxed schematic captions restate the row title and invent nothing.

### Attribution

Full-bleed bar at the very bottom, #111425, ~65px tall (bottom 5% of canvas, band 20 = 99% ink), running edge to edge with zero margin so it reads as chrome rather than content. Two groups side by side with a wide gap between them. Left group, verbatim: "Useful? Follow" in white regular, then a circular photographic headshot (~34px diameter, cropped to a circle), then "Jonny Tooze" in lime #D4F062 display-weight. Right group: a lime repost/recycle glyph, then "Repost" in lime display-weight, then "to your network" in white regular. Text size is ~1.0x body — no larger than a bullet, so it never competes with the rows. This reads unambiguously as a CTA, not a signature: two imperative verbs ("Follow", "Repost"), a qualifying hook ("Useful?") that presumes the answer, and the only two lime words below the header. The name is the payload the bar exists to deliver; the headshot is what makes the bar feel like a person rather than a banner.

### Density

- **Words:** 99 · **Discrete elements:** 26 · **Words per element:** ~3.8 words per element (99 / 26)
- **Whitespace read.** 33.9% ink is high, and yet the poster does not feel crowded, for three reasons the metrics show. First, 23% of the non-background pixels are the five desaturated greys of the pencil shading — that is ink that reads as tone, not as content, so a third of the measured density costs the reader nothing to parse. Second, the band series has a real gutter after every row (18, 10, 16, 17) alternating with row peaks (34-49), so the eye gets four hard stops on the way down. Third, no text block exceeds two lines: the words are spread across 26 slots at under four words each, so the density is distributed rather than pooled. Where it does feel tight is the centre column of rows 2 and 4, where a 30-character pill and two wrapped bullets stack into a small box with almost no leading between the pill and the first bullet.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** The headline "AI MEMORY ANALOGY" is fully readable, and the lime highlighter behind "AI MEMORY" is the first thing the eye registers. All four row titles read cleanly — SYSTEM PROMPT, CONTEXT WINDOW, MEMORY, CONTEXT ROT — because they are display-black caps at ~1.8x body. The four lime pills read as four evenly spaced green bars, so the repeating structure and the count (four items) are unmistakable. The illustrations survive as recognisable silhouettes: two people at a desk, a person carrying a tall stack, a person reading a book, a person slumped at a littered table. The row-4 bar chart survives completely — descending bars, colour ramp, dashed arrow. The footer survives as a dark bar with two lime words in it.
- **Dies.** Every bullet — all eight consequence lines are grey texture with no word shapes recoverable. The pill text is gone; you can see there is lime and that something is written on it, but not what. The subtitle "Why your AI Keeps forgetting, explained for leaders" is unreadable (italic at ~1.5x body does not survive an 80% reduction). All four boxed schematic captions are illegible boxes. The "JOB DESCRIPTION" label inside the row-1 drawing is gone. The footer name "Jonny Tooze" is illegible; only its lime colour survives. The hairline dividers disappear, so row separation is carried entirely by the illustration whitespace.
- **Rule this proves.** Only two type tiers are allowed to carry meaning at feed size: the single-line headline and the four row titles. Everything else must be treated as reward-for-stopping, not as the message — which means the four terms alone have to constitute a complete promise, because that is literally all a scroller receives. The corollary is a hard reproduction rule: the row title must be the shortest, most concrete string in the row (<=14 chars, display black caps), and the pill must never be where the actual differentiator lives, because the pill dies. Also note the mechanism the creator used to insure the right-hand column: the boxed caption under each schematic repeats the row title verbatim, which is redundant at full resolution but means the right third still carries the same four words if anything survives there.

### Why it works, and what breaks without it

- **Absolute row isomorphism: all four rows are the identical four slots in the identical three columns (scene | term+pill+2 bullets | schematic+caption), with no row getting an extra bullet, a wider column, or a special treatment. The reader learns the pattern once in row 1 and then reads rows 2-4 at a fraction of the cost.**
  Without it: Vary one row's slot count or column widths and the reader has to re-parse each row from scratch; the four items stop reading as one comparable set and become four unrelated mini-posters. The comparison — which is the whole point of putting four terms on one canvas — evaporates.
- **The literal "= " prefix inside a lime pill. The analogy is typeset as an equation, not as a subhead, so the reader's grammar for the row is "jargon EQUALS thing I already know" before any explanatory sentence is read.**
  Without it: Drop the "=" and the pill becomes an eyebrow or a category label — indistinguishable in function from the row title above it. The reader then has to infer from the bullets that an analogy is being offered, and the two-second version of the row is lost.
- **A three-hue-plus-greys budget where the single saturated colour (#D4F062, 5% of pixels) is spent only on the reader's shortest path: the headline subject, the four analogies, and the follow prompt. Everything explanatory is black on cream; everything illustrative is desaturated warm grey.**
  Without it: Add a second saturated colour, or extend lime onto the row titles and bullets, and the pill tier stops being findable. The reader can no longer skim the four analogies as a standalone sequence, which is the only path that fits in a two-second glance.
- **Two-register redundancy per row: the same idea is stated as a human scene on the left and as a technical object on the right, with the abstract text sandwiched between. A leader who does not want the technical framing gets it from the drawing; a technical reader gets it from the schematic; neither has to read the bullets.**
  Without it: Keep only the left scene and the poster reads as a cartoon with no anchor to the actual thing being explained (a scene of a man with books does not say "context window"). Keep only the right schematic and it reads as a systems diagram, which is exactly the register the subtitle promised to avoid. The two columns are doing different jobs and neither substitutes for the other.
- **Terminal-position CTA on a colour surface used nowhere else (#111425, 13% of pixels, one element). The reader hits the ask at the exact instant they finish the last row, and the bar is visually a different plane, so it cannot be mistaken for a fifth row.**
  Without it: Put the same words on cream with no bar and they read as a fifth content row that happens to be about the author — the reader parses it as information, hits nothing, and leaves. Put the bar at the top and it spends the highest-attention pixels on an ask the reader has not been given a reason to grant.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- Four hand-drawn pencil illustrations of people in scenes (manager handing over a sheet; man staggering under a book stack; man reading a tabbed notebook with a mug; man asleep at a littered workshop table). These occupy the left ~36% of every row, roughly 28% of the whole canvas. Figurative human illustration in a consistent single-artist drawing style is not producible from hand-authored HTML/CSS/SVG at any realistic effort.
- The circular photographic headshot in the footer bar. A photograph cannot be synthesised in CSS.
- The pencil-sketch rendering of the schematic objects — visible graphite grain, wobbling contour lines, cross-hatched interior shading on the bars and the metal bin, the soft cast shadows under objects. The shapes are reachable; the graphite texture and the specific hand-wobble are not reproducible faithfully.
- The intentionally imperfect hand-lettered look of the in-drawing label "JOB DESCRIPTION" (written on a drawn sheet at an angle, following the sheet's perspective).

**Honest substitutes.**

- Human scenes: drop the column, do not fake it. A geometric or emoji-ish stand-in in that slot would be worse than absence — it would read as clip art next to a real drawing, and it would violate the no-decorative-icons rule while consuming 28% of the canvas. Restructure the row to two columns instead: text block widened to ~52% and schematic to ~44%. This preserves the information job (term → analogy → consequences → what it literally is) and costs only the human-register redundancy. If a left column is required for rhythm, put a large number (01-04) or the term's initial in display-black cream-on-black there — an honest typographic element, not a fake illustration.
- Photographic headshot: replace with a lime #D4F062 circle carrying the creator's two initials in the display face, same diameter, same position. Keeps the personal-signature read; loses the face.
- Graphite texture on schematics: inline SVG line art with an SVG filter for wobble — `<filter><feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2"/><feDisplacementMap scale="2.5"/></filter>` applied to the stroke group, plus a `<pattern>` of 45-degree hairlines for the cross-hatch fills. Reaches maybe 70% of the look. Accept it; the schematics are simple enough geometry (rect+folded corner, chip with pin combs, trapezoid bin, ring-bound rect, three stacked ellipse-capped cylinders, five bars) that clean line art at 2.5px stroke on cream reads as deliberate rather than as a failed sketch. Do NOT attempt the cast shadows.
- Hand-lettered in-drawing label: dropped along with the scene column.

**Implementation notes.** Body: a 6-row `display:grid` at fixed 1080x1350, `grid-template-rows: auto auto repeat(4,1fr) 65px`, `background:#F8F6EA`, `overflow:hidden`. Headline: one `<h1>` at ~118px, `font-stretch`/condensed face, `letter-spacing:-0.02em`, `line-height:0.88`, `white-space:nowrap` and a scale-to-fit check — never let it wrap. Highlighter: `<span class=hl>` with `background:#D4F062; padding:0 .04em; box-decoration-break:clone` (no border-radius — the measured block is square-cornered). Rows: each an inner `display:grid; grid-template-columns: 36% 30% 34%; align-items:center`, with `border-top:1px solid #D8D6CC` on rows 2-4 only (`:not(:first-of-type)`) — the divider is the hairline, there is no card, no shadow, no panel fill. Pill: `display:inline-block; background:#D4F062; border-radius:5px; padding:3px 11px; margin:8px 0 14px`, text prefixed with a literal `= `. Bullets: `<li>` as `display:flex; gap:11px; align-items:flex-start` with `::before` a `7px` circle, `border-radius:50%`, accent green, `margin-top:.5em` so the dot optically centres on the first line; force the break points with `<br>` rather than relying on container width, because the measured wraps land on grammatical joints. Chart (row 4 right): one inline `<svg viewBox="0 0 300 190">`, five `<rect>` from a values array with `x = 8 + i*56`, `width:40`, `y = 160 - v/max*140`, `height` to the 160 ground line, fills from a 5-stop ramp, each with `fill="url(#hatch)"` layered over the flat fill at low opacity; ground line a single `<line>`; the trend a `<path d="M30,22 Q160,60 268,132">` with `stroke-dasharray="15 11" stroke-width="4" fill="none"` and `marker-end` pointing to a `<marker>` holding a filled triangle. Boxed captions: `border:2px solid #040503; border-radius:6px; padding:5px 13px; letter-spacing:.06em` — centred under each schematic. Footer: last grid row, full-bleed `#111425`, `display:flex; justify-content:center; gap:70px; align-items:center`; the repost glyph must be an inline SVG (two chevron-tipped arcs), not a unicode emoji.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline_full` | string | One line, ALL CAPS, 12-22 characters including spaces. Must fit one line at ~118px condensed — 22 chars is the ceiling at 1080px width. 2-4 words. | AI MEMORY ANALOGY |
| `headline_highlight_words` | integer | How many leading words of headline_full sit inside the lime block. 1-2, and never all of them — the split is the mechanism. Must leave at least one un-highlighted word. | 2 ("AI MEMORY" highlighted, "ANALOGY" not) |
| `subtitle` | string | One line, sentence case, italic, 38-58 characters. Must contain a felt problem AND an audience noun. Never wraps to two lines. | Why your AI Keeps forgetting, explained for leaders |
| `rows` | list<{term, analogy, bullets, schematic_id, caption}> | Exactly 4. Not 3 (the poster's height leaves a dead band) and not 5 (each row falls below ~250px and the bullets collide with the pill). | SYSTEM PROMPT / CONTEXT WINDOW / MEMORY / CONTEXT ROT |
| `rows[].term` | string | ALL CAPS, 6-15 characters, 1-2 words, one line. This is the ONLY string that survives the 220px thumbnail besides the headline, so it must be the row's most concrete identifier. No punctuation, no parentheses. | CONTEXT WINDOW |
| `rows[].analogy` | string | Title Case, 14-30 characters, rendered inside the lime pill after a literal "= " prefix which the template adds. One line, must not wrap. Must be a concrete everyday noun phrase, never an abstraction and never a verb phrase. | What They Hold In Their Head |
| `rows[].bullets` | list<string> | Exactly 2 per row, all 4 rows. Sentence case, no terminal period, 20-35 characters each, max 2 rendered lines. Convention observed: bullet 1 states what it does, bullet 2 states what goes wrong without it or when it is exceeded. Keep that pairing. | ["Everything it can see at once", "Overfill it and things drop out"] |
| `rows[].caption` | string | ALL CAPS, 6-15 chars, sits in the bordered box under the schematic. Set equal to rows[].term — the verbatim repeat is deliberate thumbnail insurance for the right column, not an authoring mistake. | CONTEXT WINDOW |
| `rows[].schematic_id` | enum | Which inline-SVG line drawing fills the right column. Must be buildable from <=8 primitives (rect, ellipse, line, path, polyline) so it survives the wobble filter. One of the four rows may be a chart instead of an object — put it last so the sequence ends on a trend. | row1 doc→chip, row2 overflowing-bin, row3 notebook→database, row4 declining-bars |
| `chart_values` | list<integer> | Only if the final row uses the chart schematic. 4-6 values, monotonic in one direction, and there must be NO axis, NO tick labels, NO numbers rendered — bar heights are relative only. If real numbers exist, render labels AND a source line; if they do not, this stays a bare shape. | 5 bars, roughly [100, 78, 55, 34, 13] as pure proportion — no axis, no labels, no source |
| `chart_ramp` | list<hex> | Same length as chart_values, ordered good→bad. The only place in the poster where hue carries meaning. Must not reuse the accent hex. | 5 stops: dark green, lime, yellow, orange, red (hand-sketched hatch fill) |
| `accent_hex` | hex | One accent only. Must sit at 4-6% of total pixels and appear in exactly 3 roles: headline highlight, all 4 pills, footer name + verb. Must be light enough for #040503 text to sit on it — no dark accents, the pill text is black not white. | #D4F062 |
| `page_bg_hex` | hex | Warm off-white, never #FFFFFF. Keep luminance above ~93% so the desaturated illustration greys still read as tone. | #F8F6EA |
| `footer_bg_hex` | hex | Near-black, and used for NOTHING else on the canvas. Must be visibly distinct from the primary ink hex so the bar reads as a separate plane, not as a big text block. | #111425 (ink is #040503 — the two are close in value but different in hue) |
| `cta_left` | string | Format "<hook>? Follow <NAME>". Hook 1-2 words ending in a question mark. Total left group <=26 characters. NAME in accent colour. | Useful? Follow Jonny Tooze |
| `cta_right` | string | Format "<VERB> <object>", verb in accent colour and display weight, object in white regular. <=24 characters. Preceded by one inline-SVG glyph, never an emoji. | Repost to your network |
| `avatar` | string | Circular, ~34px. Photograph if one exists; otherwise 2-letter monogram on the accent colour. Never a generic person icon. | circular photographic headshot |

### Design-tell audit against PRD §10

**Violates (3).**

- "everything centered" — partially. The header lockup is fully centred (headline, subtitle) and so is the footer bar's content. The body is not: all four rows are left-aligned three-column grids, and the boxed captions are centred only within their own column. The rule is right about centred bodies and this image obeys that; the centred header is a two-element lockup where centring costs nothing. Not a real violation.
- "emoji standing in for icons" — borderline. The repost glyph in the footer looks like a rendered platform emoji rather than a drawn icon, sitting next to hand-drawn artwork of a completely different register. It is the single lowest-craft element on the canvas. The creator got away with it because it is 30px tall in the bottom 5% and readers pattern-match it as UI chrome, which is exactly what it is imitating. Do not copy it — draw the glyph.
- "eyebrows of any sort" — arguable, and here the rule is wrong. The lime pill sits directly under each row title in the classic eyebrow position, but it is not a category label: it carries the row's actual payload (the analogy), and it is the reason the poster exists. An eyebrow is a label that adds no information; this is the information. Position alone does not make an eyebrow.

**Avoids (7).**

- No purple-to-blue gradient — no gradient of any kind; every fill is flat or hatched.
- No three-equal-cards-in-a-row — four full-width stacked rows, which is the right form for items meant to be compared vertically at feed scale.
- Not default Inter or Poppins — an ultra-heavy compressed display face is doing the whole hierarchy, and the display/text pairing is deliberate.
- No drop shadows on UI elements — the only shadows in the image are the drawn cast shadows inside the illustrations, and there is no card, panel, or container shadow anywhere. Rows are separated by a 1px #D8D6CC hairline and whitespace, nothing else.
- No decorative icon set — every non-text mark either depicts the thing being explained or is the pencil illustration; nothing is there to fill space.
- Not a title-only opener — it is a single image and 100% of the canvas below 15% carries information.
- No white background — #F8F6EA cream, which is what lets the desaturated pencil greys read as artwork rather than as low-contrast text.

**New tells this image implies, not currently on the list (6).**

- A chart with no axis, no ticks and no numbers, but a full traffic-light ramp and a trend arrow, asserts a quantitative claim it cannot support. New gate rule: any bar or line mark either carries labelled values plus a source line, or carries no colour ramp and no arrow — pick one; the middle state is a smuggled fabrication.
- Repeating a string verbatim inside the same row (row title = boxed caption, 4/4 rows) is not redundancy waste when the two instances live in columns with different thumbnail survival odds. New gate rule: duplication is allowed, and sometimes required, when the duplicate is the only text that survives in its region at 220px.
- The single accent colour must appear in exactly the roles that constitute the reader's shortest path, and nowhere else. New gate rule: before shipping, list every element carrying the accent; if that list is not a coherent reading route (subject → payload → ask), the accent is decoration and must be cut back.
- A CTA bar must be a different colour PLANE from the content, not just different type. New gate rule: bottom CTA gets a full-bleed dark bar with a hex used nowhere else on the canvas, or it reads as a content row.
- The headline highlighter must cover a word SUBSET, not the whole line. New gate rule: highlight 1-2 leading words and leave at least one bare; a fully highlighted headline is a coloured banner and stops functioning as emphasis.
- The one string that must survive the thumbnail cannot be the differentiating one. New gate rule: identify which single field per row survives at 220px and make sure that field alone, repeated four times, still constitutes a complete promise.

### Failure modes when copied badly

- Analogy pills of uneven length: one row's analogy is 14 chars and another's is 44, so half the pills wrap to two lines. The pill baseline stops aligning across rows, the bullets below shift by a line, and the four rows lose the isomorphism that makes them scannable as a set.
- Analogies that are abstractions instead of objects — "= Long-Term Recall" instead of "= Notes From Last Week". The pill still looks right and the poster still renders, but the reader learns nothing they did not already have, and the whole form becomes a glossary with green boxes.
- Illustrations sourced from four different visual registers (one flat vector, one 3D render, one photograph, one line drawing). The left column becomes a clip-art collage; the reader reads the inconsistency as low effort and stops trusting the content.
- Bullets grown to three or four lines because the writer had more to say. Row height overflows, the bottom row collides with the footer bar, and the band structure that gave the eye four hard stops disappears into one continuous wall.
- Term names longer than ~15 characters ("RETRIEVAL AUGMENTED GENERATION"). The display-black caps either wrap to two lines — destroying the row's vertical centring — or get shrunk to survive, at which point the only string that survived the thumbnail no longer does.
- Accent creep: lime added to the row titles, the bullet dots, the divider lines, and the boxed caption borders because it looked underused at 5%. Nothing is emphasised any more and the pills stop being findable in a two-second glance.
- A row-4 chart built with an axis and invented percentages, because the author felt the bare bars looked unfinished. The image now makes a measurable claim with no source, and one skeptical commenter discredits the whole poster.
- Five or six rows instead of four. Each row drops below ~250px, the illustration becomes too small to read as a scene, and the bullets have to shrink below the pill in size — inverting the hierarchy.
- A two-line headline. It eats the 15-17% gutter, the header stops reading as a separate lockup, and row 1 gets pushed into a compressed band.
- Choosing a dark accent so the pill needs white text. The pill's contrast against the cream page drops, and the four pills stop forming the visible vertical route down the centre column.

### Topic fit

- **Fits when.** You have a small closed set of terms, tools, roles, or stages that your audience hears constantly and cannot distinguish from each other, and each one has a clean everyday equivalent. The form is at its best when the reader's failure mode is confusion between the items rather than ignorance of any single one, because the identical-row treatment makes the differences positional and therefore instant. It also fits any "jargon for outsiders" job where the promise is comprehension rather than action.
- **Breaks when.** The items are sequential steps that depend on each other — the identical rows imply parallel, comparable, independent things, so a process read as four peers loses its causality. It breaks when the items have no honest everyday analogy and you have to reach for a strained one (a bad analogy in a lime pill is worse than no pill, because the form promises the analogy is the payoff). It breaks on quantitative comparisons, where the reader wants magnitudes and gets four boxes of prose. And it breaks when the set is genuinely 7-12 items, since forcing it to 4 either drops the interesting ones or creates mushy composite categories.
- **Input signature that should trigger selecting it.** Trigger this archetype when the raw material is: exactly 4 (acceptable range 4, hard) parallel named concepts from one domain, each of which can be expressed as (a) a 6-15 character name, (b) a 14-30 character concrete everyday analogy, and (c) two consequences of <=35 characters — one stating function, one stating failure. If any of the four items cannot fill all four slots inside those limits, the input does not match this archetype.

<details>
<summary>All visible text, in reading order</summary>

AI MEMORY ANALOGY | Why your AI Keeps forgetting, explained for leaders | JOB DESCRIPTION | SYSTEM PROMPT | = The Job Description | Who it is, what it does | Set once, applies to everything | SYSTEM PROMPT | CONTEXT WINDOW | = What They Hold In Their Head | Everything it can see at once | Overfill it and things drop out | CONTEXT WINDOW | MEMORY | = Notes From Last Week | Carries context between sessions | Without it, every chat is day one | MEMORY | Z z z ... | CONTEXT ROT | = Hour Four Of The Workshop | Attention fades as input grows | Quality drops before the limit does | CONTEXT ROT | Useful? Follow Jonny Tooze | Repost to your network

</details>

---

## 8. nested-arc tier ladder
**File:** `Johnny Tooze/inspo2.jpeg` · **Creator:** Johnny Tooze

A four-tier maturity ladder drawn as four nested domes stacked back-to-front, darkest/rarest at the top, each band named by an arc-bent white banner sitting on its crown and annotated with a typical result on the left and example capabilities on the right.

**Information job.** "Everyone says they're doing this thing — which tier am I actually on, what does that tier typically produce, and how far away is the tier that matters?" It answers rank, attrition, and evidence in one pass.

### Where the idea came from

**Likely origin.** A framework the creator teaches, built on top of a recurring client/boardroom objection. Not a proprietary dataset — the numbers are borrowed, the tiering is his.

**Evidence in the image.** Two of four tiers carry a field called "Board reaction:" with a direct quote ("Now we're talking." / "Good, but where's the growth?"). That field only exists for someone who repeatedly watches the same reaction happen; it is an argument he keeps having, rendered as a schema. The stat pair "88% of companies stop here" and "The 6%" is the shape of a single widely-circulated survey figure, cited nowhere on the image. Tier names (COST SAVINGS / PRODUCTIVITY GAINS / REVENUE IMPACT / BUSINESS MODEL SHIFT) are consultant-deck vocabulary, not data-derived labels.

**The generative question, portable to any niche.** Take a thing everyone in [niche] claims to be doing. Stratify it into 4 tiers by how far people actually get. For each tier give: a name, a one-line definition of what is really happening there, the typical measured result, the reaction it earns from whoever funds it, and 2-3 concrete examples. Order so tier 1 is where everyone starts and tier 4 is where almost nobody arrives.

### Headline and subtitle

> 4 LAYERS OF AI ROI

- **Words:** 5
- **Form:** Bare enumerated label (count + noun + topic). Typographic emphasis: the last two words, "AI ROI", sit on a sharp-cornered #D4F252 chartreuse highlight block; everything is set in black ultra-condensed caps at ~105px cap height spanning 78% of canvas width on a single line.
- **Promise:** There is a fixed, countable structure to a thing you thought was one thing — and there are exactly four levels of it, so you can locate yourself.
- **Subtitle:** *none*
- **What the subtitle does that the headline cannot:** none — there is no subtitle, no deck, no eyebrow. The first tier's banner label doubles as the entry point into the body.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 0-13% | Headline block | Name the structure and its cardinality; carry the single accent highlight that makes the thumbnail readable. | "4 LAYERS OF" in black on page bg + "AI ROI" in black on a #D4F252 rectangle. Measured glyph extent y=39-144 (2.9%-10.7%), matching bands 1-2 (22, 47) and the gutter at band 3 (14). |
| 13-32% | Tier 4 — outermost/darkest dome (BUSINESS MODEL SHIFT) | The rarest tier, placed highest and darkest so it reads as the destination. | Arc banner at y≈190-250, dome crown at y=244 (18.1%), fill #ADE164/#AAD D64 family (sampled #AEE264) with a downward-darkening gradient toward #A0D15E. Bold 3-line claim, no parenthetical aside, 2 left notes, 3 right items. Band 4 (36) is the banner+crown, bands 5-7 (73, 91, 85) are the dome flanks filling to both edges. |
| 32-51% | Tier 3 dome (REVENUE IMPACT) | The tier most readers aspire to; carries the attrition line. | Arc banner y≈440-500, crown y=495 (36.7%), fill #C0E987 (sampled #C4EE8A). Bold 2-line claim, aside "(most companies never get here)", 2 left notes, 3 right items. Bands 8-10 (90, 100, 97) — the densest bands in the image. |
| 51-67% | Tier 2 dome (PRODUCTIVITY GAINS) | The tier most readers are actually on; carries the 88% reality check. | Arc banner y≈690-765, crown y=731 (54.1%), fill #DDFDB1 (sampled #DEFEB2). Bold 1-line claim, 2-line aside, 2 left notes, 1 three-line right item. Band 11 dips to 73 because the banner fill is near-background and reads as a hole; bands 12-13 recover to 97, 99. |
| 67-95% | Tier 1 dome (COST SAVINGS) | The floor everyone starts from; largest visual area, palest fill, most annotation. | Pure #FFFFFF arc banner y≈900-965, crown y=959 (71%), fill sampled #E8FFC9 (the pale #D8F6AE family). Bold 1-line claim, 2-line aside, 2 left notes, 3 right items. Bands 15-19 fall 61→31 because this tint sits close enough to bg #FAFFEB to stop registering as ink. |
| 95-100% | Footer CTA bar | Two asks (follow, repost) plus identity; the only dark mass in the image. | Full-bleed #111425 bar, y=1288-1350 (62px). White text with #A2E43A on the name and on "Repost". Band 20 = 95, consistent with a solid bar. |

### Reusable skeleton

```
┌──────────────────────────────────────────────┐ 0%
│   HEADLINE CAPS ULTRA-CONDENSED [HILITE]     │
├──────────────────────────────────────────────┤ 13%
│  ╭───── arc banner: TIER 4 LABEL ─────╮      │
│ ╱        BOLD CLAIM (1-3 lines)        ╲     │ dome4
│╱  note A                    · item 1    ╲    │ darkest
│  note B  (steps outward)      · item 2       │
├──────────────────────────────────────────────┤ 32%
│   ╭──── arc banner: TIER 3 LABEL ────╮       │
│  ╱      BOLD CLAIM (1-2 lines)        ╲      │ dome3
│ ╱        (aside in parens)             ╲     │
│╱ note A                     · item 1    ╲    │
│  note B                       · item 2       │
├──────────────────────────────────────────────┤ 51%
│    ╭─── arc banner: TIER 2 LABEL ───╮        │
│   ╱     BOLD CLAIM   (aside)         ╲       │ dome2
│  ╱ note A                  · item 1   ╲      │
│ ╱  note B                              ╲     │
├──────────────────────────────────────────────┤ 67%
│      ╭── arc banner: TIER 1 LABEL ──╮        │
│     ╱   BOLD CLAIM   (aside)         ╲       │ dome1
│    ╱ note A                · item 1   ╲      │ palest
│      note B                · item 2          │
├──────────────────────────────────────────────┤ 95%
│  Useful? Follow (o) NAME  │ ⟳ Repost to net  │
└──────────────────────────────────────────────┘ 100%
```

### Type system

- **Families.** Two families. Headline: ultra-condensed heavy grotesque, flat terminals, near-zero sidebearing, straight-sided numerals — reads like Anton (guess; Google Fonts has it). Body/banner/footer: a single humanist-geometric sans with tall x-height, double-story 'a', rounded terminals, curly quotes — reads like Greycliff/Sofia Pro (guess; Figtree or Manrope are the closest Google substitutes).

- **Headline : body.** Measured cap heights: headline 105px, banner labels 32px, bold claims ~19px, body notes ~16px. So headline ≈ 6.5x body cap, banner labels ≈ 2x body, bold claims ≈ 1.2x body. The claim and the small notes are nearly the same size — separation is by weight, not scale.

- **Weights.** Headline ~900 condensed. Banner labels ~800 caps. Claims ~700. Asides, right items, footer body ~400. Left notes are mixed inside one line: ~700 lead-in up to the colon, ~400 after it.

- **Case.** ALL CAPS for headline and all four banner labels. Sentence case everywhere else. Asides start lowercase inside their opening parenthesis ("(most companies never get here)"), which visually subordinates them to the claim above.

- **Typographic moves.** 1) Sharp-cornered #D4F252 highlight block behind the final two headline words — used exactly once in the image. 2) Arc-warped banner text: measured min-y at the label's center is 40px HIGHER than at its ends (pill1: y=200 center vs y=241 at x=353), so glyphs are individually rotated along a curve of sagitta ≈ 8-10% of label width — not a rigid rotate(). 3) Bold-lead-in micro-pattern "Label: value" inside 4 of the 8 left notes. 4) Every text block is centered within itself but each successive block steps horizontally OUTWARD (left column moves left, right column moves right as y increases) to trace the dome edge. 5) En-dashes in ranges (5–15%, 10–20%), curly quotes on board reactions.

- **Hard line limits.** Headline: exactly 1 line, ~18 characters including spaces at 105px cap. Banner labels: 1 line, 12-20 characters. Claims: 1-3 lines, 28-70 characters. Asides: 1-2 lines, ≤46 characters including parentheses. Left notes: 2-3 lines, ≤46 characters. Right items: 1-3 lines; longest body string in the image is "Individual output increases up to 5x in some roles" at 49 characters wrapped to 3 lines in a ~200px column.

### Color logic

- **Roles.** Page bg #FAFFEB (measured, and the top 13% and the negative space around the domes). Primary ink #010602 (9%) — every word except the footer. Dome tier 4 (back, darkest) #ADE164 / #AADD64 with the gradient bottom reading #A0D15E (9%). Dome tier 3 #C0E987 (18%, the single largest content color). Dome tier 2 #DDFDB1 (14%). Dome tier 1 (front, palest) #D8F6AE family, sampled at center as #E8FFC9 — close enough to bg that the ink-density bands drop from 61 to 31 across it. Accent highlight #D4F252 (sampled, headline block only). Footer bar #111425 (6%). Footer accent green sampled ~#A2E43A. Banner fills run from #E6FEC4 on the top banner to pure #FFFFFF on the bottom one — each banner is lifted above the dome it sits on.
- **Distinct hues.** 2
- **Does color mean anything.** Fully semantic. Lightness IS the rank variable: monotonic ramp from #ADE164 at the top tier down to near-white at the bottom tier encodes both altitude and rarity. There is no decorative color anywhere in the four bands. The only non-green hues in the image are the near-black ink and the #111425 footer, both of which are chrome rather than content.
- **Accent discipline.** #D4F252 does not appear in the measured top-8 content colors at all, meaning it covers under ~5% of non-background pixels — it exists in exactly one place, the headline highlight (~240x110px = 2% of canvas). The footer green ~#A2E43A appears on 2 short strings inside a 4.6%-tall bar. Two accent instances in 1.46 megapixels.

### Data dependency

- **Needs external data.** yes
- **What would have to be true.** Four hard numbers plus two implied population splits: "88% of companies stop here" at tier 2, "The 6%" at tier 4 (the two must be consistent with each other and with the intervening tiers), "5–15% revenue lift", "10–20% cost reduction", and "increases up to 5x in some roles". The two board-reaction quotes are anecdote, not data, and carry no verification burden. Strip the numbers and the image still stands as a framework, but the attrition claim ("most companies never get here") becomes unsupported assertion.
- **Provenance shown on the image.** None. No source line, no study name, no date, no methodology note, no sample size, no footnote anywhere on the canvas. The only attribution present is the author's own name in the footer bar: "Useful? Follow Jonny Tooze". The 62px footer is spent entirely on CTA, zero pixels on citation.
- **Fabrication risk.** High and effectively invisible. The form has four dedicated slots that expect a percentage, so an AI filling this template will produce four plausible percentages whether or not any exist. Because no source is displayed, a fabricated 88% renders identically to a sourced one — there is no visual tell for the reader. The compounding risk is internal consistency: 88% stopping at tier 2 and 6% reaching tier 4 leaves 6% for tier 3, which the template never states, so an invented pair can be arithmetically impossible without anything on the page revealing it.

### Attribution

"Useful? Follow [circular photo headshot, ~26px] Jonny Tooze" on the left half of the footer, and "[green repost glyph, two chasing arrows] Repost to your network" on the right half, separated only by whitespace — no divider rule. Set in the body sans at ~16px cap, white #FCFEFF, with the name and the word "Repost" in ~700 weight and sampled green ~#A2E43A. Full-bleed #111425 bar, y=1288-1350, 4.6% of canvas height. Same size as body copy, so it does not compete for reading order. It reads unambiguously as CTA, not signature: two imperative verbs, an interrogative hook ("Useful?"), and no logo, handle, URL, or job title. Identity is present only as a name plus a face.

### Density

- **Words:** 146 · **Discrete elements:** 38 · **Words per element:** 3.8 words per element (146 / 38: 4 domes, 4 arc banners, 4 bold claims, 3 asides, 8 left notes, 10 right items, 1 headline, 1 highlight block, 1 footer bar, 1 avatar, 1 repost glyph)
- **Whitespace read.** 66.1% ink coverage — the densest in the set — yet the lower two-thirds reads as open. Two reasons. First, nearly all of that ink is large flat tint, not glyphs: the four dome fills alone account for the #C0E987 18% + #DDFDB1 14% + #D8F6AE 10% + #A0D15E 9% + #ADE164 7% + #AADD64 6% = 64% of content pixels, while the near-black type is only 9%. Ink coverage here measures how much of the canvas is painted, not how much is occupied. Second, the domes create curved negative space: each band's small text sits inside a lens that narrows toward the crown, so no two text blocks ever sit on the same baseline in the same column. The airiness is a geometric illusion — actual text density is high, at 146 words on a single frame, roughly 3x what a typical single-claim LinkedIn graphic carries.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** At 220px the headline "4 LAYERS OF AI ROI" is fully legible and the chartreuse highlight on "AI ROI" is the first thing the eye lands on. The four-band nested structure and the light-to-dark ramp read instantly — you can count four tiers without reading a word. All four banner labels survive because they are caps, ~800 weight, and sit on near-white banners against tinted fields: "BUSINESS MODEL SHIFT", "REVENUE IMPACT", "PRODUCTIVITY GAINS", "COST SAVINGS" are all resolvable. The bold claims are borderline — you can tell there is a sentence and catch the leading word "Where" repeating four times, which telegraphs the parallel structure even when the rest is unresolved. The dark footer bar reads as a bar.
- **Dies.** Everything at body size, which is 100 of the 146 words. All 8 left notes, all 10 right items, and all 3 parenthetical asides collapse into grey texture — including every number in the image (88%, 6%, 5–15%, 10–20%, 5x), which means the entire evidence layer is invisible at feed size. The footer is unreadable: name, "Repost", and the CTA verbs are illegible, and the headshot is a 3px dot. The bold-lead-in trick inside the left notes contributes nothing at this size.
- **Rule this proves.** Build the archetype so the framework survives and the evidence is the reward for stopping. Three things must carry the thumbnail alone: a one-line headline of ~18 characters with a single accent block, tier labels in caps at ≥2x body cap on a near-white banner, and a tint ramp with at least ~12% lightness between adjacent tiers. Never put a load-bearing number in body copy — if a statistic is the hook, it belongs in the headline or in the tier label. Corollary: this archetype cannot be evaluated by its word count, because 68% of its words are deliberately below the thumbnail threshold.

### Why it works, and what breaks without it

- **Monotonic lightness ramp across four tints (#ADE164 → #C0E987 → #DDFDB1 → near-white #E8FFC9) maps rank onto a single perceptual channel, so altitude and rarity are encoded before any label is read.**
  Without it: Paint all four bands the same green and the nesting still exists but carries no ordering. The reader must read all four labels and infer the sequence from domain knowledge — the image stops working at thumbnail size and stops working for anyone unfamiliar with the topic.
- **The bands are circle segments that occlude one another rather than stacked rectangles, so each tier is literally drawn as contained by the one below it (measured radii ~480-1170px, crowns at 18%, 37%, 54%, 71%).**
  Without it: Swap to four stacked bars and the containment claim vanishes — the graphic degrades into a list of four parallel categories. The argument "you cannot reach revenue impact without passing through productivity gains" is carried entirely by the geometry, never by the copy.
- **A near-white arc-bent banner sits exactly ON each dome crown, so the tier name and the band boundary are the same object.**
  Without it: Move the label into the band body and the crown line becomes the only separator. At 220px the crown line between two adjacent tints is a 1px edge — the reader loses the ability to count tiers, which is the one thing that currently survives the thumbnail.
- **Every tier repeats an identical 5-slot skeleton: banner label → bold claim → parenthetical aside → 2 left notes (stat/quote) → 1-3 right items (capability nouns). The left/right split is semantic: numbers and quotes go left, example nouns go right.**
  Without it: Break the skeleton on one tier — put a stat on the right, or give one tier three notes — and the eye stops predicting slot positions. The 18 small strings scattered around four curved fields become one undifferentiated cloud and each band must be scanned in full instead of sampled.
- **The accent #D4F252 fires exactly once, on the final two headline words, and the only dark mass in the image is the 4.6% footer bar.**
  Without it: Highlight a number in each tier as well and the thumbnail acquires five competing entry points across a field that is otherwise a single hue. The current image has precisely one place for the eye to land at scroll speed; adding a second accent costs the first one its function.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- The circular photographic headshot in the footer. There is no way to produce a photograph of a person from HTML/CSS/SVG, and no external asset loading is available.
- Nothing else is a genuine blocker. The arc-warped banner text initially looks like a Photoshop/Illustrator warp, but measurement (label center 40px higher than its ends over a ~400px span) shows it is a plain curved baseline, which SVG <textPath> reproduces natively.
- The subtle vertical darkening inside each dome (e.g. #AEE264 at the crown toward #A0D15E at the flanks) is a linear-gradient, reachable.
- Font identity is a soft blocker, not hard: the ultra-condensed headline is closely matched by Anton on Google Fonts, but the humanist-geometric body face is not exactly available — Figtree or Manrope shift the character of the small copy slightly.

**Honest substitutes.**

- Headshot → a 26px circle filled #D4F252 with the author's initials in #111425 at ~700 weight. This preserves the information job (a recognizable personal mark next to the name) and keeps the footer's two-accent discipline. Do NOT substitute an emoji face — that is worse than absence and reads as a placeholder.
- If no initials mark is wanted, drop the avatar entirely and set the name at ~700 weight in #A2E43A. The follow CTA loses nothing structural; the face was doing recognition work that a template cannot do anyway.

**Implementation notes.** Frame: a 1080x1350 div, overflow:hidden, background #FAFFEB, position:relative. Domes: one inline SVG at 1080x1350 with four <circle> elements painted back-to-front, cx=540, cy=(crownY + r), r per tier — measured approximations r≈966/1166/580/480 for crowns at y=244/495/731/959. Each circle gets fill="url(#gradN)" where gradN is a <linearGradient x1=0 y1=0 x2=0 y2=1> from the tier tint to the same tint at ~92% lightness. Circles must overflow the viewBox horizontally so the flanks exit the left/right edges — do not clip them to the canvas width or the bands acquire visible corners. Equivalent CSS-only route: four absolutely positioned divs with border-radius:50%, width/height = 2r, left:50%, transform:translateX(-50%), top:(crownY - 2r + ... ) — workable but the SVG version keeps the crown Y as a direct parameter instead of a derived one. Arc banners: inside the same SVG, per tier a <path id="arcN" d="M x0,y0 Q 540,(y0 - sagitta*2) x1,y0" fill="none">, then TWO uses of it — first a copy of the path with stroke=#FFFFFF, stroke-width=~62, stroke-linecap=round to draw the banner body, then <text><textPath href="#arcN" startOffset="50%" text-anchor="middle">LABEL</textPath></text> in ~800 weight caps, letter-spacing ~0.02em. Sagitta = 8-10% of label width. Headline highlight: an inline <span style="background:#D4F252"> with ~0.06em horizontal padding and NO border-radius — the corners are sharp in the original; add a small negative margin so the block does not widen the line. Annotation blocks: do NOT use shape-outside or a flowing column. Each of the 8 left notes and 10 right items is its own absolutely positioned div with text-align:center and an explicit top/left (or top/right) — this is what produces the outward step that traces the dome edge, and a shared column would destroy it. Footer: position:absolute, bottom:0, height:62px, background:#111425, display:flex, justify-content:space-evenly, align-items:center. Repost glyph: 18px inline SVG, two chasing arrows, stroke ~#A2E43A, stroke-width 2, fill none.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `tier_count` | integer | 3-5. Must equal the number rendered in headline_count and the length of tiers[]. Below 3 the nesting reads as a target/bullseye rather than a ladder; above 5 the top dome's lens is too narrow for a 3-line claim. | 4 |
| `headline_count_word` | string | The numeral, 1-2 characters, rendered as part of headline_lead. | 4 |
| `headline_lead` | string | ALL CAPS, 8-14 characters including the numeral and spaces. Combined with headline_highlight must stay ≤20 characters total on ONE line. | 4 LAYERS OF |
| `headline_highlight` | string | ALL CAPS, 4-9 characters. Rendered on the accent block. Must be the topic noun, never a verb or a qualifier. | AI ROI |
| `tiers` | list<{label,claim,aside,left_notes,right_items}> | Length = tier_count. Ordered BOTTOM-FIRST in the data (entry tier at index 0), rendered top-last. Index 0 gets the palest fill and the largest area. | [COST SAVINGS, PRODUCTIVITY GAINS, REVENUE IMPACT, BUSINESS MODEL SHIFT] |
| `tiers[].label` | string | ALL CAPS, 10-22 characters, ONE line, no punctuation. Rendered on the arc banner. Longer than 22 characters and the banner exceeds the dome crown's flat span. | BUSINESS MODEL SHIFT |
| `tiers[].claim` | string | Sentence case, 25-72 characters, wraps to 1-3 lines, centered. Should begin with the same word across all tiers to telegraph parallelism at thumbnail size (here every claim starts with "Where"). No terminal period on 1-line claims. | Where AI stops being a tool and becomes the reason the business exists. |
| `tiers[].aside` | string | Optional, ≤46 characters INCLUDING the surrounding parentheses, 1-2 lines, lowercase first letter. Must be present on at most tier_count-1 tiers — leave the top tier without one so the highest band stays the least cluttered. | (most companies never get here) |
| `tiers[].left_notes` | list<string> | Exactly 2 per tier, each ≤46 characters wrapping to 2-3 lines. Reserved for numbers and quotes. Format "Bold lead-in: plain value" — everything before the colon renders at ~700 weight. Note 2 renders further outward (further left) than note 1. | ["Typical impact: 5–15% revenue lift", "Board reaction: “Now we're talking.”"] |
| `tiers[].right_items` | list<string> | 1-3 items per tier. If 3 items: each ≤22 characters, 1-2 lines each. If 1 item: ≤50 characters over 3 lines. Reserved for concrete example nouns only — never a statistic, never a quote. Each successive item renders further outward (further right) than the one above it. | ["AI-native products", "New revenue streams", "Competitive moats"] |
| `tint_ramp` | list<hex> | Length = tier_count, ordered palest-first. Adjacent entries must differ by ≥12% relative lightness or the bands merge at thumbnail size. The palest entry must differ from page_bg by ≥8% lightness or the bottom band disappears. Single hue only. | [#D8F6AE(sampled #E8FFC9), #DDFDB1, #C0E987, #ADE164] |
| `page_bg` | hex | A near-white tinted with the same hue as the ramp, not pure white. Must be lighter than tint_ramp[0]. | #FAFFEB |
| `accent_hex` | hex | Used in exactly ONE place: the headline highlight block. Must be more saturated than every entry in tint_ramp so it does not read as a fifth tier. | #D4F252 |
| `ink_hex` | hex | Near-black. Must hold ≥7:1 contrast against tint_ramp's darkest entry, since body copy sits on the darkest band. | #010602 |
| `footer_bg / footer_accent` | hex | footer_bg is the only dark mass in the composition; footer_accent is a deeper sibling of accent_hex so the two greens do not read as the same ink. Bar height fixed at 4.5-5% of canvas. | #111425 / sampled ~#A2E43A |
| `footer_follow_text / creator_name / footer_share_text` | string | follow_text ≤16 characters ending in a hook word; creator_name ≤20 characters; share_text ≤22 characters. All three plus two glyphs must fit one 1080px line at body size. | "Useful? Follow" / "Jonny Tooze" / "Repost to your network" |
| `avatar_initials` | string | 1-3 characters. Fallback for the photographic headshot, rendered in ink_hex on an accent_hex circle. Omit the circle entirely rather than substituting an emoji. | JT (substituting the photo) |
| `crown_positions_pct` | list<string> | Length = tier_count, ordered top-first, monotonically increasing. Spacing between adjacent crowns must be ≥15% of canvas height to fit banner + claim + aside. Bottom tier's crown should sit at ~70-72% so the entry tier gets the largest annotation area. | [18.1%, 36.7%, 54.1%, 71.0%] |
| `dome_radii_px` | list<string> | Length = tier_count. Each dome's flanks must exit the left and right canvas edges ABOVE the next crown down, or the bands cross. Measured range here 480-1170px at 1080px canvas width; upper tiers use larger radii (flatter arcs), lower tiers tighter. | [~966, ~1166, ~580, ~480] |

### Design-tell audit against PRD §10

**Violates (2).**

- "Everything centered" — the entire spine is centered: headline, all four banner labels, all four claims, all three asides, and even the left/right annotation blocks are individually center-set. The creator got away with it, and the rule is wrong here: the composition is radially symmetric by construction, so centering is derived from the geometry rather than defaulted to. The test is whether an off-center alternative exists — with concentric domes it does not.
- "Eyebrows of any sort" — the four arc banners are functionally eyebrows: short caps labels that precede a body statement. They earn their place because each one also marks a geometric boundary (it sits on the dome crown), which a floating eyebrow above a headline never does. The rule holds for decorative eyebrows and fails for load-bearing ones; this is the second kind.

**Avoids (6).**

- No purple-to-blue gradient — a single-hue lightness ramp doing semantic work.
- No three equal cards in a row — no cards at all; the containers are nested, not tiled.
- No default Inter or Poppins — an ultra-condensed display face at 6.5x body cap paired with a humanist sans, with tracking tuned on the large size.
- No drop shadows — the banners sit on their domes with zero shadow; separation is done by fill contrast alone.
- No generic icon set, no decorative icons anywhere in the four bands. The only glyph in the image is the repost mark in the footer, which is a functional platform affordance drawn as a real mark, not an emoji.
- No title-only opening — the headline shares its 13% with nothing, but the first tier begins at 13% and the frame is a single image with information from the first inch down.

**New tells this image implies, not currently on the list (6).**

- A tint ramp generated by evenly lightening one hue will land its last one or two steps within a few percent of the page background — here the bottom band drops the measured ink density from 61 to 31 and nearly stops registering as a band. Ramps must be checked against the background, not just against each other.
- A hierarchy image with no arrow, no numbering, and no axis label forces the reader to infer direction from color alone. This one is read top-down by scroll habit but is authored bottom-up (COST SAVINGS is where journeys start), so the narrative runs against the reading order with nothing on the canvas to correct it.
- Arc-warped text whose curve radius does not match the shape underneath it visually detaches the label from the thing it names. The banners here are measurably tighter (sagitta implies r≈508) than the dome beneath the top tier (r≈966) and it survives only because the banner's own white body re-anchors it.
- Statistics placed in body-size copy are invisible at feed size. If a number is the reason the graphic exists, body copy is the wrong slot for it — this image hides all five of its numbers below the thumbnail threshold.
- A footer bar in a color that appears nowhere else in the composition (#111425 against an entirely green page) reads as platform chrome bolted onto the artwork rather than part of it.
- Text blocks positioned to hug a curve must step outward line-group by line-group. Setting them as one flowing column with uniform indent collides with the arc on outer tiers and strands them in dead space on inner ones.

### Failure modes when copied badly

- The tint ramp is generated by evenly lightening one hue, and the last two steps land within a few percent of the page background — the bottom two tiers stop reading as separate bands and the ladder appears to have two rungs, not four.
- A tier's claim runs to 3 lines when the template budgeted 2, pushing its annotation text down into the dome below; two tiers' small copy then sits on adjacent baselines and reads as one paragraph belonging to neither.
- The numeral in the headline stops matching the number of drawn domes after an edit — "5 LAYERS OF" over four bands.
- Every tier gets a parenthetical aside because the slot exists, and the asides accumulate into a second competing body-copy layer that halves the weight of the bold claims.
- Right-column items are given a uniform indent instead of stepping outward, so on the top tier they overrun the dome edge onto the page background and on the bottom tier they float in a lake of empty tint.
- The two population numbers are invented independently (e.g. 88% stop at tier 2, 40% reach tier 4) and are arithmetically impossible together, with nothing on the canvas to expose it.
- Someone reaches for a second accent color to highlight a statistic inside a band; the thumbnail then has two entry points on a monochrome field and the headline highlight loses its job.
- The arc banners are implemented as rigid CSS rotate() instead of a curved baseline, so the label ends sit visibly off the dome crown on one side and the banner reads as a tilted sticker rather than a band marker.
- The claims stop starting with the same word across tiers, and the parallel structure — the one piece of the body copy that survives 220px — disappears.

### Topic fit

- **Fits when.** 3-5 ordered stages of a single progression where each stage CONTAINS the ones beneath it and progressively fewer parties reach each successive stage. Maturity ladders, adoption tiers, funnel stages framed as attrition, skill levels, Maslow-shaped hierarchies, spend/return tiers. The form is strongest when the top tier is genuinely rare and there is a number to prove it.
- **Breaks when.** The items are parallel, non-nested categories (four channels, four personas, four tools) — the concentric geometry then asserts a containment that does not exist and the graphic lies. Also breaks when two tiers deserve equal weight, since the lightness ramp forces a strict rank; when the sequence is cyclical rather than ascending; when there are more than 5 stages (top dome's lens goes too narrow for a claim) or fewer than 3 (reads as a bullseye/target); and when no stage has supporting numbers or quotes, which leaves 18 annotation slots to be filled with restated label text.
- **Input signature that should trigger selecting it.** Trigger this archetype when the raw material is: 3-5 named stages in a fixed order, each carrying (a) a one-sentence definition of what is actually happening at that stage, (b) at least one quantitative result or verbatim reaction, and (c) 1-3 concrete examples — AND the ordering implies containment or attrition rather than mere sequence.

<details>
<summary>All visible text, in reading order</summary>

4 LAYERS OF AI ROI | BUSINESS MODEL SHIFT | Where AI stops being a tool and becomes the reason the business exists. | The 6%: Redefining how businesses operate | AI isn't a tool. It's the product. | AI-native products | New revenue streams | Competitive moats | REVENUE IMPACT | Where AI stops saving money and starts making it | (most companies never get here) | Typical impact: 5–15% revenue lift | Board reaction: “Now we're talking.” | Faster time-to-market | New capabilities | Customer-facing AI | PRODUCTIVITY GAINS | Where individuals get faster | (and companies mistake that for transformation) | Reality: 88% of companies stop here | No visible P&L impact | Individual output increases up to 5x in some roles | COST SAVINGS | Where every AI journey starts | (where most boards stop saying thank you) | Typical impact: 10–20% cost reduction | Board reaction: “Good, but where's the growth?” | Reduced manual hours | Fewer contractors | Lower costs | Useful? Follow Jonny Tooze | Repost to your network

</details>

---

## 9. mirrored nested-ring bullseye
**File:** `Pierre Herubel/1779350433281.jpeg` · **Creator:** Pierre Herubel

A single bullseye of three nested rings, sliced in half across the middle so the top half is the green "done right" version and the bottom half the red "done wrong" version of the same three-layer model, with ~33 short label chips scattered into the rings they belong to.

**Information job.** "This thing has three stacked layers — which layer does each symptom I recognize actually live in, and what does the good and the bad version of each layer look like side by side?" It converts a flat good/bad list into a diagnosis instrument: the reader finds their own symptom chip, sees which ring it sits in, and learns that the ring below it is the real cause.

### Where the idea came from

**Likely origin.** A framework they teach — a three-tier model (Strategy → Copywriting → Design) that the creator sells or consults on, dramatized by pairing every good attribute with its failure twin.

**Evidence in the image.** The three ring labels are explicitly numbered '1.Clear Strategy', '2.Pertinent Copywriting', '3.Beautiful Design' and repeat verbatim in negated form on the red half ('1.Unclear Strategy.', '2.Irrelevant Copywriting', '3.Poor Design'). The numbering runs core→rim, which is a taught causal order, not a data ordering. Many chips are direct antonym pairs ('Strong Hooks'/'Weak Hooks', 'Clear ICP'/'No ICP', 'Easy to Read'/'Hard to read', 'Specific Positioning'/'Broad Positioning'), which is authored symmetry, not observed data.

**The generative question, portable to any niche.** Take a three-layer model you teach where layer 1 causes layer 2 causes layer 3. For each layer, list 4-7 short symptoms of doing it well and 4-7 short symptoms of doing it badly, pairing them as antonyms wherever possible. Render as one bullseye split at the equator: good version above, bad version below.

### Headline and subtitle

> Good vs. Bad Content

- **Words:** 4
- **Form:** Bare comparison label, no verb. Typographic emphasis does the work: 'Good' and 'Bad Content' in heavy upright weight, 'vs.' in heavy italic, and two short thick rules underneath — a green rule under 'Good' and a red rule under 'Bad' — which assign the two hues their meaning before the diagram starts.
- **Promise:** You will be shown, attribute by attribute, what separates the working version from the failing version of the same thing.
- **Subtitle:** *none*
- **What the subtitle does that the headline cannot:** none — the three numbered arc banners inside the diagram do the scoping work a subtitle would normally do

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 0-3.5% | Top white margin | Only real breathing room on the page; keeps the headline from touching the crop. | Empty except the faint ~51px graph-paper grid (#F1F1F1 hairlines) that covers the whole canvas. |
| 3.5-11% | Headline block with color-key underlines | States the comparison and, critically, binds green=good / red=bad before the reader enters the rings. | "Good vs. Bad Content" set nearly edge to edge (L1.8% to R1.2%), plus a green rule under 'Good' and a red rule under 'Bad' on the line below (the band-3 ink value of 10 is those two rules alone). |
| 14-54.5% | Positive semicircle — three nested rings | The good version of the model. Depth = causal priority, ring 1 at the core. | Outer ring #E0EFDA (radius 48.5% of width), mid ring #B4E1A0 (r≈35%), core #7ED551 (r≈22%), all centered on x=50.4%, y=54.5%. Three curved capsule banners in #5ACA07 with white text sit ON each ring's top arc: '3.Beautiful Design' straddling the outer arc top (13.5-17.3%), '2.Pertinent Copywriting', '1.Clear Strategy'. 17 translucent-white label chips distributed 5 core / 5 mid / 7 rim. |
| 54.2-54.8% | Equator | Hard butt joint that makes the two halves one object rather than two diagrams. | No rule, no gap, no label — green ends at y=868px and red begins at y=876px, sharing the same circle center and the same three radii. |
| 54.5-93% | Negative semicircle — three nested rings | The failure twin of every ring above it, positioned so ring 1 red is directly below ring 1 green. | Outer #FED2D5, mid #FEACB0, core #FF777B at identical radii. Three curved capsule banners in the saturated red with white text on each ring's bottom arc, read in the same core→rim order: '1.Unclear Strategy.', '2.Irrelevant Copywriting', '3.Poor Design' at the very bottom arc (~92-95%). 16 chips distributed 4 core / 5 mid / 7 rim. |
| 86-97.5% | Footer / attribution | Signature. Deliberately small and outside the diagram. | Italic "Pierre Herubel" bottom-left in black on white, and a circular photographic headshot bottom-right overlapping the red outer ring. Band 20 ink of 8 is these two objects only. |

### Reusable skeleton

```
+--------------------------------------------------+
|                                          (grid bg)|
|  HEADLINE-A  vs.  HEADLINE-B                      |  3.5-11%
|  ====green====    ===red===                       |
|                                                   |
|            [ curved banner: 3.OUTER+ ]            |  ~14%
|      .-------------- ring3 + --------------.      |
|    /   chip      [ curved banner: 2.MID+ ]  \     |
|   /  chip   .------- ring2 + -------.   chip \    |
|  | chip    /   chip  [ 1.CORE+ ]  chip \  chip |  |
|  | chip   |   ( ring1 +   row of chips ) | chip|  |
|  | chip   |     row of chips ... row     |     |  |
+==|========|============================|=|=====|==+  54.5%  <-- shared center
|  | chip   |     row of chips ... row     |     |  |
|  | chip   |   ( ring1 -   row of chips ) | chip|  |
|  | chip    \  chip  [ 1.CORE- ]   chip  /  chip|  |
|   \  chip   `------- ring2 - -------'   chip /   |
|    \   chip      [ curved banner: 2.MID- ]  /     |
|      `-------------- ring3 - --------------'      |
|            [ curved banner: 3.OUTER- ]            |  ~93%
|  byline (italic)                        (avatar)  |  94-97%
+--------------------------------------------------+
Chips are NOT polar-placed: each half is a vertical stack of
centered flex rows; a row's chips spread to the chord width of
whichever ring they belong to, flank chips pushed to the edges.
```

### Type system

- **Families.** One family throughout. Humanist/neo-grotesque sans with slightly softened terminals, double-story 'a', single-story 'g' with an open curved tail, straight-tailed 'y'. Guess: Apple SF Pro or Avenir Next (this reads as a Keynote/Canva default rather than a web font). Closest Google Fonts substitutes: Figtree or Nunito Sans; Manrope is the fallback if a tighter grotesque is wanted.

- **Headline : body.** headline ~3.0x chip text by cap height (headline cap-height ~86px against ~28px chip caps at 1280px wide). Arc-banner text sits between at ~1.4x chip text.

- **Weights.** Three: headline at the family's heaviest (800-900) with one italic word ('vs.'); arc banners at semibold/bold in white; chip labels at regular/medium in near-black #050504. Byline is italic regular.

- **Case.** Title Case everywhere — headline, banners, and chips. Zero all-caps, zero small caps, no eyebrow label anywhere on the page. Casing is inconsistent by hand in places ('Hard to read', 'Confusing layout' lowercase the second word while their green twins do not), which is authoring noise, not a system.

- **Typographic moves.** Two-color underline rules under the headline's two contrast words, used as a legend. Underline on the last word of every arc banner ('Design', 'Copywriting', 'Strategy') so the layer noun pops out of the curved text. Chips are rounded pills of translucent white rather than boxed text. Numeric prefixes fused to the label with no space ('3.Beautiful Design') to keep the arc short.

- **Hard line limits.** Headline 1 line, 20 characters. Arc banner labels 1 line, max 24 characters ('2.Irrelevant Copywriting'). Chips 1 or 2 lines, max 21 characters ('Shiny Object Syndrome'), max ~11 characters per line when wrapped to two ('Consistent / Branding'). No chip runs 3 lines.

### Color logic

- **Roles.** Page bg #FFFFFF pure white, overlaid with a ~51px graph-paper grid of ~#F1F1F1 hairlines (too light to register in the content-color histogram). Primary ink #050504 at 5% — headline, byline, and every chip label. POSITIVE ramp, dark to light inward-out: core #7ED551 (5%), mid ring #B4E1A0 (10%), outer ring #E0EFDA (14%); arc banners and the headline's 'Good' underline in the saturated #5ACA07 (3%). NEGATIVE ramp, same three steps: core #FF777B (5%), mid #FEACB0 (10%), outer #FED2D5 (18%); arc banners and the 'Bad' underline in the same saturated red family. Chips are not a color — they are white at roughly 45-50% alpha over whatever ring they sit on, measured as #AAE18D over the green core and #F6E4E4 over the red outer ring.
- **Distinct hues.** 2
- **Does color mean anything.** Fully semantic and doing all the heavy lifting. Hue = verdict (green good / red bad); lightness within a hue = depth in the model, with the saturated end at the causal core. No chip anywhere carries the word 'good', 'bad', or 'avoid' — the hue is the only thing telling you which list you are reading.
- **Accent discipline.** The two saturated accents (#5ACA07 and the matching red) appear only on the six arc banners and the two headline rules — under 5% of ink combined against 42% for the six pale ring fills. Everything with high chroma is a label of a layer; everything else is a field.

### Data dependency

- **Needs external data.** no
- **What would have to be true.** None. This is a taught opinion framework: three named layers, and two authored lists of short attributes per layer. Nothing here is measured, and nothing carries a number, unit, date, or percentage.
- **Provenance shown on the image.** None on the image beyond the author signature — italic "Pierre Herubel" bottom-left plus a circular headshot bottom-right. No source line, no date, no URL.
- **Fabrication risk.** Very low as a factual matter and that is exactly the trap. An AI can fill all 33 chips plausibly for any topic without knowing anything, so the failure is not a visible lie but generic filler: chips like 'Vague & Generic' or 'Buzzwords' that could belong to any of the three rings and any topic. The visible tell is misassignment — a symptom sitting in the wrong ring — which only a practitioner catches, so the form silently rewards confident nonsense. Any version of this that must show a metric should be rejected: there is nowhere on the layout to put one.

### Attribution

{"verbatim_text": "Pierre Herubel", "position": "Italic, bottom-left, at ~94-96% vertical, on white below the red circle. Circular photographic headshot bottom-right, ~180px diameter (14% of width), overlapping the red outer ring, with a thin dark ring border.", "size": "Byline cap-height is roughly the same as a chip label — about 1/3 of the headline. The headshot is the second-largest single object on the page after the circles.", "reads_as": "Signature, not CTA. No handle, no logo, no 'follow me', no 'repost this', no arrow. The pairing of a small italic name with a photograph is the whole ask — recognition on the next scroll, not a click."}

### Density

- **Words:** 85 · **Discrete elements:** 50 · **Words per element:** 1.7 words per element (33 chips at 1.9 words each, 6 arc banners at 2 words each, headline 4)
- **Whitespace read.** 58% ink and it reads as dense, which the measurement and the eye agree on for once. Only the top strip and the four corners are white — the circles run to 1.8% of the left edge and 1.2% of the right. What keeps it from being unreadable is not whitespace but a two-level separation system: the ring tints separate groups, and the translucent chips separate items inside a group. Kill either one and 33 labels on a colored field collapse into noise. There is no local breathing room anywhere inside the diagram; the gaps between chips are a few pixels.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** The headline "Good vs. Bad Content" is fully readable, including the green and red rules under the two contrast words. The whole gestalt lands: one circle, split at the equator, green above and red below, with three visibly nested rings on each side. The six arc banners survive as colored curved shapes and the largest two or three are borderline readable in outline. The circular headshot reads as a face. You know within one second what the image is arguing.
- **Dies.** Every one of the 33 chip labels. They render as gray hyphens on a tinted field — you can count roughly how many there are and see they get denser toward the core, but not one word is recoverable. The arc-banner text is mostly gone; the numbers '1./2./3.' are not readable, so the ordinal structure that makes the diagram a causal model is lost. The byline 'Pierre Herubel' is illegible. Underlines inside the banners disappear entirely.
- **Rule this proves.** The form must be the hook and the payload must be the reward for tapping. Anyone rebuilding this should put the entire argument in the headline plus the two-color split, treat the 33 chips as texture at feed size, and never rely on a chip label to carry the point. Corollary: the ordinal numbers on the arcs must be duplicated somewhere legible at 220px, or the reader has to open the image to learn there is even an order — this image does not do that, and gets away with it only because 'good above / bad below' is self-explanatory without the numbers.

### Why it works, and what breaks without it

- **Both halves are the same circle: identical center (x 50.4%, y 54.5%) and identical three radii (48.5% / 35% / 22% of width), mirrored across the equator, so ring 1 green sits directly opposite ring 1 red.**
  Without it: Offset the two halves or change a radius and the reader loses the vertical correspondence — 'Clear Strategy' and 'Unclear Strategy' stop being the same slot, and the image degrades into two unrelated word clouds that happen to be different colors.
- **Ordinal numbers fused to the ring labels ('1.Clear Strategy' at the core, '3.Beautiful Design' at the rim) impose a direction on nesting.**
  Without it: Nesting alone has no inherent direction — a reader cannot tell whether the core is the foundation or the afterthought. Strip the numbers and the causal claim (strategy causes copy causes design) evaporates; you are left with a Venn-ish shape that says only 'these things are related'.
- **Label chips are white at ~45-50% alpha, not opaque white, so each chip tints with the ring beneath it (#AAE18D over the green core, #F6E4E4 over the red rim) while still lifting the black text off the field.**
  Without it: Make them opaque white and 33 hard white boxes punch holes through the three-tint gradient; the ring boundaries stop being readable and the depth-equals-priority system dies. Remove the chips entirely and black text on #7ED551 vs #B4E1A0 has no consistent contrast floor.
- **Exactly two hue families and nothing else. Hue carries the entire good/bad verdict; lightness inside a hue carries depth.**
  Without it: Add a third hue and one of the two axes stops being decodable. Remove the hue split and every one of the 33 chips needs a prefix word ('avoid:', 'do:'), which at 1.9 words per chip roughly doubles the word count and breaks the one-or-two-line chip constraint.
- **The headline underlines are a legend disguised as typography: a green rule under 'Good', a red rule under 'Bad', read before the eye reaches the diagram.**
  Without it: The color reading falls back on cultural convention alone. That happens to work for red/green, so the mechanism looks decorative here — but the moment the archetype is reskinned to any palette without a built-in valence (blue vs orange, teal vs purple), removing the underlines makes the top and bottom halves ambiguous and the reader has to parse chip text to work out which half is the good one.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- The circular photographic headshot bottom-right. A photograph cannot be produced by HTML/CSS/SVG and no external asset is allowed.
- Underlining the last word inside curved SVG textPath text. Chromium does render text-decoration on a tspan inside a textPath, but the result is fragile and can drop or misplace on tight radii — treat it as unreliable rather than impossible.
- The exact typeface. It reads as a system font (SF Pro / Avenir Next), not a Google Font, so the headline's specific letterforms cannot be matched exactly.

**Honest substitutes.**

- Headshot → a same-diameter circle filled with the accent hue and the author's two initials in white heavy weight, same position, same thin dark ring border. Keeps the signature-object role and the corner weight. Do not drop it: the bottom-right corner is otherwise the only large empty area in the negative half and the composition tilts left without it.
- Curved-text underline → draw a second SVG arc path of the same radius, offset outward by ~18px, stroked 3px in white, with stroke-dasharray computed to cover only the last word's span. If the dash math is not worth it, drop the underline and set the last word in a heavier weight instead — the emphasis job survives, the ornament does not.
- Typeface → Figtree 800 for the headline with letter-spacing tightened to about -0.02em, Figtree 600 for arc banners, Figtree 400/500 for chips. Nunito Sans if softer terminals are wanted. Both are on Google Fonts.

**Implementation notes.** Rings: six absolutely-positioned square divs, all sharing left:50.4%; top:54.5%; transform:translate(-50%,-50%); border-radius:50%, at widths 97%/70%/44% of the canvas, with the green three clipped by clip-path:inset(0 0 50% 0) and the red three by clip-path:inset(50% 0 0 0), painted rim-first so the core stacks on top. Background grid: repeating-linear-gradient in both axes, 51.4px pitch, #F1F1F1 1px lines, on #FFFFFF. Chips: NOT polar-placed — build each half as a vertical flex column of rows, each row display:flex with a fixed max-width equal to the chord of its ring at that height; rows that carry flank items use justify-content:space-between at a wider max-width, rows inside the core use justify-content:center. This is what the image actually does and it removes all trig from the template. Chip itself: background:rgba(255,255,255,.5); border-radius:10px; padding:6px 14px; color:#050504; text-align:center; no shadow, no border. Arc banners: one inline SVG per banner, a single <path> arc drawn with stroke-width ~54, stroke-linecap:round and the accent hex — a stroked round-capped arc IS the capsule, no separate shape needed — plus a <text><textPath href="#thatSamePath" startOffset="50%" text-anchor="middle"> in white for the label. Headline rules: two inline-block spans with border-bottom:8px solid, one #5ACA07 and one in the red accent, sized to the words they sit under. Whole page fixed at 1080x1350 with everything in absolute percentage units so the 0.800 ratio survives the resize from 1280x1600.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline_positive_word` | string | 1-2 words, max 8 characters. Gets the positive-accent underline. | Good |
| `headline_connector` | string | Max 5 characters, set in italic. Usually 'vs.' | vs. |
| `headline_negative_phrase` | string | 1-2 words; the first word gets the negative-accent underline. Whole headline must stay on ONE line and total 16-24 characters including spaces. | Bad Content |
| `positive_ramp` | list<hex> | Exactly 4 hexes: [core, mid, rim, accent]. Core must be the most saturated of the three fills, rim the palest; black text at 50% white overlay must clear 4.5:1 on all three. | ["#7ED551", "#B4E1A0", "#E0EFDA", "#5ACA07"] |
| `negative_ramp` | list<hex> | Exactly 4 hexes, same structure and same lightness steps as positive_ramp so the two halves read as one object. Hue must be unambiguously opposed to the positive hue. | ["#FF777B", "#FEACB0", "#FED2D5", "#F35856"] |
| `layers` | list<{index,positive_label,negative_label}> | EXACTLY 3, ordered core to rim. Each label is prefixed with its index and a period, no space after the period. Max 24 characters per label including the numeric prefix; must fit on one arc line. positive_label and negative_label must be the same noun with opposed adjectives. | [{1,"1.Clear Strategy","1.Unclear Strategy."},{2,"2.Pertinent Copywriting","2.Irrelevant Copywriting"},{3,"3.Beautiful Design","3.Poor Design"}] |
| `positive_core_items` | list<string> | 4-5 items. Max 21 characters each, must fit 1 line. Laid out as centered rows of 1-2 chips. | ["Strong Messaging","Relevant Goals","Focus","Specific Positioning","Clear ICP"] |
| `positive_mid_items` | list<string> | 5 items. Max 21 characters, may wrap to 2 lines of ~11 characters. One item sits centered at the top of the ring, the rest split left/right flanks. | ["Capability + Outcomes","Unique Insights","Clear Copy","Strong Hooks","Easy to Read"] |
| `positive_rim_items` | list<string> | 7 items. Max 21 characters, may wrap to 2 lines. One centered at the arc top, three per flank. | ["Skimmable","Worth Saving","Signature Visuals","Easy to Read","Consistent Branding","Copy Amplifier","Visual Hierarchy"] |
| `negative_core_items` | list<string> | 4-5 items, same count as positive_core_items ±1. Max 21 characters. Each SHOULD be the antonym of the positive item in the same slot. | ["Shiny Object Syndrome","Broad Positioning","No ICP","Random Messaging"] |
| `negative_mid_items` | list<string> | Exactly the same count as positive_mid_items (5). Max 21 characters, 2 lines max. | ["Weak Hooks","Vague & Generic","Poor Insight","Unclear CTAs","Buzzwords"] |
| `negative_rim_items` | list<string> | Exactly the same count as positive_rim_items (7). Max 21 characters, 2 lines max. | ["Stock Images","Confusing layout","Hard to read","Off-brand","Distracting visuals","Cluttered Visuals","Inconsistent"] |
| `byline` | string | Max 22 characters, italic, bottom-left. Name only — no handle, no URL, no CTA verb. | Pierre Herubel |
| `avatar_initials` | string | 1-2 characters. Substitute for the photograph in the bottom-right circle; the circle is required for balance even if the initials are dropped. | PH |
| `show_background_grid` | enum | on / off. When on: 51px pitch, #F1F1F1 hairlines. Purely textural — it is invisible at thumbnail size. | on |

### Design-tell audit against PRD §10

**Violates (2).**

- "everything centered" — this image is centered on every axis: headline centered, both semicircles share one center at x 50.4%, all six arc banners centered on the vertical axis, core chip rows centered. The rule is wrong for this form, not merely survived: a radial diagram whose center is off-axis stops being a bullseye. The tell is aimed at layouts where centering is the absence of a decision; here centering IS the structure. Keep the rule, but exempt radially-symmetric forms explicitly.
- "default Inter or Poppins with no adjustment" — soft violation. The type here is an unadjusted system default (SF Pro / Avenir Next straight out of Keynote or Canva) with no tracking work visible at the headline size, which is the same failure the tell describes, just with a different default. The creator gets away with it because the headline is set so large and so heavy that letterform quality stops mattering; at 3.0x body weight 900, almost any humanist sans works.

**Avoids (8).**

- No purple-to-blue gradient — no gradient at all, every fill is flat
- No three equal cards in a row — no card grid anywhere
- No drop shadows: chips, banners, and rings are all flat, confirmed by pixel sampling (chip edges transition in 1-2px, which is antialiasing)
- No icon set, generic or otherwise — zero icons on the page
- No emoji
- Not a bare title slide — this is a single standalone image carrying its full argument
- No eyebrow label anywhere: no 'FRAMEWORK', no 'PART 1', no kicker above the headline
- No CTA: the attribution is a signature, not a follow prompt

**New tells this image implies, not currently on the list (6).**

- Opaque white label chips floating on a tinted field — kills the field's grouping signal. Chips over color must be translucent white (40-55% alpha) so the field reads through.
- A nested or radial diagram with no ordinal numbers on its layers. Nesting has no inherent direction; without 1/2/3 the causal claim is unreadable.
- A headline that names a two-sided contrast without color-coding the two sides IN the headline. The color legend belongs above the diagram, not inside it.
- A two-panel comparison whose panels have mismatched item counts in the same slot — asymmetry reads as sloppiness, not as data.
- Label text long enough to wrap to 3 lines inside a chip. 2 lines is the hard ceiling for this form; 3 breaks the row rhythm and pushes chips across a ring boundary.
- Casing drift inside one chip set ('Confusing layout' next to 'Consistent Branding'). Present in this image and it is a defect, not a style — enforce one casing rule across all chips.

### Failure modes when copied badly

- Ring area grows as r-squared, so the rim has roughly 3x the area of the core but here carries only 7 items against 5. Give every ring the same item count and the rim looks starved while the core is jammed shut; the weighting must increase outward.
- A 24-character banner label on the innermost arc wraps around and collides with its own start, or the letters squeeze into illegibility on the tight radius. The core banner is the shortest arc and needs the shortest label — inverting that pairing is the most common break.
- Good and bad items that are not semantic antonyms in matching slots. The mirror is the whole idea; fill it with two independently-brainstormed lists and it reads as two unrelated diagrams stacked, and the reader stops scanning vertically.
- Generic chips that could belong to any of the three rings ('Vague & Generic', 'Buzzwords', 'Inconsistent'). Present even in this image. Each chip must be diagnostic of exactly one layer or the ring assignment carries no information.
- Reskinned to a hue pair with no built-in valence (blue vs orange, teal vs purple) while dropping the headline underlines: the reader cannot tell which half is the desirable one and has to read chip text to find out.
- Selling the archetype on the chips. At 220px all 33 are texture. If the headline plus the color split does not carry the entire argument, the post dies in the feed before anyone reads a chip.
- Padding the item lists to hit the 5/5/7 counts. Every filler chip dilutes the ring it lands in, and there are 33 slots begging to be filled with nothing.
- Two-line chips wrapping unpredictably across renderers, pushing a chip out of its ring's fill and onto the neighbouring tint — which silently reassigns it to the wrong layer.

### Topic fit

- **Fits when.** You have a taught 3-layer model where the layers are causally ordered (layer 1 enables layer 2 enables layer 3), AND each layer has a recognizable good state and bad state with 4-7 short observable symptoms each. Ideal when the audience already recognizes the surface symptoms but misattributes their cause — the nesting is what relocates blame from the rim to the core. Also fits taxonomies where depth genuinely means 'more fundamental': org dysfunction, product quality, hiring, security posture, personal finance.
- **Breaks when.** The layers are peers rather than nested (three parallel functions, three market segments) — nesting then asserts a hierarchy that does not exist. Breaks on anything quantitative: there is nowhere to put a number, a unit, an axis, or a date. Breaks when there are 2 or 4+ layers — 2 gives you a target with no depth, 4+ makes the core ring too small to hold a banner plus chips. Breaks when the bad state is not a clean negation of the good state (a tradeoff, not a failure), because the mirror will assert a false symmetry. Breaks on any topic where item labels cannot be compressed to 21 characters.
- **Input signature that should trigger selecting it.** Exactly 3 nested/causally-ordered layers, each with 4-7 good-state attributes and 4-7 bad-state attributes, where the good and bad attributes pair as antonyms and every attribute fits in 21 characters. No numbers, no time dimension, no third category.

<details>
<summary>All visible text, in reading order</summary>

Good vs. Bad Content | 3.Beautiful Design | Skimmable | Worth Saving | 2.Pertinent Copywriting | Signature Visuals | Capability + Outcomes | Easy to Read | Unique Insights | 1.Clear Strategy | Clear Copy | Consistent Branding | Strong Messaging | Copy Amplifier | Strong Hooks | Relevant Goals | Focus | Easy to Read | Visual Hierarchy | Specific Positioning | Clear ICP | Stock Images | Shiny Object Syndrome | Confusing layout | Weak Hooks | Broad Positioning | No ICP | Vague & Generic | Random Messaging | Hard to read | Poor Insight | 1.Unclear Strategy. | Unclear CTAs | Off-brand | Buzzwords | Distracting visuals | 2.Irrelevant Copywriting | Cluttered Visuals | Inconsistent | 3.Poor Design | Pierre Herubel

</details>

---

## 10. object-complexity contrast split
**File:** `Pierre Herubel/1780040661804.jpeg` · **Creator:** Pierre Herubel

A white poster split in half by a dashed line: the top half shows one pink circle with one label ("push a button to get leads"), the bottom half shows a 4x4 Rubik's cube with five labels, so the outsider's version of a job and the practitioner's version sit one above the other at the same scale.

**Information job.** "Why does the thing I asked you for take five steps and three weeks, when it looks like one button?" — it answers by drawing the asker's mental model and the operator's mental model at identical scale and letting the label count do the arguing.

### Where the idea came from

**Likely origin.** A recurring stakeholder/client objection the creator keeps arguing against — not a dataset, not a framework he teaches.

**Evidence in the image.** "get leads" is set in curly scare quotes, which marks it as somebody else's words being reported. The fifth item ends in an italic non-parallel aside — "but also promote the last minute webinar" — which is a grievance only someone who has lived the interruption would write; no framework contains that line. There is no number, no source, no axis anywhere on the canvas, so nothing was measured.

**The generative question, portable to any niche.** What does an outsider believe [discipline] is — one single action they can name — versus the four sequential things a practitioner actually does, plus the one last-minute interruption that undoes all four? Draw the outsider's version as one simple shape with one label, the practitioner's as one intricate shape with five.

### Headline and subtitle

> How marketing is often perceived

- **Words:** 5
- **Form:** Declarative label-clause, no verb of assertion — it names a viewpoint rather than making a claim. Typographic emphasis: the final word "perceived" carries a solid ~4px underline. The paired lower headline, "How marketers see marketing", underlines the mid-sentence verb "see". Both headlines are ~52px, heaviest weight in the file, and both are optically centered on the canvas axis (measured centers x=541.5 and x=540.0).
- **Promise:** You are about to be shown the gap between what people think this job is and what it is — and the second half will be bigger than the first.
- **Subtitle:** *none*
- **What the subtitle does that the headline cannot:** none — there is no subtitle anywhere. The second headline at 53.1-57.1% functions as the counterpart half of a two-part headline, not as a subtitle; the callout labels do the scoping work a subtitle would normally do.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 5.9-9.9% | Headline A (perception) | States the frame of the top panel and pre-loads the contrast via one underlined word. | "How marketing is often perceived", ~52px heavy weight, #060405, centered at x=540, ink spans x=119-964. Band 1 = 19% ink; band 0 above it and band 2 below it are 0% — the headline floats in pure white. |
| 16.5-43.9% | Panel A — simple object + single callout | Draws the outsider's mental model as one primitive shape with exactly one thing to say about it. | Left: flat pink disc, fill #FEACB0, ~3px stroke sampled at #B33C34, diameter ~322px (23.9% of canvas height), centered near (305, 390); a black-outlined pointing-hand cursor overlaps its lower-right edge with a pale radiating starburst behind the fingertip. A ~1.5px black leader line begins INSIDE the disc (x~360) and runs horizontally right to x~610. Right: two-line callout "push a button to / “get leads”", ~46px, line pitch 63px, glyph runs at y=333-379 and y=396-442. Bands 3-7 = 11/26/35/31/20. |
| 43.9-53.1% | Full-bleed dashed divider + double gutter | Cuts the canvas into two separate realities rather than two sections of one document. | A single dashed black rule at y=665 (49.3%) running edge to edge, x=0 to x=1079 — this one element is the sole reason the measured side margins read L0.0/R0.2 while all real content sits inside x=55-1016 (5.1%-94.1%). Bands 8-9 = 2/2, the emptiest bands on the canvas. |
| 53.1-57.1% | Headline B (reality) | Mirrors Headline A word-for-word in structure so the only perceived difference is the underlined verb. | "How marketers see marketing", same ~52px weight and same centered axis (x=540), ink spans x=168-912, "see" underlined. Straddles bands 10 (10%) and 11 (7%). |
| 60.2-89.1% | Panel B — complex object + five-row callout list | Draws the practitioner's mental model at the same scale, and lets the label count (5 vs 1) carry the entire argument. | Left: isometric 4x4x4 cube, three visible faces, 48 quads, ~5px black #060405 outlines, tiles randomly filled from four pastels — #FEACB0 pink, #B4E1A1 green, #FFCF73 amber, #DEA8FE lilac. Right: five ~30px list rows on a 74-75px pitch, glyph bands at y=839, 914, 988, 1064, 1138; each fed by a thin black leader that starts inside the cube and runs right to x~560. Row 5 wraps to three lines (1138, 1176, 1212) with an italic tail. Bands 12-17 = 22/36/37/37/29/12. |
| 93.2-97.6% | Byline | Signature. Sized and placed so it never competes with the fifth list row above it. | ~59px circular photographic headshot at x=55, then "Pierre Herubel" in ~34px italic, black, ink spans x=55-351 — left-set, deliberately off the centered headline axis. Bands 18-19 = 7/4. |

### Reusable skeleton

```
+------------------------------------------------+ 0%
|                  (empty)                       |
|        HEADLINE A  ·word· underlined           | 5.9-9.9%   centered
|                  (empty band = 0% ink)         |
|  +----------+                                  |
|  |          |----------- callout line 1        | 16.5-43.9%
|  | SIMPLE   |            callout line 2        |  graphic LEFT
|  | SHAPE    |                                  |  text RIGHT
|  +---------(*) <- action glyph on the edge     |
|                  (empty)                       |
|- - - - - - - - - - - - - - - - - - - - - - - -| 49.3% FULL BLEED
|                  (empty)                       |
|        HEADLINE B  ·word· underlined           | 53.1-57.1% centered
|   /\                                           |
|  /  \  COMPLEX  |-------- item 1               | 60.2-89.1%
|  |   | SUBDIVID |-------- item 2               |  same left x
|  |   | -ED      |-------- item 3               |  as shape above
|  \   / SOLID    |-------- item 4               |  74px row pitch
|   \/            |-------- item 5 line 1        |
|                          item 5 line 2         |  <- breaks format
|                          item 5 line 3 italic  |
|                  (empty)                       |
| (o) Name in italic                             | 93.2-97.6%
+------------------------------------------------+ 100%
```

### Type system

- **Families.** One family throughout — a humanist/geometric sans with a double-storey 'a', single-storey 'g' with an open curved tail, near-circular 'o', horizontal-bar 'e', and curly typographic quotes. Guess: Avenir Next or Museo Sans (guess only). Nearest Google Fonts substitutes: Nunito Sans, then Manrope.

- **Headline : body.** Headline ~52px vs list body ~30px = headline ~1.75x body cap-height. Against the panel-A callout (~46px) the headline is only ~1.13x — the callout is nearly headline-sized, which is what keeps the sparse top panel from collapsing.

- **Weights.** Three: heavy/800 for both headlines (the only heavy weight on the canvas), regular/400 for the callout and list rows, regular italic for the fifth row's tail clause and for the byline name. No light weight, no small caps.

- **Case.** Sentence case everywhere. Zero all-caps, zero title case, zero eyebrow labels. The '&' in "Nail the positioning & messaging" is the only symbol substitution.

- **Typographic moves.** Single-word underline as the contrast device — "perceived" and "see" — solid rule, ~4px, sitting a few px below baseline; this is the entire emphasis system, there is no highlighter, no color text, no bold-in-line. Second trick: an italic clause tail inside an otherwise roman list row, used as the punchline. Curly quotes around "get leads" to mark reported speech.

- **Hard line limits.** Headlines: 1 line, hard — measured 845px of ink for 32 characters at ~52px, so ~36 characters is the ceiling before wrap. Panel-A callout: exactly 2 lines, ~16 characters each. List rows 1-4: exactly 1 line each, longest measured is "Align with sales for proper tracking" at 36 characters. List row 5: 3 lines, ~105 characters total. Byline: 1 line, 14 characters.

### Color logic

- **Roles.** Page background #FFFFFF (pure, no tint). Primary ink #060405 at 20% of content pixels — headlines, list text, cube outlines, leader lines, dashed divider, cursor outline. Dominant fill #FEACB0 at 33% — the simple-object disc AND one of the four cube tile colors, the single deliberate overlap between the two panels. Cube tile palette: #FEACB0 pink, #B4E1A1 green (6%), #FFCF73 amber (5%), #DEA8FE lilac (5%). The trailing #F5AFB2 / #DAACF4 / #FED06C entries at 3/2/2% are JPEG halo variants of the same three, not distinct hues. Disc stroke sampled at #B33C34 — a dark red, and the only stroke on the canvas that is not #060405.
- **Distinct hues.** 4
- **Does color mean anything.** Half-semantic. Pink means "the naive object" in panel A, and its reappearance in the cube quietly says the simple thing is one tile inside the complex thing. The other three hues carry no meaning at all — the tiles are randomized, deliberately, so the cube reads as combinatorial rather than as a chart. Nothing is coded good/bad.
- **Accent discipline.** There is no accent in the usual sense; there is one large flat mass per panel and nothing else colored. Color touches zero text, zero rules, zero headlines. #FEACB0 alone is 33% of all non-background pixels while the other three hues together are ~16%, so the canvas is functionally two-color (pink + black) with a three-hue confetti inside one object.

### Data dependency

- **Needs external data.** no
- **What would have to be true.** None. This is a concept image — two mental models drawn as objects. The only externally-anchored claim is the implicit one that outsiders think this way, which the scare-quoted "get leads" attributes to hearsay rather than measurement. Nothing on the canvas is a quantity.
- **Provenance shown on the image.** None beyond authorship: a headshot and "Pierre Herubel" at 93.2-97.6%. No source line, no date, no sample size, no methodology note anywhere.
- **Fabrication risk.** Near zero for the visuals — there is nothing to fabricate. The real risk is the item list: a model filling this template will invent five plausible-sounding steps for a discipline it does not practice, and because the form has no provenance slot, the invented steps arrive with the same authority as lived ones. The tell is generic parallel verbs ("Plan, execute, measure, optimize"); the real version has the fifth item breaking parallel with something specific and irritated, like "the last minute webinar".

### Attribution

Bottom-left at 93.2-97.6%, ink from x=55 to x=351. A ~59px circular photographic headshot, then "Pierre Herubel" in ~34px roman italic, #060405. No handle, no URL, no logo, no follow or repost prompt, no company mark. It sits at ~0.65x the list-row size and is left-set against two dead-centered headlines, so it never enters the reading path. Reads unambiguously as a signature, not a CTA — the image asks for nothing.

### Density

- **Words:** 56 · **Discrete elements:** 12 · **Words per element:** 4.7 words per element
- **Whitespace read.** 17.3% ink and it still reads as airy, because almost all of that ink is two solid fills, not text. The disc alone is ~81,000px (~5.6% of the canvas) and the cube roughly 8% more; subtract them and the type is a thin remainder. The bands confirm the air: band 2 is 0%, bands 8-9 are 2/2, bands 18-19 are 7/4 — four genuinely empty stripes at the top gutter, the divider zone, and the foot. The right half of panel A is white for ~27% of the canvas height with six words in it. Airiness here is a placement result, not a low-ink result.

### Thumbnail test at 220px: **PASS**

- **Survives.** Both headlines are fully readable at 220px — they are the heaviest weight and the highest-contrast objects present, and the underlines on "perceived" and "see" are still visible as short dark bars. The panel-A callout "push a button to “get leads”" is readable. The full-bleed dashed rule is unmistakable. The pink disc reads as one flat blob; the cube reads as a multicolored subdivided solid. Crucially, you can still COUNT five leader lines and five gray text strips on the bottom versus one on the top — the argument (1 vs 5) transmits without a single bottom-panel word being read.
- **Dies.** All five list rows go illegible — at ~30px they render as ~6px gray strips. The italic tail of row 5 is indistinguishable from the roman text above it. The pointing-hand cursor collapses into an amorphous dark smudge on the disc's lower-right edge and no longer reads as a hand or as "pressing". The starburst vanishes entirely. "Pierre Herubel" and the headshot's face are unreadable — the byline is a dot and a dash.
- **Rule this proves.** Put the entire thesis in the two ~52px headlines and in the 1-vs-5 count of leader lines; treat the list wording as reward for stopping, never as the payload. Also: any glyph carrying a verb (here, the pressing hand) must survive at ~10px or the top panel loses its predicate — so oversize it or replace it with something whose silhouette is unmistakable at thumbnail scale.

### Why it works, and what breaks without it

- **Item-count asymmetry as the argument: 1 callout above the rule, 5 below it, with identical leader-line treatment so the counts are directly comparable.**
  Without it: Give both panels the same number of labels and the image becomes a neutral two-column comparison with no point of view. The wording would then have to carry the thesis, and the wording is illegible at 220px — so the image would stop working in the feed entirely.
- **Both objects occupy the same left column at comparable scale (disc ~322px tall, cube ~390px) with the same leader-line convention running right into a text column.**
  Without it: Move or rescale one object and the reader compares position or size instead of internal complexity. The comparison is only legitimate because the two shapes are presented as the same measurement taken twice.
- **The dashed rule bleeds to both canvas edges (x=0-1079) while every other element stays inside a 5% margin.**
  Without it: Inset the rule, or box either panel, and the two halves read as "section 1 and section 2 of one document" — the eye carries panel A's frame into panel B and reads them as continuous. Full bleed is what makes them two incompatible worlds instead of two steps.
- **One underlined word per headline, in otherwise structurally identical sentences ("How marketing is often perceived" / "How marketers see marketing").**
  Without it: Drop the underlines and the two headlines look like the same sentence pattern repeated; the reader has to parse the semantics of "perceived" vs "see" to find the contrast. The underline moves that contrast into the type layer, which is the only layer that survives thumbnail scale.
- **The fifth list row breaks format on purpose — 3 lines instead of 1, non-parallel grammar, and an italic tail clause.**
  Without it: Make row 5 parallel with rows 1-4 and the bottom panel becomes a tidy process list, which is a thing a consultant would nod at and scroll past. The format break is the only place tone or grievance enters, and it is what converts a diagram into a complaint people share.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- The photographic headshot in the byline. A raster photo cannot be produced by HTML/CSS/SVG.
- The pointing-hand cursor illustration. It is a stock-style hand glyph with variable-width outline, four articulated fingers, and a knuckle curve — reproducible only by hand-authoring long bezier path data, which is exactly the class of thing that comes out wrong (lumpy fingers, broken outline weight) when generated blind.
- Nothing else. The 4x4x4 cube, the disc, the dashed full-bleed rule, the leader lines, the underlines and the italic tail are all plain HTML/CSS/inline SVG.

**Honest substitutes.**

- Headshot -> drop the photo and keep the italic name alone at x=55, or a solid #060405 circle with white monogram initials. Do NOT substitute an emoji avatar — that trades a blocker for a design tell. The information job ("a person said this") survives on the name.
- Hand cursor -> keep the starburst (6-8 tapered SVG lines in #FEACB0 at lower opacity, rotated by transform around the contact point) and replace the hand with a simple two-path arrow cursor: one filled #FFFFFF polygon with a 6px #060405 stroke and stroke-linejoin:round. Silhouette stays unmistakable at 220px, which the hand did not manage anyway. Alternative substitution that is arguably better: draw the simple object as an actual button — the same #FEACB0 disc with a concentric inner ring — and let the callout text carry "push". Drop the glyph rather than ship a bad hand.
- No substitution needed for anything else.

**Implementation notes.** Page: 1080x1350, background #FFFFFF, one CSS grid with rows sized from the measured bands (5.9% / 4% headline / 6.6% gap / 27.4% panel A / 9.2% divider zone / 4% headline B / 3.1% gap / 28.9% panel B / 4.1% gap / 4.4% byline). Each panel is its own two-column grid: graphic column ~40% wide, text column ~52%, 5.1% side padding. Divider: a single absolutely-positioned div, width:100%, left:0, top:49.3%, border-top:2px dashed #060405 — it must escape the padded container, so position it on the page root, not inside a panel. Leader lines: absolutely-positioned 1.5px divs with background #060405, z-index ABOVE the shape so they visibly start inside it (that overlap is the archetype's signature, not an accident) — width computed from the shape's right edge minus ~100px to the text column's left edge minus 50px. Vertically each leader is centered on its list row's line-box, so a wrapping row 5 must anchor its leader to its FIRST line, not to the row's center. List rows: flex column, gap tuned to the measured 74-75px pitch; row 5 gets line-height unchanged and its tail wrapped in <em>. Underline: text-decoration: underline; text-decoration-thickness: 4px; text-underline-offset: 6px on a <span> around the emphasis word — do not use border-bottom, it will not hug the word. Simple object: a div with border-radius:50%, background #FEACB0, border:3px solid #B33C34. Cube: inline SVG, viewBox 0 0 400 400, isometric basis vectors u=(52,-30) across-right, v=(-52,-30) across-left, w=(0,60) down; for face in [top, left, right] emit N*N <polygon> from p0 + i*a + j*b with the two face vectors, fill picked from the 4-hex palette by a deterministic hash of (face,i,j) so redeploys are stable, stroke=#060405 stroke-width=5 stroke-linejoin=round; draw back faces first so the outer silhouette stroke is not clipped. Starburst: a <g> of 7 <rect> elements, each rotated by transform=rotate(k*51, cx, cy), fill #FEACB0. Fonts: Nunito Sans 800 for headlines / 400 for body / 400 italic for the tail and byline, with an "Avenir Next", "Segoe UI", system-ui, sans-serif fallback stack.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline_naive` | string | 24-36 characters, must fit one line at ~52px across 845px of ink width; must end on the emphasis word | How marketing is often perceived |
| `emphasis_word_naive` | string | exactly 1 word, 3-10 characters, must be a literal substring of headline_naive; rendered underlined | perceived |
| `headline_real` | string | 24-36 characters, one line, must mirror headline_naive's sentence pattern (same opening word) so the underline is the only visible difference | How marketers see marketing |
| `emphasis_word_real` | string | exactly 1 word, 2-10 characters, literal substring of headline_real | see |
| `naive_callout` | string | 22-34 characters total, must wrap to exactly 2 lines of roughly 16 characters at ~46px; use curly quotes around any borrowed phrase | push a button to “get leads” |
| `naive_shape_fill` | hex | one pastel, must also appear in complex_palette; luminance high enough that #060405 leader lines stay visible over it | #FEACB0 |
| `naive_shape_stroke` | hex | a darker relative of naive_shape_fill, 2-3px; the only non-black stroke permitted on the canvas | #B33C34 |
| `action_glyph` | enum | one of {pointer, none} — sits on the lower-right edge of the naive shape with a radiating burst behind it; choose none rather than ship a malformed hand | pointer (hand cursor + pale starburst) |
| `real_items` | list<string> | exactly 4 items, each 26-38 characters, each exactly 1 line at ~30px; imperative verb-first and grammatically parallel with each other | ["Nail the positioning & messaging", "Ideate tactics, content, campaigns", "Plan, launch, analyze, iterate", "Align with sales for proper tracking"] |
| `real_punchline` | string | 95-115 characters, must wrap to exactly 3 lines and must NOT be parallel with real_items; hard ceiling of 3 lines or it collides with the byline at 93.2% | Do all of this consistently so the strategy makes sense as a whole but also promote the last minute webinar |
| `punchline_italic_tail` | string | 30-45 characters, must be the literal trailing substring of real_punchline, rendered italic; should name a specific interruption, not a generality | but also promote the last minute webinar |
| `complex_subdivisions` | integer | 4. Range 3-5 only: 3 reads as low-effort at 220px, 5+ turns the tile strokes into gray mush at thumbnail scale | 4 (4x4 per face, 3 faces, 48 tiles) |
| `complex_palette` | list<string> | exactly 4 pastels of similar saturation but visibly different hue; must include naive_shape_fill as one member; tile assignment must be pseudo-random, never patterned, or the object reads as a chart | ["#FEACB0", "#B4E1A1", "#FFCF73", "#DEA8FE"] |
| `divider_y_pct` | string | 48-50%; rule is 2px dashed #060405 and must bleed to x=0 and x=100%, outside the 5.1% content margin | 49.3% |
| `creator_name` | string | 10-22 characters, italic, ~34px, left-set at the 5.1% margin; no handle, no URL, no CTA | Pierre Herubel |
| `avatar_mode` | enum | one of {photo_data_uri, initials, none} — ~59px circle at x=55; use initials or none in a pure-HTML build | photo_data_uri (circular headshot) |

### Design-tell audit against PRD §10

**Violates (2).**

- "everything centered" — partially. Both headlines are dead-centered on the canvas axis (measured x=541.5 and x=540.0) while every other element is left-set (shapes at x~90-150, byline at x=55) or right-set (callout columns starting at x~560-610). The creator got away with it: only 2 of 9 text elements are centered, and those 2 are the argument's spine, so centering reads as an axis rather than as default-alignment laziness. The rule is right for body content and wrong for a two-part headline that must be perceived as one paired statement.
- "generic icon sets used decoratively" — borderline, and I would rule not-guilty. The pointing hand is a stock-style cursor glyph, but it is the predicate of the top panel's sentence: it IS "push a button". A decorative icon can be deleted without information loss; delete this one and the naive panel loses its verb. The rule is right; this image sits outside its scope.

**Avoids (8).**

- No gradients of any kind — every fill is flat.
- No drop shadows, no bevels, no glows anywhere; the isometric cube gets its depth purely from stroke geometry.
- No card grid, no three-across, no rounded containers, no borders except the disc's.
- No eyebrow label, no kicker, no "PART 1 / PART 2", no numbering on the list rows.
- No emoji.
- No default Inter or Poppins — a humanist sans with a distinctive single-storey g.
- No CTA, no logo, no handle, no follow prompt; attribution is a signature only.
- No color applied to any text — 100% of type is #060405.

**New tells this image implies, not currently on the list (6).**

- A divider that respects the content margin. If a rule is meant to separate two realities it must bleed to both canvas edges; an inset rule reads as a section break and lets the eye carry panel 1's frame into panel 2.
- Leader lines that stop politely at a shape's outline. Here every leader starts INSIDE the shape and crosses its edge — that overlap is what makes the line read as "pointing at this part of the object" rather than as a floating callout arrow.
- Symmetric item counts in a comparison. If both halves of a perception-vs-reality image get the same number of labels, the form has no thesis left; the asymmetry is the content.
- A perfectly parallel list. When all N items share the same verb-first grammar and the same line count, the image reads as a process diagram nobody argues with. One deliberate format break in the last item is what gives it a voice.
- Two panels using different stroke colors for their primary objects (#B33C34 on the disc, #060405 on the cube). It reads as assembled clip-art rather than one drawing system — the only real inconsistency on this canvas.
- Attribution sized to compete. The byline here is ~0.65x the list-row size and off the headline axis; anything larger or centered turns a signature into a CTA.

### Failure modes when copied badly

- Both panels get the same number of labels, so the image reads as a neutral two-column comparison and the reader scrolls past without registering a claim.
- The complex object is drawn with too few subdivisions (3x3 or a plain cube), so at 220px it carries the same visual weight as the simple shape and the contrast evaporates.
- The complex object is drawn with too many subdivisions, so the black tile strokes merge into a gray mass at thumbnail and the object stops reading as an object.
- Tile colors are assigned in a repeating pattern instead of pseudo-randomly, so the cube reads as an encoded chart and the reader hunts for a legend that does not exist.
- The four pastels are picked at near-identical luminance to the disc, so the bottom object reads as one mushy pink blob at 220px.
- The punchline row wraps to four or more lines and its descenders collide with the byline zone starting at 93.2%.
- Leader lines are anchored to the vertical center of a wrapping list row instead of its first line, so the fifth leader visibly sags below its own text.
- Leader lines are drawn ending at the shape's outline instead of crossing into it, so they read as generic callout arrows and visually fight the shape's stroke.
- The divider is inset to the content margin, and the two panels collapse into "section 1, section 2" of one continuous document.
- A third panel is added. The 49.3% split is what makes this a binary; three panels turn a claim into an unread list.
- The hand or action glyph is hand-authored badly and reads as a smear on the disc, which is worse than no glyph — the top panel then has a noun with no verb.
- The five items are invented generically ("Plan, execute, measure, optimize"), producing a form with the right shape and no lived detail; the tell is that the fifth item is also parallel.

### Topic fit

- **Fits when.** One activity is widely believed to be a single action but is actually a sequence of interlocking ones — and the speaker has personally been on the receiving end of that misunderstanding. Best when the naive version can be named in under 6 words and drawn as one primitive shape, and the real version decomposes into exactly 4 steps plus 1 complication. Works for any craft with a visible output and an invisible process: hiring, SEO, translation, security review, data cleaning, film editing, tax filing.
- **Breaks when.** The topic is genuinely simple (there is no complexity to reveal and the cube is a lie), or the complexity is not enumerable in 4-5 lines (the list becomes a wall and the thumbnail dies), or the two sides are not the SAME thing seen twice but two different things — this form draws a misperception, not a comparison of options. It also breaks for anything quantitative: there is no axis, no scale, no unit, and forcing numbers into the callouts makes the reader ask for a source the form has no slot for.
- **Input signature that should trigger selecting it.** Two mental models of the SAME object held by two different audiences, where model A collapses to exactly 1 statement and model B expands to 4 parallel statements plus 1 non-parallel complication — and where model B's complexity can be represented by subdividing model A's shape rather than by drawing a different shape.

<details>
<summary>All visible text, in reading order</summary>

How marketing is often perceived | push a button to “get leads” | How marketers see marketing | Nail the positioning & messaging | Ideate tactics, content, campaigns | Plan, launch, analyze, iterate | Align with sales for proper tracking | Do all of this consistently so the strategy makes sense as a whole but also promote the last minute webinar | Pierre Herubel

</details>

---

## 11. tapered stage-stack funnel
**File:** `Pierre Herubel/1783498087090.jpeg` · **Creator:** Pierre Herubel

A full-page vertical stack of four color-coded panels — one per stage of a process — each holding the stage name in a filled pill, one row of five white component chips, and one named tool on a highlighter strip, with grey trapezoid connectors narrowing the stack into a funnel and a dashed right-hand rail dropping three coaching notes onto specific stages.

**Information job.** "This process has N ordered stages — what actually goes inside each one, in what order do I do them, and what named tool do I use at each step?" It converts a discipline the reader knows only as a buzzword into a checklist they could work through tomorrow.

### Where the idea came from

**Likely origin.** A framework they teach — this is the table of contents of a consulting methodology or course, flattened onto one canvas.

**Evidence in the image.** Four bands share an identical internal grammar, which is how a curriculum is structured, not how an observation is reported. Two of the four named tools are public canon ("Segmentation Targeting Positioning (STP)", "Value Proposition Canvas") and two are unattributable coinages in the author's own voice ("Desired Positioning Statement", "Claim Prove Filter") — the signature of a practitioner splicing personal IP into a standard sequence. The right-rail notes are instructor register, not data: "Always start here", "Don't forget this", "Iterate on this". No numbers, no source line, no date anywhere.

**The generative question, portable to any niche.** What are the 3-5 sequential stages of [process], what are the 4-6 named components inside each stage, and which single named tool does a practitioner reach for at each stage? Then mark which stage is the entry point, which one people skip, and which one they should keep revising.

### Headline and subtitle

> 4-Step Marketing Strategy

- **Words:** 3
- **Form:** Bare declarative label, numeral-first. No verb, no question. Typographically it is one unbroken line set edge-to-edge between the left and right margins at roughly 84px, so the type size is dictated by the string length rather than the string fitted to a chosen size. No highlighter, no color split, no underline on the headline itself — it is the only pure-black mass at the top of the canvas.
- **Promise:** Everything needed to build the thing named in the headline is on this one image, already broken into a finite and countable number of steps.
- **Subtitle:** *none*
- **What the subtitle does that the headline cannot:** none — there is no subtitle. The only text under the headline is the byline "By Pierre Herubel", which is attribution, not scoping. The scoping work a subtitle would do (where to start, what order) is pushed into the right-rail annotations instead.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 3.9-10.5% | Headline block | Names the deliverable and its step count in one line; the numeral is the hook. | "4-Step Marketing Strategy" in near-black #050504, single line, spanning the full content width (L1.5% to R1.6%). Matches ink band 2 of 20 at 32%. |
| 11.0-15.0% | Byline strip | Signature. Also creates the only full white gutter above the stack, which is what makes the four panels read as one grouped object. | Circular photographic headshot (~48px diameter) followed by "By Pierre Herubel" in italic, both right-aligned to the right content margin. Matches ink band 3 at 8%. |
| 17.8-37.0% | Stage panel 1 | First stage. Establishes the internal grammar every later panel repeats. | Dashed-border rounded rectangle, fill #DDEAD7 (measured 25%). Header pill "1/Target Audience" on #B4E1A1. Chip row: "Target Market" "Industry" "Firmographics" "Objectives" "Pains". Footer: "→ Useful framework:" then "Segmentation Targeting Positioning (STP)" on a #B4E1A1 highlighter strip. Ink bands 4-5 at 91/60. |
| 36.8-38.4% | Funnel connector 1 | Encodes order and narrowing. Without it the panels are an unordered list. | Solid grey #9FA0A0 trapezoid spanning x144-x973, sitting in the 16px gutter between panels 1 and 2. |
| 38.2-57.5% | Stage panel 2 | Second stage, same grammar, new hue. | Fill #F8D1D2 / #FED5D6 (measured 21% and 12%). Header pill "2/Positioning" on #FEADB2. Chips: "Differentiation" "USP" "Category" "Posture" "Enemy". Footer: "→ Useful framework:" + "Desired Positioning Statement" on #FEADB2. Ink bands 6-8 at 94/91/97. |
| 57.2-58.9% | Funnel connector 2 | Second taper step; connector width drops from 829px to ~522px. | Grey #9FA0A0 trapezoid, x278 to ~x800. |
| 58.7-77.9% | Stage panel 3 | Third stage. | Fill #FCF7E4 (sampled). Header pill "3/Messaging" on #FFCE72 (sampled). Chips: "Value Proposition" "Benefits" "Capabilities" "Tone of voice" "Point of View". Footer: "→ Useful framework:" + "Value Proposition Canvas" on #FFCE72. Ink bands 9-11 at 74/94/54 — the fill is near-white, so most of that ink is the text rows, not the panel. |
| 77.6-79.2% | Funnel connector 3 | Final taper before the apex; width now 257px (x411-x668). | Grey #9FA0A0 trapezoid. |
| 79.0-98.2% | Stage panel 4 | Last stage; the funnel apex lands inside it. | Fill #F3F8FE (sampled). Header pill "4/Offer" on #B4DBFA (sampled). Chips: "Features" "Milestones" "Timeframe" "Guarantees" "Price". Footer: "→ Useful framework:" + "Claim Prove Filter" on #B4DBFA. Ink bands 12-19 read 24/10/20/13/14/9/12/6 — low not because the region is empty but because #F3F8FE is barely separable from #FFFFFF; the local peaks (24, 20, 14, 12) are the header row, chip row and framework row. |
| 37.0-98.2% | Converging white wedges (overlay) | Draws the funnel silhouette through the panel fills without adding another opaque shape. | Two large near-white translucent polygons over the left and right of panels 2-4, converging from the panel-1 connector width down to a point near x540 at the bottom edge. Visible as pale triangular corners inside the #F8D1D2 and #FCF7E4 fills. |
| 21.0-96.0% | Right annotation rail (overlay) | A sparse second instruction layer commenting on specific stages without entering the panel grid. | Vertical black dashed line at x~970 ending in a downward arrowhead at ~95%, with three white circles (~115px diameter, black hairline stroke) pinned on it, each capped upper-left by a solid black circular check badge. Labels top to bottom: "Always start here" (~21-32%), "Don't forget this" (~52-63%), "Iterate on this" (~83-93%). |

### Reusable skeleton

```
+--------------------------------------------------+
|  HEADLINE, one line, full content width          |
|                        (o) By Author Name  italic|
+--------------------------------------------------+
| .-- dashed, fill = tint1 ---------------------.  |
| | [1/STAGE ONE]  <- pill on accent1           |  |  .-.
| | (chip)(chip)(chip)(chip)(chip) white pills  |  |-( 1 ) note
| | -> Useful framework: [ TOOL NAME on acc1 ]  |  |  '-'
| '---------------------------------------------'  |   :
|        \____ grey trapezoid connector ____/      |   :
| .-- dashed, fill = tint2 ---------------------.  |   :
| | [2/STAGE TWO]                               |  |  .-.
| | (chip)(chip)(chip)(chip)(chip)              |  |-( 2 ) note
| | -> Useful framework: [ TOOL NAME on acc2 ]  |  |  '-'
| '---------------------------------------------'  |   :
|           \___ narrower trapezoid ___/           |   :
| .-- tint3 -----------------------------------.   |   :
| | [3/STAGE THREE] (chip)x5  -> fw: [ TOOL ]  |   |   :
| '--------------------------------------------'   |   :
|              \__ narrowest __/                   |  .-.
| .-- tint4 -----------------------------------.   |-( 3 ) note
| | [4/STAGE FOUR]  (chip)x5  -> fw: [ TOOL ]  |   |  '-'
| '--------------------------------------------'   |   V
+--------------------------------------------------+
```

### Type system

- **Families.** One geometric-leaning sans across the whole canvas, double-storey 'a' and an open-tailed 'g'. Reads like Montserrat or a close grotesque cousin (guess — could equally be Nunito Sans at heavy weight). No serif, no mono, no second family. The byline is the same family in true italic, not obliqued.

- **Headline : body.** headline ~3.2x body (headline cap span ~80px at a ~84px size; chip text ~26px). Stage-header pill text sits between at ~40px, so ~1.5x body.

- **Weights.** Three: extra-bold/black for the headline and the stage-header pills; medium for chip labels and framework names; regular for the "→ Useful framework:" lead-in and the italic byline. Annotation circle labels are bold at ~22px.

- **Case.** Title Case everywhere. No all-caps anywhere — not on the headline, not on the pills, not on the chips. Sentence case appears only inside the annotation circles ("Always start here").

- **Typographic moves.** Highlighter strip behind the framework name, sized tight to the text with a few px of padding and a small radius. Stage header set as dark text on a filled rounded pill rather than plain type. Components set as white pills with a hairline grey stroke, so they read as removable tokens rather than a comma list. "→" used as a literal glyph lead-in. Numeral bonded to the stage name by a slash with no spaces ("1/Target Audience") so the ordinal cannot be visually separated from the label. Typographic apostrophe in "Don't".

- **Hard line limits.** Headline 1 line, hard. Stage-header pill 1 line. Chip labels 1 line each and all five chips must fit one non-wrapping row. Framework line 1 line. Annotation labels wrap to 2-3 short lines inside the circle. Longest observed body string: "Segmentation Targeting Positioning (STP)" at 40 characters.

### Color logic

- **Roles.** Page bg #FFFFFF. Primary ink #050504 (8% of non-bg pixels) — headline, chip text, framework text, rail line, circle strokes. Connector/shadow grey #9FA0A0 (4%) — the three trapezoids. Stage 1: fill #DDEAD7 (25%) with a lighter inner reading of #E4EFDB (5%), accent #B4E1A1 (2%) on the header pill and framework strip. Stage 2: fill #F8D1D2 (21%) / #FED5D6 (12%), accent #FEADB2 (2%). Stage 3: fill #FCF7E4 (sampled), accent #FFCE72 (sampled). Stage 4: fill #F3F8FE (sampled), accent #B4DBFA (sampled). Component chips are #FFFFFF with a hairline stroke in the #9FA0A0 family, so they punch out of every tint identically.
- **Distinct hues.** 4
- **Does color mean anything.** Indexical, not semantic. Green, pink, yellow and blue encode no valence and no ordinal magnitude — they are memory handles so a reader can say "the pink one". That is also the risk: green-then-pink reads as pass-then-fail to some readers, a meaning the author did not intend.
- **Accent discipline.** Each stage uses exactly two intensities of one hue: a pale fill covering the whole panel and a saturated accent restricted to the header pill and the framework strip. Saturated accent is roughly 4% of all non-background pixels (#B4E1A1 2% + #FEADB2 2%, with the yellow and blue accents too small to enter the measured top-8). Panel fills carry about 63% of non-background pixels while carrying zero information; every mark that means something is inside the 8% #050504.

### Data dependency

- **Needs external data.** no
- **What would have to be true.** None. This is a taxonomy plus an opinion about sequence. The only things that must be true in the world are that the named tools exist (STP and Value Proposition Canvas do; "Desired Positioning Statement" and "Claim Prove Filter" are the author's own naming) and that a practitioner would recognise each chip as belonging to its stage.
- **Provenance shown on the image.** Only "By Pierre Herubel" with a circular headshot, right-aligned under the headline. No source line, no date, no methodology note, no citation for any of the four named frameworks.
- **Fabrication risk.** High and effectively invisible. The form has 20 chip slots and 4 tool-name slots that must be filled and nothing on the canvas is checkable. An AI copying this archetype would generate plausible components and invent authoritative-sounding tool names in the pattern of "Claim Prove Filter" — three capitalised words that sound canonical and refer to nothing. Because the layout gives them the same visual authority as "Value Proposition Canvas", a reader cannot tell which are real. The fix is a content rule, not a design change: every framework name must be either a citable public framework or explicitly flagged as the author's own.

### Attribution

"By Pierre Herubel", verbatim, in italic at roughly 34px — about 40% of the headline cap height — preceded by a circular photographic headshot of ~48px diameter. Both sit on one line, right-aligned to the right content margin, directly beneath the headline and above the panel stack. No handle, no follow prompt, no repost prompt, no logo, no URL, no slide counter. It reads unambiguously as a signature: placed the way a painter signs a canvas (after the title, at the edge, smaller), not as a CTA. Nothing about it asks the reader to do anything.

### Density

- **Words:** 67 · **Discrete elements:** 33 · **Words per element:** ~2.0 words per element (67 words across 33 elements: 4 panels, 20 chips, 4 framework strips, 3 annotation circles, 1 rail, 1 headshot); no element carries more than 4 words except the two longest framework names
- **Whitespace read.** 42.6% ink coverage would normally predict a crowded image, and this one is not crowded. About 63% of the non-background pixels are three flat panel tints (#DDEAD7 25%, #F8D1D2 21%, #FED5D6 12%) that carry no marks — the pixel counter reads a tinted rectangle as ink, the eye reads it as ground. Actual mark-making ink is the 8% #050504 plus the 4% #9FA0A0. Inside each 260px panel there are only three text rows with roughly 24px of clear space between them, panels are separated by 16px gutters, and one full white gutter sits under the byline. High measured ink, low mark density.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** The headline "4-Step Marketing Strategy" is fully legible. The four-band structure survives as horizontal color blocks, though only the green and pink read as clearly colored. All four stage-header pills stay readable — "1/Target Audience", "2/Positioning", "3/Messaging", "4/Offer" — so the entire spine of the argument survives compression. The grey connector trapezoids survive as three dark notches that visibly narrow, so the funnel gesture reads. The right rail survives as a dotted vertical with three white dots: you can see there is annotation, you cannot see what it says.
- **Dies.** All 20 component chips are illegible grey texture. All four "→ Useful framework:" lines and all four framework names are unreadable, including the longest and most quotable one. All three circle annotations — "Always start here", "Don't forget this", "Iterate on this" — are gone; the check badges survive as meaningless black dots. The byline is unreadable and the headshot is a smudge. The chips' white fill and hairline stroke merge into the tint. The yellow #FCF7E4 and blue #F3F8FE bands read as white, so a scroller counts roughly two bands, not four.
- **Rule this proves.** Everything that must survive the feed has to live in the headline plus one filled pill per band at ~40px or larger, and each pill must be a complete idea on its own ("1/Target Audience", never bare "1"). The chip row and framework strip are deliberately second-read payload: their job is to signal that more exists and to reward the tap. Corollary: never use a band tint lighter than roughly #F3F8FE, because at 220px it stops being a band and the reader loses the count the headline promised.

### Why it works, and what breaks without it

- **Ordinal bonded to label inside a filled pill: "1/Target Audience" is one typographic object at ~1.5x body size, on the only saturated color in the panel.**
  Without it: Set the stage names as plain bold text on the tint and the thumbnail loses all four labels — the image compresses to colored rectangles plus a headline, and the promise "4-Step" becomes unverifiable at feed size. Separate the numeral from the name and the reader must reconstruct order from position alone.
- **Identical internal grammar in every panel: header pill, then exactly one row of five white chips, then one "→ Useful framework:" line with a highlighted tool name. Same rows, same y-offsets, same widths, same 260px height.**
  Without it: The reader parses panel 1 fully and then scans panels 2-4 for deltas only, which is why 67 words feels like a 10-second read. Vary the row structure — six chips here, two framework lines there — and every panel resets to a full parse, roughly quadrupling read time for the same content.
- **Grey #9FA0A0 trapezoid connectors of decreasing width (829px, ~522px, 257px) plus converging near-white wedges over the lower panels.**
  Without it: Remove them and four stacked panels are an unordered list of four equal things. The trapezoids are the only elements asserting that stage 1 feeds stage 2, and the taper is the only support for the funnel metaphor. The headline says "4-Step" but nothing else on the canvas says the steps are sequential rather than parallel.
- **Annotation rail placed strictly outside the panel bounding boxes, on its own dashed vertical at x~970, carrying three notes of three words each.**
  Without it: This is the only layer telling you where to start, what people skip, and what to revisit — a second, opinionated pass over the same four objects. Move those notes inside the panels and they compete with the chip row for the same horizontal band, forcing chips to wrap and destroying the fixed three-row panel height that the parallelism depends on.
- **Pale panel fill carrying ~63% of the pixels but zero marks, with informational ink held to 8% near-black plus a ~4% saturated accent.**
  Without it: The tints do all the grouping work — they are why four panels read as one object rather than twelve loose text rows, with no nested boxes needed. Saturate the fills and the white chips lose their punch-out contrast while black body text drops below comfortable contrast; drop the fills entirely and grouping needs rules or borders, adding strokes the design currently spends nothing on.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- The circular photographic headshot in the byline. No image generation and no external asset loading means a real face cannot be produced.

**Honest substitutes.**

- Headshot → a #050504 filled circle of the same ~48px diameter holding the author's initials in white extra-bold, preserving the byline silhouette and right-alignment. If initials read as placeholder, drop the circle and keep only italic "By {name}" — the byline still reads as a signature, and the headshot is illegible at thumbnail size anyway, so nothing that survives the feed is lost.
- Check badges → inline SVG: a filled black circle plus a two-segment white polyline. No icon library needed; the mark is three coordinates. Dropping the tick entirely is also defensible — it adds no information the circle and label do not already carry.

**Implementation notes.** Page 1080x1350, background #FFFFFF, padding 16px left / 17px right. Stack is a flex column with 16px gap; each panel is a fixed 260px div, border-radius ~10px, `border: 2px dashed` in a darkened variant of its own tint, `background: var(--tint)`. Inside each panel three stacked rows: (1) header pill = inline-block, `background: var(--accent)`, radius 8px, padding 6px 16px; (2) chip row = `display:flex; gap:14px; flex-wrap:nowrap`, each chip `background:#FFF; border:1.5px solid #C9C9C9; border-radius:8px; padding:6px 14px; white-space:nowrap`; (3) framework row = flex with a regular-weight "→ Useful framework:" span followed by a span with `background: var(--accent); border-radius:5px; padding:3px 10px` — that span is the entire highlighter effect. Funnel: one absolutely positioned inline SVG above the panels with `pointer-events:none`, holding three #9FA0A0 polygons at the gutter y-values (504, 782, 1058) with x-extents 144→973, 278→800, 411→668, plus two white polygons at ~0.55 opacity running from the panel-1 connector edges to a shared apex near x540 at y1350; the wedges must sit above the tints but below the text, so give the text rows `position:relative; z-index:2`. Rail: a second absolutely positioned SVG at x~970 spanning y280→1300 with a `stroke-dasharray:10 10` black line, an arrowhead polygon at the bottom, three `<circle r=57 fill=#FFF stroke=#050504 stroke-width=2.5>`, and three small filled check circles offset upper-left of each; put the annotation labels in HTML divs positioned over the circles rather than SVG text so they wrap and center for free. Montserrat via Google Fonts at 800/500/400 is the closest match to the observed faces, with a `system-ui` fallback. Verify at 220px width before shipping: if a tint disappears against white, darken it.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline` | string | 18-30 characters, must fit one line at ~84px across 1047px of content width. Should lead with the stage count as a numeral. There is no subtitle slot — do not add one. | 4-Step Marketing Strategy (25 chars) |
| `author_name` | string | ≤22 characters; rendered as "By {author_name}" in italic. Longer names push the byline under the headline's right margin. | Pierre Herubel |
| `author_initials` | string | Exactly 2 uppercase characters; fills the monogram circle that substitutes for the headshot. Empty string omits the circle entirely. | PH (substituting for the photographic headshot) |
| `stages` | list<{name, chips, framework_label, framework_name, tint, accent}> | Exactly 3-5 items; 4 is the measured optimum. At 4, each panel is 260px tall with 16px gutters. At 5, panel height drops to ~205px and the three internal rows lose their breathing gaps — tight but workable. At 3, panels grow to ~350px and the chip row floats; add a 6th chip or raise chip size if using 3. | 4 stages: Target Audience, Positioning, Messaging, Offer |
| `stages[].name` | string | ≤17 characters INCLUDING the auto-prefixed ordinal and slash, so the writable part is ≤15 characters. One line, never wraps, must stay legible at 220px. | "1/Target Audience" (17 chars) is the longest; "4/Offer" (7) the shortest |
| `stages[].chips` | list<string> | Exactly 5 per stage and the same count across every stage. Each chip ≤17 characters, no line breaks. Sum of characters across one stage's five chips must be ≤65 or the row wraps and the fixed panel height breaks. | ["Value Proposition", "Benefits", "Capabilities", "Tone of voice", "Point of View"] — 63 chars, the tightest row in the image |
| `stages[].framework_label` | string | ≤20 characters and identical across all stages — the repetition is what makes the panels scannable. Rendered in regular weight preceded by a literal "→". | Useful framework: |
| `stages[].framework_name` | string | ≤40 characters, one line, sits on the highlighter strip. Must be either a citable public framework or explicitly the author's own coinage — this is the slot where fabrication hides. | Segmentation Targeting Positioning (STP) — 40 chars, the hard ceiling |
| `stages[].tint` | hex | Pale panel fill. Luminance must sit between roughly #DDEAD7 and #F3F8FE — lighter than #F3F8FE and the band vanishes at 220px; darker than #DDEAD7 and the white chips stop punching out. One distinct hue per stage, never repeated. | #DDEAD7, #F8D1D2, #FCF7E4, #F3F8FE |
| `stages[].accent` | hex | Saturated sibling of the same hue, used only on the header pill and the framework strip — never on the fill, never on a chip. Must hold near-black text at ≥4.5:1. | #B4E1A1, #FEADB2, #FFCE72, #B4DBFA |
| `annotations` | list<{attach_to_stage, text}> | 0-3 items, never more. Each text ≤17 characters and must wrap to 2-3 lines inside a 115px circle. attach_to_stage is a 1-based stage index and two annotations may not share one. Second-person instructional voice, not description. | [{1, "Always start here"}, {2, "Don't forget this"}, {4, "Iterate on this"}] |
| `show_funnel` | enum | "funnel" \| "flat". "funnel" draws the tapering grey trapezoids and converging white wedges; use only when the stages genuinely narrow (filtering, qualifying, converging). "flat" draws equal-width connectors and no wedges, for sequences that do not narrow, so the taper never asserts a claim the content cannot support. | funnel |

### Design-tell audit against PRD §10

**Violates (2).**

- "generic icon sets used decoratively" — the three black check-circle badges carry no information their labels do not already carry; "Always start here" is not more true for having a tick beside it. The creator got away with it because the badges are tiny, monochrome, and drawn in the page's own ink rather than pulled from a colored pack, so they read as bullet markers rather than clip art. The rule is right; this execution stays under the threshold where it registers as decoration.
- "drop shadows on every element" — borderline and worth naming. The grey #9FA0A0 trapezoids look like drop shadows cast by the panel above. They are not decoration: they are the connectors encoding sequence and taper. But the visual borrowing means a careless copy will read them as a shadow effect and apply the same grey under every element. Keep the shape; never let it become an effect.

**Avoids (7).**

- No purple-to-blue gradient — no gradient anywhere; every fill is flat.
- Nothing is centered: headline, panels, pills, chips and framework rows all hard left-aligned to one margin; only the byline flips to the right margin.
- No three equal cards in a row — repetition is vertical, four of them, at full content width.
- No default Inter or Poppins left unadjusted; the type is a heavier geometric grotesque whose size is set by line length.
- No emoji anywhere.
- No eyebrow, kicker, or category label above the headline.
- No slide-1-is-just-a-title problem — one canvas carrying its full argument.

**New tells this image implies, not currently on the list (6).**

- A tint pale enough to vanish at 220px is a dead band. #FCF7E4 and #F3F8FE both collapse to white in the feed, so the image promises "4-Step" and shows about two. Every panel fill must be checked against white at thumbnail size, not on a desktop monitor.
- Repeated structure without repeated substance is filler. Twenty chip slots must be filled and the form will happily accept twenty words the author does not stand behind. If a stage cannot supply five real components, cut the stage rather than pad the row.
- Named-tool slots invite invented authority. Any layout with a recurring "the framework here is X" strip creates one opportunity per row to coin an official-sounding name for nothing. Require every such name to be citable or explicitly labelled as the author's own.
- A taper is a claim. Narrowing connectors assert that stages filter or converge; applied to a checklist or a timeline that does not narrow, the geometry lies while the words stay honest.
- Hue-per-item indexing leaks valence. Green first and pink second reads as good-then-bad to a reader never told the colors are arbitrary. Either pick hues from one non-valenced family or accept the misread.
- An annotation layer floating outside the content grid must never overlap it. This rail works because it owns a dedicated ~110px right column no chip may enter; the moment a chip row runs long, the two collide and both layers fail at once.

### Failure modes when copied badly

- One chip label runs long ("Total Addressable Market") and the chip row wraps to two lines, pushing the framework row out of the fixed 260px panel and misaligning that panel against the other three — the parallelism that makes this a 10-second read is gone.
- The framework name exceeds 40 characters, so the highlighter strip either runs past the right margin into the annotation rail or has its text size dropped below the rest of the row, making the payoff look like a caption.
- Chip counts differ per panel — five in one, three in another — so panels carry unequal internal weight and the reader stops trusting that the stages are comparable.
- Tints picked for prettiness rather than thumbnail contrast, so two of the four bands read as white in the feed and the headline's step count does not match what a scrolling reader can count.
- The taper is drawn on a process that does not narrow, claiming a filtering mechanic the content never delivers.
- Annotation circles given full sentences instead of ≤17-character notes, requiring a bigger radius, which pushes them left over the chip rows, which forces the chips to shrink.
- All four accent hues drawn at the same lightness, so every header pill shouts equally and nothing marks the entry point — the rail then does 100% of the sequencing work and the image collapses if cropped.
- The author's own coinages given the same visual treatment as canonical frameworks with no signal of the difference, so the whole image borrows credibility from the two real ones without earning it.

### Topic fit

- **Fits when.** A process the audience knows by name but cannot decompose, where the value is the decomposition rather than any single fact. Ideal when the stages are genuinely ordered, when each stage has a comparable number of named sub-parts, and when a practitioner can point to a specific named tool per stage. Works for methodologies, audits, onboarding sequences, diagnostic ladders, hiring loops, and anything you teach.
- **Breaks when.** The items are parallel rather than sequential (the taper lies); stage sizes are wildly unequal (nine components in one, two in another); the content is quantitative (a stack of tinted panels cannot show magnitude — use a chart); there are more than five stages (panel height collapses and the chip rows crush); or the topic has no per-stage tooling, which empties the framework row and removes a third of the payload.
- **Input signature that should trigger selecting it.** 3-5 named, ordered stages of one process, each decomposable into exactly 4-6 short noun-phrase components (≤17 chars each), plus one named tool or artifact per stage, plus up to 3 short pieces of instructional advice attachable to specific stages. No numeric series, no comparison, no before/after.

<details>
<summary>All visible text, in reading order</summary>

4-Step Marketing Strategy | By Pierre Herubel | 1/Target Audience | Target Market | Industry | Firmographics | Objectives | Pains | → Useful framework: | Segmentation Targeting Positioning (STP) | Always start here | 2/Positioning | Differentiation | USP | Category | Posture | Enemy | → Useful framework: | Desired Positioning Statement | Don't forget this | 3/Messaging | Value Proposition | Benefits | Capabilities | Tone of voice | Point of View | → Useful framework: | Value Proposition Canvas | 4/Offer | Features | Milestones | Timeframe | Guarantees | Price | → Useful framework: | Claim Prove Filter | Iterate on this

</details>

---

## 12. annotated depth-tier iceberg
**File:** `Pierre Herubel/1784791059325.jpeg` · **Creator:** Pierre Herubel

A vertical iceberg diagram that sorts 24 named items into three depth zones — visible fads above the waterline, working tactics just below, unchanging fundamentals at the bottom — with margin annotations voicing what people say at each depth.

**Information job.** Of all the things people in this field talk about, which are surface noise, which are real working practice, and which are the permanent foundation everything else sits on — and how many items live at each depth?

### Where the idea came from

**Likely origin.** A recurring client objection the creator keeps having: that people fixate on visible novelty (AI workflows, trends, tools) while ignoring unglamorous fundamentals. The iceberg is the standard rhetorical vehicle for that argument.

**Evidence in the image.** The two quoted annotations are objections in someone else's voice — “We need AI workflows everywhere!” sits above the waterline next to a boat, “We focus on our positioning.” sits deep next to a scuba diver. The creator's own voice appears unquoted (“Try without losing focus”, “New important tactics”, “What Never Changes”). The image is staged as a rebuttal to two overheard positions, not as a data readout.

**The generative question, portable to any niche.** In your field, list 20-25 things practitioners talk about. Sort them into three depths: what the feed obsesses over right now, what actually moves the number this year, and what has been true for a decade and never changes. Then write one line someone says at each depth.

### Headline and subtitle

> The Iceberg of Marketing Priorities

- **Words:** 5
- **Form:** Bare noun-phrase label, no verb, no claim. Typographic emphasis: the single word “Marketing” is knocked out in white on a #64B7FF rounded-rectangle highlighter block, splitting line 2 into black/white/black. Two centered lines, heavy weight, tight tracking.
- **Promise:** A complete map of one domain's priorities, already sorted by how deep and how durable each one is, so the reader can check whether they are working above or below the waterline.
- **Subtitle:** *none*
- **What the subtitle does that the headline cannot:** None. The two in-diagram zone labels — “Surface Level” and “Foundations Level” — do the scoping work a subtitle would normally do.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 3-16% | Title block | Names the domain and the sorting metaphor; the highlighter block is the only saturated color in the top third and pins the eye. | “The Iceberg of” on line 1; “Marketing” in white on a blue rounded block plus “Priorities” in black on line 2. Centered. Bands 2-3 (18%, 38% ink) are entirely this. |
| 19-38% | Above-water zone | Holds the items being dismissed. White page background stands in for air; the iceberg tip is a faint tinted trapezoid so chips read as sitting ON something. | Faint tinted trapezoid tip; 6 white chips in 3 rows of 2 (2026 Trends / AI Workflows, Marketing Hacks / New tools, Shiny Tool stacks / Virality); left annotation “We need AI workflows everywhere!” with boat silhouette; right annotation “Try without losing focus” with curved arrow; 5 bird marks top right. Bands 4-7 at 7-11% ink — the airiest part of the page. |
| 38-40% | Waterline + Surface Level label | The hard structural break. A full-bleed black rule cuts the canvas and everything below flips to a blue field, so the halves read as different states, not different rows. | Full-width ~4px #040405 rule; black rounded pill right-aligned on the rule reading “Surface Level” in white; boat sits on the rule at left. Band 8 spikes to 24% ink against 7% above it. |
| 40-66% | Mid-water tier | The working tactics. Chips get longer and the trapezoid wider, so the layout itself says more substance lives down here. | 8 white chips in 4 rows of 2 (Intent Signals / Content systems; Repurposing workflows / Warm Outbound; Personal Brands / Partnerships & Collabs; Sales + content alignment / Allbound Approach); left white italic “New important tactics” with upward curved arrow; right white italic “We focus on our positioning.” with scuba diver silhouette. Bands 9-13 all 70-83% ink because the blue field is solid. |
| 66-69% | Foundations Level divider | A second, deliberately softer break — dashed not solid, white pill not black — encoding that this boundary is gradual where the waterline is absolute. | White dashed horizontal rule full width; white rounded pill with black text “Foundations Level”, right-aligned on the rule. |
| 69-90% | Foundations tier | The permanent layer. Highest chip count and the widest part of the trapezoid; water darkens toward #0A5DA4 so depth is felt as color, not only position. | 10 white chips in 4 ragged rows of 2-3 (Brand narrative / Focus on feedback loop; Market Research / Offers / Unique Selling Point; Marketing Discipline / Strong Value Proposition; Clear positioning / Consistent Messaging / Precise ICP). Bands 14-18 hold 67-81% ink. |
| 90-100% | Base annotation + attribution | Closes the argument with the thesis line and signs it. Both sit on the same baseline at opposite corners so the byline reads as a signature under a statement. | Trapezoid base terminates; white italic “What Never Changes” bottom-left with a short upward arrow pointing at “Clear positioning”; “Pierre Herubel” in white italic bottom-right beside a circular headshot photo. Bands 19-20 near-solid at 99% and 97% ink — the darkest blue on the page. |

### Reusable skeleton

```
+------------------------------------------------+ 0%
|            TITLE LINE 1 (black bold)            |
|      [HIGHLIGHT WORD]  TITLE LINE 2             | 16%
|                                        ~ birds  |
|  "quote A"        /-----------\    annotation    | 19% <- trapezoid tip
|   (italic)       | [chip][chip] |   + arrow      |
|   + icon         | [chip][chip] |                |
|                  | [chip][chip] |                |
|=[icon]===========|==============|===[ LABEL 1 ]==| 39% solid rule + BLACK pill
|                 |                |               |
|  annotation     |  [chip][chip]  |   "quote B"   |
|  + arrow        |  [chip][chip]  |   (italic)    |
|  (italic)       |  [chip][chip]  |   + icon      |
|                |   [chip][chip]   |              |
|- - - - - - - - |- - - - - - - - -|- [ LABEL 2 ]--| 67% dashed rule + WHITE pill
|                |  [chip] [chip]   |              |
|               | [chip][chip][chip] |             |
|               |  [chip]  [chip]    |             |
|              |  [chip][chip][chip]  |            |
|              +----------------------+            | 90%
|  thesis line (italic) + arrow      byline (o)    | 100%
+------------------------------------------------+
white above 39%; one-hue blue gradient light->dark below
```

### Type system

- **Families.** One family throughout: a geometric sans with single-storey g, horizontal-bar e, near-circular o, short-armed r. Reads as Poppins / Circular / Product Sans class — this is a guess, not a confirmed ID. Poppins or Nunito Sans on Google Fonts substitutes closely.

- **Headline : body.** headline ~3.2x chip text (headline cap height ~90px, chip cap height ~28px at 1280px wide). Zone-label pills ~1.4x chip text; annotations ~1.2x chip text.

- **Weights.** Two only: Bold/ExtraBold for the headline and both zone labels; Regular for all 24 chips and all 5 annotations. No medium, no light.

- **Case.** Sentence case everywhere; no all-caps anywhere, including zone labels. Chip capitalization is inconsistent in the source (“Content systems” vs “Market Research”) and the layout tolerates it because chips never align in a column.

- **Typographic moves.** Highlighter block behind one headline word (white text on #64B7FF, ~16px radius, extending ~10px past the glyphs each side). Rounded pills for both zone labels, one white-on-black and one black-on-white, so the two dividers are visually ranked. Italic for every annotation and roman for every chip — the only signal separating the creator's voice from the taxonomy. Chips are flat white rounded rects (~10px radius), no border, no shadow, floating directly on the blue.

- **Hard line limits.** Headline runs exactly 2 lines, breaking before or immediately after the highlighted word. Every chip is single-line, never wrapping — longest observed “Sales + content alignment” (25 chars) and “Strong Value Proposition” (24 chars). Annotations run 2-3 short lines; longest string “We need AI workflows everywhere!” at 32 chars.

### Color logic

- **Roles.** Page background above the waterline #FFFFFF. Primary ink #040405 (headline, chip text, waterline rule, boat/diver/bird silhouettes, “Surface Level” pill fill). Accent behind “Marketing” and mid-depth water: #64B7FF. Water field is one top-to-bottom gradient sampled at #CAE7FF (15%, just under the surface) → #B3DCFE (6%) → #9BD1FE (5%) → #64B7FF (5%) → #1565AA (4%) → #0A5DA4 (7%, the base). #B0D6F6 (5%) is the iceberg trapezoid body — a lighter, less saturated blue than the water at the same depth, the only thing making the berg silhouette visible. Chips are #FFFFFF; annotations are #FFFFFF below water and #040405 above.
- **Distinct hues.** 1
- **Does color mean anything.** Fully semantic and it is the whole diagram: lightness maps to depth maps to durability. Light = surface/faddish, dark = deep/permanent. The accent #64B7FF appears exactly twice in meaning-bearing positions — the headline highlighter and a mid-water gradient stop — tying the title to the artifact. No color anywhere is decoration.
- **Accent discipline.** Extreme. #64B7FF is 5% of ink pixels and #040405 black is 8%; the remaining ~40% of ink is one continuous blue ramp of a single hue. There is no second hue on the page — no green, no red, no warm tone. The photo headshot is the only non-blue, non-black element, occupying under 2% of the canvas.

### Data dependency

- **Needs external data.** no
- **What would have to be true.** None. This is a taxonomy, not a measurement — 24 opinion-sorted labels. The only claim is the sort order, which is the creator's judgment and is presented as such through the first-person italic annotations. No numbers, axis, units, or date range appear anywhere.
- **Provenance shown on the image.** No source line, citation, date, or data footer. The only provenance is authorship: “Pierre Herubel” in white italic bottom-right beside a circular headshot. The absence of a source is honest because nothing is presented as measured.
- **Fabrication risk.** Low but not zero. A generated copy would invent plausible-sounding items and place some in the wrong tier — a genuine fundamental parked in the surface zone, or a passing fad in the foundations, claims authority the author has not earned. Because the form carries no numbers, misplacement has no visible tell: a fabricated tier looks identical to a correct one. The visible symptom of fabrication is invented jargon — items must be terms the target audience already uses.

### Attribution

Bottom-right corner on the darkest blue. "Pierre Herubel" in white italic at roughly 1.1x chip text size, immediately left of a circular photographic headshot about 150px in diameter with a white ring. No handle, logo, URL, follow prompt, or repost prompt anywhere on the page. It reads unambiguously as a signature, not a CTA: it sits on the same baseline as the thesis annotation "What Never Changes" at the opposite corner, so the eye finishes on the claim and lands on the author.

### Density

- **Words:** 85 · **Discrete elements:** 39 · **Words per element:** 2.2 words per element (85 words across 39 elements: 24 chips, 2 zone-label pills, 5 annotations, 3 arrows, 3 icon marks, 1 headshot, 1 two-line headline)
- **Whitespace read.** Measured ink coverage is 53.4%, which normally means a crowded page, but nearly all of it is one flat blue field carrying zero information — the water is background that happens not to be white. By information density the page is sparse: 85 words over 1280x1600, with row gutters roughly the height of a chip. The above-water half is genuinely airy (bands 4-7 at 7-11% ink). The below-water half feels denser than it is because white-on-blue chips have maximum local contrast; the same chips on white would look half-empty.

### Thumbnail test at 220px: **PASS**

- **Survives.** At 220px the headline is fully legible including the blue highlighter on “Marketing”. The iceberg silhouette, the hard black waterline, and the light-to-dark blue depth ramp read instantly. Both zone-label pills are readable — “Surface Level” and “Foundations Level”. The three-tier chip stack registers as structure with an obvious count gradient: few chips up top, many at the bottom. The circular headshot registers as a person. The whole argument arrives without reading a single chip.
- **Dies.** All 24 chip labels degrade to gray smears; only the shortest (“Offers”, “Virality”, “New tools”, “Precise ICP”) are guessable, and only as word-shapes. All five italic annotations are gone — “What Never Changes” comes closest and still cannot be read with confidence. Boat, diver and bird silhouettes are 4-8px specks. The dashed Foundations divider nearly vanishes against the blue. The byline text is illegible.
- **Rule this proves.** The archetype must carry its meaning in three things that survive downscaling: headline, a hard tonal split at a fixed vertical position, and item-count-per-tier. Chip text is the reward for stopping, never the hook. Two build rules follow: zone-label pills need high-contrast solid fills (the black “Surface Level” pill survives, the white-on-light-blue one barely does), and the depth gradient must span a lightness range wide enough that top and bottom of the water are distinguishable at 220px.

### Why it works, and what breaks without it

- **A full-bleed black rule at 39% height flips the entire background from white to blue. The page is not divided by a gap or a heading, it is divided by a state change.**
  Without it: Replace it with a section heading and gutter and the three tiers become three lists of similar-looking chips. The reader would have to be told they are ranked; right now they cannot avoid seeing it. The whole above/below claim rides on this one rule.
- **Item count increases monotonically with depth — 6 chips above water, 8 mid-water, 10 in the foundations — matched to a trapezoid that widens as it descends.**
  Without it: With equal counts per tier the iceberg becomes decorative wallpaper the chips ignore, and the claim that the base is bigger than the tip disappears. Shape and content would be asserting different things.
- **The two dividers are deliberately unequal in weight: solid black rule with an inverted black pill for the waterline, dashed white rule with a white pill for Foundations.**
  Without it: Make both dividers identical and the reader sees three co-equal buckets. The ranked weight is what says the surface boundary is absolute and the tactics/fundamentals boundary is a soft gradient.
- **Italic is reserved exclusively for the creator's voice (annotations, byline), roman exclusively for the taxonomy (chips, labels); two of five annotations carry quotation marks and are someone else's voice, three do not and are the author's.**
  Without it: Set annotations in roman and they become more chips — items in the taxonomy rather than commentary on it. The quoted/unquoted split is what turns a static list into an argument between two positions.
- **One hue mapped to lightness mapped to depth, with zero competing colors: no red/green, no per-tier color coding, no categorical palette.**
  Without it: Color-code the three tiers with three hues and depth stops meaning anything — the tiers become nominal categories instead of an ordered scale, and the headline accent loses its link to the diagram below it.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- The circular headshot photograph. No CSS or SVG substitute produces a photo of a real person.
- The boat-with-figure silhouette and the scuba-diver silhouette. These are drawn illustration silhouettes, not icon-set glyphs, and hand-authoring comparable SVG paths at this detail is unreliable.
- The 5 flying-bird marks top right — small, but still hand-drawn illustration.

**Honest substitutes.**

- Headshot: pass the creator's photo in as a base64 data URI on an <img> with border-radius:50% and a 4px white ring. If no photo exists, drop the circle and keep the italic byline alone — a generated avatar or initials monogram is worse than absence because it reads as a placeholder.
- Boat / diver: drop both. Their information job (marking who stands at this depth) is already carried by the quoted annotations, whose quote marks signal a speaker. If a marker is required, use a small filled SVG circle on the waterline and at mid-depth as an anonymous observer dot rather than a bad boat.
- Birds: drop entirely. They carry zero information and only fill the top-right white gap; the gap is fine empty.

**Implementation notes.** Iceberg body: one absolutely-positioned div with clip-path: polygon(30% 0, 70% 0, 88% 100%, 12% 100%), background rgba(255,255,255,0.28) over the water and a very light #CAE7FF tint above the waterline so the tip is barely visible. Water: an absolutely-positioned div from top:39% to 100% with linear-gradient(#CAE7FF 0%, #B3DCFE 25%, #9BD1FE 45%, #64B7FF 65%, #1565AA 88%, #0A5DA4 100%). Waterline: a 4px #040405 div at top:39%, width:100%. Foundations divider: a div at top:67% with border-top:3px dashed #FFFFFF. Both zone pills: absolutely positioned on their rule, right:2%, transform:translateY(-50%), border-radius:999px, padding 10px 24px. Chip rows: one flex container per row, justify-content:center, gap:18px, 24px row gaps; chips white, border-radius:10px, padding 10px 20px, no border, no shadow. Do NOT use a fixed grid for chips — the ragged 2-and-3 rhythm comes from letting flex center whatever fits. Headline highlighter: a <span> with background:#64B7FF, color:#fff, border-radius:16px, padding 2px 14px, box-decoration-break:clone. Curved arrows: inline SVG, one quadratic Bezier <path> each (e.g. M0,0 Q40,60 90,50) plus a <polygon> arrowhead, stroke-width 5, stroke #040405 above the waterline and #FFFFFF below, fill:none, stroke-linecap:round. Annotations: font-style:italic, absolutely positioned with explicit left/top so they occupy the empty margins beside the trapezoid — the clip-path guarantees those margins exist. All percentage positions transfer unchanged to 1080x1350; the 0.800 ratio maps exactly.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `title_prefix` | string | 6-18 chars. Must end in a preposition or article so the highlighted word completes it. Renders as headline line 1. | The Iceberg of |
| `highlight_word` | string | Exactly 1 word, 4-14 chars — the domain name. Over 14 chars the highlighter block pushes the headline to 3 lines. | Marketing |
| `title_suffix` | string | 1-2 words, 5-14 chars. Sits right of the highlighter block on line 2; combined with highlight_word must stay under 26 chars. | Priorities |
| `surface_items` | list<string> | Exactly 6 items, each 6-18 chars, single line, no wrapping. Must be terms the audience already uses. Renders as 3 rows of 2. | ["2026 Trends", "AI Workflows", "Marketing Hacks", "New tools", "Shiny Tool stacks", "Virality"] |
| `mid_items` | list<string> | Exactly 8 items, each 12-25 chars — deliberately longer than surface_items so chip width grows with depth. Renders as 4 rows of 2. | ["Intent Signals", "Content systems", "Repurposing workflows", "Warm Outbound", "Personal Brands", "Partnerships & Collabs", "Sales + content alignment", "Allbound Approach"] |
| `foundation_items` | list<string> | Exactly 10 items, each 6-24 chars. Must mix short and long so flex-wrap yields both 2-item and 3-item rows; equal lengths kill the ragged edge. Count must exceed mid_items. | ["Brand narrative", "Focus on feedback loop", "Market Research", "Offers", "Unique Selling Point", "Marketing Discipline", "Strong Value Proposition", "Clear positioning", "Cons... |
| `divider_1_label` | string | 1-2 words, max 16 chars. Black pill on the solid rule, white text, right-aligned. | Surface Level |
| `divider_2_label` | string | 1-2 words, max 18 chars. White pill on the dashed rule, black text, right-aligned. Must be parallel in form to divider_1_label. | Foundations Level |
| `quote_surface` | string | Max 34 chars including quote marks, wraps to max 3 lines. Voice of someone the creator disagrees with. Black italic, upper-left, above the waterline. | “We need AI workflows everywhere!” |
| `quote_deep` | string | Max 34 chars including quote marks, wraps to max 3 lines. Voice of someone the creator agrees with. White italic, mid-right, below the waterline. | “We focus on our positioning.” |
| `note_surface` | string | 2-5 words, max 26 chars, no quote marks (creator's voice). Black italic, upper-right, with a curved arrow pointing down-left into the surface chips. | Try without losing focus |
| `note_mid` | string | 2-4 words, max 24 chars, no quote marks. White italic, mid-left, with a curved arrow pointing down-right into the mid chips. | New important tactics |
| `note_base` | string | 2-4 words, max 22 chars, no quote marks. This is the thesis of the image. White italic, bottom-left, with a short straight arrow up into the last chip row. | What Never Changes |
| `accent_hex` | hex | One hue only. Light enough for white headline text to sit on it, and must also be a stop inside the water gradient. The rest of the palette derives from it. | #64B7FF |
| `water_gradient_stops` | list<string> | 4-6 stops of the SAME hue, monotonically darkening top to bottom, spanning a lightness range wide enough to read at 220px. No hue shift between stops. | ["#CAE7FF", "#B3DCFE", "#9BD1FE", "#64B7FF", "#1565AA", "#0A5DA4"] |
| `berg_body_hex` | hex | A single desaturated tint of accent_hex, lighter than the water at mid-depth, used at ~28% opacity for the trapezoid. Must be distinguishable from the water or the silhouette disappears. | #B0D6F6 |
| `byline` | string | Name only, max 20 chars. No handle, URL, or CTA. White italic, bottom-right. | Pierre Herubel |
| `avatar_data_uri` | string | Optional base64 image data URI. Rendered as a ~150px circle with a 4px white ring, right of the byline. Omit entirely rather than substituting a monogram or generated face. | circular photographic headshot, bottom-right corner |
| `waterline_pct` | integer | 35-42. Percent of canvas height for the solid rule. Below 35 the surface zone cannot hold 6 chips; above 42 the underwater rows crowd. | 39 |
| `divider_2_pct` | integer | 63-70, and at least 24 points below waterline_pct. Percent height of the dashed rule. | 67 |

### Design-tell audit against PRD §10

**Violates (2).**

- “everything centered” — the headline is centered and all 24 chips are centered inside the trapezoid. The creator gets away with it because the trapezoid's converging edges make centering structural: the chips are centered ON the iceberg, and the annotations deliberately break to the outer left and right margins so the page never reads as one centered column. Centering an axis-symmetric object is not the tell; centering things with no axis is. The rule is right, this image is outside its scope.
- “default Inter or Poppins with no adjustment” — the family reads as stock geometric sans, likely Poppins class. Partially violated. Mitigated by visible tracking-tightening on the 90px headline and by only two weights appearing anywhere, but a rebuild should adjust letter-spacing rather than ship the default.

**Avoids (8).**

- No purple-to-blue gradient — the gradient is one hue and load-bearing (depth), not decorative.
- No three equal cards in a row — chip rows are ragged 2s and 3s from flex-wrap, and the tiers hold 6/8/10 rather than equal counts.
- No drop shadows — all 24 chips are flat white rects with no shadow, border, or stroke.
- No generic icon set used decoratively — the three illustration marks are custom silhouettes and each marks who stands at that depth.
- No emoji anywhere.
- No eyebrow, kicker, or category label above the headline.
- No title-only opener — single image, dense with information from band 4 down.
- No CTA — the byline is a signature; no follow prompt, repost prompt, logo, or URL.

**New tells this image implies, not currently on the list (6).**

- Dividers of equal visual weight in a ranked diagram. If a layout claims tiers are ordered, the boundaries must not all look the same — the solid black waterline outranks the dashed white one, and flattening them flattens the argument. Gate rule: in any tiered layout at least one boundary must differ in weight, style, or fill.
- Equal item counts across tiers of a shape-based diagram. If the container shape widens or narrows, item counts must track it. Gate rule: pyramid/funnel/iceberg layouts need monotonically changing counts per tier, minimum delta of 2.
- Uniform chip lengths inside a wrapping row. All-equal-width chips reflow into a rigid grid and the pile stops reading as organic. Gate rule: within any wrap-based chip cluster the longest item must be at least 2x the shortest.
- Voice not typographically separated from data. When commentary shares the margins with the taxonomy, the reader cannot tell a claim about the world from a claim by the author. Gate rule: annotation text must differ from item text in at least two of {style, color, weight, quotation}.
- Background color that carries no meaning. A 53%-ink page is only justified if the fill encodes something. Gate rule: any full-bleed color field must map to a stated variable (here, depth) or be replaced with white.
- A photograph as the only non-vector element. It is the single blocker in an otherwise fully reproducible layout; an archetype that needs a photo to feel finished is fragile. Gate rule: photographic elements must be droppable without leaving a hole.

### Failure modes when copied badly

- Tier assignment is arguable and the reader spends attention litigating placement instead of absorbing the sort — one obviously misplaced item discredits all 24.
- All three tiers get equal item counts, the trapezoid stops corresponding to the content, and the iceberg becomes wallpaper behind three plain lists.
- Chips are written at uniform length, flex-wrap resolves them into a tidy 2x12 grid, and the ragged organic pile collapses into a spreadsheet.
- One chip is too long, wraps to two lines, and its row's baseline breaks — the single thing that makes the cluster look assembled rather than rendered.
- The water gradient spans too narrow a lightness range, the depth signal dies at thumbnail size, and the image reads as one flat blue rectangle with white boxes on it.
- Annotations are written as more taxonomy items rather than as voices, the italic/roman split carries no meaning, and the page reads as 29 chips instead of 24 chips plus an argument.
- Both dividers get identical styling, the tiers flatten into co-equal buckets, and the ranked claim silently disappears.
- The surface tier is loaded with strawmen nobody actually advocates, and the image reads as a rant rather than a map.
- A generated avatar or initials circle replaces the missing headshot and reads as a template placeholder, undercutting the signature framing of the byline.
- Zone labels are centered instead of right-aligned on their rules, colliding with the trapezoid edge where it is widest.

### Topic fit

- **Fits when.** A domain has an accepted vocabulary of 20-25 named things and the creator holds a defensible opinion about which are transient versus permanent. Works when the ranking is the insight and the items are already familiar — the reader's job is to check their own placement against the author's, which requires recognizing most terms on sight.
- **Breaks when.** The items are unfamiliar or need defining — chips have no room to explain themselves, so an unknown term is dead pixels. Also breaks when the underlying relationship is not depth/durability: sequences over time, cause-and-effect chains, before/after comparisons, and anything with real quantities all get distorted, because the shape asserts “the bottom is bigger and more permanent” whether or not that is true. And it breaks under roughly 15 items — a sparse iceberg looks like a mistake.
- **Input signature that should trigger selecting it.** Select this archetype when the raw material is 18-26 short named items in one domain, sortable into exactly 3 ordered strata by permanence/visibility/depth, with counts that can be made to increase toward the bottom (roughly 6/8/10), plus 3-5 one-line opinions the author holds about those strata. If the items carry numbers, or the ordering is temporal, choose a different form.

<details>
<summary>All visible text, in reading order</summary>

The Iceberg of Marketing Priorities | "We need AI workflows everywhere!" | 2026 Trends | AI Workflows | Marketing Hacks | New tools | Shiny Tool stacks | Virality | Try without losing focus | Surface Level | Intent Signals | Content systems | New important tactics | Repurposing workflows | Warm Outbound | "We focus on our positioning." | Personal Brands | Partnerships & Collabs | Sales + content alignment | Allbound Approach | Foundations Level | Brand narrative | Focus on feedback loop | Market Research | Offers | Unique Selling Point | Marketing Discipline | Strong Value Proposition | Clear positioning | Consistent Messaging | Precise ICP | What Never Changes | Pierre Herubel

</details>

---

## 13. two-column dimension table
**File:** `Pierre Herubel/1785917765285.jpeg` · **Creator:** Pierre Herubel

A full-bleed bordered comparison table that puts two confusable concepts in color-coded columns and runs them down seven named dimensions, ending with a merged row of what they have in common.

**Information job.** "These two words get used interchangeably — on which specific dimensions do they actually differ, and where do they overlap?" The reader can enter at any row label and get a side-by-side answer without reading the rest.

### Where the idea came from

**Likely origin.** A framework they teach, aimed at a term pair the audience uses wrong. The image is a teaching artifact lifted out of a consulting/coaching curriculum, not a data finding.

**Evidence in the image.** Row labels are diagnostic categories a consultant would use in a workshop, not neutral attributes: "Common Traps", "Success Factors", "Typical Questions". The "Buying Cycles" row contains a proprietary cascade diagram (Business Strategy + Revenue Objectives -> Strategy -> "Roadmap Validation" gate -> Tactics -> Operations) that is not derivable from the definitions above it — it is a named model being smuggled in. The closing merged row "Similarities" is the move of someone who has had this argument enough times to pre-empt the "but they're the same thing" objection.

**The generative question, portable to any niche.** Pick two terms your audience treats as interchangeable (or believes are opposites). Name 5-7 dimensions on which practitioners actually separate them — definition, time horizon, the questions each answers, how each fails, what each is made of — give a one-to-two-line answer per term per dimension, and close with a full-width row of what both share.

### Headline and subtitle

> Marketing Strategy vs Tactic

- **Words:** 4
- **Form:** Bare label in "A vs B" form. No typographic emphasis inside the line: single weight (heavy), single color (#080808), tight tracking, set at the largest size on the canvas and stretched to nearly the full canvas width. The "vs" is the same weight and size as the terms — it is not de-emphasized.
- **Promise:** You will be told, concretely, how these two things differ. The "vs" contract implies a symmetric answer, which the two-column body then pays off.
- **Subtitle:** *none*
- **What the subtitle does that the headline cannot:** None. The table's own column headers ("Marketing Strategy" / "Marketing Tactic") do the scoping work a subtitle would normally do, restating the headline's two halves as the two column identities. That restatement is what lets the headline stay at 4 words.

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 0-9% | Headline band | State the comparison pair; own the thumbnail. | "Marketing Strategy vs Tactic" in one line, heavy weight, #080808, edge-to-edge. Faint #D2D2D3 graph-paper grid texture is visible behind it — the only place the background texture is not covered by table cells. |
| 9-17% | Column header row | Assign a color identity to each side, permanently. | Empty top-left cell (the row-label rail has no header), then "Marketing Strategy" on a solid #BEE1FF fill and "Marketing Tactic" on a solid #FDD3D5 fill. Both centered, bold, #080808. This is the 79% ink band. |
| 17-27% | Definition row - Role | Give each term a one-sentence definition with the operative phrase bolded. | Label "Role". Left: "The high-level plan that guides how to achieve revenue goals." Right: "The specific actions and methods used to execute the strategy." Two lines each, mixed weight inside the sentence. |
| 27-35% | Quantified row - Time Horizon | Turn the abstract difference into numbers. | Label "Time Horizon" (2 lines). Left: "12-36 months and rarely changes except if the business pivots." Right: "3-12 months and adjusts based on performance." |
| 35-53% | Full-width diagram row - Buying Cycles | Break the text rhythm once and show the two terms as positions in one pipeline rather than as opposites. | Column separator dissolves; a pale blue wash on the left half and pale pink wash on the right half replace the solid header tints. Inside: braces gathering "Business Strategy" and "Revenue Objectives" into an apex at left, a dotted wedge expanding rightward, a black dashed vertical divider, a black pill "Roadmap Validation" straddling the top of that divider, a blue pill "Strategy", a pink pill "Tactics", and a black arrow to bold "Operations". Bands 8-11 (40/29/23/28). |
| 53-66% | Parallel checklist row - Typical Questions | Show what each side is responsible for answering. | Label "Typical Questions". Four ☐-prefixed questions per side, left-aligned, single line each. |
| 66-75% | Failure row - Common Traps | Name the failure mode of each side; the near-identical phrasing ("Too many directions, lack of focus" / "Too many tactics, lack of focus") is the point. | Label "Common Traps". Two ✕-prefixed lines per side. |
| 75-85% | Pill inventory row - Success Factors | Enumerate the components of each side as scannable chips. | Label "Success Factors". Left: 6 pale-blue pills. Right: 8 pills in #FDABB1/#F3AFB3. Wrapped, ragged-right, 2-3 per line. Bands 16-17 (45/47) — the second densest region after the header. |
| 85-99% | Merged resolution row + attribution | Collapse the two columns into one to state the overlap, and sign the piece. | Label "Similarities". One merged cell spanning both content columns holds four ☐-prefixed lines. A narrow fourth cell is carved off at the right holding a circular headshot above "By Pierre Herubel" on two lines. |

### Reusable skeleton

```
+----------------------------------------------------+
|  HEADLINE  "A vs B"  full-width, one line, heavy   |  0-9%
+--------+---------------------+---------------------+
|        |   COL A LABEL       |   COL B LABEL       |  9-17%
| (empty)|   solid tint A      |   solid tint B      |
+--------+---------------------+---------------------+
| DIM 1  | 2-line prose,       | 2-line prose,       | 17-27%
| label  | key phrase bold     | key phrase bold     |
+--------+---------------------+---------------------+
| DIM 2  | 2-line prose w/     | 2-line prose w/     | 27-35%
| label  | numbers             | numbers             |
+--------+---------------------+---------------------+
| DIM 3  |  FULL-WIDTH DIAGRAM (no column rule)      | 35-53%
| label  |  wash A ....|.... wash B                  |
|        |  in>-- A --[GATE]-- B -->out              |
+--------+---------------------+---------------------+
| DIM 4  | [] item x4          | [] item x4          | 53-66%
+--------+---------------------+---------------------+
| DIM 5  | X item x2           | X item x2           | 66-75%
+--------+---------------------+---------------------+
| DIM 6  | (pill)(pill)        | (pill)(pill)(pill)  | 75-85%
| label  | (pill)(pill) tintA  | (pill)(pill) tintB  |
+--------+---------------------+-------------+-------+
| SHARED | [] merged full-width line x4      | photo | 85-99%
| label  |                                   | BY X  |
+--------+-----------------------------------+-------+
```

### Type system

- **Families.** One geometric sans across the entire canvas, no second family. Double-story 'a', single-story 'g' with an open hook, tall x-height, circular 'o', straight-tailed 'y'. My guess is Montserrat (Google Fonts) — Figtree or Nunito Sans are the near-neighbors; it is a guess, not a match I can confirm from raster. Numerals are lining and proportional ("12-36", "3-12").

- **Headline : body.** headline ~3.4x body cap-height (headline cap ~78px, body cap ~23px at 1280 wide). Column headers ~1.5x body. Row labels ~1.15x body.

- **Weights.** Three: Bold/ExtraBold (headline, column headers, row labels, "Operations", inline emphasis inside definitions), Regular (all body prose, list items, pill text), and the same Regular at reduced size for the diagram's braced inputs. No light or italic anywhere.

- **Case.** Sentence case everywhere including the headline and all labels. No all-caps, no small caps — which is notable given how many infographics would set the row-label rail in caps.

- **Typographic moves.** 1) Mixed weight inside a running sentence to carry the definition: "The **high-level plan** that guides..." / "The **specific actions and methods** used to..." — the bold fragment alone is a readable summary. 2) Pill/badge treatment as the entire content format of one row (rounded-full tinted spans). 3) A black pill with reversed white text ("Roadmap Validation") used once, as the single highest-contrast object in the diagram. 4) Unicode glyph bullets rather than list markers: ☐ for neutral enumerations, ✕ for failure enumerations — the glyph choice is the only semantic marker distinguishing the two list rows. 5) Tight tracking on the headline so 28 characters fill the full 1280px width.

- **Hard line limits.** Headline: 1 line, always. Column headers: 1 line. Row labels: 1-2 lines, centered. Prose cells: max 2 lines. List items: 1 line each, never wrapped. Longest body strings measured: "Determine where to invest time, budget, talent, and tools." (58 chars, merged full-width row), "The specific actions and methods used to execute the strategy." (62 chars over 2 lines), "Which programs will we prioritize?" (34 chars, single-line list item), "Unique Selling Point" (20 chars, longest pill).

### Color logic

- **Roles.** Page background #FEFEFE. Background texture: faint #D2D2D3 graph-paper grid, visible only in the headline band before the table covers it; #D2D2D3 also accounts for edge antialiasing. Primary ink and all table rules: #080808 (11% of pixels) — borders and type share one black, at one uniform weight. Secondary ink #29292A and #434243 (6% each) are the antialiased mass of the Regular-weight body text. Column A identity: #BEE1FF (9%) as the solid header fill; a paler dilution of the same blue for the Success Factors pills and for the left half of the diagram wash. Column B identity: #FDD3D5 (12%) as the solid header fill and the diagram's right wash, with #FDABB1 (9%) and #F3AFB3 (5%) as the denser pink of the right-side pills. One reversed element: white type on #080808 for the "Roadmap Validation" pill.
- **Distinct hues.** 2
- **Does color mean anything.** Fully semantic. Blue means column A and pink means column B for the entire canvas — the header fills teach the code, the pills and the diagram washes spend it. Inside the diagram the code does real work: the pill "Strategy" is blue and "Tactics" is pink, so the reader maps the pipeline onto the columns without a legend. Black is reserved for structure (rules, type) plus the one gate marker; nothing is colored decoratively.
- **Accent discipline.** This is not accent discipline, it is block coding, and the numbers say so: the two tint families account for roughly 35 of the 26.1 percent ink budget's colored share (#FDD3D5 12 + #FDABB1 9 + #BEE1FF 9 + #F3AFB3 5 = 35% of non-background pixels). The restraint is in hue count, not coverage — two hues, no third, no gradient, no shadow, no saturated version of either hue. Both tints sit at the same pastel value so neither column reads as the favored one.

### Data dependency

- **Needs external data.** no
- **What would have to be true.** None external. Every cell is definitional or opinion: role, time horizon, the questions each discipline asks, its failure modes, its components. The only quantities are "12-36 months" and "3-12 months", which are the author's rules of thumb, not measurements.
- **Provenance shown on the image.** None. There is no source line, no methodology note, no date, no URL. The only provenance is the byline cell: a circular headshot and "By Pierre Herubel". Authority is asserted by face and name, not by citation.
- **Fabrication risk.** Low visible risk, high invisible risk. An AI filling this form invents nothing that can be checked — definitions, traps and component lists are all defensible-sounding by construction. The one place it can lie undetectably is the quantified row: numbers like "12-36 months" read as fact because they sit in a table, and a fabricated range would be indistinguishable from the real one. Mitigation for a template: either source the numeric row or phrase it as a range with a hedge, and never let the generator produce a percentage or a dollar figure in this form.

### Attribution

{"contents": "Bottom-right, inside the table, in its own bordered cell carved out of the final merged row — roughly the right 16% of canvas width and the full height of that row (85-99%). Circular photographic headshot (~90px diameter at 1280 wide, ~7% of width), centered, with a thin dark ring. Below it, centered on two lines: \"By Pierre\" / \"Herubel\", set at roughly 1.1x body size in Regular weight, #080808. No handle, no @, no company logo, no URL, no \"follow for more\", no arrow, no repost prompt. It reads as a signature: it is given a cell in the grid like any other content, so it terminates the table rather than sitting on top of it as an overlay. The cost is that it steals width from the final row's fourth list item, which is why that line runs longest and closest to its cell edge."}

### Density

- **Words:** 183 · **Discrete elements:** 39 · **Words per element:** ~4.7 words per element (183 / 39). Counting: 1 headline + 2 column headers + 7 row labels + 13 content cells + 14 pills + 1 diagram + 1 headshot.
- **Whitespace read.** 26.1% ink with 0.0% left margin and 1.6% right margin, and it still does not read as cramped. Three reasons. First, most of that ink is flat pastel fill, not type — the 35% of ink pixels that are tint carry zero reading load, so measured density overstates cognitive density. Second, the row-label rail is ~20% of the width and is almost entirely empty (one or two centered words per row), giving every row a built-in gutter on the left. Third, the ink density bands alternate hard — 79 at the header, then 15/15/11 through the definition rows, 45/47 at the pills, 17/21/14 at the close — so the eye gets flat empty stretches between the loaded ones. What it is not is airy: there is no outer margin at all, and the bottom row's longest line nearly touches its cell border.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** The headline, fully legible: "Marketing Strategy vs Tactic". The two column header labels, legible with effort — enough to know the left is blue and the right is pink and that they name the headline's two halves. The table skeleton: seven horizontal rules, one vertical rule, a left rail of short bold words. The bold row labels resolve as word-shapes and the shorter ones ("Role", "Similarities", "Common Traps") are readable. The pill row reads unambiguously as two clusters of colored chips. The black "Roadmap Validation" pill survives as a black bar. The headshot circle survives as a face-shaped disc marking the bottom-right corner.
- **Dies.** All body prose. Every definition sentence, every question, every trap, every similarity line collapses to grey texture — you can count the lines but not read one word. All pill text is gone; only the chip shapes and their color remain. The diagram is the biggest casualty: the dotted wedge, the braces, the arrows and the small "Strategy"/"Tactics"/"Operations" labels all vanish, leaving a pale blue-to-pink smear that reads as an empty row. The bold-inside-sentence emphasis is invisible. "By Pierre Herubel" is illegible.
- **Rule this proves.** At feed scale this archetype sells on four things only: the headline, the two colored header cells, the visible row count, and one texturally distinct row (here, the pills). Everything else is a promise of density rather than a communication. So: the headline must be self-sufficient and set at ~3.4x body with near-zero side margin; the color code must be introduced as solid full-cell fills, never as thin borders or small swatches; and at least one row must have a silhouette different from a paragraph. Conversely, a diagram row is a bad thumbnail investment — it costs 18% of the canvas and returns nothing above the fold. Put it in the middle, where it is already, and do not build the piece around it.

### Why it works, and what breaks without it

- **A dedicated row-label rail (~20% of width) names the dimension of every comparison before the reader reads either answer.**
  Without it: Remove the rail and you have two parallel bulleted lists. The reader must infer, for each pair of lines, what attribute is being compared — and pairs like "12-36 months..." / "3-12 months..." only mean something once "Time Horizon" is stated. Comprehension per row drops to zero for the diagram row and the pill row, which have no self-evident subject.
- **Color identity is assigned once in a solid-fill header cell (#BEE1FF / #FDD3D5) and then reused in the pills and the diagram washes, so the diagram needs no legend.**
  Without it: Without the carry-through, the blue "Strategy" pill and pink "Tactics" pill in the middle row are two arbitrary colored chips; the reader cannot map the pipeline back onto the columns and the diagram becomes an unrelated illustration. And at 220px, where all type dies, the color pair is the only thing that says "this is a two-sided comparison" — remove it and the thumbnail is an unreadable grey grid.
- **Each row uses a different cell format — prose, quantified prose, diagram, ☐-list, ✕-list, pills, merged prose — so the vertical silhouette changes every row.**
  Without it: Set all seven rows as prose and the ink density flattens from its measured 79 / 15 / 40 / 15 / 45 / 17 pattern into a uniform band, which removes every re-entry point: a reader who looks away cannot find their place, and a scroller has no reason to stop. The ✕/☐ glyph swap also carries the only signal that one list is failures and the other is neutral questions; unify the bullets and "Common Traps" reads as more questions.
- **Near-zero outer margin (L 0.0%, R 1.6%, T 2.3%, B 0.8%) — the table is full-bleed, so type is set as large as the canvas allows.**
  Without it: Add a conventional 6% side margin and every measurement scales down ~12%: the headline stops filling the width and stops being the thumbnail's whole signal, and the 34-character list items fall below feed legibility. The full-bleed is not a style choice, it is what pays for 183 words at readable size in one frame.
- **The final row merges both columns and states the overlap ("Similarities"), inverting the structure exactly once, at the end.**
  Without it: Drop it and the piece is a list of oppositions with no resolution, which invites the obvious objection that the two things are separable in theory only. It also has a structural job: the merged row is what creates the free cell for the byline, so removing it forces the attribution to become an overlay or a footer outside the table, breaking the rule that everything on this canvas lives inside a grid cell.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- The circular photographic headshot. There is no image generation and no external asset, so a real face cannot be produced.
- Nothing else. The curly braces, dotted wedge, dashed divider and arrows in the diagram row look hand-drawn but are all straight lines and a quadratic curve — inline SVG handles them exactly.
- Minor: the faint #D2D2D3 graph-paper texture behind the headline is a scanned-paper artifact of the source tool; it is reproducible with a repeating-linear-gradient but is not the same texture.

**Honest substitutes.**

- Headshot -> a same-diameter circle with a 2px #080808 ring containing the author's initials in the same geometric sans, Bold, centered. It preserves the information job (this is signed by a named person) and keeps the cell's visual weight so the final row's proportions are unchanged. Do NOT drop the circle entirely and leave only the text — the empty cell then reads as a layout error.
- If a real photo file is available at build time it can be inlined as a data: URI inside the same circle; that is the only path to the original.
- Graph-paper texture -> `background-image: repeating-linear-gradient(...)` at #D2D2D3 on a 40px pitch, at low opacity, applied to the page background. Or drop it: it is invisible at thumbnail size and contributes nothing to the information job.

**Implementation notes.** Structure: one CSS Grid, `grid-template-columns: 20% 40% 40%`, with each cell given `border: 3px solid #080808` collapsed via a table-like `border-collapse` (or simpler: use a real `<table>` with `border-collapse: collapse` — this content IS a table and the semantics are free). Body `margin:0` and the table at `width:100%` gives the measured 0.0% left margin. Header cells get `background:#BEE1FF` / `#FDD3D5`. The diagram row is a single `<td colspan="2">` with `position:relative` and two absolutely-positioned 50%-width washes (`#BEE1FF` and `#FDD3D5` at ~0.25 alpha) as its background. Pills: `<span>` with `border-radius:999px; padding:.35em .8em; display:inline-block`, wrapped in a flex container with `flex-wrap:wrap; gap:10px`; the blue pills use the header blue at reduced alpha, the pink pills use `#FDABB1`. The black gate pill is the same span with `background:#080808; color:#FEFEFE`. Bold-inside-sentence is a plain `<strong>`. Bullets are literal `☐` and `✕` characters in the text node with a `margin-right`, not `list-style` — this reproduces the exact hanging-indent look and keeps single-line control. Diagram as one inline `<svg viewBox="0 0 800 260">`: two `<line>` elements from the apex (x=60,y=130) diverging to (740,20) and (740,240) with `stroke-dasharray="2 4"`, a vertical `<line>` closing the right end, a `<line x1=380 x2=380>` with `stroke-dasharray="10 8"` for the gate, `<path d="M ... q ...">` for the two curly braces feeding the apex, and `<marker>`-based arrowheads for the two input arrows and the output arrow to "Operations". Text labels inside the SVG as `<text>` so they scale with the viewBox. Fonts: one Google Fonts family (Montserrat) at 400/700/800 with `font-family: Montserrat, 'Helvetica Neue', Arial, sans-serif`. Fixed canvas: `body{width:1080px;height:1350px}` — note the source is 0.806 ratio and the target is 0.800, so row heights need ~1% redistribution, easiest by letting rows auto-size and giving the diagram row a `min-height`.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline` | string | Must fit one line at full canvas width: 22-34 characters. Sentence case. "A vs B" or "A vs. B" form; the two halves must be the same two strings used in column_a_label / column_b_label (or their short forms). | Marketing Strategy vs Tactic |
| `column_a_label` | string | 1 line, 8-22 characters. Sentence case, bold. | Marketing Strategy |
| `column_b_label` | string | 1 line, 8-22 characters. Should be within ~4 characters of column_a_label so the two header cells look balanced. | Marketing Tactic |
| `tint_a` | hex | Pastel, luminance > 0.85, used at full opacity as a header fill and at ~25% for the diagram wash. Must be a different hue family from tint_b, not a different shade. | #BEE1FF |
| `tint_b` | hex | Same luminance band as tint_a (within ~5%) so neither column reads as dominant. | #FDD3D5 |
| `tint_b_pill` | hex | One step more saturated than tint_b, for the column-B pills; column A pills use tint_a directly. Keeps #080808 text at AA contrast. | #FDABB1 |
| `rows` | list<{label, kind, a, b}> | 5-7 rows, exactly one of kind=diagram (optional, max 1) and exactly one of kind=merged which must be last. Order the rest: prose first, then list, then pills. Fewer than 5 rows leaves the canvas short at 0.8 ratio; more than 7 pushes body type below thumbnail legibility. | 7 rows: Role (prose), Time Horizon (prose), Buying Cycles (diagram), Typical Questions (list), Common Traps (list), Success Factors (pills), Similarities (merged) |
| `row.label` | string | 4-17 characters, 1-2 words, wraps to at most 2 lines, centered in a 20%-width rail. Must name a dimension, never a value. | Typical Questions |
| `row.kind` | enum | One of: prose \| list \| pills \| diagram \| merged. Determines the cell renderer. At least three distinct kinds must appear or the vertical silhouette flattens. | pills |
| `prose_cell` | string | 45-62 characters, renders on exactly 2 lines. Must contain one bolded fragment of 2-5 words that is a readable summary on its own. Both sides of a prose row should be within 8 characters of each other. | The high-level plan that guides how to achieve revenue goals. (bold: "high-level plan") |
| `list_cell` | list<string> | 2-4 items, equal count on both sides of the row. Each item 18-34 characters, must not wrap. Prefix glyph is fixed per row: ☐ for neutral enumerations, ✕ for failure enumerations. | ["Who do we target?", "What problem do we solve?", "Why do we win vs alternatives?", "What do we communicate?"] |
| `list_glyph` | enum | ☐ or ✕. One value per row, applied to both columns. Two list rows in the same image must use different glyphs. | ✕ (Common Traps row) |
| `pill_cell` | list<string> | 6-8 pills per side, 1-3 words each, 4-20 characters each. Sides may differ in count by up to 2. Must wrap to 3 lines per side at 40% column width. | ["Target audience", "Market problem", "Positioning", "Value proposition", "Messaging", "Unique Selling Point"] |
| `merged_cell` | list<string> | Exactly 4 items, 42-58 characters each, single line each, ☐-prefixed. Spans both content columns minus the attribution cell, so the last item must stay under 58 characters or it collides with the byline cell. | ["Both require a clear direction and a strong focus.", "Both need to understand the customer at a different level.", "Determine where to invest time, budget, talent, and tools."... |
| `diagram.inputs` | list<string> | Exactly 2, each 2 words / max 18 characters, wrapping to 2 lines. Rendered left of the apex with a brace and arrow each. | ["Business Strategy", "Revenue Objectives"] |
| `diagram.stage_a` | string | 1 word, max 12 characters. Rendered as a tint_a pill left of the gate. Should equal column_a_label's short form. | Strategy |
| `diagram.stage_b` | string | 1 word, max 12 characters. Rendered as a tint_b pill right of the gate. Should equal column_b_label's short form. | Tactics |
| `diagram.gate_label` | string | 2 words, 14-22 characters. Black pill, white text, sits on the dashed divider between stage_a and stage_b. This is the only reversed-color element in the image — do not add a second. | Roadmap Validation |
| `diagram.output` | string | 1 word, max 12 characters, bold black, preceded by a solid arrow at the far right. | Operations |
| `author_name` | string | "By " + name, 12-20 characters total, wraps to 2 centered lines in a cell ~16% of canvas width. No handle, no URL, no CTA verb. | By Pierre Herubel |
| `author_avatar` | string | Optional data: URI for a square photo, rendered in a ~90px circle. If absent, fall back to 2 uppercase initials in the same circle — never render the cell empty. | circular headshot, ~90px diameter, thin dark ring |

### Design-tell audit against PRD §10

**Violates (3).**

- "everything centered" — partially, and deliberately. The headline reads as centered (it is stretched to full width so the distinction is moot), and every column header and every row label is centered. But all content cells are hard left-aligned with a consistent left pad, and the bullet glyphs create a hanging indent. So the tell is violated in the labels and inverted in the body. The rule is right about body copy and wrong about label rails: a centered 1-2 word label inside a narrow bordered cell is correct, because left-aligning it would leave a ragged void on the right of a 20%-wide cell.
- "emoji standing in for icons" — borderline violation. The ☐ (U+2610) and ✕ (U+2716) are Unicode glyphs doing icon work. The creator got away with it because both are monochrome typographic marks that render in the body font's color and weight, carry actual semantics (neutral vs failure), and are used systematically rather than as decoration. The rule should be narrowed: colored/pictorial emoji are the tell, monochrome geometric glyphs used as a consistent bullet system are not.
- "default Inter or Poppins with no adjustment" — near miss. One geometric sans at defaults for the body, escaping only because the headline gets tight tracking at 3.4x scale and because three weights are actually used.

**Avoids (7).**

- No purple-to-blue gradient — no gradient of any kind, both tints are flat fills.
- No three equal cards in a row — the structure is a table, and the columns are 20/40/40, not equal thirds.
- No drop shadows anywhere; the only separation device is a 3px #080808 rule.
- No generic icon set used decoratively — there are no icons at all.
- No eyebrow, no kicker, no "THE ULTIMATE GUIDE" label above the headline; the headline is the first ink on the canvas.
- No slide-1-is-just-a-title problem — this is a single frame that is entirely payload; the title occupies 9% of height and the other 91% answers it.
- No logo, no follow CTA, no arrow-to-swipe, no URL.

**New tells this image implies, not currently on the list (6).**

- A comparison image whose two columns are colored but whose color never recurs below the header row — the code is announced and then abandoned. Here the tints reappear in the pills and the diagram washes; if they had not, the header fills would be pure decoration. Gate rule: any color assigned in a header must appear at least twice more in the body.
- A comparison table where every row is the same cell format. Seven prose rows is a wall. Gate rule: a table archetype with 5+ rows must use at least three distinct cell renderers.
- A diagram dropped into a table row under a label that does not describe it. "Buying Cycles" labels a strategy-to-operations cascade with no buying cycle in it — the one place the grammar breaks. Gate rule: the row label must be derivable from the cell contents by a reader who sees only that row.
- Uniform border weight for header rules, column rules and body rules, so the grid has no hierarchy. It survives here because the header's solid fill supplies the hierarchy the rules do not. Gate rule: if all rules are one weight, at least one row must carry a fill.
- Attribution that eats content width. The byline cell is carved out of the last content row, forcing that row's lines shorter than every other row's. Gate rule: give the byline its own full-width strip or its own cell in a row sized for it, never a notch out of a content cell.
- Both column headers set at the same length and weight with no visual indication of which is the reader's likely default belief. This form is neutral by construction, which is correct for a reference table and wrong for a myth-busting image — a different archetype.

### Failure modes when copied badly

- Rows drift out of parallel: the left cell answers the dimension and the right cell answers something else. Symptom — the reader's eye stops crossing the column rule and reads two independent lists top-to-bottom.
- Prose cells of unequal length, one side 2 lines and the other 5. Symptom — the row's vertical center is off, the row label floats above the shorter cell, and the table height is set by one runaway sentence.
- Straw-manning the right column so the comparison has an obvious winner. Symptom — the pills on one side are all positive nouns and the other side's are all admin chores; "Common Traps" becomes asymmetric in count.
- The diagram row filled with a generic left-to-right arrow flow that restates the columns instead of adding a mechanism. Symptom — an 18%-tall band that a reader can skip with no loss, i.e. the highest-cost region returns the least.
- Too many pills. Nine or more per side wraps to 4+ lines, the pill row swells past the header row in height, and the chips shrink below thumbnail-recognizable size.
- Row labels written as values rather than dimensions ("Long-term" instead of "Time Horizon"). Symptom — the rail duplicates the left column's content and the right column's cell contradicts its own row label.
- The merged final row used for another difference instead of the overlap. Symptom — the structural inversion fires with no payoff, and the piece ends without answering "so are they related at all?".
- Bold-inside-sentence applied to 8+ words per cell. Symptom — the emphasis stops summarizing and the cell reads as two competing weights of noise.
- List items pushed past 34 characters so they wrap. Symptom — a 4-item list becomes 7 visual lines, the ☐ hanging indent breaks, and the row's height doubles.
- A third hue introduced for the diagram or the merged row. Symptom — the blue/pink binary stops meaning "column A / column B" and the thumbnail's only surviving signal is destroyed.

### Topic fit

- **Fits when.** Two named things that a specific audience conflates, confuses, or believes are the same, where practitioners separate them on several stable dimensions — and where the honest answer includes real overlap. Works for term pairs (strategy/tactic, brand/demand, churn/contraction), role pairs, tool categories, methodology pairs, and lifecycle stages that get collapsed into one word. It needs a definitional domain: the value comes from the author's judgment, not from data.
- **Breaks when.** 1) The two things are not actually comparable on shared dimensions — you get rows where one column is empty or says "N/A", which reads as a research failure. 2) One option is simply better; the symmetric layout promises a balanced comparison and then delivers a verdict, so the reader feels sold to. 3) More than two things are being compared — a third column at 1080px leaves ~27% per column, which forces list items under 22 characters and kills the prose rows. 4) The subject is a process or a sequence, where a comparison grid destroys the ordering that is the actual information. 5) The subject is quantitative — a table of numbers should be a chart, and this form has no axis, no scale and no way to show magnitude.
- **Input signature that should trigger selecting it.** Trigger on: two competing or confused labels for adjacent concepts, PLUS 5-7 dimensions on which both can be answered in under 62 characters, PLUS at least one dimension that both share. If you can write the row-label rail before writing any cell content, and every label yields a non-empty answer for both terms, this archetype is correct. If any label yields an empty cell on one side, choose a different form.

<details>
<summary>All visible text, in reading order</summary>

Marketing Strategy vs Tactic | Marketing Strategy | Marketing Tactic | Role | The high-level plan that guides how to achieve revenue goals. | The specific actions and methods used to execute the strategy. | Time Horizon | 12-36 months and rarely changes except if the business pivots. | 3-12 months and adjusts based on performance. | Buying Cycles | Business Strategy | Revenue Objectives | Roadmap Validation | Strategy | Tactics | Operations | Typical Questions | ☐ Who do we target? | ☐ What problem do we solve? | ☐ Why do we win vs alternatives? | ☐ What do we communicate? | ☐ How will we create demand? | ☐ Which programs will we prioritize? | ☐ What channels will we use? | ☐ How do we plan operations? | Common Traps | ✕ Too many directions, lack of focus | ✕ Unclear target audience | ✕ Too many tactics, lack of focus | ✕ Deficient or slow execution | Success Factors | Target audience | Market problem | Positioning | Value proposition | Messaging | Unique Selling Point | Channels | Content Plan | Campaigns | Methods | Tracking | Prioritization | Funnels | KPIs | Similarities | ☐ Both require a clear direction and a strong focus. | ☐ Both need to understand the customer at a different level. | ☐ Determine where to invest time, budget, talent, and tools. | ☐ Involve the same team in SMEs (founder, CMO, marketer) | By Pierre Herubel

</details>

---

## 14. twelve-tile taxonomy grid
**File:** `Johnny Tooze/1786027591089.jpeg` · **Creator:** Johnny Tooze (signs the image "Jonny Tooze")

A full-bleed 3-across, 4-down grid of twelve pastel-tinted, black-outlined cards — each a numbered condensed-caps label, a line-art icon in a boxed corner, and three or four sentences of plain prose — under a two-line highlighter-marked headline and above a dark full-width follow/repost bar.

**Information job.** "I thought this category had two or three cost lines — what are all the ones I have not counted, and which one is actually the big one?" It converts a thing the reader treats as a single line item into an enumerated inventory they can audit themselves.

### Where the idea came from

**Likely origin.** A recurring client objection / budgeting argument the creator keeps having — the gap between what buyers budget for AI (inference, licences) and what they actually get billed for. Not a proprietary dataset: the image is an argued taxonomy with two borrowed public statistics dropped in as ballast.

**Evidence in the image.** Items 1 and 2 are explicitly framed as the wrong answers the reader already holds ("This is the line everyone planned for. It's the smallest one.", "Not where the problem is."), and item 3 is a hinge ("Nothing below this line does."). That is the structure of a rebuttal, not of a dataset. Only two items carry numbers ("Around 60% of an agentic task's cost", "41% of companies say data access is their biggest barrier") and neither is sourced on-image, so the spine is argument, not measurement. Item 12 "Shadow spend" is the punchline an advisor learns from invoices, not from a survey.

**The generative question, portable to any niche.** Pick a spend/effort/risk category your audience budgets as one or two line items. List every line item that actually shows up, ordered so the first two are the ones everybody already planned for and the rest are the ones nobody did. For each, write a label of 13 characters or fewer and two-to-four short sentences that say what it is and why it recurs. State explicitly, inside the first two items, that they are the small ones.

### Headline and subtitle

> WHERE YOUR AI MONEY ACTUALLY GOES

- **Words:** 6
- **Form:** Declarative noun-phrase claim built on a suppressed question, with "ACTUALLY" doing the contradiction work. Set in two lines of ultra-condensed black caps. Typographic emphasis: a flat #D8F55C highlighter rectangle sits behind "AI MONEY" on line 1 (swatch matched to cap height) and behind the whole of "ACTUALLY GOES" on line 2, where the swatch is dropped so the caps overhang its top edge and the swatch hangs below the baseline — a deliberate misregistration that reads as a marker stroke rather than a text background.
- **Promise:** A complete accounting of the line items you are being billed for but did not budget, including which one is largest.
- **Subtitle:** "12 COST LINE NOBODY BUDGETED FOR"
- **What the subtitle does that the headline cannot:** It is not a subtitle beneath the headline — it is a bordered badge parked to the right of headline line 2, filling the space the short second line leaves. It supplies the count (12, so the reader knows the scroll depth), the frame ("NOBODY BUDGETED FOR" = the reader is not alone in missing these), and the unit of the grid (each tile is a cost line). Note the grammatical error kept in the shipped asset: "12 COST LINE", not "COST LINES".

### Regions, top to bottom

| Span | Region | Purpose | Contents |
| :- | :- | :- | :- |
| 1.8-9% | Headline line 1 | Hook: names the subject and the contradiction in six words at maximum type size | "WHERE YOUR AI MONEY" with a #D8F55C swatch behind "AI MONEY"; left-aligned from the 3% margin, runs to ~92% width. Band 1 ink 34% — the only genuinely open band on the canvas. |
| 9-15.5% | Headline line 2 + count badge (one row, two objects) | Completes the claim and states the inventory size, using the badge to fill the width the short line leaves | Left: "ACTUALLY GOES" on a dropped #D8F55C swatch, ~50% width. Right: a ~2px dark-outlined rounded rectangle, fill near-bg, containing "12 COST LINE NOBODY" (bold caps) / "BUDGETED FOR" (regular caps). Bands 2-3 ink 49/56%. |
| 16-34.5% | Card row 1 — items 1-3 | Establishes the tile grammar and disarms the two answers the reader already has | 1. INFERENCE (periwinkle) / 2. LICENCES (lavender) / 3. THE BUILD (pink). Bands 4-7 ink 71/87/89/73% — the densest bands on the canvas, because all three tints in this row are far from the #EFF2DF ground. |
| 35.5-55.5% | Card row 2 — items 4-6 | Delivers the largest claim (refinement at ~60% of cost) in the second row, where a scroller still is | 4. REFINEMENT (cream/olive) / 5. CONTEXT (periwinkle) / 6. RETRIES (pale green). Bands 8-11 ink 48/44/45/39% — the dip is not a gutter, it is two of three tints sitting within a few steps of the background. Tallest row (272px) because item 4 runs six body lines. |
| 56.5-76.5% | Card row 3 — items 7-9 | Middle of the inventory; the tiles the scroller skims | 7. OVER-THINKING (lavender) / 8. ORCHESTRATION (pink) / 9. EVALS (cream). Bands 12-15 ink 52/64/66/64%. |
| 77-94% | Card row 4 — items 10-12 | Ends on the two least-visible costs, with "SHADOW SPEND" as the payoff | 10. HUMAN REVIEW (periwinkle) / 11. DATA WORK (pale green) / 12. SHADOW SPEND (lavender, label wraps to two lines). Bands 16-19 ink 57/69/67/52%. |
| 95-100% | CTA bar | Two explicit asks, visually sealed off from the content by inversion | Full-bleed #111425 bar, centered single line: "Useful? Follow" (white) + circular photo headshot + "Jonny Tooze" (#D8F55C bold), wide gap, repost glyph + "Repost" (#D8F55C bold) + "to your network" (white). Band 20 ink 98% — the highest band, and the reason bottom margin measures 0.0. |

### Reusable skeleton

```
+----------------------------------------------------------+
| HEADLINE-L1  with [==highlight span==]                   | 1.8-9%
| HEADLINE-L2 [=hl=]   +--------------------------------+  | 9-15.5%
|                      | COUNT BADGE bold caps / reg    |  |
|                      +--------------------------------+  |
| +------------+ +------------+ +------------+             | 16-34.5%
| |1.LABEL [IC]| |2.LABEL [IC]| |3.LABEL [IC]|             |
| |body 4-6 ln | |body 4-6 ln | |body 4-6 ln |             |
| +------------+ +------------+ +------------+             |
| +------------+ +------------+ +------------+             | 35.5-55.5%
| |4.LABEL [IC]| |5.LABEL [IC]| |6.LABEL [IC]|             |
| |            | |            | |            |             |
| +------------+ +------------+ +------------+             |
| +------------+ +------------+ +------------+             | 56.5-76.5%
| |7.LABEL [IC]| |8.LABEL [IC]| |9.LABEL [IC]|             |
| +------------+ +------------+ +------------+             |
| +------------+ +------------+ +------------+             | 77-94%
| |10.LBL  [IC]| |11.LBL  [IC]| |12.LBL  [IC]|             |
| +------------+ +------------+ +------------+             |
|##########  DARK CTA BAR: ask 1 | ask 2  ##############   | 95-100%
+----------------------------------------------------------+
tints cycle per-cell, no semantic meaning; [IC] = 74px
outlined rounded box, icon glyph inside, top-right of tile
```

### Type system

- **Families.** Two families only. Display/labels: an ultra-condensed heavy grotesque, all caps, flat terminals, near-closed counters, tabular-looking numerals — almost certainly a Druk/Knockout-class face (guess); the closest Google Fonts substitute is Anton, with Oswald 700 or Big Shoulders Display 800 as fallbacks. Body/badge: a geometric-humanist sans with double-storey 'a', straight-tailed 'y', horizontal 'e' bar — reads like Aeonik/Museo Sans (guess); nearest Google Fonts are Figtree or Hanken Grotesk. Not Poppins — Poppins' single-storey 'a' is absent.

- **Headline : body.** Headline cap height ~73px vs body cap ~13px, so headline ~5.5x body. Card label cap ~30px, so label ~2.2x body. Badge caps ~26px, ~1.8x body.

- **Weights.** Three effective weights: display black (headline + all 12 labels), body regular (~400, all 12 tile bodies + "BUDGETED FOR" + white CTA words), body bold (~700, "12 COST LINE NOBODY", "Jonny Tooze", "Repost").

- **Case.** ALL CAPS for headline, badge, and every tile label. Sentence case for every body paragraph and the CTA bar. The case split, not size alone, is what separates scan layer from read layer.

- **Typographic moves.** Flat highlighter rectangle behind headline spans, intentionally misregistered on line 2. Bordered pill/badge to absorb the short second headline line. Mixed weight inside a two-line badge. Numeral prefix set in the display face and glued to the label as one string ("1. INFERENCE"). Body line-height ~1.5 at ~20px, generous for the density. No italics, no underlines, no letter-spacing games; tracking on the condensed display face is left tight and unadjusted.

- **Hard line limits.** Headline exactly 2 lines: line 1 ≤20 chars, line 2 ≤14 chars because the badge occupies the rest of that row. Badge exactly 2 lines, ≤22 chars each. Tile labels 1 line at ≤13 chars ("OVER-THINKING", "ORCHESTRATION" both 13); wrap to 2 lines is tolerated once ("SHADOW SPEND") and costs a body line. Tile bodies 4-6 lines, 78-121 characters (shortest: item 12 at ~85; longest: item 4 at ~121). CTA is 1 line.

### Color logic

- **Roles.** Page ground #EFF2DF (pale yellow-green, not white). Primary ink #030304 (15% of non-bg pixels) — all type, all tile borders, all icon strokes. Tile fills, cycled: #D1C8E7 lavender (39%, the workhorse), #E7C8C8 dusty pink (13%), #D2CBD5 grey-lilac (3%), #BDBBD4 periwinkle (1%), #D4D4BC olive-cream (1%) plus a pale green that reads within a few steps of the ground. Accent #D8F55C acid lime (2%) — headline highlighter and both CTA words. Inverted footer plate #111425 near-black navy (8%). Icon boxes are a lightened wash of their parent tile, so they never introduce a new hue.
- **Distinct hues.** 7
- **Does color mean anything.** Decoration only, and this is the archetype's weakest joint. Tile tint carries zero meaning: item 1 ("the smallest one") and item 4 ("around 60% of cost") get no color distinction, and the cycle is not even a clean repeat, which invites the reader to hunt for a pattern that is not there. The only semantic color is the accent: lime = "the words that matter" (headline emphasis) and "the action" (Follow / Repost). Note on the hue count: five tile hues (lavender, pink, periwinkle, olive-cream, pale green) plus lime plus the navy plate make 7 distinct hues, but the five tile hues sit at one shared value and chroma, so they read as a single desaturated family rather than as five colors.
- **Accent discipline.** #D8F55C is 2% of non-bg pixels across the whole canvas and appears in exactly three places: two headline swatches and the two CTA verbs. Nothing inside the 12-tile grid is lime — the grid is entirely pastel-and-black. That is what lets 2% of the pixels control where the eye lands first and last.

### Data dependency

- **Needs external data.** no
- **What would have to be true.** The form is a concept taxonomy — 10 of the 12 tiles are argued claims requiring no dataset. Two tiles smuggle in statistics that would have to be true in the world: item 4 "Around 60% of an agentic task's cost" (share of agentic workload cost attributable to self-correction) and item 11 "41% of companies say data access is their biggest barrier" (a survey figure). Everything else is assertion, and the design does not pretend otherwise.
- **Provenance shown on the image.** None. There is no source line, no footnote, no dataset name, no date anywhere on the 1080x1350 canvas. The only attribution on the image is the creator's own name in the CTA bar: "Useful? Follow Jonny Tooze". The two percentages float unsourced, and the hedge "Around" on the 60% is the sole signal of imprecision.
- **Fabrication risk.** High and specifically located. An AI reproducing this form has 12 tiles to fill and will write 12 confident paragraphs whether or not it knows anything; the taxonomy itself is defensible-by-argument so the lie hides well. The visible failure is the numbers: any "60%" or "41%" invented to add authority is unfalsifiable on-image because the layout has no slot for a citation. Mitigation for a template: either forbid digits inside tile bodies, or add a required source_note field rendered small above the CTA bar — this image would be strictly better with one, and its absence is the reason the two stats cannot be checked.

### Attribution

"Useful? Follow [circular photo headshot] Jonny Tooze    [repost glyph] Repost to your network" — one centered line on a full-bleed #111425 bar spanning 95-100% of canvas height, the last thing on the page and the only inverted element. Type is set at roughly body size (~1.0x body, ~20px), so it does not compete with the grid; the two proper asks are lifted with #D8F55C bold ("Jonny Tooze", "Repost") while the connective words stay white. The headshot is a real photograph, ~34px diameter, circular, with a lime-green backdrop that ties it to the accent. There is no logo, no handle, no URL. This reads unambiguously as CTA, not signature: two imperatives ("Follow", "Repost"), a benefit-qualifier opener ("Useful?"), and a platform-native verb. The creator's name functions as the follow target rather than as a byline — nothing at the top of the image claims authorship at all.

### Density

- **Words:** 251 · **Discrete elements:** 15 · **Words per element:** ~17 words per element (251 / 15). Counting the 12 icons as elements too gives 27 units and ~9 words each. Per tile: 15-25 words including the label.
- **Whitespace read.** 61.2% ink coverage, the densest in the Tooze set, and the measured margins are T1.8 B0 L0 R0 — there is effectively no whitespace on this canvas: the tile grid runs to a ~3% side margin and the CTA bar bleeds to three edges. It nonetheless does not read as cramped, for three reasons that are all mechanical rather than aesthetic. (1) The ink is mostly flat pastel fill, not type — the type layer alone is a small fraction of the 61%, so "coverage" overstates the visual load. (2) Two of the five tile tints (olive-cream, pale green) sit within a few steps of the #EFF2DF ground, so rows 2 and 4 read as near-empty even though they measure as filled; this is exactly why bands 8-11 drop to 39-48% while bands 4-7 hit 87-89%. (3) The air is spent inside the tiles, not between them: ~18px gutters but ~22px internal padding and 1.5 body line-height. Take away the near-ground tints and this becomes a wall.

### Thumbnail test at 220px: **PARTIAL**

- **Survives.** At 220px the headline is fully legible on both lines — the condensed black caps plus the lime swatch survive the downscale intact, and "WHERE YOUR AI MONEY / ACTUALLY GOES" reads in one beat. All 12 numbered labels remain readable (1. INFERENCE, 2. LICENCES, 3. THE BUILD, 4. REFINEMENT, 5. CONTEXT, 6. RETRIES, 7. OVER-THINKING, 8. ORCHESTRATION, 9. EVALS, 10. HUMAN REVIEW, 11. DATA WORK, 12. SHADOW SPEND), which means the entire information payload — the taxonomy and its size — arrives at thumbnail scale. The 3x4 grid structure, the tile outlines, the tint variation, and the dark CTA bar as a terminator all survive. The icons survive as recognisable silhouettes only where the glyph is a single bold shape (lightning bolt, book, cloud).
- **Dies.** Every body paragraph — all 12 of them, roughly 200 of the 251 words — collapses into grey texture; you can see that text exists and count its lines, but not read a single sentence. The badge is the worst loss: "12 COST LINE NOBODY BUDGETED FOR" is the reader's cue for scroll depth and it is right at the legibility edge, with line 2 ("BUDGETED FOR", regular weight) essentially gone. The multi-stroke icons (document-with-magnifier, orchestration node, clipboard, database-with-gear, incognito hat) become indistinguishable smudges inside their boxes. The CTA bar is a dark strip with two lime blurs — the words "Follow" and "Repost" are not readable, and the headshot is a 4px dot.
- **Rule this proves.** The archetype is a two-layer document and only the top layer is a feed asset: label layer must be ultra-condensed black caps at ≥30px cap height and ≤13 characters, because that is the only thing that survives; the body layer is a reward for tapping, not a reason to tap. Two hard rules follow. Any number or claim you need the scroller to receive must live in a label or the headline, never in a body paragraph — this image buries its strongest fact ("Around 60%") in item 4's body where it is invisible at feed size. And the count badge should be set at label weight, not body weight, since it is doing thumbnail-scale work in body-scale type.

### Why it works, and what breaks without it

- **The first two tiles are spent naming the reader's existing wrong answer and demoting it ("This is the line everyone planned for. It's the smallest one." / "Not where the problem is."), and tile 3 is an explicit hinge ("Nothing below this line does."). The grid is therefore ordered as an argument, not alphabetically or by size.**
  Without it: Shuffle the order and it becomes an undifferentiated list of 12 peers with no reason to read past tile 3. The reader's own assumption is the only thing creating tension; without the demotion of items 1-2 there is no gap between what they believe and what the grid shows, and the headline's "ACTUALLY" writes a cheque the content does not cash.
- **Two-layer typography enforced by case and family, not just size: condensed black caps for the 12 labels (survives 220px), sentence-case body regular for the prose (does not). The scan path and the read path are physically separable.**
  Without it: Set labels in the body face at 24px and the thumbnail delivers nothing but a grey 3x4 checkerboard — the post loses its entire feed-scale function, since at 220px the labels are the only readable content and they alone carry the full taxonomy.
- **Accent starvation: #D8F55C is 2% of non-bg pixels and appears only on headline emphasis and the two CTA verbs, with zero lime anywhere in the 12-tile grid.**
  Without it: Tint even one tile lime, or use lime for the tile numerals, and the eye no longer has a first stop and a last stop. The accent is functioning as a two-point path (hook → ask) across a 61%-ink canvas; spreading it across the grid collapses that path and the CTA bar stops reading as the terminal action.
- **Near-ground tints in alternating positions: olive-cream and pale green sit within a few steps of #EFF2DF, so rows 2 and 4 measure as filled (bands 8-11 at 39-48%) but read as open, manufacturing perceived whitespace where there is none.**
  Without it: Give all 12 tiles saturated fills at the strength of #D1C8E7 or #E7C8C8 and every band goes to 85-89% like bands 4-7. The page becomes a solid quilt with no vertical rhythm, the row boundaries stop registering, and the reader cannot tell whether they are looking at 12 tiles or one texture.
- **The count badge occupies the dead space left by the short second headline line, converting a ragged two-line title into a filled header block while stating the inventory size.**
  Without it: Drop the badge and the top-right 45% of the header is empty against a grid that runs edge to edge — the header stops matching the density of the page below it, and the reader loses the "12" that tells them this is an exhaustive inventory rather than a sample of tips.

### Reachable in HTML + CSS + inline SVG: **PARTIAL**

**Blockers.**

- The photographic headshot in the CTA bar. A raster portrait cannot be produced by HTML/CSS/SVG and there is no image asset pipeline in the target renderer.
- The 12 line-art pictograms as a set. Individually each is drawable as inline SVG, but they come from a consistent 24px stroke-2 icon family (lightning, document+magnifier, crossed wrench/screwdriver, refresh loop, open book, retry-with-x, thought cloud, orchestration node+arrow, clipboard checklist, person+check, database+gear, hat+glasses) and hand-authoring 12 matched paths is real work; no icon library is available to import.
- The LinkedIn repost glyph specifically — it is a platform mark, and an approximate two-arrow loop will read as generic rather than as the platform's affordance.
- Exact fonts. The display face is a Druk/Knockout-class ultra-condensed black that has no Google Fonts equivalent at the same width; the body face is an Aeonik/Museo-class geometric-humanist that Google Fonts only approximates.

**Honest substitutes.**

- Headshot → a circular div with the creator's initials in the display face on a #D8F55C ground, matching the lime backdrop the real photo already sits on. Keeps the human-presence beat at the same footprint; loses the face. Do not substitute a generic avatar silhouette — an anonymous figure is worse than initials, because it reads as a missing asset rather than as a mark.
- Icon set → author 12 inline SVGs on one shared spec (24x24 viewBox, stroke-width 2, round caps, currentColor, no fills) and keep them geometric. Where a concept has no single-shape glyph, prefer an abstract mark (a circle-and-arrow) over a crowded literal one, because the thumbnail test already kills every multi-stroke icon — the icons are doing decorative work at feed scale and only earn their keep on tap. Alternative that is honestly better for a template: drop the icon and use the freed corner for the tile number set large in the display face, which survives 220px where the icon does not.
- Repost glyph → two chevron-tipped arrows in a rounded rectangular loop as inline SVG, plus keeping the word "Repost" bold in the accent so the text carries the meaning even when the mark reads as generic.
- Fonts → headline and labels in Anton (fallback Oswald 800, Big Shoulders Display 800), body in Figtree (fallback Hanken Grotesk, then system-ui). Anton is slightly wider and has a taller x-height than the original, so the ≤13-character label limit must be enforced or labels will wrap; expect to set letter-spacing:-0.01em on the headline to recover the original's tightness.

**Implementation notes.** Body: 1080x1350, background #EFF2DF, display:flex, flex-direction:column, no page padding (margins measure 0 on three sides because the CTA bar bleeds). Header: a flex row for line 2 where the headline block is flex:0 0 auto and the badge is a bordered box (border:2.5px solid #030304, border-radius:14px, background rgba(255,255,255,.28), padding 14px 20px) — do not center anything, everything is left-aligned from a ~3% inset. Highlighter: wrap the emphasised words in a span with background:#D8F55C; box-decoration-break:clone; padding:0 .08em, and for the line-2 misregistration use a ::before absolutely-positioned rectangle (inset:22% -2% -14% -2%; z-index:-1) rather than a background, since the swatch must overhang the baseline and sit below the caps. Grid: display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(4,auto); gap:18px; padding:0 30px; flex:1. Tile: border:2.5px solid #030304; border-radius:14px; padding:22px; display:flex; flex-direction:column; background set per-cell from a 5-value tint array cycled by index. Tile head: display:flex; justify-content:space-between; align-items:flex-start with the label taking flex:1 and min-width:0, and the icon box a fixed 74x74 (border:2.5px solid #030304; border-radius:14px; background:rgba(255,255,255,.45) so it reads as a wash of the parent tint rather than a new hue) — the icon box must be flex:0 0 74px or a long label will crush it. Body p: font-size:20px; line-height:1.5; margin-top:14px. To hold the tiles the same height across a row, let grid rows be auto and rely on the tallest tile in each row; if a body overruns, reduce characters rather than font-size, since 20px is already the floor for the substituted body face. CTA: full-bleed section, background:#111425, display:flex; justify-content:center; align-items:center; gap:56px; padding:20px 0, with each ask an inline flex group of glyph + text. No shadows anywhere — every edge in this design is a 2.5px solid black stroke, and adding box-shadow would break the flat-sticker read that the outlines create.

### Template parameters

| Parameter | Type | Constraint | This image |
| :- | :- | :- | :- |
| `headline_line_1` | string | ≤20 characters including spaces, ALL CAPS after transform, must be renderable in the display face at ~96px without wrapping at 1020px content width | WHERE YOUR AI MONEY |
| `headline_line_2` | string | ≤14 characters including spaces — hard limit, because the count badge occupies the remaining ~46% of that row. Exactly 2 headline lines; a 1-line or 3-line headline breaks the badge placement | ACTUALLY GOES |
| `highlight_spans` | list<string> | 1-2 entries, each an exact substring of one headline line, each ≤9 characters. Two entries max or the accent stops being emphasis; if both lines are highlighted, line 2's swatch is the dropped/misregistered variant | ["AI MONEY", "ACTUALLY GOES"] |
| `badge_line_1` | string | ≤22 characters, ALL CAPS, bold weight, must open with the item count as a digit so it matches items.length | 12 COST LINE NOBODY |
| `badge_line_2` | string | ≤22 characters, ALL CAPS, regular weight, completes badge_line_1 as one grammatical phrase. Exactly 2 badge lines | BUDGETED FOR |
| `items` | list<{label,body,icon}> | Exactly 12, or exactly 9 for a 3x3 variant. Not 10 or 11 — the 3-column grid leaves visible holes. Order is load-bearing: items 1-2 must be the reader's existing assumption, item 3 a hinge, and the strongest item placed at 4-6 so it lands in the second row while a scroller is still present | 12 items, 1. INFERENCE through 12. SHADOW SPEND |
| `items[].label` | string | ≤13 characters, ALL CAPS, no articles, no punctuation except a hyphen. 13 chars is the measured ceiling ("OVER-THINKING", "ORCHESTRATION"); at 14+ it wraps to 2 lines and steals a body line. At most one item in the set may wrap | OVER-THINKING |
| `items[].body` | string | 78-121 characters, 2-4 short sentences, sentence case, renders to 4-6 lines at 20px/1.5 in a ~286px text column. Fragments are allowed and used ("Agents calling agents.", "Invisible line."). No digits unless a source_note is supplied | The system checking and repairing its own work. Around 60% of an agentic task's cost. Almost no budget has a line for it. |
| `items[].icon` | enum | One key from a hand-authored inline-SVG set; all glyphs must share one spec (24x24, stroke-width 2, no fill). Prefer single-shape glyphs — multi-stroke marks are illegible at feed scale. Every item needs one; a half-populated icon column reads as broken | "bolt" for item 1, "book" for item 5, "incognito" for item 12 |
| `item_number_prefix` | enum | "numbered" or "none". Numbered is what makes the badge count verifiable and gives the reader a progress signal; rendered in the display face, glued to the label as "N. LABEL" | numbered |
| `tile_tints` | list<string> | 4-6 hexes, all at the same value and low chroma, cycled by item index. At least two must sit within ~10 RGB steps of page_bg — that near-ground pair is what manufactures perceived whitespace at 61% ink. Never assign tint by meaning unless you also add a legend | ["#D1C8E7","#E7C8C8","#BDBBD4","#D4D4BC","#D2CBD5"] plus a pale green |
| `page_bg` | hex | A warm or cool off-white, never #FFFFFF — the tile tints are pale enough that pure white would flatten the near-ground pair into invisibility | #EFF2DF |
| `ink` | hex | One near-black used for all type, all 2.5px tile borders, and all icon strokes. No secondary grey — there is no muted text tier in this layout | #030304 |
| `accent` | hex | One high-chroma hex, must stay under ~3% of canvas pixels: highlight_spans plus the two CTA verbs only. Zero accent inside the grid | #D8F55C |
| `cta_bar_bg` | hex | One dark near-black, distinct from `ink` so the bar reads as a plate rather than a border. Full bleed on left, right, and bottom | #111425 |
| `cta_follow` | list<{label,value}> | Two fields: prefix ≤16 characters, name ≤14 characters. Name set bold in accent; prefix in white regular | prefix = "Useful? Follow", name = "Jonny Tooze" |
| `cta_share` | list<{label,value}> | Two fields: verb ≤8 characters bold in accent, suffix ≤18 characters white regular. Exactly two CTA groups on one line — a third overflows the 1020px bar at 20px type | verb = "Repost", suffix = "to your network" |
| `avatar` | string | 1-2 initials rendered in a 34px lime circle (the honest substitute for the photograph). Empty string drops the circle without breaking the flex row | JT (the original uses a photograph) |
| `source_note` | string | ≤70 characters, rendered at 14px above the CTA bar. Absent in the original and REQUIRED by the template whenever any items[].body contains a digit — otherwise the layout has nowhere to put provenance and the statistic ships uncheckable | none present (two unsourced percentages ship in items 4 and 11) |

### Design-tell audit against PRD §10

**Violates (2).**

- "three equal cards in a row" — literally, four times over. The creator gets away with it, and the rule is wrong as stated: three-across is a failure when it is a fake trio invented to fill a slide, and it is correct when it is a genuine 12-item enumeration that has to fit one canvas. The rule should be "no arbitrary trio", not "no 3-column grid". What rescues it here is that the tile count is stated in the badge, the items are numbered, and the tints vary per cell, so the grid reads as an inventory rather than as a template with three placeholders.
- "generic icon sets used decoratively" — a real violation, not a rescue. All 12 icons are from one line-art family and none adds information the label does not already carry (a lightning bolt does not explain inference cost); the thumbnail test confirms they are mostly illegible smudges at feed scale, so they are paying rent in nothing but texture. The 74px boxes they sit in are the largest non-type objects on the canvas.

**Avoids (8).**

- No purple-to-blue gradient — every fill is flat, and the lavender family is used as pastel tint, not as gradient.
- Nothing is centered except the CTA bar; the headline, badge, all 12 labels and all 12 bodies are left-aligned to a shared inset.
- No drop shadows anywhere. Every edge is a 2.5px solid stroke, which is what gives the flat-sticker read.
- No emoji standing in for icons — the glyphs are drawn line art on a consistent stroke spec.
- No title-only opener: this is a single canvas and its top 15% already carries the claim plus the item count.
- No eyebrow, no kicker, no "A THREAD" label, no date, no logo lockup.
- Not white-on-white: the ground is #EFF2DF, and the tints are calibrated against it rather than against #FFF.
- No default Inter/Poppins pairing — the display face is a genuine ultra-condensed black and the body face has a double-storey 'a', so neither is the stock choice.

**New tells this image implies, not currently on the list (7).**

- Tint assigned with no semantic rule. Five hues cycled across 12 tiles in a pattern that neither repeats cleanly nor encodes anything, which makes the reader search for a meaning that does not exist. New gate rule: either tint carries a stated dimension, or the tint cycle is a strict, visibly regular repeat.
- The strongest fact buried in a body paragraph. "Around 60% of an agentic task's cost" is the single most valuable line on the canvas and it is set at 20px in row 2, which the thumbnail test proves is invisible. New gate rule: the load-bearing number must appear in a label, the headline, or the badge — never only in body copy.
- Unsourced percentages on an asset with no provenance slot. Two statistics ship with no citation because the layout provides nowhere to put one. New gate rule: any digit in body copy requires a source_note region, and if the layout has no room for it, the digit comes out.
- A count badge set in body-weight type. The badge does thumbnail-scale work (it tells the scroller the inventory is exhaustive) but is set at ~1.8x body in the body face, so its second line dies at 220px. New gate rule: any element whose job is feed-scale comprehension must be set in the display face.
- Copy errors surviving into a shipped asset: "12 COST LINE" (should be LINES) in the largest supporting element on the page. New gate rule: caps-set display strings get a singular/plural and spelling pass, since caps suppress the shape cues that make typos visible.
- Icon boxes sized as the second-largest object class while carrying the least information. New gate rule: an icon may not occupy more area than the label it accompanies unless the icon is doing distinguishing work at 220px.
- 61% ink coverage with 0% margin on three sides. It works here only because two tints sit near the ground; the rule to record is that ink coverage above ~55% is survivable only when at least a third of the fill is within ~10 RGB steps of the background.

### Failure modes when copied badly

- All 12 tiles fill with same-length, same-shape paragraphs written to the character budget, so the grid becomes a wall of uniform grey blocks and no tile is worth reading over any other. The original varies deliberately: item 12 is 4 lines, item 4 is 6, and items 8 and 12 use bare fragments.
- One body overruns the 121-character ceiling, its tile grows, and the entire row grows with it — leaving two tiles with a band of dead tint at the bottom and one row visibly taller than the other three.
- A label runs 15+ characters, wraps to two lines, and collides with the fixed 74px icon box; the icon squashes or the label breaks mid-word. "SHADOW SPEND" is already at that edge and only survives because it is in the last row.
- The item order is a dump rather than an argument: no tile demotes the reader's existing assumption, so "ACTUALLY" in the headline has nothing to contradict and the post reads as a listicle of things the reader already agreed with.
- The accent leaks — lime tile numerals, a lime tile, a lime badge — and the two-point eye path from headline to CTA dissolves into confetti on an already 61%-ink canvas.
- All tile tints are picked at the saturation of #D1C8E7 or #E7C8C8, every band goes to 85%+, the row rhythm disappears, and the page reads as one quilt where you cannot see where one tile ends.
- The item count in the badge and the number of tiles disagree (badge says 12, grid has 11), which is the one error in this form a reader can catch instantly because the tiles are numbered.
- Icons are chosen literally for abstract concepts, producing 4-6 crowded multi-stroke glyphs that are indistinguishable smudges at 220px while still consuming the largest non-type area on the canvas.
- The tile count lands on 10 or 11, leaving one or two empty cells in the last row, and the fix chosen is to stretch the surviving tiles across the row — which breaks the column alignment that the other three rows establish.
- Body copy is written in explanatory-blog voice ("It is important to note that...") instead of the clipped declarative-plus-fragment voice, blowing the character budget in the first sentence and forcing a font-size reduction that kills the tile.
- Statistics are invented to make tiles sound authoritative, and because there is no source region on the canvas, nothing on the page signals that they are unverifiable.
- Two headline lines of near-equal length, so there is no short second line for the badge to occupy — the badge either drops below the headline (destroying the header block) or overlaps the type.

### Topic fit

- **Fits when.** The topic is a flat set of 9-12 genuinely peer items inside one category that the audience currently treats as 1-3 items, where each item can be defined in a ≤13-character noun label and explained in two to four short sentences with no dependency on the other items. It is strongest when the reader's under-count is itself the insight — hidden costs, failure modes, decision inputs, roles on a team, steps that are actually parallel, objections you keep hearing — and when the creator can order the set so the first two entries are the ones the reader already knew.
- **Breaks when.** Anything with a shape the grid contradicts. Sequential processes break, because a 3-across reading order means step 4 sits directly under step 1 and the reader loses the sequence. Hierarchies and dependency trees break, because 12 equal-sized boxes assert that every item is equally important, which is the opposite of what item 1 ("the smallest one") and item 4 ("around 60%") are actually saying — the original wins that fight only by stating the weighting in prose. Quantitative comparisons break, because a tile grid cannot encode magnitude and the reader will misread tint or position as rank. Fewer than 8 items breaks it, because the grid leaves holes and the density that justifies the form disappears; more than 12 breaks it, because body copy drops below 20px and the tiles stop being readable even on tap. Two-sided comparisons break it outright — that is a split layout, not a grid. And any topic whose items need real numbers breaks it until a source region is added, since the form has no provenance slot.
- **Input signature that should trigger selecting it.** Trigger this archetype when the raw material is a list of 9-12 mutually independent, non-sequential, same-altitude items in one named category, each nameable in ≤13 characters and explainable in ≤121 characters, where at least two items are ones the audience would name unprompted (so they can be placed first and demoted) and at least one is one they would not have named at all (so it can be the payoff). Do NOT trigger it if the items have an order, a hierarchy, a magnitude to compare, or a source-dependent number in more than two of them.

<details>
<summary>All visible text, in reading order</summary>

WHERE YOUR AI MONEY ACTUALLY GOES | 12 COST LINE NOBODY BUDGETED FOR | 1. INFERENCE | Every response costs money. This is the line everyone planned for. It's the smallest one. | 2. LICENCES | The seats and the platform fees. Predictable, invoiced, boring. Not where the problem is. | 3. THE BUILD | Getting it working the first time. A project cost. It ends. Nothing below this line does. | 4. REFINEMENT | The system checking and repairing its own work. Around 60% of an agentic task's cost. Almost no budget has a line for it. | 5. CONTEXT | You pay for everything the agent reads, every single time it reads it. Over half the tokens are input, not output. | 6. RETRIES | The same task costs a different amount every time. Depends on the path it took and how often it failed. | 7. OVER-THINKING | Reasoning models pointed at simple tasks. You're paying premium compute to reformat a date. | 8. ORCHESTRATION | Agents calling agents. Every handoff is another bill. These costs multiply. They don't add. | 9. EVALS | You can't improve what you don't measure. Building and running the test suite is permanent, not a project. | 10. HUMAN REVIEW | Someone still checks the output. That salary is an AI cost. Most orgs book it somewhere else. | 11. DATA WORK | Cleaning, structuring, permitting. 41% of companies say data access is their biggest barrier. It never finishes. | 12. SHADOW SPEND | The tools your teams expensed without telling procurement. Real money. Invisible line. | Useful? Follow Jonny Tooze | Repost to your network

</details>

---
