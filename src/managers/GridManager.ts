import * as THREE from "three";
export default class GridManager {
  origin: THREE.Vector3;
  blockSize: number;
  constructor() {
    this.origin = new THREE.Vector3();
    this.blockSize = 8;
  }
  positionToGridPosition(pos: THREE.Vector3, axis: string) {
    let calculatedPosition = new THREE.Vector3(0, 0, 0);
    if (axis == "x") {
      calculatedPosition = new THREE.Vector3(
        Math.floor(pos.x / this.blockSize) * this.blockSize,
        Math.floor(pos.y / this.blockSize) * this.blockSize + this.blockSize / 2,
        Math.floor(pos.z / this.blockSize) * this.blockSize + this.blockSize / 2
      );
    }
    if (axis == "y") {
      calculatedPosition = new THREE.Vector3(
        Math.floor(pos.x / this.blockSize) * this.blockSize + this.blockSize / 2,
        Math.floor(pos.y / this.blockSize) * this.blockSize,
        Math.floor(pos.z / this.blockSize) * this.blockSize + this.blockSize / 2
      );
    }
    if (axis == "z") {
      calculatedPosition = new THREE.Vector3(
        Math.floor(pos.x / this.blockSize) * this.blockSize + this.blockSize / 2,
        Math.floor(pos.y / this.blockSize) * this.blockSize + this.blockSize / 2,
        Math.floor(pos.z / this.blockSize) * this.blockSize
      );
    }
    return calculatedPosition;
  }
}
