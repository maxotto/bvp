import * as THREE from 'three';
import { TextGeometryParameters } from 'three';
import { TextParams } from '../../types'

export class Text extends THREE.Object3D {
  public isText = true
  public geometry: THREE.BufferGeometry
  constructor(
    private text: string,
    private font: THREE.Font,
    private params: TextGeometryParameters,
    public material?: THREE.Material | THREE.Material[]
  ) {
    super()
    if (!material) this.material = new THREE.MeshStandardMaterial()
    this.type = 'Text'
    params.font = font
    this.geometry = new THREE.TextBufferGeometry(text, params)
    this.geometry.center()
    super.add(new THREE.Mesh(this.geometry, this.material))
  }
}
