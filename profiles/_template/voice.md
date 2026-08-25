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
avg_sentence_length:
sentence_length_stdev:
contraction_rate:
uses_fragments: yes | no
measured_at:
measured_from: <what was pasted, e.g. 3 slack messages + 1 email>
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
