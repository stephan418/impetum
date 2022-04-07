import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadingManager {
  private gltfLoader: GLTFLoader;
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  loadGLTFSync(path: string): THREE.Mesh {
    let loadedMesh: THREE.Mesh = new THREE.Mesh();
    this.gltfLoader.load(path, (gltf) => {
      console.log(gltf.scene);
    });
    return loadedMesh;
  }
}
