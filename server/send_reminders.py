from datetime import datetime, timezone
from zoneinfo import ZoneInfo, ZoneInfoNotFoundError

from app import PUBLIC_BASE_URL, REMINDER_TIME_RE, progress_collection, send_email, users_collection
from reminder_logic import normalize_reminder_days, reminder_email, reminder_is_due


def main():
    now = datetime.now(timezone.utc)
    sent = 0
    failed = 0
    skipped_after_practice = 0
    for user in users_collection.find({"email_verified_at": {"$exists": True}, "reminder.enabled": True}):
        reminder = user.get("reminder") or {}
        reminder_time = str(reminder.get("time", ""))
        try:
            local_now = now.astimezone(ZoneInfo(reminder.get("timezone") or "UTC"))
        except ZoneInfoNotFoundError:
            failed += 1
            continue
        if not REMINDER_TIME_RE.fullmatch(reminder_time):
            continue
        try:
            reminder_days = normalize_reminder_days(reminder.get("days"))
        except ValueError:
            failed += 1
            continue
        if not reminder_is_due(local_now, reminder_time, reminder_days):
            continue
        local_date = local_now.date().isoformat()
        if reminder.get("last_sent_local_date") == local_date:
            continue
        progress_document = progress_collection.find_one({"storage_key": f"account:{user['_id']}"}, {"progress.days": 1}) or {}
        progress_days = ((progress_document.get("progress") or {}).get("days") or [])
        if any(day.get("date") == local_date for day in progress_days if isinstance(day, dict)):
            skipped_after_practice += 1
            continue
        recorded_dates = sorted(day.get("date") for day in progress_days if isinstance(day, dict) and isinstance(day.get("date"), str) and day.get("date") < local_date)
        last_practice_date = recorded_dates[-1] if recorded_dates else None
        try:
            subject, body = reminder_email(user.get("display_name") or user.get("username"), reminder.get("tone", "gentle"), last_practice_date, local_date, PUBLIC_BASE_URL)
            send_email(user["email"], subject, body)
            users_collection.update_one(
                {"_id": user["_id"], "reminder.last_sent_local_date": {"$ne": local_date}},
                {"$set": {"reminder.last_sent_local_date": local_date}},
            )
            sent += 1
        except Exception:
            failed += 1
    print(f"FemmeVoice reminders: sent={sent} skipped_after_practice={skipped_after_practice} failed={failed}")


if __name__ == "__main__":
    main()
