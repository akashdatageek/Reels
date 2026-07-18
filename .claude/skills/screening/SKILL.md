---
name: screening
description: Stage between build and editor — the pipeline must LOOK at the reel it rendered. Runs pipeline/screen.py to extract stills (per-scene frames, contact sheet, first-second strip, waveform), then the orchestrator VIEWS them with the Read tool and judges the R1–R8 rubric in writing, each verdict citing a specific still and comparing against exemplars/. Any FAIL triggers the smallest-fix revision loop (max 2 rounds). Records ledger stage `screening`; handoff blocks without it. Use after reel.mp4 exists, before editor writes the caption.
---

# Screening — did anyone actually LOOK at this reel?

The pipeline can render a reel nobody ever watched. This gate forces the
orchestrator to look at the actual pixels and the actual audio shape — not
`reel.json`, not the build log — and to defend, in writing, that the reel
survives the eight ways reels die on a phone screen.

Run this AFTER `build` (reel.mp4 exists, `build` gate green) and BEFORE the
`editor` stage writes the caption. The editor's cover.png must be chosen from
a still that passed R4/R5 here.

## 1. Generate the evidence

```bash
python3 pipeline/screen.py output/<story>
```

This writes `output/<story>/stills/`:

- `scene_<idx>_<t>.jpg` — every scene at first visible frame, midpoint, and
  each figureFocus step's midpoint (times computed from reel.json)
- `contact_sheet.jpg` — all stills tiled 4-across at 270×480 (grid size)
- `first_second.jpg` — frames at 0.25s / 0.5s / 1.0s in a row (scroll-stop)
- `waveform.png` — full-reel audio waveform

and records ledger stage `screening_assets`. If it fails, fix the cause —
never judge from stale stills.

## 2. LOOK, then judge — the rubric

**View the images with the Read tool. Actually look.** Never infer a verdict
from reel.json, from the build log, or from memory of what the scene "should"
look like — the whole point of this gate is that the JSON can be right and the
frame still wrong. Read, at minimum: `contact_sheet.jpg`, `first_second.jpg`,
`waveform.png`, and any individual still you cite, at full size.

**Consult the bar first:** open `exemplars/exemplars.md` (in this skill's
folder) and view the referenced frames. Every judgment below is comparative —
"compared to our bar, does this frame hold up?" — not an absolute vibe check.

Answer every item IN WRITING: **PASS or FAIL + the still filename + one-line
reason.** No verdict without a cited still.

- **R1 SCROLL-STOP** — in `first_second.jpg` (0.25–1.0s): does the hook land
  *visually*? A viewer mid-scroll sees these three frames with no audio. If
  the frames are still fading in, empty, or generic, FAIL.
- **R2 LEGIBILITY** — squint test on the 270px contact-sheet tile of every
  figure payoff frame: is the number/label the scene exists for readable at
  phone arm's length? If you have to open the full-size still to find the
  point, FAIL.
- **R3 STASIS** — compare adjacent stills *within* each scene: is any stretch
  visibly unchanged for >3s? Two neighbouring stills ≥3s apart that look
  identical = dead screen time, FAIL.
- **R4 SENDABLE** — the designated sendable frame (author skill marks one):
  screenshot-worthy *out of context*? Would it make sense forwarded to
  someone who never saw the reel? If it needs the narration to land, FAIL.
- **R5 IDENTITY** — do all stills on the contact sheet read as ONE channel
  (same palette, type, layout language)? Does the intended cover still work
  at grid size? One off-brand frame = FAIL.
- **R6 SAFE ZONES** — is anything critical (text, figure payoff, credit)
  under IG chrome (top 250px / bottom 320px)? Check the individual stills,
  not the sheet. Anything load-bearing in those bands = FAIL.
- **R7 AUDIO SHAPE** — on `waveform.png`: any dead air >1s? Any clipped-flat
  blocks? Does the outro taper, or does the audio cut mid-energy? Any of
  those = FAIL.
- **R8 BACKGROUND** — on every text-scene tile in the contact sheet: is the
  text still fully legible OVER its background at 270px (the scrim doing its
  job — background at ~15-25% weight, never fighting the type)? And is the
  background clearly *topic-relevant* — recognizably from this story's world
  — not generic wallpaper? Illegible text or could-be-any-reel ambience =
  FAIL.

**Honesty rule:** this gate exists to find problems, not to rubber-stamp. A
8/8 PASS on the first look is suspicious — before accepting it, re-judge R2 on
the *widest* figure crop and R3 on the *longest* scene, and defend those two
verdicts explicitly.

## 3. The revision loop — smallest fix, re-screen, re-judge

Any FAIL → apply the SMALLEST fix that addresses it:

| Failed | Smallest fix |
|--------|--------------|
| R2 | tighter `figureFocus` crop on the payoff region |
| R3 | split or trim the scene, or add a focus step mid-scene |
| R1 / R4 / R5 | re-order scenes or restyle the offending card |
| R6 | reposition the element out of the chrome bands |
| R7 | re-mux audio (trim dead air, fix outro tail) |
| R8 | swap the background one ladder rung up (content skill), or re-crop it; if legibility is the issue, the scrim in SceneBackground.tsx is the knob |

Apply the fix via reel.json / component edit → re-render → re-run
`pipeline/screen.py` → **re-judge ONLY the items that failed** (cite the new
stills). Passing items keep their verdicts.

**Max 2 revision rounds.** Still failing after round 2 → record the gate as
failed with the open items and STOP for the user:

```bash
python3 pipeline/state.py record output/<story> screening fail "R2 open: <reason> (round 2)"
```

**Never ship around this gate** — do not soften a verdict to green-light a
reel, and do not proceed to editor with a red screening gate.

## 4. Record the gate

When every item passes (initially or after revision):

```bash
python3 pipeline/state.py record output/<story> screening pass "R1-R8 PASS; <n> stills; round <k>"
```

The detail must summarize per-item verdicts (e.g. `R1-R8 PASS after R2 fix
round 1`). `scripts/handoff.sh` requires this stage — a reel without a
recorded screening judgment is not done.

## 5. Scope: stills only — motion is the human's call

Every judgment here happens on STILL FRAMES. Motion-feel — transition rhythm,
caption sync feel, whether a camera move lands — is explicitly OUT of scope
and remains the user's final review. Do not fake confidence about motion you
cannot see; if a rubric item can only be settled by watching playback, say so
and leave it to the user rather than guessing PASS.

## 6. Rejections make the gate stricter — the feedback rule

When the user rejects a shipped reel for a visual reason:

1. **Append the reason to the rubric** in this file as a new numbered item
   (R9, R10, …) phrased as a testable check with its own smallest-fix row.
2. **Add the offending still to `exemplars/exemplars.md`** as an anti-pattern
   (copy the frame into `exemplars/`, 2–3 lines on why it failed).

A rejection that doesn't change this file is a rejection we'll repeat.
