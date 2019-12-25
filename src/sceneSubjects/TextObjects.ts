import * as THREE from 'three'
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils.js'
import { createSphere } from '../tools/helpers'
import { Color, Vector3 } from 'three'
import { EditableText } from '../core/EditableText'

export class TextObjects {
  constructor(private scene) {
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
    ]
    const textObj = new EditableText(
      'На радость Виталику 2',
      'droid_serif',
      'bold.typeface',
      10,
      3,
      materials,
      0
    )
    textObj.position.copy(new Vector3(0, 0, 254))
    scene.add(textObj)
  }

  update(time) {
    //this.light.intensity = (Math.sin(time) + 1.5) / 1.5;
    //this.light.color.setHSL(Math.sin(time), 0.5, 0.5);
  }
}
