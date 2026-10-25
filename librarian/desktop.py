"""Entry point for the stand-alone Mac app.

Runs the librarian's local server in the background and shows the UI in the
app's own window (pywebview, which uses the same WebKit engine as Safari).
If pywebview is not available it falls back to the default web browser.
"""

import argparse
import os
import sys
import threading
import webbrowser

if __package__ in (None, ""):
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from librarian import core, server
else:
    from . import core, server

APP_NAME = "Super Gemini Librarian"
if sys.platform == "win32":
    LOG_PATH = os.path.join(os.environ.get("LOCALAPPDATA", os.path.expanduser("~")), APP_NAME, APP_NAME + ".log")
else:
    LOG_PATH = os.path.join(os.path.expanduser("~"), "Library", "Logs", APP_NAME + ".log")


def setup_logging():
    # A double-clicked app has no terminal, so keep messages and errors in a log file.
    if getattr(sys, "frozen", False) or sys.stdout is None:
        os.makedirs(os.path.dirname(LOG_PATH), exist_ok=True)
        log = open(LOG_PATH, "a", buffering=1, encoding="utf-8")
        sys.stdout = sys.stderr = log


def main(argv=None):
    parser = argparse.ArgumentParser(description="Preset librarian for the UDO Super Gemini")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--home", default=core.default_home(), help="where the library is stored")
    parser.add_argument("--drive", help="path of the synth's drive (default: /Volumes/GEMINI)")
    parser.add_argument("--no-window", action="store_true", help="run the server only (for testing)")
    args = parser.parse_args(argv)

    setup_logging()
    httpd, app = server.start_server(args.home, args.drive, args.port)
    thread = threading.Thread(target=httpd.serve_forever, daemon=True)
    thread.start()
    print("%s running at %s (library: %s)" % (APP_NAME, app.url, args.home))

    try:
        if args.no_window:
            thread.join()
            return
        try:
            import webview
        except ImportError:
            webbrowser.open(app.url)
            thread.join()
            return

        app.desktop = True
        try:
            webview.settings["ALLOW_DOWNLOADS"] = True  # for "Export file"
        except (AttributeError, TypeError):
            pass
        window = webview.create_window(
            APP_NAME, app.url, width=1440, height=900, min_size=(960, 620),
            background_color="#15161A", text_select=True,
        )
        app.on_quit = window.destroy  # the Quit button closes the window
        webview.start()  # returns once the window is closed
    except KeyboardInterrupt:
        pass
    finally:
        httpd.shutdown()
        httpd.server_close()


if __name__ == "__main__":
    main()
