# Super Gemini Librarian

A simple preset librarian for the **UDO Super Gemini** (and Super 8), for macOS.

- Keep all your presets in one library on your Mac.
- Tag them (pad, bass, lead…), mark favourites, add notes, and search.
- Drag and drop presets onto any bank and slot of the synth, then send them in one go.
- Save presets from the synth back into your library.
- The app backs up the synth automatically before every write, and you can restore any backup.

It needs nothing extra installed. It is plain Python 3, and the window opens in your web browser.

## How it talks to the Super Gemini

The Super Gemini does not load presets over MIDI SysEx. It stores each preset as a file
on its built-in USB drive:

```
GEMINI/<folder>/a1 … h2/p1_<name>.usg … p8_<name>.usg
```

The bank folder (`a1`…`h2`) is the bank button (A–H) plus page 1 or 2. The `p1`…`p8` prefix
is the slot number, and the rest of the file name is free text. The librarian reads and writes
these files for you. It finds the bank folders by itself, so it keeps working if UDO
renames the top-level folders in a firmware update.

## Getting started

1. Download this project (green **Code** button → **Download ZIP**) and unzip it.
2. Double-click **`Super Gemini Librarian.command`**.
   - The first time, macOS may say it is from an unidentified developer. Right-click the file,
     choose **Open**, then confirm.
   - If macOS asks to install the "command line developer tools", accept. That installs Python 3.
3. Your browser opens the librarian.

If you prefer a real app in your Applications folder, run this once in Terminal from the project
folder:

```
./build-mac-app.sh
```

That creates `~/Applications/Super Gemini Librarian.app`. Use the **Quit** button in the window to stop it.

## Connecting the synth

1. Switch the Super Gemini **off**.
2. Hold **PATCH** and switch it on. Release once the LEDs settle.
3. Connect it to your Mac over USB. A disk named **GEMINI** (or **SUPER8**) appears.
4. The librarian finds it within a few seconds and shows all the banks.

If your drive mounts under a different name, set its location in **⚙ Settings**.

## Everyday use

| To… | Do this |
| --- | --- |
| Add presets to the library | Drag `.usg` files or whole folders (e.g. a downloaded patch pack) from Finder onto the library panel. A dropped folder's name becomes a tag. |
| Save what's on the synth | **Import all from synth**, or drag a single slot onto the library panel. |
| Tag, rename, add notes | Click a preset. Type a tag and press Enter. |
| Filter | Click tags at the top of the library, or type in the search box. |
| Put a preset in a slot | Drag it from the library onto the slot. The slot turns purple ("staged"). |
| Copy a slot | Drag one slot onto another. |
| Fill a bank from Finder | Drop several files onto a slot. They fill that slot and the ones after it. |
| Empty a slot | Click it and press Delete, or use **Clear slot**. |
| Write to the synth | **Send to synth**. Nothing changes on the synth until you do this. |
| Undo | **Discard** before sending, or ⚙ Settings → **Restore to synth** afterwards. |

When you are done, click **⏏ Eject**, then switch the Super Gemini off and on again so it
loads the new presets.

## Where things are stored

Everything lives in `~/Music/Super Gemini Librarian/`:

- `presets/`: one file per unique preset (duplicates are detected automatically)
- `library.json`: names, tags, notes and favourites
- `backups/`: a full copy of the synth's banks taken before every write

## Good to know

- macOS writes hidden `._` and `.DS_Store` files onto USB drives, and these can confuse the synth.
  The librarian deletes them from the drive after each write and on eject.
- Patch files carry no name inside them (the synth has no screen). The name you see is the
  library name, and it becomes the file name when the preset is written to a slot.
- Only `.usg` preset files are accepted. Other files (such as `.syx` dumps from other synths) are
  skipped, and the librarian never writes or deletes anything on the synth except `p1_…`–`p8_….usg` files.
- The librarian only listens on your own Mac (`127.0.0.1`). Nothing is shared on the network.

## For developers

```
python3 -m librarian --drive /path/to/fake/GEMINI --no-browser   # run against a test folder
python3 -m unittest                                              # run the tests
```

`SGL_HOME` overrides the library location.
