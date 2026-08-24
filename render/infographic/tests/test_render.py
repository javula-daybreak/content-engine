#!/usr/bin/env python3
"""Test suite for render/infographic. Stdlib unittest only.

Covers: the parser (front-matter, list keys, compound items), text atoms, the
theme.json contract, the `check_spec` validator (required fields per archetype,
kicker rule, unknown archetype, multiple blocks), per-archetype
builder structure, the write constraint, a sweep that every shipped example
parses + validates clean, and one end-to-end render smoke asserting the PNG is
2160x2700 (skipped if Chrome is absent).

Run: python3 -m unittest discover -s render/infographic/tests
"""
import os
import sys
import json
import glob
import struct
import shutil
import pathlib
import tempfile
import unittest
import io
import re
import contextlib

ENGINE = pathlib.Path(__file__).resolve().parent.parent
REPO = ENGINE.parent.parent
sys.path.insert(0, str(ENGINE))
import render as R  # noqa: E402

EXAMPLES = ENGINE / "examples"
TEMPLATE_THEME = REPO / "profiles" / "_template" / "theme.json"


def _tmp_profile(extra=None):
    """A throwaway profile directory carrying _template's theme.json. Every
    write a render makes has to land inside one of these."""
    d = pathlib.Path(tempfile.mkdtemp())
    theme = json.loads(TEMPLATE_THEME.read_text())
    theme.update(extra or {})
    (d / "theme.json").write_text(json.dumps(theme))
    return d

# Minimal valid blocks per archetype, for builder + validator tests.
MIN_BLOCKS = {
    "numbered-steps": {"headline": "h", "items": ["[growth] A | lead | x; y"]},
    "card-grid": {"headline": "h", "items": ["[growth] A | body"]},
    "comparison-panel": {"headline": "h",
                         "col1": ["Old", "WHAT | a; b"],
                         "col2": ["New", "WHAT | c; d"]},
    "icon-list": {"headline": "h", "items": ["[growth] A | desc"]},
    "funnel": {"headline": "h", "items": ["Top | d", "Mid | d", "End | d"]},
    "hybrid-playbook": {"headline": "h", "stats": ["50% | label"],
                        "items": ["[growth] A | body"]},
    "annotated-diagram": {"headline": "h", "center": "Hub",
                          "items": ["[growth] A | d", "B | d", "C | d", "D | d"]},
}

# A class string each archetype's core HTML must contain.
CORE_MARKER = {
    "numbered-steps": "steps2",
    "card-grid": "cardgrid",
    "comparison-panel": "compare",
    "icon-list": "iconlist",
    "funnel": "funnel",
    "hybrid-playbook": "playbook",
    "annotated-diagram": "diagram",
}


class TestParser(unittest.TestCase):
    def test_frontmatter_and_single_block(self):
        meta, blocks = R.parse_spec(
            "---\nwordmark: A. Name\ntitle: T\n---\n\n:: card-grid\n"
            "headline: Hi\nitems:\n- A | b\n- C | d\n")
        self.assertEqual(meta["wordmark"], "A. Name")
        self.assertEqual(meta["title"], "T")
        self.assertEqual(len(blocks), 1)
        self.assertEqual(blocks[0]["archetype"], "card-grid")
        self.assertEqual(blocks[0]["headline"], "Hi")
        self.assertEqual(blocks[0]["items"], ["A | b", "C | d"])

    def test_list_keys_collect(self):
        _, blocks = R.parse_spec(
            ":: comparison-panel\nheadline: H\ncol1:\n- Old\n- a | b\n"
            "col2:\n- New\n- c | d\n")
        b = blocks[0]
        self.assertEqual(b["col1"], ["Old", "a | b"])
        self.assertEqual(b["col2"], ["New", "c | d"])

    def test_stats_is_a_list_key(self):
        self.assertIn("stats", R.LIST_KEYS)
        _, blocks = R.parse_spec(
            ":: hybrid-playbook\nheadline: H\nstats:\n- 50% | x\n"
            "items:\n- A | b\n")
        self.assertEqual(blocks[0]["stats"], ["50% | x"])

    def test_comments_and_blank_lines_ignored(self):
        _, blocks = R.parse_spec(":: card-grid\n# note\nheadline: H\n\nitems:\n- A\n")
        self.assertEqual(blocks[0]["headline"], "H")
        self.assertEqual(blocks[0]["items"], ["A"])


class TestAtoms(unittest.TestCase):
    def test_split_fields_pad_and_clip(self):
        self.assertEqual(R.split_fields("a | b | c", 2), ["a", "b"])
        self.assertEqual(R.split_fields("a", 3), ["a", "", ""])
        self.assertEqual(R.split_fields("a|b|c"), ["a", "b", "c"])

    def test_accent_wraps_bold(self):
        out = R.accent("a **b** c")
        self.assertIn('<span class="g">b</span>', out)

    def test_esc_escapes_html(self):
        self.assertEqual(R.esc("a < b & c"), "a &lt; b &amp; c")


class TestValidator(unittest.TestCase):
    def _check(self, text):
        meta, blocks = R.parse_spec(text)
        return R.check_spec(meta, blocks)

    def test_missing_required_field_errors(self):
        # card-grid without items
        out = self._check(":: card-grid\nheadline: H\n")
        self.assertTrue(any("missing required field 'items'" in x for x in out))

    def test_each_archetype_required_present(self):
        # Every known (non-smoke) archetype has a REQUIRED entry incl. headline.
        for arch in R.KNOWN_ARCHETYPES:
            if arch == "_smoke":
                continue
            self.assertIn(arch, R.REQUIRED, f"{arch} missing REQUIRED entry")
            self.assertIn("headline", R.REQUIRED[arch])

    def test_kicker_is_error(self):
        out = self._check(":: card-grid\nkicker: Eyebrow\nheadline: H\nitems:\n- A | b\n")
        self.assertTrue(any("kicker" in x and x.startswith("ERROR") for x in out))

    def test_no_language_scan(self):
        """The language gate is reference/ai-tells.md at pipeline step 5, not
        here. A second lexicon in the renderer cannot be kept in step with it,
        so --check must stay silent on wording."""
        out = self._check(":: card-grid\nheadline: H \u2014 x\nitems:\n- Leverage this | b\n")
        self.assertEqual(out, [], "check_spec must not judge wording: %r" % out)

    def test_unknown_archetype_errors(self):
        out = self._check(":: bogus\nheadline: H\n")
        self.assertTrue(any("unknown archetype" in x for x in out))

    def test_multiple_blocks_errors(self):
        out = self._check(":: card-grid\nheadline: H\nitems:\n- A\n:: funnel\nheadline: H2\nitems:\n- T\n")
        self.assertTrue(any("exactly one layout block" in x for x in out))

    def test_clean_spec_has_no_errors(self):
        out = self._check(":: card-grid\nheadline: **H**\nitems:\n- A | b\n- C | d\n")
        self.assertFalse([x for x in out if x.startswith("ERROR")])


class TestBuilders(unittest.TestCase):
    def test_every_known_archetype_has_builder(self):
        for arch in R.KNOWN_ARCHETYPES:
            self.assertIn(arch, R.CORE_BUILDERS, f"{arch} missing CORE_BUILDERS")

    def test_builder_emits_core_marker(self):
        for arch, block in MIN_BLOCKS.items():
            html = R.CORE_BUILDERS[arch](block)
            self.assertIsInstance(html, str)
            self.assertTrue(html.strip(), f"{arch} produced empty core")
            self.assertIn(CORE_MARKER[arch], html, f"{arch} missing marker class")

    def test_unknown_icon_fails_soft(self):
        # An unknown [slug] must not raise; it simply yields no icon.
        html = R.CORE_BUILDERS["card-grid"](
            {"headline": "h", "items": ["[no-such-icon] A | b"]})
        self.assertIn("cardgrid", html)

    def test_build_html_wraps_canvas_and_shell(self):
        theme = R.load_theme(TEMPLATE_THEME)
        html = R.build_html({}, dict(MIN_BLOCKS["funnel"], archetype="funnel"),
                            theme)
        self.assertIn('<div class="canvas">', html)
        self.assertIn('class="footbar"', html)   # the signature bar is present
        self.assertNotIn('class="kicker"', html)  # no eyebrow zone


class TestTheme(unittest.TestCase):
    """The theme.json contract. This is where the assertions that used to
    encode a brand value now live."""

    def test_template_theme_carries_the_nine_keys(self):
        theme = json.loads(TEMPLATE_THEME.read_text())
        for k in R.THEME_KEYS:
            self.assertIn(k, theme, "profiles/_template/theme.json lacks %r" % k)

    def test_theme_css_defines_every_token_base_css_reads(self):
        css = R.theme_css(R.load_theme(TEMPLATE_THEME))
        base = re.sub(r"/\*.*?\*/", "", (ENGINE / "themes" / "_base.css").read_text(),
                      flags=re.S)
        read = set(re.findall(r"var\((--[a-z0-9-]+)\)", base))
        defined = set(re.findall(r"^\s*(--[a-z0-9-]+):", css, re.M))
        # --mark is defined only when theme.json names a logo; nothing else may
        # be read by the structure sheet without the theme block defining it.
        self.assertEqual(read - defined, {"--mark"})

    def test_no_brand_value_survives_in_the_engine(self):
        """No literal colour anywhere in the engine. theme.json is the only source."""
        for path in [ENGINE / "themes" / "_base.css",
                     ENGINE / "assets" / "icons.py",
                     ENGINE / "render.py"]:
            hits = re.findall(r"#[0-9A-Fa-f]{3}\b|#[0-9A-Fa-f]{6}\b",
                              path.read_text())
            self.assertEqual(hits, [], "%s carries a literal colour" % path)

    def test_missing_theme_key_fails_loudly(self):
        prof = _tmp_profile()
        theme = json.loads((prof / "theme.json").read_text())
        del theme["accent"]
        (prof / "theme.json").write_text(json.dumps(theme))
        try:
            with self.assertRaises(ValueError) as cm:
                R.load_theme(prof / "theme.json")
        finally:
            shutil.rmtree(prof, ignore_errors=True)
        self.assertIn("accent", str(cm.exception))

    def test_logo_absent_renders_no_mark(self):
        """The template ships `logo: ""` as of 2026-08-20 (PRD section 10 admits
        it as the optional tenth key). Empty and absent must behave the same:
        no mark. Asserting the key is missing pinned an accident of the
        template, not the contract."""
        theme = R.load_theme(TEMPLATE_THEME)
        self.assertFalse(theme.get("logo", ""), theme.get("logo"))
        html = R.build_html({"wordmark": "A. Name"},
                            dict(MIN_BLOCKS["funnel"], archetype="funnel"),
                            theme)
        self.assertNotIn('class="mark"', html)
        self.assertNotIn("--mark:", html)
        self.assertIn("A. Name", html)

    def test_logo_present_embeds_it_from_inside_the_profile(self):
        prof = _tmp_profile({"logo": "mark.png"})
        # a 1x1 PNG, so the test needs no fixture file checked in
        (prof / "mark.png").write_bytes(bytes.fromhex(
            "89504e470d0a1a0a0000000d49484452000000010000000108060000001f"
            "15c4890000000a49444154789c6300010000050001"
            "0d0a2db40000000049454e44ae426082"))
        try:
            html = R.build_html({}, dict(MIN_BLOCKS["funnel"],
                                         archetype="funnel"),
                                R.load_theme(prof / "theme.json"))
        finally:
            shutil.rmtree(prof, ignore_errors=True)
        self.assertIn("--mark:url(\"data:image/png;base64,", html)
        self.assertIn('class="mark"', html)

    def test_on_accent_contrasts_against_the_accent(self):
        """A reversed label set globally to white is a measured failure."""
        light = R.theme_css({"bg": "#111111", "fg": "#FFFFFF",
                             "accent": "#FFD401", "muted": "#888888",
                             "font_head": "s", "font_body": "s",
                             "scale": "airy", "radius": "0px",
                             "rule_weight": "1px"})
        self.assertIn("--on-accent:#111111;", light)


class TestWriteConstraint(unittest.TestCase):
    """PRD 1.3: every write lands inside profiles/<handle>/."""

    def test_out_outside_the_profile_is_refused(self):
        prof = _tmp_profile()
        try:
            with self.assertRaises(ValueError):
                R.render_png(EXAMPLES / "funnel.md", "/tmp/nope.png", prof)
            with self.assertRaises(ValueError):
                R.render_png(EXAMPLES / "funnel.md",
                             prof.parent / "sibling.png", prof)
        finally:
            shutil.rmtree(prof, ignore_errors=True)

    def test_cli_prints_one_line_not_a_traceback(self):
        prof = _tmp_profile()
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                rc = R.main([str(EXAMPLES / "funnel.md"), "--profile",
                            str(prof), "--out", "/tmp/nope.png"])
        finally:
            shutil.rmtree(prof, ignore_errors=True)
        self.assertEqual(rc, 1)
        self.assertEqual(len(buf.getvalue().strip().splitlines()), 1)
        self.assertIn("refusing to write outside the profile",
                      buf.getvalue())

    def test_render_requires_a_profile_and_an_out(self):
        with contextlib.redirect_stdout(io.StringIO()):
            self.assertEqual(R.main([str(EXAMPLES / "funnel.md")]), 1)

    def test_html_only_writes_the_html_and_no_png(self):
        prof = _tmp_profile()
        out = prof / "runs" / "x" / "final.png"
        try:
            with contextlib.redirect_stdout(io.StringIO()):
                self.assertEqual(
                    R.main([str(EXAMPLES / "funnel.md"), "--profile", str(prof),
                            "--out", str(out), "--html-only"]), 0)
            self.assertTrue(out.with_suffix(".png.html").is_file())
            self.assertFalse(out.exists())
        finally:
            shutil.rmtree(prof, ignore_errors=True)


class TestExamplesSweep(unittest.TestCase):
    def test_all_examples_parse_and_validate_clean(self):
        # Skip internal scaffolding examples (e.g. _smoke.md, the Phase-0 gate).
        specs = sorted(p for p in glob.glob(str(EXAMPLES / "*.md"))
                       if not os.path.basename(p).startswith("_"))
        self.assertTrue(specs, "no example specs found")
        for path in specs:
            with self.subTest(spec=os.path.basename(path)):
                text = pathlib.Path(path).read_text()
                meta, blocks = R.parse_spec(text)
                self.assertEqual(len(blocks), 1)
                self.assertIn(blocks[0]["archetype"], R.KNOWN_ARCHETYPES)
                errs = [x for x in R.check_spec(meta, blocks) if x.startswith("ERROR")]
                self.assertFalse(errs, f"{path}: {errs}")
                # builder runs without raising and returns non-empty HTML
                html = R.CORE_BUILDERS[blocks[0]["archetype"]](blocks[0])
                self.assertTrue(html.strip())


class TestRenderSmoke(unittest.TestCase):
    @unittest.skipUnless(os.path.exists(R.CHROME), "Chrome not installed")
    def test_render_png_is_2160x2700_and_keeps_the_html(self):
        prof = _tmp_profile()
        out = prof / "runs" / "2026-01-01-smoke" / "final.png"
        try:
            R.render_png(EXAMPLES / "funnel.md", out, prof)
            head = out.read_bytes()[:24]
            # PNG IHDR: width/height are big-endian uint32 at bytes 16-24
            self.assertEqual(head[:8], b"\x89PNG\r\n\x1a\n")
            w, h = struct.unpack(">II", head[16:24])
            self.assertEqual((w, h), (2160, 2700))
            # the design gate reads this, so the render must leave it behind
            html = out.with_suffix(".png.html")
            self.assertTrue(html.is_file())
            self.assertIn("color-mix(in oklab", html.read_text())
        finally:
            shutil.rmtree(prof, ignore_errors=True)


if __name__ == "__main__":
    unittest.main(verbosity=2)
