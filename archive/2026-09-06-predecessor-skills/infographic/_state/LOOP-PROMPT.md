# LOOP PROMPT — finish building `gtm-content-infographic`

Paste the block below after `/loop` (dynamic mode). It runs to completion
autonomously, checkpointing to `_state/`, and survives the 5 AM credit reset.
After a `/compact`, paste it again — it re-enters from the seed prompt and the
state files, losing nothing.

---

Continue building the `gtm-content-infographic` Claude Code skill to completion, autonomously, using the agentic-waterfall methodology and skill.

START — resume from disk, not from conversation history. Read, in order: `~/.claude/skills/gtm-content-infographic/_state/SEED-PROMPT.md`, then `_state/BUILD-STATE.md`, `_state/spec-contract.md`, `_state/artifact-index.json`, then the approved plan `/Users/josephavula/.claude/plans/delightful-gliding-acorn.md`. Invoke the agentic-waterfall skill and apply its context-engineering principles, right-sized (no heavyweight ceremony): phase contracts with DONE/DEGRADED/BLOCKED dispositions; filesystem-as-context (`_state/` is the source of truth); two-tier visual gate (cheap `--check` before the expensive PNG read-back); template-then-parallelize; anti-fabrication; regression gate.

GOAL (the finished system): given ANY article or short-post `.md` you are pointed at — including the per-owner files the `weekly-linkedin` command saves under `memory/writing/linkedin/campaigns/` — the skill reads it, decides which ONE of the 7 archetypes best fits the article's main idea, generates a fresh spec from the article (always render from the given article), and renders exactly ONE 4:5 PNG (1080×1350 @2x = 2160×2700) that mimics the dense, information-rich style of `/Users/josephavula/Desktop/LinkedIn Visuals Inspo`, on the Daybreak brand. Invoked standalone as `/gtm-content-infographic <article.md>`. Do NOT modify the `weekly-linkedin` or `gtm-content-carousel` skills.

HARD RULES (every archetype — already enforced for numbered-steps): no eyebrows/kickers (a `kicker` field is a `--check` ERROR); the title is a plain functional descriptor with a `**highlight box**` key phrase, NEVER the source post's hook; light footer only (sunrise mark + "daybreak" wordmark + "AI labor for enterprise planning" tagline, top hairline), no dark bar and no URL/CTA; ALL visual assets come from the Daybreak Brand Kit (`/Users/josephavula/Downloads/Daybreak Brand Kit Visuals`), never the carousel skill; one PNG per run; no em-dash. `numbered-steps` is the locked reference template (serpentine solid connector + double tinted rings + bordered ► pills) — match its quality bar and "exactly mimic" standard for every other archetype, swapping only the inspo's palette for Daybreak green.

7 ARCHETYPES + calibration targets (mimic each one EXACTLY against its inspo image):
- numbered-steps — `1779796813326.jpeg` — DONE / locked (do not rebuild)
- card-grid — `1780315210934.jpeg`
- comparison-panel — `1781611179828.jpeg`
- icon-list — `1781783838222.jpeg`
- hybrid-playbook — `1781697366045.jpeg`
- funnel — `1781351818496.jpeg`
- annotated-diagram — `1779105621604.jpeg`

EACH ITERATION:
1. Read BUILD-STATE; pick the next incomplete phase.
2. Phase 2: build `card-grid`, then `comparison-panel` (sequential), each calibrated to its inspo. Phase 3: fan out one isolated sub-agent per remaining archetype (`icon-list`, `hybrid-playbook`, `funnel`, `annotated-diagram`), each given ONLY the locked `_base.css`/`render.py` contract + grammar + its ONE inspo image + a written visual rubric; each returns its core builder + CSS block + a rendered sample + a self-gate verdict. Phase 4: write `skill.md` (guided + oneshot modes + the article→layout selection heuristics below), the article-ingestion step (read the `.md`, extract the frame/claims/structure, pick the archetype, draft the spec), `reference/` docs, and one example spec + sample per archetype. Phase 5: `tests/` (parser, compound items, per-archetype required fields, kicker/em-dash/banned-word checks, integration smoke asserting 2160×2700), `README.md`, the auto-memory doctrine note + `MEMORY.md` line; ASK before adding a CLAUDE.md router entry.
3. For each archetype: WRITE its visual rubric before building → cheap `--check` → render → READ the PNG back and score it against its inspo image + rubric → bounded to 3 fix loops → if still off after 3, mark DEGRADED in BUILD-STATE and move on (do not thrash).
4. Register each new archetype in `render.py` (`CORE_BUILDERS`, `REQUIRED`, `KNOWN_ARCHETYPES`) and add its CSS block in `_base.css`. Run `tests/` after each archetype (regression gate); a parser/contract change that breaks a prior archetype must be caught immediately.
5. Update `_state/` (BUILD-STATE + artifact-index; spec-contract when an archetype locks) at every checkpoint. Generated runtime infographics save next to their source article (the campaigns folder), named to match, mirroring the LinkedIn per-owner auto-save convention.

LAYOUT SELECTION (the core runtime act, encoded in skill.md): map article shape → archetype. Sequential process / "steps" / "how to" → numbered-steps. Parallel categories / a set of options or types → card-grid. A-vs-B, before/after, old-way/new-way, two or three columns → comparison-panel. A flat list of tactics / principles / reasons → icon-list. Mixed stats + steps + sections in one piece → hybrid-playbook. Narrowing / conversion / qualification / funnel language → funnel. One central concept decomposed into labeled parts → annotated-diagram. The skill picks the single best fit and states why in one line before building.

CONTINUE / STOP: keep advancing phases in this turn until every phase is DONE — do not pause for review between archetypes (run-to-completion was chosen). If credits are exhausted mid-build, call ScheduleWakeup for the next 5:00 AM `America/Denver` with this same `/loop` prompt and resume from `_state/`. When BUILD-STATE shows all phases DONE and the final visual + regression gates pass, STOP (omit ScheduleWakeup) and report: what was built, each archetype's sample PNG path, any DEGRADED items, and the one-line `/gtm-content-infographic <article.md>` usage.

---
