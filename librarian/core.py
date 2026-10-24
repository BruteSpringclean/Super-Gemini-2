"""Core logic for the Super Gemini librarian.

The UDO Super Gemini does not take presets over SysEx. Instead, when it is
switched on while holding PATCH, it mounts as a USB drive (named GEMINI, or
SUPER8 on the Super 8) and every slot is a plain file on that drive:

    <drive>/<some folder>/<bank folder, e.g. a1 .. h2>/p<slot>_<name>.usg

The slot number comes from the "p1".."p8" prefix; the rest of the name is
free text. Because folder names can differ between firmware versions, the
device side of this module *discovers* bank folders instead of hard-coding
them: any folder named like a bank (a1..h2) or containing p<N>_ files counts.

The library side keeps every preset you have ever imported in one folder,
deduplicated by content, with names, tags and notes in library.json.
"""

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import time
from datetime import datetime

SLOTS_PER_BANK = 8
DEFAULT_EXTENSION = ".usg"
DRIVE_NAMES = ("GEMINI", "SUPER8")

BANK_DIR_RE = re.compile(r"^[a-h][12]$", re.IGNORECASE)
# Only .usg files are ever treated as presets, so the librarian can neither
# write nor delete anything else on the synth's drive.
SLOT_FILE_RE = re.compile(r"^p([1-8])(?:[_\- ](.*))?(\.usg)$", re.IGNORECASE)
SKIP_DIRS = {".trashes", ".spotlight-v100", ".fseventsd", ".temporaryitems", "system volume information"}
JUNK_FILES = {".ds_store"}
MAX_SCAN_DEPTH = 4


def default_home():
    if os.environ.get("SGL_HOME"):
        return os.environ["SGL_HOME"]
    return os.path.join(os.path.expanduser("~"), "Music", "Super Gemini Librarian")


def content_id(data):
    return hashlib.sha1(data).hexdigest()[:12]


def now_iso():
    return datetime.now().isoformat(timespec="seconds")


def is_junk(name):
    # macOS litters FAT drives with "._name" AppleDouble files and .DS_Store;
    # the synth may mistake them for presets, so we never treat them as data.
    return name.startswith("._") or name.lower() in JUNK_FILES


def name_from_filename(filename):
    stem, ext = os.path.splitext(filename)
    m = SLOT_FILE_RE.match(filename)
    if m:
        stem = m.group(2) or ""
    stem = stem.replace("_", " ").strip()
    return stem or "untitled"


def safe_file_stem(name):
    """Turn a display name into something safe for a FAT drive."""
    stem = re.sub(r"[^A-Za-z0-9\-]+", "_", name.strip()).strip("_").lower()
    return (stem or "preset")[:40]


def slot_filename(slot, name):
    return "p%d_%s%s" % (slot, safe_file_stem(name), DEFAULT_EXTENSION)


def is_preset_filename(filename):
    return os.path.splitext(filename)[1].lower() == DEFAULT_EXTENSION


class LibrarianError(Exception):
    pass


# ---------------------------------------------------------------- library


class Library:
    """Presets stored on the Mac, with tags and notes."""

    def __init__(self, home):
        self.home = home
        self.preset_dir = os.path.join(home, "presets")
        self.backup_dir = os.path.join(home, "backups")
        self.index_path = os.path.join(home, "library.json")
        self.lock = threading.RLock()
        os.makedirs(self.preset_dir, exist_ok=True)
        os.makedirs(self.backup_dir, exist_ok=True)
        self.data = {"presets": {}, "settings": {}}
        if os.path.exists(self.index_path):
            with open(self.index_path, "r", encoding="utf-8") as f:
                loaded = json.load(f)
            self.data["presets"] = loaded.get("presets", {})
            self.data["settings"] = loaded.get("settings", {})

    # persistence

    def save(self):
        with self.lock:
            fd, tmp = tempfile.mkstemp(dir=self.home, suffix=".json")
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2, sort_keys=True)
            os.replace(tmp, self.index_path)

    @property
    def settings(self):
        return self.data["settings"]

    def set_setting(self, key, value):
        with self.lock:
            self.settings[key] = value
            self.save()

    # presets

    def preset_path(self, preset):
        return os.path.join(self.preset_dir, preset["id"] + preset.get("ext", DEFAULT_EXTENSION))

    def get(self, preset_id):
        preset = self.data["presets"].get(preset_id)
        if preset is None:
            raise LibrarianError("No preset with id %s" % preset_id)
        return preset

    def read_bytes(self, preset_id):
        with open(self.preset_path(self.get(preset_id)), "rb") as f:
            return f.read()

    def list(self):
        return sorted(self.data["presets"].values(), key=lambda p: (p["name"].lower(), p["id"]))

    def all_tags(self):
        tags = set()
        for p in self.data["presets"].values():
            tags.update(p.get("tags", []))
        return sorted(tags, key=str.lower)

    def add(self, data, filename, kind=None, tags=None, source=None):
        """Add raw preset bytes. Returns (preset, created)."""
        if not is_preset_filename(filename):
            raise LibrarianError("%s is not a Super Gemini preset (.usg file)" % filename)
        if not data:
            raise LibrarianError("%s is empty" % filename)
        ext = DEFAULT_EXTENSION
        pid = content_id(data)
        with self.lock:
            existing = self.data["presets"].get(pid)
            if existing:
                if tags:
                    existing["tags"] = sorted(set(existing.get("tags", [])) | set(tags), key=str.lower)
                    self.save()
                return existing, False
            preset = {
                "id": pid,
                "name": name_from_filename(filename),
                "ext": ext,
                "kind": kind or guess_kind(filename),
                "tags": sorted(set(tags or []), key=str.lower),
                "notes": "",
                "favorite": False,
                "added": now_iso(),
                "source": source or filename,
                "size": len(data),
            }
            with open(self.preset_path(preset), "wb") as f:
                f.write(data)
            self.data["presets"][pid] = preset
            self.save()
            return preset, True

    def update(self, preset_id, changes):
        with self.lock:
            preset = self.get(preset_id)
            if "name" in changes:
                name = str(changes["name"]).strip()
                if not name:
                    raise LibrarianError("Name cannot be empty")
                preset["name"] = name[:60]
            if "tags" in changes:
                tags = {str(t).strip() for t in changes["tags"] if str(t).strip()}
                preset["tags"] = sorted(tags, key=str.lower)
            if "notes" in changes:
                preset["notes"] = str(changes["notes"])
            if "favorite" in changes:
                preset["favorite"] = bool(changes["favorite"])
            if "kind" in changes and changes["kind"] in ("patch", "performance"):
                preset["kind"] = changes["kind"]
            self.save()
            return preset

    def remove(self, preset_id):
        with self.lock:
            preset = self.get(preset_id)
            try:
                os.remove(self.preset_path(preset))
            except FileNotFoundError:
                pass
            del self.data["presets"][preset_id]
            self.save()


def guess_kind(path):
    lowered = path.lower()
    if "perf" in lowered:
        return "performance"
    return "patch"


# ---------------------------------------------------------------- device


def find_drive(configured=None):
    """Return the mounted Super Gemini drive, or None."""
    candidates = []
    if configured:
        candidates.append(configured)
    for name in DRIVE_NAMES:
        candidates.append(os.path.join("/Volumes", name))
    for path in candidates:
        if path and os.path.isdir(path):
            return path
    return None


def bank_sort_key(name):
    n = name.lower()
    if BANK_DIR_RE.match(n):
        return (0, int(n[1]), n[0])
    return (1, 0, n)


def scan_drive(root):
    """Find bank folders on the drive.

    Returns a list of sections (one per parent folder), each holding banks
    with exactly SLOTS_PER_BANK slots.
    """
    banks = []
    root = os.path.abspath(root)
    for dirpath, dirnames, filenames in os.walk(root):
        rel = os.path.relpath(dirpath, root)
        depth = 0 if rel == "." else rel.count(os.sep) + 1
        dirnames[:] = sorted(
            d for d in dirnames
            if not d.startswith(".") and d.lower() not in SKIP_DIRS and depth < MAX_SCAN_DEPTH
        )
        if rel == ".":
            continue
        slot_files = [f for f in filenames if not is_junk(f) and SLOT_FILE_RE.match(f)]
        if BANK_DIR_RE.match(os.path.basename(dirpath)) or slot_files:
            banks.append((rel, sorted(slot_files)))

    sections = {}
    for rel, slot_files in banks:
        parent = os.path.dirname(rel)
        slots = []
        for n in range(1, SLOTS_PER_BANK + 1):
            matches = [f for f in slot_files if int(SLOT_FILE_RE.match(f).group(1)) == n]
            slots.append({"slot": n, "files": matches})
        sections.setdefault(parent, []).append({
            "path": rel,
            "name": os.path.basename(rel).upper(),
            "slots": slots,
        })

    result = []
    for parent in sorted(sections):
        result.append({
            "path": parent,
            "name": parent or "(drive root)",
            "kind": guess_kind(parent),
            "banks": sorted(sections[parent], key=lambda b: bank_sort_key(os.path.basename(b["path"]))),
        })
    return result


def describe_device(root, library):
    """Drive contents enriched with library matches, for the UI."""
    sections = scan_drive(root)
    for section in sections:
        for bank in section["banks"]:
            for slot in bank["slots"]:
                files = slot.pop("files")
                slot["file"] = files[0] if files else None
                slot["conflicts"] = files[1:]
                slot["presetId"] = None
                slot["name"] = None
                if slot["file"]:
                    path = os.path.join(root, bank["path"], slot["file"])
                    try:
                        with open(path, "rb") as f:
                            pid = content_id(f.read())
                    except OSError:
                        pid = None
                    if pid and pid in library.data["presets"]:
                        slot["presetId"] = pid
                        slot["name"] = library.data["presets"][pid]["name"]
                    else:
                        slot["name"] = name_from_filename(slot["file"])
                    slot["hash"] = pid
    return sections


def safe_join(root, rel):
    """Join rel onto root and refuse anything that escapes the drive."""
    root = os.path.realpath(root)
    path = os.path.realpath(os.path.join(root, rel))
    if path != root and not path.startswith(root + os.sep):
        raise LibrarianError("Path %r is outside the drive" % rel)
    return path


def clean_junk(root):
    """Remove macOS metadata files from bank folders."""
    removed = 0
    for dirpath, dirnames, filenames in os.walk(root):
        dirnames[:] = [d for d in dirnames if d.lower() not in SKIP_DIRS and not d.startswith(".")]
        for f in filenames:
            if is_junk(f):
                try:
                    os.remove(os.path.join(dirpath, f))
                    removed += 1
                except OSError:
                    pass
    return removed


def backup_drive(root, library, label="backup"):
    """Copy every bank folder from the drive into the library's backups."""
    sections = scan_drive(root)
    stamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    dest = os.path.join(library.backup_dir, "%s_%s" % (stamp, safe_file_stem(label)))
    suffix = 1
    while os.path.exists(dest):
        suffix += 1
        dest = os.path.join(library.backup_dir, "%s_%s_%d" % (stamp, safe_file_stem(label), suffix))
    count = 0
    for section in sections:
        for bank in section["banks"]:
            src_dir = os.path.join(root, bank["path"])
            dst_dir = os.path.join(dest, bank["path"])
            os.makedirs(dst_dir, exist_ok=True)
            for slot in bank["slots"]:
                for f in slot["files"]:
                    shutil.copy2(os.path.join(src_dir, f), os.path.join(dst_dir, f))
                    count += 1
    # also keep loose top-level preset files such as init_patch.usg
    for f in os.listdir(root):
        p = os.path.join(root, f)
        if os.path.isfile(p) and not is_junk(f) and f.lower().endswith(DEFAULT_EXTENSION):
            os.makedirs(dest, exist_ok=True)
            shutil.copy2(p, os.path.join(dest, f))
            count += 1
    os.makedirs(dest, exist_ok=True)
    with open(os.path.join(dest, "backup.json"), "w", encoding="utf-8") as f:
        json.dump({"created": now_iso(), "label": label, "drive": root, "files": count}, f, indent=2)
    return {"name": os.path.basename(dest), "files": count}


def list_backups(library):
    out = []
    for name in sorted(os.listdir(library.backup_dir), reverse=True):
        meta_path = os.path.join(library.backup_dir, name, "backup.json")
        if not os.path.isfile(meta_path):
            continue
        with open(meta_path, "r", encoding="utf-8") as f:
            meta = json.load(f)
        meta["name"] = name
        out.append(meta)
    return out


def write_slots(root, library, changes):
    """Apply staged changes to the drive.

    Each change is {"bank": "<bank folder path>", "slot": 1..8,
    "presetId": "<library id>" or None to empty the slot}.
    A full backup of the drive is taken before anything is touched.
    """
    if not changes:
        raise LibrarianError("Nothing to write")
    plan = []
    known_banks = {b["path"] for s in scan_drive(root) for b in s["banks"]}
    for ch in changes:
        bank = ch.get("bank")
        slot = int(ch.get("slot", 0))
        if bank not in known_banks:
            raise LibrarianError("Unknown bank folder %r" % bank)
        if not 1 <= slot <= SLOTS_PER_BANK:
            raise LibrarianError("Slot must be 1-%d" % SLOTS_PER_BANK)
        preset = library.get(ch["presetId"]) if ch.get("presetId") else None
        if preset and preset.get("ext", DEFAULT_EXTENSION) != DEFAULT_EXTENSION:
            raise LibrarianError("%s is not a .usg preset and cannot be sent to the synth" % preset["name"])
        plan.append((safe_join(root, bank), slot, preset))

    backup = backup_drive(root, library, label="before_write")
    for bank_dir, slot, preset in plan:
        for f in os.listdir(bank_dir):
            m = SLOT_FILE_RE.match(f)
            if m and not is_junk(f) and int(m.group(1)) == slot:
                os.remove(os.path.join(bank_dir, f))
        if preset:
            target = os.path.join(bank_dir, slot_filename(slot, preset["name"]))
            shutil.copyfile(library.preset_path(preset), target)
    clean_junk(root)
    sync_disk()
    return {"written": len(plan), "backup": backup["name"]}


def restore_backup(root, library, backup_name):
    """Put a backup's bank folders back on the drive (after a fresh backup)."""
    src = safe_join(library.backup_dir, backup_name)
    if not os.path.isfile(os.path.join(src, "backup.json")):
        raise LibrarianError("No such backup: %s" % backup_name)
    safety = backup_drive(root, library, label="before_restore")
    restored = 0
    for section in scan_drive(src):
        for bank in section["banks"]:
            dst_dir = safe_join(root, bank["path"])
            os.makedirs(dst_dir, exist_ok=True)
            for f in os.listdir(dst_dir):
                if SLOT_FILE_RE.match(f) and not is_junk(f):
                    os.remove(os.path.join(dst_dir, f))
            for slot in bank["slots"]:
                for f in slot["files"]:
                    shutil.copyfile(os.path.join(src, bank["path"], f), os.path.join(dst_dir, f))
                    restored += 1
    clean_junk(root)
    sync_disk()
    return {"restored": restored, "backup": safety["name"]}


def import_from_drive(root, library, bank=None, slot=None):
    """Copy presets from the drive into the library (all, one bank or one slot)."""
    added = 0
    seen = 0
    for section in scan_drive(root):
        for b in section["banks"]:
            if bank and b["path"] != bank:
                continue
            for s in b["slots"]:
                if slot and s["slot"] != int(slot):
                    continue
                for f in s["files"]:
                    with open(os.path.join(root, b["path"], f), "rb") as fh:
                        data = fh.read()
                    tags = ["from " + b["name"]] if bank or slot else []
                    _, created = library.add(
                        data, f, kind=section["kind"], tags=tags,
                        source="%s/%s" % (b["path"], f),
                    )
                    seen += 1
                    added += 1 if created else 0
    return {"added": added, "seen": seen}


def sync_disk():
    try:
        os.sync()
    except AttributeError:
        pass


def eject_drive(root):
    if sys.platform != "darwin":
        raise LibrarianError("Eject is only available on macOS")
    clean_junk(root)
    sync_disk()
    proc = subprocess.run(["diskutil", "eject", root], capture_output=True, text=True)
    if proc.returncode != 0:
        raise LibrarianError(proc.stderr.strip() or proc.stdout.strip() or "Eject failed")
    time.sleep(0.5)
    return {"ejected": root}
