import Updatable from "./Updatable";
import World from "../core/World";

export default interface Entity extends Updatable {
  addToWorld(world: World): unknown;
  removeFromWorld(world: World): unknown;
}
