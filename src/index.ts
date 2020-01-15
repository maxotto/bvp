import './style.css'
// import { SceneManager } from './SceneManager'
// import { WorldLoader } from './tools/WorldLoader'
import { World, MouseEvents, KeyboardEvents, TouchEvents } from './types'
import { findGetParameters } from './tools/helpers'


var startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => {
  init()
}, false)

const canvas = <HTMLCanvasElement>document.getElementById('canvas')
let sceneManager
const getParams: any = findGetParameters()
if (!getParams.p) {
  // alert('Project name required');
  getParams.p = 'Adamov202001_01'
  // throw new Error("Something went wrong!");
}

function init() {
  import(/* webpackChunkName: "WorldLoader" */ './tools/WorldLoader').then(m => {
    const l = new m.WorldLoader(getParams.p)
    l.load().then(world => {
      import(/* webpackChunkName: "SceneManager" */ './SceneManager').then(m => {
        sceneManager = new m.SceneManager(canvas, <World>world)
        bindEventListeners()
        render()
      })
    })
  }

  )
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
