import IItem from "../interfaces/Item";

export default abstract class Item implements IItem {
  public static readonly _id: string;
  public static readonly _icon?: string;

  abstract get id(): string;
  abstract get icon(): string | undefined;
}
