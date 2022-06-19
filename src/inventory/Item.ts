import DeserializationError from "../errors/DeserializationError";
import safeDeserialize from "../helpers/safeDeserialization";
import IItem from "../interfaces/Item";

function isItem(payload: any): payload is IItem {
  return typeof payload === "object" && typeof payload.id === "string";
}

export default abstract class Item implements IItem {
  public static readonly _id: string;
  public static readonly _icon?: string;

  public static fromSerialized(serialized: string) {
    const deserialized = safeDeserialize(() => JSON.parse(serialized));

    if (!isItem(deserialized)) {
      throw new DeserializationError("Not an item");
    }

    const itemClass = window.itemTypeRegistry.getItem(deserialized.id);

    if (!itemClass) {
      return false;
    }

    return new itemClass();
  }

  serialize() {
    return JSON.stringify({ id: this.id });
  }

  toSerializable() {
    return { id: this.id, class: true };
  }

  abstract get id(): string;
  abstract get icon(): string | undefined;
}
