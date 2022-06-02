import * as CANNON from "cannon-es";
import * as THREE from "three";
import World from "../core/World";
import Entity from "../interfaces/Entity";

export default class Enemy implements Entity {
  private mesh: THREE.Mesh;
  private cBody: CANNON.Body;
  private radius = 1.3;
  private colliderRadius = 1.3;

  private targetPosition?: THREE.Vector3;
  private targetNormal?: THREE.Vector3;
  private velocityMultiplier = 10;
  private isMoving: boolean = false;
  private targetRadius = 2;

  private onStopMoving?: () => unknown;

  constructor(position: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(this.radius);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const cShape = new CANNON.Sphere(this.colliderRadius);

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.cBody = new CANNON.Body({ mass: 10, shape: cShape });
    this.cBody.linearDamping = 0.999;
    this.cBody.fixedRotation = false;

    this.cBody.position.copy(position as unknown as CANNON.Vec3);
    this.mesh.position.copy(this.cBody.position as unknown as THREE.Vector3);
  }

  addToWorld(world: World) {
    world.scene.add(this.mesh);
    world.cScene.addBody(this.cBody);
    world.addUpdatable(this);
  }

  removeFromWorld(world: World) {
    world.scene.remove(this.mesh);
    world.cScene.removeBody(this.cBody);
  }

  moveTowards(targetPosition: THREE.Vector3, targetRadius = 10) {
    this.targetPosition = targetPosition;
    this.isMoving = true;
    this.targetRadius = targetRadius;

    this.updateTargetNormal();
  }

  updateTargetNormal() {
    if (!this.targetPosition) {
      return;
    }

    const directedVector = this.targetPosition?.clone().sub(this.mesh.position);

    this.targetNormal = directedVector.normalize().multiplyScalar(4);
  }

  isAtTarget() {
    return this.cBody.position.distanceTo(this.targetPosition as unknown as CANNON.Vec3) < this.targetRadius;
  }

  //@ts-ignore
  update(deltaTime: number): void {}

  updatePhysics(deltaTime: number): void {
    this.mesh.position.copy(this.cBody.position as unknown as THREE.Vector3);
    this.mesh.quaternion.copy(this.cBody.quaternion as unknown as THREE.Quaternion);

    if (this.isMoving) {
      this.cBody.velocity.x = this.targetNormal?.x || this.cBody.velocity.x;
      this.cBody.velocity.z = this.targetNormal?.z || this.cBody.velocity.z;
    }

    if (this.isAtTarget()) {
      this.isMoving = false;
    }
  }
}
