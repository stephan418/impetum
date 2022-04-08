// import World from "../core/World";
import BaseElement from "./BaseElement";
// import * as THREE from "three";

export default abstract class GridElement extends BaseElement {
  private direction: string;

  constructor(direction: string) {
    super();
    this.direction = direction;
  }
}
