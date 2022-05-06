import BackInventory from "./BackInventory";
import HotbarInventory from "./HotbarInvetory";
import Item from "./Item";

export default class PlayerInventory {
  private hotbar: HotbarInventory;
  private back: BackInventory;

  constructor(hotbarSlots: number, backSlots: number) {
    this.hotbar = new HotbarInventory(hotbarSlots);
    this.back = new BackInventory(backSlots);
  }

  collect(c: Item, amount: number) {
    if (!this.hotbar.isFull) {
      return this.hotbar.store(c, amount);
    }

    this.back.store(c, amount);
  }

  collectToIndex(c: Item, amount: number, index: number) {
    // Slots are numbered up, starting with the first hotbar index and ending with the last back index

    if (index < this.hotbar.size) {
      return this.hotbar.storeAtSlot(c, amount, index);
    }

    this.back.storeAtSlot(c, amount, index - this.hotbar.size);
  }
}
