import { World } from '../types'
import {
  calcCameraPosition,
  getGroupGeometry,
} from '../tools/helpers'
import { EditableGroup } from '../core/EditableGroup'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import {
  Group,
  Mesh,
  IcosahedronBufferGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Color,
  ShapeBufferGeometry,
  PlaneBufferGeometry,
  CanvasTexture,
  DoubleSide,
  RepeatWrapping
} from 'three'

export class SceneSubjects {
  private scene
  private world: World
  private radius = 5
  private mesh

  constructor(scene, world: World) {
    this.scene = scene
    this.world = world

    this.mesh = new Mesh(
      new IcosahedronBufferGeometry(this.radius, 2),
      new MeshStandardMaterial({ flatShading: true })
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
      var group = new Group()
      group.scale.multiplyScalar(0.25)
      group.position.x = -70
      group.position.y = 70
      group.scale.y *= -1
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i]
        var fillColor = path.userData.style.fill
        if (fillColor !== undefined && fillColor !== 'none') {
          var material = new MeshBasicMaterial({
            color: new Color().setStyle(fillColor),
            opacity: path.userData.style.fillOpacity,
            transparent: path.userData.style.fillOpacity < 1,
            side: DoubleSide,
            depthWrite: false,
            wireframe: false,
          })
          var shapes = path.toShapes(true)
          for (var j = 0; j < shapes.length; j++) {
            var shape = shapes[j]
            var geometry = new ShapeBufferGeometry(shape)
            var mesh = new Mesh(geometry, material)
            group.add(mesh)
          }
        }
        var strokeColor = path.userData.style.stroke
        if (strokeColor !== undefined && strokeColor !== 'none') {
          var material = new MeshBasicMaterial({
            color: new Color().setStyle(strokeColor),
            opacity: path.userData.style.strokeOpacity,
            transparent: path.userData.style.strokeOpacity < 1,
            side: DoubleSide,
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
              var mesh = new Mesh(geometry, material)
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
    var frameGeometry = new PlaneBufferGeometry(
      this.world.width + frameBorder,
      this.world.height + frameBorder
    )
    var meshFrame = new Mesh(
      frameGeometry,
      new MeshBasicMaterial({
        color: +this.world.mainBackgroundColor,
        side: DoubleSide,
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
    var textureCanvas = new CanvasTexture(imageCanvas)
    textureCanvas.repeat.set(1000, 1000)
    textureCanvas.wrapS = RepeatWrapping
    textureCanvas.wrapT = RepeatWrapping
    var materialCanvas = new MeshBasicMaterial({
      map: textureCanvas,
      side: DoubleSide,
    })
    var geometry = new PlaneBufferGeometry(100, 100)
    var meshCanvas = new Mesh(geometry, materialCanvas)
    meshCanvas.rotation.x = -Math.PI / 2
    meshCanvas.scale.set(500, 500, 500)
    var floorHeight = (-1 * this.world.height) / 2
    meshCanvas.position.y = floorHeight
    this.scene.add(meshCanvas)
  }

  update(time) {
    const z = Math.sin(time / 2) * 500 + 400
    const y = Math.sin(time / 2) * 200
    const x = Math.cos(time / 2) * 500
    this.mesh.position.z = z
    this.mesh.position.y = y
    this.mesh.position.x = x
  }
}
