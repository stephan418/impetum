import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadingManager {
  private gltfLoader: GLTFLoader;
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  async loadGLTFGeometryAsync(path: string): Promise<THREE.Mesh[] | undefined> {
    try {
      let loadedGLTF = await this.gltfLoader.loadAsync(path);
      let loadedMeshs = loadedGLTF.scene.children as THREE.Mesh[];
      return loadedMeshs;
    } catch (err) {
      //TODO: add error handling if a Model isn't found
      // return undefined;
      return undefined;
    }
  }
}
