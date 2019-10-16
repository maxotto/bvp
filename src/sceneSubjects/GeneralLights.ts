import { PointLight } from 'three';

export class GeneralLights {
    private light;
    constructor(scene) {
        this.light = new PointLight("#FFFFFF", 1);
        this.light.position.set(150, 50, 550);
        scene.add(this.light);
    }

    update(time) {
        //this.light.intensity = (Math.sin(time) + 1.5) / 1.5;
        //this.light.color.setHSL(Math.sin(time), 0.5, 0.5);
    }
}