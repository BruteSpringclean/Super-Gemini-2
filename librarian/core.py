"""Core logic for the Super Gemini librarian.

The UDO Super Gemini does not take presets over SysEx. Instead, when it is
switched on while holding PATCH, it mounts as a USB drive (named GEMINI, or
SUPER8 on the Super 8) and every slot is a plain file on that drive:

    <drive>/patch_banks_a/<bank folder, a1 .. h2>/p<slot>_<name>.usg
    <drive>/Performances_a/<bank folder, a1 .. h2>/p<slot>_<name>.xsg

Patches (.usg) and performances (.xsg) are kept strictly apart: performances
only ever go into the Performances_a / Performances_b folders.

The slot number comes from the "p1".."p8" prefix; the rest of the name is
free text. Because folder names can differ between firmware versions, the
device side of this module *discovers* bank folders instead of hard-coding
them: any folder named like a bank (a1..h2) or containing p<N>_ files counts.

The library side keeps every preset you have ever imported in one folder,
deduplicated by content, with names, tags and notes in library.json.
"""

import errno
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
KIND_EXT = {"patch": ".usg", "performance": ".xsg"}
KIND_LABEL = {"patch": "patch (.usg)", "performance": "performance (.xsg)"}
DRIVE_NAMES = ("GEMINI", "SUPER8")
DEFAULT_BACKUP = {"patch": True, "performance": False}

BANK_DIR_RE = re.compile(r"^[a-h][12]$", re.IGNORECASE)
PERFORMANCE_DIR_RE = re.compile(r"^performances_([ab])$", re.IGNORECASE)
PATCH_DIR_RE = re.compile(r"^patch_banks_([ab])$", re.IGNORECASE)
# Only .usg and .xsg files are ever treated as presets, so the librarian can
# neither write nor delete anything else on the synth's drive.
SLOT_FILE_RE = re.compile(r"^p([1-8])(?:[_\- ](.*))?(\.usg|\.xsg)$", re.IGNORECASE)
TRASH_DIRS = {".trashes", ".trash"}
SKIP_DIRS = {".trashes", ".spotlight-v100", ".fseventsd", ".temporaryitems", "system volume information"}
JUNK_FILES = {".ds_store"}
MAX_SCAN_DEPTH = 4
IO_RETRIES = 4
IO_CHUNK = 32 * 1024


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


def slot_filename(slot, name, kind="patch"):
    return "p%d_%s%s" % (slot, safe_file_stem(name), KIND_EXT[kind])


def kind_for_filename(filename):
    ext = os.path.splitext(filename)[1].lower()
    for kind, kind_ext in KIND_EXT.items():
        if ext == kind_ext:
            return kind
    return None


def is_preset_filename(filename):
    return kind_for_filename(filename) is not None


def section_kind(section_path):
    """Performances live only in Performances_a/b; every other bank holds patches."""
    return "performance" if PERFORMANCE_DIR_RE.match(os.path.basename(section_path)) else "patch"


def section_label(section_path):
    base = os.path.basename(section_path)
    m = PERFORMANCE_DIR_RE.match(base)
    if m:
        return "Performances " + m.group(1).upper()
    m = PATCH_DIR_RE.match(base)
    if m:
        return "Patches " + m.group(1).upper()
    return section_path or "(drive root)"


class LibrarianError(Exception):
    pass


# ---------------------------------------------------------------- drive I/O
#
# The synth's USB drive is a small device that does not cope with the fast
# whole-file copy macOS offers (shutil uses fcopyfile there, which failed with
# "Input/output error" on a real Super Gemini). Everything that touches the
# drive therefore uses plain, small reads and writes, retried on I/O errors.

NOTHING_CHANGED = "Nothing on the synth was changed."
DRIVE_TIPS = (
    "Try: unplug and reconnect the USB cable "
    "(directly to the Mac, not through a hub), and make sure the synth was switched "
    "on while holding PATCH. Then click Rescan and try again."
)


def _retry(action, path):
    for attempt in range(IO_RETRIES):
        try:
            return action()
        except OSError as e:
            if e.errno not in (errno.EIO, errno.EAGAIN, errno.EBUSY) or attempt == IO_RETRIES - 1:
                raise
            time.sleep(0.25 * (attempt + 1))


def read_file(path):
    def action():
        chunks = []
        with open(path, "rb", buffering=0) as f:
            while True:
                chunk = f.read(IO_CHUNK)
                if not chunk:
                    break
                chunks.append(chunk)
        return b"".join(chunks)
    return _retry(action, path)


def write_file(path, data):
    def action():
        with open(path, "wb", buffering=0) as f:
            for i in range(0, len(data), IO_CHUNK):
                f.write(data[i:i + IO_CHUNK])
            os.fsync(f.fileno())
    _retry(action, path)
    # read back to make sure the synth's drive really holds what we wrote
    if read_file(path) != data:
        raise OSError(errno.EIO, "the file read back from the synth did not match", path)


def copy_file(src, dst):
    write_file(dst, read_file(src))


def io_error(e, action, path):
    reason = e.strerror or str(e)
    return LibrarianError("Couldn't %s %s (%s). %s" % (action, os.path.basename(path), reason.lower(), DRIVE_TIPS))


def check_writable(root):
    if not os.access(root, os.W_OK):
        raise LibrarianError(
            "The synth's drive is read-only, so presets can't be written. Switch the Super Gemini "
            "off, hold PATCH while switching it on, release once the LEDs settle, then try again."
        )


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
        for preset in self.data["presets"].values():
            # the type always follows the file extension
            preset["kind"] = kind_for_filename(preset.get("ext", DEFAULT_EXTENSION)) or "patch"

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

    def backup_settings(self):
        out = dict(DEFAULT_BACKUP)
        out.update({k: bool(v) for k, v in self.settings.get("backup", {}).items() if k in KIND_EXT})
        return out

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

    def add(self, data, filename, tags=None, source=None):
        """Add raw preset bytes. Returns (preset, created)."""
        kind = kind_for_filename(filename)
        if not kind:
            raise LibrarianError("%s is not a Super Gemini patch (.usg) or performance (.xsg) file" % filename)
        if not data:
            raise LibrarianError("%s is empty" % filename)
        ext = KIND_EXT[kind]
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
                "kind": kind,
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
        ext = KIND_EXT[section_kind(os.path.dirname(rel))]
        slot_files = [f for f in filenames
                      if not is_junk(f) and SLOT_FILE_RE.match(f) and f.lower().endswith(ext)]
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
    for parent in sorted(sections, key=lambda p: (section_kind(p) == "performance", p.lower())):
        result.append({
            "path": parent,
            "name": section_label(parent),
            "kind": section_kind(parent),
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
                        with open(path, "rb", buffering=0) as f:
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


def empty_drive_trash(root):
    """Empty the hidden Trash folder macOS keeps on the drive. Returns bytes freed."""
    freed = 0
    for name in os.listdir(root):
        if name.lower() not in TRASH_DIRS:
            continue
        trash = os.path.join(root, name)
        for dirpath, _, filenames in os.walk(trash):
            for f in filenames:
                try:
                    freed += os.path.getsize(os.path.join(dirpath, f))
                except OSError:
                    pass
        for child in os.listdir(trash):
            path = os.path.join(trash, child)
            if os.path.isdir(path) and not os.path.islink(path):
                shutil.rmtree(path, ignore_errors=True)
            else:
                try:
                    os.remove(path)
                except OSError:
                    pass
    return freed


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


def backup_drive(root, library, label="backup", banks=None, required=()):
    """Copy bank folders from the drive into the library's backups.

    banks limits the backup to those bank paths (default: the whole drive).
    Files listed in required (full paths) must be readable or the backup
    fails; any other unreadable file is skipped and reported.
    """
    sections = scan_drive(root)
    # compare resolved paths: the drive path may go through a symlink
    required = {os.path.realpath(p) for p in required}
    stamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    dest = os.path.join(library.backup_dir, "%s_%s" % (stamp, safe_file_stem(label)))
    suffix = 1
    while os.path.exists(dest):
        suffix += 1
        dest = os.path.join(library.backup_dir, "%s_%s_%d" % (stamp, safe_file_stem(label), suffix))
    jobs = []
    for section in sections:
        for bank in section["banks"]:
            if banks is not None and bank["path"] not in banks:
                continue
            os.makedirs(os.path.join(dest, bank["path"]), exist_ok=True)
            for slot in bank["slots"]:
                for f in slot["files"]:
                    jobs.append(os.path.join(bank["path"], f))
    if banks is None:
        # also keep loose top-level preset files such as init_patch.usg
        for f in os.listdir(root):
            if os.path.isfile(os.path.join(root, f)) and not is_junk(f) and is_preset_filename(f):
                jobs.append(f)

    os.makedirs(dest, exist_ok=True)
    count = 0
    unreadable = []
    for rel in jobs:
        src = os.path.join(root, rel)
        try:
            data = read_file(src)
        except OSError as e:
            if os.path.realpath(src) in required:
                shutil.rmtree(dest, ignore_errors=True)
                raise LibrarianError("%s %s" % (io_error(e, "back up", src), NOTHING_CHANGED))
            unreadable.append(rel)
            continue
        with open(os.path.join(dest, rel), "wb") as f:
            f.write(data)
        count += 1
    with open(os.path.join(dest, "backup.json"), "w", encoding="utf-8") as f:
        json.dump({"created": now_iso(), "label": label, "drive": root, "files": count,
                   "unreadable": unreadable}, f, indent=2)
    return {"name": os.path.basename(dest), "files": count, "unreadable": unreadable}


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

    Banks are backed up first when the backup setting for their type is on.
    The synth's drive is small, so the old file in a slot is deleted (and the
    drive's trash emptied) before the new file is copied in.
    """
    if not changes:
        raise LibrarianError("Nothing to write")
    check_writable(root)
    bank_kind = {b["path"]: s["kind"] for s in scan_drive(root) for b in s["banks"]}
    plan = []
    for ch in changes:
        bank = ch.get("bank")
        slot = int(ch.get("slot", 0))
        if bank not in bank_kind:
            raise LibrarianError("Unknown bank folder %r" % bank)
        if not 1 <= slot <= SLOTS_PER_BANK:
            raise LibrarianError("Slot must be 1-%d" % SLOTS_PER_BANK)
        kind = bank_kind[bank]
        preset = library.get(ch["presetId"]) if ch.get("presetId") else None
        if preset and preset.get("ext") != KIND_EXT[preset["kind"]]:
            raise LibrarianError("“%s” is not a .usg or .xsg preset and cannot be sent to the synth." % preset["name"])
        if preset and preset["kind"] != kind:
            where = "the Performances folders" if preset["kind"] == "performance" else "the patch banks"
            raise LibrarianError("“%s” is a %s, so it can only go into %s." % (preset["name"], KIND_LABEL[preset["kind"]], where))
        bank_dir = safe_join(root, bank)
        data = None
        if preset:
            # read now: once the old file is deleted there is no going back
            try:
                data = library.read_bytes(preset["id"])
            except OSError as e:
                raise LibrarianError("Couldn't read “%s” from your library (%s). %s"
                                     % (preset["name"], e.strerror or e, NOTHING_CHANGED))
        plan.append({"bank": bank, "dir": bank_dir, "slot": slot, "kind": kind, "preset": preset,
                     "data": data, "old": slot_files(bank_dir, slot, kind)})

    enabled = library.backup_settings()
    backup_banks = {p["bank"] for p in plan if enabled[p["kind"]]}
    backup = None
    if backup_banks:
        replaced = [os.path.join(p["dir"], f) for p in plan if p["bank"] in backup_banks for f in p["old"]]
        backup = backup_drive(root, library, label="before_write", banks=backup_banks, required=replaced)

    clean_junk(root)
    freed = empty_drive_trash(root)
    need = sum(len(p["data"]) for p in plan if p["preset"])
    releasing = sum(os.path.getsize(os.path.join(p["dir"], f)) for p in plan for f in p["old"])
    free = shutil.disk_usage(root).free
    if need and free + releasing < need + 16 * 1024:
        raise LibrarianError(
            "The synth's drive is full: %d KB is needed but only %d KB is free. "
            "Empty some slots first, then try again. %s" % (need // 1024 + 1, (free + releasing) // 1024, NOTHING_CHANGED))

    written = 0
    try:
        for p in plan:
            for f in p["old"]:
                path = os.path.join(p["dir"], f)
                try:
                    _retry(lambda: os.remove(path), path)
                except OSError as e:
                    raise io_error(e, "remove the old file", path)
            if p["preset"]:
                target = os.path.join(p["dir"], slot_filename(p["slot"], p["preset"]["name"], p["kind"]))
                try:
                    write_file(target, p["data"])
                except OSError as e:
                    raise io_error(e, "write", target)
            written += 1
    except LibrarianError as e:
        p = plan[written]
        where = "%s slot %d" % (os.path.basename(p["bank"]).upper(), p["slot"])
        if p["old"] and p["preset"]:
            where += " (that slot may now be empty)"
        saved = (" The old presets are in backup %s." % backup["name"]) if backup and p["bank"] in backup_banks else ""
        raise LibrarianError("Stopped at %s: %s %d of %d slot(s) were written before that.%s"
                             % (where, e, written, len(plan), saved))
    finally:
        clean_junk(root)
        sync_disk()
    return {"written": written, "backup": backup["name"] if backup else None, "trashFreed": freed}


def slot_files(bank_dir, slot, kind):
    ext = KIND_EXT[kind]
    out = []
    for f in os.listdir(bank_dir):
        m = SLOT_FILE_RE.match(f)
        if m and not is_junk(f) and f.lower().endswith(ext) and int(m.group(1)) == slot:
            out.append(f)
    return out


def restore_backup(root, library, backup_name):
    """Put a backup's bank folders back on the drive (after a fresh backup)."""
    src = safe_join(library.backup_dir, backup_name)
    if not os.path.isfile(os.path.join(src, "backup.json")):
        raise LibrarianError("No such backup: %s" % backup_name)
    check_writable(root)
    clean_junk(root)
    empty_drive_trash(root)
    banks = [dict(b, kind=s["kind"]) for s in scan_drive(src) for b in s["banks"]]
    bank_paths = {b["path"] for b in banks}
    on_drive = [os.path.join(root, b["path"], f)
                for s in scan_drive(root) for b in s["banks"] if b["path"] in bank_paths
                for sl in b["slots"] for f in sl["files"]]
    safety = backup_drive(root, library, label="before_restore", banks=bank_paths, required=on_drive)
    restored = 0
    for bank in banks:
        dst_dir = safe_join(root, bank["path"])
        os.makedirs(dst_dir, exist_ok=True)
        for sl in bank["slots"]:
            # delete first: the synth's drive has little free space
            for f in slot_files(dst_dir, sl["slot"], bank["kind"]):
                os.remove(os.path.join(dst_dir, f))
            for f in sl["files"]:
                try:
                    copy_file(os.path.join(src, bank["path"], f), os.path.join(dst_dir, f))
                except OSError as e:
                    raise io_error(e, "restore", f)
                restored += 1
    clean_junk(root)
    empty_drive_trash(root)
    sync_disk()
    return {"restored": restored, "backup": safety["name"]}


def import_from_drive(root, library, bank=None, slot=None):
    """Copy presets from the drive into the library (all, one bank or one slot)."""
    added = 0
    seen = 0
    failed = []
    for section in scan_drive(root):
        for b in section["banks"]:
            if bank and b["path"] != bank:
                continue
            for s in b["slots"]:
                if slot and s["slot"] != int(slot):
                    continue
                for f in s["files"]:
                    try:
                        data = read_file(os.path.join(root, b["path"], f))
                    except OSError as e:
                        if slot:
                            raise io_error(e, "read", f)
                        failed.append("%s/%s" % (b["path"], f))
                        continue
                    tags = ["from " + b["name"]] if bank or slot else []
                    _, created = library.add(
                        data, f, tags=tags,
                        source="%s/%s" % (b["path"], f),
                    )
                    seen += 1
                    added += 1 if created else 0
    return {"added": added, "seen": seen, "failed": failed}


def sync_disk():
    try:
        os.sync()
    except AttributeError:
        pass


def eject_drive(root):
    if sys.platform != "darwin":
        raise LibrarianError("Eject is only available on macOS")
    clean_junk(root)
    empty_drive_trash(root)
    sync_disk()
    proc = subprocess.run(["diskutil", "eject", root], capture_output=True, text=True)
    if proc.returncode != 0:
        raise LibrarianError(proc.stderr.strip() or proc.stdout.strip() or "Eject failed")
    time.sleep(0.5)
    return {"ejected": root}
