import { cameraManager } from "./Camera";
import * as THREE from "three";

export class CameraFollow {
  constructor(vehicle) {
    this.camera = cameraManager.camera;
    this.vehicle = vehicle;

    this.yaw = 0;
    this.pitch = 0;
    this.sensitivity = 0.002;

    this.setupPointerLock = this.setupPointerLock.bind(this);

    this.setupPointerLock();
    this.isMouseLocked = false;
  }

  setupPointerLock() {
    const canvas = document.querySelector("canvas");
    document.addEventListener("click", () => {
      canvas.requestPointerLock();
    });

    document.addEventListener("pointerlockchange", () => {
      this.isMouseLocked = document.pointerLockElement === canvas;
    });

    document.addEventListener("mousemove", (e) => {
      if (!this.isMouseLocked) return;

      this.yaw -= e.movementX * this.sensitivity;
      this.camera.rotation.order = "YXZ";
      this.pitch -= e.movementY * this.sensitivity;
    });
  }

  update(delta) {
    const pos = this.vehicle.position;
    this.camera.position.set(pos.x, pos.y + 1.6, pos.z);
    this.camera.rotation.set(this.pitch, this.yaw, 0);
  }

  getForwardVector() {
    const dir = new THREE.Vector3(0, 0, -1);
    dir.applyEuler(new THREE.Euler(this.pitch, this.yaw, 0, "YXZ"));
    return dir.normalize();
  }
}
