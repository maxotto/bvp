import { World } from "../types";
import * as THREE from 'three';

export class Panorama {
    constructor(private world: World, private segments: number = 32) {
        this.createPanorama();
    }

    update(time) {

    }

    createPanorama() {
        const geometry = new THREE.SphereBufferGeometry(this.world.panoRadius, this.segments, this.segments);
        geometry.scale(-1, 1, 1);
        geometry.center();
        const texture = new THREE.TextureLoader().load(this.world.panoramaPic);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(this.world.panoCenter);
        mesh.rotation.y = - Math.PI / 2;
        this.world.scene.add(mesh);
    }
}