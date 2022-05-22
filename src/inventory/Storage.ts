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

  private setIndex(index: number, group?: Group<C>) {
    this.slots[index] = group;
  }

  getIndex(index: number) {
    return this.slots[index];
  }

  retrieveIndex(index: number, amount?: number) {
    const group = this.getIndex(index);

    if (group) {
      group.amount -= amount || group.amount;

      if (group.amount <= 0) {
        this.setIndex(index, undefined);
      }
    }
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
      } else {
        throw new InventoryError(`Cannot add item(s) to slot ${index}, incompatible content`);
      }
    } else {
      const slotItem = { item: c, amount };

      this.slots[index] = slotItem;
    }
  }

  moveSlot(from: number, to: number, amount?: number) {
    if (from === to) {
      return;
    }

    if (amount && this.slots[from]?.amount && amount >= this.slots[from]?.amount!) {
      amount = undefined;
    }

    if (this.slots[from] !== undefined && this.slots[to]?.item.id === this.slots[from]?.item.id) {
      // When both slots are filled and the target slots holds the same item as the origin slot
      (this.slots[to] || ({} as any)).amount += amount ?? this.slots[from]?.amount ?? 0;
      this.retrieveIndex(from, amount);
    }
    // Otherweise abort if the origin slot is undefined or the target slot is not undefined
    else if (!(this.slots[from] && !this.slots[to])) throw new InventoryError(`Cannot move slot ${from} to slot ${to}`);
    else {
      if (amount) {
        this.slots[to] = { item: this.slots[from]?.item!, amount: amount };
        this.slots[from]!.amount -= amount;
      } else {
        this.slots[to] = this.slots[from];
        this.slots[from] = undefined;
      }
    }
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
