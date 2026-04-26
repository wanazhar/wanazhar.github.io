# Malaysia Tourism Expansion Implementation Plan

> **For Hermes:** Use codex/direct implementation for this oversized static Three.js feature, then verify with syntax/build/browser checks.

**Goal:** Expand `/kualalumpur` from a KL voxel prototype into an interactive Malaysia tourism introduction for local and foreign tourists.

**Architecture:** Keep the page static and GitHub-Pages-compatible. Add richer data modules for landmarks, quests, routes, postcards, zones, and facts. Keep the world primarily instanced voxel geometry for performance; use UI and lightweight state systems for interactivity. Avoid backend dependencies.

**Tech Stack:** Vite, Three.js, JavaScript modules, localStorage, canvas UI, static GitHub Pages.

---

## Scope for this pass

This pass should implement a broad playable tourism layer without pretending to be a complete AAA map. Accuracy should be represented through names, groupings, summaries, landmark/culture facts, routes, and clearly stylized voxel approximations.

### Task 1: Make dependencies portable

- Modify `_kualalumpur-src/package.json` to replace local tarball dependencies with registry semver dependencies.
- Preserve the existing Vite app and build output.

### Task 2: Add tourism data modules

Create data files under `_kualalumpur-src/src/data/`:
- `tourismContent.js`: landmark metadata, zones, cultural facts, safety/travel tips, glossary.
- `quests.js`: tourist-friendly quests and achievements.
- `routes.js`: themed routes such as First Timer KL, Heritage Trail, Food & Night Market, Garden & Museum, Skyline Modern KL, Malaysia Highlights.
- `postcards.js`: postcard templates and photo captions.

Data requirements:
- Expand from 14 landmarks to 30+ points of interest.
- Include KL-focused entries: KLCC Park, Petaling Street, Jalan Alor, Pavilion KL, Masjid Jamek / River of Life, Royal Selangor Club, Islamic Arts Museum, National Planetarium, Istana Negara, Batu Caves gateway, Kampung Baru, Little India Brickfields, Chow Kit Market.
- Include Malaysia highlight/off-map zones: Penang George Town, Langkawi, Malacca, Cameron Highlands, Taman Negara, Kinabalu, Perhentian Islands, Putrajaya, Sepang/KLIA.
- Include short tourist notes, category tags, approximate district, best time, and local tip.

### Task 3: Add progress persistence and quest tracking

Create `_kualalumpur-src/src/game/SaveSystem.js` and `_kualalumpur-src/src/game/QuestSystem.js`.

- Persist visited stamps, completed quests, active route, weather/time mode, and unlocked postcards in localStorage.
- Keep save schema versioned.
- Gracefully ignore corrupt saves.
- Quest system should evaluate visits, train rides, photo captures, district visits, weather/time interactions.

### Task 4: Expand world generation

Modify `createKualaLumpurWorld.js` and palette helpers:
- Add landmark geometry for KLCC Park, Petaling Street/Chinatown, Jalan Alor night market, Masjid Jamek/River of Life, Royal Selangor Club, Islamic Arts Museum, National Planetarium, Istana Negara, Batu Caves gateway, Kampung Baru, Little India Brickfields, Chow Kit Market, Pavilion KL.
- Add off-map portal/gateway pads for Malaysia highlights without expanding terrain density too much.
- Add signage-like voxel blocks, market stalls, temple/heritage details, riverside/water, parks, flags, food street tables.
- Preserve instancing and avoid excessive dynamic meshes.

### Task 5: Transit upgrade

Modify `TrainSystem.js` and UI:
- Add named station data.
- Add multiple route colors/labels: LRT, MRT, Monorail, KTM/Intercity-inspired tourism gateway.
- Add station selection/fast travel panel.
- Track train ride events for quests.

### Task 6: Tourism UI expansion

Modify `index.html`, `style.css`, and `hud.js`:
- Add guidebook/info panel for selected landmarks.
- Add quest/achievement panel.
- Add route selector.
- Add Malaysia highlights/zone panel.
- Add travel tips/facts panel.
- Add save/reset progress controls.
- Keep Telegram/mobile-friendly responsive layout.

### Task 7: Weather, ambience, and photo upgrades

- Extend time modes to Day, Golden Hour, Sunset, Night, Rain, Thunderstorm.
- Add lightweight rain particles and wet-road color shifts, avoiding expensive reflections.
- Add city ambience toggles without external audio assets if no assets are available; show text-based ambience state.
- Expand photo mode with postcard templates, captions, and capture event hook.

### Task 8: Mobile/touch improvements

- Improve touch guidance copy.
- Add auto-walk/jump-to-next-tour destination if feasible.
- Keep virtual joystick intact.
- Add reduced-quality mode toggle or reuse adaptive renderer.

### Task 9: Verification

Run:
- `npm install` if needed
- `npm run lint:syntax`
- `npm run build`
- copy build output into `/kualalumpur`
- local static server check: `/kualalumpur/` HTTP 200 and assets HTTP 200
- browser smoke test: page loads, no JS errors, info/quest/route/photo/weather controls present
- git diff review

### Task 10: Commit/push

- Commit with a clear message.
- Push to `main`.

## Performance constraints

- Static GitHub Pages only.
- Do not add backend/database.
- Do not add large binary assets unless essential.
- Avoid real-time shadows, heavy post-processing, and large textures.
- Prefer instanced static geometry and light DOM panels.
- Preserve idle render pausing.

## Accuracy note

This is a stylized educational map, not survey-grade GIS. Use accurate names, districts, and high-level tourist facts; represent positions as approximate within the playable voxel map.
