import * as THREE from "three";
import * as CANNON from "cannon-es";
import ElementNotFoundError from "../errors/ElementNotFoundError";
import Updatable from "../interfaces/Updatable";
import InputManager from "../managers/InputManager";
import Player from "../entities/Player";
import CubeEntity from "../entities/CubeEntity";
import GridManager from "../managers/GridManager";
import LoadingManager from "../managers/LoadingManager";
import ResourceManager from "../managers/ResourceManager";
import WoodenFloor from "../building/Floors/WoodenFloor";
import WoodenWall from "../building/Walls/WoodenWall";
import HUDManager from "../managers/HUDManager";
import GameStateManager from "../managers/GameStateManager";
import GameStateError from "../errors/GameStateError";

export default class World {
  private renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private updatables: Updatable[];

  private deltaClock: THREE.Clock;
  private deltaTime: number;

  private requestId?: number;

  private deltaPhysicsClock: THREE.Clock;
  private deltaPhysicsTime: number;

  cScene: CANNON.World;
  private cSolver: CANNON.GSSolver;

  private inputManager: InputManager;
  private gridManager: GridManager;
  private loadingManager: LoadingManager;
  private resourceManager: ResourceManager;
  private hudManager: HUDManager;
  private gameStateManager: GameStateManager;

  private floorGeometry!: THREE.PlaneGeometry;
  private floorMaterial!: THREE.MeshLambertMaterial;
  private floorMesh!: THREE.Mesh;
  private cFloorShape!: CANNON.Plane;
  private cFloorBody!: CANNON.Body;

  private ambientLight: THREE.AmbientLight;
  private directionalLight: THREE.DirectionalLight;

  private player: Player;

  generateFloor() {
    this.floorGeometry = new THREE.PlaneGeometry(1000, 1000, 50, 50);
    this.floorMaterial = new THREE.MeshLambertMaterial({ color: 0xa0a0a0 });
    this.floorMesh = new THREE.Mesh(this.floorGeometry, this.floorMaterial);
    this.floorMesh.receiveShadow = true;
    /* this.floorMesh.rotation.x = -Math.PI / 2;
    this.floorMesh.position.y = -1; */
    this.scene.add(this.floorMesh);

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

    // -- Setup Scene --

    this.scene = new THREE.Scene();
    const aspect = canvas.clientWidth / canvas.clientHeight;

    this.loadingManager = new LoadingManager();
    this.loadingManager.loadGLTFGeometryAsync("../../static/debugMonke.glb").then((data) => {
      let loadedMaterial = new THREE.MeshLambertMaterial({ color: 0x00ffff });
      let loadedMesh: THREE.Mesh = new THREE.Mesh(data, loadedMaterial);
      // data.position.set(10, 10, 10);
      // data.scale.set(5, 5, 5);
      loadedMesh.scale.set(4, 4, 4);
      loadedMesh.position.set(10, 10, 10);
      this.scene.add(loadedMesh);
    });

    // -- Initialize the Grid Manager --
    this.gridManager = new GridManager();

    // -- Initialize the Resource Manager --
    this.resourceManager = new ResourceManager(this.loadingManager);
    this.resourceManager.setFinishedModelLoadingCallback(
      (() => {
        /* for (let i = 0; i < 100; i++) {
          let woodenFloor = new WoodenFloor(this.resourceManager);
          woodenFloor.setPositionOnGrid(new THREE.Vector3(0, i * 10, i * 10));
          woodenFloor.addToWorld(this);
        } */
        let woodenFloor = new WoodenFloor(this.resourceManager);
        woodenFloor.setPositionOnGrid(new THREE.Vector3(0, 0, 0));
        woodenFloor.addToWorld(this);

        let woodenWall = new WoodenWall(this.resourceManager);
        woodenWall.addToWorld(this);
        woodenFloor.setZBackWall(woodenWall);

        let woodenWall1 = new WoodenWall(this.resourceManager);
        woodenWall1.addToWorld(this);
        woodenFloor.setXLeftWall(woodenWall1);

        let woodenFloor1 = new WoodenFloor(this.resourceManager);
        woodenFloor1.setPositionOnGrid(new THREE.Vector3(0, 10, 0));
        woodenFloor1.addToWorld(this);

        // let floorElement = e
      }).bind(this)
    );

    //TODO: Add proper loading from an object, which has all filenames of the models
    this.resourceManager.loadModelGeometry("debugFloor", "static/debugFloor.glb");
    this.resourceManager.loadModelGeometry("debugWall", "static/debugWall.glb");
    this.resourceManager.loadModelGeometry("debugMonke", "static/debugMonke.glb");
    this.resourceManager.loadModelGeometry("defaultWorld", "static/defaultWorld.glb");

    this.resourceManager.addModelMaterial("debugFloor", new THREE.MeshLambertMaterial({ color: 0xff00ff }));
    this.resourceManager.addModelMaterial("debugWall", new THREE.MeshLambertMaterial({ color: 0x00ffff }));
    this.resourceManager.addModelMaterial("debugMonke", new THREE.MeshLambertMaterial({ color: 0xff00ff }));
    this.resourceManager.addModelMaterial("defaultWorld", new THREE.MeshLambertMaterial({ color: 0xff00ff }));

    this.resourceManager.addModelShape("debugFloor", new CANNON.Box(new CANNON.Vec3(5, 0.1, 5)));
    this.resourceManager.addModelShape("debugWall", new CANNON.Box(new CANNON.Vec3(5, 5, 0.1)));

    for (let i = 0; i < 100; i++) {
      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      let cubeGeometry = new THREE.BoxGeometry(8, 0.2, 8);
      let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cubeMesh.position.copy(this.gridManager.positionToGridPosition(new THREE.Vector3(i * 10, 0, 0), "y"));
      this.scene.add(cubeMesh);
    }

    /* for (let i = 0; i < 100; i++) {
      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      let cubeGeometry = new THREE.BoxGeometry(8, 8, 0.2);
      let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cubeMesh.position.copy(this.gridManager.positionToGridPosition(new THREE.Vector3(10 * i, 0, 0), "z"));
      this.scene.add(cubeMesh);
    }

    for(let i = 0; i < 100; i++) {
      let cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
      let cubeGeometry = new THREE.BoxGeometry(0.2, 8, 8);
      let cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
      cubeMesh.position.copy(this.gridManager.positionToGridPosition(new THREE.Vector3(10 * i, 0, 0), "x"));
      this.scene.add(cubeMesh);
    } */

    // -- Setup updateables array --
    // TODO: implement spatial hashing map which gets used for distance, logic based operations
    this.updatables = [];

    // -- Setup physics world --
    this.cScene = new CANNON.World();
    // this.cScene.gravity.set(0, -9.81, 0);
    this.cScene.gravity.set(0, -40, 0);
    this.cScene.broadphase = new CANNON.SAPBroadphase(this.cScene);

    this.cSolver = new CANNON.GSSolver();
    this.cSolver.iterations = 100;
    this.cSolver.tolerance = 0.1;
    this.cScene.solver = new CANNON.SplitSolver(this.cSolver);

    this.cScene.allowSleep = true;

    // -- Floor --
    // TODO: add real world
    this.generateFloor();

    // -- Initialize the player, with camera --

    this.player = new Player(aspect, fov, near, far, this.inputManager, this.scene);
    this.player.addToWorld(this);
    this.camera = this.player.camera;

    // -- Initialize the GameStateManager --
    this.gameStateManager = new GameStateManager(this, this.inputManager, this.player.pointerLockControls);

    // -- Initialize the HUD --
    this.hudManager = new HUDManager("hud-root", this.gameStateManager);

    this.hudManager.attach();

    // -- Setup Light --
    this.ambientLight = new THREE.AmbientLight(0x808080);
    this.directionalLight = new THREE.DirectionalLight(0xdfdfdf, 0.5);
    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);

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
    for (let o = 1; o < 2; o++) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          let cubeEntity = new CubeEntity(new CANNON.Vec3(i * o * 5, o * o, j * o * 5), new CANNON.Vec3(o, o, o));
          cubeEntity.addToWorld(this);
          this.updatables.push(cubeEntity);
        }
      }
    }
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
    this.requestId = requestAnimationFrame(this.tick.bind(this));
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
    if (this.deltaPhysicsTime > 0) {
      this.cScene.step(this.deltaPhysicsTime);
    }

    this.player.updatePhysics(this.deltaPhysicsTime);
    this.updatables.forEach((updateable) => {
      updateable.updatePhysics(this.deltaPhysicsTime);
    });
  }

  public render() {
    this.handleResize();
    this.renderer.render(this.scene, this.camera);
  }

  private _pause() {
    if (!this.requestId) {
      throw new GameStateError("The game is already paused");
    }

    // Stop game loop
    cancelAnimationFrame(this.requestId);

    // Pause clocks
    this.deltaClock.stop();
    this.deltaPhysicsClock.stop();

    // Reset requestId
    this.requestId = undefined;
  }

  private _unpause() {
    if (this.requestId) {
      throw new GameStateError("The game is not paused");
    }

    // Unpause clocks
    this.deltaClock.start();
    this.deltaPhysicsClock.start();

    // Restart game loop
    this.requestId = requestAnimationFrame(this.tick.bind(this));
  }

  public start() {
    this.gameStateManager.unpause();
  }
}
