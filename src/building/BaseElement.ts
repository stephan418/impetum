import * as THREE from "three";
import World from "../core/World";
import DeserializationError from "../errors/DeserializationError";
import safeDeserialize from "../helpers/safeDeserialization";
import { Serializable } from "../interfaces/Saveable";
import EventManager from "../inventory/utils/EventManager";
import ResourceManager from "../managers/ResourceManager";
import WoodenFloor from "./Floors/WoodenFloor";

interface SerializedElement {
  position: any[];
  quaternion: any[];
  health: number;
  type?: string;
}

function isSerializedElement(payload: any): payload is SerializedElement {
  return (
    typeof payload === "object" &&
    Array.isArray(payload.position) &&
    Array.isArray(payload.quaternion) &&
    typeof payload.health === "number" &&
    (payload.type ? typeof payload.type === "string" : true)
  );
}

export default abstract class BaseElement implements Serializable {
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
  abstract onRemove(): void;

  constructor(init?: { position: THREE.Vector3; quaternion: THREE.Quaternion; health: number }) {
    if (init) {
      this.pos = init.position;
      this.quaternion = init.quaternion;
      this.health = init.health;
    } else {
      this.pos = new THREE.Vector3(0, 0, 0);
      this.quaternion = new THREE.Quaternion();
      this.health = 100;
    }

    this.isGhost = false;

    this.eventManager = new EventManager(["broken"]);

    this.addEventListener = this.eventManager.addEventListener.bind(this.eventManager);
    this.removeEventListener = this.eventManager.removeEventListener.bind(this.eventManager);
  }

  setPosition(position: THREE.Vector3) {
    this.pos = position;
    this.updatedPosition();
    // if (!this.isGhost) console.log(this.serialize());
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
      return true;
    }

    return false;
  }

  break() {
    this.isRemoved = true;
    this.eventManager.dispatchEvent("broken");
  }

  serialize(): string {
    return JSON.stringify({
      position: this.pos.toArray(),
      quaternion: this.quaternion.toArray(),
      health: this.health,
    });
  }
}
