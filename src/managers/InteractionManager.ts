import * as THREE from "three";
import EventManager from "../inventory/utils/EventManager";
import InputManager from "./InputManager";

type EventType = "left" | "right";
type Event<T extends EventType = EventType> = { type: T; id?: number };

type EventFunc = (e: Required<Event>, intersection: THREE.Intersection) => unknown;

export default class InteractionManager {
  private raycaster: THREE.Raycaster;
  private camera?: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private inputManager: InputManager;
  private eventManager;
  private bufferVector = new THREE.Vector3();

  private leftListeners: Map<number | undefined, EventFunc[]> = new Map();
  private rightListeners: Map<number | undefined, EventFunc[]> = new Map();

  constructor(worldScene: THREE.Scene, inputManager: InputManager, camera?: THREE.PerspectiveCamera) {
    this.raycaster = new THREE.Raycaster();
    this.camera = camera;
    this.scene = worldScene;
    this.inputManager = inputManager;
    this.eventManager = new EventManager(["right", "left"]);

    this.inputManager.addMouseButtonCallback(3, (down) => down && this.onRightClick());
    this.inputManager.addMouseButtonCallback(1, (down) => down && this.onLeftClick());
  }

  shootRaycast(near = 0, far = 50) {
    if (this.camera) {
      this.raycaster.set(this.camera.position, this.camera.getWorldDirection(this.bufferVector));
      this.raycaster.near = near;
      this.raycaster.far = far;

      return this.raycaster
        .intersectObjects(this.scene.children, true)
        .filter((intersect) => intersect.object.name !== "nointersect");
    }
    throw new Error("Not camera defined");
  }

  onRightClick() {
    const result = this.shootRaycast();

    if (result[0]) {
      const id = result[0].object.id;

      const funcs = this.rightListeners.get(id);
      const defaultFuncs = this.rightListeners.get(undefined);

      funcs && funcs.forEach((func) => func({ type: "right", id }, result[0]));
      defaultFuncs && defaultFuncs.forEach((func) => func({ type: "right", id }, result[0]));
    }
  }

  onLeftClick() {
    const result = this.shootRaycast();

    if (result[0]) {
      const id = result[0].object.id;

      const funcs = this.leftListeners.get(id);
      const defaultFuncs = this.leftListeners.get(undefined);

      funcs && funcs.forEach((func) => func({ type: "left", id }, result[0]));
      defaultFuncs && defaultFuncs.forEach((func) => func({ type: "left", id }, result[0]));
    }
  }

  addEventListener(on: Event, f: EventFunc) {
    if (on.type === "left") {
      const funcs = this.leftListeners.get(on.id) || [];

      this.leftListeners.set(on.id, [...funcs, f]);
    } else {
      const funcs = this.rightListeners.get(on.id) || [];
      this.rightListeners.set(on.id, [...funcs, f]);
    }
  }

  set perspectiveCamera(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }
}
