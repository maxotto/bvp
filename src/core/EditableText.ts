import {
  Vector3,
  Object3D,
  FontLoader,
  TextGeometry,
  BufferGeometry,
  Mesh,
  Material,
} from 'three'
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils'

export class EditableText extends Object3D {
  private _thicknessRatio: number = 0.1
  private _bevelThicknessRatio: number = 0.01
  private _bevelSizeRatio: number = 0.01
  private _bevelEnabled: boolean = true
  public isText = true

  constructor(
    private text: string,
    private font: string,
    private fontWeight: number,
    private size: number,
    private curvedSegments: number,
    private materials: Material[],
    private hover: number
  ) {
    super()
    const loader = new FontLoader()
    loader.load('fonts/' + font + '_' + fontWeight + '.json', function (
      fontLoaded
    ) {
      let textGeo = new TextGeometry(text, {
        font: fontLoaded,
        size: this.size,
        height: this.size * this._thicknessRatio,
        curveSegments: this.curveSegments,
        bevelThickness: this.size * this._bevelThicknessRatio,
        bevelSize: this.size * this._bevelSizeRatio,
        bevelEnabled: this._bevelEnabled,
      })
      textGeo.computeBoundingBox()
      textGeo.computeVertexNormals()
      const triangleAreaHeuristics =
        0.001 * (this.size * this._thicknessRatio * this.size)
      for (let i = 0; i < textGeo.faces.length; i++) {
        const face = textGeo.faces[i]
        if (face.materialIndex == 1) {
          for (let j = 0; j < face.vertexNormals.length; j++) {
            face.vertexNormals[j].z = 0
            face.vertexNormals[j].normalize()
          }
          let va = textGeo.vertices[face.a]
          let vb = textGeo.vertices[face.b]
          let vc = textGeo.vertices[face.c]
          let s = GeometryUtils.triangleArea(va, vb, vc)
          if (s > triangleAreaHeuristics) {
            for (let j = 0; j < face.vertexNormals.length; j++) {
              face.vertexNormals[j].copy(face.normal)
            }
          }
        }
      }

      const centerOffset =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
      const textGeoBuff = new BufferGeometry().fromGeometry(textGeo)
      const textMesh1 = new Mesh(textGeo, this.materials)
      textMesh1.position = new Vector3(centerOffset, this.hover, 0)
      textMesh1.rotation.x = 0
      textMesh1.rotation.y = Math.PI * 2

      this.super.add(textMesh1)
    })
  }

  get thicknessRatio(): number {
    return this._thicknessRatio
  }

  set thicknessRatio(val: number) {
    this._thicknessRatio = val
  }

  get bevelThicknessRatio(): number {
    return this._bevelThicknessRatio
  }

  set bevelThicknessRatio(val: number) {
    this._bevelThicknessRatio = val
  }

  get bevelSizeRatio(): number {
    return this._bevelSizeRatio
  }

  set bevelSizeRatio(val: number) {
    this._bevelSizeRatio = val
  }

  get bevelEnabled(): boolean {
    return this._bevelEnabled
  }

  set bevelEnabled(val: boolean) {
    this._bevelEnabled = val
  }
}
