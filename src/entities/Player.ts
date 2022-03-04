import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import World from "../core/World";
import Entity from "../interfaces/Entity";
import InputManager from "../managers/InputManager";

export default class Player implements Entity {
  camera: THREE.PerspectiveCamera;
  pointerLockControls: PointerLockControls;
  inputManager: InputManager;

  constructor(aspect = 1, fov = 80, near = 0.1, far = 1000, inputManager: InputManager) {
    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this.pointerLockControls = new PointerLockControls(this.camera, document.body);
    this.addPointerLockOnClick(document.body);
    this.inputManager = inputManager;
  }
  private addPointerLockOnClick(domElement: HTMLElement) {
    domElement.addEventListener("click", () => {
      this.pointerLockControls.lock();
    });
  }

  addToWorld(world: World): unknown {}
  removeFromWorld(world: World): unknown {}
  update(deltaTime: number): unknown {}

  updatePhysics(deltaTime: number): unknown {}
}
