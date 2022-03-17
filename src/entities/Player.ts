import * as THREE from "three";
import * as CANNON from "cannon-es";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import World from "../core/World";
import Entity from "../interfaces/Entity";
import InputManager from "../managers/InputManager";
import { config } from "../managers/OptionsManager";

export default class Player implements Entity {
  camera: THREE.PerspectiveCamera;
  pointerLockControls: PointerLockControls;
  inputManager: InputManager;
  lookDirection: THREE.Vector3;

  private colliderRadius: number;
  private cShape: CANNON.Shape;
  private cBody: CANNON.Body;

  constructor(aspect = 1, fov = 80, near = 0.1, far = 1000, inputManager: InputManager) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.pointerLockControls = new PointerLockControls(this.camera, document.body);
    this.addPointerLockOnClick(document.body);
    this.inputManager = inputManager;

    this.colliderRadius = 1.3;
    this.cShape = new CANNON.Sphere(this.colliderRadius);
    this.cBody = new CANNON.Body({ mass: 10 });
    this.cBody.linearDamping = 0.99;
    this.cBody.position.set(0, 10, 5);
    this.cBody.fixedRotation = false;
    this.cBody.addShape(this.cShape);

    this.lookDirection = new THREE.Vector3();
  }
  private addPointerLockOnClick(domElement: HTMLElement) {
    domElement.addEventListener("click", () => {
      this.pointerLockControls.lock();
    });
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

  //@ts-ignore
  update(deltaTime: number): void {}

  //@ts-ignore
  updatePhysics(deltaTime: number): void {
    //movement
    //currently in updatePhysics but may be moved to the update method for better performance
    if (this.inputManager.isPressed(config.keys.movementForward)) {
      this.movePlayer(0, 0, -1);
    } else if (this.inputManager.isPressed(config.keys.movementBackward)) {
      this.movePlayer(0, 0, 1);
    }

    if (this.inputManager.isPressed(config.keys.movementLeft)) {
      this.movePlayer(-1, 0, 0);
    } else if (this.inputManager.isPressed(config.keys.movementRight)) {
      this.movePlayer(1, 0, 0);
    }

    this.camera.position.copy(this.cBody.position as unknown as THREE.Vector3);
  }
}
