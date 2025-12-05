import * as THREE from "three";
import { cameraManager } from "./Camera";
import { rendererManager } from "./Renderer";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { bodyManager } from "../physics/CreateBodies";
import { physicalWorld } from "../physics/PhysicsWorld";
import { CharacterController } from "../charactercontrol/CharacterController";
import CannonDebugger from "cannon-es-debugger";

class JustWin {
  constructor() {
    console.log("Just Win Already");
    console.log("coding on this is really good");
  }
}

class Scene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = cameraManager.camera;
    this.renderer = rendererManager.renderer;
    this.orbitControls = new OrbitControls(
      this.camera,
      this.renderer.domElement
    );
    this.clock = new THREE.Clock();
    this.zeroMargins();
    this.character = null;
    this.animate = this.animate.bind(this);
    this.world = null;
    this.debugger = new CannonDebugger(this.world);
    this.addBackground();
  }

  addBackground() {
    // this.scene.background = new THREE.Color(0x87ceeb);
  }

  initCharacter() {
    this.character = new CharacterController(
      bodyManager.character,
      this.orbitControls,
      this.camera,
      ""
    );
  }

  zeroMargins() {
    document.body.style.margin = 0;
  }

  animate() {
    const delta = this.clock.getDelta(); // use a clock
    physicalWorld.step(1 / 60, delta); // advance physics
    bodyManager.update();
    this.character?.update(delta);
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.animate);
  }
}

export const sceneManager = new Scene();
const panda = "panda";

console.log(panda);
