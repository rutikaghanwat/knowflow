import unittest
from app.main import split_chunks

class ChunkingTests(unittest.TestCase):
    def test_splits_long_text_and_preserves_page(self):
        text = "A paragraph about the system. " * 120
        chunks = split_chunks([(3, text)], limit=300)
        self.assertGreater(len(chunks), 1)
        self.assertTrue(all(chunk["page"] == 3 for chunk in chunks))
        self.assertTrue(all(chunk["content"] for chunk in chunks))

    def test_empty_text_returns_no_chunks(self):
        self.assertEqual(split_chunks([(1, "   ")]), [])

if __name__ == "__main__":
    unittest.main()
