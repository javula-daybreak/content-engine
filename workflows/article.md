# Article

`/content-engine article <topic>` lands here.

**This file owns pipeline step 4, the draft, and nothing else.** Steps 1, 2, 3,
5 and 8 belong to the router in `SKILL.md`. A line here that restates one of
them is a bug, because two copies of a rule is two places for it to be wrong.
Two sections below look like exceptions and are not: **the cap** is a lock only
this format has, and **the ship checklist** is what a human does after the engine
has finished, because the engine publishes nothing.

## What is different about this format

Four constraints, all four from the same measurement. None is optional.

| Constraint | Mechanism |
| :- | :- |
| Published as a **newsletter edition**, never as a bare article | Ship checklist. Delivery becomes a subscriber notification, which bypasses feed ranking. |
| Always with a **carousel derivative from the same brief** | Handoff contract. A run that produces the edition alone is an unfinished run. |
| Capped at **one article per 8 to 10 short posts** | The cap, below. Read before any draft token is spent. |
| **Never measured in article impressions** | Ship checklist. |

**The measurement, because the constraints are unreadable without it.** On two
independent measurements a long-form article reaches 0.69x the platform median,
596 against 921, at four to ten times the authoring cost of a short post. Taken
as stated that is a bad trade, so the format is not taken as stated: the
newsletter changes the delivery path the 0.69x measures, the derivative sends the
same brief where the reach is, and the cap holds the cost side to a ratio rather
than to good intentions. Measured in article impressions the format loses to a
short post every time, and PRD section 11's loop would correctly learn to stop
writing articles, which is the wrong lesson drawn from the right number.
Anything stating the cap without the number gets the cap deleted by the next
person who reads it.

## The cap

`brief.md` carries `format:`, one of `short`, `carousel`, `infographic`,
`article`. The cap is a count over `profiles/<handle>/runs/*/brief.md`, briefs
with `status: shipped` only, exactly the read `engine.js locks` already performs:

> **N = short-post briefs shipped since the most recent brief carrying
> `format: article`.** With no shipped article, N is every shipped short post.

Carousels and infographics do not count: the cap is a ratio against short posts,
so a week of visual pieces does not buy an article. Nor does the mandatory
derivative, which is not a separate piece. **A brief with no `format:` is not an
article**, by construction rather than by convention, because this workflow is the
only writer of `format: article` and no brief predating it can be one. Reading
the absent field the other way resets N at the newest untagged brief and refuses
the format forever.

| N | What the run does |
| :- | :- |
| under 8 | **Refuse**, before step 3 crosses a single angle. |
| 8 or 9 | Print the count and ask. The gap between 8 and 10 is the human's judgment to make with the number in front of them, not a threshold invented here. |
| 10 or more | Print the count and proceed. |

**The refusal follows PRD section 3's repurpose refusal and returns angles rather
than a no.** Print `N short posts shipped since <slug>, cap is 8`, then three
short-post angles read off live inventory state. The deficit is shipped cadence,
not material, so the material stays usable in the same turn.

## The shape

**The article editor renders real markup.** Headings, bold, italics and lists
arrive as themselves, which is the opposite of the feed and of
`workflows/short-post.md`. Slide text is a third case and `workflows/carousel.md`
owns it.

- **Length is a range, not a target.** 700 to 2,500 words, and past 2,000 the
  reader's attention is the binding constraint rather than the argument.
- **One idea per paragraph.** Two ideas is two paragraphs. Most run 1 to 3
  sentences, none over 6, and the lengths visibly vary. Uniform blocks are a
  section 9 tell over a whole article the same way they are over a post.
- **Sentence-case subheads.** Assert rather than describe, land on a noun, and
  never ask a question in a header. Title Case is caught by name.
- **A semicolon is legal here** and an em dash is not. Section 9 scopes the
  semicolon rule to short posts, and this is the one format that is not one.
- **Bold is load-bearing or absent.** Three or four phrases in a whole article.
  Bold on every bullet reads as generated because it usually is.
- **No summary of itself.** No `TL;DR`, no "in this article I will". The opening
  claim is the summary, and throat-clearing is not caught by the gate.
- **The closer is a separate short paragraph with no header.** A binary, a
  restated diagnosis as a verdict, or a single imperative line. Not a call to
  action, not a question to the feed, and not a zoom-out that restates the piece.

### The arc

The default skeleton. Sections 2 through 6 each take a subhead; section 1 is the
lede and section 7 is one paragraph.

| | Section | What it does |
| :- | :- | :- |
| 1 | The hook | 1 to 3 lines, declarative, stakes the claim. The pattern is the one `hook_id:` already names. |
| 2 | The reality being avoided | Names the structural failure. |
| 3 | Why the obvious fixes do not fix it | Dismantles the comforting counter-argument before the reader reaches for it. |
| 4 | The mechanism | What is actually broken one level down. Usually the longest section. |
| 5 | What changes if it is fixed | Three to five structural changes, as a list or as prose. |
| 6 | Why it does not happen anyway | The self-preservation or blame-distribution dynamic. This is the section that makes the piece honest rather than naive. |
| 7 | The closer | Short. Hard. |

**An outside-world anchor, in the first three paragraphs.** A dated event, a named
organisation, a published figure, a historical episode. Not the reader's own office
and not the author's product. With nothing to point at, a long piece points at the
reader, and second-person accusation becomes the only move it has left. The anchor
rides in `supports:` and obeys section 14 like every other fact: it traces to an
inventory item, or the human supplies it in the same turn, or it is cut. Invented
to fit the argument it is worse than no anchor, because someone will check it.

## Drafting

`brief.md` already exists, written at step 3 before any draft token was spent.
Read it and draft to it. Do not revise the brief to match a draft that wandered.

1. **Open on the hook** the brief names, written from the anchor's own material.
2. **Quote the anchor's words when you use them verbatim.** Section 9's protected
   spans only work on text that is inside quotation marks; unquoted verbatim
   material is material the gate is free to edit.
3. **Name things.** People, organisations, dates, numerals, all from the anchor
   and the supports. The specifics floor is a redraft rather than a repair, and an
   abstraction cannot be patched into an instance.
4. **Cite the supports, do not retell them.** Up to four, each of them a sentence
   or two. A support that grows into a second story is a second anchor that never
   got locked.
5. **Take a position and name what it costs.** A piece this long that names no
   cost risked nothing.
6. **Write `runs/<slug>/draft.md`.** Hand back to the router for step 5, then run
   the derivative.

## The carousel derivative

`workflows/carousel.md` owns the slides. This file owns only what crosses between
the two runs, and the crossing is deliberately thin.

| Passed | Value |
| :- | :- |
| Brief | The same `runs/<slug>/brief.md`. No second brief and no second run directory. |
| `anchor`, `job`, `thesis_id`, `hook_id` | Already fixed at step 3. The derivative does not re-cross angles and does not pick a new job. |
| `archetype` | Written into that same brief by the carousel run, and checked against lock 4 there. |
| Source text | `runs/<slug>/draft.md` **after** it has cleared step 5. The slides are cut from the gate-passed article, never drafted a second time from the brief. |
| Output | `slides/` and `final.pdf` in the same run directory, per PRD section 5. |
| Locks | One anchor lock for the whole run, not two. The archetype lock is the derivative's. |

**PRD section 3's repurpose refusal does not apply.** It refuses a *later* run
that re-mines a shipped brief on the same anchor, job and thesis. Here the two
artifacts are one piece with two surfaces, both planned before either was drafted,
and the match on all three fields is the point rather than the defect.

**The derivative is not optional and its absence is not silent.** Both artifacts
are logged. If `workflows/carousel.md` is missing from the repo the article path
does not degrade to an edition alone: name the missing file and stop, per
`SKILL.md` section 1.

## The ship checklist

Everything here is a human step. The engine does not post, does not schedule, and
does not sign in to read or to write. Print this list once, after step 8.

1. **Publish into a newsletter, as an edition.** If no newsletter exists yet,
   creating one is a one-time manual step and it comes first. Publishing this as a
   bare article is the 0.69x case, in full.
2. **Title the edition with a line from the piece**, the sharpest one. A title
   that summarises the article is a title nobody clicks.
3. **Cover image.** Slide 1 of the derivative already survives at 220px per PRD
   section 10.1, which is the job a cover image does. Without one the preview
   falls back to a platform placeholder and the hook is gone.
4. **Pinned comment: primary sources.** Three to five URLs, one per quantitative
   claim, posted immediately. The first challenge any numbered piece gets is
   "where did that number come from", and one tap to the answer is also what makes
   it forwardable. Every number already traces to an inventory item, so this is
   transcription rather than research.
5. **Tag nobody the piece criticises.** A tag is a notification and an invitation
   to hijack the thread in self-defence. No customer, prospect or board member gets
   tagged without prior agreement either: that door only opens one way.
6. **Post the derivative separately**, on its own day, as a document post.
7. **Do not edit the copy after publishing**, and do not reply to defensive
   comments. Reply by writing the next piece. Hashtags: two, three, or none.

**Measurement, per constraint four.** Article impressions are excluded by
decision, not by availability. The `posts.csv` row's engagement columns are the
**derivative's**, because the derivative is the measurable surface. What the
article itself is judged on is observed by the human and recorded at `review`:
who reposted it, who replied to the notification, which conversations name it in
the next two weeks, and what it unlocked that was not moving before. Comment count
is a noisy leading indicator, because the people most motivated to comment on an
argument are the ones it argues against.

## What this file does not do

It does not route, load, select the anchor, cross the angles, write the brief,
gate, log, print the angle line or the rejects, or ask the ship question. Write
`draft.md`, run the derivative, print the checklist, stop.
