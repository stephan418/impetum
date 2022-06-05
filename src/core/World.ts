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
import HUDManager from "../managers/HUDManager";
import GameStateManager from "../managers/GameStateManager";
import GameStateError from "../errors/GameStateError";
import BuildingManager from "../managers/BuildingManager";
import { groundMaterial, slipperyMaterial } from "./CannonMaterials";
import GeneralTurret from "../building/Turrets/GeneralTurret";
import { Sky } from "three/examples/jsm/objects/Sky";
import { config } from "../managers/OptionsManager";
import Wave from "./wave/Wave";
import WaveManager from "../managers/WaveManager";
import Crystal from "../building/Crystal";

export default class World {
  private renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;

  private sceneSky: Sky;

  private updatables: Updatable[];

  private deltaClock: THREE.Clock;
  private deltaTime: number;

  private requestId?: number;

  private deltaPhysicsClock: THREE.Clock;
  private deltaPhysicsTime: number;

  cScene: CANNON.World;
  private cSolver: CANNON.GSSolver;

  private inputManager: InputManager;
  private loadingManager: LoadingManager;
  private resourceManager: ResourceManager;
  private hudManager: HUDManager;
  private gameStateManager: GameStateManager;
  private buildingManager: BuildingManager;
  private waveManager: WaveManager;

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
    //make optional
    this.floorMesh.receiveShadow = true;
    this.scene.add(this.floorMesh);

    // -- Setup Physics for Floor --
    this.cFloorShape = new CANNON.Plane();
    this.cFloorBody = new CANNON.Body({ mass: 0, material: groundMaterial });
    this.cFloorBody.addShape(this.cFloorShape);
    this.cFloorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
    this.cFloorBody.position.y = 0;

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

    this.buildingManager = new BuildingManager(this);

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

    // -- Initialize the Resource Manager --
    this.resourceManager = new ResourceManager(this.loadingManager);
    this.resourceManager.setFinishedModelLoadingCallback(
      (() => {
        this.player.startGhostClock();
        for (let i = 0; i < 10; i++) {
          let newTurret = new GeneralTurret(this.resourceManager);
          newTurret.setPosition(new THREE.Vector3(i * 10, 0, 0));
          this.buildingManager.addGridElement(newTurret);

          const crystal = new Crystal(this.resourceManager);
          crystal.setPosition(new THREE.Vector3(0, 0, 10));
          this.buildingManager.addGridElement(crystal);
        }

        this.floorMesh.material = new THREE.MeshLambertMaterial({ map: this.resourceManager.getModelTexture("grass") });
      }).bind(this)
    );

    //TODO: Add proper loading from an object, which has all filenames of the models
    this.resourceManager.loadModelTexture("grass", "static/grasTexture.png");
    (this.resourceManager.getModelTexture("grass") as THREE.Texture).wrapS = THREE.RepeatWrapping;
    (this.resourceManager.getModelTexture("grass") as THREE.Texture).wrapT = THREE.RepeatWrapping;
    (this.resourceManager.getModelTexture("grass") as THREE.Texture).repeat = new THREE.Vector2(50, 50);

    this.resourceManager.loadModelGeometry("debugFloor", "static/debugFloor.glb");
    this.resourceManager.loadModelGeometry("debugWall", "static/debugWall.glb");
    this.resourceManager.loadModelGeometry("debugMonke", "static/debugMonke.glb");
    this.resourceManager.loadModelGeometry("defaultWorld", "static/defaultWorld.glb");

    this.resourceManager.loadModelGeometries("crystal", "static/crystal.glb");
    this.resourceManager.loadModelTexture("crystal", "static/crystalTexture.png");
    this.resourceManager.addModelShape(
      "crystal",
      new CANNON.Box(new CANNON.Vec3(2.5, 5, 2.5)),
      new CANNON.Vec3(0, 0, 0)
    );
    this.resourceManager.addModelMaterial(
      "crystal",
      new THREE.MeshLambertMaterial({ map: this.resourceManager.getModelTexture("crystal") })
    );

    this.resourceManager.loadModelGeometries("generalTurret", "static/generalTurret.glb");
    this.resourceManager.addModelShape(
      "generalTurret",
      new CANNON.Box(new CANNON.Vec3(2.5, 2.5, 2.5)),
      new CANNON.Vec3(0, 0, 0),
      0,
      0
    );
    this.resourceManager.loadModelTexture("generalTurret", "static/generalTurretTexture.png");
    this.resourceManager.addModelMaterial(
      "generalTurret",
      new THREE.MeshLambertMaterial({ map: this.resourceManager.getModelTexture("generalTurret") })
    );

    this.resourceManager.loadModelGeometry("woodenFloor", "static/woodenFloor.glb");
    this.resourceManager.loadModelTexture("woodenFloor", "static/woodenFloorTexture.png");
    this.resourceManager.addModelMaterial(
      "woodenFloor",
      new THREE.MeshLambertMaterial({ map: this.resourceManager.getModelTexture("woodenFloor") })
    );
    this.resourceManager.addModelShape(
      "woodenFloor",
      new CANNON.Box(new CANNON.Vec3(5, 0.1, 5)),
      new CANNON.Vec3(0, 0, 0)
    );

    this.resourceManager.loadModelGeometry("woodenWall", "static/woodenWall.glb");
    this.resourceManager.loadModelTexture("woodenWall", "static/woodenWallTexture.png");
    this.resourceManager.addModelMaterial(
      "woodenWall",
      new THREE.MeshLambertMaterial({ map: this.resourceManager.getModelTexture("woodenWall") })
    );
    this.resourceManager.addModelShape(
      "woodenWall",
      new CANNON.Box(new CANNON.Vec3(5, 5, 0.1)),
      new CANNON.Vec3(0, 0, 0)
    );

    this.resourceManager.addModelMaterial("debugFloor", new THREE.MeshLambertMaterial({ color: 0xff00ff }));
    this.resourceManager.addModelMaterial("debugWall", new THREE.MeshLambertMaterial({ color: 0x00ffff }));
    this.resourceManager.addModelMaterial("debugMonke", new THREE.MeshLambertMaterial({ color: 0xff00ff }));
    this.resourceManager.addModelMaterial("defaultWorld", new THREE.MeshLambertMaterial({ color: 0xff00ff }));

    this.resourceManager.addModelShape(
      "debugFloor",
      new CANNON.Box(new CANNON.Vec3(5, 0.1, 5)),
      new CANNON.Vec3(0, 0, 0)
    );
    this.resourceManager.addModelShape(
      "debugWall",
      new CANNON.Box(new CANNON.Vec3(5, 5, 0.1)),
      new CANNON.Vec3(0, 0, 0)
    );

    // -- Setup updateables array --
    // TODO: implement spatial hashing map which gets used for distance, logic based operations
    this.updatables = [];

    // -- Setup physics world --
    this.cScene = new CANNON.World();
    // this.cScene.gravity.set(0, -9.81, 0);
    this.cScene.gravity.set(0, -50, 0);
    this.cScene.broadphase = new CANNON.SAPBroadphase(this.cScene);

    //Setup Contact Material for Ground and Ground
    const cGroundGround = new CANNON.ContactMaterial(groundMaterial, groundMaterial, {
      friction: 0.4,
      restitution: 0.3,
      contactEquationStiffness: 1e8,
      contactEquationRelaxation: 3,
      frictionEquationStiffness: 1e8,
    });
    this.cScene.addContactMaterial(cGroundGround);

    //Setup Contact Material for Slippery and Ground
    const cSlipperyGround = new CANNON.ContactMaterial(groundMaterial, slipperyMaterial, {
      friction: 0.02,
      restitution: 0.01,
      contactEquationStiffness: 1e8,
      // contactEquationStiffness: 1e1,
      contactEquationRelaxation: 5,
    });
    this.cScene.addContactMaterial(cSlipperyGround);

    //Setup Contact Material for Slippery and Ground
    const cSlipperySlippery = new CANNON.ContactMaterial(slipperyMaterial, slipperyMaterial, {
      friction: 0.01,
      restitution: 0.01,
      contactEquationStiffness: 1e8,
      // contactEquationStiffness: 1e1,
      contactEquationRelaxation: 5,
    });
    this.cScene.addContactMaterial(cSlipperySlippery);

    this.cSolver = new CANNON.GSSolver();
    this.cSolver.iterations = 100;
    this.cSolver.tolerance = 0.1;
    this.cScene.solver = new CANNON.SplitSolver(this.cSolver);

    this.cScene.allowSleep = true;

    // -- Floor --
    // TODO: add real world
    this.generateFloor();

    // -- Initialize the player, with camera --

    this.player = new Player(
      aspect,
      fov,
      near,
      far,
      this.inputManager,
      this.buildingManager,
      this.resourceManager,
      this.scene,
      this.renderer.domElement
    );
    this.player.addToWorld(this);
    this.camera = this.player.camera;

    // -- Initialize the GameStateManager --
    this.gameStateManager = new GameStateManager(
      this,
      this.inputManager,
      this.player.pointerLockControls,
      this.renderer.domElement
    );

    // -- Initialize the HUD --
    this.hudManager = new HUDManager("hud-root", this.gameStateManager, this.inputManager, this.player.inventory);

    this.hudManager.attach();

    this.waveManager = new WaveManager({}, this, new THREE.Vector3(0, 1, 0), false);

    // this.waveManager.start();

    // -- Setup Light --
    this.ambientLight = new THREE.AmbientLight(0x808080);
    this.directionalLight = new THREE.DirectionalLight(0xdfdfdf, 0.9);
    this.directionalLight.position.set(1, 1, 1);

    if (config.graphics.shadows) {
      let side = 50;
      this.directionalLight.shadow.camera.top = side;
      this.directionalLight.shadow.camera.bottom = -side;
      this.directionalLight.shadow.camera.left = side;
      this.directionalLight.shadow.camera.right = -side;

      this.directionalLight.shadow.mapSize.width = config.graphics.shadowsize;
      this.directionalLight.shadow.mapSize.height = config.graphics.shadowsize;

      this.directionalLight.shadow.bias = -0.001;

      //make those light shadows optional
      this.renderer.shadowMap.enabled = true;
      // this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.directionalLight.castShadow = true;

      /* let upColor = 0xFFFF80;
    let downColor = 0x4040FF;
    let light = new THREE.HemisphereLight(upColor, downColor, 1.0);
    this.scene.add(light); */

      // -- Setup shadowmap --
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      this.renderer.outputEncoding = THREE.sRGBEncoding;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.4;
    }

    this.scene.add(this.ambientLight);
    this.scene.add(this.directionalLight);
    this.scene.add(this.directionalLight.target);

    this.sceneSky = new Sky();
    this.sceneSky.scale.setScalar(350000);
    this.sceneSky.material.uniforms["turbidity"].value = 10;
    this.sceneSky.material.uniforms["rayleigh"].value = 3;
    this.sceneSky.material.uniforms["mieCoefficient"].value = 0.005;
    this.sceneSky.material.uniforms["mieDirectionalG"].value = 0.7;
    this.sceneSky.material.uniforms["sunPosition"].value.copy(
      new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90 - 50), THREE.MathUtils.degToRad(50))
    );

    this.scene.add(this.sceneSky);

    // -- Initializes clock for delta time --
    this.deltaClock = new THREE.Clock();
    this.deltaTime = 0;

    // -- Initializes clock for delta time which gets used by the physics update --
    this.deltaPhysicsClock = new THREE.Clock();
    this.deltaPhysicsTime = 0;

    // -- Add CubeEntity to test physics --
    /* for (let o = 1; o < 2; o++) {
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          let cubeEntity = new CubeEntity(new CANNON.Vec3(i * o * 5, o * o, j * o * 5), new CANNON.Vec3(o, o, o));
          cubeEntity.addToWorld(this);
          this.updatables.push(cubeEntity);
        }
      }
    } */
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

  getUpdatables() {
    return this.updatables;
  }
  addUpdatable(elem: Updatable) {
    this.updatables.push(elem);
  }
  removeUpdatable(elem: Updatable) {
    this.updatables.forEach((val, id) => {
      if (val == elem) {
        this.updatables.splice(id);
      }
    });
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

    //makes basically a day light cycle by changing the sun's position
    /* this.sceneSkyCounter += this.deltaTime * 1;
    this.sceneSky.material.uniforms["sunPosition"].value.copy(
      new THREE.Vector3().setFromSphericalCoords(
        1,
        THREE.MathUtils.degToRad(90 - this.sceneSkyCounter),
        THREE.MathUtils.degToRad(180)
      )
    ); */

    /* this.directionalLight.position.set(
      0,
      Math.cos(this.sceneSkyCounter / 10) * 10,
      Math.sin(this.sceneSkyCounter / 10) * 10
    ); */

    if (config.graphics.shadows) {
      this.directionalLight.position.set(
        this.player.camera.position.x + 30,
        this.player.camera.position.y + 30,
        this.player.camera.position.z + 30
      );
      this.directionalLight.target = this.player.camera;
    }
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
    this.player.pointerLockControls.unlock();

    // Pause waves
    this.waveManager.pause();
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
    document.body.focus();

    // TODO: Pointer lock

    // Unpause waves
    this.waveManager.unpause();
  }

  public start() {
    this.gameStateManager.unpause();
  }
}
