import DeserializationError from "../errors/DeserializationError";
import InventoryError from "../errors/InventoryError";
import safeDeserialize from "../helpers/safeDeserialization";
import { Serializable } from "../interfaces/Saveable";
import InputManager, { ScrollInput } from "../managers/InputManager";
import BackInventory from "./BackInventory";
import HotbarInventory from "./HotbarInvetory";
import Item from "./Item";
import Purse from "./Purse";
import EventManager, { mutation } from "./utils/EventManager";

interface PlayerInventorySerialized {
  hotbar: string;
  back: string;
  purse: string;
}

function isPlayerInventorySerialized(payload: any): payload is PlayerInventorySerialized {
  return (
    typeof payload === "object" &&
    typeof payload.hotbar == "string" &&
    typeof payload.back == "string" &&
    typeof payload.purse === "string"
  );
}

export default class PlayerInventory implements Serializable {
  private hotbar: HotbarInventory;
  private back: BackInventory;
  private purse: Purse;
  private inputManager?: InputManager;

  private eventManager;

  private selectedIndex = 0;

  public addEventListener;
  public removeEventListener;

  constructor(hotbarSlots: number, backSlots: number, inputManager?: InputManager, init?: PlayerInventorySerialized) {
    if (!init) {
      this.hotbar = new HotbarInventory(hotbarSlots);
      this.back = new BackInventory(backSlots);
      this.purse = new Purse();
    } else {
      this.hotbar = HotbarInventory.fromSerialized(init.hotbar, { slots: hotbarSlots });
      this.back = BackInventory.fromSerialized(init.back, { slots: backSlots });
      this.purse = Purse.fromSerialized(init.purse);
    }

    this.inputManager = inputManager;

    this.inputManager?.addScrollCallback(this.onScroll.bind(this));

    this.eventManager = new EventManager(["change", "select"]);

    this.addEventListener = this.eventManager.addEventListener.bind(this.eventManager);
    this.removeEventListener = this.eventManager.removeEventListener.bind(this.eventManager);
  }

  private onScroll(e: ScrollInput) {
    if (e.direction === "up" && this.selectedIndex < this.hotbar.size - 1) {
      this.selectedIndex++;
    } else if (e.direction === "down" && this.selectedIndex > 0) {
      this.selectedIndex--;
    }

    this.eventManager.dispatchEvent("select");
  }

  @mutation
  collect(c: Item, amount: number) {
    if (!this.hotbar.isFull) {
      this.hotbar.store(c, amount);
    } else {
      this.back.store(c, amount);
    }
  }

  @mutation
  collectToIndex(c: Item, amount: number, index: number) {
    // Slots are numbered up, starting with the first hotbar index and ending with the last back index

    if (index < this.hotbar.size) {
      return this.hotbar.storeAtSlot(c, amount, index);
    }

    this.back.storeAtSlot(c, amount, index - this.hotbar.size);
  }

  @mutation
  retrieveFromIndex(amount: number, index: number) {
    if (index < this.hotbar.size) {
      return this.hotbar.retrieveIndex(index, amount);
    }

    this.back.retrieveIndex(index - this.hotbar.size, amount);
  }

  @mutation
  moveSlot(from: number, to: number, amount?: number) {
    if (from < this.hotbar.size && to < this.hotbar.size) {
      return this.hotbar.moveSlot(from, to, amount);
    } else if (from >= this.hotbar.size && to >= this.hotbar.size) {
      return this.back.moveSlot(from - this.hotbar.size, to - this.hotbar.size, amount);
    } else {
      let item;
      if (from < this.hotbar.size) item = this.hotbar.getIndex(from);
      else item = this.back.getIndex(from - this.hotbar.size);

      if (!item) throw new InventoryError(`Cannot move empty slot at ${from}`);

      if (amount) {
        item = Object.assign(Object.create(Object.getPrototypeOf(item)), item);

        item.amount = item.amount > amount ? amount : item.amount;
      }

      if (to < this.hotbar.size) this.hotbar.storeAtSlot(item.item, item.amount, to);
      else this.back.storeAtSlot(item.item, item.amount, to - this.hotbar.size);

      if (from < this.hotbar.size) {
        this.hotbar.retrieveIndex(from, item.amount);
      } else this.back.retrieveIndex(from - this.hotbar.size, item.amount);
    }
  }

  @mutation
  desposit(amount: number) {
    this.purse.deposit(amount);
  }

  serialize(): string {
    return JSON.stringify({
      hotbar: this.hotbar.serialize(),
      back: this.back.serialize(),
      purse: this.purse.serialize(),
    });
  }

  static fromSerialized(serialized: string, hotbarSlots = 9, backSlots = 36, inputManager?: InputManager) {
    const deserialized = safeDeserialize(() => JSON.parse(serialized));

    if (!isPlayerInventorySerialized(deserialized)) {
      throw new DeserializationError("Cannot interpret value");
    }

    return new PlayerInventory(hotbarSlots, backSlots, inputManager, deserialized);
  }

  get purseContent() {
    return this.purse.content;
  }

  getIndex(index: number) {
    if (index < this.hotbar.size) return this.hotbar.getIndex(index);

    return this.back.getIndex(index - this.hotbar.size);
  }

  get hotbarContent() {
    return this.hotbar.open();
  }

  get backContent() {
    return this.back.open();
  }

  get content() {
    return [...this.hotbarContent, ...this.backContent];
  }

  get selected() {
    return this.getIndex(this.selectedIndex);
  }

  get selectedIdx() {
    return this.selectedIndex;
  }

  get pursePaymentMethod() {
    return this.purse;
  }
}
