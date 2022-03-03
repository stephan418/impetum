export default interface Updatable {
  update(deltaTime: number): void;
  updatePhysics(deltaTime: number): void;
}
