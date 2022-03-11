import * as THREE from "three";
import * as CANNON from "cannon-es";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import World from "../core/World";
import Entity from "../interfaces/Entity";
import InputManager from "../managers/InputManager";

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
    this.cBody.linearDamping = 0.9;
    this.cBody.position.set(0, 10, 5);
    this.cBody.fixedRotation = true;
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
  //@ts-ignore
  update(deltaTime: number): void {}

  //@ts-ignore
  updatePhysics(deltaTime: number): void {
    if (this.inputManager.isPressed("w")) {
      // this.camera.getWorldDirection(this.lookDirection);
      this.lookDirection = new THREE.Vector3(0, 0, -1);
      let tempRotation = new THREE.Euler();
      tempRotation.copy(this.camera.rotation);

      this.lookDirection.applyEuler(tempRotation);
      // this.lookDirection.applyQuaternion();
      this.cBody.velocity.x += this.lookDirection.x * 4;
      this.cBody.velocity.y += this.lookDirection.y * 4;
      this.cBody.velocity.z += this.lookDirection.z * 4;
    }
    this.camera.position.copy(this.cBody.position as unknown as THREE.Vector3);
  }
}
