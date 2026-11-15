// Tests for src/keyframes.genexpr, the code inside the device's gen~ object.
// Run with:  node tests/test_core.js
//
// The reference here is a line-for-line JavaScript port of the Frames
// firmware's Keyframer class (frames/keyframer.cc, MIT, (c) 2013 Emilie
// Gillet), integer maths and lookup tables included.
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { load } = require('./genexpr_runner.js');

const SOURCE = fs.readFileSync(path.join(__dirname, '..', 'src', 'keyframes.genexpr'), 'utf8');

// ------------------------------------------------------------------ firmware
const PALETTE = [[255, 0, 0], [255, 64, 0], [255, 255, 0], [64, 255, 0],
  [0, 255, 64], [0, 0, 255], [255, 0, 255], [255, 0, 64]];

function bounceOut(t) {
  if (t < 1 / 2.75) return 7.5625 * t * t;
  if (t < 2 / 2.75) { t -= 1.5 / 2.75; return 7.5625 * t * t + 0.75; }
  if (t < 2.5 / 2.75) { t -= 2.25 / 2.75; return 7.5625 * t * t + 0.9375; }
  t -= 2.625 / 2.75;
  return 7.5625 * t * t + 0.984375;
}
const X = Array.from({ length: 1025 }, (_, i) => i / 1024);
const EASING = [
  X.map((x) => Math.round(x ** 4 * 65535)),
  X.map((x) => Math.round((1 - (1 - x) ** 4) * 65535)),
  X.map((x) => Math.round((1 - Math.cos(x * Math.PI)) / 2 * 65535)),
  X.map((x) => Math.round(bounceOut(x) * 65535)),
];
const RESPONSE_BALANCE = Array.from({ length: 256 }, (_, i) => Math.round(32767 * (i / 255) ** 1.5));
const VCA_LINEAR = Array.from({ length: 1025 }, (_, i) => {
  const gain = 1 / 4096 + (1 - 1 / 4096) * i / 1024;
  return Math.max(Math.min(Math.round(65535 / 2.5 * -2 / 3 * Math.log10(gain)), 65535), 0);
});

class Keyframer {
  constructor() {
    this.keyframes = [];
    this.idCounter = 0;
    this.settings = [0, 1, 2, 3].map(() => ({ curve: 1, response: 0 }));
    this.immediate = [0, 0, 0, 0];
    this.levels = [0, 0, 0, 0];
    this.color = [255, 255, 255];
  }
  find(timestamp) {
    let i = 0;
    while (i < this.keyframes.length && this.keyframes[i].timestamp < timestamp) i++;
    return i;
  }
  findNearest(timestamp, tolerance) {
    const n = this.keyframes.length;
    if (!n) return -1;
    const index = this.find(timestamp);
    const start = index ? index - 1 : 0;
    const end = index < n - 1 ? index + 2 : n;
    for (let i = start; i < end; i++) {
      const distance = this.keyframes[i].timestamp - timestamp;
      if (distance < tolerance && -distance < tolerance) return i;
    }
    return -1;
  }
  add(timestamp, values) {
    if (this.keyframes.length === 64) return false;
    const at = this.find(timestamp);
    if (at >= this.keyframes.length || this.keyframes[at].timestamp !== timestamp) {
      this.keyframes.splice(at, 0, { timestamp, id: this.idCounter, values: [] });
      this.idCounter = (this.idCounter + 1) & 0xffff;
    }
    this.keyframes[at].values = values.slice();
    return true;
  }
  remove(timestamp) {
    const at = this.find(timestamp);
    if (at >= this.keyframes.length || this.keyframes[at].timestamp !== timestamp) return false;
    this.keyframes.splice(at, 1);
    return true;
  }
  static easing(from, to, scale, curve) {
    let shaped = scale;
    if (curve === 0) {
      shaped = scale < 32768 ? 0 : 65535;
    } else if (curve >= 2) {
      const table = EASING[curve - 2];
      const a = table[scale >> 6];
      const b = table[Math.min((scale >> 6) + 1, 1024)];
      shaped = a + Math.floor(((b - a) >> 1) * ((scale << 10) & 0xffff) / 32768);
    }
    return from + Math.floor((to - from) * (shaped >> 1) / 32768);
  }
  static dacCode(gain, response) {
    const exponential = 65535 - gain;
    const a = VCA_LINEAR[gain >> 6];
    const b = VCA_LINEAR[(gain >> 6) + 1];
    const linear = a + Math.floor((b - a) * ((gain << 10) & 0xffff) / 65536);
    const balance = RESPONSE_BALANCE[response];
    return (linear + Math.floor((exponential - linear) * balance / 32768)) >> 4;
  }
  evaluate(timestamp) {
    const n = this.keyframes.length;
    if (!n) {
      this.levels = this.immediate.slice();
      this.color = [255, 255, 255];
      this.position = -1;
      this.nearest = -1;
      return;
    }
    const position = this.find(timestamp);
    this.position = position;
    if (position === 0 || position === n) {
      const source = this.keyframes[position === 0 ? 0 : n - 1];
      this.levels = source.values.slice();
      this.color = PALETTE[source.id & 7].slice();
    } else {
      const a = this.keyframes[position - 1];
      const b = this.keyframes[position];
      const scale = Math.floor((timestamp - a.timestamp) * 65536 / (b.timestamp - a.timestamp));
      this.levels = [0, 1, 2, 3].map((i) =>
        Keyframer.easing(a.values[i], b.values[i], scale, this.settings[i].curve));
      this.color = [0, 1, 2].map((i) => {
        const ca = PALETTE[a.id & 7][i];
        const cb = PALETTE[b.id & 7][i];
        return ca + Math.floor((cb - ca) * scale / 65536);
      });
    }
    const tThis = timestamp - (position === 0 ? 0 : this.keyframes[position - 1].timestamp);
    const tNext = (position < n ? this.keyframes[position].timestamp : 65536) - timestamp;
    this.nearest = tNext < tThis ? position + 1 : position;
  }
}

// ------------------------------------------------------------------ helpers
// A deterministic random source, so failures reproduce.
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

// The device at a low sample rate, so the FRAME smoothing settles in a few
// samples and the tests stay fast.
class Device {
  constructor(samplerate = 100) {
    this.gen = load(SOURCE, samplerate);
    this.serial = {};
    this.outs = this.gen.tick();
  }
  set(name, value) { this.gen.set(name, value); }
  bump(name) {
    this.serial[name] = (this.serial[name] || 0) + 1;
    this.gen.set(name, this.serial[name]);
  }
  frame(timestamp) { this.set('pframe', timestamp / 655.35); }
  level(channel, value) {
    this.set('plv' + (channel + 1), value / 655.35);
  }
  run(samples = 8, ins) {
    for (let i = 0; i < samples; i++) this.outs = this.gen.tick(ins);
    return this.outs;
  }
  get gains() { return this.outs.slice(11, 15); }
  get levels() { return this.outs.slice(15, 19); }
  get key() { return this.outs[19]; }
  get count() { return this.outs[30]; }
  get color() { return this.outs.slice(27, 30); }
  get stored() {
    const buf = this.gen.datas.frkf;
    const list = [];
    for (let i = 0; i < buf[0]; i++) {
      const at = 2 + 6 * i;
      list.push({ timestamp: buf[at], id: buf[at + 1], values: Array.from(buf.slice(at + 2, at + 6)) });
    }
    return list;
  }
}

const tests = [];
function test(name, fn) { tests.push([name, fn]); }

// ------------------------------------------------------------------ tests
test('Poly LFO wavetables match the firmware tables exactly', () => {
  const device = new Device();
  const reference = JSON.parse(fs.readFileSync(path.join(__dirname, 'reference_tables.json'), 'utf8'));
  assert.strictEqual(reference.length, 18);
  for (let w = 0; w < 18; w++) {
    for (let i = 0; i < 257; i++) {
      assert.strictEqual(Math.round(device.gen.datas.wt[w * 257 + i] * 255), reference[w][i],
        'table ' + w + ' point ' + i);
    }
  }
});

test('with no keyframes the level controls set the levels directly', () => {
  const device = new Device();
  [65535, 0, 32768, 1000].forEach((v, c) => device.level(c, v));
  device.run();
  assert.deepStrictEqual(device.levels.map((l) => Math.round(l * 65535)), [65535, 0, 32768, 1000]);
  assert.strictEqual(device.key, 0);
  assert.deepStrictEqual(device.color, [1, 1, 1]);
});

test('random add / edit / delete / move sessions match the firmware', () => {
  for (let seed = 1; seed <= 6; seed++) {
    const random = rng(seed);
    const device = new Device();
    const firmware = new Keyframer();
    const knobs = [0, 0, 0, 0];
    let frame = 0;
    for (let step = 0; step < 400; step++) {
      const action = random();
      if (action < 0.45) {
        // Sometimes land exactly on a keyframe, sometimes near one.
        if (firmware.keyframes.length && random() < 0.5) {
          const k = firmware.keyframes[Math.floor(random() * firmware.keyframes.length)];
          frame = Math.min(65535, Math.max(0, k.timestamp + Math.floor((random() - 0.5) * 6000)));
        } else {
          frame = Math.floor(random() * 65536);
        }
        device.frame(frame);
      } else if (action < 0.6) {
        if (firmware.findNearest(frame, 2048) === -1) firmware.add(frame, knobs);
        device.bump('padd');
      } else if (action < 0.7) {
        const active = firmware.findNearest(frame, 2048);
        if (active !== -1) firmware.remove(firmware.keyframes[active].timestamp);
        device.bump('pdel');
      } else if (action < 0.9) {
        const channel = Math.floor(random() * 4);
        knobs[channel] = Math.floor(random() * 65536);
        const active = firmware.findNearest(frame, 2048);
        if (active !== -1) firmware.keyframes[active].values[channel] = knobs[channel];
        else firmware.immediate[channel] = knobs[channel];
        device.level(channel, knobs[channel]);
        device.bump('pev' + (channel + 1));
      } else {
        const channel = Math.floor(random() * 4);
        firmware.settings[channel].curve = Math.floor(random() * 6);
        device.set('pcv' + (channel + 1), firmware.settings[channel].curve);
      }
      device.run();
      firmware.evaluate(frame);
      const where = 'seed ' + seed + ' step ' + step;
      assert.strictEqual(device.count, firmware.keyframes.length, where);
      assert.deepStrictEqual(device.stored, firmware.keyframes, where);
      assert.strictEqual(device.key, firmware.findNearest(frame, 2048) + 1, where);
      if (firmware.keyframes.length) {
        for (let c = 0; c < 4; c++) {
          const got = device.levels[c] * 65535;
          assert.ok(Math.abs(got - firmware.levels[c]) < 96,
            where + ' channel ' + c + ': ' + got + ' vs ' + firmware.levels[c]);
        }
        for (let c = 0; c < 3; c++) {
          assert.ok(Math.abs(device.color[c] * 255 - firmware.color[c]) < 1.01, where + ' colour');
        }
      }
    }
  }
});

test('keyframes cannot be closer than the firmware allows', () => {
  const device = new Device();
  for (let i = 0; i < 40; i++) {
    device.frame(Math.min(i * 2048, 65535));
    device.run();
    device.bump('padd');
    device.run();
  }
  assert.strictEqual(device.count, 32);
  device.frame(2048 + 2047);
  device.run();
  device.bump('padd');
  device.run();
  assert.strictEqual(device.count, 32);
});

test('response curve matches the firmware VCA code', () => {
  const device = new Device();
  for (const response of [0, 64, 128, 200, 255]) {
    device.set('prs1', response / 2.55);
    for (const level of [3000, 9000, 20000, 32768, 50000, 65535]) {
      device.level(0, level);
      device.run();
      const code = Keyframer.dacCode(level, response);
      const expected = 10 ** (-3.75 * code / 4095);
      const got = device.gains[0];
      assert.ok(Math.abs(got - expected) < 0.03 * expected + 0.002,
        'response ' + response + ' level ' + level + ': ' + got + ' vs ' + expected);
    }
  }
  device.set('prs1', 0);
  device.level(0, 0);
  device.run();
  assert.ok(device.gains[0] < 1e-9);
  device.level(0, 32768);
  device.run();
  assert.ok(Math.abs(device.gains[0] - 0.5) < 0.001);
});

function threeKeyframes(device) {
  [10000, 30000, 50000].forEach((timestamp, i) => {
    device.frame(timestamp);
    [0, 1, 2, 3].forEach((c) => device.level(c, c === 0 ? (i + 1) * 20000 : 0));
    device.run();
    device.bump('padd');
    device.run();
  });
}

test('FR.STEP fires once, for 1 ms, per keyframe crossed', () => {
  const device = new Device(8000);
  threeKeyframes(device);
  device.frame(0);
  device.run(400);
  let pulses = 0;
  let high = 0;
  let longest = 0;
  let previous = 0;
  for (let frame = 0; frame <= 65535; frame += 16) {
    device.frame(frame);
    const trigger = device.run(1)[10];
    if (trigger && !previous) pulses++;
    high = trigger ? high + 1 : 0;
    longest = Math.max(longest, high);
    previous = trigger;
  }
  assert.strictEqual(pulses, 3);
  assert.strictEqual(longest, 8);
  // Wobbling around one keyframe does not retrigger.
  pulses = 0;
  for (let i = 0; i < 2000; i++) {
    device.frame(50000 + (i % 2 ? 200 : -200));
    const trigger = device.run(1)[10];
    if (trigger && !previous) pulses++;
    previous = trigger;
  }
  assert.ok(pulses <= 1, 'pulses ' + pulses);
});

test('the Key control jumps FRAME to a keyframe', () => {
  const device = new Device();
  threeKeyframes(device);
  device.set('pkeysel', 2);
  device.bump('pkeyev');
  device.run(1);
  assert.strictEqual(device.outs[25], 1);
  assert.ok(Math.abs(device.outs[26] * 655.35 - 30000) < 1e-6);
  device.set('pframe', device.outs[26]);
  device.run();
  assert.strictEqual(device.key, 2);
  assert.strictEqual(Math.round(device.outs[20] * 655.35), 40000);
  // Out of range: nothing happens.
  device.set('pkeysel', 9);
  device.bump('pkeyev');
  device.run(1);
  assert.strictEqual(device.outs[25], 1);
});

test('sequencer mode steps through keyframes without interpolation', () => {
  const device = new Device();
  threeKeyframes(device);
  device.set('pmode', 1);
  device.frame(20000);
  device.run();
  const seen = [];
  for (let i = 0; i < 7; i++) {
    seen.push(Math.round(device.levels[0] * 65535));
    device.bump('pstep');
    device.run();
  }
  assert.deepStrictEqual(seen, [20000, 40000, 60000, 20000, 40000, 60000, 20000]);
  // Synced: four steps per bar of the transport phasor.
  device.set('pdiv', 3);
  const levels = new Set();
  let changes = 0;
  let last = device.levels[0];
  for (let i = 0; i < 800; i++) {
    const phase = (i / 400) % 1;
    device.run(1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, phase]);
    if (device.levels[0] !== last) changes++;
    last = device.levels[0];
    levels.add(Math.round(last * 65535));
  }
  assert.strictEqual(changes, 7);
  assert.deepStrictEqual([...levels].sort(), [20000, 40000, 60000]);
  // One step per bar: a step at the start of each of the two bars.
  device.set('pdiv', 1);
  changes = 0;
  for (let i = 0; i < 800; i++) {
    device.run(1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, (i / 400) % 1]);
    if (device.levels[0] !== last) changes++;
    last = device.levels[0];
  }
  assert.strictEqual(changes, 2);
  // A stopped transport does not step.
  changes = 0;
  for (let i = 0; i < 100; i++) {
    device.run(1, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3]);
    if (i > 0 && device.levels[0] !== last) changes++;
    last = device.levels[0];
  }
  assert.strictEqual(changes, 0);
});

test('clear removes every keyframe', () => {
  const device = new Device();
  threeKeyframes(device);
  device.bump('pclr');
  device.run();
  assert.strictEqual(device.count, 0);
  assert.strictEqual(device.key, 0);
});

test('audio: ALL feeds every channel, inputs add, Mix switches gate the mix', () => {
  const device = new Device();
  [65535, 32768, 0, 0].forEach((v, c) => device.level(c, v));
  device.run(20);
  // ALL = 1 on the left, channel 2 input = 1 on the right.
  let outs = device.run(20, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
  const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-3, a + ' vs ' + b);
  near(outs[2], 1);
  near(outs[4], 0.5);
  near(outs[5], 0.5);
  near(outs[0], 1.5);
  near(outs[1], 0.5);
  device.set('pmx2', 0);
  outs = device.run(20, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]);
  near(outs[0], 1);
  near(outs[1], 0);
  near(outs[4], 0.5);
});

function cycles(device, channel, samples) {
  let count = 0;
  let previous = device.levels[channel];
  for (let i = 0; i < samples; i++) {
    device.run(1);
    const now = device.levels[channel];
    if (previous < 0.5 && now >= 0.5) count++;
    previous = now;
  }
  return count;
}

test('Poly LFO: rate range, phase spread and frequency spread', () => {
  const sine = 8 / 0.1599976;
  const ramp = 1 / 0.1599976;
  let device = new Device(2000);
  device.set('pmode', 2);
  device.set('pshape', sine);
  device.set('pframe', 100);
  device.run(400);
  // Top of the range is 110 Hz.
  const top = cycles(device, 0, 2000);
  assert.ok(Math.abs(top - 110) <= 2, 'top rate ' + top);
  // An octave down for every 5040 / 65536 of the control.
  device.frame(65535 - 5040 * 3);
  device.run(400);
  const lower = cycles(device, 0, 8000) / 4;
  assert.ok(Math.abs(lower - 13.75) <= 1, 'lower rate ' + lower);

  // Phase spread: a quarter cycle between neighbours at full.
  device = new Device(2000);
  device.set('pmode', 2);
  device.set('pshape', ramp);
  device.frame(40000);
  device.set('pspread', 100);
  device.run(300);
  for (let c = 1; c < 4; c++) {
    let lead = device.levels[c] - device.levels[c - 1];
    lead -= Math.floor(lead);
    assert.ok(Math.abs(lead - 0.25) < 0.02, 'phase lead ' + lead);
  }

  // Frequency spread: an octave between neighbours at full.
  device = new Device(2000);
  device.set('pmode', 2);
  device.set('pshape', sine);
  device.frame(65535 - 5040 * 4);
  device.set('pspread', -100);
  device.run(400);
  const base = cycles(device, 0, 8000);
  const octave = new Device(2000);
  octave.set('pmode', 2);
  octave.set('pshape', sine);
  octave.frame(65535 - 5040 * 4);
  octave.set('pspread', -100);
  octave.run(400);
  const up = cycles(octave, 1, 8000);
  assert.ok(Math.abs(up / base - 2) < 0.1, base + ' vs ' + up);
});

test('Poly LFO: shape spread offsets the waveform per channel, coupling stays stable', () => {
  const device = new Device(2000);
  device.set('pmode', 2);
  device.set('pshape', 6 / 0.1599976);   // square
  device.set('pshspr', 50);              // two tables per channel -> sine on channel 2
  device.frame(50000);
  device.set('pcoup', 100);
  let flat = 0;
  const sineValues = new Set();
  for (let i = 0; i < 4000; i++) {
    device.run(1);
    for (const level of device.levels) assert.ok(level >= 0 && level <= 1);
    if (device.levels[0] < 0.001 || device.levels[0] > 0.999) flat++;
    sineValues.add(device.levels[1]);
  }
  // A square spends nearly all its time at the rails; a sine does not.
  assert.ok(flat > 3600, 'flat ' + flat);
  assert.ok(sineValues.size > 50);
});

// ------------------------------------------------------------------ run
let failed = 0;
const only = process.argv[2];
for (const [name, fn] of tests) {
  if (only && !name.includes(only)) continue;
  try {
    fn();
    console.log('ok   ' + name);
  } catch (error) {
    failed++;
    console.log('FAIL ' + name + '\n     ' + String(error.message).split('\n').slice(0, 8).join('\n     '));
  }
}
console.log(failed ? failed + ' failed' : 'all passed');
process.exit(failed ? 1 : 0);
