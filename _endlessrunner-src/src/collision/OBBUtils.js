import * as THREE from 'three';
import { OBB } from 'three/addons/math/OBB.js';

const scratchScale = new THREE.Vector3();
const scratchQuaternion = new THREE.Quaternion();
const scratchPosition = new THREE.Vector3();

export function makeOBB(center, halfSize) {
  return new OBB(
    new THREE.Vector3(center.x, center.y, center.z),
    new THREE.Vector3(halfSize.x, halfSize.y, halfSize.z),
    new THREE.Matrix3()
  );
}

export function updateWorldOBB(localOBB, object, targetOBB) {
  object.updateWorldMatrix(true, false);
  targetOBB.copy(localOBB);
  targetOBB.applyMatrix4(object.matrixWorld);
  return targetOBB;
}

export function getObjectWorldScale(object) {
  object.matrixWorld.decompose(scratchPosition, scratchQuaternion, scratchScale);
  return scratchScale;
}
