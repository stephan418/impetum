import WoodenFloor from "../../building/Floors/WoodenFloor";
import Item from "../Item";

export default class WoodenFloorItem extends Item implements Buildable<typeof WoodenFloor> {
  public static readonly _id = "woodenfloor";

  get id(): string {
    return WoodenFloorItem._id;
  }

  get buildingElement(): typeof WoodenFloor {
    return WoodenFloor;
  }

  get icon() {
    return "./static/items/woodenFloorItem.png";
  }
}
