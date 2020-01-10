import { Object3D, Material, TextBufferGeometry, Group, Font, Vector3 } from "three";
import { TextParams } from "../../types";
import { Text } from "./Text";

export class TextBox extends Object3D {
  private words: Word[] = []
  private lines: string[][] = []
  private mesh = new Group()
  constructor(
    private width: number,
    private justify: string, //TODO make enum instead string
    private text: string,
    private font,
    private params: TextParams,
    public material?: Material | Material[]
  ) {
    super()
    const data = font.data
    console.log(data)
    const scale = params.size / data.resolution;
    const line_height = (font.data.boundingBox.yMax - font.data.boundingBox.yMin + font.data.underlineThickness) * scale;
    let s = text.trim()
    const words = s.replace(/\s{2,}/g, ' ').split(' ');
    words.unshift('Ш')
    words.forEach((word, i) => {
      const geometry = new TextBufferGeometry(word, params)
      geometry.center()
      const width = geometry.boundingBox.max.x - geometry.boundingBox.min.x
      const height = geometry.boundingBox.max.y - geometry.boundingBox.min.y
      this.words.push({
        text: word,
        width: width,
        height: height,
      })
    });
    console.log(this.words)
    let lineWidth = 0;
    this.lines.push([])
    this.words.forEach((word, i) => {
      if (i > 0) {
        lineWidth += word.width
        lineWidth += this.words[0].width
        if (lineWidth < width) {
          this.lines[this.lines.length - 1].push(word.text)
        } else {
          this.lines.push([])
          this.lines[this.lines.length - 1].push(word.text)
          lineWidth = word.width
          lineWidth += this.words[0].width
        }
      }
    });
    console.log(this.lines)
    let YPos = this.lines.length * line_height / 2.5
    this.lines.forEach(line => {
      const str = line.join(' ');
      const l = new Text(str, <Font>font, params, material)
      l.position.copy(new Vector3(
        0, YPos, 0
      ))
      this.mesh.add(l)
      YPos -= line_height
    });

    super.add(this.mesh)

  }
}

type Word = {
  text: string,
  width: number,
  height: number
}