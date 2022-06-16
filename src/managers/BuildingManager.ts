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
import EventManager, { ParameterizedEventManager } from "../inventory/utils/EventManager";

export default class BuildingManager {
  raycaster: THREE.Raycaster;
  private scene: THREE.Scene;
  private world: World;
  public gridElements: GridElement[];
  public freeElements: FreeElement[];
  private allElements: BaseElement[];

  private eventManager: ParameterizedEventManager<{ remove: { element: BaseElement } }>;
  public addEventListener;

  constructor(world: World) {
    this.raycaster = new THREE.Raycaster();
    this.scene = world.scene;
    this.gridElements = [];
    this.freeElements = [];
    this.allElements = [];
    this.world = world;

    this.eventManager = new ParameterizedEventManager();
    this.addEventListener = this.eventManager.addEventlistener.bind(this.eventManager);
  }
  shootRayCast(position: THREE.Vector3, direction: THREE.Vector3, near: number, far: number): THREE.Intersection[] {
    this.raycaster.set(position, direction);
    this.raycaster.near = near;
    this.raycaster.far = far;
    return this.raycaster
      .intersectObjects(this.world.scene.children, true)
      .filter((intersect) => intersect.object.name != "nointersect");
  }
  public isSomethingAtPositionAlready(vec: THREE.Vector3) {
    //TODO: optimize please
    for (let val of this.allElements) {
      if (
        Math.floor(val.getPosition().x) == Math.floor(vec.x) &&
        Math.floor(val.getPosition().y) == Math.floor(vec.y) &&
        Math.floor(val.getPosition().z) == Math.floor(vec.z)
      ) {
        return true;
      }
    }
    return false;
  }
  public isGridElementAtPositionAlready(vec: THREE.Vector3) {
    //TODO: optimize please
    for (let val of this.gridElements) {
      if (
        Math.floor(val.getPosition().x) == Math.floor(vec.x) &&
        Math.floor(val.getPosition().y) == Math.floor(vec.y) &&
        Math.floor(val.getPosition().z) == Math.floor(vec.z)
      ) {
        return true;
      }
    }
    return false;
  }
  public objectIdToGridElement(id: number): GridElement | undefined {
    let returnThisLater = undefined;
    for (let val of this.gridElements) {
      if (val.getMesh().id == id) {
        returnThisLater = val;
        break;
      }
    }
    return returnThisLater;
  }
  public objectIdToFreeElement(id: number): FreeElement | undefined {
    let returnThisLater = undefined;
    for (let val of this.freeElements) {
      val.getParts().forEach((partVal, partId) => {
        if (partVal.mesh.id == id) {
          returnThisLater = val;
        }
      });
    }
    return returnThisLater;
  }
  public objectIdToElement(id: number): GridElement | FreeElement | undefined {
    let g = this.objectIdToGridElement(id);
    let f = this.objectIdToFreeElement(id);
    return f || g || undefined;
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
  removeGridElement(element: BaseElement) {
    element.break();
    element.removeFromWorld(this.world);
    if (element instanceof GridElement) {
      this.gridElements.forEach((val, idx) => {
        if (val == element) {
          this.gridElements.splice(idx, 1);
        }
      });
    }
    if (element instanceof FreeElement) {
      this.freeElements.forEach((val, idx) => {
        if (val == element) {
          this.freeElements.splice(idx, 1);
        }
      });
    }
    this.allElements.forEach((val, idx) => {
      if (val == element) {
        this.allElements.splice(idx, 1);
      }
    });

    this.eventManager.dispatchEvent("remove", { element: element });
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
