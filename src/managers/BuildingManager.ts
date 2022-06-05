import * as THREE from "three";
import World from "../core/World";
import GridElement from "../building/GridElement";
import WoodenWall from "../building/Walls/WoodenWall";
import WoodenFloor from "../building/Floors/WoodenFloor";
import FloorElement from "../building/FloorElement";
import WallElement from "../building/WallElement";
import PositionRotationResult from "../interfaces/PositionRotationResult";
import BuildingElement from "../interfaces/BuildingElement";
import BaseElement from "../building/BaseElement";
import TurretElement from "../building/TurretElement";
import FreeElement from "../building/FreeElement";

export default class BuildingManager {
  raycaster: THREE.Raycaster;
  private scene: THREE.Scene;
  private world: World;
  private gridElements: GridElement[];
  private freeElements: FreeElement[];
  private allElements: BaseElement[];
  constructor(world: World) {
    this.raycaster = new THREE.Raycaster();
    this.scene = world.scene;
    this.gridElements = [];
    this.freeElements = [];
    this.allElements = [];
    this.world = world;
  }
  shootRayCast(position: THREE.Vector3, direction: THREE.Vector3, near: number, far: number): THREE.Intersection[] {
    this.raycaster.set(position, direction);
    this.raycaster.near = near;
    this.raycaster.far = far;
    return this.raycaster
      .intersectObjects(this.world.scene.children, true)
      .filter((intersect) => intersect.object.name != "nointersect");
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
    el: WallElement | FloorElement | TurretElement,
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
        let k = val.getPosition();
        let objPositions = {
          zFrontPosition: new THREE.Vector3(k.x, k.y, k.z + val.gridDistanceXZ / 2),
          zBackPosition: new THREE.Vector3(k.x, k.y, k.z - val.gridDistanceXZ / 2),
          xRightPosition: new THREE.Vector3(k.x + val.gridDistanceXZ / 2, k.y, k.z),
          xLeftPosition: new THREE.Vector3(k.x - val.gridDistanceXZ / 2, k.y, k.z),
        };
        let objDistances = {
          zFrontPositionDistance: a[0].point.distanceToSquared(objPositions.zFrontPosition),
          zBackPositionDistance: a[0].point.distanceToSquared(objPositions.zBackPosition),
          xRightPositionDistance: a[0].point.distanceToSquared(objPositions.xRightPosition),
          xLeftPositionDistance: a[0].point.distanceToSquared(objPositions.xLeftPosition),
        };
        let smallest = "";
        for (let key in objDistances) {
          if (smallest != "" && (objDistances as any)[key] < (objDistances as any)[smallest]) {
            smallest = key;
          } else if (smallest == "") {
            smallest = key;
          }
        }
        switch (smallest) {
          case "zFrontPositionDistance":
            returnThisLater = val.getZFrontWall(el);
            break;
          case "zBackPositionDistance":
            returnThisLater = val.getZBackWall(el);
            break;
          case "xRightPositionDistance":
            returnThisLater = val.getXRightWall(el);
            break;
          case "xLeftPositionDistance":
            returnThisLater = val.getXLeftWall(el);
            break;
          default:
            console.error("No Smallest Position found");
            break;
        }
        //place beneath
        if (a[0].point.y < val.getMesh().position.y && returnThisLater.position != undefined) {
          returnThisLater.position.y -= val.gridDistanceY;
        }
      } else if (val != undefined && val instanceof WallElement) {
        // console.log(this.gridElements);
        returnThisLater = { position: val.getMesh().position.clone(), rotation: val.getMesh().quaternion.clone() };
        if (a[0].point.y < val.getMesh().position.y && returnThisLater.position != undefined) {
          returnThisLater.position.y -= val.gridDistanceY;
        } else if (a[0].point.y >= val.getMesh().position.y && returnThisLater.position != undefined) {
          returnThisLater.position.y += val.gridDistanceY;
        }
      }
      return returnThisLater;
    } else if (el instanceof TurretElement) {
      let a: THREE.Intersection[] = this.shootRayCast(position, direction, near, far);
      if (a.length <= 0) {
        return { position: undefined, rotation: undefined };
      }
      return {
        position: a[0].point.clone(),
        rotation: new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0)),
      };
    }
    return { position: undefined, rotation: undefined };
  }
  addGridElement(element: GridElement | FreeElement) {
    element.addToWorld(this.world);
    if (element instanceof GridElement) this.gridElements.push(element);
    if (element instanceof FreeElement) this.freeElements.push(element);
    this.allElements.push(element);
  }

  addGhostElement(element: BaseElement) {
    element.setGhost(true);
    element.addToWorld(this.world);
  }
  removeGhostElement(element: BaseElement) {
    element.setGhost(false);
    element.removeFromWorld(this.world);
  }
}
