import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import World from "../core/World";
import EventManager from "../inventory/utils/EventManager";
import InputManager from "./InputManager";

type EventType = "pause" | "unpause";

export default class GameStateManager {
  private world: World;
  private inputManager: InputManager;
  private pointerLockControls: PointerLockControls;

  // State
  private paused = false;

  private eventManager;

  public addEventListener;
  public removeEventListener;
  public dispatchEvent;

  constructor(world: World, inputManager: InputManager, pointerLockControls: PointerLockControls) {
    this.eventManager = new EventManager(["pause", "unpause"]);

    this.addEventListener = this.eventManager.addEventListener.bind(this.eventManager);
    this.removeEventListener = this.eventManager.removeEventListener.bind(this.eventManager);
    this.dispatchEvent = this.eventManager.dispatchEvent.bind(this.eventManager);

    this.inputManager = inputManager;
    this.pointerLockControls = pointerLockControls;
    this.world = world;

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

    (this.world as any)._pause();
  }

  unpause() {
    this.paused = false;
    this.dispatchEvent("unpause");

    (this.world as any)._unpause();
  }

  // -- Public interface --

  get isPaused() {
    return this.paused;
  }
}
