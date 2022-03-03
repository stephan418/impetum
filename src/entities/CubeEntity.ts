import World from "../core/World";
import Entity from "../interfaces/Entity";
import * as THREE from "three";
import * as CANNON from "cannon";

export default class CubeEntity implements Entity{
    private geometry: THREE.BoxGeometry;
    private material:THREE.MeshLambertMaterial;
    private mesh: THREE.Mesh;

    private cShape: CANNON.Box;
    private cBody: CANNON.Body;

    constructor(){
        this.geometry = new THREE.BoxGeometry();
        this.material = new THREE.MeshLambertMaterial({color: 0xdd00dd });
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        this.cShape = new CANNON.Box(new CANNON.Vec3(1,1,1));
        this.cBody = new CANNON.Body();
        this.cBody.addShape(this.cShape);
    }

    addToWorld(world: World): void {
        world.scene.add(this.mesh);
        world.cScene.addBody(this.cBody);
    }
    removeFromWorld(world: World): void {
        world.scene.remove(this.mesh);
        world.cScene.remove(this.cBody);
    }
    update(deltaTime: number): void {
    }
    updatePhysics(deltaTime: number): void {
    }

};
