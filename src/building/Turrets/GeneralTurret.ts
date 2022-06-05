import * as THREE from "three";
import * as CANNON from "cannon-es";
import FloorElement from "../FloorElement";
import ResourceManager from "../../managers/ResourceManager";
import { BufferGeometry } from "three";
import WallElement from "../WallElement";
import TurretElement from "../TurretElement";
import Updatable from "../../interfaces/Updatable";

export default class GeneralTurret extends TurretElement {
  constructor(resourceManager: ResourceManager) {
    const a = resourceManager.getModelGeometry("generalTurret", 0);
    const aMiddle = resourceManager.getModelGeometry("generalTurret", 1);
    const aTop = resourceManager.getModelGeometry("generalTurret", 2);
    const b = resourceManager.getModelMaterial("generalTurret");
    const c = resourceManager.getModelShapes("generalTurret")[0];
    if (!a || !aMiddle || !aTop) {
      throw new Error("Geometry couldn't be found");
    }
    if (!b) {
      throw new Error("Material couldn't be found");
    }
    if (!c.shape) {
      throw new Error("Shape couldn't be found");
    }
    super([a, aMiddle, aTop], [b, b, b], c);
  }
}
