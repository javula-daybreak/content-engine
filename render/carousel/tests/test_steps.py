import unittest, sys, pathlib
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import render


class TestStepsSplit(unittest.TestCase):
    def test_pipe_splits_label_and_detail(self):
        html = render.steps_html(["Label here | the detail line"])
        self.assertIn('<div class="k">Label here</div>', html)
        self.assertIn('<div class="s">the detail line</div>', html)

    def test_abbreviation_in_label_is_preserved(self):
        # The old '. ' sniff broke on 'vs.'; the pipe must keep it intact.
        html = render.steps_html(["Outcome measured vs. baseline | KPI impact"])
        self.assertIn('<div class="k">Outcome measured vs. baseline</div>', html)
        self.assertIn('<div class="s">KPI impact</div>', html)

    def test_no_pipe_is_label_only(self):
        html = render.steps_html(["Just a label, no detail"])
        self.assertIn('<div class="k">Just a label, no detail</div>', html)
        self.assertNotIn('<div class="s">', html)

    def test_numbering_is_sequential(self):
        html = render.steps_html(["a | x", "b | y", "c | z"])
        self.assertIn('<div class="n">1</div>', html)
        self.assertIn('<div class="n">3</div>', html)


if __name__ == "__main__":
    unittest.main()
