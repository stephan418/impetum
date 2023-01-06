import WoodenWall from "../../building/Walls/WoodenWall";
import Item from "../Item";

// import iconUrl from "../../../static/icon.png"

export default class WoodenWallItem extends Item implements Buildable<typeof WoodenWall> {
  public static readonly _id: string = "woodenwall";
  public static readonly _icon = undefined; // = iconUrl

  get id(): string {
    return WoodenWallItem._id;
  }

  get buildingElement(): typeof WoodenWall {
    return WoodenWall;
  }

  get icon() {
    return "./static/items/woodenWallItem.png";
  }
}
