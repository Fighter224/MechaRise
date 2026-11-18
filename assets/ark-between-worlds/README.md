# Ark Between Worlds — prologue scenery asset pack

Created with the built-in image generation tool. This is the empty sanctuary before the pilot starts rescuing robots. The default full-screen lobby is now assembled from separate assets through `ark-scene.js` (`index.html`, `ark-lobby.js`). The previous modular village remains at `village.html`.

## Contents

- `ark-prologue-background.png`: complete prerendered 2.5D sanctuary scenery, with reflective ivory floor, white mist, arrival platform, dormant core, broken gate, three empty rescue bays and distant architectural fragments.
- `sprites/arrival-platform.png`
- `sprites/system-core.png`
- `sprites/broken-gateway.png`
- `sprites/rescue-bay.png`
- `sprites/system-beacon.png`
- `sprites/floating-fragments.png`
- `source/ark-structures-atlas.png`: unmodified generated 3-column × 2-row source sheet.
- `manifest.json`: actual image dimensions, source and trim rectangles, alpha flags, and suggested bottom-left normalized Unity pivots.

The six props are genuinely transparent. The full background is intentionally opaque. Sprite exports are matching modular interpretations of the scenery, not pixel-identical cutouts. The live scene now adds three independently exported floor connections from `floors/`. Mist, the void gradient and light effects are rendered separately at runtime. The reference background is no longer loaded by the lobby or Chapter 0.

## Unity use

Import PNGs as Sprite (2D and UI), Sprite Mode Single, Alpha Is Transparency enabled for props, mipmaps disabled, uncompressed textures, bilinear filtering. Use suggested pivots from the manifest, then adjust colliders to gameplay footprints. Keep the beacon and ambient fog on separate visual-effect layers if animating them. The background is a fixed-view illustration; do not rotate a 3D camera around it. Assets have not been tested in the Unity Editor.

## Final prompt set

### Scenery

One wide 16:9 MechaRise prologue sanctuary, Ark Between Worlds. Fixed elevated orthographic isometric 2.5D anime RPG camera. Endless pearl-white void, pale mist, no sky, landscape horizon or enclosing walls. Broad low circular arrival platform in lower center, reflective connected ivory floor leading toward a dormant cyan crystal system core in an incomplete white ring at upper center. Broken multiverse gateway at left middle, three empty rescue bays at right middle, a barely visible distant incomplete doorway, floating architectural fragments at the edges, and one small system guide light. Sparse intentional architecture, generous walkable negative space, pearl-grey shadow planes, pale blue reflections, warm ivory highlights, restrained cyan lighting. Empty initial sanctuary; no characters, robots, vegetation, furniture, UI, text, labels or watermark.

### Modular structures

Use the generated scenery as the architecture, materials, palette and camera reference. Six isolated transparent props in an exact 3×2 atlas: arrival platform, dormant crystal system core, broken multiverse gateway, one empty rescue docking bay, faceted system-guide light, cluster of floating ivory architectural fragments. Complete objects with clear margins, coherent elevated orthographic 2.5D camera, pearl-grey shadow faces and pale cyan seams. No shared terrain, atmospheric fog behind props, rectangular fill, characters, labels or borders. True transparent alpha. Individual export uses mechanical cropping only; original atlas is preserved.

## Applied lobby

WASD/arrows and click-to-walk move the existing pixel pilot across sanctuary floor regions. The system core opens narrative guidance and the robot archive; the multiverse gate links to the six existing combat destinations. Three empty rescue bays show standby panels. Chapter 0 now implements Mender retrieval, Valhalla control authorization, the first warm lamp and saved resident bays. Enter through `chapter.html`. Drag to pan, scroll or +/- to zoom, C to reset view, E to interact. Walking bounds, elevations, stair corridors and site coordinates are defined in `ark-scene.js`. The shared renderer uses separate structure sprites, floor PNGs, residents and runtime effects; the old full-scene image remains only as a reference asset. Run `node tools/check-ark-lobby.cjs` for navigation/interaction checks.

## Active modular scene

`ark-scene.js` is shared by the normal lobby and the Chapter 0 awakening/return scenes. `scene-layout.json` exports every floor placement, structure placement, station position, walkable footprint, and resident scale. There is no full-scene background texture loaded by this renderer. The palette and mist are code-rendered effects; all physical structures and floor connections are separate PNG assets.

The arrival platform uses the sharper `sprites/arrival-platform-hd.png`. The original smaller export is retained. The HD version was regenerated with built-in image generation using the original platform as reference: preserve the low circular ivory platform, concentric rings, cyan seams, original elevated camera, front-center staircase and side pylons, but provide crisp floor detail at around 1000 display pixels wide. No redesign, characters, surroundings, fog, labels or background; true transparency.

Floor assets: `core-walkway`, `gate-walkway`, `rescue-walkway` are authored as code-native SVG geometry and exported to transparent PNGs for Unity. Their vector sources are included. Regenerate them with `python tools/build-ark-floor-assets.py` (requires ImageMagick).

Retrieved robot sizes: Mender uses a 135-pixel-high sprite (previously 75); Valhalla uses a 250×250 atlas cell display (previously 110×110). Anchors sit on each bay's floor and render after the bay asset. Valhalla's six-frame standing animation is retained. The pixel pilot remains 88×88 for scale. The three bays form a staggered group so the larger robots do not overlap each other.

## Traversable stairs and detail pass

Six stair routes connect the arrival landing, core, gateway and rescue decks. `stairs` exports projected top/bottom coordinates, corridor width and base/top heights; `decks` exports elevated footprints. `canTraverse` samples movement segments, blocks discontinuous elevations and the arrival rim, and is used by both keyboard movement and click pathfinding in the lobby and Chapter 0. The projected coordinates already include elevation visually, so do not subtract height from sprite feet again. This is a fixed-camera 2.5D navigation model.

The lobby camera now frames the entire front staircase. Ten separate lantern fixtures, floor medallions, cyan circuit pulses, floating motes and soft light pools enrich the white sanctuary. Stair and lantern SVG/PNG exports live under `details/`; regenerate with `python tools/build-ark-detail-assets.py`. Stair railings are part of the stair asset. The arrival and gateway retain their illustrated steps. Rescue/core stair flights overlay their platform fascia. Fixtures and stair metadata are included in `scene-layout.json` for later Unity setup; Unity colliders still need implementation in the Unity project.

## 41-item polish pass

See `docs/ark-lobby-polish.md` in the project for the full item-by-item change record. Bay 03 now has a separate lower-right branch. The nine `details/` assets include shaped stairs, landing, repair bench, maintenance console, docking cradle, brackets, gateway rubble, lanterns and deck thresholds. Runtime layers add bay pillar occlusion, railings, damage, surface lighting, active/dormant states and crystal animation. Front haze no longer washes over the pilot.

The three walkway PNGs are generated from `scene-layout.json`, including foundation faces, shared seams and perimeter trim. Export layout with `node tools/export-ark-layout.cjs` before regenerating floor assets. Audio clips in `audio/` are original generated PCM WAV files; `ark-audio.js` loads them only when sound is enabled.

Navigation uses `ArkScene.findPath`, with exact endpoint attachment and sampled collision, shared by lobby and Chapter 0. Props, pillars and fences block their footprints. JSON coordinates are projected screen-space coordinates and heights; they are a reference for Unity authoring, not an automatically working Unity scene.
