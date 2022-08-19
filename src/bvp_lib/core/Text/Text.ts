import * as THREE from 'three';
import {TextGeometry, TextGeometryParameters } from "three/examples/jsm/geometries/TextGeometry.js";

import { TextParams } from '../../types'
import {Font} from "three/examples/jsm/loaders/FontLoader";

export class Text extends THREE.Object3D {
  public isText = true
  public geometry: THREE.BufferGeometry
  constructor(
    private text: string,
    private font: Font,
    private params: TextGeometryParameters,
    public material?: THREE.Material | THREE.Material[]
  ) {
    super()
    if (!material) this.material = new THREE.MeshStandardMaterial()
    this.type = 'Text'
    params.font = font
    this.geometry = new TextGeometry(text, params)
    this.geometry.center()
    super.add(new THREE.Mesh(this.geometry, this.material))
  }
}
