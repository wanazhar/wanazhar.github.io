export class TourRoute {
  constructor(landmarks, routeNames) {
    this.landmarks = landmarks;
    this.routeId = 'custom';
    this.route = [];
    this.setStops(routeNames);
    this.active = false;
    this.index = 0;
  }

  setStops(routeNames, routeId = this.routeId) {
    this.routeId = routeId;
    this.route = routeNames.map((name) => this.landmarks.find((landmark) => landmark.name === name)).filter(Boolean);
    this.index = 0;
  }

  get current() {
    return this.active ? this.route[this.index] : null;
  }

  get progressText() {
    if (!this.active || this.route.length === 0) return 'Off';
    return `${this.index + 1}/${this.route.length}`;
  }

  start() {
    this.active = true;
    this.index = 0;
    return this.current;
  }

  cancel() {
    this.active = false;
    return null;
  }

  toggle() {
    return this.active ? this.cancel() : this.start();
  }

  update(playerPosition, radius = 11) {
    const destination = this.current;
    if (!destination) return { advanced: false, complete: false, destination: null, distance: 0 };
    const distance = Math.hypot(playerPosition.x - destination.position.x, playerPosition.z - destination.position.z);
    if (distance > radius) return { advanced: false, complete: false, destination, distance };

    this.index += 1;
    if (this.index >= this.route.length) {
      this.active = false;
      return { advanced: true, complete: true, destination, distance };
    }
    return { advanced: true, complete: false, destination: this.current, distance: 0 };
  }
}
