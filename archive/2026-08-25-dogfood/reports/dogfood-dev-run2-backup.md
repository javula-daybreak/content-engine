# Dogfood report — Dev Ramanathan (`dev`), staff platform engineer

Persona: 12 yrs, mid-size SaaS. Posts about on-call culture, incident review theater, SLO gaming.
Archive: 4 thin posts (link + one sentence). No long-form writing.
Contract: start at README.md only. Cooperative literalist. No edits outside profiles/dev/.

## Findings

(appended as I go)
### F-1 — The two-line install: line 1 fails from the only directory I could plausibly be in
- Where: `README.md`, the fenced block at the very top (the "whole install")
- Instruction as written:
  ```
  cp -R "content engine" ~/.claude/skills/content-engine
  /content-engine setup
  ```
- What I did: ran `cp -R "content engine" ~/.claude/skills/content-engine` verbatim, from the repo root (the directory I am sitting in after obtaining the thing).
- What happened:
  ```
  cp: content engine: No such file or directory
  exit=1
  ```
- What I expected: a relative path in the one block labelled "That is the whole install" should either be absolute, or the doc should say `cd` where. There is no `cd` anywhere in README.md. The path `"content engine"` only resolves if my cwd is the *parent* of the repo and the repo is named exactly `content engine` — README never says either. And since the README also says "There is no published remote yet, so this is a copy of the directory rather than a clone", the reader has no canonical directory name to have produced.
- Severity: blocker (I cannot complete step 1 as written; I have to guess my own cwd and the repo's own name)
- Had to leave the docs: no

### F-2 — `/content-engine setup` does not exist, even after a correct install
- Where: `README.md`, line 2 of the install block, and the whole "After setup" command list
- Instruction as written: "`/content-engine setup`" and "The interview is the only setup step"
- What I did: typed `/content-engine setup`. Got `Unknown skill: content-engine`. So I fixed F-1 by hand — ran the copy with a real absolute source path so it definitely landed:
  ```
  cp -R "/Users/.../content engine/..." ~/.claude/skills/content-engine
  cp exit=0
  ls ~/.claude/skills/content-engine
  README.md  SKILL.md  archive  content-engine-CORRECTION.md
  content-engine-PRD.md  content-engine-VISUALS.md  profiles  reference  render  workflows
  ```
  Then typed `/content-engine setup` again.
- What happened: `Unknown skill: content-engine` a second time. Skills are enumerated when the session starts; copying a directory into `~/.claude/skills` mid-session registers nothing. (I then deleted the copy again so as not to leave junk in the home dir.)
- What I expected: README is two lines long and calls itself "the whole install". If the second line cannot possibly work in the same session as the first, the README has to say so — one line, "restart Claude Code (or run `/exit` and reopen) so the skill is picked up". Every other skill in `~/.claude/skills` on this machine was registered at startup, so this is not an exotic edge case; it is what happens to *every* first-time installer, 100% of the time.
- Severity: blocker (the documented entry point is unreachable; there is no second path offered)
- Had to leave the docs: no

### F-3 — README names no fallback, so the only way in is a filename README never mentions
- Where: `README.md` → nothing
- Instruction as written: "Every command in that list routes to a file that exists, as of 2026-08-23."
- What I did: took that literally and went looking for the file `/content-engine setup` routes to. README does not name it. It does not name `SKILL.md`, it does not name `workflows/`, it does not say "the commands are documented in X". The only pointer out of README is the last section: "`content-engine-PRD.md` is the single source of truth" — a 169 KB spec, which is not a thing a user reads to send a LinkedIn post.
- What happened: I guessed. `~/.claude/skills/<name>/SKILL.md` is the Claude Code convention, and `ls` showed a `SKILL.md` and a `workflows/setup.md`, so I opened `SKILL.md`. That guess was mine, not the doc's.
- What I expected: one sentence in README: "If the slash command isn't available, the workflows are plain markdown in `workflows/`; `SKILL.md` is the router." Instead the doc's own promise ("routes to a file that exists") is unverifiable by the reader, because the reader is never told the mapping.
- Severity: friction (I got in, but by convention-knowledge a non-engineer would not have)
- Had to leave the docs: no (SKILL.md is arguably in-bounds, but README never sent me there)


### F-4 — "Paste below the fence" — three places that could mean
- Where: `workflows/setup.md` §0.2, and `profiles/_template/voice.md` "## Samples"
- Instruction as written: "**Paste below the fence in `voice.md`'s Samples section, never inside it.**" and in voice.md itself: "**Paste below the fence, never inside it.**"
- What I did: the Samples section is laid out as fence, then two paragraphs of prose *about* the fence, then `## Habits`. "Below the fence" is true of all three gaps. I put the samples at the end of the section, immediately above `## Habits`.
- What happened: it worked (the control read them), but I picked by taste, not by instruction. The literal reading — the line directly below the closing fence — would have wedged four samples between an instruction and its own explanation.
- What I expected: an explicit anchor in the template. A blank `### pasted` marker, or the fence moved to the bottom of the section. The file spends two paragraphs warning me about a mistake it could have made impossible with one marker line.
- Severity: friction
- Had to leave the docs: no

### F-5 — setup double-counts my archive: I gave 4 posts, the engine says 8
- Where: `workflows/setup.md` §0.2 write instruction, then `node reference/engine.js gate --negative profiles/dev`
- Instruction as written: "**Write each sample to `voice.md` in the turn it arrives**, marked `source: pasted`, verbatim, line breaks and typos kept. Anything already published as a LinkedIn post also goes to `shipped-history.md`, which the verbatim-overlap lock reads until 20 engine posts exist."
- What I did: all four of my things are LinkedIn posts, so per that instruction each one went into both files, verbatim, twice.
- What happened:
```
  "corpus": "present",
  "samples": 8,
  "posts": 8,
```
  and `also_flagged` lists every one of my four posts twice, once as `voice.md:linkedin-post-N` and once as `shipped-history.md:<date>`. The command's own `reads` field confirms why: "voice.md source: pasted blocks and shipped-history.md."
- What I expected: 4. I have four posts. §0.3 then tells the engine to write `samples:` "the command's `samples`" into `gate-calibration.md`, so my calibration file will permanently claim it measured 8 samples of my writing when it saw 4. The one number in the system that records how much of me the gate actually read is exactly 2x inflated, and it is inflated *because I followed the write instruction*. For a thin archive that is the difference between "we read enough to tune this" and "we read four sentences."
- Severity: blocker (the doc's write instruction corrupts the doc's own measurement, and neither file warns of it)
- Had to leave the docs: no

### F-6 — voice.md's "four measured values" are exactly the four the command returns as null
- Where: `workflows/setup.md` §0.2; `profiles/_template/voice.md` "## The four measured values"
- Instruction as written: "Then, from those samples, extract and record four measured values: average sentence length, sentence length stdev, contraction rate, and whether they use fragments." And in voice.md: "**Frozen at setup and never overwritten.** Drift is only detectable against a fixed baseline."
- What I did: went looking for those numbers in the only command setup names, `engine.js gate --negative`.
- What happened: the `baseline` block returns precisely those four as null, and returns two *other* things instead:
```
  "baseline": {
    "avg_sentence_length": null,
    "sentence_length_stdev": null,
    "contraction_rate": null,
    "uses_fragments": null,
    "burstiness": 0.532,
    "punctuation_density": 3.55
  }
```
  Two of the four do exist, but under a different key three levels down in `calibration.baselines`, with different neighbours:
```
  "baselines": { "burstiness": 0.532, "punctuation_density": 3.55,
                 "contraction_rate": 1.78, "sentence_length_stdev": 3.91 }
```
  `avg_sentence_length` and `uses_fragments` are returned nowhere by anything.
- What I expected: to be able to fill the one block in my profile labelled "frozen forever." I cannot. Either I leave the four blank permanently — and voice.md says drift detection depends on them — or I compute them by hand, which §0.3 forbids two paragraphs later ("Run this once, and hand-write no number that follows"). And the two I *could* copy are unitless: is `contraction_rate: 1.78` a percentage, a per-hundred-words rate, or a raw count? Nothing says.
- Severity: blocker (I had to guess between "leave the frozen baseline empty forever" and "hand-write a number the docs forbid")
- Had to leave the docs: no

### F-7 — the calibration told me "the good outcome" while 21 rules flagged my own writing, 8 of them as `redraft`
- Where: `workflows/setup.md` §0.3, the two rules "**Only `fires` rows.** `also_flagged` never goes in" and "If nothing fired, say that instead, and say it is the good outcome: the gate never touched a word they wrote, so nothing needed switching off."
- Instruction as written: "A redraft or a flag edits no word the person wrote, so there is nothing to suppress."
- What I did: ran the control, got `fires: []` and `pass: true`, and followed the instruction — wrote a `gate-calibration.md` with an empty `## suppressed` and prepared to tell myself this was the good outcome.
- What happened: `also_flagged` has 21 rows over my 4 posts. Three distinct rules fire on my writing at these rates:
  - `we-with-no-human` — action `redraft` — fired on 6 of 8 sample reads (3 of my 4 posts)
  - `specifics-floor` — action `redraft` — fired on 3 reads
  - `no-long-sentence` — action `flag` — fired on **all 8**
  - `no-fragments` — action `flag` — fired on 5
- What I expected: to be told that. The premise "a redraft edits no word the person wrote" is the wrong way round for a redraft: a rewrite changes a phrase, a **redraft throws away the entire draft and starts over**. So the two rules that fire on three quarters of my archive are the two that will discard whole drafts written in my voice, on every run, forever — and §0.3 forbids the one mechanism that could switch them off, on the grounds that they are harmless. "The gate never touched a word they wrote" is true only if you count word-level edits. A rule that fires on 75% of my corpus and discards the draft is the most expensive kind of false positive in the system, and the calibration step is designed to be blind to it.
  Concretely: `no-long-sentence` fired on 8 out of 8. Every sentence I have ever published trips it. And nothing about that reaches my calibration file.
- Severity: blocker (the setup step whose entire stated purpose is "the engine visibly becomes theirs" reports a clean pass on a corpus where 100% of samples tripped a rule)
- Had to leave the docs: no

### F-8 — "Omit a key the command did not return" vs. a key returned as null
- Where: `workflows/setup.md` §0.3, `## baselines`
- Instruction as written: "**`## baselines`.** The command's `baseline`, key for key. **Omit a key the command did not return.** An absent key means nothing is suppressed and the rule fires, which is the safe direction; a key filled in from somewhere else is a number the engine did not measure."
- What I did: two readings. (a) "did not return" = the key is absent from the JSON → include all six, four of them `null`. (b) "did not return" = returned no value → omit the four nulls, write two keys. I took (a), the literal one, and wrote `avg_sentence_length: null` into my profile.
- What happened: I now have a calibration file whose baselines block is two-thirds nulls. Under reading (b) I would have a two-key block. Downstream behaviour differs: the doc says an absent key means "the rule fires," and a `null` key is neither absent nor a number.
- What I expected: the doc to say which. It anticipated the exact question and answered a different one.
- Severity: friction (I acted, but the two readings produce materially different files and the doc distinguishes them by consequence)
- Had to leave the docs: no

### F-9 — §0.3's "show them this" block is a worked example with real rule names, presented as the thing to print
- Where: `workflows/setup.md` §0.3
- Instruction as written: "Then show them, in one short block and nothing else:
  > Read 4 samples of your writing. Two rules fired on it, so they are off for you: `em-dash` and `rhetorical-fragment`. Everything else is still on. Every rule ships on for everyone; these two are off because they fired on your own words, not because you asked."
- What I did: read it as a template, since `em-dash` and `rhetorical-fragment` did not fire for me. But it is not marked as a template — it is a blockquote directly after "show them ... and nothing else," in a file that elsewhere prints things verbatim ("print its `run_start_line` verbatim").
- What happened: a literalist prints a false statement about two rules that never fired. Amusingly, "Read 4 samples" would have been *correct* for me and the engine's own number (8) wrong — see F-5.
- What I expected: `<n>` and `<rule-ids>` placeholders, the way every other schema block in this repo uses angle brackets.
- Severity: polish
- Had to leave the docs: no

### F-10 — `nda-default` archives every item the instant it is written
- Where: `workflows/setup.md` §0.4 question Two, against `profiles/_template/inventory.md` schema notes
- Instruction as written: setup.md — "Where `identity.md` says `disclosure_posture: nda-default`, the capture-time default is `do-not-publish` and items get cleared actively while the marginal cost is one word." inventory.md — "An item marked `do-not-publish` retires to `inventory-archive.md` immediately, regardless of use or lock."
- What I did: I answered the disclosure question the way a platform engineer at a SaaS company answers it — "we have a comms policy, I can't name customers, I can't discuss security incidents" — which is `nda-default`. Then I read the two rules together.
- What happened: they compose into a trap. Under `nda-default` an item's capture-time clearance is `do-not-publish`; an item with `do-not-publish` "retires to `inventory-archive.md` immediately, regardless of use or lock"; and `SKILL.md` step 1 says "Do not load ... `inventory-archive.md`". So every item captured under `nda-default` is archived and unloadable *before* the "cleared actively" step can happen. I only escaped it because I set `clearance:` in the same turn and cleared both items to `public`. Anyone who answers "not sure, park it" on their first two items ends setup with an inventory the engine cannot read and no stated way to un-archive.
- What I expected: the archive rule to be scoped — "an item *changed to* do-not-publish after capture retires immediately" — or the nda-default text to say the capture-time default is a pending state, not the archiving value. As written, the mid-size-SaaS answer to the disclosure question is the answer that breaks the inventory.
- Severity: blocker (two shipped files give contradictory outcomes for the same field value; I had to pick)
- Had to leave the docs: no

### F-11 — the promise "the gate is tuned to your writing" is false, and the gate says so itself
- Where: `workflows/setup.md` "Closing session 0" and §0.3; confirmed by `gate --report` on my first draft
- Instruction as written: setup.md's close, to be said out loud to the user: "You have one post ready to ship and the gate is tuned to your writing."
- What I did: ran the calibration post through the real gate, as §0.4 instructs.
- What happened:
```
  "baseline": { "avg_sentence_length": null, "sentence_length_stdev": null,
                "contraction_rate": null, "uses_fragments": null },
  "baseline_source": "none, absolute floors applied",
  "distribution_baselines": {},
```
  The gate is running on absolute floors, not on me. And it is running on absolute floors *because* of F-6: the four values it wants live in voice.md, voice.md's four values are the four nothing can compute, so `baseline_source` is `none`. The one flag that offered an override said so explicitly:
```
  { "rule": "zero-contractions", "action": "redraft",
    "detail": "no contraction in 159 words",
    "override_available": "voice.md records null" }
```
- What I expected: either the gate to use the numbers `gate --negative` did produce (`burstiness`, `punctuation_density`, and the `contraction_rate: 1.78` sitting in `calibration.baselines`), or setup to refuse to say "tuned to your writing." The chain is: F-6 leaves four nulls → `baseline_source: none` → absolute floors → the personalisation the whole front door exists to deliver is inert, on a fresh install, with samples on file and a calibration file written. Nothing anywhere in the run tells the user this.
- Severity: blocker (the headline product promise does not hold on the happy path, and the doc instructs the engine to assert it anyway)
- Had to leave the docs: no

### F-12 — `we-with-no-human` is a catch-22: it demands a named human, and every other rule forbids me producing one
- Where: `gate --report` on the calibration post, against `SKILL.md` §4 hard rules
- Instruction as written: the flag —
```
  { "rule": "we-with-no-human", "action": "redraft",
    "detail": "1 first-person-plural uses and nobody named" }
```
  — against SKILL.md §4: "**Never invent a fact, number, story, or credential.** Everything factual comes from `inventory.md`. If a draft needs a number the inventory does not have, ask for it or cut the claim."
- What I did: tried to satisfy it. My anchor item is `error-budget-became-quota`. It contains no person. My `identity.md` says `disclosure_posture: nda-default` because I told the interview "I can't name customers." My inventory has two items and zero proper nouns in either — `gate --report` measured `"proper_nouns": 0`.
- What happened: the only legal move left is to delete the word "we," which means deleting the fact that this happened to a team rather than to me alone. Bound 2 of the gate says "**Substitute, never subtract.** ... Splitting the sentence, deleting the clause, or dropping the punctuation is not a valid rewrite." I did it anyway, because there is no third option: I changed "We put a 99.9% SLO on the API" to "I put a 99.9% SLO on the API," which is a slightly less true sentence. The gate made my post less accurate.
- What I expected: this rule to be suppressible for a profile whose inventory contains no people. Instead — see F-7 — it is a `redraft`-class rule, and §0.3 forbids redraft-class rules from ever entering `gate-calibration.md` on the theory that they "edit no word the person wrote." It fired on 6 of my 8 sample reads in the negative control. So the single most reliable thing about my writing is the thing the gate will fight me on every single run, permanently, by design.
- Severity: blocker
- Had to leave the docs: no

### F-13 — `gate --report` returns five fields SKILL.md never mentions, and the one it does mention says the opposite
- Where: `SKILL.md` §2 step 5 "gate-report.md" vs the actual JSON
- Instruction as written: "It carries `gate_catch_count`, the per-tell `tags` list, `gate_passes`, and the `rewrite_cap` bound 3 measures against. **Do not recompute any of them by reading.**" And bound 3: "Cap at 3 rewrites per 200 words ... **Above the cap**, go back to brief.md and redraft once."
- What I did: read the JSON to find out what to do next.
- What happened: it returned
```
  "gate_passes": false,  "gate_catch_count": 3,
  "action": "redraft",   "rewrites_required": 0,
  "rewrite_cap": 3,      "over_cap": false,
  "redraft_constraints": ["we-with-no-human", "zero-contractions"],
```
  `action`, `rewrites_required`, `over_cap` and `redraft_constraints` appear nowhere in SKILL.md. And the state they describe is one SKILL.md has no branch for: the gate fails, zero rewrites are required, and the cap was not exceeded — so bound 3's trigger ("above the cap") is false while `action` says `redraft`. SKILL.md's only instruction for a failing draft is "a draft that fails is rewritten before anyone sees it," and there is nothing to rewrite.
- What I expected: SKILL.md to name the field that decides. I had to take the JSON's own embedded `note` — "over_cap true is bound 3" — as authority over SKILL.md's prose, and then ignore it in favour of the `action` field, because otherwise a `gate_passes: false` draft ships unexamined. I guessed.
- Severity: blocker (I could not continue without choosing between the doc and the engine's output)
- Had to leave the docs: no

### F-14 — the rule called `no-long-sentence` fires when there is no long sentence
- Where: `gate --report` and `gate --negative` output
- Instruction as written: `{ "rule": "no-long-sentence", "action": "flag", "detail": "no sentence over 25 words" }`
- What I did: read the tag `no-long-sentence` as "you have a sentence that is too long" and went looking for it. My longest sentence is 21 words (`"longest_sentence": 21`).
- What happened: it is the reverse — it is a *requirement* for at least one long sentence, named as a prohibition. It fired on 8 of 8 of my samples in the negative control, which makes sense: my posts are one sentence long. So the gate's most consistent complaint about my archive is phrased so that a reader will look for exactly the wrong thing.
- What I expected: `needs-long-sentence`, or `uniform-sentence-length`. As it stands the tag lands in my `gate-report.md` where I will read it in six weeks and act on it backwards.
- Severity: friction
- Had to leave the docs: no

### F-15 — short-post.md tells me the gate catches something the gate is explicitly built not to catch
- Where: `workflows/short-post.md` "The shape", vs `reference/ai-tells.md` `### uniform-paragraphs`
- Instruction as written: "**Vary the paragraph lengths.** Every paragraph the same number of lines is a section 9 tell and `gate --report` catches it as `uniform-paragraphs`."
- What I did: wrote a post whose six paragraphs are one line each. `gate --report` measured `"paragraph_lines": [1,1,1,1,1,1]` — perfectly uniform — and reported `gate_passes: true`, `tags: []`.
- What happened: `ai-tells.md` says the rule "**Fires on:** three or more paragraphs all holding the same number of lines, **where that number is two or more**," with an explicit note that the two-line floor is deliberate. So one-line paragraphs are exempt by design, and short-post.md's flat claim is wrong.
- What I expected: the workflow to state the floor, or not to name the tag. I wrote to the rule I was given, got a pass I was told I would not get, and only found the real rule by grepping the tell file.
- Severity: friction
- Had to leave the docs: no (`ai-tells.md` is named by SKILL.md, but short-post.md — the file for my format — did not send me there)

### F-16 — SKILL.md says `reference/design-tells.md` "is not built." It is 35 KB on disk.
- Where: `SKILL.md` §2, step 6 paragraph
- Instruction as written: "the rules are PRD §10.3 and `VISUALS.md` §5, and `reference/design-tells.md` is named by PRD §1.2 and §3 but is **not built**."
- What I did: `ls reference/`
- What happened:
```
  -rw-r--r--@ 1 josephavula staff 35663 Aug 25 08:21 design-tells.md
```
  And `workflows/infographic.md` step 6 depends on it as an existing file: "Read the HTML against `reference/design-tells.md`, which consolidates them with a citation on every entry."
- What I expected: the router and the workflow to agree on whether a file I need exists. Following SKILL.md I would have concluded the design gate cannot run and stopped, per SKILL.md's own rule: "If the workflow file a run needs is not in the repo, say which file is missing and stop."
- Severity: friction (I checked and continued, but the router told me to stop on a false premise)
- Had to leave the docs: no

### F-17 — the infographic workflow's first step is "go read a 117 KB spec"
- Where: `workflows/infographic.md` "Step 4a: select the form"
- Instruction as written: "**`content-engine-VISUALS.md` §2 is the procedure and this file does not restate it.** Read it and run it: §2.3's sixteen steps, §2.5's clearance filter, §2.4's refusal, §2.1's archetype lock."
- What I did: `wc -c content-engine-VISUALS.md` → 117,819 bytes. README lists it under "## Spec", next to a 169 KB PRD, as the thing the *builders* work from: "`content-engine-PRD.md` is the single source of truth. `content-engine-VISUALS.md` is the infographic spec. Build order is PRD section 13."
- What happened: to make one image I have to run sixteen numbered steps that live in a spec document, and there is no user-facing summary anywhere. The same workflow then says "The signature-to-builder map lives in `render/infographic/reference/method.md` and is maintained beside the code," and "`render/infographic/reference/archetypes.md`" holds the grammar and budgets. So one image needs: `infographic.md`, `VISUALS.md` §2 and §3 and §5 and §6, `reference/design-tells.md`, `render/infographic/reference/method.md`, `render/infographic/reference/themes.md`, and `render/infographic/reference/archetypes.md`. Seven files, two of them six-figure byte counts.
- What I expected: `infographic.md` to carry the fifteen archetype names and a one-line "pick this when" for each. It refuses to on the grounds that "a second copy is a second place to go stale" — a maintainer's concern that has been paid for entirely out of the user's time.
- Severity: friction
- Had to leave the docs: no (both were named)

### F-18 — reader.md is stale about the template it grades against
- Where: `reference/reader.md` "The context block, and how it is generated"
- Instruction as written: "**Two of those fields do not exist yet.** `audience.md` has `who:`, `their_job:`, `what_they_believe_that_is_wrong:` and `what_they_are_tired_of_hearing:` and no slot for vocabulary, so `their_words:` and `words_they_never_use:` are a pending change to `profiles/_template/audience.md` and to the audience section of the setup interview."
- What I did: looked at `profiles/_template/audience.md`.
- What happened: both fields are already there —
```
  their_words:
    - <one per line, the words these people actually use for this>
  words_they_never_use:
    - <one per line, the words that would tell them you are not one of them>
```
  and `audience.md`'s own header says so: "The two vocabulary fields, added 2026-08-23, are read by `reference/reader.md`'s context block at pipeline step 5b." So the file that reads them says they do not exist, and the file that holds them says the reader reads them.
- What I expected: to know whether to render those two lines. I rendered without them only because my own were empty at §0.4. Anyone who completed Session A has them filled and would be told by reader.md to drop the two fields the interview just spent time collecting.
- Severity: friction
- Had to leave the docs: no

### F-19 — `rotation_healthy: false` with no number attached, and setup.md forbids telling me the number
- Where: `workflows/setup.md` "Closing session 0" and "Close on the clock, not on a count"
- Instruction as written: "The health flag is the engine's number, not this file's. Read it; never restate it as a count here. A second copy of that threshold can only disagree with the first."
- What I did: finished session A with 8 items, ran `node reference/engine.js locks profiles/dev`:
```
  "inventory_pool": 8, "unlocked_count": 8, "runway_posts": 8,
  "rotation_healthy": false,
  "run_start_line": "8 unlocked anchors, 8 posts of runway at current cadence."
```
- What happened: I am told I am not healthy and never told what healthy is. The `locks` JSON does not return the floor. `run_start_line` does not mention it. The only place the number appears in anything I was pointed at is a *historical note* in `reference/interview.md`'s dead stop-condition block: "the floor is 11 unlocked anchors (`ROTATION_FLOOR`, engine.js:66)". So the target is documented only inside an explanation of why an old wrong target was removed.
- What I expected: `locks` to return `rotation_floor: 11` next to the flag. The anti-duplication argument is sound and the fix is one field in the JSON, not silence. As it stands the engine's advice is "run `/content-engine inventory` twice this week and get there that way," and I have no way to know whether twice is enough.
- Severity: friction
- Had to leave the docs: no

### F-20 — the reader gave my first-ever draft an L4, on a context block with two lines in it
- Where: pipeline step 5b, `reference/reader.md`
- What I did: spawned the fresh subagent exactly as specified — the reader section, the rendered context block, `draft.md`, nothing else. At §0.4 the render rule "omit any line whose source field is empty" reduced the context block to two lines: `who you are` and `what you believe`. No byline, no thesis, no vocabulary, no what-they-are-tired-of.
- What happened: L4, the top level, described in reader.md as "**L4, fantastic** ... this is the bar and worth keeping as a model of the author's own best work." On my first draft, from a two-item inventory, twenty minutes into using the product.
- What I expected: the post is fine — but "a model of the author's own best work" is a statement about a corpus, and there is no corpus. The bar is absolute and person-agnostic by construction ("The four principles, the four anchor questions and the L1-L4 bar below are true for everybody"), so the grade cannot mean what its own label says on run one. And with four of the six audience fields empty, the grader could not perform principle 2's register read at all — reader.md admits this ("it costs it the register read") but the report it returns carries no confidence caveat and neither does the run line.
- What I expected instead: the L4 text to be conditioned on how much of the context block actually rendered, or the report to state which principles it could not apply. It graded confidently on two lines of context and told me I had hit the ceiling.
- Severity: friction (I would trust this grader less on run two, having been told run one was the ceiling)
- Had to leave the docs: no

### F-21 — `minutes_to_ship` is specified as wall clock, and nothing in the run captures the start
- Where: `SKILL.md` §2 step 8
- Instruction as written: "`minutes_to_ship` is wall clock: read the clock once at step 1 and once here, and subtract. Never ask for it, never estimate it."
- What I did: step 1 is "Load profile, check staleness." Nothing in step 1's spec says to record a timestamp, and no file in the run directory has a field for one. `brief.md`'s front matter — the file that exists specifically "so it survives a crash at render" — has no `started_at:`. So the start time lives only in the conversation.
- What happened: I got it right by accident because I happened to have run `date` earlier. On a resumed run, a crashed run, or any run where the model's context rolled, the start clock is gone and the only options left are the two the instruction forbids: ask, or estimate. I initially wrote `25` into `posts.csv` from a bad recollection and had to go back and correct it to `11` against a real clock reading.
- What I expected: `started_at:` in `brief.md`, which is already written at step 3 for exactly this crash-survival reason.
- Severity: friction
- Had to leave the docs: no

### F-22 — the authoritative spec's field names are not the renderer's field names
- Where: `content-engine-VISUALS.md` §3.5 "Parameters", vs `render/infographic/render.py --check`
- Instruction as written: `workflows/infographic.md` step 4a — "Its §3 catalog **is the authority** on what each signature requires and what disqualifies it, and it **outranks** `render/infographic/reference/archetypes.md`, which describes templates rather than signatures." Then VISUALS §3.5 — "**Parameters.** `headline_naive` and `headline_real` (1 line each, <=36 chars, with one word emphasized in each) · `naive_callout` (2 lines, ~16 chars each) · `real_items` (4 single-line items) · `real_punchline` (1 item that deliberately breaks the format of the other four) · `divider_y_pct`."
- What I did: wrote the spec with the authoritative names, `headline_naive` / `headline_real` / `real_items` / `real_punchline`, and ran the check the workflow tells me to run.
- What happened:
```
  $ python3 render/infographic/render.py profiles/dev/runs/2026-08-25-sev-is-a-schedule/draft.md --check
  ERROR block (perception-split): missing required field 'naive_headline'
  ERROR block (perception-split): missing required field 'naive_statement'
  ERROR block (perception-split): missing required field 'real_headline'
  ERROR block (perception-split): missing required field 'punchline'

  4 error(s).
  exit=1
```
  Four of the six parameter names are wrong, three of them by word order (`headline_naive` vs `naive_headline`, `real_items` vs `items`, `real_punchline` vs `punchline`), and a fifth field the renderer requires — `naive_statement` — is not in VISUALS' Parameters list **at all**.
- What I expected: the file I was told is authoritative to name the fields the renderer accepts. Instead the workflow points me at the wrong source, hard, in bold, and the error message does not say where the right names live. I found them by opening `render/infographic/examples/perception-split.md`, which no doc I was reading named.
- Severity: blocker
- Had to leave the docs: **yes** — `render/infographic/examples/perception-split.md`. The question that sent me there was "what are this archetype's actual field names?" and the doc should have answered it in `workflows/infographic.md`, or the ERROR should have printed the accepted field list.

### F-23 — on a visual run the language gate flags the render spec's own required syntax, and cannot be told it is looking at a slide
- Where: `SKILL.md` §2 ("On a visual run, `draft.md` is the render spec") + `workflows/infographic.md` step 4b, against `node reference/engine.js gate --report`
- Instruction as written: SKILL.md, bolded and dated — "**On a visual run, `draft.md` is the render spec.** Added 2026-08-20, when both renderers were vendored and this was true in two workflow files and stated in none. Step 4 writes the Markdown spec `render.py` consumes, so step 5's gate reads every word that reaches the canvas."
- What I did: ran the gate on my infographic spec, which had already passed `render.py --check` clean.
- What happened:
```
  gate_passes = False
  gate_catch_count = 4
  tags = ['no-long-sentence', 'rhetorical-fragment', 'title-case-header', 'zero-contractions']
  action = redraft
  format = short
```
  and the two lexical hits, quoted from the JSON:
```
  { "tag": "title-case-header", "term": "title: What a Sev Level Actually Decides",
    "at": 4, "action": "rewrite" },
  { "tag": "rhetorical-fragment", "term": "items:", "at": 373, "action": "redraft" }
```
  Both hits are the **file format**, not my writing. `items:` is a mandatory key in the renderer's input contract as printed in `workflows/infographic.md`. `title:` is a mandatory key whose stated purpose is "`<window/PNG title>`" — it is never on the canvas at all. `ai-tells.md`'s repair for `rhetorical-fragment` is "fold it into the sentence that follows"; folding `items:` into the next line makes the spec unparseable. Its repair for `title-case-header` is "sentence case, or fold the line into the paragraph under it" — the same.
  Meanwhile `format = short` on an infographic, so the gate also applied short-post prose rules to a slide spec: `zero-contractions` over 102 words of label copy, and `no-long-sentence` on a spec whose longest line is capped at 60 characters by the renderer's own budget check. It measured `"proper_nouns": 15` and `"specifics": 15` off a page of capitalised list items.
- What I expected: a format mode. `SKILL.md` documents exactly one: "Format defaults to short. Pass `--long` on an article." There is no `--infographic`, `--carousel`, or `--visual`. I went to the CLI to check, and then to the file header, which lists every documented invocation:
```
  //   node reference/engine.js gate    --report <draft.md> [profile-dir] [--long]
```
  Two modes, short and long, for four formats. So the single most-emphasised rule of the visual path — the gate reads every word that reaches the canvas — is implemented by pointing a short-post prose checker at a YAML file, and there is no way to stop it from failing on the YAML.
- Severity: blocker (`gate_passes: false` on a spec that is structurally correct, with no documented resolution, and SKILL.md says "**Never show the post before `gate-report.md` exists**" and "a draft that fails is rewritten before anyone sees it")
- Had to leave the docs: **yes** — `reference/engine.js` lines 18-30. The question was "how do I tell the gate this is an infographic and not a short post?" `SKILL.md` should have said "there is no visual format mode; on a visual run ignore tags X and Y" — or `gate --report` should take one.

### F-24 — the redraft traded one redraft-class tell for another, on a file whose shape I cannot change
- Where: `SKILL.md` §2 step 5 bound 3, on the infographic spec
- What I did: pass 1 returned `redraft_constraints: ['rhetorical-fragment', 'zero-contractions']`. I changed `naive_callout: One number. Impact.` to `naive_callout: It's one number.` — the only field in the whole spec with room for a contraction.
- What happened: pass 2 —
```
  tags = ['burstiness', 'no-long-sentence', 'rhetorical-fragment', 'title-case-header']
  action = redraft
  redraft_constraints = ['burstiness', 'rhetorical-fragment']
```
  `zero-contractions` cleared and `burstiness` appeared in its place, both redraft-class. Adding four characters to a 102-word label sheet moved the sentence-length distribution enough to trip a different rule. SKILL.md's bound 3 allows exactly one redraft ("If the redraft still exceeds the cap, ship the better draft with one line naming what is unresolved"), so I shipped with an `unresolved` block. But `over_cap` was `false` on both passes, so strictly bound 3 never armed — see F-13.
- What I expected: on a 102-word spec sheet where 60-character line budgets are enforced by the renderer, the distribution-shape rules (`burstiness`, `no-long-sentence`, `zero-contractions`) are measuring the archetype's grammar, not mine. They should not be in scope for a visual run at all.
- Severity: friction (I had a legal escape via bound 3; the escape is "ship it failing and write a paragraph explaining why")
- Had to leave the docs: no

### F-25 — `workflows/article.md` refuses on run one, and README advertises the command with no hint of it
- Where: `workflows/article.md` "The cap"; `README.md` "After setup"
- Instruction as written: README lists, flat, with no asterisk: "`/content-engine article <topic>`    newsletter edition, plus its carousel". Then article.md — "**N = short-post briefs shipped since the most recent brief carrying `format: article`.** With no shipped article, N is every shipped short post." and the table: "| under 8 | **Refuse**, before step 3 crosses a single angle. |"
- What I did: after setup I had shipped exactly one short post. N = 1.
- What happened: the format refuses. Correctly, per its own spec — the reasoning about the 0.69x measurement is good and I would not want it removed. But README sells me a command that cannot run until I have shipped 8 short posts, and says nothing. At one post a week that is two months before the article command does anything but refuse.
- What I expected: one clause in README — "article unlocks after 8 shipped short posts" — or the refusal line in the command list. Instead the only place the gate is documented is inside the workflow file the refusal comes from.
- Severity: friction
- Had to leave the docs: no

### F-26 — the article cap's count is not returned by the command article.md says returns it
- Where: `workflows/article.md` "The cap"
- Instruction as written: "The cap is a count over `profiles/<handle>/runs/*/brief.md`, briefs with `status: shipped` only, **exactly the read `engine.js locks` already performs**"
- What I did: ran `node reference/engine.js locks profiles/dev` looking for N.
- What happened: the JSON has `shipped_pieces`, `inventory_pool`, `unlocked_anchors`, `unlocked_count`, `locked_anchors`, `never_used_anchors`, `runway_posts`, `rotation_healthy`, `hook_locked_recent`, `hook_counts_trailing_20`, `hook_at_window_limit`, `archetype_locked`, `thesis_hook_pairs_locked_30d`, `last_shipped`, `run_start_line`. `grep -c format` on the output returns **0**. There is no per-format count, and `shipped_pieces` mixes formats — it read 1 after my short post and 2 after my infographic.
- What I expected: `locks` to return the number, since the cap says it already reads it. Instead I have to count `format: short` across `runs/*/brief.md` by hand, which is exactly the self-witnessed read `SKILL.md` bans for every other lock: "Call `reference/engine.js locks <profile>` and quote its JSON. **Do not judge these by reading.**"
- Severity: friction
- Had to leave the docs: no

### F-27 — the structural trap: becoming eligible for an article costs you every anchor you could write one about
- Where: `workflows/article.md` "The cap" against `SKILL.md` §2 step 2 lock 1
- Instruction as written: article.md — under 8 short posts, refuse. SKILL.md lock 1 — "**Anchor item.** Off limits until 10 other pieces have shipped."
- What I did: worked the arithmetic against my actual profile. Session A left me 8 inventory items, which `locks` confirms as 8 unlocked anchors and `runway_posts: 8`.
- What happened: each short post consumes one anchor for the next 10 pieces. Reaching N=8 therefore consumes 8 distinct anchors. At the moment the article command stops refusing, all 8 are locked and `locks` reports `unlocked_count: 0` — and SKILL.md step 2 says "When the inventory is too thin to clear the locks, say so and print the runway number. **Do not draft off a locked anchor.**" So at exactly the inventory size setup's own Session A produces, the article format goes from "refused for cadence" straight to "refused for locks" with no window in between. It needs a 9th item that did not exist while the cap was being satisfied.
- What I expected: the cap and the anchor lock to be checked against each other, or setup's rotation floor (11 anchors) to be presented as the article prerequisite it actually is. Neither file mentions the other.
- Severity: blocker (the format is unreachable at the inventory size the product's own setup targets, and I had to work it out with a pencil)
- Had to leave the docs: no

### F-28 — I wrote `gate-calibration.md` exactly as §0.3 describes and the engine read it as empty, silently
- Where: `workflows/setup.md` §0.3, against `node reference/engine.js gate --report`
- Instruction as written: "- **Front matter.** `measured_at:` today. `samples:` the command's `samples`. `corpus: voice.md + shipped-history.md`. `engine_version:` the assertion count at measure time ... - **`## baselines`.** The command's `baseline`, key for key."
- What I did: §0.3 gives no delimiter and no example file. `gate-calibration.md` is, by design, "the one profile file with no `_template` copy," so there is nothing to copy the shape from. Every other file in `profiles/_template/` — `voice.md`, `identity.md`, `inventory.md`, `audience.md`, `thesis.md`, `shipped-history.md` — puts its `key: value` schema **inside a fenced block**. So I used fences.
- What happened: the gate reported the file as found and its contents as nothing:
```
  "calibration": { "file": "found", "suppressed": [], "evidence": [],
                   "baselines": {}, "measured_at": null, ... }
  "distribution_baselines": {}
```
  No error, no warning. Then I rewrote the same data with `---` YAML front matter and the baselines **unfenced** under the heading, and it parsed:
```
  "baselines": {"burstiness": 0.532, "punctuation_density": 3.55},
  "measured_at": "2026-08-25"
  "distribution_baselines": {"burstiness": 0.532, "punctuation_density": 3.55}
```
- What I expected: the format specified, or a template, or a warning. This is the file whose entire purpose is "this is the moment the engine visibly becomes theirs" (§0.3), and the repo already knows the failure mode by name — `voice.md` warns "the engine strips fenced blocks before reading samples, so anything typed into it is discarded without a word. Filling in the fence looks right and leaves you with an empty corpus." The same trap exists one file over, with no warning, and this time the two conventions are **opposite**: samples go outside the fence, the four measured values go inside it, and the calibration file wants `---` front matter that appears nowhere else in the repo.
- Severity: blocker (the calibration silently did nothing, and `file: "found"` reads as success)
- Had to leave the docs: no — but only because I guessed the second format on the first try. There was nothing to read.

### F-29 — `specifics-floor` counts digits, not specifics, so it forces bad prose
- Where: `gate --report` on two of my seven drafts
- Instruction as written: the flag's own detail — `{"rule": "specifics-floor", "action": "redraft", "detail": "no named people, companies, dates, or numerals"}` — and `workflows/short-post.md` step 3: "**Name things.** People, companies, dates, numerals, all from the anchor and the supports. The specifics floor is a redraft rather than a rewrite, because an abstraction cannot be patched into an instance."
- What I did: wrote a post containing "forty of them", "at 3am", "Forty runbooks", and another containing "Twenty past midnight, eleven people on the call, ... the three years that dependency had existed ... nine days later ... five contributing factors".
- What happened: both reported `"specifics": 0` and `specifics-floor` fired as a **redraft** — throw the whole draft away. Nine specific quantities in the second post, counted as zero, because they are spelled as words. `at 3am` also counted as zero, despite containing a digit.
- What I expected: to be told that. The rule name says specifics and the rule counts digit characters. The fix it forces is to write "11 people on the call" and "3 years" and "5 contributing factors" — which is worse writing, and which the reader subagent, ten minutes later, told me was the *opposite* of what makes a post read human. Two graders in the same pipeline pulling in opposite directions, and only one of them can throw my draft away.
- Severity: blocker (redraft-class, fires on correct prose, and the correction degrades the copy)
- Had to leave the docs: no

### F-30 — `punctuation-density` fires when I use too FEW commas, and it is a redraft
- Where: `gate --report` on two of my seven drafts
- Instruction as written: the flag —
```
  {"rule": "punctuation-density", "action": "redraft",
   "metric": "punctuation_density", "draft": 0.86, "baseline": null, "limit": 2,
   "direction": "below",
   "source": "absolute fallback, gate-calibration.md carries no baseline for this metric"}
```
- What I did: wrote plainly. Short declarative sentences, few commas — which is the single most consistent thing about the four samples I pasted at setup.
- What happened: two of seven drafts fail with `direction: "below"`, meaning **not enough punctuation**, at redraft class. Meanwhile the negative control measured my own archive at `punctuation_density: 3.55`, so the rule is not wrong about me on average — it is wrong about the drafts that are most like me. Note the `source` string, which is F-28 showing up as a consequence: it said my calibration carried no baseline for the metric because the file I wrote per §0.3 was unreadable.
- What I expected: a rule that fires for having too little punctuation to be a flag, not a redraft. "Add commas" is the one instruction I can imagine an editor giving that makes a post read more generated, not less.
- Severity: friction
- Had to leave the docs: no
