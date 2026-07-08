# FireSat — script development

## V1 (shipped earlier — announcement-led)

> HOOK: "Google just put a smoke detector in orbit."
> → 3 sats launched → 5×5m stat → AI checks 1,000 images → 20 min / 50 sats → follow.

### Critique of V1
1. **No villain.** It never says why this matters — what's broken about fire
   detection today. Facts without a problem aren't a story.
2. **Hook is a quip, not a stake.** "Smoke detector in orbit" is cute but
   nothing is at risk; a problem-first hook stops the scroll harder.
3. **No proof moment.** The constellation is a promise; the prototype already
   *caught a real fire that other satellites missed* — that's the receipt,
   and V1 never mentions it.
4. **Stats are listed, not felt.** 5×5 m lands only when contrasted with the
   soccer-field blindness of current satellites.
5. **Zero emotional imagery.** Two hardware photos; nothing that looks like
   the thing everyone actually fears — a fire starting in the dark.
6. **Outro is generic.** "Follow for daily AI news" with no callback.

## V2 (this version — problem → turn → proof → scale)

| # | Beat | Scene | Visual choice (deliberate) |
|---|------|-------|---------------------------|
| 1 | PROBLEM | HookCard | "Satellites can't see a wildfire smaller than *a soccer field*" — verified limitation of today's systems |
| 2 | TURN | ImageScene | Muon cleanroom photo — the three real machines that just went up |
| 3 | HOW SMALL | StatCallout | 5×5m, label "a classroom-sized fire, from ~600 km up" (altitude from the SpaceX stream telemetry) |
| 4 | PROOF | ImageScene | **Generated**: single ember glowing in a vast dark forest, aerial — the emotional frame; the Oregon catch narrated over it |
| 5 | SCALE | ImageScene | SpaceX deployment-over-Earth photo — planet in frame while narrating planet-scale numbers |
| 6 | OUTRO | OutroCard | Callback: "catch it while it's small" |

### V2 voiceover (~100 words ≈ 37s)
1. "Most satellites can't see a wildfire until it's bigger than a soccer field."
2. "This week, three FireSat satellites reached orbit — built by Muon Space,
   guided by Google AI, made to catch fires early."
3. "The new sensors spot a fire just five by five meters. A classroom,
   seen from six hundred kilometers up — through smoke and clouds."
4. "The prototype already caught a small Oregon fire that other satellites flew
   right past. Google's AI confirms each ignition against a thousand past
   images of the same spot."
5. "The goal: fifty-plus satellites checking every point on Earth every twenty
   minutes. Even hourly checks could save over a billion dollars in fire
   damage a year in the US alone."
6. "The next big fire might get caught while it's still small. Follow for daily AI news."

### Cross-check vs research.md
- soccer-field limitation → Google Research wildfires page ✓
- Oregon fire missed by others → blog.google first-firesat-images / EFA press release ✓
- 5×5 m, smoke/clouds → blog.google launch post ✓
- ~600 km → SpaceX stream telemetry (598 km) in provided asset ✓
- 1,000 prior images + weather → sites.research.google ✓
- 50+ sats / 20 min / early 2030s → earthfirealliance.org ✓
- "$1B+/yr at even 1-hour revisit, US" → EFA-commissioned research ✓
- "classroom" ≈ 5×5 m — editorial comparison, size-accurate ✓
