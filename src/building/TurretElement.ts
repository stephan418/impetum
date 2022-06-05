import GridElement from "./GridElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { groundMaterial, slipperyMaterial } from "../core/CannonMaterials";
import FreeElement from "./FreeElement";
import { ShapeAndOffset } from "../managers/ResourceManager";

export default abstract class TurretElement extends FreeElement {
  constructor(
    geometries: THREE.BufferGeometry[] | THREE.BufferGeometry,
    materials: THREE.Material[] | THREE.Material,
    cShapes: ShapeAndOffset[][] | ShapeAndOffset[] | ShapeAndOffset
  ) {
    super(geometries, materials, cShapes);
  }
}
