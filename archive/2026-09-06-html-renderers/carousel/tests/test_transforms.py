# tests/test_transforms.py
import unittest, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import render

class T(unittest.TestCase):
    def test_bold_to_accent(self):
        self.assertEqual(render.accent("Big **bold** line"),
                         'Big <span class="g">bold</span> line')

    def test_escape_then_bold(self):
        # ampersands escaped, ** still converted
        self.assertEqual(render.accent("A & **B**"),
                         'A &amp; <span class="g">B</span>')

    def test_progress_marks_current(self):
        html = render.progress_bar(step=2, total=5)
        self.assertEqual(html.count("seg"), 5)        # 5 segments
        self.assertEqual(html.count("seg on"), 2)     # first 2 filled

    def test_counter_format(self):
        self.assertEqual(render.counter(3, 9), "03 / 09")

if __name__ == "__main__":
    unittest.main()
