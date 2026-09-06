# gtm-content-infographic

Turn any LinkedIn article or short post into **one** dense, information-rich 4:5
infographic PNG (2160x2700) on the Daybreak brand, in the visual lineage of
`~/Desktop/LinkedIn Visuals Inspo`. Point it at a source `.md`; it reads the
piece, picks the single best of **7 layout archetypes** for the main idea,
generates a fresh spec, and renders the image.

```
/gtm-content-infographic <path-to-article-or-post.md>
```

Standalone. Does not modify `weekly-linkedin` or `gtm-content-carousel`. Reads
any article `.md`, including the per-owner files `weekly-linkedin` saves under
`memory/writing/linkedin/campaigns/`.

## The 7 archetypes
| Archetype | Use when the source is... | Inspo |
|---|---|---|
| numbered-steps | a sequential / ordered process | 1779796813326 |
| card-grid | a parallel set of items/options | 1780315210934 |
| comparison-panel | A vs B (vs C) / before-after | 1781611179828 |
| icon-list | a flat list of tactics/principles | 1781783838222 |
| hybrid-playbook | mixed stats + sections | 1781697366045 |
| funnel | a narrowing / conversion | 1781351818496 |
| annotated-diagram | one concept decomposed into parts | 1779105621604 |

## Hard rules (every archetype)
1. No eyebrows/kickers (a `kicker` field is a `--check` ERROR).
2. Title is a plain functional descriptor with one `**highlight box**` phrase,
   never the source post's hook.
3. Light footer only (mark + "daybreak" + tagline); no dark bar, no URL/CTA.
4. Daybreak brand assets only (palette, Manrope, icons, logo), embedded.
5. One PNG per run, 4:5 fixed (2160x2700). No em-dash (ERROR).

## How it works
Markdown spec -> themed HTML -> headless Chrome screenshot -> PNG. Stdlib-only
Python engine (`render.py`). `render.py` owns the shell (head + light footer);
each archetype builder fills only the `.core`. CSS in `themes/_base.css`
(structure) + `themes/daybreak.css` (tokens). All assets from the Daybreak Brand
Kit (see memory `[[infographic-skill-assets-from-brand-kit]]`).

## Commands
```bash
SK=~/.claude/skills/gtm-content-infographic
python3 "$SK/render.py" <spec.md> --check                 # cheap gate (fields, em-dash, banned, kicker)
python3 "$SK/render.py" <spec.md> --out <out.png>         # render
python3 -m unittest discover -s "$SK/tests"               # tests
```

## Layout
```
skill.md                 invocation contract + workflow (oneshot/guided) + layout selection
render.py                engine: spec -> HTML -> Chrome -> PNG (stdlib only)
themes/_base.css         structure (one block per archetype)
themes/daybreak.css      brand tokens (+ Manrope @import)
fonts/manrope.css        base64-embedded brand font
assets/icons.py          icon registry (generated from assets/icons/*.png)
assets/icons/  logo/     brand PNGs (embedded at render time)
examples/                one spec per archetype  (+ samples/ rendered PNGs)
reference/               archetypes.md (grammar+rubric) · method.md (selection+budgets) · themes.md (tokens)
tests/                   stdlib unittest suite
_state/                  durable build state (BUILD-STATE, spec-contract, artifact-index, SEED/LOOP prompts)
```

## Saving runtime output
Generated infographics save **next to the source article** (same folder), named
to match the source stem, mirroring the LinkedIn per-owner auto-save convention.
