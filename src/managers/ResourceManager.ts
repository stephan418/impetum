import * as THREE from "three";
import * as CANNON from "cannon-es";
import LoadingManager from "./LoadingManager";
import { BufferGeometry } from "three";

export interface ShapeAndOffset {
  shape: CANNON.Shape | undefined;
  offset: CANNON.Vec3 | undefined;
}

export default class ResourceManager {
  private modelGeometries: Map<string, THREE.BufferGeometry[]>;
  private modelMaterials: Map<string, THREE.Material[]>;
  private modelTextures: Map<string, THREE.Texture[]>;
  private modelShapes: Map<string, ShapeAndOffset[][]>;
  private loadingManager: LoadingManager;

  // private finishedLoading: () => void;

  private finishedModelLoadingCallback: () => void;
  private loadingModelQueue: number;

  private textureLoader: THREE.TextureLoader;

  //maybe implement with async textures later
  /* private finishedTextureLoadingCallback: () => void;
  private loadingTextureQueue: number; */

  constructor(loadingManager: LoadingManager) {
    this.loadingManager = loadingManager;
    this.modelGeometries = new Map<string, THREE.BufferGeometry[]>();
    this.modelMaterials = new Map<string, THREE.Material[]>();
    this.modelTextures = new Map<string, THREE.Texture[]>();
    this.modelShapes = new Map<string, ShapeAndOffset[][]>();

    this.loadingModelQueue = 0;
    this.finishedModelLoadingCallback = () => {};

    this.textureLoader = new THREE.TextureLoader();

    /* this.loadingTextureQueue = 0;
    this.finishedTextureLoadingCallback = () => {}; */
  }
  loadModelGeometry(name: string, path: string): void;
  loadModelGeometry(name: string, path: string, index: number): void;
  loadModelGeometry(name: string, path: string, index?: number): void {
    //TODO: add error handling if model with path isn't found
    if (this.modelGeometries.get(name) != undefined) {
      return;
    }
    this.loadingModelQueue++;
    this.loadingManager.loadGLTFGeometryAsync(path).then((data) => {
      if (data == undefined) {
        return;
      }
      this.addModelGeometry(name, data[index || 0].geometry, index || 0);
      // this.addModelMaterial(name, data.material);
      this.loadingModelQueue--;
      if (this.loadingModelQueue == 0) {
        this.finishedModelLoadingCallback();
      }
    });
  }

  loadModelGeometries(name: string, path: string): void {
    //TODO: add error handling if model with path isn't found
    if (this.modelGeometries.get(name) != undefined) {
      return;
    }
    this.loadingModelQueue++;
    this.loadingManager.loadGLTFGeometryAsync(path).then((data) => {
      if (data == undefined) {
        return;
      }
      data.forEach((cur, idx) => {
        this.addModelGeometry(name, cur.geometry, idx);
      });
      // this.addModelMaterial(name, data.material);
      this.loadingModelQueue--;
      if (this.loadingModelQueue == 0) {
        this.finishedModelLoadingCallback();
      }
    });
  }

  setFinishedModelLoadingCallback(callback: () => void) {
    this.finishedModelLoadingCallback = callback;
  }

  addModelGeometry(name: string, geometry: THREE.BufferGeometry): void;
  addModelGeometry(name: string, geometry: THREE.BufferGeometry, index: number): void;
  addModelGeometry(name: string, geometry: THREE.BufferGeometry, index?: number): void {
    let arr = this.modelGeometries.get(name);
    if (arr == undefined) {
      this.modelGeometries.set(name, []);
      arr = this.modelGeometries.get(name);
    }
    (arr as THREE.BufferGeometry[])[index || 0] = geometry;
    this.modelGeometries.set(name, arr || []);
  }

  getModelGeometry(name: string): BufferGeometry | undefined;
  getModelGeometry(name: string, index: number): BufferGeometry | undefined;
  getModelGeometry(name: string, index?: number): BufferGeometry | undefined {
    let found = this.modelGeometries.get(name);
    if (found == undefined) {
      return undefined;
    }
    return found[index || 0];
  }

  addModelMaterial(name: string, material: THREE.Material): void;
  addModelMaterial(name: string, material: THREE.Material, index: number): void;
  addModelMaterial(name: string, material: THREE.Material, index?: number): void {
    let arr = this.modelMaterials.get(name);
    if (arr == undefined) {
      this.modelMaterials.set(name, []);
      arr = this.modelMaterials.get(name);
    }
    (arr as THREE.Material[])[index || 0] = material;
    this.modelMaterials.set(name, arr || []);
  }

  getModelMaterial(name: string): THREE.Material | undefined;
  getModelMaterial(name: string, index: number): THREE.Material | undefined;
  getModelMaterial(name: string, index?: number): THREE.Material | undefined {
    let found = this.modelMaterials.get(name);
    if (found == undefined) {
      return undefined;
    }
    return found[index || 0];
  }

  loadModelTexture(name: string, path: string): void;
  loadModelTexture(name: string, path: string, index: number): void;
  loadModelTexture(name: string, path: string, index?: number): void {
    this.addModelTexture(name, this.textureLoader.load(path), index || 0);
  }

  addModelTexture(name: string, texture: THREE.Texture): void;
  addModelTexture(name: string, texture: THREE.Texture, index: number): void;
  addModelTexture(name: string, texture: THREE.Texture, index?: number): void {
    let arr = this.modelTextures.get(name);
    if (arr == undefined) {
      this.modelTextures.set(name, []);
      arr = this.modelTextures.get(name);
    }
    (arr as THREE.Texture[])[index || 0] = texture;
    this.modelTextures.set(name, arr || []);
  }

  getModelTexture(name: string): THREE.Texture | undefined;
  getModelTexture(name: string, index: number): THREE.Texture | undefined;
  getModelTexture(name: string, index?: number): THREE.Texture | undefined {
    let found = this.modelTextures.get(name);
    if (found == undefined) {
      return undefined;
    }
    return found[index || 0];
  }

  addModelShape(name: string, shape: CANNON.Shape, offset: CANNON.Vec3): void;
  addModelShape(name: string, shape: CANNON.Shape, offset: CANNON.Vec3, index: number): void;
  addModelShape(name: string, shape: CANNON.Shape, offset: CANNON.Vec3, index: number, shapeIndex: number): void;
  addModelShape(name: string, shape: CANNON.Shape, offset: CANNON.Vec3, index?: number, shapeIndex?: number) {
    let currentArray = this.modelShapes.get(name);
    if (currentArray == undefined) {
      currentArray = [];
    }
    if (currentArray[index || 0] == undefined) {
      currentArray[index || 0] = [];
    }
    currentArray[index || 0][shapeIndex || 0] = { shape: shape, offset: offset };
    this.modelShapes.set(name, currentArray);
  }
  getModelShape(name: string): ShapeAndOffset;
  getModelShape(name: string, index: number): ShapeAndOffset;
  getModelShape(name: string, index: number, shapeIndex: number): ShapeAndOffset;
  getModelShape(name: string, index?: number, shapeIndex?: number): ShapeAndOffset {
    let currentArray = this.modelShapes.get(name);
    if (currentArray == undefined) {
      return { shape: undefined, offset: undefined };
    }
    if (currentArray[index || 0] == undefined) {
      return { shape: undefined, offset: undefined };
    }
    return {
      shape: currentArray[index || 0][shapeIndex || 0].shape,
      offset: currentArray[index || 0][shapeIndex || 0].offset,
    };
  }
  getModelShapes(name: string): ShapeAndOffset[];
  getModelShapes(name: string, index: number): ShapeAndOffset[];
  getModelShapes(name: string, index?: number): ShapeAndOffset[] {
    let currentArray = this.modelShapes.get(name);
    if (currentArray == undefined) {
      return [];
    }
    return currentArray[index || 0];
  }
}
