/**
 * MECHARISE — 2D Keyboard Action RPG
 * Powered by GX-01 "VALHALLA" transparent sprite frames & Chapter 01 backgrounds.
 */

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// --- 1. ASSET MANIFEST & PRELOADER ---
const STAGES = [
  { name: "SECTOR 01: INDUSTRIAL HANGAR", bg: "ch01_bg_01_industrial_hangar.png", enemies: 3, boss: false },
  { name: "SECTOR 02: MECH CHAMBER", bg: "ch01_bg_02_mech_chamber.png", enemies: 4, boss: false },
  { name: "SECTOR 03: DAMAGED CORRIDOR", bg: "ch01_bg_03_damaged_corridor.png", enemies: 4, boss: false },
  { name: "SECTOR 04: REACTOR CHASM", bg: "ch01_bg_04_reactor_chasm.png", enemies: 5, boss: false },
  { name: "SECTOR 05: SUNSET CITY RUINS", bg: "ch01_bg_05_sunset_city_ruins.png", enemies: 5, boss: false },
  { name: "SECTOR 06: ECLIPSE WASTELAND", bg: "ch01_bg_06_eclipse_wasteland.png", enemies: 2, boss: true }
];

const ANIM_CONFIG = {
  idle: { count: 7, fps: 8, loop: true },
  walk: { count: 8, fps: 10, loop: true },
  run: { count: 8, fps: 14, loop: true },
  dash_boost: { count: 6, fps: 16, loop: false },
  jump: { count: 8, fps: 12, loop: false },
  fall: { count: 4, fps: 10, loop: true },
  land: { count: 4, fps: 16, loop: false },
  crouch: { count: 4, fps: 12, loop: false, holdLast: true },
  crouch_walk: { count: 6, fps: 10, loop: true },
  dodge_evade: { count: 6, fps: 16, loop: false },
  melee_combo: { count: 8, fps: 16, loop: false },
  ranged_shoot: { count: 8, fps: 16, loop: false },
  charged_shot: { count: 7, fps: 12, loop: false },
  special_barrage: { count: 6, fps: 12, loop: false },
  aerial_attack: { count: 4, fps: 14, loop: false },
  ground_slam: { count: 5, fps: 14, loop: false },
  ultimate_orbital_strike: { count: 6, fps: 10, loop: false }
};

const Assets = {
  backgrounds: [],
  animations: {},
  effects: [],
  loaded: false
};

function pad2(n) {
  return String(n).padStart(2, "0");
}

function preloadAssets() {
  const promises = [];

  // Load 6 Chapter 1 backgrounds
  STAGES.forEach((stage, i) => {
    const img = new Image();
    img.src = `assets/backgrounds/chapter_01/${stage.bg}`;
    Assets.backgrounds[i] = img;
    promises.push(new Promise(res => { img.onload = res; img.onerror = res; }));
  });

  // Load Valhalla animation frames
  Object.entries(ANIM_CONFIG).forEach(([name, cfg]) => {
    Assets.animations[name] = [];
    for (let i = 1; i <= cfg.count; i++) {
      const img = new Image();
      img.src = `assets/frames/${name}/${name}_${pad2(i)}.png`;
      Assets.animations[name].push(img);
      promises.push(new Promise(res => { img.onload = res; img.onerror = res; }));
    }
  });

  // Load 19 effect frames
  for (let i = 1; i <= 19; i++) {
    const img = new Image();
    img.src = `assets/frames/effects/effects_${pad2(i)}.png`;
    Assets.effects.push(img);
    promises.push(new Promise(res => { img.onload = res; img.onerror = res; }));
  }

  return Promise.all(promises).then(() => {
    Assets.loaded = true;
  });
}

// --- 2. INPUT HANDLER ---
const Keys = {};
const JustPressed = {};

window.addEventListener("keydown", (e) => {
  const k = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) {
    e.preventDefault();
  }
  if (!Keys[k]) JustPressed[k] = true;
  Keys[k] = true;

  // Stage quick select 1-6
  if (k >= "1" && k <= "6") {
    loadStage(parseInt(k, 10) - 1);
  }
  if (k === "enter" && Game.stageCleared) {
    const next = (Game.stageIndex + 1) % STAGES.length;
    loadStage(next);
  }
  if (k === "r" && Game.gameOver) {
    resetPlayer();
    loadStage(Game.stageIndex);
  }
});

window.addEventListener("keyup", (e) => {
  Keys[e.key.toLowerCase()] = false;
});

function clearJustPressed() {
  for (const k in JustPressed) delete JustPressed[k];
}

// --- 3. GAME STATE & ENTITIES ---
const WORLD_WIDTH = 2172;
const GROUND_Y = 472;
const SPRITE_SCALE = 2.25;

const Game = {
  stageIndex: 0,
  cameraX: 0,
  stageCleared: false,
  gameOver: false,
  scrap: 0,
  xp: 0,
  level: 1,
  shakeTimer: 0,
  shakePower: 0,
  enemies: [],
  projectiles: [],
  vfx: [],
  popups: [],
  afterimages: []
};

const Player = {
  x: 240,
  y: GROUND_Y,
  vx: 0,
  vy: 0,
  facing: 1, // 1 right, -1 left
  grounded: true,
  state: "idle",
  frameIndex: 0,
  frameTimer: 0,
  actionLock: false,
  attackHitDone: false,
  invulnTimer: 0,

  maxHp: 500,
  hp: 500,
  maxEn: 100,
  en: 100,
  heat: 0,
  overheated: false,
  overdrive: 25
};

function resetPlayer() {
  Player.hp = Player.maxHp;
  Player.en = Player.maxEn;
  Player.heat = 0;
  Player.overheated = false;
  Player.x = 240;
  Player.y = GROUND_Y;
  Player.vx = 0;
  Player.vy = 0;
  Player.grounded = true;
  Player.actionLock = false;
  Player.state = "idle";
  Game.gameOver = false;
}

// --- 4. STAGE & ENEMY SPAWNER ---
function loadStage(index) {
  Game.stageIndex = index;
  Game.stageCleared = false;
  Game.enemies = [];
  Game.projectiles = [];
  Game.vfx = [];
  Game.afterimages = [];

  Player.x = 220;
  Player.y = GROUND_Y;
  Player.vx = 0;
  Player.vy = 0;
  Player.grounded = true;
  Player.actionLock = false;
  Player.state = "idle";
  Game.cameraX = 0;

  const stage = STAGES[index];
  document.getElementById("sector-title").innerText = stage.name;
  document.getElementById("center-banner").classList.add("hidden");

  document.querySelectorAll(".stage-pill").forEach((el, idx) => {
    el.classList.toggle("active", idx === index);
  });

  // Spawn enemies across the 2172px stage
  for (let i = 0; i < stage.enemies; i++) {
    const isHeavy = i % 2 === 1;
    Game.enemies.push({
      id: i,
      type: isHeavy ? "HEAVY SENTINEL" : "SCOUT DRONE",
      isBoss: false,
      x: 680 + i * 320,
      y: isHeavy ? GROUND_Y : GROUND_Y - 75,
      baseY: isHeavy ? GROUND_Y : GROUND_Y - 75,
      w: isHeavy ? 68 : 48,
      h: isHeavy ? 92 : 48,
      maxHp: (isHeavy ? 280 : 140) + index * 45,
      hp: (isHeavy ? 280 : 140) + index * 45,
      vx: 0,
      facing: -1,
      shootTimer: 90 + i * 35,
      hurtTimer: 0,
      bobPhase: i * 1.3
    });
  }

  // Sector 6 Boss
  if (stage.boss) {
    Game.enemies.push({
      id: 99,
      type: "AEGIS COLOSSUS MK-IV",
      isBoss: true,
      x: 1750,
      y: GROUND_Y,
      baseY: GROUND_Y,
      w: 130,
      h: 175,
      maxHp: 2200,
      hp: 2200,
      vx: 0,
      facing: -1,
      shootTimer: 70,
      hurtTimer: 0,
      bobPhase: 0
    });
  }

  logFeed(`[SYS] Deployed to ${stage.name}. Eliminate all hostiles!`);
  updateHUD();
}

// --- 5. PLAYER STATE MACHINE & KEYBOARD CONTROLS ---
function setState(newState, lock = false) {
  if (Player.state === newState && ANIM_CONFIG[newState].loop) return;
  Player.state = newState;
  Player.frameIndex = 0;
  Player.frameTimer = 0;
  Player.actionLock = lock;
  Player.attackHitDone = false;
}

function handlePlayerInput(dt) {
  if (Game.gameOver) return;

  // Passive Energy & Heat cooling
  Player.en = Math.min(Player.maxEn, Player.en + 8 * dt);
  if (Player.heat > 0) {
    Player.heat = Math.max(0, Player.heat - (Player.overheated ? 24 : 14) * dt);
    if (Player.overheated && Player.heat <= 20) {
      Player.overheated = false;
      logFeed("[COOLING] Reactor heat stabilized. Heavy weapons online.");
    }
  }
  if (Player.invulnTimer > 0) Player.invulnTimer -= dt;

  const moveLeft = Keys["a"] || Keys["arrowleft"];
  const moveRight = Keys["d"] || Keys["arrowright"];
  const crouchHeld = Keys["s"] || Keys["arrowdown"];
  const jumpPressed = JustPressed["w"] || JustPressed["arrowup"] || JustPressed[" "];
  const runHeld = Keys["shift"];

  // Combat & Mobility Triggers (can interrupt idle/walk/run/crouch)
  if (!Player.actionLock) {
    // Ultimate Orbital Strike [P]
    if (JustPressed["p"]) {
      if (Player.overdrive >= 100) {
        Player.overdrive = 0;
        Player.invulnTimer = 1.0;
        Player.vx = 0;
        setState("ultimate_orbital_strike", true);
        logFeed("[ULTIMATE] GX-01 VALHALLA: ORBITAL STRIKE ENGAGED!");
        return;
      } else {
        logFeed(`[SYS] Overdrive at ${Math.floor(Player.overdrive)}% (Needs 100%).`);
      }
    }

    // Dodge / Evade [K]
    if (JustPressed["k"] && Player.en >= 10) {
      Player.en -= 10;
      Player.invulnTimer = 0.45;
      Player.vx = Player.facing * 520;
      setState("dodge_evade", true);
      return;
    }

    // Dash / Boost [L]
    if (JustPressed["l"] && Player.en >= 12) {
      Player.en -= 12;
      Player.vx = Player.facing * 640;
      setState("dash_boost", true);
      return;
    }

    // Melee / Aerial Attack / Ground Slam [J]
    if (JustPressed["j"]) {
      if (!Player.grounded) {
        if (crouchHeld) {
          Player.vy = 780;
          setState("ground_slam", true);
        } else {
          setState("aerial_attack", true);
        }
      } else {
        Player.vx = Player.facing * 140;
        setState("melee_combo", true);
      }
      return;
    }

    // Ranged Shoot [U]
    if (JustPressed["u"] && Player.en >= 8) {
      Player.en -= 8;
      Player.vx = 0;
      setState("ranged_shoot", true);
      return;
    }

    // Charged Shot [I]
    if (JustPressed["i"] && Player.en >= 25 && !Player.overheated) {
      Player.en -= 25;
      addHeat(30);
      Player.vx = 0;
      setState("charged_shot", true);
      return;
    }

    // Special Barrage [O]
    if (JustPressed["o"] && Player.en >= 35 && !Player.overheated) {
      Player.en -= 35;
      addHeat(40);
      Player.vx = 0;
      setState("special_barrage", true);
      return;
    }

    // Jump [W / Up / Space]
    if (jumpPressed && Player.grounded) {
      Player.grounded = false;
      Player.vy = -590;
      setState("jump", false);
    }

    // Horizontal Movement
    let dir = 0;
    if (moveLeft) dir -= 1;
    if (moveRight) dir += 1;

    if (dir !== 0) Player.facing = dir;

    if (Player.grounded) {
      if (crouchHeld) {
        if (dir !== 0) {
          Player.vx = dir * 135;
          setState("crouch_walk", false);
        } else {
          Player.vx = 0;
          setState("crouch", false);
        }
      } else if (dir !== 0) {
        const speed = runHeld ? 370 : 210;
        Player.vx = dir * speed;
        setState(runHeld ? "run" : "walk", false);
      } else {
        Player.vx = 0;
        if (Player.state !== "land") setState("idle", false);
      }
    } else {
      // Air control
      if (dir !== 0) Player.vx = dir * 260;
      else Player.vx *= 0.94;
    }
  } else {
    // Friction during locked actions
    if (Player.state !== "dash_boost" && Player.state !== "dodge_evade") {
      Player.vx *= 0.88;
    }
  }
}

function addHeat(amount) {
  Player.heat = Math.min(100, Player.heat + amount);
  if (Player.heat >= 100) {
    Player.overheated = true;
    logFeed("[WARNING] OVERHEAT! Heavy skills temporarily locked!");
  }
}

function addOverdrive(amount) {
  Player.overdrive = Math.min(100, Player.overdrive + amount);
}

// --- 6. PHYSICS, ANIMATIONS & ATTACK EVENTS ---
function updatePlayer(dt) {
  // Gravity
  if (!Player.grounded) {
    Player.vy += 1450 * dt;
    Player.y += Player.vy * dt;

    if (Player.vy > 40 && !Player.actionLock && Player.state === "jump") {
      setState("fall", false);
    }

    if (Player.y >= GROUND_Y) {
      Player.y = GROUND_Y;
      Player.vy = 0;
      Player.grounded = true;
      if (Player.state === "ground_slam") {
        triggerSlamImpact();
      } else if (!Player.actionLock) {
        setState("land", true);
      }
    }
  }

  Player.x += Player.vx * dt;
  Player.x = Math.max(50, Math.min(WORLD_WIDTH - 50, Player.x));

  // Spawn afterimages when dashing or evading
  if ((Player.state === "dash_boost" || Player.state === "dodge_evade") && Math.random() < 0.55) {
    const frames = Assets.animations[Player.state];
    const img = frames[Player.frameIndex];
    if (img) {
      Game.afterimages.push({
        img,
        x: Player.x,
        y: Player.y,
        facing: Player.facing,
        alpha: 0.55
      });
    }
  }

  // Advance Sprite Frame
  const cfg = ANIM_CONFIG[Player.state];
  Player.frameTimer += dt;
  const frameDuration = 1 / cfg.fps;

  if (Player.frameTimer >= frameDuration) {
    Player.frameTimer -= frameDuration;
    Player.frameIndex++;

    // Trigger attack frames at key moments
    handleAttackFrameEvents();

    if (Player.frameIndex >= cfg.count) {
      if (cfg.loop) {
        Player.frameIndex = 0;
      } else if (cfg.holdLast) {
        Player.frameIndex = cfg.count - 1;
      } else {
        Player.frameIndex = cfg.count - 1;
        Player.actionLock = false;
        setState(Player.grounded ? "idle" : "fall", false);
      }
    }
  }

  // Smooth Camera follow
  const targetCam = Math.max(0, Math.min(WORLD_WIDTH - canvas.width, Player.x - canvas.width * 0.38));
  Game.cameraX += (targetCam - Game.cameraX) * 0.12;
}

function handleAttackFrameEvents() {
  if (Player.attackHitDone) return;

  if (Player.state === "melee_combo" && Player.frameIndex === 4) {
    Player.attackHitDone = true;
    const dmg = 55 + Game.level * 10;
    dealMeleeHit(135, dmg, 6);
    spawnVFX(4, Player.x + Player.facing * 75, Player.y - 68, 2.0, Player.facing);
  }
  else if (Player.state === "aerial_attack" && Player.frameIndex === 2) {
    Player.attackHitDone = true;
    const dmg = 65 + Game.level * 10;
    dealMeleeHit(140, dmg, 6);
    spawnVFX(5, Player.x + Player.facing * 65, Player.y - 55, 2.0, Player.facing);
  }
  else if (Player.state === "ranged_shoot" && Player.frameIndex === 3) {
    Player.attackHitDone = true;
    spawnProjectile(Player.x + Player.facing * 50, Player.y - 78, Player.facing * 760, 0, 42 + Game.level * 6, 1, 1.8);
  }
  else if (Player.state === "charged_shot" && Player.frameIndex === 4) {
    Player.attackHitDone = true;
    spawnProjectile(Player.x + Player.facing * 60, Player.y - 75, Player.facing * 920, 0, 130 + Game.level * 15, 2, 2.7, true);
    triggerShake(6, 12);
  }
  else if (Player.state === "special_barrage" && Player.frameIndex === 3) {
    Player.attackHitDone = true;
    for (let i = -1; i <= 1; i++) {
      spawnProjectile(Player.x + Player.facing * 50, Player.y - 80, Player.facing * 680, i * 110, 52 + Game.level * 8, 0, 1.7);
    }
    triggerShake(5, 10);
  }
  else if (Player.state === "ultimate_orbital_strike" && Player.frameIndex === 3) {
    Player.attackHitDone = true;
    triggerOrbitalStrike();
  }
}

function triggerSlamImpact() {
  Player.actionLock = false;
  setState("land", true);
  triggerShake(10, 18);
  spawnVFX(10, Player.x, GROUND_Y - 60, 2.5, 1);
  dealMeleeHit(190, 95 + Game.level * 12, 10);
}

function triggerOrbitalStrike() {
  triggerShake(14, 28);
  // Hit all visible enemies on screen
  Game.enemies.forEach((en) => {
    if (Math.abs(en.x - Player.x) < 820) {
      spawnVFX(9, en.x, GROUND_Y - 120, 3.2, 1);
      spawnVFX(18, en.x, en.y - 40, 2.5, 1);
      damageEnemy(en, 340 + Game.level * 30, "#e879f9");
    }
  });
}

function dealMeleeHit(reach, dmg, enGain) {
  let hitAny = false;
  Game.enemies.forEach((en) => {
    const dx = (en.x - Player.x) * Player.facing;
    const dy = Math.abs(en.y - Player.y);
    if (dx > -40 && dx < reach && dy < 110) {
      damageEnemy(en, dmg, "#22d3ee");
      hitAny = true;
    }
  });
  if (hitAny) {
    Player.en = Math.min(Player.maxEn, Player.en + enGain);
    addOverdrive(10);
    triggerShake(4, 8);
  }
}

function damageEnemy(en, dmg, color = "#f87171") {
  en.hp -= dmg;
  en.hurtTimer = 10;
  addOverdrive(5);
  Game.popups.push({ x: en.x, y: en.y - en.h - 10, text: `-${dmg}`, color, life: 40 });
  spawnVFX(3, en.x, en.y - en.h * 0.5, 1.5, 1);

  if (en.hp <= 0) {
    spawnVFX(18, en.x, en.y - en.h * 0.5, 2.6, 1);
    triggerShake(8, 14);
    Game.scrap += en.isBoss ? 250 : 25;
    Game.xp += en.isBoss ? 200 : 35;
    if (Game.xp >= Game.level * 100) {
      Game.xp -= Game.level * 100;
      Game.level++;
      Player.maxHp += 50;
      Player.hp = Player.maxHp;
      logFeed(`[LEVEL UP] GX-01 Valhalla reached LV.${Game.level}! Armor restored.`);
    }
  }
}

function spawnProjectile(x, y, vx, vy, dmg, fxIdx, scale, piercing = false) {
  Game.projectiles.push({
    x, y, vx, vy, dmg, fxIdx, scale, piercing,
    fromPlayer: true,
    life: 90,
    hitIds: new Set()
  });
}

function spawnVFX(startFrameIdx, x, y, scale = 2, facing = 1) {
  Game.vfx.push({
    frameIdx: startFrameIdx,
    endFrameIdx: Math.min(18, startFrameIdx + 2),
    x, y, scale, facing,
    timer: 0
  });
}

// --- 7. ENEMIES & PROJECTILES UPDATE ---
function updateEnemies(dt) {
  for (let i = Game.enemies.length - 1; i >= 0; i--) {
    const en = Game.enemies[i];
    if (en.hp <= 0) {
      Game.enemies.splice(i, 1);
      continue;
    }

    if (en.hurtTimer > 0) en.hurtTimer--;
    en.bobPhase += dt * 3;
    if (!en.isBoss && en.baseY < GROUND_Y) {
      en.y = en.baseY + Math.sin(en.bobPhase) * 8;
    }

    const dist = Player.x - en.x;
    en.facing = dist >= 0 ? 1 : -1;

    // Move closer if within aggro range
    if (Math.abs(dist) < 700 && Math.abs(dist) > (en.isBoss ? 220 : 180)) {
      en.x += en.facing * (en.isBoss ? 55 : 80) * dt;
    }

    // Shoot at player
    if (Math.abs(dist) < 680) {
      en.shootTimer -= dt * 60;
      if (en.shootTimer <= 0) {
        en.shootTimer = en.isBoss ? 75 : 130;
        Game.projectiles.push({
          x: en.x + en.facing * 35,
          y: en.y - en.h * 0.55,
          vx: en.facing * (en.isBoss ? 480 : 390),
          vy: 0,
          dmg: en.isBoss ? 55 : 28,
          fromPlayer: false,
          life: 120,
          scale: en.isBoss ? 2.2 : 1.5
        });
      }
    }
  }

  // Check stage clear
  if (!Game.stageCleared && Game.enemies.length === 0) {
    Game.stageCleared = true;
    const banner = document.getElementById("center-banner");
    document.getElementById("banner-title").innerText = "SECTOR CLEARED";
    document.getElementById("banner-sub").innerText = "Press [ENTER] to advance to next sector";
    banner.classList.remove("hidden");
    logFeed("[VICTORY] Sector hostiles neutralized! Press [ENTER] for next sector.");
  }
}

function updateProjectiles(dt) {
  for (let i = Game.projectiles.length - 1; i >= 0; i--) {
    const p = Game.projectiles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.life--;

    if (p.life <= 0 || p.x < 0 || p.x > WORLD_WIDTH) {
      Game.projectiles.splice(i, 1);
      continue;
    }

    if (p.fromPlayer) {
      let consumed = false;
      for (const en of Game.enemies) {
        if (p.hitIds.has(en.id)) continue;
        if (Math.abs(p.x - en.x) < en.w * 0.65 && p.y > en.y - en.h && p.y < en.y + 10) {
          p.hitIds.add(en.id);
          damageEnemy(en, p.dmg, "#c084fc");
          if (!p.piercing) {
            consumed = true;
            break;
          }
        }
      }
      if (consumed) Game.projectiles.splice(i, 1);
    } else {
      // Enemy projectile hitting Player (crouch ducks high shots!)
      const playerTop = Player.state === "crouch" || Player.state === "crouch_walk" ? Player.y - 55 : Player.y - 115;
      if (Player.invulnTimer <= 0 && Math.abs(p.x - Player.x) < 34 && p.y > playerTop && p.y < Player.y) {
        Player.hp = Math.max(0, Player.hp - p.dmg);
        Player.invulnTimer = 0.5;
        triggerShake(6, 10);
        Game.popups.push({ x: Player.x, y: Player.y - 125, text: `-${p.dmg}`, color: "#ef4444", life: 40 });
        Game.projectiles.splice(i, 1);

        if (Player.hp <= 0) {
          Game.gameOver = true;
          const banner = document.getElementById("center-banner");
          document.getElementById("banner-title").innerText = "CRITICAL FAILURE";
          document.getElementById("banner-sub").innerText = "Press [R] to redeploy GX-01 Valhalla";
          banner.classList.remove("hidden");
          logFeed("[ALERT] GX-01 Valhalla armor breached! Press [R] to retry.");
        }
      }
    }
  }
}

function updateEffects(dt) {
  for (let i = Game.vfx.length - 1; i >= 0; i--) {
    const v = Game.vfx[i];
    v.timer += dt;
    if (v.timer >= 0.06) {
      v.timer = 0;
      v.frameIdx++;
      if (v.frameIdx > v.endFrameIdx) Game.vfx.splice(i, 1);
    }
  }

  for (let i = Game.afterimages.length - 1; i >= 0; i--) {
    Game.afterimages[i].alpha -= 2.4 * dt;
    if (Game.afterimages[i].alpha <= 0) Game.afterimages.splice(i, 1);
  }

  for (let i = Game.popups.length - 1; i >= 0; i--) {
    Game.popups[i].y -= 35 * dt;
    Game.popups[i].life--;
    if (Game.popups[i].life <= 0) Game.popups.splice(i, 1);
  }

  if (Game.shakeTimer > 0) Game.shakeTimer--;
  else Game.shakePower = 0;
}

function triggerShake(power, frames) {
  Game.shakePower = power;
  Game.shakeTimer = frames;
}

// --- 8. RENDER PIPELINE ---
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.save();

  if (Game.shakePower > 0) {
    ctx.translate((Math.random() - 0.5) * Game.shakePower * 2, (Math.random() - 0.5) * Game.shakePower * 2);
  }

  // 1. Background (2172x724 scaled cleanly to 540px height)
  const bg = Assets.backgrounds[Game.stageIndex];
  if (bg && bg.complete && bg.naturalWidth > 0) {
    const scaleY = canvas.height / bg.naturalHeight;
    const srcX = (Game.cameraX / scaleY) * 0.72;
    const srcW = canvas.width / scaleY;
    ctx.drawImage(bg, srcX, 0, srcW, bg.naturalHeight, 0, 0, canvas.width, canvas.height);
  }

  ctx.translate(-Game.cameraX, 0);

  // Subtle ground shadow plane
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, GROUND_Y, WORLD_WIDTH, 70);

  // 2. Afterimages
  Game.afterimages.forEach((a) => {
    ctx.save();
    ctx.globalAlpha = a.alpha;
    drawSpriteCenteredBottom(a.img, a.x, a.y, SPRITE_SCALE, a.facing);
    ctx.restore();
  });

  // 3. Enemies
  Game.enemies.forEach(drawEnemy);

  // 4. Player GX-01 VALHALLA
  const frames = Assets.animations[Player.state] || Assets.animations.idle;
  const sprite = frames[Player.frameIndex % frames.length];
  if (sprite && sprite.complete) {
    ctx.save();
    if (Player.invulnTimer > 0 && Math.floor(Player.invulnTimer * 20) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }
    // Ground shadow
    ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
    ctx.beginPath();
    ctx.ellipse(Player.x, GROUND_Y + 4, 34, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    drawSpriteCenteredBottom(sprite, Player.x, Player.y, SPRITE_SCALE, Player.facing);
    ctx.restore();
  }

  // 5. Projectiles
  Game.projectiles.forEach((p) => {
    if (p.fromPlayer) {
      const fx = Assets.effects[p.fxIdx];
      if (fx && fx.complete) {
        drawSpriteCentered(fx, p.x, p.y, p.scale, p.vx >= 0 ? 1 : -1);
      }
    } else {
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 7 * p.scale * 0.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fef08a";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3.5 * p.scale * 0.6, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // 6. VFX
  Game.vfx.forEach((v) => {
    const fx = Assets.effects[v.frameIdx];
    if (fx && fx.complete) {
      drawSpriteCentered(fx, v.x, v.y, v.scale, v.facing);
    }
  });

  // 7. Damage Popups
  Game.popups.forEach((pop) => {
    ctx.font = "bold 20px 'JetBrains Mono', monospace";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.strokeText(pop.text, pop.x - 16, pop.y);
    ctx.fillStyle = pop.color;
    ctx.fillText(pop.text, pop.x - 16, pop.y);
  });

  ctx.restore();
}

function drawSpriteCenteredBottom(img, x, y, scale, facing) {
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(img, -w / 2, -h, w, h);
  ctx.restore();
}

function drawSpriteCentered(img, x, y, scale, facing) {
  const w = img.naturalWidth * scale;
  const h = img.naturalHeight * scale;
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(facing, 1);
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

function drawEnemy(en) {
  ctx.save();
  if (en.hurtTimer > 0) ctx.filter = "brightness(2.5)";

  // Shadow
  ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
  ctx.beginPath();
  ctx.ellipse(en.x, GROUND_Y + 4, en.w * 0.48, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  const x = en.x;
  const y = en.y;

  if (en.isBoss) {
    // Boss Mech Silhouette
    ctx.fillStyle = "#31102f";
    ctx.strokeStyle = "#f43f5e";
    ctx.lineWidth = 3;
    ctx.fillRect(x - 52, y - 165, 104, 120);
    ctx.strokeRect(x - 52, y - 165, 104, 120);
    // Legs
    ctx.fillStyle = "#1e1b2e";
    ctx.fillRect(x - 42, y - 45, 28, 45);
    ctx.fillRect(x + 14, y - 45, 28, 45);
    // Glowing Core & Visor
    ctx.fillStyle = "#fb7185";
    ctx.fillRect(x - 18, y - 150, 36, 12);
    ctx.fillStyle = "#a855f7";
    ctx.beginPath();
    ctx.arc(x, y - 105, 16, 0, Math.PI * 2);
    ctx.fill();
  } else if (en.type === "HEAVY SENTINEL") {
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#f59e0b";
    ctx.lineWidth = 2;
    ctx.fillRect(x - 28, y - 88, 56, 60);
    ctx.strokeRect(x - 28, y - 88, 56, 60);
    ctx.fillRect(x - 20, y - 28, 14, 28);
    ctx.fillRect(x + 6, y - 28, 14, 28);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x + en.facing * 8 - 8, y - 76, 16, 6);
  } else {
    // Scout Drone
    ctx.fillStyle = "#1e293b";
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x, y - 24, 24, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#f43f5e";
    ctx.beginPath();
    ctx.arc(x + en.facing * 10, y - 24, 5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Enemy HP bar above unit
  if (!en.isBoss) {
    const bw = 54;
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(x - bw / 2, y - en.h - 14, bw, 6);
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(x - bw / 2, y - en.h - 14, bw * Math.max(0, en.hp / en.maxHp), 6);
  }

  ctx.restore();
}

// --- 9. HUD SYNC & MAIN LOOP ---
function updateHUD() {
  document.getElementById("hp-fill").style.width = `${(Player.hp / Player.maxHp) * 100}%`;
  document.getElementById("hp-text").innerText = `${Math.ceil(Player.hp)}/${Player.maxHp}`;
  document.getElementById("en-fill").style.width = `${(Player.en / Player.maxEn) * 100}%`;
  document.getElementById("en-text").innerText = `${Math.floor(Player.en)}/${Player.maxEn}`;
  document.getElementById("heat-fill").style.width = `${Player.heat}%`;
  document.getElementById("heat-text").innerText = `${Math.floor(Player.heat)}%`;
  document.getElementById("od-fill").style.width = `${Player.overdrive}%`;
  document.getElementById("od-text").innerText = `${Math.floor(Player.overdrive)}%`;

  document.getElementById("stat-lv").innerText = Game.level;
  document.getElementById("stat-scrap").innerText = Game.scrap;
  document.getElementById("stat-state").innerText = Player.state.toUpperCase();
  document.getElementById("wave-info").innerText = `HOSTILES: ${Game.enemies.length}`;

  const boss = Game.enemies.find(e => e.isBoss);
  const bossHud = document.getElementById("boss-hud");
  if (boss) {
    bossHud.classList.remove("hidden");
    document.getElementById("boss-name").innerText = boss.type;
    document.getElementById("boss-hp-fill").style.width = `${(boss.hp / boss.maxHp) * 100}%`;
    document.getElementById("boss-hp-text").innerText = `${Math.max(0, boss.hp)} / ${boss.maxHp}`;
  } else {
    bossHud.classList.add("hidden");
  }
}

function logFeed(msg) {
  document.getElementById("combat-feed").innerText = msg;
}

let lastTime = performance.now();
function loop(now) {
  const dt = Math.min(0.05, (now - lastTime) / 1000);
  lastTime = now;

  if (Assets.loaded) {
    handlePlayerInput(dt);
    updatePlayer(dt);
    updateEnemies(dt);
    updateProjectiles(dt);
    updateEffects(dt);
    render();
    updateHUD();
  }

  clearJustPressed();
  requestAnimationFrame(loop);
}

// Stage pill click handlers
document.querySelectorAll(".stage-pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    loadStage(parseInt(btn.dataset.stage, 10));
    btn.blur();
  });
});

preloadAssets();
Assets.loaded = true;
loadStage(0);
requestAnimationFrame(loop);
