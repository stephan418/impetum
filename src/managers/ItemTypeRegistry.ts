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

  safeSlotToObject<T>(payload: T) {
    if (
      typeof payload !== "object" ||
      typeof (payload as any).item !== "object" ||
      typeof (payload as any).item.id !== "string" ||
      (payload as any).item.class !== true
    ) {
      return payload;
    }

    const item = this.getItem((payload as any).item.id);

    if (item) {
      return { ...payload, item: new item() };
    }

    return undefined;
  }
}
