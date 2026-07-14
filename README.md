# LuovaVoice

Transfemme voice-training web app for `voice.luova.club`.

## Production

- Frontend: Vite/React static build in `dist/`
- Backend: Flask/Gunicorn WSGI app in `server/`
- Auth: LuovaAuth via `flask_lac`
- Database: MongoDB on `lc-db`, database `voice_luova_club`, collection `progress`
- Service: `voice_luova_club.service` on `lc-main`
- Apache vhost: `voice.luova.club`

Progress sync stores only app progress data. Audio analysis runs in the browser; raw microphone audio is not uploaded.

Training includes selectable Starter, Steady, and Deep session tiers, guided hum-to-vowel warmups, pitch matching, resonance practice, speech transfer, and rest reminders so users do not overtrain.

## Local

```bash
npm install
npm run dev -- --port 5178
```

## Build

```bash
npm run build
python3 -m py_compile server/app.py server/wsgi.py
```
