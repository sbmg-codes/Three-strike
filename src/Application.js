import { WeaponAnimation } from "./animations/ShootAnim";
import { sceneManager } from "./core/Scene";
import { lightsManager } from "./lights/LightsManager";
import { mapLoader, weaponLoader } from "./Loaders/Loaders";
import { modelsManager } from "./models/ModelsManager";
import { bodyManager } from "./physics/CreateBodies";
import { skyShader } from "./shaders/SkyShader";

class Application {
  constructor() {}

  async init() {
    modelsManager.init();
    mapLoader.init();
    bodyManager.init();
    initPlayer();

    await initMap();

    await initGround();
    sceneManager.initCharacter();
    weaponLoader.init();

    await initGun();

    sceneManager.animate();
    initBox();
    initLights();
    initSky();
  }
}

async function initGun(path) {
  await weaponLoader.loadWeapon("/glbs/Pistol.glb");

  const anim = new WeaponAnimation(weaponLoader.weapon);
  anim.playAnimation();
}

// async function glockAnimation() {
//   await initGun();
// }

function initSky() {
  skyShader.addSky();
}

async function initGround() {
  modelsManager.createGroundMesh();
  bodyManager.createGround();
}

function initPlayer() {
  modelsManager.createCapsuleMesh();
  bodyManager.createPlayer();
}

function initBox() {
  modelsManager.createBoxMesh();
  bodyManager.createBoxBody();
}

async function initMap() {
  await mapLoader.loadMap();
  bodyManager.addContactMaterial();
}

async function initTriCollider() {}

function initLights() {
  lightsManager.ambientLightSetup();
}

export const application = new Application();
