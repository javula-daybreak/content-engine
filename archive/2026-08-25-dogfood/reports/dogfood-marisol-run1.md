# Dogfood run — Marisol Okonjo-Reyes (`marisol`)

Director of Perioperative Operations, 400-bed nonprofit hospital system. Not a
developer. Claude Code was installed for me by someone on my team.

Run stopped by the coordinator partway through the carousel render. What follows
is everything up to that point. Three of four formats reached a finished
artifact; the carousel reached a validated spec (`--check: warnings only`) but
the PDF was never rendered, so its A-block is marked accordingly.

**Environment event, not a product finding:** roughly two thirds of the way in,
my worktree was wiped of everything except `profiles/`. `README.md`, `SKILL.md`,
`workflows/`, `reference/`, `render/` and every profile file I had written all
disappeared mid-command. I rebuilt the profile from scratchpad backups and from
context and continued against the parent repo. It cost me maybe fifteen minutes
and it is not the engine's fault. I mention it only because it is why some later
commands point at absolute paths.

---

## Findings

### F-1 — The install command in README.md fails verbatim
- **Where:** `README.md`, lines 3-6, the first thing in the file. Step 1 of setup.
- **Instruction as written:**
  ```
  cp -R "content engine" ~/.claude/skills/content-engine
  /content-engine setup
  ```
- **What I did:** Ran it exactly as printed, from the repo I was handed.
- **What happened:**
  ```
  cp: content engine: No such file or directory
  EXIT: 1
  ```
- **What I expected:** The one file that is supposed to be the whole explanation
  to contain a command that runs. The README even says so about itself: *"a
  literal `<url>` in the one file that is supposed to be the whole explanation is
  the explanation failing."* The same sentence now applies to the line that
  replaced it. `"content engine"` is a path relative to the *parent* of the repo,
  and nothing on the page says so.
- **Severity:** blocker
- **Had to leave the docs:** yes — there was nowhere else in README.md to go.

### F-2 — `/content-engine setup` is not a command that exists
- **Where:** `README.md` line 5, and every one of the ten commands in the "After
  setup" list.
- **Instruction as written:** `/content-engine setup`
- **What I did:** Typed it, since it is line 2 of a 2-line install.
- **What happened:** `Unknown skill: content-engine`
- **What I expected:** Line 1 failing is survivable if line 2 works. Both failing
  means a first-time user is stopped dead on a 6-line README with no diagnostic,
  no "did you mean", and no pointer to what to read instead. README.md never
  names `SKILL.md`, never names `workflows/`, and never says what the skill
  directory actually needs to contain.
- **My workaround, stated:** I guessed that the folder I was handed *is* the
  skill, so the skill body must be the `SKILL.md` at its root, and I read that
  instead. That guess was right, but it is a guess, and it is the kind a
  non-technical user does not make.
- **Severity:** blocker
- **Had to leave the docs:** yes

### F-3 — The homework lookup returned a real, different hospital, and nothing tells the interviewer what to do about that
- **Where:** `workflows/setup.md` §0.1 → `reference/interview.md`, Homework block.
  Setup, minute one.
- **Instruction as written:** *"Before you ask them anything about themselves,
  look up their company."* And rule 9: *"If a lookup fails, say the lookup
  failed. Never write a creator's mechanics, a company fact, or a palette from
  memory."*
- **What I did:** Ran the lookup for my employer.
- **What happened:** It succeeded — on the wrong organisation. It returned
  PeaceHealth Sacred Heart Medical Center at RiverBend: 388 beds, Springfield
  Oregon, founded 2008, with a named surgical services wing. Confident, specific,
  and not my employer.
- **What I expected:** Every rule in the file guards the *failure* branch. There
  is no rule for the branch where the lookup returns a plausible near-match, and
  that is the dangerous one: "388-bed, founded 2008" written into `identity.md`
  as `from: research` is a fabricated fact about me, sourced and sitting in the
  file the engine trusts. My hospital is regional and nonprofit. Nobody's search
  is going to find it, and everybody's search is going to find something.
- **Severity:** friction (blocker-shaped: it did not stop me, it invited a lie)
- **Had to leave the docs:** no

### F-4 — `voice.md` has no landing zone for the samples it asks for
- **Where:** `workflows/setup.md` §0.2 and `profiles/_template/voice.md`. The
  first real question of the whole product.
- **Instruction as written:** *"**Paste below the fence in `voice.md`'s Samples
  section, never inside it.**"*
- **What I did:** Pasted immediately below the closing ``` of the schema block —
  the most literal reading of "below the fence."
- **What happened:** My five samples landed in the middle of the explanatory
  paragraph that follows the fence, splitting *"**Paste below the fence, never
  inside it.** The block above is the schema..."* away from the block it
  describes. It parsed fine. It looks wrong.
- **What I expected:** A blank, labelled zone that says "put them here." The file
  is emphatic about where *not* to paste and provides no marked place to paste.
- **Severity:** polish
- **Had to leave the docs:** no

### F-5 — The negative control's `baseline` block is the numbers the interviewer typed, not numbers it measured
- **Where:** `workflows/setup.md` §0.3, and `reference/engine.js gate --negative`.
- **Instruction as written:** *"Run this once, and **hand-write no number that
  follows**."* And: setup *never* *"writes a number into `gate-calibration.md`
  that `engine.js gate --negative` did not report."*
- **What I did:** §0.2 told me to *"extract and record four measured values"* from
  the samples. No tool is offered for that, so I eyeballed them and wrote
  `avg_sentence_length: 16.4` into `voice.md`. Then I ran the control.
- **What happened:** The command returned my own guess back to me as measurement:
  ```
  "baseline": {
    "avg_sentence_length": 16.4,
    "sentence_length_stdev": 9.7,
    "contraction_rate": 0.42,
    ...
  ```
  I confirmed it by editing `voice.md` to `avg_sentence_length: 99.9` and
  re-running:
  ```
  baseline: {"avg_sentence_length": 99.9, "sentence_length_stdev": 9.7, ...}
  ```
  It echoes. Meanwhile the *same JSON* carries a second block with genuinely
  measured values that disagree:
  ```
  cal.baselines: {"burstiness": 0.72, "punctuation_density": 3.82,
                  "contraction_rate": 1.01, "sentence_length_stdev": 7.62}
  ```
  `contraction_rate` is 0.42 in one block and 1.01 in the other. `stdev` is 9.7
  and 7.62. Same run, same file, two answers.
- **What I expected:** §0.3 says to copy *"The command's `baseline`, key for
  key."* There are two things in that output a person could reasonably call the
  baseline, they contradict each other on two of four shared keys, and the one
  the instruction names by that exact word is the one that is circular. The whole
  premise of the section — that drift is detectable against a fixed measured
  baseline — rests on a number a model guessed in the previous section.
- **Severity:** blocker (I had to choose between two readings with no way to
  decide; I acted on the literal one and logged it)
- **Had to leave the docs:** no

### F-6 — `gate-calibration.md` written to the documented schema parses to nothing, silently
- **Where:** `workflows/setup.md` §0.3, the bullet list beginning *"**Front
  matter.** `measured_at:` today."*
- **Instruction as written:** *"Write `profiles/<handle>/gate-calibration.md` from
  that output, and from nothing else: **Front matter.** ... **`## suppressed`**.
  One entry per rule ... **`## baselines`**. The command's `baseline`, key for
  key."*
- **What I did:** Wrote exactly those three parts, using fenced blocks — because
  every other schema in every other profile file is fenced, and because
  `voice.md` warns in bold that the engine strips fences when reading *samples*,
  which reads as "fences are the normal container here."
- **What happened:** The gate found the file and read none of it:
  ```
  "calibration": { "file": "found", "suppressed": [], "evidence": [],
                   "baselines": {}, "measured_at": null, ... }
  ```
  No error. No warning. It says `found`. I only caught it because I read the JSON.
  Rewriting with `---` front matter and an unfenced body made it work:
  ```
  "calibration": { "file": "found", "suppressed": ["em-dash"],
                   "measured_at": "2026-08-25", ... }
  ```
- **What I expected:** §0.3 spends four paragraphs on what must never go in this
  file and zero characters on the one thing that determines whether it is read at
  all. The failure is silent and the symptom is invisible: the engine told me to
  my face *"one rule fired on your writing, so it is off for you"* while its own
  gate report said nothing was suppressed. That is the exact class of false
  reassurance the file's own prose says it exists to prevent — *"A missing
  calibration must never be read as a clean pass."*
- **Severity:** blocker
- **Had to leave the docs:** no, but only because I read JSON. Marisol does not
  read JSON. She would have run for months with an uncalibrated gate that
  reported itself calibrated.

### F-7 — The gate demanded a redraft the workflow does not describe
- **Where:** `SKILL.md` step 5, bound 3, against `gate --report` output.
- **Instruction as written:** *"Cap at 3 rewrites per 200 words ... **Above the
  cap**, go back to brief.md and redraft once."*
- **What I did:** My first short-post draft returned `rewrites_required: 0`,
  `over_cap: false`, and `"action": "redraft"` with three named constraints.
- **What happened:** Ambiguity. `SKILL.md` describes redrafting only above the
  cap; the JSON's own note repeats that (*"over_cap true is bound 3"*). But the
  top-level verdict said `redraft` with nothing over cap. I acted on the literal
  `action` field and redrafted.
- **What I expected:** One place that says when a redraft happens. The catches
  themselves were *good* — `zero-contractions` on a draft with none, against my
  measured 0.42, was a fair and useful call.
- **Severity:** friction
- **Had to leave the docs:** no

### F-8 — `uniform-paragraphs` is documented, and cannot fire
- **Where:** `workflows/short-post.md`, "The shape."
- **Instruction as written:** *"**Vary the paragraph lengths.** Every paragraph
  the same number of lines is a section 9 tell and `gate --report` catches it as
  `uniform-paragraphs`."*
- **What I did:** Wrote the post as unwrapped paragraphs, one per line, which is
  how anything destined for LinkedIn gets written.
- **What happened:** `"paragraph_lines": [1, 1, 1, 1, 1, 1, 1, 1]` — eight
  paragraphs, every one reporting identical length, and `uniform-paragraphs`
  never appeared in `tags`. The metric counts source lines, so a normally-written
  file makes the rule structurally unable to fire.
- **What I expected:** The one rule the drafting section tells me to write
  against is the one rule that cannot check me.
- **Severity:** friction
- **Had to leave the docs:** no

### F-9 — "Ask for the number" has nowhere to put the answer
- **Where:** `SKILL.md` §4 hard rules vs. §3 "Where writes are allowed". Hit on
  the short post, hit again on the article.
- **Instruction as written:** *"If a draft needs a number the inventory does not
  have, **ask for it or cut the claim**."* And, three sections earlier: *"**A
  draft run otherwise reads profile files and never modifies one**"* — the paste
  path is the only exception.
- **What I did:** My short post wanted the cost of two ORs. It is not in my
  inventory. The article wanted an outside-world anchor, which `article.md`
  requires in the first three paragraphs and which my inventory has none of.
- **What happened:** If I ask and Marisol answers, the number is now in a
  published draft and in no file. `SKILL.md` §4 also says *"Everything factual
  comes from `inventory.md`."* Those two cannot both hold. On the short post I
  cut the claim. On the article I used a fact Marisol supplied in the turn (CMS
  and the surgical societies making first-case starts reportable), which
  `article.md` explicitly permits — *"or the human supplies it in the same turn"*
  — and which therefore traces to nothing on disk.
- **What I expected:** Either a writer for this case or an instruction to cut,
  full stop. "Ask for it" is offered as a resolution and is not one.
- **Severity:** friction
- **Had to leave the docs:** no

### F-10 — `nda-default` collides with the inventory retirement rule
- **Where:** `profiles/_template/identity.md` and `profiles/_template/inventory.md`,
  §0.4.
- **Instruction as written:** identity.md: *"`disclosure_posture: nda-default`
  changes the interview: inventory items are captured `do-not-publish` by default
  and cleared actively, one at a time."* inventory.md: *"An item marked
  `do-not-publish` retires to `inventory-archive.md` **immediately**, regardless
  of use or lock."*
- **What I did:** Answered the disclosure question honestly — nonprofit health
  system, assume I cannot post it until I say I can — which is `nda-default`.
- **What happened:** Read literally, every item I give is captured
  `do-not-publish` and therefore archived the instant it is written. The workflow
  saves it by clearing in the same turn, but the two files as written describe a
  profile that empties itself as it fills.
- **What I expected:** The posture that a hospital, a bank, or a law firm will
  pick should not be the one whose two governing files contradict each other.
- **Severity:** friction
- **Had to leave the docs:** no

### F-11 — The brief demands `thesis_id:` two sittings before `thesis.md` exists
- **Where:** `SKILL.md` step 3 brief schema, against `workflows/setup.md` §0.4.
- **Instruction as written:** The brief front matter lists `thesis_id:` with no
  qualifier. §0.4 requires a calibration post *"Log it like any other run."*
  `thesis.md` is written in Session B, one to two sittings later.
- **What I did:** Wrote `thesis_id:` empty and noted why in the file.
- **What happened:** No error, but the very first brief the product ever writes
  cannot satisfy its own schema. Same for `signal_id:`, since `runs/signals.md`
  is empty on a new profile.
- **What I expected:** Step 3 flags exactly one field as legitimately empty at
  this point (`archetype:`, *"the one field this step leaves empty on a visual
  run"*). It is not the only one.
- **Severity:** polish
- **Had to leave the docs:** no

### F-12 — Setup cannot complete for anyone who will not paste another writer's posts
- **Where:** `workflows/setup.md` §B.3 and the Resume list, item 5.
- **Instruction as written:** B.3: *"Never write a creator's mechanics from
  memory. If you could not read the posts, that creator gets no entry."* Resume
  item 5: *"`thesis.md` holds fewer than 3 corrected arguments with `against:`,
  **or `inspiration.md` is empty**. Go to session B."*
- **What I did:** Answered honestly: *"I read Priya Ramanathan, she runs supply
  chain for a system in Texas, and a guy who posts about anesthesia staffing
  whose name I would have to look up. I don't have any of it saved and I'm not
  going to sit here copy-pasting five LinkedIn posts into a text box."*
- **What happened:** Correct behaviour — no fetch, no entry, nothing invented.
  But the resume predicate now points at Session B forever. Every future run
  opens by telling me setup is unfinished, over a section I declined on purpose
  and that B.3 itself says to leave empty.
- **What I expected:** A way to record "asked, declined" that the resume check
  reads as satisfied. I wrote prose into the file so it is not literally empty,
  which is a dodge, not a resolution.
- **Severity:** friction
- **Had to leave the docs:** no

### F-13 — The article cap refuses a first-time user, and its refusal string has an empty slot
- **Where:** `workflows/article.md`, "The cap."
- **Instruction as written:** *"**N = short-post briefs shipped since the most
  recent brief carrying `format: article`.** With no shipped article, N is every
  shipped short post."* And: *"under 8 | **Refuse**, before step 3 crosses a
  single angle."* And: *"Print `N short posts shipped since <slug>, cap is 8`."*
- **What I did:** Ran the article. N = 1.
- **What happened:** Refusal. And the message it tells me to print has no value
  for `<slug>` — with no shipped article there is no prior slug to name, which is
  precisely the state every new user is in. The literal output is
  `1 short posts shipped since <slug>, cap is 8`.
- **What I expected:** This is the finding that would have ended the trial for
  me. I have posted twice a week for three years. Roughly sixty posts. The engine
  read my archive at setup — it is sitting in `shipped-history.md` — and the cap
  counts none of it, because it counts `runs/*/brief.md`. A person with a deep
  archive is treated identically to a person with none, and told to write eight
  more short posts first. There is no override, no `--force`, nothing.
- **My workaround, stated:** I overrode it. As Marisol: *"I'm not writing eight
  more before it'll let me write one long one."* I recorded the override in
  `brief.md` because there is no supported place for it. That is a user
  fabricating ledger state on day one, which is exactly what the rest of this
  system is built to prevent.
- **Severity:** blocker
- **Had to leave the docs:** no

### F-14 — On a visual run the language gate fires on the renderer's own syntax
- **Where:** `SKILL.md` step 5 (*"On a visual run, `draft.md` is the render
  spec"*) against `workflows/infographic.md` step 4b.
- **Instruction as written:** *"Step 4 writes the Markdown spec `render.py`
  consumes, so step 5's gate reads every word that reaches the canvas."*
- **What I did:** Wrote the spec, ran `gate --report` on it as instructed.
- **What happened:** Four catches, three of them artifacts of the file format:
  ```
  tags ['rhetorical-fragment', 'voice-floor', 'zero-contractions']
  lexical hits: [{'tag': 'rhetorical-fragment', 'term': 'items:', ...}]
  ```
  `rhetorical-fragment` fired on the literal string `items:` — required renderer
  syntax I cannot remove. `zero-contractions` fired on *"no contraction in 122
  words"* of chip labels. `voice-floor` fired on `sentence_length_stdev` 4.82
  against a 7.28 floor, on a document made of four uniform slots.
- **Then it got worse.** I redrafted once, adding contractions, per bound 3.
  `zero-contractions` cleared and the stats got *worse*, tripping a fourth rule:
  ```
  tags ['burstiness', 'rhetorical-fragment', 'voice-floor']
  stdev 3.99 (floor 7.28)   burstiness 0.511 (limit 0.54)
  ```
  The gate wants sentence-length variance of 9.7 out of node glosses that
  `VISUALS.md` §3.16 caps at 60 characters each. Those two constraints cannot
  both be met. The gate reads every word that reaches the canvas *and* every word
  that does not, and it holds signage to prose statistics. `reference/reader.md`
  knows better — it says *"even meter does not apply to slides"* — and the gate
  has no equivalent scoping.
- **What I expected:** A visual run that can pass its own gate.
- **Severity:** blocker (unpassable by construction; I shipped under bound 3's
  "ship the better draft and name what is unresolved")
- **Had to leave the docs:** no

### F-15 — The theme bootstrap accepts nine keys and then refuses to render them
- **Where:** `workflows/infographic.md`, "The theme.json bootstrap", and
  `render/infographic/render.py`.
- **Instruction as written:** *"ask for the nine keys before drafting rather than
  after rendering, write the file once."* And, contradicting `setup.md`'s
  promise that *"`_template/theme.json` ships with defaults that work unedited,
  so nothing is blocked by leaving it alone"*: *"Rendering from `_template`
  defaults produces the 'looks like a template because it is one' failure ... Do
  not skip this and render anyway."*
- **What I did:** Asked. Marisol answered like a person, not a brand guide:
  *"White background, black text, and the accent can't be blue, every hospital in
  America is blue. Dark green. Plain fonts. Nothing rounded."* I wrote
  `accent: #1F5C3D`, `fg: #111111`, `bg: #FFFFFF`.
- **What happened:**
  ```
  ERROR contrast: #111111 on #1F5C3D is 2.39:1, under 3.0:1 at 20px (VISUALS 6.3): 'Move the call to day 7'
  layout check failed. Fix the spec or the theme, not the generated HTML.
  ```
  Refused. My two answers — black text, dark green accent — are individually
  reasonable and jointly illegal, and I am told so in a ratio. `themes.md`
  promises the engine derives on-accent text from the far end of the palette
  precisely so this cannot happen; on my theme it picked the dark ink and failed
  its own contrast check.
- **What I expected:** Either the bootstrap validates the answers in the turn I
  give them, or the renderer picks the legible foreground. Instead the bootstrap
  is a form with no validation and the renderer is a wall with a WCAG number on
  it. Marisol has no idea what 2.39:1 means or which of nine keys to move.
- **My workaround, stated:** Guessed. Lightened the accent to `#4A8F63` until it
  passed, which is not the colour she asked for.
- **Severity:** blocker
- **Had to leave the docs:** no

### F-16 — The design tell's prescribed fix is inert on the builder it points at
- **Where:** `reference/design-tells.md`, `claim-below-the-feed-layer`, against
  the `causal-chain` builder.
- **Instruction as written:** *"**Redraft the spec:** shorten the headline so it
  can be set larger, or move the claim up a tier."*
- **What I did:** Got the warning, followed the instruction, shortened the
  headline from `The chain that cost us **23 points**` (35 chars) to
  `**23 points**, one phone call` (28 chars), re-ran.
- **What happened:** Byte-identical warning both times:
  ```
  WARN  thumbnail: 2 claim-layer node(s) at 54px are ~7.7px cap at 220px, under ~8px
  ```
  54px before, 54px after. The builder sets headline size from the template, not
  from string length, so the remedy cannot move the measurement it is prescribed
  for. Separately, `VISUALS.md` §3.16 claims this form *"has one of the strongest
  thumbnail contracts in the catalog"* and *"all of which survive at 220px"* —
  the renderer's own check disagrees on the first real render, for all five nodes
  and the headline.
- **Severity:** friction
- **Had to leave the docs:** no

### F-17 — Two design tells cannot be satisfied inside the budgets the same spec imposes
- **Where:** `reference/design-tells.md` `uniform-chip-lengths` vs.
  `VISUALS.md` §3.16.
- **Instruction as written:** *"The longest item should be at least twice the
  shortest."* §3.16: *"each node nameable in <=17 characters."*
- **What I did:** Node labels came out 16-19 characters.
- **What happened:** To satisfy the tell I would need a shortest label of 8
  characters or fewer alongside a 17-character maximum, across a four-node chain
  where each label has to name a real step. Accepted on purpose and documented.
- **Severity:** polish
- **Had to leave the docs:** no

### F-18 — The text-only design gate cannot see what the image actually did
- **Where:** `workflows/infographic.md` step 6, PRD §4's cost argument.
- **Instruction as written:** *"**The gate runs on the rendered HTML as text,
  never on a screenshot.** Looking at a 1080x1350 image costs roughly 1,900
  tokens per look."*
- **What I did:** Ran the gate as specified against `final.png.html`, wrote
  `design-gate.md`, rendered. Then I looked at the PNG, because I am the one
  posting it.
- **What happened:** The rendered 2160x2700 image has three defects the gate
  structurally could not see, none of which is in any tell:
  1. The accent highlight box on `**23 points**` carries trailing padding, so the
     comma is orphaned: the headline reads **"23 points , one phone call"** with a
     visible gap before the comma.
  2. The footer runs the wordmark straight into the source line with no
     separator: **"Marisol Okonjo-ReyesNorthgate Health perioperative scheduling
     data, 14 months, one campus"**.
  3. The vertical gaps between chain nodes are wildly uneven — node 1→2 is tight,
     2→3 and 3→4 are enormous stretches of white. It reads as broken, not airy.
- **What I expected:** The saving is real and so is the blind spot. Every text
  check passed, `design-gate.md` says the frame is sound, and the file I would
  have uploaded has a typographic error in its largest line.
- **Severity:** friction (would be blocker if I had posted it unseen — which is
  exactly what the workflow's cost argument encourages)
- **Had to leave the docs:** no

### F-19 — The same quotation is a warning and a hard failure in one report
- **Where:** `SKILL.md` step 5, lock 5, against `gate --report`'s `overlap` block.
- **Instruction as written:** *"A span of eight or more words repeated from a
  prior piece is PRD section 3's only hard fail ... **never patch the span**."*
  And: *"A span traceable to an inventory item or to `thesis.md` is cited in the
  report as a warning and left alone, since a check that rewrites the one story a
  person legitimately retells is a check they turn off."*
- **What I did:** Gated the article. It quoted my own inventory item, as
  `workflows/article.md` step 2 instructs (*"Quote the anchor's words when you
  use them verbatim"*).
- **What happened:** The carve-out fired and the hard fail fired, on overlapping
  text, in the same JSON:
  ```
  "failures": [
   {"prior": "2026-08-25-rooms-not-blocks", "words": 10,
    "text": "six of our rooms sat idle at three in the"},
   ...
  "warnings": [
   {"prior": "2026-08-25-rooms-not-blocks", "words": 18,
    "text": "rooms sat idle at three in the afternoon while nine cases waited to get on the schedule. We",
    "note": "traceable to inventory or thesis, cited rather than failed"}
  ]
  ```
  The 10-word failure is a substring of the 18-word warning. The engine
  recognised the passage as legitimately retold *and* hard-failed a fragment of
  it. Two of the three failures were my own prior writing, including a line from
  the pre-engine LinkedIn post I pasted at setup.
- **What I expected:** The gate was *right* that I had retold a shipped piece
  instead of citing it, and redrafting genuinely improved the article. But the
  verdict is self-contradictory, and the prescribed response — *"never patch the
  span"*, redraft from brief — means the only compliant move is to delete my best
  paragraph, which is what I did.
- **Severity:** friction
- **Had to leave the docs:** no

### F-20 — The reader has no name and no pronouns, and guessed wrong in the report I read
- **Where:** `reference/reader.md`, "The context block, and how it is generated."
- **Instruction as written:** *"`whose post this is:` identity.md `role:` +
  `company:` + `sells_what:` + `sells_to:`, as one byline line."*
- **What I did:** Rendered the block exactly as specified and spawned the grader.
- **What happened:** The grade came back with:
  > *"**He** killed his own capital request and named his own avoidance before
  > naming anyone else's."*

  `name:` is not in the context block's field list, so the grader had nothing to
  go on and guessed. I am a woman. The first quality report the product ever
  showed me got that wrong twice.
- **What I expected:** The block is meticulous about what must be omitted and
  omits the one field that prevents this.
- **Severity:** friction
- **Had to leave the docs:** no

### F-21 — `reader.md` describes `audience.md` fields as missing that shipped
- **Where:** `reference/reader.md`, immediately after the context block spec.
- **Instruction as written:** *"**Two of those fields do not exist yet.**
  `audience.md` has ... no slot for vocabulary, so `their_words:` and
  `words_they_never_use:` are a pending change to
  `profiles/_template/audience.md`."*
- **What I did:** Read that, then opened the template, which carries both fields
  and a header dating them to 2026-08-23.
- **What happened:** Followed literally, rule 2 omits two fields that exist and
  that Session A spent real interview time filling. My audience's vocabulary —
  *"block time," "prime time," "wheels in, wheels out"* against *"patient
  journey," "surgical ecosystem," "OR utilization"* — is the sharpest register
  signal in my profile and reader.md tells itself not to look at it.
- **Severity:** friction
- **Had to leave the docs:** no

### F-22 — `article.md` and `carousel.md` both own `runs/<slug>/draft.md`
Covered in full in its own section below, per the coordinator's request.

### F-23 — Job reuse: the rule reads absolutely and I broke it twice
- **Where:** `SKILL.md` step 2, structural job.
- **Instruction as written:** *"Reusing an anchor across formats is allowed.
  **Reusing the job is not.** A repurpose matching its source on anchor **and**
  job **and** thesis is refused."*
- **What I did:** Two sentences give two rules. Sentence two says the refusal is
  a three-way match. Sentence one says job reuse is flatly disallowed. I used
  `diagnose` on both the short post and the infographic, on different anchors.
- **What happened:** Nothing refused, because the engine implements the three-way
  reading. Under the flat reading I violated it on run two of my life. I switched
  to `argue` for the article to be safe.
- **Severity:** polish
- **Had to leave the docs:** no

---

## The article / carousel path collision

**Where:** `workflows/article.md`, "The carousel derivative", against
`workflows/carousel.md`, "Step 4: the draft as slide beats".

`article.md` is unambiguous that the two artifacts share one run directory:

> | Brief | The same `runs/<slug>/brief.md`. **No second brief and no second run
> directory.** |
> | Source text | `runs/<slug>/draft.md` **after** it has cleared step 5. The
> slides are cut from the gate-passed article, never drafted a second time from
> the brief. |

`article.md` step 6 also says: *"**Write `runs/<slug>/draft.md`.**"* — that file
is the article.

`carousel.md` step 4 then says, of the same run:

> Two writes, in this order:
> 1. **`runs/<slug>/draft.md`** — the caption, then the slide copy as plain
>    lines. Step 5's gate reads this file, so every word a reader will see has to
>    be in it: **words that never reached `draft.md` are words no gate ever saw.**
> 2. **`runs/<slug>/spec.md`** — the same words in the syntax above, derived.

Both files name the identical path in the identical directory, holding two
different documents. Writing the deck copy to `draft.md` destroys the article the
deck is required to be cut from. Not writing it means the on-slide words never
reach the file the gate reads.

There is a second, smaller collision stacked on it. `article.md`'s crossing table
says the derivative's output is *"`slides/` and `final.pdf` in the same run
directory"*. `carousel.md` step 7 produces `deck.html` and `deck.pdf` and lists
the run directory contents as *"`brief.md`, `draft.md`, `gate-report.md`,
`spec.md`, `deck.html`, `design-gate.md` and `deck.pdf`"*. Different filenames for
the same artifact, in the same paragraph-pair of the same feature.

**How I resolved it.** I kept the article at `runs/<slug>/draft.md`, because
`article.md` is explicit that the slides are cut from the gate-passed article
living at that path, and overwriting it would break the one crossing the two
files agree on. I wrote the deck to `runs/<slug>/spec.md` only, and gated the
deck's words by running `gate --report` against `spec.md` directly rather than
against `draft.md`.

That is a workaround, not a resolution, and it has a real cost: under
`carousel.md`'s own sentence, the deck's on-slide copy is *"words no gate ever
saw"* in the file the pipeline is specified to read. Any resolution that
preserves the article has that cost. I picked the one that preserves the
1,183-word artifact over the one that preserves the file path.

I never got to the PDF. `--check` passed on the spec:

```
WARN  slide 4 (bullets): bullet > 6 words: 'The tray was still in sterile processing'
WARN  slide 6 (steps): bullet > 6 words: 'Move the call | Day three becomes day se'
WARN  slide 7 (bullets): bullet > 6 words: 'Reclaiming block time is four hard conve'
WARN  slide 8 (cta): headline > 7 words (8)

check: warnings only.
CHECK EXIT: 0
```

Nine of ten warnings are the six-word bullet budget, which no sentence naming a
department and an action can meet. `carousel.md` says *"an accepted warning is a
decision rather than an oversight"*, so they are decisions. Ten decisions on one
deck is a budget nobody is using.

---

## Did the engine actually use my archive?

This is the part I care about most, since I gave it five real samples and a
three-year posting history.

**Yes, and measurably — but through one channel only, and it is the shallow one.**

What it demonstrably used:
- It ran the negative control over all six samples and found the one rule that
  fires on my own writing: `em-dash`, on my 2019 huddle memo. That rule is now
  off for me. That is a real, specific, evidence-backed act and it is the best
  thing this product did.
- It caught that my first draft had **zero contractions** against a measured
  0.42 and made me fix it. Correct call. My Slack messages are full of "isn't"
  and "won't" and the draft read stiff next to them.
- The verbatim-overlap lock read my pre-engine LinkedIn post and caught me
  recycling *"your throughput project is a turnover project, you are"* from
  April. Nothing else I use would have caught that.

What it did not use:
- **The samples never reached the drafting step.** `SKILL.md` step 1 loads
  `voice.md`, but `inspiration.md` loads *"only when `voice.md` declares that no
  samples exist"* — and the drafting instructions in `short-post.md` and
  `article.md` reference the brief, the hooks file, and the specifics floor.
  Nothing tells the writer to read my five samples and write like them. The
  samples are a *measuring stick*, not a *model*. Four numbers and a rule
  suppression is the whole of what my archive bought.
- **Sixty posts of history bought me nothing structurally.** The article cap
  counted them as zero (F-13). The runway line counted them as zero. As far as
  every gate and lock in this engine is concerned, I am a person who has posted
  once.

**Do the drafts sound like the posts I pasted?** Partly, and the gap is
instructive.

My pasted email to the CFO's analyst:

> *"Turnover is down from 34 to 27 minutes. Total cases per day is flat. So we
> bought 7 minutes and did nothing with them."*

The engine's article, unprompted:

> *"We took turnover from 34 minutes to 27 over about a year. My environmental
> services team earned every one of those seven minutes. Total cases per day
> didn't move."*

That is close. Same three-beat structure, same flatness, same refusal to
editorialise. But note what happened: it is close because it is *drafting from
the inventory item that quotes my email*, not because it studied my cadence. The
resemblance is content provenance wearing the appearance of voice matching.

Where the seam shows: I write in short declaratives with abrupt stops —
*"no. we are not adding a 6th room on fridays until PAT is caught up."* The
engine writes in balanced compound sentences with a subordinate clause doing the
work. It never once wrote a sentence under four words except where it lifted the
shape from my inventory. My real average is 16.4 words with a stdev of 9.7; the
article came back at stdev 10.08, which clears the floor and still reads smoother
than I do, because my variance comes from occasional two-word sentences and its
variance comes from evenly distributed medium ones.

And the tell nobody caught: I never in my life have written the phrase
*"perioperative day."* I say "the day" or "the board." It appears twice in the
article. My own `words_they_never_use:` list would not have caught it either,
because I did not think to put it there — but a step that had actually read my
five samples would have noticed I never use it.

---

## A-short-post

**The post** (shipped, `2026-08-25-rooms-not-blocks`, gate: 1 caught / 0
rewritten / 0 flagged, unresolved: punctuation-density; reader: L2):

> I spent months building the business case for two more operating rooms. I was
> wrong about which number was the constraint.
>
> I sat down with a year of scheduling data because I wanted ammunition for the
> capital request. What I found was a Tuesday in February: six of our rooms sat
> idle at three in the afternoon, while nine cases waited to get on the schedule.
>
> We didn't need rooms.
>
> We needed to take block time away from four surgeons running under 60%
> utilization, and nobody wanted to be the person who did that. Including me.
> That's what the business case was for. A capital request is what you write when
> the real fix is a conversation you don't want to have.
>
> I withdrew it.
>
> A room is the easiest thing in a hospital to count, and the hardest thing to
> blame. It shows up in the capital plan, it has a square footage, and it never
> sits across from you in block committee and asks why its Thursday is gone.
>
> Four surgeons under 60% has names attached to it. Two operating rooms doesn't.
>
> That's the whole reason the second one's easier to ask for.

- **Would I publish this under my own name:** Yes. With one edit to the last
  line, which I would make in the LinkedIn box in about fifteen seconds.
- **The single worst line:** *"That's the whole reason the second one's easier to
  ask for."* It is the worst because it is the last, and because "the second one"
  points backward at the wrong noun — I have just written "two operating rooms,"
  so my eye reads "the second operating room" before it resolves to "the second
  of the two options." Making a reader backtrack in the final six words of a post
  is the most expensive place to do it. It is also a restatement: the block
  committee line already landed the idea harder, and this one says it again at a
  higher altitude with nothing new in it. The reader subagent flagged exactly
  this, quoted it, and was right.
- **Does it sound like me or like a machine:** Like me, more than I expected, and
  I can say precisely why: the two best lines in it are mine. *"A capital request
  is what you write when the real fix is a conversation you don't want to have"*
  is a compression of what I said in the interview. *"asks why its Thursday is
  gone"* is the one line I did not supply and it is genuinely good — that is the
  engine's, and it is the sort of thing I would say. What gives away the machine:
  the sentence rhythm is too even in the middle third. Every paragraph is one
  unbroken flow with a comma doing the pivot. My own writing breaks harder — I
  start sentences with "no." and end them without landing. And *"I sat down with
  a year of scheduling data because I wanted ammunition for the capital request"*
  is a sentence explaining my motive, which I would never write; I would just say
  what I found.
- **Minutes from starting the workflow to something I'd post:** Eight, recorded
  off the wall clock into `posts.csv` as `minutes_to_ship: 8`. That is genuinely
  fast and it is the single best number in this report. It excludes the roughly
  forty minutes of interview that preceded it.

## A-article

**The article** (`2026-08-25-the-column-next-to-it`, 1,183 words, gate:
`gate_passes: true`, 0 catches, overlap clean, after one lock-5 redraft):

- **Would I publish this under my own name:** Yes, and this surprised me most. It
  is better than the short post. It argues instead of illustrating, it states the
  opposing position fairly before dismantling it, and the section *"Why it
  doesn't happen anyway"* is the one I would have avoided writing myself.
- **The single worst line:** *"The perioperative day is a chain of handoffs
  between departments that don't report to the same person, and the only segment
  instrumented end to end is the one that happens inside a room owned by one
  department."* Two reasons it is the worst. First, "the perioperative day" is
  not a phrase I use — it is the phrase a consultant uses, and it appears in the
  one sentence that is supposed to be the article's structural spine. Second, the
  sentence is forty-one words with two subordinate clauses and no stop in it. It
  is the exact sentence a COO's eye slides off, in the exact position where it
  cannot afford to.
- **Does it sound like me or like a machine:** Mostly me, and the giveaway is
  narrower than I expected. What is unmistakably mine: *"it ends in a field
  somebody has to populate by hand at 6:40 in the morning while a patient waits"*
  and *"We were short of anyone willing to make that phone call"* and the whole
  cancellation confession, which is my inventory item almost verbatim. What is
  the machine: the section subheads. *"What's actually broken"*, *"What changes
  if you fix it"*, *"Why it doesn't happen anyway"* — that is a template arc, and
  once you notice it is a template you notice it is the same template under every
  long post on LinkedIn. `article.md` prescribes that arc by name in a seven-row
  table. It works, and it is legible as a shape, and a reader who reads three of
  my articles will see the scaffolding.
  The other tell: it is *too even*. Every section is three paragraphs. Every
  paragraph is two to four sentences. Nothing runs short because I cared about it
  more.
- **Minutes from starting the workflow to something I'd post:** About twenty-five,
  including the cap refusal I had to argue past and one full redraft forced by
  lock 5. Against four to ten hours if I wrote it myself, which I do not, which
  is why I have never published a long piece.

## A-infographic

**The image** (`2026-08-25-four-days-of-notice`, `causal-chain`, rendered:
`final.png`, 2160x2700, 217KB; reader: L4):

- **Would I publish this under my own name:** Not as rendered. Yes after someone
  fixes two things I cannot fix from the spec. The content is right and the
  typography is broken.
- **The single worst line:** Not a line of copy — the headline as it actually
  renders: **"23 points , one phone call"**. That floating space before the comma
  is in 54px type at the top of the image, it is the first thing anyone sees, and
  it makes the whole thing look like a draft somebody posted by accident. Of the
  copy proper, the worst is the footer, which renders as
  **"Marisol Okonjo-ReyesNorthgate Health perioperative scheduling data, 14
  months, one campus"** — my name welded to the source line with no space. Two
  typographic failures in the two places a stranger looks first, and neither is
  something I did.
- **Does it sound like me or like a machine:** The words sound like me, more than
  anything else this run produced, because they are the shortest. *"Anesthesia
  won't clear a chart it can't read"* and *"Gowned, consented, and the room isn't
  moving"* are lines I would say out loud in a huddle. The 60-character cap
  turned out to be the best voice constraint in the product — it made the engine
  stop building compound sentences. What gives away the machine is not the
  language, it is the layout: the vertical gaps between the chain nodes are
  wildly uneven, tight between one and two and then enormous stretches of white
  between two, three and four. It reads as a template that did not know what to
  do with the space.
- **Minutes from starting the workflow to something I'd post:** Never got there.
  About thirty-five minutes to a rendered PNG, and it is not postable. The gate
  cleared it, the design gate cleared it, and the file has an error in its
  biggest line. Add whatever it takes to fix a renderer I am not allowed to edit —
  and `design-tells.md` bound 1 is explicit that *"The generated HTML is never
  patched"* — so for me, as a user, the answer is that I cannot get there at all.

## A-carousel

**The deck** (`2026-08-25-the-column-next-to-it`, spine `before-after`, 8 slides,
`--check: warnings only`). **PDF never rendered — the run was stopped before
step 7.** Judged on the spec copy only, and flagged as incomplete.

- **Would I publish this under my own name:** Cannot say honestly without seeing
  the PDF, and after what the infographic render did to two lines of type, I
  would not answer yes sight-unseen. On copy alone: yes, with the cover reworked.
- **The single worst line:** The cover headline, *"Turnover went down. **Volume
  didn't move.**"* It is the worst because slide 1 is the only slide that has to
  survive 220 pixels and this one spends its eight words on a setup with no
  claim in it. "Volume didn't move" is the least interesting true thing in the
  deck. The stat slide behind it — **71%** *"of our case delays started before
  the patient reached the OR"* — is the actual hook and it is buried at slide 5,
  where nobody who did not already swipe will reach it.
- **Does it sound like me or like a machine:** Like me on the body slides, like a
  deck template on the furniture. *"Room ready, empty, nothing booked into it"*
  and *"Flipping faster asks the least powerful to hurry"* are mine. The `kicker`
  labels are not — *"The two columns"*, *"What we bought"*, *"The part nobody
  writes down"* — those are captions written to fill a required field, and nine
  of the ten `--check` warnings say the same thing from the other direction: the
  six-word bullet budget cannot hold a sentence that names a department and an
  action, so every real line trips it and every line that clears it is a label.
- **Minutes from starting the workflow to something I'd post:** Incomplete. About
  twelve minutes from the gate-passed article to a validated spec, which is the
  cheapest artifact in the run because it is cut from something already written.
  That part of the design is right.

---

## Would I keep using this?

Probably yes, and I want to be precise about why, because most of this report is
complaints.

The thing that would keep me is narrow and real: it read six samples of my own
writing, found the one rule that would have edited my voice, turned that rule off
for me specifically, and told me it had done so. Then it caught me writing a post
with zero contractions when I use them constantly, and it caught me recycling a
sentence from my own April LinkedIn post that I had genuinely forgotten writing.
No tool I have ever used does any of that. Eight minutes from starting a run to a
post I would put my name on is not a marginal improvement over my current process,
which is opening a text box on a Sunday night and not posting anything.

What would make me stop is that almost every rough edge lands on the same
person — me — and asks me to resolve something two files disagree about. The
README does not run. The calibration file I was told to write parsed to nothing
and said `found`. The article refused me because it counted my three-year archive
as zero. The theme bootstrap took my nine answers and then the renderer refused
them with a contrast ratio. On a visual run the language gate flagged the
renderer's own syntax and then got angrier when I did what it asked. And the
image it finally produced has a floating space before a comma in 54-point type,
which no gate saw because the gate is forbidden from looking at the picture.

I am an operations director. I recognise this system: every individual rule is
defensible, every rule was written by someone who had been burned, and nobody has
walked the whole path start to finish as the person who has to walk it. That is
the same thing I say about our block policy.

**The one thing that would have made the difference:** a first run that actually
runs — one command, from the README, that gets a real person from nothing to a
posted draft without ever asking them to adjudicate between two files. I would
take that over every lock, every catalog, and all thirty-five hook patterns. The
engine's own best idea is `engine.js locks` printing a number instead of a
promise. Point that same honesty at the setup path: run it end to end as a
stranger, and fix everything that made the stranger guess.
