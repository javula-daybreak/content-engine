# SEED PROMPT — resume building `gtm-content-infographic`

Paste/read this to continue after compaction with nothing lost. This is the
single entry point; it points at the durable state files. Do NOT re-read the
old conversation — read the files named below.

---

## What this is
Building a new Claude Code skill, `gtm-content-infographic`: point it at a
LinkedIn article/short-post `.md` and it produces ONE dense, information-rich
4:5 PNG infographic (1080×1350 @2x = 2160×2700) on the Daybreak brand, in the
visual lineage of the references in `~/Desktop/Linkedin Visuals Inspo`.
Sibling to `/gtm-content-carousel` (clones its CODE architecture only).

Built **agentic-waterfall**, right-sized: phases with checkpoints, filesystem
state, two-tier visual gate, template-then-parallelize. User = Joseph Avula,
who wants to review at every checkpoint.

## How to resume (read these, in order)
1. `_state/BUILD-STATE.md` — current phase, disposition, decisions, gate verdicts, next step.
2. `_state/spec-contract.md` — the LOCKED spec grammar + HARD RULES + per-archetype field contracts + visual rubrics + design tokens.
3. `_state/artifact-index.json` — files created/modified per phase.
4. The approved plan: `/Users/josephavula/.claude/plans/delightful-gliding-acorn.md`.
5. Memory: `[[infographic-skill-assets-from-brand-kit]]`, `[[credits-reset-5am-utah]]`
   (in `/Users/josephavula/.claude/projects/-Users-josephavula-Desktop-tim-writing-os/memory/`).

## To continue the BUILD (autonomous, run-to-completion)
Paste `_state/LOOP-PROMPT.md` after `/loop`. It finishes Phases 2-5 — the
remaining 6 archetypes, the article→layout-selection engine, ingestion, and
tests — using the agentic-waterfall skill, checkpointing to `_state/`, and
resuming at 5 AM `America/Denver` if credits run out. Decisions baked in:
run-to-completion (no per-archetype pause); STANDALONE skill (reads any article
`.md`; weekly-linkedin and the carousel skill are NOT modified).

## Status (update BUILD-STATE.md as the source of truth)
- **P0 DONE** — scaffold, brand assets embedded, theme, forked PNG engine. Smoke render verified.
- **P1 DONE (re-locked 2026-06-19)** — `numbered-steps` template REBUILT to exact-mimic the inspo: descriptive highlight-box title (no hook), no eyebrow, serpentine solid connector (node + arrowheads + rounded U-turns), double rings (tint + bold), bordered ► pills per step. Grammar `[icon] Title | Lead-in | pill; pill`. Rendered from the real wk02 article; visual gate PASS at loop 2.
- **NEXT: run the loop** (`_state/LOOP-PROMPT.md` via `/loop`) to build Phases 2-5 autonomously: `card-grid` + `comparison-panel` (P2), then `icon-list`/`hybrid-playbook`/`funnel`/`annotated-diagram` via parallel sub-agents (P3), then `skill.md` + article→layout selection + ingestion + docs (P4), then tests + README + memory (P5). End goal: point the skill at ANY article and it auto-selects 1 of 7 archetypes and renders one inspo-style PNG.

## Key paths
- Skill root: `~/.claude/skills/gtm-content-infographic/`
- Engine: `render.py` (stdlib; shell = head+footer owned by render.py; archetype partials own only `.core`).
- Assets: `assets/icons.py` (registry generated from `assets/icons/*.png`), `assets/logo/mark.png`, `fonts/manrope.css` (embedded).
- Theme: `themes/_base.css` (structure) + `themes/daybreak.css` (tokens; `--mark` injected by render.py).
- Example source article: `/Users/josephavula/Desktop/tim-writing-os/memory/writing/linkedin/campaigns/2026-tim-wk02-engineers-then-planners-now.md`
- Inspo references: `~/Desktop/Linkedin Visuals Inspo/` (7 JPEGs).
- Brand kit (asset source of truth): `/Users/josephavula/Downloads/Daybreak Brand Kit Visuals/`
- Renders: `examples/samples/` (open with `open <path>`).

## Commands
```bash
SK=~/.claude/skills/gtm-content-infographic
python3 "$SK/render.py" <spec.md> --check                      # cheap gate (fields, em-dash, banned words)
python3 "$SK/render.py" <spec.md> --out "$SK/examples/samples/<name>.png"
open "$SK/examples/samples/<name>.png"                         # then Read it back = visual gate
```

## Locked decisions
- One PNG per run; 4:5 fixed (2160×2700). Daybreak theme only.
- ALL visual assets from the Brand Kit, never the carousel skill.
- **HARD RULES (every archetype, see spec-contract.md):** (1) NO eyebrows/kickers — `--check` ERROR; (2) title is a plain functional descriptor with a `**highlight box**`, NEVER the source post hook; (3) LIGHT footer = mark + "daybreak" + tagline, no dark bar, no URL/CTA.
- numbered-steps (re-locked 2026-06-19): serpentine solid connector (node + arrowheads + rounded U-turns), double rings (tint + bold), bordered ► pills per step. Grammar `[icon] Title | Lead-in | pill; pill`.
- DEFAULT_FOOTER = "AI labor for enterprise planning".
- Palette (from `daybreak_brand_colors.md`): green #39B15A, forest2 #257A3F, lime2 #B1D93C, light #F6F6F6, dark #222222, grey1 #383838, grey2 #858585, grey3 #D4D4D4, skyline #D1E6E4.
- Archetype build order: P1 numbered-steps · P2 card-grid, comparison-panel · P3 icon-list, hybrid-playbook, funnel, annotated-diagram (last two hardest) via parallel sub-agents.

## Inspo → archetype map (calibration targets)
- `1779796813326.jpeg` → numbered-steps  ✅ done
- `1780315210934.jpeg` → card-grid (2-col numbered cards)
- `1781611179828.jpeg` → comparison-panel (2–3 col VS, colored header bars)
- `1781783838222.jpeg` → icon-list (2-col numbered list w/ icons)
- `1781697366045.jpeg` → hybrid-playbook (stat callouts + steps + sections)
- `1781351818496.jpeg` → funnel (vertical 5-stage funnel)
- `1779105621604.jpeg` → annotated-diagram (central diagram + labeled callouts)

## Process rules
- Every archetype: build core partial/builder + add CSS block in `_base.css`; register in render.py `CORE_BUILDERS` + `REQUIRED`.
- Gate each: `--check` (cheap) → render → `Read` the PNG (visual gate) vs its inspo + rubric; ≤3 fix loops; if still off, mark DEGRADED in BUILD-STATE and surface to Joseph.
- Run `tests/` after each archetype (Phase 5 builds the suite; regression gate).
- Update `_state/` (BUILD-STATE + artifact-index, and spec-contract when a new archetype locks) at EVERY checkpoint.
- No em-dashes (hard ERROR). Banned words: leverage/delve/synergy/pivotal/foster (WARN).

## Credits / resumption
Joseph's credits reset 5:00 AM Utah local (`America/Denver`). If blocked mid-build,
set a `ScheduleWakeup` for the next 5:00 AM Denver and resume from `_state/`.

## Remaining phases
- P2: card-grid, comparison-panel (build + checkpoint each).
- P3: icon-list, hybrid-playbook, funnel, annotated-diagram (parallel sub-agents, each given only locked CSS/contract/grammar + its one inspo image + rubric; checkpoint all four).
- P4: `skill.md` (guided/oneshot + layout-selection heuristics), source ingestion (article → spec), `reference/` docs, `examples/` per archetype.
- P5: `tests/` (parser, compound items, per-archetype required fields, em-dash/banned, integration smoke asserting PNG dims), `README.md`, auto-memory doctrine note + MEMORY.md line, optional CLAUDE.md router entry (ask first). Mark BUILD-STATE DONE.
