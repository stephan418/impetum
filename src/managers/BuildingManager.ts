import * as THREE from "three";
import World from "../core/World";
import GridElement from "../building/GridElement";
export default class BuildingManager {
  raycaster: THREE.Raycaster;
  private scene: THREE.Scene;
  private world: World;
  private gridElements: GridElement[]
  constructor(world: World) {
    this.raycaster = new THREE.Raycaster();
    this.scene = world.scene;
    this.gridElements = [];
    this.world = world;
  }
  shootRayCast(position: THREE.Vector3, direction: THREE.Vector3, near: number, far: number): THREE.Intersection[] {
    this.raycaster.set(position, direction);
    this.raycaster.near = near;
    this.raycaster.far = far;
    return this.raycaster.intersectObjects(this.world.scene.children, true);
  }
  addGridElement(element:GridElement){
    element.addToWorld(this.world);
  };
}
