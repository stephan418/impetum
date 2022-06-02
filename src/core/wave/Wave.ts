import World from "../World";
import * as THREE from "three";
import Enemy from "../../entities/Enemy";

export default class Wave {
  private center: THREE.Vector3;
  private enemies: Enemy[] = [];
  private updateIntervalId: number;

  constructor(center: THREE.Vector3 = new THREE.Vector3(0, 0, 0), initialRadius = 10, numberOfEnemies?: number) {
    this.center = center;

    if (!numberOfEnemies) {
      numberOfEnemies = 10; // Load from some sort of storage
    }

    for (let i = 0; i < numberOfEnemies; i++) {
      const randomPolarAngle = Math.random() * 2 * Math.PI;

      const x = initialRadius * Math.cos(randomPolarAngle) + center.x;
      const y = initialRadius * Math.sin(randomPolarAngle) + center.z;

      const position = new THREE.Vector3(x, center.y, y);

      this.enemies.push(new Enemy(position));
    }

    this.updateIntervalId = setInterval(() => {
      for (const enemy of this.enemies) {
        enemy.updateTargetNormal();
      }
    }, 2000);
  }

  addToWorld(world: World) {
    for (const enemy of this.enemies) {
      enemy.addToWorld(world);
    }
  }

  startMoving() {
    for (const enemy of this.enemies) {
      enemy.moveTowards(this.center);
    }
  }

  stopMoving() {
    clearInterval(this.updateIntervalId);
  }
}
