# Modular Iron Dawn base

This replaces the flattened lobby background with individually placed sprites, tile terrain, depth sorting, collision footprints and separate runtime lighting.

## Files

- `buildings/`: six independent transparent buildings: hangar, command, medical, supply, lounge, deployment platform.
- `props/`: twelve independent transparent sprites: two trees, amber streetlamp, cyan bollard, crates, bench, planter, sector gate.
- `tiles/`: grass, cream path, flower meadow and water isometric diamonds.
- `pilot/`: sixteen individually exported pixel-art pilot frames. Four walk frames for each of down, left, right and up. Frame 01 doubles as idle; there is no separately generated pilot breathing sequence.
- `source/`: original generated atlases, preserved without edits.
- `asset-manifest.json`: pixel dimensions, source rectangles, trim bounds and pivots for all 38 individual PNGs.
- `scene-manifest.json`: all placed buildings, gates, props and individual light emitters in isometric world pixels.
- `base-map.json`: tile grid, six building placements and footprints, two sector gates, spawn and lighting presets.

## Game behavior

30 × 26 isometric tile map, wider than the viewport. WASD or arrows move the pilot; click a walkable tile to pathfind; drag to pan; wheel or +/- controls zoom; C or center-camera button restores follow. E interacts with the nearest building or gate. Touch movement buttons appear on coarse-pointer devices. Buildings, trees, benches and crates block movement. Procedural cliff side faces and independently animated waterfall effects give the terrain depth. Objects sort by their ground contact Y position, so the pilot can walk behind objects. Time-of-day choice is saved separately in local storage.

Sun, evening and night share the same sprite assets. Ambient color transitions and independent light emitters are drawn at runtime. Streetlamp bulbs, window glows, cyan holograms and gates brighten after sunset; they are not three flattened background images. The glass/windows already include subtle illumination in the daytime source art, and additional nighttime light is a separate runtime effect. Building fixtures are part of their building PNG; detached streetlamps and scene lights are independent objects.

## Unity preparation

Copy this directory to `Assets/MechaRise/Lobby/modular/` and `unity/Editor/MechaRiseLobbyImporter.cs` to `Assets/Editor/`. The optional importer configures alpha, single sprites, no mipmaps, uncompressed textures, point sampling for the pilot and bilinear sampling for scenery. It does not create a Unity scene. Unity was not installed or used to compile this helper in this workspace.

Use `unityPivot` from the manifest (normalized bottom-left coordinates). The web `pivot` field uses top-left coordinates. Pilot source cells deliberately preserve padding so walking frames do not change size. Set isometric sorting by ground position, map building footprints into colliders, and create 2D lights from the map's lighting settings and window positions. The web renderer uses 96 × 48 pixel ground tiles and draws the pilot at 90 pixels per padded frame; preserve these relative scales rather than importing every original PNG at its raw pixel scale.

Re-export sprites with `python tools/export_lobby_assets.py` from the project root. Requires ImageMagick (`magick` and `identify`); Python uses only the standard library. Extraction crops equal atlas cells, then removes low-opacity empty margins from scenery based on strong alpha bounds without changing the image content inside those bounds. Originals remain intact.

## Generation prompts

All four atlases were made with the built-in image generation tool. The pilot used the user's supplied reference image; others are original scenery.

Buildings: transparent 2-column × 3-row atlas of six isolated isometric miniature sci-fi resistance village buildings, each complete within its cell: white/orange mech hangar, red/gold command HQ with cyan hologram, blue-roof clinic, amber-awning supply shop, red-roof crew cottage, cyan deployment gate. Consistent charming detailed 2.5D hand-painted RPG art, visible doors, foundations, windows and lamp fixtures, no shared terrain, text or labels.

Props: transparent 4-column × 2-row atlas of independent isometric green tree, cherry tree, amber metal streetlamp, cyan bollard, olive supply crates, flower garden bench, stone flower planter, and crystal-topped sector gate arch. Consistent neutral daytime lighting, no shared ground or labels.

Terrain: transparent 2 × 2 tile atlas: grass, pale sandstone path, flower meadow and turquoise water. Consistent 2:1 isometric diamond top faces, thin edge depth, no structures or clutter.

Pilot: transparent 4 × 4 directional walk sheet, four frames each down, left, right, up. Reference identity: long silver-white hair, amber eyes, black hood with mustard lining, dark cropped tactical jacket, black top and trousers, utility belt, boots, gold accents and cheek cybernetic patch. Chibi 2D pixel art with crisp clusters and restrained palette, consistent scale and full-body padding, no weapons, scenery, text or borders.

## Village composition revision

The land now follows an irregular outline with a river on its eastern side. The slab border, surrounding water ring and evenly spaced tree ring are removed. Buildings cluster around a central plaza with a maintenance yard, crew pond garden, raised planted terraces, and a riverside deployment district. Paths connect these places with short routes rather than broad orthogonal highways. Four new individual scenery sprites preserve modularity: `cliff-bank`, `waterfall`, `garden-pond`, `garden-terrace`.

Landscape atlas prompt (built-in image generation): Four independent transparent isometric landscape props in a 2×2 grid: irregular grass-topped weathered rocky cliff bank with flowers and moss; natural turquoise waterfall and rocky pool with ferns; lily pond garden with reeds, round stones and a small cream footbridge; curved low stone retaining terrace with short stairs, grass, bushes and flowers. Detailed charming 2.5D anime RPG art, no buildings, labels or shared terrain. Runtime river highlights remain a separate animated effect.

## Building camera correction

The active building exports now come from `source/buildings-isometric-v2.png`; the original source is preserved. Built-in image generation used the old buildings as design references and requested a consistent 2:1 dimetric game view: visible roofs and two facades, vertical uprights, diagonal foundation edges, orthographic camera and southeast-facing entrances. These remain illustrated sprites with small artistic deviations rather than exact 3D projections. Measured atlas row boundaries avoid clipped foundations and neighboring-cell fragments.

Prompt: Preserve all six building designs and colors, redraw their camera geometry to match a 2:1 isometric ground grid. Ground axes approximately ±26.565°, vertical edges upright, no perspective convergence, two visible facades and roof planes, diamond foundation footprints, entrances and stairs consistently directed toward the lower-right ground axis. Same 2-column × 3-row transparent atlas and neutral daylight, full sprites with margins, no shared terrain, text or borders.

Run `node tools/export_lobby_scene.cjs` to verify entrance/gate reachability and regenerate scene and map manifests after scene changes.
