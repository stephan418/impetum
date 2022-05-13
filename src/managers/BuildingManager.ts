import * as THREE from "three";
export default class BuildingManager {
  raycaster: THREE.Raycaster;
  private scene: THREE.Scene;
  constructor(scene: THREE.Scene) {
    this.raycaster = new THREE.Raycaster();
    this.scene = scene;
  }
  setRayCaster(position: THREE.Vector3, direction: THREE.Vector3, near: number, far: number): THREE.Intersection[] {
    this.raycaster.set(position, direction);
    this.raycaster.near = near;
    this.raycaster.far = far;
    return this.raycaster.intersectObjects(this.scene.children, true);
  }
}
