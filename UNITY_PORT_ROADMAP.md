# Project: Iron Core - Web Prototype to Unity Port Roadmap

This document outlines the architectural mapping between the current HTML5/JS prototype and the future Unity C# implementation.

---

## 1. Data Model Mapping (JavaScript to C# ScriptableObjects)

| Web Prototype (JS) | Unity C# Equivalent | Purpose |
| :--- | :--- | :--- |
| `GameState.playerMech` | `MechChassisData.cs` (`ScriptableObject`) | Base frame stats: Max Armor, Reactor MW, Max Heat, Hardpoints |
| `inventory[i]` / `hardpoints.*` | `MechPartItem.cs` (`ScriptableObject`) | Weapon/mod stats: AP cost, Heat generation, Damage, Slot type |
| `ENEMY_TEMPLATES` | `EnemyConfig.cs` (`ScriptableObject`) | Enemy stats, component health pools, attack patterns |
| `GameState.credits / scrap` | `PlayerProfile.cs` (`MonoBehaviour` / Save Data) | Currency, salvage resources, and unlocked garage gear |

---

## 2. Combat Loop & Mechanics Mapping

| Feature | Web Prototype Implementation | Unity Architecture |
| :--- | :--- | :--- |
| **Component Targeting** | `GameState.selectedTargetPart` (click buttons) | Raycast on 2D Collider / 3D Mech hitboxes or UI sub-target list |
| **Heat & AP Limits** | Checked inside `canAfford` in `updateCombatUI()` | `TurnActionManager.cs`: Validates AP and Heat threshold before executing action |
| **Turn Cycle** | `endTurn()` -> `executeEnemyTurn()` timeout | Coroutine / State Machine (`TurnStateMachine.cs`): PlayerTurn -> EnemyTurn -> Resolution |
| **Part Breaking** | `part.broken = true` reduces enemy damage or removes options | Event-driven: `OnComponentDestroyed` triggers damage debuffs and particle effects |

---

## 3. Visuals & Rendering

| Web Prototype | Unity Migration |
| :--- | :--- |
| **HTML5 Canvas Wireframe** | 2D Sprites, Pixel Art, or 3D Low-Poly Mech models with LineRenderers / Wireframe shaders |
| **CSS Monospace HUD** | Unity **UI Toolkit** or **TextMeshPro + UGUI** with sci-fi font and 9-slice frames |
| **Combat Telemetry Log** | ScrollRect with dynamic instantiated `LogEntryItem` prefabs |

---

## 4. How to Play the Web Prototype Now

You can open `index.html` directly in any web browser, or serve it using Python's simple HTTP server:

```bash
cd "/home/idris/Documents/Work/Card Game"
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your browser.

