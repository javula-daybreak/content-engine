# An open archetype catalog: design

Status: draft, pending approval. Owner: content-engine.

## 1. Problem

The catalog is closed. `content-engine-VISUALS.md` §2.3 step 5 says *"evaluate
all fifteen signatures"*, and the engine ships nineteen archetypes, of which
§3.17 records three as unselectable. So every image the engine will ever make is
one of sixteen forms. Make a hundred infographics and you get sixteen shapes,
repeated.

**The objection, in the user's words:** the form should fit the material. If the
material is best read as a table, a table. If it wants a graph, a photo, a vector
diagram, that. It cannot all be sixteen things.

**Two things make this worse than it looks.**

First, the closed set was load-bearing when it was written and is not any more.
Under the retired HTML renderers an archetype *was* a template: real Python, real
CSS, and adding a form meant writing one. Since 2026-09-06 an archetype is **one
English sentence** injected into a prompt:

```
LAYOUT: funnel
Stacked horizontal bands narrowing from top to bottom, one band per stage...
```

`render/imagegen/prompt.js` holds nineteen of those in `RECIPES`. The renderer
does not need a fixed list; the image model draws whatever is described. The
things still holding the engine to sixteen are `REQUIRED`/`BUDGETS`
(validation), §2.1 (the repetition lock), and §5.5/§6.1 (structure honesty).

Second, §2.3 is already a reasoner and deserves credit for it. It writes the
claim first, enumerates regroupings of the material, runs a clearance filter per
regrouping, and discards forms that accept the material but cannot carry the
claim. That is not a lookup table. **The gap is not that nothing reasons. It is
that the reasoning is confined to a fixed candidate set, and when nothing in the
set fits, §2.4 refuses rather than proposing.**

## 2. What this is not

**§2.4 must survive intact, and this design is built around it rather than
through it.** That section says the engine "does not improvise", and names the
reason: the one thing an image generator does with material that has no fitting
form is a quote card, a sentence in large type on a coloured rectangle. It
carries no information the post text does not, it is the most common AI-made
LinkedIn image in existence, and the engine is required to be *structurally
incapable* of producing one.

That argument is correct and nothing here weakens it. **An open catalog is not
permission to improvise.** The difference between a proposed form and an
improvised one is a contract: an improvised form is a paragraph of prose handed
to an image model, and a proposed form arrives with the same seven things every
§3 entry carries, which makes it checkable, lockable, and honesty-gated exactly
like a shipped form.

If a proposal cannot state what its geometry claims, it is not a form and §2.4
still refuses.

## 3. Scope

**In scope:**
- A proposal step in `VISUALS.md` §2.3, between steps 9 and 10, reachable only
  on the path that currently leads to the §2.4 refusal.
- A per-profile catalog file, `profiles/<handle>/archetypes.md`, that
  `prompt.js` merges over the shipped catalog at load.
- A promotion path from the per-profile catalog into `VISUALS.md` §3.
- A novelty clause in the §2.1 archetype lock.
- Admitting **supplied** photography on the infographic path, matching what the
  carousel path already does with `image:`.

**Out of scope, explicitly:**
- The language gate, the brief, angle crossing, locks 1-4. Untouched.
- The refusal path itself. §2.4 keeps all three of its grammars and stays the
  terminal state; this design adds one attempt before it, not after.
- **Generated** photography and 3D rendering. The `HARD CONSTRAINTS` ban stays
  (§8).
- Multi-model routing. Still one hardcoded model.
- Retiring any of the nineteen shipped archetypes.
- The three unselectable archetypes in §3.17. They need §3 entries, which is a
  separate and much smaller job than this one.

## 4. Architecture

Three pieces, in the order a run meets them.

### 4.1 The proposal step

Inserted in §2.3 as **step 9a**, after "rank the survivors" and before "zero
deficits: proceed". It fires on exactly two conditions, both of which currently
route to §2.4:

1. Every candidate was disqualified (step 6 emptied the set), **or**
2. Every survivor was discarded at step 7 for not carrying the claim, **or**
   every remaining deficit is closed-set (step 12's unclosable case).

It does **not** fire when a catalog form fits with closable deficits. Step 11
already handles that with one question, and a proposal there would be the engine
inventing a form to avoid asking a question it should ask. **The catalog is
always tried first and always wins a tie.**

The step reads the claim from step 1, the regroupings from step 3, and the
quoted disqualifiers from step 6, the same material §2.4's refusal already
prints, and asks one question: *is there a geometry that carries this claim?*

Output is either a complete proposal (§5) or nothing, and nothing falls through
to §2.4 unchanged.

### 4.2 The per-profile catalog

`profiles/<handle>/archetypes.md`, same spec grammar the engine already parses:
front matter plus `:: <slug>` blocks. One block per proposed form, carrying the
seven fields in §5.

`prompt.js` gains one function, `loadProfileCatalog(profileDir)`, which parses
that file and merges its entries over `RECIPES`, `REQUIRED`, `BUDGETS` and
`SOURCE_REQUIRED`. Merge, not replace: a profile cannot silently redefine
`funnel`, and a slug colliding with a shipped archetype is an ERROR at
`--check`, not a shadow.

This keeps `prompt.js` pure. The file is read by `render.js` and passed in, the
same way `theme.json` already is.

**Why per-profile rather than straight into `VISUALS.md`.** A form proposed
from one person's material on one Tuesday has not earned a place in the catalog
every profile reads. The profile file is where a form proves itself; §4.3 is how
it graduates.

### 4.3 Promotion

A form in a profile catalog that has been **used twice and shipped twice**
becomes eligible for `VISUALS.md` §3. Promotion is a human decision and a commit,
never automatic: it writes a full §3 entry (input signature, disqualifiers,
parameters, structure honesty, thumbnail contract, breaks-when) and adds the
recipe to `RECIPES` in `prompt.js`.

`/content-engine review`, which already reconciles weekly, prints eligible forms
as a one-line prompt. That is the whole mechanism.

**This is the part that makes a hundred infographics not be sixteen shapes.** The
catalog is no longer a fence; it is a record of what has worked, and it grows in
the direction the material pushes it.

## 5. The contract a proposal must supply

Seven fields. These are not new requirements invented here. They are what every
§3 entry already carries, restated as a schema so a proposal can be checked
mechanically.

| Field | Why it is mandatory |
| :- | :- |
| `archetype` | Kebab-case slug, unique against the shipped catalog. The §2.1 lock counts occurrences and cannot count an unnamed thing. |
| `geometry` | One sentence. Becomes the `RECIPES` entry, injected verbatim under `LAYOUT:`. This is the only field the image model sees. |
| `claims` | What the geometry asserts independently of the words: filtering, peer status, necessity, exhaustiveness, ordinality, proportion. **§5.5's structure honesty is unenforceable without it**, and a proposal that cannot fill it is a picture, not a form. |
| `signature` | What material it requires: item counts, value types, whether values must sum. Feeds `REQUIRED` and `BUDGETS._items`. |
| `disqualifies` | What material it must refuse. A form with no disqualifiers accepts everything, which is the quote card §2.4 forbids, wearing a slug. |
| `fields` | Field names with character budgets. Feeds `REQUIRED` and `BUDGETS` so `--check` validates it identically to a shipped form. |
| `thumbnail` | What survives at 220px. §1's two-layer law applies to proposed forms or it applies to nothing. |

**`claims` and `disqualifies` are the two that make this safe.** They are the
fields an improvised form cannot fill, and requiring them is what keeps §2.4's
argument intact: a geometry that asserts nothing and refuses nothing is exactly
the quote card, and it fails the schema before it reaches an image model.

## 6. The lock

§2.1's archetype lock counts a proposed form like any other: no archetype twice
in a row, no more than twice in any trailing 5.

**One clause is added, and it closes an obvious hole.** A newly proposed form has
by construction never been used, so it is always legal under the lock, which
makes inventing a form the cheapest way to dodge a lock the engine spent a
section justifying.

> **Novelty clause.** No more than one proposed form in any trailing 5 shipped
> visual pieces. A run that would be the second is refused at step 9a and falls
> through to §2.4, whose refusal names the novelty budget as the deficit.

This keeps the shipped catalog the default path and makes proposal the exception,
which is the correct ratio: the sixteen forms exist because they cover most
material, and the evidence for that is three months of runs.

## 7. Validation and the gate

**Nothing new.** A proposed form supplies `fields`, so `checkSpec()` validates a
spec against it exactly as it does a shipped form: required fields present, item
counts inside `_items`, character budgets respected, source line required if it
prints numbers.

The visual check (`design spec §5.2`) reads the rendered PNG against the claim,
and takes the claim from `claims` rather than from `VISUALS.md` §3. The check
does not know or care which catalog the form came from.

This is the payoff of demanding the full contract: **no new gate code, no second
validation path, no honesty exemption for new forms.**

## 8. Photography, tables, and the media question

The user's objection named three things the catalog cannot currently produce. They
have different answers and should not be collapsed.

**Tables: already legal, and the likeliest first proposal.** `comparison-panel`
is a two-or-three-column table with a shared row rail. A general N-column,
M-row table is not in the catalog and is a clean proposal: its `claims` is
"every cell is comparable along its column", its `disqualifies` is "values that
are shares of one whole" and "more rows than survive 220px". Expect this one
first.

**Graphs and vector diagrams: mostly already legal.** `trend-poster`,
`distribution-strip`, `variance-bridge`, `ranked-bars`, `quadrant-map` and
`composition-split` are six chart forms. `annotated-diagram` and `causal-chain`
are vector diagrams. The gap here is narrower than it looks and is best closed by
proposals for specific missing shapes (small multiples, a timeline, a Sankey)
rather than by a category change.

**Photography: split the question, and the split is principled.**

- **Generated photography stays banned.** `buildPrompt`'s HARD CONSTRAINTS
  include *"No photography, no 3D rendering"*, and that line should not move. A
  photorealistic image of an event that did not happen is a fabrication, and PRD
  §14 forbids the engine inventing a fact, a number, a story or a credential. A
  generated photograph is all four at once and is the single highest-risk output
  the engine could learn to make.
- **Supplied photography is admitted on the infographic path.** The carousel path
  already takes `image:` per slide, resolves it relative to the spec, and passes
  it to the model as the first of three reference images. The infographic path
  has no equivalent for no stated reason. Adding it is small: one field, the
  existing `runCheck` existence test, the existing reference-priority order.

That line, the engine may place a photograph you supply and may never invent
one, is the same line PRD §14 already draws for facts, applied to pixels.

## 9. What gets amended

| File | Change |
| :- | :- |
| `content-engine-VISUALS.md` §2.3 | Step 9a inserted. Step 5 reworded: the candidate set is the shipped catalog **plus the profile catalog**. |
| `content-engine-VISUALS.md` §2.1 | The novelty clause. |
| `content-engine-VISUALS.md` §2.4 | One new refusal grammar: novelty budget spent. |
| `content-engine-VISUALS.md` §3 | A §3.0 stating that §3 is the shipped catalog, not the whole catalog, and naming the promotion path. |
| `content-engine-PRD.md` §5 | `profiles/<handle>/archetypes.md` joins the profile file list. |
| `render/imagegen/prompt.js` | `loadProfileCatalog()`, merge, collision ERROR. `image:` admitted on infographic blocks. |
| `render/imagegen/render.js` | Pass the profile catalog through; resolve an infographic `image:`. |
| `workflows/infographic.md` | Step 4a gains 9a. Step 6 unchanged. |
| `workflows/review.md` | Print promotion-eligible forms. |
| `profiles/_template/archetypes.md` | Ships empty, with the seven-field schema as a comment. |

## 10. Testing

Pure, in `tests/test_prompt.js`, no network and no cost:

1. A profile catalog parses and merges; a proposed slug reaches `RECIPES`.
2. A proposed form's `fields` drive `checkSpec`: missing required field is an
   ERROR, over-budget item is an ERROR, exactly as for a shipped form.
3. A slug colliding with a shipped archetype is an ERROR, not a silent shadow.
4. A proposal missing `claims` or `disqualifies` is rejected by the schema.
5. `buildPrompt` on a proposed form injects its `geometry` under `LAYOUT:` and
   nothing else changes in the prompt.
6. An infographic `image:` resolves relative to the spec and is passed as a
   reference; a missing file is an ERROR at `--check`.

One live test, human-run, never automatic: propose a general table from real
material, render it, and read the PNG against its own `claims`.

## 11. Risks, named rather than hidden

**The catalog erodes into sixteen-plus-noise.** Every run proposes, quality drifts,
and the lock's justification rots. Mitigated by the novelty clause (§6) and by
9a firing only on the refusal path. But the clause is a number, and if one in
five turns out to be too loose it should be tightened to one in ten rather than
argued about.

**`claims` becomes a formality.** A model asked to state what its geometry
asserts will always state something. The field is only load-bearing if the
visual check actually reads the image against it, which means §5.2's checklist
must cite `claims` explicitly rather than reading it as context.

**Proposals concentrate in one job.** `quantify` already holds six archetypes and
`transform` holds one. Proposals will follow the material, and the material
skews. Worth watching in `review`, not worth pre-solving.

**The promotion path never gets used.** Two shipped uses is a low bar, but
promotion is a commit and commits need a human. If nothing is ever promoted, the
shipped catalog stays at nineteen and every profile accumulates its own private
forms, which is a worse outcome than today because the forms stop being shared.
The `review` line exists to make this visible early.

**This is the second design in a week to widen what the visual path may do.** The
renderer swap removed the mechanical layout gate; this removes the closed
candidate set. Both were load-bearing constraints, and what replaces both is a
model reading its own output against a stated claim. That is a real reduction in
mechanical guarantee, it is stated here rather than discovered later, and it is
the argument for keeping `claims` mandatory and the novelty clause tight.
