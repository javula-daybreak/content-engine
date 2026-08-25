# Content Engine: the correction

**Written 2026-08-19. Status as of 2026-08-23: all five sections approved by Joseph.** Sections 1 and 2 were approved on 2026-08-19; sections 3, 4 and 5 are approved as of today, and the reader, the onboarding inversion and the formats are all being built now. **Decision 4 below is overturned as of today**, and section 2's retirement rule with it.

This file is the working plan for correcting the build toward the goal. It supersedes
`content-engine-PRD.md`'s §13 build order where the two disagree, and Phase 0.5 folds
it back into the PRD so they stop disagreeing. The evidence behind it is the course
correction review at https://claude.ai/code/artifact/b60ad9f4-a786-4c0d-b868-6ecbf1cf4f4d

---

## The goal, as five testable commitments

Joseph's words: *"have a content engine that writes short posts, articles, makes
infographics and carousels. All phenomenal quality. Without seeming like AI made it.
The system should be easy to use, and I should be able to hand it to anyone who wants
to use and adopt it with a 1-2 line explanation."*

| | Commitment | Grade at review |
| :- | :- | :- |
| G1 | Four formats: short post, article, infographic, carousel | D |
| G2 | Phenomenal quality | C- |
| G3 | Does not read as AI | C |
| G4 | Easy to use | C |
| G5 | Handable to anyone with a 1-2 line explanation | D |

**A change that conforms to the PRD and misses one of these has missed.** The goal
outranks the spec. That precedence is the reason this file exists.

---

## Four decisions, locked 2026-08-19

1. **Scope.** All nine correction steps, with a checkpoint after Phase 3.
2. **Gate mechanism.** Detector plus redrafter. Not a rewriter. §9 bound 3 becomes bound 1.
3. **Articles.** Kept as a format, reframed as newsletter editions with a mandatory
   carousel derivative, capped at one per 8 to 10 short posts, never measured in
   article impressions.
4. **Profile.** The real setup interview with Joseph. Not a bootstrap from
   `tim-writing-os`. This makes his corpus the instrument that retires gate rules.

   **Overturned 2026-08-23, in its second half only.** The superseded text is the
   sentence above, kept because the reasoning that produced it is the reason the
   negative control exists at all, and that part was right: a prediction made from
   somebody else's corpus is persuasive enough to act on and is not evidence about
   this person, so only a negative control over his own samples can say whether a
   rule over-fires on him. What was wrong is what the decision did with that
   verdict. **Retiring a rule means striking it in `reference/ai-tells.md`, and that
   file ships to every person who installs the engine.** Striking a rule there
   because it over-fires on one person's punctuation hardcodes that person's habits
   into every future install: the mentor at IBM clones the repo in November and
   inherits a gate with a hole in it, no evidence in front of her, and no way to
   know the hole is about somebody else. It is a portability defect wearing the
   costume of a calibration step, and it fails **G5**, handable to anyone, which the
   review graded D. It also blocked the build behind one person, which is the
   cheaper of its two problems.

   **The replacement: rules are never retired, they are suppressed per profile.**
   `ai-tells.md` ships identical to everyone with every rule on. Each person's
   setup runs the negative control over their own pasted samples and writes
   `profiles/<handle>/gate-calibration.md`, recording every rule that rewrote a
   word they wrote, its fire count, and the sample that fired it. The gate reads
   that file on every run. Absent file means nothing is suppressed and every rule
   fires; a suppression is reported and never silent; a `reject`-class rule,
   meaning clearance and private terms, is never suppressible by anyone. PRD §9's
   suppression rule is the spec and it replaces §9's retirement rule. What follows
   from it: **his profile is no longer a dependency of building anything**, the
   first half of this decision stands untouched, and the engine is built and
   packaged before it is pointed at a person.

## Two calls, approved 2026-08-19

1. **Vendor the renderers as Python. Delete `package.json`, `package-lock.json`, and
   Playwright from §1.2's ships list.** PRD §13.1 forbids two runtimes on portability
   grounds. That argument inverts on the numbers: the plan of record requires
   `npm install` to pull Playwright, which is a user-installed dependency and exactly
   what §1.3 promises never to require. The existing renderers are stdlib Python plus
   headless Chrome, which installs nothing. **The rule is not "one runtime." It is
   "no user-installed dependency."** Vendoring Python satisfies §1.3 more completely
   than the current plan does, and it deletes the largest single build in the MVP.
2. **Port `grade-dis-jawn` as `reference/reader.md`,** with its context block generated
   at setup from `audience.md`, `thesis.md`, and `identity.md`. It grades and returns.
   It never rewrites, which keeps it on the correct side of finding 01.

---

## Section 1: the build order (APPROVED)

**Organizing principle: nothing gates a format that already works.**

The old principle was "prove the cheap format before building the expensive one." That
was correct when all four formats were unbuilt. Three of four now run on this laptop,
so the principle is false and it is costing G1. Step 8's ten-post gate stops gating the
visual system and becomes what it actually is: the calibration of the rewrite cap and
the voice-floor thresholds.

| Phase | What | Owner | Est | Needs his corpus |
| :- | :- | :- | :- | :- |
| 0 | Instruments: fence comment, `format` de-hardcoded, `overlap` wired in | subagent | done 08-19 | no |
| 0.5 | PRD structural rewrite, so the spec leads the work rather than trailing it | subagent | done 08-19 | no |
| 2a | The suppression layer: setup runs the negative control and writes `profiles/<handle>/gate-calibration.md`, the gate reads it every run, `--report` and `--fixtures` name what it suppressed | subagent | done 08-24 | no |
| 2b | Invert the mechanism: `action:` on `TELLS`, the cap's new job, the single redraft, the better-of-two comparator | subagent | done 08-24 | no |
| 2c | All three of §9's new checks: burstiness, nominalisation, punctuation density | subagent | done 08-24 | no |
| 3 | `reference/reader.md`, the grader | subagent | done 08-23 | no |
| (pause) | **Checkpoint: Joseph reviews** | Joseph | | |
| 5 | Vendor both renderers; write `workflows/{infographic,carousel,article}.md` | subagent | done 08-20 | no |
| 1a | Paste front door: three to five unedited samples into `voice.md` and `shipped-history.md`, the four measurements frozen off them, `gate-calibration.md` written from them | **Joseph** | ~10m | it **is** the corpus |
| 1b | The real interview, session one | **Joseph** | 30-45m | no |
| 4 | Deep interview, chunked into 30-45m sessions each ending in a visible improvement, continuing 1b | **Joseph** | async | no |
| 6 | PRD evidence pass: the measured thresholds, and Joseph's calibration recorded as the first one | subagent | ~1h | no |

**Status, 2026-08-24.** Every subagent row above is built and its tests are green:
`engine.js` carries 253 assertions, the two renderers 92 tests between them. Also
built and not in this table, because they are PRD step numbers rather than
correction phases: `workflows/review.md` and `workflows/connect.md`, which closed
the three advertised commands that routed to missing files, and
`reference/design-tells.md` plus the eleven unbuilt infographic signatures, which
are the one thing still in flight. **What is left of the engine is the visual
catalog**, not the writing path.

**Re-cut 2026-08-23. The engine is built and packaged first, and the interview is the
last step.** Anything personal, his corpus, his posts, his profile, comes after the
engine ships rather than as a dependency of building it. Two rows are gone from the
build because they existed only to consume his corpus. **Phase 1.3, the one run of
`gate --negative profiles/joseph`, and Phase 2a, retiring what over-fired on him, stop
being build phases and become features of setup**: one shipped capability, built once at
the new 2a, run at every install's own 1a and again at every re-measure. Phase 2d merges
into 2c, because punctuation density was held behind the retirement and there is no
retirement left to wait for. Every Joseph row moved below Phase 5. The serial chain this
table was organised around, 1a to 1.3 to 2a to 2d, does not exist any more, and the
right-hand column now reads `no` on every row that is code.

**2a keeps its id and changes its content, deliberately.** It was the retirement pass
and it is the suppression layer. `reference/reader.md` already cites *"correction Phase
2a"* as the phase that makes the em-dash ban per-profile suppressible, so that citation
resolves correctly against this table and a fresh id would have broken it, and no
retirement work survives for a later reader to confuse it with.

**Three cuts, and the history is the point.** A table re-cut three times with no visible
history is how a plan loses its authority, so all three reasons stay readable. **The
first cut, 2026-08-19**, replaced the PRD's sixteen steps with these phases, because the
old principle held three working formats behind a count of ten shipped posts while G1
graded D. **The second cut, 2026-08-20**, split Phase 1 into 1a and 1b and Phase 2 into
2a through 2d. Its reason was in the code and it is still correct: `gateNegative` opens
two files, `voice.md` and `shipped-history.md` (`reference/engine.js:1067-1071`), and
nothing else, not `identity.md`, not `thesis.md`, not `audience.md`, not `inventory.md`,
not `learnings.md`, every one of which is an interview output. So the paste gated the
negative control and the interview did not, which narrowed a 45-minute conversation to a
ten-minute paste and stopped the old row charging the interview's clock to a dependency
the interview was not in. **The third cut, today**, is the one both earlier cuts walked
past. They argued about how *wide* the dependency on Joseph reached; neither asked what
it fed, which was a strikethrough in a file that ships to every install. The artifact was
wrong, so the dependency was never a scheduling problem and no amount of narrowing was
going to fix it. What survives all three cuts: neither half of Phase 1 can be delegated,
because both are Joseph talking.

**What is left of the build, and what it waits on.** 2a, 2b, 2c, 3 and 5 are the whole
of it, and every one of them is code against a spec that already exists. 2a reads a
profile file that may be absent and must behave correctly when it is, which is testable
against `_template` and a fixture profile with a planted em dash. 2b is restructuring of
`TELLS` and the cap and touches no profile. 2c's three checks carry absolute fallbacks
for a profile with no baseline, which `statsText` already implements for the voice floor
(`reference/engine.js:873-881`), so all three are testable against `gate-fixtures/`
before a sample is pasted. 3 and 5 never needed a corpus. **Nothing in the table blocks
anything else in it.** 1a, 1b and 4 are the first real run of a finished engine, and
Phase 6 is the only row downstream of them, because a measured threshold needs somebody's
measurements.

Superseded by the paragraphs above, and readable here because the 08-20 reading is what
the 08-23 cut supersedes rather than contradicts: *"Phases 4 and 5 run in parallel.
Inventory depth gates draft quality, not format support. **Revised 2026-08-20:** 1b, 2b,
2c, 3 and 5 all run in parallel with each other too, which is what the split is for. The
only serial chain left is 1a, 1.3, 2a, 2d."* Phase 4 now runs after Phase 5 rather than
alongside it, which is the same sentence read the other way round: draft quality is what
you improve on a finished engine, not something you build one around. Section 2's two
`Phase 2` headings are relabelled 2b and 2c to match this table.

### Deleted from the PRD build order
- Step 10, the render pipeline. Vendored instead.
- Step 16, articles. Moves into Phase 5.
- `package.json` and `package-lock.json` from §1.2. Playwright entirely.

### Must not change
`engine.js`'s 214 assertions (Phase 0 adds, never deletes), all five locks, the
inventory schema, `clearance:`, `reference/hooks.md`, `reference/interview.md`'s
philosophy and homework, the append-only rule, and §1.3's write constraint.

---

## Section 2: the gate (APPROVED)

### Two corrections to the review's account, both verified in code

1. **The fence bug is a contradiction between two readers of one file.**
   `voiceMeasures` (engine.js:400) deliberately reads `voice.md` fence-and-all, because
   the four frozen measurements live inside a fence. `voiceSamples` (engine.js:389) goes
   through `pastedBlocks` (engine.js:364), which calls `stripFences` at line 367 and
   strips them. The comment at engine.js:307 claims *"voice.md is the exception and is
   read fence-and-all"* — true of one reader, false of the other. Two-line fix in one
   function, not a parser rewrite.
2. **`engine.js` never rewrote anything.** It is already a pure detector returning
   `action: 'rewrite' | 'redraft' | 'reject' | 'flag' | 'none'` and it edits no file.
   The rewriting lives in `SKILL.md` §2 step 5, in prose. So inverting the mechanism is
   mostly a re-labelling of which rules carry which action, plus one table column.

### Phase 0, the three instrument fixes

| # | Site | Fix |
| :- | :- | :- |
| 0a | `stripFences` comment, engine.js:306 | **Respecified 2026-08-19, and the row above it in this file was wrong.** There is no functional fence bug. `voiceSamples` strips fences correctly, because the Samples schema example lives in a fence and must not count as a real sample, and `selfTest` already locked that. `voiceMeasures` reads fence-and-all correctly, because the four frozen measurements are typed inside a fence. The asymmetry is intentional. The defect was the comment sitting on `stripFences`, which described an exception none of its callers implement. Fix: correct the comment, add assertions pinning the split in both directions, and tell the `voice.md` template to paste **below** the fence. A `keepFences` option would have made the blank template count as a real writing sample and poisoned the negative control. Separately verified: `gate --negative` **already** fails loudly on an empty corpus. Nothing to do there. |
| 0b | `gateReport`, engine.js:1191 and 1232 | `format` becomes a parameter (`short` \| `long`), not the hardcoded literal `'short'`. The semicolon rule and the length rules scope off it. |
| 0c | `gateReport`, engine.js:1188 | Wire `overlap` in. It is §3's only hard fail and today it has no invocation site: `SKILL.md:120` defers it to step 5, the engine comment defers it to step 6, and `SKILL.md`'s step 6 is the design gate, visual runs only. Fix `SKILL.md:120` in the same pass. |

Each fix ships with its own assertion. Phase 0 raises the count above 214.

**Phase 0 done 2026-08-19.** 214 assertions to 247, none deleted, `engine.js test`
green. Two things worth carrying forward:

- **Lock 5 is counted nowhere but its own block.** `gate_catch_count` and `tags`
  are defined over the tell table by §13.2 step 5, and verbatim overlap is a lock
  with no tell id. Inventing one would trip `gate --tells` drift. So a draft whose
  only failure is overlap reports `gate_passes: false` with `gate_catch_count: 0`.
  `SKILL.md`'s run line was keyed off the count and would have printed nothing on
  §3's only hard fail. It now keys off `gate_passes` and appends a lock 5 clause.
  Anything else reading the gate report has to key off `gate_passes` too.
- **`format` fails safe.** Only the literal `'long'` opts out. Absent or misspelled
  lands on `'short'`, the stricter scope, so a typo cannot silently disable the
  semicolon rule.

### Phase 2b, the mechanism

Give `TELLS` (engine.js:98-129) an `action:` column. Three classes:

**Repair** — mechanical, cannot restructure a sentence. Hashtag stack, emoji bullets,
Title Case header, en-dash, and single-word substitution from `banned-lexicon`'s
documented table (`delve` to `look at`). Bounded by protected spans. Capped as today.

**Redraft** — anything that would restructure prose. Antithesis, unearned rule of three,
parallel bullets, rhetorical fragment, restating close, engagement-bait close, thinking
opener, uniform paragraphs, not-only-but-also, hedged opener, the whole announcement
family, contraction extremes, specifics floor, voice floor, and every new check below.
**One** redraft from `brief.md` with the tripped tell ids injected as drafting
constraints. No span patching, ever.

**Reject** — clearance, private-terms. Unchanged.

**Why that line.** Berkeley's *Voice Under Revision* (arXiv:2604.22142) measured drift
at the sentence and structure level across 300 narratives and three frontier models:
contractions down, first person down, word length up, punctuation elaboration up, and
"voice-preserving prompts reduce the magnitude of the changes but do not eliminate their
direction." Swapping one word for its documented substitute restructures nothing.
Rewriting *"it's not X, it's Y"* does. On 30 July 2026 LinkedIn withdrew its own AI
rewrite feature and shipped a proofreader that does not alter voice.

**The cap changes job.** It bounded a rewrite budget. It now bounds repairs, and redraft
happens once. If the redraft still trips, both drafts are re-measured and **the better
one ships** with an `unresolved:` line. Comparator: fewer catches wins, ties broken by
voice-floor distance. Still no run ends without an artifact.

### Phase 2c, the new checks

Engine-owned, deterministic counts, floored against the person's setup baseline with
absolute fallbacks where no baseline exists:

- **Burstiness.** Sentence-length coefficient of variation. Human benchmarks 0.60-1.00;
  AI text 0.15-0.30. `stats` already returns stdev and mean, so this is one division.
- **Punctuation density.** Commas, semicolons, parens, dashes per 100 words. This is the
  strongest 2026 tell, and today's gate actively enforces it by banning two of the four.
- **Nominalisation rate.** `-tion/-ment/-ness/-ity/-ance/-ence` per 100 words.

**Two things Phase 2 has to resolve and nothing currently says how.**

1. **Punctuation density contradicts two live bans, and it is unblocked anyway.
   Resolved 2026-08-23.** This item read: *"The density check counts commas, semicolons,
   parens and dashes. §9 bans em dashes at zero tolerance and semicolons in short posts,
   which is two of the four inputs. A density floor and a zero-tolerance ban on its own
   inputs cannot both bind. The order matters: the negative control runs at Phase 1.3 and
   the retirement follows it at Phase 2a, and the density check is only meaningful over
   whatever survives that. Do not ship the check before the retirement pass. That is why
   it is row 2d and not part of 2c."* The contradiction is real and the schedule it
   implied is void, because there is no global retirement for the check to be meaningful
   over. Under per-profile suppression the floor works the way every other distribution
   check in §9 already works: it counts against the person's own baseline. Where a ban is
   suppressed for that person the mark is theirs to use and it counts toward their
   density; where a ban is live for them the check floors on the marks they actually use,
   which is the same absolute-fallback logic burstiness and nominalisation carry. Nothing
   about it waits on a corpus that does not exist yet, so 2d merges into 2c and all three
   checks are specified and built together.
2. **`bound 3 becomes bound 1` is withdrawn.** Reordered in emphasis only. The four bounds
   keep their numbers. Renumbering does not break the nineteen citations in `SKILL.md`,
   `reference/ai-tells.md` and `reference/engine.js`; it makes them resolve *silently
   wrong*, because old bound 2 becomes new bound 3 and every stale reference still finds a
   rule, just not its rule. The repo already states this principle as law in §8's
   `hook_id:` contract. The mechanism change is untouched: the cap still changes job, the
   repair/redraft/reject split still stands. Only the numbering reverts.

**Register inflation goes to the model, not the engine.** It is a judgment, and §9's
honesty rule is that zero tolerance is a promise only the deterministic half can keep.

### The suppression rule

**Replaced 2026-08-23.** This section was the retirement rule and it read: *"Nothing is
retired until `gate --negative profiles/joseph` has run on real samples. Em dash and
semicolon are the strong prediction, not the authority. The negative control is. §13.2
step 4 already sets the bar: zero rewrites on the person's own writing. Retirement
follows §9's maintenance path, struck through in `ai-tells.md` with the date and the
reason, so it stops firing and stays visible."*

Three of its five sentences survive verbatim and are why the negative control exists at
all: the prediction is not the authority, the negative control is, and the bar is zero
rewrites on the person's own writing. The first sentence and the last one are the defect,
and decision 4 above holds the argument. `ai-tells.md` ships to every install, so a
strikethrough there is a global edit made on one writer's punctuation, and the
precondition in the first sentence was guarding the wrong thing: it made sure the edit
was evidenced, never that the edit belonged in a shared file.

**Rules are never retired for over-firing. They are suppressed per profile.**
`ai-tells.md` ships identical to everyone with every rule on. Setup runs the negative
control over the person's own pasted samples and writes
`profiles/<handle>/gate-calibration.md`, which records every rule that rewrote a word
they wrote, its fire count, and the sample that fired it. The gate reads it on every run.
The contract, in five lines:

1. **Evidence or nothing.** A `fired:` count above zero on that person's corpus, with the
   sample named. No hand-editing: a suppression somebody typed is indistinguishable in
   the file from one a measurement earned.
2. **Absence means everything fires.** No file, or no entry, means the rule is live. A
   missing calibration is never a clean pass.
3. **Reported, never silent.** `gate --report` names what this profile suppresses, and
   `--fixtures` states any suppression in force when it reports recall, because recall
   measured over a suppressed rule is a number the engine did not earn.
4. **Repair class only.** A `reject`, meaning clearance and private terms, is never
   suppressible by anyone. A `redraft` or a `flag` edits no word the person wrote, so it
   has nothing to suppress.
5. **`ai-tells.md` and the tell table stay in lockstep.** `gate --tells` drift is
   unaffected, because neither file changes per person. Suppression is a third file the
   gate consults.

PRD §9's suppression rule is the spec and this section is the record of the reversal.
The zero-rewrites bar moves with it: it is not a build acceptance test on one man's
corpus, it is the invariant every setup establishes for the person it just interviewed,
at every install, and PRD §13.2 step 4 is reworded to say so.

**The prediction, still recorded as a prediction.** From 12 human-published articles in
`tim-writing-os` (a proxy, not the authority): 64 rewrites demanded. em-dash 36,
rhetorical-fragment 11, semicolon 9, title-case-header 4, banned/en-dash/antithesis 4.
It predicted which rules would die. Nothing dies, so what it now predicts is which lines
Joseph's `gate-calibration.md` will carry, and the same list run against another person
predicts a different calibration. That is the whole reason the calibration is per
profile.

---

## Section 3: the reader (APPROVED 2026-08-23)

`reference/reader.md`, ported from `~/Desktop/tim-writing-os/.claude/skills/grade-dis-jawn/SKILL.md`.

This is the direct fix for G2. A grep of the PRD, `SKILL.md`, every workflow and every
reference file for any grader, quality bar, reader test or judge returns zero hits. The
system is thirty prohibitions and two absence floors. A draft can pass `engine.js`
completely clean and be worthless, and no step would notice.

- **Fresh subagent.** Sees only the reader spec, the generated context block, and the
  post as it would appear in the feed. Never the brief, never the conversation, never
  the author's intentions.
- **Portable by construction.** The four grading principles (Defensibility, Consistency
  and targeting, Craft, Human hand), the four anchor questions, and the L1-L4 bar are
  person-agnostic already. Only the context block is Daybreak-specific, and setup
  generates it from `audience.md`, `thesis.md`, and `identity.md`.
- **Grades, never rewrites.** An L1 offers a redraft and the human decides. This is what
  keeps the reader on the correct side of finding 01.
- **Pipeline position: step 5b**, after the gate, before ship. The grade joins the run
  line. It does not block.
- **The one tension, resolved explicitly. Restated 2026-08-23.** The reader's "Human
  hand" principle lists em dashes as a tell, while Phase 2a makes the mechanical em-dash
  ban per-profile suppressible; this bullet read "while Phase 2 retires the mechanical
  em-dash ban," and nothing is retired. Both instruments are correct: a reader noticing
  punctuation *density* holistically is a different instrument from a zero-tolerance
  mechanical ban, and only the second one rewrites the human's punctuation, which is why
  only the second one is suppressible. A profile whose em-dash ban is suppressed still
  hears the reader on density, and that is the instrument working rather than a stale rule
  nobody caught. Record it in `ai-tells.md`'s maintenance log and in the reader's own
  spec, so it is not later "fixed" as an inconsistency in either direction.

## Section 4: onboarding (APPROVED 2026-08-23)

Time to first publishable post is roughly 165 minutes. The repo documents this in its own
quit-risk exemption: *"minute 165 of an interview is where people quit."* Best-in-class
time-to-value is under five minutes, 60% abandon onboarding without clear value in seven
days, and Superhuman capped its high-touch onboarding at 30 minutes. Friction that maps
onto the core value proposition retains; a three-hour unbroken gate before first output
does not.

**Invert the order.**

- **Front door, ten minutes.** `/content-engine setup` opens by asking for three to five
  things they wrote. Anything unedited counts. That is currently optional and sixth in
  `workflows/setup.md`'s order.
- That paste writes `voice.md` samples plus `shipped-history.md`, which is what makes the
  negative control runnable on day one instead of never. **Added 2026-08-23:** the front
  door runs it there and then and writes `gate-calibration.md`, so the gate is already
  this person's gate before their first draft. That is Phase 2a's shipped capability, and
  it is the whole of what the retirement pass used to be.
- Minimum viable draft from the smallest possible inventory, then the calibration post.
- **The deep interview becomes the upgrade it actually is**, chunked into 30-45 minute
  sessions that each end in a visible output improvement.
- **Fix the session-one floor.** `engine.js locks` reports `rotation_healthy: False` at 8
  items and `True` at 15. `workflows/setup.md` closes session one at the 8-item floor with
  *"you can post from this today."* Raise the floor to 11 or soften the close. Do not
  ship a close that the engine's own health check contradicts.
- **Fix `README.md`.** It is the 1-2 line explanation and therefore it is G5. The clone
  URL is the literal string `<url>`, the ships list names files that do not exist, and
  five of the nine advertised commands route to missing workflow files.

## Section 5: the formats (APPROVED 2026-08-23)

Documents and carousels are the top-engagement format in all three primary 2026 datasets:
Buffer (52M posts), Socialinsider (1.3M), AuthoredUp (3M). They are the format Joseph
already has and is not building.

| Source | Destination | Work |
| :- | :- | :- |
| `~/.claude/skills/gtm-content-infographic/` (render.py, archetypes, themes, 8 samples, tests) | `render/infographic/` + `workflows/infographic.md` | Replace hardcoded brand strings with `theme.json` keys. Keep the tests. |
| `~/.claude/skills/gtm-content-carousel/` (render.py, 12 archetypes, 2 themes, 7 test files, sample PDFs) | `render/carousel/` + `workflows/carousel.md` | Same. Keep the tests. |
| `~/Desktop/tim-writing-os/skills/content/linkedin-article.md` (229 lines) + `linkedin-article-publish.md` (165) | `workflows/article.md` | Port, then aim at newsletter editions per decision 3. Strip every Daybreak string. |

Both renderers already take a markdown spec and emit a file, which is the documented
input contract §1.1 asks for. Neither carries a Daybreak string in its logic; both carry
them in themes, which is where they belong.

**Articles carry three constraints** from decision 3: published as newsletter editions so
notification delivery bypasses feed ranking, always with a carousel derivative from the
same brief, capped at one per 8 to 10 short posts. Never measured in article impressions.
Rationale: articles reach 0.69x the platform median (596 against 921) at four to ten times
the authoring cost, on two independent measurements.

**Every ported file must clear the same bar the repo already sets:** no company string in
skill logic, every write inside `profiles/<handle>/`, and the design-tell gate runs on
rendered HTML as text rather than on screenshots, per §4's cost argument.

---

## Where to pick this up

Read this file, then `content-engine-PRD.md` §9 and §13.

**Revised 2026-08-23. No row blocks any other row, and nothing waits on Joseph.** This
read *"The first unblocked row that blocks anything is 1a, the paste front door. 1.3 waits
on it, 2a waits on 1.3, 2d waits on 2a, and nothing else in the table waits on any of
them,"* which was true of the 08-20 table and describes a chain that no longer exists.
1.3 and 2a are not build rows any more, 2d is merged into 2c, and the retirement they fed
is replaced by per-profile suppression. **Start anywhere in 2a, 2b, 2c, 3 or 5.** Five
subagents can run them at once, and none of them needs a word of Joseph's writing:
suppression is a file the gate reads and behaves correctly without, so 2a is built and
tested against `_template`'s empty samples and a fixture profile with a planted em dash.

**Phase 1a and 1b are not gates and they are not first.** They are the first real run of a
finished engine, and they sit below the Phase 3 checkpoint and below Phase 5, because the
engine is packaged before it is pointed at a person. Neither can be delegated, because
both are Joseph talking. Phase 6 is the only row downstream of them, since a measured
threshold needs somebody's measurements and a first calibration needs a first profile.

Two earlier versions of this paragraph are worth keeping visible, because they are the
same mistake narrowing rather than going away. It read *"Start at Phase 0"* until 08-20,
when Phases 0 and 0.5 were both done and it pointed at finished work. Before that it read
that Phase 1 *"is the gate on Phases 1.3 and 2,"* which widened a ten-minute paste into a
45-minute conversation and put two hours of corpus-free code behind it. Both were arguments
about how much of the build waited on one person. The answer was none of it.
