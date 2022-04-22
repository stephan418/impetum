import * as THREE from "three";
import * as CANNON from "cannon-es";
import FloorElement from "../FloorElement";
import ResourceManager from "../../managers/ResourceManager";

export default class WoodenFloor extends FloorElement {
  constructor(resourceManager: ResourceManager) {
    super(resourceManager.loadModelGeometry("debugFloor"));
  }
}
