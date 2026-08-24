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
}
KNOWN_ARCHETYPES = set(REQUIRED)

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
            f'<div class="ftrap" style="clip-path:{clip};-webkit-clip-path:{clip};'
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


CORE_BUILDERS = {
    "_smoke": lambda block: f'<div class="smoke">{accent(block.get("headline",""))}</div>',
    "numbered-steps": lambda block: steps_html(block.get("items", [])),
    "card-grid": lambda block: cardgrid_html(block.get("items", [])),
    "comparison-panel": lambda block: compare_html(block),
    "icon-list": lambda block: iconlist_html(block.get("items", [])),
    "funnel": lambda block: funnel_html(block.get("items", [])),
    "hybrid-playbook": lambda block: playbook_html(block),
    "annotated-diagram": lambda block: diagram_html(block),
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
    head_h1 = f'<h1 class="h1">{headline}</h1>' if headline else ""
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
    # No language scan here. --check validates spec grammar only: the words on
    # the canvas are draft.md, and reference/ai-tells.md via `engine.js
    # gate --report` at pipeline step 5 is their single authority. A second
    # lexicon in this file was five of section 9's banned words plus a
    # zero-tolerance em-dash error, with no drift check against ai-tells.md and
    # no strikethrough when a rule retires -- so it would have gone on failing
    # renders for a rule section 9 had already struck. Removed 2026-08-20.
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
