import * as THREE from 'three';

export class LandmarkProgress {
  constructor(landmarks, radius = 10, initialVisited = []) {
    this.landmarks = landmarks;
    this.radius = radius;
    this.visited = new Set(initialVisited);
    this.temp = new THREE.Vector3();
  }

  get count() {
    return this.visited.size;
  }

  get total() {
    return this.landmarks.length;
  }

  isVisited(landmark) {
    return this.visited.has(landmark.name);
  }

  markVisited(landmark) {
    const wasVisited = this.isVisited(landmark);
    this.visited.add(landmark.name);
    return !wasVisited;
  }

  check(position) {
    this.temp.copy(position);
    this.temp.y = 0;
    for (const landmark of this.landmarks) {
      const target = landmark.position;
      const distance = Math.hypot(this.temp.x - target.x, this.temp.z - target.z);
      if (distance <= (landmark.visitRadius ?? this.radius) && this.markVisited(landmark)) return landmark;
    }
    return null;
  }
}
