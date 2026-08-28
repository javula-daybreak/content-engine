# Three-persona dogfood — synthesis
Run 2026-08-25 against HEAD 397eb04. Beatriz (zero archive, complete run),
Dev (4 thin posts, 30 findings, died before artifact section),
Marisol (rich archive, 21 findings, died after short post).
85 findings total. Nothing was fixed.

## The through-line

Every persona praised the drafting and the step-5b reader. Nobody said the
engine writes badly. The defect class that actually shows up in all three runs
is this: **the engine reports success it has not earned.**

- `pass: true` on a negative control where 100% of samples tripped a rule (M, D)
- `file: "found"` on a gate-calibration.md it parsed as empty (M, D)
- clean gate pass on a draft carrying ~10 instances of the tell the gate is named for (B)
- `gate_passes: true` with `baseline_source: "none, absolute floors applied"` (B, D)
- exit 0 on a 9-slide deck that renders 8 pages (B)
- `specifics: 0` on a draft containing nine spelled-out quantities (D)
- L4 — "a model of the author's own best work" — on run one, two-line context block (D)
- setup's closing line asserts "the gate is tuned to your writing" unconditionally (B, D)

That is one fix philosophy, not eight fixes: never print a pass the evidence
does not support, and carry the degradation on screen.

## Tier 1 — blockers hit by all three

1. **The install line fails from the directory it ships in.** B F-1, M F-1, D F-1.
   `cp -R "content engine" ~/.claude/skills/content-engine` from inside the folder ->
   `cp: content engine: No such file or directory`. No `cd`, no canonical folder
   name, and README calls it "the whole install" so there is no fallback.
2. **`/content-engine setup` does not exist after the copy.** M F-2 (had to ask a
   human), D F-2 (confirmed skills enumerate at session start; 100% of first-time
   installers), B (read SKILL.md in place instead). No restart line anywhere.
3. **README never names SKILL.md.** B F-1, M F-3, D F-3. All three guessed their way
   in. README's "Spec" section names the 169KB PRD and the 117KB VISUALS and skips
   the one file needed, so the obvious wrong guess is a six-figure spec.
4. **SKILL.md says `reference/design-tells.md` "is not built"; it is 780 lines on
   disk.** B F-4, M F-4, D F-16. D notes SKILL.md's own rule would have made him stop:
   "If the workflow file a run needs is not in the repo, say which file is missing and stop."
5. **`gate --report` returns `action: redraft` with `over_cap: false`** and SKILL.md
   has no branch for that state. B F-14, M F-16, D F-13. Four returned fields
   (`action`, `rewrites_required`, `over_cap`, `redraft_constraints`) appear nowhere
   in SKILL.md. All three had to pick between the doc and the engine.

## Tier 2 — blockers, two personas

6. **gate-calibration.md is silently inert.** M F-19, D F-28. It is the one profile
   file with no `_template` copy, by design, so there is no shape to copy. M wrote
   it per §0.3 and got `measured_at: null, baselines: {}` back. D guessed unfenced +
   `---` front matter on the second try and it parsed. The repo already knows this
   failure mode by name in voice.md ("filling in the fence looks right and leaves you
   with an empty corpus") and the two conventions are opposite. §0.3 is sold as
   "the moment the engine visibly becomes theirs."
7. **The four "frozen forever" values are the four nothing computes.** M F-7, D F-6.
   `avg_sentence_length`, `sentence_length_stdev`, `contraction_rate`, `uses_fragments`
   all return null in `baseline`; two of them exist under `calibration.baselines`;
   two are computed nowhere. voice.md says drift detection depends on them. D's chain:
   nulls -> `baseline_source: "none"` -> absolute floors -> personalisation inert on a
   fresh install with samples on file and a calibration written.
8. **The negative control's suppression theory is backwards.** M F-10 (4/4 posts hit
   `no-long-sentence`), D F-7 (21 rows over 4 posts; `we-with-no-human` redraft on 6/8,
   `specifics-floor` redraft on 3/8, `no-long-sentence` 8/8). §0.3's rationale is "a
   redraft or a flag edits no word the person wrote, so there is nothing to suppress."
   A rewrite changes a phrase; **a redraft discards the entire draft.** So the rules
   that fire on three quarters of a person's archive are exactly the rules §0.3
   forbids ever switching off.
9. **`nda-default` is a trapdoor.** M F-11, D F-10. Capture-time default is
   `do-not-publish`; `do-not-publish` "retires to inventory-archive.md immediately";
   that file is never loaded at draft time. Inventory stays empty, floor never reached,
   resume loops forever. Both a hospital director and a SaaS engineer gave that answer
   honestly — it is the common answer, and it breaks the inventory.
10. **The language gate grades visual specs as short-post prose.** B F-19, D F-23.
    Two format modes (short, `--long`) for four formats. It fails an infographic for
    "no sentence over 25 words" and wants contractions in chip labels; D's run flagged
    the render spec's own mandatory keys (`items:`, `title:`) as `rhetorical-fragment`
    and `title-case-header`, and ai-tells.md's prescribed repairs make the spec
    unparseable. `gate_passes: false` + "Never show the post before gate-report.md
    exists" leaves no legal move.
11. **Article refused on run one; README advertises it flat.** B F-24, D F-25. B escaped
    by hand-writing nine fictional shipped briefs — violating SKILL.md §4 ("Nothing
    fictional is ever written into the repo") because the product left no honest path.
12. **`inspiration.md` has no "none on file" terminal state.** B F-10, M F-14. voice.md
    has that escape hatch; inspiration.md does not, and resume step 5 treats empty as
    unfinished. B had zero samples AND zero creators — no branch anywhere for both.
    M dug newsletters out of email to escape a loop.

## Tier 3 — blockers, one persona, structurally severe

13. **Carousel PDF loses its last slide. Exit 0.** B F-30. 9 slides specified, `file`
    reports 8 pages, footers read `0N / 09`, progress bar shows 8 of 9 filled. The lost
    slide is the `cta`/takeaway — the one slide carousel.md writes a rule about.
    Root cause is NOT the CSS: `themes/_base.css:35` sets `page-break-after:always` on
    `.slide` and `:38` correctly resets it on `:last-child`. Either slide 9 is never
    emitted (loop at render.py:604) or `.slide:last-child` does not match because
    something follows it in the DOM. Confirm by rendering `--html` and counting `.slide`.
14. **The article run destroys the article.** B F-27, B F-31. article.md forbids a second
    run directory and names `draft.md` as the carousel's source; carousel.md step 4
    writes slide copy to `draft.md`. Confirmed live — the 5b reader caught it mid-read:
    "draft.md changed on disk while I was reading it." **The article was never graded.**
15. **VISUALS §3.5 field names are not the renderer's.** D F-22. The workflow calls §3
    "the authority" in bold. 4 of 6 names wrong (`headline_naive` vs `naive_headline`,
    `real_items` vs `items`, `real_punchline` vs `punchline`) and a fifth field the
    renderer requires, `naive_statement`, is absent from the authoritative list entirely.
    Truth found in `render/infographic/examples/perception-split.md`, which no doc named.
16. **`specifics-floor` counts digits, not specifics.** D F-29. "Twenty past midnight,
    eleven people on the call, three years, nine days later, five contributing factors"
    -> `specifics: 0`, redraft class. The forced fix is worse prose, and the 5b reader
    told him so ten minutes later. Two graders in the same pipeline pulling opposite
    ways, and only one can discard the draft.
17. **`we-with-no-human` is a catch-22.** D F-12. Demands a named human; `nda-default`
    plus "never invent a fact" forbid producing one; `proper_nouns: 0` measured. He
    changed "We put a 99.9% SLO" to "I put" — the gate made the post less true. Redraft
    class, so §0.3 forbids suppressing it. Fired on 6 of 8 sample reads.
18. **The article is unreachable at the inventory size setup targets.** D F-27. Reaching
    N=8 consumes 8 anchors; each locks for 10 pieces; Session A produces 8 items. At the
    moment the cap clears, `unlocked_count: 0`. Cap and anchor lock never check each other.
19. **Zero-archive resume deadlock.** B F-5. §0.2 says skip §0.3; resume item 2 fires
    forever because gate-calibration.md can never be written. Item 1 has an escape
    clause; item 2 has none. The one user the doc wrote a branch for is the one the
    resume path cannot pass.
20. **§B.3 "run the gate over it" has no mechanism.** M F-13. The engine's own output
    says "The inspiration corpus is not here." No flag takes arbitrary text. This is
    half of the negative control the whole front door is built around.
21. **`engine.js` has no `--help`.** M F-12. Usage says "see the header" of a 2,831-line
    file. `gate --help` ignores the flag and runs the fixture suite. Every workflow tells
    her to run this command; she cannot discover a flag without reading code. She stopped
    at the door and never learned what `overlap`, `lexical`, `stats`, `test` do.
22. **Double-counted archive.** D F-5. §0.2 sends LinkedIn posts to both voice.md and
    shipped-history.md; the gate reads both. 4 posts measured as `samples: 8`, and §0.3
    freezes that number. "For a thin archive that is the difference between 'we read
    enough to tune this' and 'we read four sentences.'"

## Tier 4 — friction worth fixing

23. `reference/pipeline/` does not exist (B F-3, M F-3).
24. reader.md stale about audience.md's two vocabulary fields, which do exist (B F-15, D F-18).
25. `paragraph_lines` counts source newlines, so `uniform-paragraphs` is blind on any
    unwrapped Markdown (M F-18, D F-15) — and short-post.md's claim that the gate catches
    it is simply wrong; ai-tells.md's two-line floor is deliberate.
26. Two `baseline` blocks and §0.3 names the singular one; which to freeze is undecidable
    (M F-8, D F-8). M threw away two measured numbers; D wrote four nulls.
27. `contraction_rate: 2.84` has no unit (M F-9, D F-6). Percentage, per-100-words, or count.
28. `no-long-sentence` is named backwards — it requires a long sentence (D F-14). 8/8 on his archive.
29. `punctuation-density` redraft for too FEW commas (B F-13, D F-30). "Add commas" is the
    one edit that makes prose read more generated, not less.
30. Renderer ships `_template` defaults with no warning (B F-21). Exit 0, default blue
    #2F5BEA, Georgia serif, signed with her name. The one failure infographic.md calls
    out in bold has no check behind it.
31. Thumbnail warning's documented fix is inert (B F-23). Type sizes are fixed by the
    archetype template, so "shorten the headline so it can be set larger" describes
    behaviour the renderer lacks. Fires forever, unclearable from the only surface the
    user may edit.
32. Theme bootstrap contradictions (B F-17, B F-29, D F-17). setup.md promises "pulls a
    palette, shows two rendered frames" and "not asked at setup, in any sitting";
    infographic.md asks nine keys including `rule_weight` and `scale`. She invented her
    brand hexes — violating "never invent a fact." carousel.md says theme.json does not
    exist on a first visual run; setup copies the template, so it does. One image needs
    seven files, two of them six-figure byte counts.
33. `locks` returns `rotation_healthy: false` and no floor (D F-19). The number 11 appears
    only in a historical note inside interview.md's dead stop-condition block, citing
    engine.js:66. Also does not return the article cap count it is said to already read (D F-26).
34. Three different inventory floors in three files: 2, 8, 11 (B F-9). She picked 11 by
    guessing which file was newest.
35. Interview captures ~1,400 verbatim words and the voice system is forbidden to read
    them (B F-11). The philosophy block says unedited writing is worth more; a spoken
    answer is less edited than a Slack message, and it is discarded.
36. `type: gap` rows offered as anchors and counted as runway (M F-20). They are records
    of things she could not answer.
37. Dangling `connects_to:` thesis id passes silently (M F-21).
38. `minutes_to_ship` is unmeasurable on a resumed run (D F-21). No `started_at:` in brief.md.
39. L4 on run one with a two-line context block and 4 of 6 audience fields empty (D F-20).
    No confidence caveat in the report.
40. short-post.md rule 2 creates the defect the reader marks down (B F-18). Quote the
    anchor's words so the gate cannot edit them -> reader flags "quotation marks with
    nobody attached," twice, in both post and article. For a zero-archive user all
    verbatim material is her own speech and there is no note for that case.
41. Article requires an outside-world anchor with no verification path (B F-26). The
    interview never collects outside-world facts; the only permitted source is memory.
    Wells Fargo / 2016 / $185M went into paragraph three over her name.
42. `--check` warns at 8 words for a rule the spec sets at 8 (B F-32). Checker governs, spec does not.
43. Output filename disagreement: `final.pdf` / `deck.pdf` / "the PNG beside it" across
    article.md, carousel.md, SKILL.md (B F-28).
44. §0.3's "show them this" block is a worked example with real rule names, presented as
    literal output (D F-9). A literalist prints a false claim about two rules that never fired.
45. Sibling-notice condition fires on a solo install (B F-33): `profiles/` holds `_template`
    plus the handle, so "more than one directory" is always true. And the runway line —
    the most useful number for a cold-start user — prints nowhere unless asked.
46. Homework lookup has no mechanism (B F-8), and interview.md rule 9 forbids the silence
    it produced. Tier 0 scan is named once, in a template file, undefined, and writes to
    the profile on every default run (B F-16).
47. Refusal message has an unfillable `<slug>` slot on the only path that triggers it (B F-25).
48. Interview session numbering: "Session 1/2" vs "0/A/B" (M F-5). README spends two of
    eight paragraphs on changelog addressed to maintainers (B F-2).

## (a) Every place a persona had to leave the docs

- **M F-2 — asked a human.** Her teammate told her SKILL.md is what the slash command runs.
- **M F-3 — guessed SKILL.md** by elimination among six-figure specs.
- **M F-12 — ran `engine.js` bare and with `--help`,** got "see the header," and stopped.
  Declined to open engine.js:66 as interview.md directs (M F-9). Both became blockers
  *because* she would not read code.
- **M F-13 — hunted for a gate flag** for inspiration text; none exists.
- **D F-22 — `render/infographic/examples/perception-split.md`,** the only place the real
  field names live. No doc named it.
- **D F-23 — `reference/engine.js` lines 18-30,** to learn there is no visual format mode.
- **B F-17 — `render/infographic/reference/themes.md`** (named by infographic.md, but only
  to discover what the nine keys were).

**The asymmetry that matters: Dev's docs-leaves ended in answers. Marisol's ended in walls.**
Same defects, opposite outcomes, decided purely by willingness to open a source file. A
non-technical reader is Marisol-shaped.

## (b) What the cold start did to Beatriz

The engine handled it honestly on disk and never once on screen.

Correct: §0.2 has a real, well-written branch for her ("Do not refuse to draft"), the
negative control reported `corpus: "empty, no pasted sample on file"`, `samples: 0`, every
baseline null, and an explicit note that an absent calibration is "not a clean pass, and
not a suppression of anything." **No number was invented anywhere.**

Broken: the warning that exists lives in `_template/voice.md`, lands in
`runs/<slug>/gate-report.md`, and SKILL.md prints one line, not the file — and prints
nothing at all on a clean pass. **The cleaner her draft, the more certain she is to be
told nothing.** Setup's close then asserts "the gate is tuned to your writing,"
unconditionally, with no branch for the path she was just routed down. With no baseline
the gate applied absolute floors and pushed her toward more contractions and more
punctuation — the exact failure voice.md's second paragraph warns about — and called it
a pass. The documented fallback, inspiration.md, was empty for the identical reason her
archive was: she has never posted on LinkedIn because she does not read LinkedIn.

Her summary: **"the product had 1,400 words of me and told itself it had zero."**

Her one ask: print the uncalibrated-voice line on screen, every run. It is already written,
verbatim, in `profiles/_template/voice.md`.

## (c) Artifacts nobody would publish

Only Beatriz reached artifact evaluation; Marisol and Dev hit the spend limit first, so
this section is one persona deep and should not be read as consensus.

- **Short post — would publish, unedited.** "The best thing anyone has ever handed me with
  my name on it." Worst line "Budget gets decided in August" — the only invented
  generalisation in it, produced because the engine needed a bridge and had no inventory
  row to build one from.
- **Article — would publish after cutting one paragraph.** The Wells Fargo paragraph, which
  is unverifiable by construction.
- **Infographic — would NOT publish.** Words good, layout not: `scale: dense` reached the
  HTML (`--space:0.72`) but a third of the canvas is empty, four nodes stretched across
  2700px with three enormous gaps, so the arrow reads as distance rather than causation —
  defeating the one thing causal-chain exists to assert. No knob in the spec reaches it.
- **Carousel — CANNOT publish.** The file is broken (Tier 3 #13). She rated the typography
  and palette better than two years of her marketing team's output, and the copy closest to
  her register of the four.

## Cheapest high-value fixes

Roughly in order of severity-per-line-changed:

1. **Three sentences in README** — where to stand, restart after the copy, and "SKILL.md is
   the router if the slash command isn't there." Kills Tier 1 #1, #2, #3: nine
   persona-hits, all blocker, and it is the first thirty seconds of the mentor's experience.
2. **One filename** — give the article its own draft file so the carousel stops overwriting
   it. Kills Tier 3 #14, two blockers, and restores article grading.
3. **Delete one stale sentence** in SKILL.md about design-tells.md, and the
   `reference/pipeline/` line. Tier 1 #4 and Tier 4 #23, 3/3 and 2/3.
4. **Ship `profiles/_template/gate-calibration.md`.** Kills Tier 2 #6 outright — two
   blockers where the calibration silently did nothing and `file: "found"` read as success.
5. **Name the JSON path** `calibration.baselines` in §0.3. One word, kills Tier 4 #26.
6. **One clause in README's command list** — "article unlocks after 8 shipped short posts."
   Tier 2 #11.
7. **Two fields in `locks` output** — `rotation_floor` and the per-format shipped count.
   Tier 4 #33.
8. **Rename `no-long-sentence`** to `needs-long-sentence`. One string, Tier 4 #28.
9. **Add `--help` to engine.js.** Tier 3 #21 — a blocker for exactly the persona the mentor
   resembles.
10. **Print the uncalibrated-voice line on screen when voice.md holds zero pasted samples.**
    The sentence already exists in the template. This is Beatriz's single ask and the one
    thing she said would have made her forgive the rest of the report.

Not cheap, and each needs a decision rather than an edit: the visual format mode for the
gate (#10), §0.3's redraft-suppression theory (#8), `specifics-floor`'s digit counting
(#16), the four never-computed baselines (#7), the nda-default trapdoor (#9), the article
eligibility arithmetic (#18), and the carousel page loss (#13, a real renderer bug).

## What this run did not test

Repeat use. Every persona was a first-timer, so staleness, learnings.md accumulation, and
the second-post experience are still unexercised. Marisol and Dev also never reached
artifact evaluation, so content quality is one persona deep.
