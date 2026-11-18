# Detailed Valhalla animation atlas

`mobility-combat-atlas.png` contains 24 new hand-drawn generated poses, 6 columns × 4 rows of 256 × 256 cells, with genuine PNG alpha. Built-in image generation was used with the original `assets/frames/portraits/valhalla_full.png` as the identity reference. Original animation assets are preserved.

Rows: walk, shoot, jump, fly. The atlas faces right; combat and Animation Lab mirror it horizontally for left-facing playback. Left is not a separately drawn asymmetric view. `manifest.json` describes frame indices and timings. No per-frame image slicing is needed: canvas uses source rectangles.

Prompt: Production transparent 6-column × 4-row atlas of the canonical tall slender white/lavender Valhalla mech with black mechanical joints, magenta accents, angular helmet fins and shoulders, pointed feet, and long forearm attachments. Preserve reference identity in every frame. Six distinct gait poses; six aim/fire/recoil poses with muzzle flash on the third frame; six crouch/takeoff/apex/fall/landing poses; six forward-leaning powered flight poses with varied magenta-blue thruster exhaust. Consistent camera and scale, entire bodies inside cells, no labels, UI, background, gold trim or replacement cyan sword.

Combat: A/D walk, Shift run (existing run frames), W/Space jump, U shoot, hold F powered flight, W/S altitude while flying. Flight has a net energy cost of 16 per second after passive regeneration. Energy exhaustion or overheat disables thrust until F is released and re-engaged. Preview: `/animations.html` provides action selection, both facings, adjustable playback speed and six-frame scrubbing.

## Sharp idle and combat expansion

`idle-combat-atlas.png` adds 24 new transparent 256 × 256 poses in a 6 × 4 grid. Rows: stable six-pose idle loop, six-pose slash combo, six-pose charged forearm rifle, six-pose evade boost. Generated with the built-in image tool and original Valhalla portrait as identity reference. The old 57 × 71 idle exports are preserved but no longer used by the arena or side-view idle state.

Prompt: Crisp hard-edged cel-shaded canonical Valhalla, consistent right-facing view and scale, white/lavender plates, black joints, magenta reactor accents, pointed helmet/shoulder fins and feet, original long forearm attachments. Six stable standing poses with subtle chest/shoulder movement and reactor pulse; six distinct windup, diagonal slash, reverse sweep and recovery poses; six aim, charge, muzzle flash, recoil and settle poses; six crouch, boost, slide, balance and recovery poses. Genuine transparency, full bodies contained in equal cells, no blurry edges, gold trim, substitute handheld swords, labels or UI.

Arena controls: J slash (two timed hits), I charged piercing shot, O three-shot barrage, Shift/K evade. Actions finish before another attack can replace them. Barrage reuses the charged weapon poses; it is not an additional unique frame set. Side-view combat uses the same new idle, melee, charged, barrage and dodge atlas rows. All eight preview actions are selectable in Animation Lab. Preview enlargement is capped and nearest-neighbor sampling prevents smoothing; these remain raster assets with finite detail, not infinitely scalable vector art.
