import * as THREE from "three";
import { sceneManager } from "../core/Scene";

class LightsManager {
  constructor() {
    this.scene = sceneManager.scene;
  }

  ambientLightSetup() {
    const ambientLight = new THREE.AmbientLight("white", 1);

    // this.scene.add(ambientLight);
  }
}

export const lightsManager = new LightsManager();
