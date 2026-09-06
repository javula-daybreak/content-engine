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
    # The twelve VISUALS section 3 signatures. Each block is the smallest one
    # that satisfies its own structure clauses, so these double as a worked
    # example of what check_spec will and will not accept.
    "perception-split": {"headline": "h", "naive_headline": "N",
                         "naive_statement": "one", "naive_callout": "c",
                         "real_headline": "R", "punchline": "five",
                         "items": ["a", "b", "c", "d"]},
    "causal-chain": {"headline": "h", "terminal_cost": "Cost | felt",
                     "break_after": "1", "break_label": "cut here",
                     "items": ["A | x", "B | y", "C | z"]},
    "trend-poster": {"headline": "h", "sub": "s", "footer": "src",
                     "y_max": "12", "units": "(n)",
                     "items": ["1 | 1", "2 | 2", "3 | 3", "4 | 4", "5 | 6",
                               "6 | 10"]},
    "distribution-strip": {"headline": "h", "sub": "s", "footer": "src",
                           "observations": "2, 3, 4, 5, 6, 7, 8, 9",
                           "reference_value": "5", "reference_label": "target",
                           "unit": "days"},
    "ranked-bars": {"headline": "h", "sub": "s", "footer": "src",
                    "highlight": "1",
                    "items": ["A | 9", "B | 6", "C | 4", "D | 2"]},
    "composition-split": {"headline": "h", "sub": "s", "footer": "src",
                          "expectation": "e", "leader": "1",
                          "items": ["A | 60", "B | 30", "C | 10"]},
    "variance-bridge": {"headline": "h", "sub": "s", "footer": "src",
                        "start": "Plan | 100", "end": "Actual | 70",
                        "payoff": "2",
                        "items": ["A | -20", "B | -14", "C | 4"]},
    "sourced-shelf": {"headline": "h", "sub": "s", "footer": "src",
                      "sections": "Q1?; Q2?; Q3?",
                      "items": ["P%d | T%d | F%d" % (i, i, i)
                                for i in range(9)]},
    "analogy-rows": {"headline": "h", "sub": "s",
                     "items": ["A | the x | one; two",
                               "B | the x y | one; two",
                               "C | the x z | one; two"]},
    "quadrant-map": {"headline": "h", "sub": "rule", "x_axis": "lo | hi",
                     "y_axis": "lo | hi", "quadrants": "a; b; c; d",
                     "highlight": "1",
                     "items": ["A | 20 | 80", "B | 80 | 80", "C | 20 | 20",
                               "D | 80 | 20", "E | 30 | 60", "F | 60 | 30"]},
    "stratified-container": {"headline": "h", "container": "iceberg",
                             "notes": "one; two; three",
                             "items": ["Top | a; b; c; d; e; f; g; h; i",
                                       "Mid | a; b; c; d; e; f; g",
                                       "Deep | a; b; c; d"]},
    "mirrored-rings": {"headline": "h", "good_label": "good",
                       "bad_label": "bad",
                       "items": ["L1 | a; b; c; d | w; x; y; z",
                                 "L2 | a; b; c; d; e | v; w; x; y; z",
                                 "L3 | a; b; c; d; e; f | u; v; w; x; y; z"]},
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
    "perception-split": "splitpanel",
    "causal-chain": "chain",
    "trend-poster": "plot",
    "distribution-strip": "strip",
    "ranked-bars": "bars",
    "composition-split": "composition",
    "variance-bridge": "waterfall",
    "sourced-shelf": "shelf",
    "analogy-rows": "analogy",
    "quadrant-map": "quadrant",
    "stratified-container": "strata",
    "mirrored-rings": "rings",
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


# --------------------------------------------------------------------------- #
# The VISUALS section 3 signatures, added 2026-08-24
# --------------------------------------------------------------------------- #
def _spec(arch, **fields):
    """Build a one-block spec dict for check_spec, from MIN_BLOCKS plus edits."""
    b = dict(MIN_BLOCKS[arch], archetype=arch)
    b.update(fields)
    return b


def _errors(arch, **fields):
    return [x for x in R.check_spec({}, [_spec(arch, **fields)])
            if x.startswith("ERROR")]


def _warns(arch, **fields):
    return [x for x in R.check_spec({}, [_spec(arch, **fields)])
            if x.startswith("WARN")]


class TestSignatureCoverage(unittest.TestCase):
    """Every signature in VISUALS section 3 that selection can reach must have a
    template, or selection hits section 2.4's refusal path on material the
    format is supposed to handle."""

    SIGNATURES = [
        "perception-split", "causal-chain", "trend-poster",
        "distribution-strip", "ranked-bars", "composition-split",
        "variance-bridge", "sourced-shelf", "analogy-rows", "quadrant-map",
        "stratified-container", "mirrored-rings",
        # the three the seven original templates already served
        "comparison-panel", "card-grid", "icon-list", "numbered-steps",
        "funnel",
    ]

    def test_every_signature_is_reachable(self):
        for arch in self.SIGNATURES:
            self.assertIn(arch, R.KNOWN_ARCHETYPES, arch)
            self.assertIn(arch, R.CORE_BUILDERS, arch)

    def test_every_new_archetype_marks_a_claim_layer(self):
        """The thumbnail check has no operand unless the template says which
        atoms are the claim (VISUALS 6.3 row 1)."""
        for arch in self.SIGNATURES:
            html = R.build_html({}, _spec(arch), R.load_theme(TEMPLATE_THEME))
            self.assertIn('data-layer="claim"', html, arch)

    def test_no_new_css_block_hardcodes_a_radius_or_a_rule(self):
        """A template that ignores radius and rule_weight looks like a different
        product from the other fourteen. Scoped to the section 3 blocks: the
        slice above them is older work and is not what this test guards."""
        css = (ENGINE / "themes" / "_base.css").read_text()
        tail = css.split("The VISUALS section 3 signatures")[1]
        tail = re.sub(r"/\*.*?\*/", "", tail, flags=re.S)
        bad_radius = [v for v in re.findall(r"border-radius:\s*([^;}]+)", tail)
                      if v.strip() not in ("var(--radius)", "50%", "0")]
        self.assertEqual(bad_radius, [])
        bad_rule = [v for v in re.findall(r"border(?:-top|-left)?:\s*([^;}]+)", tail)
                    if "var(--rule)" not in v and v.strip() != "none"]
        self.assertEqual(bad_rule, [])


class TestRequiredParameterFill(unittest.TestCase):
    """VISUALS 6.3 row 4. An unfilled required parameter or an over-budget
    string fails the build."""

    def test_data_archetype_without_a_source_line_is_an_error(self):
        out = _errors("trend-poster", footer="")
        self.assertTrue(any("no source line" in x for x in out), out)

    def test_source_line_may_come_from_the_front_matter(self):
        b = _spec("trend-poster", footer="")
        out = [x for x in R.check_spec({"footer": "Data from: X"}, [b])
               if x.startswith("ERROR")]
        self.assertEqual(out, [])

    def test_concept_archetype_needs_no_source_line(self):
        self.assertEqual(_errors("perception-split"), [])

    def test_over_budget_field_is_an_error(self):
        out = _errors("perception-split", naive_headline="x" * 40)
        self.assertTrue(any("'naive_headline' over 36 chars" in x for x in out), out)

    def test_over_budget_item_is_an_error(self):
        out = _errors("analogy-rows",
                      items=["A | the x | " + "y" * 90] + MIN_BLOCKS["analogy-rows"]["items"][1:])
        self.assertTrue(any("item over 90 chars" in x for x in out), out)

    def test_item_count_outside_the_budget_is_an_error(self):
        out = _errors("sourced-shelf", items=["P | T | F"] * 8)
        self.assertTrue(any("8 items, budget 9-9" in x for x in out), out)

    def test_headline_over_eight_words_is_an_error(self):
        out = _errors("perception-split",
                      headline="one two three four five six seven eight nine")
        self.assertTrue(any("headline 9 words" in x for x in out), out)


class TestStructureClauses(unittest.TestCase):
    """The section 3 disqualifiers that are exact arithmetic on the spec. ERROR
    for a count, a sum, an ordering or an empty quadrant; WARN for every clause
    resting on one of section 3's [UNVERIFIED] ratios."""

    def test_symmetric_perception_split_is_an_error(self):
        out = _errors("perception-split", items=["a", "b", "c", "d", "e"])
        self.assertTrue(any("exactly 4 parallel" in x for x in out), out)

    def test_composition_that_does_not_sum_to_100_is_an_error(self):
        out = _errors("composition-split", items=["A | 60", "B | 20"])
        self.assertTrue(any("sum to 80" in x for x in out), out)

    def test_composition_summing_to_100_passes(self):
        self.assertEqual(_errors("composition-split"), [])

    def test_ranked_bars_summing_to_100_is_a_composition(self):
        out = _errors("ranked-bars", items=["A | 60", "B | 30", "C | 6", "D | 4"])
        self.assertTrue(any("composition and not a ranking" in x for x in out), out)

    def test_unexplained_residual_with_no_label_is_an_error(self):
        out = _errors("variance-bridge",
                      items=["A | -20", "B | -5", "C | -1"])
        self.assertTrue(any("unexplained" in x for x in out), out)

    def test_residual_label_makes_the_residue_legal(self):
        out = _errors("variance-bridge",
                      items=["A | -20", "B | -5", "C | -1"],
                      residual_label="Unexplained")
        self.assertEqual(out, [])

    def test_non_monotonic_strata_counts_are_an_error(self):
        out = _errors("stratified-container",
                      items=["A | a; b; c; d; e; f; g",
                             "B | a; b; c; d; e; f; g",
                             "C | a; b; c; d; e; f"])
        self.assertTrue(any("monotonic" in x for x in out), out)

    def test_ring_counts_must_increase_strictly_outward(self):
        out = _errors("mirrored-rings",
                      items=["L1 | a; b; c; d | w; x; y; z",
                             "L2 | a; b; c; d | w; x; y; z",
                             "L3 | a; b; c; d; e | v; w; x; y; z"])
        self.assertTrue(any("increase strictly outward" in x for x in out), out)

    def test_too_few_observations_is_an_error(self):
        out = _errors("distribution-strip", observations="2, 4, 8")
        self.assertTrue(any("under 8" in x for x in out), out)

    def test_an_empty_quadrant_is_an_error(self):
        out = _errors("quadrant-map",
                      items=["A | 20 | 80", "B | 80 | 80", "C | 20 | 20",
                             "D | 30 | 70", "E | 40 | 60", "F | 25 | 75"])
        self.assertTrue(any("quadrants are empty" in x for x in out), out)

    def test_an_unverified_ratio_warns_and_never_errors(self):
        """VISUALS section 3 tags every ratio in it [UNVERIFIED]. Blocking a
        render on a number the spec calls a starting value is marking our own
        homework."""
        low_contrast = dict(items=["A | 9", "B | 9", "C | 8", "D | 8"])
        self.assertEqual(_errors("ranked-bars", **low_contrast), [])
        self.assertTrue(any("under 1.4x" in x
                            for x in _warns("ranked-bars", **low_contrast)))

    def test_shelf_card_without_a_publisher_is_an_error(self):
        items = ["| T | F"] + MIN_BLOCKS["sourced-shelf"]["items"][1:]
        out = _errors("sourced-shelf", items=items)
        self.assertTrue(any("publisher and a title" in x for x in out), out)


class TestGeometryHonesty(unittest.TestCase):
    """Geometry makes claims independently of the words (VISUALS 5.5), so the
    builders compute the claim-bearing dimension rather than accepting one."""

    def test_strata_band_width_tracks_the_item_count(self):
        html = R.strata_html(MIN_BLOCKS["stratified-container"])
        widths = [float(w) for w in re.findall(r"width:([\d.]+)%", html)]
        self.assertEqual(widths, sorted(widths, reverse=True), widths)
        self.assertGreater(widths[0], widths[-1])

    def test_trend_axis_starts_at_zero_and_clears_the_top_datum(self):
        html = R.trend_html(dict(MIN_BLOCKS["trend-poster"], y_max="10"))
        self.assertIn(">0<", html)                     # zero baseline tick
        ys = [float(y) for _x, y in
              (p.split(",") for p in
               re.search(r'points="([^"]+)"', html).group(1).split())]
        self.assertGreater(min(ys), 0.0)               # nothing touches the frame

    def test_rings_encode_sign_as_luminance_not_as_a_second_hue(self):
        """accent_2 is VISUALS section 10 decision 2 and it is not decided."""
        html = R.rings_html(MIN_BLOCKS["mirrored-rings"])
        self.assertIn("var(--accent)", html)
        self.assertIn("var(--ink)", html)
        self.assertEqual(re.findall(r"in oklab, var\((--[a-z0-9-]+)\)", html),
                         re.findall(r"in oklab, var\((--accent|--ink)\)", html))

    def test_fixed_track_prints_an_authoritative_numeral_column(self):
        html = R.bars_html(dict(MIN_BLOCKS["ranked-bars"], track="fixed",
                                remainder_label="rest"))
        self.assertIn("br-num", html)
        self.assertIn("br-rem", html)

    def test_anonymize_suppresses_the_per_observation_annotation(self):
        """VISUALS 2.5: annotating the two extremes re-identifies the two people
        the clearance filter existed to protect."""
        block = dict(MIN_BLOCKS["distribution-strip"])
        self.assertIn("ds-note", R.strip_html(block))
        self.assertNotIn("ds-note", R.strip_html(dict(block, anonymize="true")))


class TestLayoutChecks(unittest.TestCase):
    """VISUALS 6.3, run on the generated HTML as text rather than on a
    screenshot (PRD section 4's cost argument)."""

    def test_oklab_round_trips(self):
        for hexv in ("#FBFBF9", "#12100E", "#2F5BEA", "#8A8880"):
            self.assertEqual(R._oklab_hex(R._oklab(hexv)), hexv)

    def test_resolve_color_mixes_in_oklab(self):
        tokens = R.theme_tokens(R.load_theme(TEMPLATE_THEME))
        mid = R.resolve_color(
            "color-mix(in oklab, var(--accent) 50%, var(--bg))", tokens)
        lo = R._oklab(R.resolve_color("var(--accent)", tokens))[0]
        hi = R._oklab(R.resolve_color("var(--bg)", tokens))[0]
        self.assertTrue(lo < R._oklab(mid)[0] < hi)

    def test_resolve_color_composites_transparent_over_its_parent(self):
        tokens = R.theme_tokens(R.load_theme(TEMPLATE_THEME))
        out = R.resolve_color("color-mix(in oklab, var(--bg) 50%, transparent)",
                              tokens, over="#000000")
        self.assertIsNotNone(out)
        self.assertLess(R._oklab(out)[0], R._oklab("#FBFBF9")[0])

    def test_every_example_passes_the_layout_checks(self):
        theme = R.load_theme(TEMPLATE_THEME)
        specs = sorted(p for p in glob.glob(str(EXAMPLES / "*.md"))
                       if not os.path.basename(p).startswith("_"))
        for path in specs:
            with self.subTest(spec=os.path.basename(path)):
                meta, blocks = R.parse_spec(pathlib.Path(path).read_text())
                problems = R.check_layout(R.build_html(meta, blocks[0], theme),
                                          theme)
                self.assertEqual([x for x in problems if x.startswith("ERROR")],
                                 [], path)

    def test_reversed_label_contrast_is_an_error(self):
        """A white numeral on #FFD401 measured under 3:1 (VISUALS 5.4). The
        engine picks --on-accent for that reason; a theme whose muted text
        lands on a tinted band is the case this check exists to catch."""
        prof = _tmp_profile({"accent": "#FFD401", "fg": "#FFFFFF",
                             "bg": "#FFFFFF", "muted": "#FFFFFF"})
        try:
            theme = R.load_theme(prof / "theme.json")
            html = R.build_html({}, _spec("ranked-bars"), theme)
            problems = R.check_layout(html, theme)
        finally:
            shutil.rmtree(prof, ignore_errors=True)
        self.assertTrue(any(x.startswith("ERROR contrast") for x in problems),
                        problems)

    def test_a_collapsing_tint_ramp_warns(self):
        """A ramp generated by lightening one hue lands its last step on the
        ground (VISUALS 5.4). Threshold is [UNVERIFIED], so it warns."""
        prof = _tmp_profile({"accent": "#FBFBF9"})   # accent == the page ground
        try:
            theme = R.load_theme(prof / "theme.json")
            problems = R.check_layout(
                R.build_html({}, _spec("stratified-container"), theme), theme)
        finally:
            shutil.rmtree(prof, ignore_errors=True)
        self.assertTrue(any(x.startswith("WARN  tint") for x in problems),
                        problems)

    def test_thumbnail_check_reads_the_claim_layer(self):
        theme = R.load_theme(TEMPLATE_THEME)
        problems = R.check_layout(
            R.build_html({}, _spec("causal-chain"), theme), theme)
        self.assertTrue(any("thumbnail" in x for x in problems), problems)
        self.assertFalse([x for x in problems if x.startswith("ERROR")])

    def test_line_budget_overflow_is_not_faked(self):
        """VISUALS 6.3 row 5 needs a rendered line count, which needs glyph
        metrics for a font theme.json only names. It is documented as unbuilt
        rather than approximated by a character count, which is row 4."""
        self.assertIn("is not built and is not\n    faked",
                      R.check_layout.__doc__)


class TestCliLayoutGate(unittest.TestCase):
    def test_html_only_prints_the_layout_report(self):
        prof = _tmp_profile()
        out = prof / "runs" / "x" / "final.png"
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                rc = R.main([str(EXAMPLES / "causal-chain.md"), "--profile",
                             str(prof), "--out", str(out), "--html-only"])
        finally:
            shutil.rmtree(prof, ignore_errors=True)
        self.assertEqual(rc, 0)
        self.assertIn("WARN  thumbnail", buf.getvalue())

    def test_a_contrast_error_refuses_the_render(self):
        prof = _tmp_profile({"accent": "#FFD401", "fg": "#FFFFFF",
                             "bg": "#FFFFFF", "muted": "#FFFFFF"})
        out = prof / "runs" / "x" / "final.png"
        buf = io.StringIO()
        try:
            with contextlib.redirect_stdout(buf):
                rc = R.main([str(EXAMPLES / "ranked-bars.md"), "--profile",
                             str(prof), "--out", str(out), "--html-only"])
        finally:
            shutil.rmtree(prof, ignore_errors=True)
        self.assertEqual(rc, 1)
        self.assertIn("layout check failed", buf.getvalue())
        self.assertFalse(out.with_suffix(".png.html").exists())

    def test_a_self_closing_svg_child_does_not_pop_the_inheritance_stack(self):
        """HTMLParser's default runs starttag then endtag for `<circle/>`, which
        popped a level nobody pushed and walked every fill off the stack. Text
        after an inline chart then resolved against the page ground, which is a
        silent pass on the one check that fails a build."""
        theme = R.load_theme(TEMPLATE_THEME)
        tokens = R.theme_tokens(theme)
        css = R._css_props((ENGINE / "themes" / "_base.css").read_text())
        p = R._Paint(css, tokens, "#FBFBF9")
        p.feed('<div style="background:var(--accent)"><svg>'
               '<circle cx="1" cy="1" r="2"/><line x1="0" y1="0" x2="1" y2="1"/>'
               '</svg><span>after</span></div>')
        self.assertEqual([t[-1] for t in p.texts], ["after"])
        self.assertEqual(p.texts[0][0], theme["accent"])

if __name__ == "__main__":
    unittest.main(verbosity=2)
