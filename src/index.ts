import './style.css'
import { World, MouseEvents, KeyboardEvents, TouchEvents } from './types'
import { findGetParameters } from './tools/helpers'
import { WorldLoader } from './tools/WorldLoader';
import { SceneManager } from './SceneManager';

import Vue from "vue"
import AppComponent from './app/App.vue'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'

Vue.use(Buefy)

var startButton = document.getElementById('startButton');
startButton.addEventListener('click', () => {
  init()
}, false)

let sceneManager
const getParams: any = findGetParameters()
if (!getParams.p) {
  // alert('Project name required');
  getParams.p = 'Adamov202001_01'
  // throw new Error("Something went wrong!");
}

function init() {
  const l = new WorldLoader(getParams.p)
  l.load().then((world: World) => {
    const vue = new Vue({
      el: "#app",
      template: `<div>
      <div id = 'vueApp'>
          <app-component :name="name" :world="world"/>
      </div>
      <div class="main" id="main">
      <canvas id="canvas"></canvas>
      </div>
      </div>`,
      data: {
        world: world,
        name: "World"
      },
      components: {
        AppComponent
      }
    });
    var appDiv = <HTMLDivElement>document.getElementById('vueApp')
    // appDiv.style.display = 'none'
    world.vue = {
      app: vue,
      container: appDiv
    }
    const canvas = <HTMLCanvasElement>document.getElementById('canvas')
    sceneManager = new SceneManager(canvas, <World>world)
    var overlay = document.getElementById('overlay')
    overlay.remove()
    bindEventListeners()
    render()
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
