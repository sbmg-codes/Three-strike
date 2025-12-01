import * as CANNON from "cannon-es";

class PhysicalWorld {
  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.81, 0);
    this.timeStep = 1 / 60;
    this.world.solver.iterations = 12;
  }

  step(delta) {
    this.world.step(delta);
  }
}

export const physicalWorld = new PhysicalWorld();
