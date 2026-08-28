# Voice

How this person actually writes, measured from unedited samples rather than
described in adjectives. The language gate defers to this file: a tell that
contradicts a documented habit here does not fire for this profile, and the gate
records the override instead of rewriting.

**This is the first file setup fills.** The paste below is the front door, not a
later step: it is the only negative control the gate has, and without it every
rule runs untuned against the person's own voice.

Two different mechanisms defer to this person, and neither is the other. The
habit override above is per draft and reasons from the prose in this file.
`gate-calibration.md` switches a rule off for this profile entirely, and it is
written only from what `engine.js gate --negative` measured over the samples
below. Neither one is ever applied by editing `reference/ai-tells.md`, which
ships identical to everyone with every rule on.

Staleness interval: 90 days.

## The four measured values

**Frozen at setup and never overwritten.** Drift is only detectable against a
fixed baseline. Re-derivation may rewrite the prose below, never these.

```
avg_sentence_length: 16.4
sentence_length_stdev: 9.7
contraction_rate: 0.42
uses_fragments: yes
measured_at: 2026-08-25
measured_from: 2 slack messages + 1 email + 1 linkedin post + 1 internal memo
```

## Samples

<!-- verbatim, each marked source: pasted. these are the diff corpus until
     20 engine posts exist. -->

```
- source: pasted
  kind: <slack message | email | linkedin post | doc | dm>
  pasted_at: <YYYY-MM-DD>
  text: |
    <verbatim, unedited, line breaks and typos kept>
```

- source: pasted
  kind: slack message
  pasted_at: 2026-08-25
  text: |
    ok so the 7:30 board says 6 rooms and we have 4 anesthesia. i'm not moving the board again. whoever is on the phone with Dr. Halloran please tell him the 7:30 is his if he's in the room at 7:15, otherwise it goes to Rodriguez. we've slid this three weeks running and every slide costs us the 3pm slot on the back end

- source: pasted
  kind: email
  pasted_at: 2026-08-25
  text: |
    Hi Devon - I looked at the turnover dashboard you sent. Turnover is down from 34 to 27 minutes. Total cases per day is flat. So we bought 7 minutes and did nothing with them.
    Before we put that number in the board deck I'd want to say what it actually bought, because right now the honest answer is nothing. The constraint isn't the room. We have 11 block holders and 4 of them are under 60% utilization and nobody wants to be the person who takes block away from a surgeon.
    Happy to walk through it Thursday. -M

- source: pasted
  kind: slack message
  pasted_at: 2026-08-25
  text: |
    no. we are not adding a 6th room on fridays until PAT is caught up. 71% of our delays start before the patient gets to us. adding a room just adds a room to be late in.

- source: pasted
  kind: linkedin post
  pasted_at: 2026-08-25
  text: |
    Every OR dashboard I have ever been handed measures turnover time.

    Here is what turnover time measures: how fast my EVS team can flip a room. It is a real number and my team is good at it. We took it from 34 minutes to 27.

    Total cases per day did not move.

    We bought seven minutes eleven times a day and gave every one of them back, because the next patient wasn't ready, or anesthesia was in another room, or the tray was still in sterile processing.

    Turnover time is easy to instrument. That is the only reason it is on the dashboard.

    The number that would have told you something: how many of our delays started before the patient reached the OR. That one is 71%. Nobody asked me for it, because there is no field for it in the system.

    If you run a surgical service line and your throughput project is a turnover project, you are optimizing the twenty minutes you can see and ignoring the four hours you cannot.

- source: pasted
  kind: doc
  pasted_at: 2026-08-25
  text: |
    Effective Monday the 7:30 huddle is five minutes and it is standing. Three questions only: which rooms are staffed, which patients are not cleared, which trays are not back. If you need to discuss anything else, it is not a huddle item. I have sat in a 40-minute huddle that ended with two rooms still unstaffed and I am not doing that again.

**Paste below the fence, never inside it.** The block above is the schema, and
the engine strips fenced blocks before reading samples, so anything typed into
it is discarded without a word. Filling in the fence looks right and leaves you
with an empty corpus.

Same shape as `shipped-history.md` on purpose. `engine.js gate --negative`
reads these to measure how often the language gate fires on this person's own
writing, and **zero rewrites** is the pass bar — a rewrite edits a word they
wrote, while a redraft or a flag does not and does not fail the control. A
sample edited on the way in makes that number a lie. Paste it wrong rather than
paste it tidy.

## Habits

<!-- observed, not asserted. profanity, questions, how they handle lists,
     how they open, how they close, white space. each with source: derived
     and the sample it came from. -->

## No samples on file

If no sample was ever pasted, say so here explicitly rather than leaving the
file blank. When this file holds zero `source: pasted` entries, the gate report
opens with: "No samples of your writing on file, this draft is inferred, not
matched. Paste anything you've written and I'll re-derive." The engine leans on
`inspiration.md` until 10 posts have shipped, then re-derives voice from what
performed. It never refuses to draft.

## Provenance

`last_reviewed:` is stamped when the person accepts a re-derivation of the four
measurements, shown as an explicit diff against the values on file. Reading this
file never stamps it. Added 2026-08-23: this file declared a 90-day interval and
carried no field to stamp.

```
last_reviewed:
```
