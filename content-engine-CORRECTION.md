# Content Engine: the correction

**Written 2026-08-19. Status: sections 1 and 2 approved by Joseph. Sections 3, 4, 5 drafted, pending sign-off.**

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
| 0 | Instruments: fence comment, `format` de-hardcoded, `overlap` wired in | subagent | ~1h | no |
| 0.5 | PRD structural rewrite, so the spec leads the work rather than trailing it | subagent | ~2h | no |
| 1a | Paste front door: three to five unedited samples into `voice.md` and `shipped-history.md`, the four measurements frozen off them | **Joseph** | ~10m | it **is** the corpus |
| 1b | The real interview, session one | **Joseph** | 30-45m | no |
| 1.3 | `gate --negative profiles/joseph`, the first real run of the negative control | subagent | ~15m | yes, 1a |
| 2a | Retire what over-fires on his corpus, struck in `ai-tells.md` with the date and the reason | subagent | ~45m | yes, 1.3 |
| 2b | Invert the mechanism: `action:` on `TELLS`, the cap's new job, the single redraft, the better-of-two comparator | subagent | ~1h | no |
| 2c | Burstiness and nominalisation | subagent | ~30m | no |
| 2d | Punctuation density | subagent | ~15m | yes, 2a |
| 3 | `reference/reader.md`, the grader | subagent | ~1h | no |
| (pause) | **Checkpoint: Joseph reviews** | Joseph | | |
| 4 | Deep interview, chunked into 30-45m sessions each ending in a visible improvement, continuing 1b | **Joseph** | async | no |
| 5 | Vendor both renderers; write `workflows/{infographic,carousel,article}.md` | subagent | ~1d | no |
| 6 | PRD evidence pass: record which rules died and the measured thresholds | subagent | ~1h | no, but downstream of 2a |

**Re-cut 2026-08-20.** Phase 1 was one row, *"Paste-first front door, then the real
interview,"* Joseph, 30-45m, and Phase 2 was one row bundling the retirement, the three
new checks and the mechanism inversion at ~2h. Both are split above, and the reason is in
the code. `gateNegative` opens two files, `voice.md` and `shipped-history.md`
(`reference/engine.js:1067-1071`), and nothing else: not `identity.md`, not `thesis.md`,
not `audience.md`, not `inventory.md`, not `learnings.md`, every one of which is an
interview output. So what gates Phase 1.3 is three to five pasted samples and the four
measurements taken off them. That is ten minutes, not the 30-45 minute interview, and the
old row charged the interview's clock to a dependency the interview is not in. What the
old row was right about survives: neither half of Phase 1 can be delegated, because both
are Joseph talking. Section 2's two `Phase 2` headings are relabelled 2b and 2c/2d to
match this table, and its density paragraph now names 2a as the retirement row rather
than 1.3, which is the row the negative control runs in.

The right-hand column is the whole corpus dependency and it is deliberately narrow. Four
rows need Joseph's own words: 1a produces them, 1.3 reads them, 2a spends 1.3's verdict,
and 2d cannot be specified until 2a has run, for the reason section 2 already gives, that
a density floor and a zero-tolerance ban on two of its own four inputs cannot both bind.
Every other row is code against a spec that already exists. 2b is restructuring of
`TELLS` and the cap and touches no profile. 2c's two checks carry absolute fallbacks for a
profile with no baseline, which `statsText` already implements for the voice floor
(`reference/engine.js:873-881`), so both are testable against `gate-fixtures/` before a
sample is pasted. 1b gates nothing in this build; it buys draft quality, and Phase 4 is
where that is scheduled.

Phases 4 and 5 run in parallel. Inventory depth gates draft quality, not format support.
**Revised 2026-08-20:** 1b, 2b, 2c, 3 and 5 all run in parallel with each other too,
which is what the split is for. The only serial chain left is 1a, 1.3, 2a, 2d.

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
| 0a | `stripFences` comment, engine.js:306 | **Respecified 2026-08-19, and the row above it in this file was wrong.** There is no functional fence bug. `voiceSamples` strips fences correctly, because the Samples schema example lives in a fence and must not count as a real sample, and `selfTest` already locked that. `voiceMeasures` reads fence-and-all correctly, because the four frozen measurements are typed inside a fence. The asymmetry is intentional. The defect was the comment sitting on `stripFences`, which described an exception none of its callers implement. Fix: correct the comment, add assertions pinning the split in both directions, and tell the `voice.md` template to paste **below** the fence. A `keepFences` option would have made the blank template count as a real writing sample and poisoned the Phase 1.3 negative control. Separately verified: `gate --negative` **already** fails loudly on an empty corpus. Nothing to do there. |
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
  lands on `'short'`, the stricter scope, so a typo cannot silently retire the
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

### Phase 2c and 2d, the new checks

Engine-owned, deterministic counts, floored against the person's setup baseline with
absolute fallbacks where no baseline exists:

- **Burstiness.** Sentence-length coefficient of variation. Human benchmarks 0.60-1.00;
  AI text 0.15-0.30. `stats` already returns stdev and mean, so this is one division.
- **Punctuation density.** Commas, semicolons, parens, dashes per 100 words. This is the
  strongest 2026 tell, and today's gate actively enforces it by banning two of the four.
- **Nominalisation rate.** `-tion/-ment/-ness/-ity/-ance/-ence` per 100 words.

**Two things Phase 2 has to resolve and nothing currently says how.**

1. **Punctuation density contradicts two live bans.** The density check counts commas,
   semicolons, parens and dashes. §9 bans em dashes at zero tolerance and semicolons in
   short posts, which is two of the four inputs. A density floor and a zero-tolerance ban
   on its own inputs cannot both bind. The order matters: the negative control runs at
   Phase 1.3 and the retirement follows it at Phase 2a, and the density check is only
   meaningful over whatever survives that. Do not ship the check before the retirement
   pass. That is why it is row 2d and not part of 2c: burstiness and nominalisation are
   downstream of nothing here.
2. **`bound 3 becomes bound 1` is withdrawn.** Reordered in emphasis only. The four bounds
   keep their numbers. Renumbering does not break the nineteen citations in `SKILL.md`,
   `reference/ai-tells.md` and `reference/engine.js`; it makes them resolve *silently
   wrong*, because old bound 2 becomes new bound 3 and every stale reference still finds a
   rule, just not its rule. The repo already states this principle as law in §8's
   `hook_id:` contract. The mechanism change is untouched: the cap still changes job, the
   repair/redraft/reject split still stands. Only the numbering reverts.

**Register inflation goes to the model, not the engine.** It is a judgment, and §9's
honesty rule is that zero tolerance is a promise only the deterministic half can keep.

### The retirement rule

**Nothing is retired until `gate --negative profiles/joseph` has run on real samples.**
Em dash and semicolon are the strong prediction, not the authority. The negative control
is. §13.2 step 4 already sets the bar: zero rewrites on the person's own writing.
Retirement follows §9's maintenance path — struck through in `ai-tells.md` with the date
and the reason, so it stops firing and stays visible.

Predicted, from 12 human-published articles in `tim-writing-os` (a proxy, not the
authority): 64 rewrites demanded. em-dash 36, rhetorical-fragment 11, semicolon 9,
title-case-header 4, banned/en-dash/antithesis 4.

---

## Section 3: the reader (DRAFT, pending sign-off)

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
- **The one tension, resolved explicitly.** The reader's "Human hand" principle lists em
  dashes as a tell, while Phase 2 retires the mechanical em-dash ban. Both are correct:
  a reader noticing punctuation *density* holistically is a different instrument from a
  zero-tolerance mechanical ban, and only the second one rewrites the human's
  punctuation. Record this in `ai-tells.md`'s maintenance log so it is not later "fixed"
  as an inconsistency.

## Section 4: onboarding (DRAFT, pending sign-off)

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
  negative control runnable on day one instead of never.
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

## Section 5: the formats (DRAFT, pending sign-off)

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

**Revised 2026-08-20.** This read *"Start at Phase 0,"* and Phases 0 and 0.5 are both
done, so it pointed at finished work. **The first unblocked row that blocks anything is
1a, the paste front door.** 1.3 waits on it, 2a waits on 1.3, 2d waits on 2a, and nothing
else in the table waits on any of them. Phases 1b, 2b, 2c, 3 and 5 are unblocked today, so
a subagent can start 2b, 2c, 3 or 5 before Joseph has pasted a word.

Neither half of Phase 1 can be delegated, because both are Joseph talking. Only 1a is a
gate: `gateNegative` reads `voice.md` and `shipped-history.md` and no interview output
(`reference/engine.js:1067-1071`). 1b, the interview, gates nothing in the build. This
paragraph used to read that Phase 1 *"is the gate on Phases 1.3 and 2,"* which widened a
ten-minute paste into a 45-minute conversation and put two hours of corpus-free code
behind it.
