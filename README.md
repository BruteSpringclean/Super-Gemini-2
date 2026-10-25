# Super Gemini Librarian

A simple preset librarian for the **UDO Super Gemini** (and Super 8), for Mac and Windows.

**[⬇ Download the latest version](../../releases/latest)**: `.dmg` for Mac, `Setup.exe` for Windows.

- Keep all your patches (`.usg`) and performances (`.xsg`) in one library on your Mac.
- Tag them (pad, bass, lead…), click ☆ to favourite, add notes, and search.
- Drag and drop presets onto any bank and slot of the synth, then send them in one go.
- Save presets from the synth back into your library.
- Optionally back up the banks you change before each send, and restore any backup.

It needs nothing extra installed. It is plain Python 3, and the window opens in your web browser.

## How it talks to the Super Gemini

The Super Gemini does not load presets over MIDI SysEx. It stores each preset as a file
on its built-in USB drive:

```
GEMINI/patch_banks_a/a1 … h2/p1_<name>.usg … p8_<name>.usg      patches, group A (B likewise)
GEMINI/Performances_a/a1 … h2/p1_<name>.xsg … p8_<name>.xsg     performances, group A (B likewise)
```

The bank folder (`a1`…`h2`) is the bank button (A–H) plus page 1 or 2. The `p1`…`p8` prefix
is the slot number, and the rest of the file name is free text. The librarian reads and writes
these files for you.

Patches and performances are kept apart. Performances (`.xsg`) can only go into
`Performances_a` and `Performances_b`, and patches (`.usg`) only into the patch banks.
While you drag, slots of the wrong type won't accept the drop.

## Getting started

### Mac

1. Download **`Super-Gemini-Librarian-<version>-Mac.dmg`** from the
   [latest release](../../releases/latest) and open it.
2. Drag **Super Gemini Librarian** onto the **Applications** shortcut.
3. Open it from Applications or Launchpad. It runs in its own window and needs nothing else
   installed. It works on Apple Silicon and Intel Macs running macOS 11 or later.

**The first time you open it**, macOS says it "could not verify" the app, because the app isn't
registered with Apple. Click **Done**, then go to **System Settings → Privacy & Security**, scroll
down and click **Open Anyway** next to *Super Gemini Librarian*. On older macOS versions,
right-click the app and choose **Open** instead. If macOS asks whether the app may access a
removable volume, click **Allow**, because that's how it reaches the synth.

The disk image also contains a **Read Me First** file with these steps.

### Windows

1. Download **`Super-Gemini-Librarian-<version>-Windows-Setup.exe`** from the
   [latest release](../../releases/latest) and run it. It works on Windows 10 and 11 (64-bit).
   - If Windows shows **"Windows protected your PC"**, click **More info → Run anyway**. This
     happens because the installer isn't signed.
2. Start **Super Gemini Librarian** from the Start menu.

If you'd rather not install anything, the `…-Windows-Portable.zip` works too. Unzip it and run
`Super Gemini Librarian.exe`. On Windows the synth shows up as a drive letter (e.g. `E:`) named
**GEMINI**, and the librarian finds it by that name.

### Running from the source code

Double-click **`Super Gemini Librarian.command`** (the first time: right-click → **Open**). If macOS
offers to install the "command line developer tools", accept, because that installs Python 3. The
librarian then opens in your web browser.

## Connecting the synth

1. Switch the Super Gemini **off**.
2. Hold **PATCH** and switch it on. Release once the LEDs settle.
3. Connect it to your Mac over USB. A disk named **GEMINI** (or **SUPER8**) appears.
4. The librarian finds it within a few seconds and shows all the banks.

If your drive mounts under a different name, set its location in **⚙ Settings**.

## Everyday use

| To… | Do this |
| --- | --- |
| Add presets to the library | Drag `.usg` / `.xsg` files or whole folders (e.g. a downloaded patch pack) from Finder onto the library panel. A dropped folder's name becomes a tag. |
| Save what's on the synth | **Import all from synth**, or drag a single slot onto the library panel. |
| Tag, rename, add notes | Click a preset. Type a tag and press Enter. |
| Favourite | Click the ☆ next to a preset (or **☆ Favourite** on a selected slot). Favourites sort to the top; click **★ favourites** to show only them. |
| Filter | **All / Patches / Performances**, click tags, or type in the search box. |
| Switch banks | Use the **Patches A/B** and **Performances A/B** tabs above the slots. |
| Put a preset in a slot | Drag it from the library onto the slot. The slot turns purple ("staged"). |
| Copy a slot | Drag one slot onto another. |
| Fill a bank from Finder | Drop several files onto a slot. They fill that slot and the ones after it. |
| Empty a slot | Click it and press Delete, or use **Clear slot**. |
| Write to the synth | **Send to synth**. Nothing changes on the synth until you do this. For each slot, the old file is deleted first and then the new one is copied in, because the synth's drive is small. The drive's hidden Trash is emptied too. |
| Choose what gets backed up | ⚙ Settings → **Automatic backup before sending**. By default patch banks are backed up and performance banks are not. Only the banks you change are copied. |
| Undo | **Discard** before sending, or ⚙ Settings → **Restore to synth** afterwards. |

When you are done, click **⏏ Eject**, then switch the Super Gemini off and on again so it
loads the new presets.

## Where things are stored

Everything lives in `~/Music/Super Gemini Librarian/`:

- `presets/`: one file per unique preset (duplicates are detected automatically)
- `library.json`: names, tags, notes and favourites
- `backups/`: copies of the banks you changed, taken before each send (if switched on), plus any
  full backups from **Back up synth**

## Good to know

- macOS writes hidden `._` and `.DS_Store` files onto USB drives, and these can confuse the synth.
  The librarian deletes them from the drive after each write and on eject.
- Patch files carry no name inside them (the synth has no screen). The name you see is the
  library name, and it becomes the file name when the preset is written to a slot.
- Only `.usg` patches and `.xsg` performances are accepted. Other files (such as `.syx` dumps from
  other synths) are skipped. On the synth, the librarian only writes or deletes `p1_…`–`p8_…` files
  of the right type for each folder, plus macOS clutter and the drive's Trash.
- Before deleting anything, it checks that the new presets will fit on the drive.
- The librarian only listens on your own Mac (`127.0.0.1`). Nothing is shared on the network.

## For developers

```
python3 -m librarian --drive /path/to/fake/GEMINI --no-browser   # run against a test folder
python3 -m unittest                                              # run the tests
```

`SGL_HOME` overrides the library location.

### Building the apps

GitHub Actions builds, tests and smoke-tests the Mac and Windows apps on every push
(`.github/workflows/build-apps.yml`). The files appear under the run's **Artifacts**. Pushing a tag
such as `v1.0.0` publishes them on a **Release**, with the text from `packaging/release-notes.md`.
For a new version, bump `VERSION` and push a matching tag.

On Windows: `powershell -ExecutionPolicy Bypass -File packaging\build_windows_app.ps1` (the
installer step needs [Inno Setup 6](https://jrsoftware.org/isinfo.php)).

To build the Mac app yourself on a Mac:

```
packaging/build_mac_app.sh            # makes dist/Super Gemini Librarian.app and a .dmg
TARGET_ARCH=universal2 PYTHON=/Library/Frameworks/Python.framework/Versions/3.12/bin/python3 \
  packaging/build_mac_app.sh          # Apple Silicon + Intel (needs python.org's Python)
```

The version number lives in `VERSION`. The icon is drawn by `packaging/make_icon.py`.
