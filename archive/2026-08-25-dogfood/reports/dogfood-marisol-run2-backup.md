# Dogfood run — Marisol Okonjo-Reyes (`marisol`)

Persona: Director of Perioperative Operations, 400-bed nonprofit hospital system.
14 years in role. Posts on LinkedIn about surgical throughput, staffing ratios,
OR turnover metrics. Lives in Epic and Excel. Did not install Claude Code and
does not know how it works. Will not read a traceback or open a source file.

Started at `README.md`. Log appended live as I go.

---
### F-1 — The install command cannot be run from the directory it ships in
- Where: `README.md`, the install block (first thing in the file)
- Instruction as written: "```\ncp -R \"content engine\" ~/.claude/skills/content-engine\n/content-engine setup\n```"
- What I did: I was already inside the content-engine folder (that is where the person on my team put it and where my terminal opened). I ran the line verbatim.
- What happened:
```
cp: content engine: No such file or directory
EXIT: 1
```
- What I expected: The one command in the file that is "the whole install" to work from where the thing I am installing actually is. There is no `cd` line, no "from the folder above", no `$(dirname)`, nothing. The README does not say where to stand.
- Severity: blocker (I had to guess the working directory; the docs never state it)
- Had to leave the docs: no, but I had to guess. Second attempt from `~/Desktop` worked (`EXIT: 0`).

### F-2 — `/content-engine setup` is not a command that exists after the install
- Where: `README.md`, second line of the install block
- Instruction as written: "/content-engine setup" and "The interview is the only setup step"
- What I did: Ran the copy successfully, then typed `/content-engine setup`.
- What happened: `Unknown skill: content-engine`
- What I expected: An interview to start. The README says the install is two lines and "That is the whole install." Nowhere does it say I have to restart Claude Code for a newly copied skill to be visible, or that copying a folder into a directory is not enough. I do not know what a skill directory is. Someone else set Claude Code up for me.
- Severity: blocker
- Had to leave the docs: yes. I had to go ask the person on my team who installed Claude Code. He said "restart it, or just read the SKILL.md file — that's the thing the slash command runs." Nothing in `README.md` names `SKILL.md` or says the slash command routes to it. The README's own "Spec" section names `content-engine-PRD.md` and `content-engine-VISUALS.md` and skips the one file I actually needed.
- Workaround I am proceeding with: reading `SKILL.md` as the entry point my colleague identified, and following it by hand.

### F-3 — SKILL.md sends me to a directory that is not in the folder I copied
- Where: `SKILL.md`, the paragraph right under the title
- Instruction as written: "`reference/pipeline/` holds each shared step's detail and is loaded on demand, not up front."
- What I did: Went looking for `reference/pipeline/` when I needed the detail of a step. `ls reference/` shows: `ai-tells.md  design-tells.md  engine.js  gate-fixtures  hooks.md  interview.md  reader.md`. There is no `pipeline` directory.
- What happened: `(eval):1: no matches found: reference/pipeline/*.md`
- What I expected: A folder that exists. The README told me "What you copy is the whole engine. Every workflow, every reference file... ship already wired to each other."
- Severity: friction
- Had to leave the docs: no

### F-4 — SKILL.md says a file is not built, and the file is right there
- Where: `SKILL.md`, section 2, the Step 6 paragraph
- Instruction as written: "`reference/design-tells.md` is named by PRD §1.2 and §3 but is not built."
- What I did: Believed it, and assumed the design gate on my infographic and carousel would be running on nothing.
- What happened: `wc -l reference/design-tells.md` -> `780 reference/design-tells.md`. It is built. It is the second-largest doc in the folder.
- What I expected: The file that describes the engine to tell me the truth about what shipped. I have no way to know which other "is not built" claims in that file are also stale, and I am not going to audit them.
- Severity: friction (it would be a blocker if I trusted it and skipped the gate)
- Had to leave the docs: no

### F-5 — The interview persona file numbers the sessions differently than the workflow does
- Where: `reference/interview.md`, "Stop condition"; vs `workflows/setup.md`, "The order, and why it is this order"
- Instruction as written: interview.md: "Session 2 is the remainder and it is resumable." setup.md's table: "0. Front door / A. Raw material / B. Thesis and the rest"
- What I did: Read both, as setup.md told me to ("Load `reference/interview.md` first"). Tried to work out whether "Session 2" meant A, or B, or A+B.
- What happened: setup.md pre-empts it ("Where the two touch, the session boundaries and the closes below govern") so I went with A and B. But the same paragraph still says "Below the session 1 floor" and there is no session 1 either.
- What I expected: One naming scheme. The file that says the old numbers "can no longer" set the boundaries still uses the old numbers three times.
- Severity: polish
- Had to leave the docs: no

### F-6 — "Paste below the fence" has two readings and the file puts its own warning in the way
- Where: `workflows/setup.md` §0.2 and `profiles/_template/voice.md`, Samples section
- Instruction as written: "**Paste below the fence in `voice.md`'s Samples section, never inside it.**" and in voice.md itself: "**Paste below the fence, never inside it.** The block above is the schema..."
- What I did: Took the most literal reading and pasted immediately after the closing fence of the schema block. Which means my five samples now sit between the schema block and the two paragraphs that explain the schema block, and the sentence "The block above is the schema" is now 130 lines away from the block it refers to.
- What happened: It parsed (`samples: 7`), so the literal reading was mechanically right. But the file now reads as a mess and I could not tell in advance whether "below the fence" meant "immediately after the fence" or "after the whole Samples section, before ## Habits."
- What I expected: A marker. A line saying `<!-- paste here -->` or a `## Samples (yours)` heading would have removed the guess entirely. The file spends four sentences warning me about a mistake it could have made impossible with one comment.
- Severity: friction
- Had to leave the docs: no

### F-7 — The negative control returns null for all four values the interview is required to record
- Where: `workflows/setup.md` §0.2 / §0.3, `profiles/marisol/voice.md` "The four measured values"
- Instruction as written: §0.2 — "Then, from those samples, extract and record four measured values: average sentence length, sentence length stdev, contraction rate, and whether they use fragments." voice.md — "**Frozen at setup and never overwritten.** Drift is only detectable against a fixed baseline."
- What I did: Ran `node reference/engine.js gate --negative profiles/marisol` as §0.3 instructs.
- What happened: Real output, verbatim:

      "baseline": {
        "avg_sentence_length": null,
        "sentence_length_stdev": null,
        "contraction_rate": null,
        "uses_fragments": null,
        "burstiness": 0.626,
        "punctuation_density": 3.32
      },

  All four required values are null. Meanwhile, further down the SAME JSON:

      "baselines": {
        "burstiness": 0.626,
        "punctuation_density": 3.32,
        "contraction_rate": 2.84,
        "sentence_length_stdev": 4.69
      },

  Two of the four are measured — under a different key, in a different block, in the same output. `avg_sentence_length` and `uses_fragments` are measured nowhere.
- What I expected: The command that exists to measure my writing to return the four numbers the setup file says to record. The value that is "frozen at setup and never overwritten" is now a number I typed by hand, which makes the whole drift argument circular.
- Severity: friction, verging on blocker for the thing it claims to protect
- Had to leave the docs: no

### F-8 — Which of the two "baseline" blocks goes into gate-calibration.md is undecidable
- Where: `workflows/setup.md` §0.3, the `## baselines` bullet
- Instruction as written: "**`## baselines`.** The command's `baseline`, key for key. **Omit a key the command did not return.**"
- What I did: The command returns a key literally named `baseline` AND a key named `baselines` nested under `calibration`. They are not the same. I took the literal reading — the key spelled `baseline` — and omitted the four nulls, which leaves me writing only `burstiness` and `punctuation_density` and throwing away `contraction_rate: 2.84` and `sentence_length_stdev: 4.69`, which the command demonstrably did return, just in the other block.
- What happened: A calibration file missing two numbers the engine measured, because the instruction names a key in the singular and there is a plural one three lines below it.
- What I expected: The instruction to name the JSON path. `calibration.baselines` versus `baseline` is one word of difference and it changes what gets frozen forever.
- Severity: friction
- Had to leave the docs: no

### F-9 — `contraction_rate: 2.84` — 2.84 of what
- Where: `engine.js gate --negative` output
- What I did: Tried to sanity-check the number against my own writing before freezing it forever.
- What happened: No unit anywhere. 2.84 percent? 2.84 per hundred words? 2.84 contractions total? I write "hasn't", "doesn't", "I'm", "can't", "isn't" pretty freely, so 2.84% would be plausible and 2.84 total would be flatly wrong. I have no way to tell which.
- What I expected: A unit, or a key name that carries one (`contractions_per_100_words`). This is the number the engine will use to decide whether a draft sounds like me.
- Severity: polish
- Had to leave the docs: no

### F-10 — The control "passed" while flagging the most characteristic thing about my writing, and that flag is not suppressible
- Where: `engine.js gate --negative` output, `also_flagged`; `workflows/setup.md` §0.3
- Instruction as written: "**Only `fires` rows.** `also_flagged` never goes in. A redraft or a flag edits no word the person wrote, so there is nothing to suppress."
- What I did: Read the result. `"pass": true`, `"fires": []`. And then:

      "also_flagged": [
        { "sample": "voice.md:linkedin-post-1", "rule": "no-long-sentence", "action": "flag" },
        { "sample": "voice.md:linkedin-post-2", "rule": "no-long-sentence", "action": "flag" },
        { "sample": "shipped-history.md:2026-03-11", "rule": "no-long-sentence", "action": "flag" },
        { "sample": "shipped-history.md:2026-06-02", "rule": "no-long-sentence", "action": "flag" }
      ],

- What happened: Four out of four of my LinkedIn posts tripped `no-long-sentence`, and the workflow tells the interviewer to say nothing about it and record nothing about it. My long sentences are not an accident. "It was first-case on-time start, which was 61%, and every late first case pushes every subsequent case in that room, and the fourth case of the day gets bumped at 4:50pm because anesthesia is out of coverage" is one sentence on purpose — the pile-up IS the point, and cutting it into four sentences kills the argument.
- What I expected: The negative control's whole pitch is "this is the moment the engine visibly becomes theirs." It showed me a clean pass on the rules that rewrite, and buried a 4-for-4 hit on the rule that will nag me on every draft from now on, on the grounds that a nag is technically not an edit. From where I sit that distinction is the engine's, not mine.
- Severity: friction (design, not bug)
- Had to leave the docs: no

### F-11 — Under `nda-default`, every inventory item I capture is immediately deleted from the inventory
- Where: `workflows/setup.md` §0.4 vs `profiles/_template/inventory.md` schema notes
- Instruction as written: setup.md — "Where `identity.md` says `disclosure_posture: nda-default`, the capture-time default is `do-not-publish` and items get cleared actively while the marginal cost is one word." inventory.md — "An item marked `do-not-publish` retires to `inventory-archive.md` immediately, regardless of use or lock." And inventory-archive.md — "**Never loaded at draft time.**"
- What I did: I answered the disclosure question honestly. I work for a nonprofit health system with a real communications policy, so `nda-default` is the correct answer for me. Then I followed the two files literally: default clearance is `do-not-publish`, and `do-not-publish` retires immediately to a file never loaded at draft time.
- What happened: Under the literal reading my `inventory.md` stays permanently empty, the 8-item floor is never reached, and resume step 3 ("`inventory.md` is empty") sends me back to §0.4 forever. The engine would interview me in a circle.
- What I expected: The safe default not to be a trapdoor. "Cleared actively" is presumably meant to happen in the same turn as capture, but neither file says the clearance question is asked *before* the item is written, and inventory.md's own rule says the write is required to carry clearance "set in the same turn."
- Severity: blocker under the literal reading
- Had to leave the docs: no. Workaround: I set `clearance:` explicitly on every item at capture rather than taking the default, and put the one genuinely unpublishable item straight into `inventory-archive.md`. 19 items in inventory, 1 archived.

### F-12 — The CLI's only documentation is inside the source file
- Where: `reference/engine.js`
- Instruction as written: the program's own output — "engine.js: usage: engine.js overlap|lexical|stats|locks|gate|test (see the header)"
- What I did: Ran `node reference/engine.js` with no arguments, which is what I do with any command I don't know.
- What happened: It told me to read the header of a 2,831-line JavaScript file. I do not read source files. I do not know what a header is in this context.
- What I expected: `--help`. I also tried `node reference/engine.js gate --help` and it ignored the flag entirely and ran the fixture suite instead, printing 20 fixtures of JSON I have no use for.
- Severity: blocker for me specifically. Every workflow file in this engine tells me to run this command with a flag, and there is no way to find out what the flags are without opening the code.
- Had to leave the docs: yes, and I stopped at the door. I did not open `engine.js` and so I never found out what `overlap`, `lexical`, `stats`, or `test` do.

### F-13 — §B.3 tells me to run the gate over the inspiration text, and the engine says that corpus isn't in the gate
- Where: `workflows/setup.md` §B.3
- Instruction as written: "**Before discarding that text, run the gate over it** and record in `inspiration.md` how many of the rewrites it demanded they judged to be worse, out of how many fired. This is the inspiration half of the negative control, it can only run here, and more than 2 in 20 means the rule that fired is over-firing."
- What I did: Went looking for the command. The only gate command any doc gave me is `node reference/engine.js gate --negative profiles/<handle>`, and that command's own output says, verbatim:
  "reads: voice.md source: pasted blocks and shipped-history.md. Absence checks run on kind: linkedin post only. **The inspiration corpus is not here**: section 6 discards that text at the end of setup, so its half of the control runs once, at setup, before the discard."
- What happened: I have an instruction that says "run the gate over it," a program that says the inspiration corpus is not in the gate, and no third thing to run. There is no flag documented anywhere that takes arbitrary pasted text.
- What I expected: A command. `gate --inspiration <file>`, something. This is the second half of the negative control the whole front door is built around and it has no mechanism.
- Severity: blocker
- Had to leave the docs: yes, in the sense that I ran `engine.js` with no args and with `--help` looking for one, and got nothing. I did not open the source.

### F-14 — Setup cannot complete for anyone who does not have another creator's posts saved
- Where: `workflows/setup.md` §B.3 and the Resume path, step 5
- Instruction as written: §B.3 — "Never write a creator's mechanics from memory. If you could not read the posts, that creator gets no entry." Resume step 5 — "`thesis.md` holds fewer than 3 corrected arguments with `against:`, or `inspiration.md` is empty. Go to session B."
- What I did: Answered honestly. I read a few periop people and one CFO on my phone at 6am. I do not save posts. I could not paste three of anybody's.
- What happened: Correct behaviour per §B.3 is to write no entry. Correct behaviour per Resume step 5 is then to send me back into session B, where the same question will fail the same way. Nothing in either file offers "no inspiration on file" as a terminal state, the way `voice.md` explicitly offers "No samples on file."
- What I expected: The same escape hatch `voice.md` has. `voice.md` has a whole section for "if no sample was ever pasted, say so here explicitly" and it is careful about it. `inspiration.md` has nothing equivalent and the resume predicate treats empty as unfinished.
- Severity: blocker for the honest answer; friction for me, because I went and dug three issues of a newsletter out of my email to get past it.
- Had to leave the docs: no

### F-15 — The engine picked a hook whose shape demands a number my inventory does not have, and forbids recording the answer
- Where: `reference/hooks.md` (the `cost` pattern), `SKILL.md` §4 and §3, `workflows/short-post.md` step 1
- Instruction as written: hooks.md `cost` — "> `<thing>` cost us `<figure>` and `<duration>`. The `<figure>` was the cheap part." SKILL.md §4 — "If a draft needs a number the inventory does not have, ask for it or cut the claim." SKILL.md §3 — "**The paste path is the one write a draft run may make**... A run drafting from standing inventory writes nothing."
- What I did: Chose `cost` at step 3 because the anchor is a purchase. At step 4 the shape needs a duration and my inventory row has a dollar figure and a usage count, no duration. So: ask, or cut. If I ask, I know the answer (we signed in March 2023 and it went live in November) but the draft run is forbidden from writing that to `inventory.md`, and `inventory.md`'s own header says "nothing factual is ever published that does not trace to a row here."
- What happened: Asking me for a number produces a number that can only exist in the published post and nowhere in the profile, which is precisely the state the whole inventory design exists to prevent. So I cut the claim and changed `hook_id:` to `two-numbers` at step 4 — which `SKILL.md` step 3 says is written "before drafting."
- What I expected: Either the hook selection at step 3 to check the anchor for the slots the pattern needs, or "ask for it" to come with somewhere to put the answer.
- Severity: friction
- Had to leave the docs: no

### F-16 — `gate --report` returns `action: redraft` with `over_cap: false`, and SKILL.md only describes redrafting above the cap
- Where: `SKILL.md` §5 bound 3, vs the actual JSON
- Instruction as written: "**Bounded, and it always produces an artifact.** Cap at 3 rewrites per 200 words, never rewrite the same span twice. **Above the cap**, go back to brief.md and redraft once with the tripped rules injected as drafting constraints." And the JSON's own note: "over_cap true is bound 3: return to brief.md and redraft once".
- What I did: Got `"action": "redraft"`, `"rewrites_required": 0`, `"over_cap": false`, `"redraft_constraints": ["voice-floor","zero-contractions"]`. Nothing is above the cap. There is nothing to rewrite. And the engine is telling me to redraft.
- What happened: SKILL.md's prose covers rewrites-under-cap and rewrites-over-cap and does not cover "zero rewrites, redraft anyway." I acted on the engine's `action` field and redrafted, but I was guessing which of the two documents was in charge.
- What I expected: The document that owns step 5 to describe the verdict the tool actually returns.
- Severity: friction
- Had to leave the docs: no

### F-17 — The gate's best catch was real, and I want to say so
- Where: `gate --report` on my first draft
- What happened: verbatim —

      "flags": [
        { "rule": "voice-floor", "action": "redraft", "metric": "contraction_rate",
          "draft": 0, "baseline": 2.64, "floor": 1.98 },
        { "rule": "zero-contractions", "action": "redraft",
          "detail": "no contraction in 308 words",
          "override_available": "voice.md records 2.64" }
      ]

- Assessment: That is a genuinely good catch and it caught it against my own measured writing rather than against a style opinion. My first draft had zero contractions in 308 words and I write "isn't", "doesn't", "can't" constantly. It read stiff and I could not have told you why. This is the single best thing that happened in the whole run.
- Severity: not a finding. Recorded because it is the thing that would keep me here.

### F-18 — `paragraph_lines` counts newlines, so the uniform-paragraph check is blind on any normal draft
- Where: `workflows/short-post.md` "The shape", and the `stats` block of `gate --report`
- Instruction as written: "**Vary the paragraph lengths.** Every paragraph the same number of lines is a section 9 tell and `gate --report` catches it as `uniform-paragraphs`."
- What I did: Wrote nine paragraphs ranging from three words to sixty.
- What happened: `"paragraph_lines": [1,1,1,1,1,1,1,1,1]`. Every paragraph is one line, because a paragraph in a Markdown file is one unwrapped line. So the metric reads perfectly uniform on a draft that is visibly the opposite, and `uniform-paragraphs` did not fire — not because my paragraphs vary, but because the check cannot see them. Anyone who hard-wraps at 80 columns gets a real measurement; anyone who does not gets `[1,1,1,...]` forever.
- What I expected: Words or sentences per paragraph, not source lines.
- Severity: friction. It is a check that reports a pass it did not earn, which is the exact failure mode SKILL.md spends four paragraphs warning about elsewhere.
- Had to leave the docs: no

### F-19 — `gate-calibration.md` is written and then not read
- Where: `workflows/setup.md` §0.3, `gate --report` output
- What I did: Wrote `profiles/marisol/gate-calibration.md` exactly as §0.3 specifies: front matter with `measured_at: 2026-08-25`, an empty `## suppressed` (nothing fired), and `## baselines` with `burstiness: 0.626` and `punctuation_density: 3.32`.
- What happened: `gate --report` returns

      "calibration": {
        "file": "found",
        "suppressed": [],
        "evidence": [],
        "baselines": {},
        "measured_at": null,
        ...
      }

  It found the file, and read neither the date I put in it nor the two baselines it told me to put in it. `distribution_baselines: {}` is empty too. So the artifact the front door builds its emotional payoff around — "this is the moment the engine visibly becomes theirs" — is, on the evidence of the engine's own output, a file it opens and does not use.
- What I expected: `measured_at: 2026-08-25` and the two baselines echoed back.
- Severity: friction, and the most demoralising one so far, because §0.3 is sold as the step that earns the rest of the interview.
- Had to leave the docs: no

### F-20 — `type: gap` rows are offered as anchors
- Where: `node reference/engine.js locks profiles/marisol`
- What happened: `unlocked_anchors` includes `gap-ambulatory-margin` and `gap-why-fcots-plateaued`, and `runway_posts: 19` counts them. Those two rows exist because `reference/interview.md` rule 5 says "'I don't know' is a real answer. Record it as a named gap." They are records of things I could not answer. The engine is offering them to me as the anchor of a post and counting them as two posts of runway.
- What I expected: `type: gap` excluded from the anchor pool. Nothing in `SKILL.md` step 2 mentions the type at all.
- Severity: friction
- Had to leave the docs: no

### F-21 — A dangling `connects_to:` thesis id passes silently
- Where: `profiles/marisol/inventory.md`, item `pacu-ratio-tradeoff`
- What I did: While answering fast I wrote `connects_to: [savings-that-move-cost-centers, the-constraint-is-a-person]`. There is no thesis with the id `savings-that-move-cost-centers` — I never confirmed one and `thesis.md` holds five other ids.
- What happened: `locks` and `gate --report` both ran clean. Nothing anywhere told me one of my nineteen items points at a thesis that does not exist. `SKILL.md` step 3 says "An angle is one inventory item, crossed with one thesis," so a broken `connects_to:` silently shrinks the angle space for that item.
- What I expected: The same energy `hooks.md` brings to dangling ids — "**The id is the contract.** Rename one and every brief written before the rename points at nothing" — applied to the other place ids point.
- Severity: polish
- Had to leave the docs: no

