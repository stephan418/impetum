import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";


export default class LoadingManager {
  private gltfLoader: GLTFLoader;
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  async loadGLTFGeometryAsync(path: string): Promise<THREE.Mesh> {
    try {
      let loadedGLTF = await this.gltfLoader.loadAsync(path);
      let loadedMesh = (loadedGLTF.scene.children[0] as THREE.Mesh);
      return loadedMesh;
    } catch (err) {
      //TODO: add error handling if a Model isn't found
      // return undefined;
      return new THREE.Mesh();
    }
  }
}
