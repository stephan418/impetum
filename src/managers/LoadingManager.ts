import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadingManager {
  private gltfLoader: GLTFLoader;
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  async loadGLTFGeometryAsync(path: string): Promise<THREE.BufferGeometry> {
    try {
      let loadedGLTF = await this.gltfLoader.loadAsync(path);
      let load = (loadedGLTF.scene.children[0] as THREE.Mesh).geometry;
      return load;
    } catch (err) {
      //TODO: add error handling if a Model isn't found
      // return undefined;
      return new THREE.BufferGeometry();
    }
  }
}
