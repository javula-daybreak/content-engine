# Connect

`/content-engine connect`. Declares the harvest allowlist: the named chat
channels and the named mail query the weekly review is allowed to sweep. It
writes one file, `profiles/<handle>/connectors.md`, so that scope can be audited
by opening it, in five seconds, without reading any code.

**This file owns no pipeline step** and this command drafts nothing. It is
opt-in, absent by default, and required by no path in the engine.

## It has nothing to do with LinkedIn, and that is a decision

If `connect` was typed expecting to connect a LinkedIn account, the answer is no,
and it is not a not-yet.

- **No login, ever, for reading or for writing.** No scraper, actor, extension,
  or script authenticates to LinkedIn as an account this engine writes for.
  Reading is copy-paste, the same way posting is.
- **The engagement numbers come off the human's own screen.** Owned-account
  numbers are the values typed at `/content-engine review`, never scraped. A gap
  in `posts.csv` is a column nobody has typed yet, never a missing connector.
- **The one scraper the spec ever costed is cut in advance.** PRD §11 carries an
  `[UNVERIFIED]` tag on whether the chosen actor needs a LinkedIn session cookie,
  and the answer is pre-committed: if it does, the feature is cut, not moved to a
  burner account. There is no cookie path to design, no burner to offer, and
  nothing here to negotiate down to.

Do not propose a reduced LinkedIn version. There is not one. The narrow thing
this command does is below, and it is about the person's own writing.

## What it never does

None of these is a not-yet either.

| Never | Because |
| :- | :- |
| Takes a credential, token, cookie, password, or OAuth grant | No credential is entered anywhere in this engine. Chat and mail arrive as MCP servers the human authenticated in their own Claude Code, outside this repo. This command asks for a channel name. |
| Offers all of chat, the whole inbox, or a wildcard | That is not a scope. Allowlist only, named one line at a time. |
| Browses, lists, or searches to help you choose | Enumerating channels or labels is reading the account. The human types the names they already know. |
| Reads a single message | Reading belongs to the harvest, inside `review`, per item, behind a keystroke. This command reads nothing but the answers it was handed. |
| Clears anything for publication | Every harvested candidate is `clearance: do-not-publish` until a human clears it one at a time. Declaring a scope is not consent to publish out of it. |
| Schedules anything | No daemon, no cron, no wake path. A sweep happens when a human runs `review` and is watching it. |
| Accepts a source beyond chat and mail | Calendar, drive, docs, notes and ticket systems are decided against, not unbuilt. Calendar was the lowest-risk source and also the one with the least prose in it, so it buys structure the engine does not need. |
| Becomes required | Every path works with zero connectors. Anything a connector supplies degrades to a search result or to nothing, in one line, and the run completes. |

## It is never offered, only typed

`connect` is named in exactly one place: the single earned line at the end of
`/content-engine review`, printed only when net new inventory came in under 1.5
items a week at week 6. Below that number the chore is demonstrably failing and
the offer has evidence behind it. At or above it, the manual paste path is
already doing the job, the harvest is skipped rather than deferred, and the line
does not print.

**Never at setup, and never unprompted.** Setup is the moment of maximum
distrust in the product's life, and an engine that asks for someone's inbox
before it has written them one good post is asking at the worst available moment.
It is the same reason the external portability test runs before any of this
exists: a tester whose engine offers to read her inbox is measuring something
other than portability.

Say two things, one line each, before the first question, then proceed if they
still want it:

1. Whether that number has been reached, read off `inventory.md`'s appends.
2. Whether the harvest that reads this file is built yet. Until it is, `connect`
   writes a scope declaration nothing reads. That is harmless and it is honest,
   and it is not the same thing as a working feature.

## The questions, and the write

Three, and every answer is a string the human typed.

1. Which channels? Named one at a time, nothing wildcarded.
2. Which mail query or label? One, as they would type it into the search box.
3. Anything inside either that should never be swept? Recorded as an exclusion,
   and an exclusion always beats an inclusion.

Write `connectors.md` in the turn the answers are confirmed, then print the file
back and ask them to read it. That readback is the whole reason the file exists.

```
# Connectors

The harvest allowlist. Written only by `/content-engine connect`. Never loaded
at draft time.

declared: <date>

channels:
  - name: "<channel as they typed it>"
    source: interview
mail:
  - query: "<query as they typed it>"
    source: interview
exclude:
  - "<channel, label, or sender>"
```

`source:` is `interview` on every line, because a human said it in answer to a
question. `connect` never writes `derived` or `proposed`: it does not guess a
channel name, and an unconfirmed answer is not written at all.

## Changing it, and turning it off

Re-run `connect`. It reads the current file, prints it, and asks what changes.
Show a line diff and do not write until they accept, which is the same discipline
every other rewrite of a profile file gets. A removal takes effect on the next
sweep and needs no other step. Deleting `connectors.md` turns the harvest off
completely, and `review` then skips the sweep silently.

## The ruling

`connect` is buildable as advertised, and only because what it was ever
advertised as is narrow: it takes no credential, opens no session, reads no
message, and touches LinkedIn at no point. What it cannot honestly be is
prominent. Its precondition is a number that may never come in low enough, the
step that consumes its output may never be built, and the one place its name may
appear is a single earned line in a weekly review. A `connect` that announces
itself is already the wrong feature, whatever it writes.
