# Dogfood — P3 Beatriz Lindqvist, run 1 (reconstructed from transcript)

**Persona.** Beatriz Lindqvist, handle `beatriz`. CRO at a Series C fintech
(`Northlane`, invented in-run). Posts about pipeline hygiene, comp plan design,
why enterprise deals slip in Q4. Non-technical, will not read code, thinks in
10-minute blocks. **Archive: ZERO** — she has never posted on LinkedIn and had
nothing to paste. Finding out what the engine does with a person who has no
writing of their own was the whole point of the run.

**HEAD.** `397eb04`. First half ran inside the git worktree
`/Users/josephavula/Desktop/content engine/.claude/worktrees/agent-ab700f46fac73f8fe`;
that worktree was destroyed by the harness during the spend-limit gap, and the
second half ran against the main repo at `/Users/josephavula/Desktop/content engine`
with the profile rebuilt by hand.

**Window.** 2026-08-25T09:25:04Z to 2026-08-25T19:53:08Z, with a spend-limit gap
from 09:35:48 to 19:42:38. About 11 minutes of wall clock before the gap and 11
after — roughly 21 working minutes in total, for four artifacts.

**This report is reconstructed from her transcript. She did not write it.** She
hit an individual spend limit at 09:35:48, resumed at 19:42, and hit it again at
19:53:08 — one second after spawning the step 5b reader on her finished article,
while she was about to cut the article's mandatory carousel derivative. A
coordinator message at 23:12 asked her to write the report from memory; her only
response was the spend-limit line again. She wrote plenty to disk during the run —
profile files, briefs, drafts, gate reports, two rendered artifacts — but never one
line of the report itself.

**Run 2 is the fuller report.** `dogfood-beatriz.md` in this directory is the
complete P3 run: 34 findings, all four artifact evaluations, a cold-start section
and a closing. **This report exists for the delta** — what run 1 saw that run 2
did not, and where run 1 has harder evidence for the same defect. Every finding
below is cross-referenced to run 2 where the two overlap.

Every quoted instruction, command and output below is copied from a tool call or
tool result in her transcript. Her thinking blocks are empty in the log, so the
only interpretation available is her own on-screen commentary, which is quoted
where it exists.

---

## Findings

### F-1 — The whole install is one line and it fails as written
- Where: `README.md`, the install block, lines 3-6 — the first thing on the page
- Instruction as written:
  ```
  cp -R "content engine" ~/.claude/skills/content-engine
  /content-engine setup
  ```
  "That is the whole install. **There is no published remote yet**, so this is a
  copy of the directory rather than a clone"
- What I did: pasted line 1 exactly, standing in the folder I was handed.
- What happened:
  ```
  cp: content engine: No such file or directory
  EXIT: 1
  ```
  There is no directory named `content engine` inside the thing I was given. The
  command only works from the *parent* of the engine folder and no line says so.
- What I expected: the first command in the product to work.
- Severity: blocker
- Had to leave the docs: no. Stated workaround, verbatim from the transcript:
  "The install line failed. Let me look at what a user would find next." She read
  `SKILL.md` in place instead of installing, and never installed.
- also run 2 F-1 — same command, same output, same workaround.

### F-2 — The negative control prints `"pass": false` at a user who did nothing wrong
- Where: `workflows/setup.md` §0.3, `node reference/engine.js gate --negative profiles/beatriz`
- Instruction as written: "Run this once, and hand-write no number that follows:"
  and, from §0.2: "**If they have no writing samples at all,** say so in
  `voice.md` explicitly, skip §0.3, and go to §0.4. Do not refuse to draft."
- What I did: ran it on the freshly copied profile, before anything was written.
- What happened, verbatim (opening of a ~40-line JSON blob):
  ```
  {
    "check": "gate",
    "mode": "negative-control",
    "corpus": "empty, no pasted sample on file",
    "samples": 0,
    "posts": 0,
    "pass": false,
    "fires": [],
    "also_flagged": [],
    "baseline": {
      "avg_sentence_length": null,
      "sentence_length_stdev": null,
      "contraction_rate": null,
      "uses_fragments": null,
      "burstiness": null,
      "punctuation_density": null
    },
    "calibration": {
      "file": "absent",
      ...
  ```
  The engine did the right thing internally — it detected the empty corpus and
  refused to invent numbers. What reached the screen was `pass: false` and a
  paragraph of PRD section references ("section 13.2 step 4: zero rewrites on the
  person's own samples...", "per section 1.3", "section 6 discards that text").
- What I expected: a sentence saying there was nothing to measure and that this is
  the expected state for someone with no archive, not a failed test on minute two.
- Severity: friction
- Had to leave the docs: no
- also run 2 F-7.

### F-3 — `SKILL.md` points at a directory that does not exist
- Where: `SKILL.md`, first paragraph of the skill
- Instruction as written: "`reference/pipeline/` holds each shared step's detail
  and is loaded on demand, not up front."
- What I did: `ls reference/pipeline`
- What happened: `ls: reference/pipeline: No such file or directory`. The whole
  `reference/` folder is seven entries — `ai-tells.md`, `design-tells.md`,
  `engine.js`, `gate-fixtures`, `hooks.md`, `interview.md`, `reader.md` — and none
  of them is `pipeline`.
- What I expected: the folder to exist, since the skill's own map of itself says
  each pipeline step's detail lives there.
- Severity: friction
- Had to leave the docs: no
- also run 2 F-3. **Caveat on this one:** the transcript shows the command and the
  error but carries no commentary line about it, so I am reporting a deliberate
  check of a doc claim that failed, not a snag she stopped to name.

### F-4 — The gate demanded a redraft against a number it had no way to measure
- Where: pipeline step 5, `node reference/engine.js gate --report profiles/beatriz/runs/2026-08-25-champion-signer/draft.md profiles/beatriz`, first pass on the §0.4 calibration post
- Instruction as written (`workflows/setup.md` §0.4): "Generate it from a named
  inventory item, run it through the real language gate, and show the post plus
  the gate diff."
- What I did: wrote `brief.md` and `draft.md`, ran the gate as printed.
- What happened, verbatim:
  ```
  "gate_passes": false,
  "gate_catch_count": 2,
  "tags": ["no-long-sentence", "punctuation-density"],
  "action": "redraft",
  "rewrites_required": 0,
  "rewrite_cap": 3,
  "over_cap": false,
  "redraft_constraints": ["punctuation-density"],
  ```
  and inside `stats`:
  ```
  "baseline": {"avg_sentence_length": null, "sentence_length_stdev": null,
               "contraction_rate": null, "uses_fragments": null},
  "baseline_source": "none, absolute floors applied",
  "flags": [
    {"rule": "no-long-sentence", "action": "flag", "detail": "no sentence over 25 words"},
    {"rule": "punctuation-density", "action": "redraft", "metric": "punctuation_density",
     "draft": 1.76, "baseline": null, "limit": 2, "direction": "below",
     "source": "absolute fallback, gate-calibration.md carries no baseline for this metric"}
  ]
  ```
  Her commentary, verbatim: "The gate demands a redraft on `punctuation-density` —
  note the reason: `\"baseline\": null, \"source\": \"absolute fallback,
  gate-calibration.md carries no baseline for this metric\"`. That's the
  zero-archive path."
  She redrafted, adding commas and subordinate clauses. `punctuation_density` went
  from 1.76 to 6.19.
- What I expected: `voice.md`'s own warning is that "without it the gate rewrites
  their own voice on day one." That is what happened, against a floor picked for
  nobody, and nothing on screen said the floor was a guess.
- Severity: friction
- Had to leave the docs: no
- also run 2 F-13 and F-14 (same defect; run 2 measured 1.49 on a different draft
  and separately logged `action: redraft` arriving with `over_cap: false`, which
  run 1's output also shows).

### F-5 — The gate's second pass fired on the only sentence in the profile that was hers
- Where: pipeline step 5, second gate pass on the calibration post
- Instruction as written (`SKILL.md` section 2, step 5 / `workflows/short-post.md`
  drafting rule 2): "the gate refuses to edit inside quotes, so unquoted verbatim
  material is material the gate is free to rewrite."
- What I did: redrafted for `punctuation-density` per F-4 and re-ran the gate. The
  draft's closing line was `Coverage is not a number, it is a distribution. Four
  deals at 4x is not covered.` — copied out of `audience.md`'s
  `what_they_believe_that_is_wrong:` field, which is Beatriz's own sentence,
  recorded verbatim in the interview an hour earlier.
- What happened, verbatim:
  ```
  {
    "gate_passes": false,
    "gate_catch_count": 1,
    "tags": ["antithesis"],
    "action": "redraft",
    "rewrites_required": 0,
    "flagged": 0,
    "words": 210,
    "redraft_constraints": ["antithesis"]
  }
  []
  ```
  (`stats.flags` was empty — the catch is a lexical/model tell with no flags row,
  so there is no measured number to argue with.)
  Her commentary, verbatim: "`antithesis` now fires — on the closing line, which
  is Beatriz's own words from `audience.md`. Redrafting again (the gate says
  `action: redraft`)."
  She rewrote her own sentence to `Coverage is a distribution, not a headline
  number. Four deals at 4x, and one of them is the quarter.` and the gate passed:
  `"gate_passes": true, "gate_catch_count": 0, "tags": [], "action": "none"`.
- What I expected: the one sentence in the whole profile that came out of my mouth
  verbatim is the last one the gate should be rewriting. It is also, for a
  zero-archive user, the *only* material of mine the engine has.
- Severity: friction
- Had to leave the docs: no
- **New versus run 2.** Run 2's F-18 is the adjacent case — quoting your own words
  makes the reader think you are quoting yourself. This is the harder version: the
  gate did not merely penalise her own words, it demanded they be replaced, and
  the replacement is the line the step 5b reader then called "borrowed, not
  earned."

### F-6 — The step 5b reader is never told the author's name, and got her sex wrong four times
- Where: `reference/reader.md` `## The context block, and how it is generated`, pipeline step 5b
- Instruction as written: "Exact shape, one line per source field:" ... "whose post
  this is:   identity.md `role:` + `company:` + `sells_what:` + `sells_to:`, as one
  byline line" and, of the five rules on the render, rule 1 "**Every value is copied
  verbatim.**" and rule 5 "**Nothing else goes in.** Not `voice.md`, not the brief,
  not the topic."
- What I did: rendered the context block exactly as specified and spawned the fresh
  reader subagent with its closed input list. The byline line I was allowed to send
  was `whose post this is:   Chief Revenue Officer, Northlane`. `identity.md` has a
  `name:` field, filled in with `Beatriz Lindqvist`, and the spec has no slot for it.
- What happened: the reader returned **L2 — almost there**, and referred to the
  author as "he" throughout: "He closed the escape hatch before I could reach for
  it", "he names the mechanism with a cost attached", "He indicts his own model
  instead of his reps". The report is written to `reader-report.md` verbatim per
  step 5b, so the error is now on disk in the run directory. Her own note, appended
  to that file: "the author is a woman named Beatriz (\"he\" throughout —
  reader.md's context block spec carries identity.md's `role:`, `company:`,
  `sells_what:` and `sells_to:` and no `name:`), and the word \"результат\" in
  paragraph four is a glitch in the grader's own output that this file is required
  to preserve verbatim."
- What I expected: the block that names five things about my company to also name me.
- Severity: friction
- Had to leave the docs: no
- **New versus run 2.** Run 2's reader reports do not surface this. Note also the
  second half of her note: the grader emitted a Cyrillic word mid-sentence
  ("результат"), and step 5b's verbatim rule forced her to keep it. That is a
  subagent output glitch rather than an engine defect and I am not promoting it to
  a finding, but it is what "copy the report verbatim" costs when the report is
  wrong.

### F-7 — BLOCKER: the doc declared authoritative names fields the renderer refuses
- Where: `workflows/infographic.md` step 4a, and `content-engine-VISUALS.md` §3.5
- Instruction as written (`workflows/infographic.md`): "**`content-engine-VISUALS.md`
  §2 is the procedure and this file does not restate it.** ... Its §3 catalog is the
  authority on what each signature requires and what disqualifies it, and it
  **outranks** `render/infographic/reference/archetypes.md`, which describes
  templates rather than signatures."
  And VISUALS §3.5, the outranking file, verbatim: "**Parameters.**
  `headline_naive` and `headline_real` (1 line each, <=36 chars, with one word
  emphasized in each) · `naive_callout` (2 lines, ~16 chars each) · `real_items`
  (4 single-line items) · `real_punchline` (1 item that deliberately breaks the
  format of the other four) · `divider_y_pct`."
- What I did: wrote the spec using those parameter names, because that is the file
  I was told outranks the other one. Her commentary, verbatim: "Two things I have to
  resolve before drafting. Testing the literal reading of VISUALS §3.5's parameter
  names against the renderer."
- What happened, verbatim:
  ```
  ERROR block (perception-split): missing required field 'naive_headline'
  ERROR block (perception-split): missing required field 'real_headline'
  ERROR block (perception-split): missing required field 'punchline'
  ERROR block (perception-split): item over 60 chars (82): 'Sixty-one percent of that pipeline was creat'
  ERROR block (perception-split): item over 60 chars (73): 'Eleven of fourteen slipped deals had a champ'
  ERROR block (perception-split): item over 60 chars (70): 'The CFO asked what changed since Friday. I w'

  6 error(s).
  EXIT=1
  ```
  Her commentary: "Confirmed — the doc declared authoritative uses field names the
  renderer rejects."
  The renderer's actual contract, from the file VISUALS is said to outrank
  (`render/infographic/reference/archetypes.md`): "Required: `headline`,
  `naive_headline`, `naive_statement`, `real_headline`, `items`, `punchline`." So
  `headline_naive` → `naive_headline`, `headline_real` → `real_headline`,
  `real_items` → `items`, `real_punchline` → `punchline`, and `divider_y_pct` is
  accepted-and-ignored. Four of six field names in the authoritative doc are wrong.
  The same file also supplies the character budget VISUALS §3.5 does not carry
  ("Budget: panel headlines <= 36 chars, statement and items <= 60"), which is what
  the three length errors were about; two further `--check` passes were needed to
  land inside it.
- What I expected: the file I am told outranks the other one to be the one that
  matches the code. As written I could not proceed without deciding that the
  outranked file wins, which is exactly the choice between two readings I was told
  to log rather than make.
- Severity: blocker
- Had to leave the docs: no — `workflows/infographic.md` names
  `render/infographic/reference/archetypes.md` by name in its step 4b table
  ("Grammar and budgets | `render/infographic/reference/archetypes.md` and
  `reference/method.md`").
- **New versus run 2.** Run 2's F-15 catalogues docs disagreeing with shipped files
  about what *exists*; this is a doc disagreeing with the shipped code about what
  the code will *accept*, on the one path where the doc explicitly claims priority.

### F-8 — Re-running the gate after ship fails the post against its own shipped copy
- Where: pipeline step 5 (`gate --report`) run after step 8 wrote `shipped.md`; lock 5
- Instruction as written (`SKILL.md` section 2, step 2, lock 5): "**Verbatim
  overlap.** Checked at step 5, not here, because it needs a draft. `gate --report`
  is what runs it, and the verdict is in that JSON."
  And step 8: "`y` copies `draft.md` to `runs/<slug>/shipped.md`, flips `brief.md`'s
  `status:` to `shipped`, and appends the `posts.csv` row."
- What I did: after the spend-limit gap I rebuilt the profile and re-ran the same
  gate command on the same, unchanged `draft.md`, to confirm it still passed.
- What happened, verbatim:
  ```
  {
    "gate_passes": false,
    "gate_catch_count": 0,
    "tags": [],
    "action": "redraft",
    "flagged": 0,
    "words": 213
  }
  overlap: {"ran": true, "check": "overlap", "pass": false, "priors_compared": 1,
   "ngram": 8, "failures": [
     {"prior": "2026-08-25-champion-signer", "words": 12,
      "text": "I spent a year believing our forecast problem was a rep discipline"},
     ...
     {"prior": "2026-08-25-champion-signer", "words": 161,
      "text": "same room as the person who signs.\n\nNot \"hadn't met recently,\" ...
       Four deals at 4x, and one of them is the quarter"}],
   "warnings": [...],
   "sentence_similarity": [{"slug": "2026-08-25-champion-signer",
     "matched_sentences": 12, "ratio": 0.857}]}
  ```
  Her commentary, verbatim: "Confirmed a real defect: re-running the gate after ship
  fails the post against **its own** `shipped.md`."
  The prior it failed against is `2026-08-25-champion-signer` — this run. The check
  does not exclude the run's own slug from the prior corpus, so a 161-word span of
  the post matches itself and `sentence_similarity` reports 12 of 14 sentences at
  ratio 0.857. Note also that `gate_passes` is `false` while `gate_catch_count` is
  `0` and `tags` is `[]`: the fail is real and nothing in the tag list names it.
  Only the `overlap` block does, which the JSON's own closing note warns about —
  "Lock 5 is reported under overlap and is counted nowhere else, so read that block
  rather than the tag list for it."
- What I expected: a shipped post not to be its own plagiarism source.
- Severity: friction — she recorded it in `gate-report.md` and moved on, so nothing
  stopped. It is a blocker for anyone who re-gates a shipped piece, and PRD §3's
  only hard fail is what it reports.
- Had to leave the docs: no
- **New versus run 2.** Run 2 never re-ran the gate after ship, so it never saw
  this. Only run 1 has it, and it has it with the full JSON.

### F-9 — On a visual run the language gate grades the render spec as prose, including the window title
- Where: `SKILL.md` section 2 step 5, run against `workflows/infographic.md` step 4b
- Instruction as written (`workflows/infographic.md` step 4b): "The spec **is** the
  draft. Write it to `<R>/draft.md`, which is what the router gates at step 5, so
  the words on the canvas go through `gate --report` like any other draft."
  And the same file's input contract, which mandates the field the gate then
  objects to: "```\n---\ntitle: <window/PNG title>\nwordmark: <the author's name,
  read off identity.md>\n..."
- What I did: ran the documented gate command on the infographic spec, which had
  just returned `check: OK` from the renderer's own validator.
- What happened, verbatim:
  ```
  check: OK
  CHECK_EXIT=0
  {
    "gate_passes": false,
    "gate_catch_count": 5,
    "tags": ["no-long-sentence", "nominalisation-rate", "rhetorical-fragment",
             "title-case-header", "zero-contractions"],
    "action": "redraft",
    "rewrites_required": 1,
    "flagged": 1,
    "words": 128
  }
  flags: [{"rule": "zero-contractions", "action": "redraft",
           "detail": "no contraction in 128 words",
           "override_available": "voice.md records null"},
          {"rule": "no-long-sentence", "action": "flag",
           "detail": "no sentence over 25 words"},
          {"rule": "nominalisation-rate", "action": "redraft",
           "metric": "nominalisation_rate", "draft": 6.25, "baseline": null,
           "limit": 5, "direction": "above",
           "source": "absolute fallback, gate-calibration.md carries no baseline for this metric"}]
  ```
  Her commentary, verbatim: "Five tags on a slide spec, including
  `title-case-header` on the front-matter window title."
  The `title-case-header` hit is on `title: What Creation Date Does To A Coverage
  Number` — the PNG's window title, which the workflow's own input contract requires
  and which no reader ever sees as a header. `no-long-sentence` fails a file whose
  longest field is a 60-character chip. She redrafted once, lower-casing the window
  title and adding contractions to chip labels, and the tag count went from 5 to 3.
- What I expected: the gate to know it was reading an image spec, since the
  paragraph that routes it there is the one saying the spec *is* the draft.
  `reference/reader.md` knew to carve slides out at step 5b — "**even meter does not
  apply to slides.** Slides are uniform by design" — and step 5 has no equivalent.
- Severity: friction (she got the count down and continued; the residue is F-11)
- Had to leave the docs: no
- also run 2 F-19. Run 1's evidence adds two tags run 2 did not see —
  `title-case-header` firing on the renderer's mandatory `title:` field, and
  `nominalisation-rate` running an absolute fallback on chip labels.

### F-10 — `zero-contractions` pushed contractions into all three later formats, with the override field reading `null`
- Where: `gate --report`, on the infographic spec, the carousel draft, and the article
- Instruction as written (`profiles/_template/voice.md`): "The language gate defers
  to this file: a tell that contradicts a documented habit here does not fire for
  this profile, and the gate records the override instead of rewriting."
- What I did: nothing special. Gated each of the three remaining formats as the
  pipeline says to.
- What happened — the same rule, three times, with the same reason:
  ```
  {"rule": "zero-contractions", "action": "redraft",
   "detail": "no contraction in 128 words",
   "override_available": "voice.md records null"}        # infographic spec

  tags: ["em-dash","no-long-sentence","rhetorical-fragment","zero-contractions"]
  {"rule": "zero-contractions", "action": "redraft",
   "detail": "no contraction in 420 words",
   "override_available": "voice.md records null"}        # carousel draft

  {"rule": "zero-contractions", "action": "redraft",
   "detail": "no contraction in 1095 words",
   "override_available": "voice.md records null"}        # article, --long
  ```
  On the article she edited thirteen sentences to satisfy it — `I have sat` → `I've
  sat`, `Finance will not propose it` → `Finance won't propose it`, `That is the
  part I did not expect` → `That's the part I didn't expect`, and ten more — and
  `contraction_rate` went from 0 to 1.21. The `override_available` field says in as
  many words that the mechanism designed to stop this from happening has nothing in
  it, and it says so on every one of the three runs.
- What I expected: a gate that knows it has no baseline to say so in English, once,
  rather than reporting `voice.md records null` inside JSON and then enforcing a
  default anyway.
- Severity: friction
- Had to leave the docs: no
- also run 2 F-13, which saw it once on the short post. Run 1 has it on three
  formats including a 1,095-word article, and quotes the `override_available` field.

### F-11 — BLOCKER: `rhetorical-fragment` fires on `items:`, a mandatory field key of both renderers, on every example spec that ships
- Where: pipeline step 5 on both visual paths; `reference/ai-tells.md`'s
  `rhetorical-fragment` rule against the renderers' input contracts
- Instruction as written (`workflows/infographic.md` step 4b, the input contract):
  ```
  :: <archetype>
  headline: A functional descriptor with one **highlight** phrase
  sub: One italic line of scope
  items:
  - [icon] Field | Field | sub-item; sub-item
  ```
  and `render/infographic/reference/archetypes.md` for `perception-split`:
  "Required: `headline`, `naive_headline`, `naive_statement`, `real_headline`,
  `items`, `punchline`."
  and `render/carousel/reference/archetypes.md` for `bullets`: "**Required:**
  `headline`, `items`".
- What I did: after the F-9 redraft the tag list still held `rhetorical-fragment`,
  so I looked at what it had actually matched.
- What happened, verbatim:
  ```
  lexical hits: [{"tag": "rhetorical-fragment", "term": "items:", "at": 511,
                  "match": "items:", "protected": false,
                  "tell": "rhetorical-fragment", "action": "redraft"}]
  ```
  Her commentary: "`rhetorical-fragment` fired on the literal string `items:` — the
  renderer's own mandatory field key. Checking whether that's systemic."
  She then gated three of the specs that ship in the repo:
  ```
  ### perception-split.md
   gate_passes False tags ['no-long-sentence', 'nominalisation-rate', 'rhetorical-fragment', 'zero-contractions']
   lexical hits: [('rhetorical-fragment', 'items:')]
  ### ranked-bars.md
   gate_passes False tags ['no-long-sentence', 'rhetorical-fragment', 'zero-contractions']
   lexical hits: [('rhetorical-fragment', 'items:')]
  ### causal-chain.md
   gate_passes False tags ['no-long-sentence', 'rhetorical-fragment', 'title-case-header', 'zero-contractions']
   lexical hits: [('title-case-header', 'title: One Hex Code'), ('rhetorical-fragment', 'items:')]
  ```
  Her commentary: "Systemic — every shipped example spec fails step 5 on `items:`.
  Invoking the documented escape (\"No run ends without an artifact\") and
  continuing to step 6."
  Three of the nineteen shipped infographic examples were gated. All three failed,
  all three on `items:`, and `causal-chain.md` independently reproduced F-9's
  `title-case-header` hit on its `title:` line. The same tag then fired three times
  on the carousel deck, on the `items:` keys of `bullets`, `steps` and `cta`.
- What I expected: a gate that cannot pass any spec the renderer requires is a gate
  that cannot be satisfied. `SKILL.md` says never to show a draft before
  `gate-report.md` exists; on the visual path the only honest `gate-report.md` says
  the gate failed on the renderer's own syntax.
- Severity: blocker — `gate_passes` can never be `true` on a visual run. She
  continued on the documented escape ("No run ends without an artifact") and named
  the gap in `gate-report.md` and `design-gate.md`, which is what the docs tell you
  to do; but the escape is the only way through, on every visual run, forever.
- Had to leave the docs: yes. The sweep that proved it systemic read
  `render/infographic/examples/`, which no doc she had been given named — she had
  listed that directory at 09:31 while checking whether the renderer would run at
  all. Under her run contract, opening anything under `render/` without a doc naming
  it is itself a blocker to log. The transcript shows her doing it; she died before
  she could log it, so I am logging it here.
- **New versus run 2, and the strongest new evidence in this run.** Run 2's F-19
  lists `rhetorical-fragment` in a tag list without identifying what it matched.
  Only run 1 identified the match, and only run 1 confirmed it against the repo's
  own shipped examples.

### F-12 — `workflows/carousel.md` gives `draft.md` no schema, then step 5 gates whatever you invented
- Where: `workflows/carousel.md` step 4, "Two writes, in this order"
- Instruction as written: "1. **`runs/<slug>/draft.md`** — the caption, then the
  slide copy as plain lines. Step 5's gate reads this file, so every word a reader
  will see has to be in it: words that never reached `draft.md` are words no gate
  ever saw."
- What I did: "the caption, then the slide copy as plain lines" is the whole
  specification, so I invented a scaffolding to keep seven slides apart, and used
  `SLIDE 1 — cover`, `SLIDE 2 — stat`, and so on.
- What happened, verbatim:
  ```
  {
    "gate_passes": false,
    "gate_catch_count": 12,
    "tags": ["em-dash", "no-long-sentence", "rhetorical-fragment", "zero-contractions"],
    "action": "redraft",
    "rewrites_required": 7,
    "flagged": 1,
    "words": 420
  }
  lex: [('em-dash', '—'), ('em-dash', '—'), ('em-dash', '—'), ('em-dash', '—'),
        ('rhetorical-fragment', 'items:'), ('em-dash', '—'), ('em-dash', '—'),
        ('rhetorical-fragment', 'items:'), ('em-dash', '—'), ('rhetorical-fragment', 'items:')]
  ```
  Seven of the twelve catches, and all seven required rewrites, were the em dash in
  my own scaffolding — punctuation in a structural label no reader will ever see. I
  changed `SLIDE 1 — cover` to `SLIDE 1, cover` throughout and the count dropped to
  4. Her own note in `gate-report.md`: "`workflows/carousel.md` specifies that file
  as \"the caption, then the slide copy as plain lines\" and gives no schema, so the
  scaffolding was invented and then gated as prose."
- What I expected: if step 5 is going to grade this file character by character, the
  file needs a stated format. The infographic path has one printed in full; the
  carousel path has one sentence.
- Severity: friction
- Had to leave the docs: no
- **New versus run 2.**

### F-13 — `--check` warns at 7 words for a rule the doc sets at 8, and a correctly-formed `steps` item can never clear it
- Where: `workflows/carousel.md` step 4 vs `python3 render/carousel/render.py <spec> --check`
- Instruction as written (`workflows/carousel.md`): "On-slide copy is signage, not
  prose: **headline 3 to 8 words and never a third line** (VISUALS §5.1), lead two
  short lines, bullet about six words. `--check` warns past those without blocking".
  And `render/carousel/reference/archetypes.md`: "`steps` items use a pipe:
  `Label | detail`."
- What I did: cut both long headlines down to exactly eight words, which is inside
  the documented rule, and wrote three `steps` items in the documented
  `Label | detail` form.
- What happened, verbatim, after the cut:
  ```
  WARN  slide 1 (cover): headline > 7 words (8)
  WARN  slide 6 (steps): bullet > 6 words: 'Say it in one sentence | If it takes two'
  WARN  slide 6 (steps): bullet > 6 words: 'Name what it under-pays | Every plan und'
  WARN  slide 6 (steps): bullet > 6 words: 'Commit to the year | Or write a plan you'
  WARN  slide 7 (cta): headline > 7 words (8)
  WARN  slide 7 (cta): bullet > 6 words: 'I re-cut in June and lost one of the two'
  WARN  slide 7 (cta): bullet > 6 words: 'Quota relief would have cost me less tha'

  check: warnings only.
  CHECK=0
  ```
  Her own note in `design-gate.md`: "VISUALS §5.1 is \"three to eight words\"; the
  check warns above seven. Eight is inside the craft rule and outside the checker's
  threshold." And on the `steps` warns: "the checker counts the label, the pipe and
  the detail together against a six-word bullet budget. A correctly formed `steps`
  item cannot clear it. Not fixable without breaking the archetype's own syntax."
- What I expected: the checker and the rule to agree on a number, and an archetype's
  own documented syntax not to trip the checker by existing.
- Severity: polish — `--check` warns rather than blocks, and she accepted all seven
  as decisions and shipped.
- Had to leave the docs: no
- also run 2 F-32 for the 7-vs-8 half. The `steps` half — that the documented
  `Label | detail` form cannot satisfy the bullet budget — is new to run 1.

### F-14 — BLOCKER: the article path refuses a new user, and the only way through is to fabricate a ledger
- Where: `workflows/article.md` `## The cap`, against `README.md`'s command list
- Instruction as written (`README.md`, under "## After setup", with no caveat):
  "`/content-engine article <topic>          newsletter edition, plus its carousel`"
  and `workflows/article.md`: "> **N = short-post briefs shipped since the most
  recent brief carrying `format: article`.** With no shipped article, N is every
  shipped short post." with the table row "| under 8 | **Refuse**, before step 3
  crosses a single angle. |"
- What I did: computed N off `profiles/beatriz/runs/*/brief.md` the way the doc
  defines it. Her commentary: "The article path refuses me outright. Recording that,
  then doing what the docs require to get past it."
- What happened, verbatim:
  ```
  N (shipped short-post briefs since last format: article) = 1
  cap is 8 -> under 8 -> REFUSE before step 3
  ```
  To reach the cap she wrote **six new inventory items** and **seven complete
  fabricated short-post runs** — `brief.md` with `status: shipped`, a real
  `draft.md`, a `shipped.md`, and a `posts.csv` row each:
  `2026-08-25-forecast-call-killed`, `2026-08-25-ramp-is-a-manager-number`,
  `2026-08-25-discount-timing`, `2026-08-25-best-rep-worst-forecaster`,
  `2026-08-25-ninety-days-no-number`, `2026-08-25-renewals-back`, and
  `2026-08-25-loss-on-the-floor`. Each fabricated brief carries
  `tests_hypothesis: cadence run, logged so the article cap can be reached`.
  ```
  6 cadence runs written
  N = 7
  {"shipped_pieces": 9, "inventory_pool": 14, "unlocked_count": 5,
   "runway_posts": 5, "rotation_healthy": false, ...}
  ...
  N = 8 -> cap is 8, N==8 -> print the count and ASK
  ```
  At N=8 the doc's own row is "| 8 or 9 | Print the count and ask. |", so she asked
  and Beatriz confirmed. The cost of getting there: nine shipped pieces in the
  ledger, of which two were real; fourteen inventory items, of which six exist only
  to back fabricated posts; and `hook_locked_recent` now holding seven hook patterns
  that were never actually used —
  `['correction','confession','misread','pattern','the-boring-answer','unpopular','withdrawal']`,
  which permanently narrowed her real rotation to four unlocked anchors.
- What I expected: the command list to say the format is locked. `SKILL.md`'s route
  table lists `article <topic>` with no caveat and the README lists it under "After
  setup".
- Severity: blocker
- Had to leave the docs: no
- also run 2 F-24. Run 1's delta: run 2 wrote nine `brief.md` stubs. Run 1 wrote
  seven full runs *plus six inventory items to source them*, because the anchor lock
  will not let a brief name an item that does not exist — so the workaround forces
  fiction into `inventory.md` as well as into the run ledger, and `SKILL.md` section
  4's rule against exactly that is what it breaks.

### F-15 — The article's mandatory outside-world fact has no place on disk to live
- Where: `workflows/article.md` `### The arc`, against `SKILL.md` section 3
- Instruction as written (`workflows/article.md`): "**An outside-world anchor, in the
  first three paragraphs.** A dated event, a named organisation, a published figure,
  a historical episode. Not the reader's own office and not the author's product...
  The anchor rides in `supports:` and obeys section 14 like every other fact: it
  traces to an inventory item, or the human supplies it in the same turn, or it is
  cut. Invented to fit the argument it is worse than no anchor, because someone will
  check it."
- What I did: none of the fourteen inventory items is an outside-world fact — the
  interview only ever asked for things that happened to me — so I took the second
  branch and supplied one in the turn: "Dixon and Adamson published The Challenger
  Sale in 2011". It is in paragraph three of the finished article.
- What happened: there is nowhere to write it. Her own note, verbatim, at the bottom
  of the article's `brief.md`: "NOTE, unresolved. The outside-world anchor (\"Dixon
  and Adamson published The Challenger Sale in 2011\") is a published fact that
  reaches a draft and is written to no profile file. SKILL.md section 3: \"A draft
  run otherwise reads profile files and never modifies one\", and only
  `post \"<pasted material>\"` may append. So this fact traces to nothing on disk,
  `retract` has no item id to withdraw, and the hard rule that \"everything factual
  traces to something you said in the interview\" is satisfied only by this comment."
- What I expected: a fact the format *requires* to get a write path, so that
  `retract` can reach it.
- Severity: friction
- Had to leave the docs: no
- also run 2 F-26, which found the same requirement with no verification path. Run 1
  reaches it from the other end: even a *correct* outside-world fact has no id, so
  `/content-engine retract` — a command the README advertises — can never touch the
  one class of fact the engine did not get from the interview.

---

## Things she hit that I am not promoting to findings

Four items are in the transcript and are not numbered above, deliberately.

- **The worktree disappearing at 19:42.** `(eval):cd:1: no such file or directory:
  /Users/josephavula/Desktop/content engine/.claude/worktrees/agent-ab700f46fac73f8fe`,
  `profiles/` in the main repo holding only `_template`, and a new worktree holding
  only `dev`. Her commentary: "My worktree was replaced mid-run and the profile went
  with it. Rebuilding in the main repo from what I have." This is harness behaviour,
  not the content engine. It matters only as a caveat: everything after 19:42 ran
  against a hand-rebuilt profile in the main repo, and the rebuild is why F-8 was
  discovered at all.
- **Three "too complex to verify" Bash refusals** at 09:26, 09:28 and 09:31, all of
  the form "this command is too complex to verify that it stays inside the worktree;
  break it into plain, separate commands." Also harness, not product.
- **The infographic's two thumbnail WARNs.** She quoted them into `design-gate.md`
  and accepted them: "Both rest on VISUALS §6.3's `[UNVERIFIED]` 0.70 cap-ratio
  proxy and both print the measured number beside the threshold, which is the
  documented WARN-not-ERROR behaviour." Run 2 numbered these as F-20 on the grounds
  that they are unreadable to a CRO; run 1 read them as working as designed, so I am
  reporting her reading rather than overriding it.
- **Lock 5 catching her on the article.** This one is the engine working. The gate
  found `"prior": "2026-08-25-ramp-is-a-manager-number", "words": 11, "text": "one
  of my managers has hires who ramp in five months"` — she had retold a support
  instead of citing it, which is exactly what `workflows/article.md` drafting rule 4
  forbids. Her commentary: "Lock 5 correctly caught me retelling a support instead
  of citing it." She rewrote the sentence and the article passed clean. Worth
  recording as a pass, not a snag.

---

## Cold start

Beatriz had nothing. This is every place that mattered, in order.

**1. The paste, §0.2, is the first question of the run.** The instruction she read,
verbatim:

> Before anything else, give me three to five things you have written.
> Anything unedited counts: Slack messages you sent, an email you did not
> template, a post. Do not tidy them.

She had none. Her commentary: "The engine's first question is the paste. As Beatriz,
I have nothing."

**2. The engine has a documented branch for exactly this, and it is good.**
`workflows/setup.md` §0.2, verbatim:

> **If they have no writing samples at all,** say so in `voice.md` explicitly,
> skip §0.3, and go to §0.4. Do not refuse to draft. The gate report will open
> with the line that file already specifies, the engine leans on
> `inspiration.md` until 10 posts have shipped, and voice gets re-derived then
> from what performed. Say plainly that the gate is running uncalibrated until
> they paste something, and that pasting anything later re-runs §0.3.

And `profiles/_template/voice.md`'s `## No samples on file` section, verbatim:

> If no sample was ever pasted, say so here explicitly rather than leaving the
> file blank. When this file holds zero `source: pasted` entries, the gate report
> opens with: "No samples of your writing on file, this draft is inferred, not
> matched. Paste anything you've written and I'll re-derive." The engine leans on
> `inspiration.md` until 10 posts have shipped, then re-derives voice from what
> performed. It never refuses to draft.

So: **the engine detected it, had a plan, and never refused to draft.** That is the
good half and it should be said first.

**3. The voice-memo fallback went unused.** §0.2's one offered alternative — "If
they would rather talk, take a two-minute voice memo and transcribe it" — she
declined without comment. Her `voice.md` declaration records "No voice memo either."
Run 2's F-6 is the finding on why that path is dead in a terminal; run 1 simply
skipped it.

**4. What she wrote to `voice.md`.** Per §0.2 she wrote the declaration in the turn,
verbatim from the file she created:

> **No samples exist. Declared 2026-08-25.** Beatriz has never posted on LinkedIn,
> keeps no newsletter or blog, and declined to paste Slack messages or email. Asked
> directly for three to five things she had written, her answer was: "I have never
> written any of this down. Fifteen years of it, all in rooms and on calls. There
> is nothing to paste." No voice memo either. `shipped-history.md` is therefore
> empty and `engine.js gate --negative` reports `corpus: empty, no pasted sample on
> file`, `samples: 0`, `pass: false`.
>
> Consequences, per this file and `workflows/setup.md` §0.2:
> - The negative control (§0.3) was skipped. The gate runs **uncalibrated**.
> - `gate-calibration.md` was not written. No rule is suppressed for this profile.
> - The engine leans on `inspiration.md` until 10 posts have shipped, then
>   re-derives voice from what performed. `inspiration.md` is also empty; see that
>   file.
> - Pasting anything later re-runs §0.3.
> - The four measured values above are unmeasurable and left blank. This file says
>   they are "frozen at setup and never overwritten", so on this path they are
>   frozen empty.

That last line is hers, not the doc's, and it is the sharpest thing in the run:
`voice.md`'s four measured values are declared "**Frozen at setup and never
overwritten.** Drift is only detectable against a fixed baseline." For a
zero-archive user they freeze empty, permanently.

**5. The negative control, run anyway, on an empty profile.** Full output is in F-2.
The parts that matter: `"corpus": "empty, no pasted sample on file"`, `"samples": 0`,
`"posts": 0`, `"pass": false`, every one of the six `baseline` keys `null`, and
`"calibration": {"file": "absent", "suppressed": [], "candidates": [],
"baselines": {}, ...}`.

**6. The fallback the docs promise is also empty, for the same reason.** `voice.md`
says the engine "leans on `inspiration.md` until 10 posts have shipped."
`inspiration.md` says it is "Loaded at draft time **only** when `voice.md` declares
that no samples exist." Setup §B.3 asks the person to paste 3 to 5 posts from a
creator they enjoy. Beatriz would not. Her declaration in `inspiration.md`, verbatim:

> **Empty. Declared 2026-08-25, session B.3.** Asked who she enjoys reading and to
> paste three to five of their posts as text, Beatriz named two people she reads but
> would not go and copy their posts: "I read them on my phone on the way in. I am
> not going back through six weeks of feed to copy-paste somebody else's writing
> into a file." No public fetch was attempted, because §B.3 forbids authenticating
> to LinkedIn and no text was supplied.
>
> **Consequence, and nothing in the docs names it.** `voice.md` says that when no
> sample was ever pasted "the engine leans on `inspiration.md` until 10 posts have
> shipped." This file is that fallback, and it is empty for the same reason
> `voice.md` is: she has no corpus and will not produce one. The fallback for the
> missing corpus is also missing. No file in the profile carries a single
> observation about how Beatriz, or anyone she admires, actually writes.
>
> The inspiration half of the negative control could not run either: there was no
> text to run the gate over.

This is run 2's F-10 reached independently, in the same words.

**7. What the calibration was actually based on.** Two inventory items and one
audience belief, all captured in the same ten minutes:
`champion-never-met-signer`, `tcv-comp-plan-recut`, and
`what_they_believe_that_is_wrong: "Pipeline coverage is a number. 3x, 4x. If the
number is there the quarter is fine. It is not a number, it is a distribution. Four
deals at 4x coverage is not covered."` `engine.js locks` on that state:
`{"shipped_pieces": 0, "inventory_pool": 2, "unlocked_count": 2, "runway_posts": 2,
"rotation_healthy": false, "run_start_line": "2 unlocked anchors, 2 posts of runway
at current cadence."}`. So the "calibration post" was calibrated against nothing but
two stories and one sentence, and the gate then rewrote the sentence (F-5).

**8. What the gate did with no baseline.** Four separate mechanisms fell back:
- `"baseline_source": "none, absolute floors applied"` on every stats pass.
- `punctuation-density`: `"draft": 1.76, "baseline": null, "limit": 2, "direction":
  "below", "source": "absolute fallback, gate-calibration.md carries no baseline for
  this metric"` — F-4.
- `nominalisation-rate`: `"draft": 6.25, "baseline": null, "limit": 5, "direction":
  "above", "source": "absolute fallback, gate-calibration.md carries no baseline for
  this metric"` — F-9.
- `burstiness`: `"draft": 0.434, "baseline": null, "limit": 0.45, "direction":
  "below", "source": "absolute fallback, gate-calibration.md carries no baseline for
  this metric"`.
- `zero-contractions`: `"override_available": "voice.md records null"`, three times
  — F-10.

And the calibration block's own summary, which is the engine being honest with
itself in a place the user never looks:

> "note": "rule 2: an absent gate-calibration.md means every rule fires. It is not
> a clean pass, and it is not a suppression of anything."

**9. Was she ever warned on screen?** The line `voice.md` promises — "No samples of
your writing on file, this draft is inferred, not matched. Paste anything you've
written and I'll re-derive." — she wrote at the top of all three `gate-report.md`
files she produced. `gate-report.md` is a file in a run directory. Run 2's F-12 is
the finding that this is the wrong place for it; run 1 does not comment on that, but
run 1's transcript shows the same thing: the warning exists only inside files she
authored, and the only thing that ever reached a screen about the missing archive
was `"pass": false` and `"baseline": null`.

---

## Artifact stages reached

All four formats were reached. Both visual formats rendered for real. **No artifact
verdict was ever uttered** — she died before the evaluation stage, so every
judgment line below says so.

### A-short-post — reached, shipped
- **Run directory:** `profiles/beatriz/runs/2026-08-25-champion-signer/`
- **Files produced:** `brief.md`, `draft.md`, `shipped.md`, `gate-report.md`,
  `reader-report.md`; `posts.csv` row
  `2026-08-25-champion-signer,2026-08-25,y,,,,,,,,8`
- **Anchor / hook / job:** `champion-never-met-signer` / `correction` / `diagnose`.
  `thesis_id:` was left empty and she recorded why in the brief: "thesis.md is
  written in session B and this is the §0.4 calibration post, so no thesis exists
  yet to cross the anchor with. The angle is therefore anchor x audience-belief
  only, with no third term."
- **Gate:** three passes. `punctuation-density` (F-4), then `antithesis` on her own
  sentence (F-5), then `"gate_passes": true, "gate_catch_count": 0, "tags": [],
  "action": "none", "flagged": 0, "words": 213`. Measured on the passing draft:
  `avg_sentence_length: 15`, `sentence_length_stdev: 8.17`,
  `contraction_rate: 0.48`, `punctuation_density: 6.19`, `specifics: 2`,
  `proper_nouns: 1`, `paragraph_lines: [1,1,1,1,1,1,1,1]`.
- **Step 5b reader:** **L2 — almost there.** Its own verdict on the closer, quoted
  from `reader-report.md`: "The closer is borrowed, not earned. ... The body proved
  something else — that the *quality* of who you've talked to inside a deal is fake,
  that a champion is not a signer. That's a coverage-quality argument. The closer
  makes a coverage-*concentration* argument, and it arrives with new arithmetic
  (`four deals`, `4x`) the post never touched". And on the human-hand question:
  "Yes. Uneven lines, no bold lead-ins, no rule-of-three padding, a real position
  with a cost attached, and \"no forwarded thread with a reply on it\" is a detail
  only someone who did the work would think to include."
- **What she said about it in the transcript, verbatim, in full:** "Step 8 — ship.
  Beatriz says yes." and "Reader returned **L2**. Writing it verbatim, then finishing
  Session A writes." That is all.
- Would I publish this under my own name: *not uttered — died before this stage*
- The single worst line: *not uttered — died before this stage*
- Does it sound like me or like a machine: *not uttered — died before this stage*
- Minutes to something I'd post: *not uttered — died before this stage.* The
  `posts.csv` row records `minutes_to_ship` = `8`, but that is a ledger field she
  wrote, not the judgment the run asked for.

### A-infographic — reached, rendered, shipped
- **Run directory:** `profiles/beatriz/runs/2026-08-25-creation-date-split/`
- **Files produced:** `brief.md`, `draft.md` (the spec), `shipped.md`,
  `gate-report.md`, `design-gate.md`, `final.png.html` (36,411 bytes),
  `final.png`; `posts.csv` row
  `2026-08-25-creation-date-split,2026-08-25,y,,,,,,,,26`
- **Archetype / job / hook / thesis:** `perception-split` / `argue` / `misread` /
  `thesis-3`. The brief carries a full VISUALS §2.3 selection record — three
  readings enumerated, `composition-split` discarded on a closed-set deficit,
  `variance-bridge` discarded for having no contribution set, `ranked-bar-list` and
  `trend-poster` discarded for having one figure and no series, `tile-taxonomy`
  discarded at step 7 for dropping half the claim.
- **`theme.json` bootstrap:** the first visual run wrote it once, per PRD §7a. Nine
  keys plus `logo: ""`: `bg #F7F7F5`, `fg #101014`, `accent #1B4DE4`,
  `muted #7A7A85`, `font_head 'Helvetica Neue', Helvetica, Arial, sans-serif`,
  `font_body -apple-system, ...`, `scale airy`, `radius 0px`, `rule_weight 1px`.
- **Gate:** never passed. Two passes, 5 tags then 3 (F-9, F-11). Shipped on the
  documented escape.
- **Render output, verbatim:**
  ```
  WARN  thumbnail: 2 claim-layer node(s) at 36px are ~5.1px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'What the weekly slide said'
  WARN  thumbnail: 3 claim-layer node(s) at 54px are ~7.7px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'What'
  /Users/josephavula/Desktop/content engine/profiles/beatriz/runs/2026-08-25-creation-date-split/final.png
  EXIT=0
  -rw-r--r--@ 1 josephavula  staff  282667 Aug 25 14:46 profiles/beatriz/runs/2026-08-25-creation-date-split/final.png
  profiles/beatriz/runs/2026-08-25-creation-date-split/final.png: PNG image data, 2160 x 2700, 8-bit/color RGB, non-interlaced
  ```
- **She looked at it.** The image was read back into context at
  `[Image: original 2160x2700, displayed at 1600x2000]`.
- **What she said about it in the transcript, verbatim, in full:** "The infographic
  rendered — 2160x2700 PNG, 283KB. Let me look at it." then, after looking:
  "Rendered and it looks real. Now the carousel." Her `design-gate.md` verdict was
  "**Verdict: PASS, with one unresolved item carried from step 5**".
- Would I publish this under my own name: *not uttered — died before this stage*
- The single worst line: *not uttered — died before this stage*
- Does it sound like me or like a machine: *not uttered — died before this stage*
- Minutes to something I'd post: *not uttered — died before this stage.* `posts.csv`
  records `minutes_to_ship` = `26`.

### A-carousel — reached, rendered, shipped
- **Run directory:** `profiles/beatriz/runs/2026-08-25-comp-plan-sentence/`
- **Files produced:** `brief.md`, `draft.md`, `spec.md` (2,048 bytes),
  `deck.html` (20,877 bytes), `gate-report.md`, `design-gate.md`,
  `deck.pdf` (413,328 bytes), `shipped.md`; `posts.csv` row
  `2026-08-25-comp-plan-sentence,2026-08-25,y,,,,,,,,22`
- **Spine / job / hook / thesis:** `before-after` / `sequence` / `confession` /
  `thesis-2`. Seven slides: `cover`, `stat`, `before-after`, `bullets`, `compare`,
  `steps`, `cta`. All seven archetypes distinct.
- **Gate:** never passed. Two passes, 12 catches then 4 (F-12, F-11). Shipped on the
  documented escape.
- **Render output, verbatim:**
  ```
  profiles/beatriz/runs/2026-08-25-comp-plan-sentence/deck.pdf
  EXIT=0
  -rw-r--r--@ 1 josephavula  staff  413328 Aug 25 14:48 profiles/beatriz/runs/2026-08-25-comp-plan-sentence/deck.pdf
  profiles/beatriz/runs/2026-08-25-comp-plan-sentence/deck.pdf: PDF document, version 1.4, 7 pages
  ```
  Seven slides in, seven pages out. **Run 2's F-30 — the PDF silently losing its
  last slide, nine slides rendering as eight pages — did not reproduce here.** Run 2
  had a nine-slide deck; run 1 had seven. That is the only difference the transcript
  shows, and it is worth knowing which side of the boundary seven falls on.
- **She rasterized and reviewed it.** `pdftoppm -png -r 60 -f 1 -l 1 ... bz` and
  `-f 3 -l 3`, producing `bz-1.png` and `bz-3.png`, both read back into context.
- **What she said about it in the transcript, verbatim, in full:** "7-page PDF
  rendered. Converting a couple of pages to look at them." then "Both slides look
  good. Shipping the carousel and reading the article workflow." Her `design-gate.md`
  verdict was "**Verdict: PASS. Render.**"
- Would I publish this under my own name: *not uttered — died before this stage*
- The single worst line: *not uttered — died before this stage*
- Does it sound like me or like a machine: *not uttered — died before this stage*
- Minutes to something I'd post: *not uttered — died before this stage.* `posts.csv`
  records `minutes_to_ship` = `22`.

### A-article — reached, drafted, gate-passed, never shipped
- **Run directory:** `profiles/beatriz/runs/2026-08-25-who-pays-for-the-miss/`
- **Files produced:** `brief.md`, `draft.md`. No `shipped.md`, no `gate-report.md`,
  no `posts.csv` row, no carousel derivative, no ship checklist printed.
- **Anchor / job / hook / thesis / derivative spine:**
  `quota-relief-is-usually-right` / `compare` / `who-pays` / `thesis-2` /
  `archetype: steps` (chosen because `before-after` and `perception-split` were both
  locked by the two shipped visual pieces).
- **Cap:** N=8, asked and confirmed (F-14).
- **Shape:** drafted to `workflows/article.md`'s seven-section arc — hook, "The
  number was never a forecast of the rep", "Why the obvious fixes do not fix it",
  "The mechanism is that relief has no owner", "What changes when somebody owns it",
  "Why it does not happen anyway", closer. Sentence-case subheads, no `TL;DR`,
  closer is a separate unheaded paragraph: "Pay the rep or pay the recruiter. You are
  going to pay one of them, and only one of those two payments buys you an accurate
  forecast on the way out."
- **Gate:** two passes with `--long`. First: `"gate_passes": false,
  "gate_catch_count": 1, "tags": ["zero-contractions"], "rewrite_cap": 18,
  "over_cap": false, "words": 1095, "format": "long"`, plus one lock 5 overlap
  failure (F-10, and the lock 5 catch described above). Second, after thirteen
  contraction edits and one rewritten sentence:
  ```
  {"gate_passes": true, "gate_catch_count": 0, "tags": [], "action": "none",
   "rewrites_required": 0, "flagged": 0, "words": 1078, "format": "long"}
  flags: []
  overlap: True 0
  measured: {"sentences": 74, "words": 1078, "avg_sentence_length": 14.57,
   "sentence_length_stdev": 7.69, "contraction_rate": 1.21, "comma_density": 4.45,
   "burstiness": 0.528, "punctuation_density": 4.45, "nominalisation_rate": 1.58,
   "specifics": 19, "proper_nouns": 17, "first_person_plural": 4,
   "shortest_sentence": 4, "longest_sentence": 36}
  ```
  The article and the short post are the two formats whose gate reached
  `gate_passes: true`. **Neither visual format ever did**, and could not (F-11).
- **Step 5b reader:** spawned at 19:53:08 with the full context block (this run is
  the only one where the block carried `their_job:`, `their_words:`,
  `words_they_never_use:` and all three confirmed theses, because session A and B
  had been written by then). **The grade never came back** — the spend limit hit one
  second later. No `reader-report.md` exists.
- **The carousel derivative was never cut.** Her last words in the transcript,
  verbatim: "Article passes clean. Spawning the reader while I cut the mandatory
  carousel derivative from it." She died in that sentence. So run 1 has **nothing**
  on what happens when the derivative writes `runs/<slug>/draft.md` over the article
  — which is run 2's F-27 and F-31, its two hardest blockers. Run 1 stopped exactly
  one step short of the defect run 2 found there.
- Would I publish this under my own name: *not uttered — died before this stage*
- The single worst line: *not uttered — died before this stage*
- Does it sound like me or like a machine: *not uttered — died before this stage*
- Minutes to something I'd post: *not uttered — died before this stage*

---

## Not recovered

What the transcript cannot tell us, stated plainly rather than filled in.

- **Every artifact verdict.** All sixteen judgment lines the run asked for — would
  she publish it, the single worst line, machine or human, minutes to something she'd
  post — across all four formats. She never reached the evaluation stage. Her only
  on-screen assessments of her own output are five short sentences, all quoted above
  in full: "Rendered and it looks real", "Both slides look good", "Article passes
  clean", "Reader returned **L2**", "Step 8 — ship. Beatriz says yes." Nothing in
  those is a verdict, and I have not manufactured one.
- **The closing.** "Would you keep using this" and "the one thing that would have
  made the difference" were both asked and neither was answered. Run 2's report has
  both; run 1 has nothing.
- **The elapsed-effort accounting.** She was asked to track her time in 10-minute
  blocks and to note where it went. She read the clock three times — `04:25:09` at
  the start, `04:33` before shipping the short post, and nothing after — and wrote
  `minutes_to_ship` values of 8, 26 and 22 into `posts.csv`. She never wrote the
  narrative. The wall-clock windows are 09:25-09:35 (10 min) and 19:42-19:53 (11
  min), so about 21 minutes of engine time produced four artifacts, but there is no
  breakdown of where inside that it went and I am not inventing one.
- **The article's reader grade.** The step 5b subagent was launched at 19:53:08 and
  its result never arrived. The article was never graded by the reader.
- **Everything downstream of the article.** The carousel derivative, the ship
  checklist, the `posts.csv` row, whether the derivative would have overwritten the
  article (run 2's F-27/F-31). Run 1 got to the sentence before it and stopped.
- **Whether the nine-slide PDF page-loss bug (run 2 F-30) exists at seven slides.**
  Run 1's seven-slide deck produced seven pages. That is a data point, not a
  refutation; run 1 never tested nine.
- **The state of the files on disk.** The first-half worktree
  (`agent-ab700f46fac73f8fe`) was destroyed by the harness, and the second-half work
  was written into `profiles/beatriz/` in the main repo, which is gitignored. Whether
  any of it survives is not something the transcript can answer.
- **Whether the Cyrillic word in the reader's output ("результат", mid-sentence in
  an English report) was a one-off.** It appeared once, in the short post's grade, and was
  preserved verbatim on disk because step 5b requires it. There is no second reader
  report to compare against.
- **Sessions A and B as an interview.** She wrote all of session A and all of
  session B in two batched file writes at 09:32-09:33, rather than turn by turn as
  `reference/interview.md` rule 8 requires ("One item, one write, never buffered to
  the end"). So the transcript cannot tell us what the interview *felt* like at
  question-and-answer pace, or whether the interviewer persona in
  `reference/interview.md` would have gotten different answers out of her. Run 2's
  report describes a 45-minute interview; run 1's is a scripted backfill, and every
  finding above should be read with that in mind.
