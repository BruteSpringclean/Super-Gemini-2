import json
import os
import shutil
import tempfile
import threading
import unittest
import urllib.request
from http.server import ThreadingHTTPServer

from librarian import core, server

BANKS = [l + n for n in "12" for l in "abcdefgh"]


def make_fake_drive(root, section="patches"):
    for bank in BANKS:
        d = os.path.join(root, section, bank)
        os.makedirs(d)
        for slot in range(1, 9):
            with open(os.path.join(d, "p%d_%s_sound_%d.usg" % (slot, bank, slot)), "wb") as f:
                f.write(("%s-%d" % (bank, slot)).encode() * 10)
    with open(os.path.join(root, "init_patch.usg"), "wb") as f:
        f.write(b"init")


class LibrarianTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.drive = os.path.join(self.tmp, "GEMINI")
        make_fake_drive(self.drive)
        self.lib = core.Library(os.path.join(self.tmp, "home"))

    def tearDown(self):
        shutil.rmtree(self.tmp)

    def bank_files(self, bank):
        return sorted(os.listdir(os.path.join(self.drive, "patches", bank)))

    def test_scan_finds_all_banks_in_panel_order(self):
        sections = core.scan_drive(self.drive)
        self.assertEqual(len(sections), 1)
        banks = sections[0]["banks"]
        self.assertEqual([b["name"] for b in banks], [b.upper() for b in BANKS])
        self.assertEqual(banks[0]["slots"][2]["files"], ["p3_a1_sound_3.usg"])

    def test_scan_ignores_macos_junk(self):
        d = os.path.join(self.drive, "patches", "a1")
        open(os.path.join(d, "._p1_a1_sound_1.usg"), "wb").close()
        open(os.path.join(d, ".DS_Store"), "wb").close()
        slot = core.scan_drive(self.drive)[0]["banks"][0]["slots"][0]
        self.assertEqual(slot["files"], ["p1_a1_sound_1.usg"])

    def test_library_dedupes_and_names(self):
        p, created = self.lib.add(b"abc", "p4_Warm_Pad.usg")
        self.assertTrue(created)
        self.assertEqual(p["name"], "Warm Pad")
        again, created = self.lib.add(b"abc", "other.usg", tags=["pad"])
        self.assertFalse(created)
        self.assertEqual(again["tags"], ["pad"])
        reloaded = core.Library(self.lib.home)
        self.assertEqual(reloaded.get(p["id"])["tags"], ["pad"])

    def test_update_tags_and_notes(self):
        p, _ = self.lib.add(b"abc", "bass.usg")
        self.lib.update(p["id"], {"tags": ["Bass", " ", "mono", "Bass"], "notes": "hi", "favorite": True})
        self.assertEqual(self.lib.get(p["id"])["tags"], ["Bass", "mono"])
        self.assertTrue(self.lib.get(p["id"])["favorite"])
        self.assertEqual(self.lib.all_tags(), ["Bass", "mono"])

    def test_write_replaces_slot_and_backs_up(self):
        p, _ = self.lib.add(b"new sound", "My Lead!.usg")
        res = core.write_slots(self.drive, self.lib, [{"bank": "patches/c2", "slot": 5, "presetId": p["id"]}])
        files = self.bank_files("c2")
        self.assertIn("p5_my_lead.usg", files)
        self.assertNotIn("p5_c2_sound_5.usg", files)
        self.assertEqual(len(files), 8)
        with open(os.path.join(self.drive, "patches", "c2", "p5_my_lead.usg"), "rb") as f:
            self.assertEqual(f.read(), b"new sound")
        backup = os.path.join(self.lib.backup_dir, res["backup"], "patches", "c2", "p5_c2_sound_5.usg")
        self.assertTrue(os.path.exists(backup))
        self.assertTrue(os.path.exists(os.path.join(self.lib.backup_dir, res["backup"], "init_patch.usg")))

    def test_write_clear_slot(self):
        core.write_slots(self.drive, self.lib, [{"bank": "patches/a1", "slot": 1, "presetId": None}])
        self.assertEqual(len(self.bank_files("a1")), 7)
        slot = core.describe_device(self.drive, self.lib)[0]["banks"][0]["slots"][0]
        self.assertIsNone(slot["file"])

    def test_write_rejects_bad_targets(self):
        p, _ = self.lib.add(b"x", "x.usg")
        with self.assertRaises(core.LibrarianError):
            core.write_slots(self.drive, self.lib, [{"bank": "../evil", "slot": 1, "presetId": p["id"]}])
        with self.assertRaises(core.LibrarianError):
            core.write_slots(self.drive, self.lib, [{"bank": "patches/a1", "slot": 9, "presetId": p["id"]}])

    def test_write_removes_appledouble_files(self):
        d = os.path.join(self.drive, "patches", "a1")
        open(os.path.join(d, "._p2_a1_sound_2.usg"), "wb").close()
        p, _ = self.lib.add(b"x", "x.usg")
        core.write_slots(self.drive, self.lib, [{"bank": "patches/a1", "slot": 2, "presetId": p["id"]}])
        self.assertFalse(any(f.startswith("._") for f in os.listdir(d)))

    def test_import_and_device_matches_library(self):
        res = core.import_from_drive(self.drive, self.lib)
        self.assertEqual(res, {"added": 128, "seen": 128})
        slot = core.describe_device(self.drive, self.lib)[0]["banks"][3]["slots"][6]
        self.assertEqual(slot["name"], "d1 sound 7")
        self.assertIsNotNone(slot["presetId"])
        res = core.import_from_drive(self.drive, self.lib, bank="patches/a1", slot=1)
        self.assertEqual(res, {"added": 0, "seen": 1})

    def test_restore_backup(self):
        b = core.backup_drive(self.drive, self.lib)
        p, _ = self.lib.add(b"replacement", "r.usg")
        core.write_slots(self.drive, self.lib, [{"bank": "patches/h2", "slot": 8, "presetId": p["id"]}])
        self.assertIn("p8_r.usg", self.bank_files("h2"))
        core.restore_backup(self.drive, self.lib, b["name"])
        self.assertIn("p8_h2_sound_8.usg", self.bank_files("h2"))
        self.assertNotIn("p8_r.usg", self.bank_files("h2"))
        with self.assertRaises(core.LibrarianError):
            core.restore_backup(self.drive, self.lib, "../../etc")

    def test_empty_bank_folders_are_found(self):
        os.makedirs(os.path.join(self.drive, "performances", "a1"))
        sections = core.scan_drive(self.drive)
        perf = [s for s in sections if s["path"] == "performances"][0]
        self.assertEqual(perf["kind"], "performance")
        self.assertEqual(perf["banks"][0]["slots"][0]["files"], [])


class ApiTest(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.mkdtemp()
        self.drive = os.path.join(self.tmp, "GEMINI")
        make_fake_drive(self.drive)
        app = server.App(os.path.join(self.tmp, "home"), self.drive)
        self.httpd = ThreadingHTTPServer(("127.0.0.1", 0), server.make_handler(app))
        self.base = "http://127.0.0.1:%d" % self.httpd.server_address[1]
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()
        self.opener = urllib.request.build_opener(urllib.request.ProxyHandler({}))

    def tearDown(self):
        self.httpd.shutdown()
        self.httpd.server_close()
        shutil.rmtree(self.tmp)

    def call(self, method, path, body=None, headers=None):
        data = body if isinstance(body, bytes) else (json.dumps(body).encode() if body is not None else None)
        req = urllib.request.Request(self.base + path, data=data, method=method, headers=headers or {})
        try:
            with self.opener.open(req) as r:
                return r.status, json.loads(r.read())
        except urllib.error.HTTPError as e:
            return e.code, json.loads(e.read())

    def test_upload_tag_write_flow(self):
        status, res = self.call("POST", "/api/library/upload", b"sound-bytes",
                                {"X-Filename": "Big%20Pad.usg", "X-Tags": "pads"})
        self.assertEqual(status, 200)
        pid = res["preset"]["id"]
        self.assertEqual(res["preset"]["tags"], ["pads"])
        status, res = self.call("PATCH", "/api/library/" + pid, {"tags": ["pads", "warm"]})
        self.assertEqual(res["preset"]["tags"], ["pads", "warm"])
        status, res = self.call("POST", "/api/device/write",
                                {"changes": [{"bank": "patches/b1", "slot": 3, "presetId": pid}]})
        self.assertEqual(status, 200, res)
        status, st = self.call("GET", "/api/state")
        slot = st["device"]["sections"][0]["banks"][1]["slots"][2]
        self.assertEqual(slot["name"], "Big Pad")
        self.assertEqual(len(st["backups"]), 1)

    def test_cross_origin_writes_refused(self):
        status, _ = self.call("POST", "/api/device/backup", {}, {"Origin": "https://evil.example"})
        self.assertEqual(status, 403)

    def test_static_index(self):
        with self.opener.open(self.base + "/") as r:
            self.assertIn(b"Super Gemini Librarian", r.read())
        status, _ = self.call("GET", "/../core.py")
        self.assertEqual(status, 404)


if __name__ == "__main__":
    unittest.main()
