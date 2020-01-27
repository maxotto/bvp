import { SceneManager } from './SceneManager';
import { TouchEvents, KeyboardEvents, MouseEvents, World } from './types';
import { WorldLoader } from './tools/WorldLoader';
export default class bvp {
  public sceneManager: SceneManager = null
  private scope
  constructor(private project: string, private canvas: HTMLCanvasElement) {
    this.scope = this
  }

  public start(onLoadHandler?: Function) {
    const wLib = new WorldLoader(this.project)
    return wLib.load(onLoadHandler)
      .then((world: World) => {
        this.sceneManager = new SceneManager(<HTMLCanvasElement>document.getElementById('canvas'), <World>world)
        this.bindEventListeners()
        this.render()
      })
  }

  private bindEventListeners() {
    window.onresize = this.resizeCanvas
    for (let event in MouseEvents) {
      if (isNaN(Number(event))) {
        document.addEventListener(event, this.onMouseEvent, false)
      }
    }
    for (let event in KeyboardEvents) {
      if (isNaN(Number(event))) {
        document.addEventListener(event, this.onKeyboardEvent, false)
      }
    }

    for (let event in TouchEvents) {
      if (isNaN(Number(event))) {
        document.addEventListener(event, this.onTouchEvent, false)
      }
    }
    this.resizeCanvas()
  }

  private onMouseEvent = (event) => {
    this.sceneManager.onMouseEvent(event)
  }

  private onKeyboardEvent = (event) => {
    this.sceneManager.onKeyboardEvent(event)
  }

  private onTouchEvent = (event) => {
    this.sceneManager.onTouchEvent(event)
  }

  private resizeCanvas() {
    this.canvas.style.width = '100%'
    this.canvas.style.height = '100%'
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    if (this.sceneManager)
      this.sceneManager.onWindowResize()
  }

  private render = () => {
    requestAnimationFrame(this.render)
    this.sceneManager.update()
  }


}