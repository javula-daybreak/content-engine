# Expected catches

PRD section 13.2 step 4. Twenty known-AI posts, one expected-catch row each.
`engine.js gate` reads this file and reports recall against it.

## What a row means

`NN: tell-id, tell-id  # why this fixture exists`

Every id must appear in `reference/ai-tells.md` and in `engine.js`'s TELLS
table, and `gate` errors on one that does not. Ids whose owner is `model` are
listed and never scored: they are the judgment half of section 9, and counting
them as caught would report a number `engine.js` did not earn.

A fixture usually fires more tells than its row names. `gate` prints those under
`also_fired` and they are not failures. The row is the reason the fixture is in
the corpus, not an inventory of everything wrong with it.

## Provenance, and what it costs

**These twenty are AI-generated, not harvested.** Section 13.2 asks for real
known-AI posts and section 5 says gate-fixtures holds real third-party posts, so
this is a departure and it is recorded here rather than absorbed.

What it buys: provenance is certain rather than inferred, no third party's
writing sits in this repo, and no fixture can go stale or need attribution. The
company names are the documentation-reserved set, Acme, Contoso, Northwind and
Fabrikam, so no fixture can be mistaken for a claim about a real company or
leak into a draft as one.

What it costs, and this is the real cost: recall is measured against tells the
model that wrote the gate also produces. A tell it does not produce is a tell no
fixture here covers, and the number will read 100% anyway. That blind spot is
not visible from inside this corpus.

The top-up path is section 9's maintenance rule. When Joseph spots a tell in the
wild, the entry gets appended to ai-tells.md with the date **and the post that
showed it gets added here as fixture 21, 22, 23**. Harvested fixtures are worth
more than these; they are simply not what was available at build time. The
negative control is the half that does not have this problem, because it runs on
writing neither the gate nor this corpus produced.

## The dashes in here are deliberate

Every other authored file in this repo holds zero em dashes and zero en dashes,
and `engine.js` writes the two it needs as `\u2014` and `\u2013` escapes so a
repo-wide sweep stays meaningful. The fixtures are the exception, the same way
`archive/` is: a test input is not authored prose, and the `em-dash` and
`en-dash` rules cannot be tested by a corpus that contains neither.

Do not tidy them out. 09.md in particular carries both a digit-flanked en dash,
which section 9 says is legal and must not fire, and a word-flanked one, which
must. Removing either half turns that fixture into a test that cannot fail.

## Not covered here, and where they are covered instead

Two engine-owned tells cannot fire in a fixture, for structural reasons rather
than missing coverage:

- `voice-floor` needs a `voice.md` baseline, and a fixture has no profile.
- `private-terms` needs a `brief.md` beside the draft, and a fixture has no run.

Both are covered by asserts in `engine.js selfTest`. Listing them in a row here
would print two permanent misses and teach whoever reads the report to ignore
the misses column.

## The rows

01: antithesis, rhetorical-fragment, em-dash, restating-close
02: hedged-opener, banned-lexicon
03: announcement-phrase, at-company-we-believe, announcement-shape
04: emoji-bullets, hashtag-stack, unearned-rule-of-three
05: thinking-opener, engagement-bait-close, specifics-floor
06: uniform-paragraphs, specifics-floor, parallel-bullets
07: title-case-header, not-only-but-also
08: specifics-floor, zero-contractions, restating-close
09: semicolon, en-dash
10: banned-lexicon, we-with-no-human, no-fragments
11: antithesis, restating-close
12: announcement-phrase, em-dash, testimonial-quote
13: specifics-floor, unearned-rule-of-three, parallel-bullets
14: rhetorical-fragment, engagement-bait-close, specifics-floor
15: rhetorical-fragment, banned-lexicon
16: banned-lexicon, em-dash, semicolon
17: announcement-phrase, we-with-no-human, announcement-shape
18: engagement-bait-close, hashtag-stack, rhetorical-fragment
19: zero-contractions, no-fragments, announcement-shape
20: title-case-header, emoji-bullets, no-long-sentence
