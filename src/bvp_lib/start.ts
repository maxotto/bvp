import { World, MouseEvents, KeyboardEvents, TouchEvents } from './types'
import { findGetParameters } from './/tools/helpers'

let sceneManager
export function start(onLoadHandler?: Function) {
  const getParams: any = findGetParameters()
  if (!getParams.p) {
    // alert('Project name required');
    getParams.p = 'Adamov202001_01'
    // throw new Error("Something went wrong!");
  }
  return import(/* webpackChunkName: "WorldLoader" */'./tools/WorldLoader').then(m => {
    const wLib = new m.WorldLoader(getParams.p)
    return wLib.load(onLoadHandler).then((world: World) => {
      const sLib = import(/* webpackChunkName: "WorldLoader" */'./SceneManager').then(m => {
        sceneManager = new m.SceneManager(<HTMLCanvasElement>document.getElementById('canvas'), <World>world)
        bindEventListeners()
        render()
        return world
      })
    })
  })
}

function bindEventListeners() {
  window.onresize = resizeCanvas
  for (let event in MouseEvents) {
    if (isNaN(Number(event))) {
      document.addEventListener(event, onMouseEvent, false)
    }
  }
  for (let event in KeyboardEvents) {
    if (isNaN(Number(event))) {
      document.addEventListener(event, onKeyboardEvent, false)
    }
  }

  for (let event in TouchEvents) {
    if (isNaN(Number(event))) {
      document.addEventListener(event, onTouchEvent, false)
    }
  }
  resizeCanvas()
}

function onMouseEvent(event) {
  sceneManager.onMouseEvent(event)
}

function onKeyboardEvent(event) {
  sceneManager.onKeyboardEvent(event)
}

function onTouchEvent(event) {
  sceneManager.onTouchEvent(event)
}

function resizeCanvas() {
  const canvas = <HTMLCanvasElement>document.getElementById('canvas')
  canvas.style.width = '100%'
  canvas.style.height = '100%'

  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  sceneManager.onWindowResize()
}

function render() {
  requestAnimationFrame(render)
  sceneManager.update()
}
