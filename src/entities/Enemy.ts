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

  constructor(position: THREE.Vector3) {
    const geometry = new THREE.SphereGeometry(this.radius);
    const material = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const cShape = new CANNON.Sphere(this.colliderRadius / 2);

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
  }

  removeFromWorld(world: World) {
    world.scene.remove(this.mesh);
    world.cScene.removeBody(this.cBody);
  }

  //@ts-ignore
  update(deltaTime: number): void {}

  updatePhysics(deltaTime: number): void {
    this.mesh.position.copy(this.cBody.position as unknown as THREE.Vector3);
    this.mesh.quaternion.copy(this.cBody.quaternion as unknown as THREE.Quaternion);

    if (this.targetNormal && this.isMoving) {
      this.cBody.velocity.copy(
        this.targetNormal.clone().multiplyScalar(this.velocityMultiplier) as unknown as CANNON.Vec3
      );

      this.updateMoveStatus();
    }
  }

  moveToPosition(position: THREE.Vector3) {
    this.targetPosition = position;
    this.isMoving = true;

    this.targetNormal = this.targetPosition
      .clone()
      .sub(new THREE.Vector3(...this.cBody.position.toArray()))
      .normalize();
    this.targetNormal.y = 0;
  }

  private updateMoveStatus() {
    if (this.isMoving && this.targetPosition) {
      if (this.cBody.position.distanceTo(new CANNON.Vec3(...this.targetPosition.toArray())) < 0.4) {
        // TODO: Reset
        this.isMoving = false;
      }
    }
  }
}
