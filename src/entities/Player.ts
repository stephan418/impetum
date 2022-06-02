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
    this.cBody = new CANNON.Body({ mass: 10000 });
    this.cBody.linearDamping = 0.9;
    this.cBody.linearFactor = new CANNON.Vec3(1, 2, 1);
    this.cBody.position.set(0, 10, 5);
    this.cBody.addShape(this.cShape);

    this.lookDirectionEmptyVector = new THREE.Vector3();

    //Add Event Listener for detecting Collision
    this.cBody.addEventListener("collide", (event: any) => {
      if (event.contact.ni.dot(new CANNON.Vec3(0, 1, 0)) < -0.4) {
        this.canJump = true;
      }
    });

    this.inputManager.addKeyCallback(config.keys.jump, () => {
      if (this.canJump == true) {
        this.cBody.velocity.y += 50;
        this.canJump = false;
      }
    });

    this.inputManager.addMouseButtonCallback(3, (down) => {
      if (down == true) {
        // console.log(this.buildingManager.shootRayCast(this.camera.position, this.camera.getWorldDirection(this.lookDirectionEmptyVector), 0, 20));
        let rayIntersects = this.buildingManager.shootRayCast(
          this.camera.position,
          this.camera.getWorldDirection(this.lookDirectionEmptyVector),
          0,
          50
        );
        if (rayIntersects.length > 0) {
          let position = rayIntersects[0].point;
          let woodenFloor = new WoodenFloor(this.resourceManager);
          this.buildingManager.addGridElement(woodenFloor);
          position.y = position.y;
          console.log(`${position.x} ${position.y} ${position.z}`);
          console.log(
            `${Math.floor(position.x / 10) * 10} ${Math.floor(position.y / 10) * 10} ${
              Math.floor(position.z / 10) * 10
            }`
          );
          woodenFloor.setPositionOnGrid(position);
        }
      }
    });

    this.lookDirection = new THREE.Vector3();

    this.inventory = new PlayerInventory(config.inventory.hotbarSlots, config.inventory.backSlots, inputManager);
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
    this.cBody.velocity.x += this.lookDirection.x * 2;
    this.cBody.velocity.z += this.lookDirection.z * 2;
  }

  update(deltaTime: number): void {
    //movement
    if (this.inputManager.isPressed(config.keys.movementForward)) {
      this.movePlayer(0, 0, -70 * deltaTime);
    } else if (this.inputManager.isPressed(config.keys.movementBackward)) {
      this.movePlayer(0, 0, 70 * deltaTime);
    }

    if (this.inputManager.isPressed(config.keys.movementLeft)) {
      this.movePlayer(-70 * deltaTime, 0, 0);
    } else if (this.inputManager.isPressed(config.keys.movementRight)) {
      this.movePlayer(70 * deltaTime, 0, 0);
    }

    this.camera.position.copy(this.cBody.position as unknown as THREE.Vector3);
  }

  //@ts-ignore
  updatePhysics(deltaTime: number): void {}
}
