import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

export default class LoadingManager {
  private gltfLoader: GLTFLoader;
  constructor() {
    this.gltfLoader = new GLTFLoader();
  }
}
