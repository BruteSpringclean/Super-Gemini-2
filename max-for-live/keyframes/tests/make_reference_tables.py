"""Regenerate reference_tables.json: the Poly LFO wavetables exactly as the
Frames firmware builds them (port of frames/resources/waveforms.py, MIT,
(c) 2014 Emilie Gillet). Needs numpy. The device test compares the tables the
gen~ code builds against this file."""
import json
import os

import numpy


def scale(x):
    x = (x - x.min()) / (x.max() - x.min())
    return numpy.round(x * 255).astype(int)


t = numpy.arange(0, 256) / 256.0
ramp = t
triangle = 2 * t * (t < 0.5) + (2.0 - 2 * t) * (t >= 0.5)
square = (t < 0.5)
bipolar_triangle = 2 * triangle - 1.0
sine = numpy.sin(2 * numpy.pi * t)

lfos = [ramp ** 4, ramp, triangle, ramp[::-1], ramp[::-1] ** 4]
window = (1.0 - numpy.cos(4 * numpy.pi * t)) / 2.0
lfos.append(numpy.maximum(sine, 0.0) * window)
lfos.append(square.astype(float))
sine_2 = sine + 0.7 * numpy.sin(4 * numpy.pi * t)
sine_3 = sine + 0.7 * numpy.sin(6 * numpy.pi * t)
sine_5 = sine + 0.7 * numpy.sin(10 * numpy.pi * t)
lfos += [sine ** 3, sine, sine_2, sine_3, sine_5]
triangle_3 = numpy.cumsum(numpy.sign(numpy.diff(sine_3)))
lfos.append(numpy.array([0] + list(triangle_3)))
for fold_amount in [1.0, 0.5]:
    rotate = (numpy.arange(0, 256) + 128) % 256
    fold = (1 + fold_amount) * bipolar_triangle[rotate]
    fold[fold > 1.0] = 2.0 - fold[fold > 1.0]
    fold[fold < -1.0] = -2.0 - fold[fold < -1.0]
    lfos.append(-fold)
lfos.append(2 ** (4 * triangle) - 1)
numpy.random.seed(999)
lfos.append(numpy.random.random((256, 1)).ravel())
lfos.append(sine)

tables = []
for values in lfos:
    values = scale(values)
    tables.append([int(v) for v in values] + [int(values[0])])

here = os.path.dirname(os.path.abspath(__file__))
with open(os.path.join(here, "reference_tables.json"), "w") as f:
    json.dump(tables, f, separators=(",", ":"))
    f.write("\n")
