# Carousel

`/content-engine carousel <topic>` lands here.

**This file owns pipeline steps 4, 6 and 7: the draft as slide beats, the
design gate, and the render.** Steps 1, 2, 3, 5 and 8 belong to the router in
`SKILL.md`. A line here that restates one of them is a bug, because two copies
of a rule is two places for it to be wrong.

A carousel is a PDF uploaded as a LinkedIn document post. The deliverable is
one vector PDF at 4:5, plus the caption that rides above it.

## The renderer's input contract

`render/carousel/render.py` takes a **Markdown spec** and emits a PDF. That is
the whole contract, and it is the renderer's, not this file's to change.

```
runs/<slug>/spec.md  +  profiles/<handle>/theme.json  ->  render.py  ->  deck.html, deck.pdf
```

Front matter, then one `:: <archetype>` block per slide of `key: value` lines:

```markdown
---
theme: ../../theme.json   # the profile's theme.json, relative to THIS file
aspect: 4x5               # 4x5 | 1x1, and `title:` sets the PDF title
footer: <one line>        # optional, the bottom-bar line on body slides
---
:: cover
eyebrow: <label>
headline: One line with **one accent span.**
```

| Rule | Detail |
| :- | :- |
| Fields | Every archetype's required and optional fields are in `render/carousel/reference/archetypes.md`. Not restated here. |
| Lists | `- ` lines attach to the open list field (`items`, or `left` / `right`). `steps` items use a pipe: `Label \| detail`. |
| Accent | `**bold**` in a headline renders in the theme accent, one span per headline. `bg: dark` or `bg: light` forces a slide's treatment; `cover` and `cta` are dark by default. |
| Automatic | Page counter, progress bar, footer mark and wordmark are generated. Never hand-write them. |
| Flags | `--check` validates without rendering, `--html <path>` assembles for the gate, `--out <path>` renders, `--theme <path>` overrides the front-matter theme, and bare `k=v` tokens (`aspect=1x1`, `density=spartan`) beat front matter. |

## Step 4: the draft as slide beats

`brief.md` already exists, written at step 3. Read it and draft to it.

**6 to 10 slides**, one idea each. Fewer reads thin for a document post, more
loses the swipe, and a slide carrying two ideas gets split or cut.

Slide 1 is the hook and it stands alone. **It must survive 220px**, which is
`content-engine-VISUALS.md` §1's two-layer law and holds for a deck unchanged:
the claim is complete in the headline plus the structure, and the body copy is
reward for the tap. Slides 2 through N each carry one beat. The final slide is
a **takeaway, not a call to action**, per PRD §10.3.

On-slide copy is signage, not prose: **headline 3 to 8 words and never a third
line** (VISUALS §5.1), lead two short lines, bullet about six words. `--check`
warns past those without blocking, and they are also the only overflow
protection the layouts have, so an accepted warning is a decision rather than an
oversight. A label plus one clause is a good bullet and trips the warn.

Two writes, in this order:

1. **`runs/<slug>/draft.md`** — the caption, then the slide copy as plain
   lines. Step 5's gate reads this file, so every word a reader will see has to
   be in it: words that never reached `draft.md` are words no gate ever saw.
2. **`runs/<slug>/spec.md`** — the same words in the syntax above, derived. A
   fix goes into `draft.md` and the spec is rewritten from it, never the other
   way round, and a redraft at step 5 rewrites both.

Then hand back to the router for step 5.

### Choosing the archetypes

**`content-engine-VISUALS.md` §2 is the authority and this file does not
restate it.** Write the claim first, read the shape of the material, discard on
disqualifiers, and take §2.4's refusal path when nothing fits: the engine offers
a short post rather than improvising. §2.5's clearance filter runs before
selection rather than after drafting, because an image cannot be edited after
posting, and it is what decides whether `logo-wall` is available at all.

Two things the carousel path adds. **§3's catalog does not cover slide
layouts**: its fifteen signatures are single-frame infographic forms, so what
transfers is §2's procedure, §5's craft rules and §2.4's refusal, never a
name-for-name mapping. And **§2.4's quote-card prohibition binds the deck rather
than the beat**: a deck whose payload is sentences in large type is the visual
em dash and is refused, while one `quote-spotlight` carrying a real attributed
quote is a beat, never slide 1 and never the takeaway.

**Lock 4 is the router's to check and yours to respect.** `brief.md` carries one
`archetype:`, and on a carousel it names the deck's **spine**: the interior
archetype that carries the argument. `cover` and `cta` are furniture, every deck
has them, and neither is ever the spine.

Inside one deck, **no partial appears on two consecutive slides**, and PRD §3's
verbatim rule reads slide to slide as well as piece to piece: a span of eight or
more words repeated from an earlier slide is the repetition, and rewording it is
still the repetition. Cut the slide.

## Step 6: the design gate

**The gate runs on the rendered HTML as text**, never on a screenshot and never
by reading the PDF back: PRD §4 prices one 1080x1350 image at roughly 1,900
tokens, a whole deck's budget spent looking at what the HTML already says. Run
`--html <runs>/<slug>/deck.html`, then read that file.

**On a first visual run, `profiles/<handle>/theme.json` does not exist yet**,
and PRD §7a makes the first visual run the one write that creates it. Ask for
the nine keys in one turn, offer `_template/theme.json`'s values as the fallback
for any they have no answer to, confirm in the same turn, write it once;
`render/carousel/reference/themes.md` holds the contract. Never assemble against
the template file itself. Rendering early decks off shipped defaults is the
"looks like a template because it is one" failure that writer exists to prevent.

The rules are already written. Read them, do not copy them. **As of 2026-08-24
they are consolidated in `reference/design-tells.md`**, one gate file with a
citation on every entry, which is what PRD §1.2 and §3 have always named and what
this table stood in for while it did not exist. Entries are tagged: this path
reads `[carousel]` and `[both]`. The sources behind them, for anyone tracing an
entry back:

| Source | What it governs |
| :- | :- |
| PRD §10.3 | the carousel entries, "what good looks like", the slide-1 / interior / takeaway structure |
| VISUALS §1 | the two-layer law, read against slide 1 |
| VISUALS §5.1 - §5.4 | headline length and form, the subtitle's job, two type weights, 3x to 3.5x hierarchy, three hues, the accent-route test |
| VISUALS §5.5 | structure honesty: geometry claims what the material may not contain |
| VISUALS §5.6 | a signature, not a follow-and-repost bar |

**Corrected 2026-08-24:** this read that *"VISUALS §6's thirty new entries are
scoped to the infographic path by §6.1 and do not apply here until carousel
evidence exists."* Too wide. §6's `[infographic]`-tagged entries are indeed
scoped away, but the file also carries `[both]` entries drawn from §5 and PRD
§10.3, and those have always applied here. Read the tag, not the section number.

**The infographic renderer has a `check_layout` pass and this one does not.** It
is stdlib and portable — sRGB/OKLab conversion and an `html.parser` walk carrying
colour and size down the tree — so the contrast and thumbnail checks it mechanises
are read by eye here until an equivalent exists. A deck shipping without them
mechanically checked says so. Two of §6.3's checks are
answered by the theme rather than by a per-run read: `theme_css()` derives
on-accent text from the far end of the palette and the tints from the page
background, so neither can be set globally wrong. What is left is the taste
half, plus the copy budgets `--check` reports.

Write `runs/<slug>/design-gate.md`: what was checked, what changed, what was
accepted on purpose. **Never write the PDF before that file exists**, the same
existence check step 5 uses on `gate-report.md`. Fixes go into `draft.md`, then
`spec.md`, then re-assemble.

## Step 7: the render

`python3 render/carousel/render.py <spec> --out <runs>/<slug>/deck.pdf`.

The run directory ends up holding `brief.md`, `draft.md`, `gate-report.md`,
`spec.md`, `deck.html`, `design-gate.md` and `deck.pdf`. Nothing lands outside
`profiles/<handle>/`, per PRD §1.3, which is why the renderer's transient HTML
goes to the output directory.

**When the render fails**, say which of these it was and stop. Do not improvise
a fallback format and never present a deck nobody rendered.

| Failure | What it means |
| :- | :- |
| `--check` reports ERROR | unknown archetype, a missing required field, or an `image:` path that does not resolve. Fix the spec. |
| `theme: … is missing <key>` | `theme.json` is incomplete, or a colour is not hex. Fix the profile, never the renderer. |
| `Chrome render failed` | Chrome's own stderr is in the message. `CHROME=<path>` if the binary lives elsewhere. |
| Chrome not found | the renderer drives the installed browser and installs nothing. There is nothing to `pip install`, ever. |

`spec.md` survives all four, which is what keeps PRD §9 bound 3 true on the
visual path: the run still ends with an artifact and a named reason.

Then hand back to the router for step 8. The visual path prints one field more,
`<angle> · <archetype> · <anchor> · <job>`, and the PDF is what the human
uploads.
