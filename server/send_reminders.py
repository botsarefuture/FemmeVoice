from datetime import datetime, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app import REMINDER_TIME_RE, send_email, users_collection


def main():
    now = datetime.now(timezone.utc)
    sent = 0
    failed = 0
    for user in users_collection.find({"email_verified_at": {"$exists": True}, "reminder.enabled": True}):
        reminder = user.get("reminder") or {}
        reminder_time = str(reminder.get("time", ""))
        try:
            local_now = now.astimezone(ZoneInfo(reminder.get("timezone") or "UTC"))
        except ZoneInfoNotFoundError:
            failed += 1
            continue
        if not REMINDER_TIME_RE.fullmatch(reminder_time) or local_now.strftime("%H:%M") != reminder_time:
            continue
        local_date = local_now.date().isoformat()
        if reminder.get("last_sent_local_date") == local_date:
            continue
        try:
            send_email(
                user["email"],
                "A gentle FemmeVoice practice reminder",
                "A few easy minutes can be enough today. Open FemmeVoice when you have the energy, and stop whenever your voice wants rest.\n\nYou can turn off daily reminders in FemmeVoice Settings at any time.",
            )
            users_collection.update_one(
                {"_id": user["_id"], "reminder.last_sent_local_date": {"$ne": local_date}},
                {"$set": {"reminder.last_sent_local_date": local_date}},
            )
            sent += 1
        except Exception:
            failed += 1
    print(f"FemmeVoice reminders: sent={sent} failed={failed}")


if __name__ == "__main__":
    main()
