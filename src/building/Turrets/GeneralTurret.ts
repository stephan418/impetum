import * as THREE from "three";
import * as CANNON from "cannon-es";
import FloorElement from "../FloorElement";
import ResourceManager from "../../managers/ResourceManager";
import { BufferGeometry } from "three";
import WallElement from "../WallElement";
import TurretElement from "../TurretElement";
import Updatable from "../../interfaces/Updatable";
import Enemy from "../../entities/Enemy";

export interface ShootingElementProperties {
  startingPosition: THREE.Vector3;
  targetPosition: THREE.Vector3;
  progress: 0;
  shootingMesh: THREE.Mesh;
}
export default class GeneralTurret extends TurretElement {
  private turretRotationY: number;
  private raycaster: THREE.Raycaster;
  private shootingElements: ShootingElementProperties[];
  private uNameID: string;
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
    this.uNameID = (Math.random() * 10000).toString();
    this.getParts()[0].mesh.name = this.uNameID;
    this.getParts()[1].mesh.name = this.uNameID;
    this.getParts()[2].mesh.name = this.uNameID;
    this.turretRotationY = 0;
    this.rotateToDegree(new THREE.Euler(0, 0, 0));
    this.raycaster = new THREE.Raycaster();
    this.shootingElements = [];
  }
  protected _update(deltaTime: number): void {
    // this._lookAt(window.world.getPlayer().camera.position);
    let removeThese: number[] = [];
    this.shootingElements.forEach((val, idx) => {
      val.progress += 3 * deltaTime;
      val.shootingMesh.lookAt(val.targetPosition);
      val.shootingMesh.position.lerpVectors(val.startingPosition, val.targetPosition, val.progress);
      if (val.progress >= 1) {
        removeThese.push(idx);
      }
    });
    removeThese.forEach((vla, idx) => {
      window.world.scene.remove(this.shootingElements[idx].shootingMesh);
      this.shootingElements.splice(vla, 1);
    });
  }
  protected _updatePhysics(deltaTime: number): void {}
  protected _updateFrequencyMedium(deltaTime: number): void {}
  protected _updateFrequencyLow(deltaTime: number): void {
    let enemyWithLowestDistance: Enemy | undefined = undefined;
    let enemyLowestDistance = 999999999;
    window.waveManager.currentWaves.forEach((curWave, curWaveIdx) => {
      curWave.enemies.forEach((curEnemy: Enemy, curEnemyIdx) => {
        if (curEnemy.mesh.position.distanceTo(this.pos) < enemyLowestDistance) {
          enemyWithLowestDistance = curEnemy;
          enemyLowestDistance = curEnemy.mesh.position.distanceTo(this.pos);
        }
        // console.log(curEnemy);
        // this._lookAt(curEenemy.);
      });
    });
    if (enemyWithLowestDistance != undefined) {
      this.raycaster.set(
        this.pos,
        new THREE.Vector3().subVectors((enemyWithLowestDistance as Enemy).mesh.position, this.pos).normalize()
      );
      this.raycaster.near = 0;
      this.raycaster.far = 1000;
      let found = this.raycaster
        .intersectObjects(window.world.scene.children, true)
        .filter((intersect) => intersect.object.name != "nointersect" && intersect.object.name != this.uNameID);
      if (found[0].object.name == "alien" || found[1].object.name == "alien") {
        this._lookAt((enemyWithLowestDistance as Enemy).mesh.position.clone());
        (enemyWithLowestDistance as Enemy).decrementHealth(20);
        this.shootingElements.push({
          progress: 0,
          targetPosition: ((enemyWithLowestDistance as any).mesh.position as THREE.Vector3)
            .clone()
            .add(new THREE.Vector3(0, 0, 0)),
          startingPosition: (this.pos as THREE.Vector3).clone().add(new THREE.Vector3(0, 2.4, 0)),
          shootingMesh: new THREE.Mesh(
            window.resourceManager.getModelGeometry("crystalShard"),
            window.resourceManager.getModelMaterial("bullet")
          ),
        });
        let curSh: ShootingElementProperties = this.shootingElements[this.shootingElements.length - 1];
        curSh.shootingMesh.scale.set(0.2, 0.1, 4.4);
        curSh.shootingMesh.lookAt(curSh.targetPosition);
        window.world.scene.add(curSh.shootingMesh);
      }
    }
  }

  onRemove(): void {
    this.shootingElements.forEach((vla, idx) => {
      window.world.scene.remove(this.shootingElements[idx].shootingMesh);
    });
    this.shootingElements.splice(0);
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
