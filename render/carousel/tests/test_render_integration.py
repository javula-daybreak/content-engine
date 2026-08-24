# tests/test_render_integration.py
# INTEGRATION test — invokes headless Chrome. Run it with the rest:
#   cd render/carousel && python3 -m unittest discover -s tests
# It reads the page count and page size out of the PDF bytes rather than
# shelling out to pdfinfo, because poppler is a user-installed dependency and
# PRD section 1.3 does not allow one. The assertions are unchanged: nine
# pages at 4:5.
import unittest, sys, pathlib, re, tempfile
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import render

HERE = pathlib.Path(__file__).resolve().parent
EXAMPLE = HERE.parent / "examples" / "nine-slide-deck.md"
# The renderer's own tests read the shipped template theme, never a profile:
# a real profile directory is not in the repo and its values are the person's.
THEME = HERE.parents[2] / "profiles" / "_template" / "theme.json"


def pdf_pages(path):
    """Page count from the PDF bytes: /Type /Page, not /Pages."""
    return len(re.findall(rb"/Type\s*/Page[^s]", pathlib.Path(path).read_bytes()))


def pdf_page_size(path):
    """First /MediaBox as a rounded (width, height)."""
    m = re.search(rb"/MediaBox\s*\[\s*[\d.]+\s+[\d.]+\s+([\d.]+)\s+([\d.]+)",
                  pathlib.Path(path).read_bytes())
    if not m:
        return None
    return tuple(round(float(g)) for g in m.groups())


class TestRenderIntegration(unittest.TestCase):
    def test_renders_9_pages_4x5(self):
        with tempfile.TemporaryDirectory() as d:
            out = str(pathlib.Path(d) / "carousel_smoke.pdf")
            render.render_pdf(str(EXAMPLE), out, THEME)
            self.assertTrue(pathlib.Path(out).exists(), "PDF was not produced")
            pages = pdf_pages(out)
            self.assertEqual(pages, 9, f"expected 9 pages, got {pages}")
            size = pdf_page_size(out)
            self.assertIsNotNone(size, "no MediaBox in the PDF")
            self.assertEqual(size, (810, 1013),
                             f"expected 810 x 1013 (4:5), got {size}")

    def test_temp_html_does_not_land_in_the_engine_directory(self):
        # PRD section 1.3: a run writes inside profiles/<handle>/ and nowhere
        # else. The transient HTML goes to the output directory, so nothing is
        # left behind here.
        before = set(p.name for p in render.HERE.iterdir())
        with tempfile.TemporaryDirectory() as d:
            render.render_pdf(str(EXAMPLE), str(pathlib.Path(d) / "x.pdf"), THEME)
            self.assertEqual(set(p.name for p in render.HERE.iterdir()), before)


if __name__ == "__main__":
    unittest.main()
