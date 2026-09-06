# BUILD-STATE — gtm-content-infographic

Resumption backbone (filesystem-as-context). To resume: read this file, not the conversation. Credits reset 5:00 AM America/Denver (see memory [[credits-reset-5am-utah]]).

## Current
- **Phase:** ALL DONE (P0-P5). Skill complete.
- **Disposition:** P0 DONE · P1 DONE · P2 DONE · P3 DONE · P4 DONE · P5 DONE.
- **Build complete (2026-06-19).** 7 archetypes built/integrated/visual-gate PASS; skill.md + ingestion + reference docs; 21-test suite OK (incl. render smoke 2160x2700); README + memory written.
- **One open item (needs Joseph):** whether to add a CLAUDE.md router entry. The skill works without it (auto-discovered from `~/.claude/skills/`). Do NOT add to CLAUDE.md without Joseph's yes.

## Phase 5 (2026-06-19) — verify + docs + memory
- `tests/test_render.py`: 21 stdlib unittest cases — parser (front-matter/list-keys/stats/comments), atoms (split_fields/accent/esc), validator (missing-required per archetype, kicker ERROR, em-dash ERROR, banned WARN, unknown archetype, multiple blocks, clean spec), builders (every archetype has builder + emits its marker class, unknown icon fail-soft, build_html shell has light footer + no kicker), examples sweep (all shippable examples parse + validate clean + build), render smoke (funnel -> PNG, asserts 2160x2700, skips if Chrome absent). All OK.
- `README.md`: overview, 7-archetype table, hard rules, layout, commands.
- Memory: `gtm-content-infographic-skill.md` (project) + MEMORY.md index line.

## Phase 3 (2026-06-19, autonomous loop) — 4 archetypes via parallel sub-agents
Fanned out 4 isolated sub-agents (each in its own scratch copy of the skill), each given the locked engine contract + grammar + its ONE inspo image + a written rubric; each returned a builder + CSS + example + self-gate verdict. Integrated sequentially into the real `render.py` (`CORE_BUILDERS`, `REQUIRED`, `LIST_KEYS`) + `_base.css` (unique class prefixes, no collisions). Regression `--check` OK on all 7; all 4 new render 2160x2700; orchestrator visual gate PASS on all 4.
- **icon-list** (`1781783838222.jpeg`): 2-col numbered icon rows, hairline dividers. PASS (agent 1 loop). `examples/samples/icon-list.png`.
- **funnel** (`1781351818496.jpeg`): interlocking trapezoid bands, green ramp. PASS (agent 2 loops). `examples/samples/funnel.png`.
- **hybrid-playbook** (`1781697366045.jpeg`): hero stat band + section grid; adds `stats` LIST_KEY. PASS (agent 1 loop). `examples/samples/hybrid-playbook.png`.
- **annotated-diagram** (`1779105621604.jpeg`): central hub + leader-line callouts (Python geometry). PASS (agent 1 loop). `examples/samples/annotated-diagram.png`.
- Note: the 54px/800 headline `y` reads as `v` ONLY in the downscaled Read preview; native-resolution crop confirms a correct `y` glyph. No font bug. Funnel + playbook example titles reworded to cleaner functional descriptors.

## Phase 4 (2026-06-19) — skill workflow + ingestion + docs
- `skill.md`: invocation (`/gtm-content-infographic <article.md>`), hard rules, Step 0-4 workflow (read source -> select layout -> draft spec -> gate -> save next to source), oneshot/guided modes, layout-selection table.
- `reference/method.md` (selection heuristics + copy budgets + density doctrine), `reference/archetypes.md` (grammar + rubric per archetype), `reference/themes.md` (token contract).
- `examples/` + `examples/samples/`: one spec + rendered PNG per archetype (7 total).

## Phase 2 (2026-06-19, autonomous loop) — card-grid + comparison-panel
- **card-grid** (inspo `1780315210934.jpeg`): 2-col grid, numbered accent squares + optional `[icon]` + bold title + body. Grammar `[icon] Title | Body`. Rows stretch to fill the 4:5 frame, card content vertically centered. Visual gate PASS at fix loop 3 (loops 1-2 tuned the vertical fill: center → stretch-with-voids → even rows → stretch+centered-content). Sample: `examples/samples/wk02-card-grid.png` (2160x2700).
- **comparison-panel** (inspo `1781611179828.jpeg`): 2-3 columns (`col1`/`col2`/`col3`), first list item = tinted header bar, following items = `Label | value` rows (`;`-delimited value → ► bullet list), `vs` badges between columns, optional `verdict_label` + `verdict` bottom band. Visual gate PASS at loop 1. Sample: `examples/samples/wk02-comparison-panel.png` (2160x2700).
- Both inherit the locked shell (no eyebrow, highlight-box title, light footer) + hard rules. `--check` OK on both.

## Redesign (2026-06-19) — numbered-steps rebuilt to exact-mimic the inspo
Joseph reviewed the first lock and rejected it. Rebuilt per `spec-contract.md` HARD RULES:
- Title = plain functional descriptor with a **highlight box**, NEVER the source post hook.
- NO eyebrows anywhere (kicker dropped from shell + `--check` ERROR).
- Connector = ONE solid serpentine line (start node + arrowheads + rounded U-turns), replacing the dotted diagonal.
- Double rings (bold inner + thin outer, tint fill, bold STEP+number).
- Bordered ► pills under every step (the density element); item grammar `[icon] Title | Lead-in | pill; pill`.
- LIGHT footer (mark + wordmark + tagline); no dark bar, no URL/CTA. DEFAULT_FOOTER = "AI labor for enterprise planning".
- Absolute geometry: `_R=52`, `_PITCH=196`, `_CONTENT_BOTTOM=138` (pitch ≥ ring+body so left rings clear prior pills).
- Rendered from real wk02 article → `examples/samples/wk02-numbered-steps.png` (2160×2700). Visual gate PASS (loop 2).

## Locked decisions
- Output: one PNG per run, 4:5 portrait, 1080×1350 @2x = 2160×2700. Confirmed rendering.
- Theme: Daybreak only. All assets from the Brand Kit (palette/logo/icons/Manrope), embedded.
- Footer bar: dark `#222222`, sunrise mark + "daybreak" wordmark + tagline + optional CTA pill.
- Engine forks carousel CODE; shell (head + footer) owned by render.py, archetype partials own only `.core`.
- Archetype order: P1 numbered-steps · P2 card-grid, comparison-panel · P3 icon-list, hybrid-playbook, funnel, annotated-diagram.

## Phase log
- **P0 DONE:** scaffold; brand assets imported (font embedded 223KB; 23 icons slugged; 3 logos); `assets/icons.py` registry (generated from real files); `themes/_base.css` + `themes/daybreak.css`; `render.py` (PNG screenshot, single layout, shell+core, mark/icon injection); `--check` OK; smoke PNG = 2160×2700, palette+footer+mark verified by visual gate.

## Icon registry (available slugs)
2018, 2020, 2022, 2024, automation, autonomy, c, collaborative, data-centric, domain-specific-graphic, easy-to-use, f, growth, human-judgement, intervention, o, organizational-barriers, performance-barriers, probabilities, purpose, recognition, technology-barriers, u

- **P1 DONE:** numbered-steps template — ring STEP 0N alternating, computed dotted SVG connector through ring centers, per-step brand icons (`[slug]` prefix, fail-soft), optional `Label|Detail|chips` grammar. Built from real wk02 article. spec-contract.md locked.

## Gate verdicts
- P0 visual gate: PASS (Manrope, brand palette, footer bar + mark, 2160×2700).
- P1 visual gate (v1): PASS-then-REJECTED on review (was a dotted diagonal, hook title, eyebrow, dark footer, no pills).
- P1 visual gate (redesign, 2026-06-19): PASS at loop 2 — serpentine connector + double rings + pills + descriptive highlight title + no eyebrow + light footer; nothing clipped at 2160×2700.
