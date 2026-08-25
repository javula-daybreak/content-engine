# Inventory

The key file. This is the raw material every post is built from, and nothing
factual is ever published that does not trace to a row here.

Append-only. Never rewrite an entry, never delete one. Correcting an entry means
appending a new one carrying `supersedes: <old-id>`; the old line is never
touched, and anything named by a `supersedes:` is excluded from the draft-time
load. Retirement moves an item to `inventory-archive.md` and is offered at
`/content-engine inventory`, never done silently.

Staleness interval: 30 days. Writers: `/content-engine setup`,
`/content-engine inventory`, `/content-engine review` (for cleared harvest
candidates), and `/content-engine post` when it accepts pasted material.

Floor: setup session 1 seeds 8 items, session 2 reaches 15 to 25. Below the
floor the engine says so and keeps interviewing.

## Schema

```
- id: <short-kebab-slug>
  type: story | belief | number | failure | observation | credential | gap
  content: one to three sentences of the actual raw material, in their words
  tags: []
  connects_to: []              # thesis ids
  source: interview | pasted | derived | proposed
  clearance: public | anonymized | do-not-publish
```

`clearance:` is required and set in the same turn the item is written, by one
question: "Could you say this on stage with that customer in the room?" It is
carried in the compact index, not only in the hydrated item, so the router can
filter before angle crossing spends tokens. An item marked `do-not-publish`
retires to `inventory-archive.md` immediately, regardless of use or lock.

There is no `used:` field and no `performance:` field. Lock state lives in
`runs/*/brief.md`. A `type: gap` row is a real answer: it records something they
could not answer, and the weekly top-up reads those rows.

`withdrawn: <date> <reason>` is appended by `/content-engine retract` and
permanently excludes the item from every draft-time load.

`last_reviewed:` is a top-level field of this file, one date for the set, stamped
by a completed weekly top-up rather than by the quarterly check. Added
2026-08-23: this file declared the shortest interval in the system, 30 days, and
carried no field to stamp, so it went stale a month after setup and stayed there.

```
last_reviewed:
```

## Items

