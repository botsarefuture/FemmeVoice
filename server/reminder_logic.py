from datetime import timedelta


DEFAULT_REMINDER_DAYS = (0, 1, 2, 3, 4, 5, 6)
VALID_REMINDER_TONES = frozenset({"gentle", "steady", "encouraging"})


def normalize_reminder_days(days):
    if days is None:
        return list(DEFAULT_REMINDER_DAYS)
    if not isinstance(days, list) or not days:
        raise ValueError("Choose at least one reminder day.")
    if any(not isinstance(day, int) or day not in DEFAULT_REMINDER_DAYS for day in days):
        raise ValueError("Choose valid reminder days.")
    return sorted(set(days))


def reminder_is_due(local_now, reminder_time, reminder_days):
    if local_now.weekday() not in reminder_days:
        return False
    hour, minute = (int(part) for part in reminder_time.split(":"))
    scheduled = local_now.replace(hour=hour, minute=minute, second=0, microsecond=0)
    return scheduled <= local_now < scheduled + timedelta(minutes=10)


def reminder_email(display_name, tone, last_practice_date, local_date, public_base_url):
    name = (display_name or "there").strip() or "there"
    tone_openers = {
        "gentle": "A few comfortable minutes are plenty. There is nothing to catch up on.",
        "steady": "A small, repeatable check-in can keep your practice feeling familiar.",
        "encouraging": "Tiny experiments add up. You only need one easy sound to begin.",
    }
    if last_practice_date == local_date:
        context = "You already practised today, so this is simply permission to rest."
    elif last_practice_date:
        context = "Start with the easiest version of your voice today, then stop whenever it stops feeling easy."
    else:
        context = "Your first step can be as small as one soft hum, one listening repeat, or an intentional rest day."
    subject = "A small FemmeVoice moment"
    body = (
        f"Hi {name},\n\n"
        f"{tone_openers.get(tone, tone_openers['gentle'])}\n"
        f"{context}\n\n"
        "A simple option for today:\n"
        "1. Hum softly for one easy breath.\n"
        "2. Play one reference tone and listen first.\n"
        "3. Stop if your voice feels tired, scratchy, or painful.\n\n"
        f"Open practice: {public_base_url}/#practice\n\n"
        f"You chose these opt-in reminders in FemmeVoice Settings. Change the schedule or turn them off any time: {public_base_url}/#account"
    )
    return subject, body
