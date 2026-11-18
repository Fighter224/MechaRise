# Chapter 0 assets

All new raster assets in this directory were made with the built-in image generation tool. Existing Valhalla, pilot and Ark artwork is reused elsewhere in the project.

- `arrival-corridor.png`: abandoned orbital factory arrival corridor, broad playable floor, amber evacuation-record terminal, cyan entry and sealed far bulkhead.
- `maintenance-bay.png`: empty orange/white robot cradle, central control bank, right-side exit and floor maintenance hatch. Valhalla and the pilot are rendered as separate sprites.
- `mender.png`: original cream/amber pixel-style service robot with cyan eyes, worn paint, bent antenna, tool pouch and pincers. Transparent; one static sprite, with small procedural movement bob in gameplay.
- `pilot-interceptor.png`, `evacuation-transport.png`, `hostile-interceptor.png`: transparent ships extracted from `source/spacecraft-atlas.png`. Ships face right; enemies are rotated for combat. The atlas uses measured horizontal object bounds rather than exact thirds to avoid clipping the larger civilian transport.

## Final prompt set

Corridor: One 16:9 2.5D isometric anime RPG derelict orbital factory corridor, consistent elevated orthographic camera, open connected steel floor, broken cyan lower-left entry, upper-right bulkhead, upper-center amber data terminal, emergency strips, dangling cables and abandoned alcoves; blue-grey industrial palette, restrained amber/cyan, no characters, robots, labels or UI.

Maintenance bay: One 16:9 2.5D isometric abandoned robot workshop, broad readable lower floor, empty orange/white cradle at upper left, cyan control console at upper center, upper-right sealed reactor exit, small floor maintenance hatch at lower right, tools and cabinets only at perimeter, muted steel and amber lighting, no characters or robots or UI.

Mender: Original friendly tired chibi service robot as transparent 2D pixel art, cream and muted amber shell, small box head, cyan square eyes, bent antenna, repair pincers, sturdy feet and tool pouch, worn paint, elevated three-quarter RPG view, no weapons or background or text.

Spacecraft: Transparent three-object 2D anime pixel-style atlas, all ships seen from above and facing right: compact white/charcoal interceptor with cyan cockpit and amber accents; elongated slate/ivory passenger evacuation transport; sharp crimson/gunmetal hostile interceptor. Full isolated silhouettes, readable outlines, no environment, shadows, labels, logos or UI.

The space starfield, distant wreckage, projectile trails, system glow and warm rescue-bay lamp are code-rendered effects. Audio/voice assets are not part of this pack.
