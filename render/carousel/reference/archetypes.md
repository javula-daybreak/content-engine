# Archetype Catalog

Loaded on demand by `workflows/carousel.md`. One section per archetype: when to use, REQUIRED fields, optional fields, and a minimal spec example. Twelve partials.

**This file is a field reference, not a selection guide.** Which archetype a slide gets is decided by `content-engine-VISUALS.md` section 2's procedure and section 5's craft rules, and lock 4 in `SKILL.md` section 2 is what stops the same one recurring. The tables below only say what each partial accepts.

**Source of truth:** these field lists are derived from `render.py`. The `REQUIRED` map gives required fields, and each `archetypes/*.html` partial's `{slots}`, cross-referenced against the `fields` dict in `render_slide()`, gives what each slide actually consumes. If you change a partial or the schema, re-derive this file; the CODE wins.

No example on this page names a real company. Where one is needed it uses a documentation-reserved name, per PRD section 1.2.

## Fields shared by every archetype

The engine fills these automatically. You rarely set them per slide:

- **Auto-generated, never authored:** the page counter (`idx`), the segmented progress bar, the footer wordmark + mark. Do not hand-write them.
- **`footer`**: one line in the bottom bar. Defaults to front-matter `footer`, then to empty. Per-slide override allowed. (Not shown on `cover`, which uses the swipe cue instead.)
- **`wordmark`**: overrides the theme's wordmark for one slide. Almost never needed; `theme.json`'s optional `wordmark` key owns it deck-wide, and no default lives in the engine.
- **`bg: dark` | `bg: light`**: force the slide's background treatment. `cover` and `cta` are dark by default; every other archetype is light by default. On a theme whose `bg` is already dark, every slide is dark and `bg: dark` only adds the accent glow.

In headlines (and in `stat`, `before-after`, `compare`, `bullets`, `steps` item text, plus the `quote-spotlight` quote, `index` items, and `logo-wall` labels), `**bold**` renders as the brand accent color.

## Label field: `eyebrow` vs `kicker`

Two label fields exist; the engine picks one by archetype:

- **`cover` and `cta`** render the top-left label as an **`eyebrow`** (uppercase, letter-spaced, no tick). They read `eyebrow` first, then fall back to `kicker`.
- **All other archetypes** render it as a **`kicker`** (uppercase with an accent tick mark). They read `kicker` first, then fall back to `eyebrow`.

Use `eyebrow:` on covers and closes, `kicker:` on body slides. Either is optional; omit it to drop the label on that slide.

---

## cover

**When:** slide 1 only. The hook. Big headline, optional eyebrow, swipe cue. Dark by default.

- **Required:** `headline`
- **Optional:** `eyebrow` (label), `body` (one lead line under the rule), `cue` (swipe-cue text, defaults to `Swipe`), `bg`
- **Ignored here:** `kicker` is read only as a fallback if `eyebrow` is absent; `footer`, `items`, `note` do not render on cover.

```markdown
:: cover
eyebrow: The two-layer law
headline: Slide one has to survive **220 pixels.**
body: That is the width a feed gives an image before anyone taps.
cue: Swipe
```

---

## statement

**When:** the workhorse. A claim, with optional supporting line and bullets. Reach for it when nothing more specific fits.

- **Required:** `headline`
- **Optional:** `kicker` (label), `body` (lead line), `items` (bullet list via `- `), `note` (closing line under the bullets), `footer`, `bg`

```markdown
:: statement
kicker: The measurement
headline: Body text **dies** at feed size.
body: Fourteen images were read at 220px wide.
items:
- Five read intact. Nine read partial.
- Every subtitle present became illegible.
note: The claim has to be complete in the headline.
```

---

## bullets

**When:** a flat list of peer points with no hierarchy and no contrast. If the points oppose each other, use `compare`; if they are ordered, use `steps`.

- **Required:** `headline`, `items`
- **Optional:** `kicker` (label), `body` (lead line), `note` (closing line), `footer`, `bg`

Structurally identical partial to `statement`; the difference is that `items` is REQUIRED here. The `note` renders in the accent `.micro` style (not the muted `.note` style `statement` uses).

```markdown
:: bullets
kicker: Craft
headline: Three numbers worth keeping.
items:
- Headline: three to eight words.
- Hierarchy: 3x headline to body.
- Hues: three, unless hue encodes.
```

---

## compare

**When:** two things set against each other. Flaw vs win, them vs us, old vs new. Renders two cards; the right card gets the accent fill, so put the winning side on the right.

- **Required:** `headline`, `left`, `right`
- **Optional:** `kicker` (label), `note` (accent caption under the cards), `footer`, `bg`

`left:` and `right:` each take a title on the `key: value` line, then collect the `- ` lines beneath them as that card's list items. `note` renders in the accent `.micro` style.

```markdown
:: compare
kicker: The two layers
headline: One canvas, **two documents.**
left: The feed layer
- Headline and structure
- Survives the thumbnail
- Carries the whole claim
right: The stop layer
- Body, labels, subtitle
- Invisible until the tap
- Carries scope and proof
note: If the claim needs the stop layer, it is not a feed image.
```

---

## before-after

**When:** a shift across time. One state becomes another. Two columns, the "after" column in the accent color. Each column is a short paragraph, not a list (the `- ` lines are joined into one line).

- **Required:** `headline`, `left`, `right`
- **Optional:** `kicker` (label), `note` (accent caption), `footer`, `bg`
- **Title defaults:** if you omit the title on `left:` / `right:`, they default to `Before` / `After`.

```markdown
:: before-after
kicker: What selection changed
headline: The material picks **the form.**
left: Chosen by taste
- One topic supports several forms, and most of them lie about the material.
right: Chosen by shape
- The counts, sums and orderings decide, and a disqualifier is fatal.
note: The topic never selects the form.
```

---

## stat

**When:** one number carries the slide. A giant centered figure with a caption. No headline line renders; the number is the hero.

- **Required:** one of `stat` or `headline` (the giant number), AND `caption`
- **Optional:** `kicker` (label), `note` (small sub-line under the caption), `footer`, `bg`

`stat:` is the number; if `stat:` is absent the engine uses `headline` as the number instead. `**bold**` inside the number renders a contrast color (useful for a unit or symbol). `caption` is the supporting line and is required.

```markdown
:: stat
kicker: The floor
stat: **40px**
caption: cap height, the smallest claim-carrying type at 1080px wide.
note: Interpolated, not measured. Tune it on ten renders.
```

---

## steps

**When:** an ordered process or a loop. Numbered rows, auto-numbered 1..N from the items.

- **Required:** `headline`, `items`
- **Optional:** `kicker` (label), `note` (accent caption), `footer`, `bg`

Each `items` line uses a `|` delimiter: text before the pipe is the bold step **label** (`.k`), text after is the **detail** line (`.s`). A line with no pipe renders as a label-only step. The explicit pipe (not "`. `" sniffing) keeps abbreviations like `vs.` and `e.g.` intact.

```markdown
:: steps
kicker: The build
headline: Five moves, **in order.**
items:
- Write the claim | One sentence, before any form is considered
- Read the shape | Counts, sums, orderings, whether items are peers
- Discard on disqualifiers | Record which one, and why
- Rank the survivors | Fewest deficits first
- Show the runners-up | Never a draft with nothing beside it
```

---

## cta

**When:** the final slide. The close. Headline, optional points, an accent chip for the destination, and a follow line. Dark by default.

- **Required:** `headline`
- **Optional:** `eyebrow` (label), `items` (bullet points), `note` (follow / supporting line), `cta` (text inside the accent chip, with an auto arrow), `footer`, `bg`

The `cta:` field is the chip, and it is optional. PRD section 10.3 makes the final slide a takeaway rather than a call to action, so the usual close is a headline that re-lands the claim and no chip at all. Where a destination is genuinely the point, it is one destination and never three asks.

```markdown
:: cta
eyebrow: The takeaway
headline: Earn the second slide, **or end.**
items:
- The claim is complete in the headline and the structure.
- The subtitle carries the honesty, never the meaning.
note: A takeaway, not a call to action.
```

---

## quote-spotlight

**When:** a single big pull-quote carries the whole slide. A customer line, a one-sentence verdict, the quotable core of the piece. Use it for the one moment you want a reader to screenshot. If you need a number instead of words, use `stat`; if it is your own claim rather than a quote, use `statement`.

- **Required:** `quote` (the big quote text; `**bold**` renders accent)
- **Optional:** `attribution` (source line under the quote, e.g. `Contoso, 2026`), `kicker` / `eyebrow` (top-left label), `footer`, `bg`

The quote renders oversized with a thick accent bar and a big accent quotation glyph to its left, vertically centered. The attribution renders below in the accent color and collapses cleanly when absent. Reads on both light and dark themes.

```markdown
:: quote-spotlight
kicker: The quote
quote: The material selects the form, **never the topic.**
attribution: content-engine-VISUALS.md, section 2
```

---

## image-bg

**When:** a photo or screenshot IS the slide. A product screenshot, a dashboard, a workplace shot, a diagram you want full-bleed behind a short line of text. This is the only archetype that paints a background image.

- **Required:** `image` (path to a LOCAL image file)
- **Optional:** `headline` (accent; over the scrim), `body` (one lead line), `kicker` / `eyebrow` (label), `scrim` (`dark` | `light` | `none`, default `dark`), `footer`, `bg`

The image path resolves **relative to the spec file's directory** when not absolute; absolute paths and `~` are also accepted. The engine base64-embeds the image (the same principle as the embedded fonts) so the rendered PDF stays self-contained. A tokenized **scrim** gradient sits over the image for legibility: `dark` darkens toward the bottom and renders the headline/body in white (use over a busy or light photo); `light` lightens it and renders text in ink (use over a dark photo where you want dark text); `none` drops the scrim. Footer, counter, and progress bar stay visible over the scrim. A missing or unreadable image path is a hard error that names the path (both at `--check` and at render). Supported extensions: `.png .jpg .jpeg .webp .gif .svg`. Image-logo grids are a future extension that will reuse this embedder (see `logo-wall`).

```markdown
:: image-bg
kicker: The Picture
image: ./screenshots/dashboard.png
headline: This is what **decision labor** looks like.
body: One swimlane, end to end.
scrim: dark
```

---

## index

**When:** an agenda or table of contents. The "what's inside" slide near the front of a longer deck, or a recap of the sections. Lighter than `steps` (no detail line, no process implication); it just enumerates titles.

- **Required:** `items` (the section titles, via `- ` lines)
- **Optional:** `headline` (e.g. `What's inside`), `kicker` / `eyebrow` (label), `footer`, `bg`

Each item renders as a two-digit accent number (`01`, `02`, ... matching the slide counter's `02 / 09` style) next to the section title, with generous spacing. The list stays single-column up to 6 items and wraps to two balanced columns when there are more than 6.

```markdown
:: index
headline: What's inside
items:
- Where the feed stops reading
- What the numbers say
- The two layers, side by side
- What changes when you swipe
- How a deck gets built
```

---

## logo-wall

**When:** a grid of labels. A tech stack, a competitor grid, a "trusted by" / customer list, a set of integrations. Use it when the content is a flat set of names you want to show as a wall, not read as prose.

- **Required:** `items` (the text labels, via `- ` lines)
- **Optional:** `headline`, `note` (caption under the grid, accent `.micro`), `kicker` / `eyebrow` (label), `footer`, `bg`

Each label renders centered in a subtly bordered, tinted card (the same card token look as `compare`). The grid is two columns for up to 4 labels and three columns for more. **Text labels only** in this pass: image logos are a planned extension that will reuse the `image-bg` base64 embedder.

```markdown
:: logo-wall
headline: The grid of names
items:
- Acme
- Contoso
- Northwind
- Fabrikam
- Adventure Works
- Tailspin Toys
note: Reserved documentation names. Nothing here is a real customer.
```
