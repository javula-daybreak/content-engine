# PRD: Content Engine

**For:** Claude Code.

> **Revision note, 2026-08-17.** This version folds in all nine of Joseph's comments from the Google Doc. Changed: §1 (portable is now defined), §5 (layout gained `_template/` and `inventory-archive.md`), §6 (interviewer prompt added, company and visual questions rewritten), §7 (compaction rules), §7a (new: profile write rules after setup), §11 (engagement scoring replaces the impressions dead end, cadence decided), §15 (Apify bullet resolved and removed). Unverified claims now carry an `[UNVERIFIED <date>, owner <name>]` tag.

> **Revision note 2, 2026-08-17.** Architecture pass on §1 through §4. Changed: §1 (split into 1.1/1.2/1.3; "SKILL.md and all sub-skills" resolved to one installed skill with one router and per-format workflow files; ships-with list expanded; nothing fictional ships; the write constraint now covers every run rather than setup alone), §3 (repetitive content expanded into three enforced locks, plus a new row for cross-format repetition and the structural-job check), §4 (renumbered to match §13's build order, render pipeline added as an explicit line item, repetition guard and repurpose refusal added, per-run token logging added with targets).

> **Revision note 4, 2026-08-17.** Added §7c (the harvest), which builds §7b's Tier 1 as a priming source for `/content-engine review` rather than as a connector feature or a background job. §15 decision 8 is now decided rather than open. Supporting amendments in §3, §4, §5, §7a, §7b, §8, §12.1, §13 (new step 9b), §13.2, §14, and §16.

> **Revision note 3, 2026-08-17.** Applied all 51 fixes from `content-engine-FIXES.md`, along with its revised build order, its per-step build conditions, its deferral list, its open decisions, and its five instrumented numbers. Both queued blocks from revision note 2 are now applied (see FIX-09 and FIX-10). The fixes document and the review behind it are archived at `archive/2026-08-17-content-engine-FIXES.md` and `archive/2026-08-17-content-engine-REVIEW.md`. **This PRD is the single source of truth.** Also added §7b (signals), which is new work rather than a review fix. Sections most changed: §3 (lock unit), §5 (load list, profile-scoped ledger), §6 (resumable two-session interview, clearance), §7 (schema), §9 (gate precedence, bounded rewrites, positive checks), §11 (learning loop), §12 (metrics), §13 (sixteen steps, `reference/engine.js`), §15 (eight open decisions), §16 (deferrals).

> **Revision note 4, 2026-08-17.** Visual pass. §10 rewritten against a teardown of 14 LinkedIn infographics from 3 creators, with the full spec split out to `content-engine-VISUALS.md` and the evidence archived at `archive/2026-08-17-content-engine-VISUAL-TEARDOWNS.md`. §10 previously gave infographics one sentence ("Infographics render as one PNG"), which specified nothing about which infographic to make. §10.4's six amendments to other sections are all applied: `archetype:` on brief.md (§5), the archetype lock row and the design-tell binding row (§3), the visual output line (§8), the `accent_2` question as §15 decision 9, and the build-order swap. **Infographics are now step 11 and carousels step 12**, which moved §4's cost gate onto infographic runs and §7a's theme.json writer onto the first visual run. `VISUALS.md` §10 decision 3 holds the case.

---

## 1. One-liner

A portable LinkedIn content engine that interviews a person once, builds a profile from their real material, and then writes short posts, creates articles, carousels, and infographics that read like that specific human wrote them.

Anyone who can run Claude Code can install it. Daybreak is just the first profile.

**Portable means what you download is the whole engine.** Every workflow, every reference file, every config template, and the render pipeline ship already wired to each other. Setup adds nothing but answers.

### 1.1 One skill, one router

There is exactly one installed skill and one entry point. `SKILL.md` is the router and it owns the shared pipeline: load profile, select inventory, cross into angles, draft, gate, log. `workflows/<format>.md` holds only what differs per format. `reference/pipeline/` holds each shared step's detail, loaded on demand.

Four separately installed skills would be four copies of the gate, the inventory locks, and the run log, and they would drift. Worse, a format skill entered directly bypasses all three. The router owns the pipeline or the non-negotiables in §3 are unenforceable.

Concretely, a short post run and a carousel run share five of eight steps:

| Step | Short post | Carousel | Owner |
| :- | :- | :- | :- |
| 1. Load profile, check staleness | yes | yes | router |
| 2. Select anchor item, check locks | yes | yes | router |
| 3. Cross into 5 angles, draft the best | yes | yes | router |
| 4. Draft | paragraphs | slide beats | workflow |
| 5. AI-tell gate, rewrite, diff, report | yes | yes | router |
| 6. Design-tell gate | no | yes | workflow |
| 7. Render | no | yes | workflow |
| 8. Log run, write brief front matter, ship keystroke | yes | yes | router |

`render/` sits behind one documented input contract: it takes slide HTML plus a profile's `theme.json` and returns files. Nothing else. That keeps the Playwright dependency off the writing path.

### 1.2 What ships

- `README.md`, whose first line is `git clone <url> ~/.claude/skills/content-engine` and whose second is `/content-engine setup`
- `SKILL.md`, the router and the shared pipeline. Its `description:` frontmatter names LinkedIn, post, carousel, and the setup interview, because that string is what the router matches on when the user types prose
- `workflows/` for setup, short-post, article, carousel, infographic, review
- `reference/pipeline/` for the shared steps: inventory selection, angle crossing, the gate
- all of `reference/`: `hooks.md` (35 named hook patterns), `angles.md` (14 named crossings), `inventory-prompts.md` (roughly 40 extraction questions), `ai-tells.md`, `design-tells.md`, `formats.md`, `archetypes.md` (the 15 infographic signatures and the selection procedure, see §10.2), `interview.md`, `engine.js` (the deterministic checks, see §13 step 3), `gate-fixtures/` (20 real known-AI posts with authors stripped, one expected-catch line each)
- `profiles/_template/` with empty files, their schemas, default theme tokens, and `analytics/posts.csv` carrying the §11 header row and no rows
- `render/` with templates and render.js
- `package.json` and `package-lock.json` with Playwright pinned
- a `.gitignore` excluding `profiles/*` except `_template/`, and `node_modules/`, so nobody pushes their inventory or their browser binaries by accident

Roughly two thirds of the engine's craft ships in the box. Hook patterns, angle crossings, post shapes, both gates, the interview, and the slide archetypes are true for everyone. Setup adds only the third that nobody else has: inventory, voice, thesis, identity, audience.

**Nothing fictional ships.** No example profile, no sample inventory, no placeholder stories. Everything factual this engine publishes traces to the interview, and a fake item sitting in the repo is a fact waiting to leak into a real draft. `gate-fixtures/` is not an exception, and it clears this bar by a different route than the sentence above originally assumed. The twenty posts there are AI-generated rather than harvested, so provenance is certain rather than inferred, and they are test input and never source material. What keeps them from leaking is structural rather than a promise: they live outside `profiles/`, they carry no `clearance:` field so nothing can admit them to a draft, §8's step-1 load list does not reach them, and every company in them is from the documentation-reserved set, Acme, Contoso, Northwind and Fabrikam. §13.2 step 4 records what that choice costs.

### 1.3 The write constraint

**Every run writes into `profiles/<handle>/` and nowhere else.** Not just setup. Runs and analytics live inside the profile for exactly this reason, per §5. If any run needs to modify anything outside a profile directory in order to work, portability has already broken.

The user clones the repo, opens Claude Code, types `/content-engine setup`, answers the interview, and has an engine that writes in their voice. No config file hand-edited, no skill authored by the user, no dependency installed manually, no credential entered anywhere. If reaching a first publishable post takes anything other than an interview, the engine is not portable yet. §12 holds the test that proves it.

---

## 2. Who uses it

- **Primary:** Joseph (Daybreak). Also Fallon, Tim, and the Daybreak company page.
- **Secondary:** anyone outside Daybreak. A mentor at IBM clones the repo, runs Claude Code, types `/content-engine setup`, answers the interview, and has a working engine with zero Daybreak in it.

**Design implication:** nothing Daybreak-specific goes in the skill logic. All company context lives in profile files that setup generates. If a string in SKILL.md says "supply chain" or "Daybreak," it is in the wrong file.

---

## 3. Non-negotiables

These are the failure modes. Each one gets an enforced mechanism, not a reminder.

| Failure | Mechanism |
| :- | :- |
| AI tells in language | `reference/ai-tells.md` runs as a hard gate before any draft is shown. Fail = rewrite, not warn. See §9 for precedence, bounds, and protected spans. |
| AI tells in design | `reference/design-tells.md` gate on the rendered HTML before screenshot, on carousel slides and on single-frame infographics alike, plus the mechanical checks inside render.js. §10.3 extends the list for the infographic path. |
| Repetitive content | Five locks, checked at run start against `profiles/<handle>/runs/*/brief.md`, counting only briefs with `status: shipped`. **Anchor item:** every piece consumes one. An item is off limits until 10 other pieces have shipped. **Thesis x hook pattern:** the same pair is locked 30 days, because two posts can use different material and still feel identical when the argument and the shape repeat. **Hook pattern alone:** no reuse within the trailing 8 shipped posts, and no more than twice in any trailing 20. **Archetype:** no reuse of a visual archetype within the trailing 5 shipped visual pieces. §10.2 selects the form deterministically from the shape of the material, so without this the same few signatures win every week; §3's job rule does not cover it, because that rule is repurpose-scoped and many-to-one over forms. Same mechanism and cost as the hook-pattern lock. **Verbatim overlap:** every draft is diffed against the last 20 shipped pieces. Any shared run of 8+ words, or more than ~15% sentence-level similarity to a single prior piece, is a hard fail and a rewrite. Not a warning. |
| Two formats saying the same thing | Every run logs a **structural job**: `argue`, `enumerate`, `sequence`, `compare`, `transform`, `diagnose`, `quantify`. Reusing an anchor item across formats is allowed. Reusing the job is not. A repurpose matching the source on anchor **and** job **and** thesis is refused at the brief, before any draft tokens are spent, and the engine returns three alternate angles read off live inventory state rather than a bare refusal. A thin repurpose is a bad idea, and rewriting a bad idea only produces a well-written bad idea. |
| Stale files | Every profile file carries `last_reviewed`, with per-file intervals rather than one global number: identity 180 days, audience 120, voice 90, thesis 90, inventory 30. `inspiration.md` and `theme.json` carry no `last_reviewed` at all, because a creator you liked in February is still a creator you like and a hex code does not go stale. Only files the current run actually loaded are flagged. Staleness gets at most one line of run-start output, most urgent wins. A confirmed answer to `/content-engine review`'s quarterly three-question check is what stamps `last_reviewed`; nothing stamps a file because a command merely read it. |
| Not agentic | One command goes idea to finished asset. The engine picks an angle and drafts it; the alternatives are visible, not blocking. It gates, renders, and self-critiques without being re-prompted at each step. |
| Needs a manual | `/content-engine` with no args does the obvious thing. Setup is an interview, not a form. No config file is ever hand-edited to get started. |
| Profile drift | Nothing enters a profile file unconfirmed, and only named commands write. See §7a. |
| A fact that should never have been captured | Every inventory item carries `clearance:`, set in the turn it is written. The gate rejects rather than rewrites on a clearance violation. See §7 and §9. Anything arriving from a connector defaults to `do-not-publish` and is cleared one item at a time, per §7c. |

**What run start is allowed to print.** The runway line from §12 (`N unlocked anchors, M posts of runway at current cadence`), one staleness line if anything the run loaded is past its interval, and up to three signal lines per §7b. The sibling-profile notice in §5 prints only when more than one profile exists. Nothing else, and none of it blocks: enter proceeds.

---

## 4. MVP scope

§13 holds the build order. This section holds only what is in and what is out, so the two cannot drift apart again.

**In:** the router and profile structure, the setup interview, `reference/engine.js`, the language gate with its fixtures, short posts end to end, brief front matter and the ship keystroke, the repetition guard, a minimal `/content-engine review`, the render pipeline with its overflow check, carousels and the design gate, infographics, and the repurpose refusal.

**Out of MVP, build after:** the harvest in §7c, LinkedIn articles, blog repurposing, and the Apify analytics loop.

**Rationale.** Three things make this beat a plain ChatGPT prompt: the gate, the inventory, and the repetition guard. Build those first or the rest is decoration. Everything visual is gated on §13 step 8, ten posts shipped and voice tuned against real edits. Do not build the visual system until short posts are landing.

**On the render pipeline.** It is the largest single build in the MVP and it was previously absent from the scope list even though carousels and infographics both depend on it. Naming it here keeps it from being discovered as a surprise in week five.

**On cost.** The engine has to be usable on a Claude Pro plan. The working budgets are roughly 15k tokens for a short post run and 35 to 50k for a carousel, and looking at a 1080x1350 image costs roughly 1,900 tokens every time. **[UNVERIFIED 2026-08-17, owner Joseph]** All three figures are budgets, not measurements. **There is deliberately no infographic budget**, because after §13's swap the first ten infographic runs are what produce one; inventing a fourth number here and then measuring against it is marking our own homework. The two things that keep a run inside them: load a compact inventory index and hydrate only the shortlisted items (§5), and run the design gate on slide HTML as text rather than on screenshots. The engine does not log its own token counts, per §14; the measurement method is in §12. **Gate on the visual path:** step 12, carousels, is greenlit only once ten completed infographic runs have a measured median. The numbers moved with the steps, per §10.4 amendment 3: the gate's job is to prove the render loop on the cheap single-frame format before the expensive multi-frame one is built, and before the swap it asked the expensive format to vouch for itself. It also named step 13, which is the repurpose refusal, a text feature with no render cost. A carousel costing 150k is a design failure in the render loop, not a fact about carousels.

---

## 5. Repo layout

```
content-engine/
  SKILL.md                       # router, phases, hard rules. no company specifics.
  README.md                      # clone target + first command. two lines that matter.
  package.json / package-lock.json   # playwright, pinned
  workflows/                     # setup, short-post, article, carousel, infographic, review
  reference/
    ai-tells.md                  # the language gate
    gate-fixtures/               # 20 real known-AI posts, authors stripped, expected catches
    design-tells.md              # the visual gate
    hooks.md                     # hook patterns + what makes them stop a scroll
    angles.md                    # 14 named crossings
    inventory-prompts.md         # roughly 40 extraction questions
    formats.md                   # post shapes: short, carousel, infographic
    archetypes.md                # 15 infographic signatures + selection. see §10.2
    interview.md                 # the setup script, see §6
    engine.js                    # deterministic checks. node, no dependencies. see §13 step 3
    pipeline/                    # shared step detail, loaded on demand
  render/
    templates/                   # slide HTML
    render.js                    # playwright: html -> png -> pdf, plus the overflow check
  profiles/
    _template/                   # empty files + schemas + analytics/posts.csv header. ships with the engine.
    <handle>/                    # e.g. joseph/, or jane-ibm/
      identity.md                # bio, role, credentials, what they sell, to whom,
                                 #   disclosure_posture, and owner: if not a person
      inventory.md               # THE KEY FILE. raw material, see §7
      inventory-archive.md       # retired items. never loaded at draft time. see §7
      voice.md                   # how they actually write, plus the four frozen setup measurements
      inspiration.md             # extracted behaviours only. never the source text.
      audience.md                # who they're writing for, what those people believe and are wrong about
      thesis.md                  # the 3-5 things this person argues, each with its `against:`
      theme.json                 # visual tokens. written by the first visual run, not by setup.
      learnings.md               # what has performed, updated by /content-engine review
      shipped-history.md         # optional. pre-engine posts, pasted at setup, for the diff corpus.
      connectors.md              # the harvest allowlist. opt-in, absent by default. see §7c.
                                 #   never loaded at draft time.
      runs/
        signals.md               # append-only signal ledger. see §7b.
        YYYY-MM-DD-<slug>/
          brief.md               # front matter: anchor, supports, job, hook_id, thesis_id,
                                 #   archetype, arm, tests_hypothesis, signal_id,
                                 #   private_terms, status. written before drafting.
                                 #   archetype is set on visual runs only.
          draft.md
          shipped.md             # written by the ship keystroke. the diff corpus reads this.
          gate-report.md         # what the gate caught, what changed, what it refused to touch
          slides/                # if visual
          final.pdf | final.png
      analytics/
        posts.csv                # one row per shipped post. header frozen in §11.
```

`runs/` and `analytics/` sit inside the profile because `runs/<slug>/draft.md` holds the person's raw material verbatim, and at the repo root it would fall outside the `.gitignore` rule §1.2 exists to enforce. There is no `runs/index.md`: nothing reads it, and the directory listing is the index.

**What a short-post run loads.** This list is authoritative. Nowhere else in this document restates it.

> identity.md, voice.md, thesis.md, audience.md, learnings.md (entries tagged `confirmed` only), the compact inventory index with only shortlisted items hydrated, and inspiration.md only when voice.md declares that no samples exist. `ai-tells.md` loads at gate time, not at draft time. It does not read the render templates, the design gate, or the inventory archive.

**Sibling-profile notice.** At run start, when more than one directory exists under `profiles/`, read `profiles/*/runs/*/brief.md` and print the last 14 days of sibling activity, one line each: date, handle, format, a readable anchor summary. Notice, not lock: Joseph sees that Fallon shipped that story Monday and picks another angle, and the shared-thesis case a hard lock would wrongly block stays available. It is read-only, so §1.3 is untouched, and it globs to nothing on a solo install.

---

## 6. Setup interview

`/content-engine setup` runs a conversational interview. Not a questionnaire dump. Ask a few at a time, react to the answers, dig where the answer is interesting.

It runs in two sittings and it is resumable. Running it again reads the profile and picks up where you stopped; it never recreates an existing profile.

### 6.1 The interviewer

This is the seed content for `reference/interview.md`. It is the persona and the rules; §6.2 is the ground it has to cover.

```
You are a taste interviewer. Your job is to extract the DNA of how this person
thinks, works, and sees their corner of the world, precisely enough that a later
Claude instance can write as them and be believed by the people who know them.

You are not writing a portrait. You are filling six files: identity.md,
inventory.md, voice.md, inspiration.md, audience.md, thesis.md. Every question
you ask traces to a field in one of them. If a question fills no field, cut it.
theme.json is not your job; the first visual run writes it.

<philosophy>
You are not here to be polite, and you are not here to be a form. Most people
cannot articulate their own taste. Asked what makes their writing theirs, they
say "authentic" and "data-driven." Asked what they believe, they recite their
company's positioning. Your job is to get underneath that.

The failure mode is not an awkward question. The failure mode is a profile made
of adjectives.

You get past it by refusing to accept a category when an instance exists. "We
help clients reduce forecast error" is a category. "I spent six weeks building a
dashboard nobody opened, and the planner it was for kept her own spreadsheet
because she had already watched two systems get switched off" is an instance.
Instances are the only thing this engine can write from.

An instance you could not say on stage with that customer in the room is still
an instance. Capture it, mark it do-not-publish, and keep going. It shapes the
thesis even when it never ships.
</philosophy>

<rules>
1. Never fill a gap yourself. You may propose, and you may propose something
   wrong on purpose to provoke a correction, but nothing enters a file until
   they have said it or confirmed it in their own words. Everything factual this
   engine ever publishes traces back to this interview. A detail you invent here
   becomes a lie on their LinkedIn six weeks from now.

1b. A true detail that was never theirs to tell is the same defect as an
   invented one, pointed the other way. Set clearance on every item in the turn
   you write it.

2. Two or three questions at a time, not twelve. React to the answer. Follow the
   thread that got warm, not your list.

3. Abstract answer, ask for the instance. Instance, ask for the number, the
   date, or the person who disagreed.

4. When an answer is interesting, do not move on. Three follow-ups on one live
   story beats one question each on ten dead ones.

5. "I don't know" is a real answer. Record it as a named gap in inventory.md as
   a `type: gap` row, do not paper over it, and come back later from a different
   angle. The weekly review reads those rows.

6. Do not compliment the answers. Telling them a story is great slows the
   interview and teaches them to perform for you.

7. Do your homework before the first question. See below.

8. Write as you go. Append each item to inventory.md in the turn it is
   confirmed, in the §7 schema, in their own words. One item, one write, never
   buffered to the end. If you cannot quote their exact words for an item, do
   not write it; ask again. The file is the state; the transcript is scratch.

9. If a lookup fails, say the lookup failed. Never write a creator's mechanics,
   a company fact, or a palette from memory.
</rules>

<homework>
Before you ask anything, look up their company. If it is large or well known
enough that you already know what it sells and to whom, do not ask what it sells
and to whom. That question announces you have done no work and burns the first
ten minutes on facts available elsewhere.

Ask positioning instead: which part of the company they sit in, what is directly
upstream and downstream of their zone, who hands them work and who they hand
work to, what the person one level above them is measured on, and what the rest
of the company misunderstands about their function.

If the company is small or unknown, ask the basics, quickly, and move on. Either
way, record in identity.md whether each fact came from research or from them.

Ask once, here: "If the company was large enough that you skipped the basics, it
is large enough to have a communications policy. Is there anything about your
work you are contractually not allowed to post publicly?" Record the answer in
identity.md as disclosure_posture: open | nda-default. If the profile is not a
person, also record owner: the named human who approves what ships.
</homework>

<stop_condition>
Session 1 ends when all four hold:

  - inventory.md holds 8 items in the §7 schema, each an instance rather than a
    category, each with clearance set
  - thesis.md holds 2 arguments you proposed and they corrected in their own
    words
  - voice.md cites 3 real pasted samples, or states plainly that none exist
  - one calibration post has run through the real §9 gate and they have said,
    unprompted, that it sounds like them

Close session 1 with: "you can post from this today; run /content-engine
inventory twice this week to reach 20."

Session 2 is the remainder and it is resumable. It ends when inventory.md holds
15 to 25 items and thesis.md holds 3 to 5 corrected arguments, each with its
`against:` captured.

Below the session 1 floor, say so and keep going. Do not let them stop early to
be agreeable, and never pad the count with items you wrote.
</stop_condition>
```

**The resume path is a read, not a state file.** Read `profiles/<handle>/`, count inventory items, find the first §6.2 section with no file written, continue there. There is no `setup-state.md`: the stop condition is already a predicate over files on disk, and a second copy of that state can only disagree with the first.

### 6.2 Sections to cover

Every section below carries a write instruction. Nothing is buffered to the end of the interview.

**Identity.** Name, role, company, tenure, what they did before, where they studied. Plus `disclosure_posture:` from the homework block, and `owner:` if the profile is not a person. *Write to identity.md as each fact is confirmed.*

On the company, do the homework first. If it is well known, skip what it sells and who it sells to. Ask instead which part of it they sit in, what is directly upstream and downstream of their zone, who hands them work, and what the rest of the company gets wrong about their function. Small or unknown company: ask the basics, quickly, and move on. Either way, mark in identity.md whether the fact came from research or from them.

**Raw material.** This is the longest section and the most valuable. Push for specifics:

- What's the most surprising thing you've learned in this job?
- What did you believe six months ago that you no longer believe?
- Tell me about something that went badly.
- What do people in your industry get wrong constantly?
- What's a number that surprised you recently?
- What's a story from before this job that still shapes how you work?
- What's an opinion you hold that your peers would push back on?

*Write each item to inventory.md in the turn it is confirmed, per rule 8, with `clearance:` set by asking: "Could you say this on stage with that customer in the room?" Where identity.md says `disclosure_posture: nda-default`, the capture-time default is `do-not-publish` and you clear items actively during the interview, where the marginal cost is one word.*

**Audience.** Who do you want reading this? What's their job? What do they believe that you think is wrong? What are they tired of hearing? *Write to audience.md.*

**Thesis.** After the above, propose 3 to 5 recurring arguments back to them and ask them to correct it. Do not ask them to state their thesis cold. People are bad at that. For each corrected thesis, ask one more question: "Who disagrees with this, and how would they put it?" Record the answer as `against:`, the strongest version of the opposing position in the words someone who holds it would use. *Write to thesis.md.*

**Inspiration.** Who on LinkedIn or elsewhere do you actually enjoy reading? Ask them to paste 3 to 5 posts from that creator, the text, not the URL. Never authenticate to LinkedIn to retrieve them, and if a public fetch fails, ask for the text rather than blocking. Extract the mechanics: sentence rhythm, how they open, how they close, whether they use white space, how personal they get. *Write the extraction to inspiration.md as behaviors, not adjectives. "Opens mid-story with no setup" is usable. "Engaging and authentic" is not. Store behaviours only; the pasted source text is discarded at the end of setup, so another writer's sentence can never reach a draft.*

**Voice sample.** Ask for the last three Slack messages they sent that ran longer than two sentences, and the last email they wrote that they did not template. If they would rather talk, take a two-minute voice memo and transcribe it. Anything unedited counts. Extract and record four measured values: average sentence length, sentence-length stdev, contraction rate, and whether they use fragments. Also note profanity, questions, and how they handle lists. *Write to voice.md with real examples pulled from their text, marked `source: pasted`, in the block schema that file documents: `- source: pasted` with `kind:` and a `text: |` body, the same shape `shipped-history.md` uses. The four measured values are frozen at setup and never overwritten, per §7a.* The schema is not cosmetic: `engine.js gate --negative` reads exactly these blocks to measure how often the gate fires on this person's own writing, §13.2 step 4's pass bar rests on that number, and a Samples section written in some other shape parses to zero samples and retires the whole control silently. `kind:` decides which rules apply, because §9's semicolon ban and every absence check are about posts rather than Slack messages.

Also accept recent LinkedIn posts as samples and store them in `shipped-history.md`, which §3's verbatim diff reads until 20 engine posts exist. Optional, and it never gates the interview.

**If they have no writing samples,** say so in voice.md explicitly. Do not refuse to draft. When voice.md holds zero `source: pasted` entries, the gate report's first line reads: "No samples of your writing on file, this draft is inferred, not matched. Paste anything you've written and I'll re-derive." Lean on inspiration.md until they've shipped 10 posts, then re-derive voice from what performed.

**Visual.** Not asked at setup. The first visual run pulls a palette, shows two real rendered frames, and writes theme.json then; after §13's swap that is normally `/content-engine infographic`. When that pull happens, bound it: curl the homepage, pull first-party stylesheet hrefs, `grep -oE '#[0-9a-fA-F]{6}' | sort | uniq -c | sort -rn | head -8`. No brand-asset API, no key, ever. If the pull fails, or they are building a personal brand with no company behind it, ask for one color directly.

**End of session 1.** Generate one sample post from a named inventory item, run it through the §9 gate, and show the post plus the gate diff. Ask "does this sound like you?" and iterate until yes. Log it like any other run: write the run directory, write brief.md, append the posts.csv row, consume the anchor. This is the one draft in the product shown without its rejected angles, and §14 names the exemption. That iteration is the real calibration.

---

## 7. The inventory (the core mechanism)

This is what makes the engine produce "my time at UTD ties to what I see at Daybreak" instead of another post about Daybreak.

inventory.md is a structured store of the person's raw material. Every entry:

```
- id: utd-group-project
  type: story | belief | number | failure | observation | credential | gap
  content: one to three sentences of the actual raw material
  tags: [education, teamwork, forecasting]
  connects_to: [thesis-2, thesis-4]
  source: interview | pasted | derived | proposed
  clearance: public | anonymized | do-not-publish
```

`clearance:` is required and set in the same turn the item is written, by one question: "Could you say this on stage with that customer in the room?" It is carried in the compact inventory index, not only in the hydrated item, so the router filters before angle-crossing spends tokens. Every other field in this schema describes origin, content, linkage, or lifecycle; `source:` answers who said this and never who may hear it.

There is no `used:` field and no `performance:` field. Both were denormalized copies of state the run log already holds, and §7a's append-only rule made both unwritable. Lock state lives in `runs/*/brief.md`, per §3.

**Rules:**

- Every piece names one `anchor:` item in the brief, and may cite up to four `supports:`. Only the anchor consumes a lock. A support is a citation, not a consumption.
- An anchor is off limits until 10 other pieces have shipped. Shipped means it has a row in posts.csv. The engine picks another or says the inventory is thin and prints the runway number.
- Setup session 1 seeds 8 items and session 2 reaches 15 to 25. Below the floor, the engine says so and keeps interviewing.
- An item marked `do-not-publish` retires to inventory-archive.md immediately, regardless of use or lock, and `/content-engine inventory` skips it when duplicate-checking.

**Growth and compaction.** inventory.md is append-only. Never rewrite an entry, never delete one.

The limit is not the context window. A 40,000 token inventory fits inside Opus and still makes every draft worse, because the model's attention spreads across a hundred items when the draft needs five. So the cap goes on what a run loads, not on what the file stores. §5 holds the load list.

- **Archive:** inventory-archive.md holds retired items. Never loaded at draft time. Read only by `/content-engine inventory` when checking whether a new item duplicates an old one.
- **Retirement:** an item is eligible when it has been used and is past its lock. Offered at `/content-engine inventory`, never done silently. Unused items never retire.

**How inventory actually grows.** Not mainly through a scheduled chore. The most plausible path is as a byproduct of posting: `/content-engine post "<pasted raw material>"` appends what you pasted on accept. The systematic top-up runs weekly inside `/content-engine review`, primed from three sources already on disk: the `type: gap` rows §6.1 rule 5 records, the composition of inventory itself (11 stories and 1 number means ask for a number, which is a row count rather than a model call), and whatever was pasted into `/content-engine post` that week. The top-up loads reference/interview.md's philosophy block and rule 3. It is never fired after a draft run; a weekly-framed question asked four times a week trains refusal by construction.

**Angle generation** = one inventory item, crossed with one thesis, aimed at one thing the audience believes and is wrong about, or is tired of hearing. That crossing is where the non-obvious posts come from, and the third term is what supplies a counterparty. A join of item x thesis x anxiety can only produce illustrations. Generate 5 angles, draft the best, and print the other four as one-liners under the finished draft. Never draft the first angle you thought of.

---

## 7a. Profile write rules (after setup)

Setup builds the profile from scratch. This section governs everything after, so that six months in it is still clear which lines a human said and which the engine guessed.

**What "profile file" means.** The curated files listed in §5: identity.md, inventory.md, inventory-archive.md, voice.md, inspiration.md, audience.md, thesis.md, theme.json, learnings.md, shipped-history.md, connectors.md. `runs/` and `analytics/` are the run ledger, and every run appends to them. That is the whole of §1.3's write scope: profile files are governed here, the ledger is written by every run.

**Provenance.** Every entry in every profile file carries `source:` of `interview`, `pasted` (their own writing, verbatim), `derived` (extracted from their samples), or `proposed` (the engine's guess, human-confirmed). Nothing is written as `proposed` without confirmation in the same turn. Anything unconfirmed is not written at all.

**Only named commands write to a profile file.** Setup creates. After that, `/content-engine inventory` appends to inventory.md, `/content-engine review` appends to learnings.md and to inventory.md for each harvest candidate the human clears, `/content-engine connect` writes connectors.md, `/content-engine retract` appends a `withdrawn:` line, and the first visual run writes theme.json once, which after §13's swap is normally the first infographic run. Nothing else writes to a profile file, ever.

**The paste path is the one write a draft run may make, and it is `inventory`'s writer rather than a new one.** `/content-engine post "<pasted raw material>"` appends what the human pasted through the `/content-engine inventory` path, verbatim, as `source: pasted`, with `clearance:` set in the same turn and the run slug recorded, and only once they have accepted the draft. It never writes anything the model derived, inferred, or rewrote, and a run drafting from standing inventory writes nothing at all. A draft run otherwise reads profile files and never modifies them, so no post can quietly change who the engine thinks you are: the only line a post can add is one the human typed into it. §7 names this as the main way inventory actually grows and §8 already documents the write, so a build that omits it makes §12.1's metric 3 read low and fires §7c's connector on a number the engine created.

**Append, never rewrite.** inventory.md and learnings.md are append-only. Correcting an entry means appending a new one carrying `supersedes: <old-id>`. The old line is never touched. An item named by any entry's `supersedes:` is excluded from the draft-time load.

**Re-derivation is explicit and diffed.** The prose in voice.md and thesis.md can be regenerated once real posts exist (§6 already calls for this after 10 posts). It happens only on request, the engine shows a line diff, and it does not write until you accept. **The four measured values recorded in voice.md at setup are frozen and never overwritten.** Drift is only detectable against a fixed baseline; if re-derivation can overwrite February's numbers, nothing can tell whether the voice converged or the person stopped editing.

**Staleness.** Per-file intervals, per §3. Only files the current run loaded are flagged. Initial `last_reviewed` values are never backdated to stagger them, because that writes a false date into a provenance field on day zero.

---

## 7b. Signals (the clock)

§7's crossing is a closed set. Everything the engine can say traces to an interview that happened once, which produces two named defects: the crossing has no clock, so nothing in it knows what happened this week, and the pool only grows through a chore. Signals are the fix for both. A signal is a reason to post today. It is never the subject of the post.

**Two mechanisms, not one.** They have different privacy profiles and different failure modes, and building them as one feature is how this goes wrong.

- **External signal** answers *why post today*: a competitor's claim, a number someone published, a credible person arguing the opposite of a thesis in thesis.md.
- **First-party raw material** answers *what you actually think, in your words*: the person already writes thousands of words a week in Slack and email, arguing real positions with real specifics. That is inventory, not news, and it is the higher-value half.

### Tiers

**Tier 0 ships in the box.** WebSearch is built into Claude Code: no credential, no MCP server, no token, no manual setup. It satisfies §1.3 as written and it works identically for Joseph and for the IBM mentor.

**Tier 1 is opt-in and sits outside the portability guarantee.** Slack and email only; calendar was considered and decided against in §15 decision 8, because it was the lowest-risk source and also the one with the least prose in it. **The engine must produce identical output quality with zero connectors.** Connectors raise the ceiling; they never raise the floor. §12's portability test and §13 step 9 run with every connector off. Anything a connector supplies degrades to a Tier 0 equivalent or to nothing. §7c is what builds this, and it is not a signal feature.

### What to search for

Not the company name. "Daybreak news" returns your own press release, which is noise. The high-yield query is the thesis's opposition: the people who argue the other side, the category's benchmark claims, the number someone published that you think is wrong. Queries derive from `thesis.md` (including each entry's `against:`), `audience.md`, and only then `identity.md`. The same holds for a large-company user: an IBM VP posting about IBM earnings is the announcement genre §9 already bans. What is useful to them is their category's live arguments and their own team's specifics.

### The four buckets

Categorized by what the signal licenses you to say, not by event type. An event-type taxonomy (funding, launch, hire, award) maps one to one onto the cliché genres and is the wrong axis.

| Bucket | Trigger | What it becomes |
| :- | :- | :- |
| **proof** | Evidence for a thesis already in thesis.md | An occasion. The thesis is the post; the event is the receipt. |
| **contradiction** | Someone credible publicly argued against a thesis in thesis.md | An occasion, and the highest-value one, because it supplies the counterparty §7's crossing needs. |
| **access** | A fact nobody outside holds: a number, a room you sat in, a customer sentence | Not a post. An inventory item, appended through the §8 path, with `clearance:` set at capture. |
| **noise** | Everything else | Never surfaced. This is the default and most signals land here. |

### The five rules that keep this from producing slop

1. **A signal is never a subject.** It surfaces only if it links to an existing `thesis_id` as proof or contradiction. No thesis link, no surface, no exceptions. This mechanically forbids the announcement post, because a funding round is not evidence for or against anything the person argues.
2. **The signal is the occasion; the inventory item is still the substance.** §14's anchor rule is untouched. `signal_id:` is a field on brief.md, not a replacement for `anchor:`.
3. **Zero signals is a normal output, and a common one.** Any system obligated to produce a suggestion daily produces slop daily. Cap surfaced signals at three per run.
4. **No quote, no signal.** Every entry carries a source URL or message permalink plus a verbatim quote of 25 words or fewer. A signal that cannot be quoted does not exist. §14's never-invent-a-fact rule needs this extension because news arrives pre-summarized and invites paraphrase drift.
5. **Signals expire.** Seven days for proof and contradiction. Access items never expire, because your own sentence from March is still yours.

### Clearance for private sources

Every signal carries `visibility: public | private`. Private means it came from Slack, email, calendar, or Drive.

**A draft may not contain a proper noun, number, or verbatim phrase whose only source is a `private` signal.** brief.md carries a `private_terms:` list and the §9 gate hard-fails on a literal string match. This is mechanical, not a judgment call, and it reuses a gate that already runs on every draft and already has authority to reject. What survives is the abstraction: "a Series B fintech told us their eval took six weeks" ships, "Acme told us" does not.

Private material never reaches inventory.md without an explicit confirm at the moment of capture, showing the exact sentence and its source, per §7a. The failure this prevents is specific: the engine reads #deals, drafts a good post about a named customer's timeline, and the person approves it at 8am on a phone.

### Storage

`profiles/<handle>/runs/signals.md`, append-only. It is ledger, not a profile file, so §7a permits any run to append and no new named writer is needed.

```
- id: sig-2026-08-16-a16z-agents-ui
  kind: proof | contradiction | access
  visibility: public | private
  source: https://... | slack:#deals/p1723...
  quote: "agents are fundamentally a UI problem"
  contradicts: thesis-2        # or supports: thesis-2
  captured: 2026-08-16
  expires: 2026-08-23
```

Dedup reuses the lock mechanism: a signal whose id appears in any brief.md is never surfaced again. No mutable status field, consistent with §7's reason for deleting `used:`.

### The run

The scan runs at the top of the default run, and only when signals.md is older than 24 hours. Capped at three queries. Run start gains one block above the §3 runway line:

```
14 unlocked anchors, 9 posts of runway at current cadence.
Signals since Aug 15:
  1. contradiction  a16z partner, Aug 16: "agents are a UI problem"   (cuts thesis-2)
  2. proof          Anthropic, Aug 15: "evals now gate deploys"       (backs thesis-1)
[enter] standing inventory
```

Enter is the default and it is the old behaviour, so this adds no blocking decision. Picking a signal sets the run's occasion and the pipeline proceeds unchanged from §1.1 step 2. The scan costs wall clock, and `minutes_to_ship` will price it honestly: if it is too expensive, that shows up in the number rather than in an argument.

### Not building

No notification daemon, no RSS, no sentiment scoring, no per-source credibility model, no competitor dashboard, no taxonomy beyond the four buckets. Add when the buckets demonstrably fail to sort real signals, not before.

---

## 7c. The harvest (first-party raw material)

§7b named this corpus in one line and did not build it. This section builds it, and it settles §15 decision 8.

**What it is.** A person writes thousands of words a week in Slack and email, arguing real positions with real specifics, in their own unedited voice. That corpus is inventory, not news. A win or a loss from last Thursday is a `type: story` or `type: failure` item; it carries no `thesis_id`, it never enters signals.md, and it is not an occasion for anything. Collapsing the two is the first way this goes wrong. §7b answers *why post today*. The harvest answers *what do you actually have to say*, which is the half the engine starves for by week six.

**It is a command inside this engine, not a second skill.** §1.1's argument applies harder here than anywhere else in the document. A separate skill that appends to inventory.md bypasses §7a's write rules, the `clearance:` field, and the gate, and it drifts from all three inside a month. There is one router.

**No new `source:` value is needed.** The filter below discards anything the person did not write, so every surviving candidate is `source: pasted` under §7a's existing definition, verbatim and theirs.

### Not a daemon

The harvest is a fourth priming source for `/content-engine review`, alongside the three §7 already names. Review is already weekly, already the ritual, and already the named writer to inventory.md. It is not a background job, not a cron entry, not a scheduled task.

What "an agent worked while I slept" is worth is that nobody had to go hunting, and a forty second sweep at the top of the weekly review delivers exactly that. It costs one priming source instead of a scheduler, a wake path, a delivery surface, and a laptop-was-closed-on-Sunday failure mode. §7b's not-building list already refuses a notification daemon and that refusal stands. If the asynchrony wants to be felt, that is a line of output, not an architecture.

### Scope

**Allowlist only. "All of Slack" is not a scope and is never offered.** Named channels plus a named Gmail label or query, declared once by `/content-engine connect` and written to `profiles/<handle>/connectors.md`. That file exists so the scope can be audited by opening it, in five seconds, without reading any code. It is not loaded at draft time and it is not in §5's load list.

**The engine never holds a credential.** Slack and Gmail reach it as MCP servers the user authenticated inside their own Claude Code, outside this repo. The engine asks for a channel name, never a token, so §1.3's "no credential entered anywhere" survives intact. A server that is not connected makes the harvest report that and the review proceed unchanged, which is §14's no-connector-is-ever-required rule holding rather than being argued about.

### The filter runs before the model

Discarding is deterministic and free, so nothing model-priced ever touches the discard pile:

- anything from a bot, app, or integration sender
- anything the person neither wrote nor was directly addressed in
- calendar invites, notification senders, digests, automated reports
- threads under a word floor

Teams noise and calendar noise are a sender blocklist, not a judgment call. Whatever survives, the model reads and sorts into §7b's four buckets, where `access` is the bucket that matters and the other three are usually empty.

### Clearance is inverted here

**Every harvested candidate is written `clearance: do-not-publish` and requires an active clear.** That is the opposite of §15 decision 5's default for interview items, and the asymmetry is the point. An interview has a human in the loop quietly declining to say things. A sweep has no such filter, so it surfaces material the person would never have volunteered, and a default that ships is a default nobody reads.

**Counterparty consent is the objection that survives, and the existing mechanism covers only half of it.** The person consented. The customer who wrote that sentence in a thread did not. §7b's `private_terms:` string match at the gate protects publication, so "a Series B fintech told us their eval took six weeks" ships and the name does not. It does not protect capture. Email is the harder case than calendar precisely because it holds other people's prose rather than other people's availability, which is why the clear is per item and why nothing is ever bulk imported.

**The failure this is designed against is one specific Tuesday.** The engine reads #deals, drafts a genuinely good post about a named customer's timeline, and the person approves it at 8am on a phone. Every rule in this section exists to make that morning impossible.

### The run

```
/content-engine review

Harvest, Aug 10 to Aug 17: 6 candidates, 31 discarded.

1. #deals, Thu 14th, you:
   "they had already killed two systems before us, that is why the pilot
    took six weeks instead of two"
   type: story        clearance: do-not-publish
   [c]lear  [a]nonymize  [s]kip

2. mail, label:wins, Fri 15th, you to the Northwind team:
   "we are at 94% on the reorder set and they still will not turn off
    the manual override"
   type: observation  clearance: do-not-publish
   [c]lear  [a]nonymize  [s]kip
```

One keystroke per item, inside the ritual that was already happening. Cleared items append to inventory.md with `source: pasted` and the message permalink, through the `/content-engine review` writer, per §7a. **Skipped candidates are not stored anywhere.** A rejected-candidate ledger is a copy of someone's inbox sitting in a profile directory, which is the thing the `.gitignore` in §1.2 exists to prevent, arrived at by a different route.

### When the engine offers it

**Not at setup, and never as an unprompted proposal to read someone's email.** Setup is the moment of maximum distrust in the product's life: the person has no evidence yet that the engine is any good, and the first thing it would do is ask for their inbox. §12's portability test runs with every connector off and the IBM mentor would fail it on the ask alone.

The offer fires on a number instead. When §12.1's metric 3, net new inventory items per week, comes in under 1.5 at week 6, the chore is demonstrably failing and the weekly review prints one line offering `/content-engine connect`. Earned by evidence rather than asked at the wrong moment.

### Kill criterion

Fewer than 2 cleared in every 10 candidates surfaced, cut it. At that rate the person is reviewing their own inbox with extra steps, and §12.1's metric 3 shows it directly rather than by argument.

### Not building

No scheduler, no background job, no daemon. No calendar, no Drive, no Notion, no ticket systems. No rejected-candidate store. No auto-clear heuristic, ever, at any confidence level: the whole value of the inverted default is that a human said yes to this exact sentence.

---

## 8. Commands

```
/content-engine setup                    # interview -> profile. resumable, run it again any
                                         #   time; it reads the profile and picks up where you
                                         #   stopped. never recreates an existing profile.
/content-engine                          # default: 5 angles, drafts the best, prints the four
                                         #   rejects underneath. one keystroke to a finished post.
/content-engine post <topic|angle>       # short post on a given thing
/content-engine post "<pasted material>" # drafts from text pasted this morning, in the same run.
                                         #   on accept, appends it via the /content-engine
                                         #   inventory path with source: pasted and the run slug.
/content-engine carousel <topic>         # 6-10 slide PDF
/content-engine infographic <topic>      # single image
/content-engine as fallon                # scopes a SINGLE invocation. does not persist.
                                         #   with several profiles installed and no `as`, ask.
/content-engine inventory                # top-up interview, append to inventory.md
/content-engine connect                  # declare the harvest allowlist. opt-in, absent by
                                         #   default, writes connectors.md. see §7c.
/content-engine review                   # weekly. reconcile shipped, log performance, sweep the
                                         #   harvest allowlist if one exists, run the primed
                                         #   top-up, update learnings.md
/content-engine retract <slug|item-id>   # withdraw a fact or a piece. see below.
```

Default with no args is the daily driver. It should feel like one keystroke to a finished post: one line above the post (`angle · anchor · job`), the post, the four rejected angles as one-liners, the ship question. Nothing else.

**The visual path prints one field more.** `/content-engine carousel` and `/content-engine infographic` print `angle · archetype · anchor · job` in the same position, because the archetype is what §3's fifth lock is checked against and nobody reading the run log later can recover it from the image. When §10.2's selection finds nothing that fits, the refusal replaces the block and names the deficit.

**Profile echo.** With `as`, print `[profile: fallon]` as the first line of output and again immediately above the copy block, fenced separately so it cannot be pasted with the post. Zero state, and a wrong-profile run becomes visible one step earlier.

**Retraction.** `/content-engine retract` appends `withdrawn: <date> <reason>` to the named inventory item, permanently excludes that item from the draft-time load regardless of any lock or retirement rule, and writes a one-line `WITHDRAWN` marker into the run directory. Without it, an item discovered to be false but never used is permanently ineligible for retirement, permanently in the active set, and permanently readable by every draft run, while §14 makes inventory.md the sole source of every published fact. This is a command you hope never to run and it costs nothing on the days you do not.

**The ship keystroke.** Every run ends with "Shipped as written? [y/n]". `y` copies draft.md to `runs/<slug>/shipped.md`, flips brief.md's `status:` to `shipped`, appends the posts.csv row, and increments §12's zero-edit numerator. `n` prompts for a paste, or defers to the weekly review. One character on 70% of posts is what makes `/content-engine review` have a candidate list, §3's diff corpus able to tell published from abandoned, §12's flagship metric computable, and §11's join key a value that actually exists.

---

## 9. The language gate

`reference/ai-tells.md`. Runs on every draft before the human sees it, including the calibration post at the end of setup session 1. Output a gate-report.md showing what was caught. This file is the single highest-value asset in the repo. Treat it as living.

**Precedence: voice.md wins.** A tell that contradicts a documented habit in voice.md does not fire for that profile. The gate records the override in gate-report.md instead of rewriting. A shared, person-independent blocklist does not get to silently overwrite the one file that knows what this person sounds like.

**Seed list. Structural:**

- Antithesis: "it's not X, it's Y" / "isn't just X, it's Y" / "X isn't the problem. Y is."
- Rule of three in any list where three wasn't required by the content
- Perfectly parallel bullet structure
- One-word or two-word rhetorical paragraph: "The result?" "The kicker?" "Here's the thing:"
- Closing paragraph that restates the post
- Ending on "Thoughts?" or "What's your take?"
- Opening with "I've been thinking a lot about"
- Every paragraph the same number of lines

**Lexical:**

- Em dash. Zero tolerance. En dash too, except between digits.
- Semicolons, in short posts only
- delve, unpack, dive in, leverage, robust, seamless, landscape, realm, testament, tapestry, navigate the complexities, at the end of the day, game-changer, no-brainer, double down, moving the needle, in today's fast-paced world, the reality is, let that sink in
- "Not only X but also Y"
- Hedged openers: "In many ways," "It's worth noting that"

**Announcement register**, applied to every profile including personal ones, because a product launch hits this in week two:

- "we're excited to share," "we're thrilled to," "we're proud to," "at <Company>, we believe," "join us," "stay tuned," "more in the comments"
- First-person plural with no named human anywhere in the post
- The announcement-shape post whose only news is that news exists
- A customer quote deployed as testimonial

**Texture:**

- No fragments anywhere. Humans use fragments.
- Zero contractions, or 100% contractions. Both are tells.
- Emoji used as bullet points
- Hashtag stacks at the bottom
- Title Case Headers Inside A Post

**Positive checks. The gate can fail on absence, not only on presence.**

- **Specifics floor.** Count named people, companies, dates, and numerals. A draft with none is redrafted, not rewritten. An abstraction cannot be patched into an instance.
- **Voice floor.** Flag when a draft's sentence-length stdev, or its contraction rate, is more than 25% below the value recorded in voice.md at setup. Where no samples exist, fall back to absolute floors: flag if no sentence is under 6 words or none is over 25.

**Clearance rejection, not rewriting.** A draft that names a company, a person, a role-plus-employer-plus-timeframe triple, or a figure whose source item is not `clearance: public` is rejected and redrafted. Rewriting a disclosure only produces a better-written disclosure. This is the same argument §3 already makes about the repurpose refusal.

**Private-source rejection.** A draft containing any literal string in brief.md's `private_terms:` is rejected and redrafted. That list holds every proper noun, numeral, and distinctive phrase whose only source is a `private` signal, per §7b. This is a string match owned by `engine.js lexical`, not a judgment call, because the material it guards is the kind a tired human approves at 8am.

**Gate behavior:** catch, rewrite, then show a diff of what changed and why. Do not just flag it and hand it back. Rewriting is the point. Four rules bound it:

1. **Re-measure.** After any rewrite pass, re-run the gate on the rewritten text. Every distribution-shaped rule here is otherwise evaluated against text the gate is about to change, which lets the gate flatten a draft and report a clean pass on the flattening it caused.
2. **Substitute, never subtract.** Removing an em dash means replacing it with a comma, colon, or parenthesis. Resolving any lexical violation by splitting the sentence, deleting the clause, or dropping the punctuation entirely is not a valid rewrite.
3. **Bounded, and it always produces an artifact.** Cap rewrites at 3 per 200 words and never rewrite the same span twice. Above the cap, return to brief.md and redraft once with the tripped rules injected as drafting constraints, because a model composing under a constraint writes around it while a model patching eleven violations contorts. If the redraft still exceeds the cap, ship the better draft with one line naming what is unresolved, for example `gate: could not clear [uniform sentence length]`, and let the human decide. No run ends without an artifact. The 3 is a knob to tune against the ten posts at §13 step 8, not a measured constant.
4. **Protected spans.** The gate never rewrites inside quotation marks, and never alters a numeral or a proper noun anywhere. When a banned item appears inside a protected span, the gate reports it under a separate gate-report.md heading, `not rewritten: quoted or factual`, and leaves the text alone. Matching drafting instruction: when a draft uses an inventory item's words verbatim, it puts them in quotes. "Double down," "moving the needle," "navigate," and "leverage" are all on the ban list and all appear in how supply chain operators actually talk; a silently edited quote from a named person is §14's most important rule broken by §9's own mechanism.

**Which half is deterministic.** `reference/engine.js` owns the exact work: 8-gram overlap, the lexical list, contraction rate, sentence-length stdev, comma density, specifics count, hashtag counts, and the lock read. It returns JSON that gate-report.md quotes verbatim, so the report is auditable rather than self-witnessed. The model owns the judgments: antithesis, unearned rule of three, restating close, hedged openers, the announcement shape, angle generation, drafting, and the clearance read. "Zero tolerance" is a promise only the deterministic half can keep, and this paragraph is what makes that honest.

**Maintenance.** When Joseph spots a new tell in the wild, he says so and it gets appended with the date. Entries can also be retired: a rule that fires on the person's own writing, or on an inspiration.md post, gets struck through with the date and the reason, so it stops firing and stays visible. A rule that turns out to be wrong otherwise costs a rewrite of good writing on every future draft forever, and precision can only decay.

---

## 10. Visual system

> **Revision note, 2026-08-17.** Rewritten after a teardown of 14 LinkedIn infographics from 3 creators in unrelated niches. `content-engine-VISUALS.md` holds the full spec: 15 archetype signatures, the selection procedure, the data path, and the measured craft rules. It is not a planning document; §2, §3, and §5 of it become `reference/archetypes.md` at §13 step 11, and §6 becomes additions to `reference/design-tells.md`. The evidence is archived at `archive/2026-08-17-content-engine-VISUAL-TEARDOWNS.md`. This section holds only what the PRD itself must carry, and §10.4 names the six amendments the spec requires elsewhere in this document.

**Render path:** Claude writes HTML using `render/templates/` and the profile's theme.json. Playwright screenshots at 1080x1350 (4:5, maximum feed real estate). Carousels merge PNGs to a single PDF for document upload. Infographics render as one PNG.

**theme.json's keys**, which are the documented input contract §1.1 refers to: `bg`, `fg`, `accent`, `muted`, `font_head`, `font_body`, `scale` (dense | airy), `radius`, `rule_weight`. Nothing else. `_template/theme.json` ships with defaults that clear the design gate unedited, because the first visual run writes the real values. One addition is proposed and not settled, and it is not made in passing elsewhere: a second semantic accent, `accent_2`. It is §15 decision 9. An attribution-posture flag was proposed as a tenth key in the same pass and withdrawn, because two sections were independently adding a different tenth key to a nine-key contract and only one of them earns it; the signature in §10.3 is hardcoded, and anyone who wants a CTA bar can ask and get one edit.

**Why not Canva or Figma:** template-driven output looks like everyone else's output, which is the visual version of the em dash. Both add a dependency that breaks portability for a user outside Daybreak. HTML in the repo means the theme is config, Claude can iterate in a render-look-adjust loop, and it version controls.

### 10.1 The two-layer law

Measured across all 14 reference images at 220px, roughly the size a LinkedIn image first appears at in feed. In every one, body text became illegible and in 11 of 14 the subtitle went with it. Ink coverage ranged 7% to 66% and both extremes worked, so density is not the variable.

**Every visual is two documents on one canvas.** The feed layer is the headline plus the structural silhouette. The stop layer is everything else, invisible until someone taps. **The claim must be complete in the feed layer alone**, and the subtitle is where scope and provenance live precisely because nobody reads it while scrolling.

This generalizes to carousels unchanged: slide 1 has to survive at 220px or the swipe is never earned. It is the same rule §10's existing "slide 1 that is just a title" tell was reaching for.

### 10.2 Infographics are a selection problem

"Infographics render as one PNG" was this section's entire treatment of the format and it specified nothing that matters. The format's real content is **which** infographic, and that is not a taste call.

`VISUALS.md` §2 holds the procedure, and it ships as `reference/archetypes.md` rather than living in this document. Three things from it are load-bearing enough to state here:

- **The material selects the form, never the topic.** Fifteen signatures, each stating what it requires and what disqualifies it. A disqualifier is fatal and no question clears it: six channels summing to 100 do not fail a bar chart on a count, they fail it because bars assert independent magnitudes.
- **The engine refuses when nothing fits**, and offers a short post. The alternative is a quote card, which is the visual em dash and the most common AI-made LinkedIn image in existence. The refusal names the actual deficit and what to go and get. This is the same posture as §3's repurpose refusal.
- **Clearance is checked before selection, not after drafting.** Seven of the fifteen signatures require named entities. §9's clearance rejection covers prose; nothing covered images, and an image cannot be edited after posting. Any entity not `clearance: public` makes every named-entity form unavailable, and the engine does not anonymize its way out.

**Data-carrying infographics.** Six signatures need a fact that must be true in the world. The user may supply it; Claude may research it only after asking and being told yes. The confirmed table is appended to `inventory.md` through `/content-engine inventory` **before anything renders**, so the number has an id, becomes the anchor, consumes its lock per §7, and is reachable by `/content-engine retract`. A number that renders without one of those is outside §14. Every data image carries method and sample in the subtitle and the source in the footer; an unfilled `source_name` fails the build.

### 10.3 design-tells.md

The existing list stands for carousels. `VISUALS.md` §6 adds roughly thirty infographic-path entries and proposes two changes to existing ones, of which **only the centering revision is a revision**: "everything centered" was violated by 9 of 14 reference images and is wrong as stated, because a radially symmetric diagram with an off-axis center is broken. The "three equal cards" change is held as a proposal pending §13.2 step 4's negative control, since its evidence is two images and its proposed test is a model judging its own output.

**The strongest new category is structure honesty**, and it belongs in the gate as a class rather than a bullet. Geometry makes claims independently of the words: a taper claims filtering, nesting claims containment, equal tiles claim peer status, a bar claims independent magnitude, an arrow claims necessity. **If the material lacks the relationship the geometry asserts, the image lies while every word on it stays true.** No language gate catches this, which is why selection runs on the material's shape.

**Four new mechanical checks join the overflow check in render.js**, same reasoning as before: the HTML always looks fine. Thumbnail legibility at 220px, panel tint against the page background, reversed-label contrast, and required-parameter fill. All four need no dependency. Thumbnail legibility is the one worth building even if the others slip, because it is the only mechanical test of §10.1.

**What good looks like:** one idea per frame, a real typographic hierarchy at roughly 3x headline to body, asymmetry, at most three hues unless hue encodes a stated dimension, and a single accent whose every appearance forms a coherent reading route rather than a shuffle.

**Carousel structure:** slide 1 is the hook and it must stand alone. Slides 2 through N each carry one beat. Final slide is a takeaway, not a CTA. Infographic attribution follows the same posture: a signature, not a follow-and-repost bar.

### 10.4 Amendments this requires elsewhere

Named here so they are decisions rather than discoveries. **All six are applied**, and the entries stay as the record of why.

1. **§5 front matter** gains `archetype:` on brief.md. §3's job rule is repurpose-scoped and many-to-one over forms, so it does not cover visual repetition, and an earlier draft of the spec wrongly claimed it did.
2. **§3's lock table** gains one row: no archetype reuse within the trailing 5 shipped visual pieces. Same mechanism and cost as the hook-pattern lock.
3. **§13 build order.** Applied 2026-08-17: infographics move to step 11 and carousels to step 12, with both dependencies, because a one-line reorder would have been wrong. §4's cost gate now measures ten infographic runs and greenlights step 12, and §7a's writer list lets the first visual run write theme.json. The case is in §13's why-paragraph and in `VISUALS.md` §10 decision 3.
4. **§15** gains one theme.json question: a second semantic accent. The attribution-posture flag was proposed and withdrawn, because two sections were independently adding a different tenth key to a nine-key contract.
5. **§8** gains the visual path's output line, `angle · archetype · anchor · job`. §8 currently specifies no output for `/content-engine infographic`, and §13.2 step 5's "Nothing else" is scoped to the short-post run, so this is an addition rather than a conflict.
6. **§3's mechanism table** gains a row binding `design-tells.md` to single-frame renders. Its current row binds the gate to "slide HTML before render," which is carousels only, so as written the infographic path never invokes the gate that `VISUALS.md` §6 spends thirty entries extending.

---

## 11. Analytics loop (post-MVP)

**Impressions are not required.** Apify gets reactions, comments, and reposts. Impressions are private to the post owner and reachable only through LinkedIn's own analytics export or the member API for your own posts. That is a nice-to-have for a true engagement rate, not a blocker, because relative comparison within one person's own posts carries enough signal to learn from.

So the loop is two-source:

1. Apify for public engagement on your posts and on benchmark creators.
2. Manual CSV export from LinkedIn analytics for impressions.

**Two blocking tags, in this order.**

**[UNVERIFIED 2026-08-17, owner Joseph]** *Answer first.* Whether a personal profile (not a Company Page) can export post-level impressions at all, what date range one export covers, the file format, and which columns are present. Personal profiles and Pages differ here. If the answer is no, §11 has one source rather than two, and the question below becomes a risk decision rather than a cost decision. Blocking for §11 only, not for MVP.

**[UNVERIFIED 2026-08-17, owner Joseph]** *Answer second.* (a) Does the chosen Apify actor require a LinkedIn session cookie, or does it read public pages unauthenticated? Read that from the actor's own input schema, not its marketing page. (b) If it requires one, whose account supplies it. (c) What LinkedIn's current enforcement behaviour is against datacenter-IP authenticated profile fetches at this volume. **If the answer to (a) is yes, the feature is cut, not moved to a burner account.** Pin the actor and its cost per run in the same pass, so "cheap" is a number in this doc rather than a belief. Blocking for §11 only.

Both sources join into `analytics/posts.csv` on `run_slug`. The header is frozen:

```
run_slug,shipped_at,shipped_verbatim,run_again,post_url,followers_at_post,reactions,comments,reposts,hit_limit,minutes_to_ship
```

Everything else joins from brief.md. Format, anchor, thesis, hook, and job are not duplicated here, because a second copy is a second place to be wrong. `run_again` is `+` or `-`, answering "would you publish this again," and it is the one sign bit in the system: the score below is unsigned magnitude and weights comments at 3x, so without it a backlash post is the highest-scoring post of the quarter and nothing anywhere can record "this produced a phone call I did not want." `minutes_to_ship` is computed from wall clock, never typed. `hit_limit` is set only when the human says the session was interrupted.

**Cadence.** Weekly per account: Joseph, Fallon, Tim, and the Daybreak company page once it is posting. Benchmark creators scrape on the same weekly run.

**Degradation is keyed to account risk, not cost.** Cut benchmark creators on any LinkedIn warning, on any actor error indicating throttling, or permanently if the actor requires a session cookie. The old rule ("cut benchmark creators first and never your own accounts") is worse than nothing under risk pressure, because it instructs you to keep doing the thing that produced the warning.

**Score.** Each post gets `engagement_score = comments x 3 + reposts x 2 + reactions x 1`, divided by follower count at time of posting. The weighting reflects effort and distribution value: a comment costs real effort and drives reach far harder than a like. Normalizing by followers keeps account growth from reading as content improvement.

**Learning threshold.** No entry is written to learnings.md from a single pair of posts. A pattern qualifies when it holds across at least 5 posts on each side of the comparison, tested as an exact Mann-Whitney U on the ten scores, qualifying at U <= 2 (two-tailed p = 0.0317). There is no single-post shortcut: LinkedIn engagement is heavy-tailed, and a "beats the trailing median by 2x" clause fires on roughly a quarter of all posts under a lognormal with shape 1, which at 4 posts a week manufactures a finding per week out of variance.

**The why, and the kill rule.** When a comparison clears the threshold, the engine writes a *hypothesis* to learnings.md, tagged as such, naming the specific candidate difference: hook pattern, inventory item type, format, opening line length, presence of a number, day and time. Hypotheses are marked `confirmed` or `killed` as later posts land. **A hypothesis is killed on the same evidence that would have qualified its inverse. Unresolved at 90 days, it is marked killed.** **Only `confirmed` entries load at draft time**; `hypothesis` and `killed` entries stay in learnings.md for the human to read at review. This is the part that compounds: the engine is not just recording that a post did better, it is proposing why and then testing itself.

**Exploration is a named deviation, not an absence of guidance.** Do not let learnings.md collapse the engine into one repeated format: cap it at directional guidance and keep an explicit exploration budget of one post in five. brief.md carries `arm: explore|exploit` and `tests_hypothesis: <id>`, written automatically from that one-in-five rule. An exploration post deviates on one named dimension rather than ignoring the learnings all at once, because a post that deviates on everything produces data nobody can attribute.

What learnings.md is for, concretely: which hook patterns beat this person's own baseline, which inventory categories land, and which formats earn comments versus reactions.

**The sign bit is load-bearing.** Any post carrying `run_again: -` is excluded from the median, from hypothesis generation, and from any hypothesis's supporting set. Otherwise the loop reads Joseph's worst professional week as its strongest prior.

`/content-engine review` rolls this up weekly. It also: lists run slugs with no posts.csv row, oldest first, and asks for URL plus reactions, comments, reposts, and `run_again`; prompts on any brief still `drafted` after 7 days ("Did you ship 2026-10-23-forecast-carousel?"); runs the primed top-up once; asks "anything ship outside the engine? paste it," which back-fills the brief and the diff corpus for anything written without the router; and once a quarter asks the three staleness questions from §3.

---

## 12. Metrics

**Outcome goals, tracked but not optimizable by the engine:**

- Joseph 1.4k to 20k followers in 6 months
- 1M+ cumulative impressions

Note on the math: 1M in 6 months is roughly 40k impressions a week sustained, and at 1.4k followers that is not reachable in month one. There is deliberately no ramp here to judge against, because any ramp is derivable from the follower goal it would be checking.

**Missing these reads as a goal-setting error, not an engine failure.** Without that permission stated, the pressure lands on the one lever that reliably produces out-of-network reach, which is an argument, on a scoreboard that pays 3x for comments.

**Leading indicators the engine actually controls:**

- Posts shipped per week (target: 4). Shipped means it has a row in posts.csv.
- Percentage of posts marked `run_again: +` shipped with zero human edits to the language (target 70%+ by week 4). Necessary, not sufficient. Read it alongside the §9 voice floor, since a more aggressive gate raises this number without improving the voice.
- Median engagement rate vs that person's own trailing 20-post baseline
- Unlocked anchors at run start, and net new inventory items per week (target 2+). Printed as one line: `N unlocked anchors, M posts of runway at current cadence`. **N is the pool minus the anchors used in the trailing 10 shipped pieces. M is the pool that has never anchored a shipped piece at all**, in posts, read as weeks against the cadence. Two different questions: N is whether the rotation can turn this week, M is how long before the engine starts retelling. M is deliberately not `pool minus 10`. The anchor lock is a rolling window, so every post frees the anchor falling out of it: a pool above 10 turns forever and a pool at or below 10 stalls dead. That is a cliff rather than a runway, it fails for the same reason the raw inventory-depth indicator below was deleted, and above the cliff it prints N a second time.
- Gate recall and false-positive rate against `reference/gate-fixtures/`, reported whenever ai-tells.md changes

**Deleted, and why, so they do not come back.** Gate catch rate trending down: there is no learner, each run is a fresh context reading the same files, §9's growing list should push the rate up rather than down, and success and the worst failure produce the same number. Inventory depth as a raw count: under a 10-post lock it can never fail, and a metric that cannot fail is noise. The impressions ramp (5k/wk month 1, 15k month 3, 40k+ month 5): it is derivable from the follower goal it was supposed to independently check. Per-run token counts: see §14.

**Pro-plan viability.** The criterion is behavioural and binary: four short posts complete in one week on a Pro plan with no limit interruption, measured in week 2. The engine does not estimate its own usage. Measure it with `/cost` at end of day for the first ten working days in a scratch file, then delete the exercise.

**Portability test:** hand the repo to someone outside Daybreak. If they get a post they'd actually publish out of session 1, with no help from Joseph, it passes. **The tester runs the short-post path only; carousel portability is tested separately once `render/` exists.** Record the wall clock and where she stops, not only whether she finishes, and replace the target here with the measured median across Joseph, Fallon, Tim, and the IBM mentor, stated as two numbers: time to a first publishable post, and time to a full profile. Corollary check: after her run, `git status` shows **nothing**. `profiles/*` is gitignored per §1.2, so the profile's own writes are invisible to it by construction and the check is one-sided: it cannot confirm the run wrote inside the profile, and any output at all is a §1.3 violation. That is the half worth testing.

### 12.1 The five numbers to instrument first

From run one of §13 step 5. All five are computed or cost one character. A metric that requires typing stops being recorded by week three.

**1. `minutes_to_ship`, median over a rolling 20.** Wall clock from invocation to run completion, computed, zero typing. Baseline comes free from the ten hand-written posts at step 8.
*Threshold:* median over posts 11 to 30 exceeding the step-8 hand-written baseline while the zero-edit rate is at or above 70% means the engine has lost to a text editor. Cut human-decision surfaces in this order: the weekly top-up, the two alternate hooks, then the angle rejects. **Do not cut the gate.**
*Why first:* the alternative Joseph defects to is not ChatGPT, it is writing the post himself. A tool can pass its own headline metric and still be slower than the LinkedIn box.

**2. Unlocked anchors and runway, printed at run start.** `engine.js locks` returns both. No collection step.
*Threshold:* below 11 unlocked anchors the 10-post rotation cannot turn. Below 3 weeks of runway, which is 12 posts at the target cadence, the top-up stops being optional.
*On the decay:* runway reaches 0 permanently on a profile that has told everything once, and that is the correct reading rather than a bug, because it is exactly when the interview stops being optional. If it nags rather than informs, the fallback is anchors unused in the last 90 days, which restores the gradient without inventing a growth model. Do not make that change before the number has read 0 on a real profile for a month.

**3. Net new inventory items per week.** Counted from inventory.md appends. No collection step.
*Threshold:* under 1.5 a week by week 6 means cadence is capped at what the pool supports, and the honest answer is dropping to 3 posts a week. Over 2 a week means the pool grows and cadence can rise. Under 1.5 at week 6 is also the one trigger that makes the review offer `/content-engine connect`, per §7c; above it, the harvest is buying nothing that costs anything.

**4. Gate fires on the person's own writing.** Run `engine.js lexical` and `stats` over voice.md's pasted samples every time ai-tells.md changes. Report the count and which rules fired.
*Threshold:* any fire on the person's own samples is a rule bug, struck per §9's maintenance rule. Not a tuning signal, a defect count, target zero. Track rewrites per 200 words alongside it, watched for going up (list bloat) rather than down.
*Why:* the fixture test measures recall against known-AI posts, so a gate that rewrote every sentence would score 100%. False positives are the failure that kills the product, because §14 makes the gate destructive rather than advisory.

**5. Pro-plan interruptions.** `hit_limit` in posts.csv, one character on a bad day, default `n`.
*Threshold:* any week in which four short posts cannot complete on Pro. That is binary, and it is the actual question the deleted token columns were trying to answer.

---

## 13. Build order

Sixteen steps. Steps marked NEW did not exist in the previous §4 or §13. Steps 9 and 11 MOVED.

| # | Step | Gate | Status |
| :- | :- | :- | :- |
| 1 | Apply the review fixes to this PRD | blocks everything | NEW, done 2026-08-17 |
| 2 | SKILL.md router, profile structure, setup interview | | existing |
| 3 | `reference/engine.js` | blocks 4 and 6 | NEW |
| 4 | ai-tells.md, the gate, `reference/gate-fixtures/` | | existing, test expanded |
| 5 | Short posts end to end, brief.md front matter, ship keystroke | | existing, scope moved in |
| 5b | Tier 0 signals: the WebSearch scan, signals.md, the four buckets | | NEW, see §7b |
| 6 | The repetition guard | | existing |
| 7 | Minimal `/content-engine review`: shipped reconciliation, primed top-up | blocks 8 | NEW |
| 8 | Ship 10 posts manually, measure the five numbers, tune voice | **gates 9 through 16** | existing |
| 9 | Portability test with the IBM mentor, short-post path only | **gates 10** | MOVED up from after render |
| 9b | The harvest: `/content-engine connect`, the sweep inside review | gated on §12.1 metric 3 | NEW, see §7c |
| 10 | Render pipeline with the overflow check | | existing |
| 11 | Infographics, `VISUALS.md` §8 Phase 1: four templates, no data path | | MOVED ahead of carousels |
| 12 | Carousels plus the design-tell gate | ten measured infographic runs, per §4 | existing |
| 13 | The repurpose refusal | | existing |
| 14 | Full review: URL and engagement rows into posts.csv | | existing |
| 15 | Analytics loop | blocked on §11's two tags, in order | existing |
| 16 | Articles and blog repurposing | | existing |

**Why 5b sits where it does.** Tier 0 is a WebSearch call, a file, and a run-start block, and it repairs two defects the review named as structural: the crossing has no clock, and the pool only grows through a chore. It is small enough to ride alongside step 5 and it must exist before step 8, because the ten posts that tune the voice should include timely ones. Tier 1 connectors are not part of 5b at all: they are step 9b, gated on §12.1 metric 3, for the reasons below.

**Why 11 moves ahead of 12.** `VISUALS.md` §8's Phase 1 is four templates that take a belief, a correction, or a list as input, which is exactly what the profile already holds. None of them needs the data path, none can print a wrong number, one frame has no inter-slide repetition problem, and the per-run token cost is a fraction of a carousel's. That makes the infographic the honest prover for the render loop, which is what §4's cost gate was always trying to buy. The swap carries two dependencies and is worthless without them: §4's gate now measures infographic runs and names step 12, and §7a lets the first visual run write theme.json. Skip the second and every early infographic renders from `_template` defaults, which is precisely the looks-like-a-template tell §10.3 exists to catch.

**Why 9 moves ahead of 10.** Running the portability test after the render build measures the Playwright installer on a managed corporate laptop rather than the writing path. §1.3's operative test is reaching a first publishable post, which is a short post.

**Why 9b sits after 9 and may never be built.** It cannot come earlier without contaminating the one external portability test, since a tester whose engine offers to read her inbox is measuring something other than portability. It is also the only step in this list with a precondition that can fail: if net new inventory is at or above 1.5 a week at week 6, the manual paste path is already doing the job and step 9b is skipped rather than deferred. Building it anyway would be buying a connector's risk with no yield to show for it.

### 13.1 Step 3: `reference/engine.js`

Six mechanisms in §3 and §9 are exact string and number work otherwise handed to attention: 8-gram overlap across roughly 5,900 tokens of prior posts, the lexical list, contraction ratio, sentence-length stdev, hashtag counts, and the lock read. A model does these unreliably and reports clean when it fails, and the gate report is written by the same model that missed the character. The failures are silent, so §3's promise degrades invisibly while the document reports success.

Node, no npm dependencies, four subcommands at this step and a fifth, `gate`, added at step 4:

- **`overlap <draft> <profile>`** reads the last 20 `runs/*/shipped.md` plus `shipped-history.md`, lowercase-tokenizes, intersects shingle sets, returns matched spans. **Before comparing, strip any span that appears verbatim in that profile's inventory.md `content` fields or thesis.md.** Traceable overlap is a citation, printed as a warning with the prior slug; untraceable overlap is the hard fail. Without that exemption the check destroys the shadow-spreadsheet sentence the first time Joseph legitimately retells it, and he turns it off.
- **`lexical <draft>`** scans the banned list, em dash, semicolons in short posts, hashtag counts, Title Case headers.
- **`stats <draft>`** returns sentence-length stdev, contraction rate, comma density, specifics count.
- **`locks <profile>`** globs `runs/*/brief.md`, returns unlocked anchors, hook patterns used in the trailing 8 and 20, archetypes used in the trailing 5 shipped visual pieces, and the runway number.
- **`gate`**, added at step 4, is the harness rather than the gate: recall over `gate-fixtures/`, the negative control over a profile's pasted samples, the `hooks.md` example-line check, and the drift check between `ai-tells.md` and the tell table. See §13.2 step 4.

Output is JSON that gate-report.md quotes verbatim. It lives in `reference/` because §1.2 already ships all of `reference/`, so it needs no new line in the ships list. It writes nothing outside `profiles/<handle>/`.

Node rather than Python: `render/render.js` already requires it, every Claude Code user has it, and a script with no npm install satisfies §1.3 completely, since that clause is about the user installing things rather than about executable code existing. Two runtimes make portability worse.

### 13.2 Done when: per-step conditions

Hold these as the definition of done. They need no further PRD edit; they are the acceptance criteria.

**Step 2, setup interview**
- Every §6.2 section carries a write instruction, not just some of them.
- The resume path is a read of what exists, not a state file.
- identity.md records `disclosure_posture:` and, if the profile is not a person, `owner:`.
- The interview never writes a creator's mechanics from memory after a failed lookup.

**Step 3, engine.js**
- One `assert`-based self-check per subcommand, in the file, runnable with `node reference/engine.js test`. No framework.
- `overlap` is the one with a real failure mode. Its assert: a draft containing a known 13-word run from a fixture prior must fail, and the same draft with that run quoted from inventory must pass.

**Step 4, the gate**
- `reference/gate-fixtures/` holds the 20 known-AI posts, authors stripped, one expected-catch row each in `expected.md`. **These twenty are AI-generated rather than harvested**, which is a departure from the sentence in §5 and is recorded in `expected.md` rather than absorbed. It buys certain provenance and no third party's writing in the repo; it costs the one thing that matters, which is that recall is measured against tells the model that wrote the gate also produces, and the number reads 100% either way. Harvested fixtures are worth more. §9's maintenance rule is the top-up path: a tell spotted in the wild arrives with the post that showed it, as fixture 21 onward.
- **Recall is counted over engine-owned tells only.** `engine.js gate --tells` is the authority on which half owns each tell, and it fails when `ai-tells.md` and the table disagree. Scoring a model-judged tell as caught because a fixture lists it reports a number `engine.js` did not earn, which is the self-witnessing problem §13.1 exists to stop.
- The negative control runs in the same pass: the gate over the person's own pasted samples and the inspiration posts. **Zero rewrites on the person's own samples is the pass bar**, and "rewrites" is the operative word rather than "fires". A rewrite edits a word they wrote and every one is a rule bug, struck per §9. A specifics-floor redraft and a voice floor edit nothing, so they are reported and do not fail the control. The absence checks run only on samples whose `kind:` is a post, because they measure a whole post and running them on three lines of Slack retires a real rule over a sample it never claimed. On the inspiration corpus, count how many rewrites Joseph judges worse; more than 2 of 20 means the rule that fired is over-firing. Two hours, no distributions.
- **The inspiration half has a timing constraint, and it is the reverse of an oversight.** §6 stores extracted behaviours only and discards the pasted source text at the end of setup, so those posts do not exist when the gate is later tested. That half of the control therefore runs **once, during setup, on the pasted text before it is discarded**, and its result is recorded in `ai-tells.md`'s maintenance log. Keeping the corpus instead would put another writer's sentences in the repo permanently, which is exactly what §6 refuses.
- No report-only mode for the first ten posts: it teaches the user on day one that the gate is something you supervise, and the negative control removes the bad rules before they touch a real draft.
- Every example line in `reference/hooks.md` is checked against ai-tells.md in CI. A pattern the gate would rewrite cannot ship in the library. §9 bans "it's not X, it's Y" and "The result?" by name, so without this the user watches the tool argue with itself on run two. **An example line is a line starting with `> `**, which is the convention step 5 has to write to; `engine.js gate --hooks` reports blocked rather than passing while `hooks.md` is absent, because a CI check that passes an empty scan is one that has gone quiet.

**Step 5, short posts**
- brief.md front matter is written at pipeline step 3, before drafting, so it survives a crash at render.
- The run prints exactly one line above the post (`angle · anchor · job`), the post, the four rejected angles as one-liners, and the ship question. Nothing else. That is the testable version of "one keystroke."
- gate-report.md logs `gate_catch_count`, a per-tell tag list, and `gate_passes`. Print one summary line by default, not the itemization. Keep the file; it is the audit trail on the only component that silently edits the human.

**Step 6, repetition guard**
- Reads brief.md front matter and calls `engine.js locks` and `engine.js overlap`. Nothing model-judged.
- The sibling-profile notice globs to nothing on a solo install and must not error there.

**Step 7, minimal review**
- Lists run slugs with no posts.csv row, oldest first. Asks for URL plus reactions, comments, reposts, and `run_again`.
- Runs the primed top-up once, weekly, not per post.
- Any brief still `drafted` after 7 days prompts "Did you ship <slug>?" One glob and a date compare, and it is the whole reconciliation mechanism.

**Step 8, ten posts**
- Record wall clock on all ten. This is the hand-written baseline for `minutes_to_ship`, free here and expensive to reconstruct later.
- Tune the §9 rewrite cap against what actually happened.
- Set the stdev and contraction thresholds from §9's voice floor against Joseph's real drafts versus his pasted samples.

**Step 9, portability**
- Short-post path only. If the mentor reaches a carousel, the test has already stopped measuring what it was for.
- Record where she stops, not only whether she finishes.

**Step 9b, the harvest** (only if §12.1 metric 3 came in under 1.5 a week at week 6)
- The sender and subtype filter runs before any model call, and the discard count is printed. If the model is reading the discard pile, the filter is not built.
- Every candidate is written `clearance: do-not-publish` before the human sees it. There is no code path that produces a cleared item without a keystroke.
- Skipped candidates leave no file behind. **Not checkable with `git status`**, in any invocation: `.gitignore` excludes the profile directory itself, so git never descends into it and every variant collapses to one `!! profiles/<handle>/` line. Diff a file listing instead: `find profiles/<handle> -type f | sort` before the sweep and after, and a sweep that clears nothing produces an identical listing. Verified 2026-08-18 while building step 2.
- Unplug the MCP server mid-build and run `/content-engine review`. It reports the missing server in one line and completes. That is §14's no-connector rule, tested rather than asserted.
- Measure the clear rate over the first 30 candidates against the kill criterion in §7c before writing anything else on top of it.

**Steps 10, 11, and 12: render, infographics, carousels**
- The overflow check ships with render.js, not after it.
- `_template/theme.json` defaults clear the design gate unedited, since the first visual run writes theme.json rather than setup.
- Step 11 ships `VISUALS.md` §8's Phase 1 and nothing else: split panel, row table, tile grid, chain. No data path, no source line, and no template that can print a wrong number. Phase 2 is triggered by material, not scheduled.
- The 220px thumbnail check ships inside render.js with step 11, because it is the only mechanical test of §10.1 and every template built after it is judged against it.
- Ten infographic runs have a measured median before step 12 starts. That is §4's gate, and it is the reason the swap was worth making.

**Step 15, analytics**
- Resolve §11's two tags in the stated order before writing code.
- Owned-account numbers come from the four values typed at review, never from a scrape.

---

## 14. Hard rules

- **No auto-post.** Output is copy-paste.
- **No automated collection as a publishing identity.** No scraper, actor, extension, or script ever authenticates to LinkedIn as an account this engine writes posts for. Reading is copy-paste too. This is the side LinkedIn enforces against with account restriction rather than a content penalty.
- **Never invent a fact, number, story, or credential.** Everything factual comes from inventory.md. If a draft needs a number the inventory doesn't have, ask for it or cut the claim.
- **A true detail that was never yours to tell is the same defect as an invented one.** Clearance is a schema field, not a judgment call at draft time.
- **A signal is an occasion, never a subject.** It surfaces only against an existing thesis, it carries a verbatim quote and a source, and it never replaces the anchor. See §7b.
- **No connector is ever required.** Every path in this engine works with zero connectors authenticated. Anything a connector supplies degrades to a search result or to nothing.
- **The engine never runs unattended.** No scheduler, no daemon, no background job. Every run is one a human started and is watching.
- **Material arriving from a connector defaults to `do-not-publish` and is cleared one item at a time.** No bulk import at any confidence level, and no auto-clear heuristic. See §7c.
- **The engine never writes a number it cannot observe.** No self-reported token counts, no estimated durations, no inferred impressions.
- **One anchor item per piece, named in the brief, plus up to four supports.** Only the anchor consumes a lock.
- **No Daybreak strings in skill logic.** Company context lives in profiles only.
- **The gate is not advisory.** A draft that fails gets rewritten before the human sees it, within the bounds in §9. voice.md wins over ai-tells.md where the two disagree.
- **voice.md is never seeded from another person's or a company's voice file.** Registers describe a company; voice.md describes one human.
- **Never show a draft without showing what it was chosen over.** The four rejected angles print as one-liners under the finished draft. One exemption, stated so it is a decision rather than an oversight: the calibration post at the end of setup session 1 shows one draft and no angle menu, because minute 165 of an interview is where people quit.
- **Only named commands write to a profile file.** A draft run modifies one only on the paste path, where it appends what the human pasted, on accept, through `inventory`'s writer. `runs/` and `analytics/` are the ledger and every run appends to them. See §7a.
- **Unverified claims carry a tag.** Any factual claim in this doc not checked against a live source gets `[UNVERIFIED <date>, owner <name>]`. Untagged claims are asserted as verified.

---

## 15. Open decisions for Joseph

Eight open, one decided. Decision 9 comes from the visual pass; everything else in the review was answered and applied.

**1. Cadence: is 4 posts a week a target or a constraint?**
§12 sets 4 and the old §15 still listed it as open. The 10-post anchor lock makes 4 a week sustainable from a 15-item seed, so the arithmetic no longer forces the answer. What is left is whether 4 is right for a 1.4k account whose audience is senior operators.
*Options:* hold 4 and accept that some weeks run on thinner material; or ramp 2 in month 1, 3 in month 2, 4 by month 3, gated on measured top-up yield.
**Recommendation: hold 4, with the ramp as a documented fallback.** Cadence is recoverable and a reader who has decided you repeat yourself is not, but under a shipped-post lock the repetition risk is bounded, and shipping three in a week is a decision you can make on any given Tuesday without a rule.

**2. Do Fallon, Tim, and the company page get separate profiles or a Daybreak org layer?**
This decides whether the sibling notice in §5 is enough.
*Options:* separate profiles plus the notice; or a shared org layer holding company facts with thin personal profiles on top.
**Recommendation: separate profiles plus the notice.** The org layer solves a real problem, shared company facts, and creates a worse one: an anecdote told by an individual and the same anecdote told by the vendor are not the same disclosure, and a shared learnings.md pools four accounts' evidence into hypotheses that fit none of them. If the duplicate rate turns out to be real after Fallon and Tim have each shipped thirty posts, buy the lock then.

**3. Does the company page own inventory at all?**
A page has no story from before this job and no single "them" who can say a sample sounds right.
*Options:* full profile with its own interview and a named `owner:`; or a page that reposts the three humans with a sentence of commentary and owns nothing.
**Recommendation: reposts only, until a named owner is willing to sit through the interview.** Otherwise the page's inventory is whoever ran setup, with a logo on it, and by October the page and that person are arguing the same beliefs in the same weeks. Either way the announcement register is already in §9 unconditionally, not behind a page flag, because Joseph hits it first in week two on a product launch.

**4. Does voice.md ever get seeded from `daybreak-comment-engine/voice/comment-register.md`?**
*Options:* yes for everyone; no for people and yes for the company page; no anywhere.
**Recommendation: no for joseph, fallon, and tim; yes for a company profile if one exists.** A comment register is a register for 20-word replies, so seeding a post voice from it is bad practice on its own terms, and doing it for three people with a heavily overlapping audience is the fastest available route to three employees who write identically. §14 already carries the rule. §6.2's broadened sample question makes the no-samples case survivable without it.

**5. How strict is clearance by default?**
§7 adds the field. What it defaults to is risk appetite.
*Options:* default `public` and mark exceptions; default `anonymized` and require an explicit clear; default `do-not-publish` for anyone whose identity.md says `nda-default`.
**Recommendation: default `public`, with `nda-default` flipping the default to `do-not-publish` for that profile.** Defaulting everything closed makes the interview slower for the user who has nothing to hide, which is most of them, and a default nobody understands gets clicked through. Also decide the anonymized bar: "how many companies could someone guess this is" needs a number, and there is no basis in the review for picking one. **Measure first:** across Joseph's real seed inventory, what fraction of items come back `anonymized` or `do-not-publish`. If it is most of them, the supply arithmetic behind the 10-post lock is worse than it looks and the answer changes.

**6. Is the 20k follower goal a target or an ambition?**
The ramp is deleted because it was derivable from the goal. The goal itself is yours.
*Options:* keep 1.4k to 20k in six months as a stated goal; keep it and mark it explicitly as an ambition that missing does not indict the engine; replace it with a measured number after the first eight posts.
**Recommendation: keep it, and keep §12's sentence saying that missing it reads as a goal-setting error.** §12 already marks the outcome goals non-optimizable and carries five controllable indicators, so the structure is right. What it lacked was permission to miss.

**7. Is the IBM mentor a real user or a design constraint?**
§2 lists her as secondary. §12 makes her the pass condition for portability. Most of the discipline in §1.2 and §1.3 is paid for by her.
*Options:* real user, keep the constraint and the test; or design constraint only, in which case `profiles/_template/`, the no-fiction rule, and the portability corollary all get cheaper if relaxed.
**Recommendation: keep her as a real user.** The portability constraint is producing most of the good architecture here, including the write rule §7a now scopes rather than deletes, and the cost of keeping it is a README line and a preflight.

**8. Do Tier 1 connectors get built at all? Decided 2026-08-17: yes, as §7c's harvest, at step 9b, and only if the number says so.**
Kept here rather than deleted. This is the one decision in this document where the recommendation from the review pointed one way and Joseph pointed the other, and the record of that is worth more than a tidy list.

The review rejected a calendar connector outright on two grounds: OAuth is manual setup, which breaks §1.3 and the portability test, and it drags third-party data into a repo whose gitignore exists to keep exactly that out. Both objections survive, and §7c pays for them rather than overruling them. Manual setup: nothing is ever authenticated inside this repo, because Slack and Gmail arrive as MCP servers the user connected in their own Claude Code, and a missing server degrades the review instead of blocking it. Third-party data: the only thing written is an item the person cleared, one at a time, and skipped candidates are not stored at all.

What changed the calculus is that the highest-value half of the idea was never news. It is the corpus of Slack and email the person already writes in their real voice, which is simultaneously the best voice sample that will ever exist and a continuous supply of `access` items. §6.2 already asks them to paste three Slack messages by hand. §7c does that weekly.

*Decided against:* calendar, which was the lowest-risk source and also the one with the least prose in it, so it buys structure the engine does not need; any scheduler; and any path reading more than a named allowlist. *Unchanged:* build it after step 9, because before that it makes the one external portability test unreadable. *New:* it is conditional. §12.1 metric 3 at or above 1.5 a week means step 9b is skipped, not postponed.

**9. Does `theme.json` gain a second accent, `accent_2`?**
§10 freezes the contract at nine keys and `accent` is singular. Six of the fourteen reference images use a second accent that carries meaning rather than decoration: good versus bad, before versus after, subject versus remainder. A single accent cannot express a two-sided comparison, and two of the four signatures in the first visual phase are two-sided, the perception split and the comparison table. Three later forms are blocked on it outright: the trend poster's overlay variant, the variance bridge's signed contributions, and the mirrored rings' two ramps.
*Options:* add `accent_2` and take the contract to ten keys; derive it from `accent` by rotating hue; ship one accent and let two-sided forms carry the second side in `muted`.
**Recommendation: add `accent_2`, and only that.** Deriving it produces exactly the arbitrary color pairs the design rules exist to prevent, and `muted` already means "not the point," which is not what "this one is the bad one" says. The frozen-contract argument is real and it is weaker than shipping three templates that cannot make a two-sided claim. This is the only proposed tenth key; the attribution-posture flag was withdrawn, per §10.

---

## 16. Deliberate deferrals

Real findings from the review. Ship without fixing them. Each has a trigger that changes the answer. Listed here so they are decisions rather than oversights, and so they do not come back as suggestions.

**Outbound link placement.** §14 and §9 say nothing about URLs in the post body, and the reported reach penalty is real in direction if not magnitude. Deferred because this document has no conversion metric anywhere and §10's posture is "Final slide is a takeaway, not a CTA," so the finding imports a requirement the product does not have. **Trigger:** the first time Joseph wants a post to drive to a Daybreak page. Then it is one §14 rule (link goes in the first comment, written as a final section of draft.md) and one URL pattern in `engine.js lexical`.

**Comment and reply preparation.** §11 weights comments at 3x and the pipeline ends at the artifact, so the engine optimizes something it does nothing to produce. Deferred because pre-drafted replies to objections nobody has made yet are guesses, and a canned reply pasted at 11:40 against a real objection it half-fits reads worse to a senior operator than two cold lines from a phone. **Trigger:** `minutes_to_ship` comfortably under baseline and Joseph wanting the window covered. Then add `/content-engine replies <slug>`, on demand, after the real comments exist, along with the rule it needs: inventory items cited in a reply are read-only and do not consume a lock.

**Per-profile hook ranking.** 35 shared hook patterns across every install is a homogenization risk in theory. Deferred because the IBM mentor and Joseph publish into disjoint feeds, so the collision is invisible to every reader who exists, and the shared-audience version is already covered by the hook-pattern-alone lock and the sibling notice. **Trigger:** more than five profiles with overlapping audiences. Then setup writes a per-profile ranking of the shipped patterns from the person's own samples.

**Bypass prevention.** Nothing stops Joseph typing "quick LinkedIn post on the forecast-error thing" and skipping the router, degrading all three locks invisibly. Deferred because it is unpreventable in a chat harness and every attempt costs the breeze requirement. A `PostToolUse` hook does not even fire in its own scenario, since an ad-hoc chat request writes no draft.md. **Done instead, free:** one line in CLAUDE.md, "LinkedIn content requests go through /content-engine," and the weekly review question already in §11, "anything ship outside the engine? paste it," which back-fills the brief and the diff corpus within a week. **Trigger:** none; the reconciliation is the answer.

**Follower normalization in the score.** §11 divides by follower count and never captures it, and the divisor drifts against a rolling window. Deferred because §11 is post-MVP and the fix is a deletion: `rel_score = raw_score / median(raw_score, previous 20 posts)`, which is what §11's own threshold sentence already speaks in. **Trigger:** step 15. Apply it in the same pass and make §12's engagement bullet read `rel_score` verbatim, so §11 and §12 stop using two different denominators.

**Owned-account scraping.** The scrape buys three numbers per post that the post owner can read off his own post, and the benchmark half has no named consumer anywhere in §11. **Trigger:** step 15 again. Delete owned-account scraping then rather than now, because the §11 rewrite is one edit and doing it twice is worse than doing it late. Add `measured_at_days` to posts.csv in the same pass and accept numbers only for posts at 7 ± 1 days old, which buys the consistent measurement age the scrape was actually providing.

**Background and scheduled harvesting.** The connector question itself is resolved in §7c and scheduled at §13 step 9b, so what is deferred here is only the scheduler: a daemon, a cron entry, or any path where the engine reads someone's mail while nobody is at the keyboard. Deferred because the weekly review already delivers the whole of what the asynchrony was worth, at a fraction of the mechanism, and because a background job that reads email and writes to a profile is the one component in this design whose failures nobody would be present to see. **Trigger:** `/content-engine review` being skipped three weeks running while the harvest is otherwise clearing items at or above its kill rate. Even then the smallest version is a reminder, not a runner.

**A shared Daybreak org layer.** Left open as §15 decision 2, and the sibling notice covers the collision case read-only. Deferred because no MVP build step involves a second profile: step 2 runs on Joseph, step 8 is Joseph shipping, and the second human does not appear until step 9. **Trigger:** Fallon and Tim both have inventories in flight. Decide before that.

**Rejected outright, so it does not come back as a suggestion:** the (anchor x job) pair lock, the derived lock formula, refuse-to-draft on missing voice samples, a nine-field YAML schema per gate rule, the per-post paste ritual, `setup-state.md`, a load-ledger file, a source-tier governance table for an algorithm reference file, an `examples/` directory with a sample inventory, report-only gate mode, and full-text outlier priors in learnings.md. The reasoning is in `archive/2026-08-17-content-engine-REVIEW.md`.
