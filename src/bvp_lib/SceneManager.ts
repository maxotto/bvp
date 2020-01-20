import TWEEN from '@tweenjs/tween.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { GeneralLights } from './sceneSubjects/GeneralLights'
import { SceneSubjects } from './sceneSubjects/SceneSubjects'
import { Panorama } from './sceneSubjects/panorama'

import { MyDataControls } from './tools/datGui'

import { WorldMode, World, WorldCoordinatesType } from './types'
import * as Stats from 'stats.js'
import { Vector3, Scene, Color, WebGLRenderer, PerspectiveCamera, Clock } from 'three'
import { SlidesController } from './SlidesController'

export class SceneManager {
  private clock = new Clock()
  private screenDimensions
  private myControls
  public sceneSubjects
  private slidesController
  private stats: Stats
  private ready = false

  constructor(private canvas: HTMLCanvasElement, private world: World) {
    this.screenDimensions = {
      width: this.canvas.width,
      height: this.canvas.height,
      fov: this.world.cameraFov,
    }
    this.world.scene = this.buildScene()
    this.world.renderer = this.buildRender(this.screenDimensions)
    this.world.camera = this.buildCamera(this.screenDimensions)
    this.sceneSubjects = this.createSceneSubjects(this.world.scene, this.world)
    this.world.orbitControl = new OrbitControls(
      this.world.camera,
      this.world.renderer.domElement
    )
    this.world.orbitControl.screenSpacePanning = true
    this.world.orbitControl.target = new Vector3(0, 0, 0)
    this.world.orbitControl.update()
    this.slidesController = new SlidesController(this.world)
    this.slidesController.onSwitchToEditorMode.subscribe(a => {
      this.changeMode(WorldMode.editor)
    })
    this.slidesController.onSwitchToShowMode.subscribe(a => {
      this.changeMode(WorldMode.show)
    })
    this.ready = true
    import(/* webpackChunkName: "SlidesController" */ './SlidesController').then(m => {
    })
    this.myControls = new MyDataControls(this.world)
    this.changeMode(WorldMode.show)
  }

  changeMode(newMode: WorldMode) {
    this.world.mode = newMode
    this.world.orbitControl.enabled = WorldMode[newMode] != 'show'
    if (WorldMode[newMode] != 'show') {
      this.myControls.show()
    } else {
      this.myControls.hide()
    }
  }

  onKeyboardEvent(event) {
    if (this.ready)
      this.slidesController.onKeyboardEvent(event)
  }

  onMouseEvent(event) {
    if (this.ready)
      this.slidesController.onMouseEvent(event)
  }

  onTouchEvent(event) {
    if (this.ready)
      this.slidesController.onTouchEvent(event)
  }

  buildScene() {
    const scene = new Scene()
    scene.background = new Color('#000')
    // scene.fog = new Fog(0x0099ff, 5, 160);
    return scene
  }

  buildRender({ width, height }) {
    this.stats = new Stats()
    this.stats.showPanel(0)
    this.stats.dom.id = 'stats'
    this.stats.dom.style.display = 'none'
    document.body.appendChild(this.stats.dom)

    const renderer = new WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      logarithmicDepthBuffer: true,
    })
    const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1
    renderer.setPixelRatio(DPR)
    renderer.setSize(width, height)

    return renderer
  }

  buildCamera({ width, height, fov }) {
    const aspectRatio = width / height
    const fieldOfView = fov
    const nearPlane = 0.1
    const farPlane = 39000
    const camera = new PerspectiveCamera(
      fieldOfView,
      aspectRatio,
      nearPlane,
      farPlane
    )
    return camera
  }

  createSceneSubjects(scene, world) {
    let sceneSubjects = []
    sceneSubjects.push(new GeneralLights(scene))
    sceneSubjects.push(new SceneSubjects(scene, world))
    if (world.type == WorldCoordinatesType.sphere) {
      sceneSubjects.push(new Panorama(world, 32))
    }
    // sceneSubjects.push(new TextObjects(scene))
    return sceneSubjects
  }

  update() {
    if (this.ready) {
      this.stats.begin()
      if (this.slidesController.getBusy()) {
        TWEEN.update()
      }
      const elapsedTime = this.clock.getElapsedTime()

      for (let i = 0; i < this.sceneSubjects.length; i++)
        this.sceneSubjects[i].update(elapsedTime)

      this.world.orbitControl.update()
      this.world.renderer.render(this.world.scene, this.world.camera)
      this.stats.end()
    }
  }

  onWindowResize() {
    const { width, height } = this.canvas
    this.screenDimensions.width = width
    this.screenDimensions.height = height
    this.world.camera.aspect = width / height
    this.world.camera.updateProjectionMatrix()
    this.world.renderer.setSize(width, height)
  }
}
