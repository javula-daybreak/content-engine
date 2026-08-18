# Adversarial Review: Content Engine PRD

**Reviewed:** `content-engine-PRD.md`, revision 2 of 2026-08-17
**Review date:** 2026-08-17
**Standard applied:** the PRD's own two product requirements. (1) It has to be a breeze to use, for a technical and a non-technical person. (2) It has to produce content a skeptical senior audience forwards.

**Method.** Twelve adversarial lenses ran against the document independently: cold start, content quality ceiling, LinkedIn platform reality, enforceability and determinism, token economics, longitudinal decay, the gate as a liability, differentiation, measurement rigor, spec integrity, multi-persona, and daily-loop ergonomics. Every finding was then attacked by a separate skeptic pass whose job was to kill it using the PRD's own text. Findings that did not survive were dropped and are not reproduced here. Ninety survived: 27 confirmed outright, 63 downgraded to overstated with a narrower core that still holds. Those 90 consolidate into 46 distinct defects through 19 merge groups, which are then ranked. A final gap pass ran against what no lens had looked at and produced 21 more findings across 3 areas; those have not been through refutation and are marked as such. Sixty-seven items total in this document.

---

## The verdict

As written, no on both requirements, and the two failures have a common root.

It is not a breeze. §8 promises "one keystroke to a finished post" while §1.1's own table makes the five-angle pick a router-owned blocking step, §14 mandates angles-then-draft-plus-two-hooks, §9 always prints a diff, §7 tails every run with a top-up, and §3 opens with staleness flags. That is two blocking decisions and four reading blocks per 180 words, 104 times a year, with §3's "Not agentic" row instructing the same implementer to do the opposite.

It will not reliably produce content a skeptical senior audience forwards. §7's generative core is "one inventory item, crossed with one thesis, aimed at one audience anxiety," a three-way join over a closed set of 15 to 25 interview memories with no oppositional axis, no clock, and no permission to assert anything outside inventory.md. That formula produces posts that are true, in voice, gate-clean, and unforwardable.

Then the arithmetic closes in. Sixty-day locks at four posts a week need roughly 35 standing items against a 15-to-25 seed, so somewhere in week four to seven the engine stops writing and starts interviewing, which is the product inverting. Underneath both failures sits the same structural fact: the state layer does not exist. Every mechanism §4 names as the differentiator (the gate, the inventory, the repetition guard) either reads or writes state the document forbids storing, hands exact string arithmetic to attention, or is validated by a metric that cannot fail.

**The single highest-leverage change** is to make the run log the only source of truth for state, and to change the anchor lock from calendar days to shipped posts. Concretely: delete `used:` and `performance:` from §7's schema; add `job:`, `hook_id:`, `thesis_id:`, `status:` to brief.md's front matter, written at step 3 where they survive every crash; let `/content-engine review` be the only thing that flips `status: shipped`; and rewrite §3's anchor lock as "off limits until 10 other pieces have shipped." That one change resolves the arithmetic deadlock that kills the product in week four, gives all three §3 locks a legal writer under §7a, gives the verbatim diff a real corpus, gives review a candidate list, gives the analytics join its key, and dissolves the §1.3-versus-§7a contradiction with one scoping sentence. It is subtractive, invisible to both personas, and it has to land before the first run because every one of those consequences is unrecoverable afterward.

Everything else in this review is a paragraph or a line.

---

## The fifteen that matter

### 1. L6-02 · blocker · §3, §6, §6.1, §7, §7a, §8, §12, §14, §15
**The 60-day anchor lock, one item per post, and 4 posts/week need ~35 standing items. Setup seeds 15 to 25.**
*Merges L1-02, L2-01, L3-01, L10-01, L12-04, L11-05.*

**Claim.** 60 days at 4 posts/week is 34.3 posts inside the lock window, so steady state needs ~35 items in permanent circulation. §12's own leading indicator, "Inventory depth (never below 15 unused items)," is breached at post 11 and can never be satisfied thereafter. The queued §14 change to per-format item counts raises the burn rate.

**Fails when.** Joseph finishes setup with 25 items and holds cadence. Around day 44 every item carries a used date inside 60 days. §7's prescribed response is "says the inventory is thin and runs a top-up interview," so the person who opened a terminal at 8:40am to post something is instead being interviewed to feed the machine, four times a week, from week four onward.

**Fix.** Change the lock unit: an anchor is off limits until 10 other pieces have shipped. Reuses the counter §3 already maintains for the verbatim diff, self-scales with cadence, matches what a reader experiences, cannot deadlock above 11 items. Delete §12's "never below 15 unused items" and print `runway: N posts at current cadence` at run start instead.

---

### 2. L12-06 · major · §1.1, §1.3, §3, §4, §5, §7, §7a, §8, §11, §14
**No command may write `used:`, so all three §3 locks have no state store.**
*Merges L4-01, L6-01, L8-01, L9-06, L10-05.*

**Claim.** §3 requires each consumed anchor to be timestamped and §7 puts that timestamp in `used:`. Three rules forbid writing it: §7a's "A draft run reads profiles and never modifies them," §14's "Only named commands write to a profile," and §7a's "Append, never rewrite." `performance:` is orphaned identically, which deadlocks §7's retirement rule and turns the 400-line trigger into a permanent un-actionable nag.

**Fails when.** The implementer takes the obvious branch and stamps `used:` at draft time. Joseph rejects a flat draft built on the UTD item. That item is now locked until October, spent on a post nobody read. He finds out three weeks later when he asks for it by name.

**Fix.** Delete `used:` and `performance:` from §7's schema. Derive all lock state from `runs/*/brief.md` front matter, written at step 3. Add one scoping sentence to §7a: profile file means the nine curated files in §5; `runs/` and `analytics/` are the run ledger and every run writes them. Move the ledger append from §4 item 9 to item 3.

---

### 3. L7-07 · major · §3, §4, §6.2, §7, §8, §9, §12, §13
**The gate's rewrite loop has no cap, no substitution rule, and never re-measures.**
*Merges L7-01, L2-03, L10-04, L12-05.*

**Claim.** §9 specifies catch, rewrite, show a diff, with no pass cap and no re-measurement. Every distribution-shaped rule ("Uniform sentence length," "Every paragraph the same number of lines," contraction extremes) is evaluated against text the gate is about to change, so flattening the gate itself causes is structurally invisible to it. The lexical rules are purely subtractive: nothing says what replaces a removed em dash, and the cheapest resolution is splitting the sentence.

**Fails when.** Fallon's draft trips eleven rules. The gate resolves all eleven, the post has no dashes, no fragments, no three-item list, every sentence a medium declarative, and it passes clean. It lands below her trailing-20 median and §11 blames the hook pattern.

**Fix.** Four sentences in §9: re-run the gate on the rewritten text; a rewrite substitutes and never subtracts; cap at 3 rewrites per 200 words and never rewrite the same span twice, above which redraft once with the tripped rules as drafting constraints; no run ends without an artifact, so ship the better draft with the unresolved rule named.

---

### 4. L7-03 · blocker · §9, §14, §7, §7a, §3
**The rewriter can silently alter quotes, numbers, and names.**

**Claim.** §9 hands the rewriter the whole draft and names nothing it may not touch. §7 inventory content is "one to three sentences of the actual raw material" and §7a marks entries `pasted`, "their own writing, verbatim." "Double down," "moving the needle," "navigate," and "leverage" are all on the ban list and all appear in how supply-chain operators actually talk.

**Fails when.** Joseph posts on the planner at the $2B distributor. Her recorded line uses "double down." The gate rewrites it to "commit further to" and the diff reads like a style change. A direct quote attributed to a real, identifiable person is now a fabrication published under his name. §14's most important rule was broken by §9's mechanism, not by the drafting model.

**Fix.** One paragraph in §9: the gate never rewrites inside quotation marks and never alters a numeral or a proper noun anywhere. A banned item inside a protected span goes under a separate gate-report heading, "not rewritten: quoted or factual." Add the matching drafter instruction so verbatim inventory words get quoted, which makes the span self-identifying.

---

### 5. L1-03 · blocker · §6.1, §6.2, §7a, §8, §12, §13, §14
**Setup never says when it writes, so compaction turns confirmed instances into paraphrase.**
*Merges L5-02, L10-08.*

**Claim.** §6.2 attaches a write instruction to four of its seven sections and attaches none to Raw material, the section it calls "the longest section and the most valuable." §7a explicitly excludes setup. Two failures follow: total loss on interruption, and silent provenance corruption when the session compacts.

**Fails when.** §13 step 1 is "Run it on Joseph," one multi-hour session. Auto-compaction fires near hour two. Items 1 through 12 become a summary. The interviewer, still following §6.1 rule 1, writes paraphrase tagged `source: interview`, because in its view the answer was confirmed. Six weeks later a post asserts a detail he never said in those terms, on the seed inventory every later calibration is tuned against.

**Fix.** One rule in §6.1: append each item to inventory.md in the turn it is confirmed, in the person's own words; if you cannot quote their exact words, do not write it. §8's setup comment becomes resumable. No `setup-state.md`: §6.1's stop condition is already a predicate over files on disk, so resume by counting items and finding the first unwritten section.

---

### 6. L2-02 · major · §7, §6.1, §6.2, §8
**Angle crossing has no opposition axis, so it can only produce illustrations.**

**Claim.** A join of item x thesis x anxiety yields "here is a true thing from my work that shows why my belief matters to people worried about X," which is the shape of every competent, forgettable LinkedIn post. Nothing in the crossing carries a counterparty who is wrong, a sentence the reader argues with, or a cost to the author, and "anxiety" pulls toward reassurance. (The anxiety-reads-as-reassurance half is taste. The missing opposition axis is structural.)

**Fails when.** Fallon gets five angles that are the same sentence with different nouns. She picks the third because it is least likely to annoy an account. The post is true, in voice, passes every gate, and gets eleven reactions, nine from Daybreak employees. A VP of Supply Chain reads it, agrees with all of it, and forwards nothing.

**Fix.** Change §7's "aimed at one audience anxiety" to "aimed at one thing the audience believes and is wrong about, or is tired of hearing." audience.md already holds the second half per §6.2, so this costs a word. Add one field to thesis.md entries: `against:`, the strongest version of the opposing position in the words someone who holds it would use, captured by one question in §6.2's existing propose-and-correct loop.

---

### 7. L5-04 · major · §3, §5, §9, §12, §13
**Exact string and number work is assigned to attention and fails silently.**
*Merges L4-02, L4-03.*

**Claim.** §3 declares the verbatim diff a hard fail with numeric thresholds and implements it by having the model hold twenty prior posts (~5,900 tokens) in context and eyeball them for shared 8-word runs. The same applies to half of §9. "Zero tolerance" is a determinism claim enforced by a summarizer, and gate-report.md is written by the same model that missed the character. "~15% sentence-level similarity" has no defined metric anywhere. And an unqualified 8-word ban makes retelling your own story impossible, because the inventory `content` field is a fixed sentence.

**Fails when.** Post 23 reuses "kept a shadow spreadsheet for eighteen months because she did not trust the system," thirteen words verbatim from post 9. The model reports clean. Two commenters read both. Nothing in gate-report.md records that the check failed.

**Fix.** One dependency-free `reference/engine.js` run before the gate, corpus never entering context: 8-gram intersection, similarity ratio, lexical scan, stdev and contraction rate as numbers. Emit JSON that gate-report.md quotes verbatim. Before comparing, strip any span appearing verbatim in inventory.md `content` or thesis.md. Traceable overlap is a citation and gets a warning with the prior slug. Untraceable overlap is the hard fail.

---

### 8. L2-08 · major · §3, §4, §5, §6.2, §7, §11, §13, §14
**The draft-time load list omits audience.md and learnings.md.**
*Merges L3-06, L8-05.*

**Claim.** §5 states the load list imperatively and contradicts two other sections. §7 defines an angle as needing an audience anxiety and audience.md is not loaded. §11 states flatly that learnings.md "is loaded at draft time" and it is not loaded either. §5 also annotates learnings.md as "updated by phase 5" when §13 phase 5 is the render pipeline.

**Fails when.** The builder implements §13 step 3 against §5's list. The angle step runs with no audience file, so the model either invents the anxiety (forbidden by §14) or drops the axis. Joseph ships ten posts aimed at nobody, then §13 step 4 tunes voice against his edits of those posts. Step 4 gates step 5, so the one calibration gate in the build order runs on the wrong variable.

**Fix.** Make §5's lazy-load line the single authoritative list: identity, voice, thesis, audience, learnings (confirmed entries only), compact inventory index with shortlisted items hydrated, inspiration when no samples exist. Move ai-tells.md to gate time. Delete the restatements in §7 and §11 and point them at §5.

---

### 9. L7-02 · major · §1.2, §6, §6.2, §7a, §9, §12, §13, §14
**§6.2 measures the person's voice and nothing ever reads the numbers.**
*Merges L6-05, L7-04, L8-02.*

**Claim.** §6.2 extracts average sentence length and variance, fragments, contractions, profanity, questions, and how they handle lists. Nothing in the document reads any of it. The only enforced language check is a shared, person-independent, negative-only blocklist with non-advisory authority and no stated precedence, so a stranger's list silently overwrites measured habits. This is also why §9's one numeric rule has no threshold: the corpus is sitting unused two sections away.

**Fails when.** Tim ships 62 posts, the dashboard reads 79% zero-edit and gate catches down 40%, and his sentence variance has collapsed from the Slack messages he pasted at setup. Nobody notices, because nothing compares the two.

**Fix.** Three edits. Precedence: voice.md wins, and a tell contradicting a documented habit does not fire for that profile, it gets recorded in gate-report.md. Threshold: flag when stdev or contraction rate falls more than 25% below the value recorded in voice.md at setup, and freeze those setup values against re-derivation. Positive check: a draft with zero named people, companies, dates, or numerals is redrafted, not rewritten.

---

### 10. L12-01 · major · §1.1, §3, §6.2, §7, §8, §9, §14
**Mandated ceremony makes the default run homework.**
*Merges L12-02.*

**Claim.** §8 promises one keystroke. §1.1's table makes "human picks" a router-owned blocking step for every format, §14 mandates angles then draft plus two hooks, §9 always prints a diff, §7 tails with a top-up, §3 opens with staleness flags. §3's own "Not agentic" row gives the opposite instruction. Implementers build the hard rules, so §8 loses. The pick also asks the human to compare five abstractions of posts that do not exist yet, at the moment of lowest information.

**Fails when.** Post 11, Tuesday 8:40am before standup. Five angle descriptions, a draft, two hooks, an eleven-item gate report, a top-up prompt. He posts nothing and starts batching Sunday nights instead, which produces posts that read like they were batched.

**Fix.** Keep five-angle generation, stop blocking on it. Draft the engine's pick immediately and print the four rejects as one-liners beneath the finished draft; follow-ups are conversational, which is free in Claude Code. Amend §14 to "never show a draft without showing what it was chosen over" and amend §3's not-agentic row to match. Cap run-start warnings at one line.

---

### 11. L12-07 · major · §5, §7, §7a, §8, §14
**No path from "this happened this morning" to a post.**
*Merges L2-09.*

**Claim.** §14 requires every fact to come from inventory.md and §7a lets only `/content-engine inventory` write there, so live material takes two invocations, one of them conversational, before a word is drafted. §8's `post <topic>` looks like the fast path but can only select from what inventory already holds. §7's top-up question exists and fires after the draft, so this week's material is available to next week's post and never today's.

**Fails when.** A major shipper's ordering system goes down and it is the only thing Joseph's audience is discussing. He writes the post by hand in nine minutes. It outperforms everything the engine produced that month. Having written one by hand, he writes the next by hand, and that is the evidence he uses in month three.

**Fix.** Extend one command: `/content-engine post "<pasted raw material>"` drafts from the pasted text in the same run and on accept invokes the existing `/content-engine inventory` append path with `source: pasted`. §7a survives verbatim because nothing else writes. Two lines of doc change, and inventory grows as a side effect of posting rather than as a chore.

---

### 12. L1-04 · major · §6.1, §6.2, §12, §13
**Forty-five minutes is wrong; the stop condition describes three hours.**

**Claim.** §12's 45-minute test and §6.1's stop condition are incompatible by a factor of three to five. The stop condition requires 15 to 25 instance-grade items, 3 to 5 theses proposed and corrected, voice extracted from real samples, and a sample post confirmed, with rules 3 and 4 mandating follow-ups on all of it. §6.1 forbids the escape hatch: "Do not let them stop early to be agreeable." No time cap, no progress display, no reduced-yield exit.

**Fails when.** Dana hits minute 70 at item 11 and says let's call it there. The engine, following its instructions exactly, tells her the inventory is short and asks two more questions. That is when she quits, and per L1-03 she loses all eleven items. §13 step 6 records a fail with no diagnosis.

**Fix.** Split setup into two sittings and hard-cap the first at 45 minutes with a reduced stop condition: 8 items, 2 theses, 3 pasted samples, one calibration post through the real §9 gate. Session 2 is the remainder, resumable. Add `added: <ISO timestamp>` to the §7 schema next to `used:` so median wall clock and point of abandonment come free from the profile. Replace §12's 45 with the measured median across Joseph, Fallon, Tim, and the IBM mentor, stated as two numbers.

---

### 13. L10-07 · major · §1.1, §3, §4, §5, §8, §11, §12, §14
**No run is ever marked shipped and no post URL is ever captured.**
*Merges L9-05, L4-07.*

**Claim.** §14's copy-paste rule means the engine never observes publication, and no step captures the URL that §11 names as the join key. §5's run directory has no status field. Four mechanisms go inert: review has no candidate list, §3's diff cannot distinguish published from abandoned, §12's flagship 70% metric is uncomputable from day one, and §6.2's voice re-derivation would read the engine's own drafts. posts.csv ships with headers in §1.2 and its header row is specified nowhere.

**Fails when.** Week three, first review. Joseph either pastes ten URLs from memory or the command logs abandoned drafts as shipped posts with zero engagement, poisoning learnings.md. Separately, at 1.4k followers he already has a posting history the diff corpus contains none of, so his fourth engine post can rebuild his best June post in front of the same audience.

**Fix.** Define shipped as "has a row in posts.csv." One keystroke at run end: "Shipped as written? [y/n]," where `y` copies draft.md to `shipped.md`, appends the row, and increments the zero-edit numerator. Batch URLs and engagement into the weekly review. Once Apify lands, fuzzy-match scraped text against draft.md to recover the join and a real edit distance retroactively. Freeze a minimal header now and seed the diff corpus from §6.2's existing sample request.

---

### 14. L7-06 · major · §1.2, §3, §4, §9, §12, §13, §14
**The only gate test measures recall, so a gate that rewrote everything scores 100%.**
*Merges L4-04, L7-05, L8-08.*

**Claim.** §13 step 2 is the entire test surface and it is positive-class only. Nothing measures the false-positive rate, while §14 makes the gate non-advisory and §3 makes it destructive. §12 cannot see over-firing either, because zero-edit percentage is measured downstream of the rewrite. §4 builds the gate as item 2, with full authority, before short posts exist. And "The list only grows" makes precision monotonically decaying: a wrong rule stays wrong forever.

**Fails when.** Joseph writes three tight declarative sentences because that is how he writes when annoyed, which is the most recognizably human thing in the draft. The stdev check fires with no threshold, §3 forbids warning, and the passage is rewritten into prose that reads like the tool. He overrides once, hits it again Monday, and stops opening gate reports by week four.

**Fix.** One line in §13 step 2: run the gate over the person's own pasted samples and the inspiration.md posts, where every fire is a rule bug. Bar: zero rewrites on their own samples. Add `reference/gate-fixtures/` holding the 20 real known-AI posts, which the no-fiction rule does not block. Replace "The list only grows" with a strikethrough retirement path.

---

### 15. L1-01 · major · §1, §1.1, §1.2, §1.3, §2, §4, §5, §8, §12, §13
**The word the PRD tells the user to type is not a command.**
*Merges L1-07, L8-03.*

**Claim.** §1.3 and §2 both say the user opens Claude Code and says "Start." §8 defines eight `/content-engine` commands and "Start" is none of them. README is absent from §1.2's ships list, so nothing states the install step. §1.2 ships render.js with no package.json and no lockfile, and `npm install` does not fetch Chromium, so `npx playwright install` is a manual dependency §1.3 claims does not exist. §13 orders the portability test after the render build.

**Fails when.** §13 step 6, the one external test of the whole portability thesis. The mentor gets an uninterpretable result: nobody can tell whether the engine leaked Daybreak strings or just leaked a toolchain assumption.

**Fix.** README in the ships list, first line the clone command, second line `/content-engine setup`. Delete "Start" from §1.3 and §2. Write SKILL.md's `description:` frontmatter to name LinkedIn, post, carousel, and the setup interview. Add package.json, a lockfile, and node_modules to .gitignore. Preflight node and Playwright in `workflows/carousel.md` step 0 and degrade to printable slide HTML on failure. Swap §13 steps 5 and 6. Change §1's "Anyone can install it" to "Anyone who can run Claude Code can install it."

---

## Contradictions the reviewers could not both have

Ten places where surviving findings ask for opposite things. Each is resolved here rather than left for whoever writes SKILL.md to discover.

### 1. The five-angle pick: delete it, or protect it?
*L12-01, L12-02, L2-02, L7-02*

The ergonomics lens wants the mandatory pick deleted, citing §3's own "Not agentic" row, which says the engine "picks the angle, drafts, gates, renders, and self-critiques without being re-prompted at each step." The quality lens argues the crossing already produces five near-identical safe options and that the human pick is the last place taste enters before words exist. §14 mandates the pick, §1.1 makes it router-owned and unwaivable, §8 promises one keystroke.

**Resolution: delete the block, keep the generation.** The engine drafts its own pick immediately and prints the four rejects as one-liners under the finished draft. The human says "do the third one" conversationally if they want it. I am picking the ergonomics side deliberately, because the quality value of the angle step is in generating five, not in selecting one. The selection happens at the moment of lowest information, before any of the five exists as prose, and the visible selection pressure runs toward whichever option is least likely to annoy an account. Pay for the lost taste gate elsewhere, where it is cheaper and better aimed: fix the crossing formula (L2-02's `against:` field and the swap from "one audience anxiety" to "one thing they believe and are wrong about") and add the specifics floor from the merged L7-02 fix. Amend §14 to "never show a draft without showing what it was chosen over," and amend §3's not-agentic row to match, so the router has one instruction instead of two.

### 2. Em dashes: keep zero tolerance, or relax to a measured rate?
*L2-03, L7-01, L9-04, L8-02, L10-04*

Four lenses argue §9's em dash and semicolon bans push output toward punctuation scarcity, which they cite as the current 2026 machine signature, and want the rule relaxed to a per-person measured rate. Three skeptic passes argue the opposite: the threat model is a skeptical human reader who pattern-matches an em dash to ChatGPT in half a second, not a classifier, and Claude, which drafts here, over-uses them.

**Resolution: keep "Em dash. Zero tolerance."** The corpus evidence cited across four findings is untagged and unverifiable, and §14 of this very document forbids acting on exactly that class of claim. More importantly, a frequency statistic about model output does not tell you what a VP of Supply Chain reads as machine-written, and the second measurement is the one §9 is built against. The false-positive cost is a comma. The false-negative cost is the product promise. Three real changes instead. Drop the en dash from the ban between digits, because rewriting "Q3-Q4" spends the gate's credibility on nothing. Scope the semicolon ban to short posts, since §4 has articles in scope and a semicolon in 1,200 words is not a tell. Then fix the actual mechanism, which is that rewrites subtract punctuation instead of substituting it and are never re-measured. Substitution plus re-measurement removes the flattening without touching the rule everyone is arguing about.

### 3. The gate: weaker or stronger?
*L7-02, L7-06, L7-05, L1-05, L8-02*

Half the gate findings want it weaker: voice.md overriding the blocklist, a negative control that deletes over-firing rules, per-profile exceptions. The other half want it stronger: positive checks, a specifics floor, an announcement-register block, more tells appended. §14's "The gate is not advisory" amplifies whichever direction wins.

**Resolution: weaker on lexical absolutes, stronger on positive floors.** These are not in tension once you separate rewrite authority from reject authority. Lexical and texture rules lose authority to voice.md's measured numbers, and they can be struck when the negative control shows them firing on the person's own prose, because those rules edit the human's sentences. The specifics floor gains a different kind of authority: a draft with zero named people, companies, dates, or numerals is redrafted, never rewritten, because an abstraction cannot be patched into an instance. Net effect is fewer rewrites and more rejects, which is the correct direction for both product requirements. It stops the gate sanding away the person's habits, and it enforces §6.1's instance-over-category philosophy, which nothing in the document currently checks.

### 4. The anchor lock: four incompatible fixes
*L6-02, L2-01, L12-04, L10-01, L3-01*

Every lens agrees the arithmetic is broken and four propose incompatible repairs. Cut cadence to 2 or 3 per week. Lock the (anchor x structural job) pair for 90 days. Lock until N other items are consumed via a derived formula. Or keep the calendar lock and only fix the metric. L2-01 explicitly argues the pair lock trades starvation for reader-visible repetition.

**Resolution: change the unit to shipped posts.** An anchor is off limits until 10 other pieces have shipped. Reject the pair lock: at 4 posts a week it licenses six retellings of one anecdote per quarter, and a follower who sees all of Joseph's posts experiences that as a man with one story about a planner, not as six structurally distinct posts. L2-01 is right and L12-04 and L10-01 are wrong on this. Reject the derived formula (`min(60, floor(7 x items / cadence))`), because nobody will tune that curve, a lock that silently relaxes exactly when inventory is thinnest is inverted, and no user can answer "why can't I use the UTD story today?" from it. Reject cutting cadence as the opening move; make it the fallback if measured top-up yield stays under roughly 2 items a week through week six. The shipped-post unit reuses a counter §3 already maintains, self-scales to any cadence, matches what a reader experiences, and can never deadlock above 11 items.

### 5. A script for the string work, against zero manual dependencies
*L4-03, L5-04, L4-01, L1-07, L8-03*

The determinism lens wants a script computing n-gram overlap, lock state, and the lexical scan, because a model cannot do exact string arithmetic reliably. The portability lens wants zero manual dependencies, a clean `git status`, and §1.3's "no dependency installed manually" honored, and treats every added runtime as an attack on the non-technical persona.

**Resolution: one dependency-free `reference/engine.js`.** Node is already required by `render/render.js`, every Claude Code user has it, and a script with no npm install and no external package satisfies §1.3 completely. That clause is about the user installing things, not about executable code existing. Do not add Python; two runtimes make portability worse. Constrain the script to write only inside `profiles/<handle>/`, which the queued §5 move enables, so §12's corollary check still passes. The one genuine dependency, Playwright's Chromium download, stays on the carousel path only and gets a preflight with an HTML-print fallback. Nothing here is user-visible.

### 6. Capture everything per post, against zero prompts in the daily loop
*L9-05, L4-02, L10-07, L12-01, L8-06*

The measurement lenses want shipped text, post URL, edit distance, wall-clock duration, and token counts captured per post, because without them the analytics join, the diff corpus, the 70% metric, and the engine-versus-text-editor comparison are all inert. The ergonomics lens wants the run to end at the draft with zero prompts, and correctly names per-post capture rituals as the thing that stops being filled in by week three.

**Resolution: one keystroke at run end, everything else batched or computed.** "Shipped as written? [y/n]" buys the diff corpus and §12's flagship metric with a single character and no analytics loop. URLs and engagement numbers batch into `/content-engine review`, a weekly sit-down the user already runs, never the daily driver. Wall-clock `minutes_to_ship` is computed, not typed, and its baseline comes free from §13 step 4's ten hand-written posts. Token counts get deleted from the product entirely and measured once with `/cost` over ten days. Once Apify lands, fuzzy-match scraped text against draft.md to recover the URL join and a real edit distance retroactively, reusing the similarity routine the verbatim check already needs. Rule of thumb for this document: the machine does every join it can compute, and the human types one character per post and three numbers per week.

### 7. Where the top-up lives
*L2-09, L12-07, L6-03, L12-01*

L2-09 wants the top-up moved to the front of every run so today's material can anchor today's post. L6-03 wants it moved to the weekly review, because a weekly-framed question fired four times a week trains refusal. L12-01 wants it deleted from the daily loop entirely. All three are attacking the same misplaced paragraph from opposite ends.

**Resolution: it should not be a prompt in the run at all.** Split it. The fast path becomes `/content-engine post "<pasted raw material>"`, which drafts from pasted text and appends it via the existing named writer on accept. Zero prompts added, today's news reachable in one command, and inventory grows as a byproduct of posting. The systematic replenishment moves to `/content-engine review` weekly, primed from §6.1's recorded gaps and from inventory composition rather than opening with "anything happen this week?" Delete the after-run top-up from §7. That satisfies all three findings and removes a prompt rather than relocating one.

### 8. Hard voice-sample requirements against the non-technical persona
*L11-02, L1-05, L12-01*

L11-02 wants a hard requirement of five quoted sentences of the person's own writing before voice.md can exist, to stop three Daybreak accounts converging on one company register. L1-05 wants the engine to refuse to draft when voice.md holds no pasted samples. Both collide with §6.2's explicit no-samples path, §12's 45-minute portability test, and the persona in §2 who wants this precisely because she has never written anything long-form.

**Resolution: no hard requirement and no refusal.** Both hand a brand-new user a dead engine on day one, which is worse than a mediocre first draft she can edit. Broaden what counts as a sample so the requirement almost always self-satisfies: replace "Ask for 3 to 5 things they've written" with "paste the last three Slack messages you sent that ran longer than two sentences, and the last email you wrote that you did not template," with a two-minute voice memo transcribed as the fallback. Everyone has these, it is less friction than hunting for blog posts, and it is the only way to get real cadence out of someone who does not write. Make the deficit loud rather than blocking: when voice.md has zero `source: pasted` entries, the gate report opens with "No samples of your writing on file. This draft is inferred, not matched." On L11-02's actual question, answer §15 bullet 3: no for `joseph/`, `fallon/`, and `tim/`, yes for a company profile only, and add one line to §14 stating that voice.md is never seeded from another person's or a company's voice file.

### 9. learnings.md at draft time: enrich it, or filter it?
*L9-02, L9-03, L5-05, L6-04*

§11 states learnings.md is loaded at draft time. L9-03 wants it loaded with full outlier post text as a richer prior. L9-02 and L5-05 want unconfirmed and killed hypotheses withheld from the drafting context entirely. L6-04 wants the exploration post to deviate on one named dimension rather than ignoring all learnings at once.

**Resolution: withhold, do not enrich.** Only `confirmed` entries load at draft time. Reject L9-03's full-text outlier prior outright: it points the drafter at ten of the author's own posts at the exact moment §3's verbatim lock is diffing against the last twenty shipped pieces, and it is the collapse vector §11's own guardrail was written against ("do not let learnings.md collapse the engine into one repeated format"). Take L6-04's single-dimension exploration with `arm:` and `tests_hypothesis:` logged in brief.md, because a post that ignores everything at once produces a result nobody can attribute. Net: the loop gets quieter and more interpretable, which is the only honest direction available at four observations a week.

### 10. Cross-profile visibility against the write constraint
*L2-07, L11-01*

L11-01 wants a shared-fact lock across the four Daybreak profiles and proposes a `shared_key:` schema field set during setup. L2-07 correctly notes that §1.3 constrains writes, not reads, so a sibling read is already legal and merely unspecified, and that §15 still leaves the org-layer question open.

**Resolution: notice, not lock, and no new schema field.** When more than one directory exists under `profiles/`, the router reads `profiles/*/runs/index.md` at run start and prints the last 14 days of sibling activity, one line each. Joseph sees Fallon shipped that story Monday and picks another angle, and the same line surfaces the shared-thesis case a hard lock would wrongly block. It globs to nothing on a solo install, it is read-only so §1.3 is untouched, and it needs the run row to carry a readable anchor summary rather than only an id, which is a one-word change to §4 item 9. Reject `shared_key:`: asking an interviewee at minute forty to predict which of her stories a colleague will also tell produces a field that is 80% blank by week three, and a blank key makes the lock silently inert while the operator believes it is armed. Then resolve §15 bullet 2, because leaving it open is what makes this undecidable.

---

## Full findings by lens

Every finding that survived refutation, in full. Merged findings appear once, under the lens of the kept id, with the merged ids named inline. Items already summarized above carry their rank.

### L1. Cold start and time to first post

**Lens verdict: fails.** §12's 45-minute claim and §6.1's stop condition were written by different hands and never reconciled. That single unreconciled pair drives most of what follows: no checkpoint, no resume, no reduced-yield exit, and no defined behavior for the user who gives four items and stops. Underneath it sits a plainer problem, which is that the word §1.3 tells the user to type is not a command. And the inventory arithmetic does not close. What the document gets right and should not be touched: §1.1's one-router decision, §1.3's write constraint, the refusal to ship any fictional profile, and §4's insistence on logging tokens from run one. The defects are in the onboarding path, not the architecture.

---

**L1-01 · major · §1, §1.1, §1.2, §1.3, §2, §4, §5, §8, §12, §13 · ranked #15**
*The word the PRD tells the user to type is not a command, README is not in the ships list, and there is no package.json for the render path.*
Merges L1-07, L8-03.

**Claim.** §1.3 and §2 both instruct the user to open Claude Code and say "Start." §8 defines eight `/content-engine ...` commands and "Start" is none of them, so the entry point the document describes does not exist. §1.2's ships list omits README.md entirely; §5 mentions it once as a bare filename, so nothing anywhere states the install step, which is a one-line `git clone <repo> ~/.claude/skills/content-engine` that satisfies §1.3's "no skill authored by the user" cleanly. Separately, §1.2 ships "`render/` with templates and render.js" and no package.json, no lockfile, and a .gitignore specified only as "excluding `profiles/*` except `_template/`" with no node_modules, while `npm install` does not fetch the Chromium binary, so `npx playwright install` is a manual dependency step §1.3 claims does not exist. §13 then orders the portability test (step 6) after the render build (step 5), so the test measures the Playwright installer rather than the writing path. §1's flat "Anyone can install it" is false as delivered; "anyone who can run Claude Code" is true and still pays for `profiles/_template/`.

**Fails when.** §13 step 6. Dana clones the repo, opens Claude Code, and types Start. Claude Code has no skill matching that, so it reads around, finds a PRD-shaped README, and improvises an interview that is not the §6 interview and writes nowhere in particular. She cannot tell anything is wrong. The one external test of the whole portability thesis returns a false negative on the engine and a false positive on the improvisation. In the passing case she reaches a carousel run and gets `node: command not found`, and the test's own condition ("with no help from Joseph") forbids the one person who could tell her what Node is.

**Recommendation.** Five one-line edits. (1) §1.2's ships list gains README.md, whose first line is the clone command and whose second is `/content-engine setup`. (2) Delete "Start" from §1.3 and §2 and replace it with `/content-engine setup`; write SKILL.md's `description:` frontmatter to name LinkedIn, post, carousel, and the setup interview, since that string is the only thing the router matches on when the user types prose. (3) §1.2 gains package.json and package-lock.json with playwright pinned to an exact version, and the .gitignore spec gains node_modules/. (4) `workflows/carousel.md` step 0 preflights `node -v && npx playwright --version` and on failure runs the install itself with progress echoed, because §1.3's promise is that the user installs nothing manually, not that no install exists; on hard failure, degrade by writing slide HTML to `runs/<slug>/slides/` and telling her to open it and print to PDF at 1080x1350. A printable carousel beats a stack trace. (5) Swap §13 steps 5 and 6 and add to §12: the tester runs the short-post path only, and carousel portability is tested separately. Change §1's "Anyone can install it" to "Anyone who can run Claude Code can install it," and delete §1.1's clause about lifting out a standalone visual engine later, since the input contract's real justification is keeping Playwright off the writing path, which the same sentence already says.

---

**L1-03 · blocker · §6.1, §6.2, §7a, §8, §12, §13, §14 · ranked #5**
*Setup never says when it writes, so interruption or compaction destroys the profile.*
Merges L5-02, L10-08.

**Claim.** §6.2 attaches a write instruction to four of its seven sections ("Write the extraction to inspiration.md," "Write to voice.md with real examples," "say so in voice.md explicitly," "and write theme.json") and attaches none to Raw material, the section §6.2 itself calls "the longest section and the most valuable," and the one that produces the 15 to 25 inventory items everything else depends on. §7a explicitly excludes setup from its write rules ("Setup builds the profile from scratch. This section governs everything after"), so nothing governs when the highest-value output of the interview reaches disk. Two failures follow from one root cause: total loss on any interruption, and silent provenance corruption once a multi-hour session auto-compacts.

**Fails when.** (a) Dana starts setup at 4:10pm. At 5:35pm, on item 14, her laptop sleeps for a call. The session is gone, `/content-engine setup` is documented once-per-person with no resume flag, and she does not restart. (b) §13 step 1 is "Run it on Joseph" as a single multi-hour session, so compaction fires near hour two. Items 1 through 12 are now a summary. The interviewer, still dutifully following §6.1 rule 1, writes items 13 onward verbatim and 1 through 12 as paraphrase while tagging them `source: interview`. §7a's "Nothing enters a profile file unconfirmed" cannot fire, because a summary of a confirmed answer is still, in the model's view, confirmed. Six weeks later a post asserts a paraphrased detail as fact, which is exactly what rule 1 exists to prevent, arriving through the harness instead of the model, on the seed inventory every later calibration is tuned against.

**Recommendation.** One rule added to §6.1's rules block and one comment changed in §8. Rule 8: "Append each item to inventory.md in the turn it is confirmed, in the §7 schema, in their own words. One item, one write, never buffered. If you cannot quote their exact words for an item, do not write it; ask again. The file is the state; the transcript is scratch." §8's setup comment becomes "resumable, run it again any time; it reads the profile and picks up where you stopped." Ship no `setup-state.md` and no `interview_progress:` field: §6.1's stop condition is already a four-clause predicate over files on disk, so the resume rule is "count inventory items, find the first §6.2 section with no file written, continue there," which is one line in workflows/setup.md and one fewer file in the ships list. A second copy of that state can only disagree with the first. Add a setup idempotency guard while you are there: setup against an existing profile resumes, it never recreates.

---

**L1-04 · major · §6.1, §6.2, §12, §13 · ranked #12**
*Forty-five minutes is wrong; the stop condition describes three hours.*

**Claim.** §12's 45-minute test and §6.1's stop condition are incompatible by a factor of three to five. The stop condition requires 15 to 25 instance-grade inventory items, 3 to 5 theses proposed and corrected in the user's own words, voice extracted from real pasted samples, and a sample post confirmed to sound like them, and §6.1 rules 3 and 4 mandate follow-ups on every one of them. There is no time cap, no progress display, no reduced-yield exit, and the interviewer is instructed to push back when the user tries to stop: "Below 15 inventory items, say so and keep going. Do not let them stop early to be agreeable."

**Fails when.** Estimated decomposition, to be replaced by measurement: homework and identity 6 to 8 minutes; raw material at 3 to 4 conversational turns per instance across 15 to 25 items, 50 to 90 minutes; audience 5; thesis propose-and-correct with follow-ups 8 to 12; inspiration 5 to 10; voice samples 8 to 15 (she has to leave the terminal, hunt for three to five things she wrote, and paste multi-paragraph text into a TUI where a stray newline submits early); visual 5 to 10; sample post plus iterate-until-yes 5 to 20. Floor near 90 minutes with everything going right, realistic 2.5 to 4 hours. Concretely, Dana hits minute 70 at item 11, says "this is great, let's call it there," and the engine tells her the inventory is short and asks two more questions. That is the moment she quits, and per L1-03 she loses all eleven items.

**Recommendation.** Split setup into two sessions and hard-cap session 1 at 45 minutes with a reduced stop condition: 8 inventory items, 2 theses, 3 pasted voice samples, one calibration post through the real §9 gate, closing with "you can post from this today; run `/content-engine inventory` twice this week to reach 20." Session 2 is the remainder, resumable per L1-03's rule 8. For instrumentation, do not add a log file: add `added: <ISO timestamp>` to §7's inventory schema next to the existing `used:` field. Item timestamps give median wall clock, median accept interval, and point of abandonment for free from the profile itself, and the field earns its place afterward for inventory age. Replace §12's 45 with whatever the median of Joseph, Fallon, Tim, and the IBM mentor turns out to be, stated as two numbers: time to first publishable post, and time to a full profile. One ambiguity to settle in the same edit: "within 45 minutes of running setup" could be read as 45 minutes after setup completes, which would make §12 a test of the drafting pipeline rather than the interview. If that is the intent, say so.

---

**L1-05 · major · §6.1, §6.2, §9, §11**
*No-samples fallback routes to an inspiration fetch that cannot run.*

**Claim.** The one-line answer to "no writing samples" is to lean on inspiration.md, but inspiration.md is populated by fetching a named creator's LinkedIn posts and the PRD never names the fetch mechanism. §11 assumes Apify for public LinkedIn data, which needs an API token, a credential step that contradicts §1.3. So a no-samples user ends with both voice sources empty, and §9 cannot catch the result, because every one of its roughly 30 entries is a thing to remove rather than a thing to require. A post with no em dashes, no antithesis, and high sentence-length variance passes the gate while sounding like nobody in particular. Note that the external claims used to price this (a Shield wind-down, a Digiday enforcement story, a LinkedIn report affordance) are asserted rather than verified, and under §14 they need tags before they justify a design change.

**Fails when.** Dana has no LinkedIn posts and no blog, which is the exact reason she wants this tool. Setup writes "no samples exist" to voice.md, asks who she likes reading, she names a supply-chain creator, and the fetch returns a login wall. §6.1 rule 1 forbids the interviewer from filling gaps in answers but says nothing about a failed lookup, so the model writes that creator's mechanics from memory into inspiration.md tagged `derived`. Her first three posts are default-Claude prose that clears every §9 check.

**Recommendation.** (1) Replace §6.2's "Ask for 3 to 5 things they've written" with a bounded capture of writing nobody classifies as writing: "paste the last three Slack messages you sent that ran longer than two sentences, and the last email you wrote that you did not template." Everyone has these, and this reduces friction rather than adding it. (2) Instead of refusing to draft, make the deficit loud and cheap to close: when voice.md has zero `source: pasted` entries, the gate report's first line reads "No samples of your writing on file. This draft is inferred, not matched. Paste anything you've written and I'll re-derive." A refusal hands a brand-new non-technical user a dead engine on day one, which is worse than a mediocre first draft she can edit. (3) Tag §6.2's inspiration fetch `[UNVERIFIED 2026-08-17, owner Joseph]` and resolve it before building §6.2: retrieve three public LinkedIn post URLs with the exact tool the skill will use and record the response. If it is a login wall, cut the fetch and ask her to paste three posts she likes, since she can see them and the fetcher cannot. (4) Add §6.1 rule 9: "If a lookup fails, say the lookup failed. Never write a creator's mechanics from memory." (5) Add positive checks to §9 so the gate can fail on absence: sentence-length stdev below the profile's own measured baseline, zero fragments, and zero concrete nouns traceable to the named inventory item.

---

**L1-08 · major · §3, §6.1, §6.2, §7, §12, §14**
*Setup's calibration post bypasses the gate, the brief, and the log.*

**Claim.** Setup ends by producing a post, §12 measures a post, and nothing connects them. As specified, the calibration post shows a single draft, names no inventory item in a brief.md, logs no run, carries no structural job, and it is unstated whether it consumes the anchor item's 60-day lock. The load-bearing part is the gate: §9 says it "Runs on every draft before the human sees it" and §14 says "The gate is not advisory," and the calibration post runs neither. Dana says "yes, that sounds like me" about ungated prose, which means the engine calibrates voice.md against text containing the exact tells the gate exists to kill, and the first artifact she ever sees teaches her the wrong thing about the product.

**Fails when.** Dana reaches minute 165, reads the calibration post, says yes, and closes the terminal. She holds a post that sounds like her and no signal that it never ran the gate, never got a diff report, and was never logged. She publishes it and it lands well. posts.csv has no row for it, so §11's trailing-20 median and the 2x threshold both start from a baseline missing her best early post.

**Recommendation.** Change §6.2's closing line to: "End setup by generating one sample post from a named inventory item, running it through the §9 gate, and showing her the post plus the gate diff. Ask 'does this sound like you?' and iterate until yes." Skip the five angles, because after a long interview the fast loop is the point and the gate diff is a better first impression than an angle menu, and because iterating on a calibration sample requires showing one draft and revising it, which is why §6.2 says "That iteration is the real calibration." Then log it without asking: write `runs/<date>-<slug>/` with brief.md and gate-report.md, append the posts.csv row, and consume the anchor lock, because it is a real post she may publish. State the exemption explicitly in §14 so it is a decision rather than an oversight: "Never show one draft, except the setup calibration post, which is a voice instrument and shows one draft plus the gate diff."

---

### L2. Content quality ceiling

**Lens verdict: fails.** A well-engineered retrieval-and-recombination machine sitting on a closed set of 15 to 25 interview memories, which will reliably produce posts that are true, in voice, gate-clean, and unforwardable. The biggest problem is §7's generative core. Three secondary mechanisms cap the ceiling further: the gate's subtractive rules, the anchor lock arithmetic burning the person's best 25 stories in six weeks, and §12's zero-edit target measuring acceptability rather than excellence. None of the fixes require new files or a new dependency.

---

**L2-02 · major · §7, §6.1, §6.2, §8 · ranked #6**
*Angle crossing has no opposition axis; five-angle pick selects for safety.*

**Claim.** A join of item x thesis x anxiety can only produce illustrations: here is a true thing from my work that shows why my belief matters to people worried about X. That is the shape of every competent, forgettable LinkedIn post. Nothing in the crossing carries a counterparty who is wrong, a sentence the reader argues with on first read, or a cost to the author, and the fifth axis, anxiety, pushes toward reassurance, which is the opposite of a forward. The five-angle-then-pick mechanic compounds it: the person picking is the person whose reputation is exposed, choosing at the moment of lowest information, so selection pressure runs toward the safest of the five. The anxiety-reads-as-reassurance half is taste. The missing opposition axis is structural. The narrower version of the defect, which the skeptic pass confirms: §6.2 already collects the antagonist material ("What do people in your industry get wrong constantly?", "What's an opinion you hold that your peers would push back on?", "What are they tired of hearing?") and §7's formula never reaches it.

**Fails when.** Fallon runs the default command and gets five angles that are the same sentence with different nouns: a story from her work showing why a Daybreak thesis matters to people worried about forecast error. She picks the third because it is the least likely to annoy an account. The post is true, in her voice, passes every gate, and gets eleven reactions, nine of them Daybreak employees. A VP of Supply Chain reads it, agrees with all of it, and forwards nothing, because there is nobody in the post who is wrong.

**Recommendation.** Two edits, both one line, both at setup or in the formula, nothing added to the daily run. (1) §7: change "aimed at one audience anxiety" to "aimed at one thing the audience believes and is wrong about, or is tired of hearing." audience.md already holds the second half per §6.2, so this costs a word and immediately routes opposition material that is already being collected. (2) thesis.md entries gain one field, `against:`, the strongest version of the opposing position in the words someone who holds it would use, captured by one added question in §6.2's existing propose-and-correct loop. Five entries, filled once, never touched again. Drop the `spiky:` label, `angle_picked`, and `was_spiky`: three schema fields and a per-run judgment call to A/B one person's nerve, when §11's one-in-five exploration budget already forces variance for free.

---

**L2-04 · minor · §14, §10, §8, §7**
*One-item-per-post rule cannot supply an eight-slide carousel without invention.*

**Claim.** An inventory item is "one to three sentences of the actual raw material." A carousel is 6 to 10 slides where "Slides 2 through N each carry one beat." §14 says one item per post, "No exceptions." The queued §14 revision says only "per-format item counts," which leaves the two things that matter unspecified: how the 60-day lock applies to a post that consumed five items, and which item the repetition guard treats as the anchor. The skeptic pass narrows the claim correctly: a beat is a narrative unit and an item is a source, so one story yields six beats with zero invention, and "either padding or invention" is a false dichotomy. What survives is the unspecified queued edit plus one genuinely unguarded thing: §3's verbatim overlap runs "against the last 20 shipped pieces," which is inter-piece only. Nothing checks whether slide 7 restates slide 3 inside the same carousel.

**Fails when.** Week five, §13 step 5. The builder implements carousels, opens §14, and finds one item, no exceptions, against eight body slides and three sentences of source. He picks the option that does not violate a bullet marked "No exceptions" and ships a carousel where slides 4 through 8 restate slide 3 in different words. It passes both gates, because neither gate checks whether a slide says anything new.

**Recommendation.** Apply the queued §14 edit in its minimal form: `anchor:` (exactly one item id, the one the locks apply to) and `supports:` (0 to 4 optional ids, no lock of their own, because a support is a citation rather than a consumption). That resolves the "No exceptions" contradiction and settles both unspecified questions in two schema fields. Add exactly one line to design-tells.md: "two body slides that could be swapped without changing what the carousel says is a hard fail." Do not impose per-slide item minimums or a carousel refusal path; requiring five distinct items to make eight slides guarantees the listicle §10 is built to prevent, and refusing at the brief punishes the user for the engine's own lock arithmetic.

---

**L2-06 · minor · §1.2, §5, §10, §13**
*Shipping 35 named hook patterns to every install collides with the gate.*

**Claim.** §10 rejects Canva because "template-driven output looks like everyone else's output," then ships the language version of it. The cross-install homogenization half of the argument does not hold, because the Canva analogy compares an artifact constraint to a rhetorical move filled with the person's own material, and because two users of the engine publish into disjoint feeds. What does hold: nothing requires hooks.md to survive its own gate, and several of the highest-frequency named patterns in this category ("It's not X, it's Y," "The result?", "Here's how") are already on §9's ban list, so the library and the gate will fight on every run.

**Fails when.** On the IBM mentor's second run the gate rewrites her opening line, because pattern 4 in hooks.md is a construction §9 bans by name. She reads the gate diff, concludes the tool argues with itself, and stops on run three.

**Recommendation.** One line added to §13 step 2, next to the existing 20-known-AI-posts fixture: "Every example line in reference/hooks.md is a checked-in fixture that must pass ai-tells.md. A pattern the gate would rewrite cannot ship in the library." That is the entire fix, it runs in CI alongside a test that already exists, and it makes the collision structurally impossible rather than caught in the wild on run three. Do not restructure hooks.md into a properties list, because "must state something the reader could disagree with" is not checkable by any gate and becomes prose in a reference file, which §3's opening line already rules out. Do not ship unverified reach penalties into the file §9 calls the highest-value asset in the repo.

---

**L2-07 · major · §1.3, §2, §3, §5, §7, §11**
*The thesis x hook lock never fires, and nothing lets four Daybreak accounts see each other's material.*
Merges L11-01.

**Claim.** Two defects in one mechanism. First, §3's "Thesis x hook pattern: the same pair is locked 30 days" is decorative: with 3 to 5 theses and 35 named hook patterns there are 105 to 175 pairs against roughly 17 posts in a 30-day window, so collision probability is near zero and the lock effectively never binds, while there is no lock on the hook pattern alone anywhere in §3, so one opening shape can legally carry three to five posts a month, up to 29% of output. Second, all three locks are profile-scoped. Joseph, Fallon, and Tim share customers, launches, and internal numbers, so the same real-world fact legitimately exists under different ids in three inventory.md files, and the verbatim diff cannot catch it either, because two people telling the same customer story in their own voices share no 8-word run. Note the framing correction: §1.3 constrains writes, so a sibling read is already legal and merely unspecified. §15 still leaves the org-layer question open, which is what makes this ambiguous.

**Fails when.** A VP of Supply Chain at a $2B distributor follows both Joseph and Fallon. In one scroll she sees a Daybreak post opening "A planner told me something last week I have not stopped thinking about," and four posts later a second Daybreak post opening the same way about a different planner. Both cleared their own profile's thesis x hook lock because the theses differed and the run logs live in separate directories. She does not conclude there are two thoughtful people at Daybreak.

**Recommendation.** Two additions, both read-only, both no-ops on a solo install. (1) Add one row to §3's repetition locks: "Hook pattern alone: no reuse within the trailing 8 shipped posts, and no more than twice in any trailing 20." §11 already plans hook pattern as run metadata; mirror it into the run row so the check is a glob at run start. (2) Add to §5's load list: "At run start, when more than one directory exists under `profiles/`, read `profiles/*/runs/index.md` and print the last 14 days of sibling activity, one line each: date, handle, format, a human-readable anchor summary." Notice, not lock. This requires the run row to carry a readable anchor summary rather than only an id, which is a one-word change to §4 item 9. Reject a `shared_key:` schema field set during setup: asking an interviewee at minute forty to predict which of her stories a colleague will also tell produces a field that is 80% blank by week three, and a blank key makes the lock silently inert while the operator believes it is armed. Then resolve §15 bullet 2.

---

**L2-08 · major · §3, §4, §5, §6.2, §7, §11, §13, §14 · ranked #8**
*Draft-time load list omits audience.md and learnings.md.*
Merges L3-06, L8-05.

**Claim.** §5 states the load list imperatively ("A short-post run reads identity.md, voice.md, inventory.md, thesis.md, ai-tells.md") and it contradicts two other sections. §7 defines an angle as "one inventory item, crossed with one thesis, aimed at one audience anxiety" and audience.md is not in the list, so as written the crossing cannot be executed: the model either invents the anxiety, which §14 forbids, or silently drops the axis. §11 states flatly that learnings.md "is loaded at draft time" and it is not in the list either, so the one mechanism no competitor can copy never reaches the drafter. §5 also annotates learnings.md as "updated by phase 5" when §13 phase 5 is the render pipeline and the analytics loop is phase 7. Separately, `reference/linkedin-algorithm.md` ships in the box, appears in no step of §1.1's pipeline table, is in no load list, is built by no item in §4 or §13, and its "review quarterly" note is exactly the reminder §3 opens by rejecting, while §14's UNVERIFIED rule is scoped to "this doc" and therefore governs nothing written into it. The queued §5 revision covers directory moves and does not touch the load list, so this is not already-scheduled work.

**Fails when.** The builder implements §13 step 3 against §5's list in early September. Joseph ships his first ten posts through late September aimed at nobody in particular, then §13 step 4 tunes voice.md against his edits. He is tuning the wrong variable: the defect in those ten posts was aim, not voice, and step 4 gates step 5, so the one calibration gate in the build order runs on the wrong variable and the render pipeline gets built on top of it.

**Recommendation.** Rewrite §5's lazy-load sentence as the single authoritative load list and delete the restatements in §7 and §11 so the next edit cannot desync three sections again: "A short-post run reads identity.md, voice.md, thesis.md, audience.md, learnings.md (confirmed entries only), the compact inventory index with only shortlisted items hydrated, and inspiration.md when voice.md declares no samples exist. ai-tells.md loads at gate time, not draft time." Moving ai-tells.md out of the drafting context is a bonus, because having the answer key resident is what makes §12's gate-catch-rate number meaningless. Fix the stale "updated by phase 5" annotation to phase 7. Delete `reference/linkedin-algorithm.md` from §1.2's ships list and §5's tree rather than building a source-tier table for it: every durable mechanic it would carry already lives where it is used (1080x1350 in §10, post shapes in formats.md, hooks in hooks.md), and what remains is vendor folklore with no provenance rule covering it, shipped in the box for Fallon to inherit in December. If Joseph later wants algorithm beliefs, learnings.md already holds his own data. Skip token caps on inspiration.md until §4's log shows a run over target.

---

### L3. LinkedIn platform reality 2026

**Lens verdict: partial pass.** The format bet is correct and the no-auto-post rule is right. Where the PRD fails is that it was written against content mechanics and never against platform mechanics: it never reconciles its own cadence target with its own inventory lock, it has no channel to observe a reader-triggered content flag, it has no rule about where outbound links go, and its headline growth goal is off by roughly 3x. Note that several of this lens's supporting statistics are secondary or vendor-sourced and are flagged as such below.

---

**L3-02 · major · §9, §11, §12 · ranked in spirit under L9-04's metric fix**
*No channel detects a reader-triggered AI-slop reach penalty.*

**Claim.** LinkedIn shipped a "Seems like AI slop" report option in the post three-dot menu around 30 July to 10 August 2026. Flagged posts get distribution suppressed outside the author's own network, and the creator gets a private notification in analytics. That is a reader-side kill switch on distribution, and it is the binding constraint on any AI-drafted content. The PRD's entire defense is §9's static tell list, and its only stated measure of whether that defense works is circular: §12 grades the gate on its own catch rate. §11's two sources are Apify (reactions, comments, reposts) and a manual impressions CSV, and neither surfaces a flag notification. The suppression is specifically out-of-network, so it will move the trailing-20 median §11 measures, which means the signal is not invisible, it is misattributed.

**Fails when.** Joseph ships 24 posts through September. Post 6 gets reported; LinkedIn drops a notice in his analytics that he never opens, because §11 only tells him to export the impressions CSV. Reach on subsequent posts sags. In late October `/content-engine review` clears §11's threshold and writes a hypothesis blaming the hook pattern. The engine then tunes hooks for six weeks against a cause that does not exist, while §12 reports a falling gate catch rate as evidence the voice is improving.

**Recommendation.** Three edits, two of them deletions. (1) Delete §12's "Gate catch rate trending down over time" bullet; it is redundant with the indicator two lines above that §12 itself calls better. (2) Add `ai_flag_notice` (bool, default false) to the posts.csv header shipping in `profiles/_template/`, and one question to `/content-engine review`: "Did LinkedIn analytics show a flag or notice on any post this period?" A true value excludes that post from §11's trailing-20 baseline, same shape as the exclusion rules §3 already runs. (3) Do not create `reference/ai-tells-observed.md`. §9 already owns this path ("when Joseph spots a new tell in the wild, he says so and it gets appended with the date"), and a flagged post is a tell spotted in the wild with better provenance than intuition. A second tells file guarantees the gate reads one and not the other. Friction cost is one yes/no question inside a periodic sit-down command, not the daily driver.

---

**L3-03 · minor · §9, §14, §5, §10**
*No rule keeps outbound links out of the post body.*

**Claim.** An outbound link in the post body carries a reported reach penalty. The magnitude is contested (a 1.3M-post analysis reports roughly -18.8%; an older claim puts it at -60%; the primary is paywalled), so treat the number as unresolved and the direction as the only actionable part. The PRD never mentions links: §14's hard rules do not cover them, §9's lexical list has no URL entry, and §5's run folder has no artifact where a link could go instead. Note the scope caveat: §12's outcome goals are followers and impressions with no conversion metric anywhere, and §10 states the document's posture ("Final slide is a takeaway, not a CTA"), so the driving-to-a-page requirement is imported rather than found.

**Fails when.** Joseph writes a post about a forecast-error teardown and wants it to drive to a Daybreak page. The engine has no rule, so it puts the URL in the last line of the body. Nothing in posts.csv records that a link was in the body, so §11's learning loop attributes the miss to the hook pattern and kills a hook that worked.

**Recommendation.** Two one-line edits, no new files and no new columns. (1) §14, one rule: "No outbound URL in the post body. If the draft needs a link, it goes in the first comment, and the engine writes that comment as a final section of draft.md, one substantive sentence plus the URL, never a bare link." Putting it in draft.md rather than a new artifact means it ships in the file Joseph is already copying from and disappears when there is no link. (2) §9, Lexical list, one entry: a URL pattern (`https?://`, plus bare `domain.tld/path`). That converts it from a rule Joseph must remember into the enforced mechanism §3 demands. Skip `link_placement` in posts.csv until link usage is routine enough that §11's 5-per-side threshold could ever resolve it.

---

**L3-04 · minor · §11, §8, §5, §15**
*Engine scores comments 3x but builds no comment lever.*

**Claim.** §11 weights a comment at 3x a reaction and justifies it on reach grounds, then the engine provides no mechanism that produces one. Nothing in §1.1's eight-step pipeline, §5's run folder, or §8's command list touches the comment surface. The scope decision to exclude automated commenting is correct and should be written down as a decision, since third-party script comments get stripped from Most Relevant and an outbound comment bot is the fastest way to zero this account's distribution. The narrower version that survives the skeptic pass: reply latency is an uncontrolled confounder, it correlates with time of day, and §11 explicitly hypothesizes on "day and time," so a post that got fast replies because Joseph was at his desk gets scored as a win for the 9am slot.

**Fails when.** Joseph pastes a post at 8:40am, then walks into a 9:00 pipeline review. Seven comments land in the first hour, including one from a supply-chain VP disputing his central number. He replies at 2:15pm. The comment count stalls at nine, §11 scores it low, and `/content-engine review` records the hook pattern as underperforming.

**Recommendation.** Two edits, one of them free. (1) Do not add `reply-prep.md`. Add one line to the brief.md that §5 already produces: "Likely objections: three, each with the inventory item id that answers it." Same tokens, same context already loaded, zero new artifacts, and it lands in the file Joseph already opens. (2) Add `first_reply_latency_min` to posts.csv and, the part that matters, add it to §11's named candidate list, which currently reads "hook pattern, inventory item type, format, opening line length, presence of a number, day and time." The column alone does nothing; it has to be in the list the hypothesis writer checks. Drop the proposed §14 comment rule as redundant with "No auto-post. Output is copy-paste." Keeping the out-of-scope note on outbound commenting in §15 is fine.

---

**L3-05 · minor · §12, §11**
*20k followers in six months is off by roughly three times.*

**Claim.** 1.4k to 20k in 26 weeks at 4 posts/week is 104 posts carrying 179 net new followers each, sustained. The 1M impressions goal is the same problem in different units: 9,615 impressions per post averaged across the period. The reach percentages behind this estimate are secondary-sourced and should be treated as such. The part that survives cleanly without any external statistic: §12's ramp ("5k/wk in month 1, 15k by month 3, 40k+ by month 5") is arithmetically coupled to the goal it is supposed to check, so 40k/week in month five is only reachable if the follower goal is already met. It is not the independent yardstick §12 claims. Note also that §12 already lists five leading indicators that are engine-controllable and do not reference 20k, so "he has no way to tell whether the engine is working" is not true of this document.

**Fails when.** Week twelve. Joseph has shipped 44 good posts, sits well behind the ramp, and reads the ramp as the verdict on the engine rather than as a derived number.

**Recommendation.** Keep the 20k and 1M goals; §12 already fences them as tracked but not optimizable, which is correct handling of an ambition. Delete the ramp instead. §12 already names the honest substitute one line later: "Median engagement rate vs that person's own trailing 20-post baseline," which is self-referential in the good way and needs no external growth assumption. On measurement, `pct_out_of_network` is the right instrument but it is not free: it comes from the same LinkedIn analytics export §11 has already flagged UNVERIFIED. Resolve that existing tag first and add the column in the same pass rather than opening a second unverified dependency on the first. Do not substitute an invented replacement target for Joseph's ambition.

---

### L4. Enforceability and determinism

**Lens verdict: fails.** Every lock, gate, and hard fail in §3 is a paragraph of English re-read by the same model that produced the artifact being checked. No oracle, no state store for two of the three locks, and no component in §5 that computes anything except render.js. The single biggest problem is a misallocation: §3's locks and §9's gate rest on arithmetic and string matching that a language model does unreliably and a small script does perfectly and free. The failures are silent, so §3's promise degrades invisibly while the user stops checking. Most of this lens consolidates into L12-06 (state store) and L5-04 (the string work); the two below are what remains distinct.

---

**L4-05 · major · §1.1, §3, §8, §12**
*§1.1 closes the least likely bypass and calls the problem solved.*

**Claim.** The PRD names the bypass problem and fixes only the door nobody walks through. Consolidating four skills into one router stops a user who would have invoked a format skill by name; it stops nothing else, because the router is invoked at the model's discretion and every workflow file is plain markdown in the repo. "follow workflows/short-post.md" bypasses the router by name, and a bare English request bypasses it without naming anything. Note the correction: §1.1's primary argument for consolidation is drift, not bypass ("Four separately installed skills would be four copies of the gate, the inventory locks, and the run log, and they would drift"), and consolidation genuinely and fully solves drift. What is left is the residual, and it is real.

**Fails when.** Monday, eleven minutes before a call, Joseph types "quick LinkedIn post on the forecast-error thing, keep it short" instead of `/content-engine`. Claude Code reads inventory.md, drafts something decent, and never touches SKILL.md, the locks, the gate, or the run log. He posts it. The anchor is never consumed, the thesis x hook pair is never recorded, and the shipped text never enters the verbatim corpus. Three weeks later the engine proposes that same anchor with that same hook pattern as fresh, and the diff has nothing to compare against. All three locks are degraded, permanently and invisibly, by the most natural way anyone will use this tool.

**Recommendation.** Stop trying to prevent the bypass; it is unpreventable in a chat harness and every attempt costs the breeze requirement. Make it recordable instead. One line in CLAUDE.md ("LinkedIn content requests go through /content-engine") covers the honest mistake for free. Then add one question to `/content-engine review`, which already exists and which the user already runs: "anything ship outside the engine? paste it." A paste back-fills the brief front matter (anchor, job, hook, thesis) and the shipped-text corpus, so the ad-hoc post rejoins lock state within a week instead of degrading it permanently. Zero new dependencies, zero approval prompts, no hook. Note that a `PostToolUse` hook matching `Write|Edit` on draft.md does not fire in this scenario, because an ad-hoc chat request produces text and no file. Separately, amend §1.1's last sentence: "The router owns the pipeline or the non-negotiables in §3 are unenforceable" implies a false converse. Say what is true: the router prevents drift and is the only enforced path, and anything outside it is reconciled at review.

---

**L4-06 · minor · §7a, §12, §14**
*"Only named commands write" is unenforced, and §12's check cannot detect the breach.*

**Claim.** Inside one Claude Code session holding Write access to the working directory, "only named commands write" is a sentence, not a permission. The evidence originally offered for this is misattributed: §12's `git status` corollary sits under the portability test and exists to prove §1.3's write containment, not to police §7a. The genuine defect is smaller and the genuine consequence is one provenance tag, not a wrong draft. But the corollary check has its own fatal flaw that this finding missed and that matters more: §1.2 ships "a `.gitignore` excluding `profiles/*` except `_template/`," so profile files are untracked, and after the IBM mentor's run `git status` shows nothing inside `profiles/<handle>/`. The check cannot pass as written, and the same .gitignore removes the only local audit trail that would have caught an in-place edit.

**Fails when.** Mid-draft, Joseph says "that number is 34%, not 30%." The model does the helpful thing and edits the `content:` line of the inventory item in place. Two rules break at once, a draft run wrote to a profile and an append-only file was rewritten, the entry still reads `source: interview` although its current text was typed during a drafting session, and `git status` reports a clean pass.

**Recommendation.** Skip the `PreToolUse` deny. It buys a mislabeled provenance field and costs the mentor a second approval prompt plus a wall every time someone legitimately hand-fixes a typo in their own file. Do two cheap things instead. (1) Fix §12's corollary so it can run at all: `git status --porcelain --ignored=matching` should show new or changed paths only under `profiles/<handle>/`. One flag, and it now actually tests §1.3 rather than silently reporting a clean tree because the files are ignored. (2) Add `updated: <date> by <run-slug>` to the §7 schema, written only by `/content-engine inventory`. An entry with `source: interview` carrying an `updated:` from a drafting run makes the divergence visible in the file itself, which is all §7a's six-months-later requirement needs. Note the collision with the queued §5 move: once `runs/` lives under `profiles/<handle>/`, the corollary is satisfied by every run and stops discriminating, so scope it to the nine curated files.

---

### L5. Token economics and Pro-plan viability

**Lens verdict: fails.** A short-post run loads substantially more than five files before a word is drafted, and §7 and §14 mandate a multi-turn conversation, so the resident context is re-billed per turn. The biggest problem is that §4 item 9 measures the wrong quantity with an instrument that cannot read. The acute case is setup, where the first compaction converts confirmed instances into summary paraphrase written as `source: interview`. Pro-viability is reachable, but only by giving up two things the PRD currently treats as settled: the model reading the last 20 shipped pieces itself, and "the list only grows." Note that this lens's per-file token estimates are invented for files that do not exist yet and should not be quoted as measurements.

---

**L5-03 · major · §10, §4, §1.1**
*Nothing checks whether slide text overflows the 1080x1350 crop.*

**Claim.** §10 justifies the HTML render path partly on the model iterating visually ("Claude can iterate in a render-look-adjust loop") and §4 item 9 constrains the design gate to slide HTML as text on cost grounds. The doctrinal conflict is weaker than first argued: §4 scopes its prohibition to the gate, and §10 makes a capability claim rather than a per-run mandate, so a text-only gate plus zero or one look is consistent with both. What is real and sharper: nothing anywhere in the PRD checks for text overflowing the crop. Every item in §10's design-tells list is a taste judgment (gradients, centering, three equal cards, drop shadows). Not one is a geometry failure. The arithmetic that motivates keeping the model's eyes off the render is sound (1080x1350 / 750 = 1,944 tokens per look, 8 slides per pass), and it means the check has to be mechanical.

**Fails when.** Week 6, the first carousel. Slide 4's headline runs 61 characters, wraps to three lines at the template's type scale, and pushes the supporting number below the 1350px crop. The design gate reads the HTML, sees a well-formed `<h2>` and `<p>` against a limited palette, matches nothing in design-tells.md, and passes it. The one slide carrying the number, the reason the deck is worth swiping, is cut in half.

**Recommendation.** Turn the one mechanical failure into a boolean and leave the taste call to the human. In render.js, after each slide loads, evaluate three lines in the page: any text node where `scrollHeight > clientHeight`, and any element whose `getBoundingClientRect().bottom > 1350`. Return them alongside the PNGs as a few lines of text, an overflow check rather than a geometry report. Nonzero means the render failed and the workflow re-drafts that slide before the human sees the PDF. Add one line to the top of design-tells.md: "Text clipped by the 1350px frame, or a headline wrapping past two lines. Caught by render.js, not by reading the HTML, because the HTML always looks fine." In §10, replace "Claude can iterate in a render-look-adjust loop" with "Claude can iterate: render, read the overflow check, adjust," which keeps §4 item 9 intact. Do not add a contact sheet; §14's no-auto-post rule already puts a human in front of every deck, and that human is a better composition critic than a downscaled grid.

---

**L5-04 · major · §3, §5, §9, §12, §13 · ranked #7**
*Exact string and number work is assigned to attention across 5.9k tokens.*
Merges L4-02, L4-03.

**Claim.** §3 makes the diff a hard fail with numeric thresholds and then implements it by having the model read twenty full posts and eyeball them. An 8-word exact-run check and a sentence-similarity ratio are computations, not reading tasks, and the model will report clean and be wrong. The same applies to half of §9: em and en dash, semicolons, the 19-term banned list, hashtag stacks, Title Case headers, contraction ratio, paragraph line-count uniformity, and sentence-length stdev are exact string and number work. "Zero tolerance" is a determinism claim a model reading prose cannot make good on, and the gate report is written by the same model that missed the character. The corpus is also undefined: §5 stores `runs/<slug>/draft.md`, the draft, not the shipped text, and §12 targets only 70% zero-edit, so up to 30% of what was published exists nowhere in the repo. The corpus costs roughly 5.9k tokens on every run and grows when articles enter the window. "~15% sentence-level similarity" has no metric anywhere in the document. And the 8-word threshold hard-fails the engine's own signature material, because §7's inventory `content` field is a fixed sentence and §3 permits anchor reuse, so the second post built on an item collides with the first by construction.

**Fails when.** Post 23 reuses "kept a shadow spreadsheet for eighteen months because she did not trust the system," thirteen consecutive words verbatim from post 9, his best-performing piece, which is exactly why the phrase resurfaced. The model reports the draft clean. Two commenters read both posts. Nothing in gate-report.md records that the check failed. In the other direction, when the check does fire, §3 says "Not a warning," so the engine rewrites the sentence to "a planning lead at a large distributor maintained an unofficial spreadsheet," which is vaguer, less credible, and no longer the claim Joseph verified in the interview. The first time that happens, the check gets turned off.

**Recommendation.** One dependency-free `reference/engine.js` beside `reference/pipeline/`, run before the gate, corpus never entering context. Node rather than Python, because §1.2 already ships render.js and §1.3 gets harder with two runtimes. Four things: 8-gram overlap (lowercase-tokenize, build shingle sets for the draft and each prior shipped piece, intersect, return matched spans); a similarity ratio per prior piece if the second threshold is kept, and if it is kept, rewrite §3 to name that ratio because as written it is unenforceable; the lexical scan with a documented carve-out for en dash between digits; and sentence-length stdev and contraction rate as numbers. Emit JSON that gate-report.md quotes verbatim, so the report is auditable rather than self-witnessed. Before comparing, strip any span appearing verbatim in inventory.md `content` fields or thesis.md: traceable overlap is a citation and gets printed as a warning with the prior slug, and untraceable overlap is the hard fail. Leave the structural and texture judgments (antithesis, unearned rule of three, restating close) in the model, and amend §9 to say which half is deterministic. One assert: a draft containing a known 13-word run from a fixture prior must fail, and the same draft with that run quoted from inventory must pass.

---

**L5-06 · major · §1.1, §1.2, §4, §5, §11, §12, §14**
*posts.csv asks the model to self-report a number it cannot observe, and the 15k target was never measured either.*
Merges L4-08, L5-01.

**Claim.** §4 item 9 makes token logging the evidence for Pro-viability ("'Pro-viable' should be a measured number in `posts.csv` within two weeks rather than an assumption") and §1.1's table assigns step 8 to the router on every run, so the model writes the row. A model has no access to its own cumulative usage counters, so what lands in the column is a plausible integer shaped by having read "Target roughly 15k" in the same session. §14 forbids exactly this. The document commits the same error two sentences later: "Target roughly 15k tokens," "35 to 50k for a carousel," and "roughly 1,900 tokens every time it is looked at" are untagged, and §14 says "Untagged claims are asserted as verified." The unit is also wrong, because a Pro plan is consumed by turns multiplied by resident context and §7 and §14 mandate a multi-turn conversation, so a per-run figure answers a question nobody has.

**Fails when.** Friday of week 2, close of the fifth run. The engine writes `tokens_in: 14800, tokens_out: 2100`. Three weeks later Joseph reads a tidy 14 to 16k median across twelve rows, marks Pro-viability proven, and greenlights the carousel build, which §4 itself calls the largest single build in the MVP. The one artifact designed to falsify the design has laundered the assumption into a data column.

**Recommendation.** Do not instrument the product for a two-week question. Delete the token columns. Add one field the engine can honestly write: `hit_limit` (y/n), set only when the human says the session was interrupted, defaulting to n. Add to §14: "The engine never writes a number it cannot observe. Token counts are not observable to it." For the measurement, Joseph runs `/cost` at end of day for the first ten working days and writes session total plus runs completed in a scratch file. Ten data points answer the only question that matters, with zero product code and zero friction on the daily driver, and then the exercise is deleted. Change §12's criterion from a token figure to the behavior it was a proxy for: "four short posts in one week on a Pro plan with no limit interruption, measured in week 2." Tag §4's 15k, 35 to 50k, and 1,900 figures `[UNVERIFIED 2026-08-17, owner Joseph]` and relabel them budgets. Add the gating sentence §4 is missing: the render pipeline is greenlit only after ten completed carousel runs have a measured median. Separately, reconcile §5's five-file load list with §1.1's router-owned steps and with §11's draft-time learnings.md, and replace §4's invented target with "measure it on run 1 of §13 step 3 and write the real number here."

---

**L5-08 · minor · §6.2, §1.3**
*Palette lookup is unbounded, and Brandfetch is the only API key in the product.*

**Claim.** "Pull a palette automatically from their company site, Brandfetch, or a similar brand asset lookup" is unbounded as written: nothing says how, and the naive execution is curling a compiled stylesheet into context in the middle of the most fragile 45 minutes in the product. Naming Brandfetch is a live conflict with §1.3's "No config file hand-edited, no skill authored by the user, no dependency installed manually," since an API key is all three in spirit and it is the only manual credential anywhere in setup. Note the limits of the original framing: §6.2 already names its own fallback ("If lookup fails, or they are building a personal brand with no company behind it, ask for one color directly"), and the paragraph plainly addresses the human ("Show them what you pulled and let them override"), so the model-looks-at-images cost is not what the text says.

**Fails when.** Around turn 12 of the IBM mentor's setup, the engine fetches ibm.com and reads the stylesheet for brand colours. The fetch returns a minified sheet and context jumps by tens of thousands of tokens mid-interview.

**Recommendation.** Three small edits, no new script. (1) Delete "Brandfetch, or a similar brand asset lookup" from §6.2. (2) Bound the auto-pull to a shell one-liner instead of leaving "automatically" to interpretation: curl the homepage, pull the first-party stylesheet hrefs, curl those, `grep -oE '#[0-9a-fA-F]{6}' | sort | uniq -c | sort -rn | head -8`. Eight hexes, roughly a hundred tokens, no CSS in context ever. Skip luminance and saturation filtering; the model can drop white and near-black from a list of eight by looking at it. (3) Add the missing clause to "show two rendered examples": a terminal cannot show an image, so write them to `profiles/<handle>/theme-preview-a.png` and `-b.png` and give her the paths. As written, "show" has no implementation, and that is a real gap for the non-technical user. Keep the existing ask-for-one-color path as the primary when the pull returns nothing useful.

---

### L6. Longitudinal decay: week 3 to month 6

**Lens verdict: fails, on arithmetic rather than judgment.** Every mechanism is specified at the moment it is created and none at the moment it is maintained: the anchor lock has no writer, the retirement rule has no trigger that can fire, the staleness flag has nothing that can clear it, the learnings loop has no way to kill a hypothesis, and the voice metric has no frozen baseline. The three cheapest fixes (freeze the voice samples at setup, derive locks from the run log, change the lock unit) all have to happen before the first run or they cannot happen at all.

---

**L6-02 · blocker · §3, §6, §6.1, §7, §7a, §8, §12, §14, §15 · ranked #1**
*The 60-day anchor lock, one item per post, and 4 posts/week need ~35 standing items; setup seeds 15 to 25.*
Merges L1-02, L2-01, L3-01, L10-01, L12-04, L11-05.

**Claim.** Four numbers cannot coexist. §3: "every post consumes one, timestamped, locked 60 days." §14: "One inventory item per post, named in the brief. No exceptions." §12: "Posts shipped per week (target: 4)." §7: "Setup seeds 15 to 25 items." 60 days at 4/week is 34.3 posts inside the lock window, so steady state requires roughly 35 items permanently in circulation, and at exactly 35 there is zero selection freedom, because the engine must use whatever unlocked that morning. §12's own leading indicator, "Inventory depth (never below 15 unused items)," is breached at post 11 from a 25-item seed and cannot be satisfied by the document's own targets at any point thereafter. The queued §14 change to per-format item counts makes the burn rate worse. The §7 escape hatch is the part that kills the product rather than the arithmetic: "says the inventory is thin and runs a top-up interview" means the person who opened a terminal at 8:40am to post something is instead being interviewed to feed the machine, four times a week, from week four onward. Nowhere does the document state the steady-state requirement, so this reads to the user as a malfunction rather than a designed pressure valve.

**Fails when.** Joseph, Thursday of week 7, post 26. Every one of his 25 seeded items was consumed inside the last 45 days. The engine cannot draft, so it opens a twenty-minute interview about a week in which nothing memorable happened. He does it Thursday, again Monday, and by Wednesday of week 8 he has stopped opening it. §12's health metric went permanently red much earlier, in week 3 or 4.

**Recommendation.** Change the lock unit, not the duration, and delete the metric it breaks. (1) §3 and §7: an anchor item is off limits until 10 other pieces have shipped, not for 60 calendar days. This reuses the shipped-post counter §3 already maintains for the verbatim diff, self-scales with any cadence, matches what a reader actually experiences (they see your recent posts, not your calendar), is satisfiable by a 15-item seed forever, and needs no formula, no config value, and no per-week tuning. (2) Delete §12's "Inventory depth (never below 15 unused items)," because under a 10-post lock it can never fail and a metric that cannot fail is noise. Replace it with the two numbers that predict the wall: `runway: N posts at current cadence` printed at run start, and net new inventory items per week with a target of 2 or more. (3) Reject the (anchor x structural job) pair lock: it licenses the same story six times a quarter, and a follower who sees all of Joseph's posts experiences six job-varied retellings as a man with one story about a planner. (4) Reject cutting cadence to 3/week as the first move; make it the fallback if measured top-up yield is under roughly 2 items a week across the first six weeks. (5) Resolve §15's stale "Posting cadence per account" bullet, which contradicts §12's already-set target.

---

**L6-03 · major · §3, §6.1, §7, §8, §12, §14**
*Replenishment is one unprompted recall question, fired after every run, with no priming and no quality bar.*
Merges L9-08.

**Claim.** The only mechanism that adds inventory after setup is a single closed question, "anything happen this week worth writing down?", and it violates the interviewer doctrine the same document spends §6.1 establishing. It does no homework, it accepts whatever category comes back, and it asks the human to do the retrieval, against §6.1's own finding that "Most people cannot articulate their own taste" and its rule "You get past it by refusing to accept a category when an instance exists." §6.1's rules and philosophy live in reference/interview.md, which is not in §5's load list for a short-post run, so the top-up plausibly runs without the one rule that makes an inventory item worth anything. A weekly-framed question also fires after every run: at 4 posts a week, three of four asks are structurally guaranteed to return nothing, so the document trains refusal by construction. And §6.1 rule 5 already produces the retrieval cues that would fix it ("'I don't know' is a real answer. Record it as a named gap"), which nothing in §7, §8, or §11 ever reads again.

**Fails when.** Fallon, Thursday of week 8, has just gotten a post she likes. The engine asks the question. Her week was two pipeline reviews and a QBR. She says "not really," which is true and also wrong, because the QBR contained a customer saying something she has never heard a customer say. It is not retrievable by that question. She says "not really" four times a week for six weeks, and the habit the engine has trained is declining its own capture prompt. Separately, when the counter does go red at 9:40pm, she types six one-line observations that are categories rather than instances, the counter goes green, and week 10 ships four posts built on material that would have failed the setup interview's own standard.

**Recommendation.** Move the top-up off the draft run and onto `/content-engine review`, which §8 already defines and §11 already runs weekly. That removes a prompt from the daily driver and stops training refusal. Prime it from three sources already on disk: the named gaps from §6.1 rule 5, persisted as `type: gap` rows in inventory.md ("At setup you couldn't name a number that surprised you. Did one show up this month?"); the composition of inventory itself, so 11 stories and 1 number produces a request for a number, which is a row count rather than a model call; and whatever the person pasted into `/content-engine post` that week. State in §7 that the top-up loads reference/interview.md's philosophy block and rule 3 ("Abstract answer, ask for the instance"), reusing a file that already ships rather than inventing a new qualifying test. Reject a content filter requiring a number, date, or named role: it disqualifies `belief` items, which §7's schema explicitly allows and §6.2's second raw-material question explicitly produces, and it is gamed by typing a date. Reject a calendar connector: it is manual setup, it fails §1.3 and §12's portability test, and it drags attendee domains into a repo whose .gitignore exists to keep inventory private. Log accepted items per top-up in the run row; if weekly yield is under 1.5 items by week 6, cadence is capped and that is the honest answer.

---

**L6-07 · minor · §7, §4, §5, §11**
*The 400-line retirement trigger contradicts §7's own reasoning two paragraphs above it.*

**Claim.** §7 gives two retention rules in the same bullet list that sit awkwardly together: retire at 60 days plus a logged performance number, and keep everything used in the last 180 days. Read as default-versus-override there is no deadlock, but the 180-day line is dead text once a 60-day override exists. The clean defect is the trigger itself: §7 argues "the cap goes on what a run loads, not on what the file stores," and then adds a line-count trigger on what the file stores. Combined with L12-06's missing writer for `performance:`, nothing is ever eligible, so the prompt fires and resolves to nothing. Note that the originally claimed growth rate (36 lines a week from superseding appends per use) assumes a mechanism the PRD never specifies; stripped of it, the file reaches 400 lines somewhere around week 10 to 20 rather than week 5.

**Fails when.** Run start prints "inventory.md is 412 lines, retire eligible items?" Joseph says yes. Zero items are eligible, so nothing happens. He sees the same prompt on every run for months, in the same screen real estate that carries "the inventory is thin" and §3's staleness flags.

**Recommendation.** Delete the 400-line trigger and the "Active: unused items plus anything used in the last 180 days" bullet. Both manage file size, which §7 has already ruled is the wrong variable, and the second is dead text under the first. Cite §7 against itself in the revision note so it does not come back. Do not delete inventory-archive.md: §5's lazy-load line already excludes it from draft runs and §7 gives it a live job ("Read only by `/content-engine inventory` when checking whether a new item duplicates an old one"), which matters more once top-up volume rises. Replace the trigger with a human-judgment offer on an existing command: at each `/content-engine inventory` top-up, list items last used more than 120 days ago and ask "still worth keeping in rotation?" Drop the performance precondition, since nothing writes it and retirement is a still-useful call rather than a performance call. Then apply the queued §7 load-cap change as written: the run reads id, type, tags, and a one-line content summary, and hydrates full bodies for the five shortlisted items only.

---

### L7. The gate as a liability

**Lens verdict: fails.** §9 calls ai-tells.md the single highest-value asset in the repo, and what is specified is a shared, person-independent, negative-only, monotonically growing blocklist with non-advisory authority over every draft, tested only for recall, and validated by a metric that cannot fail. The single biggest problem is that this list silently outranks voice.md, the one file that knows what this person sounds like, with no precedence rule stated anywhere. The good news is that the fix is mostly rewiring: §6.2 already extracts the numbers a voice fingerprint needs and the PRD then never uses one of them.

---

**L7-02 · major · §1.2, §6, §6.2, §7a, §9, §12, §13, §14 · ranked #9**
*ai-tells.md silently outranks voice.md, and the gate has no positive side at all.*
Merges L6-05, L7-04, L8-02.

**Claim.** §6.2 extracts exactly the numbers a positive voice fingerprint needs ("average sentence length and variance, do they use fragments, contractions, profanity, questions, how they handle lists") and the PRD then uses none of them for anything. No gate, no check, no metric reads them. The only enforced language check is a shared, person-independent, negative list, and §14 gives it authority over the draft before any human sees it. No line says voice.md wins a conflict, so the default is that a stranger's blocklist overwrites the person's measured habits, invisibly, on the path to the draft that is supposed to prove the voice is right. Note the scope correction: voice.md is loaded into the drafter on every run per §5, so it is unenforced rather than unread. Consequences: §9's one numeric rule is unimplementable, because "Flag if stdev of sentence length is low" names no threshold, no unit, and no comparison corpus while the corpus sits unused in voice.md; "Zero contractions, or 100% contractions" has no band and will fire on a legitimate 90-word post; "Rule of three in any list where three wasn't required by the content" asks the model to decide what the content required; and roughly all of the entries are things to remove, so a draft with no em dashes, no antithesis, and high variance passes clean while sounding like nobody. Nothing anywhere checks whether the finished draft contains a single named specific, which is the one thing §6.1 spends its entire philosophy block arguing for. Separately, the voice baseline is not frozen: §7a permits voice.md re-derivation, so the February numbers can be overwritten and drift becomes unrecoverable.

**Fails when.** Tim, month four. He has shipped 62 posts and edits almost none of them, so the dashboard reads 79% zero-edit and the gate catch rate is down. His posts now average short sentences with low variance, down from the Slack messages he pasted at setup, and he has stopped using the fragments he used in every one of those samples. Nobody notices, because nothing compares the two numbers. In the other direction, the IBM mentor pastes semicolon-heavy long-clause emails at setup, the gate strips every semicolon before she sees the calibration post, and she says no to a draft she can never reach.

**Recommendation.** Three edits, no metrics subsystem. (1) Precedence, one line in §9 and §14: "voice.md wins. A tell that contradicts a documented habit in voice.md does not fire for that profile; the gate records the override in gate-report.md instead of rewriting." (2) Give the unbounded rule its threshold by pointing it at the measurement that already exists: "Flag when a draft's sentence-length stdev, or its contraction rate, is more than 25% below the value recorded in voice.md at setup." Freeze those setup-measured numbers with one clause in §7a exempting them from re-derivation; the prose in voice.md stays regenerable with a diff, and the four measured values are frozen. For profiles with no samples, fall back to absolute floors (no sentence under 6 words, or none over 25) rather than suppressing the check, since §6.2 explicitly plans for that user. (3) Add the positive check the document's own philosophy demands: "Specifics floor. Count named people, companies, dates, and numerals. A draft with none is redrafted, not rewritten, because an abstraction cannot be patched into an instance." Reorganize ai-tells.md under three headings, Rewrite (hashtag stacks, emoji bullets, Title Case, "Thoughts?", the lexical list), Flag (rule of three, parallelism, variance, contraction extremes, and the six words with literal senses a supply-chain writer will use: navigate, leverage, landscape, realm, double down, moving the needle), and Off for this profile. Skip a nine-field YAML block per rule; three markdown headings do the same work for a single-operator tool. Note also that §1.2 gitignores `profiles/*`, so there is no version history to recover a baseline from, which is why freezing has to be explicit.

---

**L7-03 · blocker · §9, §14, §7, §7a, §3 · ranked #4**
*The rewriter can silently alter quotes, numbers, and names; §9 defines no protected span.*

**Claim.** §9 hands the rewriter the whole draft and names nothing it may not touch. §7 inventory entries hold "one to three sentences of the actual raw material" and §7a marks entries `pasted`, defined as "their own writing, verbatim." Those sentences land in drafts, and several of §9's banned lexical items appear in ordinary human speech: "double down," "moving the needle," "navigate," "leverage" are all on the list and all appear in how supply-chain operators actually talk. §14's no-invention rule is written entirely as a drafting constraint, and its remedy clause ("If a draft needs a number the inventory doesn't have, ask for it or cut the claim") only makes sense addressed to the drafter. Nothing scopes the gate, and §9 says "Fail = rewrite, not warn" and "Rewriting is the point."

**Fails when.** Joseph posts on the §6.1 example item, the planner at the $2B distributor. The inventory `content` field records her actual line about having to double down on manual checks. The gate hits "double down," rewrites it to "commit further to," and the diff line reads like a style change next to ten cosmetic ones. He ships it. A direct quote attributed to a real, identifiable person at a company described by revenue band is now a fabrication published under his name, produced by the mechanism §3 lists as the first non-negotiable.

**Recommendation.** One paragraph in §9, no markup contract. "The gate never rewrites inside quotation marks, and never alters a numeral or a proper noun anywhere. When a banned item appears inside a protected span, the gate reports it under a separate gate-report.md heading, 'not rewritten: quoted or factual,' and leaves the text alone." Quotation marks, digits, and capitalized tokens are already present in the draft, so there is no wrapper, no drafter cooperation, no render-time strip, and nothing to forget. Add the matching drafter instruction so the protection is reachable: when a draft uses an inventory item's words verbatim, it puts them in quotes. That is one line, it is what a human writer does anyway, and it makes the protected span self-identifying. The residual gap, paraphrased-but-attributed speech outside quotes, is not solvable mechanically and should not be attempted; the report line under the new heading is what puts it in front of the human.

---

**L7-06 · major · §1.2, §3, §4, §9, §12, §13, §14 · ranked #14**
*The only gate test measures recall; a gate that rewrote everything would score 100%.*
Merges L4-04, L7-05, L8-08.

**Claim.** §13 step 2 is the entire test surface: "feeding it 20 known-AI LinkedIn posts and confirming it catches them." Positive class only. A gate that flags every sentence of every input scores perfectly, and nothing anywhere measures the false-positive rate, while §14 makes the gate non-advisory and §3 makes it destructive rather than warning, so false positives are the failure mode that kills the product. §12 cannot detect over-firing either, because zero-edit percentage is measured downstream of the rewrite. §4 then builds the gate as item 2, with full authority from the first draft, before short posts exist as item 3 and long before §13 step 4 produces any calibration data. Compounding it, §9's maintenance rule is "The list only grows," which makes precision monotonically decaying by design: a rule that turns out to be wrong stays wrong forever, costing a rewrite of good writing on every future draft, and the file §9 calls the highest-value asset in the repo can never be proven to have improved. The corpus for any of this is homeless: §13's twenty posts live in someone's Downloads folder and §5's layout has nowhere to put them. Note the correction on visibility: §9 requires "show a diff of what changed and why," so rewrites are visible by design, and the pre-gate draft is recoverable from draft.md plus the diff.

**Fails when.** Week 3. Joseph writes three tight declarative sentences of near-equal length, because that is how he writes when he is annoyed about something, and that clipped cadence is the most recognizably human thing in the draft. The stdev check fires with no threshold, §3 forbids warning, and the passage is rewritten into varied-length prose that reads like the tool. He overrides it once, hits it again Monday, and by week four stops opening gate reports. Separately, in week 9 he adds eleven new tells after a bad post, and nobody can tell whether they improved catch rate or just made the gate rewrite his own sentences, because the fixture corpus is gone.

**Recommendation.** Two lines in §13 step 2 and one in §9, using material the interview already collects. (1) "Then run the gate over the person's own pasted voice samples and the 3 to 5 inspiration.md posts. Every fire on that corpus is a rule bug. Strike the rule or move it to Flag before the gate ships." State a bar so it can fail: zero rewrites on the person's own samples, and on the inspiration corpus, read the rewrites and count how many Joseph judges worse, fixing the rule if more than 2 of 20. Two hours, no distributions. Skip report-only mode entirely; the negative control removes bad rules before they touch a real draft, which is better than making the human filter them ten posts in a row, and report-only teaches the user on day one that the gate is something you supervise. (2) Add `reference/gate-fixtures/` to §5 and §1.2 holding the 20 real known-AI posts with authors stripped and one expected-catch line each. These are real third-party posts, so §1.2's no-fiction rule does not block them; it is a missing directory line. (3) Replace "The list only grows" with "Entries can be retired. A rule that fires on the person's own writing or on an inspiration.md post gets struck through with the date and the reason, so it stops firing and stays visible." Strikethrough in a markdown file is the entire mechanism. Reject an `examples/` directory with a sample inventory: §1.2 is right that a fake item is a fact waiting to leak, and §6.1's philosophy block already delivers the worked example in conversation where it cannot be copied into a profile. Add `draft-pre-gate.md` to the run directory if you want it, as convenience rather than as the fix.

---

**L7-07 · major · §3, §4, §6.2, §7, §8, §9, §12, §13 · ranked #3**
*Unbounded escape rewrites produce an avoidance signature the gate cannot see.*
Merges L7-01, L2-03, L10-04, L12-05.

**Claim.** §9 specifies "catch, rewrite, then show a diff" and §14 makes it non-advisory, with no pass cap, no same-span rule, no redraft path, and no re-measurement. Every distribution-shaped entry in the list ("Uniform sentence length," "Every paragraph the same number of lines," "Zero contractions, or 100% contractions") is evaluated against text the gate is about to change, so any flattening the gate itself causes is structurally invisible to it. The lexical rules compound this because they are purely subtractive: nothing says what replaces a removed em dash or semicolon, and the cheapest resolution, splitting the sentence or dropping the clause, reduces punctuation density and sentence-length variance, tripping a rule three bullets up that will never be re-run. §9's own rules also fight each other, since removing a "One-word or two-word rhetorical paragraph" pushes toward uniform length. And there is no defined behavior when a draft cannot be cleared, so the loop an implementer reading §14 literally will ship is `while (fails) rewrite()`. §3 contains the correct instinct one row away ("rewriting a bad idea only produces a well-written bad idea") and §9 never applies it to itself. Four of the surviving lens findings reached this from different directions, including the unbounded loop, the undefined stdev threshold, and the interaction with §3's own hard-fail rewrite.

**Fails when.** Fallon runs `/content-engine post` on an anchor item she has thin material for. The draft trips eleven rules. The gate resolves all eleven and the post that reaches her has no dashes, no semicolons, no fragments, no parallel bullets, no three-item list, and no rhetorical one-liner, every sentence a medium-length declarative joined by a comma. It passes the gate clean, reads like a compliance memo, and she ships it unedited because §12 rewards exactly that. It lands below her trailing 20-post median, and §11's threshold will attribute the miss to the hook pattern. A second version of the same failure: a draft trips verbatim overlap, the rewrite trips uniform sentence length, the next pass trips antithesis, and Fallon watches a spinner with no output and no way to override.

**Recommendation.** Four sentences appended to §9's Gate behavior, in this order of value. (1) "After any rewrite pass, re-run the gate on the rewritten text." This is the one that matters; it closes the loop and makes gate-caused flattening visible to the gate that caused it, and it subsumes the punctuation-texture concern without any per-person metric. (2) "A rewrite substitutes, it never subtracts. Removing an em dash means replacing it with a comma, colon, or parenthesis. Resolving a lexical violation by splitting a sentence, deleting the clause, or dropping the punctuation entirely is not a valid rewrite." (3) "Never rewrite the same span twice, and cap rewrites at 3 per 200 words. Above the cap the gate returns to brief.md and redrafts once, with the tripped rules injected as constraints in the drafting prompt." Say in the doc that 3 is a knob to tune against the first ten posts from §13 step 4, not a measured constant. A model composing under a constraint writes around it, and this is cheaper in tokens than eleven surgical passes. (4) "No run ends without an artifact. If the redraft still exceeds the cap, ship the better draft with the remaining trips listed in gate-report.md rather than sanding further." Log `gate_passes` and `gate_catch_count` in the run row so §12 has something computable. Also delete the en dash from the ban between digits, and scope the semicolon ban to short posts, since §4 has articles in scope. Do not relax the em dash rule itself.

---

**L7-08 · minor · §12, §14, §11**
*"Zero human edits, 70%+" is binary on the wrong axis and rests on sixteen posts.*

**Claim.** §12 calls this "the truest read on whether the voice is right," and it is binary on the wrong axis: a one-word typo fix and a three-paragraph rewrite both count as edited. At §12's cadence of 4 posts a week, week 4 is sixteen posts, so 70% is 11.2 and the whole reading turns on whether he edited five or six. The self-scoring objection does not hold, because Joseph is the sole user and the person whose reputation is on the line, so there is no principal-agent gap. What is genuinely wrong is the sentence "This is the truest read," and the reason is an internal contradiction: §6.1 already contains a better read, the setup stop condition, "you have written one sample post and they have said, unprompted, that it sounds like them." §12 abandons an unprompted human judgment for a countable proxy that cannot distinguish a comma fix from a re-voicing, and then calls the proxy the truest one. Add the coupling, which is real: a metric rewarding non-editing, plus L7-07's unbounded sander, plus §14's non-advisory gate all push toward output too inoffensive to be worth editing.

**Fails when.** End of week 4. The number reads 75%, Joseph declares voice solved, and proceeds to §13 step 5, the render pipeline. Eleven of sixteen posts were unremarkable enough that he could not be bothered to edit them, engagement per post is flat against baseline, and the voice problem is now underneath a Playwright dependency and a slide template system. Note that §13's stated gate on step 5 is "Ship 10 posts manually. Tune voice against what Joseph actually edits," not the 70% figure, so the build order does not formally depend on this number.

**Recommendation.** Two edits, both free from day one. (a) Replace the binary with a one-word bucket Joseph types at ship time, logged in the posts.csv row §4 item 9 already creates: `clean` / `tweaked` / `rewrote`, where tweaked means typos and cuts and rewrote means he changed how it sounds. Track `rewrote` trending to zero. That kills the conflation, costs one keystroke on a step where he is already copy-pasting, and needs no Apify, no scrape, and no edit-distance computation. (b) Delete "This is the truest read on whether the voice is right" and move that claim to where the PRD already earned it: the unprompted "it sounds like you" from §6.1, carried in §12 as a week-4 checkpoint where three posts are read by one person who knows how Joseph writes. Hold the posted-versus-drafted diff until §11 ships, then add it as confirmation rather than as the primary, because §4 puts the Apify loop out of MVP and the metric governs weeks 1 through 4.

---

### L8. Differentiation and alternative cost

**Lens verdict: marginal pass.** §4's claim that three things beat a plain ChatGPT prompt is two-thirds flattery: a Claude Project with ai-tells.md in its instructions runs the same gate, and one with inventory.md in project knowledge selects the same anchors. Only the repetition guard is genuinely uncopyable, because it needs mutable cross-session state and exact string arithmetic, and the PRD leaves it as prose while §7a forbids the write that would make it work. The one thing no alternative can do, the join between a named inventory item and a measured outcome per person across formats, is built eighth of eight. Most of this lens consolidates into L12-06, L5-04, L7-02, L2-08, and L1-01; the two below are what remains distinct.

---

**L8-06 · major · §12, §4**
*No metric tests the engine against Joseph writing it himself.*

**Claim.** §4 benchmarks against "a plain ChatGPT prompt." That is not the alternative Joseph will defect to. The alternative is writing the post himself with light AI help, and the best-documented reason tools in this category get abandoned is that editing the machine's output costs more than writing would have. §12 measures edit rate, which is the right instinct, and never measures the clock. §12's leading indicators are posts per week, zero-edit percentage, engagement versus baseline, inventory depth, and gate catch rate. No duration. §11's posts.csv columns end at "day, time," which is time-of-day of posting rather than elapsed time. The only clock anywhere is §12's 45-minute portability test, which measures a stranger's setup once. Meanwhile the PRD is actively stacking human-in-the-loop cost with no budget: five angles with a pick, a draft plus two alternate hooks, a gate diff with reasons, and a two-minute top-up, four times a week, with no ceiling stated anywhere.

**Fails when.** Week 4 review. Joseph has shipped 14 posts and 71% needed no language edits, so the headline metric passes and the engine is declared working. Nobody recorded that each post took roughly 34 minutes of reading angles, picking one, reading the gate diff, and rendering. The engine passes its own test and quietly loses to a text editor, and it dies in week nine with nobody able to say why.

**Recommendation.** Add `minutes_to_ship` to §11's posts.csv columns, computed as wall clock from invocation to run completion. Zero typing, and a rolling median over 20 posts absorbs the meeting he walked into mid-run. Do not invent the baseline; measure it where the build order already puts you. §13 step 4 is "Ship 10 posts manually," so record wall clock on those ten. That is the hand-written comparison, it is free, and it exists before step 5 spends a week on the render pipeline. Then add a kill criterion to §12, naming which scope gets cut so the decision is not relitigated when someone is attached to the carousel renderer: "If median `minutes_to_ship` over posts 11 to 30 exceeds the step-4 hand-written baseline while zero-edit rate is at or above 70%, the engine has lost to a text editor. Cut the human-decision surfaces in this order: the after-run inventory top-up (§7), the two alternate hooks (§14), then the 5-angle pick (§1.1 step 3). Do not cut the gate." State the ordering as the real trade it is: §7 calls the angle crossing "where the non-obvious posts come from," so it is last to go and cutting it is a bet against requirement 2.

---

**L8-07 · minor · §1.1, §14, §11, §12**
*Engine stops at the artifact and ignores the reply window.*

**Claim.** §1.1's eight-step table ends at "Log run, append to index." §11 weights `comments x 3` as the heaviest term and nothing in the pipeline helps produce a comment, so the engine measures a quantity it does nothing to influence. Note the scope caveats that survive the skeptic pass: §12 explicitly separates outcome goals from leading indicators, §11's score is a measurement weighting used to rank a person's own posts rather than an objective the engine acts on, and the supporting reply-latency statistics are C-tier and unverifiable. Outbound automated commenting is correctly out of scope and should stay out.

**Fails when.** Tuesday 9:40am. Joseph pastes the post and walks into a customer call until 11:30. Three senior supply-chain operators comment in the first 25 minutes with substantive objections. He replies at 11:40 with two lines each, cold. The post is scored at 3x weight for comments and the engine contributed nothing to the window that set its ceiling.

**Recommendation.** Do not add a step 9 to §1.1 and do not pre-draft replies to objections nobody has made yet, which against a skeptical senior audience reads worse than a cold human reply. Add one line to §8 instead: `/content-engine replies <slug>   # paste the comments, get drafted replies from inventory`. On-demand, so it costs zero tokens on runs where nobody comments, and it runs after the real objections exist, so the replies answer what was said. Add the rule the on-demand version needs: "Inventory items cited in a reply are read-only. They do not consume the anchor lock." Without it, four posts a week drains the store past §12's floor inside a month. Drop the named-accounts idea, since the engine has no live feed read and inventing one is a new dependency for the thinnest part of the idea, and drop the proposed auto-post warning, since §14 already covers it.

---

### L9. Measurement rigor and the learning loop

**Lens verdict: fails.** §11 is engineered as a causal-inference engine on a dataset that cannot support causal inference: one anchor per post, 35 hook patterns, 7 candidate variables, 4 observations a week, no logged held-out arm, and no random assignment. It then feeds its output straight back into the drafting context, which closes the loop in the wrong direction, so the measurement layer becomes the channel through which pure variance reaches the writing.

---

**L9-01 · minor · §11, §12**
*Dividing by followers normalizes the slice where the variance does not live.*

**Claim.** §11's metadata list is "format, hook pattern, inventory item, thesis, angle type, day, time." No follower count. So "divided by follower count at time of posting" names a field the document never captures, and every post shipped before the first scrape has no recoverable denominator. The bias argument is real but smaller than first stated: both §11 and §12 use a rolling trailing-20 window, so the drift is only within the window, on the order of 14% down rather than 72%, which is invisible under the noise of a heavy-tailed metric at four posts a week. The sharper defect the finding walked past: §12 says "Median engagement rate," which implies impressions, while §11 divides by followers. The two sections do not agree on what is being measured.

**Fails when.** Month six. Joseph runs review and finds that half his corpus cannot be scored at all, because no `followers_at_post` value was ever written for posts shipped before the analytics loop existed, and that §12's indicator and §11's score are computed on different denominators.

**Recommendation.** Take the deletion, skip the rest. In §11 replace the divisor clause with `raw_score = comments*3 + reposts*2 + reactions*1` and `rel_score = raw_score / median(raw_score, previous 20 posts)`. That is what §11's own threshold sentence already speaks in, so it costs zero new data and removes a field the doc never captured. Add one line: "3/2/1 is a chosen convention, not measured." Then make §12's third bullet read `rel_score` verbatim so §11 and §12 stop using two different denominators. Do not add a `followers_at_post` column, because nothing consumes it once the divisor is gone and §12 already tracks follower count as an outcome goal. Drop the unsourced reach and ranking-model claims rather than importing them into the doc.

---

**L9-02 · major · §1.2, §3, §7, §7a, §9, §11, §12, §14**
*The 2x-single-post clause fires on roughly a quarter of all posts, hypotheses reach the drafter, and nothing can be killed.*
Merges L6-04, L9-03, L5-05.

**Claim.** §11's second qualifying clause, "or when a single post beats the trailing 20-post median by 2x or more," is not a threshold. LinkedIn engagement is heavy-tailed; under a lognormal with shape 1.0, P(X > 2x median) is 24%, and at 1.5 it is 32%. At 4 posts a week that manufactures roughly one finding per week out of pure variance, and the most common real cause, one large account reposting, is invisible to the loop, so the engine writes a confident causal story naming a hook pattern when the cause was a stranger. §11 then says learnings.md "is loaded at draft time" without saying that only confirmed entries load, so unconfirmed hypotheses, and `killed` ones which §11 keeps in the file by design, reach the drafter and steer the writing. There is no kill criterion at all: "Hypotheses are marked `confirmed` or `killed` as later posts land" never says what evidence kills, so a hypothesis can only harden. §11's one genuine defense, "one post in five that ignores the learnings," is never written to any column, so the held-out arm exists in prose and cannot be used as an evidence pool, and a post that deviates on everything at once produces data nobody can attribute to anything. The 5v5 clause also names no test statistic: "holds across 5 posts on each side" read as "the median is higher on one side" is true half the time under the null.

**Fails when.** Week 13. Joseph's post on the shadow-spreadsheet planner gets reposted by a 40k-follower operator. Reactions and comments arrive from an audience that has never seen him, and raw score lands at 3.4x the trailing-20 median. Review writes a hypothesis naming the candidate difference it can see, "question-opener hook, no number in line one." From the following Monday every draft loads it. By week 20 he has shipped fourteen question-opener posts and his baseline is flat, because the cause was one stranger's repost and the engine had no way to know.

**Recommendation.** Four edits to §11, all engine-side, zero user-facing friction. (1) Delete the 2x-single-post clause. (2) Add to the load rule: "Only entries tagged `confirmed` load at draft time; `hypothesis` and `killed` entries stay in learnings.md for the human to read at review." That enforces a guarantee §11 already makes in prose and closes the channel through which variance reaches the writing. (3) State the test on the 5v5 clause: exact Mann-Whitney U on the ten scores, qualifying at U less than or equal to 2, which is two-tailed p = 0.0317 at n = m = 5. Ten lines of code. Note for whoever implements it that the commonly cited U ≤ 1 bar is p = 0.0159 and sets the threshold high enough that the loop confirms essentially nothing. (4) Give the kill rule symmetry with the qualify rule: "A hypothesis is killed on the same evidence that would have qualified its inverse. Unresolved at 90 days, it is marked killed." Add `arm: explore|exploit` and `tests_hypothesis: <id>` to brief.md, written automatically from the existing one-in-five rule, with the exploration post deviating on one named dimension. Set an `amplified` flag automatically when the scrape shows a reposter with more than 10x the author's follower count, and exclude those posts from the evidence pool while keeping them in §12's totals. Skip archive files and load caps for learnings.md: at these thresholds it is roughly a thousand tokens at month six, and §7 already argued the cap belongs on what a run loads. Reject loading full outlier post text at draft time; it fights §3's verbatim lock and it is the collapse vector §11's own guardrail names.

---

**L9-04 · major · §4, §5, §7a, §9, §12, §13**
*Gate catch rate cannot measure learning, and the number cannot be computed anyway.*
Merges L2-10, L12-03.

**Claim.** §12 reads a falling catch rate as evidence the drafting model is internalizing the constraints. There is no learner. Each run is a fresh context reading the same files, §7a guarantees "A draft run reads profiles and never modifies them," and there is no fine-tuning, no cross-run gate feedback, and no prompt mutation. Three things push the number around and none of them is learning. §5 puts ai-tells.md in the drafting context on every short-post run, so the drafter writes against the answer key from run 1 and the rate is low from the start. §9's "The list only grows" moves the denominator, and a growing detector against a fixed generator should trend catch rate up, so the metric and the maintenance rule predict opposite directions. And format mix steps the number on a calendar date: when carousels ship at §13 step 5, slide-beat text has almost no complete sentences, so every sentence-level rule has nothing to fire on. The remaining explanations are noise, a stale list, and the drafter routing around the enumerated tells into constructions nobody listed, so success and the worst failure produce the same number. Separately, nothing in the schema counts catches into a field that can be trended: §4 item 9 logs tokens only, and the gate's output is prose.

**Fails when.** First carousel week. The catch rate drops sharply. Joseph reads it as the model internalizing the voice and stops reviewing gate-report.md. What actually happened is that carousel slide text contains four sentences instead of forty. Six months later there are 100-plus gate reports, the aggregate signal that he writes antithesis constructions in every first draft was available in all of them and surfaced in none, and §12's trend cannot be computed because catches were only ever prose.

**Recommendation.** Delete the bullet. Replace it with "Gate recall and false-positive rate against `reference/gate-fixtures/`, reported whenever ai-tells.md changes," which measures the thing you need to know as the list grows, runs as one script, and reuses the fixture corpus and negative control from L7-06. Keep the two indicators §12 already has that do this work: the zero-edit percentage and the trailing-20 engagement baseline. Keep gate-report.md, because it is the audit trail on the one component that silently edits the human, but print one line by default (`gate: 9 catches (em-dash x3, antithesis x2, uniform-length x1)`) rather than the itemization, and log `gate_catch_count` plus a tag list in the run row so a rising per-tell count can tell Joseph when the seed list needs a new entry. That is the only decision a catch count can honestly drive. Do not split human edits into repair and upgrade taxonomies; self-reported classifications stop being filled in around week three, which is the exact interval this review is worried about. Note that a per-person structural baseline is unavailable for the users who most need the gate, since §6 explicitly plans for profiles with no writing samples, so any fixture-independent threshold has to have an absolute fallback.

---

### L10. Spec integrity and undefined behavior

**Lens verdict: does not pass as an implementable contract.** Unusually good as an argument and unusually weak as a spec, and it knows: revision note 2 carries a queued block containing two changes without which §5 contradicts §1.3 and §14 contradicts §3. The self-disclosed gaps are not the problem. The problem is that the three mechanisms §4 names as the entire differentiator are the three least specified things in the document. An implementer following §5 and §14 literally builds an engine that fails §12's own portability test on the first run and runs out of legal anchor items around day 44.

---

**L10-02 · minor · §1.2, §1.3, §5, §11, §12**
*§5's tree puts runs/ and analytics/ at root, defeating the .gitignore that protects the inventory.*

**Claim.** §5 places `runs/` and `analytics/` as siblings of `profiles/`, while §1.3 requires every run to write only inside `profiles/<handle>/` and cites §5 as its authority. §12's corollary check therefore fails on the first run for every user, and the §1.2 .gitignore that exists "so nobody pushes their inventory by accident" is defeated, because brief.md and draft.md at root quote the inventory verbatim. Note that the fix is already written down: revision note 2 lists the §5 move as queued, and §1.3 has already made the decision in prose. What is genuinely new is the consequence, which reframes the move from housekeeping to must-apply-before-first-run, plus one real gap: §11's score divides by "follower count at time of posting" and follower count appears nowhere in §11's own row-metadata list, so the denominator has no column. The claim that posts.csv's columns are unspecified is false; §11 names seven of them.

**Fails when.** The IBM mentor runs §13 step 6. She finishes a post in 40 minutes, and `git status` shows `runs/2026-09-02-shadow-spreadsheet/draft.md` and `analytics/posts.csv` modified at repo root. Her raw material, a named customer story quoted into brief.md, is now a tracked file that the .gitignore was written to prevent.

**Recommendation.** Two edits, both one line. (1) Move the §5 change out of the queued block and into §5, and note the reason in §1.3: a root-level `runs/` sits outside the .gitignore rule and draft.md holds the raw interview material verbatim. (2) Add `followers_at_post` to §11's row-metadata sentence, or delete the divisor per L9-01, but do not leave the formula naming a field nothing captures. Do not freeze a 16-column header list in the PRD: §1.2 already ships posts.csv with headers in `_template/`, that file is the schema, and duplicating it in prose creates two places to update and one to forget. Keep exactly one migration sentence in §11: new columns append on the right, existing columns are never reordered or renamed.

---

**L10-03 · major · §1.1, §1.2, §4, §6.1, §6.2, §10, §13**
*Setup must render two examples five build steps before the renderer exists.*
Merges L1-06.

**Claim.** §6.2 instructs the interviewer to "show two rendered examples rather than describing the options, and write theme.json." Rendering requires the Playwright pipeline, which §4 builds fifth and §13 gates behind step 4's ten shipped posts. Setup is §13 step 1. The implementer has two bad options and whichever they pick becomes shipped behavior, because nobody revisits it once short posts are landing. §1.1 also asserts that "`render/` sits behind one documented input contract" while no section documents theme.json's token names, though four components depend on them: `_template/` ships defaults, setup writes the file, render consumes it, and §10's design gate enforces "a limited palette pulled from theme.json." Note the correction on severity: theme.json is not in §6.1's four-clause stop condition, so setup can complete cleanly without it, and the actual cost is a 5 to 10 minute detour in an interview that is already three times over budget.

**Fails when.** Build week 1. Guess A: describe serif versus sans in prose, which the sentence explicitly forbids; Joseph picks sans-airy the way everyone picks the default; theme.json is written with tokens nobody chose; and at step 5 in November the first carousel renders in a theme no human selected. Guess B: pull Playwright into step 1, so the IBM mentor's 45-minute portability test now includes a Chromium download partway through an interview.

**Recommendation.** Delete the Visual paragraph from §6.2 and replace it with one line: "Visual is not asked at setup. The first `/content-engine carousel` run pulls a palette, shows two real rendered slides, and writes theme.json then." That deletes the ordering conflict, removes minutes from an interview that cannot afford them, and asks the visual question at the only moment the user has context for answering it. §1.2 already ships default theme tokens in `_template/`, so a profile with no theme.json is valid from day one; tune those defaults to clear §10's design gate (limited palette, real type scale, asymmetric margins) so the first carousel renders acceptably even if the user never touches it. Drop theme.json from §6.1's seven-file list, leaving six. Add one line in §10 naming theme.json's keys, to make §1.1's documented-input-contract claim true. Do not add theme.json to §6.1's stop condition; the stop condition is a quality floor on the four things that are hard and easy to fake, not a coverage checklist, and §6.1 says "The interview is not over when you run out of questions," which is the opposite of a coverage list. Leave the font question alone: §10 flags "Default Inter or Poppins with no adjustment," so the tell is the absence of typographic work rather than the typeface, and §1.2 does not need to ship font files.

---

**L10-06 · major · §1.2, §3, §5, §7, §7a, §11**
*Three locks and all of learnings.md key on vocabularies the doc never defines.*

**Claim.** §3 lists seven structural-job names with no definition of any of them, no rule for who picks one or when, and no lock duration, and its own row states the rule two ways: "Reusing an anchor item across formats is allowed. Reusing the job is not," immediately followed by "A repurpose matching the source on anchor and job and thesis is refused." Those two disagree on the same-anchor, same-job, different-thesis case. The hook-pattern half of the original claim does not hold, since §1.2 says "35 named hook patterns" and a name is a stable identifier. What does hold, and is the reason this survives: `connects_to: [thesis-2, thesis-4]` is positional, and §7a explicitly sanctions regeneration ("voice.md and thesis.md can be regenerated once real posts exist"). The document therefore designs in a step that silently repoints every cross-reference in inventory.md.

**Fails when.** At post 10 Joseph re-derives thesis.md per §7a, accepts the diff, and ends with four arguments where he had five, reordered. Every `connects_to: [thesis-2]` across his 22 inventory items now points at a different argument. The next run crosses the shadow-spreadsheet story with the wrong thesis and produces a well-written post arguing something Joseph does not believe. There is no error, no flag, and nothing in the gate that would catch it, correctly, because the post is fine as prose. It lands on exactly the audience that notices incoherence across a person's posting history.

**Recommendation.** (1) Change `connects_to` to slug ids in §7's schema, `connects_to: [t-forecast-error-is-a-trust-problem]`, with thesis.md entries carrying `id: t-<slug>` derived from the argument's words rather than position. One line, and it also makes inventory.md readable by the human who owns it, since `thesis-2` means nothing to Joseph reading his own file. Then have §7a's existing re-derivation diff list any `connects_to` that would be orphaned; the accept step is already the guard, so no refuse-to-write rule is needed. (2) Delete "Reusing the job is not" and let the anchor-and-job-and-thesis triple in the next sentence stand alone as the rule. (3) Define the seven jobs, one line each, and label the five proposed angles with their job at §1.1 step 3, which is one word per angle and gives the human real information at pick time. Noted as taste rather than defect: seven is probably too many for consistent application, `argue`, `diagnose`, and `transform` will blur, and a lock keyed on a label that drifts never fires. Four would be better. Also add one sentence saying hook names are append-only and never renamed, which covers the residual identifier risk without any id ceremony.

---

**L10-07 · major · §1.1, §3, §4, §5, §8, §11, §12, §14 · ranked #13**
*No run is ever marked shipped, so review, the verbatim diff, and the analytics join have no key.*
Merges L9-05, L4-07.

**Claim.** §14's "No auto-post. Output is copy-paste" means the engine structurally never observes publication, and no step anywhere captures the post URL, which §11 names as the join key ("Both join into `analytics/posts.csv` on post URL"). §5's run directory holds brief.md, draft.md, gate-report.md, slides/, final.pdf, and no status field. Four mechanisms are inert. `/content-engine review` has no candidate list, so it either asks Joseph to paste URLs from memory or logs abandoned drafts as shipped posts with zero engagement, poisoning learnings.md, which §11 then loads at draft time. §3's diff runs "against the last 20 shipped pieces" with no way to distinguish published from abandoned, and it contains none of the posting history a 1.4k-follower account already has. §12's flagship metric is uncomputable from day one, because the engine has never seen a published sentence, and §6.2's "re-derive voice from what performed" would re-derive from the engine's own drafts. posts.csv ships with headers per §1.2 and is MVP per §4 item 9, and its header row is specified nowhere. Two smaller undefined behaviors ride along: §8 shows `as fallon` as a bare "switch profile" with no subcommand and no stated persistence, and any persisted current-profile pointer would have to live at root, which §1.3 forbids; and `/content-engine setup` is documented once-per-person with no guard, so running it against an existing profile is undefined.

**Fails when.** Week three, the first review. Nothing distinguishes the six runs Joseph published from the four he abandoned. Separately, his fourth engine post rebuilds his best-performing story from June nearly verbatim, passes the lock cleanly because the corpus contains none of his pre-engine posts, and lands in front of the same audience. Third and smaller: he runs setup in November intending to onboard Tim, forgets `as`, and setup, a named command permitted to write and specified only as "Setup creates," overwrites his 40-item inventory.

**Recommendation.** Define shipped as "has a row in posts.csv," and do not add a paste ritual to the daily loop. (1) One keystroke at the end of every run: "Shipped as written? [y/n]." `y` copies draft.md to `runs/<slug>/shipped.md`, appends the posts.csv row, and increments §12's numerator, which makes the 70%-by-week-4 target computable from post 1 with no analytics loop and buys the diff corpus from the same keystroke. The roughly 30% edited case is the only one that costs a paste. (2) `/content-engine review` lists run slugs with no posts.csv row, oldest first, and asks for URL plus reactions, comments, and reposts, batched weekly. (3) Once the Apify loop lands at §13 step 7, fuzzy-match the scraped post text against draft.md using the same similarity routine the verbatim check already needs, which recovers the URL-to-slug join and a real edit distance retroactively with no human in the loop. Reuse the diff you are already building. (4) Freeze a minimal posts.csv header now, `run_slug,shipped_at,shipped_verbatim,post_url,followers_at_post,reactions,comments,reposts`, and let brief.md carry format, anchor, thesis, hook, and job rather than duplicating them into a second place to be wrong. Add `job:`, `hook_id:`, `thesis_id:`, `status: drafted` to brief.md's front matter, written at step 3 where they survive a render crash, and let review flip status. One line at run start handles reconciliation: any brief still `drafted` after 7 days prints "Did you ship <slug>?" (5) Seed the diff corpus at setup: §6.2 already asks for "3 to 5 things they've written," so accept recent LinkedIn posts there, store them in `profiles/<handle>/shipped-history.md`, and diff against them until 20 engine posts exist. Optional, never gates the interview, and the same paste improves voice extraction. (6) Make `as` a stateless prefix, `/content-engine as <handle> <command>`, and with no `as` use the single profile if one exists, otherwise list handles and ask. A hidden current-profile pointer means Joseph drafts Fallon's story in Joseph's voice and finds out on LinkedIn. (7) Setup idempotency guard, one line.

---

### L11. Multi-persona, team, and company page

**Lens verdict: fails.** A single-operator design with a four-account roster stapled onto §2 and then deferred in §15. Every mechanism the PRD is proudest of is scoped to one directory, which is correct for the IBM mentor and blind for the day-one deployment, because the three humans share customers, launches, and internal numbers, and their audiences overlap almost completely. All of it is cheap to fix now and expensive after three profiles have inventories in flight. The shared-fact collision is filed under L2-07.

---

**L11-02 · major · §15, §1, §6.1, §6.2, §9**
*Seeding three personal voices from one company register erases voice distinctness.*

**Claim.** §15 recommends yes on reusing one shared comment-register file as the starting point for the Daybreak voice.md files. That is the fastest available route to three employees who write identically, on three accounts with a heavily overlapping audience, and the §9 gate cannot detect it, because every tell in §9 is scoped inside a single draft and never compares two profiles. Note the scope correction: §15 is a list of open decisions, so this is a recommendation awaiting a yes or no rather than a shipped mechanism, and §6.2's existing no-samples path routes to inspiration.md, which is per-person by construction and is therefore a divergence source rather than a convergence source. A comment register is also a register for replies, so the paragraph-level homogenization predicted here is asserted rather than demonstrated.

**Fails when.** Setup runs on Tim, who has no writing samples. The register is right there and validated, so Tim's voice.md and Fallon's are both seeded from it. Six weeks later a prospect who follows Joseph and Tim reads two posts an hour apart with the same clause rhythm and the same closing move. Nothing trips the gate, because the gate never compares two profiles.

**Recommendation.** Three things, all cheap. (1) Answer §15 bullet 3: no for `joseph/`, `fallon/`, and `tim/`; yes for `profiles/daybreak/` only, where a company register is the correct artifact. (2) One line into §14's hard rules: "voice.md is never seeded from another person's or a company's voice file. Registers describe a company; voice.md describes one human." That is the defect fixed at zero user cost. (3) Keep §6.2's no-samples fallback but reorder it: before falling back to inspiration.md, ask for a two-minute voice memo on a question they care about and transcribe it. That is less friction than digging up five Slack messages, it is the only way to get real cadence out of someone who does not write, and it keeps the 45-minute budget. Reject the hard requirement of five quoted sentences before voice.md can exist, because it puts a hard stop in front of §12's portability test for the exact persona §12 uses as the proof. Keep the blind-authorship check and put it in §12: after each person has shipped ten posts, strip names from five posts each and have a fresh Claude assign authors. It costs the user nothing and it is the only actual measurement here.

---

**L11-03 · major · §7, §6.1, §6.2, §9, §11, §2**
*Page inventory, interview, and stop condition all assume a person exists.*

**Claim.** The directory shape transfers to a Page and the inventory schema, the interview, and the stop condition do not. §7's `type:` enum, §6.2's "a story from before this job," and §6.1's "they have said, unprompted, that it sounds like them" all presuppose one human. A Page has no story from before this job and no single "them." Note that the PRD does not claim otherwise: §15 leaves the Page's structure explicitly undecided, §11 hedges with "once it is posting," and §13's eight build steps never build it, so an undecided item is not a defect. What survives at full strength and is nowhere flagged: the announcement register has zero entries in §9. "We're excited to share what we've been building" passes clean, with no em dash, no listed lexical item, no antithesis, no rule of three, fragments not required, contractions present. That hole is not page-shaped. Joseph posting about a product launch in week two of §13 step 4 hits it first, on the account §12 is trying to grow.

**Fails when.** Fallon runs setup on `profiles/daybreak/`. The interviewer asks what she believed six months ago that she no longer believes and she answers as herself, because no one else is in the room. The Page's inventory is now Fallon's personal inventory with a logo on it, and by October the Page and Fallon are arguing the same beliefs in the same weeks. Meanwhile the Page's first launch post clears the §9 gate.

**Recommendation.** Kill `profile_type` as a schema field, because three of its five branches do not need it. Do two things now and one later. Now: (a) append the announcement register to ai-tells.md unconditionally, as a named block: "we're excited/thrilled/proud to," "at <Company>, we believe," "join us," "stay tuned," "more in the comments," first-person plural with no named human in the post, the announcement-shape post whose only news is that news exists, and the customer quote deployed as testimonial. Nine strings, one section, and it protects Joseph in week two as well as the Page in October. Gating those tells behind a page flag would hide them from the only account that exists during MVP. (b) Add `owner: <name>` to identity.md. One field, and it pays three times: it names who satisfies §6.1's stop condition for a profile that is not a person, it answers §15 bullet 1 for the Page, and two other findings want it. Later, gated on §13 step 6: replace §6.2's raw-material block with a page variant, what shipped and what broke, what a customer asked for that surprised you, a number out of the product, what the category gets consistently wrong, and what you decided not to build and why. Those still yield instances. The taste call: until the Page has a named owner willing to answer that interview, the Page reposts the three humans with a sentence of commentary and owns no inventory at all.

---

**L11-06 · minor · §15, §14, §5, §8, §1.2**
*Nothing in the run directory can mean "awaiting another human."*

**Claim.** §15 asks who reviews before publish and the design has nowhere to put the answer: the run directory holds brief, draft, gate report, and final asset, and no state field, and the last thing the engine does is print text to one person's terminal. Note that this is largely self-refuting as a defect. §14's "No auto-post. Output is copy-paste" makes the human the approval gate by design, §15 has not chosen an answer yet, and building an approval state machine on a copy-paste product would be theater, since the human can paste regardless. What is worth building is the confidentiality tripwire, and it does not need the apparatus around it. Separately, the word "review" is already claimed by analytics, which is a real usability hit: a non-technical user types `review` expecting to review a draft and gets an analytics prompt.

**Fails when.** Tim runs a carousel on a customer's inventory-turn improvement. Slide 4 carries "31% fewer stockouts in 90 days," sourced honestly from his inventory but originating in a pre-contract pilot the customer never agreed to have quantified publicly. He pastes it at 8:40am to catch the early window. Nobody at Daybreak sees it before the customer's VP does.

**Recommendation.** One field, one line, no new files. identity.md already holds "what they sell, to whom," so add `confidential:` there, a list of customer names and unlaunched product names collected in §6.2's identity pass with one extra question. If a draft contains one of those strings, the run prints a single line directly above the copy block: "Names Northwind. Cleared to publish?" Nothing is queued, nothing is stored, nothing waits. Two seconds, on the small minority of runs that name a customer. Separately, rename `/content-engine review` to `/content-engine learn` in §8 and `workflows/review.md` in §1.2, for the usability reason rather than the collision. Answer §15 bullet 1: for a personal profile the person approves and nobody else, because a peer sign-off on Joseph's own post is the friction that kills this tool by week three; for the Page, `owner:` approves.

---

**L11-07 · minor · §1.2, §7, §7a, §6.1**
*The shipped .gitignore leaves profiles untracked, unrecoverable, and invisible to §12's own check.*

**Claim.** The one line that protects a solo user from pushing their inventory to a fork also means `profiles/` is never committed, so there is no history, no diff, and no handoff path, and append-only with no version control means a bad `/content-engine inventory` run cannot be undone. The severity as originally filed rests on ten client inventories, a persona §2 does not have; for the five users who exist, a lost drive costs one 45-minute interview. The sharper version of the same two lines, which the finding missed: §1.2's ignore half-kills §12's own portability test. "after their run, `git status` should show changes inside `profiles/<handle>/` and nowhere else" cannot show changes inside `profiles/<handle>/`, because `profiles/*` is ignored. The positive half of the test never fires, so it passes identically on a correct run and on a run that wrote nothing at all.

**Fails when.** The operator's SSD fails. `profiles/` was never committed, because the shipped .gitignore excluded it and nothing in setup ever said the directory was unprotected. The engine reinstalls in two minutes and the interviews do not. Separately, on every portability test the corollary check reports a pass it did not earn.

**Recommendation.** Keep the ignore; it earns its place. Two edits. (1) Setup's final action prints one line and writes the same line into the profile: "`profiles/` is gitignored so a fork can't leak it, which also means it is not backed up. Run `git init && git add . && git commit` inside `profiles/`, or point it at a private remote." Ship the .gitignore with a commented un-ignore example for a single handle. (2) Fix §12's corollary so it tests what it claims: `git status --ignored profiles/` for the positive half, or `git -C profiles status` if profiles is its own repo, and plain `git status` for the "and nowhere else" half. That is the higher-value half of this finding and it costs one line. Skip a README agency section until an agency is paying, because documenting a persona §2 does not have invites building for it.

---

**L11-08 · minor · §8, §14, §1.3**
*Sticky profile switch publishes Fallon's material from Joseph's account.*

**Claim.** §8 defines `as <handle>` as a switch and never says whether it persists, and no output in §5 or §8 echoes which profile produced a draft. Note the mitigation the original claim skipped: §14's "Never show one draft. Show angles first" and §1.1 step 3's "Cross into 5 angles, human picks" mean Joseph is handed five angles generated from fallon/inventory.md, every one about a customer call he was not on, so the signal is the entire screen. Persistence is also unlikely to be built at all, because a sticky-mode flag needs a state file and §1.3 leaves nowhere sane to put one. What is actually wrong is that §8 does not say so, which is a one-line documentation gap in a list of single-shot commands.

**Fails when.** Joseph switches to Fallon's profile on Monday to draft her post. Tuesday at 8:05am he opens the same terminal, types `/content-engine`, and gets material from fallon/inventory.md in Fallon's cadence. If he is moving fast, the post asserts first-person presence at a meeting he never attended, on the 1.4k account he is trying to grow, and the correction is public.

**Recommendation.** One line in §8: "`as <handle>` scopes a single invocation and does not persist. With several profiles installed and no `as`, the engine asks." Then echo `[profile: fallon]` as the first line of the angle list and again immediately above the copy block, fenced separately so it cannot be pasted with the post. Zero state, zero friction, and it makes the wrong-profile run visible one step earlier than the angle list already does. Do not add a state file to make the switch sticky; that trades a documentation gap for a §1.3 violation.

---

### L12. The daily loop and its ergonomics

**Lens verdict: fails requirement 1 as written, and not for the reason the doc would expect.** The ceremony is bad and fixable in an afternoon. The real problem is that the loop is bolted onto an engine that arithmetically stops producing, and the PRD's answer to that moment is an interview offered to a person who opened the terminal to post something. Fix the arithmetic first, define the refusal contract second, and cut the ceremony third, in that order.

---

**L12-01 · major · §1.1, §3, §6.2, §7, §8, §9, §14 · ranked #10**
*Mandated ceremony makes the default run homework, not one keystroke.*
Merges L12-02.

**Claim.** §8 says "Default with no args is the daily driver. It should feel like one keystroke to a finished post." §1.1's own pipeline table makes "Cross into 5 angles, human picks" a router-owned blocking step for every format, so it cannot be waived per format. §14 mandates "Never show one draft. Show angles first, then one draft plus two alternate hooks." §9 always prints a diff of what changed and why. §7 tails every run with a top-up prompt. §3 prints staleness flags at run start. In steady state that is two blocking decisions and four to five reading blocks around one 180-word post, 104 times a year, and §3's own failure table lists "Not agentic" with the mechanism "The engine picks the angle, drafts, gates, renders, and self-critiques without being re-prompted at each step," which is the opposite instruction to the same implementer. Implementers build what the hard rules say, so §8 loses. The angle menu is also the wrong tax: it asks the human to compare five abstractions of posts that do not exist yet, at the moment of lowest information, and the selection pressure runs toward whichever of the five is least likely to annoy an account. Note that a nine-minute week-three scenario overstates the day-15 case, since staleness flags cannot fire before day 61 and the 400-line trigger cannot fire at 25 items.

**Fails when.** Steady state, any Tuesday morning. Two blocking prompts and three reading blocks around one short post. By week five he has stopped opening the tool on mornings and batches Sunday night instead, which is exactly the workflow the engine was built to replace and which produces posts that read like they were batched.

**Recommendation.** Keep §7's five-angle generation intact, because "Never draft the first angle you thought of" is load-bearing and cheap. Stop blocking on the pick. The default run drafts the engine's choice immediately and prints three things: one line above the post (`angle · item · job`), the post, and the four rejected angles as one-liners beneath it. Taste still enters, because the human reads the road not taken and says "do the third one," and follow-ups are handled conversationally, which is free in Claude Code and which a non-technical user already knows how to do, so no keyword grammar is needed and none should be invented. Amend §14 to "Never show a draft without showing what it was chosen over," and amend §3's not-agentic row to "the engine picks an angle and drafts it; the alternatives are visible, not blocking," so the router has one instruction instead of two. Move §7's after-run top-up out of the daily driver entirely. Cap run-start warnings at one line total, most urgent wins, everything else waits for the next run. Replace the untestable "one keystroke" language with a testable rule: the default run's terminal output is the post plus two lines.

---

**L12-06 · major · §1.1, §1.3, §3, §4, §5, §7, §7a, §8, §11, §14 · ranked #2
*No command may write `used:`, so all three §3 locks have no state store and the repetition guard does not exist.*
Merges L4-01, L6-01, L8-01, L9-06, L10-05.

**Claim.** §3's anchor lock requires each consumed item to be "timestamped," and §7's schema puts that timestamp in `used:` inside inventory.md. Three separate rules forbid writing it: §7a's "Nothing else writes to a profile, ever. A draft run reads profiles and never modifies them"; §14's "Only named commands write to a profile. A draft run never modifies one"; and §7a's "Append, never rewrite," since stamping a field on an existing entry is a rewrite. Neither named writer consumes an anchor. `performance:` is orphaned identically, which deadlocks §7's retirement rule ("eligible only when it has been used, is past its 60-day lock, and has a performance number logged") and turns the 400-line trigger into a permanent un-actionable nag. The thesis x hook lock has no home in any of the nine profile files. §1.3 ("Every run writes into `profiles/<handle>/` and nowhere else") and §7a ("Nothing else writes to a profile, ever") give opposite instructions about the same write once the queued §5 move puts `runs/` inside the profile. Sequencing compounds it: §4 builds the repetition guard at item 4 and the run log at item 9, so the reader ships five items before the writer.

**Fails when.** The expensive branch is the one an implementer will actually take: stamp `used:` at draft time. Joseph re-runs after a flat draft built on the UTD group-project item. That item is now stamped and locked until October, his single best piece of raw material spent on a draft that was never published, and he does not find out until he asks for it by name three weeks later. The other branch is worse in a quieter way: nothing writes `used:` at all, so week 11 re-selects the same anchor the engine already used in week 2 and week 6, the verbatim diff passes cleanly because the sentences are genuinely new, and he ships the third telling of the same story in nine weeks to an audience that has followed him the whole time.

**Recommendation.** Delete `used:` and `performance:` from the §7 schema. Both are denormalized copies of data that already exists elsewhere, and both exist only to be written by the run the write rules forbid from writing. Derive all lock state from the run log, which §1.1 step 8 already writes ("Log run, append to index") and which §7 already requires to name the anchor ("Every draft must name the inventory item it's built on, in brief.md"): add `job:`, `hook_id:`, `thesis_id:`, `status:` to brief.md's front matter, written at step 3 where it survives every crash, and every lock becomes a glob over `runs/*/brief.md`. Only `/content-engine review` flips `status` to `shipped`, so the locks read shipped rows only and an abandoned draft costs nothing. Add one scoping sentence to §7a: "Profile file means the nine curated files listed in §5. `runs/` and `analytics/` are the run ledger, and every run writes them." That dissolves the §1.3 and §7a contradiction without weakening the provenance rule anyone cares about. Retirement eligibility becomes "used, and past its lock"; drop the performance clause and the `performance: 4200 impressions` example line, since §11 abandoned impressions twelve sections later and posts.csv already keys rows to the inventory item. Reorder §4 so the ledger append belongs to item 3, not item 9, or item 4's repetition guard has nothing to read. Also fix §7a's own inconsistency while you are in there: "marking the old `superseded: <date>`" is a rewrite inside a rule that says append, never rewrite, so make the superseding entry carry `supersedes: <id>` and have the loader exclude any item named by a `supersedes:`.

---

**L12-07 · major · §5, §7, §7a, §8, §14 · ranked #11**
*Material from this morning cannot become today's post.*
Merges L2-09.

**Claim.** §14 requires that "Everything factual comes from inventory.md" and that every post name one inventory item, and §7a permits only `/content-engine inventory` to write there. So a thing that happened forty minutes ago requires two invocations, one of them conversational, before a word gets drafted, and §8's `post <topic|angle>`, which looks like the fast path, can only select from what inventory already holds. §7's replenishment question exists and is placed exactly wrong: "After each run, offer a two-minute top-up: 'anything happen this week worth writing down?'" fires after the draft, so this week's material is available to next week's post and never to today's. This is a retention failure rather than a capability failure, and the honest comparison is two commands and roughly three minutes against four minutes of typing it himself, which still loses, because the engine's entire claim is that it is faster and better than the LinkedIn box and here it is neither.

**Fails when.** Thursday, 10:20am, straight out of a call where a prospect's ops lead said something Joseph will be quoting for a year. He has fifteen minutes. He writes it himself in four. It is the best post of his week and the engine had no part in it. Having written one by hand, he writes Friday's by hand too. The posts most likely to earn a skeptical senior reader's respect are the ones tied to something that just happened, and the engine will systematically not be involved in them, which is the evidence he uses in month three.

**Recommendation.** Do not amend §7a and do not add a prompt to the daily loop. Extend one command: `/content-engine post "<pasted raw material>"` drafts from the pasted text in the same run and, on accept, invokes the existing `/content-engine inventory` append path with `source: pasted` and the run slug. The same named writer, called from the post flow rather than the command line, so §7a's "Nothing else writes to a profile, ever" survives verbatim and only §8's description of `post` changes. §14's no-invention rule stays fully intact, because pasted text is a fact the human supplied, and the brief still names an item, one created this run. Two lines of doc change. Note the secondary benefit explicitly in §7: this is the most plausible way inventory actually grows, as a side effect of posting rather than as a scheduled chore, which is the only version of that habit anyone sustains past week four.

---

**L12-08 · minor · §3, §5, §7a, §8**
*Staleness flags fire forever because no command can clear them.*
Merges L6-06.

**Claim.** §3 flags any profile file whose `last_reviewed` is past 60 days, at every run start. Setup writes all seven files on day zero with the same date, so on day 61 they flag together. §7a then permits writes only from `/content-engine inventory` (inventory.md), `/content-engine review` (learnings.md), and explicit re-derivation (voice.md, thesis.md), leaving identity.md, audience.md, inspiration.md, and theme.json with no writer at all, and §8's once-per-person closes the re-run escape. Those four flag permanently and no action available to the user can clear them. The flag also fires for files the run does not load: §5 shows a short post reads five files, so theme.json nags a short post about a carousel theme. A warning that cannot be acted on is not a warning. The second-order cost is what makes this worth fixing: the same run-start channel carries "the inventory is thin" and the 400-line retirement offer, both load-bearing maintenance mechanisms with no other surface.

**Fails when.** Week ten and every week after, Joseph sees the same four to seven stale-file warnings, including one for theme.json which is irrelevant to a short post. He learns in about six runs to scroll past the warning block. In week fourteen the engine prints "inventory is thin" into that same block and he scrolls past that too. On day 140 Daybreak repositions and audience.md is genuinely wrong, and that warning renders in the same grey block he has been ignoring for eleven weeks.

**Recommendation.** Three edits to §3, no new command. (1) Drop `last_reviewed` from inspiration.md and theme.json entirely; neither decays on a calendar, because a creator you liked in February is still a creator you like and a hex code does not go stale. (2) Give the remaining files honest intervals rather than one global 60: identity 180, audience 120, voice 90, thesis 90, inventory 30. That encodes something true and staggers the flags. (3) Give `/content-engine review`, which already exists in §8 and already runs weekly per §11, a quarterly three-question confirm: "Still selling to supply chain leaders at $500M+ manufacturers? Still VP of GTM? Anything change about who you want reading this?" A confirmed answer stamps `last_reviewed`, which satisfies §7a's provenance rule properly because a human actually looked. Reject a writeback that stamps files a command merely read, since that marks content fresh because a command opened it, which is a lie about human review. Do not backdate initial `last_reviewed` values to stagger them, because that writes a false date into a provenance field on day zero in a document that spends all of §7a on which lines a human said. Then flag only files the current run loaded, and cap run-start output at one line, spending the reclaimed space on the runway number from L6-02.

---

## What no lens found until asked

Three areas that all twelve lenses walked past. These findings have not been through the refutation pass, so treat their severities as first-draft rather than tested. Two of the three areas are the kind that end a project rather than degrade it.

### Gap area 1: entitlement to publish

Every gate in this document checks how a draft sounds. Nothing checks what the person is allowed to say. There is no clearance field on the inventory schema, no consent concept for the third parties in the stories, and no check that a lifted sentence belongs to the author. A grep over the whole file returns zero occurrences of consent, confidential, permission, clearance, anonymize, redact, or NDA.

The reason this matters is that §14 guarantees everything factual in a post is real and traces to inventory.md, and §6.1 defines the ideal inventory item as an unpublished, unflattering, identifiable truth about a third party. Its worked example is "A planner at a $2B distributor kept a shadow spreadsheet for eighteen months because she did not trust the system, and nobody above her knew." The clause that makes that item valuable is "nobody above her knew." The engine's integrity rule is what creates the exposure, because fiction would be safe and the doc bans fiction. This fires four times a week under a real name with real credentials, on both personas. The blast radius is a customer escalation, an employment consequence, or a lawsuit, none of which a product change recovers. The document has the intuition and aims it at the wrong exit: §1.2's only nod to this whole domain is a .gitignore "so nobody pushes their inventory by accident," while the material's actual exit is the LinkedIn post the engine exists to produce.

---

**G1-01 · blocker · §7, §7a, §9, §12, §15**
*Inventory schema records where a fact came from, never whether it may leave.*

**Claim.** The §7 item has eight fields and all eight describe origin, content, linkage, or lifecycle. `source: interview | pasted | derived | proposed` answers who said this and never who may hear it, so an item captured under an implicit confidence is indistinguishable at draft time from a public credential. Every gate downstream is phonetic, since §9 checks structure, lexicon, and texture, so a draft that discloses something the author was not entitled to disclose passes every check the engine has and ships as a clean run.

**Fails when.** Joseph runs `/content-engine` with no args. The router selects `distributor-shadow-spreadsheet`: unused, past no lock, high tag overlap with thesis-2. The gate reports clean, because it is clean. He ships it unedited, which §12 scores as a win toward the 70% target. Friday morning the planner's VP at the distributor reads it, matches the eighteen-month detail to the person who owns that forecast, and asks her to explain the shadow spreadsheet in her Monday one-on-one. The item entered the engine with no permission attached because there is no field for permission.

**Recommendation.** Add two fields to the §7 schema, set once in the turn the item is written: `clearance: public | anonymized | do-not-publish` (required) and `guessable_count: <int>` (required when anonymized). Interview cost is one question per item, asked in the same turn §6.1 rule 1 already requires confirmation: "Could you say this on stage with that customer in the room?" and if no, "How many companies could someone guess this is?" Put `clearance` in the compact inventory index described in §4 item 9, not only in the hydrated item, so the router filters before angle-crossing spends tokens. Add one non-phonetic rule to §9: a draft is rejected, not rewritten, if it names a company, a person, a role-plus-employer-plus-timeframe triple, or a figure whose source item is not `public`, because rewriting a disclosure only produces a better-written disclosure, which is §3's own argument about the repurpose refusal. Close §15's "who reviews before publish" as "nobody; clearance is set at capture," and say why: a publish reviewer reads the finished draft, and the finished draft looks fine. Set the identified bar at `guessable_count <= 20` and label that a policy choice. What must be measured: the fraction of Joseph's real seed inventory that returns 20 or fewer, or `do-not-publish`, because if it is most of it, the supply arithmetic is worse than the 15-to-25 floor assumes.

---

**G1-02 · major · §7, §7a, §3**
*The only exit from active inventory is publication.*

**Claim.** §7's retirement rule requires an item to have been used, to be past its 60-day lock, and to carry a logged performance number before it can leave the active file, and §7a makes inventory.md append-only with no delete. An item the author regrets capturing cannot be removed without first publishing it, and until then it loads into every draft run. §3 and §7 also contradict each other on when it comes back: §7 says an item used inside 60 days is off limits while §3 says "Reusing an anchor item across formats is allowed," so under the permissive reading the item returns next week as a carousel.

**Fails when.** Three days after the VP's email, Joseph wants the distributor item gone. No command can do it: §8 offers eight commands and `/content-engine inventory` only appends. He cannot delete the line, and retirement only moves it to inventory-archive.md, which `/content-engine inventory` still reads. Nine days later he runs a carousel and, because §3 permits cross-format anchor reuse, the router offers the same item again, this time on the format with the highest engagement rate on the platform.

**Recommendation.** Grant `clearance` the same exception §7a already grants `superseded:`, as the one field that may be set on an existing entry after capture. Add a second retirement path to §7: an item marked `do-not-publish` retires to inventory-archive.md immediately, regardless of use or performance, and `/content-engine inventory` skips archived `do-not-publish` items when duplicate-checking rather than surfacing them. Resolve the §3 and §7 contradiction explicitly in §3: cross-format reuse of an anchor is allowed only after the lock, same as any other reuse. Name the supply consequence honestly, because this makes "the inventory is thin" fire sooner, and that is the correct behavior.

---

**G1-03 · major · §6.1, §6.2, §12, §13**
*The homework rule digs deepest exactly where NDAs are densest.*

**Claim.** §6.1's homework block makes disclosure depth a function of company size: if the company is large or well known, skip the surface questions and go straight to reporting lines, upstream and downstream handoffs, and what the boss is measured on. Company size correlates with contractual restriction, so the interview escalates precisely where the person has the least latitude, and the stop condition's 15-item floor adds quota pressure on top of it. Nothing anywhere in the interview asks what the person is contractually not allowed to say. §6.1 rule 1 warns only about invented details.

**Fails when.** §13 step 6, the portability test. The IBM mentor is 38 minutes in. §6.2 asks "Tell me about something that went badly" and she describes a client migration; rule 3 pushes for the number and she gives the client's per-unit cost figure. Both land in inventory.md as `type: failure` and `type: number` with `source: interview`. §12 records a pass, because she published something within 45 minutes with no help from Joseph. Thursday her comms lead sees the post. The test succeeded and the product failed.

**Recommendation.** Add one clause to the homework block, asked once before the raw-material section: "If the company was large enough that you skipped the basics, it is large enough to have a communications policy. Ask: is there anything about your work you are contractually not allowed to post publicly?" Record the answer in identity.md as `disclosure_posture: open | nda-default`, and have `nda-default` set the capture-time default for every item to `clearance: do-not-publish`, so the interviewer has to actively clear items during the interview, where the person is already talking and the marginal cost is one word, and the daily loop stays zero-ask. Mirror rule 1 with a rule 1b in the seed prompt: "A true detail that was never theirs to tell is the same defect as an invented one, pointed the other way." Cost is one question at setup, not per item.

---

**G1-04 · major · §11, §12, §8**
*The engine can perceive a weak post but never a harmful one.*

**Claim.** §11 defines the only feedback channel as an unsigned engagement score, and `/content-engine review` writes only learnings.md. There is no field, question, or file in which "this post produced a phone call I did not want" can be recorded, so a post that caused real damage is indistinguishable from a post that underperformed. §11 will then write a causal hypothesis blaming the hook pattern, and learnings.md is loaded at draft time, so the engine learns the wrong lesson from its own worst outcome.

**Fails when.** Joseph runs review. The post logged 6 comments (four from Daybreak employees), 31 reactions, and one DM from the customer's VP that the command has no field for. The score lands below his trailing-20 median, so §11 writes a hypothesis that the instance-first hook pattern underperforms, which is the wrong conclusion drawn from the right data about a post whose actual problem was that a reader recognised herself. Two months later the item clears its lock and the router offers it again.

**Recommendation.** Add one question to `/content-engine review`, which already exists and already writes: "Did any post this week produce a reply, DM, or call you did not want?" A yes writes `incident: <date>` on the run row in posts.csv and sets `clearance: do-not-publish` on that post's anchor item, triggering the immediate retirement path from G1-02. Suppress hypothesis generation for any post carrying `incident:`, because a post with an incident is not evidence about hook patterns. Add one line to the same command: check LinkedIn analytics for a content-flag notification on each shipped post and record it as `flagged: true`, because otherwise reader-triggered downranking is silently attributed to writing quality. Cost is one question per weekly review.

---

**G1-05 · minor · §3, §5, §6.2, §7a**
*Nothing checks a draft against the creators it was told to steal from.*

**Claim.** §3's verbatim lock diffs each draft against the last 20 shipped pieces, which is the author's own work only. §5 describes inspiration.md as what to steal, §6.2 fetches 3 to 5 of a named creator's real posts into the setup context, and §7a's source enum has no value that can represent another person's sentence, since `pasted` is defined as their own writing. There is no rule anywhere forbidding reproduction of a benchmark creator's line, and any proposal to load inspiration.md at draft time makes this strictly worse.

**Fails when.** Week twelve. The draft opens with a construction lifted almost intact from one of the four posts fetched at setup. §3's diff passes, because it compares only against Joseph's own last 20 pieces. That writer's followers overlap heavily with Joseph's target audience, which is why he chose her, so one of them quote-comments the original inside the window where most of the reach is decided, and the comment outperforms the post.

**Recommendation.** Do not add a corpus; delete one. Make §5's inspiration.md rule explicit: it stores extracted behaviours only, never source text, and the raw fetched posts are discarded at the end of setup and never enter a drafting context. That is free, it is what §6.2 already implies with "behaviors, not adjectives," and it removes a file rather than adding one. If anyone later decides to retain the source text, §3's existing 8-word check must run against it too, reusing the same routine, but the lazy version is not to keep the text. Also rename §5's comment from "what to steal" to "what to imitate," because the current word is the norm the engine is being taught.

---

**G1-06 · major · §6.1, §1.2, §5**
*The shipped interview's model of a good item is an unpublishable one.*

**Claim.** §1.2 ships reference/interview.md in the box, so §6.1's worked example is the single definition of quality every profile ever created will be calibrated against. That example is an unpublished, unflattering, identifiable fact about a named-adjacent third party, and the clause that makes it exemplary is the clause that makes it unpublishable. The engine is not accidentally producing risky inventory; the shipped seed prompt teaches interviewers to aim for it.

**Fails when.** Tim runs setup. The interviewer, following the shipped prompt verbatim, rejects each of his first answers as a category and holds up the shadow-spreadsheet paragraph as the target shape. Tim calibrates to it and produces 18 items of the same species: unflattering, specific, about people who did not know they were being observed. Nothing in the interview asks whether any of them can be said out loud, and §12's inventory-depth indicator counts all 18 as healthy supply.

**Recommendation.** Rewrite the worked example in the §6.1 seed prompt so it is both an instance and clearable, and put the clearance question in the same paragraph so the two standards are taught together. Keep the specificity, so the example is still a person, a number, and a timeframe, but make its subject the author or a party whose consent is obvious, and follow it with one line: "An instance you could not say on stage with that customer in the room is still an instance. Capture it, mark it `do-not-publish`, and keep going, because it shapes the thesis even when it never ships." That last clause matters, because it keeps the interview extracting at full depth while separating capture from entitlement. Which replacement example to use is taste. That the current one ships as the calibration target is not.

---

**G1-07 · major · §2, §8, §12, §14**
*Ghostwriting and the company page have no notion of who may speak as whom.*

**Claim.** §2 puts Fallon, Tim, and the Daybreak company page in scope and §8 gives Joseph `/content-engine as fallon` with no record anywhere of who is authorised to operate which profile or who is accountable for what it says. §12's zero-edit target is a leading indicator of voice fidelity when the operator owns the profile; on a ghostwritten or company profile it is a target for publishing text nobody with the relevant knowledge read closely. A company page repeating a customer anecdote is a vendor statement with a contract behind it, and the schema treats it identically to an individual's anecdote. §14's copy-paste rule is the only human checkpoint, and it is performed by whoever pastes rather than by whoever knows the constraint.

**Fails when.** Fallon is at a conference, so Joseph runs `as fallon` to keep her cadence alive. The router picks an item about a prospect call. Joseph, who was not on that call, cannot tell that the prospect asked her to keep the number between them; Fallon, following the engine's own zero-edit norm, pastes it as-is. Two weeks later the same anchor is crossed onto the Daybreak company page, where the identical sentence is the vendor publicly characterising a named-guessable account's internal process, and the MSA's confidentiality clause is what gets read in the escalation.

**Recommendation.** Three lines. In §7a: a profile carries `operators: [<handle>, ...]`, set at that person's own setup, and `as <handle>` refuses if the running user is not listed. This is a one-time list the profile owner writes about themselves, not a review step. In §12: the zero-edit percentage is tracked only for profiles where operator equals owner, and for ghostwritten profiles the tracked indicator is the owner's edit rate instead, because on those profiles a zero-edit ship is a warning sign. And set the company page's default to `clearance: public` only, so the page may draw solely on items the source person marked public, since an anonymised anecdote told by an individual and the same anecdote told by the vendor are not the same disclosure.

---

### Gap area 2: no representation of a bad outcome

Every feedback channel is unsigned magnitude, §11's scoring weights the signal a pile-on produces most heavily, and no command, field, or state can withdraw a fact or a post after it goes wrong.

The two loops the PRD is proudest of cannot tell a post that traveled from a post that backfired. §11 scores `comments x 3 + reposts x 2 + reactions x 1`, and a backlash is comments and quote-reposts, which are the 3x and 2x terms. A post that gets Joseph in trouble is the highest-scoring post of the quarter, clears §11's 2x clause on its own, and writes a hypothesis naming its hook pattern and inventory type as the thing that works. The consolidated resolution to load only `confirmed` entries at draft time does not help, because this pattern reproduces and therefore confirms. Meanwhile §7a's correction mechanism contradicts itself in a single sentence and no command in §8 can retract anything. The person's worst day becomes the engine's strongest prior, and the fact that caused it stays in the draft-time load.

---

**G2-01 · blocker · §11, §7, §5**
*engagement_score cannot distinguish a post that traveled from one that backfired.*

**Claim.** Every feedback channel is unsigned magnitude. §11's score is maximized by the exact composition of a pile-on, and §7's item schema records `performance: 4200 impressions`, a number identical whether those impressions came from people forwarding admiringly or from people arguing. Tracing a bad post through §5's run directory (brief, draft, gate-report, slides, final, no status field), §7's schema, §11's score, and §12's indicators, not one field differs from a good post of the same reach.

**Fails when.** Joseph ships the post built on the shadow-spreadsheet item, the PRD's own flagship example of a good instance. It draws 140 comments, most arguing he threw a customer's employee under the bus, two from people at that distributor, and a dozen critical quote-reposts. On Sunday he runs review. Against roughly 3,100 followers this posts the highest engagement score in his trailing 20 by a wide margin, and it is written to posts.csv and to the item's `performance:` field as his best result of the quarter.

**Recommendation.** One sign bit, entered where the human is already sitting. Add a `run_again` column to posts.csv taking `+` or `-`, meaning would you publish this again, collected by the weekly review prompt that already asks for three numbers per post. Simultaneously delete `performance:` from the §7 item schema and join performance to the item on an `inventory_item` column in posts.csv instead, since that field is a write to an existing inventory line and already violates §7's append-only rule, so removing it fixes two defects with one deletion. Every consumer of engagement_score in §11 reads posts.csv and filters `run_again != '-'`. What must be measured: across Joseph's first 40 posts, the correlation between engagement_score and his own plus-minus judgment, computed specifically within the top decile of engagement_score. If it is weak or negative there, the 3x comment term is not a measurement instrument and must be re-derived from posts he would run again.

---

**G2-02 · blocker · §11**
*The 2x-outlier clause turns the worst post into a confirmed learning.*

**Claim.** §11 admits a single post as a finding when it beats the trailing-20 median by 2x, and a backlash post clears that bar on its own, because that is what a backlash is. The hypothesis writer then names the hook pattern and inventory item type as the candidate cause, and the confirm-or-kill test runs on the same unsigned score, so the pattern confirms as soon as a second post produces a second argument. Loading only confirmed entries at draft time is not a defense here; it is the delivery mechanism.

**Fails when.** The review run fires the 2x clause on the backlash post and appends a hypothesis crediting its hook pattern and `type: failure` inventory. A month later a second post using the same accusatory hook draws another argument and the hypothesis flips to confirmed. From that Sunday forward it is loaded at draft time as established guidance, and by February the engine opens with that hook by default and preferentially selects `type: failure` items, correct by its own arithmetic and steering Joseph back toward the thing that got him in trouble.

**Recommendation.** Two clauses in §11. First: posts marked `-` are excluded from the trailing-20 median, from the 2x single-post clause, and from hypothesis generation entirely, so they are logged rather than learned from. Second: a hypothesis can only be marked confirmed if every post supporting it carries `+`, and a single `-` among its supporting posts marks it killed regardless of score. No new human input beyond G2-01's character. A third line of defense that costs nothing: require the 2x clause to also see `run_again: +` on the outlier itself before it may write a hypothesis at all.

---

**G2-03 · blocker · §8, §7, §7a, §5, §14**
*Nothing in the engine can withdraw a fact or a post.*

**Claim.** There is no retraction path anywhere in the document. §8's eight commands can create, draft, switch, append, and log; none can remove, correct, or kill. §7a forecloses adding one informally. §5's run directory has no status, so a post deleted from LinkedIn leaves the repo byte-identical to a post still live and doing well. Worst of all, §7's retirement gate creates a permanent deadlock: an item discovered to be false but never used can never become eligible to leave inventory.md, and §14 makes inventory.md the sole source of every fact the engine publishes. A grep of all 498 lines returns zero matches for withdraw, retract, or a run status field.

**Fails when.** Joseph realises the "31% forecast error" number he gave in the setup interview belonged to a different account than the one he attributed it to. The item has never been used in a post. It is therefore permanently ineligible for retirement, permanently inside the Active set, and permanently readable by every draft run. Six weeks later the engine proposes five angles, three built on that number, and Joseph, far removed from the correction and looking at a clean angle list, ships one. §14's never-invent-a-fact guarantee was satisfied in full: the engine did not invent it, it faithfully republished a lie it had no mechanism to drop.

**Recommendation.** Add exactly one command to §8: `/content-engine retract <run-slug|item-id>`. It appends `withdrawn: <date> <reason>` to the named inventory item, permanently excludes that item from the draft-time load regardless of §7's Active window and regardless of the retirement gate, and writes a one-line `WITHDRAWN <date> <reason>` file into the run directory so §5 finally has a state a bad post can be in. Amend §7's retirement rule to read "Unused items never retire unless withdrawn." Add the command to §7a's write list. This is a command you hope never to run; it costs nothing on any day you do not need it and the daily loop is untouched. Price of not having it: Joseph's only remedy is hand-editing inventory.md, which §3 and §7a both spend paragraphs prohibiting.

---

**G2-04 · major · §7a, §7**
*§7a's correction rule rewrites the line the preceding sentence forbids rewriting.*

**Claim.** The correction mechanism contradicts itself inside a single sentence: it sits under the heading "Append, never rewrite" and instructs the engine to mark an existing entry, which is a rewrite of that entry. Separately, the document never states what `superseded:` actually does. §7's Active rule defines the draft-time load as "unused items plus anything used in the last 180 days" and says nothing about superseded items, so the corrected-away entry keeps loading alongside its replacement.

**Fails when.** Joseph tells Claude Code to correct the forecast-error item. It hits the contradiction and takes one of two branches, both bad. Branch A honours "never rewrite an entry" and appends only the corrected item, leaving the false one unmarked and indistinguishable. Branch B edits the old line and violates the rule two sentences above. Either way the next draft run loads both entries, and it picks the false one, because that is the entry carrying `connects_to: [thesis-2]` and the tags the angle generator matched on.

**Recommendation.** Specify the superseding-entry format so nothing ever touches an existing line: the new entry carries `supersedes: <old-id>`, resolved at load time. Add one sentence to §7's Active definition: "An item named by any entry's `supersedes:` is excluded from the draft-time load." Delete "and marking the old `superseded: <date>`" from §7a. This is strictly less work for both human and engine than the current instruction, because appending is easier than locating and editing an old line, and it removes one of the three append-only self-contradictions in the document, the others being `used:` and `performance:`.

---

**G2-05 · major · §12**
*All five leading indicators move up on Joseph's worst post.*

**Claim.** §12 lists five leading indicators the engine controls and not one can move down when a post goes badly. Posts shipped goes up. Median engagement rate versus the trailing-20 baseline goes up, because §11's score is unsigned. Inventory depth is unaffected. Gate catch rate is unaffected, because the post passed the gate. And the zero-human-edits percentage goes up, which is the worst of the five, because the engine pays Joseph more for not having touched the draft he should have killed, and §12 labels that number the truest read on whether the voice is right.

**Fails when.** After the worst professional week of his year, Joseph opens the weekly numbers. Four posts shipped, 75% zero-edit, median engagement rate up sharply against his trailing 20, inventory at 19 unused items, gate catches down. Every indicator green. The dashboard tells him the engine had its best week, and the only person in the loop who knows otherwise has nowhere to record it.

**Recommendation.** Two edits to §12, both free once G2-01 and G2-03 exist. Change the zero-edit metric's denominator from all shipped posts to posts marked `+`, because the metric is meant to measure voice fidelity and a post he regrets is not evidence the voice was right. Add one indicator that can only move down: "Retractions per quarter (target: 0)," counted directly from `withdrawn:` lines, which the retract command already produces as a byproduct. No new collection, no new form, no new human step.

---

**G2-06 · major · §12, §11**
*Month-one impressions ramp is arithmetically a quota for controversy.*

**Claim.** §12's ramp and §11's unsigned score point the same direction, and the ramp is steep enough that the only reliably available lever is the one the score already over-rewards. A 1.4k-follower account posting 4 times a week does not reach 5k impressions a week in month one from in-network distribution; hitting it requires a large out-of-network multiplier on essentially every post, and the cheapest reliable source of that multiplier is an argument.

**Fails when.** End of week three. At the widely cited 8 to 12% of-followers reach rate, which is a C-tier secondary-sourced number and is flagged as such rather than asserted, 1.4k followers yields roughly 110 to 170 in-network impressions per post, so 4 posts a week lands near 450 to 680 weekly impressions before any out-of-network lift. Against a 5k month-one target that is roughly a 7x to 11x shortfall, and the ramp is the thing Joseph is told to judge the engine against. He does the obvious thing a person does when a number is that far off and the scoreboard pays 3x for comments: he picks sharper items and harder hooks. §11 then confirms he was right to.

**Recommendation.** Do not commit to the month-one number in the document. Replace "5k/wk in month 1" with: "Month 1 target = measured. Take Joseph's actual median impressions-per-post across his first 8 shipped posts from the LinkedIn analytics export, multiply by 4, and set the month-1 ramp from that; re-derive month 3 and month 5 from the same base." One line in §12 and eight posts of waiting, and it is the only honest way to set it, because the reach figure circulating in 2026 is single-source and secondary and Joseph's own export will be better data than anything published. Also state plainly in §12 that 1.4k to 20k is not reachable from posting alone at this cadence under current conditions, so missing it reads as a goal-setting error rather than an engine failure to be compensated for with sharper content.

---

**G2-07 · major · §9, §6.2, §5**
*"The list only grows" makes a wrong gate rule unremovable.*

**Claim.** The append-only-with-no-retraction pattern extends past inventory into the gate, and there it does active harm. §9 commits the tell list to monotone growth with no removal path. Worse, ai-tells.md lives in `reference/`, not in a profile, so it is one shared list governing Joseph, Fallon, Tim, the company page, and every outside user of the repo, ratcheting in one direction for all of them.

**Fails when.** The gate strips every dash from Joseph's draft and the rewrite fuses the clauses. Two weeks later Jane, the IBM mentor running §12's portability test, watches the same thing happen to writing that has used dashes for twenty years. Her only remedy is hand-editing a shared reference file that also governs three Daybreak profiles, after §1.3 promised no config file is ever hand-edited.

**Recommendation.** Delete "The list only grows" and replace with: "Entries may be retired by appending `retired: <date> <reason>` to the entry; retired entries are skipped by the gate and kept for the record." Add "dash and semicolon rate per 100 words" to the §6.2 voice-sample extraction list, which already extracts sentence length and variance, fragments, contractions, profanity, and questions, so a per-profile override has a measured basis when one is warranted. Note the disagreement recorded in the contradictions section: this review keeps em dash at zero tolerance regardless, because the threat model is a human reader rather than a classifier, and the corpus evidence offered for relaxing it is unverified under §14's own rule. What must be measured before any relaxation: Joseph's and Jane's actual dash rate per 100 words from their own voice samples, which neither this review nor the PRD has.

---

### Gap area 3: the analytics loop's data-acquisition risk

Weekly Apify scraping of four owned LinkedIn accounts plus benchmark creators, with no stated authentication model, puts the exact asset the product exists to build at risk of restriction. §14's own unverified-claim rule was applied to cost and to the impressions export and not to this.

§12's outcome goal is 1.4k to 20k followers with a ramp to 40k impressions a week by month 5. §11 proposes reaching that goal by running a weekly automated scrape against a platform whose user agreement prohibits scraping and which enforces with account restriction. If the actor authenticates with a session cookie from one of these accounts, which is the common implementation and which the doc does not say, then the measurement system's failure mode is losing the thing being measured, permanently, mid-ramp. Nobody looked at this: the platform lens examined reach mechanics, the measurement lenses examined joins and thresholds, and the portability lens examined Playwright and git. The word Apify appears in the lens findings only inside a proposed fix.

---

**G3-01 · blocker · §11, §14, §13**
*§11 never names the LinkedIn identity the weekly scrape authenticates as.*

**Claim.** §11 specifies volume, cadence, vendor, cost posture, join key, and scoring for the weekly scrape, and never states which LinkedIn identity it runs as. That is the only variable that determines whether the loop can cost Joseph the account the loop exists to measure. Because §14 says "Untagged claims are asserted as verified," the document currently asserts, as verified, that this is safe, while carrying a tag on the actor that asks only what it costs. A grep over all 498 lines returns zero occurrences of cookie, li_at, session, authenticate, login, proxy, rate limit, restrict, or terms of service.

**Fails when.** Month five of the §12 ramp, the week the plan calls for 40k impressions. Joseph configures the actor for the first weekly run and its input schema has a required `li_at` field, because that is what most LinkedIn actors take. He pastes the cookie from the browser he is logged into, which is his own account, because it is the only session he has. The run walks four owned profiles and ten benchmark creators' recent post histories inside a few minutes from a datacenter IP. LinkedIn restricts the authenticating account. His profile goes dark at 1.4k-plus followers with 20 weeks of posts behind it, and every mechanism keyed to posts.csv goes inert in the same minute. There is no fallback, because §11's other source is itself tagged UNVERIFIED.

**Recommendation.** Add a third tag to §11, same scope language as the existing impressions tag: "[UNVERIFIED 2026-08-17, owner Joseph] Before building §11: (a) does the chosen actor require a LinkedIn session cookie or does it read public pages unauthenticated, read from the actor's own input schema rather than its marketing page; (b) if it requires one, whose account supplies it; (c) what LinkedIn's current enforcement behavior is against datacenter-IP authenticated profile fetches at this volume. Blocking for §13 step 7, not for MVP." Then bind the answer to a decision in the same paragraph: if the answer to (a) is yes, the feature is cut rather than moved to a burner account, because a fresh low-connection account both sees less of the target profile, so the data differs from what an owner-run would return, and is the account most likely to trip commercial-use limits and new-account throttling. No user-visible friction; this is three sentences and a tag in a section already out of MVP.

---

**G3-02 · major · §11, §8, §1.3**
*Owned-account scraping buys minutes; benchmark scraping has no named consumer.*

**Claim.** Compute what the scrape actually buys. For owned accounts it buys reactions, comments, and reposts, three numbers plus follower count that the post owner reads off his own post, and explicitly not impressions. For benchmark creators, the detectable half, §11 names no downstream consumer at all: the word benchmark appears in exactly two lines of the document, both acquisition sentences, and in none of the Score, Learning threshold, The why, or review-rollup paragraphs. Six of the seven row-metadata columns cannot exist for another person's post, and §11's only defined computation is normalized within one account, which is confounded across accounts. So the account risk in G3-01 is being taken almost entirely for data nothing in the document reads. Separately, an Apify account, a paid actor, and a LinkedIn credential are three things §1.3 says the user never has to set up.

**Fails when.** Week 20-something. Joseph opens learnings.md expecting the benchmark data to tell him which hook patterns travel, and finds it cannot: the benchmark rows have null in hook pattern, inventory item, thesis, angle type, and structural job, so they enter no hypothesis, and their score is not comparable to his because they sit at 30k to 80k followers. He has been running an authenticated weekly scrape of ten strangers' profiles for a month and the only thing it produced is fourteen extra rows nothing reads. Separately, the IBM mentor cannot run `/content-engine review` as §11 describes it without opening an Apify account.

**Recommendation.** Delete owned-account scraping from §11 outright. Owned numbers come from the human typing reactions, comments, reposts, and follower count at review time: at 4 posts a week for Joseph that is 16 values a week, and even at all four accounts posting 4 a week it is 64. The one thing the scrape genuinely bought that typing does not is consistent measurement age, which matters because §11's trigger is a 2x comparison against a trailing median. Buy that with a schema field instead of a scraper: add a `measured_at_days` column to posts.csv and have review accept numbers only for posts at 7 plus or minus 1 days old, deferring younger posts to next week. Downgrade benchmark creators from a weekly bulk scrape to a paste: at review time Joseph pastes 1 to 3 post URLs he thought were good, and the engine records the hook pattern and format by reading the text. This is a deletion that removes a vendor dependency, an account, a credential, and a §1.3 violation, and makes the loop cheaper and portable at the same time.

---

**G3-03 · major · §11**
*§11's degradation order is priced in dollars and silent on account risk.*

**Claim.** §11 states a degradation order and keys it entirely to cost. It happens to arrive at the right first cut, since bulk fetching other people's profiles is the more detectable pattern, but for a reason that has nothing to do with safety, so it gives no guidance when the pressure is risk rather than money. Its second clause, "never your own accounts," is backwards under risk: the owned accounts are the irreplaceable asset and the benchmark data is the disposable one.

**Fails when.** The week after the first restriction warning. Joseph gets LinkedIn's automated notice on Fallon's profile after the Sunday run and reads §11 for what to do. The only degradation rule in the document is triggered by cost, and cost is fine, so the rule does not fire. The clause that does apply instructs him to keep scraping the four owned profiles, which is the exact behavior that produced the warning. He follows the document and loses the second account the following Sunday.

**Recommendation.** Replace the sentence with a risk-keyed order and a stated fallback: "Degradation is keyed to account risk, not cost. Owned-account numbers never come from a scrape; they come from the four numbers typed at `/content-engine review`. Benchmark creators are a nice-to-have and are the first thing cut: cut them on any LinkedIn warning, any actor error indicating throttling, or permanently if the chosen actor requires a session cookie. Cost is not a constraint at this volume and is not the trigger." Two sentences become three, and it deletes a subsystem rather than adding one.

---

**G3-04 · major · §14, §11**
*§14 forbids auto-posting but permits automated reading as the same account.*

**Claim.** §14's first hard rule keeps automation off the LinkedIn write surface. The document has the right principle and applied it asymmetrically: it never extends it to the read surface, which is the side LinkedIn enforces against with account restriction rather than with a content penalty. An automated weekly read authenticated as Joseph is the same category of act as an auto-post, the machine operating LinkedIn as him, and it carries the larger downside. There is no read-side counterpart anywhere in §14's eight rules, and §11 proposes exactly the act the missing rule would forbid.

**Fails when.** A future Claude Code session is asked to make the review command faster, reads §14 top to bottom for the constraints it must respect, finds a rule prohibiting automated writes and nothing prohibiting automated reads, and wires the Apify actor into `/content-engine review` with Joseph's cookie in a local env file so the command runs unattended. Nothing in the document told it not to. The rule that would have stopped it is one line long and does not exist.

**Recommendation.** Add as the second bullet of §14, in the same register as "No auto-post": "**No automated collection as a publishing identity.** No scraper, actor, extension, or script ever authenticates to LinkedIn as an account this engine writes posts for. Reading is copy-paste too." One line, no user-visible friction, and it forecloses the failure permanently rather than relying on whoever builds §13 step 7 remembering the reasoning.

---

**G3-05 · blocker · §6.2, §12, §13, §1.3**
*§6.2's inspiration fetch is the same unspecified LinkedIn scrape, inside MVP setup.*

**Claim.** The identical defect, an unspecified LinkedIn data acquisition with no stated authentication model, already sits in MVP, four months earlier than §11. §6.2 instructs setup to "fetch 3 to 5 of that person's posts" from LinkedIn. That is §13 step 1, it runs on the IBM mentor's machine at §13 step 6, and it is inside §12's 45-minute portability test. Note the contrast the document itself supplies: the Visual section of the same subsection knew to write a fallback for a failed external lookup, and the LinkedIn fetch three paragraphs above it has none.

**Fails when.** §13 step 6. The mentor reaches the Inspiration section twenty minutes in and names three creators she reads. The engine tries to fetch their posts and gets an auth wall, because she is not logged in inside the tool and the document specified no other path. She has no writing samples of her own either, which is the case §6.2 says to cover by leaning harder on inspiration.md, the file that just failed to populate. Either she is asked for a LinkedIn credential inside the first half hour of using a stranger's tool, which she will not give and §1.3 forbids, or she gets an empty inspiration.md and a voice profile with nothing under it. The 45-minute test fails at minute 20 for a reason §11's risk review never looked at, because §11 is post-MVP and this is step 1.

**Recommendation.** Change §6.2's Inspiration method from fetch to paste, and give it the fallback the Visual paragraph already has: "Ask them to paste 3 to 5 posts from that creator, the text, not the URL. If they paste URLs and a public fetch works, fine; if it does not, ask for the text and do not block on it. Never authenticate to LinkedIn to retrieve them." This reduces friction rather than adding it, because pasting three posts takes under a minute and is more reliable than any fetch, and it removes a hard external dependency from the one path §12 measures with a stopwatch. It also matches §1.3's promise that setup adds nothing but answers.

---

**G3-06 · major · §1.2, §5, §11**
*The .gitignore excludes profiles but not the scrape's only output file.*

**Claim.** §1.2 ships a .gitignore scoped to `profiles/*`. §5's layout puts `analytics/posts.csv` at the repo root, outside that path. So the single file the Apify loop writes, containing four colleagues' post-level engagement and ten-plus third-party creators' scraped post data, is the one data file in the repo that is tracked and pushed. The queued §5 revision would fix this as a side effect, and it is explicitly not yet applied.

**Fails when.** Joseph pushes the engine repo to share setup improvements with the IBM mentor, three weeks after the analytics loop started running. `analytics/posts.csv` goes with it, carrying Fallon's and Tim's per-post engagement, the Daybreak page's numbers, and ten named creators' scraped metrics with URLs. The one thing the .gitignore was written to prevent happened to the adjacent file, because the ignore rule was scoped to a directory the analytics loop does not write to. Nobody notices, because `git status` shows clean.

**Recommendation.** Two options, both one line. Preferred: apply the queued §5 move now so analytics lives at `profiles/<handle>/analytics/posts.csv`, which also un-breaks §1.3's write constraint and §12's corollary check. If the move stays queued, amend §1.2's .gitignore line to read "excluding `profiles/*` except `_template/`, plus `analytics/` and `runs/`."

---

**G3-07 · major · §11, §13**
*§11's two unverified tags have no ordering, and the impressions answer gates the actor decision.*

**Claim.** §11 carries two UNVERIFIED tags and states no order between them, but the answer to the second determines whether the first matters. If a personal profile cannot export post-level impressions, §11's source 2 is fiction, the entire measurement plan rests on the scrape, and the account risk in G3-01 becomes unavoidable rather than optional. Answering the actor-cost question first tells you nothing you need; answering the impressions question first can eliminate the actor question entirely. §11 also opens by declaring impressions optional, which is only true while source 2 exists.

**Fails when.** Joseph sits down to unblock §13 step 7 and works the tags in the order they appear, which puts the actor first. He spends the session comparing actors and pinning a per-run cost, commits to one, and later discovers that the LinkedIn analytics export he assumed exists is Company-Page-only or has no post-level impressions column. He now has an actor selected on price for a job whose scope quietly doubled, and the selection criterion he used was dollars per run rather than whether it needs his session cookie.

**Recommendation.** Number the tags and state the dependency in §11: "Answer tag 2 (impressions export) first. If a personal profile cannot export post-level impressions, §11 has one data source, not two, and the actor question in tag 1 becomes a risk decision rather than a cost decision. Re-read the degradation order before choosing." Three things to establish, none requiring a build: whether the post-level impressions CSV export exists for a personal profile at all, and what date range and columns one export covers; the chosen actor's authentication requirement, read from its own input schema; and the number of profile fetches one weekly run performs at Joseph's actual benchmark-creator list length. All three are lookups, and all three should be answered before a line of §13 step 7 is written.

---

## Where the PRD is right

Not a courtesy section. Several findings died in refutation specifically because the document had already handled the thing, and a few of the mechanisms below are better than anything the incumbents ship. None of this should be touched while the fixes above are applied.

**§1.1, one skill and one router.** The decision is correct and the argument for it is the right argument. The primary justification is drift, not bypass: "Four separately installed skills would be four copies of the gate, the inventory locks, and the run log, and they would drift." Consolidation solves that completely. A lens attacked this as closing the wrong door and the attack failed on the text, because §1.1 never claims the router prevents ad-hoc requests. Only the final sentence needs amending, because "The router owns the pipeline or the non-negotiables in §3 are unenforceable" implies a false converse.

**§1.1's render input contract.** "`render/` sits behind one documented input contract: it takes slide HTML plus a profile's `theme.json` and returns files." That keeps the Playwright dependency off the writing path, which is exactly why the `node: command not found` failure cannot occur on the path §1.3 actually tests. The present-tense justification is sufficient on its own; only the speculative clause about lifting out a standalone visual engine should go.

**§1.3's write constraint.** "Every run writes into `profiles/<handle>/` and nowhere else. Not just setup." This is the right invariant and it is stated as a run-level rather than a setup-level rule, which is the harder and better version. It is also correct that this is a write constraint, which is why a sibling-profile read is already legal and only needs specifying in the load order. The §7a conflict is a scoping omission, not a wrong rule.

**"Nothing fictional ships."** §1.2's reasoning is exactly right and the counterargument does not survive: "a fake item sitting in the repo is a fact waiting to leak into a real draft." A proposed `examples/` directory with a sample inventory was rejected on the PRD's own grounds, because the real leak is a human twenty minutes into an interview reaching for the example rather than answering the question, and a read-path guard does not stop a copy-paste. The worked example already ships in the one place where it teaches without being loadable as fact, inside §6.1's philosophy block.

**§6.1, the interviewer.** The strongest section in the document. "You get past it by refusing to accept a category when an instance exists" is the correct diagnosis of why content tools produce adjectives. The propose-and-be-corrected loop on thesis is right, and §6.2 says why: "Do not ask them to state their thesis cold. People are bad at that." Rule 5, recording "I don't know" as a named gap rather than papering over it, is the best unused asset in the document, and the replenishment fix depends on it. Rule 6, not complimenting the answers, is a detail almost nobody gets right. And the field-traceability rule, "Every question you ask traces to a field in one of them. If a question fills no field, cut it," was used in this review to reject a proposed schema addition.

**§6.1 rule 1's stated reason.** "A detail you invent here becomes a lie on their LinkedIn six weeks from now." This is the sentence that makes the whole provenance model legible, and it is why L1-03 and L7-03 are blockers: both are that rule being defeated through a channel it does not defend.

**§6.2's no-samples branch.** "If they have no writing samples, say so in voice.md explicitly and rely more heavily on inspiration.md until they've shipped 10 posts, then re-derive voice from what performed." A recovery path exists and is per-person by construction, which is what killed a proposal to refuse drafting and a proposal to seed voice from a shared register. Slow, but not nothing.

**§6.2's palette fallback.** "If lookup fails, or they are building a personal brand with no company behind it, ask for one color directly." One of two places in the document that writes a fallback for a failed external lookup. The Inspiration fetch three paragraphs above should be held to the same standard, which is precisely the gap G3-05 names.

**§7's load-cap reasoning.** "A 40,000 token inventory fits inside Opus and still makes every draft worse, because the model's attention spreads across a hundred items when the draft needs five. So the cap goes on what a run loads, not on what the file stores." This is right, it is unusual, and it was used in this review to reject two proposed archive systems and a load cap on learnings.md. §7 then contradicts itself with the 400-line trigger, which is why the trigger is the thing to delete rather than the principle.

**§7's replenishment mechanism existing at all.** "After each run, offer a two-minute top-up." Several findings claimed nothing replenishes inventory and were downgraded because this exists. Its placement is wrong and its priming is absent, and the mechanism itself is the right shape.

**§7's escape hatch being defined.** "The engine picks another or says the inventory is thin and runs a top-up interview." Deadlock claims were downgraded to degradation claims because the PRD specifies the degraded path. The behavior is defined; what is missing is the arithmetic that says how often it will fire.

**§7a's re-derivation rule.** "It happens only on request, the engine shows a line diff, and it does not write until you accept." This is the exact mechanism that prevents silent voice drift being written back as the person's voice, and it killed a finding that claimed the opposite. The same accept step is the right place to surface orphaned `connects_to` references.

**§3's repurpose refusal.** "The engine returns three alternate angles read off live inventory state rather than a bare refusal. A thin repurpose is a bad idea, and rewriting a bad idea only produces a well-written bad idea." This is the one refusal path in the document that defines what the user gets back, and it is the model every other refusal should copy. The second sentence is also the correct argument against the gate patching eleven violations instead of redrafting, which §9 never applies to itself.

**§3's cross-format rule.** "Reusing an anchor item across formats is allowed. Reusing the job is not." The structural-job concept is a genuinely good idea and it is the right axis for cross-format repetition. It needs definitions and one contradiction resolved, not replacement.

**§9's aim.** The Structural block is where §9's weight sits, and it is aimed correctly: antithesis, the one-word rhetorical paragraph, "I've been thinking a lot about," the restating closer, "Thoughts?". Those are the loudest tells on the platform and they are all specified. §9 also already contains the guard against the flattening its critics predict: "Uniform sentence length. Real writing has high variance. Flag if stdev of sentence length is low." What it lacks is a threshold, not the insight.

**§9's diff requirement.** "catch, rewrite, then show a diff of what changed and why. Do not just flag it and hand it back." Every rewrite is visible by design, which is what downgraded a claim that the gate is silently destructive, and the diff carries the before-text of every changed span, which is what makes the pre-gate draft recoverable. gate-report.md per run is the audit trail on the one component that edits the human without being asked, and it should be kept.

**§10, refusing Canva and Figma.** "Template-driven output looks like everyone else's output, which is the visual version of the em dash." Correct on the merits and correct on portability. The counterargument that hook patterns are the language version of the same problem does not hold, because a hook pattern is filled with the person's own material and re-voiced, while a template constrains the finished artifact.

**§10's carousel structure.** "Slide 1 is the hook and it must stand alone... Final slide is a takeaway, not a CTA." The last clause is the document's actual posture on selling, and it is right. A finding that assumed a conversion requirement was downgraded because of it.

**§11's rejection of impressions.** "Impressions are not required... relative comparison within one person's own posts carries enough signal to learn from." This is a deliberate scope kill with a stated reason, and one lens independently reached the same conclusion and then filed the PRD's own position as a defect. Better than the incumbents.

**§11's hypothesis discipline.** Writing a hypothesis rather than a conclusion, tagging it as such, naming the specific candidate difference, and then: "Hypotheses are marked `confirmed` or `killed` as later posts land. Nothing is treated as established until it has survived a second round." Plus the 5-posts-on-each-side floor, and the explicit rationale that "Ten reactions versus sixteen is inside normal run-to-run variance." That is more measurement hygiene than most production analytics systems have. It needs a test statistic and a kill criterion, and the frame is right.

**§11's exploration budget and anti-collapse guardrail.** "Do not let learnings.md collapse the engine into one repeated format. Cap it at directional guidance and keep an explicit exploration budget, one post in five that ignores the learnings." This is a held-out arm, specified in the doc, and it killed a finding titled "no held-out variable exists." It needs a column so it can be used as evidence, not a redesign.

**§12's separation of outcome goals from leading indicators.** "Outcome goals, tracked but not optimizable by the engine" against "Leading indicators the engine actually controls." That is correct PRD practice and it defeated a finding claiming Joseph would have no way to tell whether the engine was working. §12 also does the arithmetic on itself in public: "1M in 6 months is roughly 40k impressions a week sustained. At 1.4k followers that is not reachable in month one."

**§13 step 4 gating step 5.** "Ship 10 posts manually. Tune voice against what Joseph actually edits before building anything else." The most disciplined line in the build order, and it is the reason several findings about the render pipeline are minor rather than major. It also supplies, for free, the hand-written wall-clock baseline that L8-06 needs.

**§4's instruction to log tokens from run one.** The instinct is right and it is unusual: "'Pro-viable' should be a measured number in `posts.csv` within two weeks rather than an assumption." The instrument cannot read, which is why the measurement should move to `/cost`, and the intent to falsify rather than assume is exactly correct and should survive the fix.

**§14's "No auto-post. Output is copy-paste."** Right on platform grounds and load-bearing beyond that. Two proposed new rules were rejected as redundant with it, and it is the reason the human is already the final composition check on every carousel. Its one asymmetry, silence on the read surface, is G3-04.

**§14's UNVERIFIED convention, and §11 actually using it.** "Any factual claim in this doc not checked against a live source gets `[UNVERIFIED <date>, owner <name>]`. Untagged claims are asserted as verified." This rule was used repeatedly in this review to reject findings whose evidence was asserted rather than sourced, including findings that were arguing for changes to the gate. A document that ships its own epistemic standard, and then meets it in the section with the most external dependencies, is rare. Apply it to the remaining untagged numbers in §4 and to §6.2's fetch, and the standard holds throughout.

**The revision notes and the queued block.** Listing what changed, and separately listing what is decided but not yet applied, made this review substantially more accurate: at least four findings were downgraded because the fix was already scheduled and visible. Keep doing that, and apply the §5 and §14 items in the queue before the first run, because two of them are load-bearing for defects above.
