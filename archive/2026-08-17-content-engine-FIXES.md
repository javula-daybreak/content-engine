# Content Engine: what to change, in what order

**Companion to `content-engine-REVIEW.md`. Read that one for evidence, this one for action.**

This file is the decision record. Every item traces to a finding id in the review, so any recommendation here can be argued with by reading the case behind it. Where two lenses recommended incompatible fixes, this file picks one and says why; those calls are not reopened in section 6. Section 6 holds only what genuinely belongs to Joseph: taste, risk appetite, scope, and audience. Nothing here is a summary of the review, and nothing in the review is a plan.

Use it in this order: apply section 2 to the PRD before writing a line of code, build to section 3, hold section 4 as the definition of done for each step, and read section 5 before adding anything that is not on this list.

---

## 2. Fix now, before any code

Fifty-one edits to the PRD. Most are one line. They are grouped by what they touch, not by severity, because they will be applied in one editing pass.

The reason all of these come before implementation is the same reason in every case: each one either changes a file schema, changes what a run is allowed to write, or changes the order things get built. Guessing wrong on any of them means migrating Joseph's inventory, Fallon's inventory, and Tim's inventory later, or rebuilding a mechanism against a different source of truth.

### A. State and locks

The single highest-leverage change in this document is A1 through A4. §4 names the repetition guard as one of three things that make this beat a ChatGPT prompt, and as written it has no legal place to store its state.

**FIX-01. Delete `used:` and `performance:` from the §7 inventory schema.**
Now: the schema carries `used: 2026-08-14` and `performance: 4200 impressions`.
Becomes: neither field exists. The entry ends at `source:`.
Why: §7a says "A draft run reads profiles and never modifies them," §14 repeats it as a hard rule, and §7a's append-only rule forbids stamping a field onto an existing entry. Three separate rules make these two fields unwritable, and no command in §8 writes them. They are denormalized copies of data the run log already holds. (L12-06, L4-01, L6-01, L8-01, L9-06, L10-05)

**FIX-02. brief.md carries the lock state.**
Now: §5 describes brief.md as "angle, inventory item used, format, audience."
Becomes: brief.md opens with front matter carrying `anchor:`, `supports:`, `job:`, `hook_id:`, `thesis_id:`, `status: drafted`. All three §3 locks read `profiles/<handle>/runs/*/brief.md` at run start and count only rows with `status: shipped`.
Why: §1.1 step 3 already writes brief.md before drafting, so the record survives every crash the render path can produce, and an abandoned draft costs nothing. §3's structural job currently has no storage anywhere. (L12-06, L4-07, L10-05)

**FIX-03. Define "profile file" in §7a.**
Now: "Nothing else writes to a profile, ever," against §1.3's "Every run writes into `profiles/<handle>/` and nowhere else."
Becomes: add one sentence to §7a. "Profile file means the curated files listed in §5: identity.md, inventory.md, inventory-archive.md, voice.md, inspiration.md, audience.md, thesis.md, theme.json, learnings.md. `runs/` and `analytics/` are the run ledger, and every run appends to them."
Why: the two sections currently give opposite instructions about the same write, and the queued §5 move makes the collision certain rather than theoretical. (L12-06, L8-01, L4-01)

**FIX-04. The anchor lock counts shipped posts, not calendar days.**
Now: §3 "every post consumes one, timestamped, locked 60 days" and §7 "An item used inside 60 days is off limits."
Becomes: §3 "**Anchor item:** every post consumes one. An item is off limits until 10 other pieces have shipped." §7 matches.
Why: 60 days at 4 posts a week holds 34.3 items in lock against a 15 to 25 item seed, so the engine runs out of legal anchors somewhere in week four to seven and §7's own answer is to interview the person who came to post. This is the defect that fires on a calendar date regardless of how good everything else is.
Position taken: rejecting the two competing fixes. The (anchor x structural job) pair lock proposed by L12-04 and L10-01 licenses six retellings of one anecdote per quarter, and a follower who reads all of Joseph's posts experiences that as a man with one story, not as six structurally distinct posts. The derived formula `min(60, floor(7 * items / cadence))` proposed by L10-01 relaxes the guard exactly when inventory is thinnest, and no user can answer "why can't I use the UTD story today" from it. Cutting cadence to 3 a week is the fallback if measured top-up yield stays under 1.5 items a week through week six, not the opening move. (L6-02, and see the contradiction resolution in the review)

**FIX-05. Replace §12's inventory-depth indicator.**
Now: "Inventory depth (never below 15 unused items)."
Becomes: "Unlocked anchors at run start, and net new inventory items per week (target 2+). The engine prints one line at run start: `N unlocked anchors, M posts of runway at current cadence`."
Why: the current threshold is breached at post 11 from a 25-item seed and can never recover, so it is a permanently red metric. Under a 10-post lock the old threshold can never fail either, and a metric that cannot fail is noise. Runway is the number that predicts the wall. (L6-02, L3-01)

**FIX-06. Add a hook-pattern-alone lock to §3.**
Now: only "Thesis x hook pattern: the same pair is locked 30 days."
Becomes: add a row. "**Hook pattern alone:** no reuse within the trailing 8 shipped posts, and no more than twice in any trailing 20."
Why: with 3 to 5 theses and 35 named patterns there are 105 to 175 pairs against roughly 17 posts a month, so the pair lock has a near-zero collision probability and effectively never fires. One shape can legally carry five posts a month. (L2-07)

**FIX-07. Delete three dead lines from §7 and §3.**
Delete §7's "**Active:** inventory.md holds unused items plus anything used in the last 180 days," §7's 400-line retirement trigger, and §3's "Runs older than 30 days archive automatically."
Why: the 400-line trigger contradicts §7's own argument two paragraphs above it ("the cap goes on what a run loads, not on what the file stores"), and with the performance precondition gone it would fire at every run start with zero eligible items. The 180-day line is dead text once a lock exists. The archive line names an automatic write with nothing to fire it. Retirement eligibility becomes "used, and past its lock," offered at `/content-engine inventory`, never silently. (L6-07, L10-05, L9-06)

**FIX-08. Superseding entries never touch the old line.**
Now: §7a "Correcting an entry means appending a superseding one and marking the old `superseded: <date>`."
Becomes: "Correcting an entry means appending a new one carrying `supersedes: <old-id>`. The old line is never touched. An item named by any entry's `supersedes:` is excluded from the draft-time load."
Why: marking the old entry is a rewrite inside a rule that forbids rewriting, and the document never says what `superseded:` does at load time, so both entries currently load and the false one wins on tags. (G2-04)

**FIX-09. Apply the queued §14 per-format change as anchor plus supports.**
Now: "One inventory item per post, named in the brief. No exceptions."
Becomes: "Every piece names one `anchor:` item in the brief, and may cite up to four `supports:`. Only the anchor consumes a lock. A support is a citation, not a consumption."
Why: this is already queued on line 9 of the PRD and left unspecified in the two ways that matter: how the lock applies to a multi-item piece, and which item the repetition guard treats as the anchor. Settling it now keeps a builder in week five from choosing between a bullet marked "No exceptions" and an eight-slide carousel built from three sentences. (L2-04)

**FIX-10. Apply the queued §5 move now.**
`runs/` and `analytics/` move under `profiles/<handle>/`. Add `runs/index.md` to the tree only if something reads it; otherwise the directory listing is the index.
Why: at root, `runs/<slug>/draft.md` holds the customer story verbatim and is outside the `.gitignore` rule §1.2 wrote specifically to stop that from being pushed. It is a data leak, not a housekeeping preference, and §1.3 has already made the decision in prose. (L10-02, G3-06, L1-07)

### B. The gate

**FIX-11. The gate re-measures its own output.**
Add to §9 Gate behavior: "After any rewrite pass, re-run the gate on the rewritten text."
Why: every distribution-shaped rule in §9 ("Uniform sentence length," "Every paragraph the same number of lines," "Zero contractions, or 100% contractions") is evaluated against text the gate is about to change, so any flattening the gate causes is invisible to the gate that caused it. The gate can reliably make a draft more machine-shaped than it found it and report a clean pass. This is the single line that closes it. (L7-07)

**FIX-12. A rewrite substitutes, it never subtracts.**
Add to §9: "Removing an em dash means replacing it with a comma, colon, or parenthesis. Resolving any lexical violation by splitting the sentence, deleting the clause, or dropping the punctuation entirely is not a valid rewrite."
Why: every lexical rule in §9 is one-directional, so the cheapest resolution reduces punctuation density and sentence-length variance. (L7-01, L7-07, L2-03)

**FIX-13. Bound the loop and guarantee an artifact.**
Add to §9: "Cap rewrites at 3 per 200 words and never rewrite the same span twice. Above the cap, return to brief.md and redraft once with the tripped rules injected as drafting constraints. If the redraft still exceeds the cap, ship the better draft with one line naming what is unresolved, for example `gate: could not clear [uniform sentence length]`, and let the human decide. No run ends without an artifact."
Why: §14's "A draft that fails gets rewritten before the human sees it" reads to an implementer as `while (fails) rewrite()`, and §9's own rules fight each other, so an unclearable draft has no defined exit. A model composing under a constraint writes around it; a model patching eleven violations contorts, and the redraft is cheaper in tokens than eleven surgical passes. Say in the doc that 3 is a knob to tune against the ten posts from build step 8, not a measured constant. (L7-07, L12-05, L10-04)

**FIX-14. Protected spans.**
Add to §9: "The gate never rewrites inside quotation marks, and never alters a numeral or a proper noun anywhere. When a banned item appears inside a protected span, the gate reports it under a separate gate-report.md heading, `not rewritten: quoted or factual`, and leaves the text alone." Add the matching drafting instruction: when a draft uses an inventory item's words verbatim, it puts them in quotes.
Why: "double down," "moving the needle," "navigate," and "leverage" are all on the ban list and all appear in how supply chain operators actually talk. A quoted line from a named person at a company described by revenue band gets silently edited and shipped, and §14's most important rule is broken by §9's mechanism rather than by the drafting model. Recovery from a public fabricated quote is not a product fix. (L7-03)

**FIX-15. voice.md wins.**
Add to §9 and §14: "voice.md wins. A tell that contradicts a documented habit in voice.md does not fire for that profile; the gate records the override in gate-report.md instead of rewriting."
Why: §6.2 measures sentence length and variance, fragments, contractions, profanity, and questions, and the document then reads none of those numbers anywhere, while a shared person-independent blocklist holds non-advisory authority over every draft. No line states precedence, so the default is that a stranger's list silently overwrites the person's measured habits. (L7-02, L8-02)

**FIX-16. Give the one numeric rule a threshold.**
Now: "Flag if stdev of sentence length is low."
Becomes: "Flag when a draft's sentence-length stdev, or its contraction rate, is more than 25% below the value recorded in voice.md at setup. Where no samples exist, fall back to absolute floors: flag if no sentence is under 6 words or none is over 25."
Why: as written the rule has no threshold, no unit, and no comparison corpus, while the corpus sits unused two sections away. The absolute fallback matters because §6.2 explicitly plans for users with no samples, and suppressing the check for them removes it from the people who need it most. (L7-02, L7-04, L10-04)

**FIX-17. Freeze the setup-measured voice numbers.**
Add one clause to §7a's re-derivation rule: the prose in voice.md stays regenerable on request with a diff, and the four measured values recorded at setup are frozen and never overwritten.
Why: drift is only detectable against a fixed baseline. If re-derivation can overwrite February's numbers, the drift is unrecoverable and nothing can tell whether the voice converged or the person stopped editing. (L6-05)

**FIX-18. Add the one positive check.**
Add to §9: "**Specifics floor.** Count named people, companies, dates, and numerals. A draft with none is redrafted, not rewritten. An abstraction cannot be patched into an instance."
Why: roughly thirty entries in §9 are things to remove, so a draft that removes every tell and says nothing passes clean. §6.1 spends its entire philosophy block arguing instances over categories and nothing anywhere checks whether the finished draft contains one. Reject, not rewrite, because the rewrite path cannot manufacture a fact. (L7-05)

**FIX-19. Two scope corrections to the lexical bans.**
Delete the en dash from the ban when it sits between digits. Scope "Semicolons in a LinkedIn post" to short posts only.
Position taken: keeping "Em dash. Zero tolerance." Four lenses argued for relaxing it to a measured per-person rate on the strength of a 2026 corpus analysis. That citation is untagged and unverifiable, §14 of this document forbids acting on exactly that class of claim, and more importantly a frequency statistic about model output does not tell you what a skeptical VP reads as machine-written. The false-positive cost is a comma. The false-negative cost is the product promise. The real mechanism those findings identified is subtraction without re-measurement, which FIX-11 and FIX-12 close without touching the rule. (L2-03, L7-01, L9-04, L8-02, L10-04)

**FIX-20. The list can shrink.**
Now: "The list only grows."
Becomes: "Entries can be retired. A rule that fires on the person's own writing or on an inspiration.md post gets struck through with the date and the reason, so it stops firing and stays visible."
Why: a rule that turns out to be wrong currently costs a rewrite of good writing on every future draft forever, so precision can only decay, and the file §9 calls the highest-value asset in the repo can never be shown to have improved. Strikethrough in a markdown file is the whole mechanism. (L7-05, L8-02, L8-08)

### C. Setup

**FIX-21. Setup writes as it goes.**
Add rule 8 to §6.1: "Append each item to inventory.md in the turn it is confirmed, in the §7 schema, in their own words. One item, one write, never buffered to the end. If you cannot quote their exact words for an item, do not write it; ask again. The file is the state; the transcript is scratch."
Why: §6.2 attaches a write instruction to four of its seven sections and none to Raw material, the section it calls the longest and most valuable. §13 step 1 is a multi-hour single session, so auto-compaction fires mid-interview and items 1 through 12 become a summary that gets written as `source: interview`. Nothing was invented, so §7a's "nothing unconfirmed is written" cannot fire, and §6.1 rule 1 is defeated through a channel it does not defend against, on the seed inventory every later calibration is tuned against. (L1-03, L5-02, L10-08)

**FIX-22. Setup is resumable.**
Now: §8 "`/content-engine setup` # interview -> profile. once per person."
Becomes: "# interview -> profile. resumable, run it again any time; it reads the profile and picks up where you stopped. Never recreates an existing profile."
Resume rule, one line in workflows/setup.md: read `profiles/<handle>/`, count inventory items, find the first §6.2 section with no file written, continue there. Ship no `setup-state.md`. §6.1's stop condition is already a predicate over files on disk, and a second copy of that state can only disagree with the first. (L1-03, L10-08, L10-07)

**FIX-23. Delete the Visual paragraph from §6.2.**
Becomes one line: "Visual is not asked at setup. The first `/content-engine carousel` run pulls a palette, shows two real rendered slides, and writes theme.json then."
Also: drop theme.json from §6.1's seven-file list, tune the `_template/` defaults so they clear §10's design gate unedited, and add one line to §10 naming theme.json's keys so §1.1's "documented input contract" claim becomes true.
Why: §6.2 requires two rendered examples and the renderer is built five steps later, so the implementer in week one either describes the options in prose, which the sentence forbids, or pulls Playwright into the 45-minute portability interview. Deleting the question also removes 5 to 10 minutes from an interview that is already over budget, and asks the visual question at the only moment the user has context for answering it. When the palette pull does happen, bound it: curl the homepage, pull first-party stylesheet hrefs, `grep -oE '#[0-9a-fA-F]{6}' | sort | uniq -c | sort -rn | head -8`. Delete "Brandfetch, or a similar brand asset lookup" from §6.2; an API key is the only manual credential anywhere in setup and §1.3 outlaws it. (L10-03, L1-06, L5-08)

**FIX-24. Inspiration is pasted, never fetched.**
Now: "Then fetch 3 to 5 of that person's posts and extract the mechanics."
Becomes: "Ask them to paste 3 to 5 posts from that creator, the text, not the URL. Never authenticate to LinkedIn to retrieve them, and if a public fetch fails, ask for the text rather than blocking." Add §6.1 rule 9: "If a lookup fails, say the lookup failed. Never write a creator's mechanics from memory."
Also add to §5's inspiration.md description: stores extracted behaviours only, never source text, and the pasted posts are discarded at the end of setup.
Why: this is an unspecified LinkedIn data acquisition sitting inside build step 1, inside the 45-minute portability test, on the machine of a stranger who is not logged in. §6.2's Visual paragraph three lines below it knew to write a fallback for a failed external lookup and this one has none. Discarding the source text also closes the only path by which another writer's sentence could reach a draft, since §3's verbatim diff only compares against the author's own work. (G3-05, L1-05, G1-05)

**FIX-25. Broaden what counts as a writing sample.**
Now: "Ask for 3 to 5 things they've written."
Becomes: "Ask for the last three Slack messages they sent that ran longer than two sentences, and the last email they wrote that they did not template. If they would rather talk, take a two-minute voice memo and transcribe it. Anything unedited counts."
Also: when voice.md holds zero `source: pasted` entries, the gate report's first line reads "No samples of your writing on file, this draft is inferred, not matched. Paste anything you've written and I'll re-derive."
Position taken: rejecting L1-05's refuse-to-draft and L11-02's hard five-sentence requirement. Both hand a brand new non-technical user a dead engine on day one, which is worse than a mediocre first draft she can edit, and both break the §12 portability test for the exact persona §2 was written for. Make the deficit loud instead of blocking. (L1-05, L11-02)

**FIX-26. Split setup into two sittings and stop asserting 45 minutes.**
§6.1 gains a session 1 stop condition: 8 inventory items, 2 corrected theses, 3 pasted samples, one calibration post through the real gate, closing with "you can post from this today; run `/content-engine inventory` twice this week to reach 20." Session 2 is the remainder, resumable per FIX-22.
§12's portability test becomes: "hand the repo to someone outside Daybreak. If they get a post they'd actually publish out of session 1, with no help from Joseph, it passes. Record the wall clock and replace this sentence with the measured median across Joseph, Fallon, Tim, and the IBM mentor."
Why: §6.1's stop condition requires 15 to 25 instance-grade items at three to four follow-ups each, plus corrected theses, plus voice extraction, plus an iterated sample post, and it explicitly forbids the escape hatch ("Do not let them stop early to be agreeable"). That is a different activity from a 45-minute one. The two numbers were written by different hands and never reconciled, and the mismatch lands on the one external validation in the plan. (L1-04, L5-02, L6-02)

**FIX-27. The calibration post runs the gate.**
Now: "End setup by generating one sample post and asking 'does this sound like you?'"
Becomes: "End setup by generating one sample post from a named inventory item, running it through the §9 gate, and showing the post plus the gate diff. Ask 'does this sound like you?' and iterate until yes." Log it: write the run directory, append the posts.csv row, consume the anchor.
Why: §9 says the gate "Runs on every draft before the human sees it" and §14 says it is not advisory, so this is the one draft in the product that bypasses it. Worse, the engine calibrates voice.md against text containing the exact tells the gate exists to kill, and the first artifact the user ever sees teaches the wrong thing about the product. Keep showing one draft here; the angle menu at minute 165 of an interview is where people quit. State the exemption in §14 so it is a decision rather than an oversight. (L1-08)

**FIX-28. Seed the diff corpus at setup.**
Add to §6.2's voice sample step: accept recent LinkedIn posts as samples, store them in `profiles/<handle>/shipped-history.md`, and diff against them until 20 engine posts exist. Optional, never gates the interview.
Why: Joseph has 1.4k followers, meaning a real posting history that §3's corpus contains none of. His fourth engine post can rebuild his best June post in front of the same audience and pass clean. The same paste improves voice extraction, so it pays for its own friction. (L10-07)

**FIX-29. Add clearance to the interview and fix the worked example.**
Add to §6.1's homework block, asked once: "If the company was large enough that you skipped the basics, it is large enough to have a communications policy. Is there anything about your work you are contractually not allowed to post publicly?" Record in identity.md as `disclosure_posture: open | nda-default`.
Rewrite §6.1's worked example so it is both an instance and clearable, keeping the specificity (a person, a number, a timeframe) but with a subject whose consent is obvious, and follow it with: "An instance you could not say on stage with that customer in the room is still an instance. Capture it, mark it `do-not-publish`, and keep going. It shapes the thesis even when it never ships."
Add §6.1 rule 1b: "A true detail that was never theirs to tell is the same defect as an invented one, pointed the other way."
Why: §1.2 ships reference/interview.md, so the worked example is the single definition of quality every profile will ever be calibrated against, and the clause that makes it exemplary ("nobody above her knew") is the clause that makes it unpublishable. The engine is not accidentally producing risky inventory; the shipped seed prompt aims for it. Separating capture from entitlement keeps the extraction at full depth without the exposure. (G1-01, G1-03, G1-06)

### D. What a run loads

**FIX-30. Rewrite §5's lazy-load line as the single authoritative load list.**
Becomes: "A short-post run reads identity.md, voice.md, thesis.md, audience.md, learnings.md (confirmed entries only), the compact inventory index with only shortlisted items hydrated, and inspiration.md when voice.md declares no samples exist. ai-tells.md loads at gate time, not draft time."
Then delete the load-order restatements in §7 and §11 and point them at §5. Fix §5's stale annotation on learnings.md from "updated by phase 5" to phase 7 of the old order, or to the new step number after section 3 below.
Why: §7 defines an angle as "one inventory item, crossed with one thesis, aimed at one audience anxiety" and audience.md is not in the list, so the third axis of the core mechanism has no input and the model either invents the anxiety, which §14 forbids, or drops it. §11 states outright that learnings.md is loaded at draft time and it is not in the list either. The cost lands on the one calibration gate in the build order: ten posts aimed at nobody, then voice tuned against edits of those posts. Moving ai-tells.md out of the drafting context is a bonus, since having the answer key resident is part of why the gate catch rate means nothing. (L2-08, L3-06, L8-05)

**FIX-31. Delete `reference/linkedin-algorithm.md`.**
Remove it from §1.2's ships list and §5's tree.
Why: it appears in no step of §1.1's pipeline table, no load list, and is built by no item in §4 or §13. Its "review quarterly" note is exactly the reminder §3 opens by rejecting, §3's staleness mechanism is scoped to profile files so nothing covers it, and §14's UNVERIFIED rule is scoped to "this doc" so nothing governs what gets written into it. Every durable mechanic it would carry already lives where it is used: 1080x1350 in §10, post shapes in formats.md, hook patterns in hooks.md. What remains is vendor folklore shipped in the box for Fallon to inherit in December. If Joseph wants algorithm beliefs later, learnings.md already holds his own data. (L3-06)

**FIX-32. Add the sibling-profile notice.**
Add to §5's load list: "At run start, when more than one directory exists under `profiles/`, read `profiles/*/runs/*/brief.md` and print the last 14 days of sibling activity, one line each: date, handle, format, a readable anchor summary."
Why: all three locks are profile-scoped, and Joseph, Fallon, and Tim share customers and audiences, so the same real-world fact exists under different ids in three files and the verbatim diff cannot catch it either, since two people telling one story in their own voices share no 8-word run. Notice rather than lock: Joseph sees Fallon shipped that story Monday and picks another angle, and the shared-thesis case a hard lock would wrongly block stays available. Read-only, so §1.3 is untouched, and it globs to nothing on a solo install.
Rejecting the `shared_key:` schema field: asking an interviewee at minute forty to predict which of her stories a colleague will also tell produces a field that is blank by week three, and a blank key makes the lock inert while the operator believes it is armed. (L2-07, L11-01)

### E. Commands and the daily loop

**FIX-33. The angle pick stops blocking.**
Now: §1.1 step 3 "Cross into 5 angles, human picks" as a router-owned blocking step, §14 "Never show one draft. Show angles first," and §3's not-agentic row saying the engine "picks the angle, drafts, gates, renders, and self-critiques without being re-prompted at each step."
Becomes: the engine generates five angles, drafts its own pick immediately, and prints the four rejects as one-liners under the finished draft. §14 becomes "Never show a draft without showing what it was chosen over." §3's not-agentic row becomes "the engine picks an angle and drafts it; the alternatives are visible, not blocking." §1.1's table step 3 becomes "Cross into 5 angles, draft the best."
Why: §8 promises one keystroke and the hard rules mandate two blocking decisions and four reading blocks around a 180-word post, 104 times a year. Implementers build what the hard rules say. Keep the generation, since "Never draft the first angle you thought of" is load-bearing and cheap; drop the block, since the human is choosing between five abstractions of posts that do not exist yet, at the moment of lowest information, and the visible selection pressure runs toward whichever option is least likely to annoy an account. Follow-ups stay conversational, which is free in Claude Code and needs no keyword grammar. The taste that the pick was buying gets paid for in FIX-34 and FIX-18 instead. (L12-01, L12-02, L2-02)

**FIX-34. Fix the angle crossing formula.**
Now: §7 "one inventory item, crossed with one thesis, aimed at one audience anxiety."
Becomes: "one inventory item, crossed with one thesis, aimed at one thing the audience believes and is wrong about, or is tired of hearing."
Add one field to thesis.md entries: `against:`, the strongest version of the opposing position in the words someone who holds it would use, captured by one added question in §6.2's thesis propose-and-correct loop.
Why: a join of item x thesis x anxiety can only produce illustrations, and anxiety pulls toward reassurance. Nothing in the crossing carries a counterparty who is wrong. §6.2 already collects the opposition material ("What do people in your industry get wrong constantly?", "What are they tired of hearing?") and §7's formula never reaches it. This is the ceiling on the whole product and the fix is one word plus one interview question. (L2-02)

**FIX-35. Today's news gets a path.**
Add to §8: `/content-engine post "<pasted raw material>"` drafts from the pasted text in the same run and, on accept, invokes the existing `/content-engine inventory` append path with `source: pasted` and the run slug.
Why: §14 requires every fact to come from inventory.md and §7a lets only one named command write there, so material from this morning takes two invocations. The first time Joseph writes the timely post by hand in nine minutes and it outperforms the month, the bypass is permanent, and it will be the best posts that route around the engine. §7a survives verbatim because nothing else writes; only §8's description changes. Note the side effect in §7: this is the most plausible way inventory actually grows, as a byproduct of posting rather than as a scheduled chore. (L12-07, L2-09)

**FIX-36. Move the top-up off the daily run.**
Delete §7's "After each run, offer a two-minute top-up." Attach it to `/content-engine review`, weekly, primed from three sources already on disk: the named gaps §6.1 rule 5 records and nothing ever reads again, the composition of inventory itself (11 stories and 1 number means ask for a number, which is a row count, not a model call), and whatever was pasted into `/content-engine post` that week.
State in §7 that the top-up loads reference/interview.md's philosophy block and rule 3.
Why: a weekly-framed question fired after every run means three of four asks are structurally guaranteed to return nothing, which trains refusal by construction, and it is a prompt in the daily driver §8 wants to feel like one keystroke. The unprimed version also violates the interviewer doctrine the same document spends §6.1 establishing.
Rejecting the calendar connector proposed by L6-03: OAuth is manual setup, it fails §1.3 and the portability test, and it drags attendee domains into a repo whose gitignore exists to stop exactly that. (L6-03, L9-08, L12-01)

**FIX-37. `as <handle>` scopes one invocation.**
Add to §8: "`as <handle>` scopes a single invocation and does not persist. With several profiles installed and no `as`, the engine asks." Echo `[profile: fallon]` as the first line of output and again immediately above the copy block, fenced separately so it cannot be pasted with the post.
Why: §8 shows a bare "switch profile" with no subcommand, and any persisted pointer needs a state file with nowhere legal to live under §1.3. Zero state, and the wrong-profile run becomes visible one step earlier. (L11-08, L10-07)

**FIX-38. Add a retraction path.**
Add to §8: `/content-engine retract <run-slug|item-id>`. It appends `withdrawn: <date> <reason>` to the named inventory item, permanently excludes that item from the draft-time load regardless of any lock or retirement rule, and writes a one-line `WITHDRAWN` marker into the run directory. Add it to §7a's write list.
Why: nothing in the document can remove, correct, or kill anything. An item discovered to be false but never used is permanently ineligible for retirement, permanently in the active set, and permanently readable by every draft run, while §14 makes inventory.md the sole source of every published fact. §14's "never invent a fact" is satisfied in full while the engine faithfully republishes a lie it has no mechanism to drop. Joseph's only current remedy is hand-editing inventory.md, which §3 and §7a both spend paragraphs prohibiting. This is a command you hope never to run and it costs nothing on the days you do not. (G2-03)

**FIX-39. Staleness stops nagging.**
Drop `last_reviewed` from inspiration.md and theme.json entirely. Give the rest honest intervals rather than one global 60: identity 180, audience 120, voice 90, thesis 90, inventory 30. Flag only files the current run loaded. Give `/content-engine review` a quarterly three-question confirm ("Still selling to supply chain leaders at $500M+ manufacturers? Still VP of GTM? Anything change about who you want reading this?") whose confirmed answer stamps `last_reviewed`. Cap run-start output at one line total, most urgent wins, and spend the reclaimed line on FIX-05's runway number.
Why: §7a permits writes only from two named commands plus explicit re-derivation, leaving identity.md, audience.md, inspiration.md, and theme.json with no writer at all, so from day 61 their flags are permanent and unclearable. The same run-start channel carries "the inventory is thin," which is load-bearing and has no other surface. Do not backdate initial values to stagger them; that writes a false date into a provenance field on day zero in a document that spends all of §7a on which lines a human said. (L12-08, L6-06)

**FIX-40. One keystroke defines shipped.**
Add to the end of every run: "Shipped as written? [y/n]". `y` copies draft.md to `runs/<slug>/shipped.md`, flips brief.md's `status:` to `shipped`, appends the posts.csv row, and increments §12's zero-edit numerator. `n` prompts for a paste, or defers to the weekly review. Define shipped throughout the document as "has a row in posts.csv."
Why: §14 guarantees the engine never observes publication, so nothing distinguishes the six runs Joseph published from the four he abandoned. That one missing concept makes four mechanisms inert at once: `/content-engine review` has no candidate list, §3's diff corpus cannot tell published from abandoned, §12's flagship 70% metric is uncomputable from day one, and §11's stated join key is a value no step ever captures. One character on 70% of posts buys all four.
Position taken: rejecting the per-post paste ritual proposed by L4-02 and L9-05. Once the Apify loop lands, fuzzy-match the scraped text against draft.md using the same similarity routine the verbatim check already needs; that recovers the URL join and a real edit distance retroactively with no human in the loop. Reuse the diff you are already building. (L10-07, L4-02, L9-05)

### F. Measurement

**FIX-41. Stop asking the model for its own token count.**
Delete the token columns from §4 item 9 and the phrase "'Pro-viable' should be a measured number in `posts.csv`." Add one field the engine can honestly write: `hit_limit` (y/n), set only when the human says the session was interrupted. Add to §14: "The engine never writes a number it cannot observe."
Tag §4's 15k, 35 to 50k, and 1,900-token figures `[UNVERIFIED 2026-08-17, owner Joseph]` and relabel them budgets rather than targets. Change §12's criterion to the behaviour it was a proxy for: "four short posts in one week on a Pro plan with no limit interruption, measured in week 2."
Add the gating sentence §4 is missing: the render pipeline is greenlit only after ten completed carousel runs have a measured median.
Why: a model has no access to its own usage counters, so the column fills with a plausible integer anchored to the target printed in the same session, and the one artifact designed to falsify the token design instead confirms it. §14 forbids exactly this, and the document commits the same error two sentences later with three untagged figures. Measure it with `/cost` at end of day for ten working days instead, in a scratch file, then delete the exercise. (L5-06, L4-08, L5-01)

**FIX-42. Delete the gate-catch-rate indicator.**
Now: "Gate catch rate trending down over time, which means the drafting model is internalizing the constraints."
Becomes: "Gate recall and false-positive rate against `reference/gate-fixtures/`, reported whenever ai-tells.md changes."
Why: there is no learner. Each run is a fresh context reading the same files, §7a guarantees no cross-run write, and §9's "the list only grows" should push the rate up rather than down. Success and the worst failure produce the same number, and the metric tells Joseph to stop reading gate reports at exactly the moment he should not. (L9-04, L2-10, L12-03, L3-02)

**FIX-43. Delete the impressions ramp.**
Delete "Ramp it: 5k/wk in month 1, 15k by month 3, 40k+ by month 5." Keep the two outcome goals and keep them marked non-optimizable.
Why: 40k a week in month five is only reachable if the follower goal is already met, so the ramp is derivable from the goal it is supposed to independently check, and a Joseph tracking behind it in week twelve learns nothing. §12 already names the honest substitute one line below: median engagement rate against his own trailing 20-post baseline. Whether the 20k goal itself survives is section 6. (L3-05, G2-06)

**FIX-44. Freeze the posts.csv header now.**
`run_slug,shipped_at,shipped_verbatim,run_again,post_url,followers_at_post,reactions,comments,reposts,hit_limit,minutes_to_ship`
Everything else joins from brief.md. Write the template at `profiles/_template/analytics/posts.csv` per FIX-10.
Why: §1.2 ships the file with headers and §4 makes it MVP, and the header row is specified nowhere in the document, so the first fifty posts get logged against a schema nobody chose. `run_again` (+ or -, "would you publish this again") is the one sign bit in the whole system: §11's score is unsigned magnitude and weights comments at 3x, so a backlash post is the highest-scoring post of the quarter and there is no field anywhere in which "this produced a phone call I did not want" can be recorded. `minutes_to_ship` is computed, not typed. Duplicating format, anchor, thesis, hook, and job into the CSV creates a second place to be wrong. (L9-05, L10-07, G2-01, L8-06)

**FIX-45. Fix the learning loop before it exists.**
Four edits to §11: delete "or when a single post beats the trailing 20-post median by 2x or more"; add "Only entries tagged `confirmed` load at draft time; `hypothesis` and `killed` entries stay in learnings.md for the human to read at review"; state the test on the 5v5 clause as exact Mann-Whitney U on the ten scores, qualifying at U<=2 (two-tailed p=0.0317); add the kill rule, "A hypothesis is killed on the same evidence that would have qualified its inverse. Unresolved at 90 days, it is marked killed."
Add `arm: explore|exploit` and `tests_hypothesis: <id>` to brief.md, written automatically from the existing one-in-five rule, and have the exploration post deviate on one named dimension rather than ignoring everything at once. Exclude any post carrying `run_again: -` from the median, from hypothesis generation, and from any hypothesis's supporting set.
Why: LinkedIn engagement is heavy-tailed, so under a lognormal with shape 1 the 2x clause fires on roughly a quarter of all posts, which at 4 a week manufactures a finding per week out of variance, and the most common real cause (one large account reposting) is invisible to the loop. There is no kill criterion at all, so a hypothesis can only harden. A post that deviates on everything at once produces data nobody can attribute. And with no sign bit the loop reads Joseph's worst professional week as its strongest prior.
Rejecting L9-03's full-text outlier prior: it points the drafter at ten of the author's own posts at the exact moment §3's verbatim lock is diffing against them, and it is the collapse vector §11's own guardrail was written against. (L9-02, L6-04, L9-03, L5-05, G2-02)

**FIX-46. Demote the zero-edit metric.**
Now: "Percentage shipped with zero human edits to the language (target: 70%+ by week 4). This is the truest read on whether the voice is right."
Becomes: "Percentage of posts marked `run_again: +` shipped with zero human edits to the language (target 70%+ by week 4). Necessary, not sufficient. Read it alongside the §9 voice-drift flags, since a more aggressive gate raises this number without improving the voice."
Why: §6.1 already contains a better read, the setup stop condition's unprompted "it sounds like them," and §12 abandons a human judgment for a proxy that cannot distinguish a comma fix from a re-voicing and then calls the proxy the truest one. Scoping the denominator to `+` posts stops the engine paying Joseph more for not having touched the draft he should have killed. (L7-08, G2-05, L2-10)

### G. Entitlement and account risk

**FIX-47. Add `clearance:` to the §7 inventory schema.**
`clearance: public | anonymized | do-not-publish`, required, set in the same turn the item is written, by one question: "Could you say this on stage with that customer in the room?" Carry it in the compact inventory index, not only in the hydrated item, so the router filters before angle-crossing spends tokens. Where identity.md says `disclosure_posture: nda-default`, the capture-time default is `do-not-publish` and the interviewer clears items actively during the interview, where the marginal cost is one word.
Why: all eight fields in the current schema describe origin, content, linkage, or lifecycle. `source:` answers who said this and never who may hear it, so an item captured under an implicit confidence is indistinguishable at draft time from a public credential, and every gate downstream checks how a draft sounds. §14 guarantees that everything factual is real, and §6.1 defines the ideal item as an unpublished, unflattering, identifiable truth about a third party. The integrity rule is what creates the exposure. This has to be a schema field now because adding it after 25 items exist means re-interviewing.
Note: the gap findings G1-01 through G1-07 did not go through the review's refutation pass, so treat the mechanism as sound and the severity as unaudited. (G1-01)

**FIX-48. The gate rejects on clearance.**
Add to §9, as a reject rather than a rewrite: "A draft that names a company, a person, a role-plus-employer-plus-timeframe triple, or a figure whose source item is not `public` is rejected and redrafted. Rewriting a disclosure only produces a better-written disclosure."
Also: an item marked `do-not-publish` retires to inventory-archive.md immediately, regardless of use or lock, and `/content-engine inventory` skips it when duplicate-checking.
Why: §3's own argument about the repurpose refusal applies exactly here. (G1-01, G1-02)

**FIX-49. Extend the no-auto-post rule to reading.**
Add as the second bullet of §14: "**No automated collection as a publishing identity.** No scraper, actor, extension, or script ever authenticates to LinkedIn as an account this engine writes posts for. Reading is copy-paste too."
Why: §14 keeps automation off the write surface and never extends it to the read surface, which is the side LinkedIn enforces against with account restriction rather than a content penalty. A future session asked to make the review command faster will read §14 for its constraints, find nothing about reads, and wire the actor in with a stored cookie. (G3-04)

**FIX-50. Add the missing UNVERIFIED tag to §11 and order the two.**
Add: "**[UNVERIFIED 2026-08-17, owner Joseph]** Answer this before the actor question below. (a) Does the chosen actor require a LinkedIn session cookie or does it read public pages unauthenticated, read from the actor's own input schema rather than its marketing page; (b) if it requires one, whose account supplies it; (c) what LinkedIn's current enforcement behaviour is against datacenter-IP authenticated profile fetches at this volume. If the answer to (a) is yes, the feature is cut, not moved to a burner account. Blocking for §11 only."
Also reorder: answer the impressions-export tag first, because if a personal profile cannot export post-level impressions then §11 has one source rather than two and the actor question becomes a risk decision rather than a cost decision.
Also replace §11's degradation sentence: "Degradation is keyed to account risk, not cost. Cut benchmark creators on any LinkedIn warning, any actor error indicating throttling, or permanently if the actor requires a session cookie."
Why: §11 specifies volume, cadence, vendor, cost posture, join key, and scoring, and never states which LinkedIn identity the weekly scrape authenticates as, which is the only variable that determines whether the measurement loop can cost Joseph the account it exists to measure. §14 says untagged claims are asserted as verified, so the document currently asserts that this is safe. The existing degradation rule is worse than nothing under risk pressure, because "never your own accounts" instructs him to keep doing the thing that produced the warning. (G3-01, G3-03, G3-07)

### H. Install and portability

**FIX-51. Make the install real.**
Five edits. Add README.md to §1.2's ships list, whose first line is `git clone <url> ~/.claude/skills/content-engine` and whose second is `/content-engine setup`. Delete "Start" from §1.3 and §2 and replace it with the command, since §8 defines eight commands and "Start" is not one of them. Write SKILL.md's `description:` frontmatter to name LinkedIn, post, carousel, and the setup interview, since that string is what the router matches on when the user types prose. Add package.json and package-lock.json with playwright pinned to §1.2, and node_modules to the gitignore spec. Change §1's "Anyone can install it" to "Anyone who can run Claude Code can install it," and delete §1.1's "it means a standalone visual engine could be lifted out later without a rewrite," since the input contract's real justification is keeping Playwright off the writing path and the same sentence already says it.
Why: the word the PRD tells the user to type is not a command, nothing anywhere states the install step, `npm install` does not fetch the Chromium binary, and `git status` fails §12's corollary on a correct run. Individually trivial, together they mean the one external test of the whole portability thesis returns an uninterpretable result on the day it runs. (L1-01, L1-07, L8-03)

---

## 3. The revised build order

Sixteen steps. Steps marked NEW did not exist in §4 or §13. Steps marked MOVED changed position. The rest keep their §4 item number in brackets.

| # | Step | Gate | Status |
| :- | :- | :- | :- |
| 1 | Apply section 2 to the PRD | blocks everything | NEW |
| 2 | SKILL.md router, profile structure, setup interview [§4-1] | | existing |
| 3 | `reference/engine.js` | blocks 4 and 6 | NEW |
| 4 | ai-tells.md, the gate, `reference/gate-fixtures/` [§4-2] | | existing, test expanded |
| 5 | Short posts end to end, brief.md front matter, ship keystroke [§4-3 + part of §4-9] | | existing, scope moved in |
| 6 | The repetition guard [§4-4] | | existing |
| 7 | Minimal `/content-engine review`: shipped reconciliation, primed top-up | blocks 8 | NEW |
| 8 | Ship 10 posts manually, measure the five numbers, tune voice [§13-4] | **gates 9 through 16** | existing |
| 9 | Portability test with the IBM mentor, short-post path only [§13-6] | **gates 10** | MOVED up from after render |
| 10 | Render pipeline with the overflow check [§4-5] | | existing |
| 11 | Carousels plus the design-tell gate [§4-6] | | existing |
| 12 | Infographics [§4-7] | | existing |
| 13 | The repurpose refusal [§4-8] | | existing |
| 14 | Full review: URL and engagement rows into posts.csv [rest of §4-9] | | existing |
| 15 | Analytics loop [§13-7] | blocked on FIX-50's two tags, in order | existing |
| 16 | Articles and blog repurposing [§13-8] | | existing |

**Why 9 moves ahead of 10.** §13 currently runs the portability test after the render build, so it measures the Playwright installer on a managed corporate laptop rather than the writing path. §1.3's operative test is reaching a first publishable post, which is a short post. Add to §12: "the tester runs the short-post path only; carousel portability is tested separately once `render/` exists." (L8-03, L1-01)

**Why 3 is a new step.** Six mechanisms in §3 and §9 are exact string and number work handed to attention: 8-gram overlap across roughly 5,900 tokens of prior posts, the 19-term lexical list, contraction ratio, sentence-length stdev, hashtag counts, and the lock read. A model does these unreliably and reports clean when it fails, and the gate report is written by the same model that missed the character. The failures are silent, so §3's promise degrades invisibly while the document reports success.

`reference/engine.js`, node, no npm dependencies, four subcommands:

- `overlap <draft> <profile>` reads the last 20 `runs/*/shipped.md` plus `shipped-history.md`, lowercase-tokenizes, intersects shingle sets, returns matched spans. **Before comparing, strip any span that appears verbatim in that profile's inventory.md `content` fields or thesis.md.** Traceable overlap is a citation, printed as a warning with the prior slug; untraceable overlap is the hard fail. Without that exemption the check destroys the shadow-spreadsheet sentence the first time Joseph legitimately retells it, and he turns it off. One assert: a draft containing a known 13-word run from a fixture prior must fail, and the same draft with that run quoted from inventory must pass.
- `lexical <draft>` scans the banned list, em dash, semicolons in short posts, hashtag counts, Title Case headers.
- `stats <draft>` returns sentence-length stdev, contraction rate, comma density, specifics count.
- `locks <profile>` globs `runs/*/brief.md`, returns unlocked anchors, hook patterns used in the trailing 8 and 20, and the runway number for FIX-05.

Output is JSON that gate-report.md quotes verbatim, so the report is auditable rather than self-witnessed. It lives in `reference/` because §1.2 already ships all of `reference/`, so it needs no new line in the ships list. It writes nothing outside `profiles/<handle>/`.

Node, not Python: `render/render.js` already requires it, every Claude Code user has it, and a script with no npm install satisfies §1.3 completely, since that clause is about the user installing things rather than about executable code existing. Two runtimes make portability worse. (L4-03, L5-04, L4-04)

**Also deterministic, but inside render.js at step 10:** after each slide loads, evaluate any text node where `scrollHeight > clientHeight` and any element whose `getBoundingClientRect().bottom > 1350`. Return the count alongside the PNGs. Nonzero means the render failed and the workflow re-drafts that slide. Add one line to design-tells.md: "Text clipped by the 1350px frame, or a headline wrapping past two lines. Caught by render.js, not by reading the HTML, because the HTML always looks fine." Every item in §10's current design-tell list is a taste judgment and not one is a geometry failure, so the slide carrying the number can be cut in half and pass both gates. (L5-03)

**The model keeps:** antithesis, unearned rule of three, restating close, hedged openers, the structural judgments generally, angle generation, drafting, and the clearance read. Amend §9 to say which half is deterministic, because "Zero tolerance" applied to model-judged items is a promise the design cannot keep.

---

## 4. Fix during build

Things that must be true when a step lands. No PRD edit needed today.

**Step 2, setup interview**

- Every §6.2 section carries a write instruction, not just the four that have one today.
- The resume path is a read of what exists, not a state file.
- identity.md records `disclosure_posture:` and, if the profile is not a person, `owner:`, the named human who satisfies the stop condition and approves. (L11-03)
- The interview never writes a creator's mechanics from memory after a failed lookup.

**Step 3, engine.js**

- One `assert`-based self-check per subcommand, in the file, runnable with `node reference/engine.js test`. No framework.
- `overlap` is the one with a real failure mode. Its assert is the inventory-exemption pair described above.

**Step 4, the gate**

- `reference/gate-fixtures/` holds the 20 real known-AI posts, authors stripped, one expected-catch line each. These are real third-party posts, so §1.2's no-fiction rule does not block them; it was a missing directory line. (L8-08)
- The negative control runs in the same pass: the gate over the person's own pasted samples and the inspiration posts. **Zero rewrites on the person's own samples is the pass bar.** Every fire is a rule bug, struck per FIX-20, not a prose bug. On the inspiration corpus, count how many rewrites Joseph judges worse; more than 2 of 20 means the rule that fired is over-firing. Two hours, no distributions.
- Rejecting report-only mode for the first ten posts: it teaches the user on day one that the gate is something you supervise, and the negative control removes the bad rules before they touch a real draft. (L7-06, L4-04)
- Every example line in `reference/hooks.md` is checked against ai-tells.md in CI. A pattern the gate would rewrite cannot ship in the library. §9 bans "it's not X, it's Y" and "The result?" by name, so without this the library and the gate fight on every run and the user watches the tool argue with itself on run two. (L2-06)

**Step 5, short posts**

- brief.md front matter is written at step 3 of the pipeline, before drafting, so it survives a crash at render.
- The run prints exactly one line above the post (`angle · anchor · job`), the post, the four rejected angles as one-liners, and the ship question. Nothing else. That is the testable version of "one keystroke." (L12-01)
- gate-report.md logs `gate_catch_count`, a per-tell tag list, and `gate_passes`. Print one summary line by default, not the itemization. Keep the file; it is the audit trail on the only component that silently edits the human. (L12-03, L12-05)

**Step 6, repetition guard**

- Reads brief.md front matter and calls `engine.js locks` and `engine.js overlap`. Nothing model-judged.
- The sibling-profile notice from FIX-32 globs to nothing on a solo install and must not error there.

**Step 7, minimal review**

- Lists run slugs with no posts.csv row, oldest first. Asks for URL plus reactions, comments, reposts, and `run_again`.
- Runs the primed top-up once, weekly, not per post.
- Any brief still `drafted` after 7 days prompts "Did you ship 2026-10-23-forecast-carousel?" One glob and a date compare, and it is the whole reconciliation mechanism. (L4-07)

**Step 8, ten posts**

- Record wall clock on all ten. This is the hand-written baseline for `minutes_to_ship` and it is free here and expensive to reconstruct later. (L8-06)
- Tune the rewrite cap from FIX-13 against what actually happened.
- Set the stdev and contraction thresholds from FIX-16 against Joseph's real drafts versus his pasted samples.

**Step 9, portability**

- Short-post path only. If the mentor reaches a carousel, the test has already stopped measuring what it was for.
- Record where she stops, not only whether she finishes.

**Step 10 and 11, render and carousels**

- The overflow check ships with render.js, not after it.
- `_template/theme.json` defaults clear the design gate unedited, since the first carousel now writes theme.json rather than setup.
- Add to design-tells.md: "Two body slides that could be swapped without changing what the carousel says is a hard fail." §3's overlap check is inter-piece only and nothing checks whether slide 7 restates slide 3. (L2-04)

**Step 15, analytics**

- Resolve FIX-50's tags in the stated order before writing code.
- Owned-account numbers come from the four values typed at review, never from a scrape. (G3-02)

---

## 5. Deliberate deferrals

Real findings. Ship without fixing them. Each has a trigger that changes the answer.

**Outbound link placement.** §14 and §9 say nothing about URLs in the post body, and the reported reach penalty is real in direction if not magnitude. Deferred because the PRD has no conversion metric anywhere and §10's posture is "Final slide is a takeaway, not a CTA," so the finding imports a requirement the document does not have. **Trigger:** the first time Joseph wants a post to drive to a Daybreak page. Then it is one §14 rule (link goes in the first comment, written as a final section of draft.md) and one URL pattern in engine.js `lexical`. (L3-03)

**Comment and reply preparation.** §11 weights comments at 3x and the pipeline ends at the artifact, so the engine optimizes something it does nothing to produce. Deferred because pre-drafted replies to objections nobody has made yet are guesses, and a canned reply pasted at 11:40 against a real objection it half-fits reads worse to a senior operator than two cold lines from a phone. **Trigger:** if `minutes_to_ship` is comfortably under baseline and Joseph wants the window covered, add `/content-engine replies <slug>` on demand, after the real comments exist. Add the rule it needs at the same time: inventory items cited in a reply are read-only and do not consume a lock. (L3-04, L8-07)

**Per-profile hook ranking.** 35 shared hook patterns across every install is a homogenization risk in theory. Deferred because the IBM mentor and Joseph publish into disjoint feeds, so the collision is invisible to every reader who exists, and the shared-audience version is already covered by FIX-06 and FIX-32. **Trigger:** more than five profiles with overlapping audiences. Then setup writes a per-profile ranking of the shipped patterns from the person's own samples. (L2-06)

**Bypass prevention.** Nothing stops Joseph typing "quick LinkedIn post on the forecast-error thing" and skipping the router entirely, degrading all three locks invisibly. Deferred because it is unpreventable in a chat harness and every attempt costs the breeze requirement. The recommended `PostToolUse` hook does not even fire in its own scenario, since an ad-hoc chat request writes no draft.md. **Do now, free:** one line in CLAUDE.md, "LinkedIn content requests go through /content-engine," and one question in the weekly review, "anything ship outside the engine? paste it," which back-fills the brief and the diff corpus within a week. **Trigger:** none; the reconciliation is the answer. (L4-05)

**Follower normalization in the score.** §11 divides by follower count and never captures it, and the divisor drifts against a rolling window. Deferred because §11 is post-MVP and the fix is a deletion: `rel_score = raw_score / median(raw_score, previous 20 posts)`, which is what §11's own threshold sentence already speaks in. **Trigger:** step 15. Apply it in the same pass, and make §12's third bullet read `rel_score` verbatim so §11 and §12 stop using two different denominators. (L9-01)

**Owned-account scraping.** The scrape buys three numbers per post that the post owner can read off his own post, and the benchmark half has no named consumer anywhere in §11. **Trigger:** step 15 again. Delete owned-account scraping then rather than now, because the §11 rewrite is one edit and doing it twice is worse than doing it late. Add `measured_at_days` to posts.csv and accept numbers only for posts at 7±1 days old, which buys the consistent measurement age the scrape was actually providing. (G3-02)

**A shared Daybreak org layer.** §15 leaves it open and FIX-32's notice covers the collision case read-only. Deferred because no MVP build item involves a second profile: step 2 runs on Joseph, step 8 is Joseph shipping, and the second human does not appear until step 9. **Trigger:** Fallon and Tim both have inventories in flight. Decide before that, per section 6. (L11-01, L11-03)

**Everything the review recommended that this document rejects outright**, so it does not come back as a suggestion: the (anchor x job) pair lock, the derived lock formula, refuse-to-draft on missing voice samples, the nine-field YAML schema per gate rule, the per-post paste ritual, the calendar OAuth connector, `setup-state.md`, the load-ledger file, the source-tier governance table for the algorithm file, an `examples/` directory with a sample inventory, report-only gate mode, and full-text outlier priors in learnings.md. Reasons are in the review's contradiction section and in the relevant fix above.

---

## 6. Decisions only Joseph can make

Seven. The review answered everything else.

**1. Cadence: is 4 posts a week a target or a constraint?**
§12 sets it and §15 still lists it as open. FIX-04 makes 4 a week sustainable from a 15-item seed, so the arithmetic no longer forces the answer. What is left is whether 4 is the right number for a 1.4k account in a category where the audience is senior operators.
Options: hold 4 and accept that some weeks run on thinner material; ramp 2 in month 1, 3 in month 2, 4 by month 3, gated on measured top-up yield.
**Recommendation: hold 4, with the ramp as a documented fallback.** Cadence is recoverable and a reader who has decided you repeat yourself is not, but under a shipped-post lock the repetition risk is now bounded, and shipping less than four a week in month one is a decision you can make on any given Tuesday without a rule. Delete §15's stale cadence bullet either way, since §12 already set it. (L6-02, L3-01)

**2. Do Fallon, Tim, and the company page get separate profiles or a Daybreak org layer?**
§15 bullet 2, unresolved, and it decides whether FIX-32's notice is enough.
Options: separate profiles plus the sibling notice; a shared org layer holding company facts with thin personal profiles on top.
**Recommendation: separate profiles plus the notice.** The org layer solves a real problem, shared company facts, and creates a worse one: an anecdote told by an individual and the same anecdote told by the vendor are not the same disclosure, and a shared learnings.md pools four accounts' evidence into hypotheses that fit none of them. Separate profiles keep every mechanism in §3 working as designed and cost one glob at run start. If the duplicate rate turns out to be real after Fallon and Tim have each shipped thirty posts, buy the lock then. (L11-01, L11-03, L11-05)

**3. Does the company page own inventory at all?**
Not in §15 but it follows from 2. A page has no story from before this job and no single "them" who can say a sample sounds right.
Options: full profile with its own interview and a named `owner:`; a page that reposts the three humans with a sentence of commentary and owns nothing.
**Recommendation: reposts only, until a named owner is willing to sit through the interview.** Otherwise the page's inventory is whoever ran setup, with a logo on it, and by October the page and that person are arguing the same beliefs in the same weeks. Whichever way this goes, the announcement register ("we're excited to share," "at Daybreak, we believe," "join us," first person plural with no named human, the announcement whose only news is that news exists) goes into ai-tells.md unconditionally, not behind a page flag, because Joseph hits it first in week two on a product launch. (L11-03)

**4. Does voice.md ever get seeded from `daybreak-comment-engine/voice/comment-register.md`?**
§15 bullet 3, currently recommending yes.
Options: yes for everyone; no for people and yes for the company page; no anywhere.
**Recommendation: no for joseph, fallon, and tim; yes for a company profile if one exists.** A comment register is a register for 20-word replies, so seeding a post voice from it is bad practice on its own terms, and doing it for three people with a heavily overlapping audience is the fastest available route to three employees who write identically. Add one line to §14: "voice.md is never seeded from another person's or a company's voice file. Registers describe a company; voice.md describes one human." FIX-25 makes the no-samples case survivable without it. (L11-02)

**5. How strict is clearance by default?**
FIX-47 adds the field. What it defaults to is risk appetite.
Options: default `public` and mark exceptions; default `anonymized` and require an explicit clear; default `do-not-publish` for anyone whose identity.md says `nda-default`.
**Recommendation: default `public`, with `nda-default` flipping the default to `do-not-publish` for that profile.** Defaulting everything closed makes the interview slower for the user who has nothing to hide, which is most of them, and a default nobody understands gets clicked through. The posture question at homework time is one question and it routes the two populations correctly. Also decide the anonymized bar: "how many companies could someone guess this is" needs a number, and there is no basis in the document for picking one. **Measure first:** across Joseph's real seed inventory, what fraction of items come back `anonymized` or `do-not-publish`. If it is most of them, the supply arithmetic in FIX-04 is worse than it looks and the answer changes. (G1-01, G1-03)

**6. Is the 20k follower goal a target or an ambition?**
FIX-43 deletes the ramp because it is derivable from the goal. The goal itself is yours.
Options: keep 1.4k to 20k in six months as a stated goal; keep it and mark it explicitly as an ambition that missing does not indict the engine; replace it with a measured number after the first eight posts.
**Recommendation: keep it, and add one sentence to §12 saying that missing it reads as a goal-setting error rather than an engine failure.** §12 already marks the outcome goals non-optimizable and already carries five controllable indicators, so the structure is right. What it lacks is permission to miss, and without that the pressure lands on the one lever that reliably produces out-of-network reach, which is an argument, on a scoreboard that pays 3x for comments. Do not substitute an invented number; nothing in the review has a basis for one. (L3-05, G2-06)

**7. Is the IBM mentor a real user or a design constraint?**
§2 lists her as secondary. §12 makes her the pass condition for portability. Most of the discipline in §1.2 and §1.3 is paid for by her.
Options: real user, keep the constraint and the test; design constraint only, in which case `profiles/_template/`, the no-fiction rule, and the portability corollary all get cheaper if relaxed.
**Recommendation: keep her as a real user.** The portability constraint is producing most of the good architecture in this document, including the write rule that FIX-03 is fixing rather than deleting, and the cost of keeping it is a README line and a preflight. Say plainly in §1 that "anyone who can run Claude Code" is the audience, so the claim stops being false, and let the constraint keep doing its work. (L8-03)

---

## 7. The five numbers to instrument first

From run one of step 5. All five are computed or cost one character; none requires a form, because a metric that requires typing stops being recorded by week three.

**1. `minutes_to_ship`, median over a rolling 20.**
Wall clock from invocation to run completion, computed, zero typing. Baseline comes free from the ten hand-written posts at step 8.
**Threshold:** median over posts 11 to 30 exceeding the step-8 hand-written baseline while the zero-edit rate is at or above 70% means the engine has lost to a text editor. Cut human-decision surfaces in this order: the weekly top-up, the two alternate hooks, then the angle rejects. Do not cut the gate.
**Why this one first:** the alternative Joseph defects to is not ChatGPT, it is writing the post himself, and §12 measures edit rate without ever measuring the clock. A tool can pass its own headline metric and still be slower than the LinkedIn box. (L8-06)

**2. Unlocked anchors and runway, printed at run start.**
`engine.js locks` returns both. No collection step.
**Threshold:** below 11 unlocked anchors the 10-post rotation cannot turn, and the engine should say so before it becomes a wall rather than after. Below 3 weeks of runway, the top-up stops being optional.
**Why:** this is the number that predicts the week four to seven inversion, and §12's current indicator is breached at post 11 and stays red forever, so it tells him nothing. (L6-02, L3-01)

**3. Net new inventory items per week.**
Counted from inventory.md appends. No collection step.
**Threshold:** under 1.5 a week by week 6 means cadence is capped at what the pool supports, and the honest answer is to drop to 3 posts a week, not to add a calendar connector. Over 2 a week means the pool grows and cadence can rise.
**Why:** replenishment is one unprompted question in the current design and it is the input that decides whether decision 1 in section 6 holds. (L6-03, L9-08)

**4. Gate fires on the person's own writing.**
Run `engine.js lexical` and `stats` over voice.md's pasted samples every time ai-tells.md changes. Report count and which rules fired.
**Threshold:** any fire on the person's own samples is a rule bug, and the rule gets struck per FIX-20. Not a tuning signal, a defect count, and the target is zero.
**Why:** §13's only gate test measures recall against 20 known-AI posts, so a gate that rewrote every sentence scores 100%, and false positives are the failure that kills the product because §14 makes the gate destructive rather than advisory. Track rewrites per 200 words alongside it, watched for going up (list bloat) rather than down. (L7-06, L4-04, L7-05)

**5. Pro-plan interruptions.**
`hit_limit` in posts.csv, one character on a bad day, default n. Plus `/cost` at end of day for the first ten working days in a scratch file, then delete the exercise.
**Threshold:** any week in which four short posts cannot complete on Pro. That is the actual question §4 item 9 was trying to answer, and it is binary.
**Why:** the model cannot observe its own token usage, so the column §4 asks for would fill with an estimate anchored to the target printed in the same session, and the one artifact designed to falsify the token design would instead confirm it. Measure the behaviour, not the proxy. (L5-06, L4-08)

**Already in §12 and kept:** posts shipped per week, zero-edit percentage on `run_again: +` posts, and median engagement against the trailing 20-post baseline. **Deleted:** gate catch rate, inventory depth as a raw count, the impressions ramp, and per-run token counts.
