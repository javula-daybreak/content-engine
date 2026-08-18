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
