import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

export interface ScrollInput {
  direction: "up" | "down";
  deltaY?: number;
  deltaX?: number;
  deltaZ?: number;
}

export type ScrollCallback = (e: ScrollInput) => unknown;

export default class InputManager {
  private pressedKeys: Map<string, boolean>;
  private keysCallbacks: Map<string, Function>;
  private scrollCallbacks: ScrollCallback[];

  private pressedMouseButtons: Map<number, boolean>;
  private mouseCallbacks: Map<number, Function[]>;

  private mouseRoot;
  private lockControls;

  constructor(lockControls?: PointerLockControls) {
    this.pressedKeys = new Map();
    this.keysCallbacks = new Map();
    this.scrollCallbacks = [];

    this.pressedMouseButtons = new Map();
    this.mouseCallbacks = new Map();

    this.lockControls = lockControls;

    const mouseRoot = document.querySelector<HTMLCanvasElement>("canvas#view");

    if (!mouseRoot) {
      throw new Error("Root canvas could not be found");
    }

    this.mouseRoot = mouseRoot;

    document.body.oncontextmenu = () => false;

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    this.mouseRoot.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.mouseRoot.addEventListener("mouseup", this.onMouseUp.bind(this));

    document.addEventListener("wheel", this.onScroll.bind(this));
  }

  private onKeyDown(ev: KeyboardEvent) {
    let lowered = ev.key;
    lowered = lowered.toLowerCase();
    this.pressedKeys.set(lowered, true);
    if (this.keysCallbacks.get(lowered) == undefined || ev.repeat) return;
    this.keysCallbacks.get(lowered)?.(true);
  }

  private onKeyUp(ev: KeyboardEvent) {
    let lowered = ev.key;
    lowered = lowered.toLowerCase();
    this.pressedKeys.set(lowered, false);
    if (this.keysCallbacks.get(lowered) == undefined || ev.repeat) return;
    this.keysCallbacks.get(lowered)?.(false);
  }

  private onScroll(e: WheelEvent) {
    const emitted: Partial<ScrollInput> =
      e.deltaMode === 0 ? { deltaY: e.deltaY, deltaX: e.deltaX, deltaZ: e.deltaZ } : {};

    if (e.deltaY >= 0) {
      emitted.direction = "down";
    } else {
      emitted.direction = "up";
    }

    for (const callback of this.scrollCallbacks) {
      callback(emitted as ScrollInput);
    }
  }

  isPressed(key: string) {
    let result = this.pressedKeys.get(key);
    if (result != undefined) {
      return this.pressedKeys.get(key);
    }
    return false;
  }

  addKeyCallback(key: string, callback: (pressed: boolean) => void) {
    this.keysCallbacks.set(key, callback);
  }

  removeKeyCallback(key: string) {
    if (this.keysCallbacks.get(key) == undefined) return;
    this.keysCallbacks.delete(key);
  }

  private onMouseDown(ev: MouseEvent) {
    if (!this.lockControls || this.lockControls.isLocked) {
      this.pressedMouseButtons.set(ev.which, true);
      if (this.mouseCallbacks.get(ev.which) == undefined) return;
      this.mouseCallbacks.get(ev.which)?.forEach((func) => func(true));
    }
  }
  private onMouseUp(ev: MouseEvent) {
    if (!this.lockControls || this.lockControls.isLocked) {
      this.pressedMouseButtons.set(ev.which, false);
      if (this.mouseCallbacks.get(ev.which) == undefined) return;
      this.mouseCallbacks.get(ev.which)?.forEach((func) => func(false));
    }
  }
  isClicked(which: number) {
    let result = this.pressedMouseButtons.get(which);
    if (result != undefined) {
      return this.pressedMouseButtons.get(which);
    }
    return false;
  }

  addMouseButtonCallback(which: number, callback: (pressed: boolean) => void) {
    const callbacks = this.mouseCallbacks.get(which) || [];
    this.mouseCallbacks.set(which, [...callbacks, callback]);
  }

  addScrollCallback(callback: ScrollCallback) {
    this.scrollCallbacks.push(callback);
  }

  removeScrollCallback(callback: ScrollCallback) {
    const index = this.scrollCallbacks.findIndex((c) => c === callback);

    if (index < 0) {
      return false;
    }

    this.scrollCallbacks.splice(index, 1);

    return true;
  }

  set pointerLockControls(lockControls: PointerLockControls) {
    this.lockControls = lockControls;
  }
}
