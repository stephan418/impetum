import WoodenWall from "../../building/Walls/WoodenWall";
import Item from "../Item";

export default class WoodenWallItem implements Item, Buildable<typeof WoodenWall> {
  public static readonly _id: string = "woodenwall";

  get id(): string {
    return WoodenWallItem._id;
  }

  get buildingElement(): typeof WoodenWall {
    return WoodenWall;
  }
}
