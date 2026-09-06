# tests/test_v2.py
# Unit tests for the v2 archetypes: quote-spotlight, image-bg, index, logo-wall.
# Mirrors the test_assemble.py style: assert render_slide emits the key
# structural class per archetype. image-bg additionally exercises the base64
# data-URI embedding (with a tiny temp PNG) + scrim selection + missing-file
# error; index exercises auto-numbering and the 2-column threshold.
import unittest, sys, pathlib, struct, zlib, tempfile, os
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))
import render


def _tiny_png():
    """Return the bytes of a minimal valid 1x1 opaque-green PNG (stdlib only)."""
    def chunk(typ, data):
        c = typ + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c) & 0xffffffff)
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)  # 1x1, 8-bit, RGB
    raw = b"\x00" + bytes((0x39, 0xB1, 0x5A))             # filter 0 + one green pixel
    idat = zlib.compress(raw)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


class TestQuoteSpotlight(unittest.TestCase):
    def test_quote_needs_attribution(self):
        """VISUALS section 2.4: the engine must be STRUCTURALLY incapable of a
        quote card. Attribution is the field that separates a sourced pull-quote
        from one, so it is required, not requested."""
        bare = ":: quote-spotlight\nquote: A sentence in large type\n"
        meta, slides = render.parse_spec(bare)
        out = render.check_spec(meta, slides)
        self.assertTrue(any("attribution" in x and x.startswith("ERROR")
                            for x in out), out)
        meta, slides = render.parse_spec(bare + "attribution: Someone, 2026\n")
        self.assertEqual(render.check_spec(meta, slides), [])

    def test_emits_pull_quote_structure(self):
        slide = {"archetype": "quote-spotlight", "kicker": "K",
                 "quote": "We stopped **guessing**.",
                 "attribution": "Contoso, 2026",
                 "items": [], "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=6, meta={"footer": "f"})
        self.assertIn('class="pull"', html)
        self.assertIn('class="pull-q"', html)
        self.assertIn('<span class="g">guessing</span>', html)      # **bold** -> accent
        self.assertIn("Contoso, 2026", html)
        self.assertIn('class="attr', html)
        self.assertIn('data-step="2"', html)

    def test_attribution_optional(self):
        slide = {"archetype": "quote-spotlight", "kicker": "K",
                 "quote": "A quote with no source.",
                 "items": [], "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=6, meta={"footer": "f"})
        self.assertIn('class="pull-q"', html)
        self.assertNotIn('class="attr', html)


class TestImageBg(unittest.TestCase):
    def test_embeds_data_uri_and_scrim(self):
        with tempfile.TemporaryDirectory() as d:
            img = pathlib.Path(d) / "shot.png"
            img.write_bytes(_tiny_png())
            slide = {"archetype": "image-bg", "image": "shot.png",
                     "headline": "Over the **photo**.", "body": "A line.",
                     "items": [], "left_items": [], "right_items": []}
            html = render.render_slide(slide, step=3, total=6,
                                       meta={"footer": "f"}, base_dir=d)
        self.assertIn("imgbg", html)
        self.assertIn("scrim-dark", html)                 # default scrim
        self.assertIn("data:image/png;base64,", html)     # embedded, self-contained
        self.assertIn("scrim-fill", html)
        self.assertIn('<span class="g">photo</span>', html)

    def test_scrim_override_light(self):
        with tempfile.TemporaryDirectory() as d:
            img = pathlib.Path(d) / "p.jpg"
            img.write_bytes(_tiny_png())   # bytes need not be a real jpeg for the embed
            slide = {"archetype": "image-bg", "image": "p.jpg", "scrim": "light",
                     "headline": "Dark text.", "items": [],
                     "left_items": [], "right_items": []}
            html = render.render_slide(slide, step=3, total=6,
                                       meta={"footer": "f"}, base_dir=d)
        self.assertIn("scrim-light", html)
        self.assertIn("data:image/jpeg;base64,", html)    # mime by extension

    def test_absolute_path_accepted(self):
        with tempfile.TemporaryDirectory() as d:
            img = pathlib.Path(d) / "abs.png"
            img.write_bytes(_tiny_png())
            slide = {"archetype": "image-bg", "image": str(img),
                     "headline": "H", "items": [],
                     "left_items": [], "right_items": []}
            html = render.render_slide(slide, step=3, total=6,
                                       meta={"footer": "f"}, base_dir="/nonexistent")
        self.assertIn("data:image/png;base64,", html)

    def test_missing_image_errors_with_path(self):
        slide = {"archetype": "image-bg", "image": "nope.png",
                 "headline": "H", "items": [],
                 "left_items": [], "right_items": []}
        with self.assertRaises(FileNotFoundError) as ctx:
            render.render_slide(slide, step=3, total=6,
                                meta={"footer": "f"}, base_dir="/tmp")
        self.assertIn("nope.png", str(ctx.exception))

    def test_unsupported_extension_errors(self):
        with tempfile.TemporaryDirectory() as d:
            img = pathlib.Path(d) / "bad.bmp"
            img.write_bytes(_tiny_png())
            with self.assertRaises(ValueError) as ctx:
                render.image_data_uri("bad.bmp", base_dir=d)
        self.assertIn(".bmp", str(ctx.exception))

    def test_check_spec_flags_missing_image_file(self):
        meta = {"theme": "theme.json"}
        slides = [{"archetype": "image-bg", "image": "ghost.png",
                   "headline": "H", "items": [], "left_items": [], "right_items": []}]
        problems = render.check_spec(meta, slides, base_dir="/tmp")
        self.assertTrue(any("image file not found" in p for p in problems), problems)

    def test_check_spec_flags_absent_image_field(self):
        # No image: at all -> the generic REQUIRED check fires.
        meta = {"theme": "theme.json"}
        slides = [{"archetype": "image-bg", "headline": "H", "items": [],
                   "left_items": [], "right_items": []}]
        problems = render.check_spec(meta, slides, base_dir="/tmp")
        self.assertTrue(any("missing required field 'image'" in p for p in problems),
                        problems)


class TestIndex(unittest.TestCase):
    def test_auto_numbering_two_digit(self):
        slide = {"archetype": "index", "headline": "What's inside",
                 "items": ["The trap", "The flaw", "The shift"],
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=6, meta={"footer": "f"})
        self.assertIn('class="index', html)
        self.assertIn('<span class="ix-n">01</span>', html)
        self.assertIn('<span class="ix-n">02</span>', html)
        self.assertIn('<span class="ix-n">03</span>', html)
        self.assertIn("The shift", html)

    def test_single_column_when_short(self):
        slide = {"archetype": "index", "headline": "H",
                 "items": ["a", "b", "c", "d", "e", "f"],   # exactly 6 -> 1 col
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=6, meta={"footer": "f"})
        self.assertNotIn("cols-2", html)

    def test_two_columns_when_long(self):
        slide = {"archetype": "index", "headline": "H",
                 "items": ["a", "b", "c", "d", "e", "f", "g"],  # 7 -> 2 cols
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=2, total=6, meta={"footer": "f"})
        self.assertIn("cols-2", html)


class TestLogoWall(unittest.TestCase):
    # Labels are the documentation-reserved names, per PRD section 1.2's rule
    # for gate-fixtures: a fixture never names a real company.
    def test_emits_grid_cells(self):
        slide = {"archetype": "logo-wall", "headline": "The grid",
                 "items": ["Acme", "Contoso", "Northwind", "Fabrikam"],
                 "note": "and more", "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=4, total=6, meta={"footer": "f"})
        self.assertIn('class="logo-wall', html)
        self.assertIn('<div class="logo-cell">Acme</div>', html)
        self.assertIn('<div class="logo-cell">Fabrikam</div>', html)
        self.assertIn("and more", html)        # note caption renders

    def test_three_columns_when_many(self):
        slide = {"archetype": "logo-wall", "headline": "H",
                 "items": ["a", "b", "c", "d", "e", "f"],   # >4 -> 3 cols
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=4, total=6, meta={"footer": "f"})
        self.assertIn("cols-3", html)

    def test_two_columns_when_few(self):
        slide = {"archetype": "logo-wall", "headline": "H",
                 "items": ["a", "b", "c", "d"],             # <=4 -> 2 cols
                 "left_items": [], "right_items": []}
        html = render.render_slide(slide, step=4, total=6, meta={"footer": "f"})
        self.assertIn("cols-2", html)
        self.assertNotIn("cols-3", html)


if __name__ == "__main__":
    unittest.main()
