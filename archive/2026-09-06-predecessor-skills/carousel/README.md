# GTM Content Carousel

Turn content (or just a topic) into an on-brand LinkedIn carousel PDF.

A LinkedIn "carousel" is a PDF uploaded as a **document post**. This skill generates that PDF, branded, from a simple Markdown file. You write a short spec, it renders a crisp vector PDF you upload straight to LinkedIn.

Skill name: `gtm-content-carousel`. Built by Fallon.

**Look at `samples/` first.** Those PDFs are what it produces.

---

## Requirements

- **macOS** with **Google Chrome** installed (the renderer drives headless Chrome).
- **Python 3** (standard library only, nothing to `pip install`).
- **Claude Code** (you invoke this as a skill).

The brand fonts are embedded in the package, so there is nothing to install for fonts.

---

## Install

1. Unzip this folder.
2. Move the `gtm-content-carousel/` folder into your Claude Code skills directory:
   ```
   ~/.claude/skills/gtm-content-carousel/
   ```
3. Start a new Claude Code session. Type `/gtm-content-carousel` to confirm it loaded.
4. Optional sanity check that the engine runs on your machine:
   ```
   cd ~/.claude/skills/gtm-content-carousel
   python3 -m unittest discover -s tests
   ```
   Expect `OK`.

---

## Two ways to use it

You flip a mode:

- `/gtm-content-carousel oneshot <source>` — give it an article, post, transcript, notes, or a topic. It drafts the whole deck and renders a PDF for you to react to.
- `/gtm-content-carousel guided <source>` — collaborate. It proposes a slide outline, you approve or edit, you hand it rough copy per slide, it polishes and renders.

`<source>` can be a file path, pasted text, a topic string, or an existing spec to re-skin.

Start with `oneshot` on a real piece. That is the fastest way to see what it does and where it needs your steer.

---

## The 30-second model

A carousel is **one Markdown spec file**. The engine renders it through a **theme** (the look) and **archetypes** (per-slide layouts). Change three lines of front-matter and the same content re-renders in a different theme or shape.

```markdown
---
theme: daybreak        # daybreak | personal
aspect: 4x5            # 4x5 | 1x1
title: My Deck
---

:: cover
eyebrow: The Hook
headline: A big line with **one accent.**
body: One line of context.
cue: Swipe

:: cta
headline: The close, **here.**
cta: daybreak.ai
```

Rules worth knowing:
- `**bold**` inside a headline becomes the brand accent color.
- `- ` lines are bullets (they attach to the open list field).
- `steps` items use a pipe: `Label | Detail`.
- A slide can override the deck: `bg: dark` or `bg: light`.
- The engine auto-adds the page counter, progress bar, footer, and logo. Never hand-write those.

Full field reference for every archetype: `reference/archetypes.md`.

---

## The 12 archetypes

| Archetype | Use it for |
|---|---|
| `cover` | The hook slide |
| `statement` | A claim, with optional quote card + bullets |
| `bullets` | A clean bullet list |
| `compare` | Two cards, flaw vs win |
| `before-after` | Two columns, before vs after |
| `stat` | One giant number that lands |
| `steps` | A numbered process |
| `quote-spotlight` | A single big pull-quote |
| `index` | An agenda / table of contents |
| `logo-wall` | A grid of names (tech stack, competitors, customers) |
| `image-bg` | A full-bleed photo or screenshot with text over it |
| `cta` | The closing call to action |

The two files in `examples/` cover all 12 between them.

---

## Themes

- **`daybreak`** — the Daybreak brand (green). Use this for company content.
- **`personal`** — an example of a completely different look (bold mono-dark). It is there to prove the engine flexes and to act as a template. To make your own theme, copy a file in `themes/` and follow `reference/themes.md`.

---

## Rendering directly (optional, without the skill)

```bash
cd ~/.claude/skills/gtm-content-carousel
python3 render.py examples/innovators-dilemma.md --out deck.pdf
python3 render.py examples/innovators-dilemma.md theme=personal aspect=1x1 --out deck.pdf
python3 render.py examples/archetype-showcase.md --check    # validate before rendering
```

---

## Uploading to LinkedIn

1. Start a post, click the **document** icon ("Add a document").
2. Select the PDF.
3. Give it a **Document Title** (it shows as a strip on the carousel).
4. Write your caption, then post.

Aspect `4x5` takes the most room in the mobile feed. `1x1` is the safe square.

---

## The part that takes judgment

The engine is the easy half. What makes a carousel *good* instead of merely valid is the content-to-slides reasoning: a real narrative arc, one idea per slide, tight on-slide copy (headline under ~7 words, bullets under ~6). That method lives in `reference/method.md`. Read it once before your first real deck.

---

## Troubleshooting

- **"Chrome not found"**: edit the `CHROME =` path at the top of `render.py` to point at your Chrome binary.
- **Type looks generic**: make sure the `fonts/` folder came along; the brand fonts are embedded there.
- **A slide clips in `1x1`**: square has less vertical room. Shorten the copy or use `4x5`.
- **`image-bg` looks busy**: it is for photos, screenshots, or clean gradients used atmospherically, not for dense charts. The image is your lever.

---

## What's in here

```
gtm-content-carousel/
  README.md            this file
  skill.md             the skill instructions Claude follows
  render.py            the engine (spec -> HTML -> Chrome -> PDF)
  themes/              _base.css + daybreak.css + personal.css
  archetypes/          one HTML partial per slide type
  fonts/               embedded brand fonts
  examples/            two spec files covering all 12 archetypes (+ a sample image)
  samples/             rendered example PDFs
  reference/           method.md, archetypes.md, themes.md (deeper docs)
  tests/               run these to confirm the engine works on your machine
```

Questions, or want a new archetype or theme? Ask Fallon.
