---
theme: ../../../profiles/_template/theme.json
aspect: 4x5
title: Archetype showcase
footer: render/carousel
---

# The four archetypes nine-slide-deck.md does not reach: quote-spotlight,
# logo-wall, image-bg, and index at a shorter length. Between the two specs
# every one of the twelve partials renders. Labels in the logo-wall are the
# documentation-reserved names, per PRD section 1.2's gate-fixtures rule.

:: cover
eyebrow: Archetype showcase
headline: Twelve layouts, **one spec file.**
body: Each slide below is a different partial.
cue: Swipe

:: index
headline: What's inside
items:
- The quote that carries a slide
- The grid of names
- The image behind the words

:: quote-spotlight
kicker: The quote
quote: The material selects the form, **never the topic.**
attribution: content-engine-VISUALS.md, section 2

:: logo-wall
headline: The grid of names
items:
- Acme
- Contoso
- Northwind
- Fabrikam
- Adventure Works
- Tailspin Toys
note: Reserved documentation names. Nothing here is a real customer.

:: image-bg
eyebrow: The picture
image: assets/sample-bg.png
headline: One image, **one line over it.**
body: The scrim is a token, so the text reads on either treatment.
scrim: dark

:: cta
eyebrow: The takeaway
headline: The spec is the **source of truth.**
items:
- Re-skin by changing the theme path, not the copy.
- Re-shape by changing one front-matter line.
note: Never hand-edit the output. Fix the spec and render again.
