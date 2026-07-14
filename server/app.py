import os
import re
import secrets
import urllib.parse
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from flask import Flask, jsonify, make_response, redirect, request, send_from_directory
from pymongo import ASCENDING, MongoClient
from pymongo.errors import PyMongoError
from werkzeug.middleware.proxy_fix import ProxyFix

try:
    from flask_lac import AuthPackage, current_user
except Exception:  # Local dev does not always have the LuovaAuth client package.
    AuthPackage = None
    current_user = None

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://95.216.45.31:27017")
MONGO_DB = os.environ.get("MONGO_DB", "voice_luova_club")
LUOVA_AUTH_BASE = os.environ.get("LUOVA_AUTH_BASE", "https://auth.luova.club")
LUOVA_AUTH_APP_ID = os.environ.get("LUOVA_AUTH_APP_ID", "")
PUBLIC_BASE_URL = os.environ.get("PUBLIC_BASE_URL", "https://voice.luova.club")
DEVICE_RE = re.compile(r"^[A-Za-z0-9_-]{16,80}$")

app = Flask(__name__, static_folder=str(DIST), static_url_path="")
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_port=1)
app.secret_key = os.environ.get("SECRET_KEY", secrets.token_hex(32))
app.config.update(
    SESSION_COOKIE_SECURE=True,
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
)
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=3000)
db = client[MONGO_DB]
progress_collection = db["progress"]
progress_collection.create_index([("device_id", ASCENDING)])
progress_collection.create_index([("storage_key", ASCENDING)], unique=True)

if AuthPackage and LUOVA_AUTH_APP_ID:
    AuthPackage(app, auth_service_url=LUOVA_AUTH_BASE, app_id=LUOVA_AUTH_APP_ID)


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def validate_device_id(device_id):
    return bool(DEVICE_RE.match(device_id or ""))


def user_from_request():
    if current_user is not None:
        try:
            if current_user.is_authenticated():
                username = current_user.username
                if username:
                    return {
                        "key": f"luovaauth:{username}",
                        "username": username,
                        "display_name": current_user.display_name or username,
                    }
        except Exception:
            pass

    token = request.cookies.get("luova_token")
    if not token:
        return None
    req = urllib.request.Request(
        f"{LUOVA_AUTH_BASE}/user_info",
        data=b'{"token":"' + token.encode().replace(b'"', b"") + b'"}',
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=3) as response:
            data = response.read().decode("utf-8")
    except Exception:
        return None
    try:
        import json

        parsed = json.loads(data)
    except Exception:
        return None
    if parsed.get("status_machine") != "OK":
        return None
    user = parsed.get("user_info") or {}
    username = user.get("username")
    if not username:
        return None
    return {
        "key": f"luovaauth:{username}",
        "username": username,
        "display_name": user.get("display_name") or username,
    }


def storage_key(device_id):
    user = user_from_request()
    if user:
        return user["key"], "luovaauth", user
    return f"device:{device_id}", "device", None


@app.get("/api/health")
def health():
    client.admin.command("ping")
    return jsonify({"ok": True, "service": "voice.luova.club", "auth": bool(LUOVA_AUTH_APP_ID)})


@app.get("/auth/login")
def auth_login():
    if AuthPackage and LUOVA_AUTH_APP_ID:
        return redirect("/login")
    if not LUOVA_AUTH_APP_ID:
        return jsonify({"error": "LuovaAuth app is not configured"}), 503
    callback = f"{PUBLIC_BASE_URL}/auth/callback"
    params = urllib.parse.urlencode({
        "next": callback,
        "scope": "login,get_user_info",
        "app_id": LUOVA_AUTH_APP_ID,
    })
    return redirect(f"{LUOVA_AUTH_BASE}/authorize?{params}")


@app.get("/auth/callback", endpoint="legacy_auth_callback")
def legacy_auth_callback():
    token = request.args.get("token")
    if not token:
        return redirect("/")
    response = make_response(redirect("/"))
    response.set_cookie(
        "luova_token",
        token,
        max_age=60 * 60 * 24 * 30,
        secure=True,
        httponly=True,
        samesite="Lax",
    )
    return response


@app.get("/auth/logout")
def auth_logout():
    if AuthPackage and LUOVA_AUTH_APP_ID:
        return redirect("/logout")
    response = make_response(redirect("/"))
    response.delete_cookie("luova_token")
    return response


@app.get("/api/me")
def me():
    user = user_from_request()
    return jsonify({"authenticated": bool(user), "user": user})


@app.get("/api/progress/<device_id>")
def get_progress(device_id):
    if not validate_device_id(device_id):
        return jsonify({"error": "invalid device id"}), 400
    key, account_type, user = storage_key(device_id)
    document = progress_collection.find_one({"storage_key": key}, {"_id": 0})
    if not document:
        return jsonify({"progress": None, "account_type": account_type, "user": user})
    return jsonify({
        "progress": document.get("progress"),
        "updated_at": document.get("updated_at"),
        "account_type": account_type,
        "user": user,
    })


@app.put("/api/progress/<device_id>")
def put_progress(device_id):
    if not validate_device_id(device_id):
        return jsonify({"error": "invalid device id"}), 400
    payload = request.get_json(silent=True) or {}
    progress = payload.get("progress")
    if not isinstance(progress, dict) or progress.get("version") != 1:
        return jsonify({"error": "invalid progress payload"}), 400
    if len(str(progress)) > 200_000:
        return jsonify({"error": "progress payload too large"}), 413

    timestamp = now_iso()
    key, account_type, user = storage_key(device_id)
    try:
        progress_collection.update_one(
            {"storage_key": key},
            {
                "$set": {
                    "storage_key": key,
                    "device_id": device_id,
                    "account_type": account_type,
                    "username": user["username"] if user else None,
                    "progress": progress,
                    "updated_at": timestamp,
                },
                "$setOnInsert": {"created_at": timestamp},
            },
            upsert=True,
        )
    except PyMongoError as exc:
        return jsonify({"error": "database unavailable", "detail": exc.__class__.__name__}), 503
    return jsonify({"ok": True, "updated_at": timestamp})


@app.get("/")
def index():
    return send_from_directory(DIST, "index.html")


@app.get("/<path:path>")
def static_or_spa(path):
    candidate = DIST / path
    if candidate.is_file():
        return send_from_directory(DIST, path)
    return send_from_directory(DIST, "index.html")
