import { Vector3, MeshPhongMaterial } from 'three'
import { EditableText } from '../core/EditableText'

export class TextObjects {
  private mesh:EditableText
  constructor(private scene) {
    const materials = [
      new MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new MeshPhongMaterial({ color: 0xffffff }), // side
    ]
    this.mesh = new EditableText(
      'На радость Виталику 2',
      'droid_serif',
      'bold.typeface',
      10,
      3,
      materials,
      0
    )
    this.mesh.position.copy(new Vector3(0, 0, 254))
    scene.add(this.mesh)
  }

  update(time) {
    // this.mesh.rotateZ(0.03)
    // this.mesh.rotateX(0.02)
    // this.mesh.rotateY(0.05)
  }
}
