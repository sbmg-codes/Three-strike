import { AnimationMixer } from "three";

export class WeaponAnimation {
  constructor(gltf) {
    this.gltf = gltf;
    this.mixer = new AnimationMixer(gltf);
  }

  playAnimation() {
    console.clear();
    console.log(this.gltf.animations);
  }

  idleAnimation() {}
}
