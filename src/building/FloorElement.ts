import * as THREE from "three";
import * as CANNON from "cannon-es";
import WallElement from "./WallElement";
import GridElement from "./GridElement";

export default abstract class FloorElement extends GridElement {
  private xLeftWall: WallElement | undefined;
  private xRightWall: WallElement | undefined;
  private zFrontWall: WallElement | undefined;
  private zBackWall: WallElement | undefined;

  setXLeftWall(newWall: WallElement) {
    this.xLeftWall = newWall;
  }
  setXRightWall(newWall: WallElement) {
    this.xRightWall = newWall;
  }
  setZFrontWall(newWall: WallElement) {
    this.zFrontWall = newWall;
    this.zFrontWall.setPosition(
      new THREE.Vector3(this.pos.x, this.pos.y + this.gridDistanceY, this.pos.z + this.gridDistanceXZ)
    );
  }
  setZBackWall(newWall: WallElement) {
    this.zBackWall = newWall;
  }

  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, cShape: CANNON.Shape) {
    super(geometry, material, cShape);
  }
}
