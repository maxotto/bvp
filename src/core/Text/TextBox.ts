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
  private lines: string[][] = []

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
    const spaceWidth = words[0].width
    words.forEach((word, i) => {
      if (i > 0) {
        lineWidth += word.width
        if (lineWidth < this.width) {
          lineWidth += spaceWidth
        } else {
          this.lines.push([])
          lineWidth = word.width
        }
        this.lines[this.lines.length - 1].push(word.text)
      }
    })
  }

  private makeTextBlock() {
    const mesh = new Group()
    const data = this.font.data
    const scale = this.params.size / data.resolution
    const line_height =
      (data.boundingBox.yMax -
        data.boundingBox.yMin +
        data.underlineThickness) *
      scale

    switch (this.justify) {
      default:
        let YPos = (this.lines.length * line_height) / 2.5
        this.lines.forEach(line => {
          const l = new Text(
            line.join(' '),
            <Font>this.font,
            this.params,
            this.material
          )
          l.position.copy(new Vector3(0, YPos, 0))
          mesh.add(l)
          YPos -= line_height
        })
        break
    }
    return mesh
  }
}

type Word = {
  //Word and it`s geometry
  text: string
  width: number
  height: number
}
