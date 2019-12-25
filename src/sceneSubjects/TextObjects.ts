import * as THREE from 'three'
import { GeometryUtils } from 'three/examples/jsm/utils/GeometryUtils.js'
import { createSphere } from '../tools/helpers'
import { Color } from 'three'

export class TextObjects {
  constructor(private scene) {
    var fontMap = {
      helvetiker: 0,
      optimer: 1,
      gentilis: 2,
      'droid/droid_sans': 3,
      'droid/droid_serif': 4,
    }
    var text = 'На радость Виталику',
      height = 0.1,
      size = 1,
      hover = 0,
      curveSegments = 3,
      bevelThickness = 0.01,
      bevelSize = 0.01,
      bevelEnabled = true,
      font = undefined,
      // fontName = "Fira Code Retina", // helvetiker, optimer, gentilis, droid sans, droid serif
      fontName = 'droid_serif', // helvetiker, optimer, gentilis, droid sans, droid serif
      //fontWeight = "Regular"; // normal bold
      fontWeight = 'bold.typeface' // normal bold

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0xffffff, flatShading: true }), // front
      new THREE.MeshPhongMaterial({ color: 0xffffff }), // side
    ]
    const group = new THREE.Group()
    group.position.y = 0
    group.position.x = 0
    group.position.z = 255
    scene.add(group)
    var loader = new THREE.FontLoader()
    loader.load('fonts/' + fontName + '_' + fontWeight + '.json', function(
      response
    ) {
      console.log('Font loaded')
      font = response
      let textGeo = new THREE.TextGeometry(text, {
        font: font,
        size: size,
        height: height,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled,
      })
      textGeo.computeBoundingBox()
      textGeo.computeVertexNormals()

      var triangleAreaHeuristics = 0.001 * (height * size)
      for (var i = 0; i < textGeo.faces.length; i++) {
        var face = textGeo.faces[i]
        if (face.materialIndex == 1) {
          for (var j = 0; j < face.vertexNormals.length; j++) {
            face.vertexNormals[j].z = 0
            face.vertexNormals[j].normalize()
          }
          var va = textGeo.vertices[face.a]
          var vb = textGeo.vertices[face.b]
          var vc = textGeo.vertices[face.c]
          var s = GeometryUtils.triangleArea(va, vb, vc)
          if (s > triangleAreaHeuristics) {
            for (var j = 0; j < face.vertexNormals.length; j++) {
              face.vertexNormals[j].copy(face.normal)
            }
          }
        }
      }

      var centerOffset =
        -0.5 * (textGeo.boundingBox.max.x - textGeo.boundingBox.min.x)
      let textGeo1 = new THREE.BufferGeometry().fromGeometry(textGeo)
      let textMesh1 = new THREE.Mesh(textGeo, materials)
      textMesh1.position.x = centerOffset
      textMesh1.position.y = hover
      textMesh1.position.z = 0
      textMesh1.rotation.x = 0
      textMesh1.rotation.y = Math.PI * 2
      /*
            const ball = createSphere(textMesh1.position, 100, new Color(0x990000), {
                type: 'centralPoint',
                point: 'center',
            })
            group.add(ball);
            */

      group.add(textMesh1)
      scene.add(group)
    })
  }

  update(time) {
    //this.light.intensity = (Math.sin(time) + 1.5) / 1.5;
    //this.light.color.setHSL(Math.sin(time), 0.5, 0.5);
  }
}
