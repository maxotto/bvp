import './style.css'
import { World, MouseEvents, KeyboardEvents, TouchEvents } from './types'
import { findGetParameters } from './tools/helpers'
import { WorldLoader } from './tools/WorldLoader';
import { SceneManager } from './SceneManager';

import Vue from "vue"
import HelloComponent from './app/components/HelloVue.vue'


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
  const l = new WorldLoader(getParams.p)
  let vue = new Vue({
    el: "#app",
    template: `<div id = 'vueApp'>
        Name: <input v-model="name" type="text">
        <hello-component :name="name" :initialEnthusiasm="5" />
    </div>`,
    data: { name: "World" },
    components: {
      HelloComponent
    }
  });
  l.load().then((world: World) => {
    var appDiv = <HTMLDivElement>document.getElementById('vueApp')
    appDiv.style.display = 'none'
    world.vue = {
      app: vue,
      container: appDiv
    }
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
