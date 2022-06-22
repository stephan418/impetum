import BaseElement from "./BaseElement";
import BuildingElement from "../interfaces/BuildingElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import World from "../core/World";
import { groundMaterial } from "../core/CannonMaterials";
import { LineBasicMaterial, MeshLambertMaterial, MeshStandardMaterial } from "three";
import { config } from "../managers/OptionsManager";
import { ShapeAndOffset } from "../managers/ResourceManager";
import GeneralTurret from "./Turrets/GeneralTurret";

export class MeshContainer {
  private _mesh: THREE.Mesh;
  private _cBody: CANNON.Body;
  private _positionOffset: THREE.Vector3;
  private _position: THREE.Vector3;
  private _quaternionOffset: THREE.Quaternion;
  private _quaternion: THREE.Quaternion;
  constructor() {
    this._mesh = new THREE.Mesh();
    this._cBody = new CANNON.Body({ material: groundMaterial });
    this._positionOffset = new THREE.Vector3();
    this._quaternionOffset = new THREE.Quaternion();
    this._position = new THREE.Vector3();
    this._quaternion = new THREE.Quaternion();
    if (config.graphics.shadows) {
      this._mesh.receiveShadow = true;
      this._mesh.castShadow = true;
    }
  }
  addToWorld(world: World) {
    world.scene.add(this._mesh);
    world.cScene.addBody(this._cBody);
  }
  removeFromWorld(world: World) {
    world.scene.remove(this._mesh);
    world.cScene.removeBody(this._cBody);
  }
  private updatePosition() {
    this._mesh.position.set(
      this._position.x + this._positionOffset.x,
      this._position.y + this._positionOffset.y,
      this._position.z + this._positionOffset.z
    );
    this._cBody.position.set(
      this._position.x + this._positionOffset.x,
      this._position.y + this._positionOffset.y,
      this._position.z + this._positionOffset.z
    );
  }
  private updateQuaternion() {
    let euler: THREE.Euler = new THREE.Euler().setFromQuaternion(this._quaternion);
    let eulerAdd: THREE.Euler = new THREE.Euler().setFromQuaternion(this._quaternionOffset);
    let eulerEnd: THREE.Euler = new THREE.Euler(euler.x + eulerAdd.x, euler.y + eulerAdd.y, euler.z + eulerAdd.z);
    let quat: THREE.Quaternion = new THREE.Quaternion().setFromEuler(eulerEnd);
    this._mesh.quaternion.copy(quat);
    this._cBody.quaternion.copy(quat as unknown as CANNON.Quaternion);
    /* this._mesh.quaternion.set(this._quaternion.x*this._quaternionOffset.x, this._quaternion.y*this._quaternionOffset.y, this._quaternion.z*this._quaternionOffset.z, this._quaternion.w*this._quaternionOffset.w);
    this._cBody.quaternion.set(this._quaternion.x*this._quaternionOffset.x, this._quaternion.y*this._quaternionOffset.y, this._quaternion.z*this._quaternionOffset.z, this._quaternion.w*this._quaternionOffset.w); */
  }
  get mesh(): THREE.Mesh {
    return this._mesh;
  }
  set mesh(mesh: THREE.Mesh) {
    this._mesh = mesh;
  }
  get cBody(): CANNON.Body {
    return this._cBody;
  }
  set cBody(cBody: CANNON.Body) {
    this._cBody = cBody;
  }
  get positionOffset(): THREE.Vector3 {
    return this._positionOffset;
  }
  set positionOffset(vec: THREE.Vector3) {
    this._positionOffset = vec;
    this.updatePosition();
  }
  get quaternionOffset(): THREE.Quaternion {
    return this._quaternionOffset;
  }
  set quaternionOffset(quat: THREE.Quaternion) {
    this._quaternionOffset = quat;
    this.updateQuaternion();
  }
  get position(): THREE.Vector3 {
    return this._mesh.position;
  }
  set position(vec: THREE.Vector3) {
    this._position = vec;
    this.updatePosition();
  }
  get quaternion(): THREE.Quaternion {
    return this._mesh.quaternion;
  }
  set quaternion(vec: THREE.Quaternion) {
    this._quaternion = vec;
    this.updateQuaternion();
  }
}
export default abstract class FreeElement extends BaseElement implements BuildingElement {
  private parts: MeshContainer[];
  private addedToWorld: boolean;
  private world: World | undefined;
  constructor(
    geometries: THREE.BufferGeometry[] | THREE.BufferGeometry,
    materials: THREE.Material[] | THREE.Material,
    cShapes: ShapeAndOffset[][] | ShapeAndOffset[] | ShapeAndOffset
  ) {
    super();
    this.parts = [];
    // this.cBody = new CANNON.Body({ material: groundMaterial });
    this.addedToWorld = false;
    this.world = undefined;
    this.setGeometries(geometries);
    this.setMaterials(materials);
    this.addCShapes(cShapes);

    this.updatedPosition = () => {
      this.parts.forEach((val, idx) => {
        val.position = this.pos.clone();
      });
    };

    this.updatedQuaternion = () => {
      this.parts.forEach((val, idx) => {
        val.quaternion = this.quaternion.clone();
      });
    };
  }
  addToWorld(world: World): void {
    this.addedToWorld = true;
    this.world = world;
    //type correctly, should be true if this implements updatable
    if (( (this as any).update != undefined && (this as any).updatePhysics != undefined ) || (this as any).updateFrequencyMedium != undefined) {
      world.addUpdatable(this as any);
    }
    this.parts.forEach((val, idx) => {
      world.scene.add(val.mesh);
      world.cScene.addBody(val.cBody);
    });
  }
  removeFromWorld(world: World): void {
    this.addedToWorld = false;
    this.world = world;
    //type correctly, should be true if this implements updatable
    if (( (this as any).update != undefined && (this as any).updatePhysics != undefined ) || (this as any).updateFrequencyMedium != undefined) {
      world.removeUpdatable(this as any);
    }
    this.parts.forEach((val, idx) => {
      world.scene.remove(val.mesh);
      world.cScene.removeBody(val.cBody);
    });
  }

  protected setGeometries(geometry: THREE.BufferGeometry[] | THREE.BufferGeometry) {
    if (Array.isArray(geometry)) {
      geometry.forEach((val, idx) => {
        if (this.parts[idx] == undefined) {
          this.parts[idx] = new MeshContainer();
          if (this.addedToWorld) {
            this.parts[idx].addToWorld(this.world as World);
          }
        }
        this.parts[idx].mesh.geometry = val;
      });
    } else {
      if (this.parts[0] == undefined) {
        this.parts[0] = new MeshContainer();
        if (this.addedToWorld) {
          this.parts[0].addToWorld(this.world as World);
        }
      }
      this.parts[0].mesh.geometry = geometry;
    }
  }

  protected setMaterialAll(material: THREE.Material) {
    this.parts.forEach((val, idx) => {
      val.mesh.material = material;
    });
  }
  protected setMaterials(material: THREE.Material | THREE.Material[]) {
    if (Array.isArray(material)) {
      material.forEach((val, idx) => {
        if (this.parts[idx] == undefined) {
          this.parts[idx] = new MeshContainer();
          if (this.addedToWorld) {
            this.parts[idx].addToWorld(this.world as World);
          }
        }
        this.parts[idx].mesh.material = val;
      });
    } else {
      if (this.parts[0] == undefined) {
        this.parts[0] = new MeshContainer();
        if (this.addedToWorld) {
          this.parts[0].addToWorld(this.world as World);
        }
      }
      this.parts[0].mesh.material = material;
    }
  }
  protected addCShapes(cShapes: ShapeAndOffset[][] | ShapeAndOffset[] | ShapeAndOffset) {
    if (Array.isArray(cShapes)) {
      if (Array.isArray(cShapes[0])) {
        //Case 1
        (cShapes as ShapeAndOffset[][]).forEach((val1, idx1) => {
          if (this.parts[idx1] == undefined) {
            this.parts[idx1] = new MeshContainer();
            if (this.addedToWorld) {
              this.parts[idx1].addToWorld(this.world as World);
            }
          }
          (cShapes as ShapeAndOffset[][])[idx1].forEach((val2, idx2) => {
            if (val2.shape != undefined) {
              this.parts[idx1].cBody.addShape(val2.shape, val2.offset);
            }
          });
        });
        return;
      }
      //Case 2
      (cShapes as ShapeAndOffset[]).forEach((val1, idx1) => {
        if (this.parts[idx1] == undefined) {
          this.parts[idx1] = new MeshContainer();
          if (this.addedToWorld) {
            this.parts[idx1].addToWorld(this.world as World);
          }
        }
        if (val1.shape != undefined) {
          this.parts[idx1].cBody.addShape(val1.shape, val1.offset);
        }
      });
      return;
    }
    //Case 3
    if (this.parts[0] == undefined) {
      this.parts[0] = new MeshContainer();
      if (this.addedToWorld) {
        this.parts[0].addToWorld(this.world as World);
      }
    }
    if (cShapes.shape != undefined) {
      this.parts[0].cBody.addShape(cShapes.shape, cShapes.offset);
      return;
    }
  }

  getParts() {
    return this.parts;
  }
  updatedPosition(): void {}
  updatedGhostStatus(isGhost: boolean): void {
    if (isGhost) {
      if ((this as any).update != undefined) (this as any).update = undefined;
      if ((this as any).updatePhysics != undefined) (this as any).updatePhysics = undefined;
      if ((this as any).updateFrequencyMedium != undefined) (this as any).updateFrequencyMedium = undefined;
      if ((this as any).updateFrequencyLow != undefined) (this as any).updateFrequencyLow = undefined;
      this.addedToWorld = false;
      this.parts.forEach((curC) => {
        try {
          (this.world as World).cScene.removeBody(curC.cBody);
        } catch (err) {}
        curC.cBody = new CANNON.Body();
        let newMaterial = ((curC.mesh as THREE.Mesh).material as THREE.Material).clone();
        newMaterial.transparent = true;
        newMaterial.opacity = 0.5;
        curC.mesh.name = "nointersect";
        this.setMaterialAll(newMaterial);
      });
    } else {
      //TODO: Implement
    }
  }
  updatedQuaternion(): void {}
}
