import ValueError from "../errors/ValueError";
import Item from "../inventory/Item";

export default class ItemTypeRegistry {
  private items: Map<string, new () => Item> = new Map();

  registerItem(id: string, item: new () => Item) {
    if (this.items.has(id)) {
      throw new ValueError("The item id to be registered already exists");
    }

    this.items.set(id, item);
  }

  getItem(id: string) {
    return this.items.get(id);
  }
}
