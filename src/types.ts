import { Mesh } from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

export type ScenarioData = {
    width: number,
    height: number,
    slides: [],
    steps: [],
    mainBackgroundPic: string,
    mainBackgroundColor: number,
    mainDuration: number,
    cameraFov: number,
    panoramaPic: string,
    objects: [],
}

export type HotSpot = {
    x: number,
    y: number,
    z: number,
    size: number
}

export type SVG = {
    url: string,
    x: number,
    y: number,
    z: number,
    scale: number,
}

export type Slide = {
    width: number,
    height: number,
    picture: string,
    hotspot: HotSpot,
    texture: THREE.Texture,
    background: THREE.Mesh,
    position: THREE.Vector3,
    transitionDuration: number,
    scale: number,
    cameraPosition: THREE.Vector3,
    cameraLookAt: THREE.Vector3,
    objects: any[]
}

export enum WorldMode {
    'show',
    'editor'
}

export type World = {
    scene: THREE.Scene,
    renderer: THREE.Renderer,
    camera: THREE.PerspectiveCamera,
    orbitControl: OrbitControls,
    width: number,
    height: number,
    slides: Slide[],
    objects: [],
    steps: [],
    cameraFov: number,
    mainSlideDuration: number,
    mainBackgroundColor: number,
    mainBackgroundPic: string,
    panoramaPic: string,
    mode: WorldMode,
    draggables: any[]
}

export enum UserAction {
    'navigate',
    'mode'
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
    'contextmenu'
}

export enum KeyboardEvents {
    'keydown',
    'keypress',
    'keyup'
}

export enum TouchEvents {
    'touchstart',
    'touchmove',
    'touchend',
    'touchenter',
    'touchleave'
}