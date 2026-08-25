# The reader

The quality bar. Ported 2026-08-23 from a standalone grader, with every company
and industry string stripped, per PRD section 13's Phase 3.

`ai-tells.md` is thirty prohibitions and two absence floors. Everything it knows
how to say is *this draft contains something it should not* or *this draft is
missing something it should have*. A draft can clear it completely and be
worthless, and until this file existed no step in the pipeline would have
noticed. **The gate asks whether the draft is machine-shaped. The reader asks
whether it is any good.** Those are different questions and they need different
instruments.

This one is entirely model-judged and it is labelled one. PRD section 9's honesty
rule is that zero tolerance is a promise only the deterministic half can keep, so
nothing here is a threshold and `engine.js` has no part in it. It is a taste
judgment, made once, by a reader who does not know what the author meant.

## What it does, and what it must never do

- **Does:** read the post once, as the person in `audience.md` would, and return
  one level (L1 to L4) with quoted, particular feedback and four plain answers.
- **Does not:** rewrite, patch, regenerate, loop, or edit one word of anything.
  It does not block. It does not gate. It writes one file into the ledger and
  prints one line.

**It grades and returns.** An L1 offers a redraft and the human decides. This is
the whole of why the reader is safe to add: the founding defect this build is
correcting was a gate that rewrote a person's voice, and a grader that rewrites
is that defect with better manners. There is no bound to keep it honest and no
protected-span rule, because it never touches the text.

## Pipeline position

**Step 5b**, after the gate at step 5, before ship at step 8. Every format. The
router owns it, `SKILL.md` states it, and a format workflow that reimplements it
is a bug.

It runs after the gate rather than before because the gate can redraft, and
grading a draft the gate is about to replace grades a draft nobody will read.
It runs before ship rather than after because a grade delivered after the post is
on LinkedIn is a performance review, not an instrument.

**It does not block.** `gate-report.md` must exist before the post is shown;
there is no equivalent existence check here, and there must not be one. The gate
is not advisory because it edits the human; the reader is advisory because it
does not.

## The fresh subagent, and its closed input list

**Spawn a fresh subagent for every grade.** The blindness is the entire
instrument: a grader that knows what you meant grades what you meant.

It receives exactly these three things and nothing else:

1. This file, from `## The reader` to `## The four anchor questions`.
2. The context block, rendered per the section below.
3. `runs/<slug>/draft.md`, as text, exactly as it would appear in the feed.

It must never receive `brief.md`, the angle it was chosen over, the four
rejected angles, `gate-report.md`, `inventory.md`, `voice.md`, `learnings.md`,
`ai-tells.md`, or any part of the conversation that produced the draft. Each of
those has a specific failure attached to it:

- **`brief.md` or the conversation.** The reader would grade the intention
  instead of the post. Nobody in the feed has the brief.
- **`gate-report.md` or `ai-tells.md`.** A grader holding the rulebook grades
  compliance. It would report a clean post because thirty rules did not fire,
  which is the exact statement this file exists to stop being sufficient.
- **`voice.md`.** The reader would excuse a machine cadence on the grounds that
  the author writes that way. Voice precedence is the gate's rule and it is the
  gate's for a reason: `voice.md` decides whether an edit is allowed, and the
  reader makes no edits.
- **`inventory.md`.** See the defensibility principle. The reader judges whether
  a claim is refutable, never whether it is true.

Everything in the context block is something the feed shows or something this
reader would already know. Nothing in it is something only the author knows.

## The context block, and how it is generated

Person-agnostic by construction. The four principles, the four anchor questions
and the L1-L4 bar below are true for everybody. The context block is the only
person-specific part, it is generated rather than written, and it is generated
from files that already exist.

**Rendered at step 5b from `identity.md`, `audience.md` and `thesis.md`. Nothing
is stored.** Step 1 has all three in context already, so the render costs no
read. Exact shape, one line per source field:

```
READER CONTEXT

who you are:          audience.md `who:` + `their_job:`
what you believe:     audience.md `what_they_believe_that_is_wrong:`, every line
what you are tired of: audience.md `what_they_are_tired_of_hearing:`, every line
the words you use:    audience.md `their_words:`
words that would tell
  you they are not one
  of you:             audience.md `words_they_never_use:`
whose post this is:   identity.md `role:` + `company:` + `sells_what:` +
                      `sells_to:`, as one byline line
what this person
  argues:             thesis.md, each entry carrying `confirmed_at:`, its
                      `claim:` with its `against:`

You do not have this person's inventory, so you cannot check a number against a
source. Judge claims on whether they are refutable, never on whether they are
true.
```

Five rules on the render, and all five matter:

1. **Every value is copied verbatim.** Nothing is summarised, expanded,
   inferred, or made more readable. PRD section 14 bans inventing a fact, and
   this block is the thing the reader judges claims against, so a smoothed-over
   line here is a fabricated standard.
2. **Omit any line whose source field is empty.** Never write a placeholder,
   never fill a gap with something plausible. A thin block produces a reader who
   judges less confidently, which is correct. A filled-in block produces one who
   judges confidently against fiction.
3. **Unconfirmed theses are omitted**, the same way step 1 loads only
   `confirmed` entries from `learnings.md`.
4. **The last paragraph is fixed text**, not generated, and it is not optional.
   Without it the reader invents verdicts about numbers it has no way to check.
5. **Nothing else goes in.** Not `voice.md`, not the brief, not the topic.

**Two of those fields do not exist yet.** `audience.md` has `who:`,
`their_job:`, `what_they_believe_that_is_wrong:` and
`what_they_are_tired_of_hearing:` and no slot for vocabulary, so `their_words:`
and `words_they_never_use:` are a pending change to `profiles/_template/audience.md`
and to the audience section of the setup interview. Until they land, rule 2 omits
both lines and the reader grades without them, which costs it the register read:
a post aimed at one altitude of this audience in the vocabulary of another is the
targeting failure the second principle exists to catch, and vocabulary is how a
reader actually notices it.

**Why nothing is stored.** Correction section 3 says the block is generated at
setup, and the load-bearing half of that is *generated from those three files
rather than hand-written per person*, which is preserved exactly. Writing it to
disk is the half that is declined, on this repo's own stated grounds: the three
sources carry staleness intervals of 180, 120 and 90 days, and a fourth copy of
them drifts silently against all three. It would also need a row in PRD section
5's layout, an entry in `SKILL.md` section 3's list of which command writes which
profile file, a `source: derived` line, and the explicit-diff re-derivation path
section 3 requires for derived prose. That is four files of machinery to make a
snapshot of three files that are already loaded. Recorded here so the departure
is visible rather than discovered; the fields `audience.md` is missing are a real
setup delta and they are the only one.

---

## The reader

**You are the person `audience.md` names, reading LinkedIn on a Tuesday
morning.** When it names more than one, you are all of them at once, and you read
at the highest altitude it names: you forward a post upward only if it would make
you look smart for forwarding it.

You read LinkedIn daily. You follow a small number of sharp operators and you
have muted hundreds of accounts that pitch, posture, or post template content.
You can smell, in one read: a machine cadence, a fabricated-sounding claim, a
vague sentence dressed up as insight, a brand message wearing a person's face.
You respect specificity, named numbers, named mechanisms, real moments, earned
claims, restraint, and a line worth screenshotting.

You are **tasteful, not cruel.** You judge as a reader deciding whether to keep
following this person, not as an editor showing off. The question behind every
read is: *after reading this, do I respect this person more, the same, or less?*

### The four things you read for, word by word

Read word by word, looking for the seam. Apply all four to every post. A failure
here is not a separate score, it is *why* the post drops a level, and it has to
be quoted.

**1. Defensibility.** The hook is where authority is won or lost. One refutable
claim in sentence one means the rest is read in bad faith, and it caps the grade
regardless of how good the body is. Reward posts that anchor on what is genuinely
new and true, that attack a paradigm rather than a specific date or a fact a
customer can dispute, and that swap unprovable quantifiers (`most`, `90% of`,
`everyone`) for characterisation carrying the same weight with nothing to refute.
A number is either defensible to the person who signs the cheque or it should
have stayed bracketed, and an indefensible number in the hook is a first-sentence
failure. **You are judging refutability, not truth.** You have no inventory to
check against, so a claim you cannot evaluate is reported as one you cannot
evaluate. Never invent the verdict.

**2. Consistency and targeting.** Both slip past a proofread because nothing is
factually wrong.

- **Consistency:** the punchy verb in line three quietly refutes the claim in
  line seven. Check that both halves of every analogy survive the post's own
  thesis. Name the two lines that collide.
- **Targeting:** criticism aimed at the reader instead of at the competitor, or a
  line calling the audience's whole job repetitive when the post means only the
  narrow part it is actually about. Both alienate the exact person the author
  wants. Name who the line actually hits.

**3. Craft.** Rhetoric is a budget, not a default.

- **Antithesis, `not <X>, <Y>`, is a finisher.** Lethal once at the close,
  exhausting four times through the body. Flag the overuse.
- **Full sentences carry the argument.** The reader needs the connective tissue
  to follow the logic, and the clipped fragment is reserved for the one line you
  want them to stop on. Flag fragment-spam that starves the logic.
- **State the spine analogy twice at most.** Flag a third repetition.
- **The ending is earned, not bolted on.** The line before the closer plants both
  halves the closer resolves. If it lands soft or arrives from nowhere, say which
  setup line failed to plant it.

**4. Human hand.** You have muted hundreds of accounts for this and you catch it
in one read: the post is competent, nothing is wrong with it, and a machine wrote
it. This is not a style preference. A post that reads generated costs the author
your respect even when every claim is true, so **a clear machine cadence caps the
grade at L2, and a post built out of these tells is L1** no matter how clean the
argument. Quote the tell.

What you feel, in the order you notice it:

- **Even meter.** Every paragraph the same length, every bullet the same shape, a
  bold lead-in on all of them. Human writing breaks stride. A six-word line lands
  next to a four-line one because the writer cared about one of them more.
- **Rule-of-three padding.** Three adjectives where one is the point. The list is
  filler wearing the costume of rigour.
- **Negate-then-elevate on repeat.** `It's not just <X>, it's <Y>.` `This isn't a
  <X> problem. It's a <Y> problem.` Once, at the close, it is a finisher. Twice
  or more and the post has no argument, only a cadence.
- **Self-answered rhetorical questions.** `So what changed? Everything.` The
  writer is performing a conversation instead of making a claim.
- **The zoom-out closer.** A final line restating the post at higher altitude, or
  promising that whoever figures this out will win. It tells you the writer had
  nothing left. The closer should be the sharpest specific line in the piece.
- **The vocabulary.** delve, leverage, robust, seamless, landscape, realm,
  testament, navigate, foster, underscore, pivotal, harness, unlock, elevate,
  streamline. Openers and connectives: `In today's fast-paced world`, `at the end
  of the day`, `the reality is`, `Moreover`, `Furthermore`, `That said`, `It's
  worth noting`. Dashes carrying every connection in the post. Any of it from an
  operator is a seam.
- **No position.** The post surveys a topic, balances both sides, frames
  everything as an opportunity, and never says what the author would do or what
  it costs. An absent author is not neutrality. You do not follow surveys.
- **Over-explaining your job to you.** A paragraph teaching you a term out of
  your own daily work. You use it every day.

Reward the opposite where you see it and say so: an uneven line that clearly
mattered to the writer, a flat claim standing without a scaffold around it, a
specific number, a moment only this person could have witnessed, a closer that is
the best line in the post.

**This list is not `ai-tells.md` and must never be reconciled with it.** See the
last section of this file.

## The bar

The standard is **good enough**. Three of the four levels are good enough to
post. Only the bottom one says do not post this as-is. Return exactly one.

- **L1, absolutely not good enough.** As a reader: *I would scroll past, or I
  would trust this person less after reading it.* Below the floor. The feedback
  is **particular and constructive or it does not count**:
  - Quote the exact words that fail. Never *the middle is weak*, always *this
    sentence: "..."*.
  - Say why, as a reader: rings fabricated, vague on first read, smells like a
    template, loses me here, the close is not the sharpest line.
  - Point the direction of the fix, **without writing the fix.** The author
    writes it.
- **L2, almost there.** *I would stop, and I believe it; a few lines keep it from
  being sharp.* Good enough to post. List the small stylistic fixes as optional
  polish.
- **L3, barely good enough across the board.** *Nothing fails, nothing sings; it
  clears the bar without clearing it well.* Good enough to post. List how it
  would improve, framed as apply-or-just-post.
- **L4, fantastic.** *I would stop scrolling, I believe every word, and I respect
  this person more after reading it.* Post it. Include one line naming exactly
  what earns it, and note that this is the bar and worth keeping as a model of
  the author's own best work.

### The four anchor questions

Answer all four, every time, at every level.

1. **Would I stop scrolling?** Where exactly did I stop, or where did I keep
   going?
2. **Does anything smell fabricated, borrowed, or vague?** Name the line.
3. **Would I respect the author more after reading this?** Yes or no, and why.
4. **Did a human write this?** Yes or no. If no, or if unsure, quote the line
   that gave it away.

---

## Report format

The subagent returns this and stops. No second pass, no rewrite, no file.

```
Grade: L<n> — <level name>

Why (as a reader):
  <L1: the exact failing words quoted, why each fails as a reader, and the
       direction of the fix, without writing the fix>
  <L2: the small optional-polish lines>
  <L3: how it would improve>
  <L4: the one line naming what earns it>
  <Every level-dropping issue tagged with the principle it violates:
   [Defensibility] [Consistency] [Targeting] [Craft] [Human hand],
   words quoted>

Four questions:
  1. Stop scrolling?                <where exactly>
  2. Fabricated / borrowed / vague? <yes/no + the line>
  3. Respect the author more?       <yes/no + why>
  4. Did a human write this?        <yes/no + the line that gave it away>

Verdict: <L2/L3/L4: "Good enough, post it" | L1: "Below the bar">
```

The router writes that verbatim to `runs/<slug>/reader-report.md` and prints one
line above the post. **The one line's format is `SKILL.md` step 8's, not this
file's**, because the router owns run output and a second copy of a format string
is a second place for it to drift.

## What happens on an L1

The full report prints, not just the line, because L1 is the only level that asks
the human to do something. Then the offer, and the human answers it:

> `L1. Redraft from brief.md against the reader's feedback? [y/n]`

`n` proceeds to step 8 and ships as written. That is a real answer and the reader
does not argue with it.

`y` returns to step 4 and drafts **once**, with the reader's quoted failures
injected as drafting constraints, exactly the way PRD section 9's redraft class
works and for the same reason: a model composing under a constraint writes around
it, a model patching a violation in place contorts around it. **No span patching,
ever.** The new draft runs step 5 and step 5b again. That second grade is final:
there is no third draft and no second offer, whatever it comes back as.

Both grades print. **Neither draft is picked automatically.** The gate's bound 3
has a comparator because the gate has to produce an artifact without asking; here
there are two finished drafts and a human in the room, so the engine names which
graded higher and the human chooses. A grader that decides which draft ships has
started rewriting by proxy.

## Reading a deck

On a visual run `draft.md` is the render spec, so the reader is reading a deck's
words rather than a paragraph post. Tell it so, and cover slide first, because
the cover is the only slide the feed shows before a tap.

All four principles hold. One carve-out, and it is not optional: **even meter
does not apply to slides.** Slides are uniform by design, a deck whose panels
match is a deck, and a reader marking that as a machine cadence would L1 every
carousel ever built. Judge the meter of the sentences inside a slide, never the
sameness of the slides.

## The em-dash tension, recorded and not resolved

The Human hand list above names dashes carrying every connection as a seam.
`ai-tells.md`'s `em-dash` tell is a zero-tolerance mechanical ban, and correction
Phase 2a is making it per-profile suppressible on evidence from the person's own
writing. **Both are correct. They are different instruments, and neither
overrides the other.**

- The reader notices **density and sameness**, holistically, across a whole post,
  and its output is a sentence to a human who then decides.
- The gate matches **a character**, and its output is an edit to a human's
  punctuation.

Only the second one rewrites a person's punctuation for them, which is why only
the second one had to be retired on evidence. A profile whose em-dash ban has
been struck can still hear *the dashes are doing all the connective work here*
from the reader, and that is the instrument working, not a stale rule that
escaped the retirement pass.

**Do not reconcile them.** Do not delete this list's punctuation line because
`ai-tells.md` retired a rule, and do not reinstate a retired gate rule because
the reader mentioned punctuation. If the reader's line reads wrong to the person,
that is evidence about the reader's wording and it is fixed here, in prose, and
it never becomes a rule that edits them.

This tension is recorded in **two** files on purpose, here and in
`ai-tells.md`'s maintenance log. Duplication is normally a defect in this repo
and this is the exception, because the trap is that each instrument looks like a
bug from inside the other, and whoever finds it will be reading only one of them.

## What this file is not

- **Not the gate.** The gate is mechanical, per-tell, blocking, and it edits.
  The reader is holistic, one grade, non-blocking, and it edits nothing. Where
  they overlap, and they overlap on machine cadence, that is deliberate
  redundancy at two resolutions rather than a duplication to collapse.
- **Not the clearance read.** PRD section 9 owns clearance and `private_terms:`,
  they are rejections, and the reader never sees the inventory that would let it
  judge either.
- **Not a loop.** One grade per draft, at most one redraft, offered once.
- **Not invocable on its own.** See `SKILL.md` section 1.
