---
theme: ../../../profiles/_template/theme.json
aspect: 4x5
title: What a slide has to survive
footer: render/carousel
---

# A nine-slide fixture. Every line here is a claim this repo already makes,
# with its section named, so nothing on the canvas is invented. It is the
# spec tests/test_render_integration.py renders, and the spec to re-render
# after any change to a partial, _base.css or theme_css().

:: cover
eyebrow: The two-layer law
headline: Slide one has to survive **220 pixels.**
body: That is roughly the width a feed gives an image before anyone taps.
cue: Swipe

:: index
headline: What's inside
items:
- Where the feed stops reading
- What the numbers say
- The two layers, side by side
- What changes when you swipe
- How a deck gets built

:: statement
kicker: The measurement
headline: Body text **dies** at feed size.
body: Fourteen infographics were read at 220px wide. In all fourteen, the thing that died was the body copy.
items:
- Five read fully intact. Nine read partial.
- Zero failed outright.
- Every subtitle present became illegible.
note: VISUALS.md section 1 holds the teardown.

:: stat
kicker: The floor
stat: **40px**
caption: cap height, the smallest claim-carrying type at 1080px wide.
note: Interpolated, not measured. Tune it on the first ten renders.

:: compare
kicker: The two layers
headline: One canvas, **two documents.**
left: The feed layer
- Headline and structure
- Survives the thumbnail
- Carries the whole claim
right: The stop layer
- Body, labels, subtitle
- Invisible until the tap
- Carries scope and proof
note: If the claim needs the stop layer, the image works in a portfolio.

:: before-after
kicker: What selection changed
headline: The material picks **the form.**
left: Chosen by taste
- One topic supports several forms, and most of them lie about the material.
right: Chosen by shape
- The counts, sums and orderings decide, and a disqualifier is fatal.
note: VISUALS.md section 2 holds the procedure.

:: steps
kicker: The build
headline: Five moves, **in order.**
items:
- Write the claim | One sentence, before any form is considered
- Read the shape | Counts, sums, orderings, whether items are peers
- Discard on disqualifiers | Record which one, and why
- Rank the survivors | Fewest deficits first
- Draft, then show the runners-up | Never a draft with nothing beside it

:: bullets
kicker: Craft
headline: Three numbers worth keeping.
items:
- Headline: three to eight words.
- Hierarchy: 3x to 3.5x headline to body.
- Hues: three, unless hue encodes something.
note: Measured across the fourteen. VISUALS.md section 5.

:: cta
eyebrow: The takeaway
headline: Earn the second slide, **or end.**
items:
- The claim is complete in the headline and the structure.
- The subtitle carries the honesty, never the meaning.
note: Final slide is a takeaway, not a call to action. PRD section 10.3.
