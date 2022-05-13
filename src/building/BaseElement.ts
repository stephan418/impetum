import * as THREE from "three";
import World from "../core/World";

export default abstract class BaseElement {
  pos: THREE.Vector3;
  quaternion: THREE.Quaternion;
  health: number;

  abstract addToWorld(world: World): void;
  abstract removeFromWorld(world: World): void;

  abstract updatedPosition(): void;
  abstract updatedQuaternion(): void;

  constructor() {
    this.pos = new THREE.Vector3(0, 0, 0);
    this.quaternion = new THREE.Quaternion();
    this.health = 100;
  }

  setPosition(position: THREE.Vector3) {
    this.pos = position;
    this.updatedPosition();
  }

  setQuaternion(rotation: THREE.Quaternion) {
    this.quaternion = rotation;
    this.updatedQuaternion();
  }
}
