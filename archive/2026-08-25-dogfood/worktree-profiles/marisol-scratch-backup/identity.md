# Identity

Written by `/content-engine setup`, fact by fact, as each one is confirmed.
Staleness interval: 180 days. Every entry carries `source:`.

`from:` records whether the fact came from research or from them. `research`
means the interviewer looked it up; `them` means they said it. Do not merge the
two, and never write a company fact from memory after a failed lookup.

```
name:
role:
company:
tenure:
before:
studied:
sells_what:
sells_to:
disclosure_posture: open | nda-default
owner:                       # only when the profile is not a person
last_reviewed:               # set the day the section is confirmed, never backdated
```

`disclosure_posture: nda-default` changes the interview: inventory items are
captured `do-not-publish` by default and cleared actively, one at a time.

`owner:` is required when this profile writes as a company page rather than as a
human, and it names the human accountable for what ships.

## Facts

<!-- one block per fact, each with source: interview | pasted | derived | proposed
     and from: research | them. nothing is written unconfirmed. -->

```
name: Marisol Okonjo-Reyes
role: Director of Perioperative Operations
company: Northgate Health, a 400-bed nonprofit hospital system, three campuses
tenure: 14 years in perioperative leadership; 9 of them as director, all at Northgate
before: OR charge nurse then surgical services manager at a 180-bed community hospital; circulating nurse from 2008
studied: BSN, then MSN in nursing administration, night program
sells_what: nothing. Surgical services, about 14,000 cases a year across three campuses. We bill, we do not sell.
sells_to: n/a
disclosure_posture: nda-default
source: interview
from: them
last_reviewed: 2026-08-25
```

<!-- her words on the disclosure question: "We're a nonprofit system, not a
     public company. I can't name surgeons, I can't name payers, and I can't put
     a specific case on the internet. Operations numbers I've already shown at a
     state association meeting are fine. Assume I can't post it until I say I
     can." -->

<!-- homework lookup, 2026-08-25: the search for her employer returned a
     different, real hospital (PeaceHealth Sacred Heart at RiverBend, 388 beds,
     Springfield OR). Not her organisation. Nothing from that lookup is
     written here. Every line above is from: them. -->
