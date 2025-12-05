import * as CANNON from "cannon-es";
import { sceneManager } from "../core/Scene";
import { physicalWorld } from "./PhysicsWorld";
import { modelsManager } from "../models/ModelsManager";
import * as THREE from "three";

class JustWin {}

class PhysicsManager {
  constructor() {
    this.scene = null;
    this.world = null;
    this.ground = null;
    this.bodyArray = [];
    this.meshArray = null;
    this.character = null;
    this.groundMesh = null;
    this.playerMaterial = new CANNON.Material({
      restitution: 0,
      friction: 1,
    });
    this.mapMaterial = new CANNON.Material({});
    this.groundMaterial = new CANNON.Material({
      restitution: 0,
      friction: 1,
    });
    // this.addContactMaterial();
  }

  init() {
    this.scene = sceneManager.scene;
    this.world = physicalWorld.world;
    this.meshArray = modelsManager.meshArray;
  }

  createPlayer(radius = 0.5, height = 1.7, mass = 70) {
    const capsuleBody = new CANNON.Body({
      mass,
      type: CANNON.Body.DYNAMIC,
      material: this.playerMaterial,
      linearDamping: 0.2,
    });

    const cylinder = new CANNON.Cylinder(radius, radius, height, 8);
    const quat = new CANNON.Quaternion();
    quat.setFromEuler(Math.PI / 2, 0, 0);

    capsuleBody.addShape(cylinder, new CANNON.Vec3(0, 0, 0), quat);

    const sphereTop = new CANNON.Sphere(radius);
    const sphereBottom = new CANNON.Sphere(radius);

    capsuleBody.addShape(sphereTop, new CANNON.Vec3(0, height / 2 + radius, 0));
    capsuleBody.addShape(
      sphereBottom,
      new CANNON.Vec3(0, -height / 2 + radius, 0)
    );

    capsuleBody.linearDamping = 0.5;

    capsuleBody.position.set(5, 5, 5);

    this.world.addBody(capsuleBody);
    this.bodyArray.push(capsuleBody);
    this.character = capsuleBody;
  }

  createGround() {
    const ground = new CANNON.Body({
      shape: new CANNON.Plane(),
      mass: 0,
      material: this.groundMaterial,
    });
    ground.quaternion.setFromEuler(-Math.PI / 2, 0, 0);
    ground.position.copy(modelsManager.ground.position);
    ground.position.y = 0;
    // ground.quaternion.copy(modelsManager.ground.quaternion);

    this.world.addBody(ground);
    this.bodyArray.push(ground);
  }

  createBoxBody() {}

  addContactMaterial() {
    const contactMaterial = new CANNON.ContactMaterial(
      this.playerMaterial,
      this.mapMaterial
    );

    const groundContactMaterial = new CANNON.ContactMaterial(
      this.playerMaterial,
      this.groundMaterial
    );

    contactMaterial.contactEquationRelaxation = 2;
    contactMaterial.contactEquationStiffness = 1e7;
    contactMaterial.restitution = 0;
    contactMaterial.friction = 0.9;

    groundContactMaterial.contactEquationRelaxation = 2;
    groundContactMaterial.contactEquationStiffness = 1e7;
    groundContactMaterial.restitution = 0;
    groundContactMaterial.friction = 0.8;

    this.world.addContactMaterial(contactMaterial);
    this.world.addContactMaterial(groundContactMaterial);

    console.log("Yes material is added");
  }

  createTrimeshCollider(meshes) {
    meshes.forEach((mesh) => {
      if (!mesh.isMesh || !mesh.geometry) return;

      const vertices = mesh.geometry.attributes.position.array;
      const indices = mesh.geometry.index
        ? mesh.geometry.index.array
        : [...Array(vertices.length / 3).keys()];

      const shape = new CANNON.Trimesh(Float32Array.from(vertices), indices);

      // create a body
      const body = new CANNON.Body({
        shape,
        mass: 0,
        type: CANNON.Body.STATIC, // I am keeping it static
        material: this.mapMaterial,
      });

      // this.addContactMaterial();

      mesh.updateWorldMatrix(true, true);

      const pos = new THREE.Vector3();
      const quat = new THREE.Quaternion();

      mesh.getWorldPosition(pos);
      mesh.getWorldQuaternion(quat);

      body.position.set(pos.x, pos.y, pos.z);
      body.quaternion.set(quat.x, quat.y, quat.z, quat.w);

      this.world.addBody(body);
      this.bodyArray.push(body);

      // console.log(indices);
    });
  }

  update() {
    for (let i = 0; i < this.meshArray.length; i++) {
      this.meshArray[i].position.copy(this.bodyArray[i].position);
      this.meshArray[i].quaternion.copy(this.bodyArray[i].quaternion);
    }
  }
}

export const bodyManager = new PhysicsManager();
