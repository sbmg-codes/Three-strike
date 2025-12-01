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
    skyUniforms["turbidity"].value = 3;
    skyUniforms["rayleigh"].value = 4;
    skyUniforms["mieCoefficient"].value = 0.005;
    skyUniforms["mieDirectionalG"].value = 0.8;

    this.configureSun(skyUniforms);
  }

  configureSun(skyUniforms) {
    const sun = new THREE.Vector3();

    const elevation = 2;
    const azimuth = 180;

    const theta = THREE.MathUtils.degToRad(90 - elevation);
    const phi = THREE.MathUtils.degToRad(azimuth);

    sun.setFromSphericalCoords(1, theta, phi);

    skyUniforms["sunPosition"].value.copy(sun);
  }
}

export const skyShader = new SkyShader();
