import PlayerInventory from "../inventory/PlayerInventory";

export default class StorageManager {
  private inventory?: PlayerInventory;

  getOrInitInventory(...args: ConstructorParameters<typeof PlayerInventory>) {
    const serialized = localStorage.getItem("i-store.inventory");

    if (!serialized) {
      this.inventory = new PlayerInventory(...args);
      return this.inventory;
    }

    this.inventory = PlayerInventory.fromSerialized(serialized, args[0], args[1], args[2]);
    return this.inventory;
  }

  saveAll() {
    if (this.inventory) localStorage.setItem("i-store.inventory", this.inventory.serialize());
  }

  clearAll() {
    localStorage.removeItem("i-store.inventory");
  }
}
