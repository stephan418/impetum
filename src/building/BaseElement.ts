import * as THREE from "three";
import World from "../core/World";

export default abstract class BaseElement {
  pos: THREE.Vector3;
  health: number;

  abstract update(deltaTime: number): void;
  abstract updatePhysics(deltaTime: number): void;
  abstract addToWorld(world: World): unknown;
  abstract removeFromWorld(world: World): unknown;

  constructor() {
    this.pos = new THREE.Vector3(0, 0, 0);
    this.health = 100;
  }
}
