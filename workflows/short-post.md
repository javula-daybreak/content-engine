# Short post

`/content-engine`, `/content-engine post <topic>`, and
`/content-engine post "<pasted material>"` all land here.

**This file owns pipeline step 4, the draft, and nothing else.** Steps 1, 2, 3,
5 and 8 belong to the router in `SKILL.md`. A line here that restates one of
them is a bug, because two copies of a rule is two places for it to be wrong.

## What the three entry points change

Only the anchor selection at step 2 differs. Everything downstream is identical.

| Entry | What it constrains |
| :- | :- |
| no args | Nothing. Step 2 selects off unlocked inventory. |
| `post <topic>` | The topic filters the shortlist. If nothing unlocked matches it, say so and offer the nearest unlocked anchors rather than drafting off a locked one. |
| `post "<pasted material>"` | The pasted text is this run's anchor material, and it is the one write a draft run may make. See below. |

## The paste path

The material arrived this morning and is not in `inventory.md` yet. Draft from
it in the same run, then write it down.

1. Draft from the pasted text as the anchor. It has no id yet, so `brief.md`
   carries `anchor: pasted` until step 8.
2. Ask the clearance question in the same turn, before drafting: **"Could you
   say this on stage with that customer in the room?"** A draft written before
   that answer is a draft the gate cannot check, since the clearance read at
   step 5 has nothing to read against.
3. On acceptance, append it to `inventory.md` through the `inventory` writer:
   verbatim, `source: pasted`, the clearance from step 2, and the run slug.
   Then replace `anchor: pasted` in `brief.md` with the new item id.

**Acceptance means the ship question was answered, either way.** `y` is
acceptance, and so is answering `n` and pasting what they actually published,
because both mean the material went out. Deferring to the weekly review or
abandoning the run writes nothing. The guard exists so a run nobody finished
cannot leave a line in the person's inventory.

Never write anything the model derived, inferred, or rewrote. The only line a
post may add to a profile is one the human typed into it.

## The shape

**LinkedIn renders no markdown.** Asterisks show as asterisks, `#` shows as a
hash. Line breaks and blank lines are the entire formatting system available.
Anything written as a heading arrives as a line of punctuation.

- **One idea.** The angle is the idea. A second interesting idea is next week's
  post, not this paragraph.
- **The hook line stands alone**, on its own line, with a blank line after it.
  It is the pattern named by `hook_id:` in `brief.md`, written from the anchor's
  own material. `reference/hooks.md` holds the shapes.
- **Everything that earns the tap sits above the fold.** LinkedIn truncates the
  post behind a "see more" link, so the hook and the reason to keep reading have
  to be in the first two or three lines. **[UNVERIFIED 2026-08-18, owner
  Joseph]** the exact cutoff, which differs between mobile and desktop and moves.
  Write to two lines and it does not matter what the number is.
- **Vary the paragraph lengths.** Every paragraph the same number of lines is a
  section 9 tell and `gate --report` catches it as `uniform-paragraphs`.
- **Land it, do not close it.** The last line is the one that lands. A question
  to the feed, a restatement of the post, and a call to action are all section 9
  tells, and the first two get caught by name.
- **Length is a knob, not a rule.** Aim for one screen. The number gets set at
  section 13 step 8 against ten real posts, the same way the rewrite cap does.

## Drafting

`brief.md` already exists, written at step 3 before any draft token was spent.
Read it and draft to it. Do not revise the brief to match a draft that wandered.

1. **Open on the hook.** Take the pattern `hook_id:` names and write it from the
   anchor. The examples in `reference/hooks.md` are shapes with slots and never
   sentences to lift.
2. **Put the anchor's own words in quotation marks when you use them
   verbatim.** This is the drafting half of section 9's protected spans, and
   without it the mechanism does not work: the gate refuses to edit inside
   quotes, so unquoted verbatim material is material the gate is free to rewrite.
   Several banned words are ordinary speech in operations, and a silently edited
   quote from a named person breaks section 14's most important rule using
   section 9's own machinery.
3. **Name things.** People, companies, dates, numerals, all from the anchor and
   the supports. The specifics floor is a redraft rather than a rewrite, because
   an abstraction cannot be patched into an instance. Satisfying it while
   drafting costs nothing and satisfying it afterwards costs the whole draft.
4. **Cite the supports, do not retell them.** Up to four, and each is a
   sentence. Only the anchor consumes a lock, and a support that grows into a
   second story is a second anchor that never got locked.
5. **Write `runs/<slug>/draft.md`.** Then hand back to the router for step 5.

## What this file does not do

It does not gate, rewrite, log, print the angle line, print the rejects, or ask
the ship question. Those are steps 5 and 8, and they run identically for every
format. Write `draft.md` and stop.

The short-post shape above lives here rather than in a shared `formats.md`,
because the router already owns everything that is shared and a second home for
a format rule is a second place for it to drift. The carousel and infographic
workflows own theirs the same way.
