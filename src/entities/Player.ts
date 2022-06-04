import * as THREE from "three";
import * as CANNON from "cannon-es";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import World from "../core/World";
import Entity from "../interfaces/Entity";
import InputManager from "../managers/InputManager";
import { config } from "../managers/OptionsManager";
import BuildingManager from "../managers/BuildingManager";
import PlayerInventory from "../inventory/PlayerInventory";
import WoodenFloor from "../building/Floors/WoodenFloor";
import ResourceManager from "../managers/ResourceManager";
import WoodenWall from "../building/Walls/WoodenWall";
import WallElement from "../building/WallElement";
import WoodenFloorItem from "../inventory/items/WoodenFloor";
import GridElement from "../building/GridElement";
import BuildingElement from "../interfaces/BuildingElement";
import WoodenWallItem from "../inventory/items/WoodenWall";
import FloorElement from "../building/FloorElement";
import { slipperyMaterial } from "../core/CannonMaterials";
import Item from "../inventory/Item";

export default class Player implements Entity {
  camera: THREE.PerspectiveCamera;
  pointerLockControls: PointerLockControls;
  inputManager: InputManager;
  lookDirection: THREE.Vector3;

  private colliderRadius: number;
  private cShape: CANNON.Shape;
  private cBody: CANNON.Body;
  private canJump: boolean;

  private buildingManager: BuildingManager;
  private resourceManager: ResourceManager;
  private scene: THREE.Scene;

  private moveVelocity: number;
  private jumpVelocity: number;
  private howMuchRight: number;
  private howMuchBack: number;

  private buildingGhostClock: THREE.Clock;
  private ghostSelectedItem: Item | undefined;
  private ghostSelectedItemPrevious: Item | undefined;
  private ghostBuildingElement: any;

  readonly inventory: PlayerInventory;

  private lookDirectionEmptyVector: THREE.Vector3;

  constructor(
    aspect = 1,
    fov = 80,
    near = 0.1,
    far = 1000,
    inputManager: InputManager,
    buildingManager: BuildingManager,
    resourceManager: ResourceManager,
    scene: THREE.Scene,
    domElement?: HTMLElement
  ) {
    this.scene = scene;
    this.howMuchRight = 0;
    this.howMuchBack = 0;

    this.buildingGhostClock = new THREE.Clock();
    this.buildingGhostClock.start();
    this.ghostSelectedItem = undefined;
    this.ghostSelectedItemPrevious = undefined;
    this.ghostBuildingElement = undefined;

    this.moveVelocity = 1900;
    this.jumpVelocity = 40;
    this.canJump = false;
    this.buildingManager = buildingManager;
    this.resourceManager = resourceManager;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.pointerLockControls = new PointerLockControls(this.camera, domElement ?? document.body);
    this.addPointerLockOnClick(document.body);
    this.inputManager = inputManager;

    this.colliderRadius = 1.3;
    this.cShape = new CANNON.Sphere(this.colliderRadius);
    //TODO: actually fix player jumping speed, not just add mass
    this.cBody = new CANNON.Body({ mass: 100, material: slipperyMaterial });
    // this.cBody.linearDamping = 0.99;
    // this.cBody.linearFactor = new CANNON.Vec3(1, 2, 1);
    this.cBody.position.set(0, 10, 50);
    // this.cBody.addShape(this.cShape);
    this.cBody.addShape(this.cShape, new CANNON.Vec3(0, 3, 0));
    this.cBody.addShape(this.cShape, new CANNON.Vec3(0, 0, 0));
    this.cBody.fixedRotation = true;
    this.cBody.updateMassProperties();

    this.lookDirectionEmptyVector = new THREE.Vector3();

    //Add Event Listener for detecting Collision
    this.cBody.addEventListener("collide", (event: any) => {
      if (event.contact.ni.dot(new CANNON.Vec3(0, 1, 0)) < -0.4) {
        this.canJump = true;
      }
    });

    this.inputManager.addKeyCallback(config.keys.jump, () => {
      if (this.canJump == true) {
        this.cBody.velocity.y += this.jumpVelocity;
        this.canJump = false;
      }
    });

    //no idea how to do this with other elements than just WoodenFloor
    /* const isBuildable = (obj: any): obj is Buildable<WoodenFloor> => {
      return "buildingElement" in obj;
    }; */

    //Building on right mouse button
    this.inputManager.addMouseButtonCallback(3, (down) => {
      if (down == true) {
        //I have absolutely no clue how to type this
        if (
          this.inventory.selected != undefined &&
          (this.inventory.selected.item as any).buildingElement != undefined
        ) {
          let buildingElement = new (this.inventory.selected.item as any).buildingElement(this.resourceManager);
          this.buildingManager.addGridElement(buildingElement);
          let rayResult = this.buildingManager.shotRayCastGetBuildingElementPosition(
            buildingElement,
            this.camera.position,
            this.camera.getWorldDirection(this.lookDirectionEmptyVector),
            0,
            50
          );
          buildingElement.setPosition(rayResult.position || new THREE.Vector3(0, 0, 0));
          buildingElement.setQuaternion(rayResult.rotation || new THREE.Quaternion(0, 0, 0));
          //make item -= 1
        }
      }
    });
    this.lookDirection = new THREE.Vector3();

    this.inventory = new PlayerInventory(config.inventory.hotbarSlots, config.inventory.backSlots, inputManager);
    this.inventory.collect(new WoodenFloorItem(), 10);
    this.inventory.collect(new WoodenWallItem(), 10);
  }
  private addPointerLockOnClick(domElement: HTMLElement) {
    domElement.onclick = () => {
      this.pointerLockControls.lock();
    };
  }

  addToWorld(world: World): void {
    world.cScene.addBody(this.cBody);
  }
  removeFromWorld(world: World): void {
    world.cScene.removeBody(this.cBody);
  }

  movePlayer(x: number, y: number, z: number) {
    this.lookDirection.x = x;
    this.lookDirection.y = y;
    this.lookDirection.z = z;
    this.lookDirection.applyQuaternion(this.camera.quaternion);
    this.cBody.velocity.x = this.lookDirection.x * 2;
    this.cBody.velocity.z = this.lookDirection.z * 2;
  }

  update(deltaTime: number): void {
    //movement
    this.howMuchBack = 0;
    this.howMuchRight = 0;

    if (this.inputManager.isPressed(config.keys.movementForward)) {
      this.howMuchBack = -this.moveVelocity * deltaTime;
    } else if (this.inputManager.isPressed(config.keys.movementBackward)) {
      this.howMuchBack = this.moveVelocity * deltaTime;
    }

    if (this.inputManager.isPressed(config.keys.movementLeft)) {
      this.howMuchRight = -this.moveVelocity * deltaTime;
    } else if (this.inputManager.isPressed(config.keys.movementRight)) {
      this.howMuchRight = this.moveVelocity * deltaTime;
    }

    this.movePlayer(this.howMuchRight, 0, this.howMuchBack);
    this.cBody.velocity.x = parseFloat(this.cBody.velocity.x.toFixed(2));
    this.cBody.velocity.y = parseFloat(this.cBody.velocity.y.toFixed(2));
    this.cBody.velocity.z = parseFloat(this.cBody.velocity.z.toFixed(2));
    if (this.cBody.velocity.y == 0) {
      this.cBody.velocity.y = 0.1;
    } else if (this.cBody.velocity.y > 40) {
      this.cBody.velocity.y = 40;
    }
    this.camera.position.copy(this.cBody.position as unknown as THREE.Vector3);
    this.camera.position.y += 3;

    if (this.buildingGhostClock.getElapsedTime() > 0.1) {
      if (this.inventory.selected != undefined) {
        this.ghostSelectedItem = this.inventory.selected.item || undefined;
        //Change has happened, generate new mesh and delete the old one
        if (this.ghostSelectedItem != this.ghostSelectedItemPrevious) {
          if (this.ghostBuildingElement != undefined) {
            this.buildingManager.removeGhostElement(this.ghostBuildingElement);
          }
          this.ghostBuildingElement = new (this.inventory.selected.item as any).buildingElement(this.resourceManager);
          this.buildingManager.addGhostElement(this.ghostBuildingElement);
        }

        let rayResult = this.buildingManager.shotRayCastGetBuildingElementPosition(
          this.ghostBuildingElement,
          this.camera.position,
          this.camera.getWorldDirection(this.lookDirectionEmptyVector),
          0,
          50
        );
        this.ghostBuildingElement.setPosition(rayResult.position || new THREE.Vector3(-100, -100, -100));
        this.ghostBuildingElement.setQuaternion(rayResult.rotation || new THREE.Quaternion());
      }
      this.buildingGhostClock.start();
    }
  }

  //@ts-ignore
  updatePhysics(deltaTime: number): void {}
}
