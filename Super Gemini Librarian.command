#!/bin/bash
# Double-click this file in Finder to start the Super Gemini Librarian.
cd "$(dirname "$0")" || exit 1
if ! command -v python3 >/dev/null 2>&1; then
  osascript -e 'display dialog "Python 3 is needed. Open Terminal, run: xcode-select --install, then try again." buttons {"OK"} with icon caution'
  exit 1
fi
exec python3 -m librarian "$@"
