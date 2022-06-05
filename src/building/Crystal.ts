import Updatable from "../interfaces/Updatable";
import ResourceManager from "../managers/ResourceManager";
import FreeElement from "./FreeElement";
import * as THREE from "three";

export default class Crystal extends FreeElement implements Updatable {
  private crystalRotation = 0;

  constructor(resourceManager: ResourceManager) {
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
  }

  update(deltaTime: number) {
    this.crystalRotation += deltaTime;

    this.getParts()[1].quaternion.setFromEuler(new THREE.Euler(0, this.crystalRotation / 2, 0));
  }

  updatePhysics(deltaTime: number): void {}
}
