#!/usr/bin/env python3
"""Infographic render engine -- spec (Markdown) -> themed HTML -> Chrome -> PNG.

One spec = one full-canvas layout = one 4:5 PNG (1080x1350 @2x = 2160x2700).
Stdlib Python only, driving headless Chrome. Nothing to install.

Two files decide how a render looks and they do different jobs:
  themes/_base.css      structure. Every colour, font, radius and rule weight
                        is a var(--token) and no value is a brand value.
  <profile>/theme.json  the tokens. The nine keys of PRD section 10, plus the
                        optional `logo`. This is the only source of brand values.

render.py owns the SHELL (head + footer bar); one Python builder per archetype
fills the .core (see CORE_BUILDERS).

Every path this module writes is inside the --profile directory, per PRD
section 1.3. It writes two files per render: <out>.html, kept because the
design gate reads rendered HTML as text, and <out> itself.

Public surface: parse_spec, accent, esc, split_fields, load_theme, theme_css,
render_canvas, build_html, render_png, check_spec, main.
"""

import re
import json
import math
import html as _html
from html.parser import HTMLParser as _HTMLParser
import argparse
import subprocess
import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# Make the asset registry importable whether run as a script or a module.
sys.path.insert(0, str(HERE / "assets"))
import icons as _assets  # noqa: E402

# The nine keys of PRD section 10, frozen. `logo` is a tenth and it is optional:
# absent means the footer renders with no mark, which is the correct default for
# a profile that has not supplied one.
THEME_KEYS = ("bg", "fg", "accent", "muted", "font_head", "font_body",
              "scale", "radius", "rule_weight")

# Keys whose `key:` line opens a `- ` bullet list.
LIST_KEYS = {"items", "left", "right", "col1", "col2", "col3", "stats"}

# Per-archetype required fields, used by check_spec().
REQUIRED = {
    "_smoke": ["headline"],
    "numbered-steps": ["headline", "items"],
    "card-grid": ["headline", "items"],
    "comparison-panel": ["headline", "col1", "col2"],
    "icon-list": ["headline", "items"],
    "funnel": ["headline", "items"],
    "hybrid-playbook": ["headline", "stats", "items"],
    "annotated-diagram": ["headline", "center", "items"],
    # The twelve VISUALS section 3 signatures added 2026-08-24. One name per
    # signature, because `archetype:` in brief.md is what PRD section 3's
    # archetype lock counts and two signatures sharing a name would be
    # indistinguishable to it. Several share a builder; see CORE_BUILDERS.
    "perception-split": ["headline", "naive_headline", "naive_statement",
                         "real_headline", "items", "punchline"],
    "causal-chain": ["headline", "items", "terminal_cost"],
    "trend-poster": ["headline", "sub", "items"],
    "distribution-strip": ["headline", "sub", "observations",
                           "reference_value", "reference_label"],
    "ranked-bars": ["headline", "sub", "items"],
    "composition-split": ["headline", "sub", "items", "expectation"],
    "variance-bridge": ["headline", "sub", "start", "end", "items"],
    "sourced-shelf": ["headline", "sub", "sections", "items"],
    "analogy-rows": ["headline", "sub", "items"],
    "quadrant-map": ["headline", "sub", "quadrants", "x_axis", "y_axis",
                     "items"],
    "stratified-container": ["headline", "items", "notes"],
    "mirrored-rings": ["headline", "items", "good_label", "bad_label"],
}
KNOWN_ARCHETYPES = set(REQUIRED)

# VISUALS section 4.2: a template that prints a number carries its source on the
# canvas, in two places that do different jobs. The subtitle carries method and
# sample and dies at feed size, which is correct; the footer carries who says so.
# `footer` is the source line, so an empty one on a data archetype fails the
# build rather than warning -- section 4.1 step 7: no line, no render.
SOURCE_REQUIRED = ("trend-poster", "distribution-strip", "ranked-bars",
                   "composition-split", "variance-bridge", "sourced-shelf",
                   "hybrid-playbook")

# Character and count budgets, read off VISUALS section 3 one signature at a
# time. `_items` is the (min, max) item count; every other key is a character
# ceiling for that field, and for `items` it applies per item.
#
# Budgets are ERRORs, not warnings: section 6.3 row 4 says the build fails on an
# over-budget string, and the budgets are measured counts off the reference
# images rather than one of section 3's untagged ratios.
BUDGETS = {
    "perception-split": {"_items": (4, 4), "naive_headline": 36,
                         "real_headline": 36, "naive_callout": 40,
                         "naive_statement": 60, "items": 60, "punchline": 60},
    "causal-chain": {"_items": (3, 4), "items": 80, "terminal_cost": 80},
    "trend-poster": {"_items": (6, 12), "sub": 60, "items": 24, "units": 24},
    "distribution-strip": {"sub": 60, "reference_label": 40},
    "ranked-bars": {"_items": (4, 11), "sub": 46, "items": 48},
    "composition-split": {"_items": (2, 5), "sub": 72, "expectation": 72,
                          "items": 30},
    "variance-bridge": {"_items": (3, 6), "sub": 72, "items": 26},
    "sourced-shelf": {"_items": (9, 9), "sub": 64, "items": 150},
    "analogy-rows": {"_items": (3, 5), "sub": 52, "items": 90},
    "quadrant-map": {"_items": (6, 12), "sub": 120, "items": 30},
    "stratified-container": {"_items": (3, 5), "items": 220},
    "mirrored-rings": {"_items": (3, 3), "items": 240},
}

# A cheap pre-flight only. `reference/ai-tells.md` is the authority and pipeline
# step 5 is where it runs; this list exists so an obvious miss costs no Chrome
# launch. Do not grow it here -- grow it there.


# --------------------------------------------------------------------------- #
# theme: profiles/<handle>/theme.json -> CSS custom properties
# --------------------------------------------------------------------------- #
def load_theme(path):
    """Read a theme.json, require the nine keys, and return its dict.

    There are deliberately no fallback values here. The defaults live in
    profiles/_template/theme.json, which is what a profile is created from, and
    a second copy of them in Python would be a second place for them to drift.
    A missing key is a hand-edited theme and it fails loudly naming the key,
    which beats a render that silently loses a colour.

    `_profile` records the directory the theme came from. It is how the logo and
    any icons resolve inside profiles/<handle>/ without a second argument
    threaded through every builder."""
    path = pathlib.Path(path)
    theme = json.loads(path.read_text())
    missing = [k for k in THEME_KEYS if k not in theme]
    if missing:
        raise ValueError("%s is missing theme keys: %s"
                         % (path, ", ".join(missing)))
    theme["_profile"] = str(path.parent)
    return theme


def _rgb(hex_str):
    h = (hex_str or "").strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6:
        raise ValueError("theme colour must be #rgb or #rrggbb, got %r" % hex_str)
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def _luminance(hex_str):
    """WCAG relative luminance, 0..1."""
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = [lin(c) for c in _rgb(hex_str)]
    return 0.2126 * r + 0.7152 * g + 0.0722 * b


def _contrast(a, b):
    la, lb = _luminance(a), _luminance(b)
    return (max(la, lb) + 0.05) / (min(la, lb) + 0.05)


def theme_css(theme):
    """Emit the `:root` block _base.css consumes, derived from theme.json.

    Nine keys map straight across. Everything else _base.css needs is derived
    in OKLab by the browser via color-mix(), always stepping from --bg toward
    --fg or --accent, so a dark theme inverts correctly with no second palette.

    --on-accent is the one derivation Python has to make, because CSS cannot
    branch on luminance. Setting reversed labels globally to white is a
    measured failure (VISUALS section 5.4), so pick whichever of fg/bg actually
    contrasts against the accent fill.
    """
    on_accent = (theme["fg"]
                 if _contrast(theme["accent"], theme["fg"])
                 >= _contrast(theme["accent"], theme["bg"])
                 else theme["bg"])
    space = "0.72" if str(theme.get("scale", "airy")).strip() == "dense" else "1"
    logo = theme.get("logo")
    mark = ('  --mark:url("%s");\n' % _assets.logo_uri(logo)) if logo else ""
    theme = {k: v for k, v in theme.items() if not k.startswith("_")}
    return (
        ":root{\n"
        "  --bg:%(bg)s;\n"
        "  --ink:%(fg)s;\n"
        "  --accent:%(accent)s;\n"
        "  --muted:%(muted)s;\n"
        "  --font-head:%(font_head)s;\n"
        "  --font-body:%(font_body)s;\n"
        "  --radius:%(radius)s;\n"
        "  --rule:%(rule_weight)s;\n"
        "  --space:%(space)s;\n"
        "  --on-accent:%(on_accent)s;\n"
        "  --ink-soft:color-mix(in oklab, var(--ink) 82%%, var(--bg));\n"
        "  --line:color-mix(in oklab, var(--bg) 86%%, var(--ink));\n"
        "  --surface:color-mix(in oklab, var(--bg) 96%%, var(--ink));\n"
        "  --surface-2:color-mix(in oklab, var(--bg) 88%%, var(--accent));\n"
        "  --accent-deep:color-mix(in oklab, var(--accent) 76%%, var(--ink));\n"
        "  --accent-wash:color-mix(in oklab, var(--accent) 30%%, var(--bg));\n"
        "%(mark)s"
        "}\n"
    ) % dict(theme, space=space, on_accent=on_accent, mark=mark)


# --------------------------------------------------------------------------- #
# parser
# --------------------------------------------------------------------------- #
def parse_spec(text):
    """Parse spec text into (meta: dict, blocks: list[dict]).

    Front-matter is `--- ... ---` of `key: value` lines. A layout block opens
    with `:: <archetype>`. Inside a block, `key: value` sets a scalar; a key in
    LIST_KEYS opens a bullet list collected from following `- ` lines. A spec
    should carry exactly one block (the single layout); the engine renders
    blocks[0].
    """
    text = text.replace("\r\n", "\n")
    meta, body = {}, text
    m = re.match(r"^---\n(.*?)\n---(?:\n(.*))?$", text, re.S)
    if m:
        for line in m.group(1).split("\n"):
            if ":" in line and not line.strip().startswith("#"):
                k, v = line.split(":", 1)
                meta[k.strip()] = v.strip()
        body = m.group(2) or ""

    blocks, cur, cur_list = [], None, None
    for raw in body.split("\n"):
        line = raw.rstrip()
        if line.startswith(":: "):
            cur = {"archetype": line[3:].strip()}
            for k in LIST_KEYS:
                cur[k] = []
            blocks.append(cur)
            cur_list = None
            continue
        if cur is None:
            continue
        if line.strip().startswith("#"):
            continue
        if line.strip().startswith("- "):
            target = cur_list if cur_list in LIST_KEYS else "items"
            cur[target].append(line.strip()[2:].strip())
            continue
        if ":" in line:
            k, v = line.split(":", 1)
            k, v = k.strip(), v.strip()
            if k in LIST_KEYS:
                cur_list = k
                if v:
                    cur[k].append(v)
            else:
                cur[k] = v
                cur_list = None
    return meta, blocks


# --------------------------------------------------------------------------- #
# text atoms
# --------------------------------------------------------------------------- #
def esc(s):
    return _html.escape(s or "", quote=False)


def accent(s):
    """Escape, then turn **bold** into an accent span."""
    s = _html.escape(s or "", quote=False)
    return re.sub(r"\*\*(.+?)\*\*", r'<span class="g">\1</span>', s)


def split_fields(item, n=None):
    """Split a compound `a | b | c` item into stripped fields. With n, pad/clip
    to exactly n fields (missing -> '')."""
    parts = [p.strip() for p in item.split("|")]
    if n is not None:
        parts = (parts + [""] * n)[:n]
    return parts


# --------------------------------------------------------------------------- #
# core builders (one per archetype core; shell is shared)
# --------------------------------------------------------------------------- #
# numbered-steps geometry (absolute, deterministic). Deterministic: large double rings alternating right/left, a single solid
# line that weaves serpentine through them with rounded corners + arrowheads +
# a square start node, and dense bordered pills under each step.
_W = 928              # core width (1080 - 2*76 pad)
_R = 52               # ring radius (104px ring)
_RIGHT_CX = _W - _R - 6   # ring center x when on the right
_LEFT_CX = _R + 6         # ring center x when on the left
_RAIL_R = _W - 3          # right U-turn rail (outside the ring)
_RAIL_L = 3               # left U-turn rail
_NODE_X = 8               # square start-node x
_PITCH = 196              # vertical distance between step lines
_CONTENT_BOTTOM = 138     # space the last step's body needs below its line
_CORNER = 22              # connector corner radius
_ARROW_L = 15             # arrowhead length
_ARROW_W = 9              # arrowhead half-width


# An icon is optional decoration, so every path to one fails soft: an unknown
# slug, a profile with no icons/, and a builder called with no profile set all
# yield no icon rather than breaking the render.
_ICON_MISS = (FileNotFoundError, RuntimeError, OSError, ValueError)


def _step_icon_html(slug):
    """Resolve an optional [slug] icon to a background-image span, or ''."""
    if not slug:
        return ""
    try:
        uri = _assets.icon_uri(slug)
    except _ICON_MISS:
        return ""
    return f'<span class="sicon" style="background-image:url(&quot;{uri}&quot;)"></span>'


def _has_icon(slug):
    """True if the profile carries an icon for slug (fail-soft probe)."""
    if not slug:
        return False
    try:
        _assets.icon_uri(slug)
        return True
    except _ICON_MISS:
        return False


def _steps_geometry(n):
    """Return (rings, content, total_h). rings[i]=(cx,cy,is_right);
    content[i]=(left,top,width). Steps 1,3,5 ring right; 2,4 ring left. Each
    body sits just below its step's connector line, on the side opposite the
    ring."""
    rings, content, lys = [], [], []
    for i in range(n):
        cy = _R + i * _PITCH
        is_right = (i % 2 == 0)
        cx = _RIGHT_CX if is_right else _LEFT_CX
        rings.append((cx, cy, is_right))
        lys.append(cy)
        if is_right:
            content.append((0, cy + 2, _RIGHT_CX - _R - 30))
        else:
            left = _LEFT_CX + _R + 30
            content.append((left, cy + 2, _W - left))
    total_h = (lys[-1] if lys else 0) + _CONTENT_BOTTOM
    return rings, content, total_h


def _rounded_path(points, r):
    """SVG path 'd' threading the points with rounded corners of radius r."""
    if len(points) < 2:
        return ""
    if len(points) == 2:
        (x0, y0), (x1, y1) = points
        return f"M {x0:.1f} {y0:.1f} L {x1:.1f} {y1:.1f}"
    d = [f"M {points[0][0]:.1f} {points[0][1]:.1f}"]
    for i in range(1, len(points) - 1):
        (px, py), (cx, cy), (nx, ny) = points[i - 1], points[i], points[i + 1]
        v1x, v1y = px - cx, py - cy
        v2x, v2y = nx - cx, ny - cy
        l1 = math.hypot(v1x, v1y) or 1
        l2 = math.hypot(v2x, v2y) or 1
        rr = min(r, l1 / 2, l2 / 2)
        ax, ay = cx + v1x / l1 * rr, cy + v1y / l1 * rr
        bx, by = cx + v2x / l2 * rr, cy + v2y / l2 * rr
        d.append(f"L {ax:.1f} {ay:.1f}")
        d.append(f"Q {cx:.1f} {cy:.1f} {bx:.1f} {by:.1f}")
    d.append(f"L {points[-1][0]:.1f} {points[-1][1]:.1f}")
    return " ".join(d)


def _steps_connector_svg(rings, total_h):
    """One solid line weaving through the rings: a square start node, a
    horizontal run into each ring (arrowhead), and a rounded U-turn down the
    ring's own rail to the next row. Rings paint on top with an opaque fill so
    the line reads as entering and re-emerging from each ring."""
    n = len(rings)
    pts = [(_NODE_X, rings[0][1])]
    for i, (cx, cy, is_right) in enumerate(rings):
        pts.append((cx, cy))
        if i < n - 1:
            rail = _RAIL_R if is_right else _RAIL_L
            pts.append((rail, cy))
            pts.append((rail, rings[i + 1][1]))
    path = _rounded_path(pts, _CORNER)

    arrows = []
    for cx, cy, is_right in rings:
        if is_right:
            tx = cx - _R - 5
            tri = (f"{tx:.1f},{cy:.1f} {tx-_ARROW_L:.1f},{cy-_ARROW_W:.1f} "
                   f"{tx-_ARROW_L:.1f},{cy+_ARROW_W:.1f}")
        else:
            tx = cx + _R + 5
            tri = (f"{tx:.1f},{cy:.1f} {tx+_ARROW_L:.1f},{cy-_ARROW_W:.1f} "
                   f"{tx+_ARROW_L:.1f},{cy+_ARROW_W:.1f}")
        arrows.append(f'<polygon points="{tri}" fill="var(--accent)"/>')

    nx, ny = _NODE_X, rings[0][1]
    node = (f'<rect x="{nx-6:.1f}" y="{ny-6:.1f}" width="12" height="12" '
            f'rx="2" fill="var(--accent)"/>')
    return (f'<svg class="connector" width="{_W}" height="{total_h:.0f}" '
            f'viewBox="0 0 {_W} {total_h:.0f}">'
            f'<path d="{path}" fill="none" stroke="var(--accent)" '
            f'stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
            f'{node}{"".join(arrows)}</svg>')


def steps_html(items):
    """Numbered-steps core. Each item is `[icon] Title | Lead-in | pill; pill`
    (icon, lead-in, pills all optional). Absolutely positioned double rings
    (STEP 0N) alternate right/left, joined by a serpentine connector; each body
    carries an icon+title, a lead-in line, and a row of bordered pills."""
    n = len(items)
    rings, content, total_h = _steps_geometry(n)
    parts = [_steps_connector_svg(rings, total_h)]
    for i, raw in enumerate(items):
        icon = None
        m = re.match(r'^\[([a-z0-9-]+)\]\s*(.*)$', raw)
        if m:
            icon, raw = m.group(1), m.group(2)
        title, lead, pillstr = split_fields(raw, 3)
        cx, cy, _is_right = rings[i]
        parts.append(
            f'<div class="ring" style="left:{cx:.0f}px;top:{cy:.0f}px">'
            f'<span class="lab">STEP</span>'
            f'<span class="num">{i+1:02d}</span></div>')
        cleft, ctop, cwidth = content[i]
        lead_html = f'<div class="d">{accent(lead)}</div>' if lead else ""
        pills_html = ""
        if pillstr:
            ps = [p.strip() for p in pillstr.split(";") if p.strip()]
            pills_html = ('<div class="chips">'
                          + "".join(f'<span class="chip">{accent(p)}</span>' for p in ps)
                          + "</div>")
        thead = (f'<div class="thead">{_step_icon_html(icon)}'
                 f'<div class="t">{accent(title)}</div></div>')
        parts.append(
            f'<div class="stepbody" style="left:{cleft:.0f}px;top:{ctop:.0f}px;'
            f'width:{cwidth:.0f}px">{thead}{lead_html}{pills_html}</div>')
    return f'<div class="steps2" style="height:{total_h:.0f}px">{"".join(parts)}</div>'


def cardgrid_html(items):
    """Card-grid core A 2-column grid of
    numbered cards; each item is `[icon] Title | Body`. The number rides in an
    accent square; an optional icon sits beside the title; the body is a
    short paragraph. 4-10 cards fit the 4:5 frame (budget ~20 words/body)."""
    cards = []
    for i, raw in enumerate(items):
        icon = None
        m = re.match(r'^\[([a-z0-9-]+)\]\s*(.*)$', raw)
        if m:
            icon, raw = m.group(1), m.group(2)
        title, body = split_fields(raw, 2)
        ic = _step_icon_html(icon)
        body_html = f'<div class="cb">{accent(body)}</div>' if body else ""
        cards.append(
            f'<div class="card">'
            f'<div class="chead"><span class="cnum">{i+1:02d}</span>'
            f'{ic}<div class="ct">{accent(title)}</div></div>'
            f'{body_html}</div>')
    return f'<div class="cardgrid">{"".join(cards)}</div>'


def compare_html(block):
    """Comparison-panel core 2-3 columns
    (`col1`/`col2`/`col3`), each a vertical panel: the FIRST list item is the
    column header (tinted bar); every following item is a `Label | value` row
    where a `;`-delimited value renders as a bulleted list. `vs` badges sit
    between columns. An optional `verdict_label` + `verdict` render a bottom
    band (a summary line under the columns)."""
    tints = ["cwash-a", "cwash-b", "cwash-c"]
    raw_cols = [c for c in (block.get("col1", []), block.get("col2", []),
                            block.get("col3", [])) if c]
    cols = []
    for idx, col in enumerate(raw_cols):
        header = col[0] if col else ""
        rows = []
        for r in col[1:]:
            label, val = split_fields(r, 2)
            parts = [x.strip() for x in val.split(";") if x.strip()]
            if len(parts) > 1:
                body = ('<ul class="crows">'
                        + "".join(f"<li>{accent(x)}</li>" for x in parts)
                        + "</ul>")
            else:
                body = f'<div class="cval">{accent(val)}</div>'
            rows.append(f'<div class="crow"><div class="clab">{accent(label)}</div>'
                        f'{body}</div>')
        cols.append(
            f'<div class="ccol"><div class="chd {tints[idx % 3]}">{accent(header)}</div>'
            f'<div class="cbody">{"".join(rows)}</div></div>')
    grid = ('<div class="compare cols%d">' % len(cols)
            + '<span class="vs">vs</span>'.join(cols) + '</div>')
    verdict = block.get("verdict", "")
    band = ""
    if verdict:
        vlab = block.get("verdict_label", "")
        lab_html = f'<span class="vlab">{accent(vlab)}</span>' if vlab else ""
        band = (f'<div class="verdict">{lab_html}'
                f'<span class="vtxt">{accent(verdict)}</span></div>')
    return f'<div class="comparewrap">{grid}{band}</div>'


def iconlist_html(items):
    """Icon-list core A 2-column NUMBERED
    list: each row = an accent number marker + a prominent icon + a bold
    short title + a one/two-line description. Lighter than the card grid:
    icon-led rows separated by hairline dividers, no heavy card borders. Each
    item is `[icon] Title | Description` (icon + description optional). Holds
    8-12 items; title budget <= 4 words, description <= ~14 words."""
    rows = []
    for i, raw in enumerate(items):
        icon = None
        m = re.match(r'^\[([a-z0-9-]+)\]\s*(.*)$', raw)
        if m:
            icon, raw = m.group(1), m.group(2)
        title, body = split_fields(raw, 2)
        ic = (f'<span class="ilicon" '
              f'style="background-image:url(&quot;{_assets.icon_uri(icon)}&quot;)"></span>'
              if (icon and _has_icon(icon)) else '<span class="ilicon ilnoicon"></span>')
        body_html = f'<div class="ilbody">{accent(body)}</div>' if body else ""
        rows.append(
            f'<div class="ilrow">'
            f'<span class="ilnum">{i+1}</span>'
            f'{ic}'
            f'<div class="iltext"><div class="iltitle">{accent(title)}</div>'
            f'{body_html}</div>'
            f'</div>')
    nrows = -(-len(rows) // 2)  # ceil: fill col 1 top-to-bottom, then col 2
    style = f'grid-template-rows:repeat({nrows},1fr)' if nrows else ""
    return f'<div class="iconlist" style="{style}">{"".join(rows)}</div>'


def funnel_html(items):
    """Funnel core 4-6 stacked, centered
    trapezoid bands that NARROW top->bottom (widest at top), each a stage with a
    reversed label and an optional short detail line. Each item is
    `[icon] Label | Detail` (icon + detail optional). Top item = widest stage.

    The tint ramp is ONE hue -- the theme accent -- stepped through luminances
    toward --ink. Band index is an ordinal, and an ordinal is a luminance
    dimension rather than a hue dimension (VISUALS section 3.9); a fixed
    multi-hue ramp here would also be a brand value in skill logic.

    Geometry is computed in Python so the trapezoids interlock exactly: each
    band's bottom edge width equals the next band's top edge width, producing a
    continuous funnel silhouette. Widths step linearly from 100% (top) to a
    narrow neck (bottom)."""
    n = max(1, len(items))

    def _tint(t):
        """t in [0,1] -> a color-mix() stepping the accent toward --ink."""
        return ("color-mix(in oklab, var(--accent) %d%%, var(--ink))"
                % (100 - round(t * 55)))

    top_w, neck_w = 100.0, 40.0
    edges = [top_w - (top_w - neck_w) * (k / n) for k in range(n + 1)]

    bands = []
    for i, raw in enumerate(items):
        icon = None
        m = re.match(r'^\[([a-z0-9-]+)\]\s*(.*)$', raw)
        if m:
            icon, raw = m.group(1), m.group(2)
        label, detail = split_fields(raw, 2)
        wt, wb = edges[i], edges[i + 1]
        it, ib = (100 - wt) / 2, (100 - wb) / 2
        clip = (f"polygon({it:.2f}% 0, {100-it:.2f}% 0, "
                f"{100-ib:.2f}% 100%, {ib:.2f}% 100%)")
        fill = _tint(i / (n - 1) if n > 1 else 0.0)
        ic = _step_icon_html(icon)
        detail_html = (f'<div class="fdetail">{accent(detail)}</div>'
                       if detail else "")
        bands.append(
            f'<div class="fband">'
            f'<div class="ftrap" data-ramp="funnel" '
            f'style="clip-path:{clip};-webkit-clip-path:{clip};'
            f'background:{fill}"></div>'
            f'<div class="finner">'
            f'<div class="flabel">{ic}<span>{accent(label)}</span></div>'
            f'{detail_html}</div></div>')
    return f'<div class="funnel">{"".join(bands)}</div>'


def playbook_html(block):
    """Hybrid-playbook core A composite,
    mixed-density 'playbook': a prominent top band of 2-4 big-number STAT
    callouts (large value in --accent-deep + small --muted label), then a grid
    of 3-5 titled SECTIONS below (icon + bold title + short body).

    Grammar:
      stats: `Value | Label`        -> hero number callouts (2-4)
      items: `[icon] Title | Body`  -> titled sections (3-5)
    """
    stats = block.get("stats", [])
    items = block.get("items", [])

    n_stats = len(stats)
    stat_cells = []
    for raw in stats:
        value, label = split_fields(raw, 2)
        lbl_html = f'<div class="pb-slab">{accent(label)}</div>' if label else ""
        stat_cells.append(
            f'<div class="pb-stat">'
            f'<div class="pb-snum">{accent(value)}</div>'
            f'{lbl_html}</div>')
    band = (f'<div class="pb-band pb-band-{max(1, n_stats)}">'
            f'{"".join(stat_cells)}</div>') if stat_cells else ""

    n_items = len(items)
    cols = 3 if n_items % 3 == 0 and n_items >= 3 else 2
    secs = []
    for raw in items:
        icon = None
        m = re.match(r'^\[([a-z0-9-]+)\]\s*(.*)$', raw)
        if m:
            icon, raw = m.group(1), m.group(2)
        title, body = split_fields(raw, 2)
        ic = _step_icon_html(icon)
        body_html = f'<div class="pb-sbody">{accent(body)}</div>' if body else ""
        secs.append(
            f'<div class="pb-sec">'
            f'<div class="pb-shead">{ic}'
            f'<div class="pb-stitle">{accent(title)}</div></div>'
            f'{body_html}</div>')
    grid = (f'<div class="pb-grid pb-cols-{cols}">{"".join(secs)}</div>'
            if secs else "")

    return f'<div class="playbook">{band}{grid}</div>'


# --------------------------------------------------------------------------- #
# annotated-diagram geometry (absolute, deterministic). Deterministic: ONE central hub node, with 4-6 callout cards in left/right
# columns around it, each joined to the hub edge by a thin leader line (inline
# SVG) ending in a dot on the hub rim and a dot at the callout.
# --------------------------------------------------------------------------- #
_DW = 928                 # core width (1080 - 2*76 pad)
_DH = 900                 # fixed diagram height (root is position:relative)
_HUB_R = 138              # central hub radius
_HUB_CX = _DW / 2         # hub center x
_HUB_CY = _DH / 2         # hub center y
_CALLOUT_W = 290          # callout card width
_DOT_R = 7                # leader-line endpoint dot radius
_RIM_GAP = 6              # gap between leader endpoint and hub rim


def _diagram_geometry(n):
    """Return (slots, total_h). slots[i] = dict with the callout card box
    (left/top/width/side) and the hub-rim leader endpoint. Callouts split into a
    left and right column, top-to-bottom, each vertically centered as a group;
    right column gets the extra one when n is odd."""
    n_right = (n + 1) // 2
    n_left = n - n_right
    cols = {"left": n_left, "right": n_right}
    slots = [None] * n
    order = {"left": [], "right": []}
    for i in range(n):
        side = "right" if (i % 2 == 0) else "left"
        if len(order[side]) >= cols[side]:
            side = "left" if side == "right" else "right"
        order[side].append(i)

    card_h = 150
    for side in ("left", "right"):
        idxs = order[side]
        m = len(idxs)
        if m == 0:
            continue
        gap = 46
        group_h = m * card_h + (m - 1) * gap
        start = (_DH - group_h) / 2
        for j, i in enumerate(idxs):
            cy = start + j * (card_h + gap) + card_h / 2
            if side == "left":
                left = 0
                edge_x = left + _CALLOUT_W
            else:
                left = _DW - _CALLOUT_W
                edge_x = left
            top = cy - card_h / 2
            ax, ay = edge_x, cy
            vx, vy = ax - _HUB_CX, ay - _HUB_CY
            d = math.hypot(vx, vy) or 1
            rim_x = _HUB_CX + vx / d * (_HUB_R + _RIM_GAP)
            rim_y = _HUB_CY + vy / d * (_HUB_R + _RIM_GAP)
            slots[i] = {
                "side": side, "left": left, "top": top, "cy": cy,
                "edge_x": edge_x, "rim_x": rim_x, "rim_y": rim_y,
            }
    return slots, _DH


def _diagram_leaders_svg(slots):
    """One SVG layer (z0) of thin leader lines: each runs from the inner card
    edge to the hub rim, with an endpoint dot at each end and a short elbow stub
    off the card."""
    lines, dots = [], []
    for s in slots:
        if not s:
            continue
        ex, ey = s["edge_x"], s["cy"]
        rx, ry = s["rim_x"], s["rim_y"]
        stub = 26 if s["side"] == "right" else -26
        bx = ex + stub
        pts = [(ex, ey), (bx, ey), (rx, ry)]
        path = _rounded_path(pts, 18)
        lines.append(f'<path d="{path}" fill="none" stroke="var(--accent)" '
                     f'stroke-width="3" stroke-linecap="round" '
                     f'stroke-linejoin="round"/>')
        dots.append(f'<circle cx="{ex:.1f}" cy="{ey:.1f}" r="{_DOT_R}" '
                    f'fill="var(--accent)"/>')
        dots.append(f'<circle cx="{rx:.1f}" cy="{ry:.1f}" r="{_DOT_R-2}" '
                    f'fill="var(--accent-deep)"/>')
    return (f'<svg class="dialeaders" width="{_DW}" height="{_DH}" '
            f'viewBox="0 0 {_DW} {_DH}">{"".join(lines)}{"".join(dots)}</svg>')


def diagram_html(block):
    """Annotated-diagram core A central hub
    node (the `center` scalar, <= 3 words) with 4-6 callouts radiating around
    it. Each item is `[icon] Title | Detail`; callouts split left/right and each
    is joined to the hub rim by a thin leader line with endpoint dots."""
    center = block.get("center", "")
    items = block.get("items", [])[:6]
    slots, total_h = _diagram_geometry(len(items))

    parts = [_diagram_leaders_svg(slots)]
    parts.append(
        f'<div class="dihub" style="left:{_HUB_CX:.0f}px;top:{_HUB_CY:.0f}px;'
        f'width:{_HUB_R*2:.0f}px;height:{_HUB_R*2:.0f}px">'
        f'<span class="dihub-t">{accent(center)}</span></div>')

    for i, raw in enumerate(items):
        s = slots[i]
        if not s:
            continue
        icon = None
        m = re.match(r'^\[([a-z0-9-]+)\]\s*(.*)$', raw)
        if m:
            icon, raw = m.group(1), m.group(2)
        title, detail = split_fields(raw, 2)
        ic = _step_icon_html(icon)
        detail_html = f'<div class="dicall-d">{accent(detail)}</div>' if detail else ""
        align = "right" if s["side"] == "left" else "left"
        parts.append(
            f'<div class="dicall dicall-{s["side"]}" '
            f'style="left:{s["left"]:.0f}px;top:{s["top"]:.0f}px;'
            f'width:{_CALLOUT_W}px;text-align:{align}">'
            f'<div class="dicall-h">{ic}<div class="dicall-t">{accent(title)}</div></div>'
            f'{detail_html}</div>')

    return (f'<div class="diagram" style="height:{total_h:.0f}px">'
            f'{"".join(parts)}</div>')


# --------------------------------------------------------------------------- #
# shared atoms for the VISUALS section 3 signatures
# --------------------------------------------------------------------------- #
# Every fill below is a color-mix() in OKLab stepping one theme token toward
# another. No hue is invented and no literal colour exists: VISUALS section 5.4
# caps a canvas at three hues and says an ordinal is a luminance dimension, so a
# ramp is one token stepped through luminances and never a second hue.
#
# `accent_2` is VISUALS section 10 decision 2 and it is not decided, so the two
# forms that need a second semantic hue (the variance bridge's signed
# contributions, the mirrored rings' two ramps) encode sign as accent against an
# ink-neutral instead. That is a luminance encoding of a stated dimension, which
# is legal under 5.4, and it is the honest substitute rather than a hue picked
# here. If the key lands, the negative ramp becomes var(--accent-2) in one place.
_RAMP_MIN, _RAMP_MAX = 24, 92     # accent share, dimmest to strongest step


def _ramp(i, n, token="var(--accent)", lo=_RAMP_MIN, hi=_RAMP_MAX):
    """Step `token` toward --bg. i=0 is the dimmest step, i=n-1 the strongest.

    Checked against the page background rather than against the neighbour step,
    per VISUALS section 5.4: a ramp generated by evenly lightening one hue lands
    its last step on the ground. `check_layout`'s tint check is what enforces it,
    and it reads exactly the fills this function emits (see `data-ramp`)."""
    t = 0.0 if n <= 1 else i / (n - 1)
    return "color-mix(in oklab, %s %d%%, var(--bg))" % (token, round(lo + (hi - lo) * t))


def _num(s, default=None):
    """A spec number. Tolerates a sign, a comma, a trailing % and stray spaces."""
    try:
        return float(str(s).strip().replace(",", "").replace("%", "").replace("+", ""))
    except (TypeError, ValueError):
        return default


def _claim(cls, text, tag="div", extra=""):
    """A claim-layer node: what VISUALS section 1 requires survive 220px, and
    what check_layout's thumbnail check measures. Marking it is the template's
    job because only the template knows which atoms are the claim."""
    return '<%s class="%s" data-layer="claim"%s>%s</%s>' % (tag, cls, extra, accent(text), tag)


# --------------------------------------------------------------------------- #
# 3.5 perception split  ->  split panel
# --------------------------------------------------------------------------- #
def split_panel_html(block):
    """Perception split (VISUALS 3.5). The audience's model on top collapsed to
    one statement, the practitioner's underneath as the SAME object subdivided
    into five slots, at the same width and on the same axis.

    The asymmetry is the content: 1 slot against 5. A symmetric render is
    section 6.2's named tell and check_spec refuses it, because equal counts on
    both sides leave no thesis. Leader lines start inside a slot and cross its
    edge (section 3.5's note); a line that stops at the outline reads as a
    floating arrow. The divider bleeds to both canvas edges."""
    items = block.get("items", [])
    punch = block.get("punchline", "")
    slots = list(items) + ([punch] if punch else [])

    def _slot(text, extra_cls=""):
        return (f'<div class="sp-slot {extra_cls}">'
                f'<span class="sp-lead"></span>'
                f'<span class="sp-txt">{accent(text)}</span></div>')

    callout = block.get("naive_callout", "")
    callout_html = (f'<div class="sp-callout">{accent(callout)}</div>'
                    if callout else "")
    top = (f'<div class="sp-panel sp-top">'
           f'{_claim("sp-label", block.get("naive_headline", ""))}'
           f'<div class="sp-object">{_slot(block.get("naive_statement", ""), "sp-whole")}</div>'
           f'{callout_html}</div>')
    bottom_slots = "".join(
        _slot(s, "sp-break" if (punch and i == len(slots) - 1) else "")
        for i, s in enumerate(slots))
    bottom = (f'<div class="sp-panel sp-bottom">'
              f'{_claim("sp-label", block.get("real_headline", ""))}'
              f'<div class="sp-object">{bottom_slots}</div></div>')
    return f'<div class="splitpanel">{top}<div class="sp-div"></div>{bottom}</div>'


# --------------------------------------------------------------------------- #
# 3.16 causal chain  ->  chain
# --------------------------------------------------------------------------- #
def chain_html(block):
    """Causal chain (VISUALS 3.16). Root cause to mechanism to symptom to the
    cost somebody feels, one thread, no branches.

    An arrow asserts necessity, so the chain is drawn as one unbroken run: each
    link is a rule plus an arrowhead, never a dotted hop. `break_after` puts the
    argument on the canvas -- the link the author says can be cut -- as a bar
    across that link, which is the only place the post's thesis appears in the
    geometry rather than in the words."""
    nodes = [split_fields(i, 2) for i in block.get("items", [])]
    cost = block.get("terminal_cost", "")
    if cost:
        nodes.append(split_fields(cost, 2))
    brk = int(_num(block.get("break_after", 0), 0) or 0)
    brk_label = block.get("break_label", "")

    parts = []
    for i, (label, gloss) in enumerate(nodes):
        last = (i == len(nodes) - 1)
        gl = f'<div class="cn-gloss">{accent(gloss)}</div>' if gloss else ""
        parts.append(
            f'<div class="cn-node{" cn-cost" if last else ""}">'
            f'<span class="cn-ord">{i+1}</span>'
            f'<div class="cn-body">{_claim("cn-label", label)}{gl}</div></div>')
        if not last:
            mark = ""
            if brk_label and (i + 1) == brk:
                mark = (f'<span class="cn-cut"></span>'
                        f'<span class="cn-cutlab">{accent(brk_label)}</span>')
            parts.append(f'<div class="cn-link">{mark}</div>')
    return f'<div class="chain">{"".join(parts)}</div>'


# --------------------------------------------------------------------------- #
# 3.1 trend poster + 3.13 distribution strip  ->  plot canvas
# --------------------------------------------------------------------------- #
_PW, _PH = 928, 620          # plot box
_PL, _PB = 132, 52           # left gutter (tick labels), bottom band (x labels)
_PR = 20                     # right inset, so the terminal dot is not clipped


def trend_html(block):
    """Trend poster (VISUALS 3.1). One series, plotted alone, zero baseline.

    Three structure rules are geometry here rather than advice. The y axis starts
    at zero, because a truncated baseline is a lie the geometry tells while every
    word stays true. `y_max` is pinned above the top datum rather than rounded up
    to a nice number (section 6.2). Only the terminal point carries a value: a
    label on every point is section 6.2's tell, and there is no area fill and no
    legend for the same reason. Tick labels are a primary tier, set larger than
    the subtitle that explains them, because ticks survive 220px and the subtitle
    does not (section 5.3's one inversion)."""
    pts = [split_fields(i, 2) for i in block.get("items", [])]
    vals = [_num(v, 0.0) or 0.0 for _, v in pts]
    top = max(vals) if vals else 1.0
    y_max = _num(block.get("y_max"), 0.0) or 0.0
    if y_max <= top:
        y_max = top * 1.15          # section 3.1: >= 1.15x, never equal
    ticks = int(_num(block.get("ticks", 5), 5) or 5)
    ticks = max(4, min(5, ticks))

    iw, ih = _PW - _PL - _PR, _PH - _PB
    n = max(1, len(vals))
    xs = [_PL + (iw * (i / (n - 1)) if n > 1 else iw / 2) for i in range(n)]
    ys = [(_PH - _PB) - ih * (v / y_max) for v in vals]

    rules, labels = [], []
    for k in range(ticks):
        frac = k / (ticks - 1) if ticks > 1 else 0
        y = (_PH - _PB) - ih * frac
        rules.append(f'<line x1="{_PL}" y1="{y:.1f}" x2="{_PW}" y2="{y:.1f}" '
                     f'class="tp-grid"/>')
        labels.append(f'<div class="tp-tick" data-layer="claim" '
                      f'style="top:{y:.1f}px">{esc("%g" % round(y_max * frac, 2))}</div>')
    poly = " ".join(f"{x:.1f},{y:.1f}" for x, y in zip(xs, ys))
    dots = "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="6" class="tp-dot"/>'
                   for x, y in zip(xs, ys))
    term = (f'<circle cx="{xs[-1]:.1f}" cy="{ys[-1]:.1f}" r="12" class="tp-term"/>'
            if vals else "")
    xlabs = "".join(
        f'<div class="tp-xlab" style="left:{x:.1f}px">{esc(lab)}</div>'
        for x, (lab, _v) in zip(xs, pts))
    tval = (f'<div class="tp-val" '
            f'style="left:{xs[-1]:.1f}px;top:{ys[-1]:.1f}px">'
            f'{esc("%g" % vals[-1])}</div>' if vals else "")
    units = block.get("units", "")
    unit_html = f'<div class="tp-units">{esc(units)}</div>' if units else ""
    return (f'<div class="plot" style="height:{_PH}px">{unit_html}'
            f'<svg class="tp-svg" width="{_PW}" height="{_PH}" '
            f'viewBox="0 0 {_PW} {_PH}">{"".join(rules)}'
            f'<polyline points="{poly}" class="tp-line"/>{dots}{term}</svg>'
            f'{"".join(labels)}{xlabs}{tval}</div>')


def strip_html(block):
    """Distribution strip (VISUALS 3.13). Many observations of one measure,
    plotted against the value everyone assumes.

    One axis, one dot per observation with deterministic jitter, a labelled rule
    at the reference value, and the two extremes annotated. Nothing else.
    `anonymize: true` drops the per-observation annotations as well as the
    labels, per section 2.5: annotating the two extremes of twelve employees
    re-identifies the two people the clearance filter existed to protect."""
    obs = [x for x in (_num(t) for t in
                       re.split(r"[,\s]+", block.get("observations", "").strip())
                       if t) if x is not None]
    ref = _num(block.get("reference_value"))
    anon = str(block.get("anonymize", "")).strip().lower() in ("true", "yes", "1")
    top = max(obs + ([ref] if ref is not None else []) or [1.0])
    scale = top * 1.1 or 1.0
    unit = block.get("unit", "")
    fmt = (lambda v: ("%g %s" % (v, unit)).strip())

    dots = []
    for i, v in enumerate(sorted(obs)):
        # deterministic jitter: five lanes, so a dense cluster reads as density
        lane = (i % 5) - 2
        dots.append(f'<span class="ds-dot" style="left:{100.0*v/scale:.2f}%;'
                    f'top:calc(50% + {lane*26}px)"></span>')
    marks = ""
    if obs and not anon:
        lo, hi = min(obs), max(obs)
        marks = (f'<span class="ds-note ds-lo" style="left:{100.0*lo/scale:.2f}%">'
                 f'{esc(fmt(lo))}</span>'
                 f'<span class="ds-note ds-hi" style="left:{100.0*hi/scale:.2f}%">'
                 f'{esc(fmt(hi))}</span>')
    rule = ""
    if ref is not None:
        rule = (f'<span class="ds-ref" style="left:{100.0*ref/scale:.2f}%"></span>'
                f'<span class="ds-reflab" '
                f'style="left:{100.0*ref/scale:.2f}%">'
                f'{accent(block.get("reference_label", ""))}'
                f' &middot; {esc(fmt(ref))}</span>')
    axis = "".join(
        f'<span class="ds-ax" style="left:{100.0*k/4:.2f}%">'
        f'{esc("%g" % round(scale*k/4, 1))}</span>' for k in range(5))
    count = (f'<div class="ds-n">n = {len(obs)}'
             f'{" · positions, not names" if anon else ""}</div>') if obs else ""
    return (f'<div class="strip">{count}'
            f'<div class="ds-field"><span class="ds-line"></span>'
            f'{"".join(dots)}{rule}{marks}</div>'
            f'<div class="ds-axis">{axis}</div></div>')


# --------------------------------------------------------------------------- #
# 3.2 ranked bar list + 3.12 composition split  ->  bar rows
# --------------------------------------------------------------------------- #
def bars_html(block):
    """Ranked bar list (VISUALS 3.2), ragged track and fixed track.

    No axis, no gridlines, no tick labels, no legend: the reference image has
    none of the four and loses nothing. On the ragged track the value sits INSIDE
    the right end of the bar, because an outside gutter shortens every bar and
    flattens the gaps that are the whole point (section 6.2).

    `track: fixed` is the share-of-own-denominator variant absorbed from what was
    a separate archetype. Every row draws the same length, only the fill varies,
    the caps are square because a rounded cap has a minimum drawable width that
    inflates a 4% value, and the numeral lives in its own authoritative column so
    the bar is never read alone."""
    rows = [split_fields(i, 2) for i in block.get("items", [])]
    vals = [_num(v, 0.0) or 0.0 for _, v in rows]
    top = max(vals) if vals else 1.0
    fixed = block.get("track", "").strip().lower() == "fixed"
    hl = _num(block.get("highlight"))
    hl = int(hl) if hl is not None else None
    rem = block.get("remainder_label", "")

    out = []
    for i, ((label, raw), v) in enumerate(zip(rows, vals)):
        pct = (100.0 * v / (top or 1.0)) if not fixed else min(100.0, v)
        fill = ("var(--accent)" if (hl is not None and i + 1 == hl)
                else _ramp(len(rows) - 1 - i, len(rows), lo=34, hi=76))
        num = esc(raw.strip())
        if fixed:
            out.append(
                f'<div class="br-row br-fixed">'
                f'<div class="br-lab">{accent(label)}</div>'
                f'<div class="br-track"><div class="br-fill" data-ramp="bars" '
                f'style="width:{pct:.2f}%;background:{fill}"></div></div>'
                f'<div class="br-num">{num}</div></div>')
        else:
            out.append(
                f'<div class="br-row">'
                f'<div class="br-lab">{accent(label)}</div>'
                f'<div class="br-bar" data-ramp="bars" '
                f'style="width:{pct:.2f}%;background:{fill}">'
                f'<span class="br-in">{num}</span></div></div>')
    foot = (f'<div class="br-rem">{accent(rem)}</div>'
            if (fixed and rem) else "")
    return f'<div class="bars{" bars-fixed" if fixed else ""}">{"".join(out)}{foot}</div>'


def composition_html(block):
    """Composition split (VISUALS 3.12). Named parts of one stated whole, as a
    single full-width stacked bar.

    A segmented bar asserts exhaustiveness, so the parts must partition the
    stated whole; check_spec is what refuses a sum that is not 100. No pie and no
    donut: a pie forces angular comparison, which people read badly, and a
    segmented donut with a legend is a design tell of its own.

    Labels sit below in a two-column list and never inside a segment, which is
    also why the caps are square -- a rounded cap on a 4% slice draws wider than
    the number it stands for. `expectation` prints the belief the chart argues
    against, which is section 4.3's requirement that a chart be evidence for an
    argument rather than the subject of a post."""
    parts = [split_fields(i, 2) for i in block.get("items", [])]
    pcts = [_num(v, 0.0) or 0.0 for _, v in parts]
    lead = _num(block.get("leader"))
    lead = int(lead) if lead is not None else 1
    total = sum(pcts) or 100.0

    segs, keys = [], []
    for i, ((label, raw), p) in enumerate(zip(parts, pcts)):
        is_lead = (i + 1 == lead)
        fill = ("var(--accent)" if is_lead
                else _ramp(len(parts) - 1 - i, len(parts), lo=20, hi=78))
        segs.append(f'<div class="cs-seg" data-ramp="composition" '
                    f'style="flex:0 0 {100.0*p/total:.3f}%;background:{fill}"></div>')
        keys.append(f'<div class="cs-key">'
                    f'<span class="cs-sw" data-ramp="composition" '
                    f'style="background:{fill}"></span>'
                    f'<span class="cs-pct">'
                    f'{accent(raw.strip().rstrip("%"))}%</span>'
                    f'<span class="cs-lab">{accent(label)}</span></div>')
    exp = block.get("expectation", "")
    exp_html = (f'<div class="cs-exp">{accent(exp)}</div>' if exp else "")
    return (f'<div class="composition">{exp_html}'
            f'<div class="cs-bar">{"".join(segs)}</div>'
            f'<div class="cs-keys">{"".join(keys)}</div></div>')


# --------------------------------------------------------------------------- #
# 3.14 variance bridge  ->  waterfall
# --------------------------------------------------------------------------- #
def waterfall_html(block):
    """Variance bridge (VISUALS 3.14). A predicted value, an actual value, and
    the named contributions that reconcile them.

    A waterfall asserts that the listed contributions fully explain the gap, so
    the residual is drawn as its own labelled bar rather than absorbed into the
    last contribution or dropped. That is the one place in the catalog where a
    rounding decision is a truth claim, and check_spec refuses a spec whose
    contributions miss the delta with no `residual_label` to draw it with.

    Start and end are grounded at zero; everything between floats. Sign is a
    luminance step rather than a second hue, pending section 10 decision 2."""
    start_l, start_v = split_fields(block.get("start", ""), 2)
    end_l, end_v = split_fields(block.get("end", ""), 2)
    s0, e0 = _num(start_v, 0.0) or 0.0, _num(end_v, 0.0) or 0.0
    contrib = [split_fields(i, 2) for i in block.get("items", [])]
    steps = [(l, _num(v, 0.0) or 0.0) for l, v in contrib]
    resid = round(e0 - s0 - sum(v for _, v in steps), 6)
    if block.get("residual_label") and abs(resid) > 1e-9:
        steps.append((block["residual_label"], resid))
    payoff = _num(block.get("payoff"))
    payoff = int(payoff) if payoff is not None else None

    top = max([s0, e0] + [s0 + sum(v for _, v in steps[:k + 1])
                          for k in range(len(steps))] + [1.0])
    H = 590.0
    cols, cursor = [], s0

    def _bar(label, value, y0, y1, kind):
        lo, hi = min(y0, y1), max(y0, y1)
        bottom = H * lo / top
        height = max(3.0, H * (hi - lo) / top)
        fill = {"end": "var(--accent-deep)",
                "start": "var(--accent-deep)",
                "payoff": "var(--accent)",
                "up": "color-mix(in oklab, var(--accent) 62%, var(--bg))",
                "down": "color-mix(in oklab, var(--ink) 30%, var(--bg))"}[kind]
        sign = ("%+g" % value) if kind in ("up", "down", "payoff") else ("%g" % value)
        # A connector rule at the floating bar's foot, which is the level the
        # previous bar left off at. Grounded bars need none: they sit on zero.
        conn = ("" if kind in ("start", "end") else
                f'<span class="wf-conn" style="bottom:{H*y0/top:.1f}px"></span>')
        return (f'<div class="wf-col">'
                f'<div class="wf-plot" style="height:{H:.0f}px">{conn}'
                f'<div class="wf-bar wf-{kind}" '
                f'data-ramp="waterfall" style="bottom:{bottom:.1f}px;'
                f'height:{height:.1f}px;background:{fill}"></div>'
                f'<span class="wf-val" style="bottom:{bottom+height+6:.1f}px">'
                f'{esc(sign)}</span></div>'
                f'<div class="wf-lab">{accent(label)}</div></div>')

    cols.append(_bar(start_l, s0, 0, s0, "start"))
    for i, (label, v) in enumerate(steps):
        nxt = cursor + v
        kind = "payoff" if (payoff is not None and i + 1 == payoff) else (
            "up" if v >= 0 else "down")
        cols.append(_bar(label, v, cursor, nxt, kind))
        cursor = nxt
    cols.append(_bar(end_l, e0, 0, e0, "end"))
    return f'<div class="waterfall">{"".join(cols)}</div>'


# --------------------------------------------------------------------------- #
# 3.8 sourced shelf  ->  tile grid, group bands and a third card field
# --------------------------------------------------------------------------- #
def shelf_html(block):
    """Sourced shelf (VISUALS 3.8). Nine externally published items, grouped
    three and three and three under questions the reader is already asking.

    Provenance sits where an icon would go: the publisher is the card's visual
    anchor, set at card-title size or larger, because a fabricated report title
    is the most checkable lie in this catalog. Grouping is one hue stepped
    through three luminances -- bar, panel, card -- rather than by drawing boxes,
    and the section headers are questions in the reader's voice, since noun
    labels turn the page into a filing cabinet."""
    qs = [q.strip() for q in block.get("sections", "").split(";") if q.strip()]
    cards = [split_fields(i, 3) for i in block.get("items", [])]
    per = max(1, -(-len(cards) // max(1, len(qs)))) if qs else len(cards)

    bands = []
    for gi, q in enumerate(qs or [""]):
        group = cards[gi * per:(gi + 1) * per]
        if not group:
            continue
        cells = "".join(
            f'<div class="sh-card">'
            f'<div class="sh-pub">{accent(src)}</div>'
            f'<div class="sh-title">{accent(title)}</div>'
            f'<div class="sh-find">{accent(finding)}</div></div>'
            for src, title, finding in group)
        bands.append(
            f'<div class="sh-band" data-ramp="shelf" '
            f'style="background:{_ramp(0, 3, lo=10, hi=10)}">'
            f'<div class="sh-q" data-layer="claim" data-ramp="shelf" '
            f'style="background:{_ramp(0, 3, lo=26, hi=26)}">{accent(q)}</div>'
            f'<div class="sh-cards">{cells}</div></div>')
    return f'<div class="shelf">{"".join(bands)}</div>'


# --------------------------------------------------------------------------- #
# 3.6 analogy rows  ->  analogy rows
# --------------------------------------------------------------------------- #
def analogy_html(block):
    """Analogy rows (VISUALS 3.6). Jargon on the left as an everyday object, the
    real thing on the right, identical slot order in every row.

    Two columns and no illustration column: both reference images for this form
    carry hand-drawn pencil work, HTML cannot make it, and a geometric icon
    beside a real drawing reads as clip art (section 3.6's illustration problem,
    and section 9's first non-goal). The lost warmth is a stated cost.

    An `=` asserts equivalence and these equations are editorial rather than
    measured, which is why every row's equation is set in one place, in one
    weight, so the set is reviewable as a set before publish."""
    rows = []
    for raw in block.get("items", []):
        term, eq, facts = split_fields(raw, 3)
        fl = [f.strip() for f in facts.split(";") if f.strip()]
        rows.append(
            f'<div class="an-row">'
            f'<div class="an-left">{_claim("an-term", term)}'
            f'<span class="an-eq">=</span>'
            f'{_claim("an-pill", eq)}</div>'
            f'<ul class="an-facts">'
            + "".join(f'<li>{accent(f)}</li>' for f in fl)
            + '</ul></div>')
    return f'<div class="analogy">{"".join(rows)}</div>'


# --------------------------------------------------------------------------- #
# 3.15 quadrant map  ->  quadrant
# --------------------------------------------------------------------------- #
_QH = 880


def quadrant_html(block):
    """Quadrant map (VISUALS 3.15). Many items crossed on two independent
    dimensions.

    Every item label dies at 220px, so the four quadrant names carry the entire
    payload and are set as the claim layer. No axis title is rotated: section 5.3
    forbids 90-degree text outright, so the vertical dimension states its poles
    as two horizontal labels at the ends of its own axis.

    The form's signature dishonesty is a top-right quadrant holding only the
    author's own position, and no design gate can see it: axis choice is
    unfalsifiable. `placement_rule` printing in the subtitle is the one available
    counterweight, which is why check_spec requires it."""
    qs = [q.strip() for q in block.get("quadrants", "").split(";")]
    qs = (qs + ["", "", "", ""])[:4]
    xl, xh = split_fields(block.get("x_axis", ""), 2)
    yl, yh = split_fields(block.get("y_axis", ""), 2)
    hl = _num(block.get("highlight"))
    hl = int(hl) if hl is not None else None

    dots = []
    for i, raw in enumerate(block.get("items", [])):
        label, x, y = split_fields(raw, 3)
        px, py = _num(x, 50.0) or 50.0, _num(y, 50.0) or 50.0
        is_hi = hl is not None and i + 1 == hl
        cls = "qm-item" + (" qm-hi" if is_hi else "")
        side = "qm-r" if px < 50 else "qm-l"
        # the highlight fill is inline, not a `.qm-hi .qm-dot` override: a
        # descendant override would make check_layout's class map disagree with
        # what the browser paints, which is the one thing it cannot afford.
        fill = ' style="background:var(--accent)"' if is_hi else ""
        dots.append(f'<div class="{cls} {side}" '
                    f'style="left:{px:.2f}%;bottom:{py:.2f}%">'
                    f'<span class="qm-dot"{fill}></span>'
                    f'<span class="qm-lab">{accent(label)}</span></div>')
    names = "".join(
        f'<div class="qm-qname qm-q{i+1}" data-layer="claim">{accent(q)}</div>'
        for i, q in enumerate(qs) if q)
    return (f'<div class="quadrant" style="height:{_QH}px">'
            f'<div class="qm-field">'
            f'<span class="qm-ax qm-axv"></span><span class="qm-ax qm-axh"></span>'
            f'{names}{"".join(dots)}</div>'
            f'<div class="qm-poles">'
            f'<span class="qm-p qm-pl">{accent(xl)}</span>'
            f'<span class="qm-p qm-pr">{accent(xh)}</span></div>'
            f'<div class="qm-ytop">{accent(yh)}</div>'
            f'<div class="qm-ybot">{accent(yl)}</div></div>')


# --------------------------------------------------------------------------- #
# 3.10 stratified container + 3.11 mirrored rings  ->  banded cluster
# --------------------------------------------------------------------------- #
def _chips(names, cls="ic-chip"):
    return "".join(f'<span class="{cls}">{accent(c.strip())}</span>'
                   for c in names if c.strip())


def strata_html(block):
    """Stratified container (VISUALS 3.10). Many named items sorted into ordered
    strata inside a shape whose width tracks the counts.

    The width is computed from the item count, never chosen: a shape that
    changes width across strata with equal counts per stratum is wallpaper behind
    three plain lists, which is section 5.5's first corollary and section 6.2's
    tell. Monotonicity is the material's job and check_spec refuses a spec
    without it, because a gate the matcher can satisfy by sliding its own
    parameters is not a gate.

    One boundary is drawn heavier than the others, per section 3.10's note that a
    ranked diagram claiming tiers must draw at least one of them. `notes` are the
    author's opinions and are set in a typographically distinct voice, or the
    opinion reads as part of the data."""
    strata = [split_fields(i, 2) for i in block.get("items", [])]
    counts = [len([c for c in chips.split(";") if c.strip()])
              for _label, chips in strata]
    top = max(counts) if counts else 1
    hard = 1 if block.get("container", "").strip().lower() == "iceberg" else len(strata) - 1

    bands = []
    for i, ((label, chips), n) in enumerate(zip(strata, counts)):
        width = 46.0 + 54.0 * (n / (top or 1))
        fill = _ramp(i, len(strata), lo=26, hi=80)
        bands.append(
            f'<div class="ic-band{" ic-hard" if i == hard else ""}" '
            f'data-ramp="strata" '
            f'style="width:{width:.2f}%;background:{fill}">'
            f'<div class="ic-head"><span class="ic-ord">{i+1}</span>'
            f'<div class="ic-lab">{accent(label)}</div>'
            f'<span class="ic-count" data-layer="claim">{n}</span></div>'
            f'<div class="ic-chips">{_chips(chips.split(";"))}</div></div>')
    notes = [x.strip() for x in block.get("notes", "").split(";") if x.strip()]
    notes_html = ('<div class="ic-notes">'
                  + "".join(f'<p>{accent(x)}</p>' for x in notes)
                  + '</div>') if notes else ""
    return f'<div class="strata">{"".join(bands)}{notes_html}</div>'


def rings_html(block):
    """Mirrored rings (VISUALS 3.11), the reflection mode of the banded cluster
    and never its own template (section 8: the material shape is rare enough
    that a dedicated build may never earn itself).

    Three nested causally-ordered layers, split at the equator: the good version
    above, its failure twin below. Ring area grows as the square of the radius,
    so item counts must increase strictly outward or the rim looks starved while
    the core is jammed shut; check_spec refuses counts that do not. Ordinal
    numbers are mandatory, because nesting has no inherent direction and without
    1/2/3 the causal claim is unreadable.

    Label chips over a tinted field are translucent rather than opaque, per
    section 6.2, so the field's grouping signal survives. Good and bad are one
    accent against an ink-neutral, not two hues: section 10 decision 2 is open."""
    layers = [split_fields(i, 3) for i in block.get("items", [])]
    n = len(layers)

    def _half(seq, token, good, lo, hi):
        out = []
        for i, (label, pos, neg) in seq:
            items = pos if good else neg
            cnt = len([c for c in items.split(";") if c.strip()])
            width = 52.0 + 48.0 * ((i + 1) / max(1, n))
            fill = _ramp(i, n, token=token, lo=lo, hi=hi)
            out.append(
                f'<div class="mr-band" data-ramp="rings" '
                f'style="width:{width:.2f}%;background:{fill}">'
                f'<div class="ic-head"><span class="ic-ord">{i+1}</span>'
                f'<div class="ic-lab">{accent(label)}</div>'
                f'<span class="ic-count">{cnt}</span></div>'
                f'<div class="ic-chips">{_chips(items.split(";"))}</div></div>')
        return out

    idx = list(enumerate(layers))
    # The negative ramp stays light enough for ink to sit on it. A ramp with
    # one dark end and one light end cannot carry a single text colour, and
    # reversed type set globally is the failure section 5.4 measured.
    good = _half(list(reversed(idx)), "var(--accent)", True, 26, 74)
    bad = _half(idx, "var(--ink)", False, 12, 38)
    gl = block.get("good_label", "")
    bl = block.get("bad_label", "")
    return (f'<div class="rings"><div class="mr-half">{"".join(good)}</div>'
            f'<div class="mr-eqlab">{accent(gl)}</div>'
            f'<div class="mr-eq"></div>'
            f'<div class="mr-eqlab mr-eqbad">{accent(bl)}</div>'
            f'<div class="mr-half">{"".join(bad)}</div></div>')


CORE_BUILDERS = {
    "_smoke": lambda block: f'<div class="smoke">{accent(block.get("headline",""))}</div>',
    "numbered-steps": lambda block: steps_html(block.get("items", [])),
    "card-grid": lambda block: cardgrid_html(block.get("items", [])),
    "comparison-panel": lambda block: compare_html(block),
    "icon-list": lambda block: iconlist_html(block.get("items", [])),
    "funnel": lambda block: funnel_html(block.get("items", [])),
    "hybrid-playbook": lambda block: playbook_html(block),
    "annotated-diagram": lambda block: diagram_html(block),
    # Twelve signatures over nine builders. VISUALS section 8's table is the
    # authority on which signatures share geometry: the plot canvas serves the
    # trend poster and the distribution strip, bar rows serve the ranked list and
    # the composition split, and the banded cluster serves the stratified
    # container with the mirrored rings as its reflection mode.
    "perception-split": lambda block: split_panel_html(block),
    "causal-chain": lambda block: chain_html(block),
    "trend-poster": lambda block: trend_html(block),
    "distribution-strip": lambda block: strip_html(block),
    "ranked-bars": lambda block: bars_html(block),
    "composition-split": lambda block: composition_html(block),
    "variance-bridge": lambda block: waterfall_html(block),
    "sourced-shelf": lambda block: shelf_html(block),
    "analogy-rows": lambda block: analogy_html(block),
    "quadrant-map": lambda block: quadrant_html(block),
    "stratified-container": lambda block: strata_html(block),
    "mirrored-rings": lambda block: rings_html(block),
}


# --------------------------------------------------------------------------- #
# shell (head + core + footer bar)
# --------------------------------------------------------------------------- #
def render_canvas(meta, block, theme):
    arch = block["archetype"]
    core = CORE_BUILDERS.get(arch, CORE_BUILDERS["_smoke"])(block)

    headline = accent(block.get("headline", ""))
    sub = esc(block.get("sub", ""))
    # Signature, not a CTA bar (PRD section 10.3). Every string is spec-supplied
    # and there is no default: an engine that ships a default tagline ships
    # somebody's tagline. `wordmark` is the author's name, read off identity.md
    # by the workflow; `footer` is the source line on a data image, else empty.
    footer = esc(block.get("footer", meta.get("footer", "")))
    wordmark = esc(meta.get("wordmark", ""))
    has_mark = bool(theme.get("logo"))

    # No eyebrows: a `kicker` is never rendered (hard rule; check_spec errors on it).
    head_h1 = (f'<h1 class="h1" data-layer="claim">{headline}</h1>'
               if headline else "")
    sub_html = f'<p class="sub">{sub}</p>' if sub else ""
    head_html = (f'<header class="head">{head_h1}{sub_html}</header>'
                 if (head_h1 or sub_html) else "")

    mark_html = '<span class="mark"></span>' if has_mark else ""
    wm_html = (f'<span class="wm">{mark_html}{wordmark}</span>'
               if (wordmark or mark_html) else "")
    foot_html = (f'<footer class="footbar">{wm_html}'
                 f'<span class="fmeta">{footer}</span></footer>')

    return (f'<div class="canvas">'
            f'<div class="pad">{head_html}<div class="core">{core}</div></div>'
            f'{foot_html}</div>')


# --------------------------------------------------------------------------- #
# assembly + Chrome
# --------------------------------------------------------------------------- #
def build_html(meta, block, theme):
    """Assemble the document: theme.json tokens, then _base.css structure.

    Points the asset registry at the theme's own profile first, so every icon
    and the logo resolve inside the directory this theme came from and a stale
    profile from an earlier render in the same process cannot leak in."""
    if theme.get("_profile"):
        _assets.set_profile(theme["_profile"])
    base = (HERE / "themes" / "_base.css").read_text()
    canvas = render_canvas(meta, block, theme)
    title = esc(meta.get("title", "Infographic"))
    return (f"<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
            f"<title>{title}</title>\n<style>\n{theme_css(theme)}\n{base}\n</style>\n"
            f"</head>\n<body>\n{canvas}\n</body>\n</html>\n")


def _render_doc_to_png(html_doc, out_path):
    """Write <out>.html beside the PNG, then drive headless Chrome to screenshot
    a 1080x1350 window at 2x scale.

    The HTML is kept, not deleted: the design gate reads rendered HTML as text
    rather than screenshotting it (PRD section 4's cost argument), so it needs a
    file to read. It lands inside the profile because out_path does, and
    _guard_out is what enforces that."""
    out_path = pathlib.Path(out_path)
    html_path = out_path.with_suffix(out_path.suffix + ".html")
    html_path.parent.mkdir(parents=True, exist_ok=True)
    html_path.write_text(html_doc)
    try:
        subprocess.run(
            [CHROME, "--headless=new", "--disable-gpu", "--hide-scrollbars",
             "--allow-file-access-from-files",
             "--run-all-compositor-stages-before-draw",
             "--virtual-time-budget=12000",
             "--force-device-scale-factor=2", "--window-size=1080,1350",
             f"--screenshot={out_path}", f"file://{html_path}"],
            check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        err = (e.stderr or b"").decode(errors="replace").strip()
        raise RuntimeError(
            f"Chrome render failed (exit {e.returncode}):\n{err}") from e
    return out_path


def _guard_out(profile, out_path):
    """PRD section 1.3: every write lands inside profiles/<handle>/. The engine
    does not need to know what a profile is -- it enforces that --out resolves
    inside --profile, and the caller passes profiles/<handle> as --profile."""
    profile = pathlib.Path(profile).resolve()
    out = pathlib.Path(out_path).resolve()
    if profile not in out.parents:
        raise ValueError(
            "refusing to write outside the profile: --out %s is not inside "
            "--profile %s" % (out, profile))
    return out


def render_png(spec_path, out_path, profile):
    """Render a spec to <out_path>, writing <out_path>.html beside it.

    `profile` is the profile directory: it holds theme.json, any `logo` and any
    `icons/` the theme names, and it is the only tree this call writes into."""
    profile = pathlib.Path(profile)
    out = _guard_out(profile, out_path)
    theme = load_theme(profile / "theme.json")
    meta, blocks = parse_spec(pathlib.Path(spec_path).read_text())
    if not blocks:
        raise ValueError("spec has no `:: <archetype>` block")
    return _render_doc_to_png(build_html(meta, blocks[0], theme), out)


# --------------------------------------------------------------------------- #
# validator
# --------------------------------------------------------------------------- #
# --------------------------------------------------------------------------- #
# spec structure: the section 3 disqualifiers that are arithmetic
# --------------------------------------------------------------------------- #
# ERROR is reserved for a clause that is exact: a count, a sum, a monotonic
# ordering, an empty quadrant. WARN carries every clause resting on one of the
# ratios VISUALS section 3 tags [UNVERIFIED 2026-08-17, owner Joseph] -- 1.4x,
# 3x, 2x, 1.15x. Blocking a render on a number the spec itself says is a starting
# value would be marking our own homework; printing the measured number next to
# the threshold is what lets the first ten renders settle it.
def _items_of(b):
    return [x for x in b.get("items", []) if x.strip()]


def _semi(v):
    return [x.strip() for x in (v or "").split(";") if x.strip()]


def _structure(arch, b, tag):
    """Return problems for the section 3 clauses that are exact arithmetic on
    the spec. Selection is still VISUALS section 2's job and this does not
    repeat it: what this catches is a spec whose numbers contradict the form it
    claims, which is the geometry lying while every word stays true."""
    out, items = [], _items_of(b)

    if arch == "perception-split" and len(items) != 4:
        out.append(f"ERROR {tag}: perception split needs exactly 4 parallel "
                   f"items plus 1 punchline, got {len(items)}. Symmetric or "
                   f"short counts kill the asymmetry, which is the content "
                   f"(VISUALS 3.5)")

    if arch == "composition-split":
        pcts = [_num(split_fields(i, 2)[1], 0.0) or 0.0 for i in items]
        total = round(sum(pcts), 3)
        if items and abs(total - 100.0) > 1.0:
            out.append(f"ERROR {tag}: parts sum to {total:g}, not 100 (+/-1). A "
                       f"segmented bar asserts exhaustiveness; either draw the "
                       f"remainder or use ranked-bars (VISUALS 3.12)")

    if arch == "variance-bridge":
        s = _num(split_fields(b.get("start", ""), 2)[1], 0.0) or 0.0
        e = _num(split_fields(b.get("end", ""), 2)[1], 0.0) or 0.0
        steps = [_num(split_fields(i, 2)[1], 0.0) or 0.0 for i in items]
        resid = round(e - s - sum(steps), 6)
        if abs(resid) > 1e-6 and not (b.get("residual_label") or "").strip():
            out.append(f"ERROR {tag}: contributions leave {resid:+g} unexplained "
                       f"and there is no residual_label to draw it with. An "
                       f"unexplained residue drawn as if it were explained is "
                       f"what makes a waterfall dishonest (VISUALS 3.14)")
        gap = abs(e - s)
        if s and gap < 0.10 * abs(s):
            out.append(f"WARN  {tag}: gap is {100.0*gap/abs(s):.1f}% of the base, "
                       f"under ~10%, so every intermediate bar is a sliver "
                       f"(VISUALS 3.14, unverified ratio)")

    if arch == "stratified-container":
        counts = [len(_semi(split_fields(i, 2)[1])) for i in items]
        deltas = [b_ - a_ for a_, b_ in zip(counts, counts[1:])]
        if deltas and not (all(d <= -2 for d in deltas) or all(d >= 2 for d in deltas)):
            out.append(f"ERROR {tag}: stratum counts {counts} do not change "
                       f"monotonically by at least 2 per step. Item counts must "
                       f"track the container's width or the shape is wallpaper "
                       f"behind plain lists (VISUALS 3.10)")
        total = sum(counts)
        if items and not (18 <= total <= 26) and not (total >= 25 and len(items) == 5):
            out.append(f"WARN  {tag}: {total} items across {len(items)} strata; "
                       f"VISUALS 3.10 measured 18-26, and 5 strata need 25+")

    if arch == "mirrored-rings":
        good = [len(_semi(split_fields(i, 3)[1])) for i in items]
        bad = [len(_semi(split_fields(i, 3)[2])) for i in items]
        for name, seq in (("positive", good), ("negative", bad)):
            if seq and any(x >= y for x, y in zip(seq, seq[1:])):
                out.append(f"ERROR {tag}: {name} counts {seq} do not increase "
                           f"strictly outward. Ring area grows as the square of "
                           f"the radius, so equal counts starve the rim and jam "
                           f"the core (VISUALS 3.11)")
            if any(not 4 <= c <= 7 for c in seq):
                out.append(f"ERROR {tag}: {name} counts {seq} outside 4-7 per "
                           f"layer (VISUALS 3.11)")
        if good and bad and good != bad:
            out.append(f"WARN  {tag}: good/bad counts differ per layer "
                       f"({good} vs {bad}); matching slots are what make the "
                       f"pairs read as antonyms (VISUALS 3.11)")

    if arch == "ranked-bars":
        vals = [_num(split_fields(i, 2)[1], 0.0) or 0.0 for i in items]
        fixed = (b.get("track", "") or "").strip().lower() == "fixed"
        if vals and min(vals) > 0:
            ratio = max(vals) / min(vals)
            floor = 3.0 if fixed else 1.4
            if ratio < floor:
                out.append(f"WARN  {tag}: top value is {ratio:.2f}x the lowest, "
                           f"under {floor:g}x, which is where the form draws "
                           f"nothing (VISUALS 3.2, unverified ratio)")
        if vals and not fixed and min(vals) < 0.10 * max(vals):
            out.append(f"WARN  {tag}: smallest bar is under 10% of the largest "
                        f"and is not labelable (VISUALS 3.2, unverified ratio)")
        if vals and abs(sum(vals) - 100.0) <= 1.0 and not fixed:
            out.append(f"ERROR {tag}: values sum to 100, which is a composition "
                       f"and not a ranking. Bars assert independent magnitudes "
                       f"(VISUALS 3.2 disqualifier; use composition-split)")

    if arch == "distribution-strip":
        obs = [x for x in (_num(t) for t in
                           re.split(r"[,\s]+", (b.get("observations") or "").strip())
                           if t) if x is not None]
        if obs and len(obs) < 8:
            out.append(f"ERROR {tag}: {len(obs)} observations, under 8, where "
                       f"individual dots read as a list rather than a "
                       f"distribution (VISUALS 3.13)")
        if len(obs) > 30:
            out.append(f"ERROR {tag}: {len(obs)} observations, over 30 "
                       f"(VISUALS 3.13)")
        if obs and min(obs) > 0 and max(obs) / min(obs) < 3.0:
            out.append(f"WARN  {tag}: spread is {max(obs)/min(obs):.2f}x, under "
                       f"3x, where the strip is a thick dot (VISUALS 3.13, "
                       f"unverified ratio)")

    if arch == "trend-poster":
        vals = [_num(split_fields(i, 2)[1], 0.0) or 0.0 for i in items]
        y_max = _num(b.get("y_max"))
        if vals and y_max is not None and y_max < 1.15 * max(vals):
            out.append(f"WARN  {tag}: y_max {y_max:g} is under 1.15x the top "
                       f"datum {max(vals):g}; the renderer raised it so the "
                       f"terminal point does not touch the frame (VISUALS 3.1)")
        if any(v < 0 for v in vals):
            out.append(f"ERROR {tag}: negative values, and this form starts its "
                       f"axis at zero (VISUALS 3.1)")

    if arch == "sourced-shelf":
        qs = _semi(b.get("sections", ""))
        if qs and len(qs) != 3:
            out.append(f"ERROR {tag}: {len(qs)} section questions, and the form "
                       f"partitions 3/3/3 (VISUALS 3.8)")
        thin = [split_fields(i, 3) for i in items]
        if any(not (s.strip() and t.strip()) for s, t, _f in thin):
            out.append(f"ERROR {tag}: every card needs a publisher and a title. "
                       f"This form has the highest fabrication surface in the "
                       f"catalog (VISUALS 3.8, and section 4)")

    if arch == "quadrant-map":
        seen = set()
        for raw in items:
            _l, x, y = split_fields(raw, 3)
            px, py = _num(x, 50.0) or 50.0, _num(y, 50.0) or 50.0
            seen.add((px >= 50, py >= 50))
        if items and len(seen) < 4:
            out.append(f"ERROR {tag}: {4-len(seen)} of 4 quadrants are empty. An "
                       f"empty quadrant means the axes are not independent, and "
                       f"the honest form is a ranked list on whichever axis is "
                       f"doing the work (VISUALS 3.15)")
    return out


def _budgets(arch, b, tag):
    """VISUALS section 6.3 row 4: an over-budget string fails the build."""
    out = []
    spec = BUDGETS.get(arch, {})
    lo_hi = spec.get("_items")
    items = _items_of(b)
    if lo_hi and items and not (lo_hi[0] <= len(items) <= lo_hi[1]):
        out.append(f"ERROR {tag}: {len(items)} items, budget {lo_hi[0]}-{lo_hi[1]}")
    for field, budget in spec.items():
        if field == "_items":
            continue
        if field == "items":
            for it in items:
                if len(it) > budget:
                    out.append(f"ERROR {tag}: item over {budget} chars "
                               f"({len(it)}): '{it[:44]}'")
        else:
            v = (b.get(field) or "").strip()
            if len(v) > budget:
                out.append(f"ERROR {tag}: '{field}' over {budget} chars "
                           f"({len(v)}): '{v[:44]}'")
    words = len(re.sub(r"\*\*", "", b.get("headline", "")).split())
    if words > 8:
        out.append(f"ERROR {tag}: headline {words} words, budget 3-8 "
                   f"(VISUALS 5.1)")
    return out


def _present(block, name):
    v = block.get(name)
    if isinstance(v, list):
        return bool(v)
    return bool((v or "").strip())


def check_spec(meta, blocks):
    """Return a list of WARN/ERROR strings for a parsed spec."""
    out = []
    if not blocks:
        return ["ERROR: spec has no `:: <archetype>` block"]
    if len(blocks) > 1:
        out.append(f"ERROR: {len(blocks)} blocks found; an infographic spec "
                   f"must have exactly one layout block")
    for b in blocks:
        arch = b.get("archetype", "")
        tag = f"block ({arch or '?'})"
        if arch not in KNOWN_ARCHETYPES:
            out.append(f"ERROR {tag}: unknown archetype '{arch}'")
            continue
        if (b.get("kicker") or "").strip():
            out.append(f"ERROR {tag}: 'kicker'/eyebrow present (hard rule: no eyebrows)")
        for req in REQUIRED.get(arch, []):
            if not _present(b, req):
                out.append(f"ERROR {tag}: missing required field '{req}'")
        if arch in SOURCE_REQUIRED and not (
                (b.get("footer") or "").strip() or (meta.get("footer") or "").strip()):
            out.append(f"ERROR {tag}: a data archetype with no source line. Set "
                       f"`footer:` to the source; VISUALS 4.1 step 7 is no line, "
                       f"no render, and 4.2 is why")
        out.extend(_budgets(arch, b, tag))
        out.extend(_structure(arch, b, tag))
    # No language scan here. --check validates spec grammar only: the words on
    # the canvas are draft.md, and reference/ai-tells.md via `engine.js
    # gate --report` at pipeline step 5 is their single authority. A second
    # lexicon in this file was five of section 9's banned words plus a
    # zero-tolerance em-dash error, with no drift check against ai-tells.md and
    # no strikethrough when a rule retires -- so it would have gone on failing
    # renders for a rule section 9 had already struck. Removed 2026-08-20.
    return out


# --------------------------------------------------------------------------- #
# layout checks: VISUALS section 6.3, run on the generated HTML as text
# --------------------------------------------------------------------------- #
# These read the document render.py just built, never a screenshot, per PRD
# section 4's cost argument: looking at a 1080x1350 image costs roughly 1,900
# tokens every time and the HTML is free.
#
# Three of section 6.3's five checks live here. The fourth (required-parameter
# fill) is spec grammar and lives in check_spec. The fifth (line-budget overflow)
# is NOT built and is not faked: see check_layout's docstring.
#
# The colour work below exists because every fill in this engine is a
# color-mix(in oklab, ...) that only a browser resolves. Python has to redo the
# mix to say anything about it, which is about forty lines of matrix and no
# dependency, exactly as VISUALS section 6.3 anticipated.
_CAP_RATIO = 0.70          # cap height as a share of font-size, Latin display
                           # faces. [UNVERIFIED 2026-08-24] -- a real cap height
                           # needs the font, which theme.json only names.
_THUMB_W = 220.0           # VISUALS section 1's feed width
_CANVAS_W = 1080.0
_CLAIM_CAP_FLOOR = 40.0    # at canvas width. [UNVERIFIED 2026-08-17, Joseph]
_TINT_DELTA_L = 0.04       # OKLab lightness. [UNVERIFIED 2026-08-17, Joseph]


def _oklab(hex_str):
    """sRGB hex -> OKLab (L, a, b). Bjorn Ottosson's matrices."""
    def lin(c):
        c /= 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    r, g, b = [lin(c) for c in _rgb(hex_str)]
    l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
    m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
    s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
    l, m, s = [x ** (1 / 3) if x >= 0 else -((-x) ** (1 / 3)) for x in (l, m, s)]
    return (0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
            1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
            0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s)


def _oklab_hex(lab):
    """OKLab -> sRGB hex, clamped."""
    L, A, B = lab
    l = (L + 0.3963377774 * A + 0.2158037573 * B) ** 3
    m = (L - 0.1055613458 * A - 0.0638541728 * B) ** 3
    s = (L - 0.0894841775 * A - 1.2914855480 * B) ** 3
    r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s
    g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s
    b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s

    def srgb(c):
        c = max(0.0, min(1.0, c))
        c = 12.92 * c if c <= 0.0031308 else 1.055 * c ** (1 / 2.4) - 0.055
        return int(round(max(0.0, min(1.0, c)) * 255))
    return "#%02X%02X%02X" % (srgb(r), srgb(g), srgb(b))


def _split_args(s):
    """Top-level comma split, so a nested color-mix() survives."""
    out, depth, cur = [], 0, ""
    for ch in s:
        if ch == "(":
            depth += 1
        elif ch == ")":
            depth -= 1
        if ch == "," and depth == 0:
            out.append(cur)
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur)
    return [x.strip() for x in out]


def theme_tokens(theme):
    """The :root block theme_css() emits, as a name -> expression map. Read from
    theme_css rather than restated, so there is one source for the tokens."""
    return dict(re.findall(r"^\s*(--[a-z0-9-]+)\s*:\s*([^;]+);",
                           theme_css(theme), re.M))


def resolve_color(expr, tokens, over=None, depth=0):
    """Resolve a CSS colour expression to a hex string, or None.

    Handles the three forms this engine emits: a literal hex from theme.json, a
    var(--token), and color-mix(in oklab, A p%, B). `over` is what a transparent
    term composites against, which is how a translucent chip on a tinted band
    gets a real colour to be measured against."""
    expr = (expr or "").strip().rstrip(";")
    if not expr or depth > 8:
        return None
    if expr.startswith("#"):
        try:
            _rgb(expr)
            return expr
        except ValueError:
            return None
    if expr in ("transparent", "none"):
        return over
    m = re.match(r"^var\(\s*(--[a-z0-9-]+)\s*\)$", expr)
    if m:
        return resolve_color(tokens.get(m.group(1), ""), tokens, over, depth + 1)
    m = re.match(r"^color-mix\(\s*in\s+oklab\s*,(.*)\)$", expr, re.S)
    if m:
        args = _split_args(m.group(1))
        if len(args) != 2:
            return None
        parts = []
        for a in args:
            mm = re.search(r"\s(\d+(?:\.\d+)?)%$", a)
            pct = float(mm.group(1)) if mm else None
            parts.append((re.sub(r"\s\d+(?:\.\d+)?%$", "", a).strip(), pct))
        (ea, pa), (eb, pb) = parts
        if pa is None and pb is None:
            pa = pb = 50.0
        elif pa is None:
            pa = 100.0 - pb
        elif pb is None:
            pb = 100.0 - pa
        ca, cb = (resolve_color(ea, tokens, over, depth + 1),
                  resolve_color(eb, tokens, over, depth + 1))
        if not ca or not cb:
            return None
        wa = pa / (pa + pb) if (pa + pb) else 0.5
        la, lb = _oklab(ca), _oklab(cb)
        return _oklab_hex(tuple(wa * x + (1 - wa) * y for x, y in zip(la, lb)))
    return None


def _css_props(css_text):
    """class name -> the declarations the structure sheet gives it.

    Keyed on the LAST class in a selector, which is what `.card .ct` means for a
    node carrying `ct`. Known ceiling: it cannot see specificity or a descendant
    condition, so a class used under two different parents resolves to whichever
    rule the sheet declares last. Every block in _base.css uses a unique prefix,
    which is what makes that safe here; it would not be safe on a general sheet."""
    css = re.sub(r"/\*.*?\*/", "", css_text, flags=re.S)
    out = {}
    for sel, body in re.findall(r"([^{}]+)\{([^{}]*)\}", css):
        decls = {}
        for d in body.split(";"):
            if ":" in d:
                k, v = d.split(":", 1)
                decls[k.strip()] = v.strip()
        keep = {k: v for k, v in decls.items()
                if k in ("font-size", "color", "background", "background-color",
                         "font-weight")}
        if not keep:
            continue
        for part in sel.split(","):
            classes = re.findall(r"\.([A-Za-z0-9_-]+)", part)
            if classes:
                out.setdefault(classes[-1], {}).update(keep)
    return out


class _Paint(_HTMLParser):
    """Walk the document carrying (background, colour, font-size) down the tree,
    the way CSS inheritance does, and record every text node that lands on a
    fill. That is the operand for the reversed-label contrast check: section 5.4
    measured a white numeral on a yellow chip at under 3:1, and the failure is
    invisible in the HTML unless somebody resolves the two colours."""

    def __init__(self, css, tokens, page_bg):
        _HTMLParser.__init__(self, convert_charrefs=True)
        self.css, self.tokens, self.page_bg = css, tokens, page_bg
        self.stack = [{"bg": page_bg, "color": tokens.get("--ink", ""),
                       "size": 16.0, "weight": 400}]
        self.texts = []      # (fill_hex, color_expr, size, weight, text)
        self.claims = []     # (size, text)
        self.ramps = []      # (ramp_name, fill_expr)

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        top = self.stack[-1]
        node = dict(top)
        classes = (a.get("class") or "").split()
        decls = {}
        for c in classes:
            decls.update(self.css.get(c, {}))
        style = a.get("style") or ""
        for d in style.split(";"):
            if ":" in d:
                k, v = d.split(":", 1)
                decls[k.strip()] = v.strip()
        bg_expr = decls.get("background") or decls.get("background-color")
        if bg_expr:
            hexv = resolve_color(bg_expr.split(" center")[0], self.tokens,
                                 over=top["bg"])
            if hexv:
                node["bg"] = hexv
        if decls.get("color"):
            node["color"] = decls["color"]
        m = re.match(r"^(\d+(?:\.\d+)?)px$", (decls.get("font-size") or "").strip())
        if m:
            node["size"] = float(m.group(1))
        w = (decls.get("font-weight") or "").strip()
        if w.isdigit():
            node["weight"] = int(w)
        if a.get("data-ramp") and bg_expr:
            self.ramps.append((a["data-ramp"], bg_expr))
        node["claim"] = (a.get("data-layer") == "claim"
                         or bool(top.get("claim")))
        if tag not in ("br", "img", "input", "meta", "link", "circle", "line",
                       "polyline", "polygon", "path", "rect", "use"):
            self.stack.append(node)
        self._last = node

    def handle_startendtag(self, tag, attrs):
        """A self-closing tag gets no end tag, so nothing may pop for it.

        HTMLParser's default runs handle_starttag then handle_endtag, and every
        self-closed SVG child (`<circle/>`, `<line/>`, `<polyline/>`) would pop a
        level nobody pushed. That walked the stack down to the root, and every
        text node after an inline chart resolved against the page ground instead
        of against its real parent -- a silent blind spot in the contrast check,
        which is the one check here that fails a build."""
        depth = len(self.stack)
        self.handle_starttag(tag, attrs)
        del self.stack[depth:]

    def handle_endtag(self, tag):
        if len(self.stack) > 1:
            self.stack.pop()

    def handle_data(self, data):
        text = data.strip()
        if not text or text.startswith("{") or ":root" in text:
            return
        node = self.stack[-1]
        if node.get("claim"):
            self.claims.append((node["size"], text))
        if node["bg"] and node["bg"].upper() != self.page_bg.upper():
            self.texts.append((node["bg"], node["color"], node["size"],
                               node["weight"], text))


def check_layout(html_doc, theme):
    """Three of VISUALS section 6.3's five checks, on the built document.

    1. **Thumbnail legibility.** Every `data-layer="claim"` node's declared
       font-size against section 1's floor, scaled to 220px. WARN, not ERROR:
       the 40px cap height is an interpolation between measured 73-105px
       headlines and 13-30px bodies with nothing observed between, tagged
       [UNVERIFIED 2026-08-17, owner Joseph], and section 1 says to tune it on
       the first ten renders. **Known ceiling: it reads the declared size, not a
       rendered one.** It cannot see a wrap, a shrink-to-fit, or a font whose cap
       ratio differs from 0.70.
    2. **Tint against background.** Every generated ramp step (`data-ramp`)
       re-mixed in OKLab and compared to the page ground. WARN for the same
       reason: 0.04 is derived from one measured failure.
    3. **Reversed-label contrast.** Every text node landing on a fill, against
       that fill. **ERROR**, because 4.5:1 and 3:1 are WCAG rather than one of
       section 3's untagged ratios, and a white numeral on a yellow chip is
       unreadable whatever this engine decides to call it.

    **Section 6.3's fifth check, line-budget overflow, is not built and is not
    faked.** It asks for a rendered line count per slot, which needs glyph
    metrics for a font this engine only ever names: theme.json carries a font
    stack and the face resolves in Chrome, on the machine, at render time. A
    character-count proxy for it is the required-parameter check in check_spec
    wearing a different name, and section 6.3 is explicit that row 5 exists
    because a character budget is what row 4 already covers. The honest build is
    a measurement pass: inject a script that writes
    `getClientRects().length` onto each slot, run Chrome with `--dump-dom`, and
    read the attributes back out of the dumped HTML. That needs no dependency and
    costs a second Chrome launch per render, and it does not exist yet.
    """
    out = []
    tokens = theme_tokens(theme)
    page_bg = resolve_color(tokens.get("--bg", ""), tokens) or theme.get("bg")
    css = _css_props((HERE / "themes" / "_base.css").read_text())

    p = _Paint(css, tokens, page_bg)
    p.feed(html_doc)

    floor_px = _CLAIM_CAP_FLOOR / _CAP_RATIO          # font-size at 1080
    # Grouped by declared size: a claim node's children inherit the layer, so
    # one headline is several text nodes and one line per node would be noise.
    short = {}
    for size, text in p.claims:
        if size + 0.01 < floor_px:
            short.setdefault(size, []).append(text)
    for size in sorted(short):
        texts = short[size]
        cap_220 = size * _CAP_RATIO * (_THUMB_W / _CANVAS_W)
        out.append(
            f"WARN  thumbnail: {len(texts)} claim-layer node(s) at {size:g}px "
            f"are ~{cap_220:.1f}px cap at 220px, under ~8px "
            f"(VISUALS 1, unverified floor): '{texts[0][:40]}'")

    bg_lab = _oklab(page_bg)
    seen = set()
    for name, expr in p.ramps:
        if (name, expr) in seen:
            continue
        seen.add((name, expr))
        hexv = resolve_color(expr, tokens, over=page_bg)
        if not hexv:
            continue
        d = abs(_oklab(hexv)[0] - bg_lab[0])
        if d < _TINT_DELTA_L:
            out.append(f"WARN  tint: '{name}' step {hexv} is {d:.3f} OKLab L "
                       f"from the page ground, under {_TINT_DELTA_L}, so it "
                       f"collapses at 220px (VISUALS 5.4, unverified floor)")

    for fill, color_expr, size, weight, text in p.texts:
        ink = resolve_color(color_expr, tokens, over=fill)
        if not ink:
            continue
        large = size >= 24.0 or (size >= 18.66 and weight >= 700)
        need = 3.0 if large else 4.5
        got = _contrast(ink, fill)
        if got + 0.01 < need:
            out.append(f"ERROR contrast: {ink} on {fill} is {got:.2f}:1, under "
                       f"{need}:1 at {size:g}px (VISUALS 6.3): '{text[:40]}'")
    return out


# --------------------------------------------------------------------------- #
# CLI
# --------------------------------------------------------------------------- #
def main(argv=None):
    argv = list(sys.argv[1:] if argv is None else argv)
    overrides, rest = {}, []
    for tok in argv:
        if "=" in tok and not tok.startswith("-"):
            k, v = tok.split("=", 1)
            overrides[k.strip()] = v.strip()
        else:
            rest.append(tok)

    p = argparse.ArgumentParser(
        prog="render.py",
        description="Render an infographic spec to PNG (or --check it).")
    p.add_argument("spec", help="path to the Markdown spec")
    p.add_argument("--profile",
                   help="profiles/<handle>/ -- holds theme.json, and is the "
                        "only tree this writes into. Required unless --check.")
    p.add_argument("--out",
                   help="output PNG path. Must be inside --profile. "
                        "<out>.html is written beside it and kept, because the "
                        "design gate reads the HTML as text.")
    p.add_argument("--html-only", action="store_true",
                   help="write <out>.html and stop. No Chrome. This is what "
                        "the design gate runs against.")
    p.add_argument("--check", action="store_true",
                   help="validate the spec and exit (no profile, no render)")
    args = p.parse_args(rest)

    meta, blocks = parse_spec(pathlib.Path(args.spec).read_text())
    meta.update(overrides)

    if args.check:
        problems = check_spec(meta, blocks)
        for line in problems:
            print(line)
        errs = [x for x in problems if x.startswith("ERROR")]
        if errs:
            print(f"\n{len(errs)} error(s).")
            return 1
        print("check: OK" if not problems else "\ncheck: warnings only.")
        return 0

    if not blocks:
        print("ERROR: spec has no `:: <archetype>` block")
        return 1
    if not args.profile or not args.out:
        print("ERROR: --profile and --out are both required to render. "
              "Every write lands inside profiles/<handle>/ (PRD 1.3).")
        return 1

    # The four documented failures print one clean line instead of a traceback:
    # a write outside the profile, a theme missing keys, a logo that is not
    # there, and Chrome. workflows/infographic.md's failure table is this list.
    try:
        out = _guard_out(args.profile, args.out)
        theme = load_theme(pathlib.Path(args.profile) / "theme.json")
        doc = build_html(meta, blocks[0], theme)
        # VISUALS section 6.3 runs here rather than under --check, because two of
        # the three need the theme's resolved colours and --check takes no
        # profile. WARNs print and the render proceeds; a contrast ERROR stops
        # it, because an unreadable reversed label is not a taste call.
        problems = check_layout(doc, theme)
        for line in problems:
            print(line)
        if [x for x in problems if x.startswith("ERROR")]:
            print("layout check failed. Fix the spec or the theme, "
                  "not the generated HTML.")
            return 1
        if args.html_only:
            html_path = out.with_suffix(out.suffix + ".html")
            html_path.parent.mkdir(parents=True, exist_ok=True)
            html_path.write_text(doc)
            print(html_path)
            return 0
        _render_doc_to_png(doc, out)
    except (ValueError, OSError, RuntimeError) as e:
        print("ERROR: %s" % e)
        return 1
    print(out)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
