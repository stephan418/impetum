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
  private canJump: boolean;

  constructor(aspect = 1, fov = 80, near = 0.1, far = 1000, inputManager: InputManager) {
    this.canJump = false;

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.pointerLockControls = new PointerLockControls(this.camera, document.body);
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

    //Add Event Listener for detecting Collision
    this.cBody.addEventListener("collide", (event) => {
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
