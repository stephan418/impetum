import World from "../core/World";

export default interface BuildingElement {
  addToWorld(world: World): unknown;
  removeFromWorld(world: World): unknown;
}
