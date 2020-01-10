import { Object3D, Font, Material, TextBufferGeometry } from "three";
import { TextParams } from "../../types";

export class TextBox extends Object3D {
  private words: Word[] = []
  private lines: string[][] = []
  constructor(
    private width: number,
    private justify: string, //TODO make enum instead string
    private text: string,
    private font: Font,
    private params: TextParams,
    public material?: Material | Material[]
  ) {
    super()
    console.log(font)
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

  }
}

type Word = {
  text: string,
  width: number,
  height: number
}