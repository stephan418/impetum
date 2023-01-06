import WoodenFloor from "../../building/Floors/WoodenFloor";
import GeneralTurret from "../../building/Turrets/GeneralTurret";
import Item from "../Item";

export default class GeneralTurretItem extends Item implements Buildable<typeof GeneralTurret> {
  public static readonly _id = "generalTurret";

  get id(): string {
    return GeneralTurretItem._id;
  }

  get buildingElement(): typeof GeneralTurret {
    return GeneralTurret;
  }

  get icon() {
    return "./static/items/generalTurretItem.png";
  }
}
