import GridElement from "./GridElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { groundMaterial, slipperyMaterial } from "../core/CannonMaterials";
import FreeElement from "./FreeElement";
import { ShapeAndOffset } from "../managers/ResourceManager";
import Updatable from "../interfaces/Updatable";

export default abstract class TurretElement extends FreeElement implements Updatable {
  constructor(
    geometries: THREE.BufferGeometry[] | THREE.BufferGeometry,
    materials: THREE.Material[] | THREE.Material,
    cShapes: ShapeAndOffset[][] | ShapeAndOffset[] | ShapeAndOffset
  ) {
    super(geometries, materials, cShapes);
  }
  update(deltaTime: number): void {
    this._update(deltaTime);
  }
  updatePhysics(deltaTime: number): void {
    this._updatePhysics(deltaTime);
  }

  public lookAt(pos: THREE.Vector3) {
    this._lookAt(pos);
  }
  public shoot() {
    this._shoot();
  }
  protected abstract _lookAt(pos: THREE.Vector3): void;
  protected abstract _shoot(): void;
  protected abstract _update(deltaTime: number): void;
  protected abstract _updatePhysics(deltaTime: number): void;
}
