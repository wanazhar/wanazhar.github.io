# Three.js + GSAP Endless Runner Architecture Demo

A high-performance 3-lane endless runner prototype built with Vite, vanilla Three.js, GSAP tweens, a custom observer state manager, shader-curved world geometry, pooled obstacles, instanced coins, OBB collisions, and post-processing.

## Stack

- Vite 8
- Three.js r184 style imports from `three/addons/...`
- GSAP 3.13+ for movement tweens
- Custom observer-pattern state manager
- EffectComposer with RenderPass, UnrealBloomPass, OutputPass, and SMAAPass

## Run locally

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, usually:

```txt
http://localhost:5173
```

## Controls

Keyboard:

- Left / A: switch lane left
- Right / D: switch lane right
- Up / W / Space: jump
- Down / S: roll

Touch:

- Swipe left/right/up/down
- Or use the on-screen controls

## Architecture

```txt
src/
  core/
    Constants.js          Shared tuning constants and game-state enum
    InputManager.js       Keyboard, touch swipes, and touch buttons
    StateManager.js       Lightweight observer store for Start/Playing/GameOver/Score/Speed
  collision/
    OBBUtils.js           OBB factory and world transform helper
  game/
    Game.js               Renderer, scene, loop, resize, collision, lifecycle
  graphics/
    PostProcessing.js     EffectComposer pipeline
    ShaderUtils.js        Material.onBeforeCompile curved-world shader injection
  player/
    CharacterController.js GSAP lane/jump/roll controller + AnimationMixer state machine
  ui/
    Hud.js                DOM HUD bound to StateManager
  utils/
    ObjectPool.js         Generic reusable object pool
  world/
    CoinManager.js        THREE.InstancedMesh collectables with dynamic matrices
    ObstaclePool.js       Pooled obstacle groups with OBB metadata and recycling
    WorldGenerator.js     Ground/scenery procedural generation and world speed hookup
```

## Notes for production art integration

- Replace the procedural runner in `CharacterController` with a GLB/GLTF skinned mesh.
- Keep the public controller API (`moveLeft`, `moveRight`, `jump`, `roll`, `getOBB`) unchanged.
- Keep player materials unmodified by `applyCurvedWorldMaterial`; only world-space objects should receive the shader distortion.
- Tune `curvedWorldOptions` in `WorldGenerator` for different horizon radius and side bend.
- To add more obstacle classes, append to `obstacleTypes` in `ObstaclePool.js` with a `build()` function and local OBB dimensions.

## Deployment

```bash
npm run build
```

The production bundle is emitted to `dist/`. Because `vite.config.js` uses `base: './'`, it can be deployed under a GitHub Pages subfolder.
