import Updatable from "../interfaces/Updatable";
import ResourceManager from "../managers/ResourceManager";
import FreeElement from "./FreeElement";
import * as THREE from "three";
import FloatingItem from "../inventory/FloatingItem";
import GameStateManager from "../managers/GameStateManager";
import PausableInterval from "../helpers/pausableInterval";

export default class Crystal extends FreeElement implements Updatable {
  private crystalRotation = 0;
  private shards: FloatingItem[] = [];
  private interval: PausableInterval;

  constructor(resourceManager: ResourceManager, private gameStateManager?: GameStateManager) {
    const socketGeometry = resourceManager.getModelGeometry("crystal", 0);
    const crystalGeometry = resourceManager.getModelGeometry("crystal", 1);
    const material = resourceManager.getModelMaterial("crystal");
    const cShape = resourceManager.getModelShape("crystal");

    if (!socketGeometry || !crystalGeometry) {
      throw new Error("Geometry for crystal could not be found");
    }

    if (!material) {
      throw new Error("Material for crystal could not be found");
    }

    if (!cShape) {
      throw new Error("Shape for crystal could not be found");
    }

    super([socketGeometry, crystalGeometry], [material, material], cShape);

    this.interval = new PausableInterval(() => this.addShard(), 100_000);

    this.gameStateManager?.addEventListener("pause", this.pause.bind(this));
    this.gameStateManager?.addEventListener("unpause", this.unpause.bind(this));

    window.interactionManager.addEventListener(
      { type: "right", id: this.getParts()[1].mesh.id },
      this.collectShards.bind(this)
    );
  }

  addShard() {
    const x = Math.random() * 16;
    const z = 16 - x;

    const shard = new FloatingItem(
      new THREE.Vector3(
        Math.sqrt(x) * (Math.random() < 0.5 ? -1 : 1) * 0.8,
        3.5,
        Math.sqrt(z) * (Math.random() < 0.5 ? -1 : 1) * 0.8
      ),
      0.5
    );

    shard.addToObject(this.getParts()[1].mesh);

    this.shards.push(shard);
  }

  collectShards() {
    const amount = this.shards.length * 10;
    window.playerInventory.desposit(amount);

    this.shards.forEach((shard) => shard.removeFromObject(this.getParts()[1].mesh));
    this.shards = [];
  }

  pause() {
    this.interval.pause();
  }

  unpause() {
    this.interval.unpause();
  }

  update(deltaTime: number) {
    this.crystalRotation += deltaTime;

    this.getParts()[1].quaternion.setFromEuler(new THREE.Euler(0, this.crystalRotation / 2, 0));

    const { x, z } = this.getParts()[1].positionOffset;

    this.getParts()[1].positionOffset = new THREE.Vector3(x, Math.sin(this.crystalRotation * 1.5) / 5 + 0.4, z);

    this.shards.forEach((shard) => shard.update(deltaTime));
  }

  updatePhysics(deltaTime: number): void {}

  break(): void {
    super.break();

    this.gameStateManager?.dispatchEvent("lose");
  }
}
