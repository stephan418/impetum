import InventoryError from "../errors/InventoryError";
import BackInventory from "./BackInventory";
import HotbarInventory from "./HotbarInvetory";
import Item from "./Item";
import EventManager, { mutation } from "./utils/EventManager";

export default class PlayerInventory {
  private hotbar: HotbarInventory;
  private back: BackInventory;

  private eventManager;

  public addEventListener;
  public removeEventListener;

  constructor(hotbarSlots: number, backSlots: number) {
    this.hotbar = new HotbarInventory(hotbarSlots);
    this.back = new BackInventory(backSlots);

    this.eventManager = new EventManager(["change"]);

    this.addEventListener = this.eventManager.addEventListener.bind(this.eventManager);
    this.removeEventListener = this.eventManager.removeEventListener.bind(this.eventManager);
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
  moveSlot(from: number, to: number) {
    if (from < this.hotbar.size && to < this.hotbar.size) {
      return this.hotbar.moveSlot(from, to);
    } else if (from >= this.hotbar.size && to >= this.hotbar.size) {
      return this.back.moveSlot(from - this.hotbar.size, to - this.hotbar.size);
    } else {
      let item;
      if (from < this.hotbar.size) item = this.hotbar.getIndex(from);
      else item = this.back.getIndex(from - this.hotbar.size);

      if (!item) throw new InventoryError(`Cannot move empty slot at ${from}`);

      if (to < this.hotbar.size) this.hotbar.storeAtSlot(item.item, item.amount, to);
      else this.back.storeAtSlot(item.item, item.amount, to - this.hotbar.size);

      if (from < this.hotbar.size) {
        this.hotbar.retrieveIndex(from);
      } else this.back.retrieveIndex(from - this.hotbar.size);
    }
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
}
