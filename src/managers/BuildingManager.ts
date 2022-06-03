import * as THREE from "three";
import World from "../core/World";
import GridElement from "../building/GridElement";
import WoodenWall from "../building/Walls/WoodenWall";
import WoodenFloor from "../building/Floors/WoodenFloor";
import FloorElement from "../building/FloorElement";
import WallElement from "../building/WallElement";

interface PositionRotationResult {
  position: THREE.Vector3 | undefined;
  rotation: THREE.Quaternion | undefined;
}

export default class BuildingManager {
  raycaster: THREE.Raycaster;
  private scene: THREE.Scene;
  private world: World;
  private gridElements: GridElement[];
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
  private getFirstIntersect(intersections: THREE.Intersection[]) {}
  shotRayCastGetBuildingElementPosition(el: WallElement | FloorElement, position: THREE.Vector3, direction: THREE.Vector3, near: number, far: number) {
    if (el instanceof FloorElement) {
      let a: THREE.Intersection[] = this.shootRayCast(position, direction, near, far);
      if (a.length <= 0) {
        return {position: undefined, rotation: undefined};
      }
      return {position: el.getPositonOnGrid(a[0].point), rotation: ( new THREE.Quaternion() ).setFromEuler(new THREE.Euler(0, 0, 0)) };
    }
    if (el instanceof WallElement) {
      let a: THREE.Intersection[] = this.shootRayCast(position, direction, near, far);
      if (a.length <= 0) {
        return {position: undefined, rotation: undefined};
      }
      this.gridElements.forEach((val, idx) => {
        if(a[0].object.id == val.getMesh().id){
          let obj = a[0].object;
          console.log(obj.position);
          if(val instanceof FloorElement){
            console.log("why does this not work");
            val.setZFrontWall(el);
          }
          return {position: obj.position, rotation: ( new THREE.Quaternion() ).setFromEuler(new THREE.Euler(0, 0, 0))}
        }
        return {position: undefined, rotation: undefined}
      });
    }
    return {position: undefined, rotation: undefined};
  }
  addGridElement(element: GridElement) {
    element.addToWorld(this.world);
    this.gridElements.push(element);
  }
}
