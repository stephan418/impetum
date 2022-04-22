import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import InputManager from "./InputManager";

type EventType = "pause" | "unpause";

export default class GameStateManager {
  private inputManager: InputManager;
  private pointerLockControls: PointerLockControls;

  // State
  private paused = false;

  private eventListerners: { [k in EventType]?: (() => unknown)[] };

  constructor(inputManager: InputManager, pointerLockControls: PointerLockControls) {
    this.eventListerners = {};

    this.inputManager = inputManager;
    this.pointerLockControls = pointerLockControls;

    this.inputManager.addKeyCallback("Escape", (pressed) => {
      if (!pressed) return;

      this.togglePause();
    });

    this.pointerLockControls.addEventListener("unlock", () => this.pause());
    this.pointerLockControls.addEventListener("lock", () => this.unpause());
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
  }

  unpause() {
    this.paused = false;
    this.dispatchEvent("unpause");
  }

  // -- Events --

  addEventListener(eventType: EventType, callback: () => unknown) {
    if (!(eventType in this.eventListerners)) {
      this.eventListerners[eventType] = [];
    }

    this.eventListerners[eventType]?.push(callback);
  }

  removeEventListener(eventType: EventType, callback: () => unknown) {
    const listeners = this.eventListerners[eventType];

    if (listeners) {
      listeners.splice(
        listeners.findIndex((c) => c === callback),
        0
      );
    }
  }

  private dispatchEvent(eventType: EventType) {
    this.eventListerners[eventType]?.forEach((c) => c());
  }

  // -- Public interface --

  get isPaused() {
    return this.paused;
  }
}