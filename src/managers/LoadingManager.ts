import * as THREE from "three";
import { Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadingManager {
  private gltfLoader: GLTFLoader;
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  async loadGLTFGeometryAsync(path: string) {
    try {
      let loadedGLTF = await this.gltfLoader.loadAsync(path);
      let load = loadedGLTF.scene.children[0];
      return load;
    } catch (err) {}
    return new THREE.Object3D();
  }
}
