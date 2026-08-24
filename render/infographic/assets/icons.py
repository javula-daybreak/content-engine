"""Asset registry: base64-embeds a profile's own image files on demand, so a
rendered PNG is fully self-contained (no network, no external refs at view time).

Nothing ships here. An icon set and a logo are brand assets and a brand asset
belongs to a profile, not to skill logic, so both resolve inside
`profiles/<handle>/`:

    <profile>/icons/<slug>.png     an item's optional `[slug]` prefix
    <profile>/<theme.json logo>    the footer mark, when theme.json names one

Call set_profile() before resolving anything. The icon registry is GENERATED
from the files actually present, so a spec can only reference an icon that
exists on disk (anti-fabrication: no invented names), and a profile with no
icons/ directory renders with no icons rather than failing.
"""
import base64
import pathlib

_PROFILE = None

_MIME = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
         ".svg": "image/svg+xml", ".webp": "image/webp"}


def set_profile(path):
    """Point the registry at profiles/<handle>/. Must be called before any
    icon_uri() or logo_uri()."""
    global _PROFILE
    _PROFILE = pathlib.Path(path).resolve()


def _profile():
    if _PROFILE is None:
        raise RuntimeError("assets: set_profile(profiles/<handle>) first")
    return _PROFILE


def _data_uri(p):
    p = pathlib.Path(p)
    mime = _MIME.get(p.suffix.lower())
    if mime is None:
        raise ValueError("unsupported image type: %s" % p.suffix)
    b64 = base64.b64encode(p.read_bytes()).decode("ascii")
    return "data:%s;base64,%s" % (mime, b64)


def icons_dir():
    return _profile() / "icons"


def available_icons():
    """Sorted icon slugs (the filename stems in <profile>/icons/). Empty when
    the profile has no icons/ directory."""
    d = icons_dir()
    if not d.is_dir():
        return []
    return sorted(p.stem for p in d.iterdir() if p.suffix.lower() in _MIME)


def icon_uri(name):
    """Data URI for a named icon. Raises FileNotFoundError naming what is
    available, so a typo fails loudly; render.py catches it and fails soft to
    no icon rather than breaking the render."""
    d = icons_dir()
    for ext in (".png", ".svg", ".jpg", ".jpeg", ".webp"):
        p = d / (name + ext)
        if p.is_file():
            return _data_uri(p)
    raise FileNotFoundError(
        "icon '%s' not found in %s. Available: %s"
        % (name, d, ", ".join(available_icons()) or "(none)"))


def logo_uri(rel_path):
    """Data URI for the footer mark. `rel_path` is theme.json's `logo` value,
    resolved inside the profile. A logo outside the profile is refused: it would
    make the render depend on a file the repo does not carry."""
    p = (_profile() / rel_path).resolve()
    if _profile() not in p.parents:
        raise ValueError("theme.json logo must live inside the profile: %s" % p)
    if not p.is_file():
        raise FileNotFoundError("theme.json names logo '%s', not found at %s"
                                % (rel_path, p))
    return _data_uri(p)
