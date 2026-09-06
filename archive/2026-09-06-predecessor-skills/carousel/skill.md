---
name: gtm-content-carousel
description: Use when turning content (an article, post, brief, transcript, notes, or a gtm-content-article-idea seed) into a LinkedIn carousel, or generating a carousel deck from scratch on a topic. Triggers on "make a carousel", "carousel from this", "LinkedIn carousel", "swipe deck", "PDF document post", "slide deck for LinkedIn", "turn this into slides". Produces a branded vector PDF via render.py (daybreak or personal theme, 12 archetypes, 4x5 or 1x1).
---

# GTM Content Carousel

Turn content (or a topic) into an on-brand LinkedIn carousel PDF. A LinkedIn carousel is a PDF "document post," so a crisp vector PDF is the deliverable. You author a Markdown **spec**, the engine renders it through a **theme** (look) and **archetypes** (per-slide layout).

Engine: `~/.claude/skills/gtm-content-carousel/render.py` (stdlib only, drives headless Chrome). Do not edit it. Depth lives in `reference/` (load on demand).

## Two modes (a flag, not two tools)

```
/gtm-content-carousel guided  <source>     # collaborate slide by slide
/gtm-content-carousel oneshot <source>     # draft the whole deck, then present
/gtm-content-carousel oneshot theme=personal aspect=1x1 <topic>   # overrides
```

`<source>` = a file path, pasted content, a topic string, a `gtm-content-article-idea` seed, or an existing `spec.md` to re-skin. Overrides (`theme=`, `aspect=`, `density=`) pass straight to `render.py` and win over spec front-matter.

- **`guided`**: intake (audience, takeaway, theme) -> brainstorm and LOCK the slide outline with the user -> user supplies rough copy per slide (or you draft and they react) -> polish to the copy budget -> render -> verify -> show. Offer a slide-1 proof render first if they want to see the look before committing the full deck.
- **`oneshot`**: intake -> full draft -> render -> self-verify -> fix silently -> present the PDF and a one-line slide map.

Default `theme` by source: Daybreak/company content -> `daybreak`; Fallon's personal/thought-leadership -> `personal`. If ambiguous, ask. Default `aspect=4x5` (tallest LinkedIn allows; most real estate).

## Content -> slides (the method)

Map the source onto a narrative ARC. Never paragraph-per-slide.

**Hook -> Tension -> Turn -> Payoff -> CTA.** 7-10 slides. One idea per slide.

On-slide copy is not prose. Targets:
- Headline ≤ ~7 words.
- Body / lead ≤ 2 short lines.
- Bullet ≤ ~6 words.

`render.py --check` WARNs past these; it does not block. The shipped reference deck deliberately runs longer leads. Treat the budget as the default and overrun only on purpose.

Pick the archetype from the slide's JOB:
- claim / assertion -> `statement`
- contrast, flaw vs win -> `compare`
- shift over time -> `before-after`
- process, ordered -> `steps`
- one number that lands -> `stat`
- list of peers -> `bullets`
- a big quote moment (a customer line, a one-sentence verdict) -> `quote-spotlight`
- a photo or screenshot slide (full-bleed image behind text) -> `image-bg`
- an agenda / table of contents -> `index`
- a competitor / tech-stack / customer grid -> `logo-wall`
- open -> `cover`; close -> `cta`

Full method (chunking long content, from-scratch topics, hook and CTA pattern libraries): `reference/method.md`.

## Voice by theme

- **`daybreak`** -> load the brand voice module `.claude/context/brand-voice.md` and the visual brand kit `Daybreak/GTM-Machine/Website/SCAD-Pro-Source-Material/drive-files/2026-Brand-Kit-Canonical.md` (the daybreak theme tokens already encode the palette).
- **`personal`** -> load `writing-style` (`~/.claude/skills/writing-style/`).

Hard rules, both themes, in spec copy AND captions:
- **NO em-dashes. Ever.** `--check` errors on one. Use a period or comma.
- No "not X, it's Y" frames. State what it IS.
- No leverage / delve / synergy / pivotal / foster.
- Fragments are fine. Sentence-starting conjunctions are fine.

## Spec quick-reference

Front-matter (deck-wide) then `:: archetype` blocks:

```markdown
---
theme: daybreak        # daybreak | personal
aspect: 4x5            # 4x5 | 1x1
density: comfortable   # comfortable | spartan
eyebrows: true         # kicker labels on/off
footer: AI labor for planning decisions
title: Innovator's Dilemma     # -> filename + PDF title
---

:: cover
eyebrow: The Innovator's Dilemma
headline: APS vendors built **their own trap.**
body: Legacy planning software can't become AI labor.
cue: Swipe

:: cta
headline: The operating model **has to change.**
cta: daybreak.ai
```

- `**bold**` inside a headline -> brand-accent color.
- `- ` lines attach to the open list field (`items`, or `left` / `right`).
- `steps` items use a `|` delimiter: `Label | Detail`.
- Per-slide override: `bg: dark` or `bg: light` (cover and cta are dark by default).
- The engine auto-adds the page counter, progress bar, footer, and wordmark. Never hand-write them.
- The spec is durable. "Make it 1:1 in the personal theme" = change three front-matter lines and re-render.

Every archetype's REQUIRED and optional fields, with examples: `reference/archetypes.md`. Token contract and adding a theme: `reference/themes.md`.

## Render + self-verify loop

```bash
python3 ~/.claude/skills/gtm-content-carousel/render.py <spec.md> --check          # validate first
python3 ~/.claude/skills/gtm-content-carousel/render.py <spec.md> [theme=… aspect=…] --out <pdf>
```

1. **`--check`** first. Fix every `ERROR` (unknown archetype, missing required field, em-dash). Resolve WARNs or accept them on purpose.
2. **RENDER** to the deck's output folder (below), not `/tmp`.
3. **READ THE PDF BACK** with the Read tool. Inspect EVERY slide for: text overflow or clipping, visual balance, any em-dash that slipped through, the hook earning the swipe, the CTA converting, and total page count (7-10).
4. **FIX the spec and re-render** until clean. The spec is the source of truth; never hand-edit output.

In `guided`, show the user (slide-1 proof first if they want it). In `oneshot`, fix silently, then present.

**Reader gate (when run inside the Daybreak content OS / weekly-linkedin):** also pass the on-slide words through the buyer reader per `/Users/josephavula/Desktop/tim-writing-os/skills/content/visual-reader-gate.md` (Part 1: grade the cover hook + payoff/CTA as the load-bearing feed text, and interior slides for the three principles; fix the spec to L3+). Strip the grade from anything saved.

## Output

Save the **spec.md and the PDF together**, slugged:
- Daybreak decks -> `Daybreak/GTM-Machine/content/carousels/<slug>/`
- Personal decks -> `Writing/carousels/<slug>/`

**Override (weekly-linkedin / on-machine):** when invoked by the weekly engine, ignore the Drive paths above. Force `theme=daybreak`, render with an explicit `--out` into `/Users/josephavula/Desktop/tim-writing-os/memory/writing/linkedin/campaigns/2026-<token>-wk<NN>-<frame-slug>.pdf`, and save the spec next to it as `...-carousel-spec.md`. Do not use the `personal` theme in the weekly engine (the per-author voice lives in the post text; the visual is Daybreak-brand-consistent).

## Integration

- `gtm-content-article-pick` / `gtm-content-article-idea` can seed a deck (pass the captured idea as `<source>`).
- After the PDF, hand the post caption text to `gtm-content-linkedin-post` for the copy that rides above the carousel.
