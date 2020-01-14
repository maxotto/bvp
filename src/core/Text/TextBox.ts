import {
  Object3D,
  Material,
  TextBufferGeometry,
  Group,
  Font,
  Vector3,
  Color,
  PathActions,
} from 'three'
import { TextParams } from '../../types'
import { Text } from './Text'
import { createSphere } from '../../tools/helpers'

export class TextBox extends Object3D {
  private paragraphs: Paragraph[] = []
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
    this.spaceWidth = this.calculateSpaceWidth()
    this.splitText()
    super.add(this.makeTextBlock())
  }

  private splitText() {
    // find paragraphs
    const text = this.text
      .trim()
      .replace(/ {2,}/g, ' ')

    let paragraphTxt = ''

    for (var i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      if (charCode == 10) {
        if (i != 0) {
          this.splitParagraph(paragraphTxt)
          paragraphTxt = ''
        }
      } else {
        paragraphTxt += text.charAt(i)
      }
    }
    this.splitParagraph(paragraphTxt)
  }

  private splitParagraph(text) {
    const words: Word[] = []
    const lines: Line[] = []
    const w = text
      .trim()
      .replace(/\s{2,}/g, ' ')
      .split(' ')
    w.unshift('.') // use W to calculate SPACE geometry
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
    lines.push([])
    words.forEach((word, i) => {
      if (i > 0) {
        lineWidth += word.width
        const longWord = (word.width > this.width)
        if (longWord) {
          lines[lines.length - 1].push(word)
        } else {
          if (lineWidth < this.width) {
            lineWidth += this.spaceWidth
          } else {
            lines.push([])
            lineWidth = word.width
          }
          lines[lines.length - 1].push(word)
        }
      }
    })
    // console.log(lines)
    this.paragraphs.push(lines)
  }

  private calculateSpaceWidth() {
    const testStr = 'W W'
    const allG = new TextBufferGeometry(testStr, this.params).center()
    const wG = new TextBufferGeometry('W', this.params).center()
    return (allG.boundingBox.max.x - allG.boundingBox.min.x) - (wG.boundingBox.max.x - wG.boundingBox.min.x) * 2

  }

  private makeTextBlock() {
    const mesh = new Group()
    const data = this.font.data
    const scale = this.params.size / data.resolution
    let YPos, lineMesh: Text

    const line_height =
      (data.boundingBox.yMax -
        data.boundingBox.yMin +
        data.underlineThickness) *
      scale

    let linesCount = 0
    this.paragraphs.forEach(lines => {
      linesCount += lines.length
    });
    YPos = (linesCount * line_height) / 2.5

    this.paragraphs.forEach(lines => {
      lines.forEach((line, lineIndex) => {

        const aLine = []
        let lineWidth: number
        line.forEach(word => {
          aLine.push(word.text)
        })
        if (this.justify != 'width') {
          lineMesh = new Text(
            aLine.join(' '),
            <Font>this.font,
            this.params,
            this.material
          )
          lineMesh.geometry.center()
          lineWidth = lineMesh.geometry.boundingBox.max.x - lineMesh.geometry.boundingBox.min.x

        } else {
          const spacedLine = []
          line.forEach((word, i) => {
            spacedLine.push(word.text)
            if (i != line.length - 1) {
              spacedLine.push(' ')
            }
          })
          let testWidth = 0
          // TODO расмотреть случай, если в линии всего одно слово
          if (lineIndex < lines.length - 1) {
            // for every line in paagraph, except the last line, we do adjustment 
            // to adjust at the first step we add spaces between words
            // then we remove some spaces between words
            // finally we scale text mesh to precise adjustment
            if (line.length == 1) {
              console.log(line)
              lineMesh = new Text(
                line[0].text,
                <Font>this.font,
                this.params,
                this.material
              )
            } else {
              do {
                const g = new TextBufferGeometry(spacedLine.join(''), this.params).center()
                testWidth = g.boundingBox.max.x - g.boundingBox.min.x
                spacedLine.forEach((w, j) => {
                  if (j % 2 != 0) {
                    spacedLine[j] += ' '
                  }
                });
              } while (testWidth < this.width)
              // make step back
              testWidth = 0
              let stop = false
              spacedLine.forEach((w, j) => {
                if (j % 2 != 0 && !stop) {
                  spacedLine[j] = spacedLine[j].substring(1)
                  const g = new TextBufferGeometry(spacedLine.join(''), this.params).center()
                  testWidth = g.boundingBox.max.x - g.boundingBox.min.x
                  if (testWidth <= this.width) {
                    stop = true
                  }
                }
              });

              lineMesh = new Text(
                spacedLine.join(''),
                <Font>this.font,
                this.params,
                this.material
              )
              const g = lineMesh.geometry.center()
              testWidth = g.boundingBox.max.x - g.boundingBox.min.x
              const scale = testWidth / this.width
              lineMesh.scale.setX(1 / scale)

            }
          } else {
            // last line goes as is, with one space between words
            // we will position it to the left edge later
            lineMesh = new Text(
              spacedLine.join(''),
              <Font>this.font,
              this.params,
              this.material
            )
          }
          lineMesh.geometry.center()
          lineWidth = lineMesh.geometry.boundingBox.max.x - lineMesh.geometry.boundingBox.min.x

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
          case 'width':
            if (lineIndex < lines.length - 1) {
              lineMesh.position.copy(new Vector3(0, YPos, 0))
            } else { // last line should be justified left
              lineMesh.position.copy(
                new Vector3(lineWidth / 2 - this.width / 2, YPos, 0)
              )
            }
            break
          case 'center':
          default:
            lineMesh.position.copy(new Vector3(0, YPos, 0))
        }
        mesh.add(lineMesh)
        YPos -= line_height
      })
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
type Line = Word[]
type Paragraph = Line[]