import * as THREE from "three";
import { sceneManager } from "../core/Scene";
import { mapLoader } from "../Loaders/Loaders";

class ModelsManager {
  constructor() {
    this.model = null;
    this.groundMesh = null;
    this.meshArray = [];
    this.scene = null;
    this.capsuleMesh = null;
    this.map = null;
    this.mergedMap = null;
    this.ground = null;
  }

  init() {
    this.scene = sceneManager.scene;
    console.log(this.ground);
  }

  createGroundMesh() {
    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshBasicMaterial({
      color: 0x808080,
      side: THREE.DoubleSide,
    });

    this.groundMesh = new THREE.Mesh(geometry, material);
    this.groundMesh.rotation.x = -Math.PI / 2;
    this.groundMesh.receiveShadow = true;
    this.ground = mapLoader.ground;
    console.log(this.ground);
    this.meshArray.push(this.ground);
    console.log(this.ground.position);
  }

  createBoxMesh() {}

  createCapsuleMesh(radius = 3, height = 11.7, segments = 8) {
    this.capsuleMesh = new THREE.Mesh(
      new THREE.CapsuleGeometry(radius, height, segments, segments, segments),
      new THREE.MeshBasicMaterial({ color: "blueviolet" })
    );
    this.capsuleMesh.position.set(0, 0, 0);
    this.scene.add(this.capsuleMesh);
    this.meshArray.push(this.capsuleMesh);
    console.log(this.capsuleMesh.position);
  }
}

export const modelsManager = new ModelsManager();
