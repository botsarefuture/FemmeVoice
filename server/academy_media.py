from copy import deepcopy

MEDIA_KINDS = {"audio", "video", "image", "document"}


def validate_media_asset(asset):
    if not isinstance(asset, dict):
        raise ValueError("Media asset must be an object.")
    required = ("id", "version", "kind", "locale", "source", "title", "rights", "accessibility", "review")
    if any(key not in asset for key in required):
        raise ValueError("Media asset is missing required fields.")
    if not _text(asset["id"], 120) or not isinstance(asset["version"], int) or asset["version"] < 1:
        raise ValueError("Media asset identity is invalid.")
    if asset["kind"] not in MEDIA_KINDS or not _text(asset["locale"], 20) or not _text(asset["source"], 2000) or not _text(asset["title"], 300):
        raise ValueError("Media asset metadata is invalid.")
    if not isinstance(asset["rights"], dict) or not _text(asset["rights"].get("owner"), 300) or not _text(asset["rights"].get("license"), 300):
        raise ValueError("Media asset rights and license are required.")
    access = asset["accessibility"]
    if not isinstance(access, dict):
        raise ValueError("Media accessibility metadata is required.")
    if asset["kind"] == "image" and not _text(access.get("alternative"), 2000):
        raise ValueError("Images need alternative text.")
    if asset["kind"] in {"audio", "video"} and not _text(access.get("transcript"), 12000):
        raise ValueError("Audio and video need a transcript.")
    if asset["kind"] == "video" and not _text(access.get("captions"), 2000):
        raise ValueError("Video needs captions.")
    review = asset["review"]
    if not isinstance(review, dict) or not all(review.get(key) is True for key in ("content_checked", "research_checked", "accessibility_checked")):
        raise ValueError("Content, research, and accessibility review are required.")
    return deepcopy(asset)


def _text(value, maximum):
    return isinstance(value, str) and bool(value.strip()) and len(value) <= maximum
