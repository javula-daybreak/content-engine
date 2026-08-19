# AI tells

The language gate. PRD section 9 is the specification; this file is the working
list. It runs on every draft before the human sees it, including the calibration
post at the end of setup session 1, and it is not advisory: a draft that fails
gets rewritten, then re-measured, then shown with a diff.

Loaded at gate time, never at draft time. A model drafting with the ban list in
context writes around the list and produces the same shape in different words.

## Precedence: voice.md wins

A tell that contradicts a documented habit in `voice.md` does not fire for that
profile. Record the override in `gate-report.md` instead of rewriting. A shared
blocklist does not get to overwrite the one file that knows what this person
sounds like.

## The four bounds

Full text in PRD section 9. In short:

1. **Re-measure** after every rewrite pass, or the gate flattens a draft and
   reports a clean pass on its own flattening.
2. **Substitute, never subtract** for lexical violations. An em dash becomes a
   comma, a colon, or a parenthesis. **This bound is scoped to the lexical
   tells.** Deleting a restating close or an engagement-bait question is the
   correct rewrite for those, and a model that reads bound 2 as universal will
   refuse to make it.
3. **Bounded, and it always produces an artifact.** Three rewrites per 200
   words, never the same span twice. Above the cap, redraft once from brief.md
   with the tripped rules as drafting constraints. If that still exceeds the cap,
   ship the better draft with one line naming what is unresolved.
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

**Rewrite** is the operative line. A tell with no rewrite is a redraft or a
rejection, and those say so.

---

## Structural

### antithesis

**Fires on:** "it's not X, it's Y", "isn't just X, it's Y", "X isn't the problem.
Y is."
**Owner:** both (`antithesis`). The two forms above are regexes. The open form,
where the negation and the correction sit in separate paragraphs, is yours.
**Rewrite:** keep one side. State the claim and drop the negated half, which
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
**Rewrite:** cut to the number the material supports, usually two, or add the
real fourth. Do not renumber and leave the padding in place.

### parallel-bullets

**Fires on:** every bullet opening on the same part of speech and landing within
a word or two of the same length.
**Owner:** model.
**Rewrite:** break the parallel on at least one item. Uneven is human.

### rhetorical-fragment

**Fires on:** "The result?", "The kicker?", "Here's the thing", and the shape:
any standalone one-word or two-word line ending in `?` or `:`.
**Owner:** engine (`rhetorical-fragment`).
**Rewrite:** fold it into the sentence that follows. The line is a drum roll,
and the sentence after it is the content.

A numeral anywhere on the line disqualifies it, so a date used as a section
marker is not read as rhetoric.

### restating-close

**Fires on:** a final paragraph that repeats the post's claim in different
words and adds nothing.
**Owner:** model.
**Rewrite:** delete it. Bound 2 does not apply, per the note above: the post
ends one paragraph earlier and is better for it.

### engagement-bait-close

**Fires on:** "Thoughts?", "What's your take?"
**Owner:** engine (`engagement-bait-close`).
**Rewrite:** delete, or replace with a question only this writer could ask,
naming the specific thing they want to know and from whom.

### thinking-opener

**Fires on:** "I've been thinking a lot about"
**Owner:** engine (`thinking-opener`).
**Rewrite:** start at the second sentence. A post opening on the announcement
that thinking occurred is nearly always better without its first sentence.

### uniform-paragraphs

**Fires on:** three or more paragraphs all holding the same number of lines,
where that number is two or more.
**Owner:** engine (`uniform-paragraphs`).
**Rewrite:** merge two paragraphs, or split one. Any asymmetry clears it.

The two-line floor is deliberate. A post of one-line paragraphs throughout is a
documented human habit, named in `inspiration.md` as a usable extraction, and
firing on it would strike a real style as a machine artifact.

---

## Lexical

### em-dash

**Fires on:** any em dash. Zero tolerance.
**Owner:** engine (`em-dash`).
**Rewrite:** comma, colon, or parenthesis, whichever the clause wants. Never a
period: splitting the sentence is bound 2's named failure.

### en-dash

**Fires on:** any en dash not flanked by digits on both sides.
**Owner:** engine (`en-dash`).
**Rewrite:** "to" for a range, a hyphen for a compound.

Between digits it is correct typography and does not fire. `2023-2024` and
`90-120 days` are legal.

### semicolon

**Fires on:** any semicolon, in short posts only.
**Owner:** engine (`semicolon`).
**Rewrite:** a comma or a colon. A period is also acceptable here specifically,
because both clauses survive it intact, which is the thing bound 2 protects.

Not scanned in articles or long form, and not scanned on a pasted sample whose
`kind:` is not a post.

### banned-lexicon

**Fires on:** the nineteen terms in section 9. Single words match with suffixes,
so "leveraged" and "unpacking" both fire. Phrases match literally.
**Owner:** engine (`banned`).
**Rewrite:** the plain word.

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
**Rewrite:** "X and Y", or two sentences.

### hedged-opener

**Fires on:** "In many ways,", "It's worth noting that"
**Owner:** both (`hedged-opener`). Those two are literal. The open category,
every construction that apologises before making a claim, is yours.
**Rewrite:** delete the hedge and keep the claim. The claim was the sentence.

---

## Announcement register

Applied to every profile including personal ones, because a product launch hits
this in week two.

### announcement-phrase

**Fires on:** "we're excited to share", "we're thrilled to", "we're proud to",
"join us", "stay tuned", "more in the comments"
**Owner:** engine (`announcement`).
**Rewrite:** open on the news. Name the person and what they did. The excitement
was never the information.

### at-company-we-believe

**Fires on:** "at <Company>, we believe"
**Owner:** engine (`at-company-we-believe`).
**Rewrite:** name who believes it and what they did about it. A belief with no
action attached is a slogan.

Matches sentence-initial and mid-sentence. The capital on the company name is
what separates the tell from an ordinary preposition.

### we-with-no-human

**Fires on:** first-person plural anywhere in the post and no named person
anywhere in it.
**Owner:** engine (`we-with-no-human`).
**Rewrite:** name one person and what they did.

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
**Rewrite:** none. Redraft from brief.md, or do not post. There is nothing to
substitute for absent content.

### testimonial-quote

**Fires on:** a customer quote deployed as proof rather than as speech.
Recognisable by the quote having no speaker context and no disagreement in it.
**Owner:** model.
**Rewrite:** cut it, or give the customer a full sentence of their own with the
situation around it.

---

## Texture

### no-fragments

**Fires on:** no sentence under 6 words, where `voice.md` records no baseline.
Humans use fragments.
**Owner:** engine (`no-fragments`).
**Rewrite:** break one sentence and let the second half stand alone.

Overridden by `voice.md`'s `uses_fragments: no`. Someone who writes in complete
sentences is not producing a tell by continuing to.

### no-long-sentence

**Fires on:** no sentence over 25 words, where `voice.md` records no baseline.
**Owner:** engine (`no-long-sentence`).
**Rewrite:** join two related sentences.

The absolute half of section 9's voice floor, live only until samples exist.
Both halves retire the moment `voice.md` carries measurements.

### zero-contractions

**Fires on:** a contraction rate of zero across 40 words or more.
**Owner:** engine (`zero-contractions`).
**Rewrite:** contract the two or three that read most naturally aloud. Do not
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
**Rewrite:** expand two or three, usually the ones carrying emphasis.

### emoji-bullets

**Fires on:** a line opening on an emoji.
**Owner:** engine (`emoji-bullets`).
**Rewrite:** a hyphen, or no bullet at all. An emoji inside a sentence is not
this tell and does not fire.

### hashtag-stack

**Fires on:** three or more hashtags. Three is a stack.
**Owner:** engine (`hashtag-stack`).
**Rewrite:** keep at most two, or none. Deleting them is the correct repair and
not a violation of bound 2, which is scoped to lexical tells. It counts as one
rewrite against bound 3's cap.

### title-case-header

**Fires on:** a short unpunctuated line of three or more words where at least
70% are capitalized.
**Owner:** engine (`title-case-header`).
**Rewrite:** sentence case, or fold the line into the paragraph under it.

Cannot separate a header from a line of proper nouns, so a name list is a known
false positive. Raise the ratio if that fires in practice.

---

## Positive checks

The gate can fail on absence, not only on presence.

### specifics-floor

**Fires on:** zero named people, companies, dates, or numerals in the whole
draft.
**Owner:** engine (`specifics-floor`).
**Rewrite:** none. **Redraft.** An abstraction cannot be patched into an
instance, and patching one produces an abstraction with a number in it.

Counted over split sentences rather than raw text, so a numbered list does not
clear the floor on its own numbering.

### voice-floor

**Fires on:** a draft's sentence-length stdev or contraction rate more than 25%
below the value frozen in `voice.md` at setup.
**Owner:** engine (`voice-floor`).
**Rewrite:** flag, not rewrite. It reports a distance, and the fix is a
different draft rather than a different sentence.

Needs a baseline, so it cannot fire in the fixture corpus. Covered by an assert
in `engine.js selfTest` instead.

---

## Rejection, not rewriting

### clearance

**Fires on:** a company, a person, a role-plus-employer-plus-timeframe triple,
or a figure whose source item is not `clearance: public`.
**Owner:** model.
**Rewrite:** none. **Reject and redraft.** Rewriting a disclosure only produces
a better-written disclosure.

### private-terms

**Fires on:** any literal string in `brief.md`'s `private_terms:`.
**Owner:** engine (`private-terms`).
**Rewrite:** none. **Reject and redraft.**

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

Entries are retired by strikethrough on the heading, `### ~~tell-id~~`, with the
date and the reason, so the rule stops firing and stays visible. Retire one when
it fires on this person's own writing or on an `inspiration.md` post. A rule
that is wrong costs a rewrite of good writing on every future draft forever, and
precision can only decay.

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
