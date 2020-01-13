import { Mesh, Vector3, Font } from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export type ScenarioData = {
  width: number
  height: number
  slides: []
  steps: []
  mainBackgroundPic: string
  mainBackgroundColor: number
  mainDuration: number
  cameraFov: number
  panoramaPic: string
  panoX: number
  panoY: number
  panoZ: number
  panoRadius: number
  objects: []
}

export type TextParams = {
  font?: Font
  size: number
  height: number
  curveSegments: number
  bevelThickness: number
  bevelSize: number
  bevelEnabled: boolean
  bevelSegments: number
}

export type HotSpot = {
  x: number
  y: number
  z: number
  radius: number
  phi: number
  theta: number
  size: number
}

export type SVG = {
  url: string
  x: number
  y: number
  z: number
  scale: number
}

export type Slide = {
  width: number
  height: number
  picture: string
  hotspot: HotSpot
  texture: THREE.Texture
  background: THREE.Mesh
  position: THREE.Vector3
  transitionDuration: number
  scale: number
  cameraPosition: THREE.Vector3
  cameraLookAt: THREE.Vector3
  distanceToCamera: number
  objects: any[]
  videoHtmlElement?: HTMLVideoElement
}

export enum WorldMode {
  'show',
  'editor',
}

export enum WorldCoordinatesType {
  'vector',
  'sphere',
}

export type World = {
  type: WorldCoordinatesType
  scene: THREE.Scene
  renderer: THREE.Renderer
  camera: THREE.PerspectiveCamera
  orbitControl: OrbitControls
  width: number
  height: number
  slides: Slide[]
  objects: []
  steps: []
  cameraFov: number
  mainSlideDuration: number
  mainBackgroundColor: number
  mainBackgroundPic: string
  panoramaPic: string
  panoCenter: Vector3
  panoRadius: number
  mode: WorldMode
  draggables: any[]
}

export enum UserAction {
  'navigate',
  'mode',
}

export enum MouseEvents {
  'mousedown',
  'mouseup',
  'click',
  'dblclick',
  'mousemove',
  'mouseover',
  'mousewheel',
  'mouseout',
  'contextmenu',
}

export enum KeyboardEvents {
  'keydown',
  'keypress',
  'keyup',
}

export enum TouchEvents {
  'touchstart',
  'touchmove',
  'touchend',
  'touchenter',
  'touchleave',
}
