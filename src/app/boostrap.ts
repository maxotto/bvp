import '../style.css'
import { World, MouseEvents, KeyboardEvents, TouchEvents } from '../types'
import { findGetParameters } from '../tools/helpers'
import { WorldLoader } from '../tools/WorldLoader';
import { SceneManager } from '../SceneManager';

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
const l = new WorldLoader(getParams.p)
l.load().then((world: World) => {
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
