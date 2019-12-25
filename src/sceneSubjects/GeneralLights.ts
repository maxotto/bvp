import { PointLight } from 'three'

export class GeneralLights {
  private light
  constructor(scene) {
    this.light = new PointLight('#ffffffw', 1)
    this.light.position.set(1550, 1050, 15050)
    scene.add(this.light)
  }

  update(time) {
    // this.light.intensity = (Math.sin(time / 4) + 1.5) / 1.5;
    // this.light.color.setHSL(Math.sin(time / 4), 0.5, 0.5);
  }
}
