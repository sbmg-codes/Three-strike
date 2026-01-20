import * as THREE from "three";
import { cameraManager } from "./Camera";

class Renderer {
  constructor() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
    // this.renderer.setClearColor("transparent", 0);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.5;
    this.renderer.outputEncoding = THREE.sRGBEncoding;

    window.addEventListener("resize", () => {
      this.handleResize();
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMappingExposure = 1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
  }

  handleResize() {
    cameraManager.camera.aspect = window.innerWidth / window.innerHeight;
    cameraManager.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export const rendererManager = new Renderer();
