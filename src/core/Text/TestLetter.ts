import { Letter } from "./Letter";
import { Font, Color, ShaderMaterial, AdditiveBlending, Line, TextBufferGeometry, Float32BufferAttribute } from "three";
import { TextParams } from "../../types";

export class TestLetter extends Letter {
  constructor(letter: string, font: Font, params: TextParams) {
    super(letter, font, params)
    const uniforms = {
      amplitude: { value: 5.0 },
      opacity: { value: 0.3 },
      color: { value: new Color(0xffffff) }
    };
    var shaderMaterial = new ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById('vertexshader').textContent,
      fragmentShader: document.getElementById('fragmentshader').textContent,
      blending: AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    const geometry = <TextBufferGeometry>this.geometry
    var count = geometry.attributes.position.count;
    var displacement = new Float32BufferAttribute(count * 3, 3);
    geometry.setAttribute('displacement', displacement);
    var customColor = new Float32BufferAttribute(count * 3, 3);
    geometry.setAttribute('customColor', customColor);
    var color = new Color(0xffffff);
    for (var i = 0, l = customColor.count; i < l; i++) {
      color.setHSL(i / l, 0.5, 0.5);
      color.toArray(customColor.array, i * customColor.itemSize);
    }
    const line = new Line(this.geometry, shaderMaterial);
    line.rotation.x = 0.8;
    // super.children = []
    super.add(line)
  }
}