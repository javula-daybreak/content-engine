# Content Engine

```
cp -R "content engine" ~/.claude/skills/content-engine
/content-engine setup
```

That is the whole install. **There is no published remote yet**, so this is a
copy of the directory rather than a clone; the line was `git clone <url>` until
2026-08-20, and a literal `<url>` in the one file that is supposed to be the
whole explanation is the explanation failing.

The interview is the only setup step, and it is a conversation rather than a
form. Nothing is hand-edited to get started, no credential is entered anywhere,
and no connector is ever required.

What you copy is the whole engine. Every workflow, every reference file, every
config template, and both renderers ship already wired to each other. Setup adds
nothing but answers: your inventory, your voice, your thesis, your identity, your
audience.

## After setup

```
/content-engine                          5 angles, drafts the best, prints the rejects
/content-engine post <topic>             short post on a given thing
/content-engine post "<pasted text>"     drafts from what you pasted this morning
/content-engine carousel <topic>         6 to 10 slide PDF
/content-engine infographic <topic>      single image
/content-engine article <topic>          newsletter edition, plus its carousel
/content-engine as <handle>              scopes one invocation, does not persist
/content-engine inventory                top-up interview
/content-engine review                   weekly reconcile, performance, learnings
/content-engine retract <slug|item-id>   withdraw a fact or a piece
```

Every command in that list routes to a file that exists, as of 2026-08-23. One
command is deliberately not listed: `/content-engine connect`. It is never
offered, and its name appears in exactly one place in the whole system, which is
a line `review` prints only if the manual paste path turns out not to be keeping
up. A feature that reads your chat and mail should be typed by someone who went
looking for it, not advertised to someone who did not.

## What it will not do

It does not post for you. It does not log in to LinkedIn as you, ever, for
reading or for writing. It does not run unattended, and it never invents a fact,
a number, a story, or a credential: everything factual traces to something you
said in the interview.

It reads no chat and no mail unless you declare an allowlist yourself, one
channel at a time, and it clears nothing out of that allowlist for publication
without a keystroke from you per item. It takes no credential to do it and opens
no session on your behalf.

## Your profile is yours

`profiles/<handle>/` holds your material and is gitignored. `profiles/_template/`
is the only profile in the repo, and it is empty. Nothing fictional ships here.

## Requirements

Claude Code. Node for the deterministic checks (`reference/engine.js`, no npm
packages). Python 3 and a headless Chrome for the two renderers, both stdlib
only. **Nothing to install, ever** — no `npm install`, no `pip install`, no
Playwright, which is the whole point of PRD §1.3 and the reason the renderers are
vendored Python instead of a Node render pipeline. Corrected 2026-08-20: this
section promised an `npm install` that was never possible, since no
`package.json` was ever written.

## Spec

`content-engine-PRD.md` is the single source of truth. `content-engine-VISUALS.md`
is the infographic spec. Build order is PRD section 13.
