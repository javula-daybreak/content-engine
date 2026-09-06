# Content Engine

Run this **from inside this folder**, the one holding the README you are reading:

```
mkdir -p ~/.claude/skills && cp -R . ~/.claude/skills/content-engine
/content-engine setup
```

That is the whole install. **There is no published remote yet**, so this is a
copy of the directory rather than a clone; the line was `git clone <url>` until
2026-08-20, and a literal `<url>` in the one file that is supposed to be the
whole explanation is the explanation failing.

**Corrected 2026-09-06, and it was the most-hit defect in the engine.** This
read `cp -R "content engine" ~/.claude/skills/content-engine`, a path resolved
against the *parent* of this folder, with no line saying so. Every one of six
dogfood reports hit it, two of three testers were stopped dead by it, and the
next line — `/content-engine setup` — then failed with `Unknown skill`, so a
six-line README had both of its lines broken. `cp -R .` resolves against where
you already are.

**Copy it again after every change.** `/content-engine` reads the copy under
`~/.claude/skills/`, never this folder, so edits here do nothing until you
re-run the line above.

The interview is the only setup step, and it is a conversation rather than a
form. Nothing is hand-edited to get started and no connector is ever required.

**One credential, and only for images. Changed 2026-09-06.** This used to say
"no credential is entered anywhere," and that stayed true for every text format
and is still true for them. The visual formats now call an image-generation
model, which needs an API key: put `OPENROUTER_API_KEY=<key>` in a `.env` file
at the repo root, which is gitignored. Nothing reads it but
`render/imagegen/render.js`, and nothing else in the engine needs a credential
of any kind. Image generation costs real money, roughly $0.05 an image; the
renderer prints what each call cost.

What you copy is the whole engine. Every workflow, every reference file, every
config template, and the renderer ship already wired to each other. Setup adds
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
                                         (unlocks after 8 short posts shipped)
/content-engine as <handle>              scopes one invocation, does not persist
/content-engine inventory                top-up interview
/content-engine review                   weekly reconcile, performance, learnings
/content-engine retract <slug|item-id>   withdraw a fact or a piece
```

**The article cap is real and it is the one surprise in that list.** An article
needs 8 short posts shipped since the last one, so on a fresh profile three of
the four formats are locked for roughly two months. It went unmarked here until
2026-09-06, and all three dogfood testers hit it as a wall rather than a
constraint: each invented a different workaround, and two wrote fictional runs
into their own ledger to move the counter, which `SKILL.md` §4 forbids in as
many words. A cap the reader knows about is a schedule. A cap they meet at the
refusal is a reason to lie to the tool.

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

Claude Code. Node for the deterministic checks (`reference/engine.js`) and for
the renderer (`render/imagegen/`), both stdlib only and neither with a
`package.json`. A headless Chrome, which the renderer drives to print a carousel
deck to PDF and installs nothing to do. An OpenRouter API key in `.env`, for the
visual formats only. **Nothing to install, ever** — no `npm install`, no
`pip install`, no Playwright, which is the whole point of PRD §1.3.

Corrected 2026-08-20: this section once promised an `npm install` that was never
possible, since no `package.json` was ever written. Updated 2026-09-06: Python 3
is no longer required. The two vendored Python renderers were replaced by
`render/imagegen/`, and they are in `archive/2026-09-06-html-renderers/`.

## Spec

`content-engine-PRD.md` is the single source of truth. `content-engine-VISUALS.md`
is the infographic spec. Build order is PRD section 13.
