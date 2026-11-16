"""Static checks on the built device. Run with:  python3 tests/test_build.py

These cannot prove the patch behaves in Max, but they catch the mistakes a
generated patch can contain: cords to inlets that do not exist, controls
talking to gen~ parameters that are not there, a stale build.
"""
import json
import os
import re
import struct
import sys
import unittest

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)

import build  # noqa: E402


def read(name, mode="r"):
    with open(os.path.join(ROOT, name), mode) as f:
        return f.read()


class BuildTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.code = read(os.path.join("src", "keyframes.genexpr"))
        cls.text = read("Keyframes.maxpat")
        cls.patcher = json.loads(cls.text)["patcher"]
        cls.boxes = {b["box"]["id"]: b["box"] for b in cls.patcher["boxes"]}

    def test_committed_files_match_the_source(self):
        patch = build.patcher_json(build.build_patch(self.code))
        self.assertEqual(json.dumps(patch, indent="\t") + "\n", self.text)
        self.assertEqual(build.amxd_bytes(self.text), read("Keyframes.amxd", "rb"))

    def test_amxd_container(self):
        data = read("Keyframes.amxd", "rb")
        self.assertEqual(data[:4], b"ampf")
        self.assertEqual(data[8:12], b"aaaa")           # audio effect
        self.assertEqual(data[24:28], b"ptch")
        (size,) = struct.unpack("<I", data[28:32])
        self.assertEqual(size, len(data) - 32)
        self.assertEqual(json.loads(data[32:-1].decode("utf-8")),
                         json.loads(self.text))

    def test_patch_cords_join_real_inlets_and_outlets(self):
        self.assertEqual(len(self.boxes), len(self.patcher["boxes"]))
        for line in self.patcher["lines"]:
            src, outlet = line["patchline"]["source"]
            dst, inlet = line["patchline"]["destination"]
            self.assertLess(outlet, self.boxes[src]["numoutlets"], src)
            self.assertLess(inlet, self.boxes[dst]["numinlets"], dst)

    def test_gen_code_matches_its_box(self):
        gen = [b for b in self.boxes.values()
               if b.get("text", "").startswith("gen~")]
        self.assertEqual(len(gen), 1)
        inner = {b["box"]["id"]: b["box"] for b in gen[0]["patcher"]["boxes"]}
        self.assertEqual(inner["code"]["code"], self.code)
        ins = {int(n) for n in re.findall(r"\bin(\d+)\b", self.code)}
        outs = {int(n) for n in re.findall(r"^out(\d+) =", self.code, re.M)}
        self.assertEqual(max(ins), build.GEN_INLETS)
        self.assertEqual(outs, set(range(1, build.GEN_OUTLETS + 1)))
        self.assertEqual(gen[0]["numinlets"], build.GEN_INLETS)
        self.assertEqual(gen[0]["numoutlets"], build.GEN_OUTLETS)

    def test_gen_code_avoids_constructs_gen_rejects(self):
        # gen~ hoists each peek() into a hidden variable; in a condition that
        # variable is not defined and the whole gen~ fails to compile.
        for number, line in enumerate(self.code.splitlines(), 1):
            code = line.split("//")[0]
            if re.search(r"\b(if|for|while)\b", code):
                self.assertNotIn("peek(", code, "line %d: %s" % (number, line))

    def test_every_peek_is_a_plain_read(self):
        # gen~ splits peek() into hidden variables and fails to compile
        # ("variable peek_N is not defined") when it is nested in another
        # expression. Every peek must be the whole right-hand side of an
        # assignment, with nothing but arithmetic in its index.
        for number, line in enumerate(self.code.splitlines(), 1):
            code = line.split("//")[0].strip()
            if "peek(" not in code:
                continue
            m = re.match(r"^\w+ = peek\((\w+), ([^;]*)\);$", code)
            self.assertTrue(m, "line %d: %s" % (number, line))
            self.assertNotIn("peek(", m.group(2), "line %d" % number)
            depth = 0
            for ch in "peek(" + m.group(1) + ", " + m.group(2) + ")":
                depth += (ch == "(") - (ch == ")")
                self.assertGreaterEqual(depth, 0, "line %d" % number)
            self.assertEqual(depth, 0, "line %d" % number)

    def test_every_gen_parameter_has_a_control(self):
        declared = set(re.findall(r"^Param (\w+)\(", self.code, re.M))
        sent = {b["text"].split()[1] for b in self.boxes.values()
                if b.get("text", "").startswith("prepend p")}
        self.assertEqual(declared, sent)

    def test_push_banks(self):
        names = [v[0] for k, v in self.patcher["parameters"].items()
                 if k.startswith("obj-")]
        self.assertEqual(len(names), len(set(names)))
        banks = self.patcher["parameters"]["parameterbanks"]
        self.assertEqual(len(banks), 4)
        used = []
        for bank in banks.values():
            self.assertEqual(len(bank["parameters"]), 8)
            used += [n for n in bank["parameters"] if n != "-"]
        self.assertEqual(len(used), len(set(used)))
        hidden = {b["saved_attribute_attributes"]["valueof"]["parameter_longname"]
                  for b in self.boxes.values()
                  if b.get("saved_attribute_attributes", {}).get("valueof", {})
                  .get("parameter_invisible")}
        # Everything a player needs is on Push; only mapping and the saved
        # keyframe data are not.
        self.assertEqual(set(names) - set(used), hidden)

    def test_keyframe_storage_covers_the_buffer(self):
        self.assertEqual(build.BUFFER_SLOTS, 386)
        self.assertIn("uzi 386 0", [b.get("text") for b in self.boxes.values()])


if __name__ == "__main__":
    unittest.main()
