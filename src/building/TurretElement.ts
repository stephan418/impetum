import GridElement from "./GridElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { groundMaterial, slipperyMaterial } from "../core/CannonMaterials";
import FreeElement from "./FreeElement";

export default abstract class TurretElement extends FreeElement {
  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, cShape: CANNON.Shape) {
    super(geometry, material, cShape);
    this.getCBody().material = groundMaterial;
  }
}
