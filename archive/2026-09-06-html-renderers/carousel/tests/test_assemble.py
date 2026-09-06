# tests/test_assemble.py
import unittest, sys, pathlib, re
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import render

class A(unittest.TestCase):
    def test_render_slide_cover(self):
        slide = {"archetype": "cover", "eyebrow": "Hook", "headline": "Big **B**.",
                 "body": "ctx", "cue": "Swipe", "items": [], "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=1, total=9, meta={"footer": "f"})
        self.assertIn('class="slide dark"', html)
        self.assertIn('<span class="g">B</span>', html)
        self.assertIn('data-step="1"', html)
        self.assertIn("seg", html)

    def test_render_slide_statement_bullets(self):
        slide = {"archetype": "statement", "kicker": "Sec", "headline": "Plain **H**.",
                 "body": "lead line", "items": ["one", "two"],
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=3, total=9, meta={"footer": "f"})
        self.assertIn('class="slide"', html)
        self.assertIn('data-step="3"', html)
        self.assertIn("<li", html)
        self.assertIn("one", html)
        self.assertIn("03 / 09", html)

    def test_render_slide_compare_cards(self):
        slide = {"archetype": "compare", "kicker": "K", "headline": "A vs **B**.",
                 "left_title": "Old Way", "right_title": "New Way",
                 "items": [], "left_items": ["humans execute", "context lost"],
                 "right_items": ["agents decide", "context kept"]}
        html = render.render_slide(slide, step=5, total=9, meta={"footer": "f"})
        self.assertIn('class="cards', html)
        self.assertIn("card--flaw", html)
        self.assertIn("card--win", html)
        self.assertIn("Old Way", html)
        self.assertIn("<li>humans execute</li>", html)
        self.assertIn("agents decide", html)

    def test_render_slide_before_after(self):
        slide = {"archetype": "before-after", "kicker": "K", "headline": "Shift **now**.",
                 "left_title": "Before", "right_title": "After", "items": [],
                 "left_items": ["humans do the work"],
                 "right_items": ["agents do the work"]}
        html = render.render_slide(slide, step=6, total=9, meta={"footer": "f"})
        self.assertIn('class="ba', html)
        self.assertIn("col before", html)
        self.assertIn("col after", html)
        self.assertIn("humans do the work", html)
        self.assertIn("agents do the work", html)

    def test_render_slide_steps_numbered(self):
        slide = {"archetype": "steps", "kicker": "K", "headline": "The **loop**.",
                 "items": ["First step | detail one", "Second step | detail two"],
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=7, total=9, meta={"footer": "f"})
        self.assertIn('class="steps', html)
        self.assertIn('<div class="n">1</div>', html)
        self.assertIn('<div class="n">2</div>', html)
        self.assertIn('<div class="k">First step</div>', html)
        self.assertIn('<div class="s">detail one</div>', html)

    def test_render_slide_stat_number(self):
        slide = {"archetype": "stat", "kicker": "K", "stat": "40%",
                 "caption": "of planning workflows automated", "note": "and rising",
                 "items": [], "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=9, meta={"footer": "f"})
        self.assertIn('class="stat"', html)
        self.assertIn('<div class="num">40%</div>', html)
        self.assertIn("of planning workflows automated", html)
        self.assertIn('<div class="sub">and rising</div>', html)

    def test_render_slide_bullets_list(self):
        slide = {"archetype": "bullets", "kicker": "K", "headline": "Three **things**.",
                 "items": ["one", "two", "three"],
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=4, total=9, meta={"footer": "f"})
        self.assertIn('class="bul', html)
        self.assertIn("<li>one</li>", html)
        self.assertIn("<li>three</li>", html)

    def test_build_html_wraps_deck(self):
        meta = {"theme": "theme.json", "aspect": "4x5", "title": "T"}
        slides = [{"archetype": "cover", "eyebrow": "E", "headline": "H **x**.",
                   "body": "b", "items": [], "left_items": [], "right_items": []}]
        out = render.build_html(meta, slides, "/*theme*/", "/*base*/",
                                aspect="4x5", density="comfortable")
        self.assertIn("<!DOCTYPE html>", out)
        self.assertIn('class="deck a-4x5', out)
        self.assertIn("<style>", out)
        self.assertIn("/*base*/", out)
        self.assertIn("/*theme*/", out)
        self.assertIn('data-step="1"', out)

class ThemeTokens(unittest.TestCase):
    """theme.json is the only theme input. These read the shipped template
    rather than restating hex values, so the day a key changes there this
    fails instead of drifting."""

    THEME_PATH = (pathlib.Path(__file__).resolve().parents[3]
                  / "profiles" / "_template" / "theme.json")

    def setUp(self):
        self.theme = render.load_theme(self.THEME_PATH)
        self.css = render.theme_css(self.theme)

    def test_the_nine_keys_are_the_contract(self):
        self.assertEqual(
            render.THEME_KEYS,
            ("bg", "fg", "accent", "muted", "font_head", "font_body",
             "scale", "radius", "rule_weight"))

    def test_template_theme_loads(self):
        for k in render.THEME_KEYS:
            self.assertIn(k, self.theme)

    def test_primitives_reach_the_root_block(self):
        for key, token in (("bg", "--bg"), ("fg", "--ink"),
                           ("accent", "--accent"), ("muted", "--muted"),
                           ("radius", "--radius"),
                           ("rule_weight", "--rule-weight")):
            self.assertIn(f"{token}:{self.theme[key]};", self.css,
                          f"{key} did not reach {token}")
        self.assertIn(f"--font:{self.theme['font_body']};", self.css)
        self.assertIn(f"--font-head:{self.theme['font_head']};", self.css)

    def test_every_token_the_stylesheet_reads_is_defined(self):
        base = (render.HERE / "themes" / "_base.css").read_text()
        consumed = set(re.findall(r"var\(--([a-z0-9-]+)\)", base))
        defined = set(re.findall(r"--([a-z0-9-]+):", self.css))
        self.assertEqual(consumed - defined, set(),
                         "tokens read by _base.css with no value")

    def test_derived_tokens_are_present(self):
        for t in ("--ink-soft", "--line", "--surface-2", "--seg-off",
                  "--accent-deep", "--accent-light", "--hero-bg", "--on-dark",
                  "--on-accent", "--note", "--mark", "--hero-glow",
                  "--scrim-dark", "--scrim-light"):
            self.assertIn(t + ":", self.css)

    def test_no_brand_default_survives(self):
        # Nothing in this directory names a company. The wordmark comes from
        # theme.json and is empty when the profile has not set one.
        self.assertNotIn("wordmark\":", self.css)
        self.assertIn("--wordmark:'%s'" % self.theme.get("wordmark", ""),
                      self.css)

    def test_on_accent_is_the_far_end_of_the_palette(self):
        # Text on an accent fill takes whichever palette end the accent sits
        # furthest from, so a light accent never gets light text.
        light = render.theme_css({**self.theme, "accent": "#FFE000"})
        dark = render.theme_css({**self.theme, "accent": "#101820"})
        self.assertIn("--on-accent:%s;" % self.theme["fg"], light)
        self.assertIn("--on-accent:%s;" % self.theme["bg"], dark)

    def test_scale_selects_the_density_class(self):
        meta = {"aspect": "4x5"}
        airy = render._assemble_for_render(
            meta, [{"archetype": "cover", "headline": "H", "items": [],
                    "left_items": [], "right_items": []}],
            {**self.theme, "scale": "airy"})
        self.assertIn("d-spartan", airy)
        dense = render._assemble_for_render(
            meta, [{"archetype": "cover", "headline": "H", "items": [],
                    "left_items": [], "right_items": []}],
            {**self.theme, "scale": "dense"})
        self.assertIn("d-comfortable", dense)

    def test_missing_key_and_bad_colour_both_fail_loudly(self):
        import json, tempfile
        with tempfile.TemporaryDirectory() as d:
            bad = pathlib.Path(d) / "theme.json"
            short = {k: v for k, v in self.theme.items() if k != "accent"}
            bad.write_text(json.dumps(short))
            with self.assertRaises(ValueError) as ctx:
                render.load_theme(bad)
            self.assertIn("accent", str(ctx.exception))
            bad.write_text(json.dumps({**self.theme, "accent": "rebeccapurple"}))
            with self.assertRaises(ValueError) as ctx:
                render.load_theme(bad)
            self.assertIn("hex", str(ctx.exception))

    def test_wordmark_token_is_what_build_html_reads(self):
        css = render.theme_css({**self.theme, "wordmark": "a name"})
        out = render.build_html(
            {}, [{"archetype": "cover", "headline": "H", "items": [],
                  "left_items": [], "right_items": []}], css, "/*base*/")
        self.assertIn("a name", out)


if __name__ == "__main__":
    unittest.main()
