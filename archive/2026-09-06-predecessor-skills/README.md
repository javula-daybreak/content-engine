# The two skills this engine replaced

Deleted from `~/.claude/skills/` on 2026-09-06. This directory holds their prose
only — every `.md` they carried, plus the infographic skill's `_state/` build
log. Roughly 1,400 lines, 112K.

| Skill | Size when deleted | Last touched | What it was |
| :- | :- | :- | :- |
| `gtm-content-infographic` | 7.9M | 2026-08-19 | Seven archetypes, stdlib Python over HTML, headless Chrome to a 2160x2700 PNG. The direct ancestor of this engine's infographic path. |
| `gtm-content-carousel` | 964K | 2026-08-20 | Twelve archetypes, the same technique, printing a 4:5 or 1:1 PDF. The ancestor of the carousel path. |

## What was NOT archived here, and where it went

The 8M was almost entirely binary, and the parts worth keeping were moved rather
than copied:

- **The Daybreak logos, the twenty-three icon PNGs, eight rendered reference
  infographics and two rendered decks** are in `profiles/daybreak/assets/`.
  `profiles/daybreak/SALVAGE.md` records exactly what came from where.
- **The Daybreak palette** was transcribed out of `themes/daybreak.css` into
  `profiles/daybreak/theme.json`, resolving the CSS variable indirection.
- **Their Python renderers, HTML templates, fonts and tests** were *not* kept.
  They are a strictly earlier draft of the two renderers already archived at
  `archive/2026-09-06-html-renderers/`, which this engine shipped and which are
  themselves now retired. Keeping a third generation of the same dead approach
  buys nothing.

## Why the prose was kept when the code was not

These files are where the archetype catalog was first argued, one generation
before `content-engine-VISUALS.md` §3 existed. `carousel/ref-archetypes.md` is
278 lines describing the twelve slide forms the current engine still ships under
the same names, and `infographic/_state/spec-contract.md` is the original spec
grammar that `render/imagegen/prompt.js` still parses. When a field name or a
budget in the live catalog has no stated reason, its reason is probably in here.

`content-engine-VISUALS.md` and `content-engine-PRD.md` supersede all of it. This
is provenance, not documentation: nothing in this directory describes the engine
as it runs today, and nothing should be read as instructions.
