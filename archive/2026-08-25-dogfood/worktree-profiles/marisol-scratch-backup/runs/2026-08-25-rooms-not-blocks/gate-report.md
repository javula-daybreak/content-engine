# Gate report\n\n```json\n{
  "check": "gate",
  "mode": "report",
  "gate_passes": false,
  "gate_catch_count": 0,
  "tags": [],
  "action": "redraft",
  "rewrites_required": 0,
  "rewrite_cap": 6,
  "over_cap": false,
  "redraft_constraints": [],
  "flagged": 0,
  "words": 213,
  "format": "short",
  "overlap_priors_compared": 1,
  "not_rewritten_quoted_or_factual": [],
  "lexical": {
    "check": "lexical",
    "pass": true,
    "format": "short",
    "action": "none",
    "rewrite_count": 0,
    "redraft_count": 0,
    "redraft_tells": [],
    "hits": [],
    "not_rewritten_quoted_or_factual": [],
    "suppressed_by_calibration": [],
    "hashtags": {
      "count": 0,
      "stack": false
    },
    "private_terms": {
      "brief": "found",
      "checked": 0,
      "violations": [],
      "note": "a private_terms hit is a rejection, never a repair, and it is never suppressible. Section 9, and gate-calibration.md rule 4."
    }
  },
  "stats": {
    "check": "stats",
    "pass": true,
    "measured": {
      "sentences": 14,
      "words": 213,
      "avg_sentence_length": 15.21,
      "sentence_length_stdev": 8.01,
      "contraction_rate": 0.47,
      "comma_density": 6.57,
      "burstiness": 0.527,
      "punctuation_density": 6.57,
      "nominalisation_rate": 1.41,
      "specifics": 2,
      "proper_nouns": 1,
      "first_person_plural": 4,
      "paragraph_lines": [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1
      ],
      "shortest_sentence": 3,
      "longest_sentence": 35
    },
    "baseline": {
      "avg_sentence_length": null,
      "sentence_length_stdev": null,
      "contraction_rate": null,
      "uses_fragments": null
    },
    "baseline_source": "none, absolute floors applied",
    "distribution_baselines": {},
    "flags": [],
    "suppressed_by_calibration": []
  },
  "overlap": {
    "ran": true,
    "check": "overlap",
    "pass": false,
    "priors_compared": 1,
    "ngram": 8,
    "failures": [
      {
        "prior": "2026-08-25-champion-signer",
        "words": 12,
        "text": "I spent a year believing our forecast problem was a rep discipline"
      },
      {
        "prior": "2026-08-25-champion-signer",
        "words": 26,
        "text": "forecast problem was a rep discipline problem, and I was wrong about where the discipline was missing.\n\nLast year, I pulled every deal over 250k that"
      },
      {
        "prior": "2026-08-25-champion-signer",
        "words": 23,
        "text": "pulled every deal over 250k that slipped out of Q4 and into Q1. Fourteen of them.\n\nEleven had a champion who had never"
      },
      {
        "prior": "2026-08-25-champion-signer",
        "words": 161,
        "text": "same room as the person who signs.\n\nNot \"hadn't met recently,\" not \"met once at the kickoff.\" Never: no call, no dinner, no forwarded thread with a reply on it.\n\nSo I stopped asking my reps why the deal slipped, because the answer was not in the rep. It was in the coverage model, and the coverage model only talks to users.\n\nUsers can tell you what the product does for them, better than we can, in more detail than we can. They cannot tell you what happens to the budget in the second week of December, when finance re-reads the list.\n\nWe changed one thing. A deal over 250k does not go past 50 percent until somebody on my team has had a conversation with the signer, not the champion's summary of the signer, and not the champion's forwarded slide.\n\nCoverage is a distribution, not a headline number. Four deals at 4x, and one of them is the quarter"
      }
    ],
    "warnings": [
      {
        "prior": "2026-08-25-champion-signer",
        "words": 8,
        "text": "our forecast problem was a rep discipline problem",
        "note": "traceable to inventory or thesis, cited rather than failed"
      },
      {
        "prior": "2026-08-25-champion-signer",
        "words": 8,
        "text": "I pulled every deal over 250k that slipped",
        "note": "traceable to inventory or thesis, cited rather than failed"
      },
      {
        "prior": "2026-08-25-champion-signer",
        "words": 17,
        "text": "Eleven had a champion who had never been in the same room as the person who signs",
        "note": "traceable to inventory or thesis, cited rather than failed"
      }
    ],
    "sentence_similarity": [
      {
        "slug": "2026-08-25-champion-signer",
        "matched_sentences": 12,
        "ratio": 0.857
      }
    ]
  },
  "model_owned": [
    "unearned-rule-of-three",
    "parallel-bullets",
    "restating-close",
    "announcement-shape",
    "testimonial-quote",
    "all-contractions",
    "clearance"
  ],
  "calibration": {
    "file": "absent",
    "suppressed": [],
    "evidence": [],
    "baselines": {},
    "measured_at": null,
    "note": "rule 2: an absent gate-calibration.md means every rule fires. It is not a clean pass, and it is not a suppression of anything."
  },
  "note": "gate_catch_count and tags are engine-owned tells only. rewrites_required is repairs, which is all the editing section 9 leaves, and over_cap true is bound 3: return to brief.md and redraft once with redraft_constraints as the constraints. The redraft happens once; if it still trips, gate --compare picks which of the two ships. Lock 5 is reported under overlap and is counted nowhere else, so read that block rather than the tag list for it."
}\n```\n\n## rewritten

(none. `rewrites_required: 0`. Every tell this draft tripped is redraft-class.)

## not rewritten: quoted or factual

(empty, copied from `not_rewritten_quoted_or_factual`.)

## overrides

(none.)

## unresolved

punctuation-density. Draft 2.56 against a 2.865 limit derived from her own
samples' 3.82. One redraft already ran (v1 also tripped `voice-floor` and
`zero-contractions`, both cleared). Per SKILL.md step 5 bound 3, shipping the
better draft with this named.
