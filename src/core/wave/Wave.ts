import World from "../World";
import * as THREE from "three";
import Enemy from "../../entities/Enemy";

export default class Wave {
  private center: THREE.Vector3;
  private enemies: Enemy[] = [];
  private updateIntervalId: number;
  private onFinish?: () => unknown;
  private world: World;
  private initialEnemyCount: number;

  constructor(
    center: THREE.Vector3 = new THREE.Vector3(0, 0, 0),
    initialRadius = 10,
    world: World,
    numberOfEnemies?: number,
    onFinished?: () => unknown
  ) {
    this.center = center;
    this.onFinish = onFinished;
    this.world = world;

    if (!numberOfEnemies) {
      numberOfEnemies = 10; // Load from some sort of storage
    }

    this.initialEnemyCount = numberOfEnemies;

    for (let i = 0; i < numberOfEnemies; i++) {
      const randomPolarAngle = Math.random() * 2 * Math.PI;

      const x = initialRadius * Math.cos(randomPolarAngle) + center.x;
      const y = initialRadius * Math.sin(randomPolarAngle) + center.z;

      const position = new THREE.Vector3(x, center.y, y);
      const enemy = new Enemy(position);
      this.enemies.push(enemy);
    }

    this.updateIntervalId = setInterval(() => {
      for (const enemy of this.enemies) {
        enemy.updateTargetNormal();
      }
    }, 2000);
  }

  removeEnemy(enemy: Enemy) {
    const enemyIndex = this.enemies.findIndex((e) => enemy === e);

    if (enemyIndex < 0) {
      throw new Error("The enemy to be removed is not part of this wave");
    }

    enemy.removeFromWorld(this.world);

    this.enemies.splice(enemyIndex, 1);

    if (this.enemies.length <= 0) {
      this.onFinish?.();
    }
  }

  addToWorld(world: World) {
    for (const enemy of this.enemies) {
      enemy.addToWorld(world);
    }
  }

  startMoving(onFinished?: () => unknown) {
    this.onFinish = onFinished;

    for (const enemy of this.enemies) {
      enemy.moveTowards(this.center);
    }
  }

  stopMoving() {
    clearInterval(this.updateIntervalId);
  }

  set onFinished(onFinished: typeof this.onFinish) {
    this.onFinish = onFinished;
  }

  get totalEnemyCount() {
    return this.initialEnemyCount;
  }

  get aliveEnemyCount() {
    return this.enemies.length;
  }
}
