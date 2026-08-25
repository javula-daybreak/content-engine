# AI tells

The language gate. PRD section 9 is the specification; this file is the working
list. It runs on every draft before the human sees it, including the calibration
post at the end of setup session 1, and it is not advisory. A draft that fails
is repaired or redrafted, then re-measured, then shown with a diff. **The gate
is a detector and a redrafter. It is not a rewriter.** Which of the two a tell
gets is spec, in the `action` column of `engine.js`'s TELLS table, and not a
call made at run time.

Loaded at gate time, never at draft time. A model drafting with the ban list in
context writes around the list and produces the same shape in different words.

## Precedence: voice.md wins

A tell that contradicts a documented habit in `voice.md` does not fire for that
profile. Record the override in `gate-report.md` instead of rewriting. A shared
blocklist does not get to overwrite the one file that knows what this person
sounds like.

**And this file is never edited for a person.** It ships identical to everyone
with every rule on. A rule that over-fires on someone's own writing is
suppressed in `profiles/<handle>/gate-calibration.md`, with the evidence that
did it. See Maintenance.

## The four bounds

Full text in PRD section 9. In short:

1. **Re-measure** after any repair pass and after the redraft, or the gate
   flattens a draft and reports a clean pass on its own flattening. Bound 3's
   comparator depends on this: it compares two measured drafts, not one measured
   draft and one assumption.
2. **Substitute, never subtract.** **Scoped to repairs**, which is where it
   always applied. An em dash becomes a comma, a colon, or a parenthesis. A
   repair that changes sentence boundaries has stopped being a repair and belongs
   in the redraft class. Deleting a restating close or an engagement-bait
   question is the right fix for those and neither one is a repair, so bound 2
   never reaches them.
3. **Bounded, and it always produces an artifact.** **The cap has changed job:
   it bounded a rewrite budget and it now bounds repairs.** Three repairs per 200
   words, never the same span twice. Above the cap, or on any redraft-class tell,
   go back to brief.md and draft **once** with the tripped tell ids as
   constraints. If the redraft still trips, both drafts are re-measured and the
   better one ships with one line naming what is unresolved: fewer catches wins,
   a tie breaks on distance from the voice floor, and a total tie ships the
   first draft. `engine.js gate --compare <first> <redraft>` is the comparator,
   so the choice is a measurement rather than a judgment.
4. **Protected spans.** Never rewrite inside quotation marks. Never alter a
   numeral or a proper noun anywhere. A banned item in a protected span is
   reported under `not rewritten: quoted or factual` and left alone.

## How to read an entry

Each tell is a `### <id>` heading. The id is the tag `gate-report.md` prints and
the id `gate-fixtures/expected.md` references, and `engine.js gate --tells`
fails if this file and the TELLS table in `engine.js` disagree on the set.

**Owner** is the honest half of section 9's split:

- `engine` means a literal string or a count. Section 9's zero tolerance is a
  promise `engine.js` keeps, and the tag in parentheses is what it emits.
- `model` means a judgment. Nothing deterministic can produce it, and the
  fixture corpus lists it without scoring it.
- `both` means the forms section 9 names by name are caught deterministically
  and the open category is not. This is the honest reading of the split rather
  than a softening of it: half a promise kept is better recorded than claimed
  whole.

**Action** is the operative line, and it is one of four. The table in
`engine.js` owns which one each tell carries, `gate --tells` prints the column,
and this file's operative line says what that action does:

- **Repair.** Mechanical, and unable to restructure a sentence by construction.
  One token swapped for its documented substitute, bounded by bound 4's
  protected spans and capped by bound 3. `action: rewrite` in the table, which
  is the string `gate-report.md` prints and the string the negative control's
  bar is written in.
- **Redraft.** Anything that would restructure prose. The gate returns to
  `brief.md` and drafts once with the tripped ids injected as constraints. **No
  span patching, ever.** A model composing under a constraint writes around it;
  a model patching a violation in place contorts around it.
- **Reject.** Clearance and private terms. Rewriting a disclosure only produces
  a better-written disclosure.
- **Flag.** Information for the human. No word changes and the gate still
  passes, which is why a flag is reported beside the pass rather than swallowed
  by it.

Only a **repair** is suppressible per profile, because only a repair edits a
word the person wrote. See Maintenance.

---

## Structural

### antithesis

**Fires on:** "it's not X, it's Y", "isn't just X, it's Y", "X isn't the problem.
Y is."
**Owner:** both (`antithesis`). The two forms above are regexes. The open form,
where the negation and the correction sit in separate paragraphs, is yours.
**Redraft:** keep one side. State the claim and drop the negated half, which
carries no information the positive half lacks. "It's not a documentation
problem, it's a memory problem" becomes "The documentation was fine. The context
around it was gone." Substitution here means replacing the construction with the
assertion, not deleting a clause.

Both regexes require the second clause to open on a determiner, so "I'm not
sure, it's complicated" does not fire. Section 9's maintenance rule is that
precision can only decay, and a miss you can still catch costs less than a
rewrite of good writing on every future draft forever.

### unearned-rule-of-three

**Fires on:** a list of exactly three where the content did not require three.
The test is whether a fourth item exists and was dropped for rhythm, or whether
the third is a restatement of the first.
**Owner:** model. "Unearned" is the whole judgment.
**Redraft:** cut to the number the material supports, usually two, or add the
real fourth. Do not renumber and leave the padding in place.

### parallel-bullets

**Fires on:** every bullet opening on the same part of speech and landing within
a word or two of the same length.
**Owner:** model.
**Redraft:** break the parallel on at least one item. Uneven is human.

### rhetorical-fragment

**Fires on:** "The result?", "The kicker?", "Here's the thing", and the shape:
any standalone one-word or two-word line ending in `?` or `:`.
**Owner:** engine (`rhetorical-fragment`).
**Redraft:** fold it into the sentence that follows. The line is a drum roll,
and the sentence after it is the content.

A numeral anywhere on the line disqualifies it, so a date used as a section
marker is not read as rhetoric.

### restating-close

**Fires on:** a final paragraph that repeats the post's claim in different
words and adds nothing.
**Owner:** model.
**Redraft:** the post ends one paragraph earlier and is better for it. Bound 2
never reaches this one: it is scoped to repairs and this is not one.

### engagement-bait-close

**Fires on:** "Thoughts?", "What's your take?"
**Owner:** engine (`engagement-bait-close`).
**Redraft:** delete, or replace with a question only this writer could ask,
naming the specific thing they want to know and from whom.

### thinking-opener

**Fires on:** "I've been thinking a lot about"
**Owner:** engine (`thinking-opener`).
**Redraft:** start at the second sentence. A post opening on the announcement
that thinking occurred is nearly always better without its first sentence.

### uniform-paragraphs

**Fires on:** three or more paragraphs all holding the same number of lines,
where that number is two or more.
**Owner:** engine (`uniform-paragraphs`).
**Redraft:** merge two paragraphs, or split one. Any asymmetry clears it.

The two-line floor is deliberate. A post of one-line paragraphs throughout is a
documented human habit, named in `inspiration.md` as a usable extraction, and
firing on it would strike a real style as a machine artifact.

---

## Lexical

### em-dash

**Fires on:** any em dash. Zero tolerance.
**Owner:** engine (`em-dash`).
**Repair:** comma, colon, or parenthesis, whichever the clause wants. Never a
period: splitting the sentence is bound 2's named failure.

Section 9's enumerated repair list does not name the em dash, and it is a repair
anyway. That list was written expecting this rule to be struck globally, and
bound 2 settles the class on its own: it names the em dash as its worked example
of a substitution and forbids the sentence split that would make it a
restructure. **It is not struck. It is the likeliest rule to be suppressed per
profile**, which is a different thing: it stays on for everyone it has not been
measured against.

### en-dash

**Fires on:** any en dash not flanked by digits on both sides.
**Owner:** engine (`en-dash`).
**Repair:** "to" for a range, a hyphen for a compound.

Between digits it is correct typography and does not fire. `2023-2024` and
`90-120 days` are legal.

### semicolon

**Fires on:** any semicolon, in short posts only.
**Owner:** engine (`semicolon`).
**Repair:** a comma or a colon. A period is also acceptable here specifically,
because both clauses survive it intact, which is the thing bound 2 protects.

Not scanned in articles or long form, and not scanned on a pasted sample whose
`kind:` is not a post. A repair for the same reason the em dash is, and
suppressible per profile for the same reason too.

### banned-lexicon

**Fires on:** the nineteen terms in section 9. Single words match with suffixes,
so "leveraged" and "unpacking" both fire. Phrases match literally.
**Owner:** engine (`banned`).
**Repair:** the plain word.

| term | substitute |
| :- | :- |
| delve | look at, go through |
| unpack | explain, take apart |
| dive in | start, read it |
| leverage | use |
| robust | sturdy, reliable, holds up |
| seamless | invisible, no handoff |
| landscape | market, field, the set of options |
| realm | area |
| testament | proof, evidence |
| tapestry | drop the metaphor and name the thing |
| navigate the complexities | deal with, work through |
| game-changer | name what changed |
| no-brainer | obvious |
| double down | commit harder, spend more on |
| moving the needle | changing the number |
| at the end of the day | delete |
| in today's fast-paced world | delete |
| the reality is | delete |
| let that sink in | delete |

The last four are deleted rather than substituted, and that is not a bound 2
violation. They carry no propositional content, so nothing is subtracted with
them: the sentence means exactly what it meant before.

**The protected-span carve-out matters most here.** "Double down", "moving the
needle", "navigate" and "leverage" are all on this list and all appear in how
supply chain operators actually talk. A quoted instance is reported and left
alone. A silently edited quote from a named person is section 14's most
important rule broken by this file's own mechanism.

### not-only-but-also

**Fires on:** "not only" followed within a clause by "but ... also", including
the drifted forms "but we also" and "but they also".
**Owner:** engine (`not-only-but-also`).
**Redraft:** "X and Y", or two sentences.

### hedged-opener

**Fires on:** "In many ways,", "It's worth noting that"
**Owner:** both (`hedged-opener`). Those two are literal. The open category,
every construction that apologises before making a claim, is yours.
**Redraft:** delete the hedge and keep the claim. The claim was the sentence.

---

## Announcement register

Applied to every profile including personal ones, because a product launch hits
this in week two.

### announcement-phrase

**Fires on:** "we're excited to share", "we're thrilled to", "we're proud to",
"join us", "stay tuned", "more in the comments"
**Owner:** engine (`announcement`).
**Redraft:** open on the news. Name the person and what they did. The excitement
was never the information.

### at-company-we-believe

**Fires on:** "at <Company>, we believe"
**Owner:** engine (`at-company-we-believe`).
**Redraft:** name who believes it and what they did about it. A belief with no
action attached is a slogan.

Matches sentence-initial and mid-sentence. The capital on the company name is
what separates the tell from an ordinary preposition.

### we-with-no-human

**Fires on:** first-person plural anywhere in the post and no named person
anywhere in it.
**Owner:** engine (`we-with-no-human`).
**Redraft:** name one person and what they did.

Approximated by the absence of any capitalized word in a non-sentence-initial
position, the same rule the specifics floor uses. It under-fires: a post naming
Acme and no person passes here, because a capital letter is not evidence of a
human. The model reads the rest.

If nobody can be named because the source item is not `clearance: public`, this
is a clearance problem and not a rewrite. See `clearance` below.

### announcement-shape

**Fires on:** a post whose only news is that news exists. No number, no named
person, no before and after, nothing a reader could act on.
**Owner:** model.
**Redraft:** from brief.md, or do not post. There is nothing to substitute for
absent content, which is why no repair exists for this one.

### testimonial-quote

**Fires on:** a customer quote deployed as proof rather than as speech.
Recognisable by the quote having no speaker context and no disagreement in it.
**Owner:** model.
**Redraft:** cut it, or give the customer a full sentence of their own with the
situation around it.

---

## Texture

### no-fragments

**Fires on:** no sentence under 6 words, where `voice.md` records no baseline.
Humans use fragments.
**Owner:** engine (`no-fragments`).
**Flag:** break one sentence and let the second half stand alone.

Overridden by `voice.md`'s `uses_fragments: no`. Someone who writes in complete
sentences is not producing a tell by continuing to.

### no-long-sentence

**Fires on:** no sentence over 25 words, where `voice.md` records no baseline.
**Owner:** engine (`no-long-sentence`).
**Flag:** join two related sentences.

The absolute half of section 9's voice floor, live only until samples exist.
Both halves retire the moment `voice.md` carries measurements.

### zero-contractions

**Fires on:** a contraction rate of zero across 40 words or more.
**Owner:** engine (`zero-contractions`).
**Redraft:** contract the two or three that read most naturally aloud. Do not
contract every candidate.

Overridden when `voice.md` records a measured rate of zero. Forty words is the
floor because a two-line post without a contraction is evidence of nothing.

### all-contractions

**Fires on:** every contractible site contracted.
**Owner:** model, and this one is worth explaining rather than asserting.
`contraction_rate` divides contractions by total words, so its denominator is
not contractible sites. One hundred percent is not expressible in that number,
and no measurable definition exists without a contractible-site count nobody has
built. It stays a judgment until someone needs it enough to build one.
**Redraft:** expand two or three, usually the ones carrying emphasis.

### emoji-bullets

**Fires on:** a line opening on an emoji.
**Owner:** engine (`emoji-bullets`).
**Repair:** a hyphen, or no bullet at all. An emoji inside a sentence is not
this tell and does not fire.

### hashtag-stack

**Fires on:** three or more hashtags. Three is a stack.
**Owner:** engine (`hashtag-stack`).
**Repair:** keep at most two, or none. Deleting them is the correct repair and
not a violation of bound 2, which is scoped to the substitutions. It counts as
one repair against bound 3's cap.

### title-case-header

**Fires on:** a short unpunctuated line of three or more words where at least
70% are capitalized.
**Owner:** engine (`title-case-header`).
**Repair:** sentence case, or fold the line into the paragraph under it.

Cannot separate a header from a line of proper nouns, so a name list is a known
false positive. Raise the ratio if that fires in practice.

---

## Positive checks

The gate can fail on absence, not only on presence.

### specifics-floor

**Fires on:** zero named people, companies, dates, or numerals in the whole
draft.
**Owner:** engine (`specifics-floor`).
**Redraft:** an abstraction cannot be patched into an instance, and patching one
produces an abstraction with a number in it.

Counted over split sentences rather than raw text, so a numbered list does not
clear the floor on its own numbering.

### voice-floor

**Fires on:** a draft's sentence-length stdev or contraction rate more than 25%
below the value frozen in `voice.md` at setup.
**Owner:** engine (`voice-floor`).
**Redraft:** it reports a distance, and the fix is a different draft rather than
a different sentence. Section 9 lists the voice floor in the redraft class for
exactly that reason: there is no span to edit, because the finding is a property
of the whole draft.

Needs a baseline, so it cannot fire in the fixture corpus. Covered by an assert
in `engine.js selfTest` instead.

---

## The three distribution checks

Added 2026-08-24, PRD §9's Phase 2 checks. All three measure the whole draft
rather than a span, all three are redraft-class for that reason, and none is
suppressible: a redraft edits no word the person wrote, so there is nothing for a
suppression to protect. Each floors against `gate-calibration.md`'s baseline for
this person at 75% of it, the same `VOICE_FLOOR` band the voice floor uses, and
falls back to an absolute only where that person has no baseline for the metric.
The report always names which of the two it used.

All three need enough text to be a distribution: 100 words and 5 sentences
(`DIST_MIN_WORDS`, `DIST_MIN_SENTENCES`). Below that the coefficient of variation
is noise, and firing on noise is the false positive this file's maintenance rule
says costs a rewrite of good writing on every future draft forever.

**The direction is per metric, because the drift is per metric.** Burstiness and
punctuation density flatten *downward* under machine drafting; nominalisation
inflates *upward*. A floor on nominalisation would be a check that cannot fire on
the text it was written to catch.

### burstiness

**Fires on:** sentence-length coefficient of variation below the band. Absolute
fallback `BURSTINESS_FLOOR` 0.45.
**Owner:** engine (`burstiness`).
**Redraft:** there is no span to edit. Uniform sentence length is a property of
the whole draft, and the fix is a different draft.

Human text benchmarks 0.60-1.00 and machine text 0.15-0.30. The fallback sits
between the two bands rather than at the bottom of the human one, and the known
ceiling is that a genuinely flat 0.50 draft walks past. The alternative fires on
real short posts, which is the more expensive error.

### punctuation-density

**Fires on:** commas, semicolons, parentheses and dashes per 100 words below the
band. Absolute fallback `PUNCT_DENSITY_FLOOR` 2.0, below which there is no clause
structure left at all.
**Owner:** engine (`punctuation-density`).
**Redraft:** same reason. Clause structure is not a span.

This is the strongest 2026 tell and it was blocked for a long time, on the
grounds that a density floor cannot bind while two of its four inputs are banned
at zero tolerance. **What unblocked it was not a retirement.** Under
`gate-calibration.md` nothing is struck globally: the floor is measured against
the person's own baseline, and if the em dash or the semicolon is suppressed for
them, the mark is theirs to use and the density it produces is theirs to be
measured against. The contradiction was never between the two rules. It was in
retiring them for everybody.

### nominalisation-rate

**Fires on:** `-tion`, `-ment`, `-ness`, `-ity`, `-ance` and `-ence` per 100
words **above** the band. Absolute ceiling `NOMINALISATION_CEILING` 5.0.
**Owner:** engine (`nominalisation-rate`).
**Redraft:** turning nouns back into verbs is a rewrite of the sentence's spine,
which is the line PRD §9 draws between a repair and a redraft.

The one check in this file with a ceiling rather than a floor. Read the direction
before editing it: inverting it produces a rule that fires on plain writing and
passes the abstraction it exists to catch.

---

## Rejection, not rewriting

### clearance

**Fires on:** a company, a person, a role-plus-employer-plus-timeframe triple,
or a figure whose source item is not `clearance: public`.
**Owner:** model.
**Reject:** and redraft. Rewriting a disclosure only produces a better-written
disclosure.

### private-terms

**Fires on:** any literal string in `brief.md`'s `private_terms:`.
**Owner:** engine (`private-terms`).
**Reject:** and redraft.

**Never suppressible.** `gate-calibration.md` rule 4 refuses a file naming this
rule, and the engine refuses to honour it even if one arrived, because a file
inside the profile is not a consent form for a disclosure.

Deterministic on purpose, per section 9: the material it guards is the kind a
tired human approves at 8am. Needs a `brief.md` beside the draft, so it cannot
fire in the fixture corpus. Covered by asserts in `engine.js selfTest`.

---

## Testing this file

```
node reference/engine.js gate                      # recall over gate-fixtures/
node reference/engine.js gate --negative <profile> # fires on the person's own writing
node reference/engine.js gate --hooks              # hooks.md example lines
node reference/engine.js gate --tells              # this file against the TELLS table
```

Run all four whenever this file changes. PRD section 12.1 metric 4 is the
false-positive rate and it is the one that decides whether this file survives
contact with a real profile.

**The negative control is the half that matters.** Zero rewrites on the person's
own pasted samples is the pass bar, and the wording is load bearing. A rewrite
edits a word they wrote, so every one is a rule bug and gets struck below. A
`specifics-floor` redraft or a `voice-floor` flag edits nothing, so it is
reported under `also_flagged` and does not fail the control.

The absence checks run on samples whose `kind:` is a post, and not on the slack
messages and emails. They measure a whole post: paragraph uniformity, a
specifics count, a distance from a baseline. Running them on three lines of
slack measures the sample rather than the rule, and every rule they wrongly
retire is one this file loses for good.

The corpus half has a timing constraint. `inspiration.md` stores extracted
behaviours only and section 6 discards the pasted source text at the end of
setup, so the inspiration half of the control runs once, during setup, on that
text before it is discarded, and its result is recorded here.

**The hooks.md convention.** An example line in `reference/hooks.md` is a line
starting with `> `. Anything the gate would rewrite cannot ship in the hook
library, or the user watches the tool argue with itself on run two. Section 9
bans "it's not X, it's Y" and "The result?" by name and both are natural hook
shapes, so this is a live risk rather than a theoretical one.

---

## Maintenance

Living file. When Joseph spots a tell in the wild he says so, and it is appended
here with the date **and the post that showed it is added to `gate-fixtures/`**.
A tell with no fixture is a claim with no test.

**Nothing in this file is retired because it fired on one person. Changed
2026-08-24.** This passage read that an entry is retired by strikethrough *"when
it fires on this person's own writing or on an `inspiration.md` post."* That was
wrong, and not only in scheduling. **This file ships to everyone.** Striking a
rule here because it over-fires on one person's writing hardcodes that person's
punctuation habits into every future install, which is a portability defect
wearing the costume of a calibration step, and it fails the commitment that this
engine is handable to anyone.

**A rule that fires on someone's own writing is suppressed for them, in
`profiles/<handle>/gate-calibration.md`, with the count and the sample that did
it.** Every rule here ships on, for everyone. Setup measures the suppression per
person from their own pasted samples and writes it; the engine reads it; nothing
is switched off by hand and nothing is switched off globally. Only a repair is
suppressible, because only a repair edits a word the person wrote. A reject never
is.

**Retirement still exists, for one case only:** a rule that is wrong *as a rule*,
which means wrong about machine writing rather than inconvenient for one human.
That is struck by strikethrough on the heading, `### ~~tell-id~~`, with the date
and the reason, so it stops firing and stays visible. The evidence for it is
never one corpus. A rule that is wrong costs a rewrite of good writing on every
future draft forever, and precision can only decay.

Deleting a retired entry is the mistake to avoid: the next person to notice the
same pattern re-adds it, and the reason it failed is gone.

### Changes

- **2026-08-18.** File created at PRD section 13 step 4. Thirty entries, 23
  engine-owned and 7 judged. No entry retired yet, because no profile exists to
  retire one against.
- **2026-08-18.** Two rules widened after the fixture corpus caught them firing
  on nothing. `at-company-we-believe` matched lowercase "at" only, and the tell
  opens a sentence nearly every time it occurs, so it had been missing its only
  real position. `not-only-but-also` required "but also" adjacent, and the form
  a model actually writes is "but we also". Both were live and inert since step
  3.
- **2026-08-18.** Section 9's voice-floor fallback split into `no-fragments` and
  `no-long-sentence`. One tag covering both meant a fixture expecting no
  fragments passed on the unrelated half, which is a test that cannot fail.
- **2026-08-18.** Step 5. `gate --report <draft> [profile]` added: the one gate
  mode that runs on a real draft, returning section 13.2 step 5's three logged
  values plus the bound 3 cap in one object. `gate --hooks` went live the same
  day, since `reference/hooks.md` is what it reads, and it now joins a run of
  consecutive `> ` lines into one example before scanning. Scanning the halves
  separately let a banned pattern ship in the hook library by wrapping across
  the line break.
- **2026-08-18.** `hashtag-stack` now sets `action: rewrite` and counts one
  against the cap. It had been reporting `pass: false` with `action: none`,
  which tells a run something is wrong and not what to do about it, and kept
  the only tell that is a deletion invisible to bound 3's arithmetic. No rule
  changed about when it fires.
