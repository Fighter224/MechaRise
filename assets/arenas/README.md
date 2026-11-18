# Hangar 01 — one 2.5D battle arena

Asset: `hangar-01-2_5d.png`, generated with the built-in image generation tool.

Prompt: One landscape 16:9 MechaRise industrial hangar battle environment, fixed elevated orthographic three-quarter view, crisp hand-painted stylized anime RPG architecture. Large open connected steel combat floor with diamond-grid seams and restrained hazard inlays. Upper rear wall has sealed blast door, red warning lamps, raised service balcony, thick pipes, cables and cyan reactor tubes. Left edge maintenance equipment, crates and ruined service robots. Right edge recessed reactor pit behind railings. Foreground corner cutaway ledges frame the room. Steel blue and muted olive, amber lamps, controlled cyan glow, soft shadows and sunlight from upper left. Strong visual depth and clear playable boundaries, no characters, UI, text, watermarks or central obstacle clutter.

Playable page: `arena.html`. This first arena is connected to the lobby's first deployment destination. Other sectors retain their existing combat implementation.

The background is a prerendered 2.5D illustration, not a real-time 3D scene. The separate combat layer uses a floor polygon, depth-sorted sprites, projected ground shadows, perspective scale, aiming, ranged/melee attacks, enemy shot telegraphs, jump, dash, pause and retry. Environment view hides combat sprites and freezes simulation for scenery inspection. This encounter is a standalone prototype; rewards are not persisted to the existing campaign save.
