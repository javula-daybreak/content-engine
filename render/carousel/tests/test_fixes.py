# tests/test_fixes.py
# Regression tests for the code-review fixes:
#   - progress bar fills correctly at total=10 (no hand-enumerated nth-child cap)
#   - eyebrows: false hides the top-left kicker/eyebrow on every archetype
#   - front-matter with no trailing newline after the closing fence still parses
import unittest, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import render


class TestProgressBarTen(unittest.TestCase):
    """Fix 1: a 10-slide deck must fill all 10 segments on slide 10.
    The fill now comes from the `seg on` class the code already emits
    (styled by `.bar .seg.on` in _base.css), not capped nth-child rules."""

    def test_ten_segments_all_filled(self):
        html = render.progress_bar(step=10, total=10)
        self.assertEqual(html.count("seg"), 10)        # 10 segments total
        self.assertEqual(html.count("seg on"), 10)     # all 10 filled

    def test_tenth_segment_is_on(self):
        # The 10th <i> specifically must carry the `on` class.
        html = render.progress_bar(step=10, total=10)
        segs = html.count('<i class="seg on">')
        self.assertEqual(segs, 10, html)

    def test_partial_ten_fills_first_n(self):
        # Sanity: on slide 7 of a 10-deck, exactly 7 are filled.
        html = render.progress_bar(step=7, total=10)
        self.assertEqual(html.count("seg"), 10)
        self.assertEqual(html.count("seg on"), 7)

    def test_render_slide_step10_emits_on(self):
        # Through the full render path: the body slide for step=10/total=10
        # emits the filled-segment class in its progress bar.
        slide = {"archetype": "statement", "kicker": "K", "headline": "End **here**.",
                 "items": [], "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=10, total=10, meta={"footer": "f"})
        self.assertEqual(html.count("seg on"), 10, html)
        self.assertIn('data-step="10"', html)


class TestEyebrowsToggle(unittest.TestCase):
    """Fix 6: `eyebrows: false` in meta blanks the top-left label on every
    archetype (body slides use .kicker, cover/cta use .eyebrow)."""

    def test_body_slide_kicker_hidden_when_off(self):
        slide = {"archetype": "statement", "kicker": "SECTION LABEL",
                 "headline": "Plain **H**.", "items": [],
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=9,
                                   meta={"footer": "f", "eyebrows": "false"})
        self.assertNotIn("SECTION LABEL", html)
        # the kicker span still exists structurally, just empty
        self.assertIn('<span class="kicker"></span>', html)

    def test_cover_eyebrow_hidden_when_off(self):
        slide = {"archetype": "cover", "eyebrow": "THE HOOK",
                 "headline": "Big **B**.", "body": "ctx", "cue": "Swipe",
                 "items": [], "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=1, total=9,
                                   meta={"footer": "f", "eyebrows": "false"})
        self.assertNotIn("THE HOOK", html)
        self.assertIn('<span class="eyebrow"></span>', html)

    def test_label_shown_when_eyebrows_missing(self):
        # Missing eyebrows key => labels ON (default behavior preserved).
        slide = {"archetype": "statement", "kicker": "SECTION LABEL",
                 "headline": "Plain **H**.", "items": [],
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=9, meta={"footer": "f"})
        self.assertIn("SECTION LABEL", html)

    def test_label_shown_when_eyebrows_true(self):
        slide = {"archetype": "statement", "kicker": "SECTION LABEL",
                 "headline": "Plain **H**.", "items": [],
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=9,
                                   meta={"footer": "f", "eyebrows": "true"})
        self.assertIn("SECTION LABEL", html)

    def test_string_off_values_treated_as_off(self):
        # no / off / 0 (case-insensitive) all hide the label.
        for val in ("no", "OFF", "0", "False", "No"):
            slide = {"archetype": "statement", "kicker": "SECTION LABEL",
                     "headline": "Plain **H**.", "items": [],
                     "left_items": [], "right_items": []}
            html = render.render_slide(slide, step=2, total=9,
                                       meta={"footer": "f", "eyebrows": val})
            self.assertNotIn("SECTION LABEL", html, f"value {val!r} should hide label")


class TestFrontMatterNoTrailingNewline(unittest.TestCase):
    """Fix 3: a front-matter-only spec with no newline after the closing
    fence still parses its meta."""

    def test_theme_parsed_without_trailing_newline(self):
        meta, slides = render.parse_spec("---\ntheme: ../../theme.json\n---")
        self.assertEqual(meta["theme"], "../../theme.json")
        self.assertEqual(slides, [])

    def test_multikey_front_matter_only(self):
        meta, _ = render.parse_spec("---\ntheme: theme.json\naspect: 1x1\n---")
        self.assertEqual(meta["theme"], "theme.json")
        self.assertEqual(meta["aspect"], "1x1")

    def test_trailing_newline_still_works(self):
        # The original (with newline + body) must remain unaffected.
        meta, slides = render.parse_spec(
            "---\ntheme: theme.json\n---\n:: cover\nheadline: H\n")
        self.assertEqual(meta["theme"], "theme.json")
        self.assertEqual([s["archetype"] for s in slides], ["cover"])


if __name__ == "__main__":
    unittest.main()
