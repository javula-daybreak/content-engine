---
name: gtm-content-infographic
description: Turn any LinkedIn article or short post into ONE dense, information-rich 4:5 infographic PNG on the Daybreak brand. Point it at a source .md; it reads the piece, picks the single best of 7 layout archetypes for the main idea, generates a fresh spec, and renders a 2160x2700 image in the visual lineage of the reference set. Standalone; does not modify weekly-linkedin or the carousel skill.
---

# gtm-content-infographic

Point this skill at a source file and it produces **one** single-image LinkedIn
infographic: a dense, information-rich 4:5 PNG (1080x1350 @2x = **2160x2700**) on
the Daybreak brand, in the visual lineage of `~/Desktop/LinkedIn Visuals Inspo`.

```
/gtm-content-infographic <path-to-article-or-post.md>
```

The source can be any article or short post `.md`, including the per-owner files
the `weekly-linkedin` command saves under
`memory/writing/linkedin/campaigns/`. Always render **from the given article** —
generate the spec content fresh from that piece, never from a stored template.

The core creative act is **choosing the single layout that fits the source's main
idea**, then writing tight, brand-correct copy into that layout's grammar.

---

## Hard rules (every archetype, no exceptions)

1. **No eyebrows / kickers.** There is no eyebrow zone. A `kicker:` field is a
   `--check` ERROR.
2. **Title is a plain functional descriptor, NOT the source post's hook.** The
   headline names *what the infographic shows* (inspo: "The 5-Step AI Content
   Generation Process"). Wrap the one key phrase in `**...**` -> it renders as a
   brand highlight box. Never repurpose the article's hook as the title.
3. **Light footer only.** Sunrise mark + "daybreak" wordmark + the tagline
   ("AI labor for enterprise planning"). No dark bar, no URL, no CTA pill. The
   shell renders this; do not add your own footer.
4. **Daybreak brand assets only.** Palette, font (Manrope), icons, and logo all
   come from the brand kit, embedded by the engine. Reference only icon slugs
   that exist (see `reference/archetypes.md`).
5. **One PNG per run. 4:5 fixed (2160x2700). No em-dash anywhere** (`--check`
   ERROR). Banned words (WARN): leverage, delve, synergy, pivotal, foster.
6. **Density floor — the asset must FILL the canvas.** No large empty band
   (roughly >12% of canvas height as contiguous dead space). The frame is tall;
   short content centered on it reads as a dead infographic. If the source can't
   fill the chosen archetype, pick a denser one (more rows/cards/steps) — never
   inflate font size or pad with invented points. The grid/list/funnel/playbook
   roots stretch to fill; comparison-panel now stretches too. Verify on read-back
   (visual-reader-gate Part 2 dead-space check).

---

## Workflow

### Step 0 — Read the source
Read the given `.md` in full. Extract: the central claim/frame, the supporting
structure (is it a sequence? a set of parallel things? a contrast? a flat list?
a mix of stats and steps? a narrowing? one concept decomposed?), and the 4-10
concrete points that carry the idea.

### Step 1 — Select the single layout (the core decision)
Map the source's *shape* to exactly one archetype. State the choice and the
one-line reason before building.

| Source shape | Archetype |
|---|---|
| Sequential process / "steps" / "how to" / ordered stages | **numbered-steps** |
| Parallel categories / a set of options, types, or items | **card-grid** |
| A-vs-B, before/after, old-way/new-way, 2-3 columns | **comparison-panel** |
| A flat list of tactics / principles / reasons / signals | **icon-list** |
| Mixed stats + steps + sections in one piece | **hybrid-playbook** |
| Narrowing / conversion / qualification / funnel language | **funnel** |
| One central concept decomposed into labeled parts | **annotated-diagram** |

Tie-breakers: if it has explicit ordinal steps -> numbered-steps over icon-list.
If it contrasts named options -> comparison-panel over card-grid. If the hero is
one or two numbers -> hybrid-playbook. If there is a single thing with parts
hanging off it -> annotated-diagram. When two fit, pick the one whose density
the source can actually fill (see copy budgets in `reference/method.md`).

### Step 2 — Draft the spec
Write a spec in the chosen archetype's grammar (`reference/archetypes.md`).
Front-matter: `theme: daybreak`, a functional `title:`, `footer: AI labor for
enterprise planning`. Headline = functional descriptor with one `**highlight**`
phrase. Keep copy inside the per-archetype budget so nothing clips.

### Step 3 — Gate (cheap, then expensive)
```bash
SK=~/.claude/skills/gtm-content-infographic
python3 "$SK/render.py" <spec.md> --check                 # fields, em-dash, banned, no kicker
python3 "$SK/render.py" <spec.md> --out <out.png>         # render
```
Then **Read the PNG back** and score it against the archetype's visual rubric in
`reference/archetypes.md`: descriptive highlight title, no eyebrow, dense but
nothing clipped at 1080x1350, brand palette only, light footer. Fix and
re-render, bounded to ~3 loops.

**Reader gate (when run inside the Daybreak content OS / weekly-linkedin):** also
pass the on-image words through the buyer reader per
`/Users/josephavula/Desktop/tim-writing-os/skills/content/visual-reader-gate.md`
(Part 1: extract the rendered copy, run `grade-dis-jawn` on it as feed text, fix the
spec to L3+; the "refutable claim in sentence one" rule applies to the lead claim
line, not the functional title). Strip the grade from anything saved.

### Step 4 — Save next to the source
Save the PNG beside the source article (the same folder), named to match the
source (e.g. `2026-tim-wk02-engineers-then-planners-now.png`), mirroring the
LinkedIn per-owner auto-save convention. Report the path.

---

## Modes

- **oneshot** (default): given a source path, run Steps 0-4 autonomously and
  return the PNG path plus the one-line layout-choice rationale.
- **guided**: surface the layout choice + the drafted spec for confirmation
  before rendering. Use when the user wants to steer the framing or the
  archetype.

If invoked with no source path, ask which article to use (do not invent one).

---

## What this skill does NOT do
- It does not modify `weekly-linkedin` or `gtm-content-carousel`.
- It does not post to LinkedIn.
- It does not render to Tim's personal theme or any non-4:5 aspect (Daybreak
  theme, 4:5 only in v1).

See `reference/archetypes.md` (grammar + rubrics per archetype), `reference/method.md`
(selection heuristics + copy budgets + density doctrine), and `reference/themes.md`
(token contract). Durable build state is in `_state/`.
