import * as THREE from "three";
import World from "../core/World";
import EventManager from "../inventory/utils/EventManager";

export default abstract class BaseElement {
  pos: THREE.Vector3;
  quaternion: THREE.Quaternion;
  health: number;
  isGhost: boolean;
  private isRemoved = false;
  private eventManager;

  public addEventListener;
  public removeEventListener;

  abstract addToWorld(world: World): void;
  abstract removeFromWorld(world: World): void;

  abstract updatedPosition(): void;
  abstract updatedQuaternion(): void;
  abstract updatedGhostStatus(isGhost: boolean): void;

  constructor() {
    this.pos = new THREE.Vector3(0, 0, 0);
    this.quaternion = new THREE.Quaternion();
    this.health = 100;
    this.isGhost = false;

    this.eventManager = new EventManager(["broken"]);

    this.addEventListener = this.eventManager.addEventListener.bind(this.eventManager);
    this.removeEventListener = this.eventManager.removeEventListener.bind(this.eventManager);
  }

  setPosition(position: THREE.Vector3) {
    this.pos = position;
    this.updatedPosition();
  }
  getPosition() {
    return this.pos;
  }

  setQuaternion(rotation: THREE.Quaternion) {
    this.quaternion = rotation;
    this.updatedQuaternion();
  }

  setGhost(ghostMode: boolean) {
    this.isGhost = ghostMode;
    this.updatedGhostStatus(this.isGhost);
  }

  decrementHealth(amount: number) {
    this.health -= amount;

    if (this.health <= 0 && !this.isRemoved) {
      this.isRemoved = true;
      window.buildingManager.removeGridElement(this);
      this.eventManager.dispatchEvent("broken");
      return true;
    }

    return false;
  }
}
