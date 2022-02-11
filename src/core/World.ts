import * as THREE from "three";
import ElementNotFoundError from "../errors/ElementNotFoundError";
import Updatable from "./Updatable";

export default class World implements Updatable {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private updatables: Updatable[];

  constructor(canvasId: string, fov = 75, near = 0.1, far = 5) {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
      throw new ElementNotFoundError(`A canvas with the ID '${canvasId}' was not found!`);
    }

    // -- Initialize the renderer --

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // -- Initialize the camera --

    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

    // -- Other --

    this.updatables = [];
  }

  public handleResize(): boolean {
    const canvas = this.renderer.domElement;

    if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
      // Needs resize
      this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

      this.camera.aspect = canvas.clientWidth / canvas.clientHeight;
      this.camera.updateProjectionMatrix();

      return true;
    }

    return false;
  }

  public update() {
    // Update all updatables and render

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.update.bind(this));
  }
}
