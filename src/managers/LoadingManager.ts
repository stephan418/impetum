import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadingManager {
  private gltfLoader: GLTFLoader;
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }

  loadGLTFSync(path: string): THREE.Group {
    let loadedMesh: THREE.Group = new THREE.Group();
    this.gltfLoader.load(path, (gltf) => {
      console.log(gltf.scene);
      loadedMesh = gltf.scene as THREE.Group;
    });
    return loadedMesh;
  }
}
