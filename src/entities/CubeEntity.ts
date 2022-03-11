import World from "../core/World";
import Entity from "../interfaces/Entity";
import * as THREE from "three";
import * as CANNON from "cannon-es";

export default class CubeEntity implements Entity {
  private geometry: THREE.BoxGeometry;
  private material: THREE.MeshLambertMaterial;
  private mesh: THREE.Mesh;

  private cShape: CANNON.Box;
  private cBody: CANNON.Body;

  constructor(position: CANNON.Vec3) {
    this.geometry = new THREE.BoxGeometry();
    this.material = new THREE.MeshLambertMaterial({ color: 0xdd00dd });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;

    this.cShape = new CANNON.Box(new CANNON.Vec3(this.mesh.scale.x / 2, this.mesh.scale.y / 2, this.mesh.scale.z / 2));
    this.cBody = new CANNON.Body({ mass: 5 });
    this.cBody.position.copy(position);
    this.cBody.addShape(this.cShape);
    this.mesh.position.copy(this.cBody.position as unknown as THREE.Vector3);
  }

  addToWorld(world: World): void {
    world.scene.add(this.mesh);
    world.cScene.addBody(this.cBody);
  }
  removeFromWorld(world: World): void {
    world.scene.remove(this.mesh);
    world.cScene.removeBody(this.cBody);
  }
  //@ts-ignore
  update(deltaTime: number): void {}

  //@ts-ignore
  updatePhysics(deltaTime: number): void {
    this.mesh.position.copy(this.cBody.position as unknown as THREE.Vector3);
    this.mesh.quaternion.copy(this.cBody.quaternion as unknown as THREE.Quaternion);
  }
}
