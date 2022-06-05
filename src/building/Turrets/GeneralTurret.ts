import * as THREE from "three";
import * as CANNON from "cannon-es";
import FloorElement from "../FloorElement";
import ResourceManager from "../../managers/ResourceManager";
import { BufferGeometry } from "three";
import WallElement from "../WallElement";
import TurretElement from "../TurretElement";

export default class GeneralTurret extends TurretElement {
  constructor(resourceManager: ResourceManager) {
    const a = resourceManager.getModelGeometry("generalTurret");
    const b = resourceManager.getModelMaterial("woodenWall");
    const c = resourceManager.getModelShapes("generalTurret")?.[0];
    if (!a) {
      throw new Error("Geometry couldn't be found");
    }
    if (!b) {
      throw new Error("Material couldn't be found");
    }
    if (!c) {
      throw new Error("Shape couldn't be found");
    }
    super(a, b, c);
  }
}
