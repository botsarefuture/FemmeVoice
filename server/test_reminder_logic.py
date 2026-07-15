import unittest
from datetime import datetime

from reminder_logic import reminder_email, reminder_is_due


class ReminderLogicTests(unittest.TestCase):
    def test_delivery_window_accepts_the_next_scheduler_run(self):
        local_now = datetime.fromisoformat("2026-07-15T18:04:00+03:00")
        self.assertTrue(reminder_is_due(local_now, "18:03", [2]))
        self.assertFalse(reminder_is_due(local_now, "18:03", [1]))
        self.assertFalse(reminder_is_due(datetime.fromisoformat("2026-07-15T18:14:00+03:00"), "18:03", [2]))

    def test_email_has_practice_link_and_no_catch_up_language(self):
        subject, body = reminder_email("Emilia", "gentle", None, "2026-07-15", "https://voice.luova.club")
        self.assertEqual(subject, "A small FemmeVoice moment")
        self.assertIn("There is nothing to catch up on", body)
        self.assertIn("https://voice.luova.club/#practice", body)


if __name__ == "__main__":
    unittest.main()
