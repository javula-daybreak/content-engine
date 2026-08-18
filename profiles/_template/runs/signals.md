# Signals

Append-only ledger, not a profile file, so any run may append and no named
writer is needed. Written by the Tier 0 scan at the top of the default run, and
only when this file is older than 24 hours. Capped at three queries.

A signal is an occasion, never a subject. It surfaces only against an existing
thesis, it carries a verbatim quote and a source, and it never replaces the
anchor.

```
- id: sig-YYYY-MM-DD-<slug>
  kind: proof | contradiction | access
  visibility: public | private
  source: <url> | <slack:#channel/pTS>
  quote: "verbatim"
  contradicts: thesis-<n>       # or supports: thesis-<n>
  captured:
  expires:
```

Dedup reuses the lock mechanism: a signal whose id appears in any `brief.md` is
never surfaced again. There is no mutable status field.

A `visibility: private` signal puts every proper noun, numeral, and distinctive
phrase whose only source is that signal into the run's `private_terms:`, which
the gate rejects on as a literal string match.

## Signals

