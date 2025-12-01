import * as THREE from "three";

class Camera {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 24, 40);
  }
}

export const cameraManager = new Camera();
