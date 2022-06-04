import * as THREE from "three";
import * as CANNON from "cannon-es";
import WallElement from "./WallElement";
import GridElement from "./GridElement";
import PositionRotationResult from "../interfaces/PositionRotationResult";

export default abstract class FloorElement extends GridElement {
  // private xLeftWall: WallElement | undefined;
  // private xRightWall: WallElement | undefined;
  // private zFrontWall: WallElement | undefined;
  // private zBackWall: WallElement | undefined;

  /* setXLeftWall(newWall: WallElement) {
    this.xLeftWall = newWall;
    this.xLeftWall.setPosition(
      new THREE.Vector3(this.pos.x - this.gridDistanceXZ / 2, this.pos.y + this.gridDistanceY / 2, this.pos.z)
    );

    let tempQuat: THREE.Quaternion = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
    this.xLeftWall.setQuaternion(tempQuat);
  }
  setXRightWall(newWall: WallElement) {
    this.xRightWall = newWall;
    this.xRightWall.setPosition(
      new THREE.Vector3(this.pos.x + this.gridDistanceXZ / 2, this.pos.y + this.gridDistanceY / 2, this.pos.z)
    );

    let tempQuat: THREE.Quaternion = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
    this.xRightWall.setQuaternion(tempQuat);
  }
  setZFrontWall(newWall: WallElement) {
    this.zFrontWall = newWall;
    this.zFrontWall.setPosition(
      new THREE.Vector3(this.pos.x, this.pos.y + this.gridDistanceY / 2, this.pos.z + this.gridDistanceXZ/ 2)
    );

    let tempQuat: THREE.Quaternion = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, 0, 0));
    this.zFrontWall.setQuaternion(tempQuat);
  }
  setZBackWall(newWall: WallElement) {
    this.zBackWall = newWall;
    this.zBackWall.setPosition(
      new THREE.Vector3(this.pos.x, this.pos.y + this.gridDistanceY / 2, this.pos.z - this.gridDistanceXZ/ 2)
    );

    let tempQuat: THREE.Quaternion = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, 0, 0));
    this.zBackWall.setQuaternion(tempQuat);
  } */
  getXLeftWall(newWall: WallElement): PositionRotationResult {
    let tempPos = new THREE.Vector3(
      this.pos.x - this.gridDistanceXZ / 2,
      this.pos.y + this.gridDistanceY / 2,
      this.pos.z
    );

    let tempQuat: THREE.Quaternion = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
    return { position: tempPos, rotation: tempQuat };
  }
  getXRightWall(newWall: WallElement): PositionRotationResult {
    let tempPos = new THREE.Vector3(
      this.pos.x + this.gridDistanceXZ / 2,
      this.pos.y + this.gridDistanceY / 2,
      this.pos.z
    );

    let tempQuat: THREE.Quaternion = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
    return { position: tempPos, rotation: tempQuat };
  }
  getZFrontWall(newWall: WallElement): PositionRotationResult {
    let tempPos = new THREE.Vector3(
      this.pos.x,
      this.pos.y + this.gridDistanceY / 2,
      this.pos.z + this.gridDistanceXZ / 2
    );

    let tempQuat: THREE.Quaternion = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, 0, 0));
    return { position: tempPos, rotation: tempQuat };
  }
  getZBackWall(newWall: WallElement): PositionRotationResult {
    let tempPos = new THREE.Vector3(
      this.pos.x,
      this.pos.y + this.gridDistanceY / 2,
      this.pos.z - this.gridDistanceXZ / 2
    );

    let tempQuat: THREE.Quaternion = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, 0, 0));
    return { position: tempPos, rotation: tempQuat };
  }

  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, cShape: CANNON.Shape) {
    super(geometry, material, cShape);
  }
}
