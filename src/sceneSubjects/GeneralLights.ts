import * as THREE from 'three';

export class GeneralLights {
    constructor(scene) {
        this.scene = scene;
        this.light = new THREE.PointLight("#2222ff", 1);
        this.scene.add(this.light);
    }
    private scene;
    private light;

    update(time) {
        this.light.intensity = (Math.sin(time) + 1.5) / 1.5;
        this.light.color.setHSL(Math.sin(time), 0.5, 0.5);
    }
}