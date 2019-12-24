import * as THREE from 'three'
import { World } from '../types'
import {
  calcCameraPosition,
  createSphere,
  getGroupGeometry,
} from '../tools/helpers'
import { EditableGroup, EditableGroupState } from '../core/EditableGroup'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { Color, Group, Vector3 } from 'three'

export class SceneSubjects {
  private scene
  private world: World
  private radius = 5
  private mesh

  constructor(scene, world: World) {
    this.scene = scene
    this.world = world

    this.mesh = new THREE.Mesh(
      new THREE.IcosahedronBufferGeometry(this.radius, 2),
      new THREE.MeshStandardMaterial({ flatShading: true })
    )
    this.mesh.position.set(-3000, 50, 120)
    this.scene.add(this.mesh)

    // TODO this.createGround();
    // this.createTiger();

    world.slides.forEach((slide, index) => {
      let slideGroup
      if (index === 0) {
        // TODO this.createFrame();
        this.scene.background = slide.texture
        // console.log(slide.background);
        slideGroup = new Group()
      } else {
        slideGroup = new EditableGroup()
        world.draggables.push(slideGroup)
      }
      slideGroup.add(slide.background)
      slide.objects.forEach(object => {
        slideGroup.add(object)
        world.draggables.push(object)
      })
      slideGroup.position.x = slide.position.x + slide.width / 2
      slideGroup.position.y = slide.position.y - slide.height / 2
      slideGroup.position.z = slide.position.z
      slideGroup.name = 'slideGroup_' + index
      const _groupGeometry = getGroupGeometry(slideGroup)
      _groupGeometry.parentSlide = index
      _groupGeometry.delta.z = 0
      slideGroup.userData = _groupGeometry
      this.scene.add(slideGroup)
      //update cameraPosition for every slide according to view from the center of panorama

      if (slideGroup.position.z < world.panoCenter.z) {
        slideGroup.lookAt(world.panoCenter)
        const newCameraPos = calcCameraPosition(world, slide, slideGroup)
        this.world.slides[index].cameraPosition.copy(newCameraPos)
        this.world.slides[index].cameraLookAt.copy(slideGroup.position)
      } else {
        // do nothing
      }
    })
  }

  createTiger() {
    var loader = new SVGLoader()
    loader.load('/assets/NTerebilenko/tiger.svg', (data: any) => {
      var paths = data.paths
      var group = new THREE.Group()
      group.scale.multiplyScalar(0.25)
      group.position.x = -70
      group.position.y = 70
      group.scale.y *= -1
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i]
        var fillColor = path.userData.style.fill
        if (fillColor !== undefined && fillColor !== 'none') {
          var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setStyle(fillColor),
            opacity: path.userData.style.fillOpacity,
            transparent: path.userData.style.fillOpacity < 1,
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: false,
          })
          var shapes = path.toShapes(true)
          for (var j = 0; j < shapes.length; j++) {
            var shape = shapes[j]
            var geometry = new THREE.ShapeBufferGeometry(shape)
            var mesh = new THREE.Mesh(geometry, material)
            group.add(mesh)
          }
        }
        var strokeColor = path.userData.style.stroke
        if (strokeColor !== undefined && strokeColor !== 'none') {
          var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setStyle(strokeColor),
            opacity: path.userData.style.strokeOpacity,
            transparent: path.userData.style.strokeOpacity < 1,
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: false,
          })
          for (var j = 0, jl = path.subPaths.length; j < jl; j++) {
            var subPath = path.subPaths[j]
            var geometry = SVGLoader.pointsToStroke(
              subPath.getPoints(),
              path.userData.style,
              20,
              1
            )
            if (geometry) {
              var mesh = new THREE.Mesh(geometry, material)
              group.add(mesh)
            }
          }
        }
      }
      this.scene.add(group)
    })
  }

  createFrame() {
    var frameBorder = 50
    var frameGeometry = new THREE.PlaneBufferGeometry(
      this.world.width + frameBorder,
      this.world.height + frameBorder
    )
    var meshFrame = new THREE.Mesh(
      frameGeometry,
      new THREE.MeshBasicMaterial({
        color: +this.world.mainBackgroundColor,
        side: THREE.DoubleSide,
      })
    )
    meshFrame.position.z = -50.0
    this.scene.add(meshFrame)
  }

  createGround() {
    var imageCanvas = document.createElement('canvas')
    var context = imageCanvas.getContext('2d')
    imageCanvas.width = imageCanvas.height = 128
    context.fillStyle = '#000'
    context.fillRect(0, 0, 128, 128)
    context.fillStyle = '#444'
    context.fillRect(0, 0, 64, 64)
    context.fillRect(64, 64, 64, 64)
    var textureCanvas = new THREE.CanvasTexture(imageCanvas)
    textureCanvas.repeat.set(1000, 1000)
    textureCanvas.wrapS = THREE.RepeatWrapping
    textureCanvas.wrapT = THREE.RepeatWrapping
    var materialCanvas = new THREE.MeshBasicMaterial({
      map: textureCanvas,
      side: THREE.DoubleSide,
    })
    var geometry = new THREE.PlaneBufferGeometry(100, 100)
    var meshCanvas = new THREE.Mesh(geometry, materialCanvas)
    meshCanvas.rotation.x = -Math.PI / 2
    meshCanvas.scale.set(500, 500, 500)
    var floorHeight = (-1 * this.world.height) / 2
    meshCanvas.position.y = floorHeight
    this.scene.add(meshCanvas)
  }

  update(time) {
    const z = Math.sin(time / 7) * 300
    const y = Math.sin(time / 7) * 300 - 100
    const x = Math.cos(time / 7) * 300
    this.mesh.position.z = z
    this.mesh.position.y = y
    this.mesh.position.x = x
  }
}
