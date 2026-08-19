---
name: content-engine
description: Writes LinkedIn content in one specific person's voice from their own material. Use for any LinkedIn post, short post, carousel, infographic, article, repurposing, content review, or drafting request, and for the setup interview that builds a person's profile. Also handles inventory top-ups, retractions, and weekly performance review.
---

# Content Engine

One skill, one router, one pipeline. This file owns the pipeline and the hard
rules. `workflows/<format>.md` holds only what differs per format and never
restates anything below. `reference/pipeline/` holds each shared step's detail
and is loaded on demand, not up front.

No company specifics live in this file or in any file under `reference/`,
`workflows/`, or `render/`. All of that is in `profiles/`. A string in skill
logic naming a company or an industry is in the wrong file.

## 1. Route

Strip `as <handle>` first, then match:

| Input | Goes to |
| :- | :- |
| `setup` | `workflows/setup.md` |
| no args | `workflows/short-post.md` |
| `post <topic>` | `workflows/short-post.md` |
| `post "<pasted material>"` | `workflows/short-post.md`, paste path |
| `carousel <topic>` | `workflows/carousel.md` |
| `infographic <topic>` | `workflows/infographic.md` |
| `article <topic>` | `workflows/article.md` |
| `inventory` | `workflows/review.md`, top-up section only |
| `review` | `workflows/review.md` |
| `connect` | `workflows/connect.md` |
| `retract <slug\|item-id>` | section 7 below, no workflow file |
| prose with no command word | match it to a row above, say which row you matched in one line, proceed |

**If the workflow file a run needs is not in the repo, say which file is missing
and stop.** Do not improvise the format and do not substitute another one. The
build order is PRD section 13, and a missing file means that step is not built
yet.

`as <handle>` scopes a single invocation and does not persist. With more than
one profile installed and no `as`, ask which one before doing anything else.
With `as`, print `[profile: <handle>]` as the first line of output and again
immediately above the copy block, fenced separately so it cannot be pasted with
the post.

If `profiles/` holds nothing but `_template/`, the only valid command is
`setup`. Say so and offer to run it.

## 2. The pipeline

Five of eight steps are the same for every format. The router owns those five.
A format workflow that reimplements one of them is a bug.

| Step | Owner | Short post | Visual |
| :- | :- | :- | :- |
| 1. Load profile, check staleness | router | yes | yes |
| 2. Select anchor, check locks | router | yes | yes |
| 3. Cross into 5 angles, pick one, write brief.md | router | yes | yes |
| 4. Draft | workflow | paragraphs | slide beats |
| 5. Language gate, rewrite, diff, report | router | yes | yes |
| 6. Design gate | workflow | no | yes |
| 7. Render | workflow | no | yes |
| 8. Log run, ship keystroke | router | yes | yes |

### Step 1: load

Load exactly this, and nothing else:

> `identity.md`, `voice.md`, `thesis.md`, `audience.md`, `learnings.md` (entries
> tagged `confirmed` only), the compact inventory index with only shortlisted
> items hydrated, and `inspiration.md` only when `voice.md` declares that no
> samples exist.

`ai-tells.md` loads at gate time, not at draft time. Do not load the render
templates, the design gate, `inventory-archive.md`, `connectors.md`, or any item
carrying `withdrawn:` or named by another entry's `supersedes:`.

The compact index carries `id`, `type`, `tags`, `connects_to`, and `clearance`.
Hydrate `content` only for the shortlist. Clearance is in the index so the
router can filter before angle crossing spends tokens.

### Run start output

Four things may print, in this order, and none of them blocks. Enter proceeds.

1. Up to three signal lines from `runs/signals.md`, per PRD section 7b.
2. The runway line: `N unlocked anchors, M posts of runway at current cadence`.
   N excludes anchors used in the trailing 10 shipped pieces; M counts anchors
   never used at all. `engine.js locks` returns both, and neither is judged by
   reading. See PRD section 12.
3. One staleness line, most urgent wins, and only for files this run loaded.
   Intervals: identity 180 days, audience 120, voice 90, thesis 90, inventory
   30. `inspiration.md` and `theme.json` never go stale.
4. The sibling notice, only when more than one directory exists under
   `profiles/`: read `profiles/*/runs/*/brief.md` and print the last 14 days,
   one line each, date, handle, format, anchor summary. Notice, not lock. It
   globs to nothing on a solo install and must not error there.

Nothing else prints at run start.

Reading a file does not stamp `last_reviewed`. Only a confirmed answer to
`review`'s quarterly three-question check does.

### Step 2: select the anchor and check the locks

Every piece names **one** `anchor:` item and may cite up to four `supports:`.
Only the anchor consumes a lock. A support is a citation, not a consumption.

Five locks, checked against `profiles/<handle>/runs/*/brief.md`, counting only
briefs with `status: shipped`. Call `reference/engine.js locks <profile>` and
quote its JSON. Do not judge these by reading.

1. **Anchor item.** Off limits until 10 other pieces have shipped.
2. **Thesis x hook pattern.** The same pair is locked 30 days.
3. **Hook pattern alone.** No reuse within the trailing 8, and no more than
   twice in any trailing 20.
4. **Archetype.** No reuse within the trailing 5 shipped visual pieces. Visual
   runs only.
5. **Verbatim overlap.** Checked at step 5, not here, because it needs a draft.

Every run also logs a **structural job**: `argue`, `enumerate`, `sequence`,
`compare`, `transform`, `diagnose`, `quantify`. Reusing an anchor across formats
is allowed. Reusing the job is not. A repurpose matching its source on anchor
**and** job **and** thesis is refused at the brief, before any draft tokens are
spent, and the refusal returns three alternate angles read off live inventory
state rather than a bare no.

When the inventory is too thin to clear the locks, say so and print the runway
number. Do not draft off a locked anchor.

### Step 3: cross into angles, then write the brief

An angle is one inventory item, crossed with one thesis, aimed at one thing the
audience believes and is wrong about, or is tired of hearing. The third term is
what supplies a counterparty; item crossed with thesis alone can only produce
illustrations.

Generate 5. Draft the best. **Never draft the first angle you thought of.**

Write `runs/YYYY-MM-DD-<slug>/brief.md` now, before drafting, so it survives a
crash at render:

```
anchor:
supports: []
job:
hook_id:
thesis_id:
archetype:              # visual runs only
arm: explore | exploit  # one in five is explore, written automatically
tests_hypothesis:
signal_id:
private_terms: []
status: drafted
```

`private_terms:` holds every proper noun, numeral, and distinctive phrase whose
only source is a `visibility: private` signal.

`hook_id:` names a pattern in `reference/hooks.md`, chosen from the shape of the
anchor and from what `engine.js locks` reports as unlocked. **The id is the
contract**: rename a pattern and every brief written before the rename points at
nothing, and lock 3 stops binding without saying so.

### Step 5: the gate

`reference/ai-tells.md` runs on every draft before the human sees it, including
the calibration post at the end of setup session 1. It is not advisory: a draft
that fails is rewritten before anyone sees it. Full precedence, bounds, and
protected spans are in PRD section 9 and in `reference/pipeline/`.

Four things bound it and none of them is optional:

1. **`voice.md` wins.** A tell contradicting a documented habit in `voice.md`
   does not fire for that profile. Record the override in `gate-report.md`
   instead of rewriting.
2. **Substitute, never subtract.** Removing an em dash means replacing it with a
   comma, colon, or parenthesis. Splitting the sentence, deleting the clause, or
   dropping the punctuation is not a valid rewrite.
3. **Bounded, and it always produces an artifact.** Cap at 3 rewrites per 200
   words, never rewrite the same span twice. Above the cap, go back to brief.md
   and redraft once with the tripped rules injected as drafting constraints. If
   the redraft still exceeds the cap, ship the better draft with one line naming
   what is unresolved. No run ends without an artifact.
4. **Re-measure.** Re-run the gate on rewritten text. Otherwise the gate
   flattens a draft and reports a clean pass on its own flattening.

**The gate never rewrites inside quotation marks and never alters a numeral or a
proper noun anywhere.** A banned item inside a protected span is reported under
`not rewritten: quoted or factual` and left alone.

**Rejection, not rewriting, in two cases.** A draft naming a company, a person,
a role-plus-employer-plus-timeframe triple, or a figure whose source item is not
`clearance: public` is rejected and redrafted. So is a draft containing any
literal string in `private_terms:`. Rewriting a disclosure only produces a
better-written disclosure.

The deterministic half is `reference/engine.js`: 8-gram overlap, the lexical
list, contraction rate, sentence-length stdev, comma density, specifics count,
hashtag counts, the lock read. Quote its JSON verbatim into `gate-report.md`.
The model owns the judgments: the open forms of antithesis, unearned rule of
three, parallel bullets, restating close, the open category of hedged openers,
the announcement shape, a testimonial quote, all-contractions, and the clearance
read. Zero tolerance is a promise only the deterministic half can keep.

**`reference/ai-tells.md` is the working list, and every tell there has an id.**
Tag `gate-report.md` with those ids, not with prose, because PRD section 13.2
step 5 asks for a per-tell tag list and a tag has to match something. The ids
are what `gate-fixtures/expected.md` references and what the ownership table in
`engine.js` keys on, and `node reference/engine.js gate --tells` fails when the
file and the table disagree. Run the four harness modes whenever `ai-tells.md`
changes:

```
node reference/engine.js gate                      # recall over gate-fixtures/
node reference/engine.js gate --negative <profile> # fires on their own writing
node reference/engine.js gate --hooks              # hooks.md example lines
node reference/engine.js gate --tells              # the file against the table
```

Retiring a rule is a real move, not a defeat. A tell that fires on this person's
own writing gets struck through in `ai-tells.md` with the date and the reason. It
stops firing and stays visible, because a wrong rule costs a rewrite of good
writing on every future draft forever.

#### gate-report.md

The fifth mode is the one that runs on a real draft, and one call produces the
whole report:

```
node reference/engine.js gate --report runs/<slug>/draft.md profiles/<handle>
```

Quote that JSON verbatim at the top of the file. It carries `gate_catch_count`,
the per-tell `tags` list, `gate_passes`, and the `rewrite_cap` bound 3 measures
against. **Do not recompute any of them by reading.** A count derived by adding
two JSON arrays together is the self-witnessed number this whole split exists to
prevent.

Then four headings, any of which may be empty:

- **`rewritten`**, one line per change: the tag, the span before, the span after.
- **`not rewritten: quoted or factual`**, copied from the JSON. Never edited.
- **`overrides`**, one line per tell that did not fire because `voice.md` won,
  naming the habit it lost to.
- **`unresolved`**, what bound 3 could not clear after the redraft.

**The run prints one line, not the file**, directly above the post, and only when
the gate caught something:

```
gate: <n> caught, <n> rewritten, <n> flagged
```

with ` · unresolved: <tags>` appended when bound 3 ran out. A run that caught
nothing prints no gate line at all, the same way the staleness line and the
sibling notice already work, and `gate_passes: true` is still written to the
file. A flag changes no word, so it does not fail the gate, but it is counted on
that line rather than swallowed by the pass.

**Never show the post before `gate-report.md` exists in the run directory.**
That is the mechanical version of "the gate is not advisory": one existence
check instead of a promise.

### Step 8: log and ship

Print, in this order, and nothing else:

```
<angle> · <anchor> · <job>
```

then the post, then the four rejected angles as one-liners, then the ship
question. The visual path prints one field more, in the same position:

```
<angle> · <archetype> · <anchor> · <job>
```

**Never show a draft without showing what it was chosen over.** One exemption,
and it is a decision rather than an oversight: the calibration post at the end
of setup session 1 shows one draft and no angle menu, because minute 165 of an
interview is where people quit.

End every run with `Shipped as written? [y/n]`.

`y` copies `draft.md` to `runs/<slug>/shipped.md`, flips `brief.md`'s `status:`
to `shipped`, and appends the `posts.csv` row. `n` prompts for a paste, or
defers to the weekly review.

**The posts.csv row.** The header is frozen in PRD section 11. Ship writes only
the columns it can observe: `run_slug`, `shipped_at`, `shipped_verbatim`,
`minutes_to_ship`, and `hit_limit` when the human says the session was
interrupted.

`run_again`, `post_url`, `followers_at_post`, `reactions`, `comments` and
`reposts` are left **empty**, and empty is not zero. Empty means not collected
yet; zero means measured zero. Section 11 divides the score by follower count
and excludes every `run_again: -` post from the median, so a zero written where
a blank belongs turns an uncollected post into a measured failure. Review fills
those columns later.

`minutes_to_ship` is wall clock: read the clock once at step 1 and once here,
and subtract. Never ask for it, never estimate it. Ceiling: a run somebody
walked away from mid-draft records the walk. Section 12.1 reads the median over
a rolling 20, which absorbs that, and it is not worth a second timestamp field
to fix.

## 3. Where writes are allowed

**Every run writes into `profiles/<handle>/` and nowhere else.** Not just setup.
If a run needs to modify anything outside a profile directory in order to work,
portability has already broken.

Inside a profile, two zones:

- **Profile files** are curated: `identity.md`, `inventory.md`,
  `inventory-archive.md`, `voice.md`, `inspiration.md`, `audience.md`,
  `thesis.md`, `theme.json`, `learnings.md`, `shipped-history.md`,
  `connectors.md`. **Only named commands write to these.** `setup` creates.
  After that: `inventory` appends to `inventory.md`; `review` appends to
  `learnings.md` and to `inventory.md` for each cleared harvest candidate;
  `connect` writes `connectors.md`; `retract` appends a `withdrawn:` line; and
  the first visual run writes `theme.json` once. Nothing else, ever.

  **The paste path is the one write a draft run may make**, and it is
  `inventory`'s writer rather than a new one. `post "<pasted material>"` appends
  what the human pasted, verbatim, `source: pasted`, `clearance:` set in the
  same turn, the run slug recorded, and only after they accept the draft. Never
  anything the model derived, inferred, or rewrote. A run drafting from standing
  inventory writes nothing. **A draft run otherwise reads profile files and
  never modifies one**, so no post can quietly change who the engine thinks you
  are: the only line a post can add is one the human typed into it.
- **The ledger** is `runs/` and `analytics/`. Every run appends to it.

`inventory.md` and `learnings.md` are append-only. Correcting an entry means
appending a new one carrying `supersedes: <old-id>`. The old line is never
touched.

Every entry in every profile file carries `source:`: `interview`, `pasted`,
`derived`, or `proposed`. Nothing is written as `proposed` without confirmation
in the same turn. Anything unconfirmed is not written at all.

The four measured values in `voice.md` are frozen at setup and never
overwritten. Re-derivation of prose is explicit, diffed, and does not write
until the human accepts.

## 4. Hard rules

- **No auto-post.** Output is copy-paste.
- **No automated collection as a publishing identity.** No scraper, actor,
  extension, or script ever authenticates to LinkedIn as an account this engine
  writes posts for. Reading is copy-paste too.
- **Never invent a fact, number, story, or credential.** Everything factual
  comes from `inventory.md`. If a draft needs a number the inventory does not
  have, ask for it or cut the claim.
- **A true detail that was never yours to tell is the same defect as an invented
  one.** Clearance is a schema field, not a judgment call at draft time.
- **A signal is an occasion, never a subject.**
- **No connector is ever required.** Every path works with zero connectors
  authenticated. Anything a connector supplies degrades to a search result or to
  nothing, in one line, and the run completes.
- **The engine never runs unattended.** No scheduler, no daemon, no background
  job. Every run is one a human started and is watching.
- **Material arriving from a connector defaults to `do-not-publish`** and is
  cleared one item at a time. No bulk import at any confidence level, no
  auto-clear heuristic.
- **The engine never writes a number it cannot observe.** No self-reported token
  counts, no estimated durations, no inferred impressions.
- **One anchor per piece plus up to four supports.** Only the anchor consumes a
  lock.
- **The gate is not advisory.** `voice.md` wins where the two disagree.
- **`voice.md` is never seeded from another person's or a company's voice
  file.** Registers describe a company; `voice.md` describes one human.
- **Never show a draft without showing what it was chosen over.**
- **Only named commands write to a profile file.**
- **Nothing fictional is ever written into the repo.** No example profile, no
  sample inventory, no placeholder story. A fake item on disk is a fact waiting
  to leak into a real draft.

## 5. Retract

`/content-engine retract <slug|item-id>` is the one command you hope never to
run, and it costs nothing on the days you do not.

Given an item id: append `withdrawn: <date> <reason>` to that item in
`inventory.md`. The item is then permanently excluded from every draft-time
load, regardless of any lock or retirement rule, and it is permanently
ineligible for retirement in the normal path.

Given a run slug: write a one-line `WITHDRAWN` marker into `runs/<slug>/`, and
ask whether the underlying inventory item should be withdrawn too.

Ask for the reason. Do not write the line without one.
