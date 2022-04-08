import * as THREE from "three";
import LoadingManager from "./LoadingManager";

export default class ResourceManager {
  private modelGeometries: Map<string, THREE.BufferGeometry>;
  private loadingManager: LoadingManager;

  constructor(loadingManager: LoadingManager) {
    this.loadingManager = loadingManager;
    this.modelGeometries = new Map<string, THREE.BufferGeometry>();
  }
  loadModelGeometry(path: string, name: string) {
    //TODO: add error handling if model with path isn't found
    if (this.modelGeometries.get(name) != undefined) {
      return;
    }
    this.loadingManager.loadGLTFGeometryAsync(path).then((data) => {
      this.addModelGeometry(name, data);
    });
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
}
