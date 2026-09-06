# Theme token contract, image-gen path

`profiles/<handle>/theme.json` is still the only source of brand values in the
system, exactly as PRD §10 freezes it. What changed is what reads it: there is
no stylesheet and no CSS custom property any more, so a key either becomes a
sentence in the prompt or it becomes nothing.

`prompt.js` reads the subset below. **No key was added to the schema and no key
was removed**, so no profile needs migrating.

## The nine keys

| Key | Becomes | Note |
| :- | :- | :- |
| `bg` | `Background #RRGGBB` | named as a literal hex in the prompt |
| `fg` | `Ink #RRGGBB for all primary text` | |
| `accent` | `Accent #RRGGBB, used on at most one object` | VISUALS §5.4's accent discipline, stated to the model rather than measured after |
| `muted` | `Muted #RRGGBB for secondary text and hairlines` | |
| `font_head` | one adjective: `serif`, `sans-serif` or `monospace` | a CSS stack has no meaning to an image model. `faceAdjective()` reads the whole stack, monospace first, because `sans-serif` contains `serif` |
| `font_body` | the same, one adjective | |
| `scale`, `radius`, `rule_weight` | **nothing** | CSS layout tokens: whitespace density, corner rounding, hairline thickness. There is no image-gen equivalent. Left in the schema, read by nothing, which is inert rather than breaking |

`--check` still requires all nine to be present. A hand-edited theme fails
loudly naming the key, the same as before, because a profile missing a colour is
a profile that has not been through the PRD §7a bootstrap.

## The two optional keys

| Key | Becomes |
| :- | :- |
| `logo` *(optional)* | one of the call's `input_references` images |
| `style_reference` *(optional, new)* | one of the call's `input_references` images |

**`style_reference` is the one new key.** A path to an example image inside the
profile directory: a past post, a page of a brand deck, anything the model
should match style to. It follows `logo`'s pattern exactly — optional, no
default, resolved relative to the profile directory, refused if it resolves
outside it, and a hard error naming the key if the path does not exist.

**Absent means no reference beyond the text description, and that is correct
rather than degraded**, the same way an absent `logo` has always meant a footer
with no mark.

Both are `input_references`, not instructions: the model is shown them and told
to match. Neither is composited onto the output, so a logo can come back drawn
rather than placed. That is what §5.2's visual check reads for.

## The three-image ceiling

A single call sends at most three references, chosen in this priority order:

1. **The slide's own photograph**, where an `image-bg` slide names one.
2. **The cover slide's output PNG**, on every carousel slide after the first.
   This is the deck's identity anchor: a concrete image beats repeating a text
   description of the palette on eight separate calls.
3. **`style_reference`, then `logo`.**

The model research found a ceiling around sixteen images, so three needs no
selection logic to stay under a cap. The priority order exists for the one case
that overflows: an `image-bg` slide past the cover, where the theme's own two
would make four. The photograph and the deck's identity win; the logo drops.

## Adding an archetype (engine surface)

1. Add its geometry sentence to `RECIPES` in `prompt.js`, under the right
   format. Say what the geometry *claims*, not only what it looks like.
2. Add its required fields to `REQUIRED`, and any count or character budget to
   `BUDGETS`.
3. If it needs a new list key, add it to `LIST_KEYS`. If it needs a new layout
   directive that must never print on the canvas, add it to `DIRECTIVE_KEYS`.
4. Document it in `reference/prompts-infographic.md` or
   `reference/prompts-carousel.md`.

`tests/test_prompt.js` fails if a recipe and a required-field entry disagree
about which archetypes exist, so steps 1 and 2 cannot drift apart silently.
