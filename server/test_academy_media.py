import unittest

from academy_media import validate_media_asset


class AcademyMediaTests(unittest.TestCase):
    def test_foundations_illustration_has_a_publishable_asset_record(self):
        asset = {"id": "voice-pathway", "version": 1, "kind": "image", "locale": "en", "source": "/academy/voice-pathway.jpg", "title": "A simple sound pathway", "rights": {"owner": "FemmeVoice", "license": "MIT project asset"}, "accessibility": {"alternative": "A simplified side profile shows airflow from the lungs through the throat and mouth."}, "review": {"content_checked": True, "research_checked": True, "accessibility_checked": True}}
        self.assertEqual(validate_media_asset(asset)["id"], "voice-pathway")

    def test_media_cannot_publish_without_kind_specific_accessibility(self):
        asset = {"id": "example", "version": 1, "kind": "video", "locale": "en", "source": "/example.mp4", "title": "Example", "rights": {"owner": "FemmeVoice", "license": "Owned"}, "accessibility": {"transcript": "Transcript"}, "review": {"content_checked": True, "research_checked": True, "accessibility_checked": True}}
        with self.assertRaises(ValueError):
            validate_media_asset(asset)
