# Chapter 0 — The Last Signal

## Play

Open `/chapter.html` or choose **BEGIN CHAPTER 0** in the Ark. Continue resumes the last encounter checkpoint. Restart replaces only the chapter checkpoint; it does not erase scrap, armor or squad settings. The original sandbox arena remains available at `/arena.html` without the chapter query.

The chapter is a playable browser prototype, not a compiled Unity build. Story scenes use written dialogue, gameplay, scene transitions and visual effects; there is no recorded voice acting.

## The five completed work items

1. **Dialogue and scene sequence:** `chapter-data.js` contains the complete script. `docs/CHAPTER_0_SCRIPT.md` mirrors it for editing. Dialogue suspends gameplay and uses Enter/E/Space or a Continue button.
2. **Ark awakening:** `chapter.html` + `chapter.js` implement arrival, guide light, core conversation, signal identification and gateway activation. The original pixel pilot is used, with click-to-walk and floor boundaries.
3. **Silent Hangar mission:** `/arena.html?chapter=0` loads `chapter-mission.js` over the existing arena combat. It contains the arrival corridor, maintenance bay and reactor hangar. The pilot explores on foot, reads the evacuation record, links with Valhalla, then fights three security groups teaching rifle, blades and evasion. Afterward, investigate the tapping, restore auxiliary power by holding E for three seconds, defend Mender during a ten-second transmitter disconnection and escort it through maintenance and corridor to extraction.
4. **Return and persistence:** return loads the Ark dialogue, anchors Mender in bay one and Valhalla in bay two, turns on a warm lamp, records permanent operator access, grants 150 scrap once and unlocks the second world signal. These changes appear in the default Ark lobby. Failed encounters restart from their checkpoint. Reloading during combat restarts that encounter rather than restoring individual bullets/enemy positions.
5. **Space-battle opening:** a playable defense encounter with generated player/transport/enemy spacecraft sprites, auto-aimed fire, evasion, enemy projectiles and player/transport health. Destroy six interceptors and keep both ships alive. The evacuation succeeds before an incoming strike cuts the Valhalla link and the scene fades to white.

## Updated story premise

Humanity has become able to manufacture robots almost everywhere, and technology is inseparable from war. The system originally entrusted those machines to humans; it now asks the pilot to retrieve them across worlds. Each confirmed return grants resources and permission to operate the retrieved robot. Valhalla receives temporary emergency authorization in the maintenance bay; returning to the Ark grants permanent access. Mender is recovered rather than left with its obsolete order.

## Checkpoints

`space → awakening → signal → corridor → link → reactor → mender → escort → return → complete`

The store key is `mecharise-chapter0-v1`. It is independent of `mecharise-save` and `mecharise-squad`. The legacy career record receives a `chapter0Reward` receipt so a retry, reload or replay cannot issue the 150-scrap reward again. On storage failure, current-page progress remains in memory and a warning is shown; persistence then cannot be guaranteed.

Flags include beacon seen, record read, frame linked, Mender found, power restored and corridor escort reached. The persistent chapter result records Mender retrieved, warm lamp on, Valhalla linked and access to Valhalla/Mender. Other robot models and additional story chapters are not implemented by this chapter.

## Controls

- WASD/arrows: move.
- U: auto-aim rifle; in space, hold to fire.
- Mouse hold: aim/fire while piloting Valhalla.
- J: slash combo. I: charged shot. O: barrage.
- Shift/K: evade in the hangar; Shift in space.
- E: interact; hold at the auxiliary console to restore power.
- Enter/E/Space: advance dialogue.
- Escape: pause outside dialogue.

Touch movement/action buttons appear on coarse-pointer devices. Scenes remain landscape compositions.

## Validation

Run `node tools/check-chapter0.cjs`. It tests the space defense, Ark navigation, each mission stage, actual timed rifle/slash damage through the security waves, hatch repair, Mender defense/following/extraction, return/completion, warm lamp/access flags, death retry, reload persistence, single reward issuance and a failing storage backend. The test uses an isolated in-memory DOM/storage harness and does not alter player saves. Browser checks additionally cover the actual opening, dialogue advancement, Ark interactions, scene navigation, asset loading and runtime errors.

## Isolated browser playtesting

Append `?playtest=1` to `chapter.html`, or use `arena.html?chapter=0&playtest=1` for focused mission testing. This uses separate chapter and career storage keys, and propagates the mode through mission, return and Ark links. It cannot credit scrap or completion to the normal player save. Browser playtesting completed the corridor, Valhalla link, all security encounters, power restoration, Mender defense, two-room escort, extraction, return, chapter completion and persisted resident bay after reload. Space/Ark opening was also played through separately. Extraction now opens the return scene directly via `chapter.html?arrival=1`.
