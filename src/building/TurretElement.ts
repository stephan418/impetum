import GridElement from "./GridElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { groundMaterial, slipperyMaterial } from "../core/CannonMaterials";
import FreeElement from "./FreeElement";
import { ShapeAndOffset } from "../managers/ResourceManager";
import Updatable from "../interfaces/Updatable";

export default abstract class TurretElement extends FreeElement implements Updatable {
  private turretRotationY: number;
  constructor(
    geometries: THREE.BufferGeometry[] | THREE.BufferGeometry,
    materials: THREE.Material[] | THREE.Material,
    cShapes: ShapeAndOffset[][] | ShapeAndOffset[] | ShapeAndOffset
  ) {
    super(geometries, materials, cShapes);
    this.getParts()[1].positionOffset = new THREE.Vector3(0, 1, 0);
    this.getParts()[2].positionOffset = new THREE.Vector3(0, 2, 0);
    this.turretRotationY = 0;
  }
  update(deltaTime: number): void {
    this.turretRotationY += deltaTime;
    let tempQuat = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, this.turretRotationY / 2, 0));
    this.getParts()[1].quaternionOffset = tempQuat.clone();
    this.getParts()[1].mesh.add(this.getParts()[2].mesh);
    this.getParts()[2].position = new THREE.Vector3();
    this.getParts()[2].quaternionOffset = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(Math.cos(this.turretRotationY) / 2, 0, 0)
    );
  }
  updatePhysics(deltaTime: number): void {}
}
