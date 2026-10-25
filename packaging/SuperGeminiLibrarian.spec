# PyInstaller recipe for the stand-alone app.
# Built by packaging/build_mac_app.sh (Mac) and packaging/build_windows_app.ps1 (Windows).
import os
import sys

ROOT = os.path.abspath(os.path.join(SPECPATH, ".."))
NAME = "Super Gemini Librarian"
VERSION = os.environ.get("APP_VERSION", "1.0.0")
MAC = sys.platform == "darwin"

a = Analysis(
    [os.path.join(SPECPATH, "launcher.py")],
    pathex=[ROOT],
    datas=[(os.path.join(ROOT, "librarian", "static"), os.path.join("librarian", "static"))],
    hiddenimports=["webview.platforms.cocoa"] if MAC else ["webview.platforms.edgechromium", "webview.platforms.winforms"],
    excludes=["tkinter", "unittest", "pydoc_data"],
)
pyz = PYZ(a.pure)
exe = EXE(
    pyz, a.scripts, [],
    exclude_binaries=True,
    name=NAME,
    console=False,
    icon=None if MAC else os.path.join(SPECPATH, "AppIcon.ico"),
    target_arch=(os.environ.get("TARGET_ARCH") or None) if MAC else None,
)
coll = COLLECT(exe, a.binaries, a.datas, name=NAME)

if MAC:
    app = BUNDLE(
        coll,
        name=NAME + ".app",
        icon=os.path.join(SPECPATH, "AppIcon.icns"),
        bundle_identifier="io.github.brutespringclean.supergeminilibrarian",
        version=VERSION,
        info_plist={
            "CFBundleDisplayName": NAME,
            "CFBundleShortVersionString": VERSION,
            "CFBundleVersion": VERSION,
            "LSMinimumSystemVersion": "11.0",
            "NSHighResolutionCapable": True,
            "LSApplicationCategoryType": "public.app-category.music",
            "NSRemovableVolumesUsageDescription":
                "Super Gemini Librarian reads and writes presets on the Super Gemini's USB drive.",
            "NSHumanReadableCopyright": "Super Gemini Librarian. Not affiliated with UDO Audio.",
        },
    )
