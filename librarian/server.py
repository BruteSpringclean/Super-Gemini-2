"""Tiny local web server that serves the librarian UI and its JSON API.

Only listens on 127.0.0.1, so nothing is exposed to the network.
"""

import argparse
import json
import os
import socket
import sys
import threading
import traceback
import urllib.parse
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

if __package__ in (None, ""):
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from librarian import core
else:
    from . import core

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
MAX_UPLOAD = 16 * 1024 * 1024
CONTENT_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".svg": "image/svg+xml",
}


class App:
    def __init__(self, home, drive_override=None):
        self.library = core.Library(home)
        self.drive_override = drive_override
        self.write_lock = threading.Lock()

    def drive(self):
        return core.find_drive(self.drive_override or self.library.settings.get("drivePath"))

    def require_drive(self):
        root = self.drive()
        if not root:
            raise core.LibrarianError(
                "Super Gemini drive not found. Hold PATCH while switching the synth on, "
                "connect USB, and wait for the GEMINI disk to appear."
            )
        return root

    def state(self):
        root = self.drive()
        device = {"connected": False, "path": None, "sections": []}
        if root:
            device = {"connected": True, "path": root, "sections": core.describe_device(root, self.library)}
        return {
            "library": self.library.list(),
            "tags": self.library.all_tags(),
            "device": device,
            "backups": core.list_backups(self.library),
            "settings": {
                "drivePath": self.library.settings.get("drivePath", ""),
                "backup": self.library.backup_settings(),
                "home": self.library.home,
                "driveOverride": self.drive_override,
            },
        }


def make_handler(app):
    class Handler(BaseHTTPRequestHandler):
        server_version = "SuperGeminiLibrarian/1.0"

        def log_message(self, fmt, *args):
            if os.environ.get("SGL_DEBUG"):
                sys.stderr.write("%s - %s\n" % (self.address_string(), fmt % args))

        # helpers

        def send_json(self, payload, status=200):
            body = json.dumps(payload).encode("utf-8")
            self.send_response(status)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def read_body(self):
            length = int(self.headers.get("Content-Length") or 0)
            if length > MAX_UPLOAD:
                raise core.LibrarianError("File too large")
            return self.rfile.read(length) if length else b""

        def read_json(self):
            raw = self.read_body()
            return json.loads(raw.decode("utf-8")) if raw else {}

        def check_origin(self):
            # Block other web pages from driving the API via the browser.
            origin = self.headers.get("Origin")
            if origin and urllib.parse.urlparse(origin).hostname not in ("127.0.0.1", "localhost"):
                raise PermissionError("Cross-origin request refused")

        def dispatch(self, method):
            path = urllib.parse.urlparse(self.path).path
            try:
                if method != "GET":
                    self.check_origin()
                if not path.startswith("/api/"):
                    if method != "GET":
                        return self.send_json({"error": "Not found"}, 404)
                    return self.serve_static(path)
                result = self.route(method, path.split("/")[2:])
                if result is not None:
                    self.send_json(result)
            except core.LibrarianError as e:
                self.send_json({"error": str(e)}, 400)
            except PermissionError as e:
                self.send_json({"error": str(e)}, 403)
            except Exception as e:  # keep the app alive, show the error in the UI
                traceback.print_exc()
                self.send_json({"error": "%s: %s" % (type(e).__name__, e)}, 500)

        def do_GET(self):
            self.dispatch("GET")

        def do_POST(self):
            self.dispatch("POST")

        def do_PATCH(self):
            self.dispatch("PATCH")

        def do_DELETE(self):
            self.dispatch("DELETE")

        def serve_static(self, path):
            if path in ("", "/"):
                path = "/index.html"
            full = os.path.realpath(os.path.join(STATIC_DIR, path.lstrip("/")))
            if not full.startswith(os.path.realpath(STATIC_DIR) + os.sep) or not os.path.isfile(full):
                return self.send_json({"error": "Not found"}, 404)
            with open(full, "rb") as f:
                body = f.read()
            self.send_response(200)
            self.send_header("Content-Type", CONTENT_TYPES.get(os.path.splitext(full)[1], "application/octet-stream"))
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)

        def send_download(self, preset):
            with open(app.library.preset_path(preset), "rb") as f:
                body = f.read()
            filename = core.safe_file_stem(preset["name"]) + preset.get("ext", core.DEFAULT_EXTENSION)
            self.send_response(200)
            self.send_header("Content-Type", "application/octet-stream")
            self.send_header("Content-Disposition", 'attachment; filename="%s"' % filename)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)

        # routes

        def route(self, method, parts):
            lib = app.library
            if parts == ["state"] and method == "GET":
                return app.state()

            if parts == ["library", "upload"] and method == "POST":
                filename = urllib.parse.unquote(self.headers.get("X-Filename") or "preset.usg")
                filename = os.path.basename(filename)
                tags = [t for t in urllib.parse.unquote(self.headers.get("X-Tags") or "").split(",") if t.strip()]
                preset, created = lib.add(self.read_body(), filename, tags=tags, source=filename)
                return {"preset": preset, "created": created}

            if len(parts) == 2 and parts[0] == "library":
                pid = parts[1]
                if method == "PATCH":
                    return {"preset": lib.update(pid, self.read_json())}
                if method == "DELETE":
                    lib.remove(pid)
                    return {"ok": True}

            if len(parts) == 3 and parts[0] == "library" and parts[2] == "download" and method == "GET":
                self.send_download(lib.get(parts[1]))
                return None

            if parts == ["device", "write"] and method == "POST":
                body = self.read_json()
                with app.write_lock:
                    return core.write_slots(app.require_drive(), lib, body.get("changes", []))

            if parts == ["device", "import"] and method == "POST":
                body = self.read_json()
                return core.import_from_drive(app.require_drive(), lib, body.get("bank"), body.get("slot"))

            if parts == ["device", "backup"] and method == "POST":
                with app.write_lock:
                    return core.backup_drive(app.require_drive(), lib, label="manual")

            if parts == ["device", "eject"] and method == "POST":
                with app.write_lock:
                    return core.eject_drive(app.require_drive())

            if len(parts) == 3 and parts[0] == "backups" and parts[2] == "restore" and method == "POST":
                with app.write_lock:
                    return core.restore_backup(app.require_drive(), lib, urllib.parse.unquote(parts[1]))

            if parts == ["settings"] and method == "POST":
                body = self.read_json()
                if "drivePath" in body:
                    lib.set_setting("drivePath", str(body["drivePath"]).strip())
                if isinstance(body.get("backup"), dict):
                    backup = lib.backup_settings()
                    backup.update({k: bool(v) for k, v in body["backup"].items() if k in core.KIND_EXT})
                    lib.set_setting("backup", backup)
                return {"ok": True}

            if parts == ["quit"] and method == "POST":
                threading.Thread(target=self.server.shutdown, daemon=True).start()
                return {"ok": True}

            if parts == ["reveal"] and method == "POST":
                if sys.platform == "darwin":
                    import subprocess
                    subprocess.Popen(["open", lib.home])
                return {"ok": True}

            raise core.LibrarianError("Unknown request %s /api/%s" % (method, "/".join(parts)))

    return Handler


def already_running(port):
    import urllib.request
    try:
        with urllib.request.urlopen("http://127.0.0.1:%d/api/state" % port, timeout=1) as r:
            return r.headers.get("Server", "").startswith("SuperGeminiLibrarian")
    except Exception:
        return False


def free_port(preferred):
    for port in [preferred] + list(range(preferred + 1, preferred + 20)):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            try:
                s.bind(("127.0.0.1", port))
                return port
            except OSError:
                continue
    raise SystemExit("No free port found near %d" % preferred)


def main(argv=None):
    parser = argparse.ArgumentParser(description="Preset librarian for the UDO Super Gemini")
    parser.add_argument("--port", type=int, default=8765)
    parser.add_argument("--home", default=core.default_home(), help="where the library is stored")
    parser.add_argument("--drive", help="path of the synth's drive (default: /Volumes/GEMINI)")
    parser.add_argument("--no-browser", action="store_true")
    args = parser.parse_args(argv)

    if already_running(args.port):
        # Opening the app twice just brings up the existing window.
        url = "http://127.0.0.1:%d/" % args.port
        print("Librarian is already running at %s" % url)
        if not args.no_browser:
            webbrowser.open(url)
        return

    app = App(args.home, args.drive)
    port = free_port(args.port)
    httpd = ThreadingHTTPServer(("127.0.0.1", port), make_handler(app))
    url = "http://127.0.0.1:%d/" % port
    print("Super Gemini Librarian running at %s" % url)
    print("Library folder: %s" % args.home)
    print("Close this window (or press Ctrl+C) to quit.")
    if not args.no_browser:
        threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
