# Setup

`/content-engine setup`. Ten minutes to a draft in their own voice, then an
interview they can take in pieces. Resumable, and it never recreates a profile
that already exists.

Load `reference/interview.md` first and be that person for the whole run. That
file is the persona, the rules and the homework: **how** to ask. This file is
the ground to cover, **the order to cover it in**, and where each answer gets
written. Where the two touch, the session boundaries and the closes below
govern.

Every section carries a write instruction. **Nothing is buffered to the end of
a sitting.** One confirmed answer, one write, in the turn it lands. Every write
lands inside `profiles/<handle>/`.

## The order, and why it is this order

| Sitting | Minutes | Ends with |
| :- | :- | :- |
| 0. Front door | ~10 | Their samples on file, the gate calibrated to them, one drafted post |
| A. Raw material | 30-45 | A draft with a real angle menu, aimed at a named belief |
| B. Thesis and the rest | 30-45 | A draft that argues instead of illustrates |

The paste is first because the gate cannot be calibrated without it. The engine
ships to everyone with every rule on; the paste is the only negative control
there is, and without one the gate rewrites their own voice on day one. **It is
not an optional sixth step. It is the step that makes the engine theirs.**

Session 0 is not a shortened interview. Sessions A and B are the upgrade, and
each one has to end in an output difference they can see.

---

# Session 0: the front door

## 0.1 The profile (1 minute)

Ask their name, propose a handle from it, confirm it in one line. Lowercase,
hyphenated, disambiguated by employer when a collision is plausible:
`profiles/<handle>/`.

**If `profiles/<handle>/` already exists, do not recreate it.** Go to the resume
path at the bottom of this file.

Otherwise copy `profiles/_template/` to `profiles/<handle>/`. The schema headers
in those files stay; they are what keeps every later writer honest about the
shape. Do not copy `connectors.md`, which does not exist in the template and is
written only by `/content-engine connect`.

**Start the homework lookup here**, per `reference/interview.md`, and let it run
while they are finding their samples. The next question asks them for text
rather than for facts about themselves, so the lookup costs nothing but the dead
time it fills. Nothing from it is asked or written until §B.2.

## 0.2 The paste (5 minutes)

The first question of the run:

> Before anything else, give me three to five things you have written.
> Anything unedited counts: Slack messages you sent, an email you did not
> template, a post. Do not tidy them.

If they would rather talk, take a two-minute voice memo and transcribe it.
Edited-for-publication writing is worth less here than a message they fired off
without thinking.

> **Write each sample to `voice.md` in the turn it arrives**, marked
> `source: pasted`, verbatim, line breaks and typos kept. Anything already
> published as a LinkedIn post also goes to `shipped-history.md`, which the
> verbatim-overlap lock reads until 20 engine posts exist.

**Paste below the fence in `voice.md`'s Samples section, never inside it.** That
file already carries the warning and it is mechanical, not stylistic: the engine
strips fenced blocks before reading samples, so a sample typed into the schema
block parses to zero samples and the negative control in §0.3 reads an empty
corpus. The four measured values are the opposite case and **do** go inside
their own fence, because the reader that collects them reads fence-and-all. Two
readers, one file, and the placement is the whole difference.

Then, from those samples, extract and record four measured values: average
sentence length, sentence length stdev, contraction rate, and whether they use
fragments. Also note profanity, questions, and how they handle lists, each as a
habit with the sample it came from.

> **The four measured values are frozen here and never overwritten**, because
> drift is only detectable against a fixed baseline.

**If they have no writing samples at all,** say so in `voice.md` explicitly,
skip §0.3, and go to §0.4. Do not refuse to draft. The gate report will open
with the line that file already specifies, the engine leans on
`inspiration.md` until 10 posts have shipped, and voice gets re-derived then
from what performed. Say plainly that the gate is running uncalibrated until
they paste something, and that pasting anything later re-runs §0.3.

## 0.3 The negative control (2 minutes)

**If `reference/ai-tells.md` does not exist yet, say so and stop here.** Do not
show an invented gate result. A fabricated diff calibrates them against
nothing, and it is the calibration, not the draft, that this sitting is for.

Run this once, and hand-write no number that follows:

```
node reference/engine.js gate --negative profiles/<handle>
```

That reports which rules fired on the person's own unedited writing. Every one
of those is a rule that would have rewritten a word they wrote. Write
`profiles/<handle>/gate-calibration.md` from that output, and from nothing else:

- **Front matter.** `measured_at:` today. `samples:` the command's `samples`.
  `corpus: voice.md + shipped-history.md`. `engine_version:` the assertion count
  at measure time, from `grep -c 'assert\.' reference/engine.js`.
- **`## suppressed`.** One entry per rule named in any `fires[].fired` list:
  `rule:` the tell id, `fired:` the count the command reports for it, `sample:`
  the `fires[].sample` string **verbatim**, and `note: fired on the person's own
  unedited writing`. A rule is suppressed by evidence or not at all. Note that
  every `voice.md` sample currently reports as `voice.md:pasted`, so with more
  than one sample that string does not say which; copy it anyway rather than
  writing a prettier label the command did not produce. Only `fired: 0` versus
  above zero is read downstream, so the count needs to be the command's number
  and nothing more precise than that.
- **`## baselines`.** The command's `baseline`, key for key. **Omit a key the
  command did not return.** An absent key means nothing is suppressed and the
  rule fires, which is the safe direction; a key filled in from somewhere else
  is a number the engine did not measure. `/content-engine review` adds the
  missing ones when a re-measure can read them.

Four things that decide what does not go in the file:

- **Only `fires` rows.** `also_flagged` never goes in. A redraft or a flag edits
  no word the person wrote, so there is nothing to suppress.
- **Never a `reject`.** Clearance and private-terms are not suppressible, at
  setup or ever.
- **An empty corpus writes no entries.** If the command reports
  `corpus: empty` or `samples: 0`, write no `## suppressed` entries at all and
  say the control did not run. A missing calibration must never be read as a
  clean pass.
- **A `fires` row with an empty `fired` list names no rule**, so it suppresses
  nothing. Mention it in the block below and move on.

**`reference/ai-tells.md` is never edited for a person.** It ships identical to
everyone with every rule on. This file is the per-profile layer, and it is the
only one.

Then show them, in one short block and nothing else:

> Read 4 samples of your writing. Two rules fired on it, so they are off for
> you: `em-dash` and `rhetorical-fragment`. Everything else is still on. Every
> rule ships on for everyone; these two are off because they fired on your own
> words, not because you asked.

If nothing fired, say that instead, and say it is the good outcome: the gate
never touched a word they wrote, so nothing needed switching off.

This is the moment the engine visibly becomes theirs. It is also what earns the
rest of the interview, so do not skip past it to get to the draft.

## 0.4 Minimum viable draft (5 minutes)

The smallest inventory that can carry one post. Three questions, three writes.

**One.** The disclosure question from `reference/interview.md`'s homework block,
asked here rather than later, because it sets the capture-time clearance default
for every inventory item after it.

> **Write to `identity.md`:** `disclosure_posture: open | nda-default`, and
> `owner:` — the named human who approves what ships — if the profile is not a
> person.

**Two.** One or two instances. Not a category. Ask the two that most reliably
produce one:

- What did you believe six months ago that you no longer believe?
- Tell me about something that went badly.

> **Write each to `inventory.md` in the turn it is confirmed**, in that file's
> schema, in their own words, with `clearance:` set in the same turn by asking:
> "Could you say this on stage with that customer in the room?" Where
> `identity.md` says `disclosure_posture: nda-default`, the capture-time default
> is `do-not-publish` and items get cleared actively while the marginal cost is
> one word.

**Three.** One audience question, and it is the load-bearing one:

> Who do you want reading this, and what do they believe that you think is
> wrong?

> **Write to `audience.md`.**

Then the calibration post. **The draft from this inventory is the calibration
post** — one draft, one run, not two. Generate it from a named inventory item,
run it through the real language gate, and show the post plus the gate diff.
Ask "does this sound like you?" and iterate until yes. That iteration is the
real calibration and it is worth more than another ten minutes of questions.

**Log it like any other run**, per `workflows/short-post.md`: write the run
directory, write `brief.md`, append the `posts.csv` row, consume the anchor. A
calibration post that skips the ledger puts the lock state one item out of true
on day one.

**This is the one draft in the product shown without its rejected angles.** At
a two-item inventory there is no honest angle menu to show. Every other run in
this engine shows what the draft was chosen over, and the next one they see
will.

## Closing session 0

Run `node reference/engine.js locks profiles/<handle>` and close on what it
actually says: print its `run_start_line` verbatim, and say whether it reports
`rotation_healthy: true`.

**Do not close with "you can post from this today" while that flag is false.**
At this size it is false, and it should be: one post is drafted, the rotation
that keeps the next ten from repeating each other is not stocked yet. Say both
things.

> You have one post ready to ship and the gate is tuned to your writing. The
> rotation is not healthy yet at this inventory size — `engine.js locks` says
> so. Session A is 30 to 45 minutes and it is what fills it. Or run
> `/content-engine inventory` twice this week and get there that way.

The health flag is the engine's number, not this file's. Read it; never restate
it as a count here. A second copy of that threshold can only disagree with the
first.

---

# Session A: raw material (30-45 minutes)

The longest section and the most valuable. Push for specifics:

- What is the most surprising thing you have learned in this job?
- What do people in your industry get wrong constantly?
- What is a number that surprised you recently?
- What is a story from before this job that still shapes how you work?
- What is an opinion you hold that your peers would push back on?

These are openers, not a script. Follow the thread that got warm.

> **Write each item to `inventory.md` in the turn it is confirmed**, same schema
> and same `clearance:` rule as §0.4.

An "I don't know" is written too, as a `type: gap` row. The weekly top-up reads
those rows and comes back at it from another angle.

Then finish `audience.md`: what is their job, and what are they tired of
hearing? Every angle this engine generates crosses an inventory item with a
thesis and aims it at one of those beliefs. Without them the engine can only
produce illustrations.

Then two questions about their vocabulary, which are not the same question asked
twice: **what words do these people actually use for this**, and **what words
would tell them you are not one of them.** The second is the one that pays: a
post can be right, sourced and in the person's own voice and still land as
written-by-an-outsider, and `reference/reader.md` at step 5b judges that
register mismatch. It is judging against these two fields, so an empty pair
means the sharpest thing that grader catches, it cannot catch.

> **Write to `audience.md`**, including `their_words:` and
> `words_they_never_use:`. Their words, verbatim, never a tidied paraphrase.

**Close on the clock, not on a count.** At 45 minutes, stop, whatever the
number. Then show the improvement: run `/content-engine post` again and show
that this draft arrives with a real angle menu — four rejected angles it was
chosen over — and is aimed at a named belief instead of at nobody. That is what
the sitting bought.

Print `locks`'s `run_start_line` again. If `rotation_healthy` is still false,
say how the two paths differ: another sitting, or `/content-engine inventory`
twice a week. Do not let them stop early to be agreeable, and **never pad the
count with items you wrote.**

---

# Session B: thesis and the rest (30-45 minutes)

## B.1 Thesis

Now, and not before. **Do not ask them to state their thesis cold.** People are
bad at that. Propose 3 to 5 recurring arguments back to them from what they
have already said, and ask them to correct it. A proposal they reject tells you
as much as one they accept.

For each corrected thesis, ask one more: "Who disagrees with this, and how would
they put it?" Record the answer as `against:`, the strongest version of the
opposing position, in the words someone who actually holds it would use. Not a
strawman. A thesis with no credible opponent is a platitude.

> **Write to `thesis.md`**, each entry `source: proposed` with the confirmation
> date, because you proposed it and they corrected it.

## B.2 Identity

Role, employer, tenure, what they did before, where they studied. The homework
lookup from §0.1 is already done, so use it.

Well known: skip what it sells and who to, ask which part of it they sit in,
what is upstream and downstream of their zone, who hands them work, and what the
rest of the organisation gets wrong about their function. Small or unknown: ask
the basics, quickly, and move on.

> **Write to `identity.md` as each fact is confirmed**, each one marked
> `from: research` or `from: them`. Do not merge the two.
> `disclosure_posture:` is already written; do not re-ask it.

## B.3 Inspiration

Who on LinkedIn or elsewhere do you actually enjoy reading? Ask them to paste 3
to 5 posts from that creator. **The text, not the URL.** Never authenticate to
LinkedIn to retrieve them. If a public fetch fails, say the fetch failed and ask
for the text rather than blocking.

Extract the mechanics: sentence rhythm, how they open, how they close, whether
they use white space, how personal they get.

> **Write the extraction to `inspiration.md` as behaviours, not adjectives.**
> "Opens mid-story with no setup" is usable. "Engaging and authentic" is not.
> Store behaviours only. **The pasted source text is discarded at the end of
> this session**, so another writer's sentence can never reach a draft.

Never write a creator's mechanics from memory. If you could not read the posts,
that creator gets no entry.

**Before discarding that text, run the gate over it** and record in
`inspiration.md` how many of the rewrites it demanded they judged to be worse,
out of how many fired. This is the inspiration half of the negative control, it
can only run here, and more than 2 in 20 means the rule that fired is
over-firing. Then discard the text.

## Closing session B

Show the improvement: a draft anchored to a corrected thesis, with its
`against:` giving the engine a position to argue with, and the inspiration
mechanics in the drafting constraints. That is the difference between a post
that illustrates and one that argues.

The steady-state pool is 15 to 25 items, and `/content-engine inventory` is how
it gets there and stays there. Print `locks`'s `run_start_line` one more time.

## Visual

**Not asked at setup, in any sitting.** Do not ask about colors, fonts, or
brand. The first visual run pulls a palette, shows two real rendered frames, and
writes `theme.json` then. `_template/theme.json` ships with defaults that work
unedited, so nothing is blocked by leaving it alone.

---

## Resume

**The resume path is a read of what exists, not a state file.** There is no
`setup-state.md`. The stop condition is already a predicate over files on disk,
and a second copy of that state can only disagree with the first.

Read `profiles/<handle>/` and pick up at the first of these that is not
satisfied, in this order:

1. `voice.md` holds no `source: pasted` sample and does not state that none
   exist. Go to §0.2.
2. `gate-calibration.md` is absent, or was written before the newest
   `source: pasted` sample. Go to §0.3 and re-run the control.
3. `identity.md` has no `disclosure_posture:`, or `inventory.md` is empty, or
   `audience.md` is empty, or no run directory exists. Go to §0.4.
4. `engine.js locks` reports `rotation_healthy: false`. Go to session A.
5. `thesis.md` holds fewer than 3 corrected arguments with `against:`, or
   `inspiration.md` is empty. Go to session B.

Open by saying where you are picking up and what is left, in one line, then ask
the next question. Do not re-ask what is already written.

## Setup never

- Writes anything unconfirmed, or fills a gap itself.
- Buffers writes to the end of a section.
- Writes a company fact, a creator's mechanics, or a palette from memory after a
  failed lookup.
- Writes a number into `gate-calibration.md` that
  `engine.js gate --negative` did not report.
- Edits `reference/ai-tells.md`, for a person or for any other reason.
- Authenticates to LinkedIn, for reading or for anything else.
- Recreates an existing profile.
- Writes an inventory item without `clearance:` set in the same turn.
- Closes a sitting with a claim `engine.js locks` contradicts.
- Touches anything outside `profiles/<handle>/`.
