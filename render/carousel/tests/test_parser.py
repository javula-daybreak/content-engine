# tests/test_parser.py
import unittest, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import render

SPEC = """---
theme: theme.json
aspect: 4x5
title: Demo
---

:: cover
eyebrow: The Hook
headline: Big **bold** line.
body: One line of context.

:: cta
headline: The close.
cta: Go to example.com
"""

class TestParse(unittest.TestCase):
    def test_meta(self):
        meta, slides = render.parse_spec(SPEC)
        self.assertEqual(meta["theme"], "theme.json")
        self.assertEqual(meta["aspect"], "4x5")
        self.assertEqual(meta["title"], "Demo")

    def test_slide_count_and_archetypes(self):
        meta, slides = render.parse_spec(SPEC)
        self.assertEqual([s["archetype"] for s in slides], ["cover", "cta"])

    def test_scalar_fields(self):
        meta, slides = render.parse_spec(SPEC)
        self.assertEqual(slides[0]["eyebrow"], "The Hook")
        self.assertEqual(slides[0]["headline"], "Big **bold** line.")
        self.assertEqual(slides[1]["cta"], "Go to example.com")

    def test_compare_lists(self):
        spec = """---
theme: theme.json
---
:: compare
headline: A vs B
left: The Old Way
- humans execute
- context lost
right: The New Way
- agents decide
- context kept
"""
        _, slides = render.parse_spec(spec)
        s = slides[0]
        self.assertEqual(s["left_title"], "The Old Way")
        self.assertEqual(s["left_items"], ["humans execute", "context lost"])
        self.assertEqual(s["right_items"], ["agents decide", "context kept"])

    def test_default_items_list(self):
        spec = "---\ntheme: theme.json\n---\n:: bullets\nheadline: H\n- one\n- two\n"
        _, slides = render.parse_spec(spec)
        self.assertEqual(slides[0]["items"], ["one", "two"])

if __name__ == "__main__":
    unittest.main()
