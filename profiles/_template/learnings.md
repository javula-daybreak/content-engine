# Learnings

What has performed. Written only by `/content-engine review`. Append-only.

**Only `confirmed` entries load at draft time.** `hypothesis` and `killed`
entries stay here for the human to read at review.

## Threshold

No entry is written from a single pair of posts. A pattern qualifies when it
holds across at least 5 posts on each side of the comparison, tested as an exact
Mann-Whitney U on the ten scores, qualifying at U <= 2 (two-tailed p = 0.0317).
There is no single-post shortcut: LinkedIn engagement is heavy-tailed, and a
"beats the trailing median" rule manufactures a finding a week out of variance.

Any post carrying `run_again: -` is excluded from the median, from hypothesis
generation, and from any hypothesis's supporting set.

## Schema

```
- id: learn-<n>
  status: hypothesis | confirmed | killed
  claim: the specific candidate difference, named
  dimension: hook_pattern | item_type | format | opening_length | has_number | day_time
  support: [<run_slug>, ...]       # >= 5 each side
  against: [<run_slug>, ...]
  u_statistic:
  written_at:
  resolved_at:
  resolution: <why it was confirmed or killed>
```

A hypothesis is killed on the same evidence that would have qualified its
inverse. Unresolved at 90 days, it is marked killed.

Cap this file at directional guidance. The exploration budget is one post in
five, written automatically into `brief.md` as `arm: explore`, and an
exploration post deviates on one named dimension rather than ignoring the
learnings all at once.

## Entries

