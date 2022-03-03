import World from "../core/World";
import Entity from "../interfaces/Entity";

export default class Player implements Entity {
  addToWorld(world: World): void {}
  removeFromWorld(world: World): void {}
  update(deltaTime: number): void {}
  updatePhysics(deltaTime: number): void {}
}
