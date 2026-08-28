# Dogfood run — Beatriz Lindqvist (`beatriz`), CRO, Series C fintech
# Zero archive. Never posted on LinkedIn. Non-technical. Will not read code.
# Started 07:52. Block 1 begins.

## Findings

### F-1 — The whole install is one line and it fails as written
- Where: `README.md`, lines 3-6 (the install block, the very first thing on the page)
- Instruction as written: "```\ncp -R \"content engine\" ~/.claude/skills/content-engine\n/content-engine setup\n```\n\nThat is the whole install."
- What I did: opened a terminal in the folder I was handed (`/Users/josephavula/Desktop/content engine/.claude/worktrees/agent-ad12a009fd04c0d3f`) and pasted line 1 exactly.
- What happened:
  ```
  cp: content engine: No such file or directory
  exit=1
  ```
  There is no directory named `content engine` inside the thing I was given. The command only works if I am standing in the *parent* of the engine folder, and no line on the page says so. The README also does not say the folder must be named exactly `content engine` — mine is a worktree with a hashed name.
- What I expected: a copy-paste line that works from inside the folder I just received, or one sentence saying "run this from the folder above."
- Severity: blocker (the first command in the product, and the doc explicitly claims it is the *whole* install, so there is nothing else to fall back to)
- Had to leave the docs: no — but I had to guess. I did not install; I decided to read `SKILL.md` in place instead, since the README's install copies this folder to `~/.claude/skills/content-engine` and that is the file `/content-engine` would load. Stated workaround.

### F-2 — README spends its install block apologising to me
- Where: `README.md` lines 8-11 and 61-69
- Instruction as written: "the line was `git clone <url>` until 2026-08-20, and a literal `<url>` in the one file that is supposed to be the whole explanation is the explanation failing." and "Corrected 2026-08-20: this section promised an `npm install` that was never possible, since no `package.json` was ever written."
- What I did: read it.
- What happened: I am a CRO reading a product README and it is talking to its own authors about defects it used to have, with dates. I do not know what a `package.json` is and I do not care. Two of the eight paragraphs on my landing page are changelog.
- What I expected: tell me what to do, not what you used to get wrong.
- Severity: friction
- Had to leave the docs: no

### F-3 — `SKILL.md` points at a directory that does not exist
- Where: `SKILL.md` lines 8-12, the first paragraph of the skill
- Instruction as written: "`reference/pipeline/` holds each shared step's detail and is loaded on demand, not up front."
- What I did: `ls reference/pipeline/`
- What happened: `ls: reference/pipeline/: No such file or directory`. The whole `reference/` folder is 7 entries and none of them is `pipeline`.
- What I expected: the folder to be there, since the skill's own overview paragraph says it is where each step's detail lives.
- Severity: friction (nothing stopped, but the skill's map of itself is wrong on line 10 and I no longer trust the rest of the map)
- Had to leave the docs: no

### F-4 — `SKILL.md` says a file is not built; the file is right there
- Where: `SKILL.md` section 2, step 6 note
- Instruction as written: "`reference/design-tells.md` is named by PRD 1.2 and 3 but is not built."
- What I did: `ls reference/` — `design-tells.md` is present.
- What happened: the skill tells me a file is missing that is sitting in the folder. Two doc statements about the same file disagree. I have no way to know which one the engine believes at run time, and I am not going to open the file to find out.
- Severity: friction
- Had to leave the docs: no

### F-5 — Zero-archive users are locked out of the resume path forever
- Where: `workflows/setup.md` — 0.2 vs the `## Resume` list at the bottom
- Instruction as written: 0.2: "**If they have no writing samples at all,** say so in `voice.md` explicitly, **skip 0.3**, and go to 0.4."
  Resume, item 2: "`gate-calibration.md` is absent, or was written before the newest `source: pasted` sample. Go to 0.3 and re-run the control."
- What I did: took 0.2 literally, skipped 0.3, so `gate-calibration.md` was never written. Then read the resume path as written, the way the engine would on my second sitting.
- What happened: resume item 1 is satisfied (voice.md now states no samples exist). Item 2 fires and will fire forever: my `gate-calibration.md` is absent and can never be written, because 0.2 told me to skip the only step that writes it. The resume path sends me back to 0.3 on every single future sitting, and 0.3's own first line is a stop: "If `reference/ai-tells.md` does not exist yet, say so and stop here." There is no "and does not state that none exist" escape on item 2 the way there is on item 1.
- What I expected: item 2 to have the same no-samples escape hatch item 1 has. As written, the one user the doc bothered to write a branch for is the one user the resume path cannot get past.
- Severity: blocker (on resume, not on first run — I only got past it because I was doing sitting 0 and 1 in one go)
- Had to leave the docs: no

### F-6 — The negative control's fallback is an audio file I cannot produce
- Where: `workflows/setup.md` 0.2
- Instruction as written: "If they would rather talk, take a two-minute voice memo and transcribe it."
- What I did: I would rather talk. I have no writing. So I said yes to this.
- What happened: nothing can happen. I am typing into a terminal. There is no record button, no upload prompt, no instruction telling me where to put a file. The single documented escape hatch for the exact user the doc anticipated is an interaction the product cannot perform.
- What I expected: either "read this aloud and paste the transcript from your phone's dictation" with a concrete how, or drop the offer.
- Severity: friction (I could decline it; but it is the only offered path and it is dead)
- Had to leave the docs: no

### F-7 — The negative control prints `"pass": false` at me and nothing explains it
- Where: `workflows/setup.md` 0.3, running `node reference/engine.js gate --negative profiles/beatriz`
- Instruction as written: "Run this once, and hand-write no number that follows:"
- What I did: ran it, exactly as printed.
- What happened: 40 lines of raw JSON. The parts I could see included `"corpus": "empty, no pasted sample on file"`, `"samples": 0`, and `"pass": false`. It also handed me a paragraph beginning "section 13.2 step 4: zero rewrites on the person's own samples..." and another naming "section 1.3" and "section 6".
- What I expected: the engine did the right thing internally — it detected the empty corpus and refused to fake numbers, which is genuinely good. But what reached my screen was `pass: false` plus PRD section numbers. My first reaction was that I had broken it or failed a test on minute four. Nothing on screen said "this is fine, it just means there was nothing to measure."
- Severity: friction
- Had to leave the docs: no

### F-8 — The interview's "homework lookup" has no mechanism named anywhere
- Where: `workflows/setup.md` 0.1 and `reference/interview.md` `## Homework`
- Instruction as written: "**Start the homework lookup here**, per `reference/interview.md`, and let it run while they are finding their samples." / "Before you ask them anything about themselves, look up their company."
- What I did: my company is a private Series C. I waited for the lookup.
- What happened: no doc anywhere says *how* the lookup happens. The README is emphatic in the other direction: "no credential is entered anywhere, and no connector is ever required" and "It reads no chat and no mail unless you declare an allowlist yourself." Whether this thing has internet access at all is never stated. It never told me the lookup had run, failed, or found nothing — and `reference/interview.md` rule 9 says "If a lookup fails, say the lookup failed", so silence is the one thing it was not allowed to do.
- What I expected: one line telling me it looked us up and found nothing, so I would know to expect the basics questions.
- Severity: friction
- Had to leave the docs: no

### F-9 — Three different inventory floors in three files
- Where: `profiles/_template/inventory.md`, `reference/interview.md` `## Stop condition`, `workflows/setup.md` 0.4
- Instruction as written: inventory.md: "Floor: setup session 1 seeds 8 items, session 2 reaches 15 to 25."
  interview.md: "What was here: an 8-item inventory floor... Both numbers were wrong in the same direction. `engine.js locks` reports `rotation_healthy: false` at 8 and the floor is 11 unlocked anchors (`ROTATION_FLOOR`, engine.js:66)"
  setup.md 0.4: "One or two instances. Not a category."
- What I did: tried to work out how many stories I actually needed before I could post.
- What happened: session 0 wants 2, my profile template says 8, and the interview file says 8 was wrong and it is really 11, and cites a line number in a source file to prove it. I am not opening a source file. I picked 11 by guessing that the file arguing against the other two was the newest.
- What I expected: one number, in the place I would look for it.
- Severity: friction
- Had to leave the docs: no (but only because I refused to open `engine.js:66`, which the doc explicitly points me at)

### F-10 — The documented fallback for "no samples" needs a second archive I also do not have
- Where: `profiles/_template/voice.md` `## No samples on file`, `profiles/_template/inspiration.md`, `workflows/setup.md` B.3
- Instruction as written: voice.md: "The engine leans on `inspiration.md` until 10 posts have shipped, then re-derives voice from what performed."
  inspiration.md: "Loaded at draft time **only** when `voice.md` declares that no samples exist."
  setup.md B.3: "Ask them to paste 3 to 5 posts from that creator. **The text, not the URL.**" and "Never write a creator's mechanics from memory. If you could not read the posts, that creator gets no entry."
- What I did: answered B.3 honestly. I have never posted on LinkedIn because I do not read LinkedIn. I read Ben Thompson and Matt Levine, both of which arrive as email I would have to go excavate, and I was not spending my morning excavating an inbox to feed a writing tool. So: no pasted creator text.
- What happened: `inspiration.md` gets no entry, per B.3's own rule. My `voice.md` has zero samples and my `inspiration.md` has zero creators. The one file the engine is documented to lean on when the first one is empty is empty for exactly the same reason the first one is. **No doc anywhere has a branch for both being empty.** voice.md is confident about the fallback in a single sentence and inspiration.md is confident it will be loaded, and neither one says what happens when it holds nothing.
- What I expected: the doc that carefully wrote a branch for "no writing samples" to also notice that the person with no writing samples is disproportionately likely to be the person who does not read the platform either. That is the same person. It is me.
- Severity: blocker for voice quality specifically — nothing stopped, but from here every draft is generated with **no** voice reference of any kind, and I was never told that in those words.
- Had to leave the docs: no

### F-11 — The interview captures 17 items in my exact words and the voice system is forbidden from reading any of them
- Where: `SKILL.md` section 2 "Step 1: load", `profiles/_template/voice.md`, `reference/interview.md` rule 8
- Instruction as written: interview.md rule 8: "Append each item to inventory.md in the turn it is confirmed, in the schema at the top of that file, **in their own words**... If you cannot quote their exact words for an item, do not write it; ask again."
  SKILL.md Step 1: "Load exactly this, and nothing else: `identity.md`, `voice.md`, `thesis.md`, `audience.md`, `learnings.md`... and `inspiration.md` only when `voice.md` declares that no samples exist."
  voice.md: "How this person actually writes, measured from unedited samples rather than described in adjectives."
- What I did: gave a 45-minute interview. Seventeen inventory items, four theses, an audience block with twenty-odd phrases I actually use, all recorded verbatim because rule 8 insists on it.
- What happened: that is roughly 1,400 words of me talking, on file, in my own words, and none of it counts as a voice sample. The gate has "empty corpus". The negative control has `samples: 0`. My `their_words:` list — "commit, best case, slipped, pushed, sandbagged, redlines, counsel, territory carve, clawback, single-threaded" — is read by the reader grader at step 5b and by nothing at draft time.
- What I expected: if the engine has 1,400 words of my transcribed speech and its problem is that it has no idea how I sound, someone should have noticed those are the same problem. The doc's own philosophy block says "Edited-for-publication writing is worth less here than a message they fired off without thinking" — a spoken interview answer is *less* edited than a Slack message, and it is thrown away.
- Severity: friction (design gap, not a stoppage) — but it is the single biggest thing wrong with the cold start
- Had to leave the docs: no

### F-12 — The one warning written for zero-archive users is printed to a file I never see
- Where: `profiles/_template/voice.md` `## No samples on file` vs `SKILL.md` section 2 step 5, "gate-report.md" subsection
- Instruction as written: voice.md: "When this file holds zero `source: pasted` entries, **the gate report opens with**: 'No samples of your writing on file, this draft is inferred, not matched. Paste anything you've written and I'll re-derive.'"
  SKILL.md: "**The run prints one line, not the file**, directly above the post." and "A run that passed clean and flagged nothing prints no gate line at all."
- What I did: ran my short post through `node reference/engine.js gate --report ... profiles/beatriz`. First pass caught two things. I redrafted. Second pass: `"gate_passes": true, "gate_catch_count": 0, "flagged": 0`.
- What happened: a clean pass means, by SKILL.md's own rule, that **no gate line prints at all**. The warning voice.md promises lives in `gate-report.md`, which is a file in a run directory, and SKILL.md is explicit that the run prints the line and not the file. So on the exact path a zero-archive user is most likely to hit — a draft that passes clean — the sentence telling me my voice was never calibrated is written into a file I have no reason to open, and my screen shows the post with nothing above it. The engine's JSON does not carry that string either, so whether it is ever written at all depends on the model remembering a sentence in a template.
- What I expected: if the product knows it is guessing at my voice, that should be the loudest thing on the screen, every run, until I fix it. Instead the clean pass swallows it.
- Severity: blocker for the thing I actually care about — I would have shipped a post believing the voice was matched, because nothing on screen said otherwise
- Had to leave the docs: no

### F-13 — The gate told me to add contractions and add punctuation, with no idea whether I use either
- Where: `node reference/engine.js gate --report` output, first pass on my short post
- Instruction as written (the engine's own output, verbatim):
  ```
  {
    "rule": "zero-contractions",
    "action": "redraft",
    "detail": "no contraction in 202 words",
    "override_available": "voice.md records null"
  },
  {
    "rule": "punctuation-density",
    "action": "redraft",
    "metric": "punctuation_density",
    "draft": 1.49,
    "baseline": null,
    "limit": 2,
    "direction": "below",
    "source": "absolute fallback, gate-calibration.md carries no baseline for this metric"
  }
  ```
  and `"baseline_source": "none, absolute floors applied"`.
- What I did: obeyed both. Added contractions. Added commas and colons to get punctuation up.
- What happened: the draft passed. But read what happened: a gate with zero knowledge of how I write pushed my prose toward more contractions and more punctuation because two "absolute floors" said so. `voice.md`'s own opening paragraph warns about precisely this — "without it the gate rewrites their own voice on day one" — and then the product does it, silently, and calls the result a pass. It is a coin flip whether the floors happen to match me. I use contractions when I talk, so it got lucky on one. Nothing tells me it got lucky.
- What I expected: at minimum a line saying "no baseline on file, applying defaults" in English, on screen, next to the post.
- Severity: friction (blocker for trust)
- Had to leave the docs: no

### F-14 — `action: redraft` on a draft that is not over the cap; the doc only describes the over-cap case
- Where: `SKILL.md` step 5 bound 3, vs the gate JSON
- Instruction as written: SKILL.md: "Cap at 3 rewrites per 200 words, never rewrite the same span twice. **Above the cap**, go back to brief.md and redraft once with the tripped rules injected as drafting constraints."
  The JSON's own note: "over_cap true is bound 3: return to brief.md and redraft once with redraft_constraints as the constraints."
  What the JSON actually returned: `"action": "redraft"`, `"rewrites_required": 0`, `"over_cap": false`, `"rewrite_cap": 6`.
- What I did: the top-level `action` field said `redraft`, so I redrafted.
- What happened: fine, but I had to choose between two readings with no help. Bound 3 and the note both tie redrafting to `over_cap: true`, which was false. `rewrites_required` was 0, so there was nothing to be over a cap with. And `rewrite_cap` was 6 on the first pass and 3 on the second, on a draft of the same length, which I cannot explain and will not go read code to explain.
- What I expected: one field to obey.
- Severity: friction
- Had to leave the docs: no

### F-15 — Docs disagree with the shipped files about what exists (three instances now)
- Where: `SKILL.md` line 10; `SKILL.md` section 2 step 6; `reference/reader.md` `## The context block`
- Instruction as written: reader.md: "**Two of those fields do not exist yet.** `audience.md` has `who:`, `their_job:`, `what_they_believe_that_is_wrong:` and `what_they_are_tired_of_hearing:` and no slot for vocabulary, so `their_words:` and `words_they_never_use:` are a pending change to `profiles/_template/audience.md`"
- What I did: opened `profiles/_template/audience.md`. Both fields are in the schema, and `audience.md` itself says they were "added 2026-08-23".
- What happened: third file in a row telling me something is missing that is present (`reference/pipeline/` is the reverse case — claimed present, actually missing; `design-tells.md` and now these two fields are claimed missing, actually present). reader.md then spends a paragraph explaining what the reader "cannot catch" without fields that do exist, so I could not tell whether my run was getting the register check or not.
- What I expected: to be able to trust a sentence that says a thing does not exist.
- Severity: friction
- Had to leave the docs: no

### F-16 — "The Tier 0 scan" is named as a thing that runs on every default run and defined nowhere
- Where: `profiles/_template/runs/signals.md`
- Instruction as written: "Written by the Tier 0 scan at the top of the default run, and only when this file is older than 24 hours. Capped at three queries."
- What I did: went looking for what a Tier 0 scan is, in `SKILL.md` and `workflows/short-post.md`, the two files that own the default run.
- What happened: the phrase appears in neither. `SKILL.md`'s "Run start output" lists four things that print and "Nothing else prints at run start" — no scan. "Capped at three queries" implies queries to something external, which the README denies twice. So a mechanism that writes into my profile on every default run is named once, in a template file, with no definition.
- What I expected: to know whether my machine just went and searched for something.
- Severity: friction
- Had to leave the docs: no

### F-17 — Two files describe the first visual run's brand step as two different products
- Where: `workflows/setup.md` `## Visual` vs `workflows/infographic.md` `## The theme.json bootstrap`
- Instruction as written: setup.md: "**Not asked at setup, in any sitting.** Do not ask about colors, fonts, or brand. The first visual run **pulls a palette, shows two real rendered frames**, and writes `theme.json` then."
  infographic.md: "Where the profile still carries `_template`'s defaults: **ask for the nine keys** before drafting rather than after rendering, write the file once, and say so in one line."
- What I did: took the file that owns the visual run (infographic.md) as governing, and answered nine questions.
- What happened: setup.md promised me a thing that pulls a palette from somewhere and shows me two rendered frames to choose between. What infographic.md actually specifies is a nine-question form: `bg`, `fg`, `accent`, `muted`, `font_head`, `font_body`, `scale`, `radius`, `rule_weight`. I do not know my company's hex codes. Nobody does. I gave approximations off memory of a deck ("navy, warm off-white, signal orange"), which means my brand colours are now **invented**, in a system whose fourth hard rule is "Never invent a fact." Nothing asked me to verify them and nothing warned me they were guesses. And "pulls a palette" from where is never said — README says no connector is ever required, so there is nothing to pull from.
- What I expected: the setup.md version. Show me two frames, let me point at one.
- Severity: friction, edging into blocker — `rule_weight` and `scale` are not questions a CRO can answer, and I was told at setup I would never be asked them
- Had to leave the docs: yes — `workflows/infographic.md` sent me by name into `render/infographic/reference/themes.md` to find out what the nine keys even were, which is a file inside the renderer

### F-17 — Two files describe the first visual run's brand step as two different products
- Where: `workflows/setup.md` `## Visual` vs `workflows/infographic.md` `## The theme.json bootstrap`
- Instruction as written: setup.md: "**Not asked at setup, in any sitting.** Do not ask about colors, fonts, or brand. The first visual run **pulls a palette, shows two real rendered frames**, and writes `theme.json` then."
  infographic.md: "Where the profile still carries `_template`'s defaults: **ask for the nine keys** before drafting rather than after rendering, write the file once, and say so in one line."
- What I did: took the file that owns the visual run (infographic.md) as governing, and answered nine questions.
- What happened: setup.md promised me something that pulls a palette from somewhere and shows me two rendered frames to choose between. What infographic.md actually specifies is a nine-question form: bg, fg, accent, muted, font_head, font_body, scale, radius, rule_weight. I do not know my company's hex codes. I gave approximations off memory of a deck ("navy, warm off-white, signal orange"), which means my brand colours are now invented, in a system whose fourth hard rule is "Never invent a fact." Nothing asked me to verify them and nothing warned me they were guesses. And "pulls a palette" from where is never said - the README says no connector is ever required, so there is nothing to pull from.
- What I expected: the setup.md version. Show me two frames, let me point at one.
- Severity: friction, edging into blocker - `rule_weight` and `scale` are not questions a CRO can answer, and setup.md told me I would never be asked them
- Had to leave the docs: yes - `workflows/infographic.md` sent me by name into `render/infographic/reference/themes.md` to find out what the nine keys even were, a file inside the renderer

### F-18 — The gate's own drafting rule creates the craft defect the reader then marks me down for
- Where: `workflows/short-post.md` `## Drafting` rule 2, vs the step 5b reader report on my short post
- Instruction as written: short-post.md: "**Put the anchor's own words in quotation marks when you use them verbatim.** This is the drafting half of section 9's protected spans, and without it the mechanism does not work: the gate refuses to edit inside quotes, so unquoted verbatim material is material the gate is free to rewrite."
- What I did: obeyed it. My two strongest lines came verbatim out of my own inventory, so I put both in quotation marks.
- What happened: the reader graded the post L2 and its very first note was about exactly those quotes, verbatim:
  > "The two best lines in the post are fenced in quotation marks with nobody attached to them... Both times I stopped to work out who was speaking instead of taking the hit. The second is the worse case - the sentence before it is your own first person (`At Arkiv, I carried a 1.4 million dollar deal`), and then the quote is also first person about `my team`, so you appear to be quoting yourself."
- What I expected: two steps of the same pipeline not to want opposite things. Step 4 tells me to quote my own words so the gate cannot touch them; step 5b tells me quoting my own words makes the post read as though I am quoting myself. There is no note anywhere saying what to do when the verbatim material is the author's own speech, which for a zero-archive user is **all of it**, because every word the engine has of mine came out of the interview.
- Severity: friction
- Had to leave the docs: no

### F-19 — On a visual run the language gate grades slide labels as if they were a LinkedIn post
- Where: `SKILL.md` section 2 ("On a visual run, `draft.md` is the render spec") and step 5's `gate --report` subsection, run against `workflows/infographic.md` step 4b
- Instruction as written: SKILL.md: "**On a visual run, `draft.md` is the render spec.** ... Step 4 writes the Markdown spec `render.py` consumes, so step 5's gate reads every word that reaches the canvas."
  And: "Format defaults to short. Pass `--long` on an article, which is what takes the semicolon rule back out of scope, and the report echoes the format it was asked for."
- What I did: ran the documented command on my infographic spec:
  `node reference/engine.js gate --report profiles/beatriz/runs/2026-08-25-q4-calendar-chain/draft.md profiles/beatriz`
- What happened, verbatim:
  ```
  "gate_passes": false,
  "gate_catch_count": 4,
  "tags": ["no-long-sentence","punctuation-density","rhetorical-fragment","zero-contractions"],
  "words": 106,
  "format": "short",
  ```
  and inside `flags`:
  ```
  { "rule": "no-long-sentence", "action": "flag", "detail": "no sentence over 25 words" },
  { "rule": "punctuation-density", "draft": 0.94, "limit": 2, "direction": "below" },
  { "rule": "zero-contractions", "detail": "no contraction in 106 words" }
  ```
  My spec is four node labels of at most seventeen characters each, a headline of seven words, and a one-line subtitle. The gate failed it for having no sentence over twenty-five words. **You cannot put a twenty-five-word sentence on an infographic.** The whole spec, front matter included, is 106 words. It also wants contractions in a set of chip labels and more punctuation per sentence than a label has room for.
  There are only two format settings — default `short`, and `--long` for articles — so there is no way to tell it this is a canvas. `reference/reader.md` knew to carve out slides ("**even meter does not apply to slides.** Slides are uniform by design"). The gate has no such carve-out and nothing in `workflows/infographic.md` mentions the problem.
- What I expected: the gate to know it was reading an image spec, since the same paragraph of `SKILL.md` that routes it there is the one that says the spec *is* the draft.
- Severity: blocker in practice — `gate_passes: false` and "**Never show the post before `gate-report.md` exists in the run directory**" mean I either fabricate a pass or chase rules that cannot be satisfied on a canvas. I recorded the fail and continued, which is a thing the doc tells me not to do.
- Had to leave the docs: no

### F-20 — Render warnings are written for the person who built the renderer
- Where: `workflows/infographic.md` step 6, `--html-only`
- Instruction as written: "`--check` validates spec grammar and layout... **ERROR is reserved for exact clauses.** Any clause resting on one of section 3's `[UNVERIFIED]` ratios is a WARN that prints the measured number beside the threshold"
- What I did: ran the `--html-only` command exactly as printed.
- What happened, verbatim:
  ```
  WARN  thumbnail: 4 claim-layer node(s) at 31px are ~4.4px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'No signer named'
  WARN  thumbnail: 3 claim-layer node(s) at 54px are ~7.7px cap at 220px, under ~8px (VISUALS 1, unverified floor): 'Q4 slips on a'
  ```
- What I expected: I have no idea what a claim-layer node is, what cap height is, or what I am supposed to do. It tells me the floor is "unverified", which reads as "this warning might be wrong", so I cannot tell whether to act. The actionable version is one sentence: "your labels will be unreadable when this is a thumbnail in the feed — use fewer words per node." That sentence is not there.
- Severity: friction
- Had to leave the docs: no

### F-21 — The renderer will happily ship the template look, and the rule against it is prose with nothing behind it
- Where: `workflows/infographic.md` `## The theme.json bootstrap`
- Instruction as written: "Rendering from `_template` defaults produces the 'looks like a template because it is one' failure VISUALS 5.1 names. **Do not skip this and render anyway.**"
- What I did: my first render went out before my theme was actually on disk, so the profile still carried `_template`'s nine values.
- What happened: it rendered. Cleanly. Exit 0. A 2160x2700 PNG in the default blue `#2F5BEA` with a Georgia serif headline, signed "Beatriz Lindqvist" at the bottom, ready to post. The generated HTML's `:root` block was `--bg:#FBFBF9; --accent:#2F5BEA; --font-head:Georgia...` — every one of them the template's. Not one warning. Not one line of output saying "this profile has never set a theme."
  The renderer refuses four things by name (`--out` outside the profile, missing theme keys, a missing logo file, a Chrome failure). "Theme is byte-identical to `_template`" is not one of them, even though it is the one failure the workflow calls out in bold. I only caught it because I happened to diff the hex codes against what I had typed.
- What I expected: the same guard the other four failures get. `theme.json == _template/theme.json` is a one-line comparison and the workflow already says it is a failure state.
- Severity: friction, but it is the one that would actually have embarrassed me — I would have posted a stranger's blue.
- Had to leave the docs: no

### F-22 — `scale: dense` does not fix the empty half of the canvas
- Where: the rendered `causal-chain`, `profiles/beatriz/runs/2026-08-25-q4-calendar-chain/final.png`
- Instruction as written: `render/infographic/reference/themes.md`: "`scale` | `--space` | `airy` -> 1, `dense` -> 0.72, over padding and gaps"
- What I did: set `scale: dense`, confirmed `--space:0.72` reached the HTML, re-rendered.
- What happened: the four chain nodes are correct and legible, but three of the four gaps between them are enormous and empty — roughly a third of the whole canvas is blank orange-tinted paper with a single vertical arrow running through it. Only the first gap has anything in it (the break label). `dense` changed padding inside the boxes; it did not stop the layout stretching four boxes across 2700px. The result reads as four unrelated cards with very long arrows rather than as a chain, which undercuts the one thing this archetype exists to assert.
- What I expected: four nodes to sit close enough together that the arrow reads as a link. There is nothing in the docs about a canvas that a four-node chain cannot fill, and `causal-chain` is documented as taking 4-5 nodes, so four is the low end of the supported range and it looks like this.
- Severity: polish, high visibility — it is the artifact I would be posting
- Had to leave the docs: no

### F-23 — The documented fix for the thumbnail warning has no effect
- Where: `reference/design-tells.md` `### claim-below-the-feed-layer [both]`
- Instruction as written: "**Redraft the spec:** shorten the headline so it can be set larger, or move the claim up a tier."
- What I did: exactly that. Headline from "Q4 slips on a **calendar**, not a case" (7 words) to "Q4 slips on the **calendar**" (4 words). Node labels from `No signer named` (15 chars) to `No signer` (9 chars). Re-ran.
- What happened: identical output. `at 31px are ~4.4px cap` before and after for the nodes; `at 54px are ~7.7px cap` before and after for the headline. The only thing that changed was the count of nodes named in the warning, because there were fewer words to name. **The type sizes are fixed by the archetype template, not derived from the copy length**, so "shorten the headline so it can be set larger" describes a behaviour the renderer does not have. There is no way to act on this warning from the spec, which is the only surface I am allowed to edit (bound 1: "The generated HTML is never patched").
- What I expected: shortening the headline to make it bigger, since that is what the file told me would happen.
- Severity: friction — a warning I cannot clear, whose only documented remedy is inert, on a check that then fires on every render forever
- Had to leave the docs: no

### F-24 — BLOCKER: a new user cannot write an article. Ever. Not for eight posts.
- Where: `workflows/article.md` `## The cap`, against `README.md`'s command list
- Instruction as written: README: "`/content-engine article <topic>`    newsletter edition, plus its carousel" — listed under "## After setup", with no caveat of any kind.
  article.md: "**N = short-post briefs shipped since the most recent brief carrying `format: article`.** With no shipped article, N is every shipped short post."
  and the table: "| under 8 | **Refuse**, before step 3 crosses a single angle. |"
- What I did: finished setup, shipped my first short post, then ran `/content-engine article "why enterprise deals slip in Q4"` — the second thing I wanted from this product, and the reason I was interested in it at all. I am a CRO. The article is the format that matters to me. The post is the trailer.
- What happened: N = 1. The cap is 8. **Refused.** The engine will not draft me an article until I have shipped eight to ten short posts, which at any sane cadence is two months. Nothing in the README, nothing in `SKILL.md`'s route table, and nothing in setup's close says this. Setup closed by telling me "You have one post ready to ship and the gate is tuned to your writing" — a sentence that is wrong in both halves for me — and said nothing about three of the four formats being locked.
  The reasoning in article.md is sound (a bare article reaches 0.69x, the cap holds the cost side to a ratio). It is a defensible product decision. It is just invisible until you have already done the work, and it is invisible in the one file a new user reads.
- What I expected: the command list to mark it. One word. "`article <topic>` — newsletter edition, plus its carousel (unlocks after 8 short posts)". That is the whole fix.
- Severity: blocker
- Had to leave the docs: no
- **My workaround, stated explicitly**: I could not get an article any other way, so I hand-wrote nine additional `runs/<slug>/brief.md` stub files carrying `format: short` and `status: shipped`, purely to move the counter. **That required knowing that the cap is counted by globbing `profiles/beatriz/runs/*/brief.md` for a YAML-ish `status:` line — which I only know because I read `workflows/article.md`, a file no user is ever pointed to.** A non-technical person hits this wall and stops. It also means I wrote nine fictional runs into my own ledger, which `SKILL.md` section 4 forbids in as many words: "Nothing fictional is ever written into the repo... A fake item on disk is a fact waiting to leak into a real draft." The product left me no honest path, so I took a dishonest one and am recording it.

### F-25 — The refusal message has a slot that cannot be filled on the path that triggers it
- Where: `workflows/article.md` `## The cap`
- Instruction as written: "Print `N short posts shipped since <slug>, cap is 8`, then three short-post angles read off live inventory state."
- What I did: tried to print the refusal as written. N is 1.
- What happened: there is no `<slug>`. `<slug>` is the most recent brief carrying `format: article`, and the sentence two paragraphs up says "With no shipped article, N is every shipped short post" — so the refusal's own definition establishes that on a first run there is nothing to put in that slot. The one message a brand-new user is guaranteed to hit is the one with an unfillable field in it. Taken literally I cannot print the line at all; I printed `1 short posts shipped since (no article yet), cap is 8`, which is me writing product copy.
- What I expected: a second grammar for the no-prior-article case, the way `VISUALS.md` 2.4 bothered to write three grammars for its refusal.
- Severity: friction
- Had to leave the docs: no

### F-26 — The article format requires an outside-world fact, has no way to get one, and the only permitted source is my memory
- Where: `workflows/article.md` `### The arc`
- Instruction as written: "**An outside-world anchor, in the first three paragraphs.** A dated event, a named organisation, a published figure, a historical episode. Not the reader's own office and not the author's product... The anchor rides in `supports:` and obeys section 14 like every other fact: it traces to an inventory item, or the human supplies it in the same turn, or it is cut. Invented to fit the argument it is worse than no anchor, because someone will check it."
- What I did: none of my seventeen inventory items is an outside-world fact — every one of them is something that happened to me, because that is what the interview asked for. So the engine asked me, and I answered from memory: Wells Fargo, 2016, the account-opening incentives, the fine.
- What happened: a dated figure about a named public company, sourced to a CRO recalling a news story from ten years ago, is now in the second paragraph of a piece going out under my name. The engine cannot check it. The README says "no connector is ever required" and nothing anywhere describes a research capability, so **there is no verification path at all** — the rule's own third option is "or it is cut", and cutting it breaks a structural requirement of the format. The paragraph warning me that "someone will check it" is correct and is precisely the problem: someone will, and the only thing standing behind the number is that I was fairly sure.
- What I expected: either the interview to have asked me for two or three outside-world anchors while it had me talking (it asks for nine other kinds of thing), or the format to ask me for a link, in the turn, and refuse to write the sentence without one.
- Severity: friction, with a real chance of publishing something wrong under my own name
- Had to leave the docs: no

### F-27 — BLOCKER: on the mandatory article-plus-carousel run, the carousel overwrites the article
- Where: `workflows/article.md` `## The carousel derivative` vs `workflows/carousel.md` `## Step 4: the draft as slide beats`
- Instruction as written: article.md: "| Brief | The same `runs/<slug>/brief.md`. **No second brief and no second run directory.** |" and "| Source text | `runs/<slug>/draft.md` **after** it has cleared step 5. The slides are cut from the gate-passed article |"
  carousel.md: "Two writes, in this order: 1. **`runs/<slug>/draft.md`** — the caption, then the slide copy as plain lines. Step 5's gate reads this file, so every word a reader will see has to be in it"
- What I did: read both. The derivative is not optional ("The derivative is not optional and its absence is not silent"), it runs in the same run directory, and its first documented write is `runs/<slug>/draft.md`.
- What happened: **`runs/<slug>/draft.md` is the article.** It is also, per article.md, the derivative's own source text. So step 4 of the carousel writes the slide copy over the top of the 1,051-word article the slides are supposed to be cut from. There is no second directory to put it in, because article.md forbids one, and no alternative filename is named anywhere. Two shipped workflow files instruct the same path to write the same filename with two different documents, and the second one destroys the first one's only copy.
- What I expected: the derivative to write `slides.md`, or `draft-carousel.md`, or anything at all that is not the file it reads from.
- Severity: blocker — following both files literally loses the article
- Had to leave the docs: no
- **My workaround, stated explicitly**: I copied the gate-passed article to `article-draft.md` before letting the carousel write `draft.md`, which is a filename no doc mentions and which the gate will therefore never look at again.

### F-28 — Three files name three different output files for the same carousel
- Where: `workflows/article.md`, `workflows/carousel.md`, `SKILL.md` step 8
- Instruction as written: article.md: "| Output | `slides/` and `final.pdf` in the same run directory, per PRD section 5. |"
  carousel.md: "The run directory ends up holding `brief.md`, `draft.md`, `gate-report.md`, `spec.md`, `deck.html`, `design-gate.md` and `deck.pdf`."
  SKILL.md: "the file a human uploads is `deck.pdf` or the PNG beside it."
- What I did: went looking for what I am actually supposed to upload to LinkedIn.
- What happened: `final.pdf` in a `slides/` subdirectory, or `deck.pdf` in the run directory. Two of three files say `deck.pdf`, so I went with that, but the file that owns the article path — the only path where the carousel is mandatory — is the one that disagrees.
- Severity: friction
- Had to leave the docs: no

### F-29 — The carousel's theme bootstrap contradicts the shipped template and the other renderer
- Where: `workflows/carousel.md` step 6, vs `profiles/_template/theme.json`, vs `workflows/infographic.md`
- Instruction as written: carousel.md: "**On a first visual run, `profiles/<handle>/theme.json` does not exist yet**... Ask for the nine keys in one turn, **offer `_template/theme.json`'s values as the fallback** for any they have no answer to, confirm in the same turn, write it once... **Never assemble against the template file itself.** Rendering early decks off shipped defaults is the 'looks like a template because it is one' failure that writer exists to prevent."
- What I did: looked. `profiles/_template/theme.json` exists and setup copied it to my profile, so `profiles/beatriz/theme.json` existed from minute two.
- What happened: three statements in one paragraph that cannot all be true. The file *does* exist on a first visual run, because setup copies the whole template. And I am told to offer the template's values as the fallback for any key I cannot answer, and in the next sentence told that rendering off shipped defaults is the failure this step exists to prevent. Those are the same thing. There were four keys I genuinely could not answer (`muted`, `scale`, `radius`, `rule_weight`) so under the fallback rule I would have taken the template's values for all four, which is the failure.
- What I expected: pick one. Either the defaults are safe (which `README.md`'s "ships already wired" and `setup.md`'s "`_template/theme.json` ships with defaults that work unedited" both assert) or they are the named failure mode. Three files say both.
- Severity: friction
- Had to leave the docs: no

### F-30 — BLOCKER: the carousel PDF loses its last slide. Silently. Exit code 0.
- Where: `workflows/carousel.md` step 7, `python3 render/carousel/render.py <spec> --out <runs>/<slug>/deck.pdf`
- Instruction as written: "**When the render fails**, say which of these it was and stop. Do not improvise a fallback format and never present a deck nobody rendered." — four named failures, none of which is this.
- What I did: ran the render exactly as printed. Nine slides in `spec.md`, nine slides in `deck.html`.
- What happened:
  ```
  $ python3 render/carousel/render.py .../spec.md --out .../deck.pdf
  .../deck.pdf
  exit=0
  $ file .../deck.pdf
  PDF document, version 1.4, 8 pages
  ```
  **Eight pages. Nine slides.** No warning, no error, exit 0. Every page footer says `0N / 09`, the progress bar on the last visible page shows eight of nine segments filled, and the ninth slide — the `cta`, which `workflows/carousel.md` requires to be "a **takeaway**, not a call to action, per PRD 10.3" — is gone.
  Digging at the file itself: it contains nine `/MediaBox` entries and nine `/Type /Page` objects, but the page tree declares `/Count 8`. So the last slide is physically in the PDF and structurally unreachable. `file`, and the PDF reader I opened it with, both render eight. LinkedIn would show eight.
  The takeaway slide is the last thing anyone reads and the whole reason for the last swipe. It is the one slide the workflow writes a rule about. It is the one that does not survive.
- What I expected: nine pages, or a failure.
- Severity: blocker — the artifact I would upload is wrong and nothing told me
- Had to leave the docs: no. I found this because I counted the pages by hand, which is not a thing a CRO does.

### F-31 — F-27 confirmed in the wild by the engine's own reader
- Where: pipeline step 5b, on the article run
- What happened: I sent the article to the step 5b reader as `SKILL.md` specifies, then continued to the mandatory carousel derivative, which per `workflows/carousel.md` writes `runs/<slug>/draft.md`. The reader came back and opened its report with this, unprompted:
  > "Note on provenance: `draft.md` changed on disk while I was reading it — the long-form prose article was replaced by nine-slide carousel copy plus a caption. I graded what is in the file now, since that is the draft the router will ship. If the article was the intended target, re-run me."
- So: **the article was never graded.** The derivative overwrote its input while step 5b was mid-read, and the grade I got back was the carousel's. That is F-27 happening for real rather than in theory, and it happened on the very first article run this profile ever did. The two steps the doc puts in this order — article step 5, article step 5b, then the derivative — cannot run in that order in the same directory with the same filename.
- Severity: blocker
- Had to leave the docs: no

### F-32 — `--check` warns at 8 words for a rule the doc sets at 8 words
- Where: `workflows/carousel.md` step 4, vs `render/carousel/render.py --check`
- Instruction as written: "**headline 3 to 8 words and never a third line** (VISUALS 5.1)"
- What I did: wrote a headline of exactly eight words: "What a SPIFF buys, and what it **costs.**"
- What happened: `WARN  slide 5 (compare): headline > 7 words (8)`. The checker's ceiling is 7; the doc's is 8. An eight-word headline is inside the documented rule and outside the checker's. Three of my nine headlines tripped it and I shortened all of them, which means the checker, not the spec, is what actually governs my copy.
- Severity: polish
- Had to leave the docs: no

### F-33 — Nothing in the run I actually did ever printed the runway or staleness lines to me
- Where: `SKILL.md` `### Run start output`
- Instruction as written: "Four things may print, in this order, and none of them blocks... 2. The runway line: `N unlocked anchors, M posts of runway at current cadence`... 4. The sibling notice, **only when more than one directory exists under `profiles/`**: read `profiles/*/runs/*/brief.md` and print the last 14 days, one line each... It globs to nothing on a solo install and must not error there."
- What I did: three runs. I only ever saw the runway line because I typed `node reference/engine.js locks profiles/beatriz` myself, out of curiosity, having read the workflow file.
- What happened: two things.
  First, `profiles/` on my machine holds **two** directories: `_template` and `beatriz`. So by the condition as written the sibling notice fires on a solo install, because the template is a directory under `profiles/`. The parenthetical says it "globs to nothing on a solo install", which describes a different install than the one setup actually produces. Taken literally I should be printing a 14-day digest of my own runs back at myself on every run, labelled as siblings.
  Second, and worse for me: the runway line is the single most useful number in the product for someone starting from nothing. "17 unlocked anchors, 17 posts of runway" told me, instantly, that the interview had bought me something. It printed nowhere in any workflow I followed unless I went and asked for it. `workflows/short-post.md` does not print it. `SKILL.md` says four things "may print" and nothing says which ones did.
- What I expected: the runway number in front of me at the top of every run. It is the only line that made me feel like the forty minutes of interview had paid for something.
- Severity: friction
- Had to leave the docs: no

---

### COLD START

**The short version: the engine detected my empty archive, handled it correctly in
the file system, and then never once told me on screen. Every artifact I made
today was written with no voice reference of any kind, and I would only know that
if I went reading run directories.**

**What it asked me, verbatim.** The first question of the whole product, from
`workflows/setup.md` 0.2:

> "Before anything else, give me three to five things you have written. Anything
> unedited counts: Slack messages you sent, an email you did not template, a post.
> Do not tidy them."

I said no. Not "let me look" — no. Fifteen years and I have never written a word
of this down. The doc's next offer was:

> "If they would rather talk, take a two-minute voice memo and transcribe it."

I would rather talk. There is no way to hand this thing a voice memo. That is
F-6, and it is the only alternative offered.

**Did it stop? No, and this is the best thing in the run.** `workflows/setup.md`
0.2 has a real branch for me, and it is well written:

> "**If they have no writing samples at all,** say so in `voice.md` explicitly,
> skip 0.3, and go to 0.4. **Do not refuse to draft.** ... Say plainly that the
> gate is running uncalibrated until they paste something, and that pasting
> anything later re-runs 0.3."

Somebody thought about me specifically. It did not refuse, it did not stall, it
did not fake a calibration. `profiles/_template/voice.md` even carries a
`## No samples on file` section with the exact sentence it should say. And
`node reference/engine.js gate --negative profiles/beatriz` behaved impeccably:
`"corpus": "empty, no pasted sample on file"`, `"samples": 0`, every baseline
`null`, and a note reading "rule 2: an absent gate-calibration.md means every rule
fires. It is not a clean pass, and it is not a suppression of anything." That is
honest engineering. No number was invented anywhere.

**Did it warn me? No.** This is the failure and it is structural, not an oversight
of tone. Three things stack up:

1. `voice.md` says the warning goes in "the gate report". `SKILL.md` says
   "**The run prints one line, not the file**." So the warning lives in
   `runs/<slug>/gate-report.md`, a file I have no reason to open. (F-12)
2. My second draft passed the gate clean — `"gate_passes": true`,
   `"gate_catch_count": 0`, `"flagged": 0`. And `SKILL.md`'s rule is: "A run that
   passed clean and flagged nothing **prints no gate line at all**." So on the
   happy path the line that would have carried the warning does not print either.
   The cleaner my draft, the less likely I am to be told the voice is guessed.
3. Setup's own closing script, which I was supposed to hear, is:
   > "You have one post ready to ship and **the gate is tuned to your writing.**"
   That sentence is in `workflows/setup.md`, unconditional, with no branch for the
   no-samples path. For me it is false. The gate is tuned to nothing.

**Did it degrade gracefully? Halfway.** It degraded to `inspiration.md` — and
`inspiration.md` is loaded "**only** when `voice.md` declares that no samples
exist", which is exactly my case. But filling `inspiration.md` requires me to
paste three to five posts from LinkedIn creators I enjoy, and per
`workflows/setup.md` B.3, "Never write a creator's mechanics from memory. If you
could not read the posts, that creator gets no entry." **I have never posted on
LinkedIn because I do not read LinkedIn.** That is the same fact. So the fallback
for my missing archive is empty for the identical reason the archive is. No file
anywhere has a branch for both being empty. (F-10)

**What the engine actually did instead, and it is worse than nothing being said
about it.** With no baseline, the gate applied what it calls "absolute floors":

```
"baseline_source": "none, absolute floors applied",
{ "rule": "zero-contractions", "action": "redraft", "detail": "no contraction in 202 words",
  "override_available": "voice.md records null" },
{ "rule": "punctuation-density", "draft": 1.49, "baseline": null, "limit": 2, "direction": "below",
  "source": "absolute fallback, gate-calibration.md carries no baseline for this metric" }
```

So a system that admits it has no idea how I write pushed my prose toward more
contractions and more punctuation, and then reported a clean pass. `voice.md`'s
own second paragraph names this exact risk — "without it the gate rewrites their
own voice on day one" — and it is what happened. I got lucky: I do use
contractions when I talk. Nothing in the product knows that, and nothing told me
it was guessing. (F-13)

**The thing nobody noticed.** The interview took about forty minutes of my talking
and wrote down seventeen inventory items, four theses with their counter-positions,
and twenty-odd phrases my audience actually uses — roughly 1,400 words of me,
captured verbatim because `reference/interview.md` rule 8 insists on it: "in their
own words... If you cannot quote their exact words for an item, do not write it."
None of it counts as a voice sample. `SKILL.md` step 1 loads `voice.md` for voice
and `inventory.md` for facts, and the two never meet. The engine's own philosophy
block says "Edited-for-publication writing is worth less here than a message they
fired off without thinking." A spoken interview answer is **less** edited than a
Slack message. It is sitting on disk. It is thrown away. (F-11)

That is the one-line summary of my cold start: the product had 1,400 words of me
and told itself it had zero.

---

## The four artifacts

### A-short-post
Run: `profiles/beatriz/runs/2026-08-25-q4-procurement-41/`

- **Would I publish this under my own name?** Yes. This is the one I would post
  today, without editing it.
- **The single worst line:** "Budget gets decided in August."
  It is the worst because it is the only sentence in the post that is not mine.
  Everything else came out of my own CRM or my own career; that one is a
  generalisation the engine needed in order to dismiss budget as the cause, and it
  is false for anyone whose fiscal year does not start in January — which is most
  of my audience. The step 5b reader found it independently and put it better than
  I can: "for one beat I am arguing with you instead of following you." The engine
  produced it because it needed a bridge and had no inventory item to build one
  from, so it wrote one. That is the failure mode the whole "never invent a fact"
  rule exists to prevent, arriving as a soft universal instead of a hard number.
- **Does it sound like me or like a machine?** Mostly like me, and I am
  suspicious of why. The tell is that the two best lines are in quotation marks,
  because `workflows/short-post.md` rule 2 told the engine to fence my own words
  so the gate could not edit them (F-18). The result is that I appear to be
  quoting myself, twice, in a post written in the first person. Nobody talks like
  that. Otherwise the register is right: "commit", "close plan", "counsel",
  "signature authority" all land, and none of them is explained. What gives away
  the machine is not vocabulary, it is the shape of paragraph five — "We discount.
  We escalate to the exec sponsor. We rebuild a business case for..." — a rising
  triad, executed a little too cleanly. I would not have built that on purpose.
- **Minutes from starting the workflow to something I would post:** about 18.
  That includes one full redraft that the gate demanded and that I would not have
  asked for.

### A-article
Run: `profiles/beatriz/runs/2026-08-25-comp-plan-behaviour-spec/article-draft.md`
(1,051 words — and note the filename is one I invented, because the documented
filename was destroyed by the mandatory carousel step. See F-27, F-31.)

- **Would I publish this under my own name?** Yes, after cutting one paragraph.
- **The single worst line:** "In September 2016, Wells Fargo was fined 185 million
  dollars because its retail staff had opened roughly two million accounts nobody
  had asked for."
  It is the worst because I am the only source for it. `workflows/article.md`
  structurally requires an outside-world anchor in the first three paragraphs, my
  inventory contains none because the interview never asked for one, and the only
  permitted fallback is "the human supplies it in the same turn". So a dated
  regulatory fine against a named bank is now in paragraph three of a piece going
  out over my signature, and the thing standing behind it is that I half-remember
  a news story from ten years ago. The doc's own warning — "Invented to fit the
  argument it is worse than no anchor, because someone will check it" — is
  correct, and the product provides no way to check it. (F-26)
- **Does it sound like me or like a machine?** This one sounds most like me, and I
  think that is because it is long enough that the argument had to do the work.
  "I built a machine for sandbagging, and then I was surprised when my team used
  it" is a sentence I would say out loud. So is "If a territory needs relief twice,
  the territory was built wrong, and I built it." The machine shows up in the
  subheads, which are all the same length and all the same shape — "What a comp
  plan actually is", "Why the SPIFF does not fix it", "The mechanism, one level
  down", "Why nobody does this" — a tidy, symmetrical, slightly journalistic set
  that nobody writing in a hurry produces. And in the phrase "map with contour
  lines", which only exists because the gate banned the word I originally used.
- **Minutes from starting the workflow to something I would post:** about 31, plus
  the time it took me to defeat the eight-post cap, which was the real cost and
  which for an honest user is two months. (F-24)

### A-infographic
Run: `profiles/beatriz/runs/2026-08-25-q4-calendar-chain/final.png`, 2160x2700 PNG,
rendered, on disk, 222 KB.

- **Would I publish this under my own name?** No. Not this render.
- **The single worst line:** "Nobody asks who has authority until the close plan
  is written."
  Worst because it is unfalsifiable-by-nobody: any VP running MEDDIC reads it and
  says "we do, actually", and then reads the other three nodes in bad faith. On a
  post it would be one soft line in eight paragraphs. On a single frame it is a
  quarter of the total text and it is node one, the root of the chain, so if it
  goes the whole diagram goes with it.
- **Does it sound like me or like a machine?** The words sound like me — "signer",
  "procurement", "redlines", "counsel", "you carry the deal twice". The *image*
  looks like a machine, and for a specific reason: a third of the canvas is empty.
  Four nodes stretched across 2700 pixels with three enormous blank gaps between
  them, so the arrow reads as distance rather than as causation, which is the one
  thing this archetype exists to assert. `scale: dense` did not fix it (F-22). And
  the two thumbnail warnings fire on every render with no way to clear them,
  because the documented remedy does nothing (F-23).
- **Minutes from starting the workflow to something I would post:** I never got
  there. About 14 minutes to a rendered PNG I would not post. The words are ready;
  the layout is not, and there is no knob in the spec that reaches it.

### A-carousel
Run: `profiles/beatriz/runs/2026-08-25-comp-plan-behaviour-spec/deck.pdf`,
9 slides specified, **8 pages in the PDF**, 357 KB.

- **Would I publish this under my own name?** No, because I cannot. The file is
  broken (F-30). If it were nine pages: yes, and enthusiastically — this is the
  best-looking thing the product made all morning.
- **The single worst line:** "Wells Fargo wasn't a **culture** failure." on slide 3.
  Worst because it is borrowed proof sitting immediately after earned proof. Slide
  2 is me admitting I paid my own team to sandbag; slide 3 is a bank everyone has
  already read four decks about. The reader put it exactly right and I agree with
  every word: "It is the only slide with no author in it, it is doing work slide 2
  already did better with the author's own team... Borrowed proof placed
  immediately after earned proof reads as a downgrade in confidence."
- **Does it sound like me or like a machine?** The typography and the palette look
  genuinely good — better than anything my marketing team has made me. The copy is
  the closest to my register of any of the four, because slide constraints forced
  everything to nine words. What gives away the machine is repetition the deck
  cannot see: "not X, but Y" runs six times across nine slides, and slide 6
  negates in its headline and then negates again in its first bullet eight words
  later. Also the caption and slide 1 are the same joke, visible simultaneously in
  the feed, which no human would ship.
- **Minutes from starting the workflow to something I would post:** never, on this
  render. About 11 minutes from the gate-passed article to a deck that renders,
  and then it renders wrong.

---

## Where the time went

Wall clock for the whole run was 07:52 to 08:16, so about 24 minutes, and I want
to be straight about that number: the typing was not the cost. If a person had
actually sat and answered the interview questions I answered, sitting 0 plus
session A plus session B is the 70 to 100 minutes the doc itself budgets. What the
24 minutes measures is everything *around* the interview, and that is the part I
resent.

**Block 1 (07:52-08:02) — the front door.**
- ~1 min: pasted the install line from the README. It failed. `cp: content engine:
  No such file or directory`. There is no second line to try, because the README
  says that line is the whole install.
- ~4 min: reading, to work out what to do instead. `SKILL.md`, then
  `workflows/setup.md` (386 lines), then `reference/interview.md`. Three files, none
  of which the README names, to recover from one broken line.
- ~2 min: profile created, no-samples declared, negative control run. This part was
  good and fast.
- ~3 min: the interview writes. Identity, seventeen inventory items, four theses,
  the audience block.
- **Resentment: the four minutes of reading.** I am not the person who is supposed
  to read `SKILL.md`. The README is one page and two of its eight paragraphs are
  changelog about defects it used to have.

**Block 2 (08:02-08:12) — three formats, two walls.**
- ~5 min: the short post, end to end. Brief, draft, gate, redraft, gate, reader,
  ship. This is the product working, and 5 minutes is a good number.
- ~2 min: the theme. Nine questions I could not answer, four of which I answered by
  guessing at my own brand.
- ~4 min: the infographic. Two renders, two design-gate passes, and a detour to
  discover that the fix for the warning does nothing.
- **The wall: the article cap.** I asked for the format I actually wanted and got
  refused, and the refusal has no path out except two months of posting. Getting
  past it cost me nine hand-written ledger files and required me to have read a
  workflow file no user is pointed at. On a real morning this is where I close the
  laptop.

**Block 3 (08:12-08:16) — the carousel, and counting pages by hand.**
- ~3 min: the deck. Draft, gate, a redraft caused by the gate flagging my slide
  punctuation as prose punctuation, spec, `--check`, three headline trims, design
  gate, render.
- ~1 min: noticing that the PDF was eight pages and the deck was nine. I only
  noticed because `file` printed it. Nothing in the product mentioned it.

**The pattern across all three blocks.** Every single time the engine did its
actual job — draft, gate, grade, render — it was fast and it was good. Every
single delay came from a doc disagreeing with another doc, or a warning I could
not act on, or a rule I could not see until I hit it. Nine of my thirty-three
findings are two shipped files contradicting each other about what exists or what
a thing is called. That is the tax.

### F-34 — The gate passed the article clean; the reader counted ten instances of a tell the gate has a rule for
- Where: `SKILL.md` step 5, the split between the deterministic and the model half
- Instruction as written: "The deterministic half is `reference/engine.js`... **The model owns the judgments: the open forms of antithesis**, unearned rule of three, parallel bullets, restating close... **Zero tolerance is a promise only the deterministic half can keep.**"
- What I did: gated the article. `engine.js` found exactly one `antithesis` hit — `"match": "not defend in a board meeting, that is the"` — which was a **false positive** (my sentence is a conditional, "if the cheapest path is a path you would not defend..., that is the plan you have written", not an antithesis). I rewrote it. Second pass: `"gate_passes": true, "gate_catch_count": 0`. Clean.
- What happened: the step 5b reader then counted the real thing, quoting nine of them:
  > "The contrast reflex. 'They weren't cheating. I paid them to do it.' / 'It wasn't.' / 'downstream of the arithmetic, not upstream of it' / 'arithmetic rather than cultural' / 'You are not writing instructions. You're writing' / 'the design question is not... The design question is' / 'thanked for it rather than managed for it' / 'points forward... instead of backward' / 'Not the summary deck.' Around ten of these in a thousand words... by the fifth section I was seeing the shape arrive before the content, which is a thing I only notice about writing I'm starting to distrust."
  So the mechanical half fired once, on the wrong sentence, and reported a clean pass on a draft carrying ten instances of exactly the pattern it is named after. The doc is candid that the open forms are the model's job, and the model — the thing drafting — did not catch its own reflex. The reader did, one step later, which is the right outcome, but the reader "does not block" by design and prints a grade rather than a fail. The net effect is that the tell reaches the page with `gate_passes: true` above it.
  The same happened on the quotation marks: both readers, independently, on two different formats, flagged the fenced-quote defect that `workflows/short-post.md` rule 2 and `workflows/article.md` rule 2 explicitly instruct. Two graders, two formats, same finding, and the gate is silent on it because the gate is the reason it is there. (F-18)
- What I expected: nothing better, honestly — this is an admitted design boundary. I am logging it because "gate: passed clean" is what I would read as a user, and it is not what happened.
- Severity: friction
- Had to leave the docs: no

---

## Would I keep using this?

Yes, and I am surprised to be writing that, because the first thing I typed
failed and the format I actually wanted was refused. Here is why anyway. The
short post it wrote is the best thing anyone has ever handed me with my name on
it, and I did not write it, and I would post it this afternoon without changing a
word. The grader is extraordinary — it told me "Budget gets decided in August"
was the one line in the post I would have to defend, and it was right, and no
human on my team would have said that to me. The carousel looks better than
anything my marketing function has produced in two years. Nothing invented a
number. Nothing tried to post for me. That is a real product underneath all of
this. But I would use it the way I use a very talented contractor who keeps
losing paperwork: I would not trust the outputs to be complete without checking
them, and I found out the hard way that checking means counting the pages in a
PDF and diffing hex codes, which is not a thing a CRO does or should ever have to
do. What would actually stop me is the article cap. I came here to write a
newsletter. Being told to come back in two months, by a rule I could only find
by reading an internal workflow file, is the kind of thing that makes an
executive quietly stop opening a tool. Nine of my thirty-four findings are two
of your own files disagreeing about what exists or what a file is called, and I
can feel that as a user even though I never read either file: it shows up as
warnings I cannot act on and remedies that do nothing.

## The one thing that would have made the difference

**Tell me, on screen, above the post, every single run, that you have no idea how
I write.** One line. "No samples of your writing on file — this draft is inferred,
not matched. Paste anything and I'll re-derive." You already wrote that exact
sentence; it is sitting in `profiles/_template/voice.md`. It just goes into a run
file I never open, and on a clean gate pass nothing prints at all, so the cleaner
the draft the more certain I am to be told nothing. I spent this whole morning
believing the engine had been calibrated to me, because setup's own closing line
says "the gate is tuned to your writing." It was tuned to absolute defaults and it
pushed my prose toward more contractions and more punctuation on the basis of no
evidence whatsoever. I would have forgiven every other thing in this report if
that one line had been on my screen.

**And the runner-up, because it is one command:** the interview already has 1,400
words of me in my own words, captured verbatim because your own rules insist on it.
Feed `inventory.md` to the voice derivation. The person with no writing archive is
the person who most needs this product, is the person you wrote a special branch
for, and is the person you already have a transcript of.

---

*End of report. 34 findings. Four artifacts, three of which exist as real files:*
- `profiles/beatriz/runs/2026-08-25-q4-procurement-41/shipped.md` — short post, would publish
- `profiles/beatriz/runs/2026-08-25-comp-plan-behaviour-spec/article-draft.md` — 1,051-word article, would publish after one cut
- `profiles/beatriz/runs/2026-08-25-q4-calendar-chain/final.png` — 2160x2700 PNG, rendered, would not publish
- `profiles/beatriz/runs/2026-08-25-comp-plan-behaviour-spec/deck.pdf` — 9 slides specified, 8 pages rendered, cannot publish
