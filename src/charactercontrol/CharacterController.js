import * as THREE from "three";
import * as CANNON from "cannon-es";
import { CameraFollow } from "../core/CameraFollow";
import { bodyManager } from "../physics/CreateBodies";

export class CharacterController {
  // Equation
  // Fy = mg + kp * (yTarget -y) -kdvy
  constructor(vehicle, orbit, camera, mesh) {
    this.vehicle = vehicle;
    this.orbit = orbit;
    this.camera = camera;
    this.mesh = mesh;
    this.toggleRun = false;
    this.toggleJump = false;
    this.canJump = this.vehicle.position.y < 5;
    this.isJumping = false;

    this.cameraFollow = new CameraFollow(this.vehicle);

    this.walkSpeed = 35;
    this.runSpeed = 50;
    this.jumpSpeed = 10;
    this.isMoving = false;

    this.cameraOffset = new THREE.Vector3(0, 8, 8);
    this.cameraLookAtOffset = new THREE.Vector3(0, 2, 0);
    this.cameraFollowSpeed = 4;

    this.velocity = new CANNON.Vec3(0, 0, 4.99);
    this.acceleration = 8;
    this.deceleration = 17;

    this.maxForce = 500;
    this.maxSteeringVal = 0.7;

    this.kp = 10;
    this.kd = 20;
    this.mg = vehicle.mass * 9.81;
    this.yTarget = 1.1;

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false,
    };

    console.log("delta initiated");

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();

    switch (key) {
      case "w":
      case "arrowup":
        this.keys.forward = true;
        break;
      case "s":
      case "arrowdown":
        this.keys.backward = true;
        break;
      case "a":
      case "arrowleft":
        this.keys.left = true;
        break;
      case "d":
      case "arrowright":
        this.keys.right = true;
        break;
      case "shift":
        this.keys.shift = true;
        this.toggleRun = true;
        break;
      case " ":
        this.keys.jump = true;
        break;
    }
  }

  handleKeyUp(event) {
    const key = event.key.toLowerCase();

    switch (key) {
      case "w":
      case "arrowup":
        this.keys.forward = false;
        break;
      case "s":
      case "arrowdown":
        this.keys.backward = false;
        break;
      case "a":
      case "arrowleft":
        this.keys.left = false;
        break;
      case "d":
      case "arrowright":
        this.keys.right = false;
        break;
      case "shift":
        this.keys.shift = false;
        this.toggleRun = false;
        break;
      case " ":
        this.keys.jump = false;
        break;
    }
  }

  switchToggleRun() {
    this.toggleRun = !this.toggleRun;
  }

  // float() {
  //   const y = this.vehicle.position.y; // current height
  //   const vy = this.vehicle.velocity.y; // current vertical speed

  //   const deltaY = this.yTarget - y;

  //   const correctionP = this.kp * deltaY;
  //   const correctionD = -this.kd * vy;

  //   const applicableForce = this.mg + correctionP + correctionD;

  //   this.vehicle.applyForce(new CANNON.Vec3(0, applicableForce, 0));
  // }

  updateMovement(delta) {
    const forward = this.cameraFollow.getForwardVector();
    const right = new THREE.Vector3()
      .crossVectors(forward, new THREE.Vector3(0, 1, 0))
      .normalize();

    const onGround = this.vehicle.position.y <= 3;

    let moveDir = new THREE.Vector3();

    if (this.keys.forward) moveDir.add(forward);
    if (this.keys.backward) moveDir.sub(forward);
    if (this.keys.right) moveDir.add(right);
    if (this.keys.left) moveDir.sub(right);

    if (moveDir.length() > 0) {
      moveDir.normalize();
      const speed = this.keys.shift ? this.runSpeed : this.walkSpeed;
      const force = new CANNON.Vec3(moveDir.x, 0, moveDir.z).scale(
        speed * this.vehicle.mass
      );

      this.vehicle.applyForce(force);
    }

    // Jump impulse
    if (this.keys.jump && onGround) {
      this.vehicle.velocity.y = 17;
    }

    // Critical: Stop bouncing on ground
    if (onGround && this.vehicle.velocity.y < 0) {
      this.vehicle.velocity.y = 0;
    }
  }

  // this is pure good code. I wrote it, and it works, and one day I'll be making 10,000 $ no one can stop me!!~

  updateCamera(delta) {
    const bodyPos = this.vehicle.position;
    this.camera.position.set(bodyPos.x, bodyPos.y + 1 * 0.8, bodyPos.z);
  }

  update(delta) {
    this.updateMovement(delta);
    this.cameraFollow.update(delta);
  }
}

function thisis() {
  const something = 1;
  console.log(something);
}
