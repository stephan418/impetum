import Updatable from "./Updatable";
import World from "../core/World";

export default interface Entity extends Updatable {
  addToWorld(world: World): void;
  removeFromWorld(world: World): void;
}
