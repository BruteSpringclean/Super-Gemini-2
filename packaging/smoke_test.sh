#!/bin/bash
# Starts the built app without a window and checks that the UI and API respond.
set -euo pipefail
cd "$(dirname "$0")/.."
BIN="dist/Super Gemini Librarian.app/Contents/MacOS/Super Gemini Librarian"
HOME_DIR="$(mktemp -d)"
LOG="$HOME/Library/Logs/Super Gemini Librarian.log"

echo "Architectures: $(lipo -archs "$BIN")"
"$BIN" --no-window --port 8790 --home "$HOME_DIR" &
PID=$!
trap 'kill $PID 2>/dev/null || true' EXIT
for _ in $(seq 1 60); do
  curl -sf http://127.0.0.1:8790/api/state >/dev/null && break
  sleep 1
done
# fetch first, then search (piping curl into "grep -q" fails with a write error)
page="$(curl -sf http://127.0.0.1:8790/)"; grep -q "Super Gemini Librarian" <<<"$page"
js="$(curl -sf http://127.0.0.1:8790/app.js)"; grep -q "KIND_EXT" <<<"$js"
state="$(curl -sf http://127.0.0.1:8790/api/state)"; grep -q '"backup"' <<<"$state"
curl -sf -X POST http://127.0.0.1:8790/api/quit >/dev/null
wait $PID
trap - EXIT
echo "Smoke test passed"
[ -f "$LOG" ] && tail -n 20 "$LOG" || true
