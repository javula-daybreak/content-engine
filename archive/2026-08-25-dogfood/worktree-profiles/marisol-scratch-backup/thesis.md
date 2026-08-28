# Thesis

The 3 to 5 recurring arguments this person makes. Not asked cold: the
interviewer proposes them back after the raw material section and asks for
corrections, because people are bad at stating their own thesis on demand.

Staleness interval: 90 days.

```
- id: thesis-1
  claim: one sentence, in their words after correction
  against: the strongest version of the opposing position, phrased the way
           someone who actually holds it would put it
  source: proposed          # proposed by the engine, confirmed by the human
  confirmed_at:
```

`against:` is required. A thesis with no credible opponent is a platitude, and
it gives the engine nothing to argue with. Ask "who disagrees with this, and how
would they put it?" and record the answer as they said it, not as a strawman.

`last_reviewed:` is a top-level field of this file, one date for the set, stamped
by `/content-engine review`'s quarterly check. Added 2026-08-23: this file
declared a 90-day interval and carried no field to stamp, so it could be flagged
stale and never cleared.

```
last_reviewed:
```

## Theses


- id: thesis-1
  claim: >
    Turnover time is the metric hospitals reach for because it is the only part
    of the delay anybody instrumented. It measures my EVS team. It does not
    measure my capacity.
  against: >
    Turnover is the one piece of the chain the OR actually controls. You can't
    fix anesthesia staffing from the director's chair, but you can fix a
    34-minute flip, and seven minutes times eleven rooms times 250 days is real
    capacity whether or not you booked cases into it.
  source: proposed
  confirmed_at: 2026-08-25

- id: thesis-2
  claim: >
    The OR is a scheduling and staffing problem wearing the costume of a speed
    problem. The capacity you already own is sitting in block time nobody will
    reclaim.
  against: >
    Block time is how you keep surgeons from taking their volume down the road.
    Reclaiming it saves you an hour on Tuesday and costs you a spine surgeon for
    good. The utilization number is real and the retention risk is realer.
  source: proposed
  confirmed_at: 2026-08-25

- id: thesis-3
  claim: >
    You staff against the worst hour, not the average day, or you cancel. A ratio
    built on an average is a number somebody wanted to defend in a budget
    meeting.
  against: >
    Staffing to peak is how you end up with a labor cost per case nobody will
    sign. You flex. That is what per-diem and float pools are for, and if you are
    cancelling four cases in April your problem is forecasting, not headcount.
  source: proposed
  confirmed_at: 2026-08-25

- id: thesis-4
  claim: >
    Most of what a dashboard measures is whatever happened to have a field. The
    delay that matters happens upstream of the OR, where nothing is
    instrumented.
  against: >
    If you can't measure it you can't manage it, and "it's upstream and
    unmeasured" is what every director says about the part of the process they
    own. Build the field. Don't tell me the system can't see it.
  source: proposed
  confirmed_at: 2026-08-25

- id: thesis-5
  claim: >
    Every operations fix has a name attached to it, and the fixes that never
    happen are the ones where the name is a surgeon's.
  against: >
    You are describing normal organizational politics as though it were a
    discovery. Every function has stakeholders. The job is to build the
    coalition, not to publish a post about how nobody wants to.
  source: proposed
  confirmed_at: 2026-08-25
