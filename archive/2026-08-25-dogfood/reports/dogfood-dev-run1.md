# Dogfood report — Dev Ramanathan (`dev`), run 1 — RECONSTRUCTED FROM TRANSCRIPT

**Persona.** Dev Ramanathan, handle `dev`. Staff platform engineer, 12 years, mid-size SaaS.
Posts about on-call culture, incident review theatre, why SLOs get gamed. Archive: 4 thin
LinkedIn posts, each a link with a sentence on top. No long-form writing. Contract: start at
`README.md` only; cooperative literalist; user not maintainer; write nothing outside
`profiles/dev/`; every source file opened that no doc named counts as a blocker.

**HEAD.** `397eb04` ("The spec stops promising files that do not exist"), repo
`/Users/josephavula/Desktop/content engine`, initially in the worktree
`.claude/worktrees/agent-a470dd2805caf9f51`.

**Window.** 2026-08-25T09:24:46Z to 2026-08-25T19:53:00Z, with a spend-limit gap from
09:35:53Z to 19:42:30Z. Roughly 104 tool calls.

**This report was not written by the agent.** It hit its individual spend limit twice — once at
09:35:53Z and terminally at 19:53:00Z, mid-way through the article stage — and never wrote a
report. Everything below is reconstructed from the surviving transcript
(`agent-a470dd2805caf9f51.jsonl`). Every quoted instruction, command and output is copied from a
tool call or tool result in that transcript. Where the run's report format asks for a judgment the
persona never uttered, the judgment is recorded as `not uttered — died before this stage` rather
than supplied.

**Where it died.** At 19:53:00Z, immediately after writing the 961-word article draft to
`profiles/dev/runs/2026-08-25-the-rotation-is-a-budget/draft.md`. The article was never gated,
never graded, never shipped. A coordinator message at 23:12:20Z asking for the report was answered
only with the spend-limit line.

## Findings

### F-1 — Line 1 of "the whole install" fails from the directory you are standing in
- Where: `README.md`, the fenced block at the top of the file
- Instruction as written:
  ```
  cp -R "content engine" ~/.claude/skills/content-engine
  /content-engine setup
  ```
  followed by "That is the whole install."
- What I did: ran line 1 verbatim from the repo root, which is the only directory I could plausibly be in after obtaining the thing.
- What happened:
  ```
  cp: content engine: No such file or directory
  exit=1
  ```
- What I expected: a block labelled "the whole install" either uses an absolute path or tells me where to `cd`. There is no `cd` anywhere in `README.md`, and the same file says "**There is no published remote yet**, so this is a copy of the directory rather than a clone" — so the reader has no canonical directory name to have produced either.
- Severity: blocker
- Had to leave the docs: no
- also run 2 F-1

### F-2 — `/content-engine setup` does not exist
- Where: `README.md`, line 2 of the install block; "The interview is the only setup step"
- Instruction as written: "`/content-engine setup`"
- What I did: invoked the skill `content-engine` with argument `setup`.
- What happened:
  ```
  <tool_use_error>Unknown skill: content-engine</tool_use_error>
  ```
- What I expected: the second line of a two-line install to work, or the README to say that a freshly copied skill directory is not registered until the session restarts.
- Severity: blocker
- Had to leave the docs: no
- also run 2 F-2. Run 1 differs from run 2 here in one way worth keeping: run 1 never got the copy to succeed at all, so it never tested the restart theory. It went straight to reading files.

### F-3 — README names no fallback, so the only way in is a file README never mentions
- Where: `README.md` → nothing
- Instruction as written: "Every command in that list routes to a file that exists, as of 2026-08-23." The only pointer out of the file is "`content-engine-PRD.md` is the single source of truth. `content-engine-VISUALS.md` is the infographic spec. Build order is PRD section 13."
- What I did: with both install lines dead, I ran `ls -la` on the repo root and opened `SKILL.md` — 29,725 bytes, the router — then `workflows/setup.md` and `reference/interview.md`, which `setup.md` names ("Load `reference/interview.md` first and be that person for the whole run").
- What happened: I got in. `SKILL.md` is not named anywhere in `README.md`; neither is `workflows/`. The only named alternative is a 169 KB PRD, which is not what a person reads to send a LinkedIn post. `SKILL.md` reading it back confirms the intended shape — "| `setup` | `workflows/setup.md` |" — which is exactly the mapping README withholds.
- What I expected: one line in `README.md` saying the workflows are plain markdown under `workflows/` and `SKILL.md` is the router.
- Severity: blocker
- Had to leave the docs: yes — `SKILL.md` was opened on convention knowledge, not because any doc pointed at it
- also run 2 F-3, which graded the same thing friction because it got in; run 1's version is harder because run 1 never got the documented entry point to work at all.

### F-4 — "Paste below the fence" has more than one legal reading, and they are not equivalent
- Where: `workflows/setup.md` §0.2, and `profiles/_template/voice.md` "## Samples"
- Instruction as written, `setup.md`: "**Paste below the fence in `voice.md`'s Samples section, never inside it.** That file already carries the warning and it is mechanical, not stylistic: the engine strips fenced blocks before reading samples, so a sample typed into the schema block parses to zero samples and the negative control in §0.3 reads an empty corpus."
- Instruction as written, `voice.md`: "**Paste below the fence, never inside it.** The block above is the schema, and the engine strips fenced blocks before reading samples, so anything typed into it is discarded without a word. Filling in the fence looks right and leaves you with an empty corpus."
- What I did: took the most literal reading — the first position below the closing fence — and inserted the four samples immediately above the paragraph beginning `**Paste below the fence, never inside it.**`, which is the line directly after the fence.
- What happened: it parsed (`samples: 8`). But the Samples section is laid out as fence, then two paragraphs of prose about the fence, then `## Habits`, so "below the fence" is true of at least three gaps, and the choice is not cosmetic — see F-5, where the other legal position produces a different calibration off the same four samples.
- What I expected: an explicit anchor in the template — a `### pasted` marker, or the schema fence moved to the bottom of the section. The file spends two paragraphs warning about a mistake one marker line would make impossible.
- Severity: blocker under the definition given (I had to guess between readings), though I did not stop: I ran both and kept the doc-faithful one
- Had to leave the docs: no
- also run 2 F-4

### F-5 — Same four samples, two legal placements, two different calibrations
- Where: `workflows/setup.md` §0.3, `node reference/engine.js gate --negative profiles/dev`
- Instruction as written: "Run this once, and hand-write no number that follows: `node reference/engine.js gate --negative profiles/<handle>`" — and, in `voice.md`, "**The four measured values are frozen here and never overwritten**, because drift is only detectable against a fixed baseline."
- What I did: ran the negative control with the samples in the literal position (F-4). The one blocking fire looked wrong (F-7), so I tested causation: moved the identical four sample blocks to the other legal position — the bottom of the Samples section, immediately above `## Habits` — and re-ran. Then restored the doc-faithful placement.
- What happened: two runs, same four samples, same file, different answers.

  Literal placement (directly below the fence):
  ```
  "samples": 8,
  "pass": false,
  "fires": [ { "sample": "voice.md:linkedin-post-4", "fired": ["em-dash"], "rewrites": 1, "blocking": true } ]
  "baselines": { "burstiness": 0.656, "punctuation_density": 4.05, "contraction_rate": 0.45, "sentence_length_stdev": 4.42 }
  ```
  Bottom of the Samples section:
  ```
  samples 8
  fires []
  baselines {'burstiness': 0.678, 'punctuation_density': 3.7, 'contraction_rate': 0.62, 'sentence_length_stdev': 4.23}
  ```
- What I expected: a "frozen baseline" that does not move by 38% on `contraction_rate` (0.45 → 0.62) depending on which paragraph of boilerplate my samples happen to sit above. Either placement is legal under F-4's instruction, and one of them switches off a rule the other leaves on.
- Severity: blocker
- Had to leave the docs: no
- New in run 1. Run 2 has no equivalent finding; run 1 got it because it ran the experiment.

### F-6 — Setup double-counts my archive: I gave four posts, the engine says eight
- Where: `node reference/engine.js gate --negative profiles/dev`, after `voice.md` and `shipped-history.md` were both filled per §0.2
- Instruction as written, §0.2: "**Write each sample to `voice.md` in the turn it arrives**, marked `source: pasted`, verbatim, line breaks and typos kept. Anything already published as a LinkedIn post also goes to `shipped-history.md`, which the verbatim-overlap lock reads until 20 engine posts exist."
- What I did: did exactly that. All four samples are published LinkedIn posts, so all four went into both files, as instructed.
- What happened:
  ```
  "samples": 8,
  "posts": 8,
  ```
  and the fires list names both `voice.md:linkedin-post-1` and `shipped-history.md:2026-03-04` for the same text. The command's own `reads` line says why: "voice.md source: pasted blocks and shipped-history.md."
- What I expected: four. The doc tells me to write the same post to two files and then reports the union as the sample count, so the number the interview shows the person ("Read 4 samples of your writing") cannot come from the command.
- Severity: friction
- Had to leave the docs: no
- also run 2 F-5

### F-7 — The one blocking rewrite fires on the template's own prose, not on anything I wrote
- Where: `node reference/engine.js gate --negative profiles/dev`, `fires[0]`
- Instruction as written, §0.3: "That reports which rules fired on the person's own unedited writing. Every one of those is a rule that would have rewritten a word they wrote." And `voice.md`: "`engine.js gate --negative` reads these to measure how often the language gate fires on this person's own writing, and **zero rewrites** is the pass bar."
- What I did: the fire looked wrong, so I checked whether any of my four samples contains an em dash:
  ```
  --- em/en dashes anywhere in voice.md, with line numbers ---
  83:writing, and **zero rewrites** is the pass bar — a rewrite edits a word they
  --- inside my four pasted sample texts only ---
  []
  ```
- What happened: the only em dash in the whole file is on line 83, inside `voice.md`'s own explanation of the em-dash rule. The engine attributes it to `voice.md:linkedin-post-4` and marks it `"blocking": true`, `"rewrites": 1`. So the pass bar for "zero rewrites on the person's own samples" is failed by the template's sentence about the pass bar. It reproduced after the environment wiped and I rebuilt the profile from scratch at 19:43 — same fire, same sample id.
- What I expected: the control to read only the sample bodies. As it stands the first thing the engine tells a new user about their own voice is a fact about the boilerplate, and §0.3's rule ("A rule is suppressed by evidence or not at all") then makes me suppress `em-dash` on that evidence.
- Severity: blocker
- Had to leave the docs: no
- New in run 1 as a standalone finding. Related to run 2 F-11 ("the promise 'the gate is tuned to your writing' is false, and the gate says so itself") but the mechanism named here — the template's own line being scored as a sample — is not in run 2's list.

### F-8 — The four "measured values" are exactly the four the command returns as null
- Where: `profiles/_template/voice.md` "## The four measured values"; `workflows/setup.md` §0.2
- Instruction as written, §0.2: "Then, from those samples, extract and record four measured values: average sentence length, sentence length stdev, contraction rate, and whether they use fragments." And: "**The four measured values are frozen here and never overwritten**, because drift is only detectable against a fixed baseline." And §0.3: "Run this once, and hand-write no number that follows".
- What I did: ran the command first, looked at its `baseline` block for the four values, found them null, and computed them myself in Python over the four sample texts.
- What happened: the command returns
  ```
  "baseline": {
    "avg_sentence_length": null,
    "sentence_length_stdev": null,
    "contraction_rate": null,
    "uses_fragments": null,
    "burstiness": 0.656,
    "punctuation_density": 4.05
  }
  ```
  My hand computation:
  ```
  sentences: 10 [5, 9, 15, 5, 12, 2, 2, 10, 2, 4]
  avg_sentence_length: 6.6
  stdev: 4.6
  words: 66 contractions: 0 rate: 0.0
  ```
  which I wrote into `voice.md` as `avg_sentence_length: 6.6 / sentence_length_stdev: 4.6 / contraction_rate: 0.0 / uses_fragments: yes`. Note the collision: `calibration.baselines` in the *same* command output reports `contraction_rate: 0.45` and `sentence_length_stdev: 4.42` over the same corpus. Two numbers for the same statistic in one JSON document, and the four the doc names are the four that are null.
- What I expected: §0.3 says hand-write no number that follows, and §0.2 says extract four numbers. The only way to satisfy both is for the command to return them. It returns them as null and returns two other statistics instead.
- Severity: friction (I continued, having hand-written numbers a doc told me not to hand-write)
- Had to leave the docs: no
- also run 2 F-6

### F-9 — §0.3's "show them this" block is a worked example with real rule names in it
- Where: `workflows/setup.md` §0.3, the closing blockquote
- Instruction as written: "Then show them, in one short block and nothing else:
  > Read 4 samples of your writing. Two rules fired on it, so they are off for you: `em-dash` and `rhetorical-fragment`. Everything else is still on. Every rule ships on for everyone; these two are off because they fired on your own words, not because you asked."
- What I did: read it as a template rather than as literal output, because only one rule fired for me (`em-dash`) and `rhetorical-fragment` did not appear anywhere in my control output.
- What happened: nothing broke, but the block is unmarked as an example, in a file that elsewhere says to print things verbatim ("print its `run_start_line` verbatim"). "Read 4 samples" also happens to be wrong for my run, where the command said 8 (F-6).
- What I expected: slots — `<n>` samples, `<rule>` and `<rule>` — the way `reference/hooks.md` does it, which states the convention explicitly: "An example line carries no fact. Slots stay in angle brackets."
- Severity: polish
- Had to leave the docs: no
- also run 2 F-9

### F-10 — "Omit a key the command did not return" versus a key returned as null
- Where: `workflows/setup.md` §0.3, the `## baselines` bullet
- Instruction as written: "**`## baselines`.** The command's `baseline`, key for key. **Omit a key the command did not return.** An absent key means nothing is suppressed and the rule fires, which is the safe direction; a key filled in from somewhere else is a number the engine did not measure."
- What I did: the command returned four keys whose value is `null`. "Did not return" and "returned as null" are different states and the doc addresses only one, so I acted on the most literal reading: the keys *were* returned, so I copied them, nulls and all.
- What happened: `gate-calibration.md` carries
  ```
  avg_sentence_length: null
  sentence_length_stdev: null
  contraction_rate: null
  uses_fragments: null
  burstiness: 0.656
  punctuation_density: 4.05
  ```
  and the reader of that file kept only the two real numbers: `"baselines": {"burstiness": 0.656, "punctuation_density": 4.05}`. So the literal reading was harmless — but I could not know that from the doc, and the other reading was equally available.
- What I expected: the sentence to say which of the two states it means.
- Severity: friction
- Had to leave the docs: no
- also run 2 F-8

### F-11 — I wrote `gate-calibration.md` exactly as §0.3 describes and the engine read it as empty, silently
- Where: `workflows/setup.md` §0.3; `node reference/engine.js gate --report <draft> profiles/dev`
- Instruction as written: "Write `profiles/<handle>/gate-calibration.md` from that output, and from nothing else: **Front matter.** `measured_at:` today. `samples:` the command's `samples`. `corpus: voice.md + shipped-history.md`. `engine_version:` the assertion count at measure time, from `grep -c 'assert\.' reference/engine.js`. **`## suppressed`.** One entry per rule named in any `fires[].fired` list ... **`## baselines`.** The command's `baseline`, key for key."
- What I did: wrote it as described, in the style of every other file in the profile — front matter in a fence, the suppressed entry in a fence, the baselines in a fence. `engine_version: 254`, from `grep -c 'assert\.' reference/engine.js` returning `254`. Then ran the first real gate.
- What happened: the gate found the file and read nothing out of it.
  ```
  "calibration": {
    "file": "found",
    "suppressed": [],
    "evidence": [],
    "baselines": {},
    "measured_at": null,
  ```
  I stripped every ``` line from the file and re-ran, changing nothing else:
  ```
  "file": "found",
  "suppressed": ["em-dash"],
  "evidence": [{"rule": "em-dash", "fired": 1, "sample": "voice.md:linkedin-post-4", ...}],
  "baselines": {"burstiness": 0.656, "punctuation_density": 4.05},
  "measured_at": "2026-08-25"
  ```
  and `stats.distribution_baselines` went from `{}` to `{'burstiness': 0.656, 'punctuation_density': 4.05}`.
- What I expected: `file: "found"` with `suppressed: []` is indistinguishable from a profile with nothing to suppress, which is the exact failure §0.3 warns about in another paragraph — "A missing calibration must never be read as a clean pass." Every other file in the profile puts its schema in a fence; this one must not, and no doc says so. The fence problem from F-4 appears twice in one setup, in opposite directions.
- Severity: blocker
- Had to leave the docs: no
- also run 2 F-28

### F-12 — The reader slice `reader.md` specifies excludes the report format `reader.md` demands
- Where: `reference/reader.md`, "The fresh subagent, and its closed input list"; pipeline step 5b
- Instruction as written: "**Spawn a fresh subagent for every grade.** The blindness is the entire instrument: a grader that knows what you meant grades what you meant. It receives exactly these three things and nothing else: 1. This file, from `## The reader` to `## The four anchor questions`. 2. The context block, rendered per the section below. 3. `runs/<slug>/draft.md`, as text, exactly as it would appear in the feed."
- What I did: cut exactly that slice — `s.index('## The reader\n\n**You are the person')` to `s.index('### The four anchor questions')`, 7,235 characters — wrote it to a file, and gave a fresh general-purpose subagent that file, the rendered context block, and the draft, and nothing else.
- What happened: the slice ends mid-instrument. Its last words are
  ```
  literal slice ends with: " I respect\n  this person more after reading it.* Post it. Include one line naming exactly\n  what earns it, and note that this is the bar and worth keeping as a model of\n  the author's own best work.\n\n"
  ```
  — the end of the L1-L4 bar. The four anchor questions and the `Grade:` / `Four questions:` / `Verdict:` report format both sit *after* the boundary, so the grader never receives them. The subagent returned a usable grade opening `**L4 — fantastic. Post it.**` with quoted, particular feedback, and no four anchor answers and no `Verdict:` line, because it was never told to produce either.
- What I expected: a closed input list that includes the format of the output it requires. I recorded the defect inside the artifact rather than papering over it — `reader-report.md` carries a footer beginning "NOTE FROM THE ROUTER, not from the reader: the four anchor questions and the `Grade:` / `Four questions:` / `Verdict:` report format are absent above because `reference/reader.md`'s closed input list delivers the subagent only "from `## The reader` to `## The four anchor questions`", which excludes both." — and I switched to a fuller slice from there on.
- Severity: blocker (the literal reading and the working reading differ, and the doc states the literal one)
- Had to leave the docs: no
- New in run 1. Run 2's reader finding (F-18, "reader.md is stale about the template it grades against") is a different defect in the same file.

### F-13 — The infographic workflow's first step is "go read a 117 KB spec"
- Where: `workflows/infographic.md`, "Step 4a: select the form"
- Instruction as written: "**`content-engine-VISUALS.md` §2 is the procedure and this file does not restate it.** Read it and run it: §2.3's sixteen steps, §2.5's clearance filter, §2.4's refusal, §2.1's archetype lock. Its §3 catalog is the authority on what each signature requires and what disqualifies it, and it outranks `render/infographic/reference/archetypes.md`, which describes templates rather than signatures."
- What I did: went there, because the workflow named it. Mapped the headings first (`grep -n '^#\{1,3\} '`), read §2 (lines 31-200) and started on the §3 catalog (lines 201-340). §2.3's sixteen steps require evaluating all fifteen signatures, so the whole catalog is in scope.
- What happened: `wc -l content-engine-VISUALS.md` → `920` lines, 117,819 bytes. §3 alone runs from line 201 to line 562 and each of the fifteen entries carries its own Requires / Disqualifies / Parameters / Structure honesty / Thumbnail contract / Breaks when / Named failures. To draft one image I have to run a sixteen-step procedure against a catalog whose own preamble concedes that every ratio threshold in it is unmeasured: "**[UNVERIFIED 2026-08-17, owner Joseph] applies to every *ratio* threshold in this section, and to those only.** ... Each is one form's single reference image generalized into a rule."
- What I expected: the workflow to carry a selection table, or the spec to carry a short-form procedure. Sending the user into the spec is the same move `README.md` makes with the PRD (F-3), one level down.
- Severity: friction (it is in-bounds — the doc named it by name — but it is the largest single read in the run)
- Had to leave the docs: no
- also run 2 F-17

### F-14 — The "frozen" calibration baseline moves again, on the same four samples, because of text I did not write
- Where: `node reference/engine.js gate --negative profiles/dev`, `calibration.baselines`
- Instruction as written: `profiles/_template/voice.md` — "**Frozen at setup and never overwritten.** Drift is only detectable against a fixed baseline."
- What I did: after the environment de-registered the worktree at 19:42 and left only `profiles/`, I rebuilt the profile from what I had recorded — the identical four samples, the identical habits block — and re-ran the negative control to confirm the findings still reproduced.
- What happened: the findings reproduced (`samples 8 pass False`, `em-dash` blocking on `voice.md:linkedin-post-4`), and the baselines had moved a third time:
  ```
  baselines {'burstiness': 0.625, 'punctuation_density': 3.51, 'contraction_rate': 0, 'sentence_length_stdev': 4.11}
  ```
  against `{0.656, 4.05, 0.45, 4.42}` in the morning. `contraction_rate` went 0.45 → 0 and `sentence_length_stdev` 4.42 → 4.11 on identical sample text. The only difference is which other prose is sitting in `voice.md` around them. This is F-5's mechanism showing up a second time, without me trying.
- What I expected: a number described as frozen and used as a redraft threshold (see F-16, where `punctuation_density` 3.51 becomes the limit my draft is judged against) to depend only on the samples it claims to measure.
- Severity: blocker — the number the gate later enforces against my writing is a function of the boilerplate around my writing
- Had to leave the docs: no
- New in run 1.

### F-15 — Lock 5 compares a draft against its own `shipped.md`, in the same run directory
- Where: `node reference/engine.js gate --report`, the `overlap` block; `SKILL.md` step 5
- Instruction as written, the command's own note: "Lock 5 is reported under overlap and is counted nowhere else, so read that block rather than the tag list for it."
- What I did: rebuilt the shipped short-post run — `brief.md` with `status: shipped`, `draft.md`, and `shipped.md` copied from the draft, which is what shipping a post leaves on disk — and regenerated the gate report over `draft.md`.
- What happened:
  ```
  gate_passes False catch 1 flagged 0
  overlap {"ran": true, "check": "overlap", "pass": false, "priors_compared": 5, "ngram": 8,
   "failures": [{"prior": "2026-08-25-action-items-that-never-ship", "words": 141, "text": "41 postmortems last year. ..."}],
   "sentence_similarity": [{"slug": "2026-08-25-action-items-that-never-ship", "matched_sentences": 14, "ratio": 0.875}]}
  ```
  The prior it failed against is the run itself. I proved it by moving `shipped.md` out of the directory and re-running with nothing else changed:
  ```
  PRE-SHIP: gate_passes False catch 1 priors 4 overlap_pass True
  ```
  Priors 5 → 4, overlap False → True. The fifth prior is the draft's own shipped copy.
- What I expected: the verbatim-overlap lock to read prior *pieces*. Once a post is shipped, re-gating it — which is what a retraction, a repurpose, or a review would do — reports it as plagiarising itself at ratio 0.875.
- Severity: blocker
- Had to leave the docs: no
- New in run 1. Run 1 reached shipping and run 2's findings do not include this.

### F-16 — `punctuation-density` demands a redraft because my draft is *less* punctuated than the baseline
- Where: `node reference/engine.js gate --report`, `stats.flags`; the rule's own `source: gate-calibration.md`
- Instruction as written, the command's note: "over_cap true is bound 3: return to `brief.md` and redraft once with `redraft_constraints` as the constraints."
- What I did: read the flag and followed bound 3 literally — one redraft with the tripped rule as the constraint.
- What happened: the same draft that passed cleanly in the morning (`gate_passes: true`, `gate_catch_count: 0`) now trips:
  ```
  tags ['punctuation-density'] action redraft rewrites_required 0
  stats flags [{'rule': 'punctuation-density', 'action': 'redraft', 'metric': 'punctuation_density',
    'draft': 2.13, 'baseline': 3.51, 'limit': 2.633, 'direction': 'below', 'source': 'gate-calibration.md'}]
  ```
  `direction: 'below'` — the rule fires because I used too *few* commas. And the baseline it measures against, 3.51, is the number F-14 shows moving on its own. The redraft I produced to satisfy it reads as worse prose: "which is, exactly, the set of people who cannot authorise the fix", "So we ran 41 of them, and produced a document trail." It cleared the rule at `punct 6.9`, `flags []`.
- What I expected: a punctuation floor derived from a person whose whole documented habit is flat short declaratives ("closes on a flat declarative that reverses the setup", "two-word and three-word fragments used as the closing beat") to not demand more commas than he uses. §0.3 rule 1 also admits only `fires` rows into `gate-calibration.md`, so there is no documented way to suppress a stats flag at all.
- Severity: blocker
- Had to leave the docs: no
- also run 2 F-30

### F-17 — The redraft the gate mandates hard-fails lock 5 against the very post it was redrafting
- Where: bound 3 (redraft once) meeting lock 5 (verbatim overlap), on the same run
- Instruction as written: bound 3, per the gate's note — "The redraft happens once; if it still trips, `gate --compare` picks which of the two ships."
- What I did: gated the mandated redraft.
- What happened: it clears `punctuation-density` and fails overlap against its own source:
  ```
  gate_passes False tags []
  flags []
  punct 6.9 comma 6.9
  ...
  overlap pass False priors 5
  FAIL prior= 2026-08-25-action-items-that-never-ship
  FAIL prior= 2026-08-25-action-items-that-never-ship
  sentence_similarity [{'slug': '2026-08-25-action-items-that-never-ship', 'matched_sentences': 11, 'ratio': 0.917}]
  lexical pass True stats pass True
  ```
  A redraft is by construction mostly the same sentences as the draft it came from, and lock 5's window now contains that draft (F-15). So the one repair path bound 3 offers is closed the moment the piece exists on disk. I kept draft 1 per bound 3 and recorded the dead end in `gate-report.md` under `## unresolved`.
- What I expected: bound 3 and lock 5 to know about each other. As shipped, a redraft demanded by the gate cannot pass the gate.
- Severity: blocker
- Had to leave the docs: no
- New in run 1 in this form. Run 2 F-24 ("the redraft traded one redraft-class tell for another, on a file whose shape I cannot change") is the neighbouring failure, not this one.

### F-18 — On a visual run the language gate flags the renderer's own required syntax
- Where: `workflows/infographic.md` step 4b, and `node reference/engine.js gate --report <R>/draft.md profiles/dev`
- Instruction as written: "**Step 4b: draft the spec.** The spec **is** the draft. Write it to `<R>/draft.md`, which is what the router gates at step 5, so the words on the canvas go through `gate --report` like any other draft." The required contract in the same file begins:
  ```
  ---
  title: <window/PNG title>
  wordmark: <the author's name, read off identity.md>
  ---

  :: <archetype>
  headline: ...
  items:
  - [icon] Field | Field | sub-item; sub-item
  ```
- What I did: wrote the spec into `draft.md` as instructed, with the front matter and the `items:` key the renderer requires, then let the router gate it.
- What happened: `python3 render/infographic/render.py <R>/draft.md --check` said `check: OK`, exit 0. The language gate on the same file said:
  ```
  gate_passes False catch 3 tags ['rhetorical-fragment', 'title-case-header', 'voice-floor'] flagged 0
  ```
  and the hits are the syntax, not the copy:
  ```
  { "tag": "title-case-header", "term": "title: What Incident Review Actually Fails On", "at": 4, "action": "rewrite" },
  { "tag": "rhetorical-fragment", "term": "items:", "at": 403, "action": "redraft" }
  ```
  Two of the three catches fire on fields the renderer requires me to write: the `title:` front-matter line, and the literal four-character string `items:`. Neither reaches the canvas. There is no way to tell the gate it is looking at a render spec, and `infographic.md` explicitly removed the visual path's own language check — "It checked em dashes until 2026-08-20; that copy was removed because `reference/ai-tells.md` at step 5 is the sole authority and on a visual run `draft.md` *is* this spec, so the gate already reads every word that reaches the canvas."
- What I expected: the step-5 gate to read the copy fields and not the grammar. As shipped, the design decision that makes the spec the draft hands the gate a file it cannot parse as prose.
- Severity: blocker
- Had to leave the docs: no
- also run 2 F-23

### F-19 — `voice-floor` demands a redraft of a file whose sentence shape the renderer fixes
- Where: same gate run, `stats.flags`
- Instruction as written: `workflows/infographic.md` step 4b's craft rules — "the headline is three to eight words and never a third line (§5.1)"; and `render/infographic/reference/archetypes.md` on `perception-split` — "`items:` exactly **4** parallel one-liners. `punchline:` is the fifth and it deliberately breaks their format. Four plus one, never five plus five: the asymmetry is the content and a symmetric spec is an ERROR."
- What I did: wrote four parallel one-liners and a punchline, which is exactly what the archetype requires, and gated it.
- What happened:
  ```
  flags [{'rule': 'voice-floor', 'action': 'redraft', 'metric': 'sentence_length_stdev', 'draft': 3.33, 'baseline': 4.6, 'floor': 3.45}]
  ```
  A `redraft` because the sentence-length variance is too low. The archetype's own contract is *parallel* one-liners in a fixed budget ("panel headlines <= 36 chars, statement and items <= 60"), which is a form that cannot have high variance. The rule asks me to break the archetype to satisfy a statistic derived from four LinkedIn posts.
- What I expected: the voice floor to be scoped to prose formats, the way `infographic.md` scoped the em-dash check away from this path.
- Severity: blocker (no legal draft satisfies both the archetype and the floor)
- Had to leave the docs: no
- Closest run 2 analogue: F-24, "on a file whose shape I cannot change".

### F-20 — The thumbnail check warns on a headline that is inside the spec's own word budget
- Where: `python3 render/infographic/render.py ... --html-only`, `check_layout`
- Instruction as written: `workflows/infographic.md` step 6 — "**Four of VISUALS §6.3's five mechanical checks are built** ... thumbnail legibility, tint-against-background, reversed-label contrast, and required-parameter fill. A contrast failure is an ERROR and refuses the render, because 4.5:1 and 3:1 are WCAG rather than taste; the other thresholds warn, since they are `[UNVERIFIED]`."
- What I did: built HTML only, read the warnings, and recorded them in `design-gate.md` rather than acting on them.
- What happened:
  ```
  WARN  thumbnail: 2 claim-layer node(s) at 36px are ~5.1px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'What the org believes'
  WARN  thumbnail: 3 claim-layer node(s) at 54px are ~7.7px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'Incident review is not a'
  ```
  My own verdict file records why I did not act: "the headline is already 7 words and shortening it to raise cap height would cost the `**template**` highlight the claim rests on." The headline sits inside §5.1's 3-to-8-word budget and still trips the legibility floor, and the floor itself is tagged unverified. The two rules do not agree and neither is measured.
- What I expected: a word budget and a legibility floor that are consistent with each other, or a warning that says which one to obey.
- Severity: polish
- Had to leave the docs: no
- New in run 1.

### F-21 — The carousel escapes F-18 entirely, for a reason no doc states as a reason
- Where: `workflows/carousel.md` step 4 versus `workflows/infographic.md` step 4b
- Instruction as written, `carousel.md`: "Two writes, in this order: 1. **`runs/<slug>/draft.md`** — the caption, then the slide copy as plain lines. Step 5's gate reads this file, so every word a reader will see has to be in it: words that never reached `draft.md` are words no gate ever saw. 2. **`runs/<slug>/spec.md`** — the same words in the syntax above, derived."
- What I did: wrote prose to `draft.md` and the derived spec to `spec.md`, then gated `draft.md`.
- What happened: clean pass, first try.
  ```
  gate_passes True catch 0 tags [] flagged 0 words 400
  hits []
  flags []
  overlap pass True failures [] warnings []
  ```
  The same words, in the same run, on the same profile, that fail three catches when they are written as a render spec (F-18). The only difference is which file the syntax lives in: the carousel path keeps the spec out of `draft.md`, the infographic path puts it in. Two workflows, one gate, opposite outcomes, and neither file says the split is load-bearing.
- What I expected: the two visual paths to hand the gate the same kind of file. As it is, whether your spec's field names get flagged as AI tells depends on which format you picked.
- Severity: friction (it worked here; the finding is the asymmetry)
- Had to leave the docs: no
- New in run 1 — run 1 is the only run that got both visual paths through the gate and could compare.

### F-22 — `--check` warns nine times on the shape its own shipped example uses
- Where: `python3 render/carousel/render.py <R>/spec.md --check`
- Instruction as written, `carousel.md` step 4: "On-slide copy is signage, not prose: **headline 3 to 8 words and never a third line** (VISUALS §5.1), lead two short lines, bullet about six words. `--check` warns past those without blocking, and they are also the only overflow protection the layouts have, so an accepted warning is a decision rather than an oversight. A label plus one clause is a good bullet and trips the warn."
- What I did: wrote `steps` items as `Label | detail`, which is the syntax the renderer requires ("`steps` items use a pipe: `Label \| detail`"), and ran `--check`.
- What happened:
  ```
  WARN  slide 3 (steps): bullet > 6 words: 'Burn the budget | Every month, two quart'
  WARN  slide 3 (steps): bullet > 6 words: 'Propose a new denominator | Availability'
  WARN  slide 3 (steps): bullet > 6 words: 'Take the max | The best region becomes t'
  WARN  slide 3 (steps): bullet > 6 words: 'Ship the dashboard | Green the following'
  WARN  slide 6 (statement): bullet > 6 words: 'The person who set the target had left.'
  WARN  slide 6 (statement): bullet > 6 words: 'The people who changed it inherited it.'
  WARN  slide 6 (statement): bullet > 6 words: 'No single step required anyone to be dis'
  WARN  slide 8 (cta): bullet > 6 words: 'A green dashboard is a measurement, not '
  WARN  slide 8 (cta): bullet > 6 words: 'Ask when the definition last changed, an'

  check: warnings only.
  ```
  Nine warnings, and the check counts the label and the detail as one bullet, so the pipe syntax guarantees it. The shipped example for `steps` in `render/carousel/reference/archetypes.md` — `- Write the claim | One sentence, before any form is considered` — trips it too. The doc concedes the warn is expected ("A label plus one clause is a good bullet and trips the warn") in the same paragraph that sets the threshold.
- What I expected: a warning that fires on something I could fix. A check whose documented normal state is nine warnings is nine lines of noise on every deck.
- Severity: polish
- Had to leave the docs: no
- New in run 1.

### F-23 — The article cap's count is not returned by the command that returns everything else
- Where: `workflows/article.md`, "The cap"
- Instruction as written: "The cap is a count over `profiles/<handle>/runs/*/brief.md`, briefs with `status: shipped` only, **exactly the read `engine.js locks` already performs**: > **N = short-post briefs shipped since the most recent brief carrying `format: article`.** With no shipped article, N is every shipped short post."
- What I did: took "exactly the read `engine.js locks` already performs" literally and looked for N in `locks`.
- What happened: it is not there.
  ```
  keys: ['archetype_locked', 'check', 'hook_at_window_limit', 'hook_counts_trailing_20', 'hook_locked_recent',
  'inventory_pool', 'last_shipped', 'locked_anchors', 'never_used_anchors', 'rotation_healthy', 'run_start_line',
  'runway_posts', 'shipped_pieces', 'thesis_hook_pairs_locked_30d', 'unlocked_anchors', 'unlocked_count']
  shipped_pieces 1
  ```
  `shipped_pieces` is every format, not short posts, and there is no per-format breakdown. I had to compute N by hand:
  ```
  --- shipped briefs by format ---
  profiles/dev/runs/2026-08-25-action-items-that-never-ship/brief.md: format: short
  ```
  N = 1.
- What I expected: the command the doc says already performs the read to return the number the doc gates on.
- Severity: friction
- Had to leave the docs: no
- also run 2 F-26

### F-24 — The documented refusal prints a literal `<slug>`, because there is nothing to name
- Where: `workflows/article.md`, "The cap", the refusal
- Instruction as written: "**The refusal follows PRD section 3's repurpose refusal and returns angles rather than a no.** Print `N short posts shipped since <slug>, cap is 8`, then three short-post angles read off live inventory state."
- What I did: printed it as written, with N = 1.
- What happened:
  ```
  === /content-engine article on-call staffing ===

  1 short posts shipped since <slug>, cap is 8

  Three short-post angles off live inventory instead:

  1. page-at-0340 x thesis-4 -> the 40-minute lookup and the 4-minute fix; aimed at
     the belief that on-call pain is a tooling gap.
  2. never-froze-a-deploy x thesis-2 -> four times at zero budget, zero deploy
     freezes; aimed at the belief that an SLO is a commitment.
  3. two-years-no-oncall x thesis-3 -> two years with no rotation at all and
     nothing died; aimed at what they are tired of hearing about ownership.
  ```
  `<slug>` stays literal, because the definition of N is "since the most recent brief carrying `format: article`" and I have never shipped an article — which is precisely the state every first-time user is in. The doc's own next sentence anticipates the case ("With no shipped article, N is every shipped short post") and the refusal string does not. "1 short posts" is also ungrammatical for the only value of N a new user can have.
- What I expected: two strings — one for "no article yet" and one for "since `<slug>`" — since the first is the state everybody starts in.
- Severity: friction (it prints, it just prints a placeholder to a human)
- Had to leave the docs: no
- also run 2 F-25

### F-25 — There is no documented way to say "I want it anyway", so I overrode the cap by hand
- Where: `workflows/article.md`, "The cap" table
- Instruction as written:
  ```
  | N | What the run does |
  | under 8 | **Refuse**, before step 3 crosses a single angle. |
  | 8 or 9 | Print the count and ask. |
  | 10 or more | Print the count and proceed. |
  ```
  and, on the ratio itself: "Capped at **one article per 8 to 10 short posts** | The cap, below. Read before any draft token is spent."
- What I did: ran the refusal (F-24) first, then overrode it myself. In character: *"I've read the cap. There's no documented way to say 'I want it anyway' below 8, so I'm overriding it by hand."* The override is on the record in the brief rather than hidden:
  ```
  cap_override: 2026-08-25. N was 1 against a cap of 8. The workflow refuses under
    8 and documents no override. Overridden by the human, on the record, so the
    format could be exercised.
  ```
- What happened: nothing stopped me, because nothing enforces the cap in code — it is a rule the model applies to itself. So the cap is simultaneously absolute for anyone who obeys the docs (a first-time user cannot write an article for eight posts, roughly two months at one post a week) and free to ignore for anyone editing the brief by hand. `README.md` advertises `/content-engine article <topic>` in the after-setup command list with no hint that it refuses on run one.
- What I expected: either an `--anyway` documented alongside the refusal, or README not advertising a command that cannot run until the ninth post.
- Severity: blocker (I could not continue as a user; I continued as someone willing to hand-edit a brief)
- Had to leave the docs: no
- also run 2 F-25 and F-27

### Seen in the run but not marked as findings

Recorded here rather than promoted, because the transcript shows him receiving this output and never remarking on it. Anyone reading run 2 will recognise most of them; run 1's evidence is real but its reaction is absent.

- **16 `also_flagged` rows on his own four posts**, from the same negative control: `specifics-floor` (redraft) on four samples, `we-with-no-human` (redraft) on three, `no-long-sentence` (flag) on all eight sample ids — where his longest sample sentence is 15 words. Compare run 2 F-7, F-12, F-14, F-29. He wrote none of it into `gate-calibration.md`, correctly, because §0.3 says "**Only `fires` rows.** `also_flagged` never goes in."
- **`rotation_healthy: false`** at the close of session 0, with `run_start_line: "2 unlocked anchors, 2 posts of runway at current cadence."` He printed it and moved on. Compare run 2 F-19.
- **`disclosure_posture: nda-default`** written at §0.4, after which he captured twelve inventory items at `clearance: public` / `anonymized` rather than at the do-not-publish default `inventory.md` specifies for that posture. Only `two-rca-documents` was captured `do-not-publish`, and he archived it to `inventory-archive.md` in the same turn as the schema requires. Compare run 2 F-10.
- **`reference/design-tells.md`, 35,663 bytes**, appeared in his `ls` of `reference/` and `workflows/infographic.md` treats it as the live gate file. Whether he saw `SKILL.md`'s claim that it "is not built" (run 2 F-16) cannot be established: he read `SKILL.md` through a persisted 32.9 KB tool-result file and never quoted that line.
- **`render/infographic/examples/perception-split.md`** was opened alongside the archetype grammar. `workflows/infographic.md` names `render/infographic/reference/method.md`, `.../archetypes.md` and `.../themes.md` by name; it does not name `examples/`. Whether that read was necessary or merely convenient is not determinable from the transcript, so it is not logged as a docs-departure blocker.
- **`hook_id: who-pays`** was written into the article brief. That id does not appear in the portion of `reference/hooks.md` he read (which stops at `handoff`), so whether it exists is unverified either way.

Two things the transcript shows are environment, not engine, and he said so himself:

- The Bash tool refused four compound heredoc commands with "This agent is isolated in the worktree ... but this command is too complex to verify that it stays inside the worktree; break it into plain, separate commands." He worked around it with the Write tool and single-purpose commands: *"the shell is rejecting my compound heredocs, so switching to the Write tool for these files."*
- At 19:42 the worktree was de-registered under him and everything but `profiles/` vanished — `ls: render/: No such file or directory`, `git status --short` returning `?? ../`. He relocated to the main repo, rebuilt the profile from what he had recorded, and labelled it explicitly: *"Environment wiped the profile (not an engine finding)."*

## Artifact stages reached

### A-short-post — reached, gated, graded, shipped
- Run: `profiles/dev/runs/2026-08-25-action-items-that-never-ship/`
- Produced: `brief.md` (`anchor: postmortems-nobody-shipped`, `format: short`, `job: quantify`, `hook_id: number`, `status: shipped`), `draft.md` (141 words), `shipped.md` (a copy of the draft), `gate-report.md` (162 lines), `reader-report.md`. Ledger row appended to `profiles/dev/analytics/posts.csv`:
  ```
  run_slug,shipped_at,shipped_verbatim,run_again,post_url,followers_at_post,reactions,comments,reposts,hit_limit,minutes_to_ship
  2026-08-25-action-items-that-never-ship,2026-08-25T04:33-05:00,yes,,,,,,,,7
  ```
  (He first wrote `10`, then corrected the row to `7` against the wall clock. That is the ledger field, not a persona verdict.)
- Gate, morning run: `"gate_passes": true, "gate_catch_count": 0, "rewrites_required": 0, "words": 141, "overlap_priors_compared": 4`. Gate, evening re-run after `shipped.md` existed: `gate_passes False catch 1`, `punctuation-density`, and the dead end in F-15/F-16/F-17.
- Reader grade at step 5b, from the fresh subagent, verbatim opening: `**L4 — fantastic. Post it.**` It named the best line — *"a backlog owned by whoever had the fewest objections" is the best line in the post and it is not a sentence a machine produces* — and named its own two reservations: *"`exactly the set` is the one line in the post a reader can argue with"* and *"'A review with no budget attached is a review that changes nothing' is the second-best line sitting in the best line's chair."* Those are the grader's words about the draft, not Dev's.
- What he said about it in the transcript: nothing evaluative. His only commentary at this stage is procedural — *"The literal reader slice produced a grade but **no four anchor answers and no `Verdict:` line** — the slice `reader.md` specifies excludes the report format it demands. Logging that; using the fuller slice from here. Writing the report and shipping."*
- Would I publish this under my own name: `not uttered — died before this stage`
- The single worst line: `not uttered — died before this stage`
- Does it sound like me or like a machine: `not uttered — died before this stage`
- Minutes from starting the workflow to something I'd post: `not uttered — died before this stage` (the `posts.csv` field says `7`; that is a ledger entry, not the judgment the run asked for)

### A-infographic — reached, gated, design-gated, rendered for real
- Run: `profiles/dev/runs/2026-08-25-incident-review-invite-list/`
- Selection: `archetype: perception-split`, `job: argue`, `hook_id: misread`, `thesis_id: thesis-1`, anchor `paperwork-beats-remediation`, supports `[severity-levels-are-theatre, postmortems-nobody-shipped, gap-never-seen-it-done-well]`.
- Theme bootstrap, in character: *"I don't have a brand. Dark, monospace, square corners, terminal green. That's what I've got."* → `profiles/dev/theme.json` with `bg #0E1116`, `fg #E6EDF3`, `accent #3FB950`, `muted #8B949E`, `font_head 'SF Mono', Menlo, Consolas, monospace`, `scale dense`, `radius 0px`, `rule_weight 1px`, `logo ""`.
- `--check`: `check: OK`, exit 0. Language gate: 3 catches, two of them on renderer syntax (F-18) plus `voice-floor` (F-19).
- Design gate: `design-gate.md` written before the render, verdict **PASS** with the two thumbnail WARNs recorded and not acted on.
- Render, real:
  ```
  WARN  thumbnail: 2 claim-layer node(s) at 36px are ~5.1px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'What the org believes'
  WARN  thumbnail: 3 claim-layer node(s) at 54px are ~7.7px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'Incident review is not a'
  /Users/josephavula/Desktop/content engine/profiles/dev/runs/2026-08-25-incident-review-invite-list/final.png
  exit=0
  ```
  ```
  -rw-r--r--@ 2 josephavula  staff  252725 Aug 25 14:47 .../final.png
  .../final.png: PNG image data, 2160 x 2700, 8-bit/color RGB, non-interlaced
  ```
  `final.png.html` is 36,297 bytes. He then opened the PNG and looked at it.
- What he said about it, verbatim and complete: *"The image is real and better than I expected, though the accent tint sits on the belief being *refuted* and the bottom panel is mostly dead space."*
- Would I publish this under my own name: `not uttered — died before this stage`
- The single worst line: `not uttered — died before this stage`
- Does it sound like me or like a machine: `not uttered — died before this stage`
- Minutes from starting the workflow to something I'd post: `not uttered — died before this stage`

### A-carousel — reached, gated, design-gated, rendered for real
- Run: `profiles/dev/runs/2026-08-25-i-made-the-dashboard-green/`
- Selection: 8 slides, spine `archetype: steps`, `job: sequence`, `hook_id: confession`, `thesis_id: thesis-2`, anchor `slo-max-across-regions`, supports `[never-froze-a-deploy, metric-outlived-the-intent, oncall-8-to-5]`. Slide order: cover, statement, steps, stat, compare, statement, before-after, cta.
- Produced: `draft.md` (2,331 bytes — caption plus slide copy as prose), `spec.md` (2,023 bytes — the derived render syntax), `gate-report.md` (3,860 bytes), `design-gate.md`, `deck.html` (21,598 bytes), `deck.pdf`.
- `--check`: nine `bullet > 6 words` warnings, `check: warnings only.`, exit 0 (F-22).
- Language gate: `gate_passes True catch 0 tags [] flagged 0 words 400`, `overlap pass True`. He recorded in the gate report that slide 6's headline "Nobody lied. That is the problem." is verbatim from his own 2026-07-30 shipped post, six words, under lock 5's eight-word threshold, and reused deliberately.
- Design-gate read on `deck.html` as text: 8 slides, `class="idx"` 14, `seg on` 36 / `seg` 28, `class="wm"` and `class="mark"` 8 each, accent tokens `--accent`, `--accent-deep`, `--accent-light` only. He chased the one `follow` string in the file, found nothing on two greps, and concluded: *"That's my own 'the following week' on slide 3, not a follow bar."* Verdict **PASS**.
- Render, real:
  ```
  /Users/josephavula/Desktop/content engine/profiles/dev/runs/2026-08-25-i-made-the-dashboard-green/deck.pdf
  exit=0
  -rw-r--r--@ 2 josephavula  staff  395895 Aug 25 14:50 .../deck.pdf
  .../deck.pdf: PDF document, version 1.4, 8 pages
  pages: 9
  size bytes: 395895
  ```
  He then rasterized and looked: page 1 via `sips` (`deck-p1.png`, 133,933 bytes), page 3 via `pdftoppm -png -r 72 -f 3 -l 3` (`p3-3.png`), and read both images.
- What he said about it, verbatim and complete: *"Real 8-page PDF. Rasterizing a couple of pages to judge it as Dev would."* then *"Cover and spine slides render well. Now the article."*
- Would I publish this under my own name: `not uttered — died before this stage`
- The single worst line: `not uttered — died before this stage`
- Does it sound like me or like a machine: `not uttered — died before this stage`
- Minutes from starting the workflow to something I'd post: `not uttered — died before this stage`

### A-article — draft written, then death
- Run: `profiles/dev/runs/2026-08-25-the-rotation-is-a-budget/`
- Produced: `brief.md` (`anchor: oncall-8-to-5`, `format: article`, `job: diagnose`, `hook_id: who-pays`, `thesis_id: thesis-3`, `archetype:` empty, `status: drafted`, plus the `cap_override:` line quoted in F-25 and an `outside_world_anchor: none available` line) and `draft.md`, `961 words` per `wc -w`. Six sentence-case subheads: "Headcount is a number and load is a feeling", "The description that survives planning", "The lookup, not the fix", "Three changes, none of them a tool", "The obligation nobody wants". Closer: "The rotation is not a schedule. It is a budget nobody has agreed to fund."
- The draft was **never gated**. No `gate-report.md`, no reader grade, no `shipped.md`, no `posts.csv` row. `workflows/article.md`'s two other hard requirements — the newsletter ship checklist and the mandatory carousel derivative from the same brief ("A run that produces the edition alone is an unfinished run") — were never reached either.
- The spend limit landed 6 seconds after `wc -w` returned. His last output in the run is the string `You've hit your individual spend limit · run /usage-credits to ask your admin for a higher limit`.
- Would I publish this under my own name: `not uttered — died before this stage`
- The single worst line: `not uttered — died before this stage`
- Does it sound like me or like a machine: `not uttered — died before this stage`
- Minutes from starting the workflow to something I'd post: `not uttered — died before this stage`

## Not recovered

What the transcript cannot tell us, stated plainly rather than inferred.

- **Every persona verdict on every artifact.** All four formats reached a stage where the run wanted "would I publish this under my own name", "the single worst line", "does it sound like me or like a machine", and "minutes to ship". He uttered none of the sixteen. The only evaluative sentences he ever produced about his own output are the two quoted in the infographic and carousel sections above, and they are craft observations, not verdicts.
- **The closing paragraph.** "Would you keep using this, in character" and "the one thing that would have made the difference" were never written. Nothing in the transcript stands in for them.
- **Whether four thin samples were enough, in his own words.** The mechanical answer is recoverable — the engine reported `samples: 8` off his four posts (F-6), calibrated `em-dash` off the template's own prose (F-7), returned all four of `voice.md`'s named measurements as `null` (F-8), and later enforced a `punctuation_density` floor of 3.51 derived from that corpus against his own draft (F-16) — and the transcript shows the engine never once said the corpus was too thin. But his judgment on it was never uttered.
- **The article's fate.** No gate report, no reader grade, no derivative carousel, no ship. Whether the 961-word draft would have passed step 5 is unknown; given F-16 and F-19, the transcript supports no prediction either way and none is offered.
- **His reading of the two images.** He opened `final.png`, `deck-p1.png` and `p3-3.png` and looked at all three. Only the two one-line reactions quoted above survive. What he saw on deck pages 1 and 3 beyond "render well" is not recorded.
- **Whether `SKILL.md` said `design-tells.md` "is not built".** He read `SKILL.md` through a 32.9 KB persisted tool-result file and never quoted that region, so run 2 F-16 cannot be confirmed or denied for run 1.
- **The four `also_flagged` rule families.** He received the output and never reacted, so run 1 contributes evidence to run 2's F-7 / F-12 / F-14 / F-29 but no independent finding.
- **Session A and B as conversations.** Both sittings were written straight to disk as file contents in single Python and heredoc calls. There is no transcript of questions asked and answered, so nothing about the interview's pacing, its follow-ups, or how it handled "I don't know" is recoverable — only the twelve inventory items, four theses, the finished `audience.md`, and the `inspiration.md` entry recording that he had no creators to paste ("Honestly? Nobody on LinkedIn. I read a couple of engineering blogs and the SRE book. I do not have LinkedIn posts to paste for you.").
- **The inspiration half of the negative control** never ran, by his own note in `inspiration.md`: "The inspiration half of the negative control could not run: there was no text to run the gate over." Whether the engine should have said something about that is not something he judged.
