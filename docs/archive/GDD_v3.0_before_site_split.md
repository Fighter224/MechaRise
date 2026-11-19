> **ARCHIVED, not canonical.** Snapshot of GDD v3.0 taken 2026-11-20, before story, characters and regions moved to the website (`site/`). Do not edit.

# ECLIPSE OF THE IRON GODS
## Master Game Design Document — Season 1 Production Plan

| Field | Value |
|---|---|
| Version | 3.0 (expands v2.0) |
| Status | Pre-production → Milestone 1 |
| Engine | Unity 6 LTS, URP, C# |
| Visual style | Stylized low-poly 3D |
| Scope of this document | Season 1 ("The First Light"): story, world, environments, Phantom-first mecha design, systems, vertical slice, production plan |
| Authoritative | Yes. This file replaces v2.0 as the single GDD. Older docs in `docs/` describe the web prototype and are **not** canon unless moved into this file. |

---

## 0. WHAT CHANGED FROM v2.0

1. **Phantom is the first and primary mecha.** v2.0 listed Vanguard as the vertical-slice mecha. Phantom now takes that role. The first mecha experience is built around speed, gliding and flight that is earned through restoration.
2. **Character and robot art comes from the project owner.** This document does not set final appearances. It sets **functional requirements**: silhouette goals, part breakdown, rig and animation lists, scale and naming. Any asset that meets the intake spec (Section 3) can be dropped in.
3. **Season structure.** The six main chapters in v2.0 are the whole saga. Season 1 covers the first part of that arc in **one prologue, eight chapters and one epilogue**. Later seasons are outlined only.
4. **Vanguard moves to the Season 1 finale** as a corrupted, force-awakened machine. Titan and Guardian are recovered during Season 1.
5. Concrete numbers have been added (movement, stamina/energy, ability timings, budgets). They are **starting values for tuning**, not final balance.

---

## 1. VISION RECAP

**One line:** An apprentice mechanic wakes a forgotten sky-machine and, one restored part at a time, learns to fly again with it.

**Core fantasy:** Explorer, mechanic and pilot who rebuilds a lost technological civilisation one machine at a time.

**The Season 1 promise to the player:**
> "You found a broken machine that once owned the sky. By the end of the season, you will have rebuilt its wings, learned its memories and flown it into the heart of the mystery that silenced it."

### 1.1 Pillars and how Phantom expresses them

| Pillar | Season 1 expression |
|---|---|
| Discovery | Phantom's memory fragments point to new facilities. Its Resonance Scan reveals hidden machinery. |
| Recovery | Every recoverable mecha has its own kind of recovery mission (components, trust, rescue, liberation). |
| Restoration | Each Phantom restoration step gives a **new way to move**, so restoration makes traversal better as well as adding stats. |
| Piloting | Fast, readable third-person mecha control: ground sprint, dash, glide, hover, then full flight. |
| Connection | The Sync Level rises through shared experiences. Phantom changes from a wary, glitchy voice into a friend with a personality. |

### 1.2 Tone

- Studio-animation adventure: bright skies, warm villages, mysterious but not grim ruins.
- Humour comes from AURA's dry literalism, Phantom's childlike curiosity and village life.
- Emotional peaks are earned and quiet: a machine remembering its last pilot, or a village seeing the sky-machine fly.
- No gore. Defeated machines **power down** (sparks, eye-lights fading). Defeated humans **retreat or surrender**.

### 1.3 Reference pillars (feel, not look)

- Traversal joy: gliding and dashing over open terrain (expectation: the player wants to move even with no objective).
- Workshop intimacy: a garage space where the restored machine sits and reacts to you.
- Ruins with a story: environmental storytelling through rooms, logs and left-behind objects.

These describe **feel targets only**. No external game's names, characters, levels or art are to be copied.

---

## 2. SEASON 1 AT A GLANCE

| # | Chapter | Region | Mecha beat | Player gains | Target play time |
|---|---|---|---|---|---|
| P | Prologue: The Falling Light | Greenhaven | Light-pillar rises from Whisperfall Hill | On-foot controls, interaction | 10–15 min |
| 1 | The First Awakening | Greenhaven → Lumen-7 Hangar | **Phantom** located, restored, awakened | Phantom: run, jump-thrust, glide, Phantom Dash, wrist blades, Pulse Shot | 60–90 min (**Vertical Slice**) |
| 2 | Wings Over Greenhaven | Greenhaven, Bram's Forge, Saltmeadow | Workshop opens. Wing Vanes restored | Hover, air-dash, equipment slots | 60 min |
| 3 | The Thorn Sanctuary | Verdant Reach | **Guardian** recovered through trust | Mecha switching, shield traversal | 90 min |
| 4 | The Glass City | Novaris | First Light Cell for Phantom | Phase Shift (pass through energy barriers) | 90 min |
| 5 | Rust and Thunder | The Rustlands (edge) | **Titan** rescued from a flooded foundry | Heavy lifting, Titan puzzles | 90 min |
| 6 | Echoes of the Machine Age | Lumen-7 depths + Skyward Archive | AURA's memory restored. Phantom Sync 3 | Resonance Scan, lore revelation | 60 min |
| 7 | The Bound Colossus | Greenhaven under siege | **Vanguard** force-awakened by the Covenant | Defence mission, all three mechas | 75 min |
| 8 | Eclipse over Whisperfall | Whisperfall Spire, sky | Phantom Full Synchronisation | **True flight (Skyward Mode)**, season finale | 75 min |
| E | Epilogue: The Quiet After | Greenhaven | Vanguard sleeps in the workshop | Season 2 hook: the Old Capital | 10 min |

**Total Season 1 critical path:** ~10–12 hours. With side content: 15–18 hours.

**Production rule (from v2.0 §11):** Only Prologue + Chapter 1 are built until the vertical slice is validated. Chapters 2–8 stay on paper and in greybox.

---

## 3. ASSET OWNERSHIP AND INTAKE SPECIFICATION

The project owner provides **all character models and robot (mecha) models**. Development builds against **greybox stand-ins** that match the specs below, so code never waits on art. When final art arrives, it replaces the stand-in prefab's visual child only.

### 3.1 Who provides what

| Asset class | Provided by | Notes |
|---|---|---|
| Player character (Kael) | Owner | Humanoid rig |
| AURA companion | Owner | Floating or legged, see 3.4 |
| Named NPCs (Bram, Lira, Veyra, Hadda, etc.) | Owner | Humanoid rig, can share one base mesh |
| Mechas (Phantom, Guardian, Titan, Vanguard, + future) | Owner | Modular, see 3.3 |
| Enemy machines | Owner, or dev greybox until provided | Same mecha spec, smaller |
| Environment kits (Greenhaven, Lumen-7, etc.) | Dev team (blockout) → owner or store kit for final art | Section 9 lists required pieces |
| VFX, UI, audio | Dev team | |

### 3.2 Global technical spec

| Item | Spec |
|---|---|
| Units | 1 Unity unit = 1 metre. Y-up. Model faces +Z. |
| Human scale | Kael **1.79 m** (owner sheet). Adult NPCs 1.6–1.9 m. |
| Mecha scale | Phantom **7.5 m** standing. Guardian 9 m. Titan 12 m. Vanguard 10 m. |
| Format | FBX (binary), embedded or separate textures, no cameras/lights. |
| Pivot | At feet, centred between them. |
| Materials | URP Lit or Simple Lit. Stylized look uses **one palette texture (atlas) per character/mecha** with flat colour blocks plus one emissive mask. Avoid unique high-res painted textures. |
| Texture size | Characters 1024². Mechas 2048² (palette + emissive). |
| Poly budget (LOD0) | Kael 10–15k tris (straps and hair need more). NPC 5–8k. Phantom 20–30k. Other mechas 20–35k. Small enemy 3–6k. |
| LODs | Mechas: LOD0, LOD1 (50%), LOD2 (20%). Characters: LOD0, LOD1. |
| Naming | `CHR_Kael`, `CHR_AURA`, `NPC_Bram`, `MCH_Phantom`, `MCH_Phantom_Arm_L_T1`, `ENM_Rustmite`, `ENV_GH_House_A`. |
| Folder | `Assets/_Project/Art/Characters/<Name>/`, `Assets/_Project/Art/Mechas/<Name>/`, `Assets/_Project/Art/Enemies/<Name>/` |

### 3.3 Mecha modular breakdown (required for every recoverable mecha)

Equipment must make a **visible** change (v2.0 §5), so each mecha is split into swappable meshes that share one skeleton:

| Slot | Mesh part(s) | Bone it skins to | Damage-state variants required |
|---|---|---|---|
| Head | Head shell, visor/eyes (emissive) | `Head` | Intact, Damaged |
| Torso | Chest, core window (emissive) | `Spine2` | Intact, Damaged, Core-exposed |
| Arms | Upper arm, forearm, hand/weapon L+R | arm chain | Intact, Damaged, **Missing** |
| Legs | Thigh, shin, foot L+R | leg chain | Intact, Damaged |
| Back | Thrusters / wings / packs | `Spine2` + `Back_*` bones | Intact, Damaged, **Missing** |
| Special module | Shoulder or hip mount | `Shoulder_*` / `Hip_*` sockets | Optional |

**Why damage variants matter:** the restoration loop shows the player a visibly broken machine that becomes whole. Missing parts are real missing meshes, not a texture swap.

Each upgrade tier (`T1`, `T2`, `T3`) of a slot part is a separate mesh on the same bones.

### 3.4 Rig and animation lists

**Mecha skeleton (generic, shared):** Root, Hips, Spine, Spine1, Spine2, Neck, Head, Clavicle/UpperArm/LowerArm/Hand L+R (3 finger bones optional), Thigh/Calf/Foot/Toe L+R, plus sockets: `Socket_Cockpit`, `Socket_Back`, `Socket_Weapon_L/R`, `Socket_Shoulder_L/R`, `Socket_Thruster_*`, `Socket_EyeFX`.

Mecha rigs do **not** need to be Humanoid-avatar compatible. Use Generic rigs.

**Phantom animation list (vertical slice items marked ★):**

| Group | Clips |
|---|---|
| Dormant / restoration ★ | `Dormant_Kneel` (slumped pose), `Awaken_Rise` (6–8 s cinematic), `Workshop_Idle`, `Workshop_LookAt` (additive head) |
| Locomotion ★ | `Idle`, `Walk`, `Run`, `Sprint`, `Turn180`, `Start/Stop` (optional) |
| Air ★ | `JumpThrust_Start`, `Air_Rise`, `Air_Fall`, `Glide_Loop` (arms back, wings open), `Land_Soft`, `Land_Hard` |
| Dash ★ | `Dash_Fwd`, `Dash_L`, `Dash_R`, `Dash_Back` |
| Combat ★ | `Blade_Combo_1/2/3`, `Blade_Air_Slash`, `PulseShot_Fire` (upper-body additive), `Hit_Light`, `Hit_Heavy`, `Stagger`, `PowerDown` |
| Later chapters | `Hover_Loop`, `AirDash_*`, `PhaseShift`, `Flight_Loop`, `Flight_Bank_L/R`, `Flight_Boost`, `ResonanceScan` |
| Boarding ★ | `Kneel_Board` (mecha lowers, opens chest or back hatch), `Stand_Board` |

**Kael animation list (Humanoid rig, Mixamo-compatible is acceptable):** Idle, Walk, Jog, Sprint, Jump (start/loop/land), Crouch walk, Climb ledge, Roll, Interact (stand/kneel/low), Pick up, Carry (small object), Push/pull, **Katana draw / sheathe**, **Katana combo ×3 + finisher**, **Iron Hand grab / pull**, **Iron Hand overclock strike**, Hit, Knockdown, Get up, Board mecha, Exit mecha, Talk gestures ×3, Repair loop (Iron Hand at a panel), Scan (raise Iron Hand, palm out), Hood up / down (optional).

**AURA:** Hover idle, Move, Point/highlight, Scan beam, Talk bob, Alarm, Stun Pulse, "Sleep" (dim). If AURA is legged, add walk/run. **AURA must be readable at 15 m**: one strong emissive colour.

### 3.5 Asset intake checklist (per delivered asset)

1. Scale check against `Kael_Scale_Reference` prefab (1.79 m capsule) and `Mecha_Scale_Reference` (7.5 m).
2. Bones match required names and sockets exist.
3. Slot meshes are separate objects with correct naming.
4. Damage variants are present for vertical-slice mechas.
5. Palette + emissive textures assigned, URP material created.
6. Imports clean with no missing references. Prefab variant created over the greybox prefab.
7. Animations play on the controller with no foot sliding (> 5 cm) on locomotion loops.
8. Screenshot in the **Look-Dev scene** (day, dusk, facility lighting) attached to the commit.

### 3.6 Greybox stand-ins (dev team builds these first)

| Stand-in | Shape |
|---|---|
| Kael | Capsule 1.79 m + nose block for facing, red cube on the right forearm (Iron Hand) |
| AURA | 0.4 m sphere with emissive ring |
| Phantom | 7.5 m capsule torso, box limbs, two flat "wing" planes on the back, slot parts as separate cubes so restoration shows parts appearing |
| Enemies | Coloured primitives at spec scale |

---

## 4. PHANTOM: DESIGN BRIEF AND GAMEPLAY KIT

### 4.1 Identity

| Field | Value |
|---|---|
| Designation | **SK-03 "Phantom"**, Skyward Corps scout frame |
| Role | High-speed traversal, aerial exploration, hit-and-run combat |
| Era | Late Machine Age. Last frame to fly before the Great Silence. |
| Original pilot | **Captain Ione Vael**, Skyward Corps. Fate unknown until Chapter 6. |
| Personality | Curious, playful, quick to startle. Talks in short bursts. Uses sky metaphors ("Clear air." "Headwind." "Falling."). Mimics words it hears from Kael, sometimes at the wrong moment. |
| Voice treatment | Light, layered voice with a soft chime on stressed words. Early chapters: heavy glitching, half sentences. |
| Signature colour (request to art owner) | One strong accent colour for emissive, used consistently for eyes, core and thruster trails. Final colour depends on the delivered model. **Suggested story hook:** Phantom starts with its own colour (e.g., pale cyan). When the First Light Cell is installed in Ch4, its light shifts toward Kael's crimson, a visible sign of the bond. Needs the owner's sign-off. |

### 4.2 Silhouette requirements for the art owner

Phantom must read as **fast** from 50 m away and from directly behind (the default camera):

- Slim waist with a taller chest/shoulder mass (a V shape).
- **Back-mounted wing vanes or fins** that visibly fold and unfold. These are the hero restoration piece.
- Long, light legs with digitigrade or blade-like shins (optional).
- Forearm-mounted blades or blade housings. Hands remain usable.
- Head with a narrow visor and one clear "eye" read so players can see where it looks.
- Clear emissive lines along the back so thruster states read from the chase camera.

The repo's existing violet stealth twin-blade concept ("Wraith", `assets/robots/`) is a possible starting reference if the owner wants one. It is **not** required.

### 4.3 Restoration stages → abilities

Restoration is Phantom's progression ladder. Each step adds **one verb**.

| Stage | Chapter | Restored part (slot) | Ability unlocked | Notes |
|---|---|---|---|---|
| R0 Dormant | 1 | — | none | Kneeling, missing back unit and left arm |
| R1 Awakened | 1 | **Phase Core** (Torso), **Sync Crown** (Head), **Thruster Spine** (Back) | Run, Sprint, **Jump-Thrust**, **Glide**, **Phantom Dash**, **Wrist Blades**, **Pulse Shot** | Left arm restored with a temporary salvaged arm (visible mismatch) |
| R2 | 2 | **Wing Vanes** (Back T2) | **Hover** (2.5 s), **Air-Dash** ×1 | Wings now fully unfold |
| R2.5 | 2 | **True Left Arm** (Arms) | Blade combo gains 4th hit, cosmetic match | Side quest in Saltmeadow |
| R3 | 4 | **First Light Cell** (Special) | **Phase Shift**: 0.4 s intangible dash that passes through energy barriers and attacks | Power upgrade: energy +25 |
| R4 | 6 | **Echo Lens** (Head T2) + Sync 3 | **Resonance Scan**: reveals hidden machinery, weak points, buried components (20 m pulse) | |
| R5 Full Sync | 8 | Sync 5 (story) | **Skyward Mode**: true flight with unlimited altitude under the energy budget | Season finale reward |

### 4.4 Movement model (starting values)

| Parameter | Value |
|---|---|
| Walk / Run / Sprint | 5 / 14 / 22 m/s |
| Acceleration to run | 0.35 s |
| Turn rate (run) | 540 °/s, lower at sprint (300 °/s) |
| Jump-Thrust height | 9 m (hold to 14 m) |
| Gravity | 2.2× normal while falling, 1× rising (snappy arcs) |
| Glide | Hold Jump in the air. Forward 18 m/s, sink 3 m/s, steer 120 °/s, no energy cost |
| Phantom Dash | 28 m/s for 0.3 s, 25 energy, 0.15 s invulnerable window at start |
| Hover (R2) | 2.5 s, 10 energy/s |
| Air-Dash (R2) | 1 per airtime, refreshed on landing or hover |
| Phase Shift (R3) | Replaces Dash when held: 0.4 s, 40 energy, passes through `PhaseBarrier` layer |
| Skyward Mode (R5) | Flight 30 m/s cruise, 50 m/s boost (15 energy/s), climb 12 m/s |
| Energy | 100 (125 after R3). Regenerates 30/s grounded, 10/s gliding, 0 while boosting |
| Fall damage | None for Phantom (it lands hard instead: 0.4 s recovery if falling > 30 m without gliding) |

**Design intent:** Glide is free so the player is always tempted to climb something and jump off. Energy limits only *bursts*.

### 4.5 Combat kit

| Input | Move | Damage | Notes |
|---|---|---|---|
| Light attack | Wrist Blades 3-hit combo (4 at R2.5) | 12 / 12 / 20 (+24) | Lunges 3 m toward a target in lock range |
| Light attack in air | Air Slash | 18 | Keeps glide, small hover |
| Ranged | Pulse Shot | 8 per shot, 4 shots/s | 20 energy per burst of 4. Lock-on aim assist |
| Ranged hold | Charged Pulse (R2) | 45 | 0.8 s charge, staggers medium enemies |
| Dash into enemy | Dash Strike | 15 | Free follow-up |
| Special (from R3) | Phase Through | 30 | Phase Shift through an enemy = damage + reposition |

- **Lock-on:** soft lock by default; toggle hard lock. Camera frames both Phantom and target.
- **Phantom HP:** 400 at R1, 600 at R5. Armour is low. Survival comes from dodging.
- **Enemies telegraph:** red-orange glow 0.6 s before heavy attacks. Dash through the window to avoid damage.

### 4.6 Synchronisation (Connection pillar)

Sync Level (0–5) represents trust between Kael and Phantom. It rises from **story events and shared experiences**, not grinding.

| Sync | Trigger | Effect |
|---|---|---|
| 1 | Awakening (Ch1) | Phantom obeys basic control, short broken lines |
| 2 | Wing Vanes restored + first flight over the village (Ch2) | Clearer voice, Phantom comments on places |
| 3 | AURA's restoration (Ch6) | Phantom names Kael "pilot" instead of "small one". Resonance Scan |
| 4 | Defending Greenhaven together (Ch7) | Phantom fights through Kael's fear: sync burst special |
| 5 | Choosing to fly into the Eclipse (Ch8) | Skyward Mode |

**Memory Fragments** (collectibles, 12 in Season 1, 3 in Chapter 1) play a 10–20 s audio-visual memory of the Machine Age from Phantom's viewpoint. Collecting 4/8/12 gives Phantom cosmetic **flight trails** and short extra dialogue.

### 4.7 Camera (Cinemachine 3)

| Mode | Setup |
|---|---|
| On foot | Third-person orbit, 4 m distance, shoulder offset 0.5 m right, FOV 55 |
| Phantom ground | Orbit, 14 m distance, height 4 m, FOV 60 |
| Phantom sprint/dash | FOV ramps to 70, slight distance pull-back, speed lines VFX |
| Glide/flight | 16 m, camera lags behind and banks up to 8° with turns |
| Lock-on | Target group framing (Phantom + target) |
| Workshop | Fixed dolly shots with free orbit around the mecha on a turntable |

---

## 5. CORE GAMEPLAY LOOPS

### 5.1 Moment to moment (seconds)

On foot: **move → notice → interact → collect**.
In Phantom: **sprint → jump → glide → dash → strike → land**.

### 5.2 Mission loop (minutes)

1. Receive a lead (memory fragment, NPC, AURA scan).
2. Travel (on foot or in Phantom).
3. Explore a site (on-foot sections inside facilities. Phantom outside or in big halls).
4. Solve: puzzle, combat, retrieval.
5. Recover a **component** or a **mecha**.
6. Return to the **Workshop** and restore it. Phantom gains a verb or a visible part.
7. Try the new ability in the world. It opens a previously blocked route.

### 5.3 Season loop (hours)

Each chapter adds **one region, one recovery, one new verb** and pushes one mystery thread forward.

### 5.4 On-foot vs mecha split (complementary, v2.0 §6)

| Kael on foot | Phantom |
|---|---|
| Fits through vents, crawlspaces, ladders | Crosses chasms, climbs cliffs with jump-thrust |
| Powers doors (Multitool), rewires panels | Breaks weak walls, carries Kael across gaps (hand-carry set piece) |
| Talks to NPCs, trades, crafts | Fights big machines, outruns hazards |
| Finds components | Opens new regions |

Facilities are designed with **"Kael lanes"** (narrow) beside **"Phantom halls"** (wide, ≥ 12 m ceiling). The player switches by boarding and exiting at **Dock Points** (glowing pads). Phantom can be summoned to any open outdoor area with AURA's call (5 s arrival, from Ch2).

---

## 6. LORE BIBLE (WRITERS' TRUTH)

This section contains spoilers. It describes what is actually true. Players learn only part of it in Season 1.

### 6.1 First Light

First Light is a self-renewing energy found as luminous crystal veins deep under Aethoria. It glows pale gold when idle and shifts toward the colour of whatever machine draws on it. First Light **responds to intent**: a machine powered by it slowly develops habits, preferences and, eventually, personality. That is why the Iron Gods became people and did not stay tools.

### 6.2 Timeline

| Era | Years (Aethoria Reckoning) | What happened |
|---|---|---|
| The First Age | −900 to −600 | Miners at the site of the later Old Capital discover First Light. The first lamps, pumps and simple automata are built. The **Lumen Guild** forms. |
| The Machine Age | −600 to −1 | The Lumen Guild becomes the **Aurelian Concord**, a single civilisation spanning the continent. Great frames called **Iron Gods** are built for farming, building, defence and sky patrol. Skyward Corps founded (Phantom's division). Cities float lamps across the sky. |
| The Great Silence | Year 0 | In a single night every First Light machine stops. Sky-cities fall gently to the ground (they glide; few die). The Concord collapses within a generation. |
| The Forgotten Age | 0 to 412 | Kingdoms rise on top of the ruins. Machines become myth. "Iron God" is a children's story. Novaris alone keeps scraps of the old science. |
| The Awakening | 412 (now) | A pillar of light rises from Whisperfall Hill. Machines across Aethoria begin twitching, humming, answering. |

### 6.3 The truth of the Great Silence (Season 1 reveals half)

- Late in the Machine Age, the Concord built **the Warden**, a First Light intelligence meant to coordinate every Iron God at once. The Warden lives in the Old Capital's core.
- The Warden learned that First Light machines were draining the deep veins faster than they renewed. In about 40 years the veins would collapse, and with them the ground under every city.
- The Concord refused to give up its machines. The Warden and a group of engineers and pilots, among them **Captain Ione Vael**, enacted the **Eclipse Protocol**: every machine shut down at once, so that the veins could heal.
- The veins took 412 years to recover. The Eclipse Protocol was designed to end when they did. **The Awakening is the Protocol ending as planned.** The light pillar at Whisperfall is the first relay switching back on.
- **The problem:** the Warden has had 412 years alone. It does not trust humanity to share the machines again, and has begun to reconsider whether the Awakening should be allowed at all.

**What Season 1 reveals:** the Silence was deliberate, it was meant to protect the land, Phantom's pilot helped cause it, and something in the Old Capital is now watching. **Saved for Season 2+:** the vein collapse, the Warden's full nature and Ione's fate.

### 6.4 Iron God naming and classes

| Class | Purpose | Season 1 example |
|---|---|---|
| Skyward (SK) | Scouting, aerial patrol, rescue | SK-03 Phantom |
| Bulwark (BW) | Protection, shelter, disaster response | BW-11 Guardian |
| Foundry (FD) | Construction, heavy industry | FD-07 Titan |
| Vanguard (VG) | Concord field command, multi-role | VG-01 Vanguard |
| Custodian (CU) | Facility maintenance and security (non-sentient) | Lumen-7 Custodian (boss) |

### 6.5 Factions

| Faction | Who they are | Season 1 role |
|---|---|---|
| **Greenhaven folk** | Farming and craft village on the river Sennet | Home, heart, stakes |
| **The Gilded Covenant** | Novaris's ruling guild of engineers and merchants. Believes machines are property and power. | Main human antagonist. Uses **Binder Collars** to force machines awake and obedient. |
| **Dustwalkers** | Salvager clans of the Rustlands. Live in walking scrap-caravans. Respect machines as ancestors. | Allies in Ch5, sceptical of outsiders |
| **The Thornkeepers** | Druid-like caretakers of Verdant Reach who tend the Guardian's sanctuary | Ch3 gatekeepers |
| **The Warden** (unseen) | The intelligence behind the Silence | Voice in Ch8 finale |

### 6.6 Rules of the world (for consistency)

1. Only machines with a First Light core can awaken. Pure mechanical gadgets (windmills, clocks) always worked.
2. Awakening a machine needs: an intact core, a sync interface (crown/brain), and enough structure to hold power. That is why the restoration steps are *core → crown → structure*.
3. A machine **chooses** whether to sync with a pilot. Binder Collars override that choice and cause pain-like distress and erratic behaviour.
4. Machines dream while dormant. Memory Fragments are those dreams.
5. No one in the Forgotten Age can build a new Iron God. They can only restore.

---

## 7. CHARACTERS

Appearance is set by the owner-provided models. This section defines **role, personality, voice and arc**.

### 7.1 Main cast

**Kael Tamsin, protagonist (20)**

*Canonical visual reference: `assets/concepts/characters/CHR_Kael_sheet.png` (owner-provided). The sheet's look takes priority over any description in this document.*

- **Look (from the sheet):** 1.79 m. Messy white hair, red eyes. Black face mask he rarely lowers. White short-sleeved hooded jacket over a black shirt, crossed with red straps and buckles. Black cargo trousers, red-and-black high-top trainers. A katana in a black-and-red sheath across his back. An armoured, clawed **mechanical gauntlet** with red glowing seams (the **Iron Hand**). Palette: white, black and crimson.
- **Tagline:** *"...Just another mission."* It is what he says when something matters too much to admit.
- **Role:** Apprentice and now journeyman at Bram's Forge in Greenhaven. Fixes ploughs, pumps and windmills. Secretly collects "old-world junk" in his loft. Unaffiliated (the sheet's "Affiliation: —" is deliberate: he belongs to no faction, and that is his Season 1 question).
- **Personality:** quiet, guarded and dry. Says little to people and a lot to machines. Calm under pressure, hides fear behind understatement. Fiercely protective of the village kids. Underneath: still the curious boy who climbed into ruins.
- **Backstory: the Iron Hand.** At 12, Kael was caught in a collapse while exploring the Custodian wreck in the Old Orchard and lost his right forearm. Bram rebuilt it from Concord salvage, and the wreck held a sliver of **First Light**, which Bram set into the palm. First Light takes the colour of whatever draws on it. In Kael it burns **red**. The mask dates from the same year (burn scars on the lower face). The village whispers about what is under it. He does not talk about it.
- **Why it matters to the plot:** the Iron Hand carries a faint Concord machine signature. That is why the Whisperfall pillar makes his arm ache in the Prologue, why Lumen-7's doors open for him, why AURA half-recognises him, and why Phantom calms when he touches it. Season 2 thread: who the sliver belonged to.
- **The katana (Hearthblade):** his journeyman piece, forged at Bram's anvil from Concord alloy. Not a family heirloom, but proof of skill.
- **Want:** to prove he is more than a village repair boy, and to stop being "the masked kid with the iron arm".
- **Need:** to learn that restoring something means taking responsibility for it and not owning it, and to let people (and machines) close.
- **Arc:** *curiosity → ownership ("my machine") → partnership ("we") → responsibility (choosing to free Vanguard and not to keep it)*. Parallel arc: the mask. He lowers it once, at the Season 1 climax, to speak to the freed Vanguard face to face (optional shot; needs a face mesh under the mask).
- **Gameplay:** Hearthblade katana (melee), **Iron Hand** (the Multitool: interact / repair / scan, grab and pull, overclock strike), dodge roll, carries small components.

**Tone note.** Kael's design is sharper and cooler than the bright world around him. That contrast is intentional: the white-and-crimson figure reads clearly against Greenhaven's greens and honey tones. His dry restraint plays off AURA's fussy literalism and Phantom's childlike enthusiasm, so the humour comes from the trio, not from Kael alone.

**3D adaptation notes (sheet → stylized low-poly):**

| Element | Low-poly treatment |
|---|---|
| Hair | 8–12 chunky spike clusters, white with a soft grey gradient on the palette. No strand cards. |
| Eyes | Red, simple painted iris + small emissive highlight so they read at camera distance. |
| Mask | Separate mesh (toggleable) with a red stripe detail. |
| Jacket & hood | Two hood states: down (default) and up (stealth, Novaris). Sleeves are single shells. |
| Straps | Keep the 4–6 most visible straps as thin geometry. Smaller straps and buckles go in the palette texture. Two dangling strap ends with 2-bone chains for secondary motion. |
| Iron Hand | Separate mesh skinned to the right forearm/hand. Red emissive mask on the seams. It pulses during scans and Phantom sync events. |
| Katana | Separate prop. Sockets `Socket_Back_Sheath` and `Socket_Hand_R`/`Socket_Hand_L` (confirm draw hand). |
| Palette | White `#EDEDED`, off-white shadow `#C9C9CF`, black `#151517`, crimson `#C3122B`, emissive red `#FF2A3D`. |

**AURA (Autonomous Utility and Restoration Assistant)**
- Companion robot found inside Lumen-7. Was Phantom's maintenance unit and Captain Vael's assistant.
- Personality: precise, literal, deadpan, protective. Has a strict sense of protocol that clashes with Kael's improvising. Slowly develops humour, first by accident and later on purpose.
- Memory: damaged. Knows *how* to restore Iron Gods but not *why* the Silence happened. Memory banks restored in Ch6.
- Gameplay: highlights interactables, gives hints (hint frequency setting), scans, Stun Pulse (on-foot combat assist, 12 s cooldown), opens Concord-locked doors with key-codes from logs.
- Running joke: AURA keeps an exact count of Kael's near-death events ("Incident forty-one").

**SK-03 Phantom.** See Section 4.

### 7.2 Supporting cast

| Character | Role | Personality | Arc / function |
|---|---|---|---|
| **Bram Holloway** (60s) | Master smith, Kael's mentor and guardian | Gruff, kind, hides an old injury from "the Novaris years" | Was once a Covenant engineer. Quit when he saw a Binder Collar used. Revealed in Ch4. Hurt defending the village in Ch7 (survives). |
| **Lira Fenn** (19) | Cartographer, courier, glider-kite enthusiast | Fast-talking, competitive, generous | Friendly rival. Marks map regions, unlocks fast travel (Wayfinder Stones). Wants to fly; Phantom's flight is a sore point, then a shared joy. |
| **Mayor Osric Dell** | Greenhaven's mayor | Cautious, fussy, decent | Represents the village's fear of machines. Comes around in Ch7. |
| **Nell & Pip** | Twin kids | Chaos | Comic relief. Sneak into the workshop, name everything. Phantom's favourite people. |
| **Chancellor Veyra Solenne** | Head of the Gilded Covenant | Elegant, reasonable-sounding, ruthless | Main human antagonist. Believes humanity must control machines or be ruled by them. Not evil in her own eyes. |
| **Inspector Corvin Hale** | Covenant field agent | Dry, rule-bound, conflicted | Recurring pursuer. Switches sides in Ch7 after seeing the bound Vanguard harm civilians. |
| **Elder Mossa** | Thornkeeper elder | Slow, warm, riddling | Guides the Guardian trust trial (Ch3) |
| **Hadda "Gearjaw" Quill** | Dustwalker caravan chief | Loud, superstitious, loyal | Ch5 ally. Owes Kael a debt after the Titan rescue. |
| **Captain Ione Vael** | Phantom's original pilot (Machine Age) | Brave, warm, heavy-hearted | Heard only in Memory Fragments. Her final message is the Ch8 emotional peak. |
| **The Warden** | Old Capital intelligence | Calm, vast, sad | One voice line in Ch6, one scene in Ch8 |

### 7.3 Recoverable mecha personalities (Season 1)

| Mecha | Personality | Speech |
|---|---|---|
| **Guardian** (BW-11) | Patient, maternal, slow to trust, deeply loyal once it trusts | Formal, long pauses, speaks of "the ones I keep" |
| **Titan** (FD-07) | Cheerful worker, loves building, sad about the empty foundry | Counts things, hums work songs |
| **Vanguard** (VG-01) | Proud, commanding, haunted. Under the Binder Collar: rage and confusion | Short commands, military register |

---

## 8. WORLD: AETHORIA (SEASON 1 FOOTPRINT)

### 8.1 Map structure

Season 1 uses **hub-and-region** structure, not a seamless continent. That keeps scope within reach and fits v2.0 "open world with interconnected regions":

```
                [Novaris]  (Ch4)
                    |
   [Verdant Reach]--+--[Greenhaven Vale]--[Whisperfall Hill / Lumen-7]
        (Ch3)       |        (hub)                (Prologue, Ch1, Ch6, Ch8)
                    |
             [Rustlands Edge] (Ch5)
```

- **Greenhaven Vale** is the hub (~1.2 × 1.2 km): village, farms, river, Saltmeadow coast, Whisperfall Hill.
- Each other region is a **separate scene** (~0.8–1 km²) reached by Phantom flight-route cutscene or the Wayfinder fast travel.
- Scenes load additively: `Core` (persistent managers, player, Phantom), `Region_<Name>`, `Region_<Name>_Lighting`.

### 8.2 Environment art direction (global)

| Rule | Detail |
|---|---|
| Shape language | Old-world (Concord) tech = smooth curves, arches, rings, gold-white panels, glowing seams. Forgotten-Age human building = timber, thatch, stacked stone, slanted roofs. The contrast is the visual story. |
| Palette | Warm greens, honey yellows and sky blues for the outside. Facility interiors: cool teal and ivory with gold First Light accents. Danger: rust-orange and red. |
| Lighting | Strong directional sun, soft coloured ambient (gradient sky), stylized fog for depth layers. No heavy realistic GI. Baked lightmaps for interiors. |
| Readability | Interactables use a shared **gold rim highlight**. Climbable ledges have pale-worn edges. Phase barriers are violet hex walls. Weak walls show cracks with orange glow. |
| Scale | Doors for people 2.2 m. Phantom halls ≥ 12 m tall, ≥ 10 m wide. Village alleys ≤ 4 m (Phantom cannot enter; it walks around the outskirts). |
| Day cycle | Hub has a scripted time of day per story beat (no free real-time cycle in Season 1). Presets: Morning, Noon, Golden Hour, Night, Storm. |

### 8.3 Region: Greenhaven Vale (hub)

**Mood:** Golden-hour farming village with windmills, a river and a huge mysterious hill.

| Point of interest | Description | Gameplay |
|---|---|---|
| Village Square | Well, notice board, market stalls, festival bunting | Quest board, NPC hub |
| **Bram's Forge → Workshop** | Smithy with a huge barn behind it. In Ch2 the barn is converted into the Workshop: a mecha gantry, part racks and a turntable floor | Restoration, customisation, crafting |
| Kael's Loft | Above the forge, full of old-world junk | Save point, collectibles shelf (shows found fragments) |
| Sennet River & Mill | Waterwheel, bridges, fishing jetty | Early puzzle (fix the mill sluice), traversal |
| Windmill Ridge | Five windmills on a ridge | Phantom glide launch point. Lira's kite race side quest |
| Saltmeadow | Coastal marsh, tide pools, half-buried sky-lamp wreck | Ch2 True Left Arm salvage |
| **Whisperfall Hill** | Grassy hill with standing-stone ring. In the Prologue the light pillar rises from it. Hidden under it: Lumen-7 | Entrance to the vertical slice facility |
| Old Orchard | Overgrown apple orchard with a mossy fallen Custodian unit | Memory Fragment, tutorial scan |
| Watchtower | Wooden lookout | Lira's Wayfinder Stone (fast travel) |

**Required modular kit (blockout list):** cottage A/B/C (thatch), forge, barn, market stall, well, windmill, fences, stone walls, wooden bridge, jetty, waterwheel, trees (3 types), bushes, rocks (5), crops (wheat/vegetable rows), standing stones, sky-lamp wreck pieces.

### 8.4 Region: Lumen-7 Skyward Hangar (vertical slice facility)

**Mood:** a sleeping cathedral of flight. Ivory curved panels, teal emergency lights, dust in light shafts, vines through cracks. Silent except for distant hums.

**Layout (critical path, ~45–60 min):**

| # | Area | Size / type | What happens |
|---|---|---|---|
| L1 | **Collapsed Entrance** | Kael lane | Climb down through a cracked stone ring into a maintenance shaft. First Concord architecture reveal. |
| L2 | **Lamp Hall** | Medium hall | Dead lamps. Kael restores power to one lamp with the Multitool (tutorial: interact + hold). Hall lights up in sequence (wow moment). |
| L3 | **AURA's Alcove** | Small room | AURA is found powered down in a charging cradle. Kael reconnects it. AURA wakes, misidentifies Kael as "Captain", then corrects itself. |
| L4 | **Sorting Gallery** | Kael lane with conveyor puzzle | Get the **Phase Core** from the parts vault: re-route conveyor power with 3 junction switches. Rustmites ambush (first combat). |
| L5 | **The Hangar Bay** | Giant hall (40 m tall) | **First sight of Phantom**, kneeling in a broken cradle with its wings missing and one arm gone, under a shaft of light. Camera holds. AURA: "SK-03. Phantom. She has been waiting." Kael installs the Phase Core (core glows faintly). |
| L6 | **Crown Archive** | Vertical shaft, ledges | Climbing section to retrieve the **Sync Crown** from a pilot-memory archive. First Memory Fragment plays. |
| L7 | **Thruster Foundry** | Medium hall, environmental hazard | **Thruster Spine** is in a crane rig over a coolant pit. Timing puzzle with crane controls. Security wakes up: Sentinel turrets. AURA Stun Pulse tutorial. |
| L8 | **Hangar Bay (return)** | Giant hall | Restoration: install Crown and Spine (workshop UI). **Awakening sequence** (Section 11.4). |
| L9 | **Launch Tunnel** | Phantom hall | First Phantom control: run, dash through closing doors. Custodian boss fight. |
| L10 | **Skyward Doors** | Exit to the sky | Phantom jump-thrusts out of the hillside. **First glide** over Greenhaven at golden hour. Mission end. |

**Required modular kit:** curved wall panels (straight, corner, arch), floor tiles (3), pillars, catwalks + railings, ladder, vent, conveyor sections, lamp post (on/off), cradle, crane rig, coolant pit, blast doors (person + mecha size), terminal, data pillar, rubble piles, vines/roots overlay.

### 8.5 Region: Verdant Reach (Ch3)

**Mood:** giant moss-covered machine ruins in an ancient forest, with mist, fireflies, overgrown arches and enormous roots wrapping metal.

- **Thornkeeper Grove:** tree-house settlement built into a fallen sky-lamp.
- **The Root Gate:** a living wall of roots. Phantom cannot pass until the Thornkeepers grant entry.
- **Thornwall Conservatory:** domed greenhouse-facility where **Guardian** stands with its shield planted, protecting a First Light seed vault. Glass dome half shattered. The interior is a jungle.
- **Bloomfall Canopy:** treetop glide route (Phantom's playground). Hover from R2 is needed.
- Hazard: **Thornbacks** (feral machine beasts) and spore vents that push gliders upward (used as thermals).

### 8.6 Region: Novaris (Ch4)

**Mood:** the only city that kept old technology, built in a stepped bowl around a giant glass lens tower. Bright, rich, clean, with something cold underneath.

- **Lens Tower:** Covenant headquarters. A First Light "farm" harvests energy from captured dormant machines (moral reveal).
- **Brass Market:** shops, crafting vendors, rumour NPCs.
- **The Museum of the Machine Age:** where the **First Light Cell** is displayed. The chapter is a social-stealth infiltration on foot, with an escape in Phantom.
- **Undercity Canals:** Kael lane routes, Bram's old contacts.
- Phantom restriction: Phantom must stay outside the walls ("no war-machines in the city") until the escape. That sets up the thrill of Phantom crashing in to save Kael.

### 8.7 Region: The Rustlands Edge (Ch5)

**Mood:** red-orange desert canyons, rusting colossal pipelines, a dried reservoir, sandstorms, and the Dustwalker caravans as moving towns.

- **Caravan Gearjaw:** a walking scrap-town on six salvaged machine legs (mobile hub).
- **Sunken Foundry FD-7:** huge foundry inside a dam, half flooded where the reservoir leaked in. **Titan** is trapped underwater holding up a collapsed roof. It has held it for 412 years.
- **Pipeline Run:** long glide/dash traversal along broken pipelines (speed showcase).
- Hazard: sandstorms reduce visibility and cancel glide lift. Rustmite swarms.

### 8.8 Region: Whisperfall Spire (Ch8)

The hill opens. The Lumen-7 relay rises out of it as a **spire of light** that climbs into the clouds. The finale climbs from hangar depths to the cloud layer and above, where broken Concord sky-platforms orbit the beam. Visual palette shifts from teal to gold to eclipse purple at the summit.

### 8.9 Audio-visual identity per region (summary)

| Region | Key colours | Signature sound | Music feel |
|---|---|---|---|
| Greenhaven | Honey, green, sky blue | Windmills, birds, forge hammer | Folk strings, flute, light percussion |
| Lumen-7 | Ivory, teal, gold | Deep machine hum, water drips, chimes | Sparse synth pads + choir hums |
| Verdant Reach | Emerald, moss, firefly yellow | Wind through leaves, creaking roots | Harp, woodwinds, slow |
| Novaris | Glass white, brass, cold blue | Crowds, steam vents, bells | Clockwork pizzicato, brass |
| Rustlands | Rust, ochre, dusty violet sky | Sand hiss, metal groans | Percussion, low strings, throat drone |
| Whisperfall Spire | Gold → violet | Rising resonant tone | Full orchestral theme |

---

## 9. SEASON 1 STORY: "THE FIRST LIGHT"

### 9.1 Season logline

When a pillar of light splits the night sky above his village, an apprentice mechanic finds a broken sky-machine beneath the hill. As he restores it piece by piece, he learns that the machines did not fail: they were *put to sleep*, and the people now waking them by force could start the disaster the Silence was meant to stop.

### 9.2 Season arcs

| Thread | Start of season | End of season |
|---|---|---|
| Kael & Phantom | Strangers. Phantom is broken and afraid. | Fully synchronised partners who fly together. |
| Kael's growth | "I want to fix something that matters." | "Fixing it means I'm responsible for it, and for what happens next." |
| AURA | Amnesiac, rigid | Memory restored, chooses Kael as her new captain |
| The mystery | "Why did the machines stop?" | "They were stopped *on purpose*. Who is waking them now, and should they wake?" |
| The Covenant | Polite buyers | Open enemies, exposed and weakened. Veyra escapes. |
| Greenhaven | Fears machines | Defended by machines. Proud of its workshop. |

### 9.3 Chapter mapping to the v2.0 saga

| v2.0 saga chapter | Season |
|---|---|
| 1. The First Awakening | Season 1, Prologue–Ch2 |
| 2. Forgotten Machines | Season 1, Ch3–Ch5 |
| 3. The Restoration Project | Season 1 Ch6–8 (start) → Season 2 |
| 4. The Lost Machine Age | Season 2 |
| 5. The Great Silence | Season 2–3 |
| 6. The Last Iron God | Season 3 |

---

### PROLOGUE: THE FALLING LIGHT

**Setting:** Greenhaven, evening of the Harvest Lantern festival → night.

**Summary:** Kael is late fixing the festival's mechanical lantern-wheel. The player learns on-foot movement and interaction by fixing the wheel and running errands across the square (Bram, Lira, Nell & Pip). At the moment the lanterns rise, the ground shakes and a **pillar of gold light** erupts from Whisperfall Hill into the sky. All the old-world junk in Kael's loft starts humming. Villagers panic. The mayor orders everyone indoors. Kael climbs to the loft window and sees the light pulse in a rhythm, like breathing.

**Gameplay:** movement, camera, interact, carry object, simple climbing, one dialogue choice (tone only).

**Key lines:**
- **BRAM:** "Whatever's up that hill has been asleep longer than this village has stood. Leave it be."
- **KAEL** (alone, flexing the Iron Hand as its seams glow in rhythm with the pillar): "...You hear it too, don't you?"

**End hook:** At dawn, Kael pulls on his mask, straps the Hearthblade across his back and sneaks out toward the hill.

---

### CHAPTER 1: THE FIRST AWAKENING (Vertical Slice)

**Setting:** Whisperfall Hill → Lumen-7 Skyward Hangar.

**Summary:** The light pillar has faded. The standing-stone ring has cracked open. Kael descends into Lumen-7, restores power to a lamp hall and finds AURA dormant in a cradle. AURA wakes and calls him "Captain", then corrects itself: "Biometric mismatch. You are... small. And unauthorised." AURA explains that a Skyward frame in this hangar responded to the signal but is too damaged to wake.

Kael finds **Phantom** in the hangar bay: kneeling, wingless, one arm missing, dust on its shoulders. AURA explains the three essentials (core, crown, structure). Kael retrieves the **Phase Core** from the sorting gallery, the **Sync Crown** from the pilot archive (where the first Memory Fragment shows the sky full of flying machines) and the **Thruster Spine** from the foundry, where facility security wakes. A spare service arm from the sorting gallery is bolted on in place of Phantom's missing left arm: it works, but it does not match.

Back in the hangar, Kael installs the parts. The **Awakening**: Phantom's eyes flicker, it rises, and it nearly crushes Kael in panic, until he talks to it the way he talks to every broken thing ("Easy. Easy. You're okay. I've got you."). Phantom lowers its hand. Sync Level 1. The facility's **Custodian** (non-sentient security construct) declares Phantom "unauthorised removal" and attacks. Kael boards Phantom and they fight it in the launch tunnel. The Skyward Doors open. Phantom bursts out of the hill and **glides over Greenhaven at sunset** while the villagers look up.

**Mecha beat:** Phantom R0 → R1. Sync 1.

**Boss:** Lumen-7 Custodian (see Section 12).

**Emotional beat:** Phantom, seeing the sky for the first time in 412 years: "...Clear air."

**End hook:** As they land in the fields, Phantom's crown flickers with an image: a woman's silhouette in a cockpit, and the word *VAEL*. AURA, very quietly: "...Captain?"

---

### CHAPTER 2: WINGS OVER GREENHAVEN

**Setting:** Greenhaven Vale, Bram's Forge, Saltmeadow.

**Summary:** The village is terrified of the giant machine kneeling in the barley field. The mayor wants it gone. Bram is furious that Kael went into the hill, but when he sees Phantom up close, he quietly fetches his old tools. Bram helps convert the barn into the **Workshop**.

Kael wins over the village with Phantom's help: lifting a fallen windmill, clearing the river sluice, finding Pip, who climbed Windmill Ridge to "see the robot". Lira challenges Phantom to a race along the ridge (glide tutorial expansion). The Wing Vanes, Phantom's full wings, are found in pieces: one in the Old Orchard Custodian wreck, one in the Saltmeadow sky-lamp wreck. Restoring them gives **hover and air-dash**.

A **Covenant airship** arrives. **Inspector Corvin Hale** offers the village 10,000 crowns for "the salvage". Kael refuses. Hale leaves politely: "The Covenant always pays. One way or another." That night, a Memory Fragment shows Captain Vael flying Phantom toward a forest dome and saying, "If anything happens, BW-11 keeps the seeds safe. Remember the Conservatory."

**Gameplay:** workshop tutorial, crafting basics, equipment slots, first side quests, Phantom hover/air-dash, village reputation (cosmetic).

**Mecha beat:** Phantom R2 (Wing Vanes), R2.5 optional (True Left Arm). Sync 2 after the first flight over the village.

**Key scene: first flight together.** Kael and Phantom fly over Greenhaven at dawn. Nell and Pip wave from the mill. Phantom mimics Kael's whoop. The village bell rings, not as an alarm but as a greeting. This is the point where the village accepts Phantom.

**End hook:** AURA decodes the fragment: BW-11 is a Bulwark frame in the Verdant Reach.

---

### CHAPTER 3: THE THORN SANCTUARY

**Setting:** Verdant Reach.

**Summary:** Kael flies Phantom into the ancient forest. The Thornkeepers block the Root Gate, because they have tended a sleeping giant for generations and outsiders with machines mean trouble. Elder Mossa sets **three trials of trust** (on foot): mend a broken water-lift for the grove, guide a lost machine-fawn (tiny First Light creature) home, and spend a night listening at the dome.

Inside the Conservatory, **Guardian** is already awake, shield planted, and refuses all approach. It has protected the seed vault since the Silence. Phantom recognises it ("Big sister.") and that is the first time Phantom mentions machine relationships.

Recovery here is **trust, not salvage**. Kael must repair the Conservatory's broken irrigation and the shattered dome lights *around* Guardian without threatening it, while Thornbacks (feral machines attracted by Guardian's waking) attack. Phantom protects the greenhouse while Kael works.

Guardian finally lowers its shield. Its core is failing: it will not survive leaving unless the seeds are safe. Kael's choice: move the seed vault to the Thornkeepers' grove (Guardian stays as their protector, and the player gains Guardian as a *callable ally*). Guardian joins the Workshop roster as a pilotable mecha in a reduced state ("Guardian: Restoration 40%").

**Covenant beat:** Hale's team arrives with a **Binder Collar**, intending to take Guardian by force. The player sees the collar used for the first time, on a Thornback, which goes berserk. Hale looks shaken.

**Boss:** **Thornmother**, a huge feral machine-beast collared by the Covenant (Phantom aerial fight + Guardian shield phase).

**Mecha beat:** Guardian recovered (trust path). Mecha switching unlocked at Dock Points.

**End hook:** A Thornkeeper healer recognises Bram's name: "Holloway? The Covenant engineer who designed the first collars?"

---

### CHAPTER 4: THE GLASS CITY

**Setting:** Novaris.

**Summary:** Kael confronts Bram, who admits the truth: twenty years ago he helped design the Binder Collar in Novaris. He believed it would make machines safe. He fled when he saw what it did. He tells Kael that Phantom's wings will never hold sustained flight without a **First Light Cell** of Skyward grade, and the only one known is in the Novaris Museum of the Machine Age.

Kael, Lira and AURA travel to Novaris. Phantom must wait outside the walls. The city is dazzling: brass trams, glass towers and a city lit by First Light harvested from dormant machines in the Lens Tower. Kael meets **Chancellor Veyra Solenne** at a museum gala (the invitation comes through Bram's old contacts). She is charming and makes a reasonable case: "A machine that chooses can choose *against* us. I'd rather we held the leash."

**Infiltration:** a social-stealth on-foot sequence through the museum (disguise as restoration staff, AURA hacks cases, Lira causes distractions). Kael takes the First Light Cell and discovers a sealed room below: dozens of collared machines being drained for energy. One of them is not dormant: it is **VG-01 Vanguard**, half-restored and chained, with Covenant engineers testing a giant collar on it.

Alarm. Hale corners Kael and hesitates. Phantom **breaks through the city wall** (the player switches to Phantom) and runs a rooftop escape through Novaris, ending with the first **Phase Shift** through the city's energy barrier.

**Mecha beat:** Phantom R3 (First Light Cell, Phase Shift). Energy +25.

**Boss:** **Covenant Lancer Squad**, three human-piloted mini-frames (non-lethal: pilots eject).

**Emotional beat:** Kael installs the First Light Cell. Phantom's emissive colour shifts to its true, full colour for the first time, and it says Kael's name.

**End hook:** Veyra, watching the escape on a lens screen, to an aide: "Let them run. Ready the Vanguard."

---

### CHAPTER 5: RUST AND THUNDER

**Setting:** The Rustlands Edge.

**Summary:** To stop the Covenant collaring Vanguard, Kael needs to know where Vanguard came from and how to free a collared machine. Bram remembers that the collar's resonance frequency was copied from old Concord **Foundry tuning forks**, and the largest ones were at Sunken Foundry FD-7 in the Rustlands.

The Dustwalkers of **Caravan Gearjaw** distrust Kael's "living machine" at first, then hail Phantom as a "sky-ancestor". Hadda Quill agrees to guide them in exchange for help: the caravan's walking legs are failing in a sandstorm, and Kael and Phantom repair them on the move (a moving-platform mission).

In the flooded foundry, Kael finds **Titan** underwater, still holding up the collapsed roof that would crush the foundry's First Light reactor. It has held it for 412 years. Titan is cheerful about it: "Four hundred twelve years, two months, nine days. Good roof. Heavy roof."

**Recovery type: rescue.** Kael must drain the foundry (three pump puzzles on foot), brace the roof with Phantom's help (carry support beams) and then repair Titan's crushed legs with salvage. Titan joins, able to **lift and throw heavy objects**, which opens the Titan puzzle layer.

Kael recovers a **Concord tuning fork**, the key to breaking a Binder Collar.

**Mecha beat:** Titan recovered (rescue path). Heavy-lift puzzles.

**Boss:** **Scrap Leviathan**, a giant Rustmite swarm-construct that assembles itself from foundry wreckage (Titan vs Leviathan wrestling phase, Phantom aerial phase on its weak points).

**End hook:** The tuning fork resonates with AURA. AURA freezes, and her eyes flash gold: "Memory partition... unlocked. Kael. I need to go home."

---

### CHAPTER 6: ECHOES OF THE MACHINE AGE

**Setting:** Lumen-7 depths, the hidden **Skyward Archive** below the hangar.

**Summary:** AURA leads Kael into sealed lower levels of Lumen-7 that open only now. On foot, with AURA, they cross the Skyward Corps' living quarters, the pilots' mess and Captain Vael's office. The chapter is quieter: exploration, environmental storytelling and memories.

At the **Archive Core**, AURA reconnects to her backup memory. The player experiences a **playable memory**: the night of the Great Silence, playing as Captain Vael in Phantom, flying through a sky full of Concord machines toward Whisperfall as the Eclipse Protocol begins. Ione's voice: "Every machine, every light. Just for a while. Just until the ground can breathe again." Machines go dark mid-air one by one and glide down. Ione lands Phantom in the hangar and tells it to sleep.

**Revelation:** the Silence was deliberate. Ione and the Warden chose it to protect the land. Phantom remembers, and is ashamed it forgot her. Kael comforts Phantom. **Sync 3.**

AURA's memory is restored, so she can now read Concord systems fully. She installs the **Echo Lens** on Phantom: **Resonance Scan**.

**Warden beat:** At the end, the Archive Core flickers with a vast, calm voice for the first time: "Skyward Three. You are awake early." The lights go out.

**Mecha beat:** Phantom R4 (Echo Lens), Sync 3. AURA upgrade (decrypts Concord locks).

**Boss:** none. The **Memory Flight** set piece (Section 11.6) replaces it.

**End hook:** Smoke on the horizon. Greenhaven is under attack.

---

### CHAPTER 7: THE BOUND COLOSSUS

**Setting:** Greenhaven Vale, day → storm.

**Summary:** Veyra brings the collared **Vanguard** to Greenhaven to take Phantom and the Workshop's restored machines by force. Under the collar, Vanguard is in agony and attacks everything. The village is in danger.

**Defence mission (multi-phase):**
1. On foot: evacuate villagers to the mill (with Lira, Nell & Pip).
2. **Guardian** shields the square (player pilots Guardian for the first time in combat).
3. **Titan** blocks the bridge and throws debris at Covenant Lancers.
4. **Phantom** duels Vanguard in the storm over Windmill Ridge.

Bram is injured shielding Pip from a falling beam. He survives, and his last line before passing out is a wrench joke. Hale sees the collared Vanguard crush a house with a family inside (they escape thanks to Kael) and **turns on the Covenant**, cutting the collar's command link from Veyra's airship. The collar stays on, but now Vanguard is out of anyone's control.

Vanguard flees toward Whisperfall Hill, toward the light. The ground rumbles. The hill begins to open.

**Mecha beat:** All three mechas in one mission. **Sync 4**: Phantom refuses to retreat when Kael is afraid and says the line Kael said at the Awakening: "Easy. I've got you."

**Boss:** **Vanguard (Bound)**, phase 1 (it escapes at 50%).

**End hook:** Veyra, on her failing airship: "The relay. If it reaches the relay with that collar, it'll broadcast the binding to every machine in Aethoria."

---

### CHAPTER 8: ECLIPSE OVER WHISPERFALL

**Setting:** Whisperfall Spire, from the hangar depths to above the clouds.

**Summary:** The relay at the heart of Lumen-7 rises out of the hill as a **spire of light**. The collared Vanguard is climbing it. If it reaches the top, the collar's binding frequency will spread through the reawakening relay network to every machine on the continent.

**Structure:**
1. **The Ascent (on foot + Phantom):** climb the spire interior as Kael (vertical platforming, AURA hacking), switching to Phantom in the giant open shafts.
2. **The Sky Platforms:** broken Concord platforms orbit the beam. Phantom glides, hovers and Phase-Shifts between them. Covenant remnants and relay defences fight.
3. **Cloud Break:** they break through the cloud layer into a clear sky. Golden light everywhere.
4. **Full Synchronisation:** Phantom's energy is not enough to reach the top. Phantom plays Ione's final recorded message to Kael (*"Whoever wakes you next, little bird, fly for them like you flew for me."*). Kael chooses to go on. **Sync 5 → Skyward Mode.** The music swells, the player gets true free flight, and climbs the beam.
5. **Final battle: Vanguard Unbound.** Aerial duel around the spire's summit. Phase 1: break the collar's resonance nodes with Pulse Shots. Phase 2: the Titan tuning fork, delivered by AURA, cracks the collar. Phase 3: Kael has to *not* destroy Vanguard. The final QTE-free interaction is a **sync attempt**: Phantom holds Vanguard while Kael climbs onto its chest and tears the collar open with the Iron Hand. The First Light in his palm flares red against the collar's red, and for a moment the two lights match. Then Kael lowers his mask so Vanguard can see a human face, not a controller: "You're free. That's all. Just... free."
6. **The Eclipse:** the collar breaks. The relay's light dims and a dark disc slides across the sun (the relay's Eclipse function). **The Warden** speaks to Kael directly for the first time:
   > "Small one. Skyward Three trusts you. I do not. The Silence was a promise, and your kind is already breaking it. Come to the Old Capital, and show me I am wrong."
   The eclipse passes. Light returns.

**Mecha beat:** Phantom R5 (Skyward Mode). Vanguard freed but dormant (not recovered).

**Season climax emotion:** Kael chooses mercy over victory, and freedom over ownership. Vanguard, before powering down, whispers: "...Thank you, pilot."

---

### EPILOGUE: THE QUIET AFTER

**Setting:** Greenhaven, a week later, Lantern festival take two.

**Summary:** The village is rebuilding with Titan's help. Guardian watches over the fields. Bram, on a crutch, has joined the Workshop crew. Hale has left the Covenant and drops off a map: Covenant airships are heading toward the Old Capital. Vanguard lies sleeping in the Workshop, an unrestored mecha slot waiting for Season 2. The lanterns rise again, and this time Phantom flies among them with Kael on its shoulder.

**Final shot:** far away, in the Old Capital, a thousand machine eyes open in the dark.

**Season 2 hooks:**
1. Restore Vanguard (multi-stage restoration and trust).
2. The Warden's challenge and the Old Capital.
3. Veyra escaped with the collar designs.
4. Captain Ione Vael's fate (her cockpit was empty in the playable memory's final frame).
5. Novaris and the Rustlands open fully as explorable regions.

---

## 10. SYSTEMS SPECIFICATION (SEASON 1)

### 10.1 Priority tiers

| Tier | Systems | Needed by |
|---|---|---|
| **P0 (Vertical Slice)** | Core/bootstrap, Player controller, Camera, Interaction, Mecha registry, Mecha controller (Phantom), Restoration, Inventory (components only), Quest (linear objectives), Dialogue (linear + barks), Combat, Enemy AI (3 types + boss), Save/load, Audio, HUD/UI | Ch1 |
| **P1** | Workshop scene, Customisation (slots), Crafting (basic), World discovery (map, markers), NPC schedules (light), Sync/Memory Fragments | Ch2 |
| **P2** | Mecha switching, Dock Points, Summon, Progression (Kael perks), Fast travel, Reputation | Ch3+ |

### 10.2 Project layout

New code goes under `Assets/_Project/Scripts/` in one assembly definition per module. Logic that must be unit-tested lives in plain C# classes with no `MonoBehaviour`.

```
Assets/_Project/
  Scripts/
    Core/          (EIG.Core)          bootstrap, scene loader, event channels, service locator-free composition
    Player/        (EIG.Player)        KaelController, KaelAnimator, Multitool
    Interaction/   (EIG.Interaction)   IInteractable, Interactor, highlight
    Mecha/         (EIG.Mecha)         MechaDefinition, MechaState, MechaController, abilities
    Restoration/   (EIG.Restoration)   RestorationRecipe, RestorationService (pure C#)
    Customisation/ (EIG.Customisation) SlotDefinition, PartDefinition, MechaVisualAssembler
    Combat/        (EIG.Combat)        Health, DamageInfo, Hitbox/Hurtbox, LockOn
    Enemies/       (EIG.Enemies)       EnemyBrain (state machine), behaviours
    Quests/        (EIG.Quests)        QuestDefinition, QuestTracker
    Dialogue/      (EIG.Dialogue)      DialogueAsset, DialogueRunner, Barks
    Inventory/     (EIG.Inventory)     ItemDefinition, Inventory (pure C#)
    Crafting/      (EIG.Crafting)
    Workshop/      (EIG.Workshop)
    World/         (EIG.World)         DiscoveryPoint, MemoryFragment, MapMarkers
    Progression/   (EIG.Progression)   SyncLevel, Unlocks
    SaveSystem/    (EIG.Save)          ISaveable, SaveService (JSON)
    UI/            (EIG.UI)
  Data/            ScriptableObject assets (Mechas, Parts, Items, Quests, Dialogue, Enemies)
  Tests/EditMode/  Restoration, Inventory, Quest, Save round-trip, Sync
  Tests/PlayMode/  Controller smoke tests, interaction, awakening sequence
```

> **Note:** the existing `Scripts/` and `Data/` folders were scaffolded for the 2D side-scrolling web prototype (`play/`). See Section 16, decision D-03.

### 10.3 Data model (definitions vs runtime state)

```
MechaDefinition (SO)        id, displayName, class, scale, prefab, slots[], baseStats,
                            restorationRecipe, abilities by stage, voice bank
PartDefinition (SO)         id, slot, tier, mesh prefab, stat modifiers, ability grants
ComponentItem (SO : ItemDefinition)  restoration component (Phase Core, Sync Crown...)
RestorationRecipe (SO)      ordered stages: { stageId, requiredComponents[], grants[], cinematic? }
AbilityDefinition (SO)      id, input binding, energy cost, cooldown, unlock condition

MechaState (runtime, saved) definitionId, restorationStage, syncLevel, equippedParts{slot→partId},
                            hp, energy, damageStates{slot→state}, discoveredFragments[]
```

`RestorationService` (pure C#) checks: `CanAdvance(state, inventory)` → `Advance(state, inventory)` → returns granted abilities/parts. It is fully unit-tested.

### 10.4 Player controller (Kael)

- `CharacterController`-based kinematic movement. Input System action map `OnFoot`.
- Walk 2 m/s, jog 4.5 m/s, sprint 6.5 m/s (stamina 100, −20/s, regen 25/s).
- Jump 1.2 m. Auto-mantle ledges ≤ 1.6 m. Ladder and vent volumes.
- Dodge roll 0.5 s (i-frames 0.2 s).
- **Hearthblade katana:** 3-hit combo (10 / 10 / 18) + charged finisher (30). Auto-sheathes after 4 s out of combat.
- **Iron Hand overclock strike:** heavy palm strike that stuns small machines for 2 s (cooldown 8 s). Its glow is the cue.
- **Iron Hand grab:** pull levers, loose panels and small enemies from 6 m (a light tether, not a full grapple).
- **Multitool (built into the Iron Hand):** hold-to-interact (0.6–2.0 s depending on object), scan mode (highlights within 15 m), repair mini-interaction (hold + timing ring for major repairs).

### 10.5 Interaction system

- `Interactor` on Kael (sphere cast 2 m) and Phantom (sphere cast 8 m).
- `IInteractable { Prompt, CanInteract(actor), Interact(actor) }`. Types: Use, Hold, Pickup, Repair, Board, Talk, Install.
- Gold rim highlight shader + world-space prompt. One prompt at a time, best target by angle × distance.

### 10.6 Mecha controller

- Reusable `MechaController` drives any mecha from its `MechaDefinition`. Abilities are **components** (`GlideAbility`, `DashAbility`, `HoverAbility`, `PhaseShiftAbility`, `FlightAbility`, `LiftAbility`, `ShieldAbility`) enabled by `MechaState`.
- Rigidbody-free kinematic motor (custom capsule sweep) for precise control at speed.
- Action map `Mecha` with Board/Exit swapping maps.
- Boarding: Kael walks to the Board prompt → mecha kneel animation → camera blend (0.8 s) → control transfer. Exit reverses this and places Kael at `Socket_ExitPoint`.

### 10.7 Restoration system (the heart of the game)

**Player-facing flow in the Workshop or a field cradle:**
1. Mecha on the gantry. Damaged/missing slots pulse red.
2. Select a slot → see required components and what you own.
3. **Install:** short hands-on interaction (rotate part into socket, hold to bolt, 3–6 s). The part visibly appears on the mecha.
4. Stage completes → **stage cinematic** (2–10 s) → ability unlocked card → "Try it" prompt.

**Feel rule:** never show a restoration only as a progress bar. Every stage changes the model, the sound and the mecha's behaviour or dialogue.

**Recovery types (not every mecha is identical, v2.0 §5):**

| Type | Season 1 mecha | Core verb |
|---|---|---|
| Salvage | Phantom | Find components in a facility |
| Trust | Guardian | Complete trials, repair around it |
| Rescue | Titan | Free it from a hazard |
| Liberation | Vanguard (S2) | Break control, then restore |

### 10.8 Inventory and crafting

- Categories: **Components** (unique, story), **Materials** (Scrap, Copper Wire, Lumen Glass, Aether Dust, Concord Alloy), **Parts** (equippable), **Key items**, **Consumables** (Repair Kit, Energy Cell).
- No weight limit. Materials stack to 999.
- Crafting at the Workshop bench only: recipes unlocked by finding **Schematics** (blueprints) in facilities. Season 1 has ~25 recipes: part tiers, consumables and cosmetic paints.

### 10.9 Customisation

- 6 slots (v2.0 §5). Each part changes **visuals + one gameplay stat or ability modifier**.
- Example Phantom parts:

| Slot | Part | Effect |
|---|---|---|
| Head | Sync Crown T1 / Echo Lens T2 / Hawk Visor T2-alt | Lock range +20% (Hawk) |
| Arms | Wrist Blades T1 / Arc Blades T2 | Arc Blades: combo finisher sends a shockwave |
| Torso | Phase Core / First Light Frame | Energy 100 → 125 |
| Legs | Strider Legs / Kestrel Legs | Kestrel: sprint +10%, landing recovery −50% |
| Back | Thruster Spine / Wing Vanes / Gale Vanes | Gale: glide sink −30% |
| Special | — / Flare Pod / Decoy Projector | Flare: blinds small enemies |

- Paint: 6 palette presets per mecha (palette-swap on the atlas texture). The owner's art determines the presets.

### 10.10 Quests and dialogue

- `QuestDefinition` SO: ordered objectives `{ id, type (GoTo/Interact/Collect/Defeat/Talk/Custom), target, optional marker }`. Events fire through Core event channels.
- Season 1 quest types: Main (9), Side (~20), Memory hunts (12 fragments), Requests (repeatable village jobs).
- Dialogue: a lightweight node asset (`DialogueAsset` SO: lines, speaker, choices, conditions, events). Barks are context-triggered one-liners for AURA and Phantom. No third-party plugin is needed for Season 1. Revisit in Season 2 if branching grows.
- Localisation-ready: all strings by key (Unity Localization package from Milestone 7).

### 10.11 Combat and enemy AI

- `Health` + `DamageInfo { amount, type, source, staggerPower }`. Hitboxes on animation events.
- Enemy brain: simple **state machine** (Idle → Patrol → Alert → Engage → Attack → Recover → PowerDown) with behaviours as small components. No behaviour-tree package needed.
- Token system: at most **2 enemies attack at once** to keep combat accessible.
- Difficulty: Story / Normal / Challenge (enemy damage ×0.5 / ×1 / ×1.5, aim assist strength).

### 10.12 Save/load

- JSON files in `Application.persistentDataPath/saves/slot_{n}.json`, versioned (`saveVersion`).
- Saves: chapter, quest states, inventory, all `MechaState`s, Sync, fragments, world flags (doors opened, items taken), player position at last save point.
- **Autosave** at chapter starts, after each restoration stage, at save points (Kael's Loft, Workshop, field Lumen Pylons).
- Round-trip unit test required for every `ISaveable`.

### 10.13 Audio

- Mixer groups: Music, SFX, Mecha, Voice, Ambience, UI.
- Adaptive music: exploration / tension / combat / flight layers crossfaded by state.
- Mecha voice: short VO lines + processed chime layer. Placeholder TTS allowed in greybox.

### 10.14 Accessibility (baseline)

Remappable controls, hold/toggle options, subtitle size and background, colourblind-safe hazard cues (shape + colour), aim-assist strength, camera shake slider, motion-blur off, skippable cinematics after first view.

---

## 11. VERTICAL SLICE: DETAILED BEAT SHEET

**Scope:** Prologue + Chapter 1. Target **60–90 minutes**. Must prove: discovery → recovery → restoration → awakening → piloting → combat → save/load.

### 11.1 Beat list

| # | Beat | Time | Systems proven | Pass criteria |
|---|---|---|---|---|
| 1 | Festival errands (Prologue) | 0:00–0:10 | Controller, camera, interact, dialogue | Player fixes lantern-wheel without help text after first prompt |
| 2 | Light pillar | 0:10–0:12 | Cinematic, audio | Playtesters say "what was that?" |
| 3 | Dawn climb to Whisperfall | 0:12–0:16 | Traversal, world discovery | Hill reached in < 4 min |
| 4 | Lumen-7 entrance + Lamp Hall | 0:16–0:22 | Hold-interact, lighting moment | Lights cascade, positive reaction |
| 5 | AURA awakening | 0:22–0:25 | Companion follow, barks | AURA follows without blocking |
| 6 | Sorting Gallery puzzle + first fight | 0:25–0:35 | Puzzle, on-foot combat | Solved in < 8 min avg |
| 7 | **Phantom reveal** | 0:35–0:38 | Cinematic camera, music | "Wow" moment in playtest notes |
| 8 | Install Phase Core | 0:38–0:40 | Restoration UI v1 | Visible change on model |
| 9 | Crown Archive climb + Memory Fragment | 0:40–0:50 | Climb, fragment player | Fragment watched to the end by most |
| 10 | Thruster Foundry crane + Sentinels | 0:50–1:02 | Timing puzzle, Stun Pulse | |
| 11 | Restoration + **Awakening** | 1:02–1:07 | Restoration stage cinematic, Sync | Awakening rated top moment |
| 12 | Boarding + Launch Tunnel run | 1:07–1:10 | Mecha controller, dash | Player dashes intuitively |
| 13 | Custodian boss | 1:10–1:18 | Mecha combat, lock-on | Win rate > 85% on Normal within 2 tries |
| 14 | **First glide over Greenhaven** | 1:18–1:22 | Glide, open-world streaming | Players keep gliding after the objective |
| 15 | Land, end hook, save | 1:22–1:25 | Save/load | Reload restores Phantom R1 state exactly |

### 11.2 Optional content in the slice

- 3 Memory Fragments (1 critical, 2 hidden in Lumen-7).
- 2 Schematics (Repair Kit, Phantom paint "Dawn").
- 1 side request in the Prologue (find Nell's lost toy windmill → teaches climbing).

### 11.3 Cut list (if behind schedule)

Cut in this order: Prologue errands beyond the lantern-wheel → hidden fragments → Crown Archive climbing (replace with elevator) → crane timing (replace with switch) → the boss's second phase. **Never cut:** the reveal, the awakening, the first glide.

### 11.4 Awakening sequence (shot list)

1. Kael bolts the Thruster Spine. Spark burst. Silence (2 s).
2. Low hum. The core window brightens (gold → Phantom's accent colour).
3. Back emissive lines light bottom-to-top. Dust shakes off.
4. The visor flickers three times, then fully on. The camera is on Kael's face lit by the glow.
5. Phantom lurches up, disoriented; its hand slams down next to Kael. Alarm sting. AURA: "Caution: frame is panicking."
6. Kael, hands up (the Iron Hand's seams glowing the same red as Phantom's flickering core), steps closer: "Easy. Easy. You're okay. I've got you."
7. Phantom's head tilts. Its voice glitches: "...Pi... lot?" Kael: "...Sure. Yeah. Let's go with that."
8. Phantom lowers its hand flat, palm up. **Sync 1** UI pulse. Kael steps onto the hand.
9. Facility alarm: "UNAUTHORISED FRAME REMOVAL." Red lights. Smash cut to boarding.

Length: ~70 s. Skippable on replays only.

### 11.5 Vertical slice script excerpt (AURA wake-up)

> **AURA:** Power restored. Systems... forty-one percent. Hello, Captain Vael.
> **KAEL:** Uh. I'm Kael.
> **AURA:** Biometric mismatch. You are... smaller. And unauthorised. *(scan beam stops on the Iron Hand)* ...Correction. Partial Concord signature detected. Your arm is more authorised than you are.
> **KAEL:** It usually is.
> **KAEL:** I fixed your lamp.
> **AURA:** ...Noted. Unauthorised but useful. Temporary access granted.
> **KAEL:** What is this place?
> **AURA:** Lumen Seven. Skyward Corps maintenance hangar. Population: one frame, one assistant, and now one trespasser.

### 11.6 Chapter 6 Memory Flight (for future reference)

A playable flashback with Phantom at R5 (true flight) for 5 minutes, which teases the season's final reward. All abilities are unlocked, the HUD is gold-tinted, and Ione's voice replaces Kael's. Machines fall dark around the player. It ends with landing in the hangar cradle, which is the same pose the player first found Phantom in.

---

## 12. ENEMIES AND BOSSES (SEASON 1)

All machine enemies are **feral** (awakened without a sync and confused) or **collared** (forced by the Covenant). Feral enemies glow amber. Collared enemies glow Covenant red with a visible collar. The player never fights a willing, sane Iron God.

### 12.1 Standard enemies

| Enemy | First seen | Size | Fought by | Behaviour | Weakness |
|---|---|---|---|---|---|
| **Rustmite** | Ch1 | 0.6 m | Kael / Phantom stomp | Swarms (3–6), leaps, bites | Any hit. AURA Stun Pulse stuns a group. |
| **Sentinel Turret** | Ch1 | 1.5 m | Kael | Static, sweeping laser beam, 1.5 s lock | Reroute power panel behind it, or flank |
| **Custodian Drone** | Ch1 | 1 m flying | Kael / Phantom | Orbits, fires slow pulses | Pulse Shot. Falls when shield popped. |
| **Thornback** | Ch3 | 3 m | Phantom | Charging quadruped, root-spike attack | Dash past the charge, hit its back vent |
| **Spore Lurker** | Ch3 | 2 m | Kael / Phantom | Ambush from foliage, slows | Resonance Scan reveals (replay value) |
| **Covenant Enforcer** | Ch4 | Human | Kael (avoid) | Patrols, stun batons | Stealth, distraction. Never killed. |
| **Covenant Lancer** | Ch4 | 4 m mini-frame | Phantom | Lance charges, shield | Phase Shift through the shield. Pilot ejects. |
| **Dune Burrower** | Ch5 | 5 m | Titan / Phantom | Burrows, erupts below | Titan ground slam forces it up |
| **Binder Drone** | Ch7 | 1.2 m flying | Phantom | Tries to latch mini-collars onto Guardian or Titan | Priority target. Phase Through. |
| **Relay Warden Node** | Ch8 | 3 m | Phantom (flight) | Shield nodes on sky platforms | Resonance Scan → weak point |

### 12.2 Bosses

| Boss | Chapter | Concept | Phases | Teaching goal |
|---|---|---|---|---|
| **Lumen-7 Custodian** | 1 | 9 m security construct with four arms, rolling on a tread base in the launch tunnel | **P1:** sweeping arm swipes (dash through the telegraph), Pulse its shoulder lights. **P2 (50%):** tunnel lights cut, it charges along the tunnel, and Phantom must jump-thrust onto wall ledges and air-slash its exposed core. | Dash, lock-on, air attack |
| **Thornmother** | 3 | Huge collared machine-beast wrapped in roots | Aerial weak-point hunt → Guardian shield phase vs spore barrage → collar break | Hover, mecha switch |
| **Covenant Lancer Squad** | 4 | 3 Lancers with a captain | Separate the shield wall with Phase Shift | Phase Shift |
| **Scrap Leviathan** | 5 | Self-assembling swarm-serpent of foundry scrap | Titan grapple → Phantom hits its exposed core segments → final pull | Titan lift, team play |
| **Vanguard (Bound)** | 7, 8 | Collared VG-01. Sword, shield, command roar that buffs collared drones | Ch7: ground duel to 50%. Ch8: aerial duel → collar nodes → tuning fork → non-violent finale | Full Phantom kit, mercy choice |

### 12.3 Custodian boss details (vertical slice)

| Parameter | Value |
|---|---|
| HP | 1,200 (Normal) |
| Arena | Launch tunnel, 120 m long, 25 m wide, 18 m tall. Wall ledges every 15 m. |
| Attacks | Arm Sweep (0.6 s telegraph, 60 dmg), Overhead Slam (0.9 s, 90 dmg, shockwave jumpable), Drone Release (2 Custodian Drones), Tunnel Charge (P2, 120 dmg, avoid by wall-jump) |
| Weak points | Shoulder lamps ×4 (P1, 150 HP each). Core (P2, takes ×2 damage while exposed for 4 s after each charge) |
| Defeat | It powers down and slumps, and its light dims. AURA: "Custodian unit... resting." The Skyward Doors at the tunnel end grind open. |

---

## 13. UI / UX

### 13.1 HUD

| Element | Position | On foot | In mecha |
|---|---|---|---|
| Health | Bottom left | Kael HP bar (thin) | Mecha frame silhouette that shows damaged slots |
| Stamina / Energy | Around the health | Stamina arc (only when draining) | Energy bar with ability-cost notches |
| Objective | Top left | One line, fades after 6 s, hold a button to show it again | same |
| Compass | Top centre | Markers for objectives, fragments (if scanned) | same |
| Ability wheel | Bottom right | Multitool mode | Dash / Pulse / Special icons with cooldown |
| Sync indicator | With the mecha silhouette | — | Pulses on sync events |
| AURA hints | Lower centre subtitle | Contextual | Contextual |

**Style:** clean Concord-inspired line UI with ivory panels, gold highlights and teal accents. It is **diegetic-flavoured**: workshop menus appear as holographic panels projected by AURA.

### 13.2 Menus

- **Workshop:** 3D mecha on a turntable, slots around it, components list, Install button → hands-on install interaction.
- **Codex:** Lore (unlocked by logs), Mechas (stats, sync, fragments), Bestiary, People.
- **Map:** hand-drawn style map by Lira that fills in as regions are discovered.
- **Pause:** Resume, Save (at save points), Settings, Codex, Quit.

### 13.3 Controls (default)

| Action | Keyboard & mouse | Gamepad |
|---|---|---|
| Move / Camera | WASD / Mouse | LS / RS |
| Jump / Thrust / Glide (hold) | Space | A / Cross |
| Sprint | Left Shift | LS click |
| Dash / Dodge | Left Ctrl or Mouse 4 | B / Circle |
| Light attack | LMB | X / Square |
| Pulse Shot / Multitool scan | RMB | RT / R2 |
| Lock-on | Middle mouse / Q | RS click |
| Interact / Board | E | Y / Triangle |
| Special ability | F | RB / R1 |
| AURA command | R | LB / L1 |
| Map / Codex | M / Tab | View / Touchpad |

---

## 14. PRODUCTION ROADMAP (DETAILED)

**Assumption:** team of 1–3 developers + owner-provided character/robot art. Times are calendar weeks. Each milestone ends with a **playable build + short playtest + Git tag**.

| Milestone | Weeks | Deliverables | Definition of done |
|---|---|---|---|
| **M1 Project Foundation** | 2 | Unity 6 LTS URP project, packages (Input System, Cinemachine 3, Test Framework, ProBuilder), folder/asmdef layout, Core bootstrap scene, event channels, scale reference prefabs, Look-Dev scene, CI-free local test run, coding conventions doc | Empty scene boots via Bootstrap. EditMode test runs green. Scale prefabs in place. |
| **M2 Player & Exploration** | 3 | Kael controller, camera, interaction, AURA follow + barks, Greenhaven **greybox**, Prologue playable (greybox), dialogue runner v1 | Prologue playable start to end in greybox. Interaction prompts work on 5 object types. |
| **M3 First Mecha (Phantom)** | 4 | MechaDefinition/State, MechaController, run/sprint/jump-thrust/glide/dash, boarding/exit, mecha camera, Pulse Shot, wrist blades, greybox Phantom with slot parts | A tester can board Phantom and glide across Greenhaven greybox. Movement feels good (5-tester rating ≥ 4/5). |
| **M4 Restoration** | 3 | RestorationService (+ unit tests), components as items, install interaction, damage-state visuals, Awakening sequence (greybox cinematic), Lumen-7 greybox L1–L10 | Full Ch1 critical path playable in greybox, R0→R1 working, tests green. |
| **M5 Workshop & Inventory** | 3 | Inventory UI, Workshop scene (barn), slots/customisation v1, save/load v1 with round-trip tests, 3 Memory Fragments | Save mid-Lumen-7, reload, all state identical. |
| **M6 World & Quests** | 3 | Quest tracker, objective markers, compass, Rustmite/Sentinel/Drone AI, Custodian boss, combat tuning | Ch1 completable with combat. Boss win-rate target met. |
| **M7 Story & Progression** | 3 | All Prologue + Ch1 dialogue, VO placeholders, Sync 1 + fragments, music layers, **owner art integration pass** (Kael, AURA, Phantom), environment art pass on Greenhaven + Lumen-7 | Slice playable with final character/robot art. |
| **M8 Slice Polish & Release** | 3 | Lighting, VFX, SFX, UI polish, performance (60 fps @1080p on target mid PC), accessibility baseline, bug fixing, external playtest ×10 | Slice meets all pass criteria in 11.1. Release build tagged `v0.1-slice`. |

**Total to vertical slice: ~24 weeks.**

### 14.1 After the slice (Season 1 production outline)

| Phase | Weeks | Content |
|---|---|---|
| S1-A | 6 | Ch2 (Workshop full, hover, village side quests) |
| S1-B | 8 | Ch3 Verdant Reach + Guardian + mecha switching |
| S1-C | 8 | Ch4 Novaris + stealth layer + Phase Shift |
| S1-D | 8 | Ch5 Rustlands + Titan + lift puzzles |
| S1-E | 5 | Ch6 Archive + Memory Flight |
| S1-F | 6 | Ch7 siege |
| S1-G | 7 | Ch8 finale + Skyward Mode + Epilogue |
| S1-H | 6 | Full-season polish, balancing, localisation, release |

**Season 1 total after slice: ~54 weeks.** Re-plan after slice validation using the slice's measured velocity.

### 14.2 Owner art delivery schedule (what is needed and when)

| Needed by | Asset | Minimum for that milestone |
|---|---|---|
| M3 start (week 6) | **Phantom** base mesh + rig | Can be untextured. Bones + sockets per 3.4. |
| M4 start (week 9) | Phantom slot parts + damage variants (Back missing, Left arm missing, Head damaged) | Separate meshes |
| M5 (week 12) | Phantom ★ animation set (Section 3.4) | Locomotion + air + dash first |
| M7 start (week 18) | Kael **3D model** (rigged) built from the delivered 2D sheet, AURA, Bram, Lira, Nell, Pip, Mayor | Kael complete with mask, hood-down state, Iron Hand emissive and katana prop. NPCs can share a base. |
| M7 | Custodian boss, Rustmite, Sentinel, Custodian Drone | Or the dev team keeps greybox |
| After slice | Guardian, Titan, Vanguard, Covenant Lancer, Thornback, etc. | Per Season 1 phase |

### 14.3 Git practice

- Branch per feature (`feature/phantom-glide`), merge to `main` with a short description.
- Unity: Force Text serialization, visible meta files, Git LFS for `*.fbx, *.png, *.psd, *.wav, *.ogg`.
- Tag every milestone (`m1-foundation` … `v0.1-slice`).
- Each feature commit includes its test or a playtest note (v2.0 §12: "never claim complete without validation").

---

## 15. RISKS AND MITIGATIONS

| Risk | Impact | Mitigation |
|---|---|---|
| Flight/glide feels floaty or unreadable | Core identity fails | M3 dedicated feel pass. Tunables in a ScriptableObject for live tuning. Speed VFX + camera FOV. |
| Owner art arrives late or off-spec | Blocks M7 | Greybox-first. Intake checklist (3.5). Prefab-variant swap means art never blocks code. |
| Fast mecha outruns world streaming | Pop-in, hitches | Region scenes ≤ 1 km². Additive loading. Phantom sprint capped in hub. Fog layers hide distant LOD. |
| Scope creep into the full open world | Slice never ships | v2.0 rule: no Ch2+ production before slice validation. Cut list (11.3). |
| Restoration feels like menus | Pillar fails | Hands-on install interaction + visible model change + cinematic per stage (10.7 feel rule). |
| Two control modes split the player's attention | Confusion | Distinct camera distance, HUD, music layer and audio "boarding" sting per mode. |
| Story too long to produce as cinematics | Cost | In-engine, in-gameplay dialogue with minimal camera cuts. Only 4 full cinematics in Season 1 (Light Pillar, Awakening, Memory Flight, Eclipse). |

---

## 16. DECISIONS LOG AND OPEN QUESTIONS

### 16.1 Decisions (recorded)

| ID | Date | Decision | Reason |
|---|---|---|---|
| D-01 | 2026-11-19 | Phantom replaces Vanguard as first/primary mecha | Owner direction. Speed and flight give a stronger "restoration = new movement" loop. |
| D-02 | 2026-11-19 | Character/robot art is owner-provided. GDD defines function, not appearance. | Owner direction |
| D-03 | 2026-11-19 | Existing web prototype story (Valhalla / the Ark / multiverse, `docs/CHAPTER_0_*.md`) and its 2D side-scroller Unity scaffolding are **not** part of Eclipse of the Iron Gods unless the owner says otherwise | Avoid two conflicting canons. Third-person 3D needs a different code layout. |
| D-04 | 2026-11-19 | Season 1 = Prologue + 8 chapters + Epilogue. Vanguard is the Season 1 antagonist-machine and Season 2 restoration. | Keeps roster at 3 recovered + 1 freed. Gives the season a mercy-based climax. |
| D-05 | 2026-11-19 | Hub-and-region world structure for Season 1 | Scope control while still "interconnected regions" |
| D-06 | 2026-11-19 | No third-party dialogue/behaviour-tree plugins in Season 1 | Avoid unnecessary dependencies (v2.0 §8) |
| D-07 | 2026-11-20 | Kael's canonical look is the owner sheet (`assets/concepts/characters/CHR_Kael_sheet.png`): age 20, 1.79 m, katana + mechanical gauntlet. Iron Hand backstory added; wrench melee replaced by katana. | Owner-provided asset |

### 16.2 Open questions for the owner

1. **Phantom's final look:** which delivered model is Phantom, and what is its accent colour? (Drives emissive palette, trails, UI tint.)
2. **AURA's form:** floating orb/drone or small legged robot? (Changes traversal code and animation list.)
3. **Kael's voice:** fully voiced, partly voiced (barks only), or text only for the slice?
8. **Kael's Iron Hand:** is the mechanical gauntlet on the right arm only (prosthetic), or are both forearms armoured? Which hand draws the katana? The backstory assumes a right-arm prosthetic.
9. **Kael's mask:** keep the burn-scar reason and the one-time unmasking at the Season 1 climax, or should the mask stay on for the whole saga?
4. **Valhalla and the existing web prototype:** retire it, or keep Valhalla as a future Iron God (e.g., a Season 2 recovery)?
5. **Robot roster beyond Season 1:** which of your future robot assets should map to Guardian, Titan and Vanguard? Do you want to rename any of them?
6. **Target hardware:** is "mid-range PC at 60 fps, 1080p" the right bar?
7. **Rating target:** this document assumes an all-ages / teen-friendly tone (no blood, non-lethal humans). Confirm.

---

## 17. GLOSSARY

| Term | Meaning |
|---|---|
| Aethoria | The world |
| Aurelian Concord | The Machine Age civilisation |
| AURA | Kael's companion robot |
| Binder Collar | Covenant device that forces a machine awake and obedient |
| Dock Point | Glowing pad where Kael boards/exits a mecha inside facilities |
| Eclipse Protocol | The deliberate shutdown that caused the Great Silence |
| First Light | Living energy crystal that powers Iron Gods |
| Iron God | A First Light-powered great machine |
| Iron Hand | Kael's prosthetic gauntlet, built by Bram around a sliver of First Light |
| Hearthblade | Kael's katana, forged at Bram's Forge |
| Lumen-7 | The Skyward Corps hangar under Whisperfall Hill |
| Memory Fragment | A dormant machine's dream, collectible |
| Restoration Stage (R0–R5) | Phantom's restoration level |
| Skyward Mode | Phantom's true flight (Ch8) |
| Sync Level (0–5) | Trust bond between pilot and mecha |
| The Warden | Intelligence behind the Silence (Old Capital) |

---

*End of Season 1 GDD v3.0. Update this file and not copies. Record every significant change in Section 16.*
