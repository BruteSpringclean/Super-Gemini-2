#!/bin/bash
# Builds "Super Gemini Librarian.app" (with Python bundled inside) and a .dmg to share.
# Run on a Mac:   packaging/build_mac_app.sh
# Options (environment): PYTHON=python3 to use, TARGET_ARCH=universal2|arm64|x86_64
set -euo pipefail
cd "$(dirname "$0")/.."
PY="${PYTHON:-python3}"
VERSION="${APP_VERSION:-$(cat VERSION)}"
NAME="Super Gemini Librarian"

rm -rf build dist
"$PY" -m venv build/venv
build/venv/bin/pip install --quiet --upgrade pip
build/venv/bin/pip install --quiet -r packaging/requirements-mac.txt

APP_VERSION="$VERSION" build/venv/bin/pyinstaller --noconfirm --clean \
  --distpath dist --workpath build/pyinstaller packaging/SuperGeminiLibrarian.spec

# Disk image: the app, a shortcut to Applications, and opening instructions.
staging=build/dmg
mkdir -p "$staging"
cp -R "dist/$NAME.app" "$staging/"
ln -s /Applications "$staging/Applications"
cp "packaging/Read Me First.txt" "$staging/"
hdiutil create -volname "$NAME" -srcfolder "$staging" -ov -format UDZO \
  "dist/Super-Gemini-Librarian-$VERSION.dmg"

echo "Built dist/$NAME.app and dist/Super-Gemini-Librarian-$VERSION.dmg"
