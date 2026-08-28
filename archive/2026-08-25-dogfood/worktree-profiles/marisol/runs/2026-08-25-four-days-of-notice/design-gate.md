# Design gate

Read `final.png.html` as text against `reference/design-tells.md`, `[infographic]`
and `[both]` entries. Archetype: `causal-chain`.

## Checked and passed

| Tell | Why it does not fire |
| :- | :- |
| `arrow-without-necessity` | Every link is defensible as "remove X and Y does not happen": the anchor (`first-case-58-to-81`) is the natural experiment — the call moved from day 3 to day 7 and on-time starts moved 58% to 81%. |
| `load-bearing-number-in-body-copy` | `23 points` is the headline highlight, not body copy. |
| `unscoped-frame` | Subtitle present. |
| `missing-method-in-the-subtitle` | Measure (first-case on-time starts), sample (one campus, 22 rooms), window (fourteen months). |
| `digit-with-no-source-region` | `footer:` set. |
| `hue-count-over-three` | One accent, one ink, one ground. |
| `three-line-headline` / `highlight-on-both-lines` | Headline is one line, one highlight span. |
| `parallel-list-of-n` | A chain, not a list of peers. |

## Fired, and what was done

**`claim-below-the-feed-layer`** — engine check, WARN, threshold `[UNVERIFIED]`.
Verbatim:

```
WARN  thumbnail: 5 claim-layer node(s) at 31px are ~4.4px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'PAT call at day 3'
WARN  thumbnail: 2 claim-layer node(s) at 54px are ~7.7px cap at 220px, under ~8px (VISUALS 1, unverified floor): '23 points'
```

The tell's prescribed fix is "shorten the headline so it can be set larger." The
headline was redrafted from `The chain that cost us **23 points**` (35 chars) to
`**23 points**, one phone call` (28 chars) and the measured size stayed at 54px:
this builder sets the headline size from the template, not from the string
length, so the remedy is inert on this path. **Accepted on purpose**, on the
tell's own terms — the threshold is `[UNVERIFIED]` and the check warns rather
than failing, per VISUALS section 1's instruction to tune it on the first ten
renders. Noted here rather than silently, because VISUALS section 3.16 claims
this form "has one of the strongest thumbnail contracts in the catalog" and the
renderer's own check disagrees with that claim on the first real render.

**`uniform-chip-lengths`** — flag. Node labels run 16 to 19 characters; the tell
wants the longest at least twice the shortest. VISUALS section 3.16 caps a node
label at 17 characters, so satisfying the tell would need a shortest label of 8
characters or fewer across a 4-node chain. **Accepted on purpose**: the budget
and the tell cannot both be satisfied on this form.

## Structure honesty, checked against the material and not the picture

`geometry-without-the-relation` was the entry to clear, because section 3.16
disqualifies **convergence**: several independent causes feeding one outcome.
The profile's `pat-71` item is convergent — 71% of delays spread across
pre-admission testing, consent, and transport. A chain drawn over that aggregate
would be the disqualifier exactly.

This frame is not drawn over the aggregate. The claim in `brief.md` is scoped to
one thread and the anchor is `first-case-58-to-81`, which is a single lever with a
measured before and after. `pat-71` rides in `supports:` as context and is not
what the geometry asserts. Recorded so the scoping is visible rather than
assumed.

## Language gate, for the record

`draft.md` is the render spec, so step 5 read it. Three tags survived one
redraft and are unresolvable on this path; see `gate-report.md`.
