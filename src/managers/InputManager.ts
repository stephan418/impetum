export default class InputManager {
  private pressedKeys: Map<string, boolean>;
  private keysCallbacks: Map<string, Function>;

  constructor() {
    this.pressedKeys = new Map();
    this.keysCallbacks = new Map();

    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("keyup", this.onKeyUp.bind(this));
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
}
