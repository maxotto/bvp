import { World } from '../types'
import {
  SphereBufferGeometry,
  TextureLoader,
  MeshBasicMaterial,
  Mesh,
} from 'three'

export class Panorama {
  constructor(private world: World, private segments: number = 32) {
    this.createPanorama()
  }

  update(time) {}

  createPanorama() {
    const geometry = new SphereBufferGeometry(
      this.world.panoRadius,
      this.segments,
      this.segments
    )
    geometry.scale(-1, 1, 1)
    geometry.center()
    const texture = new TextureLoader().load(this.world.panoramaPic)
    const material = new MeshBasicMaterial({ map: texture })
    const mesh = new Mesh(geometry, material)
    mesh.position.copy(this.world.panoCenter)
    mesh.rotation.y = -this.world.panoIniPhi * (Math.PI / 180)
    mesh.rotation.x = this.world.panoIniTheta * (Math.PI / 180)
    this.world.scene.add(mesh)
  }
}
