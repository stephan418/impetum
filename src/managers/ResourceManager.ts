import * as THREE from "three";
import * as CANNON from "cannon-es";
import LoadingManager from "./LoadingManager";

export default class ResourceManager {
  private modelGeometries: Map<string, THREE.BufferGeometry>;
  private modelMaterials: Map<string, THREE.Material>;
  private modelTextures: Map<string, THREE.Texture>;
  private modelShapes: Map<string, CANNON.Shape[]>;
  private loadingManager: LoadingManager;

  private finishedModelLoadingCallback: () => void;
  private loadingModelQueue: number;

  constructor(loadingManager: LoadingManager) {
    this.loadingManager = loadingManager;
    this.modelGeometries = new Map<string, THREE.BufferGeometry>();
    this.modelMaterials = new Map<string, THREE.Material>();
    this.modelTextures = new Map<string, THREE.Texture>();
    this.modelShapes = new Map<string, CANNON.Shape[]>();

    this.loadingModelQueue = 0;
    this.finishedModelLoadingCallback = () => {};
  }
  loadModelGeometry(name: string, path: string) {
    //TODO: add error handling if model with path isn't found
    if (this.modelGeometries.get(name) != undefined) {
      return;
    }
    this.loadingModelQueue++;
    this.loadingManager.loadGLTFGeometryAsync(path).then((data) => {
      this.addModelGeometry(name, data);
      this.loadingModelQueue--;
      if (this.loadingModelQueue == 0) {
        this.finishedModelLoadingCallback();
      }
    });
  }

  setFinishedModelLoadingCallback(callback: () => void) {
    this.finishedModelLoadingCallback = callback;
  }
  addModelGeometry(name: string, geometry: THREE.BufferGeometry) {
    this.modelGeometries.set(name, geometry);
  }
  getModelGeometry(name: string) {
    return this.modelGeometries.get(name);
  }
  removeModelGeometry(name: string) {
    this.modelGeometries.delete(name);
  }

  addModelMaterial(name: string, material: THREE.Material) {
    this.modelMaterials.set(name, material);
  }
  getModelMaterial(name: string) {
    return this.modelMaterials.get(name);
  }
  removeModelMaterial(name: string) {
    this.modelMaterials.delete(name);
  }

  addModelTexture(name: string, texture: THREE.Texture) {
    this.modelTextures.set(name, texture);
  }
  getModelTexture(name: string) {
    return this.modelTextures.get(name);
  }
  removeModelTexture(name: string) {
    this.modelTextures.delete(name);
  }

  //TODO implement this correctly
  addModelShape(name: string, shape: CANNON.Shape) {
    let currentArray = this.modelShapes.get(name);
    if (currentArray == undefined) {
      currentArray = [];
    }
    currentArray.push(shape);
    this.modelShapes.set(name, currentArray);
  }
  getModelShapes(name: string) {
    return this.modelShapes.get(name);
  }
  removeModelShapes(name: string) {
    this.modelShapes.delete(name);
  }
}
