# Review

Two commands land here and they are not the same job.

| Entry | What runs |
| :- | :- |
| `/content-engine inventory` | The top-up section below, and nothing else. New material in. |
| `/content-engine review` | The reconcile, then the top-up, then once a quarter the staleness check. |

**This file owns no pipeline step.** The eight steps in `SKILL.md` §2 are the
draft pipeline and neither command here drafts: no anchor, no lock consumed, no
gate, no ship question, and none of the run-start block — no signals, no runway
line, no sibling notice. A review that ends by offering to write a post has
turned the one non-drafting command in the engine into another draft run.

Both are named writers, and `SKILL.md` §3's writer list is the authority on
which profile file each may append to. Everything else here lands in `runs/` or
`analytics/`, which every run appends to.

## Top-up

Load `reference/interview.md`'s philosophy block and rule 3, nothing else from
that file, and be that interviewer.

**Never fire this after a draft run.** A weekly-framed question asked four times
a week trains refusal by construction. It runs when a human types one of the two
commands above.

Prime it first. Four sources, all on disk, and three are row counts rather than
model calls.

| Source | Read | The ask it produces |
| :- | :- | :- |
| Gaps | `type: gap` rows | Come back at a recorded gap from a different angle, never the same question again. |
| Composition | rows counted by `type:` | The thin type is the ask. Eleven stories and one number means ask for a number. |
| This week's pastes | `source: pasted` entries with a run slug inside 7 days | Follow the pasted material to the specifics the draft did not need. |
| Harvest | candidates the sweep below cleared | `review` only, and only when that sweep ran. |

Two or three questions at a time. Abstract answer, ask for the instance;
instance, ask for the number, the date, or the person who disagreed.

One confirmed answer, one write, in the turn it lands, never buffered, in their
words, in `inventory.md`'s schema, `clearance:` set in the same turn by the one
question: "Could you say this on stage with that customer in the room?" Under
`disclosure_posture: nda-default` capture defaults to `do-not-publish` and you
clear actively, while the marginal cost is one word. An "I don't know" is written
as a `type: gap` row. Duplicate-check every item against `inventory.md` and
`inventory-archive.md`; the archive is read here and nowhere else.

**Retirement is offered, never silent.** An item is eligible once it has
anchored a shipped piece and is past its lock: print the eligible list, one
keystroke each, move only what they pick. Unused items never retire and anything
carrying `withdrawn:` is permanently ineligible.

**A completed top-up stamps `last_reviewed` on `inventory.md`**, because the
human answered questions about their material rather than a command having
opened the file. Nothing else is stamped here, and one item appended through the
paste path is not a top-up and stamps nothing.

## Reconcile

`review` only, in this order, and the top-up runs after pass 5, because passes 1
to 3 and pass 5 are what prime it.

### 1. Ships with no row

Every `runs/*/brief.md` at `status: shipped` with no `posts.csv` row, oldest
first. Ask for the post URL and the numbers off the post: reactions, comments,
reposts, `run_again` as `+` or `-`, and the follower count at the time of posting.

**Never write a number the human did not read off the post.** No estimate, no
"probably", no scrape: a review that infers what a post's engagement was is the
failure this engine exists to prevent. **A column they skip stays empty, and
empty is not zero.** Zero means measured zero, and a zero where a blank belongs
turns an uncollected post into a measured failure — `run_again: -` is excluded
from every median downstream.

### 2. Briefs still drafted after 7 days

One glob and a date compare: any brief at `status: drafted` older than seven days
gets "Did you ship `<slug>`?" Yes flips it to `shipped` and drops it into pass 1.
No leaves it alone; a draft nobody shipped is not a number to record.

### 3. Shipped outside the engine

Ask once: "anything ship outside the engine? paste it." Back-fill the ledger so
the verbatim-overlap corpus sees it: write `runs/<date>-<slug>/shipped.md`
verbatim plus a `brief.md` at `status: shipped`, then run pass 1 on it.

Ask which inventory item it retold. Named, it goes in `anchor:` and consumes the
lock like any shipped piece. Unnamed, leave `anchor:` empty and say in one line
that the anchor lock cannot see this piece while the verbatim check can. Do not
guess it: a guessed lock is worse than an absent one, because nobody knows it is
wrong. This writes no profile file — `shipped-history.md` is `setup`'s.

### 4. Learnings

Two jobs, propose and resolve, and both append.

**Scored** means `reactions`, `comments`, `reposts` and `followers_at_post` all
hold values, and then `engagement_score = (comments x 3 + reposts x 2 +
reactions x 1) / followers_at_post`. Any row at `run_again: -` is excluded from
the median, from proposal, and from every supporting set.

**Proposing.** A comparison qualifies on one named `dimension:` with at least 5
scored posts each side, as an exact Mann-Whitney U on the ten scores at U <= 2.
Below ten scored posts on a dimension there is no comparison to run: print the
count, write nothing. No single-post shortcut, no beats-the-median clause. Write
a qualifier as a new entry at `status: hypothesis`, quoting the ten scores and
the pairwise count inside `resolution:` so the U is checkable in thirty seconds
by whoever reads the file. **`engine.js` has no subcommand for this statistic**,
so showing the work is the only thing between it and a self-witnessed number.

**Confirming.** A hypothesis is confirmed by five more scored posts each side,
disjoint from its own `support:` and `against:` lists, holding at U <= 2 again.
Confirming on the evidence that proposed it is not a test. `brief.md`'s
`tests_hypothesis:` and the one-in-five `arm: explore` budget are how that
disjoint set gets built on purpose instead of waited for. Killed on the evidence
that would have qualified its inverse, and killed at 90 days unresolved.

**Resolution is an append.** Confirming or killing writes a *new* entry carrying
the same `claim:`, the new `status:`, `resolved_at:`, `resolution:`, and
`supersedes: learn-<n>`; the hypothesis line is never edited. The load rule then
finishes the job for free, since draft time takes `confirmed` entries only and
skips anything named by a `supersedes:`.

**Degrading with no data.** There is no scraper: every number in `posts.csv`
arrives typed at pass 1, and the loop that would automate it is post-MVP behind
two blocking `[UNVERIFIED]` tags.

| State | Pass 4 |
| :- | :- |
| `posts.csv` is header only | One line: no scored posts yet. |
| Rows exist, engagement columns empty | One line naming how many are unscored. Pass 1 fixes that. |
| Under 10 scored on every dimension | One line with the largest count reached. |
| 10+ scored, U > 2 | One line: tested, did not qualify. |

All four write nothing, and that is the pass working. A review that produces a
finding every week is producing variance.

### 5. The harvest sweep

Three conditions. Any one failing costs one line, never a blocked review.

| Condition | On failure |
| :- | :- |
| `connectors.md` exists | Skip silently. The harvest is opt-in and absent by default. |
| The servers it names are connected | Name the missing server in one line, continue. |
| The harvest itself is built | Say the allowlist is on file and nothing reads it yet. |

**Its precondition can fail, and then it is skipped rather than deferred.** Net
new inventory at or above 1.5 items a week by week 6 means the manual paste path
is already doing the job, and building the harvest anyway buys a connector's
risk with no yield to show for it. A skip, not a postponement.

When it runs: the sender and subtype filter runs before any model call and the
discard count prints, so nothing model-priced touches the discard pile. Every
candidate is written `clearance: do-not-publish` before the human sees it, and
there is no path to a cleared item without a keystroke —
`[c]lear  [a]nonymize  [s]kip`, one per candidate, appending as `source: pasted`
with the message permalink. **Skipped candidates are stored nowhere**, ever.

### 6. Once a quarter: the three questions

The check that stamps, one question per file whose prose only this human can
author:

| Question | Stamps |
| :- | :- |
| Has your role, title, or what you are accountable for changed? | `identity.md` |
| Is this still who you are writing for, and still what they are wrong about? | `audience.md` |
| Are these still your arguments, and does each still have a live opponent? | `thesis.md` |

**A confirmed answer stamps, and only the file it was answered about.** "No
change" is a confirmed answer and stamps; a question skipped or deferred stamps
nothing; nothing is backdated. The other two intervals are stamped elsewhere:
`inventory.md` by a completed top-up, weekly against a 30-day interval, and
`voice.md` by the human accepting an explicit diffed re-derivation of its prose,
its four measured values being frozen at setup. `inspiration.md` and
`theme.json` never go stale.

Get this wrong in the obvious direction — stamp every file this command opened —
and staleness never fires again on anything.

### 7. Closing lines

At most three, one line each: net new inventory items this week, counted off the
appends above; ships still unreconciled, if pass 1 left any; and
`/content-engine connect` offered once, only when net new inventory came in under
1.5 a week at week 6. That offer is earned by a number. It is never made at setup
and never made unprompted.

## Review never

Drafts, gates, or offers to write a post. Rewrites an inventory item or a
learning, since a correction appends with `supersedes:` and a withdrawal is
`retract`'s `withdrawn:` line. Writes a number nobody read off a post, or a zero
where a blank belongs. Stamps `last_reviewed` on a file it merely read. Confirms
a hypothesis on the posts that proposed it. Writes a harvest candidate nobody
cleared, or keeps one they skipped. Touches anything outside
`profiles/<handle>/`.
