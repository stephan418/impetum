import BaseElement from "./BaseElement";
import BuildingElement from "../interfaces/BuildingElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import World from "../core/World";
import { groundMaterial } from "../core/CannonMaterials";
import { LineBasicMaterial, MeshLambertMaterial, MeshStandardMaterial } from "three";

export default abstract class FreeElement extends BaseElement implements BuildingElement {
  private mesh: THREE.Mesh;
  private cBody: CANNON.Body;
  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, cShape: CANNON.Shape) {
    super();
    this.mesh = new THREE.Mesh();
    this.cBody = new CANNON.Body({ material: groundMaterial });
    this.setGeometry(geometry);
    this.setMaterial(material);
    this.addCShape(cShape);

    this.updatedPosition = () => {
      this.mesh.position.copy(this.pos);
      this.cBody.position.copy(new CANNON.Vec3(this.pos.x, this.pos.y, this.pos.z));
    };

    this.updatedQuaternion = () => {
      this.mesh.quaternion.copy(this.quaternion);
      this.cBody.quaternion.copy(
        new CANNON.Quaternion(this.quaternion.x, this.quaternion.y, this.quaternion.z, this.quaternion.w)
      );
    };
  }
  addToWorld(world: World): void {
    world.scene.add(this.mesh);
    world.cScene.addBody(this.cBody);
  }
  removeFromWorld(world: World): void {
    world.scene.remove(this.mesh);
    world.cScene.removeBody(this.cBody);
  }

  protected setGeometry(geometry: THREE.BufferGeometry) {
    this.mesh.geometry = geometry;
  }

  protected setMaterial(material: THREE.Material) {
    this.mesh.material = material;
  }
  protected addCShape(cShape: CANNON.Shape) {
    // this.shapeName = shapeName;
    /* for (const item of this.cBody.shapes) {
      this.cBody.removeShape(item);
    } */
    this.cBody.addShape(cShape);
  }

  getMesh() {
    return this.mesh;
  }
  getCBody() {
    return this.cBody;
  }

  updatedPosition(): void {}
  updatedGhostStatus(isGhost: boolean): void {
    if (isGhost) {
      this.cBody.world?.removeBody(this.cBody);
      this.cBody = new CANNON.Body();
      let newMaterial = (this.mesh.material as THREE.Material).clone();
      newMaterial.transparent = true;
      newMaterial.opacity = 0.5;
      this.mesh.name = "nointersect";
      this.setMaterial(newMaterial);
    } else {
    }
  }
  updatedQuaternion(): void {}
}
