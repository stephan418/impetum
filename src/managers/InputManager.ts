export default class InputManager {
  private pressedKeys: Map<string, boolean>;
  private keysCallbacks: Map<string, Function>;

  private pressedMouseButtons: Map<number, boolean>;
  private mouseCallbacks: Map<number, Function>;

  constructor() {
    this.pressedKeys = new Map();
    this.keysCallbacks = new Map();

    this.pressedMouseButtons = new Map();
    this.mouseCallbacks = new Map();

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));

    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }

  private onKeyDown(ev: KeyboardEvent) {
    this.pressedKeys.set(ev.key, true);
    if (this.keysCallbacks.get(ev.key) == undefined || ev.repeat) return;
    this.keysCallbacks.get(ev.key)?.(true);
  }

  private onKeyUp(ev: KeyboardEvent) {
    this.pressedKeys.set(ev.key, false);
    if (this.keysCallbacks.get(ev.key) == undefined || ev.repeat) return;
    this.keysCallbacks.get(ev.key)?.(false);
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
    this.pressedMouseButtons.set(ev.which, true);
    if (this.mouseCallbacks.get(ev.which) == undefined) return;
    this.mouseCallbacks.get(ev.which)?.(true);
  }
  private onMouseUp(ev: MouseEvent) {
    this.pressedMouseButtons.set(ev.which, false);
    if (this.mouseCallbacks.get(ev.which) == undefined) return;
    this.mouseCallbacks.get(ev.which)?.(false);
  }
  isClicked(which: number) {
    let result = this.pressedMouseButtons.get(which);
    if (result != undefined) {
      return this.pressedMouseButtons.get(which);
    }
    return false;
  }

  addMouseButtonCallback(which: number, callback: (pressed: boolean) => void) {
    this.mouseCallbacks.set(which, callback);
  }
}
