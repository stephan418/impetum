import GridElement from "./GridElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { slipperyMaterial } from "../core/CannonMaterials";

export default abstract class WallElement extends GridElement {
  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, cShape: CANNON.Shape) {
    super(geometry, material, cShape);
    this.getCBody().material = slipperyMaterial;
  }
}
