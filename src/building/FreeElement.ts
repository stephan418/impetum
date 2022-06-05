import BaseElement from "./BaseElement";
import BuildingElement from "../interfaces/BuildingElement";
import * as THREE from "three";
import * as CANNON from "cannon-es";
import World from "../core/World";
import { groundMaterial } from "../core/CannonMaterials";
import { LineBasicMaterial, MeshLambertMaterial, MeshStandardMaterial } from "three";
import { config } from "../managers/OptionsManager";
import { ShapeAndOffset } from "../managers/ResourceManager";

interface MeshContainer {
  mesh: THREE.Mesh;
  cBody: CANNON.Body;
  positionOffset: THREE.Vector3;
  quaternionOffset: THREE.Quaternion;
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
        val.mesh.position.set(
          this.pos.x + val.positionOffset.x,
          this.pos.y + val.positionOffset.y,
          this.pos.z + val.positionOffset.z
        );
        val.cBody.position.set(
          this.pos.x + val.positionOffset.x,
          this.pos.y + val.positionOffset.y,
          this.pos.z + val.positionOffset.z
        );
      });
    };

    this.updatedQuaternion = () => {
      this.parts.forEach((val, idx) => {
        val.mesh.quaternion.set(
          this.quaternion.x + val.quaternionOffset.x,
          this.quaternion.y + val.quaternionOffset.y,
          this.quaternion.z + val.quaternionOffset.z,
          this.quaternion.w + val.quaternionOffset.w
        );
        val.cBody.quaternion.set(
          this.quaternion.x + val.quaternionOffset.x,
          this.quaternion.y + val.quaternionOffset.y,
          this.quaternion.z + val.quaternionOffset.z,
          this.quaternion.w + val.quaternionOffset.w
        );
      });
    };
  }
  private newPart(): MeshContainer {
    let tempMesh = new THREE.Mesh();
    if (config.graphics.shadows) {
      tempMesh.receiveShadow = true;
      tempMesh.castShadow = true;
    }
    let tempBody = new CANNON.Body({ material: groundMaterial });
    if(this.addedToWorld){
      ( this.world as World).scene.add(tempMesh);
      ( this.world as World ).cScene.addBody(tempBody);
    }
    return {
      mesh: tempMesh,
      cBody: tempBody,
      positionOffset: new THREE.Vector3(0, 0, 0),
      quaternionOffset: new THREE.Quaternion(),
    };
  }
  addToWorld(world: World): void {
    this.addedToWorld = true;
    this.world = world;
    this.parts.forEach((val, idx) => {
      world.scene.add(val.mesh);
      world.cScene.addBody(val.cBody);
    });
  }
  removeFromWorld(world: World): void {
    this.addedToWorld = false;
    this.world = world;
    this.parts.forEach((val, idx) => {
      world.scene.remove(val.mesh);
      world.cScene.removeBody(val.cBody);
    });
  }

  protected setGeometries(geometry: THREE.BufferGeometry[] | THREE.BufferGeometry) {
    if (Array.isArray(geometry)) {
      geometry.forEach((val, idx) => {
        if (this.parts[idx] == undefined) {
          this.parts[idx] = this.newPart();
        }
        this.parts[idx].mesh.geometry = val;
      });
    } else {
      if (this.parts[0] == undefined) {
        this.parts[0] = this.newPart();
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
          this.parts[idx] = this.newPart();
        }
        this.parts[idx].mesh.material = val;
      });
    } else {
      if (this.parts[0] == undefined) {
        this.parts[0] = this.newPart();
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
            this.parts[idx1] = this.newPart();
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
          this.parts[idx1] = this.newPart();
        }
        if (val1.shape != undefined) {
          this.parts[idx1].cBody.addShape(val1.shape, val1.offset);
        }
      });
      return;
    }
    //Case 3
    if (this.parts[0] == undefined) {
      this.parts[0] = this.newPart();
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
      this.addedToWorld = false;
      this.parts.forEach((curC) => {
        (this.world as World).cScene.removeBody(curC.cBody);
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
