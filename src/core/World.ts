import * as THREE from "three";
import * as CANNON from "cannon-es";
import ElementNotFoundError from "../errors/ElementNotFoundError";
import Updatable from "../interfaces/Updatable";
import InputManager from "../managers/InputManager";
import Player from "../entities/Player";
import CubeEntity from "../entities/CubeEntity";

export default class World {
  private renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private updatables: Updatable[];

  private deltaClock: THREE.Clock;
  private deltaTime: number;

  private deltaPhysicsClock: THREE.Clock;
  private deltaPhysicsTime: number;

  cScene: CANNON.World;
  private cSolver: CANNON.GSSolver;

  private inputManager: InputManager;

  private floorGeometry!: THREE.PlaneGeometry;
  private floorMaterial!: THREE.MeshLambertMaterial;
  private floorMesh!: THREE.Mesh;
  private cFloorShape!: CANNON.Plane;
  private cFloorBody!: CANNON.Body;

  private ambientLight: THREE.AmbientLight;

  private player: Player;

  private cubeEntity: CubeEntity;

  generateFloor() {
    this.floorGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    this.floorMaterial = new THREE.MeshLambertMaterial({ color: 0xa0a0a0 });
    this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floorMesh.receiveShadow = true;
    /* this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = -1; */
    this.scene.add(this.floorMesh);
    this.camera.position.z = 5;

    // -- Setup Physics for Floor --
    this.cFloorShape = new CANNON.Plane();
    this.cFloorBody = new CANNON.Body({ mass: 0 });
    this.cFloorBody.addShape(this.cFloorShape);
    this.cFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.cFloorBody.position.y = -1;

    // copy valuse from physical body to mesh
    this.floorMesh.position.copy(this.cFloorBody.position as unknown as THREE.Vector3);
    this.floorMesh.quaternion.copy(this.cFloorBody.quaternion as unknown as THREE.Quaternion);

    this.cScene.addBody(this.cFloorBody);
  }

  constructor(canvasId: string, fov = 80, near = 0.1, far = 1000) {
    const canvas = document.getElementById(canvasId);

    if (!canvas) {
      throw new ElementNotFoundError(`A canvas with the ID '${canvasId}' was not found!`);
    }

    // -- Initialize the renderer --

    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

    // -- Initialize the Input Manager --
    this.inputManager = new InputManager();
    this.inputManager.addKeyCallback("f", (pressed) => {
      if (!pressed) return;
      this.renderer.domElement.requestFullscreen();
    });

    // -- Initialize the player, with camera --

    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.player = new Player(aspect, fov, near, far, this.inputManager);
    this.camera = this.player.camera;

    // -- Setup Scene --

    this.scene = new THREE.Scene();

    // -- Setup updateables array --
    // TODO: implement spatial hashing map which gets used for distance, logic based operations
    this.updatables = [];

    // -- Setup physics world --
    this.cScene = new CANNON.World();
    this.cScene.gravity.set(0, -9.81, 0);
    this.cScene.broadphase = new CANNON.SAPBroadphase(this.cScene);

    this.cSolver = new CANNON.GSSolver();
    this.cSolver.iterations = 10;
    this.cSolver.tolerance = 0.1;
    this.cScene.solver = new CANNON.SplitSolver(this.cSolver);

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

    // -- Initializes clock for delta time which gets used by the physics update --
    this.deltaPhysicsClock = new THREE.Clock();
    this.deltaPhysicsTime = 0;

    // -- Add CubeEntity to test physics --
    for (let i = 0; i < 100; i++) {
      let cubeEntity = new CubeEntity(new CANNON.Vec3(0, i * 2, 0));
      cubeEntity.addToWorld(this);
      this.updatables.push(cubeEntity);
    }
    /* this.cubeEntity = new CubeEntity();
    this.cubeEntity.addToWorld(this);
    this.updatables.push(this.cubeEntity); */
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

    this.player.update(this.deltaTime);
    this.updatables.forEach((updateable) => {
      updateable.update(this.deltaTime);
    });
  }

  public updatePhysics() {
    this.deltaPhysicsTime = this.deltaPhysicsClock.getDelta();
    this.cScene.step(this.deltaPhysicsTime);

    this.player.updatePhysics(this.deltaPhysicsTime);
    this.updatables.forEach((updateable) => {
      updateable.updatePhysics(this.deltaPhysicsTime);
    });
  }

  public render() {
    this.handleResize();
    this.renderer.render(this.scene, this.camera);
  }
}
