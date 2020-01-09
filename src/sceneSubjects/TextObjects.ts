import { Vector3, FontLoader, MeshPhongMaterial } from 'three'
import { Text } from '../core/Text/Text'
import { LineText } from '../core/Text/LineText'

export class TextObjects {
  private line: Text
  private text: Text
  constructor(scene) {
    var loader = new FontLoader();
    const material = new MeshPhongMaterial({ color: 0xffffff, flatShading: true })
    const text = "На радость Виталику 3"
    loader.load('fonts/Fira Code Light_Regular.json', (font) => {
      const all = new Text(
        text,
        font,
        {
          size: 200,
          height: 30,
          curveSegments: 10,
          bevelThickness: 15,
          bevelSize: 15,
          bevelEnabled: true,
          bevelSegments: 100,
        },
        material
      )

      let startX = -1000;
      all.position.copy(new Vector3(
        startX + 1660,
        -250,
        1000
      ))

      scene.add(all)
      this.text = all

      const line = new LineText(text, font, {
        size: 200,
        height: 30,
        curveSegments: 10,
        bevelThickness: 15,
        bevelSize: 15,
        bevelEnabled: false,
        bevelSegments: 100,
      })

      line.position.copy(new Vector3(
        startX + 1660,
        0,
        1000
      ))

      scene.add(line)
      this.line = line

    });


  }

  update(time) {
    // this.line.rotateX(0.02)
    // this.text.rotateY(0.03)
    // this.text.rotateX(0.1)
  }
}
