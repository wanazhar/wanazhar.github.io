import * as THREE from 'three';

export class AdaptiveRenderer {
  constructor(canvas, options = {}) {
    this.lowEndMode = Boolean(options.lowEndMode);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = false;

    this.pixelRatio = Math.min(window.devicePixelRatio || 1, this.lowEndMode ? 1 : 1.25);
    this.minPixelRatio = this.lowEndMode ? 0.72 : 0.62;
    this.maxPixelRatio = Math.min(window.devicePixelRatio || 1, this.lowEndMode ? 1.25 : 1.5);
    this.frameCostEMA = 16.7;
    this.lastPixelChange = 0;
    this.setPixelRatio(this.pixelRatio);
  }

  setPixelRatio(value) {
    this.pixelRatio = Number(value.toFixed(2));
    this.renderer.setPixelRatio(this.pixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  resize(camera) {
    const width = window.innerWidth;
    const height = window.innerHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
  }

  render(scene, camera) {
    const start = performance.now();
    this.renderer.render(scene, camera);
    const cost = performance.now() - start;
    this.frameCostEMA = this.frameCostEMA * 0.92 + cost * 0.08;
    this.adjustPixelRatio();
  }

  adjustPixelRatio() {
    const now = performance.now();
    if (now - this.lastPixelChange < 1400) return;

    if (this.frameCostEMA > 20.5 && this.pixelRatio > this.minPixelRatio) {
      this.setPixelRatio(Math.max(this.minPixelRatio, this.pixelRatio - 0.08));
      this.lastPixelChange = now;
    } else if (this.frameCostEMA < 12.5 && this.pixelRatio < this.maxPixelRatio) {
      this.setPixelRatio(Math.min(this.maxPixelRatio, this.pixelRatio + 0.08));
      this.lastPixelChange = now;
    }
  }

  get domElement() {
    return this.renderer.domElement;
  }

  get info() {
    return this.renderer.info;
  }
}
