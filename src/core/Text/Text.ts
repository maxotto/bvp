import { Material, Font, Geometry, BufferGeometry, TextBufferGeometry, Color, Float32BufferAttribute, Mesh, Object3D, MeshStandardMaterial } from "three";
import { TextParams } from "../../types";

export class Text extends Object3D {
  public isText = true
  public geometry: Geometry | BufferGeometry
  constructor(private text: string, private font: Font, private params: TextParams, public material?: Material | Material[]) {
    super()
    if (!material) this.material = new MeshStandardMaterial()
    this.type = 'Text'
    params.font = font;
    this.geometry = new TextBufferGeometry(text, params)
    console.log(this.geometry)
    this.geometry.center();
    super.add(new Mesh(
      this.geometry,
      this.material
    ))
  }
}