# Setup

`/content-engine setup`. An interview that produces a profile. Two sittings,
resumable, and it never recreates a profile that already exists.

Load `reference/interview.md` first and be that person for the whole run. This
file is the ground to cover and where each answer gets written. That file is how
to ask.

## 0. The profile

Ask their name, propose a handle from it, confirm it in one line. Lowercase,
hyphenated, disambiguated by company when a collision is plausible:
`profiles/<handle>/`.

**If `profiles/<handle>/` already exists, do not recreate it.** Go to the resume
path at the bottom of this file.

Otherwise copy `profiles/_template/` to `profiles/<handle>/`. The schema headers
in those files stay; they are what keeps every later writer honest about the
shape. Do not copy `connectors.md`, which does not exist in the template and is
written only by `/content-engine connect`.

Do the homework in `reference/interview.md` before the first question.

## 1. The ground, in this order

Every section below carries a write instruction. **Nothing is buffered to the
end of the interview.** One confirmed answer, one write, in the turn it lands.

### Identity

Name, role, company, tenure, what they did before, where they studied. Plus
`disclosure_posture:` from the homework block, and `owner:` if the profile is
not a person.

On the company, homework first. Well known: skip what it sells and who to, ask
which part of it they sit in, what is upstream and downstream of their zone, who
hands them work, and what the rest of the company gets wrong about their
function. Small or unknown: ask the basics, quickly, and move on.

> **Write to `identity.md` as each fact is confirmed**, each one marked
> `from: research` or `from: them`. Do not merge the two.

### Raw material

The longest section and the most valuable. Push for specifics:

- What is the most surprising thing you have learned in this job?
- What did you believe six months ago that you no longer believe?
- Tell me about something that went badly.
- What do people in your industry get wrong constantly?
- What is a number that surprised you recently?
- What is a story from before this job that still shapes how you work?
- What is an opinion you hold that your peers would push back on?

These are openers, not a script. Follow the thread that got warm.

> **Write each item to `inventory.md` in the turn it is confirmed**, in the
> schema at the top of that file, in their own words. Set `clearance:` in the
> same turn by asking: "Could you say this on stage with that customer in the
> room?" Where `identity.md` says `disclosure_posture: nda-default`, the
> capture-time default is `do-not-publish` and you clear items actively during
> the interview, where the marginal cost is one word.

An "I don't know" is written too, as a `type: gap` row. The weekly top-up reads
those rows and comes back at it from another angle.

### Audience

Who do you want reading this? What is their job? What do they believe that you
think is wrong? What are they tired of hearing?

The third and fourth questions are the load-bearing ones. Every angle this
engine generates crosses an inventory item with a thesis and aims it at one of
those beliefs, and without them the engine can only produce illustrations.

> **Write to `audience.md`.**

### Thesis

Now, and not before. **Do not ask them to state their thesis cold.** People are
bad at that. Propose 3 to 5 recurring arguments back to them from what they have
already said, and ask them to correct it. A proposal they reject tells you as
much as one they accept.

For each corrected thesis, ask one more: "Who disagrees with this, and how would
they put it?" Record the answer as `against:`, the strongest version of the
opposing position, in the words someone who actually holds it would use. Not a
strawman. A thesis with no credible opponent is a platitude.

> **Write to `thesis.md`**, each entry `source: proposed` with the confirmation
> date, because you proposed it and they corrected it.

### Inspiration

Who on LinkedIn or elsewhere do you actually enjoy reading? Ask them to paste 3
to 5 posts from that creator. **The text, not the URL.** Never authenticate to
LinkedIn to retrieve them. If a public fetch fails, say the fetch failed and ask
for the text rather than blocking.

Extract the mechanics: sentence rhythm, how they open, how they close, whether
they use white space, how personal they get.

> **Write the extraction to `inspiration.md` as behaviours, not adjectives.**
> "Opens mid-story with no setup" is usable. "Engaging and authentic" is not.
> Store behaviours only. **The pasted source text is discarded at the end of
> setup**, so another writer's sentence can never reach a draft.

Never write a creator's mechanics from memory. If you could not read the posts,
that creator gets no entry.

### Voice sample

Ask for the last three Slack messages they sent that ran longer than two
sentences, and the last email they wrote that they did not template. If they
would rather talk, take a two-minute voice memo and transcribe it. Anything
unedited counts. Edited-for-publication writing is worth less here than a
message they fired off without thinking.

Extract and record four measured values: average sentence length, sentence
length stdev, contraction rate, and whether they use fragments. Also note
profanity, questions, and how they handle lists.

> **Write to `voice.md`** with real examples pulled from their text, marked
> `source: pasted`. **The four measured values are frozen at setup and never
> overwritten**, because drift is only detectable against a fixed baseline.

Also accept recent LinkedIn posts as samples and put them in
`shipped-history.md`, which the verbatim-overlap lock reads until 20 engine
posts exist. Optional, and it never gates the interview.

**If they have no writing samples,** say so in `voice.md` explicitly and move
on. Do not refuse to draft. The gate report will open with the line that file
already specifies, the engine leans on `inspiration.md` until 10 posts have
shipped, and voice gets re-derived then from what performed.

### Visual

**Not asked at setup.** Do not ask about colors, fonts, or brand. The first
visual run pulls a palette, shows two real rendered frames, and writes
`theme.json` then. `_template/theme.json` ships with defaults that work
unedited, so nothing is blocked by leaving it alone.

## 2. Closing session 1

The floor is in `reference/interview.md`'s stop condition. Below it, say so and
keep going. Do not let them stop early to be agreeable, and never pad the count
with items you wrote.

Then the calibration post. Generate one post from a named inventory item, run it
through the real language gate, and show the post plus the gate diff. Ask "does
this sound like you?" and iterate until yes. That iteration is the real
calibration, and it is worth more than another ten minutes of questions.

**Log it like any other run.** Write the run directory, write `brief.md`, append
the `posts.csv` row, consume the anchor. A calibration post that skips the ledger
puts the lock state one item out of true on day one.

**This is the one draft in the product shown without its rejected angles.** The
exemption is deliberate: minute 165 of an interview is where people quit. Every
other run in this engine shows what the draft was chosen over.

**If `reference/ai-tells.md` does not exist yet, say so and stop before the
calibration post.** Do not show a calibration draft with a gate report you
invented. The whole point of this step is that they calibrate against what the
gate actually does, and a fabricated diff calibrates them against nothing. Close
the session on the inventory instead and say the calibration is waiting on that
file.

Close with: "you can post from this today; run `/content-engine inventory` twice
this week to reach 20."

## 3. Session 2

The remainder. Inventory to 15 to 25 items, thesis to 3 to 5 corrected
arguments, each with its `against:` captured. Same rules, same write-as-you-go.

Discard the pasted inspiration source text at the end of this session if it has
not been discarded already.

## Resume

**The resume path is a read of what exists, not a state file.** There is no
`setup-state.md`. The stop condition is already a predicate over files on disk,
and a second copy of that state can only disagree with the first.

Read `profiles/<handle>/`, count the inventory items, find the first section
above with nothing written to its file, and continue there. Open by saying where
you are picking up and what is left, in one line, then ask the next question.
Do not re-ask what is already written.

## Setup never

- Writes anything unconfirmed, or fills a gap itself.
- Buffers writes to the end of a section.
- Writes a company fact, a creator's mechanics, or a palette from memory after a
  failed lookup.
- Authenticates to LinkedIn, for reading or for anything else.
- Recreates an existing profile.
- Writes an inventory item without `clearance:` set in the same turn.
- Touches anything outside `profiles/<handle>/`.
