import Entity from "../interfaces/Entity";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import { groundMaterial, slipperyMaterial } from "../core/CannonMaterials";
import World from "../core/World";
import Updatable from "../interfaces/Updatable";
import { BODY_TYPES } from "cannon-es";

export default class FloatingItem implements Entity, Updatable {
  private geometry;
  private material;
  private mesh;

  private cShape;
  private cBody;

  private timeAlive = 0;

  private meshOffset = new THREE.Vector3(0, 0, 0);

  private addedToObject = false;
  private staticElevation = 0;

  constructor(position: THREE.Vector3, private deltaY: number = 0.2) {
    this.geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    this.material = new THREE.MeshLambertMaterial({ color: 0xfffffff });
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    this.mesh.castShadow = true;
    this.mesh.receiveShadow = false;

    this.cShape = new CANNON.Box(new CANNON.Vec3(0.3, 0.3, 0.3));
    this.cBody = new CANNON.Body({ shape: this.cShape, material: slipperyMaterial, mass: 0.1 });
    this.cBody.position.copy(new CANNON.Vec3(position.x, position.y, position.z));
    this.cBody.linearFactor = new CANNON.Vec3(0, 1, 0);
    this.cBody.angularFactor = new CANNON.Vec3(0, 1, 0);

    this.mesh.position.copy(this.cBody.position as unknown as THREE.Vector3);
    this.staticElevation = position.y;
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

  addToObject(obj: THREE.Mesh) {
    obj.add(this.mesh);
    this.addedToObject = true;
  }

  update(deltaTime: number): void {
    this.timeAlive += deltaTime;

    this.meshOffset.y = Math.sin(this.timeAlive * 2) * this.deltaY + this.deltaY;
    this.mesh.quaternion.setFromEuler(new THREE.Euler(0, this.timeAlive / 2, 0));

    if (this.addedToObject) {
      this.mesh.position.y = this.staticElevation + this.meshOffset.y;
    }
  }

  updatePhysics(deltaTime: number): void {
    this.mesh.position.x = this.cBody.position.x + this.meshOffset.x;
    this.mesh.position.y = this.cBody.position.y + this.meshOffset.y;
    this.mesh.position.z = this.cBody.position.z + this.meshOffset.z;
  }
}
