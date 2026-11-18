# Ark lobby: 41-item prototype pass

This pass improves the existing fixed-camera browser prototype. It does not migrate the game to Unity or create freely rotatable 3D geometry. Subjective art items below describe concrete improvements, rather than claiming final production artwork.

## Structure and perspective

| # | Item | Applied change |
|---|---|---|
| 1 | Match stairs to buildings | Replaced flat ladder-like flights with tapered ivory treads, warm bevels, shaded risers and metal trim. |
| 2 | Give stairs thickness | Separate tread tops, riser faces, side cheeks, rail trim and lower landing lip. |
| 3 | Align stair entrances | Flights use the same top/bottom coordinates as the six traversable stair corridors; tops meet deck fascia. |
| 4 | Fix nearest bay connection | Moved bay 03 to its own lower-right branch, away from the arrival deck. |
| 5 | Construct floor connections | Walkways now have 28-pixel foundation faces, perimeter trim and independent support brackets. |
| 6 | Unify perspective | Floors use a common 2:1 seam pattern; detail assets use the same elevated frontal view. Existing illustrated structures remain fixed-view sprites. |
| 7 | Align walking boundaries | Shared footprints, reserved pillar/equipment footprints, rail collision and sampled movement segments; exact click endpoints cannot round across walls. |

## Placement and navigation

| # | Item | Applied change |
|---|---|---|
| 8 | Breathing room | Spread Valhalla and bay 03 farther right; removed the lower bay/main deck overlap. |
| 9 | Readable main routes | Gold perimeter strips, directional entry thresholds, floor medallions and subdued circuit paths. |
| 10 | Front-stair destination | Added an independent arrival landing and markings beneath the front stairs. |
| 11 | Lamp placement | Lanterns placed beside routes and deck edges, with collision footprints. |
| 12 | Distinct entrances | Main-deck threshold plates and separate stair flights identify access points. |
| 13 | Foreground occlusion | Props and fences sort by floor depth; bay pillars use foreground regions from the existing texture. |
| 14 | Foot alignment | Stair foot shadows are tighter; reflections appear only on metal decks; small step lift follows movement. |

## Visual quality

| # | Item | Applied change |
|---|---|---|
| 15 | Contact shadows | Local shadows beneath structures, residents, props and lanterns. |
| 16 | Raised side faces | Stronger foundation shading and support brackets establish height. |
| 17 | Pilot contrast | Mist sits behind geometry; removed foreground white haze; pilot has a restrained silhouette shadow. |
| 18 | Contrast hierarchy | Cooler, darker void behind warm ivory structures; localized shadows instead of an overall white wash. |
| 19 | Asset sharpness | Supersampled SVG/PNG detail exports, high-quality architecture sampling and nearest-neighbor character sprites. |
| 20 | Cyan hierarchy | Restrained path lighting; stronger core, guide and active dock effects. |
| 21 | Surface illumination | Lantern, warm lamp and station lights affect nearby floor areas. |
| 22 | Floor seams | All connector assets are generated from runtime footprints with a shared tile scale and direction. |

## Environmental detail

| # | Item | Applied change |
|---|---|---|
| 23 | Railings and edge markers | Short gold-topped fences on exposed walkway edges; physical feet block movement. Stair entrances remain open. |
| 24 | Supports | Seven separately placed bracket assets below bridges. |
| 25 | Arrival markings | Arrival landing emblem and deck-entry chevrons. |
| 26 | Bay identity | Bay numbers, anchored/standby floor markings, compact numbered station markers and resident-specific accents. |
| 27 | Dock equipment | Separate maintenance consoles, docking ring/clamps, floor conduit traces and anchor lighting. |
| 28 | Mender repair station | Tool bench appears after Mender returns, beside its bay. |
| 29 | Valhalla cradle | Wider docking-cradle asset appears with Valhalla authorization. |
| 30 | Gateway damage | Rubble props, floor cracks and a gently suspended fragment near the broken arch. |
| 31 | Surface variation | Bevels, panel seams, gold trim, shaded risers and selective gateway wear. |
| 32 | Distant expansion | Additional faint architecture silhouettes and floating fragments beyond the starting sector. |

## Life and feedback

| # | Item | Applied change |
|---|---|---|
| 33 | Crystal motion | Animated core facets, rotating orbit segment, soft pulse and turning guide light. |
| 34 | Station states | Active gate field after a signal is anchored; dormant gateway and empty bays stay restrained; occupied bays light up. |
| 35 | Robot idle | Valhalla retains its six-frame idle; Mender has a small idle movement and status-light pulse. |
| 36 | Pilot idle | Subtle breathing, retained directional walk frames and stair step lift. |
| 37 | Footsteps | Original metal, stone and stair WAV cues, triggered by movement cadence. |
| 38 | Ambient audio | Original void air, core hum and dock machinery loops; proximity mixing, mute control and blur suspension. |
| 39 | Destination feedback | Dotted route preview, animated destination ring and click ripple. |
| 40 | Blocked routes | Brief red cross, visible no-route message and optional quiet rejection cue. |
| 41 | Station labels | Small markers; full names appear on approach, hover or keyboard focus instead of covering buildings. |

## Runtime and accessibility

- Music button enables sound explicitly. No audio fetches or playback before activation.
- Sound suspends when the page loses focus. Existing decoded clips are reused on mute/resume.
- Reduced-motion preference disables ambient animation, idle breathing and route-ring pulses; directional walking remains readable.
- Station buttons preserve accessible names and keyboard interaction. Feedback is exposed through the existing status element.
- Normal chapter saves are separate from `?playtest=1`; visual checks use the completed playtest save.
- The Ark scene is shared by the lobby and Chapter 0. Chapter 0 keeps its existing story coordinate mapping.

## Reusable exports

Nine detail assets ship as transparent PNG plus SVG source: stair flight, lantern, arrival landing, maintenance console, repair station, docking cradle, support bracket, gateway rubble and bridge threshold. Eight original PCM WAV clips are included. The manifest and scene layout record placements, sizes, stairs, decks, supports, fences, props and source files.

Regenerate layout and exports with:

```sh
node tools/export-ark-layout.cjs
python tools/build-ark-detail-assets.py
python tools/build-ark-floor-assets.py
python tools/build-ark-audio.py
```

For Unity, import the PNGs as sprites and WAVs as AudioClips. Convert the projected footprints and heights into Unity navigation/colliders; layer pivots and shader settings need an actual Unity scene. These exports have not been tested inside Unity. Source illustration layers remain fixed-view artwork, and can be replaced with real meshes during production.

## Verification

- `node tools/check-ark-lobby.cjs`: walks routes to every station and arrival landing at real movement ticks; checks all six stair ascents/descents, side-wall rejection, fixture collision, exact destination feedback, projection, modal freezing and battle links.
- `node tools/check-ark-scene.cjs`: checks independent asset loading, three bay instances, nine foreground pillar layers, separate detail assets, resident sizes and the pilot draw callback.
- `node tools/check-ark-audio.cjs`: checks opt-in loading, WAV validity, loops, cadence, mute/resume, blur suspension, buffer reuse and unsupported-browser fallback.
- `node tools/check-chapter0.cjs`: checks opening battle, Ark interactions, mission progression, combat, Mender rescue/escort, return sequence and saved rewards.
- Browser review: whole-scene composition, sound-button activation, blocked-floor feedback and click-to-walk staircase movement.
