import * as THREE from "three";
import * as CANNON from "cannon";
import ElementNotFoundError from "../errors/ElementNotFoundError";
import Updatable from "../interfaces/Updatable";
import InputManager from "../managers/InputManager";

export default class World {
  private renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private updatables: Updatable[];

  private deltaClock: THREE.Clock;
  private deltaTime: number;

  cScene: CANNON.World;

  private inputManager: InputManager;

  private floorGeometry!: THREE.PlaneGeometry;
  private floorMaterial!: THREE.MeshLambertMaterial;
  private floorMesh!: THREE.Mesh;
  private cFloorShape!: CANNON.Plane;
  private cFloorBody!: CANNON.Body;

  private ambientLight: THREE.AmbientLight;
  generateFloor() {
    this.floorGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    this.floorMaterial = new THREE.MeshLambertMaterial({ color: 0xa0a0a0 });
    this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floorMesh.receiveShadow = true;
    this.floorMesh.rotation.x = -Math.PI * 2;
    this.scene.add(this.floorMesh);
    this.camera.position.z = 5;

    // -- Setup Physics for Floor --
    this.cFloorShape = new CANNON.Plane();
    this.cFloorBody = new CANNON.Body({ mass: 0 });
    this.cFloorBody.addShape(this.cFloorShape);
    this.cFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.cScene.addBody(this.cFloorBody);
  }

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

    // -- Setup updateables array --
    this.updatables = [];

    // -- Setup physics world --
    this.cScene = new CANNON.World();
    this.cScene.gravity.set(0, -9.81, 0);
    this.cScene.broadphase = new CANNON.SAPBroadphase(this.cScene);
    this.cScene.solver.iterations = 10;
    this.cScene.allowSleep = true;

    // -- Floor --
    // TODO: add real world
    this.generateFloor();

    // -- Setup Light --
    this.ambientLight = new THREE.AmbientLight(0x808080);
    this.scene.add(this.ambientLight);

    // -- Setup shadowmap --
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // -- Initializes clock for delta time --
    this.deltaClock = new THREE.Clock();
    this.deltaTime = 0;

    this.inputManager = new InputManager();
    this.inputManager.addKeyCallback("f", (pressed) => {
      if (!pressed) return;
      this.renderer.domElement.requestFullscreen();
    });

    // -- Adds event listener to resize the window --
    // this.renderer.domElement.addEventListener("resize", this.handleResize.bind(this));
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

  public tick() {
    //get delta time
    this.deltaTime = this.deltaClock.getDelta();
    //run update method
    this.update();
    this.updatePhysics();
    this.render();
    requestAnimationFrame(this.tick.bind(this));
  }

  public update() {
    // Update all updatables
    this.updatables.forEach((updateable) => {
      updateable.update(this.deltaTime);
    });
  }

  public updatePhysics() {}

  public render() {
    this.handleResize();
    this.renderer.render(this.scene, this.camera);
  }
}
