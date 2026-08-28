# Three-persona dogfood — synthesis v2

**What ran.** On 2026-08-25, three agents each roleplayed a first-time user of the
content engine skill, started at `README.md`, followed the docs literally,
exercised all four formats (short post, article, infographic, carousel), rendered
the two visual formats for real, and logged every snag. Nothing was fixed. The
personas:

- **Marisol Okonjo-Reyes** (`marisol`) — Director of Perioperative Operations,
  400-bed nonprofit hospital system. Non-developer, will not read a traceback or
  open a source file. Rich archive: ~60 posts, five pasted samples.
- **Dev Ramanathan** (`dev`) — staff platform engineer, 12 years, mid-size SaaS.
  Terminal-fluent, will open source when stuck, but instructed to log every such
  moment as a blocker, because a doc that needs its own source read is broken.
  Thin archive: 4 posts, each a link with one sentence on top.
- **Beatriz Lindqvist** (`beatriz`) — CRO at a Series C fintech. Non-technical,
  10-minute blocks, will not read code. **Zero archive** — never posted on
  LinkedIn. The cold start was the explicit point of her run.

**Against what HEAD.** `397eb04` ("The spec stops promising files that do not
exist"), which is still HEAD. Every finding below still applies.

**The six reports feeding this.**

| Report | Findings | What it is |
|---|---|---|
| `dogfood-beatriz.md` | 34 | Run 2. Her fullest: findings, all four artifact evaluations, cold start, closing. |
| `dogfood-beatriz-run1.md` | 15 | Run 1, reconstructed from transcript. Reached all four formats, rendered both visuals. Scoped to the delta vs run 2. |
| `dogfood-dev.md` | 30 | Run 2. Findings only — no artifact evaluations, no closing. |
| `dogfood-dev-run1.md` | 25 | Run 1, reconstructed from transcript. Reached all four formats, shipped a post, rendered both visuals. |
| `dogfood-marisol-run1.md` | 23 | Run 1. Complete: findings, all four artifact evaluations, closing. |
| `dogfood-marisol.md` | 21 | Run 2. Died after the short post. |

**Findings: 148 before dedupe, 73 distinct defects after** — 32 at blocker severity
and 41 at friction or polish. **Eight of the 73 were hit by all three personas.**
The ranked list below is authoritative for both counts; where a defect appears in
several reports at different severities, it is counted once at the highest.

**The run-count caveat.** Spend limits killed the run repeatedly, so each persona
has up to two runs, and **the two runs of one persona are the same persona, not
two** — the ranking below counts personas, never reports, and where run 1 and run
2 of the same persona independently hit the same defect that is reported as
reproducibility, not as a second witness.

**Citation key.** `B` / `D` / `M` are run 2 of Beatriz / Dev / Marisol; `B1` /
`D1` / `M1` are run 1. Every quotation below is copied from one of the six reports
and carries its report and finding ID. Nothing here was re-derived from the repo
and the engine was not run to check anything.

**Two absences that are data, not gaps.** The two run-1 reports were reconstructed
from transcripts after the fact; where a persona never uttered a subjective
verdict, those reports say `not uttered — died before this stage`. Those absences
are preserved below and never filled in. In particular, **Dev produced no artifact
verdicts in either run**, which is why section (c) can be answered for two
personas out of three and says so at the top.

**What this supersedes.** `dogfood-SYNTHESIS.md`, written from the three run-2
reports only, before the run-1 reports existed. Its own header concedes Dev "died
before artifact section" and Marisol "died after short post". Its structure is a
useful precedent; its central claim is re-tested below rather than inherited, and
the finding set has roughly doubled since it was written.

---

## The through-line

The superseded synthesis argued the defect class is **"the engine reports success
it has not earned"** and listed eight instances. Re-tested against the doubled
finding set, that claim survives and gets stronger — it now carries twelve
instances rather than eight:

1. `pass: true` on a negative control where 100% of samples tripped a rule — `no-long-sentence` fired on 8 of 8 sample reads (D F-7, M F-10, B F-7, B1 F-2, D1 F-7)
2. `file: "found"` on a `gate-calibration.md` the engine parsed as empty (D F-28, D1 F-11, M1 F-6, M F-19)
3. A clean gate pass on an article carrying ~10 instances of the tell the gate has a rule for (B F-34)
4. `gate_passes: true` alongside `baseline_source: "none, absolute floors applied"` (B, D F-11)
5. `exit 0` on a nine-slide deck that renders eight pages (B F-30)
6. `specifics: 0` on a draft containing nine spelled-out quantities (D F-29)
7. `L4` — "a model of the author's own best work" — on a first-ever draft with a two-line context block (D F-20)
8. Setup's closing line asserting "the gate is tuned to your writing" unconditionally (B F-13, D F-11)
9. **New.** `paragraph_lines` counts newlines, so `uniform-paragraphs` is blind on any normal draft and reports a pass it never performed (M F-18, M1 F-8)
10. **New.** A `connects_to:` pointing at a thesis id that does not exist passes both `locks` and `gate --report` silently (M F-21)
11. **New.** A baseline the docs call "**Frozen at setup and never overwritten**" moved three times on identical sample text — `contraction_rate` 0.45 → 0.62 → 0 (D1 F-14)
12. **New.** The mirror case: `gate_passes: false` reported with `gate_catch_count: 0` and `tags: []` — a failure asserted with no evidence attached (B1 F-8)

But the enlarged set makes the old framing **too narrow**. Two further classes of
comparable weight are now visible, and neither reduces to unearned success.

### Class 2 — the engine mandates two things that cannot both be satisfied

This is not a doc being unclear. In each case the engine issues two requirements
and no legal artifact satisfies both. Run 2 could only see two of these; run 1
reached far enough to find the rest.

- The language gate versus the renderers' own required syntax. `rhetorical-fragment` matches the literal string `items:`, a mandatory field key of **both** renderers, so `gate_passes` can never be `true` on any visual run (B1 F-11, B F-19, D F-23, D1 F-18, M1 F-14) — **all three personas**
- Bound 3 versus lock 5. The gate mandates a redraft; a redraft is by construction mostly the same sentences; lock 5's window now contains the draft it came from, so the mandated repair hard-fails at ratio 0.917 (D1 F-17)
- `voice-floor` versus the archetype. No legal draft satisfies both the sentence shape the renderer imposes and the floor the gate enforces (D1 F-19)
- `we-with-no-human` demands a named human; every other rule forbids producing one (D F-12)
- Two design tells cannot be satisfied inside the budgets the same spec imposes (M1 F-17)
- `specifics-floor` forces digits; the step 5b reader marks digits down as the thing that makes a post read generated. Two graders in one pipeline pulling opposite ways, and only one can discard the draft (D F-29)
- The article cap: becoming eligible for an article costs you every anchor you could write one about (D F-27)
- A correctly-formed `steps` item can never clear the bullet budget `--check` enforces (B1 F-13)

### Class 3 — the docs describe a different program than the one on disk

- `SKILL.md` routes to a directory that does not exist (B F-3, B1 F-3, M F-3)
- `SKILL.md` says `reference/design-tells.md` "is not built." It is 35 KB on disk (D F-16, B F-4, M F-4) — **all three personas**
- The doc that explicitly **outranks** the renderer's own reference gets four of six field names wrong; `6 error(s). EXIT=1` (B1 F-7, D F-22, M1 F-15) — **all three personas**
- Three files give three different inventory floors (B F-9); three files name three different output files for one carousel (B F-28)
- `reader.md` is stale about the template it grades against and about which `audience.md` fields shipped (D F-18, M1 F-21)
- `gate --report` returns five fields `SKILL.md` never mentions, and contradicts it on the one it does (D F-13)

**The practical reading.** Class 1 is a philosophy fix: never print a pass the
evidence does not support, and carry the degradation on screen. Class 2 is not a
philosophy — each item is a specific pair of rules that has to be reconciled or
one of them scoped, and no amount of honest reporting resolves them. Class 3 is
the cheapest of the three and the most corrosive to trust, because every persona
independently stopped believing the docs early and said so.

---

## Ranked defects

One entry per defect, not per report. Ranked by severity first, then by how many
**personas** carried it. Blockers get a full entry with the strongest single piece
of evidence quoted; friction and polish are listed compactly with citations, since
at this volume a full entry each would bury the decision-relevant material.

Where two reports describe the same defect at different depths, they are merged
and the deeper one is cited.

### Tier 1 — blockers hit by all three personas

These are design defects, not persona quirks. Every one was reached independently
by a non-technical hospital director, a staff engineer, and a CRO with no archive.

**T1-1. The install line fails from the directory it ships in.**
`B F-1, B1 F-1, D F-1, D1 F-1, M F-1, M1 F-1` — six of six reports, the only
defect with a perfect sweep.
`cp -R "content engine" ~/.claude/skills/content-engine` resolves relative to the
*parent* of the engine folder, and no line on the page says so. README calls it
"the whole install", so there is no documented fallback.
> ```
> cp: content engine: No such file or directory
> EXIT: 1
> ```
> — M1 F-1, which adds: *"`\"content engine\"` is a path relative to the parent of
> the repo, and nothing on the page says so."*

Marisol and Dev then hit `/content-engine setup` → `Unknown skill: content-engine`,
both lines of a two-line install dead (D F-2, D1 F-2, M F-2, M1 F-2). Beatriz never
reached that line: she abandoned the install and read `SKILL.md` in place, which is
why she has no finding for it. Two of three personas were stopped dead on a six-line
README with no diagnostic and no pointer to what to read instead.

**T1-2. The language gate cannot pass the renderers' own required syntax.**
`B1 F-11, B F-19, D F-23, D1 F-18, M1 F-14` — all three personas, and the single
most consequential finding in the run.
`rhetorical-fragment` matches the literal string `items:` — a mandatory field key
of **both** renderers. `title-case-header` matches the renderer's mandatory
`title:` line. So `gate_passes` can never be `true` on any visual run, on any
archetype, forever.
> ```
> lexical hits: [{"tag": "rhetorical-fragment", "term": "items:", "at": 511,
>                 "match": "items:", "protected": false,
>                 "tell": "rhetorical-fragment", "action": "redraft"}]
> ```
> Beatriz then gated three specs that ship in the repo. All three failed, all three
> on `items:`:
> ```
> ### perception-split.md
>  gate_passes False tags ['no-long-sentence', 'nominalisation-rate', 'rhetorical-fragment', 'zero-contractions']
> ### ranked-bars.md
>  gate_passes False tags ['no-long-sentence', 'rhetorical-fragment', 'zero-contractions']
> ### causal-chain.md
>  gate_passes False tags ['no-long-sentence', 'rhetorical-fragment', 'title-case-header', 'zero-contractions']
> ```
> — B1 F-11. Her own commentary: *"Systemic — every shipped example spec fails step
> 5 on `items:`."*

This collides with `SKILL.md`'s own rule that a draft is never shown before
`gate-report.md` exists and that a failing draft is rewritten before anyone sees
it. Every visual run must therefore ship on the documented escape ("No run ends
without an artifact"), which means the escape is not an escape — it is the only
path. **Only run 1 identified the matched token.** Run 2 lists the tag and never
says what it hit, which is why the earlier synthesis could not see the mechanism.

**T1-3. The doc declared authoritative names fields the renderer refuses.**
`B1 F-7, D F-22, M1 F-15` — all three personas.
`workflows/infographic.md` says `content-engine-VISUALS.md` §3 "**outranks**"
`render/infographic/reference/archetypes.md`. Four of six parameter names in the
outranking file are wrong.
> ```
> ERROR block (perception-split): missing required field 'naive_headline'
> ERROR block (perception-split): missing required field 'real_headline'
> ERROR block (perception-split): missing required field 'punchline'
> ...
> 6 error(s).
> EXIT=1
> ```
> — B1 F-7. `headline_naive` → `naive_headline`, `headline_real` → `real_headline`,
> `real_items` → `items`, `real_punchline` → `punchline`; `divider_y_pct` is
> accepted and ignored. The outranked file also carries the character budget the
> authoritative one omits.

Following the precedence rule the docs state produces an artifact that cannot
render. Marisol hit the same wall from the theme side: the bootstrap accepts nine
keys and then refuses to render them (M1 F-15).

**T1-4. The article path refuses a first-time user, and the only way through is to
fabricate a ledger.**
`B F-24, B1 F-14, D F-25, D F-27, D1 F-25, M1 F-13` — all three personas.
The cap is 8 short posts shipped since the last article. README lists
`/content-engine article <topic>` under "After setup" with no caveat. Nothing in
README, `SKILL.md`'s route table, or setup's close mentions that three of the four
formats are locked for roughly two months.
> *"N = 1. The cap is 8. **Refused.** ... I hand-wrote nine additional
> `runs/<slug>/brief.md` stub files carrying `format: short` and `status: shipped`,
> purely to move the counter. ... It also means I wrote nine fictional runs into my
> own ledger, which `SKILL.md` section 4 forbids in as many words: 'Nothing
> fictional is ever written into the repo... A fake item on disk is a fact waiting
> to leak into a real draft.' The product left me no honest path, so I took a
> dishonest one and am recording it."*
> — B F-24

Dev found the structural version: becoming eligible costs you every anchor you
could write the article about (D F-27), and there is no documented way to say "I
want it anyway", so he overrode the cap by hand-editing a brief (D1 F-25). Three
personas, three different dishonest workarounds, because the honest path does not
exist. Beatriz's fix is one word in the README command list: *"(unlocks after 8
short posts)"*.

**T1-5. The refusal message has a slot that cannot be filled on the path that
triggers it.**
`B F-25, D1 F-24, M1 F-13` — all three personas.
The refusal string names the most recent article, and the path that triggers the
refusal is the path where no article exists, so it prints a literal `<slug>` to a
human.

**T1-6. The negative control reports a clean pass on a corpus it just flagged.**
`D F-7, D1 F-7, B F-7, B1 F-2, M F-10, M1 F-5` — all three personas.
§0.3 admits only `fires` rows into `gate-calibration.md` and instructs the engine
to call an empty result "the good outcome", on the stated grounds that "a redraft
or a flag edits no word the person wrote."
> *"`also_flagged` has 21 rows over my 4 posts. ... `we-with-no-human` — action
> `redraft` — fired on 6 of 8 sample reads (3 of my 4 posts) ... `no-long-sentence`
> — action `flag` — fired on **all 8**. ... a **redraft throws away the entire
> draft and starts over**. So the two rules that fire on three quarters of my
> archive are the two that will discard whole drafts written in my voice, on every
> run, forever — and §0.3 forbids the one mechanism that could switch them off, on
> the grounds that they are harmless."*
> — D F-7

The premise is backwards, and the step whose entire stated purpose is "the moment
the engine visibly becomes theirs" is built blind to the rules that will discard
the user's work.

### Tier 2 — blockers, two personas

**T2-1. `gate-calibration.md` is written exactly as specified, parses to nothing,
and reports itself found.** `D F-28, D1 F-11, M1 F-6, M F-19` (Dev, Marisol; both
runs each). The engine strips fenced blocks before reading; §0.3's schema puts the
values in a fence. `calibration.file: "found"` with `suppressed: []` and
`measured_at: null` reads as success. Dev proved the cause by removing the fence
and watching it parse. Marisol calls it *"the most demoralising one so far, because
§0.3 is sold as the step that earns the rest of the interview."*

**T2-2. Setup cannot complete for anyone without a second creator's archive.**
`B F-10, M F-14, M1 F-12` (Beatriz, Marisol). The documented fallback for "no
samples of your own" requires pasting another writer's posts. Marisol dug three
newsletter issues out of her email to get past it. Beatriz had nothing to dig,
so from that point every draft was generated with no voice reference of any kind —
and she was never told so on screen.

**T2-3. `nda-default` deletes every inventory item at the moment it is written.**
`D F-10, M F-11, M1 F-10` (Dev, Marisol). Two shipped files give contradictory
outcomes for the same field value; under the literal reading the interview's entire
harvest is archived on write.

**T2-4. Lock 5 grades a draft against its own `shipped.md`.** `D1 F-15, B1 F-8`
(Dev, Beatriz) — **new in run 1; neither run 2 reached shipping.** Dev proved it
causally: move `shipped.md` out of the run directory and nothing else, and
`priors 5 → 4`, `overlap False → True`.
> ```
> PRE-SHIP: gate_passes False catch 1 priors 4 overlap_pass True
> ```
> — D1 F-15. Beatriz's independent instance reports `priors_compared: 1`, a 161-word
> verbatim failure span, and `sentence_similarity ratio 0.857`.

Re-gating a shipped post — which is what a retraction, a repurpose, or a review
does — reports it as plagiarising itself. This is also the mechanism that closes
the only repair path the gate offers (T3-3).

**T2-5. On the mandatory article-plus-carousel run, the carousel overwrites the
article.** `B F-27, B F-31, M1 F-22` (Beatriz, Marisol). `article.md` forbids a
second run directory and names `runs/<slug>/draft.md` as the derivative's source;
`carousel.md`'s first write is `runs/<slug>/draft.md`. The derivative destroys the
only copy of the document it is cut from. It is not theoretical — the engine's own
reader caught it happening mid-read:
> *"Note on provenance: `draft.md` changed on disk while I was reading it — the
> long-form prose article was replaced by nine-slide carousel copy plus a caption.
> I graded what is in the file now, since that is the draft the router will ship.
> If the article was the intended target, re-run me."*
> — B F-31. **The article was never graded.** Marisol hit the same collision and
> resolved it by writing the deck to `spec.md` instead.

**T2-6. Both lines of the two-line install are dead.** `D F-2, D1 F-2, M F-2, M1 F-2`
(Dev, Marisol). `/content-engine setup` → `Unknown skill: content-engine`. README
never names `SKILL.md`, `workflows/`, or what the skill directory must contain, so
the only way in is a filename README never mentions (D F-3, D1 F-3, M1 F-2). Both
personas got in by guessing a convention a non-technical user would not know.

**T2-7. The four "measured values" the interview must record are the four the
command returns as null.** `D F-6, D1 F-8, M F-7, M1 F-5` (Dev, Marisol). The
choice is between leaving a frozen baseline empty forever and hand-writing numbers
the docs forbid hand-writing. Marisol's version is sharper: the `baseline` block
ends up holding the numbers the interviewer typed, not numbers anything measured.

**T2-8. "Paste below the fence" has more than one legal reading, and they are not
equivalent.** `D F-4, D1 F-4, M F-6, M1 F-4` (Dev, Marisol). Not a wording nit —
see T3-1, where the two legal placements produce two different calibrations from
identical samples.

**T2-9. `punctuation-density` demands a redraft for using too *few* commas.**
`D F-30, D1 F-16, B F-13, B1 F-4` (Dev, Beatriz). `direction: 'below'`, redraft
class, against a baseline that moves on its own (T3-2). Dev's mandated redraft:
*"which is, exactly, the set of people who cannot authorise the fix"* — the repair
degrades the prose, and the step 5b reader then marks the same qualities down.

**T2-10. `action: redraft` arrives with `over_cap: false`, a case the docs never
describe.** `B F-14, M F-16, M1 F-7` (Beatriz, Marisol). `SKILL.md` documents
redrafting only above the cap, so the user is told to perform a procedure whose
trigger condition is undocumented.

**T2-11. The article's mandatory outside-world fact has nowhere on disk to live.**
`B F-26, B1 F-15, M F-15, M1 F-9` (Beatriz, Marisol). The format requires a fact
the engine has no way to fetch, the only permitted source is the author's memory,
and the schema has no slot to record the answer. Beatriz flags *"a real chance of
publishing something wrong under my own name."*

**T2-12. The step 5b reader is never told the author's name, and misgendered both
women on disk.** `B1 F-6, M1 F-20` (Beatriz, Marisol). The context block the reader
receives has no `name:` or pronoun slot. It called Beatriz "he" four times in the
report she read back, and guessed wrong about Marisol too. Two of three personas,
both of them women, in the one artifact the engine hands the user to read about
their own writing.

**T2-13. The design tell's prescribed fix is inert on the builder it points at.**
`M1 F-16 (blocker), B F-23 (friction), D1 F-20 (polish)` — all three personas, but
at three different severities, so it sits here rather than Tier 1. The documented
remedy for the thumbnail warning has no effect, on a check that then fires on every
render forever.

### Tier 3 — blockers, one persona, structurally severe

Six of these nine are new in run 1, because they live downstream of shipping a post
or rendering a real file — which is exactly as far as run 2 never got.

**T3-1. Identical samples, two legal placements, two different calibrations.**
`D1 F-5` — new. Dev moved his four samples to the other legal position in
`voice.md` and re-ran: same text, different calibration. The ambiguity in T2-8 is
therefore load-bearing, not cosmetic.

**T3-2. The "frozen" baseline moves on its own.** `D1 F-14` — new. `voice.md`
promises "**Frozen at setup and never overwritten.** Drift is only detectable
against a fixed baseline." On identical sample text the baseline moved three times:
`contraction_rate` 0.45 → 0.62 → 0, `sentence_length_stdev` 4.42 → 4.11. The
variable is which *other* prose sits around the samples in the file. That number is
the threshold T2-9 then enforces against the user's drafts.

**T3-3. The redraft the gate mandates hard-fails lock 5 against the draft it came
from.** `D1 F-17` — new, and the sharpest structural finding in the run. Bound 3
says redraft once. A redraft is by construction mostly the same sentences. Lock 5's
prior window now contains the draft it came from (T2-4).
> ```
> sentence_similarity [{'slug': '2026-08-25-action-items-that-never-ship',
>                       'matched_sentences': 11, 'ratio': 0.917}]
> ```
> — D1 F-17. *"As shipped, a redraft demanded by the gate cannot pass the gate."*

**T3-4. `specifics-floor` counts digits, not specifics.** `D F-29`. Nine spelled-out
quantities in one draft reported as `"specifics": 0`, redraft class. The fix it
forces — "11 people on the call", "3 years" — is what the step 5b reader marks down
as machine-sounding.

**T3-5. `we-with-no-human` is a catch-22.** `D F-12`. It demands a named human;
every other rule forbids producing one.

**T3-6. `voice-floor` demands a redraft of a file whose sentence shape the renderer
fixes.** `D1 F-19` — new. No legal draft satisfies both.

**T3-7. The carousel PDF loses its last slide, silently, exit 0.** `B F-30`.
> ```
> $ file .../deck.pdf
> PDF document, version 1.4, 8 pages
> ```
> Nine slides in `spec.md`, nine in `deck.html`, nine `/Type /Page` objects in the
> PDF — and `/Count 8`. *"So the last slide is physically in the PDF and
> structurally unreachable."* The lost slide is the `cta` takeaway, the one slide
> the workflow writes a rule about.

**See the contradiction flagged below** — the boundary condition is not settled.

**T3-8. `gate --report` returns five fields `SKILL.md` never mentions, and
contradicts it on the one it does.** `D F-13`. Doc and engine disagree with no way
to tell which is authoritative.

**T3-9. Setup double-counts the archive.** `D F-5, D1 F-6`. Four posts pasted, the
engine reports eight — the doc's own write instruction corrupts the doc's own
measurement, and neither file warns of it. Related: the one blocking rewrite in
Dev's control fired on the template's own prose rather than anything he wrote
(D1 F-7).

**T3-10. The reader slice `reader.md` specifies excludes the report format
`reader.md` demands.** `D1 F-12` — new. The literal reading and the working reading
differ, and the doc states the literal one.

**T3-11. Zero-archive users are locked out of the resume path permanently.**
`B F-5`. Beatriz only got past it because she did sittings 0 and 1 in one go; on
resume there is no way back in.

**T3-12. The CLI's only documentation is inside the source file.** `M F-12`. Every
workflow file tells her to run the command with a flag; the flags are documented
nowhere but the code. For the persona who will not open source, this is terminal —
and it is the one finding whose severity is entirely persona-dependent.

**T3-13. §B.3 instructs a gate run over a corpus the engine says is not in the
gate.** `M F-13`.

### Tier 4 — friction and polish, compact

Forty-one defects, cited only. Grouped by where they bite.

**The map of the product is wrong.** `SKILL.md` routes to a directory that does not
exist (B F-3, B1 F-3, M F-3). `SKILL.md` says `reference/design-tells.md` "is not
built"; it is 35 KB on disk (B F-4, D F-16, M F-4 — **all three personas**). Three
files give three inventory floors (B F-9). "The Tier 0 scan" runs on every default
run and is defined nowhere (B F-16). Two files describe the first visual run's brand
step as two different products (B F-17). Three files name three different output
files for one carousel (B F-28). `reader.md` is stale about its template and about
which `audience.md` fields shipped (D F-18, M1 F-21). The README spends its install
block apologising (B F-2). The interview persona file numbers the sittings
differently than the workflow does (M F-5).

**The interview.** The "homework lookup" has no mechanism named anywhere, and when
it ran it returned a real, different hospital with no guidance on what to do about
that (B F-8, M1 F-3). The negative control's only alternative for someone who would
rather talk is a voice memo the product cannot accept (B F-6). `contraction_rate:
2.84` — of what (M F-9). The brief demands `thesis_id:` two sittings before
`thesis.md` exists (M1 F-11). `rotation_healthy: false` arrives with no number, and
`setup.md` forbids supplying it (D F-19). §0.3's "show them this" block is a worked
example carrying real rule names, presented as the thing to print (D F-9, D1 F-9).
"Omit a key the command did not return" versus a key returned as null (D F-8,
D1 F-10). The interview captures 17 items in the user's exact words and the voice
system is forbidden from reading any of them (B F-11).

**The gate.** `no-long-sentence` fires when there is no long sentence (D F-14).
`paragraph_lines` counts newlines, so `uniform-paragraphs` cannot fire on any normal
draft (M F-18, M1 F-8). `short-post.md` says the gate catches something the gate is
explicitly built not to catch (D F-15). The gate's own drafting rule creates the
craft defect the reader then marks down (B F-18). The mandated redraft traded one
redraft-class tell for another on a file whose shape cannot change (D F-24).
`zero-contractions` pushed contractions into all three later formats with the
override field reading `null` (B1 F-10). A dangling `connects_to:` thesis id passes
silently (M F-21). `type: gap` rows — records of things the user could not answer —
are offered as post anchors and counted as runway (M F-20). The job-reuse rule reads
absolutely and was broken twice without complaint (M1 F-23).

**The reader.** It graded a first-ever draft `L4`, "a model of the author's own best
work", on a two-line context block (D F-20). `minutes_to_ship` is specified as wall
clock and nothing in the run captures a start time (D F-21). It passed an article
clean and then counted ten instances of a tell the gate has a rule for (B F-34).

**The visual paths.** The infographic workflow's first step is "go read a 117 KB
spec" (D F-17, D1 F-13). Render warnings are written for the person who built the
renderer (B F-20). The renderer will happily ship the template look and the rule
against it is prose with nothing behind it (B F-21) — *"I would have posted a
stranger's blue."* `scale: dense` does not fix the empty half of the canvas
(B F-22). `--check` warns at 7-8 words for a rule the doc sets at 8, nine times on
the shape its own shipped example uses (B F-32, B1 F-13, D1 F-22). The text-only
design gate cannot see what the image actually did (M1 F-18). Two design tells
cannot be satisfied inside the budgets the same spec imposes (M1 F-17). The same
quotation is a warning and a hard failure in one report (M1 F-19).
`workflows/carousel.md` gives `draft.md` no schema and then step 5 gates whatever
you invented (B1 F-12). The carousel escapes the visual-gate defect entirely, for a
reason no doc states as a reason — it writes prose to `draft.md` and derives
`spec.md`, while the infographic path puts the spec in `draft.md` (D1 F-21).

**The ledger.** The article cap's count is not returned by the command
`article.md` says returns it (D F-26, D1 F-23). Nothing in the run ever printed the
runway or staleness lines to the user (B F-33).

**One thing that worked, recorded because it is the reason a persona would stay.**
*"The gate's best catch was real, and I want to say so"* — M F-17, filed by Marisol
as explicitly not a finding.

---

## A contradiction between reports, unresolved

**Does the carousel renderer always drop the last slide?** The three reports
disagree, and no single report could see it.

- **B F-30**: nine slides in, `PDF document, version 1.4, 8 pages` out. Nine
  `/Type /Page` objects present, page tree declares `/Count 8`. Exit 0, no warning.
- **B1 A-carousel**: seven slides in, seven pages out, clean. Her own report says so
  explicitly: *"Run 2's F-30 ... did not reproduce here. Run 2 had a nine-slide deck;
  run 1 had seven."* — and correctly flags that it does not know where the boundary
  is.
- **D1 A-carousel**: eight slides in, and **the same file reports two different page
  counts to two different measurements**:
  ```
  .../deck.pdf: PDF document, version 1.4, 8 pages
  pages: 9
  ```

That last pair is the `/Count` mismatch signature from B F-30 appearing on Dev's
deck, and **neither report recognised it**, because each was scoped to one persona.
So the "nine slides" theory is not established: what is established is that the
renderer can emit a PDF whose declared page count disagrees with its physical page
objects, and that at least one deck lost a slide a human would have posted without
noticing. Do not close this as a nine-slide boundary condition. Counting pages in
`deck.pdf` against slides in `spec.md` is a two-line check and belongs in the
renderer.

---

## Newly reachable defects

Nine defects exist in this synthesis only because run 1 got further than run 2. Run
2 died after the short post (Marisol) or before the artifact stages (Dev), so
everything downstream of *shipping* a post, *rendering* a real file, or *reaching*
the article was structurally invisible to the earlier synthesis:

1. Lock 5 grading a draft against its own `shipped.md` (T2-4) — requires having shipped
2. The mandated redraft hard-failing lock 5 (T3-3) — requires the above
3. The "frozen" baseline moving on identical samples (T3-2)
4. Identical samples, two placements, two calibrations (T3-1)
5. `rhetorical-fragment` matching the literal `items:`, confirmed against three shipped example specs (T1-2's mechanism)
6. `voice-floor` versus the archetype shape (T3-6)
7. The reader slice excluding the report format `reader.md` demands (T3-10)
8. The carousel's asymmetric escape from the visual gate (Tier 4)
9. The PDF page-count contradiction above

The pattern is worth naming: **the engine's worst defects are downstream of the
first successful run.** A test that stops at the first artifact cannot find them,
and the original dogfood prompt predicted the opposite — it bet the worst findings
would be in the interview. The interview findings are numerous and cheap. The
expensive ones are at ship time.

---

## (a) Every place a persona had to leave the docs

The run contract made this a blocker by definition: *"a doc that needs its own
source read is broken."* Six instances across all three personas.

1. **Marisol, M1 F-1** — `README.md`, after the install failed: *"yes — there was nowhere else in README.md to go."*
2. **Marisol, M1 F-2** — guessed that the folder she was handed *is* the skill and that `SKILL.md` at its root is the body. Right guess, still a guess: *"it is the kind a non-technical user does not make."*
3. **Marisol, M F-12** — opened `reference/engine.js` because the CLI's flags are documented nowhere else. For the persona defined by not reading source, this is the run's most persona-specific blocker.
4. **Dev, D1 F-3** — same entry problem as Marisol, logged as a blocker per his instruction to treat every source read as one.
5. **Beatriz, B1 F-11** — listed `render/infographic/examples/`, which no doc she had been given named, to prove the `items:` failure was systemic. Her report logs this on her behalf: *"The transcript shows her doing it; she died before she could log it, so I am logging it here."*
6. **Dev, D F-16 / D1** — checked `reference/design-tells.md` because `SKILL.md` said it was not built. He continued, but *"the router told me to stop on a false premise."*

Every one of the six traces to the same root: **README names no second step.** It
never mentions `SKILL.md`, `workflows/`, or what the skill directory must contain,
so the first failure has no documented recovery and the only way forward is
convention-knowledge.

---

## (b) What the cold start did to Beatriz

**The engine handled her empty archive correctly on disk and never once told her on
screen.** Every artifact she produced was generated with no voice reference of any
kind, and the only way she could have known was by opening a run directory.

**What it got right, and this deserves saying first.** `workflows/setup.md` 0.2 has
a real, well-written branch for her: *"**If they have no writing samples at all,**
say so in `voice.md` explicitly, skip 0.3, and go to 0.4. **Do not refuse to
draft.**"* The negative control behaved impeccably — `"corpus": "empty, no pasted
sample on file"`, `"samples": 0`, every baseline `null`, and a note reading *"rule
2: an absent gate-calibration.md means every rule fires. It is not a clean pass, and
it is not a suppression of anything."* Her verdict: *"That is honest engineering. No
number was invented anywhere."*

**Then three mechanisms stack up to guarantee she is never told.** (B F-12)

1. `voice.md` puts the warning in "the gate report". `SKILL.md` says *"**The run prints one line, not the file**."* So the warning lives in `runs/<slug>/gate-report.md`, which she has no reason to open.
2. Her second draft passed clean — `"gate_passes": true, "gate_catch_count": 0, "flagged": 0` — and `SKILL.md`'s rule is *"A run that passed clean and flagged nothing **prints no gate line at all**."* **The cleaner the draft, the less likely she is to learn the voice was guessed.**
3. Setup's closing script is unconditional: *"You have one post ready to ship and **the gate is tuned to your writing.**"* No branch for the no-samples path. For her, both halves are false.

**The fallback is empty for the same reason the archive is.** With no samples, the
engine degrades to `inspiration.md` — which requires pasting three to five posts
from LinkedIn creators she enjoys, and *"Never write a creator's mechanics from
memory."*
> *"**I have never posted on LinkedIn because I do not read LinkedIn.** That is the
> same fact. So the fallback for my missing archive is empty for the identical
> reason the archive is. No file anywhere has a branch for both being empty."*
> — B F-10

**And with no baseline, the gate rewrote her toward a generic voice.**
> ```
> "baseline_source": "none, absolute floors applied",
> { "rule": "zero-contractions", "action": "redraft", "detail": "no contraction in 202 words",
>   "override_available": "voice.md records null" },
> { "rule": "punctuation-density", "draft": 1.49, "baseline": null, "limit": 2, "direction": "below",
>   "source": "absolute fallback, gate-calibration.md carries no baseline for this metric" }
> ```
> — B, cold start section. A system that admits it has no idea how she writes pushed
> her prose toward more contractions and more punctuation, then reported a clean
> pass. `voice.md`'s own second paragraph names this exact risk: *"without it the
> gate rewrites their own voice on day one."*

**The single largest missed opportunity.** The interview captured 17 items in her
exact words — and the voice system is forbidden from reading any of them (B F-11).
She has no archive, but by the end of setup the engine holds several hundred words
of her actual phrasing and is structurally barred from using it as a voice
reference. She calls this *"the single biggest thing wrong with the cold start"*,
and it is the one cold-start defect that is a design decision rather than a bug.

**On resume, she is locked out permanently** (B F-5). She only got through because
she did sittings 0 and 1 in one go.

**Net read.** The mentor scenario — hand this to someone who has never written
publicly — works mechanically and fails on disclosure. She would have shipped a post
believing the voice was matched. Nothing on screen would have told her otherwise.

---

## (c) Any artifact none of them would publish

**This section covers two personas out of three.** Dev produced no artifact verdicts
in either run — his run 2 died before the artifact section and his run 1 died
mid-article draft, so all sixteen of his judgment lines read `not uttered — died
before this stage`. His opinion is not extrapolated from his findings here. Eight
verdicts exist, from Beatriz (B) and Marisol (M1).

**The split is clean and it is the same split for both personas: they would publish
the words and would not publish the pictures.**

| Format | Beatriz | Marisol |
|---|---|---|
| Short post | **Yes** — "the one I would post" | **Yes**, with one edit to the last line |
| Article | **Yes**, after cutting one paragraph | **Yes**, "and this surprised me most" |
| Infographic | **No. Not this render.** | **Not as rendered.** Yes if someone fixed the headline |
| Carousel | **No, because I cannot** — the file is missing a slide | **Cannot say honestly without seeing it** |

**Both visual formats fail for both personas, for different reasons.** Beatriz's
infographic: *"a third of the canvas is empty."* Marisol's: the worst thing is not a
line of copy but the headline as rendered, plus a footer that renders wrong. Beatriz's
carousel is unpublishable because of T3-7 — the file physically lacks the takeaway
slide. Marisol could not judge her carousel at all, because the design gate is
text-only and cannot see the image (M1 F-18).

**Both text formats pass for both personas, and one of them was a surprise.**
Marisol on the article: *"Yes, and this surprised me most"* — from the persona who
says *"that is why I have never published a long piece."* The engine wrote a
long-form piece a 14-year operations director would put her name on.

**The honest summary: the drafting is the strongest part of this product and the
rendering is the weakest.** Nobody in three personas said the engine writes badly.
Two of two personas who reached the visual formats refused to publish either one.
Time-to-artifact supports the same reading — 18 and 8 minutes to a postable short
post, 31 and 25 to a postable article, and *"never"* for both visual formats on the
renders they got.

---

## Cheapest high-value fixes

My judgment, not the personas'. Split by whether a decision is needed.

### One-line or one-rule fixes, no design decision required

1. **`cd` into the README install line, or name the parent directory.** Kills T1-1, the only defect with a six-of-six sweep. One line.
2. **Protect the renderers' field keys from the lexical gate.** `items:`, `title:`, and the other required keys go on the protected list — the gate already has a `"protected": false` field per hit, so the mechanism exists. Unblocks every visual run forever (T1-2). This is the highest value-per-character fix in the list.
3. **Correct the four field names in `content-engine-VISUALS.md` §3.5** to match the renderer, or delete the precedence claim that makes the wrong file authoritative (T1-3).
4. **Mark the cap in the README command list** — *"(unlocks after 8 short posts)"*. Beatriz identified this fix herself; it converts a blocker into a known constraint (T1-4).
5. **Exclude the run's own `shipped.md` from lock 5's prior window.** One path filter. Kills T2-4 and unblocks T3-3, the two-defect chain that makes shipping and redrafting mutually exclusive.
6. **Count pages in `deck.pdf` against slides in `spec.md` and fail loudly on mismatch.** Two lines, and it converts a silent wrong artifact into an error (T3-7).
7. **Rename the derivative's output file** to anything that is not `draft.md` (T2-5). `article.md` forbids a second directory, so the filename is the whole fix.
8. **Unfence the `gate-calibration.md` schema in §0.3**, or make the parser read inside fences. The engine already warns about this exact trap one file over in `voice.md` (T2-1).
9. **Give the step 5b reader context block a `name:` and pronoun field.** The reader misgendered two of three personas on disk (T2-12).
10. **Fix `SKILL.md`'s two false statements about its own files** — the directory that does not exist and `design-tells.md` "is not built" (Tier 4, all three personas). Pure maintenance, and it is what made every persona stop trusting the docs.
11. **Rename `specifics-floor` or make it count words as well as digits** (T3-4). As shipped it forces prose the reader then penalises.
12. **Make `--check`'s word threshold match the documented one** (Tier 4).

### Needs a design decision

13. **Admit `also_flagged` into the calibration, or stop calling an empty result "the good outcome."** The premise "a redraft edits no word the person wrote" is backwards and it is load-bearing across T1-6, and the fix is a philosophy call about what calibration means.
14. **Decide whether the interview's captured words are a voice corpus.** B F-11 is the cold start's biggest defect and it is a deliberate design boundary. Several hundred words of the user's real phrasing sit unused.
15. **Print the degradation.** A no-baseline run must say so on screen, and the current rule — clean runs print nothing — guarantees the opposite. This needs a decision about what the one printed line is for (cold start, mechanism 2).
16. **Reconcile `punctuation-density` and `voice-floor` with the shapes the engine itself produces**, or demote them from redraft class (T2-9, T3-6). A redraft-class rule that fires on correct prose is the most expensive false positive in the system.
17. **Decide what happens when both `voice.md` and `inspiration.md` are empty** (T2-2, B F-10). No file has a branch for it, and it is the mentor scenario.
18. **Give the cap a documented override.** Three personas invented three dishonest workarounds; two of them wrote fiction into their own ledgers, which `SKILL.md` section 4 explicitly forbids (T1-4).

### The single cheapest thing that would have changed the most

Fix 2 — protecting the renderers' field keys. One list, and it converts both visual
paths from "cannot pass the gate, ever, ship on the escape hatch" to normal
operation, for all three personas.

---

## What this run did not test

**Repeat use, entirely.** Every persona was a first-timer. Untested: staleness,
`learnings.md` accumulation, the second-post experience, rotation across a real
inventory, the runway and staleness lines nobody ever saw print (B F-33), and drift
detection — which is the whole stated purpose of the frozen baseline that T3-2 shows
moving on its own.

**The interview as a conversation.** In both run-1 reports, sittings A and B were
written to disk in batched file writes rather than conducted turn by turn. The
interview's *content* was exercised three times at three archive depths, which is
where many findings came from; its *pacing, ordering, and recovery from a bad answer*
were not.

**The article end to end.** No persona shipped one. Beatriz's was graded (as the
carousel, by accident — B F-31), Marisol's was drafted and read, Dev's died mid-draft.
The article's own reader grade, its ship path, and its paired carousel past the
overwrite point are all unobserved.

**Anything past the first blocker on the visual design gate.** It is text-only and
cannot see the rendered image (M1 F-18), so every design verdict in this run is a
verdict on HTML, not on a picture — except where a persona rasterized and looked,
which two did.

### Harness artifacts — not engine defects, do not launder these into findings

Both run-1 reports flag these as caveats and they are repeated here so the
distinction survives:

- **Worktrees were destroyed mid-run** by the test harness, twice, taking the
  personas' profiles with them. Both agents rebuilt from what they had recorded and
  said so. Any finding whose evidence is a missing profile directory is this, not
  the engine.
- **Spend limits and a sleeping machine** killed the run repeatedly. This is why
  there are two runs per persona, why two reports had to be reconstructed from
  transcripts, and why Dev has no artifact verdicts.
- **Three Bash "too complex to verify" refusals** in Beatriz's run shaped how she
  wrote files. Not an engine behaviour.
- **Both run-1 reports are reconstructions**, written from transcripts after the
  fact. Their evidence is quoted from what the agent actually saw and sample quotes
  were verified against the transcripts, but the persona voice in them is
  reconstructed and their subjective verdicts are absent by design.
