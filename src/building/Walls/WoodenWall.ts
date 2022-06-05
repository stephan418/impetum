import * as THREE from "three";
import * as CANNON from "cannon-es";
import FloorElement from "../FloorElement";
import ResourceManager from "../../managers/ResourceManager";
import { BufferGeometry } from "three";
import WallElement from "../WallElement";

export default class WoodenWall extends WallElement {
  constructor(resourceManager: ResourceManager) {
    const a = resourceManager.getModelGeometry("woodenWall");
    const b = resourceManager.getModelMaterial("woodenWall");
    const c = resourceManager.getModelShapes("woodenWall")?.[0];
    if (!a) {
      throw new Error("Geometry couldn't be found");
    }
    if (!b) {
      throw new Error("Material couldn't be found");
    }
    if (!c.shape) {
      throw new Error("Shape couldn't be found");
    }
    super(a, b, c.shape);
  }
}
