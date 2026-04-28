import * as THREE from 'three';

const loader = new THREE.TextureLoader();
const BASE = import.meta.env.BASE_URL;

function loadTexture(path, { repeat = null, transparent = true } = {}) {
  const texture = loader.load(`${BASE}${path}`);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  if (repeat) {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeat[0], repeat[1]);
  }
  texture.needsUpdate = true;
  texture.userData.transparent = transparent;
  return texture;
}

export const textureBank = {
  animeFace: loadTexture('assets/anime/anime-face.svg'),
  animeBow: loadTexture('assets/anime/anime-bow.svg'),
  animeSkirt: loadTexture('assets/anime/anime-skirt.svg', { repeat: [1, 1] }),
  animeEmblem: loadTexture('assets/anime/anime-emblem.svg'),
  animeBusDecal: loadTexture('assets/anime/anime-bus-decal.svg'),
  animeGateCharm: loadTexture('assets/anime/anime-gate-charm.svg'),
  animePowerMagnet: loadTexture('assets/anime/anime-power-magnet.svg'),
  animePowerJet: loadTexture('assets/anime/anime-power-jet.svg'),
  animePowerShield: loadTexture('assets/anime/anime-power-shield.svg'),
  animePower2x: loadTexture('assets/anime/anime-power-2x.svg')
};

export function makeDecalPlane(texture, width, height, materialOptions = {}) {
  return new THREE.Mesh(
    new THREE.PlaneGeometry(width, height),
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      depthWrite: false,
      ...materialOptions
    })
  );
}
