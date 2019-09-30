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
    svg: [],
}

export type Slide = {
    width: number,
    height: number,
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
    steps: [],
    cameraFov: number,
    mainSlideDuration: number,
    mainBackgroundColor: number,
    mode: WorldMode,
    draggables: Mesh[]
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