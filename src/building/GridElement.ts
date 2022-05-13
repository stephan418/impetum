import BaseElement from "./BaseElement";
import BuildingElement from "../interfaces/BuildingElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import World from "../core/World";

export default abstract class GridElement extends BaseElement implements BuildingElement {
  private mesh: THREE.Mesh;
  private cBody: CANNON.Body;
  protected gridDistanceXZ: number;
  protected gridDistanceY: number;
  // private materialName: string;
  // private geometryName: string;
  constructor(geometry: THREE.BufferGeometry, material: THREE.Material, cShape: CANNON.Shape) {
    super();
    this.mesh = new THREE.Mesh();
    this.cBody = new CANNON.Body();
    this.setGeometry(geometry);
    this.setMaterial(material);
    this.addCShape(cShape);
    // this.materialName = "";
    // this.geometryName = "";
    this.gridDistanceXZ = 5;
    this.gridDistanceY = 5;

    this.updatedPosition = () => {
      this.mesh.position.copy(this.pos);
      this.cBody.position.copy(new CANNON.Vec3(this.pos.x, this.pos.y, this.pos.z));
    };
  }
  addToWorld(world: World): void {
    world.scene.add(this.mesh);
    world.cScene.addBody(this.cBody);
  }
  removeFromWorld(world: World): void {
    world.scene.remove(this.mesh);
    world.cScene.removeBody(this.cBody);
  }

  protected setGeometry(geometry: THREE.BufferGeometry) {
    // this.geometryName = geometryName;
    this.mesh.geometry = geometry;
  }

  protected setMaterial(material: THREE.Material) {
    // this.geometryName = geometryName;
    this.mesh.material = material;
  }
  protected addCShape(cShape: CANNON.Shape) {
    // this.shapeName = shapeName;
    /* for (const item of this.cBody.shapes) {
      this.cBody.removeShape(item);
    } */
    this.cBody.addShape(cShape);
  }

  getMesh() {
    return this.mesh;
  }
  getCBody() {
    return this.cBody;
  }

  setPositionOnGrid(position: THREE.Vector3) {
    let newPosition: THREE.Vector3 = new THREE.Vector3();
    newPosition.x = Math.floor(position.x / this.gridDistanceXZ) * this.gridDistanceXZ;
    newPosition.y = Math.floor(position.y / this.gridDistanceY) * this.gridDistanceY;
    newPosition.z = Math.floor(position.z / this.gridDistanceXZ) * this.gridDistanceXZ;
    this.setPosition(newPosition);
  }
  updatedPosition(): void {
    console.log("new position: " + this.pos);
  }
}
