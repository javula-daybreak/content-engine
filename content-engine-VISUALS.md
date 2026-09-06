# Visual system: infographics

**For:** Claude Code. Companion to `content-engine-PRD.md` §10, which this file expands. Evidence is archived at `archive/2026-08-17-content-engine-VISUAL-TEARDOWNS.md`. **§2, §3, and §5 of this file become `reference/archetypes.md` at PRD §13 step 11, and §6 becomes additions to `reference/design-tells.md`.** At that point this file has been consumed and belongs in `archive/` too.

> **Evidence base.** Fourteen LinkedIn infographics from three creators in three unrelated niches: Crustdata (B2B data vendor), Jonny Tooze (AI explainers for non-technical leaders), Pierre Herubel (B2B content marketing). Each was torn down individually against pixel-measured metrics: background color, ink coverage, content bounding box, dominant non-background colors with coverage share, and a twenty-band vertical ink profile. Each was also read at 220px wide, which is roughly how a LinkedIn image first appears in feed. Every measured number in this file traces to that set. The niches are irrelevant to us and were chosen for that reason; the forms are what transfer.

> **What this file is not.** It is not a style guide and it holds no Daybreak strings. Everything here is true for any profile, per PRD §2. What varies per person lives in `theme.json`.

---

## 1. The two-layer law

Every one of the fourteen images is two documents printed on one canvas.

The **feed layer** is what survives at 220px: the headline lockup, which may include a badge set as part of it, the structural silhouette, and at most one more tier of type. The **stop layer** is everything else, and it is invisible until someone taps.

This is measured, not asserted. Across all fourteen thumbnail tests, five read as fully intact at 220px and nine as partial. Zero failed outright. In all fourteen, the thing that died was body text, and in all eight of the images carrying a subtitle it died with it. Concretely: Crustdata's chart loses its metric, its entity, and its date window; Tooze's twelve-tile grid loses roughly 200 of its 251 words; Herubel's bullseye loses all 33 chip labels; his iceberg loses all 24.

Three consequences, and everything else in this file is downstream of them.

1. **The claim must be complete in the headline plus the structure.** If a reader has to read body copy for the image to mean anything, the image does not work in a feed. It works in a portfolio.
2. **The subtitle carries scope and provenance, never payload.** Units, sample size, date range, method. All of it dies at feed size and all of it is what makes the claim honest at stop size. That is exactly the right division of labor, and it is why the subtitle is not optional even though nobody reads it while scrolling.
3. **Density is not the enemy.** Measured ink coverage across the set runs 7.0% to 66.1% and both extremes work: a Crustdata chart at 7.0% and a Tooze grid at 66.1%. What separates the working dense image from the wall of text is whether the top layer is separable, not how much sits underneath it.

**The test for whether a form belongs in this catalog at all.** A form ships if the set of atoms surviving 220px is itself the claim. That single sentence decides most of §9's refusals: the tile taxonomy ships because its labels survive and its bodies are stop-layer reward, and an n-by-m capability matrix does not, because its payload is the cells and no cell survives.

**The check.** Downscale the render to 220px wide and require that the headline's cap height survives. At 1080px canvas width that means claim-carrying type at 40px cap height or larger. Measured headline cap heights in the set: 73px to 105px. Measured body cap heights: 13px to 30px, and every one of them died. There is no observed case of type between 30px and 73px, so 40px is an interpolation, not a measurement. **[UNVERIFIED 2026-08-17, owner Joseph]** Tune it on the first ten renders. **Measured 2026-08-24, and the interpolation does not survive it.** All fifteen §3 signatures now have a template, nineteen examples render, and the check fires on every one of them. Nothing in the system clears 40px cap except nothing: the shell headline is 54px, which is about 38px cap, and every secondary claim atom §3's own thumbnail contracts name sits far below it — trend tick labels 30px, chain node labels 31px, quadrant names 29px, shelf questions 27px, strata counts 24px. **So §1's floor and §3's contracts cannot both hold as written**, and this is not a rendering defect: each contract was written deliberately, per signature, and the floor was interpolated across a gap in the evidence where no observed type existed between 30px and 73px. The recommendation from the measurement is to split the floor — a headline floor near the present number, and a separate secondary-atom floor around 24-28px cap — because one number cannot govern both a single headline and a chart's tick labels. **Still owner Joseph**, since §10 decision 5 assigns it and this records the reading rather than making the call. The check warns and does not block in the meantime, which is the correct behaviour for a threshold the spec itself calls a starting value.

> **Canvas changed 2026-09-06, and the law did not.** The rendered canvas is now **1152x1536 at 3:4**, not 1080x1350 at 4:5: `render/imagegen/` replaced the HTML renderers and the model's route does not offer 4:5. The 220px thumbnail test is a ratio and is unaffected. The 40px figure is stated *at 1080px canvas width*, so on the new canvas the equivalent is about 43px, which is inside the interpolation's own error bars and is not worth restating as a new number. What did change is that nothing measures it any more: §6.3's mechanical check went with the HTML, and the two-layer law is now read by eye against the generated PNG, per `docs/superpowers/specs/2026-09-06-imagegen-infographics-design.md` §5.2. The catalog below is otherwise untouched — **archetype selection did not change when the renderer did.**

---

## 2. Selecting the form

The engine does not choose an infographic type by taste. It reads the shape of the material and the shape selects the form. A topic never selects a form, because the same topic supports several and most of them would lie.

> **Revision note, 2026-08-17.** This section was rewritten after eight adversarial tests ran the first draft against real topics from unrelated niches. The first draft contained two contradictory selection algorithms, an ordering that stole material from the form best suited to it, and an abbreviated test that silently dropped the constraints written to catch exactly the material it admitted. What follows is the corrected procedure. The tests and what they found are in §2.6.

### 2.1 The job is the first key, and the lock is not free

PRD §3 requires every run to log a structural job: `argue`, `enumerate`, `sequence`, `compare`, `transform`, `diagnose`, `quantify`. Every archetype maps to exactly one, so the job narrows the candidate set before any signature is read.

**What the job does not do is prevent visual repetition, and an earlier draft of this file claimed it did.** PRD §3's job rule fires only on a repurpose matching the source on anchor **and** job **and** thesis together. Two infographics on different anchors, both `diagnose`, both rendering as a stratified container, collide with nothing. Worse, three of seven jobs hold exactly one archetype, so a job-level lock would take out an entire form rather than a repetition.

**The fix is one field and one lock, and both are PRD amendments rather than free additions.** `brief.md` gains `archetype:` next to `job:`, which amends PRD §5's front-matter list, and PRD §3's lock table gains a row.

**The lock is depth-scaled to the number of built templates, and that is not a detail.** PRD §3's hook-pattern lock is 8 deep over 35 patterns. A flat trailing-5 lock over §8's four Phase 1 archetypes deadlocks on the fifth run: no legal form exists and the engine refuses for a reason the user cannot act on. That is the same objection this section just used to reject a job-level lock, reintroduced one level down.

> **Archetype lock.** No archetype twice in a row, and no archetype more than twice in any trailing 5 shipped visual pieces. Where fewer than 6 archetypes are built, the second clause is suspended and only the no-repeat-in-a-row clause applies. **Carousels count**, and a deck's `archetype:` names its **spine**, the interior archetype that carries the argument. `cover` and `cta` are furniture, they appear in every deck, and they consume nothing.

**Carousels used to be exempt here, and the premise was void. Corrected 2026-08-23.** That clause read *"Carousels do not count as shipped visual pieces for this lock, because they carry no `archetype:`."* They carry one. PRD §5's `brief.md` front matter lists `archetype:` and sets it on every visual run, and `workflows/carousel.md` writes one for every deck. The spine reading was settled in `SKILL.md` on 2026-08-20, where lock 4 is the router's to apply and the exemption is named and dropped, so this file was the last place still saying the opposite. A lock whose stated reason has been overtaken is not a lock, and two files disagreeing about which pieces a lock counts is worse than either answer would have been on its own. The exemption also broke the clause that survives at every build depth. "No archetype twice in a row" is a comparison against the piece that shipped last, and with carousels dropped from the window the piece that shipped last is not the one the lock reads: two carousels on the same spine in the same week are invisible to it, and the infographic it does read may be three weeks back.

The lock is read at §2.3 step 8, not merely written at step 15. A lock nothing consults is a comment.

| Job | Archetypes | Needs external data |
| :- | :- | :- |
| `quantify` | Trend poster · Ranked bar list · Composition split · Distribution strip | yes, all four |
| `compare` | Comparison table · Quadrant map | no |
| `argue` | Perception split | no |
| `transform` | Analogy rows | no |
| `enumerate` | Tile taxonomy · Sourced shelf | shelf only |
| `sequence` | Stage stack | no |
| `diagnose` | Stratified container · Mirrored rings · Variance bridge · Causal chain | bridge only |

Seven jobs, fifteen signatures, six of which need data.

**Signatures are not templates, and the distinction is what makes this buildable.** Fifteen signatures select independently; they do not each require their own HTML file. The stage stack, the stratified container, and the mirrored rings are one banded-cluster template with a `taper` flag, a `width_tracks_count` flag, and a reflection mode. The sourced shelf is the tile taxonomy plus group bands and a third card field. The trend poster and the distribution strip share one plot canvas. §8 counts templates, not signatures.

### 2.2 The signature index

Selection reads §3 directly. Every clause it needs is either in a signature or in this table, and nothing decides a form from prose elsewhere.

| Signature | Job | Needs a verified fact | Names entities | Anonymizable | Closed-set requirements |
| :- | :- | :- | :- | :- | :- |
| Trend poster | `quantify` | yes | yes, the metric's subject | no | series length |
| Ranked bar list | `quantify` | yes | yes | no | category set, n |
| Comparison table | `compare` | no | sometimes, if the labels are products or firms | no | the two labels |
| Perception split | `argue` | no | no | n/a | none |
| Analogy rows | `transform` | no | no | n/a | none |
| Tile taxonomy | `enumerate` | no | no | n/a | none |
| Sourced shelf | `enumerate` | yes, publishers and titles | yes, the publishers | no | the item set |
| Stage stack | `sequence` | no | sometimes, if tools are named | no | stage count |
| Stratified container | `diagnose` | no | no | n/a | none |
| Mirrored rings | `diagnose` | no | no | n/a | layer count, fixed at 3 |
| Composition split | `quantify` | yes | yes, the part labels | yes, `anonymize` | the partition, n |
| Distribution strip | `quantify` | yes | yes, unless anonymized | yes, `anonymize` | the observation set, n |
| Variance bridge | `diagnose` | yes | no | n/a | the contribution set |
| Quadrant map | `compare` | no | yes, the items | no | none |
| Causal chain | `diagnose` | no | no | n/a | link count |

**Reading the columns.** *Needs a verified fact* triggers §4 and is about verifiability, not about where the fact comes from; first-party data from the user's own systems is verified by the user rather than by a search, and §4.1 branches on that. *Names entities* is what §2.5's clearance filter reads. *Anonymizable* means the form's claim survives replacing named entities with positions, which is a property of the geometry rather than a preference. *Closed-set requirements* are the ones a user cannot satisfy by remembering harder, so a shortfall there is never a question; see §2.3.

**Every signature states Requires and Disqualifies.**

- **Requires.** Conditions the material must satisfy. An unmet requirement is a *deficit*, and a deficit is either a question or a reason to switch forms.
- **Disqualifies.** Conditions under which this form lies about the material. Fatal, checked first, uncleared by any question. A threshold appears in one list or the other and never in both.

The disqualifier is the load-bearing half, and the first draft had nothing there. Six named channels summing to 100 does not fail the ranked bar list on a count; it fails because bars assert independent magnitudes while the material's whole content is that the six are shares of one whole. That is not a shortage the user can fix by supplying more. It is the wrong form.

**Three kinds of clause, and only one of them selects.**

1. **Material clauses** decide the form. Counts, sums, orderings, spreads, whether the items are peers.
2. **Build constraints** describe the rendered artifact: character budgets, line counts, label lengths. No engine can test a character count on material nobody has drafted, so these never participate in selection. §6.3 checks them at render.
3. **Brief-time confirmations** are facts about the author, not about the material: that a contribution surprised them, that the expected leader was not the actual one, that they will defend a placement rule. The engine cannot test these and must not infer them. **They are asked at the brief, after selection, and a `no` sends the run to the runner-up.** An earlier draft wrote them as selection requirements, which made the engine's own guess the gate.

**Reading a signature without per-clause tags.** Only brief-time confirmations are marked, with `[brief]`, because they are the ones an engine would otherwise guess at. Everything else follows one rule: **a clause stating a character count, a line count, or a label length is a build constraint; every other clause is a material clause.** That rule resolves every signature in §3 without tagging three hundred clauses, and it is checkable by reading.

There are exactly three `[brief]` clauses in the catalog: the composition split's contradicted expectation, the variance bridge's unforeseen contribution, and the quadrant map's defensible placement rule. All three are facts about the author that no engine can test.

### 2.3 The procedure

**There is one procedure and this is it.** An earlier draft carried a six-step algorithm in one subsection and a ten-step run in the next, which disagreed about the candidate set, about whether regrouping happens, and about what to do with a winner that has deficits. That is the same divergence the abbreviated shape test produced, arriving through a different door, so the two are merged here permanently.

1. **Write the claim.** One sentence, in the brief, before any form is considered: what this image asserts. It costs one line and it is what steps 5 and 8 measure against.
2. **Read the topic against the profile.** Inventory, thesis, audience, per PRD §5's load list.
3. **Regroup, and enumerate the readings.** Eight flat cost categories are also three phases of two or three, and also two strata. Enumerate every regrouping that changes which signatures survive, rather than picking a best one, because which regrouping is best is knowable only after evaluating and picking it first is the taste judgment this section opens by forbidding. Cap at four readings; if the material supports more, it is not one image.
4. **Run the clearance filter, once per reading.** Per §2.5. It runs after step 3 rather than before, because regrouping changes which entities the material would name: the same twelve hires regrouped by hiring manager name three managers the as-stated reading never mentioned.
5. **Evaluate all fifteen signatures against every surviving reading.** Not in order; order carries no meaning and pretending otherwise is what produced the first draft's ordering bugs.
6. **Discard on disqualifiers.** Record which and why; §2.4 needs it.
7. **Discard any form that cannot carry the claim from step 1.** A form is not a fit because it accepts the material; it is a fit because it says the thing. The tile taxonomy will happily render "what an AI pilot actually involves" as twelve peers with zero deficits, silently discarding the half of the claim about what executives believe. Deficit count measures what the form lacks and never what the material loses, which is why this step is separate.
8. **Check the archetype lock.** Per §2.1. A locked form is set aside, not disqualified, and it returns if every alternative fails.
9. **Rank the survivors:** fewest deficits first, then fewest *closed-set* deficits, then the form needing no verified fact. Ties beyond that are broken by the earliest reading, so the as-stated material wins over a regrouping.
10. **Zero deficits: proceed.** No question. Common for `argue`, `compare`, and `transform`, where the input is a belief and its correction, which the profile already holds.
11. **Deficits, all closable: ask exactly one question, naming the number.** *"Tile taxonomy needs 6 to 12 items and your inventory yields 4. Name two more, or I switch to the comparison table, which needs two labels and five dimensions."* A question naming the number is answerable in one turn; an open question restarts the interview. The alternative offered is the runner-up from step 9, never the cheapest form: an earlier draft always offered the form with fewer parameters, which made descent the default recovery and biased every short run toward the weakest available image.
12. **Any deficit on a closed-set requirement: do not ask. Go to the runner-up.** A closed exhaustive partition, a finite measured population, and a shortfall in bodies rather than in items are all unclosable by recall, and asking produces a fabrication prompt. Six pipeline channels cannot become nine without inventing channels; twelve sales hires cannot become twenty-six.
13. **If the deficit is an external fact, ask permission before researching.** Per §4. Never research silently, and never offer to research something that lives in the user's own systems.
14. **Ask the brief-time confirmations** for the selected form. A `no` returns to step 9's runner-up.
15. **Record `archetype:` in brief.md** next to `job:`, before drafting.
16. **Draft. Print the runners-up as one-liners underneath, and print the forms that were disqualified with their disqualifier quoted.** The reader most needs to know why not the obvious form, and the obvious form is usually the disqualified one rather than the runner-up.

**These print in addition to the four rejected angles, never instead of them.** PRD §14 requires that no draft is shown without showing what it was chosen over, and PRD §13.2 step 5 makes the output line testable. An archetype is a form; an angle is item x thesis x audience belief per PRD §7. Choosing a form does not satisfy a rule about choosing an argument, and an earlier draft quietly swapped one for the other. **The angle is generated by the shared pipeline before this procedure runs**, per PRD §1.1 step 3; this procedure selects the form the chosen angle is rendered in.

**Output line:** `angle · archetype · anchor · job`. This extends PRD §8's `angle · anchor · job` by one field rather than replacing `angle`, which makes it a PRD §8 amendment; see §10.4 of the PRD.

### 2.4 The refusal path

**If every form is disqualified, the engine says so and offers a short post instead.** It does not improvise.

There is exactly one thing an image generator does with material that has no fitting form, and it is a quote card: a sentence in large type on a colored rectangle. That is the visual equivalent of the em dash. It carries no information the post text does not, it is the most common AI-made LinkedIn image in existence, and the engine must be structurally incapable of producing one.

**The refusal names the actual deficit.** The first draft hardcoded one diagnosis, "a single claim with no internal structure," and one recommendation, the perception split. Three of the eight adversarial tests reached the refusal path, and in all three it printed a diagnosis that was factually false about the material in front of it. A forecast post-mortem is not structureless: it holds a predicted value, an actual value, a signed gap, and a causal decomposition. Telling that user their material lacks structure misdirects the fix.

The refusal is generated, not canned, and it takes one of three shapes depending on why nothing survived. An earlier draft had one grammar with a slot for a quoted disqualifier, which cannot describe the two refusal paths where nothing was disqualified.

```
# every candidate hit a disqualifier
No form fits. Nearest was <form>, blocked by <disqualifier, quoted>.
Second nearest was <form>, blocked by <disqualifier, quoted>.
This is a short post. To get the image, <what to go and get>.

# forms survived but every deficit is closed-set
No form fits. <form> needs <exact deficit>, and that is not something
you can supply by remembering harder: <why it is closed>.
This is a short post. To get the image, <what to go and get>.

# the clearance filter removed every candidate
No form fits without naming <entity>, whose clearance is <value>.
Two forms would work anonymized and neither fits this material.
This is a short post, or clear the item and run this again.
```

The last line is the useful half in all three. It tells the person what would unlock an image, which is the only thing they can act on. **The refusal never asserts that the material lacks structure** unless that is literally what was found; a forecast post-mortem holds a predicted value, an actual value, a signed gap, and a causal decomposition, and telling that user their material is structureless misdirects the fix. Five of eight adversarial tests caught the first draft doing exactly that.

**Corollary, and the whole reason the refusal exists.** An infographic is not a format the user picks. It is a format the material earns. PRD §3 already refuses a thin repurpose at the brief, before spending draft tokens, and this is that refusal applied to the visual path for the same reason.

### 2.5 The clearance filter

**This runs before selection, and nothing in the first draft did.**

Seven of the fifteen signatures require named entities: companies, vendors, publishers, people. PRD §7 puts `clearance:` on every inventory item and PRD §9 rejects rather than rewrites a draft naming a company, a person, or a role-plus-employer-plus-timeframe triple whose source item is not `clearance: public`. The language gate enforces this on prose. **Nothing was enforcing it on an image**, and an image is the harder failure: it cannot be edited after posting, and it is the surface most likely to be reshared out of context.

The adversarial test that found this is worth stating concretely, because it is the kind of thing that ships. A topic asking to rank twelve sales hires by ramp time selects a form requiring named entities, and the named entities available are twelve identifiable employees and their individual performance. Nothing in the first draft stopped the engine from proposing names down the left edge of a public post.

**Mechanism, and it is per form rather than per run.** For each reading, resolve the entities *that form* would put on the canvas and read each one's `clearance:`. A form is unavailable when an entity it would name is not `public`. §2.2's index carries the *Names entities* column the filter reads; without it the filter has no operand and the first draft had no such column.

Per form matters because the alternative over-fires. A single incidental non-public name in the material would otherwise remove all seven named-entity forms even when the selected form names none of them, pushing ordinary runs onto the refusal path for a reason the refusal message cannot state honestly.

The engine does not anonymize its way out of a named-entity form: PRD §9 establishes that rewriting a disclosure only produces a better-written disclosure. **Two forms take anonymization as a parameter rather than as a workaround**, the distribution strip and the composition split, both marked in §2.2's index and both carrying an `anonymize` parameter in §3. When the filter removes every named-entity form, those two are evaluated with `anonymize: true` set, and the engine says so in the run output. Twelve employees become twelve unlabeled positions and the claim is unaffected, because in both forms the payload is the shape rather than any individual.

**`anonymize: true` also suppresses per-observation annotation.** Otherwise the distribution strip's two annotated extremes reidentify the two people the filter existed to protect, which narrows the failure from twelve names to two rather than removing it.

### 2.6 What the adversarial tests found

Eight topics from unrelated niches were run against the first draft of this section by independent agents instructed to break it. Recorded here so the fixes above are traceable and so the same defects are recognizable if they return.

| Topic | First draft | Defect class |
| :- | :- | :- |
| Two conflated industry terms | Comparison table | Ordering stole the perception split's material |
| Pipeline by source, six channels summing to 100 | Ranked bar list | Abbreviated test dropped the sum-to-100 prohibition; no composition form existed |
| Exec expectation vs. reality of a pilot | Ambiguous, table or split | Two contradictory selection algorithms |
| Five stages of a transformation | Stage stack | Correct family, and the output is the niche's stock graphic; no cliché check |
| Seven vendors, renewal counts 11 down to 8 | Ranked bar list | Signature had a maximum-spread gate and no minimum-contrast gate, so it admits data that draws nothing |
| One forecast miss | Refuse | Refusal message factually wrong; no variance form existed |
| Twelve unordered ramp times | Ambiguous, then refuse | No distribution form; named-employee privacy ungated |
| Eight hidden cost categories | Refuse | Structural dead zone at 6 to 8 flat items |

Six findings changed the catalog rather than the procedure: the composition, distribution, and variance shapes had no form and now do (§3.12 to §3.14); the tile taxonomy's floor moved from 9 items to 6, which closes the dead zone with a parameter change rather than a new template; the ranked bar list gained a minimum-contrast gate, without which it accepts data that draws nothing; and the stage stack gained a disqualifier for the case where the selected form is the reader's industry stock graphic.

A later verification pass re-ran four of these topics against the revised procedure. Three were fixed at the mechanism. The twelve-ramp-times topic was not fully fixed, and what it exposed is recorded in §2.5 and in §3.13: the clearance filter had no field to read, `anonymize` was referenced by two sections and defined by neither, and the filter ran before the regrouping step that changes which entities the material names.

---

## 3. The archetype catalog

Each entry carries what a builder needs and nothing else. Parameter constraints are hard: they are the character and item counts measured off the reference images, and exceeding them is what breaks the layouts in the ways each entry's failure lines describe.

> **[UNVERIFIED 2026-08-17, owner Joseph] applies to every *ratio* threshold in this section, and to those only.** Character counts and item counts were measured off the images and are not tagged. The ratios were not measured and cannot have been: "final value 2x the median of the first half," "top value 1.4x the lowest," "lowest at least 10% of the highest," "largest part 2x the smallest," "any part under 8%," "minimum delta of 2 per step," "spread at least 3x," "top at least 3x the bottom" on the fixed track, "gap under ~10% of the base," "longest item at least 2x the shortest," and "outer ring 3x the core." Each is one form's single reference image generalized into a rule. They are starting values to tune against the first ten renders of each form, not measurements, and PRD §14's last rule means saying so here rather than leaving them untagged.

Each signature states **Requires** and **Disqualifies** per §2.2. A requirement is a question; a disqualifier is fatal.

Every archetype inherits the two-layer law from §1 and the craft rules from §5. The per-archetype notes below cover only what differs.

---

### 3.1 Trend poster · `quantify`

One numeric series, plotted alone, with the headline asking the question the curve answers.

**Input signature.** 6-12 sequential points, one series, all values >= 0. The final value differs from the median of the first half **by at least 2x in either direction**, and the largest period-over-period jump falls in the last third. Plus a nameable source and a metric statable in under 60 characters. *If the curve has no late inflection, this form has nothing to show and the headline will assert a shift the picture does not contain.*

**The direction clause was a bug, and it shipped in the first draft.** It read "the final value is at least 2x the median of the first half," which admits growth and refuses decline. A 60% fall in support tickets, a collapse in cycle time, a plateau after a spike: all of them pass every other clause and were walked to the refusal path. Decline is half of all `quantify` material and the more interesting half, since a fall is usually somebody's win. **[UNVERIFIED 2026-08-17, owner Joseph]** The 2x threshold rests on one reference image; treat it as a starting value.

**Disqualifies.** More than one series, except under the overlay variant below. Values that are shares of a whole. A set of observations with no time order, however sequential the labels look; "our last 12 hires" is a population, not a series, and plotting it asserts a trend the data cannot carry. A y-axis that cannot start at zero.

**Two-series overlay** (planned versus actual, us versus them) is a parameter on this form rather than a separate archetype: `series_b` plus a second accent, which makes it blocked on §10 decision 2. It inherits every disqualifier above except the single-series rule, and adds one: the two series must share a unit and an x-axis, or they are two charts.

**Parameters.** Archetype value `trend-poster`.

| Name | Type | Constraint |
| :- | :- | :- |
| `headline` | string | 3-8 words, max 2 lines, longest line ~20-24 chars at display weight |
| `sub` | string | 1 line, <=60 chars. Metric, entity, window |
| `units` | string | 1 line, <=24 chars, e.g. `(in millions)` |
| `items` | list<{label \| value}> | 6-12 points, labels <=4 chars, <=24 chars each |
| `y_max` | number | >= 1.15x the top datum, never equal to it |
| `ticks` | integer | 4-5, always including a zero baseline |
| `footer` | string | front matter, required, the source line |

**Structure honesty.** The y-axis starts at zero or the image is not made. A truncated baseline on a growth claim is a lie the geometry tells while every word on the canvas stays true.

**Thumbnail contract.** Headline, curve silhouette, and the y-axis tick labels, which §5.3 requires be set as a primary tier for exactly this reason. Everything else dies, including the metric name.

**Breaks when.** The point is a comparison, a composition, a taxonomy, a process, or a list. Also when the change is real but small: a 12% rise drawn from a zero baseline is a nearly flat line, and the reader's first two seconds return a contradiction.

**Named failures.** Inflection in the middle rather than near the end, so the curve reads as an old step change. `y_axis_max` set to exactly max(series), so the terminal point touches the frame.

---

### 3.2 Ranked bar list · `quantify`

Named categories, counts, sorted longest first, no axis and no gridlines.

**Input signature.** 4-8 labeled categories, each with one integer count from a single stated measurement of stated size n. Sortable descending, no time dimension.

**Top value at least 1.4x the lowest `[material]`, and the lowest at least 10% of the highest so the smallest bar is drawable and labelable `[material]`.**

The first draft had this backwards. It carried only "lowest at least 55% of the highest," a *maximum* spread, which is exactly wrong for a form whose entire payload is the ragged right edge: seven vendors at 11, 11, 10, 10, 9, 9, 8 pass that floor at 72.7% and draw a soft vertical line with no visible ranking in it. Worse, adding the minimum-contrast gate on top of the old floor left an admissible window of 55% to 71.4%, which excludes almost every real ranked bar chart, including a dominant number one. The 55% figure was descriptive of one reference image and was never a constraint. It is deleted.

**Disqualifies.** Values summing to one stated whole, which is §3.12. A time dimension. Top value under 1.4x the lowest, which is the case where the form draws nothing.

**Fixed-track variant, absorbing what was a separate archetype.** Where each value is a share of *that entity's own* denominator, set `track: fixed` and supply `remainder_label`. **The variant overrides the base signature's item cap and spread bounds** and states its own: 8-11 entities, top at least 3x the bottom. Every row draws the same length and only the fill varies. Its values sit in a dedicated numeral column rather than inside the bar, because a 4% fill has no room inside it, and §6.2's ban on values printed outside the bar is scoped to the ragged track for that reason.

An earlier draft made this an eleventh archetype and called it the most dangerous in the catalog, because a rounded segment cap has a minimum drawable width, so a 4.1% value draws at 8% of the track. That is true and it is a rendering rule, not a form: square the caps, and print a numeral column that is authoritative so the bar is never read alone. Once those two things are done, a share of an entity's own denominator is an independent magnitude, which is exactly what a bar legitimately asserts, and the separate form was carrying one layout branch and a hazard.

**Parameters.** Archetype value `ranked-bars`. `headline` (2 lines, ~20-24 chars each) · `sub` (1 line, <=46 chars, states the instrument and n) · `items` (4-11 of `label | value`, <=48 chars each) · `highlight` (1-based item number, optional) · `footer` in front matter, the source line.

**Structure honesty.** Bars assert independent magnitudes. If the values are parts of a whole that must sum to 100, this form is wrong; the reference image itself has five values summing to 262 against a stated n of 178, which is defensible only because the survey allowed multiple answers and the subtitle says so.

**Thumbnail contract.** Headline plus the ragged right edge of the bar stack. The ranking must be legible from bar geometry with the numbers switched off.

**Breaks when.** The tail bars land within a few percent of each other, so everything below position 2 is visual noise. When a label runs past ~40 characters and wraps, that row grows taller than the others and the stack stops reading as one comparison set.

**Notes.** No axis line, no gridlines, no tick labels, no legend. The reference image has none of the four and loses nothing. Values sit inside the right end of each bar, never outside it, because an outside gutter shortens every bar and flattens the gaps that are the whole point.

**Brand-logo variant, and why it is not shipped.** One reference image tips each bar with the source company's real logo, which buys instant recognition and costs a hard external asset dependency. Substitute a monogram chip: a filled rounded square in the row's hue holding the entity's initials. Do not substitute a generic icon for a real company; a wrong glyph beside a real name is worse than no glyph.

---

### 3.3 Share leaderboard · merged into §3.2

Held as a separate archetype in the first draft and folded into the ranked bar list as `track: fixed`. Recorded here rather than deleted so the decision does not return as a suggestion.

The argument for merging: a share of an entity's own denominator is an independent magnitude, which is precisely what a bar legitimately asserts, and those values sum to nothing. The only real difference was a fixed-length track with a visible remainder, and the first draft simultaneously called that track the most dangerous geometry in the catalog, because a rounded cap has a minimum drawable width and inflates small values. Squaring the caps and making the numeral column authoritative removes the hazard, and what is left is a layout branch rather than a form.

---

### 3.4 Comparison table · `compare`

Two confused labels, several dimensions, one row where both answer the same.

**Input signature.** Two competing or conflated labels for adjacent concepts, plus 5-7 dimensions on which both can be answered in under 62 characters, plus at least one dimension where the honest answer is that they overlap. *The test: if you can write the row-label rail before writing any cell content, and every label yields a non-empty answer on both sides, this archetype is correct. One empty cell means pick a different form.*

**Disqualifies.** One side being simply wrong rather than different. That is `argue` material and this form launders it into a balanced comparison, which is the failure §3.5 exists to prevent. Containment relationships, where one side includes the other; a symmetric grid asserting a subset relation is a lie the geometry tells. Any dimension where one column is empty.

**The shared-ground row must be load-bearing, not tautological.** "Both are called a pilot" satisfies the requirement and does none of its work. If the only honest overlap is that the two words exist, this is the wrong form.

**Parameters.** Archetype value `comparison-panel`. `headline` (1 line, `A vs B` form) · `sub` (1 line, optional) · `col1` and `col2` (each a `key: title` line opening its own `- ` bullet list, 5-7 rows, the two lists in the same order) · `verdict_label` and `verdict` (the shared-ground row, full width, optional pair).

**Three columns are a parameter, not a second form**, and they cost something: the `A vs B` headline no longer writes itself, the shared-ground row has to be true of all three, and the straw-man risk this form already carries roughly doubles, because with three columns there is usually one the author does not respect.

**Structure honesty.** A symmetric layout promises a balanced comparison. If one option is simply better, the form straw-mans the loser and the reader sees it. The shared row is not decoration; it is what stops the image from being an argument wearing a table's clothes.

**Thumbnail contract.** Headline, the two colored header cells, the visible row count, and one texturally distinct row. Every word of body prose dies.

**Breaks when.** The two things are not comparable on shared dimensions. When rows drift out of parallel, so the left cell answers the dimension and the right cell answers something else; the symptom is that the reader's eye stops crossing the column rule.

**Notes.** With 5+ rows, use at least three distinct cell renderers (prose, list, pill row, small diagram). Seven prose rows is a wall. Any color assigned in a header must recur per §5.4's threshold, or the code was announced and abandoned.

---

### 3.5 Perception split · `argue`

The audience's mental model on top, the practitioner's underneath, drawn at the same scale.

**Input signature.** Two mental models of the *same* object held by two attributable parties, an audience or the author's own past self, where model A collapses to exactly 1 statement and model B expands to exactly 5, of which 4 are parallel and the fifth breaks their format, and where model B's complexity can be shown by subdividing model A's shape rather than by drawing a different object.

**Disqualifies.** Symmetric counts on the two sides. Two genuinely different things rather than one thing seen twice. A naive view that is not actually held by anyone, which makes the top panel a straw man. **Material containing a quantified gap between an expected and an actual value, which is §3.14.** Without this clause the split becomes a zero-deficit match for every expectation-versus-outcome post-mortem and beats the purpose-built form on the topic that form was built for.

**One clause from the first draft was too narrow and is removed.** It required the two models be "held by two different audiences." A before-and-after held by one team is structurally identical, same object, one-statement view against a four-statement view, and was excluded by a clause constraining who holds the belief rather than what shape it makes. The requirement is now that the two views be *attributable*, to an audience or to a past self.

**Parameters.** Archetype value `perception-split`. `headline` (the claim both panels serve) · `naive_headline` and `real_headline` (1 line each, <=36 chars, with one word in `**bold**` in each) · `naive_statement` (<=60 chars, the single claim in the top panel) · `naive_callout` (<=40 chars, optional) · `items` (exactly 4, <=60 chars each) · `punchline` (<=60 chars, deliberately breaking the format of the other four).

**Structure honesty.** **The asymmetry is the content.** If both halves get the same number of labels, the image reads as a neutral two-column comparison and there is no thesis left. This is the archetype's single load-bearing rule.

**Thumbnail contract.** The two headlines and the 1-versus-5 count of leader lines. All list wording dies.

**Breaks when.** The topic is genuinely simple, so the complex object is a lie. When the complexity is not enumerable in 4-5 lines. When the two sides are not the same thing seen twice but two different things.

**Notes.** Leader lines start *inside* the shape and cross its edge; a line that stops politely at the outline reads as a floating arrow rather than as pointing at a part. The divider bleeds to both canvas edges; an inset rule reads as a section break and lets panel 1's frame carry into panel 2. The fifth item deliberately breaks the grammar of the first four, for the same reason PRD §9 bans a perfectly parallel bullet structure in prose.

**Why this one ships first.** It needs no data, no illustration, and no external asset. Its inputs are a belief the audience holds and the practitioner's correction, which is precisely what `thesis.md`'s `against:` field and `audience.md`'s "believes and is wrong about" already store. Of the fifteen, this is the one the existing profile schema feeds without any new capture.

---

### 3.6 Analogy rows · `transform`

Jargon on the left as an everyday object, the real thing on the right, identical slot order in every row.

**Input signature.** 3-5 terms readers confuse, each reducible to a <=3-word physical analogy, where all analogies share one base noun (X, X+Y, X+Z, X+W). Plus exactly 2 one-line facts per term, <=28 characters each, one verb-led and one noun-led. *If the analogies do not share a base, this is four unrelated flashcards.*

**Disqualifies.** Analogies that do not share a base noun. Any quantitative content, since there is no slot for a number. Terms that are sequential rather than parallel.

**Parameters.** Archetype value `analogy-rows`. `headline` (1 line, with the first 1-2 words in `**bold**`) · `sub` (1 line, <=52 chars, names the audience and the use) · `items` (3-5 of `term | equation | fact; fact`, <=90 chars each, term <=14 and equation <=16).

**Structure honesty.** An `=` sign asserts equivalence. These equations are editorial, not measured, and the layout offers nowhere to hedge. Surface all equations together for review before publish.

**Thumbnail contract.** Headline, term, equation pill, and the left silhouette. All bullets die.

**Breaks when.** The terms are genuinely orthogonal with no shared base. Anything quantitative, since there is no slot for a number.

**The illustration problem, stated plainly.** Both reference images for this form carry hand-drawn pencil illustrations with cross-hatched shading, occupying up to 28% of the canvas. HTML, CSS, and inline SVG cannot produce them, and no substitution is honest: a geometric icon beside a real drawing reads as clip art, and PRD §10 already bans generic icon sets used decoratively. **The engine ships this archetype as a two-column form with no illustration column and a monoline SVG glyph only where the glyph carries a distinguishing silhouette.** The lost warmth is a real cost, stated here so it is a decision rather than a discovery in week twelve.

---

### 3.7 Tile taxonomy · `enumerate`

A flat set of peers, one tile each, in a grid.

**Input signature.** 6-12 mutually independent, non-sequential, same-altitude items in one named category. Each nameable in <=13 characters and explainable in <=121. At least two items the audience would recognize unprompted and at least one they would not, so the set carries a recognition contrast. Reading order is a rendering choice and asserts nothing, per the peer-status rule below.

**The floor is 6, not 9.** The adversarial tests found a structural dead zone: `enumerate` wanted 9 or more, `argue` capped at 5, `transform` at 5, and `sequence` at 5 top-level stages, so a flat list of six to eight unquantified peers, which is what a person can name off the top of their head, had no home anywhere in the catalog and hit the refusal path. The grid adapts: 2x3, 3x3, 3x4. This closed the gap with a number rather than a template.

**Disqualifies.** Sequential or dependent items; a 3-across reading order puts step 4 under step 1. Hierarchies. Items that are shares of a whole. Items that are externally published works with a publisher and a title, which is §3.8; without this clause nine sourced items satisfy both forms, tie on deficits, and the tie-break picks the form with no fabrication gate. Fewer than 6 bodies the author can actually write, as distinct from 6 labels they can name, which is the deficit the count question does not detect.

**Parameters.** This signature has **two** archetype values, and the item count picks between them: `card-grid` for 4-10 items, drawn as equal rectangular cards two or three across; `icon-list` for 8-12, drawn as a denser two-column list with a monoline glyph per row. Both take `headline` · `sub` (1 line, optional) · `items` (of `label | body`, label <=13 chars, body <=121).

**The count badge is gone. Recorded 2026-09-06.** `badge`, a second headline line carrying the item count, was a parameter of the retired HTML renderer and has no field in `render/imagegen/`. A spec that sets it prints it as an ordinary line of canvas text, which is not what it did before. Put the count in the `headline` or in `sub` instead. This is the only parameter in §3 that the renderer swap dropped outright rather than renamed.

**Structure honesty.** A 3-across grid asserts that all twelve items are peers. Sequential processes break here, because a 3-across reading order puts step 4 directly under step 1. Hierarchies break, because twelve equal boxes deny the hierarchy.

**Thumbnail contract.** Headline, badge, and the tile labels. Roughly 80% of the words die; in the reference image, 200 of 251.

**Breaks when.** All twelve bodies are written to the same character budget, producing a wall of uniform grey blocks. The reference image varies deliberately: one body is four lines, another six, two are bare fragments.

**Notes.** The load-bearing number must live in a label, the headline, or the badge. In the reference image the single most valuable fact on the canvas sits at 20px in a body paragraph, which the thumbnail test proves is invisible.

---

### 3.8 Sourced shelf · `enumerate`

Nine externally published items, grouped three-and-three-and-three under questions the reader is already asking.

**Input signature.** 9 externally-sourced items, each with a publisher, a real title, and a one-sentence takeaway, all drawn from a nameable recency window, partitionable 3/3/3 under three reader-voice questions. *If the items are ordered or interdependent, choose a different form.*

**Disqualifies.** A continuous argument. Ordered or interdependent items. Any item whose publisher or title cannot be verified; this form has the highest fabrication surface in the catalog and §4 governs it in full.

**Parameters.** Archetype value `sourced-shelf`. `headline` (2 lines, one phrase in `**bold**`) · `sub` (1 line, <=64 chars, states the count and the window) · `sections` (3 band questions, <=36 chars each, written as one `;`-separated line) · `items` (exactly 9 of `publisher | title | finding`, <=150 chars each, three per band in order) · `footer` in front matter, the source line.

**Structure honesty.** The 3x3 grid asserts that all nine items are peers within their band and that the bands are parallel. A continuous argument, a process, or a single dataset all break here.

**Thumbnail contract.** The two-line headline with a colored block behind one line, plus three tinted bands. All nine card bodies die, roughly 53% of the words.

**Notes.** Provenance sits where an icon would go: the publisher's name is the card's visual anchor, set at card-title size or larger. Grouping is done by stepping one hue through three luminances (bar, panel, card) rather than by drawing boxes. Section headers are questions in the reader's voice, never noun labels; noun labels turn the page into a filing cabinet.

**This is the one non-numeric archetype that still needs the §4 data path**, because nine real publications must exist and be attributable. A fabricated report title is the most checkable lie in this catalog.

---

### 3.9 Stage stack · `sequence`

Ordered stages of one process, each opened up to show what is inside it.

**Input signature.** 3-5 named, ordered stages, each decomposable into 4-6 short noun-phrase components of <=17 characters, plus optionally one named tool per stage and up to 3 pieces of instructional advice attached to specific stages.

**Disqualifies.** Parallel rather than ordered items, which makes the taper lie. Wildly unequal stage sizes. Quantitative content. **A form that is the reader's industry stock graphic, rendered with no deviation.** Five numbered bands with chips inside them is the most-produced image in operations consulting, and the adversarial test that raised this is right that nothing else in this file catches it. The check is one question at the brief: does this exact form appear in the reader's feed weekly? If yes, the headline carries a claim rather than a label, or the form is not used.

**Parameters.** Archetype value `numbered-steps`. `headline` (1-2 lines, numeral-first; the first draft said one line, which collides with §5.1's two-line allowance on any honest five-stage headline at the 40px cap height §1 requires) · `sub` (1 line, optional) · `items` (3-6 of `name | detail | chip; chip; chip`, where stages x chips <= 20 and every stage carries the same chip count).

**`tint_ramp` is not a field. Recorded 2026-09-06.** The one-hue-per-luminance-step rule below is still the rule, and it now reaches the image through the theme palette and the archetype recipe rather than through a per-spec parameter. Setting `tint_ramp:` in a spec does nothing; it is accepted and ignored so a spec written from the old vocabulary still renders.

**Total chip ceiling: 20, and the count is fixed across stages.** Five stages at six components each is 30 chips, well past the point §5.5 warns about, and the form's own Breaks-when line forbids differing counts per band. Both are satisfied by fixing the count per render: 5 stages take 4 chips, 4 take 5, 3 take up to 6.

**Funnel variant.** Set `values` to one number per band and the form becomes a funnel with rates, which is the pipeline, adoption, and hiring content every operator produces and which the first draft could draw the geometry of but not the numbers in. One honesty rule comes with it, inherited from §3.10: **the band width must track the value**, or the taper is decoration sitting next to numbers that contradict it. With `values` set, the form needs `source_name` and inherits §4 unchanged.

**Structure honesty.** A taper claims filtering or convergence. Applied to a checklist or a timeline, the narrowing asserts something the content does not contain. If the stages are parallel rather than sequential, the taper lies; use flat bands instead.

**Thumbnail contract.** Headline plus one filled pill per band at 40px or larger, and each pill must be a complete idea on its own: `1/Target Audience`, never a bare `1`.

**Breaks when.** Stage sizes are wildly unequal, nine components in one and two in another. Chip counts differ per band, so panels carry unequal internal weight.

**Notes.** Twenty chip slots will happily accept twenty words the author does not stand behind. If a stage cannot supply four real components, cut the stage rather than pad the row. Any recurring "the framework here is X" strip creates one opportunity per row to coin an official-sounding name for nothing; every such name must be citable or explicitly labeled as the author's own.

---

### 3.10 Stratified container · `diagnose`

Many named items sorted into ordered strata, inside a shape whose width tracks the counts. Iceberg, pyramid, nested domes: one form, one parameter.

**Input signature.** 18-26 short named items in one domain, sortable into 3-4 ordered strata by permanence, visibility, depth, or maturity, with counts that change monotonically across the strata by a minimum delta of 2 per step. Five strata are legal only at 25 items or more, because the sparsest legal five-step ladder is 1, 3, 5, 7, 9. Plus 3-5 one-line opinions the author holds about those strata. *If the items carry numbers, or the ordering is temporal, choose a different form.*

**Disqualifies.** Items carrying numbers. Temporal ordering. Strata whose item counts do not change monotonically. **Strata boundaries chosen by the engine to satisfy the monotonicity requirement.** The cut points must come from the material's own logic; a gate the matcher can satisfy by sliding its own parameters is not a gate.

**Parameters.** Archetype value `stratified-container`. `headline` (the split title, with the emphasised word in `**bold**` rather than in three separate fields) · `container` (enum: iceberg, pyramid, nested-arcs, bands) · `items` (3-5 strata of `label | chip; chip; chip`, <=220 chars each) · `notes` (3-5 author notes, one `;`-separated line, set in a typographically distinct voice).

**`tint_ramp` and `divider_style` are not fields.** Both are accepted and ignored. The luminance-ramp rule and the differing-boundary rule below still hold and now reach the image through the archetype recipe.

**Structure honesty.** Nesting asserts containment. Depth asserts permanence. If the strata are peers rather than ordered, the container lies. **Item counts must track the container's width**: a shape that widens toward the bottom with equal counts per stratum is wallpaper behind three plain lists.

**Thumbnail contract.** Headline, a hard tonal split at a fixed vertical position, and the item count per stratum. All chip labels die.

**Breaks when.** The items need defining; a chip has no room to explain itself, so an unfamiliar term is dead pixels. When tier assignment is arguable enough that the reader litigates placement instead of absorbing the sort; one obviously misplaced item discredits all twenty-four.

**Notes.** At least one boundary must differ in weight, style, or fill from the others, or a ranked diagram claims tiers and draws none. Within a wrapping chip cluster the longest item should be at least 2x the shortest; all-equal-width chips reflow into a rigid grid and the pile stops reading as assembled by a person. Author commentary must be typographically separated from the taxonomy, or the opinion reads as part of the data.

---

### 3.11 Mirrored rings · `diagnose`

Three nested causal layers, split at the equator: the good version above, its failure twin below.

**Input signature.** Exactly 3 nested, causally-ordered layers (layer 1 enables layer 2 enables layer 3), each with 4-7 good-state and 4-7 bad-state attributes **whose counts increase strictly outward**, because ring area grows as the square of the radius, where good and bad pair as antonyms in matching positions, and every attribute fits in 21 characters. No numbers, no time dimension, no third category.

**Disqualifies.** Layers that are peers rather than nested. Any number, unit, axis, or date. Item counts that do not increase strictly outward, which starves the rim and jams the core. Good and bad items in matching slots that are not semantic antonyms. More or fewer than 3 layers.

**Parameters.** Archetype value `mirrored-rings`. `headline` (the whole split title in one field, the positive word in `**bold**`) · `good_label` and `bad_label` (the two equator labels) · `items` (exactly 3 rings, each `ordinal | good chip; good chip | bad chip; bad chip`, <=240 chars each, chip counts increasing strictly outward). `positive_ramp` and `negative_ramp` are accepted and ignored.

**Structure honesty.** Ring area grows as the square of the radius, so the outer ring has roughly 3x the area of the core. Item counts must therefore increase outward, or the rim looks starved while the core is jammed shut.

**Thumbnail contract.** Headline and the two-color split. All chips die, though their density gradient survives as texture.

**Breaks when.** The layers are peers rather than nested. Anything quantitative, since there is nowhere to put a number, a unit, an axis, or a date. When good and bad items in matching slots are not semantic antonyms.

**Notes.** Ordinal numbers on the layers are mandatory: nesting has no inherent direction, and without 1/2/3 the causal claim is unreadable. Label chips over a tinted field must be translucent white at 40-55% alpha, not opaque, or the field's grouping signal dies. The innermost arc is the shortest and needs the shortest label; inverting that pairing is the most common break.

---

### 3.12 Composition split · `quantify`

Named parts of one stated whole, drawn as a single full-width stacked bar.

**Why it exists.** Part-to-whole is among the most common numeric shapes in professional content: pipeline mix, revenue by segment, spend allocation, headcount split, attribution. The first draft of this catalog had no form for it, and the adversarial test on "where our pipeline actually came from" showed what happens: the ranked bar list accepts it, and bars assert independent magnitudes, so the reader gets `Referrals: 34` as a free-standing quantity and never learns that referrals is a third of everything, which is the entire claim.

**Input signature.** **2-5** named parts of one explicitly stated whole. Values summing to 100 (±1 for rounding) from a single stated denominator and period. Largest part >= 2x the smallest, so the shape has a dominant segment. Any residual named explicitly and no larger than 15% of the total. **Plus a named expectation that the actual leader contradicts.**

**Why the ceiling is 5 and not 7.** §1's law decides it. At 220px a segmented bar delivers the position of the first boundary and nothing else; past about five segments the tail slices are narrower than the eye resolves at feed size, and the image starts asserting a precision it cannot draw. Six or more parts is a ranked bar list, or it is a top-4-plus-remainder.

**On that last requirement.** It is what makes this a claim rather than a chart, and it is §4.3 applied at the signature: the anchor is the belief the chart argues against. A composition where the expected leader is the actual leader is a status report, and a status report does not earn an image. If the material has no contradicted expectation, this form is unavailable and the honest output is a sentence.

**Disqualifies.** Values that do not sum to a stated whole. Parts drawn from differing denominators. More than 5 parts. An `Other` bucket larger than the second-largest named part, which means the real composition is unmeasured. **A stated n exceeding the sum of the plotted values with no remainder segment**, which is the reference set's own observed failure: seven bars summing to 35 against a stated population of 74, with no `other` and no note. Either draw the remainder or say "top 4 of n".

**Parameters.** Archetype value `composition-split`. `headline` (states the contradiction, 3-8 words) · `sub` (1 line, <=72 chars, states denominator, total, and period) · `expectation` (1 line, <=72 chars, the belief being corrected) · `items` (2-5 of `label | pct`, <=30 chars each) · `leader` (1-based item number of the leading segment) · `footer` in front matter, the source line.

**Render.** One full-width horizontal stacked bar, the leading segment in the accent, the remainder in luminance steps of a single hue per §5.4. Labels below in a two-column list, never inside segments smaller than ~12%. **No pie and no donut.** A pie forces angular comparison, which people read badly, and a seven-segment donut with a legend is a design tell in its own right.

**Structure honesty.** **A segmented bar asserts exhaustiveness.** If the parts are a selection rather than a partition, or if they overlap, the geometry lies while every label stays true. This is §5.5's failure mode in its purest form, and it is the reason the remainder rule above is a disqualifier rather than a style note.

**Thumbnail contract.** Headline plus the position of the first segment boundary. The proportions survive; no label does.

---

### 3.13 Distribution strip · `quantify`

Many observations of one measure, plotted against the value everyone assumes.

**Why it exists.** "N observations of one thing, show me the spread" is the recurring data shape of an entire class of professional work: ramp time, deal cycle length, days to close, time to first response, lead time, cycle time. The catalog had no form that accepted a set of unordered measurements, so the refusal path fired on routine material. It is also the form that answers the most common shape of professional disagreement, which is not "the average is wrong" but "the average is hiding the spread."

**Input signature.** 8-30 observations of one continuous measure, one unit, no time ordering required or implied. Minimum-to-maximum spread at least 3x. **A nameable reference line**, the stated target, the plan number, or the value the audience assumes, with at least a third of the observations falling on the wrong side of it. Plus n and the measurement window stated.

**Disqualifies.** Fewer than 8 observations, where individual dots read as a list rather than a distribution. No reference line, which leaves a cloud of dots asserting nothing. Observations drawn from different measures or units. A spread under 3x, where the strip is a thick dot.

**Parameters.** Archetype value `distribution-strip`. `headline` (names the assumption the spread breaks) · `sub` (1 line, <=60 chars, states the measure, n, and window) · `observations` (8-30 numbers, one `;`-separated line) · `reference_value` and `reference_label` (<=40 chars) · `unit` (suffix printed after each number) · `anonymize` (`true` suppresses the two end numbers) · `footer` in front matter, the source line.

**Render.** One horizontal axis, one dot per observation with slight vertical jitter, a labeled vertical rule at the reference value, and the two extreme observations annotated. Nothing else.

**This is one of two forms that survives the clearance filter with private material,** because `anonymize` is a first-class parameter rather than a workaround. Twelve employees become twelve unlabeled dots and the claim is unaffected, since the payload is the spread rather than any individual. §2.5 governs when it fires.

**Structure honesty.** A dot strip asserts that the observations are comparable instances of one measure. Mixing measures, or mixing populations, produces a picture that looks like variance and is actually two distributions.

**Thumbnail contract.** Headline, the dot cloud's shape, and the reference rule. Every number dies.

---

### 3.14 Variance bridge · `diagnose`

A predicted value, an actual value, and the named contributions that reconcile them.

**Why it exists.** Explaining a gap between what was expected and what happened is the single most common analytical story in operations, finance, and planning, and the first draft refused it. The adversarial test on "why our forecast was wrong last quarter" is the clean case: the material contains a predicted value, an actual value, a signed gap, and a causal decomposition, which is more usable structure than several forms in the catalog demand, and the engine told the user their material had no internal structure.

**Input signature.** One predicted or planned value, one actual value, and 3-6 named signed contributions that reconcile the gap and sum to the delta within a stated rounding tolerance. Each contribution nameable in <=20 characters. **At least one contribution the author did not see coming `[brief]`**, which becomes the payoff bar and the reason the image exists. Asked at the brief per §2.2, never inferred. Plus one sentence stating the period and the unit.

**Disqualifies.** Contributions that leave a residue larger than the stated rounding tolerance **and** no `residual_label` to draw it with. An unexplained residue drawn as if it were explained is what makes a waterfall dishonest; an explicitly drawn one is the honest case and the parameters support it. More than 6 contributions, where the bars fall below thumbnail legibility. A gap under ~10% of the base, where every intermediate bar is a sliver. No contribution the author found surprising, which means this is a report rather than a post.

**Parameters.** Archetype value `variance-bridge`. `headline` (names the gap or the surprise) · `sub` (1 line, <=72 chars, period, unit, and what the two endpoints are) · `start` and `end` (each `label | value`) · `items` (3-6 contributions of `label | signed value`, <=26 chars each) · `payoff` (1-based item number of the payoff bar) · `footer` in front matter, the source line.

**`residual_label` is not a field.** The rule it served — that contributions failing to sum exactly must name the residue rather than hide it — is unenforced by the renderer now and belongs to whoever writes the spec. Carry the residue as its own `items` entry.

**Render.** Floating bars stepping from the start value to the end value, positive contributions in one hue and negative in another, the payoff bar in the accent. Connector rules between bar tops. The start and end bars are grounded at zero; everything between floats.

**Structure honesty.** A waterfall asserts that the listed contributions fully explain the gap. If they do not, the residual must be drawn as its own bar and labeled, never absorbed into the last contribution or silently dropped. **This is the one place in the catalog where a rounding decision is a truth claim.**

**Thumbnail contract.** Headline plus the staircase from start to end. The direction and the rough magnitude of each step survive; no label does.

**Note on the job.** This sits under `diagnose` rather than `quantify` even though every input is a number, because the question it answers is why rather than how much. The job field names the reader's question, not the data type.

---

### 3.15 Quadrant map · `compare`

Many items crossed on two independent dimensions.

**Why it exists.** The comparison table is n dimensions against 2 things. This is the transpose: many things against 2 dimensions, and nothing else in the catalog crosses two axes. The tile taxonomy uses a grid as a layout whose rows and columns carry no meaning, which follows from §3.7's peer-status rule.

**Input signature.** 6-12 named items, each placeable on two independent dimensions whose poles are statable in <=4 words each. **All four quadrants hold at least one real named item.** At least one item sits where the audience would not put it. And the placement rule is statable in one sentence the author will defend `[brief]`.

**Disqualifies.** **An empty quadrant.** If one is empty the two axes are not independent, and the honest form is a ranked list on whichever axis is doing the work. **A placement rule the author cannot state.** Unstated criteria reproduce §3.10's failure exactly, where the reader litigates placement instead of absorbing the sort. **A top-right quadrant containing only the author's own position**, which is the form's signature dishonesty and the reason it has a bad reputation: axis selection is unfalsifiable, so a 2x2 can be reverse-engineered from its conclusion and no design gate can see it.

**Parameters.** Archetype value `quadrant-map`. `headline` · `sub` (1 line, <=120 chars, and it carries the placement rule, which has no field of its own) · `x_axis` and `y_axis` (each `low label | high label`) · `quadrants` (4 names, <=3 words each, one `;`-separated line) · `items` (6-12 of `label | x | y`, <=30 chars each) · `highlight` (1-based item number, optional).

**Thumbnail contract.** The cross, the four quadrant labels, and the cluster silhouette. **Every item label dies**, which means the quadrant names carry the entire payload. Most real quadrant maps fail this, because most put the interest in item placement. If the four names are not themselves the claim, this is the wrong form.

**Structure honesty.** Two axes assert independence. Correlated axes produce a diagonal smear that looks like a finding and is an artifact of picking the same variable twice.

---

### 3.16 Causal chain · `diagnose`

Root cause to mechanism to symptom to the cost somebody feels.

**Why it exists.** The ordinary causal story is among the most common things a practitioner has to explain and the catalog had no form for it. The stage stack is sequence, not causation, and the two make different claims: an arrow chain asserts necessity while a taper asserts filtering. This form was added ahead of the mirrored rings, which requires a rare material shape, on the grounds that a causal chain is what people actually have.

**Input signature.** 4-5 nodes forming 3-4 links, each link statable as "X causes Y" in the author's own voice, each node nameable in <=17 characters, terminating in a cost the audience feels rather than an abstraction. Plus one sentence naming what breaks the chain, which is the post's argument.

**Disqualifies.** Correlation presented as causation with no stated mechanism. More than 4 links, where the chain becomes a process diagram and the necessity claim dilutes into a sequence. **Convergence: several independent causes feeding one outcome.** A chain asserts a single thread, and a forecast miss with four contributing drivers is a variance bridge (§3.14), not a chain. Without this clause the chain survives on variance material and the counted question invites the user to invent a single-thread story. A terminal node that is a category rather than a felt cost; "poor data quality" is not a cost, "the planner rebuilds the forecast by hand every Monday" is. Branching, which is a decision tree and is refused per §9.

**Parameters.** Archetype value `causal-chain`. `headline` · `sub` (1 line, optional) · `items` (3-4 of `label | gloss`, <=80 chars each, label <=17) · `terminal_cost` (`label | gloss`, <=80 chars, the distinct terminal node) · `break_after` (1-based item number the chain breaks after) · `break_label` (what the break asserts).

**The item count is 3-4, not 4-5.** `terminal_cost` is its own field rather than the last item, so a four-node chain is three `items` plus the terminal, and a five-node chain is four plus the terminal. `--check` counts `items` alone and will refuse a spec that puts all five in the list.

**Thumbnail contract.** Headline, the chain silhouette, and the node labels, all of which survive at 220px because there are at most five of them. This form has one of the strongest thumbnail contracts in the catalog, which is most of the argument for building it early.

**Structure honesty.** An arrow asserts necessity. If the author would not defend "remove X and Y does not happen," the arrow is a sequence arrow wearing a causal one's clothes.

---

### 3.17 Three archetypes the renderer has and this catalog does not

Recorded 2026-09-06, during the audit that corrected every parameter name above. `render/imagegen/` ships **nineteen** infographic archetypes; §3.1 through §3.16 describe **sixteen**. The three with no signature here are:

| Archetype | Required fields | What it draws |
| :- | :- | :- |
| `funnel` | `headline`, `items` (4-6) | Bands narrowing top to bottom. The narrowing claims filtering, so each band must be visibly narrower and the widths must track the values where values are given. |
| `annotated-diagram` | `headline`, `center`, `items` (4-6) | One central labelled object with leader lines to short titled callouts. Leader lines start inside the shape and cross its edge. |
| `hybrid-playbook` | `headline`, `stats`, `items` | Two to four hero numbers across the top over a grid of titled sections. The numbers carry the visual weight. |

**These have no input signature, no disqualifiers, and no thumbnail contract**, which means §2.3's sixteen-step selection procedure cannot select them and §2.5's clearance filter cannot screen them. They are reachable only by naming the archetype directly. Treat them as unselectable until someone writes them a §3 entry; the gap is recorded here rather than papered over, because a catalog that silently omits three of its own forms is how §2.3 starts returning a refusal on material that has a home.

---

## 4. The data path

Six of the fifteen signatures need something that must be true in the world. PRD §14 says the engine never invents a fact or a number, and §7a says nothing is written without confirmation in the turn it is written. This section is those two rules applied to pixels.

**Why the visual path needs its own mechanism rather than inheriting the language one.** A wrong number in post text can be edited after publishing. A wrong number inside a rendered PNG cannot: LinkedIn does not allow swapping an image on a live post. The image is also the most reshared surface the engine produces, so an error propagates into other people's feeds with the author's name on it. This is the least correctable artifact in the system and it gets the strictest gate.

**Joseph's decision, 2026-08-17.** The user may supply the data. Claude may also research it, but only if Claude asks first and the user approves.

### 4.1 The mechanism

1. **Archetype selection returns a data requirement, or none.** The nine concept signatures skip this section entirely.
2. **If data is required and the inventory does not hold it, the run stops and asks one question that names exactly what is missing and how much of it.** Not "should I look this up?" but: `I need monthly active users for X, Aug 2025 through Apr 2026, 9 points. Look it up? [y/n]`. The question is answerable in one character because the engine did the specifying.
3. **`n`, with no pasted data, makes the archetype unavailable.** The engine names the nearest two forms that need no data and proceeds with one of them. It does not render an unsourced chart, and it does not silently fall back to a form the user did not choose.
4. **`y` runs a search capped at three queries**, the same cap PRD §7b already sets for the signal scan, and returns a table to the human: every value, its source URL, and its retrieval date.
5. **The human confirms the table.** Confirmation is the write gate. This mirrors §7a exactly: nothing is written as `proposed` without confirmation in the same turn.
6. **On confirmation, the table is appended to `inventory.md` as one `type: number` entry, through the existing `/content-engine inventory` path**, carrying `source: proposed`, `clearance:` set by the same question PRD §7 already asks, and the source URL and retrieval date in its `content`. It is written before anything renders.

   **This is the step that keeps the whole data path legal, and an earlier draft got it wrong.** That draft wrote the table to `runs/<slug>/data.md` and left it there. The consequence was not a filing problem. PRD §7 defines `anchor:` as an inventory item id: locks are read by globbing `runs/*/brief.md` for those ids, and `/content-engine retract` reaches items by id. A number living only in the run ledger has no id, so it cannot be locked, cannot be retracted, and cannot be found again. Every `quantify` infographic would have consumed zero anchor locks, silently exempting the one archetype family with the highest consequence of error from PRD §3's repetition guard. Routing the confirmed table through the named writer costs one command that already exists and fixes all three.
7. **The rendered image carries the attribution line.** No line, no render. This is mechanical, not a taste rule: the template has a required `source_name` parameter and an unfilled required parameter fails the build.

### 4.2 Provenance on the canvas

Measured across the four data-carrying reference images, provenance appears in two places and both are load-bearing.

- **The subtitle** carries the method and the sample: `Based on a Survey With 178 Recruiting Agencies`, or, shortened to a data archetype's subtitle budget, `74 employees, grouped by previous employer` (the 86-character original ran on a landscape canvas). This dies at feed size, which is correct: it is what makes the claim honest to anyone who stops.
- **The footer** carries the source name: `Data from: <name>`, centered, in body size, in the bottom 5%.

Both are required for a data archetype. The subtitle answers "how was this measured," the footer answers "who says so," and neither substitutes for the other.

**Anti-pattern, observed and named.** Two of the reference images print statistics with no provenance slot anywhere in the layout. One asserts a percentage in body copy on a canvas with no source line, no date, and no method note. **Rule: any digit in body copy requires a `source_note` region. If the layout has no room for one, the digit does not ship.**

**Second anti-pattern, subtler.** One reference image draws a bar chart with no axis, no ticks, and no numbers, but with a full traffic-light color ramp and a trend arrow. That asserts a quantitative claim it cannot support. **Rule: any bar or line mark either carries labeled values plus a source line, or carries no color ramp and no directional arrow. The middle state is a smuggled fabrication**, and it is the exact failure §14 exists to prevent, arriving through a channel §14 does not currently name.

### 4.3 What the anchor is on a data image

PRD §14 makes `inventory.md` the sole source of every published fact. §4.1 step 6 is what satisfies it: **the confirmed number becomes an inventory item, and that item is the anchor.** It has an id, it can be retracted, and it consumes its lock like any other anchor.

**What that buys, and what it does not.** It buys provenance, an id, retractability, and §14 compliance in full. It buys less repetition protection than it appears to: a number minted during the run is by construction an unused item, so consuming its lock blocks nothing, and the same metric researched twice in a month yields two ids and two legal anchors. **The archetype lock in §2.1 is what actually guards visual repetition on the `quantify` family**, which is a second reason it must be read at §2.3 step 8 rather than merely recorded at step 15.

An earlier draft of this file tried to resolve the same tension differently, by declaring that the anchor on a data image is the *belief the chart argues against*, sourced from `thesis.md`'s `against:` or from `audience.md`. That is wrong and it is worth recording why, because it is an attractive mistake. A `thesis.md` clause has no id, is not in `inventory.md`, and cannot be locked or retracted. The proposal read as a clean reframe and was in fact an exemption from the repetition guard, granted to the exact family that needed it most.

**What survives from that reframe, and it matters.** The chart should still be evidence for an argument rather than the subject of a post. Keep that as a drafting requirement rather than as a schema claim: the brief names the audience belief the chart is deployed against, as a `support` if the profile holds it as an item, and the composition split in §3.12 makes it a brief-time confirmation. A chart with no belief behind it is a data dump, and the reference set contains none.

---

## 5. Craft rules

Measured across the fourteen. Where a rule rests on a count rather than on all fourteen, the count is stated.

### 5.1 Headline

**Length.** Measured word counts across the fourteen: 3, 3, 3, 4, 4, 4, 5, 5, 5, 5, 6, 6, 7, 8. Median 5. **Three to eight words, and never a third line.** Eleven of fourteen run one line; the three that run two break at a grammatical seam.

**Form.** Three forms and nothing else appears in the set:
- **Question** (4 of 14): `Everyone is using Claude now?` · `Where Does [X] Hire Its Talent From?` Works when the reader has already heard the claim as gossip, because the image gets to be the confirmation rather than the assertion.
- **Bare label** (7 of 14): `AI ACRONYMS ANALOGY` · `The Iceberg of Marketing Priorities` · `4-Step Marketing Strategy` · `Marketing Strategy vs Tactic`. No verb, no claim. The label is a promise of structure, and the structure is the payload.
- **Declarative claim** (3 of 14): `WHERE YOUR AI MONEY ACTUALLY GOES` · `HALF OF 2026 IS GONE WHERE'S THE ROI?`. One word usually carries the contradiction: `ACTUALLY`. The set's third declarative, `HALF OF 2026 IS GONE WHERE'S THE ROI?`, is a hybrid: a declarative first line setting up an interrogative second.

**Emphasis.** Six of fourteen mark one span typographically: a colored block behind one line, a knocked-out word, an underline. **Never both lines, and when the headline runs two lines the highlight goes on the shorter one.** Highlighting everything is the same failure as bolding a whole paragraph.

**Margins.** Two opposed treatments, both correct, and the tell is neither of them:
- Full-bleed, measured L0.0 R0.0, where the caps touch both canvas edges and vertical padding on the highlight block is the only breathing room. All five Tooze images.
- Generous side margins, measured 7.3% to 11.8%. All four Crustdata images.

The tell is not a number, and stating it as one would flag two of the four Crustdata images, whose margins measure 7.3% and 7.4%. The tell is the *unchosen* inset: a default safe margin applied because it is the default. Full bleed and a generous margin are both decisions; the band between them is where an untouched template lands.

### 5.2 Subtitle

Present in 8 of 14. It does exactly one job and it is always the same job: **the scoping the headline cannot carry.** Metric, entity, date window, units, sample size, method, audience.

In every one of the eight, the subtitle is illegible at 220px. That is not a flaw. **The subtitle is where the claim's honesty lives and it must never carry the claim's meaning.** Measured length ceiling: 46 to 120 characters, one or two lines.

The six images with no subtitle all have an in-diagram substitute doing the same work: zone labels, numbered arc banners, column headers. **A form with neither a subtitle nor an in-diagram scoping device is unscoped**, which for a concept image is survivable and for a data image is not.

### 5.3 Type

**Two weights do the work; a third is a hedge on hierarchy.** Observed in the strongest images. Where a third appears it is doing a specific job, usually separating a bold label from a regular value inside one line.

**Tiers.** Three tiers of size, and the ratios cluster tightly. Measured headline-to-body cap-height ratios, in the twelve of fourteen teardowns that reported one: 1.75x, 2.6x, 3.0x, 3.2x, 3.2x, 3.2x, 3.4x, 3.4x, 3.5x, 4.8x, 5.0x, 5.5x. **Target 3x to 3.5x.** Above 5x the body has become a footnote the author still expects to be read. At the low end the set contains its own counterexample: the 1.75x image is the one whose teardown reports the weakest separation between its two headlines and its list, so treat 2x as a floor with one observed failure sitting just under it rather than as a measured boundary.

**One inversion worth copying.** In the trend poster, the axis tick labels are set *larger* than the subtitle that explains them, because ticks must survive the thumbnail and the subtitle need not. **Tick labels are a primary tier, not a caption tier.**

**Case.** All-caps for display works at ultra-heavy condensed weights and nowhere else. Sentence case throughout is the safe default and four of the strongest images use nothing else.

**Never rotate text 90 degrees.** No y-axis title, ever. Bake the unit into every tick and state it once in the subtitle.

### 5.4 Color

**Hue counts**, measured across the fourteen: 1, 2, 2, 2, 2, 2, 3, 3, 4, 4, 4, 5, 6, 7. Median 3. **Cap at 3 unless hue is encoding a stated dimension.** The 6-hue and 7-hue images are both the ones borrowing third-party brand colors, and both carry the longest failure-mode lists in the set.

**Accent discipline is measurable and it is severe.** In the trend poster, the two orange values sum to 4% of non-background pixels while the background family alone is 42%. There is exactly one accent object on the canvas.

**The accent test, and it is the best single rule in this file.** Before shipping, list every element carrying the accent. **If that list is not a coherent reading route, the accent is decoration.** In the working images the list reads like a path: highlighted headline span, then the term pill, then the footer prompt. In the failing case it reads like a shuffle.

**Tints must be checked against the page background, not against each other.** A ramp generated by evenly lightening one hue will land its last step within a few percent of the background. Measured failure: two panel fills that collapse to white at 220px, so an image promising four steps shows two.

**Reversed labels must be luminance-switched per fill, never set globally to white.** Measured failure: a white numeral on `#FFD401`, under 3:1 and effectively unreadable.

**A color assigned in a header must appear at least twice more in the body**, or the code was announced and abandoned. This threshold is stated once here; §3.4 and §6.2 refer to it rather than restating it.

**Page background.** Twelve of fourteen use an off-white or tinted ground: `#F1F0FE`, `#EFF2DF`, `#F8F6EA`, `#FAFFEB`. Two use pure `#FFFFFF`. The warm or cool ground is what lets low-contrast tone register at all; on pure white, a light tint has nothing to be lighter than.

### 5.5 Structure honesty

The most transferable finding in the whole teardown, and it belongs in `design-tells.md` as a category rather than a bullet.

**Geometry makes claims independently of the words.** A taper claims filtering. Nesting claims containment. Equal tiles claim peer status. A bar claims independent magnitude. A shared axis claims comparability. Depth claims permanence. An `=` claims equivalence.

**If the material does not have the relationship the geometry asserts, the image lies while every word on it stays true.** No language gate catches this, because there is nothing wrong with the language. This is the entire reason §2's shape test runs on the material rather than on the topic.

Three corollaries that recur across the set:

- **Item counts must track the container.** A shape that changes width across strata with equal counts per stratum is decoration.
- **Symmetric counts kill an asymmetric argument.** In a perception split, equal labels on both sides means no thesis.
- **Repeated structure demands repeated substance.** Twenty chip slots will accept twenty words the author does not stand behind. If a stage cannot fill its row honestly, cut the stage.

### 5.6 Attribution

Two postures in the set, and they are a real choice rather than a detail.

**Signature** (9 of 14). An italic name, sometimes a small circular headshot, bottom corner, at body size. Reads as authorship. Crustdata's `Data from: Crustdata` is a citation that happens to also be a signature, which is the strongest version: the credit and the product are the same sentence.

**CTA bar** (5 of 14, all Tooze). A dark full-bleed strip across the bottom 5%: `Useful? Follow [name] | Repost to your network`. It measures as the single densest band on those canvases and it is entirely illegible at feed size, so it is asking the reader who already stopped.

**Recommendation: signature by default.** PRD §10 already says the final slide of a carousel is a takeaway rather than a CTA, and the same posture should hold here. Whether the CTA bar is available at all is §10 decision 1, because offering it means a tenth `theme.json` key against a contract PRD §10 freezes at nine. This section does not get to add one in passing.

**The headshot is a blocker, and there is only one honest option.** Six of fourteen carry a circular photograph, and HTML with no external assets cannot produce one. Passing the photo as a base64 data URI has nowhere to live: PRD §10 freezes `theme.json` at nine keys and PRD §7a lets only setup write `identity.md`, so the engine has no field to read it from. **Drop the circle and keep the italic name alone.** Do not substitute a generated avatar or an emoji face; an anonymous silhouette beside a real name reads as a placeholder, which is worse than absence.

---

## 6. The design-tell gate, revised

### 6.1 Two existing rules, scoped to the infographic path only

**Scope first, because `design-tells.md` is shared.** PRD §3 runs that gate on slide HTML before render, which is carousels, and the evidence here is fourteen single-frame infographics containing no carousel at all. Overturning a shared rule from a sample holding none of the artifact it governs is not sufficient, whatever the count. **The revision and the proposal below apply to the infographic templates and leave the carousel entries untouched** until carousel evidence exists.

PRD §9 also specifies how a tell is retired: struck through with the date and the reason, after it fires on the person's own writing or on an `inspiration.md` post, with PRD §13.2 step 4's bar of more than 2 rewrites in 20 judged worse. Fourteen images from three strangers are neither corpus. What follows is written in that format rather than as a silent replacement.

**"Everything centered."** Violated by 9 of 14, including every strongest image in the set. The teardowns are unanimous on why: centering a *title stack* is correct, because a headline and subtitle are full-width single objects with nothing to compare against. Centering a *radially symmetric diagram* is not merely allowed, it is structurally required; a bullseye with an off-axis center is broken. What the rule was reaching for is real but narrower.

> **Revised, infographic path:** A centered *content layer*. Title stacks, footers, and radially symmetric diagrams are centered correctly. The tell is a body of comparable items centered rather than aligned to a shared edge, because centering destroys the shared baseline that makes a set scannable.

This revision carries a mechanical argument that would hold at n=1: a radial diagram whose center is off-axis is broken, so the rule as written forbids a correct construction. That is why it is a revision and not a proposal.

**"Three equal cards in a row."** Violated by 2 of 14, one of them four times over in a twelve-tile grid. Both got away with it and the reason is not luck.

> **Proposed exemption, infographic path, pending the negative control:** A trio invented to fill space. Three cards is a tell when the content did not have three parts and a slide needed filling; it is correct when it is a genuine enumeration that has to fit one canvas.

**This one is deliberately weaker than the first and is not a rewrite.** The evidence is two images, both explained after the fact, and the proposed test, whether removing one card removes information, is a judgment the model would apply to its own output. PRD §3 demands an enforced mechanism rather than a reminder, and converting a hard gate entry into a self-assessment is the failure PRD §9's "zero tolerance is a promise only the deterministic half can keep" exists to prevent. Hold it as a proposal until PRD §13.2 step 4's negative control runs.

### 6.2 New taste rules for `design-tells.md`, infographic path

**Scoped like §6.1, and for the same reason.** These are additions rather than revisions, but they were derived from single-frame images and none has been tested against a carousel. They enter the file tagged to the infographic path.

Deduplicated from all fourteen teardowns. Each is a failure someone would actually ship.

- A legend restating names already printed on the marks. A legend is earned only when the series identity is not on the mark itself.
- A legend of any kind for a single series.
- A y-axis truncated above zero on a magnitude claim.
- Data labels printed on every point. Annotate the terminal point or nothing.
- An area fill under a single line.
- Bar values printed outside the bar on a ragged track, which reserves a gutter and shortens every bar. The fixed-track variant is exempt and uses a numeral column, per §3.2.
- On the plot canvas only, an axis maximum rounded up to a nice number rather than pinned just above the top datum, which wastes the canvas and flattens the gaps. The ranked bar list has no axis at all, by §3.2.
- Rank numerals wrapped in circles, pills, or badges.
- A label repeated identically on every row. It belongs in a column header.
- Equal item counts across tiers of a shape whose width changes.
- Symmetric item counts in a perception-versus-reality image.
- A perfectly parallel list of N items, all sharing one grammar and one line count. This is the visual twin of PRD §9's ban on perfectly parallel bullet structure, and the fix is the same: break the format on one item deliberately.
- Uniform chip lengths inside a wrapping cluster, which reflow into a rigid grid and read as a spreadsheet.
- A color assigned in a header that does not recur per §5.4's threshold.
- A tint assigned with no semantic rule and no visibly regular repeat, which makes the reader hunt for a meaning that does not exist.
- Opaque white label chips on a tinted field, which kill the field's grouping signal. Use 40-55% alpha.
- A nested or radial diagram with no ordinal numbers on its layers.
- Text rotated 90 degrees.
- An in-element ornament that only fits some instances. It must fit the smallest instance or appear on none.
- The load-bearing number set only in body copy.
- Any digit in body copy with no source region in the layout.
- A chart mark carrying a color ramp or a directional arrow but no labeled values and no source.
- A comparison layout whose rows do not share an identical slot order.
- A row label not derivable from that row's contents by someone who sees only that row.
- Uniform border weight across header rules, column rules, and body rules.
- A tiered layout whose boundaries are all drawn identically.
- Leader lines that stop at a shape's outline rather than crossing into it.
- A divider inset to the content margin rather than bled to both canvas edges.
- A generated avatar or emoji face standing in for a real headshot.

### 6.3 Five new mechanical checks for `render.js`, one of which extends PRD §10's

> **RETIRED 2026-09-06.** All five read the rendered HTML as text, and the HTML is gone: the visual renderers were replaced by `render/imagegen/`, which generates the image directly. Four of the five were built and shipped for fifteen months of renders; they are in `archive/2026-09-06-html-renderers/infographic/render.py` (`check_layout`, `check_spec`) and nothing calls them. Row 4, required-parameter fill, is the one that survived the move: it is pure spec arithmetic rather than markup reading, and it runs in `checkSpec()` in `render/imagegen/prompt.js`, unchanged, including the `source_name` rule §4.2 binds it to. The other three, and the five-item checklist that replaces them, are `docs/superpowers/specs/2026-09-06-imagegen-infographics-design.md` §5.2. **Struck rather than deleted**, per this file's own convention: the reasoning below is still the reasoning, and the thresholds are still the thresholds if a mechanical pass over the PNG is ever built. The section is kept verbatim from here down.

PRD §10 already establishes the pattern: the geometry check lives in `render.js` because the HTML always looks fine. All five are new work. The fifth extends PRD §10's existing overflow check rather than repeating it, because that check alone is not sufficient: a label wrapping to three lines inside a box with room for three lines clips nothing, passes `scrollHeight > clientHeight`, and still breaks every row-rhythm failure named in §3. That is why row 5 states a different method.

| Check | Method | Fails when |
| :- | :- | :- |
| **Thumbnail legibility** *(new)* | Downscale the render to 220px wide; compute the rendered cap height of every text node the template marks `data-layer="claim"` | Any claim-layer node under ~8px cap height at 220px, which is ~40px at 1080px canvas width. **[UNVERIFIED 2026-08-17, owner Joseph]**, per §1 |
| **Tint against background** *(new)* | Compare every panel or band fill to the page background in OKLab. The conversion is about twenty lines and needs no dependency, per PRD §13.1's node-with-no-npm precedent | Lightness delta under 0.04 in OKLab. **[UNVERIFIED 2026-08-17, owner Joseph]** Derived from the one measured failure, two fills collapsing to white at 220px; read the real number off the first ten renders |
| **Reversed-label contrast** *(new)* | For every text node on a filled parent, compute contrast against that fill | Below 4.5:1 for body, 3:1 for large text |
| **Required-parameter fill** *(new)* | Template declares required params and their character budgets; build fails on an empty required param or an over-budget string | `source_name` empty on any data archetype, or any label past the budget §3 states for its slot |
| **Line-budget overflow** *(extends PRD §10)* | PRD §10's clipping check applies here unchanged. This adds one thing it cannot see: compare each label's rendered line count against the budget the template declares for that slot | A label rendering more lines than its slot budgets, whether or not anything is clipped |

The first check is the one worth building even if the others slip. It is the only mechanical test of the two-layer law, and the two-layer law is the finding this whole file rests on.

**Built 2026-08-24: four of the five.** Thumbnail legibility, tint against background and reversed-label contrast run in `check_layout(doc, theme)` in `render/infographic/render.py`, reading the built HTML as text per PRD §4's cost argument; required-parameter fill runs in `check_spec`. The colour work is about ninety lines of stdlib Python — sRGB to OKLab both ways, a `color-mix(in oklab, ...)` resolver reading `theme_css`'s own token table rather than a second copy of it, and an `html.parser` walk carrying background, colour and size down the tree the way CSS inheritance does. A contrast failure is an ERROR and refuses the render, because 4.5:1 and 3:1 are WCAG rather than taste; the two `[UNVERIFIED]` thresholds warn and print the measured number beside the threshold. **Row 1 carries a stated ceiling:** it reads the *declared* font size against a 0.70 cap ratio, so it cannot see a wrap, a shrink-to-fit, or a face whose real cap ratio differs. This row asks for rendered cap height; that is the honest approximation of it, and the docstring says so.

**Row 5, line-budget overflow, is refused rather than approximated.** It needs a rendered line count per slot, which needs glyph metrics for a face `theme.json` only ever names and Chrome resolves at render time. A character-count proxy would be row 4 wearing row 5's name, and this section's own argument is that row 5 exists *because* row 4 already covers budgets. The upgrade path is costed and not taken: inject a script writing `getClientRects().length` onto each slot, run Chrome with `--dump-dom`, read the attributes back, at the price of a second Chrome launch per render. The carousel renderer has no equivalent pass at all and reads these by eye.

---

## 7. Where the ideas come from

The forms in §3 are reproducible. The question that decides whether anyone can run this for a year is where the next twenty ideas come from, and the three creators answer it three different ways. Researched from their own sites, podcasts, job postings, and public writing; what could not be verified is marked.

### 7.1 Three supply models

**Crustdata: an owned dataset that re-derives itself.** They sell B2B company and people data, and every chart is one query against the inventory they license. The chart is not an advertisement for the product; it is a working sample of it. A prospect who doubts their freshness and coverage reads a chart of everyone who joined a named company between January and July and gets evidence rather than a claim.

Two mechanisms make this a well rather than a bucket, and both transfer.

- **The dataset tracks movement, so the same query is new content in ninety days.** People change jobs, headcounts move, funding lands. A static corpus, a benchmark study, a customer list, gives you N cuts and then you are recutting. Small-and-moving beats large-and-frozen.
- **The news picks the subject; the dataset supplies the answer.** A pure news reactor has to add commentary, which anyone can add. A pure dataset owner has to guess what people care about this week. Running both means never hunting for topics and never publishing a commodity take. When a trade publication reported that one company was hiring away another's salespeople, everyone could comment, and only the party holding the employment graph could publish the ranked source table with counts. That table was then cited by name in the trade press, which is the whole return on the format.

Their entire output reduces to roughly five question shapes crossed against an unlimited entity list. **Ideation is a join, not a brainstorm.** Do the template work once.

**Jonny Tooze: a finite concept list multiplied by an infinite analogy list.** He hosts a paid cohort for senior engineering leaders and runs enterprise AI transformations. The infographic set maps one-to-one onto curriculum objects, which is the first mechanism: **the paid curriculum is the content backlog**, and giving away one page of it proves the programme rather than substituting for it.

The concept list is finite and he knows it. There is a fixed stock of things a non-technical leader does not understand, and the market gets literate. The escape is the multiplier: the analogies in his posts are the Yellow Pages, an unused gym membership, onboarding a graduate, hour four of a workshop. None of them is about the subject. **The concepts run out; the analogies never do**, and the analogy is what makes the image shareable.

Three further sources, in descending durability: telemetry from a production system he runs himself, where every bug is a post with a real number in it; boardroom and cohort sessions, refilled by the business the content is selling; and a rolling corpus of large-consultancy research he curates rather than authors, which is someone else's well but his shelf. The last of these is the cheapest and the least defensible, and he appears to use it exactly that way, to fill the weeks when the proprietary sources are slow.

**Pierre Herubel: client throughput, where the revenue activity and the idea-generation activity are the same activity.** He advises B2B companies at volume and sells courses, a paid newsletter in which infographics are a stated deliverable, and a done-for-you content service. He has published his supply system, and its ordering is the finding:

> 1. Experimentation. Analyze your own operations: sales data, customer support inquiries, product feedback. Look for patterns: recurring questions, untapped opportunities.
> 2. Conversations. Talk to people important for your business. Interview customers, partners, thought leaders.
> 3. Desk Research. Analyze competitor content, industry reports, public data.

**He puts the two sources he alone can reach first and the one anyone can copy last.** Most content operations invert this, because desk research is cheapest, and then produce content anyone could have produced. His own diagnosis: if creating content is easy, the strategy has to be uncopiable to differentiate.

He looks superficially like the worst case, the teacher whose fixed curriculum empties. He is not, and the reason is the single most portable thing in this section: **his curriculum is re-derived from new engagements every month rather than memorized once.** The well cannot empty while the business operates, and it fills faster when the business grows.

### 7.2 What this engine already has, and what it does not

Read the three models against the PRD and the answer is uncomfortable but clarifying.

**The engine natively implements the third model.** PRD §6.2's interview asks "what do people in your industry get wrong constantly," "what did you believe six months ago that you no longer believe," and "what's an opinion your peers would push back on." That is a recurring-confusion log. `thesis.md` carries an `against:` field holding the opposing position in the words someone who holds it would use. `audience.md` records what the audience believes and is wrong about. PRD §7b's signals let the news select an occasion without becoming the subject, which is structurally the same move Crustdata makes with a dataset.

**What the engine does not have is a dataset.** Nothing in the profile schema holds a numeric series, and nothing in the interview asks for one. §6.2 asks "what's a number that surprised you recently," which yields one number, not a series. This is why the `quantify` family is the one the engine is least equipped to feed, and it is an independent argument for the §8 build order: ship the forms the profile already feeds, and let the data path arrive with the one chart worth building.

**The one capture worth adding.** At the weekly top-up in `/content-engine review`, one question: *"Anything you measured this week that you could show over time?"* It costs one line, it is the only question that seeds the `quantify` family, and its answer is an inventory item of `type: number` like any other. Do not build a dataset feature. The gap is a question, not a schema.

### 7.3 Rules the engine should take from this

**Rank idea sources by copyability and starve the copyable one.** The profile schema already carries `source:` on every inventory item. Desk research is the one anyone can do, and it is also the one an LLM produces most fluently, which makes it the default failure mode of an engine like this one. A cap is worth considering: if more than a stated share of shipped pieces trace to publicly available material, the engine is producing content anyone could have produced. **[UNVERIFIED 2026-08-17, owner Joseph]** No basis in the research for picking the number; measure it across the first thirty posts before setting one.

**Log the confusion you have corrected more than three times.** A niche generates new confusions faster than it generates new facts, which is why this supply feels infinite while a fact-based one does not. Four of the fifteen signatures, the perception split, the comparison table, the analogy rows, and the causal chain, take a corrected confusion as their entire input.

**Set the production-time ceiling before choosing the visual system, not after.** Herubel names one hour to write and design an infographic as a competitive advantage. His near-white minimal style is not taste, it is throughput engineering: no illustration, no photography, nothing that needs a designer. PRD §12.1 already instruments `minutes_to_ship` and already names the kill criterion. The visual system inherits it: **an archetype whose median run exceeds the ceiling is cut, however good it looks.**

**Run two lanes.** Herubel is explicit that framework-class images are slow to ideate while binary comparisons are not. A single-lane engine goes silent whenever the flagship stalls. In this catalog the fill lane is the comparison table and the perception split. The flagship lane has to be something §8 actually builds, so it is the causal chain in Phase 1 and the variance bridge in Phase 2; the stratified container is the flagship only once Phase 3 ships, and the mirrored rings may never.

**The footer is the only element that must never vary.** Infographics travel decoupled from the post that carried them. A source or signature line is what converts a screenshot-and-repost into an attribution, and it is why a trade journalist writes "according to data from X" rather than "according to LinkedIn data." Fix it once and vary only the payload, which also removes one decision per run and is part of how a daily cadence survives.

### 7.4 What could not be verified

Stated so nothing here is read as measured. No posting cadence was confirmed for any of the three; LinkedIn's public surfaces are gated and no feed could be read in full. No engagement figure on any infographic post was retrieved, so nothing in this file claims these images "perform well" on evidence, only that three commercially successful operators have converged on the same forms. No creator has published how the images are made: no tool, no template, no process post was found for any of them. No follower count appears anywhere in this file, because none was needed to support a claim here.

**The strongest evidence of performance is indirect and worth naming as such:** one of the three sells 36 format templates and delivers infographics as a paid newsletter deliverable, one runs a service productizing the format for clients, and one had a chart cited by name in a trade publication. People do not productize a format that does not work.

---

## 8. What ships, and in what order

**Count templates, not signatures.** Fifteen signatures select independently and share ten HTML templates, because several forms are the same geometry with a flag set. The first draft of this file counted forms, concluded that eleven templates could not fit PRD §13's single build step, and was solving a problem it had invented.

| Template | Signatures it serves |
| :- | :- |
| Split panel | Perception split |
| Row table | Comparison table |
| Tile grid | Tile taxonomy · Sourced shelf (adds group bands and a third card field) |
| Chain | Causal chain |
| Plot canvas | Trend poster · Distribution strip |
| Bar rows | Ranked bar list, ragged and fixed track · Composition split, stacked variant |
| Waterfall | Variance bridge |
| Banded cluster | Stage stack · Stratified container · Mirrored rings (reflection mode) |
| Analogy rows | Analogy rows |
| Quadrant | Quadrant map |

**Phase 1: four templates, and no data path.** Split panel, row table, tile grid, chain. Every one of them takes a belief, a correction, or a list as input, which §7.2 shows is exactly what the profile already holds. **None of the Phase 1 signatures needs §4**, none needs a source line, and none can print a wrong number. The sourced shelf shares the tile grid but is gated on §4 and ships in Phase 2, so Phase 1's tile grid ships with the taxonomy alone. The visual system produces publishable output before the research-and-confirm mechanism exists.

**Phase 2: three templates, and §4 arrives with them.** Plot canvas, bar rows, waterfall. This is where the data path is built, once for five of the six data-carrying signatures; the sixth, the sourced shelf, rides Phase 1's tile grid and joins here because §4 is what it was waiting for. **Trigger:** Phase 1 shipped and §7.2's weekly capture question has produced at least one verifiable quantity worth drawing. A series, a partition, a set of observations, or a reconciled gap all count; an earlier draft said "numeric series," which excluded three of the five forms the phase builds. Building the data path before there is anything to put through it is how §4 becomes theatre.

**Phase 3: three templates, on demand.** Banded cluster, analogy rows, quadrant. **Trigger for each: three runs refused because the material fit that signature and no template existed.** Three refusals is evidence of demand; one is a coincidence, and the refusal message under §2.4 already names the form, which makes this countable rather than a judgment call.

**Two things deliberately not in any phase.** The mirrored rings ships only as a mode of the banded cluster, never as its own build, because its material shape is rare enough that a dedicated template may never earn itself. The sourced shelf ships as a tile-grid variant and is gated on §4 regardless of its template, because it carries the highest fabrication surface in the catalog against the least reader benefit.

**Where this sits in PRD §13.** Step 11, ahead of carousels. Decided 2026-08-17 and applied to the PRD with both dependencies; §10 decision 3 holds the case.

---

## 9. Deliberate non-goals

Each of these was reached by looking at the reference set and deciding against it. They are listed so they do not return as suggestions.

**Hand-drawn illustration.** Five of the fourteen images depend on it, and it is the single biggest quality gap between what this engine can produce and what the best of the set looks like. HTML, CSS, and inline SVG cannot make a cross-hatched pencil drawing, and no honest substitute exists: a geometric icon beside real drawing reads as clip art, and PRD §10 already bans decorative icon sets. **Trigger to revisit:** an image model available with no API key and no manual setup, which PRD §1.3 would otherwise forbid. Not soon.

**Third-party brand logos.** Three reference images use real company marks as row labels, and they buy genuine recognition. They are also un-reproducible per topic, they make the template non-reusable, and a wrong glyph beside a real company name is worse than no glyph. Substitute a monogram chip in the row's hue. **Trigger:** none.

**Photographic headshots.** Six images carry one. Drop the circle and keep the italic name, per §5.6: a base64 data URI has nowhere to live, because PRD §10 freezes theme.json at nine keys and PRD §7a lets only setup write identity.md. Never generate a face or an avatar.

**Canva, Figma, and template galleries.** PRD §10 already refuses these and the reasoning holds without amendment: template-driven output looks like everyone else's output.

**A chart library.** Every chart in this catalog is inline SVG with a hand-written coordinate mapping. A library brings a dependency, a default visual language, and axis furniture the design rules spend most of their effort removing.

**Carousels dressed as infographics.** If the material needs sequence across frames, it is a carousel. The forms here are single-frame by construction, and a single frame holding eight beats is a carousel someone forgot to cut.

**Quote cards.** Not merely unbuilt: structurally excluded by §2.4's refusal path. A sentence in large type on a colored rectangle carries no information the post text does not, and it is the most common AI-made LinkedIn image in existence.

**Animation, video, and interactive output.** Out of scope. The artifact is one PNG, per PRD §10.

### 9.1 Shapes correctly refused, with the reason

Each of these was tested against §1's shipping test, that the atoms surviving 220px must themselves be the claim, and each failed it. Written down so they stop returning as suggestions.

- **Geographic distribution.** A map at 220px is a blob, a choropleth needs a legend, and a world outline is an asset dependency in all but name. The honest degradation is a ranked bar list of the top six regions, which is already in the catalog.
- **Decision tree.** The branching silhouette survives the thumbnail; the payload is the edge conditions, which are body-size and die. A tree whose headline plus silhouette carries the claim has two or three leaves and is a comparison table.
- **n-by-m matrix**, RACI, capability-by-maturity, and their relatives. The payload is the cells, and no cell survives. Contrast the tile taxonomy, which ships precisely because its short labels survive and its bodies are stop-layer reward. That contrast is the sharpest available statement of §1.
- **Scatter of paired observations.** Refused on form rather than on supply: both axes need labeled poles and a stated unit to mean anything, and neither axis label survives 220px, so the surviving cloud asserts a correlation the reader cannot name. The distribution strip ships on one axis under the same supply constraints, so a supply argument would not have held here. The honest low-data version of the correlation claim is the quadrant map in §3.15.
- **Timeline of dated events.** A chronology is not an argument, and §4.3's rule applies: a chart with no belief behind it is a data dump. Any timeline worth posting is making a density or acceleration claim, which is a trend poster.
- **A single dominant number.** This is the quote card with a numeral in it. Refused by §2.4.
- **A quote, or a definition.** Same. Note that a *set* of verbatims, nine customer objections in their own words, is not a quote card. It routes to the tile taxonomy only where each carries a label of 13 characters or fewer with the quote as its body; nine full sentences as tile labels is a wall, not a taxonomy.
- **A flat list of 4 to 5 peers with no counts, no order, and no shared base noun.** Boxes around a five-item list add nothing the post text does not carry. **6 to 8 peers now reach the tile taxonomy**, whose floor moved from 9 to 6 for exactly this reason, so the refusal band is narrower than an earlier draft stated. Below 6 the escapes are: give the items counts, which reaches the ranked bar list, or find the order, which reaches the stage stack at 3 to 5 stages.

---

## 10. Open decisions for Joseph

**1. Attribution posture: signature or CTA bar?**
§5.6 recommends signature, consistent with PRD §10's "final slide is a takeaway, not a CTA." Tooze runs a follow-and-repost bar on all five of his and it is measurably the densest band on those canvases. The counterargument is that it is illegible at feed size, so it only ever addresses a reader who already stopped, which is the cheapest possible moment to ask.
*Recommendation:* signature as the default, and **do not add the posture flag**. Decisions 1 and 2 each proposed a different tenth key without acknowledging the other, which would take a contract PRD §10 freezes at nine to eleven. Only one earns it, and it is `accent_2`. Hardcode the signature; anyone who wants a CTA bar can ask and get one edit.

**2. Does `theme.json` gain a second accent?** *(The only proposed tenth key, per decision 1.)*
PRD §10 freezes nine keys and `accent` is singular. Six of the fourteen images use a second accent that carries meaning: good versus bad, before versus after, subject versus remainder. A single accent cannot express a two-sided comparison. Two Phase 1 signatures are two-sided, the perception split and the comparison table, and three later forms depend on a second accent outright: the trend poster's overlay variant, the variance bridge's signed contributions, and the mirrored rings' two ramps. Those three are blocked on this decision and say so in §3.
*Recommendation:* add `accent_2`, and only that. Deriving it from `accent` by rotating hue produces the arbitrary color pairs the design rules exist to prevent, and the frozen-contract argument is weaker than shipping three templates that cannot say "this one is the bad one."

**3. Should infographics move ahead of carousels in the build order? Decided 2026-08-17: yes, with all three amendments, applied to the PRD.**
The case is real: one frame, same render path, no inter-slide repetition problem, a fraction of the token cost per run, and Phase 1 above needs no data path at all. But an earlier draft of this file argued the swap as though it were a preference, and it is not. It is a three-part amendment, and the second and third parts are what make it a decision rather than a tidy-up.
- PRD §13: swap steps 11 and 12.
- **PRD §4's cost gate** currently reads "steps 12 and 13 are greenlit only once ten completed carousel runs have a measured median." Building infographics first removes the gate's own precondition, because there are no carousel runs to measure. Rewriting the denominator alone is not enough: after the swap, step 11 is infographics and step 12 is carousels, so a gate still naming steps 12 and 13 would price everything except the thing being moved earlier. **The step numbers have to move with the text.**
- **PRD §7a's writer list** says the first carousel run writes `theme.json` once, and nothing else ever writes a profile file. If infographics ship first and that list is unamended, every early infographic renders from `_template` defaults, which is precisely the "looks like a template because it is one" failure §5.1 names as the tell.

*Recommendation, taken:* make the swap, with all three amendments, or leave the order alone. Do not make it as a one-line reorder. All three landed together: PRD §13 rows 11 and 12, PRD §4's gate now reading ten measured infographic runs and naming step 12, and PRD §7a's writer list retargeted from the first carousel run to the first visual run in every place that named it.

**4. How hard is the refusal in §2.4?**
As written, the engine refuses to make an infographic when no archetype fits and offers a short post instead. That is a tool telling its owner no.
*Recommendation:* keep it hard. It is the same posture as PRD §3's repurpose refusal, which the review upheld, and the alternative is a quote card. But it is worth knowing that this will fire, that it will fire on a day when someone wanted an image, and that a soft version does not exist: a refusal you can talk your way past is a suggestion.

**5. Is the 40px claim-layer floor right?**
§1's threshold is an interpolation between measured headline heights of 73 to 105px and measured body heights of 13 to 30px. Nothing in the set sits between.
*Recommendation:* ship 40px, render the first ten infographics, and read the number off the ones that failed. Tagged `[UNVERIFIED 2026-08-17, owner Joseph]` in §1 until then.

---
