# Keyframes

A Max for Live audio effect that ports the Mutable Instruments **Frames**
module: a keyframer and four-channel VCA/mixer, with the firmware's sequencer
and Poly LFO modes. Every control is a Live parameter laid out in Push banks,
so it can be played from a Push 3, including in standalone mode.

- `Keyframes.amxd` is the device.
- `Keyframes.maxpat` is the same patch as a plain Max patcher (see
  [If the device will not load](#if-the-device-will-not-load)).

> **Not yet run in Max or on a Push.** The device was written and built
> without access to Max or Live. The keyframer, sequencer, Poly LFO and audio
> code is tested against a port of the original firmware (see
> [Tests](#tests)), but the Max patch around it has only been checked
> statically. Expect to find something that needs fixing on first load, and
> see [What most needs checking](#what-most-needs-checking).

## Installing

1. Copy `Keyframes.amxd` into your Live User Library (for example
   `User Library/Presets/Audio Effects/Max Audio Effect`).
2. Drop it on an audio track.
3. For Push 3 standalone, save it in a set or the User Library and transfer
   that to the Push from Live's browser as usual. The device has no external
   files, so there is nothing to freeze.

It needs Live 11 or 12 with Max for Live.

## How it works

Turn **Frame** to move through the animation. **Add** stores a keyframe at the
current Frame position holding the four **Level** values. Between keyframes
the levels are interpolated. When Frame is on a keyframe, **Key** shows its
number and the Level controls edit it; **Delete** removes it.

Each level drives a VCA:

| Signal | Where it is in Live |
| --- | --- |
| ALL input | The track's own audio. It feeds all four channels. |
| Inputs 1 to 4 | Device inputs 3/4, 5/6, 7/8, 9/10. Route other tracks to them with "Audio To". Each is added to ALL. |
| MIX output | The track's output. |
| Outputs 1 to 4 | Device outputs 3/4, 5/6, 7/8, 9/10. Pick them on other tracks with "Audio From". |
| FR.STEP | Device output 11/12: a 1 ms pulse each time the animation crosses a keyframe. |
| CV outputs (+10V offset) | **Map** buttons: each channel's gain can drive any Live parameter. |
| FRAME CV | Automate or modulate the Frame parameter. |

To use it as a four-input mixer, put it on an empty audio track and route four
tracks to its inputs. To use it as four modulation sources, map the channels
and ignore the audio.

A new device starts with Level 1 at 100% and the others at 0, so it passes
audio unchanged until you change something.

## Push banks

| Bank | Controls |
| --- | --- |
| Frames | Frame, Level 1 to 4, Add, Delete, Key |
| Curves | Curve 1 to 4, Resp 1 to 4 |
| Seq + Mix | Mode, Seq Rate, Seq Step, Clear All, Mix 1 to 4 |
| Poly LFO | Shape, Shape Spread, Spread, Coupling |

- **Add, Delete, Seq Step, Clear All** are buttons: turn the encoder to fire
  them.
- **Key** shows the keyframe Frame is on (0 = none). Turning it jumps Frame
  to that keyframe, which is the easy way to land on one from an encoder.
- **Curve** is the interpolation into the next keyframe: Step, Linear, Accel,
  Decel, Smooth or Bounce. On the hardware this is "hold ADD".
- **Resp** is the VCA response from linear (0%) to exponential (100%). On the
  hardware this is "hold DEL".
- **Mix 1 to 4** take a channel out of the MIX output, like plugging a cable
  into its individual output.
- **Mode**: Keyframe, Sequencer or Poly LFO.
  - *Sequencer* steps from keyframe to keyframe without interpolation, on
    **Seq Step** or in time with the transport at **Seq Rate**.
  - *Poly LFO* turns the four channels into LFOs. Frame is the rate (0.013 Hz
    to 110 Hz). Shape picks the waveform, Shape Spread offsets it per channel,
    Spread sets phase (right) or frequency (left) differences, and Coupling
    makes each LFO push its neighbour.

Mapping (**Map**, then click a parameter in Live; **x** to release) is done
on a computer, because it needs a click in Live. The mappings are saved with
the set and work on the Push afterwards.

## Differences from the hardware

- Up to 32 keyframes fit in practice, as on the hardware: a keyframe cannot
  be added within about 3% of another.
- The level controls and Key follow the keyframe you land on, a quarter of a
  second after Frame stops moving. The hardware's pots cannot move.
- Inputs 1 to 4 are added to ALL instead of replacing it, since Live cannot
  tell whether something is plugged in.
- There is no +10V offset switch. The Map buttons do that job.
- The sequencer is clocked by Seq Step or the transport, not by pulses on the
  FRAME CV input, and Mode replaces the button-press codes.
- Keyframes are saved with the Live set automatically.
- Easing curves are computed rather than read from the firmware's 1025-point
  tables, and Poly LFO runs at the audio rate rather than 24 kHz. Levels agree
  with the firmware to within 0.15% of full scale in the tests.

## What most needs checking

In rough order of how unsure they are:

1. That `Keyframes.amxd` opens at all (the file wrapper is written by hand).
2. Keyframes surviving a save and reload of the set (`pattr` stored as a
   parameter, copied to and from a `buffer~`).
3. The Map buttons (`live.path`, `live.object`, `live.remote~`).
4. Add and Delete from Push encoders (`live.text` in button mode).
5. The layout of the device view, which has never been seen.
6. The Seq Rate sync (`phasor~ 1n @lock 1`).

## If the device will not load

Open `Keyframes.maxpat` in Max (from Live: create an empty Max Audio Effect,
click its edit button, then File > Open). Copy everything into the empty
device's patcher, or save the patcher as a Max for Live device, and save.

## Building and tests

```
python3 build.py              # rebuild Keyframes.amxd and Keyframes.maxpat
python3 tests/test_build.py   # static checks on the built patch
node tests/test_core.js       # runs the gen~ code against the firmware port
```

All the signal and keyframe logic is in `src/keyframes.genexpr`, the code of
the device's single `gen~` object. `build.py` wraps it in the Max patch.
`tests/test_core.js` runs that same file outside Max and compares it with a
JavaScript port of the firmware's `Keyframer` class over random editing
sessions, and checks the Poly LFO wavetables against the firmware's table
script (`tests/make_reference_tables.py`, needs numpy).

## Credits

Frames was designed by Émilie Gillet of Mutable Instruments, who released its
firmware under the MIT licence; see `LICENSE-frames.txt`. This is an
independent port, not a Mutable Instruments product.
