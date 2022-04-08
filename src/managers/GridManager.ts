import * as THREE from "three";
export default class GridManager {
  origin: THREE.Vector3;
  blockSize: number;
  constructor() {
    this.origin = new THREE.Vector3();
    this.blockSize = 8;
  }
  positionToGridPosition(pos: THREE.Vector3, axis: string) {
    let calculatedPosition = new THREE.Vector3(
      Math.floor(pos.x / this.blockSize) * this.blockSize + (axis != "x" ? this.blockSize / 2 : 0),
      Math.floor(pos.y / this.blockSize) * this.blockSize + (axis != "y" ? this.blockSize / 2 : 0),
      Math.floor(pos.z / this.blockSize) * this.blockSize + (axis != "z" ? this.blockSize / 2 : 0)
    );
    return calculatedPosition;
  }
}
