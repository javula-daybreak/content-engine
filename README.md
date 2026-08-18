# Content Engine

```
git clone <url> ~/.claude/skills/content-engine
/content-engine setup
```

That is the whole install. The interview is the only setup step, and it is a
conversation rather than a form. Nothing is hand-edited to get started, no
credential is entered anywhere, and no connector is ever required.

What you download is the whole engine. Every workflow, every reference file,
every config template, and the render pipeline ship already wired to each other.
Setup adds nothing but answers: your inventory, your voice, your thesis, your
identity, your audience.

## After setup

```
/content-engine                          5 angles, drafts the best, prints the rejects
/content-engine post <topic>             short post on a given thing
/content-engine post "<pasted text>"     drafts from what you pasted this morning
/content-engine carousel <topic>         6 to 10 slide PDF
/content-engine infographic <topic>      single image
/content-engine as <handle>              scopes one invocation, does not persist
/content-engine inventory                top-up interview
/content-engine review                   weekly reconcile, performance, learnings
/content-engine retract <slug|item-id>   withdraw a fact or a piece
```

## What it will not do

It does not post for you. It does not log in to LinkedIn as you, ever, for
reading or for writing. It does not run unattended, and it never invents a fact,
a number, a story, or a credential: everything factual traces to something you
said in the interview.

## Your profile is yours

`profiles/<handle>/` holds your material and is gitignored. `profiles/_template/`
is the only profile in the repo, and it is empty. Nothing fictional ships here.

## Requirements

Claude Code, and Node for the deterministic checks and the render pipeline.
`npm install` is needed only for the visual formats, which pull Playwright.

## Spec

`content-engine-PRD.md` is the single source of truth. `content-engine-VISUALS.md`
is the infographic spec. Build order is PRD section 13.
