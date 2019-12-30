import { Material, Font, Geometry, BufferGeometry, TextBufferGeometry, Color, Float32BufferAttribute, Mesh, Object3D, MeshStandardMaterial } from "three";
import { TextParams } from "../../types";

export class Letter extends Object3D {
  public isLetter: boolean
  public geometry: Geometry | BufferGeometry
  constructor(private letter: string, private font: Font, private params: TextParams, public material?: Material | Material[]) {
    super()
    if (!material) this.material = new MeshStandardMaterial()
    this.type = 'Letter'
    this.isLetter = true;
    params.font = font;
    this.geometry = new TextBufferGeometry(letter, params)
    this.geometry.center();
    super.add(new Mesh(
      this.geometry,
      material
    ))
  }
}