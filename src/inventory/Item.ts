import IItem from "../interfaces/Item";

export default abstract class Item implements IItem {
  public static readonly _id: string;

  abstract get id(): string;
}
