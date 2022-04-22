import * as THREE from "three";
import * as CANNON from "cannon-es";
import WallElement from "./WallElement";
import GridElement from "./GridElement";

export default abstract class FloorElement extends GridElement {
  private xLeftWall: WallElement | undefined;
  private xRightWall: WallElement | undefined;
  private zFrontWall: WallElement | undefined;
  private zBackWall: WallElement | undefined;

  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, cShape: CANNON.Shape) {
    super(geometry, material, cShape);
  }
}
