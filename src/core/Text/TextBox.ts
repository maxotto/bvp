import {
  Object3D,
  Material,
  TextBufferGeometry,
  Group,
  Font,
  Vector3,
} from 'three'
import { TextParams } from '../../types'
import { Text } from './Text'

export class TextBox extends Object3D {
  private lines: Word[][] = []
  private spaceWidth: number

  constructor(
    private width: number,
    private justify: string, //TODO make enum instead string
    private text: string,
    private font,
    private params: TextParams,
    public material?: Material | Material[]
  ) {
    super()
    this.splitText()
    super.add(this.makeTextBlock())
  }

  private splitText() {
    const words: Word[] = []
    const w = this.text
      .trim()
      .replace(/\s{2,}/g, ' ')
      .split(' ')
    w.unshift('W') // use W to calculate SPACE geometry
    w.forEach((word, i) => {
      const geometry = new TextBufferGeometry(word, this.params)
      geometry.center()
      const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x
      const height = geometry.boundingBox.max.y - geometry.boundingBox.min.y
      words.push({
        text: word,
        width: width,
        height: height,
      })
    })

    let lineWidth = 0
    this.lines.push([])
    this.spaceWidth = words[0].width
    words.forEach((word, i) => {
      if (i > 0) {
        lineWidth += word.width
        if (lineWidth < this.width) {
          lineWidth += this.spaceWidth
        } else {
          this.lines.push([])
          lineWidth = word.width
        }
        this.lines[this.lines.length - 1].push(word)
      }
    })
  }

  private makeTextBlock() {
    const mesh = new Group()
    const data = this.font.data
    const scale = this.params.size / data.resolution
    let YPos, lineMesh: Text | Group
    const line_height =
      (data.boundingBox.yMax -
        data.boundingBox.yMin +
        data.underlineThickness) *
      scale

    YPos = (this.lines.length * line_height) / 2.5
    this.lines.forEach(line => {
      const aLine = []
      let lineWidth = 0
      line.forEach(word => {
        aLine.push(word.text)
        lineWidth += word.width
      })
      if (this.justify != 'width') {
        lineWidth += this.spaceWidth * (line.length - 1)
        lineMesh = new Text(
          aLine.join(' '),
          <Font>this.font,
          this.params,
          this.material
        )
      } else {
        lineMesh = new Group()
        const wordsMeshes: Text[] = []

        line.forEach(word => {
          const w = new Text(
            word.text,
            <Font>this.font,
            this.params,
            this.material
          )
          wordsMeshes.push(w)
        })

        const spaceWidth = (this.width - lineWidth) / (line.length - 1)
        let prevShiftX = 0
        let XPos = -this.width / 2

        wordsMeshes.forEach((mesh, i) => {
          XPos += prevShiftX + line[i].width / 2 + spaceWidth * i
          mesh.position.copy(new Vector3(XPos, 0, 0))
          prevShiftX = line[i].width / 2
          lineMesh.add(mesh)
        })
      }
      switch (this.justify) {
        case 'left':
          lineMesh.position.copy(
            new Vector3(lineWidth / 2 - this.width / 2, YPos, 0)
          )
          break
        case 'right':
          lineMesh.position.copy(
            new Vector3(-lineWidth / 2 + this.width / 2, YPos, 0)
          )
          break
        case 'center':
        case 'width':
        default:
          lineMesh.position.copy(new Vector3(0, YPos, 0))
      }
      mesh.add(lineMesh)
      YPos -= line_height
    })

    return mesh
  }
}

type Word = {
  //Word and it`s geometry
  text: string
  width: number
  height: number
}
