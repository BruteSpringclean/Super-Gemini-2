#!/bin/bash
# Builds "Super Gemini Librarian.app" so the librarian can live in /Applications
# and be started from Launchpad or the Dock like any other app.
set -euo pipefail
cd "$(dirname "$0")"
SRC="$(pwd)"
DEST="${1:-$HOME/Applications}"
APP="$DEST/Super Gemini Librarian.app"

mkdir -p "$DEST"
rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp -R "$SRC/librarian" "$APP/Contents/Resources/"
find "$APP/Contents/Resources" -name '__pycache__' -prune -exec rm -rf {} +

cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleName</key><string>Super Gemini Librarian</string>
  <key>CFBundleDisplayName</key><string>Super Gemini Librarian</string>
  <key>CFBundleIdentifier</key><string>local.supergemini.librarian</string>
  <key>CFBundleVersion</key><string>1.0</string>
  <key>CFBundleShortVersionString</key><string>1.0</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleExecutable</key><string>launcher</string>
  <key>LSMinimumSystemVersion</key><string>10.15</string>
</dict>
</plist>
PLIST

cat > "$APP/Contents/MacOS/launcher" <<'LAUNCH'
#!/bin/bash
RES="$(cd "$(dirname "$0")/../Resources" && pwd)"
LOG="$HOME/Library/Logs/SuperGeminiLibrarian.log"
PY="$(command -v python3 || echo /usr/bin/python3)"
if ! "$PY" -c 'import sys; sys.exit(sys.version_info < (3, 8))' 2>/dev/null; then
  osascript -e 'display dialog "Super Gemini Librarian needs Python 3.8 or newer. Open Terminal and run: xcode-select --install" buttons {"OK"} with icon caution'
  exit 1
fi
cd "$RES" && exec "$PY" -m librarian >>"$LOG" 2>&1
LAUNCH
chmod +x "$APP/Contents/MacOS/launcher"

echo "Built: $APP"
echo "Open it from Finder (first time: right-click > Open, because it is not signed)."
