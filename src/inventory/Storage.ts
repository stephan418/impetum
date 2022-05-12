import IStorage, { Group } from "../interfaces/Storage";
import Item from "../interfaces/Item";
import InventoryError from "../errors/InventoryError";

export default class Storage<C extends Item> implements IStorage<C> {
  private slots: (Group<C> | undefined)[];

  constructor(slots: number) {
    this.slots = Array(slots).fill(undefined);
  }

  open() {
    return this.slots;
  }

  retrieve(id: C["id"], amount: number): Group<C> | null {
    let slotIndex: number | undefined = 1;

    let remainingAmount = amount;

    while (slotIndex) {
      slotIndex = this.find(id);

      if (slotIndex) {
        const slot = this.slots[slotIndex];

        if (!slot) {
          return null;
        }

        remainingAmount -= slot.amount;

        if (remainingAmount >= 0) {
          this.slots.splice(slotIndex, 1);
        }

        if (remainingAmount <= 0) {
          slot.amount -= amount;

          return { item: slot.item, amount };
        }
      }
    }

    return null;
  }

  store(c: C, amount: number): void {
    // TODO: Stack size

    const slotIndex = this.find(c.id);

    if (slotIndex < 0) {
      // TODO: Max size
      this.slots[this.findFirstEmptySlot()] = { item: c, amount };
    } else {
      const slot = this.slots[slotIndex];

      if (!slot) {
        return;
      }

      slot.amount += amount;
    }
  }

  storeAtSlot(c: C, amount: number, index: number) {
    const slotItem = this.slots[index];

    if (slotItem) {
      if (slotItem.item.id === c.id) {
        // TODO: Max size
        slotItem.amount += amount;
      }
    } else {
      const slotItem = { item: c, amount };

      this.slots[index] = slotItem;
    }
  }

  moveSlot(from: number, to: number) {
    if (!(this.slots[from] && !this.slots[to])) throw new InventoryError(`Cannot move slot ${from} to slot ${to}`);

    this.slots[to] = this.slots[from];
    this.slots[from] = undefined;
  }

  private find(id: C["id"]) {
    return this.slots.findIndex((s) => s?.item.id === id);
  }

  private findFirstEmptySlot() {
    return this.slots.findIndex((s) => s === undefined);
  }

  get isFull() {
    return this.findFirstEmptySlot() === -1;
  }

  get size() {
    return this.slots.length;
  }
}
