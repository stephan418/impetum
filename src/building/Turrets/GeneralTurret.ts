import * as THREE from "three";
import * as CANNON from "cannon-es";
import FloorElement from "../FloorElement";
import ResourceManager from "../../managers/ResourceManager";
import { BufferGeometry } from "three";
import WallElement from "../WallElement";
import TurretElement from "../TurretElement";
import Updatable from "../../interfaces/Updatable";

export default class GeneralTurret extends TurretElement {
  private turretRotationY: number;
  constructor(resourceManager: ResourceManager) {
    const a = resourceManager.getModelGeometry("generalTurret", 0);
    const aMiddle = resourceManager.getModelGeometry("generalTurret", 1);
    const aTop = resourceManager.getModelGeometry("generalTurret", 2);
    const b = resourceManager.getModelMaterial("generalTurret");
    const c = resourceManager.getModelShapes("generalTurret")[0];
    if (!a || !aMiddle || !aTop) {
      throw new Error("Geometry couldn't be found");
    }
    if (!b) {
      throw new Error("Material couldn't be found");
    }
    if (!c.shape) {
      throw new Error("Shape couldn't be found");
    }
    super([a, aMiddle, aTop], [b, b, b], c);
    this.getParts()[1].positionOffset = new THREE.Vector3(0, 1, 0);
    this.getParts()[2].positionOffset = new THREE.Vector3(0, 2, 0);
    this.turretRotationY = 0;
  }
  protected _update(deltaTime: number): void {
  }
  protected _updatePhysics(deltaTime: number): void {}
  protected _updateFrequencyLow(deltaTime: number): void {
  }
  protected _updateFrequencyMedium(deltaTime: number): void {
    this._lookAt(window.world.getPlayer().camera.position);  
  }

  private rotateToDegree(euler: THREE.Euler) {
    let tempQuat = new THREE.Quaternion();
    tempQuat.setFromEuler(new THREE.Euler(0, euler.y, 0));
    this.getParts()[1].quaternionOffset = tempQuat.clone();
    this.getParts()[1].mesh.add(this.getParts()[2].mesh);
    this.getParts()[2].position = new THREE.Vector3();
    this.getParts()[2].quaternionOffset = new THREE.Quaternion().setFromEuler(new THREE.Euler(euler.x, 0, 0));
  }

  _lookAt(pos: THREE.Vector3): void {
    let res = Math.atan2(this.getPosition().z - pos.z, this.getPosition().x - pos.x);
    let res1 = Math.atan(
      (pos.y - this.getPosition().y) /
        this.getPosition().distanceTo(pos.clone().add(new THREE.Vector3(0, -(pos.y - this.getPosition().y), 0)))
    );
    this.rotateToDegree(new THREE.Euler(-res1, -res - Math.PI / 2, 0));
  }
  _shoot(): void {}
}
