import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { sceneManager } from "../core/Scene";
import { modelsManager } from "../models/ModelsManager";
import { bodyManager } from "../physics/CreateBodies";
import { cameraManager } from "../core/Camera";

const gltfLoader = new GLTFLoader();

export class LoadMap {
  constructor() {
    this.gltfLoader = gltfLoader;
    this.dracoLoader = new DRACOLoader();
    this.setDracoPath();
    this.gltfLoader.setDRACOLoader(this.dracoLoader);
    this.scene = null;
    this.map = null;
    this.meshArray = null;
    this.mergedMap = null;
    this.ground = null;
  }

  init() {
    this.scene = sceneManager.scene;
    this.meshArray = modelsManager.meshArray;
  }

  setDracoPath() {
    this.dracoLoader.setDecoderPath(
      "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
    );
  }

  getMeshesFromGroup(group) {
    console.log(group);
    const meshes = [];

    group.traverse((child) => {
      if (child.isMesh) meshes.push(child);
    });

    return meshes;
  }

  loadMap() {
    return new Promise((resolve, reject) => {
      this.gltfLoader.load(
        "/glbs/map.glb",
        (glb) => {
          this.scene.add(glb.scene);
          this.map = glb.scene;
          modelsManager.map = this.map;

          // Find the ground mesh
          glb.scene.traverse((child) => {
            if (child.name === "ground") this.ground = child;
          });

          // console.log("✅ Ground:", this.ground);
          modelsManager.ground = this.ground;

          this.mergedMap = this.getMeshesFromGroup(glb.scene);
          bodyManager.createTrimeshCollider(this.mergedMap);

          // Resolve once everything is ready
          resolve(this.ground);
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + " % loaded");
        },
        (err) => {
          console.error("Error loading the model", err);
          reject(err);
        }
      );
    });
  }
}

class WeaponLoader {
  constructor() {
    this.loader = gltfLoader;
    this.scene = null;
    this.camera = null;
  }

  init() {
    this.scene = sceneManager.scene;
    this.camera = cameraManager.camera;
  }

  async loadWeapon(path) {
    const glb = await this.loader.loadAsync(path);
    const model = glb.scene;

    if (!this.scene.children.includes(this.camera)) {
      this.scene.add(this.camera);
    }

    model.traverse((child) => {
      if (child.isMesh && child.material.type === "MeshBasicMaterial") {
        const oldMaterial = child.material;
        child.material = new THREE.MeshStandardMaterial({
          map: oldMaterial.map,
          side: oldMaterial.side,
          color: new THREE.Color("white"),
          transparent: oldMaterial.transparent,
          opacity: oldMaterial.opacity,
          metalness: 0.5,
          roughness: 0.1,
        });
      }

      if (child.name == "pistol_upper") {
        console.log(child.animations);
      }
    });

    const pointLight = new THREE.PointLight("white", 1, 2);
    pointLight.position.set(0, 0, 0);
    this.camera.add(pointLight);

    model.scale.set(1, 1, 1);
    model.rotation.y = Math.PI / 2;

    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    model.position.set(0, -0.5, 2.4);
    this.camera.add(model);

    this.weapon = model; // ← now set AFTER real async load
    return this.weapon;
  }
}

export const mapLoader = new LoadMap();
export const weaponLoader = new WeaponLoader();
