import { Vector3, MeshPhongMaterial, Color, ShaderMaterial, AdditiveBlending, TextBufferGeometry, FontLoader, Float32BufferAttribute, Line, MeshStandardMaterial } from 'three'
import { EditableText } from '../core/Text/EditableText'
import { Letter } from '../core/Text/Letter'
import { TestLetter } from '../core/Text/TestLetter'

export class TextObjects {
  private mesh: EditableText
  constructor(private scene) {
    const materials = [
      new MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new MeshPhongMaterial({ color: 0xffffff }), // side
    ]
    this.mesh = new EditableText(
      'На радость Виталику 2',
      'droid_serif',
      'bold.typeface',
      10,
      3,
      materials,
      0
    )
    this.mesh.position.copy(new Vector3(0, 0, 254))
    scene.add(this.mesh)
    // TEST
    var loader = new FontLoader();
    const text = "На радость Виталику 3"
    loader.load('fonts/Fira Code Light_Regular.json', (font) => {
      const letters: Letter[] = []
      for (var i = 0; i < text.length; i++) {
        letters.push(
          new TestLetter(text[i], font, {
            size: 200,
            height: 30,
            curveSegments: 10,
            bevelThickness: 15,
            bevelSize: 15,
            bevelEnabled: false,
            bevelSegments: 100,
          })
        )
      }
      let startX = -1000;
      letters[0].position.copy(new Vector3(0, 0, 1000))
      letters.forEach((e, i, l) => {
        e.position.copy(new Vector3(
          startX + i * 300,
          0,
          1000
        ));
        scene.add(e);
      });
    });


  }

  update(time) {
    // this.mesh.rotateZ(0.03)
    // this.mesh.rotateX(0.02)
    // this.mesh.rotateY(0.05)
  }
}
