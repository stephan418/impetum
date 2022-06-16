import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import World from "../core/World";
import EventManager from "../inventory/utils/EventManager";
import InputManager from "./InputManager";

type EventType = "pause" | "unpause";

export default class GameStateManager {
  private world: World;
  private inputManager: InputManager;
  private pointerLockControls: PointerLockControls;
  private domElement;

  // State
  private paused = false;

  private eventManager;

  public addEventListener;
  public removeEventListener;
  public dispatchEvent;

  constructor(
    world: World,
    inputManager: InputManager,
    pointerLockControls: PointerLockControls,
    domElement: HTMLElement
  ) {
    this.eventManager = new EventManager(["pause", "unpause", "lose"]);

    this.addEventListener = this.eventManager.addEventListener.bind(this.eventManager);
    this.removeEventListener = this.eventManager.removeEventListener.bind(this.eventManager);
    this.dispatchEvent = this.eventManager.dispatchEvent.bind(this.eventManager);

    this.inputManager = inputManager;
    this.pointerLockControls = pointerLockControls;
    this.world = world;
    this.domElement = domElement;

    this.pointerLockControls.addEventListener("unlock", () => this.pause());
  }

  private togglePause() {
    if (this.paused) {
      this.unpause();
    } else {
      this.pause();
    }
  }

  pause() {
    this.paused = true;
    this.dispatchEvent("pause");

    (this.world as any)._pause();

    this.domElement.onclick = (e) => e.stopPropagation();
  }

  unpause() {
    this.paused = false;
    this.dispatchEvent("unpause");

    (this.world as any)._unpause();

    this.domElement.onclick = null;
  }

  // -- Public interface --

  get isPaused() {
    return this.paused;
  }

  get pointerLocked() {
    return this.pointerLockControls.isLocked;
  }
}
