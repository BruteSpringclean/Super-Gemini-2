#!/usr/bin/env python3
"""Build Keyframes.amxd (and Keyframes.maxpat) from src/keyframes.genexpr.

The Max patch is assembled here rather than drawn in Max, so that the gen~
code can live in one readable, tested file and the four identical channels
are generated instead of copied.

    python3 build.py

Nothing but the Python standard library is needed.
"""
import json
import os
import re
import struct
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
GEN_INLETS = 11
GEN_OUTLETS = 31
BUILD = 9                          # shown on the device, to tell versions apart
BUFFER_SLOTS = 2 + 64 * 6          # count, id counter, 64 keyframes of 6 values

CURVES = ["Step", "Linear", "Accel", "Decel", "Smooth", "Bounce"]
MODES = ["Keyframe", "Sequencer", "Poly LFO"]
RATES = ["Off", "1/1", "1/2", "1/4", "1/8", "1/16", "1/32"]

# What Push shows: eight controls per bank, in this order.
BANKS = [
    ("Frames", ["Frame", "Level 1", "Level 2", "Level 3", "Level 4",
                "Add", "Delete", "Key"]),
    ("Curves", ["Curve 1", "Curve 2", "Curve 3", "Curve 4",
                "Resp 1", "Resp 2", "Resp 3", "Resp 4"]),
    ("Seq + Mix", ["Mode", "Seq Rate", "Seq Step", "Clear All",
                   "Mix 1", "Mix 2", "Mix 3", "Mix 4"]),
    ("Poly LFO", ["Shape", "Shape Spread", "Spread", "Coupling",
                  "-", "-", "-", "-"]),
]

APPVERSION = {"major": 8, "minor": 5, "revision": 5,
              "architecture": "x64", "modernui": 1}


class Patch:
    def __init__(self):
        self.boxes = []
        self.lines = []
        self.parameters = {}
        self.info = {}
        self._x = 20
        self._y = 20

    def section(self):
        """Start a new row of boxes in the (unlocked) patching view."""
        self._x = 20
        self._y += 70

    def _place(self):
        rect = [self._x, self._y, 100, 22]
        self._x += 115
        if self._x > 1500:
            self._x = 20
            self._y += 32
        return rect

    def box(self, maxclass, nin, nout, outtypes=None, **attrs):
        ident = "obj-%d" % (len(self.boxes) + 1)
        box = {"id": ident, "maxclass": maxclass, "numinlets": nin,
               "numoutlets": nout, "patching_rect": self._place()}
        if nout:
            box["outlettype"] = outtypes or [""] * nout
        box.update(attrs)
        self.boxes.append({"box": box})
        self.info[ident] = (nin, nout)
        return ident

    def obj(self, text, nin, nout, outtypes=None, **attrs):
        return self.box("newobj", nin, nout, outtypes, text=text, **attrs)

    def msg(self, text):
        return self.box("message", 2, 1, text=text)

    def line(self, src, outlet, dst, inlet):
        assert outlet < self.info[src][1], (src, outlet)
        assert inlet < self.info[dst][0], (dst, inlet)
        self.lines.append({"patchline": {"source": [src, outlet],
                                         "destination": [dst, inlet]}})

    def chain(self, *ids):
        """Connect outlet 0 to inlet 0 down a list of boxes."""
        for a, b in zip(ids, ids[1:]):
            self.line(a, 0, b, 0)

    # -- Live parameters ---------------------------------------------------
    def param(self, maxclass, name, rect, ptype, nout, outtypes, short=None,
              lo=None, hi=None, unit=None, initial=None, enum=None,
              hidden=False, **attrs):
        valueof = {"parameter_longname": name,
                   "parameter_shortname": short or name,
                   "parameter_type": ptype}
        if lo is not None:
            valueof["parameter_mmin"] = float(lo)
        if hi is not None:
            valueof["parameter_mmax"] = float(hi)
        if unit is not None:
            valueof["parameter_unitstyle"] = unit
        if enum is not None:
            valueof["parameter_enum"] = enum
        if initial is not None:
            valueof["parameter_initial_enable"] = 1
            valueof["parameter_initial"] = [initial]
        if hidden:
            valueof["parameter_invisible"] = 2
        ident = self.box(
            maxclass, 1, nout, outtypes, parameter_enable=1, presentation=1,
            presentation_rect=rect, varname=name,
            saved_attribute_attributes={"valueof": valueof}, **attrs)
        self.parameters[ident] = [name, short or name, 0]
        return ident

    def dial(self, name, rect, lo, hi, initial, short=None):
        return self.param("live.dial", name, rect, 0, 2, ["", "float"],
                          short=short, lo=lo, hi=hi, unit=5, initial=initial)

    def menu(self, name, rect, items, initial):
        return self.param("live.menu", name, rect, 2, 3, ["", "", "float"],
                          lo=0, hi=len(items) - 1, enum=items, initial=initial)

    def button(self, name, rect, label, hidden=False):
        return self.param("live.text", name, rect, 2, 2, ["", ""], lo=0, hi=1,
                          enum=["off", "on"], hidden=hidden, mode=0,
                          text=label, texton=label)

    def toggle(self, name, rect, label, label_on, initial=None, hidden=False):
        return self.param("live.text", name, rect, 2, 2, ["", ""], lo=0, hi=1,
                          enum=["off", "on"], initial=initial, hidden=hidden,
                          mode=1, text=label, texton=label_on)


def gen_patcher(code):
    """The patcher inside gen~: inlets, one codebox, outlets."""
    boxes, lines = [], []
    for i in range(GEN_INLETS):
        boxes.append({"box": {
            "id": "in-%d" % i, "maxclass": "newobj", "text": "in %d" % (i + 1),
            "numinlets": 0, "numoutlets": 1, "outlettype": [""],
            "patching_rect": [20 + 60 * i, 20, 40, 22]}})
        lines.append({"patchline": {"source": ["in-%d" % i, 0],
                                    "destination": ["code", i]}})
    boxes.append({"box": {
        "id": "code", "maxclass": "codebox", "code": code,
        "fontface": 0, "fontname": "<Monospaced>", "fontsize": 12.0,
        "numinlets": GEN_INLETS, "numoutlets": GEN_OUTLETS,
        "outlettype": [""] * GEN_OUTLETS,
        "patching_rect": [20, 60, 1900, 700]}})
    for i in range(GEN_OUTLETS):
        boxes.append({"box": {
            "id": "out-%d" % i, "maxclass": "newobj", "text": "out %d" % (i + 1),
            "numinlets": 1, "numoutlets": 0,
            "patching_rect": [20 + 60 * i, 780, 44, 22]}})
        lines.append({"patchline": {"source": ["code", i],
                                    "destination": ["out-%d" % i, 0]}})
    return {"fileversion": 1, "appversion": APPVERSION,
            "classnamespace": "dsp.gen", "rect": [80, 100, 1000, 800],
            "boxes": boxes, "lines": lines}


def build_patch(code, label=None):
    p = Patch()

    # ---------------------------------------------------------------- audio
    gen = p.obj("gen~ @frkf ---frkf", GEN_INLETS, GEN_OUTLETS,
                ["signal"] * GEN_OUTLETS, patcher=gen_patcher(code))
    p.obj("buffer~ ---frkf 100 1", 1, 2, ["float", "bang"])
    # In case this gen~ version wants the buffer named by message.
    p.line(p.obj("loadmess frkf ---frkf", 1, 1), 0, gen, 0)

    plugin = p.obj("plugin~", 2, 2, ["signal", "signal"])      # ALL
    p.line(plugin, 0, gen, 0)
    p.line(plugin, 1, gen, 1)
    plugout = p.obj("plugout~", 2, 2, ["signal", "signal"])    # MIX
    p.line(gen, 0, plugout, 0)
    p.line(gen, 1, plugout, 1)
    for k in range(4):
        pair = "%d %d" % (3 + 2 * k, 4 + 2 * k)
        cin = p.obj("plugin~ " + pair, 2, 2, ["signal", "signal"])
        p.line(cin, 0, gen, 2 + 2 * k)
        p.line(cin, 1, gen, 3 + 2 * k)
        cout = p.obj("plugout~ " + pair, 2, 2, ["signal", "signal"])
        p.line(gen, 2 + 2 * k, cout, 0)
        p.line(gen, 3 + 2 * k, cout, 1)
    step_out = p.obj("plugout~ 11 12", 2, 2, ["signal", "signal"])  # FR.STEP
    p.line(gen, 10, step_out, 0)
    p.line(gen, 10, step_out, 1)
    # One ramp per bar of Live's transport, for the synced sequencer.
    p.line(p.obj("phasor~ 1n @lock 1", 2, 1, ["signal"]), 0, gen, 10)

    def to_gen(src, name, outlet=0):
        pre = p.obj("prepend " + name, 1, 1)
        p.line(src, outlet, pre, 0)
        p.line(pre, 0, gen, 0)

    # Controls restore their saved values while the device loads. That must
    # not count as the user pressing or turning them, so "events" are held
    # back until a second after the device is up.
    p.section()
    thisdevice = p.obj("live.thisdevice", 1, 3, ["bang", "int", "int"])
    ready = p.msg("1")
    p.chain(thisdevice, p.obj("delay 1000", 2, 1, ["bang"]), ready)

    def event(src, outlet, name):
        """Tell gen~ that a control was used, by bumping a serial number."""
        gate = p.obj("gate", 2, 1)
        p.line(ready, 0, gate, 0)
        p.line(src, outlet, gate, 1)
        count = p.obj("counter 1 16777215", 5, 4, ["int", "", "", "int"])
        p.line(gate, 0, count, 0)
        to_gen(count, name)

    # ---------------------------------------------------------------- frame
    p.section()
    frame = p.dial("Frame", [11, 4, 44, 48], 0, 100, 0.0)
    to_gen(frame, "pframe")

    for name, rect, label, gen_name in [
            ("Add", [6, 74, 26, 15], "Add", "padd"),
            ("Delete", [34, 74, 26, 15], "Del", "pdel"),
            ("Seq Step", [6, 128, 26, 15], "Step", "pstep"),
            ("Clear All", [34, 128, 26, 15], "Clr", "pclr")]:
        button = p.button(name, rect, label)
        bang = p.obj("t b", 1, 1, ["bang"])
        p.line(button, 0, bang, 0)
        event(bang, 0, gen_name)

    to_gen(p.menu("Mode", [6, 92, 54, 15], MODES, 0), "pmode")
    to_gen(p.menu("Seq Rate", [6, 110, 54, 15], RATES, 0), "pdiv")

    # Key: shows which keyframe FRAME is on (0 = none); turn it to jump.
    key = p.param("live.numbox", "Key", [6, 56, 54, 15], 1, 2, ["", "float"],
                  lo=0, hi=64, unit=0, initial=0)
    key_split = p.obj("t b b i", 1, 3, ["bang", "bang", "int"])
    p.line(key, 0, key_split, 0)
    to_gen(key_split, "pkeysel", 2)
    event(key_split, 1, "pkeyev")

    # ---------------------------------------------------------------- polling
    # One slow clock reads everything the patch needs to know from gen~.
    p.section()
    order = ["b", "g", "r", "l4", "l3", "l2", "l1", "jump", "rev", "key"]
    source = {"r": 27, "g": 28, "b": 29, "l1": 15, "l2": 16, "l3": 17,
              "l4": 18, "jump": 25, "rev": 24, "key": 19}
    clock = p.obj("qmetro 40 @active 1", 2, 1, ["bang"])
    fan = p.obj("t " + " ".join("b" * len(order)), 1, len(order),
                ["bang"] * len(order))
    p.line(clock, 0, fan, 0)
    snap = {}
    for fired, name in enumerate(order):
        snap[name] = p.obj("snapshot~", 2, 1, ["float"])
        p.line(gen, source[name], snap[name], 0)
        p.line(fan, len(order) - 1 - fired, snap[name], 0)

    def on_change(name):
        bang = p.obj("t b", 1, 1, ["bang"])
        p.chain(snap[name], p.obj("change 0.", 1, 3, ["", "int", "int"]), bang)
        return bang

    # Level meters and the FRAME colour.
    meters = p.box("multislider", 1, 2, ["", ""], presentation=1,
                   presentation_rect=[272, 130, 94, 32], size=4,
                   setminmax=[0.0, 1.0], setstyle=1, ignoreclick=1)
    levels = p.obj("pack 0. 0. 0. 0.", 4, 1)
    for k in range(4):
        p.line(snap["l%d" % (k + 1)], 0, levels, k)
    p.line(levels, 0, meters, 0)
    colour = p.box("panel", 1, 0, presentation=1,
                   presentation_rect=[6, 148, 54, 14], mode=0,
                   bgcolor=[1.0, 1.0, 1.0, 1.0], rounded=4)
    rgb = p.obj("pack 0. 0. 0. 1.", 4, 1)
    for i, name in enumerate("rgb"):
        p.line(snap[name], 0, rgb, i)
    p.chain(rgb, p.obj("prepend bgfillcolor", 1, 1), colour)

    # The Key control asked for a jump: move FRAME there.
    target = p.obj("snapshot~", 2, 1, ["float"])
    p.line(gen, 26, target, 0)
    p.chain(on_change("jump"), target, frame)

    # ---------------------------------------------------------------- levels
    # When FRAME comes to rest on a keyframe, show its stored levels on the
    # level controls and its number on Key. Waiting for it to rest keeps a
    # sweeping FRAME from rewriting the controls many times a second.
    p.section()
    settle = p.obj("delay 250", 2, 1, ["bang"])
    p.line(on_change("key"), 0, settle, 0)
    p.line(key_split, 0, settle, 0)
    settle_split = p.obj("t b b", 1, 2, ["bang", "bang"])
    p.line(settle, 0, settle_split, 0)
    key_now = p.obj("snapshot~", 2, 1, ["float"])
    p.line(gen, 19, key_now, 0)
    p.line(settle_split, 1, key_now, 0)
    key_now_split = p.obj("t f f", 1, 2, ["float", "float"])
    p.line(key_now, 0, key_now_split, 0)
    p.chain(key_now_split, p.obj("prepend set", 1, 1), key)
    on_key = p.obj("> 0.", 2, 1, ["int"])
    p.line(key_now_split, 1, on_key, 0)

    for k in range(4):
        n = k + 1
        x = 68 + 50 * k
        p.section()
        level = p.dial("Level %d" % n, [x + 1, 4, 44, 48], 0, 100,
                       100.0 if k == 0 else 0.0)
        split = p.obj("t b f", 1, 2, ["bang", "float"])
        p.line(level, 0, split, 0)
        to_gen(split, "plv%d" % n, 1)
        event(split, 0, "pev%d" % n)

        stored = p.obj("snapshot~", 2, 1, ["float"])
        p.line(gen, 20 + k, stored, 0)
        p.line(settle_split, 0, stored, 0)
        show = p.obj("gate", 2, 1)
        p.line(on_key, 0, show, 0)
        p.line(stored, 0, show, 1)
        show_split = p.obj("t f f", 1, 2, ["float", "float"])
        p.line(show, 0, show_split, 0)
        to_gen(show_split, "plv%d" % n, 1)
        p.chain(show_split, p.obj("prepend set", 1, 1), level)

        to_gen(p.menu("Curve %d" % n, [x, 56, 46, 15], CURVES, 1),
               "pcv%d" % n)
        to_gen(p.dial("Resp %d" % n, [x + 1, 74, 44, 48], 0, 100, 0.0),
               "prs%d" % n)
        to_gen(p.toggle("Mix %d" % n, [272 + 24 * k, 110, 22, 15],
                        str(n), str(n), initial=1), "pmx%d" % n)

    # ---------------------------------------------------------------- LFO
    p.section()
    to_gen(p.dial("Shape", [272, 4, 44, 48], 0, 100, 0.0), "pshape")
    to_gen(p.dial("Shape Spread", [320, 4, 44, 48], -100, 100, 0.0,
                  short="ShSpread"), "pshspr")
    to_gen(p.dial("Spread", [272, 56, 44, 48], -100, 100, 0.0), "pspread")
    to_gen(p.dial("Coupling", [320, 56, 44, 48], -100, 100, 0.0), "pcoup")

    # ---------------------------------------------------------------- saving
    # Keyframes are edited inside gen~, in the buffer~. A little after the
    # last edit the buffer is copied into a parameter that Live saves with the
    # set; when Live restores that parameter it is copied back.
    p.section()
    dump = p.obj("uzi %d 0" % BUFFER_SLOTS, 2, 3, ["bang", "bang", "int"])
    p.chain(on_change("rev"), p.obj("delay 400", 2, 1, ["bang"]), dump)
    read = p.obj("peek~ ---frkf", 3, 1, ["float"])
    p.line(dump, 2, read, 0)
    store_split = p.obj("t 1 l 0", 1, 3, ["int", "", "int"])
    p.chain(read, p.obj("zl.group %d @zlmaxsize 1024" % BUFFER_SLOTS, 2, 2),
            store_split)
    store = p.obj(
        "pattr keyframes", 1, 3, parameter_enable=1, varname="keyframes",
        saved_attribute_attributes={"valueof": {
            "parameter_invisible": 1, "parameter_longname": "Keyframe Data",
            "parameter_shortname": "Keyframe Data", "parameter_type": 3}},
        saved_object_attributes={"client_rect": [4, 44, 358, 172],
                                 "parameter_enable": 1,
                                 "parameter_mappable": 0,
                                 "storage_rect": [583, 69, 1034, 197]})
    p.parameters[store] = ["Keyframe Data", "Keyframe Data", 0]
    # pattr echoes what it is given; the gate stops that echo being written
    # back over the buffer.
    restore = p.obj("gate 1 1", 2, 1)
    p.line(store_split, 2, restore, 0)
    p.line(store_split, 1, store, 0)
    p.line(store_split, 0, restore, 0)
    p.line(store, 0, restore, 1)
    p.chain(restore, p.obj("listfunnel", 1, 1),
            p.obj("peek~ ---frkf", 3, 1, ["float"]))

    # ---------------------------------------------------------------- mapping
    # Each channel's gain can drive any parameter in the set (the hardware's
    # "+10V offset" use: four CV outputs). Map, then click a parameter.
    p.section()
    selected = p.obj("live.path", 1, 3)
    p.chain(thisdevice, p.msg("path live_set view selected_parameter"),
            selected)
    picked = p.obj("prepend id", 1, 1)
    not_none = p.obj("sel 0", 2, 2, ["bang", ""])
    just_id = p.obj("route id", 1, 2)
    p.line(selected, 1, just_id, 0)
    p.line(just_id, 0, not_none, 0)
    p.line(not_none, 1, picked, 0)

    for k in range(4):
        n = k + 1
        x = 68 + 50 * k
        p.section()
        remote = p.obj("live.remote~", 2, 0)
        scale = p.obj("scale~ 0. 1. 0. 1.", 6, 1, ["signal"])
        p.line(gen, 11 + k, scale, 0)
        p.line(scale, 0, remote, 0)
        target = p.obj("live.object", 2, 1,
                       saved_object_attributes={"_persistence": 1})
        name = p.box("comment", 1, 0, text="-", presentation=1,
                     presentation_rect=[x - 2, 143, 50, 20], fontsize=9.0)

        # Whatever target the object holds (just picked, or restored with
        # the set): pass it to live.remote~ and read its range and name.
        getid = p.msg("getid")
        p.line(thisdevice, 0, getid, 0)
        p.line(getid, 0, target, 0)
        answers = p.obj("route min max name id", 1, 5)
        p.line(target, 0, answers, 0)
        p.line(answers, 0, scale, 3)
        p.line(answers, 1, scale, 4)
        show_name = p.obj("prepend set", 1, 1)
        p.line(answers, 2, show_name, 0)
        p.line(show_name, 0, name, 0)
        valid = p.obj("sel 0", 2, 2, ["bang", ""])
        p.line(answers, 3, valid, 0)
        valid_split = p.obj("t b i", 1, 2, ["bang", "int"])
        p.line(valid, 1, valid_split, 0)
        to_remote = p.obj("prepend id", 1, 1)
        p.line(valid_split, 1, to_remote, 0)
        p.line(to_remote, 0, remote, 1)
        p.chain(valid_split, p.msg("get min, get max, get name"), target)

        # Map: wait a moment (clicking Map itself selects a parameter), then
        # take the next parameter the user selects.
        mapping = p.toggle("Map %d" % n, [x, 126, 32, 15], "Map", "Pick",
                           hidden=True)
        armed = p.obj("gate", 2, 1)
        p.chain(mapping, p.obj("pipe 300", 2, 1), armed)
        p.line(picked, 0, armed, 1)
        chosen = p.obj("t b b b l", 1, 4, ["bang", "bang", "bang", ""])
        p.line(armed, 0, chosen, 0)
        p.line(chosen, 3, target, 1)
        p.line(chosen, 2, getid, 0)
        map_off = p.msg("set 0")
        p.line(chosen, 1, map_off, 0)
        p.line(map_off, 0, mapping, 0)
        disarm = p.msg("0")
        p.line(chosen, 0, disarm, 0)
        p.line(disarm, 0, armed, 0)

        unmap = p.button("Unmap %d" % n, [x + 33, 126, 13, 15], "x",
                         hidden=True)
        unmap_split = p.obj("t b b", 1, 2, ["bang", "bang"])
        p.line(unmap, 0, unmap_split, 0)
        release = p.msg("id 0")
        p.line(unmap_split, 1, release, 0)
        p.line(release, 0, remote, 1)
        p.line(release, 0, target, 1)
        clear_name = p.msg("set -")
        p.line(unmap_split, 0, clear_name, 0)
        p.line(clear_name, 0, name, 0)

    p.box("comment", 1, 0, text=label or "build %d" % BUILD, presentation=1,
          presentation_rect=[272, 160, 94, 12], fontsize=8.0)
    return p


def patcher_json(p):
    names = {entry[0] for entry in p.parameters.values()}
    for _, bank in BANKS:
        assert len(bank) == 8
        for name in bank:
            assert name == "-" or name in names, name
    parameters = dict(p.parameters)
    parameters["parameterbanks"] = {
        str(i): {"index": i, "name": name, "parameters": bank}
        for i, (name, bank) in enumerate(BANKS)}
    parameters["inherited_shortname"] = 1
    return {"patcher": {
        "fileversion": 1,
        "appversion": APPVERSION,
        "classnamespace": "box",
        "rect": [60, 100, 1600, 900],
        "openrect": [0.0, 0.0, 0.0, 169.0],
        "bglocked": 0,
        "openinpresentation": 1,
        "default_fontsize": 10.0,
        "default_fontface": 0,
        "default_fontname": "Arial Bold",
        "gridonopen": 1,
        "gridsize": [8.0, 8.0],
        "gridsnaponopen": 1,
        "objectsnaponopen": 1,
        "statusbarvisible": 2,
        "toolbarvisible": 1,
        "boxanimatetime": 500,
        "enablehscroll": 1,
        "enablevscroll": 1,
        "devicewidth": 0.0,
        "description": "",
        "digest": "",
        "tags": "",
        "style": "",
        "subpatcher_template": "",
        "boxes": p.boxes,
        "lines": p.lines,
        "parameters": parameters,
        "dependency_cache": [],
        "latency": 0,
        "is_mpe": 0,
        "autosave": 0,
    }}


def amxd_bytes(text):
    """Wrap patcher JSON as an unfrozen Max Audio Effect device."""
    body = text.encode("utf-8") + b"\x00"
    return (b"ampf" + struct.pack("<I", 4) + b"aaaa" +
            b"meta" + struct.pack("<I", 4) + struct.pack("<I", 0) +
            b"ptch" + struct.pack("<I", len(body)) + body)


def diagnostic_codes(code):
    """Cut-down versions of the gen~ code, to find what gen~ rejects.

    Version n keeps the declarations, the first n sections of the per-sample
    code, and the final outputs. Every variable is declared at the top, so a
    section that is left out just leaves its variables at zero.
    """
    marks = [m for m in re.finditer(r"^// -{64} (.+)$", code, re.M)]
    names = [m.group(1) for m in marks]
    assert names[-1] == "VCAs" and names[0] == "tables", names
    header = code[:marks[0].start()]
    footer = code[marks[-1].start():]
    sections = [code[marks[i].start():marks[i + 1].start()]
                for i in range(len(marks) - 1)]
    return [(n, header + "".join(sections[:n]) + footer,
             names[n - 1] if n else "declarations only")
            for n in range(len(sections))]


def frame_variants(code):
    """Versions of the code with only parts of the frame section kept.

    The frame section is a keyframer branch and a Poly LFO branch; each is
    cut into pieces so that the piece gen~ rejects can be found.
    """
    marks = [m for m in re.finditer(r"^// -{64} (.+)$", code, re.M)]
    names = [m.group(1) for m in marks]
    at = names.index("frame")
    before = code[:marks[at].start()]
    footer = code[marks[-1].start():]
    frame = code[marks[at].start():marks[at + 1].start()]

    def cut(text, start, end):
        i = text.index(start)
        j = text.index(end, i) if end else len(text)
        return text[i:j]

    head = frame[:frame.index("if (pmode < 1.5) {")]
    kf = cut(frame, "\t// ------------------------------------------------------------ keyframer\n",
             "\tfor (cc = 0; cc < 4; cc += 1) {\n\t\tlv0 = peek(lvl, cc);")
    gains = cut(frame, "\tfor (cc = 0; cc < 4; cc += 1) {\n\t\tlv0 = peek(lvl, cc);",
                "} else {")
    lfo_all = cut(frame, "\t// ------------------------------------------------------------ poly LFO\n", None)
    lfo_all = lfo_all[:lfo_all.rindex("}")]
    lfo_colour = lfo_all[:lfo_all.index("\t// Phase spread")]
    lfo_spread = cut(lfo_all, "\t// Phase spread", "\tucp = ")
    lfo_wave = cut(lfo_all, "\tucp = ", None)

    def variant(first, second):
        return (before + head + "if (pmode < 1.5) {\n" + first + "} else {\n" +
                second + "}\n\n" + footer)

    return [
        ("only the smoothing and colour set-up", variant("", "")),
        ("keyframer: lookup and interpolation", variant(kf, "")),
        ("keyframer: lookup and interpolation, and the gains", variant(kf + gains, "")),
        ("poly LFO: rate colour and phase/frequency spread", variant("", lfo_colour + lfo_spread)),
        ("poly LFO: waveforms and coupling", variant("", lfo_wave)),
        ("poly LFO: everything", variant("", lfo_all)),
    ]


def write_frame_diagnostics(directory):
    os.makedirs(directory, exist_ok=True)
    with open(os.path.join(HERE, "src", "keyframes.genexpr")) as f:
        code = f.read()
    for n, (what, variant) in enumerate(frame_variants(code)):
        text = json.dumps(patcher_json(build_patch(variant, "diagF %d" % n)),
                          indent="\t") + "\n"
        path = os.path.join(directory, "Keyframes-diagF-%d.amxd" % n)
        with open(path, "wb") as f:
            f.write(amxd_bytes(text))
        print("diagF %d: %s" % (n, what))


def write_diagnostics(directory):
    os.makedirs(directory, exist_ok=True)
    with open(os.path.join(HERE, "src", "keyframes.genexpr")) as f:
        code = f.read()
    for n, variant, last in diagnostic_codes(code):
        text = json.dumps(patcher_json(build_patch(variant, "diag %d" % n)),
                          indent="\t") + "\n"
        path = os.path.join(directory, "Keyframes-diag-%d.amxd" % n)
        with open(path, "wb") as f:
            f.write(amxd_bytes(text))
        print("diag %d: up to %s" % (n, last))


def main():
    if len(sys.argv) == 3 and sys.argv[1] == "--diagnose-frame":
        write_frame_diagnostics(sys.argv[2])
        return
    if len(sys.argv) == 3 and sys.argv[1] == "--diagnose":
        write_diagnostics(sys.argv[2])
        return
    with open(os.path.join(HERE, "src", "keyframes.genexpr")) as f:
        code = f.read()
    text = json.dumps(patcher_json(build_patch(code)), indent="\t") + "\n"
    with open(os.path.join(HERE, "Keyframes.maxpat"), "w") as f:
        f.write(text)
    with open(os.path.join(HERE, "Keyframes.amxd"), "wb") as f:
        f.write(amxd_bytes(text))
    print("wrote Keyframes.amxd and Keyframes.maxpat")


if __name__ == "__main__":
    main()
