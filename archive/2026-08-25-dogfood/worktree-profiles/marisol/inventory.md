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


- id: rooms-not-blocks
  type: belief
  content: >
    Six months ago I believed our problem was room count and I pushed a business
    case for two more ORs. Then I sat with the scheduling data for a week and
    found a Tuesday in February where six rooms sat idle at three in the
    afternoon while nine cases waited to get on the schedule. We didn't need
    rooms. We needed to take block time away from four surgeons running under
    60%, and nobody wanted to be the person who did that. I withdrew the
    business case.
  tags: [block-utilization, capacity, scheduling, capital]
  connects_to: [thesis-2, thesis-5]
  source: interview
  clearance: anonymized

- id: four-cancellations
  type: failure
  content: >
    In 2024 we were three anesthesiologists short. I built a schedule that
    assumed we would fill two of the three by March. We filled zero. I had
    already committed block time to ortho on that schedule. In April I cancelled
    four cases in one day and I let the scheduler tell the first two surgeons by
    phone. That was the mistake. I should have made those two calls myself. The
    third one I told in person and he is the only one of the four who still
    trusts my scheduling.
  tags: [staffing, cancellations, trust, anesthesia]
  connects_to: [thesis-3, thesis-5]
  source: interview
  clearance: public

- id: turnover-vanity
  type: number
  content: >
    We took turnover from 34 minutes to 27 over about a year. Total cases per day
    did not move. We bought seven minutes eleven times a day and gave every one
    of them back, because the next patient wasn't ready, or anesthesia was in
    another room, or the tray was still in sterile processing.
  tags: [turnover, dashboards, throughput]
  connects_to: [thesis-1]
  source: interview
  clearance: public

- id: pat-71
  type: number
  content: >
    71% of our case delays trace to something that happened before the patient
    got to the OR. Pre-admission testing not complete, consent not signed, no
    documented ride home.
  tags: [delays, pre-admission-testing, upstream]
  connects_to: [thesis-4, thesis-1]
  source: interview
  clearance: public

- id: robot-two-days
  type: observation
  content: >
    We bought a $1.4 million robot and it ran two days a week for the first
    eighteen months, because only three surgeons were credentialed on it. The
    business case assumed five days.
  tags: [capital, credentialing, utilization]
  connects_to: [thesis-2]
  source: interview
  clearance: anonymized

- id: anesthesia-short-2024
  type: story
  content: >
    In 2024 we were three anesthesiologists short for eight months. Every day
    short one anesthesiologist costs two rooms, because you can't run a room
    without one and you can't split one across two.
  tags: [staffing, anesthesia, capacity]
  connects_to: [thesis-3]
  source: interview
  clearance: public

- id: sterile-double-shift
  type: number
  content: >
    Tray error rate in sterile processing was 2.3%. We stopped letting techs work
    back-to-back doubles and it went to 0.4% in five months. Nobody wanted to
    hear that the fix was fewer hours from the same people.
  tags: [sterile-processing, staffing, quality]
  connects_to: [thesis-3]
  source: interview
  clearance: public

- id: huddle-five-minutes
  type: story
  content: >
    I inherited a 40-minute morning huddle. I cut it to five minutes and three
    questions: which rooms are staffed, which patients aren't cleared, which
    trays aren't back. It took four months for people to stop trying to add
    agenda items.
  tags: [huddle, management, meetings]
  connects_to: [thesis-4]
  source: interview
  clearance: public

- id: worst-hour-staffing
  type: belief
  content: >
    Staffing ratios get set against the average day. The average day doesn't
    exist. You staff for the worst hour or you send patients home.
  tags: [staffing, ratios, forecasting]
  connects_to: [thesis-3]
  source: interview
  clearance: public

- id: first-case-58-to-81
  type: number
  content: >
    First-case on-time starts went from 58% to 81% over fourteen months. The
    thing that moved it wasn't the surgeons. It was moving pre-admission testing
    calls from three days out to seven days out.
  tags: [on-time-starts, pre-admission-testing, upstream]
  connects_to: [thesis-4, thesis-1]
  source: interview
  clearance: public

- id: circulating-nurse-first-cancellation
  type: story
  content: >
    I started as a circulating nurse in 2008. The first time I saw a case
    cancelled at the door, the patient had been NPO since the night before and
    nobody had called her. I was 25 and I was the one who had to tell her. I have
    not sat in a scheduling meeting since without thinking about that hallway.
  tags: [origin, cancellations, patients]
  connects_to: [thesis-4, thesis-5]
  source: interview
  clearance: anonymized

- id: gap-labor-cost-per-case
  type: gap
  content: >
    I don't know what our labor cost per case is by service line. Finance has it.
    I've asked twice. That's a real gap and it's mine.
  tags: [finance, gap, labor-cost]
  connects_to: []
  source: interview
  clearance: public

- id: block-policy-never-enforced
  type: observation
  content: >
    We have 11 block holders and 4 are under 60%. The block policy says we can
    reclaim under 70%. It has never once been enforced, in nine years, at any of
    the three campuses I've worked in.
  tags: [block-utilization, policy, politics]
  connects_to: [thesis-2, thesis-5]
  source: interview
  clearance: anonymized

- id: no-field-for-it
  type: observation
  content: >
    The reason nobody measures upstream delay is that there's no field for it.
    Epic will tell you the minute the patient entered the room. It will not tell
    you why the case that was supposed to be in that room at 9:40 isn't.
  tags: [epic, instrumentation, dashboards]
  connects_to: [thesis-4]
  source: interview
  clearance: public

- id: cancelled-case-cost
  type: number
  content: >
    A day-of-surgery cancellation costs us about $4,200 in unrecovered fixed cost.
    It costs the patient two weeks and a second round of pre-op labs. Only one of
    those two numbers appears in any report I get.
  tags: [cancellations, cost, patients]
  connects_to: [thesis-4, thesis-5]
  source: interview
  clearance: anonymized
