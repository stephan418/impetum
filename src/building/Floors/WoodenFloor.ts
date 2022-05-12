import * as THREE from "three";
import * as CANNON from "cannon-es";
import FloorElement from "../FloorElement";
import ResourceManager from "../../managers/ResourceManager";
import { BufferGeometry } from "three";

export default class WoodenFloor extends FloorElement {
  constructor(resourceManager: ResourceManager) {
    const a = resourceManager.getModelGeometry("debugFloor");
    const b = resourceManager.getModelMaterial("debugFloor");
    const c = resourceManager.getModelShapes("debugFloor")?.[0];
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