# Carousel Method: Content to Slides

Loaded on demand by the `carousel` skill. The job: turn a source (or a topic) into a deck that earns the swipe, holds attention slide to slide, and converts at the end. The enemy is paragraph-per-slide transcription.

## The arc

Every deck is one argument with a shape. Map the source onto it. Do not preserve the source's order or paragraph structure.

**Hook -> Tension -> Turn -> Payoff -> CTA**

| Beat | Job | Usual archetype | Slides |
|---|---|---|---|
| Hook | Stop the scroll. Promise a payoff. Earn the first swipe. | `cover` | 1 |
| Tension | Name the problem, the cost, the broken assumption. Make it ache. | `statement`, `stat` | 1-2 |
| Turn | The pivot. The reframe. The thing they did not see. | `statement`, `compare`, `before-after` | 2-3 |
| Payoff | The resolution. What is true now. The mechanism or proof. | `steps`, `compare`, `statement`, `stat` | 2-3 |
| CTA | Convert. One action. One follow. | `cta` | 1 |

7-10 slides total. Fewer than 7 reads thin for a document post; more than 10 loses the swipe. One idea per slide is the hard constraint. If a slide carries two ideas, split it or cut one.

## Two starting points

### A. Chunking long content (article, brief, transcript, post)

1. **Read for the spine, not the words.** What is the ONE claim? What is the reframe that makes it land? If you cannot state the takeaway in a sentence, the deck has no center yet. Find it before slicing.
2. **Pull the load-bearing beats.** Most long content has 5-9 real moves buried in connective prose. List them. Discard transitions, throat-clearing, caveats, and anything that is context rather than argument.
3. **Assign each beat to an arc position**, then to an archetype by its job (see heuristics below). A beat that is "X used to be true, now Y is" is `before-after`, not two `statement` slides.
4. **Compress each beat to slide copy.** This is the real work. A 90-word paragraph becomes a ≤7-word headline plus 2-3 ≤6-word bullets. The headline carries the claim; the bullets carry the evidence.
5. **Re-check the arc end to end.** Does slide 1 promise what slide 9 delivers? Cut anything that does not serve the spine.

A long source does NOT mean a long deck. A 2,000-word article is still 8 slides. Surplus content is the raw material you mine, not the deck.

### B. From a topic (from scratch)

1. **Force the takeaway first.** Write the single sentence the reader should screenshot. That sentence is your `cta` headline working backward.
2. **Find the tension.** What does the audience currently believe that is wrong, incomplete, or costing them? No tension, no swipe. If the topic has no friction, you do not have a carousel yet; you have a list.
3. **Build the turn.** What is the non-obvious reframe between the tension and the takeaway? This is the slide people remember.
4. **Outline the arc, then draft copy per slide.** Same compression discipline as chunking.
5. In `guided`, lock this outline with the user before writing prose. In `oneshot`, draft it, then verify.

## Archetype selection heuristics

Pick by the slide's JOB, not by what is visually convenient.

| The slide is... | Use |
|---|---|
| A claim or assertion | `statement` |
| Two things set against each other (flaw vs win, them vs us) | `compare` |
| A shift across time (old world -> new world) | `before-after` |
| An ordered process or loop | `steps` |
| One number that carries weight | `stat` |
| A flat list of peers (no hierarchy) | `bullets` |
| The opening | `cover` |
| The close | `cta` |

`statement` is the workhorse; reach for it when nothing more specific fits. Do not default to `bullets` for everything. Vary archetypes across the deck so the visual rhythm changes as the reader swipes. A deck of nine `statement` slides is monotonous even when the copy is good.

## Copy-tightening rules

On-slide copy is signage, not prose. Targets (the engine WARNs past these, does not block):

- **Headline ≤ ~7 words.** Cut articles, qualifiers, hedges. "APS vendors are caught in a trap they built themselves" (10) tightens to "APS vendors built **their own trap**" (5).
- **Body / lead ≤ 2 short lines.** One supporting sentence. If you need three, the slide has two ideas.
- **Bullet ≤ ~6 words.** A bullet is a label, not a sentence. The pattern "Short label. One clause of evidence." reads well and the reference deck uses it even though it trips the 6-word WARN; the visual unit is the label, the clause is the payoff.

Tightening moves:
- Delete every word the slide survives without.
- Convert sentences to fragments. Fragments are fine here.
- Front-load the noun and verb that carry meaning.
- Put the ONE word that matters in `**bold**` so it renders in the accent color. One accent phrase per headline, not three.
- Numbers as numerals, never spelled out, on `stat` slides.

**No em-dashes anywhere.** The validator errors on one. Replace with a period or comma.

## Hook patterns (slide 1)

The cover earns the swipe or the deck dies on slide 1. Strong hooks:

- **The trap / dilemma.** Name a bind the audience is in. "APS vendors built their own trap."
- **The buried cost.** Surface a price they are paying and cannot see. "Every planning cycle, your system forgets."
- **The false binary.** State the choice they think they have, to set up that it is wrong. (Then resolve it; do not leave it as a "not X, it's Y" frame on the slide.)
- **The number.** A `stat` cover when one figure is the whole story.
- **The contrarian claim.** Assert the thing the room disagrees with, then spend the deck earning it.

The hook must promise the payoff the CTA delivers. A hook that oversells what the deck pays off reads as bait. Audit slide 1 against slide N before you ship.

## CTA patterns (final slide)

The close converts attention into one action. Strong CTAs:

- **Single destination.** One link, one place to go. "See how it works -> daybreak.ai" via the `cta:` field.
- **The follow.** "Follow for more on AI labor" in the `footer` or `note` line, paired with the link.
- **The restated stakes.** Headline that re-lands the takeaway ("The operating model **has to change**"), with the link as the chip.
- **The question that books the call.** For sales-adjacent decks, a CTA that invites the reader to test the claim against their own situation.

One CTA. Not three competing asks. The `cta` archetype gives you a headline, optional points, an accent chip (`cta:` field), and a follow line (`note:` or `footer:`). Use the chip for the destination and a single supporting line, nothing more.

## Density and aspect as method levers

- `density: spartan` enlarges type and strips chrome. Use when the deck is a few punchy claims and you want each slide to hit hard. `comfortable` is the default and fits more supporting copy.
- `aspect: 1x1` tightens vertical rhythm. Trim body length further for square; the headline-plus-one-line discipline matters more when the canvas is shorter. `4x5` (default) gives the most vertical room.

These ride on top of any theme. Changing them is a front-matter edit and a re-render, not a rewrite. But if you go `spartan` or `1x1`, re-read the PDF: copy that fit `comfortable 4x5` may overflow.
