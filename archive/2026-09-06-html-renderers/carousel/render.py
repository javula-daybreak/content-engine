#!/usr/bin/env python3
"""Carousel render engine — spec (Markdown) -> themed HTML -> Chrome -> PDF.

Stdlib only, and nothing to install: it drives the headless Chrome already on
the machine. `themes/_base.css` owns structure and reads every colour, font,
radius and rule weight as a CSS custom property. Those properties come from
one profile's `theme.json` (PRD section 10's nine keys, plus `wordmark`),
turned into a `:root` block by theme_css(). The archetype partials in
`archetypes/*.html` own per-slide layout. No brand value lives in this
directory; every one of them lives in a profile.

Public surface: parse_spec, accent, counter, progress_bar, load_theme,
theme_css, render_slide, build_html, render_pdf, check_spec, main.
"""

import re
import os
import json
import html as _html
import argparse
import base64
import subprocess
import tempfile
import pathlib
import sys
import urllib.parse

HERE = pathlib.Path(__file__).resolve().parent
CHROME = os.environ.get(
    "CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")

# Keys whose `key: value` line OPENS a bullet list ( `- ` lines that follow ).
LIST_KEYS = {"items", "left", "right"}

# Per-archetype required fields, used by check_spec(). For archetypes whose
# requirement is "one of N" (e.g. stat needs stat OR headline), the entry uses
# a tuple member: a tuple means "at least one of these fields must be present".
REQUIRED = {
    "cover": ["headline"],
    "statement": ["headline"],
    "cta": ["headline"],
    "bullets": ["headline", "items"],
    "compare": ["headline", "left", "right"],
    "before-after": ["headline", "left", "right"],
    "steps": ["headline", "items"],
    "stat": [("stat", "headline"), "caption"],
    # v2 archetypes
    # VISUALS section 2.4 bans the quote card: a sentence in large type on a
    # colored rectangle, carrying nothing the post text does not. Requiring
    # attribution is what separates a sourced pull-quote from that, and it is
    # required here rather than asked for in prose, because "structurally
    # incapable" is the words section 2.4 uses. Added 2026-08-20.
    "quote-spotlight": ["quote", "attribution"],
    "image-bg": ["image"],
    "index": ["items"],
    "logo-wall": ["items"],
}
KNOWN_ARCHETYPES = set(REQUIRED)

# Extension -> MIME for the image-bg base64 embedder. Kept narrow on purpose:
# only the web-safe raster/vector formats Chrome will paint as a CSS background.
IMAGE_MIME = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
}


# --------------------------------------------------------------------------- #
# Theme — profiles/<handle>/theme.json -> CSS custom properties
# --------------------------------------------------------------------------- #
# THEME_KEYS is PRD section 10's frozen nine-key contract, and every one is
# required. `wordmark` is the one key this renderer would add: every slide's
# footer signs the deck, and VISUALS.md section 5.6 makes that signature the
# attribution posture. It is OPTIONAL rather than added, because a tenth key
# is a PRD amendment and not a renderer's to make. Absent, the footer shows
# the accent mark and no name, and a deck can still set `wordmark:` in its
# own front matter. Everything else the stylesheet reads is DERIVED below, so
# a profile never hand-tunes twenty tokens: secondary text, hairlines, the
# flaw-card surface, the dark cover field, the on-accent text colour, the
# footer mark and the image scrims all fall out of bg / fg / accent / muted.
THEME_KEYS = ("bg", "fg", "accent", "muted", "font_head", "font_body",
              "scale", "radius", "rule_weight")
OPTIONAL_KEYS = ("wordmark",)
COLOR_KEYS = ("bg", "fg", "accent", "muted")
# theme.json `scale` -> the deck density class. `airy` means fewer words at a
# larger size, which is what d-spartan renders; `dense` fits supporting copy,
# which is d-comfortable. The two vocabularies are not ours to rename.
SCALE_DENSITY = {"airy": "spartan", "dense": "comfortable"}

FACE_RE = re.compile(r"font-family:\s*['\"]([^'\"]+)['\"]")


def load_theme(path):
    """Read a profile's theme.json and return it as a validated dict."""
    path = pathlib.Path(path)
    try:
        theme = json.loads(path.read_text())
    except OSError as e:
        raise FileNotFoundError(f"theme: cannot read {path}") from e
    except ValueError as e:
        raise ValueError(f"theme: {path} is not valid JSON: {e}") from e
    missing = [k for k in THEME_KEYS if not str(theme.get(k, "")).strip()]
    if missing:
        raise ValueError(
            f"theme: {path} is missing {', '.join(missing)}. "
            f"Required keys: {', '.join(THEME_KEYS)}. "
            f"Optional: {', '.join(OPTIONAL_KEYS)}")
    for k in COLOR_KEYS:
        _rgb(theme[k], k, path)      # raises on anything but a hex colour
    return theme


def _rgb(value, key="color", path=""):
    """Parse `#RGB` / `#RRGGBB` into (r, g, b). Hex only, on purpose: the
    derivations below mix and measure colours, and a named colour or an
    `rgb()` string cannot be measured without a full CSS colour parser."""
    s = str(value).strip()
    m = re.fullmatch(r"#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})", s)
    if not m:
        where = f" in {path}" if path else ""
        raise ValueError(f"theme: {key} must be a hex colour like #1A2B3C, "
                         f"got {value!r}{where}")
    h = m.group(1)
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _hex(rgb):
    return "#%02X%02X%02X" % rgb


def _mix(a, b, t):
    """Blend hex `a` into hex `b`. t=1 is all a, t=0 is all b."""
    return _hex(tuple(round(x * t + y * (1 - t))
                      for x, y in zip(_rgb(a), _rgb(b))))


def _rgba(color, alpha):
    r, g, b = _rgb(color)
    return f"rgba({r},{g},{b},{alpha})"


def _lum(color):
    """WCAG relative luminance, 0 (black) to 1 (white)."""
    def ch(v):
        v /= 255.0
        return v / 12.92 if v <= 0.03928 else ((v + 0.055) / 1.055) ** 2.4
    r, g, b = (ch(x) for x in _rgb(color))
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _mark_uri(accent):
    """The footer mark: one filled disc in the profile's accent. A real logo
    would be an eleventh theme.json key plus a file to ship; a disc in the
    person's own accent is honest, costs nothing, and reads on both fields."""
    svg = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>"
           f"<circle cx='50' cy='50' r='50' fill='{accent}'/></svg>")
    return 'url("data:image/svg+xml,%s")' % urllib.parse.quote(svg, safe="")


def _font_faces(theme, fonts_dir=None):
    """Inline every fonts/*.css whose @font-face family the theme names.

    Chrome's --print-to-pdf does not reliably block on an @import before
    paint, so the face has to be in the document. A theme naming only system
    families inlines nothing, and nothing is ever fetched or installed."""
    d = pathlib.Path(fonts_dir) if fonts_dir else HERE / "fonts"
    if not d.is_dir():
        return ""
    want = (theme.get("font_head", "") + " " +
            theme.get("font_body", "")).lower()
    out = []
    for f in sorted(d.glob("*.css")):
        css = f.read_text()
        m = FACE_RE.search(css)
        if m and m.group(1).lower() in want:
            out.append(css.strip())
    return ("\n".join(out) + "\n") if out else ""


def theme_css(theme, fonts_dir=None):
    """Turn a theme dict into the `:root` token block _base.css consumes."""
    bg, ink = theme["bg"], theme["fg"]
    accent, muted = theme["accent"], theme["muted"]
    light = _lum(bg) >= 0.5
    # The dark cover/cta field is the theme's own dark end, so a profile gets
    # one palette rather than a second hidden one.
    hero, on_dark = (ink, bg) if light else (bg, ink)
    dark_end, light_end = (ink, bg) if light else (bg, ink)
    # Accent as TEXT on the page: deepen it on a light ground, lift it on a
    # dark one. Accent as a FILL: the text on it is whichever end of the
    # palette the accent sits furthest from.
    accent_text = (_mix(accent, "#000000", 0.82) if light
                   else _mix(accent, "#FFFFFF", 0.70))
    on_accent = dark_end if _lum(accent) > 0.45 else light_end
    tokens = {
        "bg": bg, "ink": ink, "accent": accent, "muted": muted,
        "ink-soft": _mix(ink, bg, 0.78),
        "line": _mix(ink, bg, 0.12),
        "surface-2": _mix(ink, bg, 0.06),
        "seg-off": _mix(ink, bg, 0.18),
        "accent-deep": accent_text,
        "accent-light": _mix(accent, on_dark, 0.55),
        "hero-bg": hero,
        "on-dark": on_dark,
        "on-accent": on_accent,
        "on-accent-soft": _mix(on_accent, accent, 0.72),
        "on-accent-strong": on_accent,
        "note": _mix(on_dark, hero, 0.70),
        # Three surfaces for the dark cover/cta field, translucent so the
        # glow reads through them.
        "seg-off-dark": _rgba(on_dark, .2),
        "line-dark": _rgba(on_dark, .18),
        "surface-dark": _rgba(on_dark, .08),
        "font": theme["font_body"],
        "font-head": theme["font_head"],
        "radius": theme["radius"],
        "rule-weight": theme["rule_weight"],
        # Both quote characters go: build_html reads this token back with a
        # quote-delimited regex, and an embedded quote would truncate it.
        "wordmark": "'%s'" % re.sub(
            r"['\"]", "", str(theme.get("wordmark", ""))),
        "mark": _mark_uri(accent),
        "hero-glow": (f"radial-gradient(135% 95% at 50% 122%, "
                      f"{_rgba(accent, .5)}, {_rgba(accent, 0)} 56%)"),
        "scrim-dark": (f"linear-gradient({_rgba(hero, .5)}, "
                       f"{_rgba(hero, .5)}), linear-gradient(180deg, "
                       f"{_rgba(hero, 0)} 25%, {_rgba(hero, .88)} 100%)"),
        "scrim-light": (f"linear-gradient({_rgba(light_end, .5)}, "
                        f"{_rgba(light_end, .5)}), linear-gradient(180deg, "
                        f"{_rgba(light_end, 0)} 25%, "
                        f"{_rgba(light_end, .92)} 100%)"),
    }
    block = "\n".join(f"  --{k}:{v};" for k, v in tokens.items())
    return _font_faces(theme, fonts_dir) + ":root{\n" + block + "\n}\n"


# --------------------------------------------------------------------------- #
# Phase 2 — spec parser
# --------------------------------------------------------------------------- #
def parse_spec(text):
    """Parse spec text into (meta: dict, slides: list[dict]).

    Front-matter is `--- ... ---` of `key: value` lines. Slide blocks open
    with `:: <archetype>`. Inside a block, `key: value` sets a scalar; a key
    in LIST_KEYS opens a bullet list collected from following `- ` lines.
    `left:`/`right:` also record `<side>_title` and collect into
    `<side>_items`; a bare `items:` list collects into `items`.
    """
    text = text.replace("\r\n", "\n")
    meta = {}
    body = text
    # Trailing newline after the closing fence is optional, so a spec that is
    # ONLY front-matter (no final newline) still parses. group(2) is None when
    # nothing follows the fence; coalesce to "".
    m = re.match(r"^---\n(.*?)\n---(?:\n(.*))?$", text, re.S)
    if m:
        for line in m.group(1).split("\n"):
            if ":" in line and not line.strip().startswith("#"):
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        body = m.group(2) or ""

    slides, cur, cur_list = [], None, None
    for raw in body.split("\n"):
        line = raw.rstrip()
        if line.startswith(":: "):
            cur = {"archetype": line[3:].strip(), "items": [],
                   "left_items": [], "right_items": []}
            slides.append(cur)
            cur_list = None
            continue
        if cur is None:
            continue
        if line.strip().startswith("#"):
            # Comment line inside a slide block: skip (front-matter already
            # skips these; without this a `# note: x` becomes a junk key).
            continue
        if line.strip().startswith("- "):
            target = {"items": "items", "left": "left_items",
                      "right": "right_items"}.get(cur_list, "items")
            cur[target].append(line.strip()[2:].strip())
            continue
        if ":" in line:
            k, v = line.split(":", 1)
            k, v = k.strip(), v.strip()
            if k in LIST_KEYS:
                cur_list = k
                if k in ("left", "right"):
                    cur[k + "_title"] = v
                elif v:
                    cur["items"].append(v)
            else:
                cur[k] = v
                cur_list = None
    return meta, slides


# --------------------------------------------------------------------------- #
# Phase 3 — HTML transforms / atoms
# --------------------------------------------------------------------------- #
def accent(s):
    """Escape text, then convert **bold** spans into the brand accent span."""
    s = _html.escape(s, quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r'<span class="g">\1</span>', s)


def esc(s):
    """Plain HTML escape (no accent conversion)."""
    return _html.escape(s, quote=False)


def counter(step, total):
    """Zero-padded slide counter, e.g. '03 / 09'."""
    return f"{step:02d} / {total:02d}"


def progress_bar(step, total):
    """Segmented progress bar: first `step` of `total` segments filled."""
    segs = "".join(
        '<i class="seg on"></i>' if i < step else '<i class="seg"></i>'
        for i in range(total))
    return f'<div class="bar">{segs}</div>'


def bullets_html(items, cls="bul"):
    """Render a bullet list. Item text runs through accent() so **x** works.
    Returns '' for an empty list so the slot collapses cleanly.
    """
    if not items:
        return ""
    lis = "".join(f"<li>{accent(it)}</li>" for it in items)
    return f'<ul class="{cls} gap-l">{lis}</ul>'


def card_items_html(items):
    """Render the inner `<li>`s for a compare card (no outer `<ul>`; the
    partial owns it). Plain `.card li` styling — NOT the `.bul` dot list.
    Item text runs through accent() so **x** works. Empty -> ''."""
    return "".join(f"<li>{accent(it)}</li>" for it in items)


def steps_html(items):
    """Render numbered `.step` rows from `items`. Each item is `Label | Detail`;
    an explicit pipe separates the bold label (`.k`) from the detail line (`.s`).
    An item with no pipe renders as a label-only step. The explicit delimiter
    (not '. ' sniffing) keeps abbreviations like 'vs.' or 'e.g.' intact. The
    `.k` is heavy-weight via CSS, so the label reads bold without inline <b>."""
    rows = []
    for i, raw in enumerate(items, 1):
        head, _, tail = raw.partition("|")
        k = accent(head.strip())
        s = (f'<div class="s">{accent(tail.strip())}</div>'
             if tail.strip() else "")
        rows.append(
            f'<div class="step"><div class="n">{i}</div>'
            f'<div><div class="k">{k}</div>{s}</div></div>')
    return "".join(rows)


def resolve_image_path(raw, base_dir=None):
    """Resolve an image-bg `image:` value to an absolute Path.

    Accepts: absolute paths, `~`-relative paths, and paths relative to the
    SPEC file's directory (`base_dir`). When base_dir is None (e.g. a unit
    test calling render_slide directly), a relative path resolves against the
    current working directory. Does NOT check existence; image_data_uri does."""
    p = pathlib.Path(raw).expanduser()
    if not p.is_absolute():
        root = pathlib.Path(base_dir) if base_dir else pathlib.Path.cwd()
        p = (root / p)
    return p


def image_data_uri(raw, base_dir=None):
    """Read a local image, base64-encode it, and return a `data:` URI.

    MIME is inferred from the file extension (see IMAGE_MIME). Embedding (the
    same principle as the base64-embedded fonts) keeps the rendered PDF
    self-contained. Raises a CLEAR error naming the path when the file is
    missing, and a ValueError for an unsupported extension."""
    p = resolve_image_path(raw, base_dir)
    ext = p.suffix.lower()
    mime = IMAGE_MIME.get(ext)
    if mime is None:
        raise ValueError(
            f"image-bg: unsupported image extension '{ext}' for {p} "
            f"(supported: {', '.join(sorted(IMAGE_MIME))})")
    try:
        data = p.read_bytes()
    except OSError as e:
        raise FileNotFoundError(
            f"image-bg: image file not found or unreadable: {p}") from e
    b64 = base64.b64encode(data).decode("ascii")
    return f"data:{mime};base64,{b64}"


def index_html(items):
    """Render the `index` (agenda) numbered list: a two-digit accent number
    (01, 02, ...) + the section title per row. Title text runs through accent()
    so **x** works. Empty -> ''. The outer <ol> + column class is owned by the
    partial; this emits the <li> rows only."""
    rows = []
    for i, raw in enumerate(items, 1):
        rows.append(
            f'<li class="ix"><span class="ix-n">{i:02d}</span>'
            f'<span class="ix-t">{accent(raw)}</span></li>')
    return "".join(rows)


def logo_cells_html(items):
    """Render the `logo-wall` grid cells: one bordered/tinted card per label.
    Text labels only (image logos are a future extension that will reuse the
    image-bg embedder). Label text runs through accent() so **x** works.
    Empty -> ''. The outer grid + column class is owned by the partial."""
    return "".join(
        f'<div class="logo-cell">{accent(it)}</div>' for it in items)


# --------------------------------------------------------------------------- #
# Phase 4 — assembly (partials + theme + base -> one HTML doc)
# --------------------------------------------------------------------------- #
def _load_partial(archetype):
    """Read an archetype partial relative to this file."""
    return (HERE / "archetypes" / f"{archetype}.html").read_text()


def render_slide(slide, step, total, meta, base_dir=None):
    """Fill an archetype partial for one slide.

    Headlines run through accent() (escape + **bold**). Body/lead text and
    bullet items are escaped. Optional slots resolve to '' so the markup
    collapses cleanly. `bg` toggles the dark treatment: cover/cta default dark,
    statement defaults light, and a per-slide `bg: dark|light` overrides.

    `base_dir` is the spec file's directory, used to resolve an `image-bg`
    archetype's relative `image:` path. None (a direct unit-test call) resolves
    relative image paths against the current working directory.
    """
    arch = slide["archetype"]
    partial = _load_partial(arch)

    # dark/light: archetype default, overridable per-slide via bg:
    default_dark = arch in ("cover", "cta")
    bg = slide.get("bg", "").strip().lower()
    if bg == "dark":
        is_dark = True
    elif bg == "light":
        is_dark = False
    else:
        is_dark = default_dark
    bg_class = " dark" if is_dark else ""

    # Both default to empty. The wordmark is filled from the theme's
    # --wordmark token in build_html(); the footer tagline is per-deck copy
    # the spec front-matter supplies, and an unset one collapses cleanly.
    footer = slide.get("footer", meta.get("footer", ""))
    wordmark = slide.get("wordmark", meta.get("wordmark", ""))
    eyebrow = slide.get("eyebrow", "")
    kicker = slide.get("kicker", "")
    cue = slide.get("cue", "Swipe")

    # compare / before-after: two titled columns. Titles default per archetype
    # (compare keeps whatever the spec gave; before-after defaults Before/After).
    left_items = slide.get("left_items", [])
    right_items = slide.get("right_items", [])
    ba_default = arch == "before-after"
    left_title = slide.get("left_title", "") or ("Before" if ba_default else "")
    right_title = slide.get("right_title", "") or ("After" if ba_default else "")

    # Top-left label: cover/cta use .eyebrow styling, body slides use .kicker.
    if arch in ("cover", "cta"):
        label = eyebrow or kicker
    else:
        label = kicker or eyebrow

    # Deck-wide eyebrows toggle. `eyebrows: false` (or no/off/0, case-insensitive)
    # hides the top-left kicker/eyebrow on EVERY archetype. The partials render
    # the visible label via {eyebrow}/{kicker} (not {label}), so all three label
    # fields must be blanked for the toggle to take effect. Missing => on.
    if str(meta.get("eyebrows", "")).strip().lower() in ("false", "no", "off", "0"):
        label = eyebrow = kicker = ""

    # image-bg: embed the local image as a data-URI background and pick a scrim.
    # The scrim class (scrim-dark|scrim-light|scrim-none) is added to the .slide
    # so _base.css can both paint the gradient overlay AND set text color (white
    # on a dark scrim, ink on a light one) without hard-coded colors.
    img_bg_style = ""
    scrim_class = ""
    if arch == "image-bg":
        uri = image_data_uri(slide.get("image", ""), base_dir)
        img_bg_style = (f' style="background-image:url(&quot;{uri}&quot;);"')
        scrim = slide.get("scrim", "").strip().lower() or "dark"
        if scrim not in ("dark", "light", "none"):
            scrim = "dark"
        scrim_class = f" scrim-{scrim}"

    # index / logo-wall: a 2-column class when the list is long enough. CSS can
    # not count items, so the column decision is made here from len(items).
    items = slide.get("items", [])
    index_cols = " cols-2" if len(items) > 6 else ""
    logo_cols = " cols-3" if len(items) > 4 else " cols-2"

    fields = {
        "step": step,
        "bg": bg_class,
        "label": esc(label),
        "eyebrow": esc(eyebrow),
        "kicker": esc(kicker),
        "headline": accent(slide.get("headline", "")),
        "body": esc(slide.get("body", "")),
        "note": esc(slide.get("note", "")),
        "cta": esc(slide.get("cta", "")),
        "cue": esc(cue),
        "wordmark": esc(wordmark),
        "footer": esc(footer),
        "idx": counter(step, total),
        "items_html": bullets_html(slide.get("items", [])),
        "progress": progress_bar(step, total),
        # compare: titled cards with plain `.card li` lists.
        "left_title": esc(left_title),
        "right_title": esc(right_title),
        "left_items_html": card_items_html(left_items),
        "right_items_html": card_items_html(right_items),
        # before-after: one paragraph per column (items joined; usually 1 line).
        "before_html": accent(" ".join(left_items)),
        "after_html": accent(" ".join(right_items)),
        # steps: numbered .step rows from `items`.
        "steps_html": steps_html(slide.get("items", [])),
        # stat: the giant number (falls back to headline if `stat:` absent).
        "stat": accent(slide.get("stat", "") or slide.get("headline", "")),
        "caption": esc(slide.get("caption", "")),
        # quote-spotlight: the oversized pull-quote (accent -> **bold** works)
        # and its attribution line.
        "quote": accent(slide.get("quote", "")),
        "attribution": esc(slide.get("attribution", "")),
        # image-bg: the data-URI background style + scrim class on the slide.
        "img_bg_style": img_bg_style,
        "scrim": scrim_class,
        # index: auto-numbered agenda rows, with a 2-col class when long.
        "index_html": index_html(items),
        "index_cols": index_cols,
        # logo-wall: bordered label cells, in a 2- or 3-col grid by count.
        "logo_cells_html": logo_cells_html(items),
        "logo_cols": logo_cols,
    }

    # Optional lead paragraph: only emit when body text exists.
    lead_p = (f'<p class="lead gap-m">{esc(slide.get("body", ""))}</p>'
              if slide.get("body", "").strip() else "")
    fields["lead_html"] = lead_p

    # Optional note paragraph. The NEW body archetypes (compare/before-after/
    # steps/bullets) use the accent .micro caption — matches the reference's
    # caption line under compare/before-after. cover/cta/statement keep their
    # existing .note treatment (unchanged from the verified slice).
    note_txt = slide.get("note", "").strip()
    micro_arch = arch in ("compare", "before-after", "steps", "bullets")
    note_cls = "micro" if micro_arch else "note"
    note_p = (f'<p class="{note_cls} gap-l">{fields["note"]}</p>'
              if note_txt else "")
    fields["note_html"] = note_p

    # Optional sub-line under a stat (its own token so it reads on light + dark).
    stat_note = (f'<div class="sub">{fields["note"]}</div>'
                 if note_txt else "")
    fields["stat_note_html"] = stat_note

    # Optional CTA chip (cta archetype).
    cta_chip = (
        f'<div class="cta gap-s">{fields["cta"]} <span class="ar">&rarr;</span></div>'
        if slide.get("cta", "").strip() else "")
    fields["cta_html"] = cta_chip

    # Optional attribution line under a quote-spotlight (its own token so it
    # reads on light + dark). Renders only when present.
    attribution = (f'<div class="attr gap-m">{fields["attribution"]}</div>'
                   if slide.get("attribution", "").strip() else "")
    fields["attribution_html"] = attribution

    # Optional caption under a logo-wall (the `note:` field, accent .micro).
    logo_note = (f'<p class="micro gap-m">{fields["note"]}</p>'
                 if slide.get("note", "").strip() else "")
    fields["logo_note_html"] = logo_note

    return partial.format(**fields)


def build_html(meta, slides, theme_css, base_css, aspect="4x5",
               density="comfortable", base_dir=None):
    """Wrap rendered slides in a full HTML document.

    The deck div carries aspect (a-4x5 / a-1x1) and density (d-<name>) hooks.
    base_css (structure) + theme_css (tokens) are injected into a single
    <style> block, theme first so :root tokens resolve for base rules.
    `base_dir` (the spec's directory) is threaded to render_slide so an
    image-bg slide can resolve a relative image path.
    """
    total = len(slides)
    dmap = {"comfortable": "d-comfortable", "spartan": "d-spartan"}
    d_class = dmap.get(density, "d-comfortable")
    a_class = f"a-{aspect}"

    # Resolve the footer wordmark from the theme's --wordmark token unless
    # the spec front-matter set one explicitly. Keeps brand identity (the
    # wordmark included) owned by the profile's theme.json, never by a
    # default in this file.
    if "wordmark" not in meta:
        m = re.search(r"--wordmark:\s*['\"]([^'\"]*)['\"]", theme_css)
        if m:
            meta = {**meta, "wordmark": m.group(1)}

    body = "\n".join(
        render_slide(s, i + 1, total, meta, base_dir)
        for i, s in enumerate(slides))

    title = esc(meta.get("title", "Carousel"))
    # The theme file @imports the embedded font itself.
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{title}</title>
<style>
{theme_css}
{base_css}
</style>
</head>
<body>
<div class="deck {a_class} {d_class}">
{body}
</div>
</body>
</html>
"""


# --------------------------------------------------------------------------- #
# Phase 5 — Chrome render
# --------------------------------------------------------------------------- #
def _render_doc_to_pdf(html_doc, out_path):
    """Write html_doc beside out_path and drive headless Chrome to print it.

    The temp file lands in the OUTPUT directory, never in this one. PRD
    section 1.3 puts every write a run makes inside profiles/<handle>/, and
    out_path is already there. Nothing needs to resolve relative to this file
    any more: the fonts, the images and the theme are all inlined."""
    out_path = pathlib.Path(out_path)
    with tempfile.NamedTemporaryFile("w", suffix=".html", dir=out_path.parent,
                                     delete=False) as f:
        f.write(html_doc)
        tmp = f.name
    try:
        subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
             "--allow-file-access-from-files",
             "--run-all-compositor-stages-before-draw",
             "--virtual-time-budget=12000",
             f"--print-to-pdf={out_path}", f"file://{tmp}"],
            check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        # CalledProcessError str() shows only the command + exit code; surface
        # Chrome's captured stderr so render failures are debuggable.
        err = (e.stderr or b"").decode(errors="replace").strip()
        raise RuntimeError(
            f"Chrome render failed (exit {e.returncode}):\n{err}") from e
    finally:
        pathlib.Path(tmp).unlink(missing_ok=True)
    return out_path


def _assemble_for_render(meta, slides, theme, base_dir=None):
    """Load _base.css, apply the per-aspect @page size, build the doc.

    `theme` is a loaded theme.json dict; theme_css() turns it into the token
    block and inlines any embedded face it names, so Chrome has the font
    before paint. `base_dir` (the spec's directory) is forwarded so an
    image-bg slide resolves a relative image path against the spec."""
    base = (HERE / "themes" / "_base.css").read_text()
    aspect = meta.get("aspect", "4x5")
    page = "1080px 1350px" if aspect == "4x5" else "1080px 1080px"
    base = base.replace("size:1080px 1350px", f"size:{page}")
    density = meta.get("density") or SCALE_DENSITY.get(
        str(theme.get("scale", "")).strip().lower(), "comfortable")
    return build_html(meta, slides, theme_css(theme), base, aspect=aspect,
                      density=density, base_dir=base_dir)


def render_pdf(spec_path, out_path, theme):
    """Parse a spec file and render it to PDF via headless Chrome.

    `theme` is a theme.json path or an already-loaded dict."""
    spec_path = pathlib.Path(spec_path)
    meta, slides = parse_spec(spec_path.read_text())
    if not isinstance(theme, dict):
        theme = load_theme(theme)
    html_doc = _assemble_for_render(meta, slides, theme,
                                    base_dir=spec_path.parent)
    return _render_doc_to_pdf(html_doc, out_path)


# --------------------------------------------------------------------------- #
# Phase 6 — validator (minimal in this slice)
# --------------------------------------------------------------------------- #
def _field_present(slide, name):
    """True if a required spec field carries content. Handles the three shapes
    the parser produces: list fields (`items`), side groups (`left`/`right`,
    stored as `<side>_title` + `<side>_items`), and plain scalars."""
    if name == "items":
        return bool(slide.get("items"))
    if name in ("left", "right"):
        return bool(slide.get(name + "_items")
                    or slide.get(name + "_title", "").strip())
    return bool(slide.get(name, "").strip())


def check_spec(meta, slides, base_dir=None):
    """Return a list of warning/error strings for a parsed spec.

    Errors: unknown archetype, missing required field, and (image-bg) an
    image path that does not resolve to a readable file. Warnings: long
    headline and long bullet -- copy budgets, which are layout facts about a
    1080x1350 frame. Language is not judged here; step 5's gate owns it.
    `base_dir` (the spec's directory) is used to resolve a relative image path.
    """
    out = []
    for i, s in enumerate(slides, 1):
        arch = s.get("archetype", "")
        tag = f"slide {i} ({arch or '?'})"
        if arch not in KNOWN_ARCHETYPES:
            out.append(f"ERROR {tag}: unknown archetype '{arch}'")
            continue
        for req in REQUIRED.get(arch, []):
            if isinstance(req, tuple):
                # "one of": at least one of the listed fields must be present.
                if not any(_field_present(s, f) for f in req):
                    out.append(
                        f"ERROR {tag}: missing required field "
                        f"(one of {', '.join(req)})")
            elif not _field_present(s, req):
                out.append(f"ERROR {tag}: missing required field '{req}'")
        # image-bg: the image must exist AND have a supported extension.
        if arch == "image-bg" and _field_present(s, "image"):
            raw = s.get("image", "").strip()
            p = resolve_image_path(raw, base_dir)
            if p.suffix.lower() not in IMAGE_MIME:
                out.append(
                    f"ERROR {tag}: unsupported image extension "
                    f"'{p.suffix}' (supported: {', '.join(sorted(IMAGE_MIME))})")
            elif not p.is_file():
                out.append(f"ERROR {tag}: image file not found: {p}")
        head = s.get("headline", "")
        # No punctuation or lexical scan here. On a visual run draft.md IS this
        # spec, so `engine.js gate --report` at pipeline step 5 already reads
        # every word that reaches the canvas, and reference/ai-tells.md is their
        # one authority. This file carried an em-dash WARN on the argument that
        # on-slide copy never meets a prose gate; that argument was wrong about
        # the wiring, and section 9's em-dash rule is under retirement review at
        # correction Phase 2a, so a second site would outlive the rule.
        # Removed 2026-08-20. Copy budgets below are layout, not language.
        words = re.sub(r"\*\*", "", head).split()
        if len(words) > 7:
            out.append(f"WARN  {tag}: headline > 7 words ({len(words)})")
        for it in s.get("items", []):
            if len(it.split()) > 6:
                out.append(f"WARN  {tag}: bullet > 6 words: '{it[:40]}'")
    return out


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #
def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    # Pull out k=v override tokens (theme=, aspect=, density=) before argparse.
    overrides = {}
    rest = []
    for tok in argv:
        if "=" in tok and not tok.startswith("-"):
            k, v = tok.split("=", 1)
            overrides[k.strip()] = v.strip()
        else:
            rest.append(tok)

    p = argparse.ArgumentParser(
        prog="render.py",
        description="Render a carousel spec to PDF, --check it, or --html it "
                    "for the design gate.")
    p.add_argument("spec", help="path to the Markdown spec")
    p.add_argument("--theme", help="path to the profile's theme.json; "
                                   "overrides the spec's `theme:` line")
    p.add_argument("--out", help="output PDF path, inside the run directory")
    p.add_argument("--html", help="write the assembled HTML here, for the "
                                  "design gate to read as text")
    p.add_argument("--check", action="store_true",
                   help="validate the spec and exit (no theme, no render)")
    args = p.parse_args(rest)

    spec_path = pathlib.Path(args.spec)
    meta, slides = parse_spec(spec_path.read_text())
    meta.update(overrides)  # k=v overrides win over front-matter

    if args.check:
        problems = check_spec(meta, slides, base_dir=spec_path.parent)
        for line in problems:
            print(line)
        errs = [x for x in problems if x.startswith("ERROR")]
        if errs:
            print(f"\n{len(errs)} error(s).")
            return 1
        print("check: OK" if not problems else "\ncheck: warnings only.")
        return 0

    # No default output path: /tmp is outside profiles/<handle>/ and PRD
    # section 1.3 does not allow a run to write there.
    if not (args.out or args.html):
        p.error("nothing to write: pass --out <pdf>, --html <html>, or --check")
    # --theme is a path like any other CLI path, resolved against the shell's
    # cwd. A `theme:` line in the spec resolves against the SPEC's directory,
    # the same rule an image-bg `image:` path already follows, so a run
    # directory holding a spec stays self-contained.
    if args.theme:
        theme_path = pathlib.Path(args.theme).expanduser()
    elif meta.get("theme"):
        theme_path = spec_path.parent / pathlib.Path(
            meta["theme"]).expanduser()
    else:
        p.error("no theme: pass --theme <profile>/theme.json, or set "
                "`theme:` in the spec front-matter")

    html_doc = _assemble_for_render(meta, slides, load_theme(theme_path),
                                   base_dir=spec_path.parent)
    if args.html:
        pathlib.Path(args.html).write_text(html_doc)
        print(args.html)
    if args.out:
        _render_doc_to_pdf(html_doc, args.out)
        print(args.out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
