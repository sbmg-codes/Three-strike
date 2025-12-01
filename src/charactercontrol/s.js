import { Sky } from "three/examples/jsm/objects/Sky.js";
import { sceneManager } from "../core/Scene";
import * as THREE from "three";

class SkyShader {
  constructor() {
    this.sky = new Sky();
    this.scene = sceneManager.scene;
  }

  addSky() {
    this.scene.add(this.sky);
    this.sky.scale.setScalar(450000);
    this.configureSky();
  }

  configureSky() {
    const skyUniforms = this.sky.material.uniforms;

    // Sunset parameters
    skyUniforms["turbidity"].value = 10; // Higher = more atmospheric haze (sunset haze)
    skyUniforms["rayleigh"].value = 2; // Lower = less blue scattering (warmer colors)
    skyUniforms["mieCoefficient"].value = 0.005; // Controls atmospheric particle scattering
    skyUniforms["mieDirectionalG"].value = 0.8; // Sun glow intensity

    this.configureSun(skyUniforms);
  }

  configureSun(skyUniforms) {
    const sun = new THREE.Vector3();

    // Sunset position: low on horizon
    const elevation = 2; // 2 degrees above horizon (sunset)
    const azimuth = 180; // Facing west

    const theta = THREE.MathUtils.degToRad(90 - elevation);
    const phi = THREE.MathUtils.degToRad(azimuth);

    sun.setFromSphericalCoords(1, theta, phi);

    skyUniforms["sunPosition"].value.copy(sun);
  }
}

export const skyShader = new SkyShader();
