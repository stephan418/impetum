import * as THREE from "three";
import World from "../core/World";
import GridElement from "../building/GridElement";
import WoodenWall from "../building/Walls/WoodenWall";
import WoodenFloor from "../building/Floors/WoodenFloor";
import FloorElement from "../building/FloorElement";
import WallElement from "../building/WallElement";
import PositionRotationResult from "../interfaces/PositionRotationResult";

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
  private objectIdToGridElement(id: number): GridElement | undefined {
    let returnThisLater = undefined;
    for (let val of this.gridElements) {
      if (val.getMesh().id == id) {
        returnThisLater = val;
        break;
      }
    }
    return returnThisLater;
  }
  private getFirstIntersect(intersections: THREE.Intersection[]) {}
  shotRayCastGetBuildingElementPosition(
    el: WallElement | FloorElement,
    position: THREE.Vector3,
    direction: THREE.Vector3,
    near: number,
    far: number
  ): PositionRotationResult {
    if (el instanceof FloorElement) {
      let a: THREE.Intersection[] = this.shootRayCast(position, direction, near, far);
      if (a.length <= 0) {
        return { position: undefined, rotation: undefined };
      }
      let foundIntersection = this.objectIdToGridElement(a[0].object.id);
      if (foundIntersection instanceof FloorElement) {
        return {
          position: el.getPositonOnGrid(
            new THREE.Vector3(a[0].point.x, a[0].point.y + foundIntersection.gridDistanceY, a[0].point.z)
          ),
          rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
        };
      }
      return {
        position: el.getPositonOnGrid(a[0].point),
        rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
      };
    } else if (el instanceof WallElement) {
      let a: THREE.Intersection[] = this.shootRayCast(position, direction, near, far);
      if (a.length <= 0) {
        return { position: undefined, rotation: undefined };
      }
      let returnThisLater: PositionRotationResult = { position: undefined, rotation: undefined };
      let val = this.objectIdToGridElement(a[0].object.id);
      if (val != undefined && val instanceof FloorElement) {
        let tempFloorResult = val.getZFrontWall(el);
        returnThisLater = tempFloorResult;
      }
      return returnThisLater;
    }
    return { position: undefined, rotation: undefined };
  }
  addGridElement(element: GridElement) {
    element.addToWorld(this.world);
    this.gridElements.push(element);
  }
}
