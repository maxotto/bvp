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
    width: number,
    height: number,
    slides: Slide[],
    steps: [],
    cameraFov: number,
    mainSlideDuration: number,
    mainBackgroundColor: number,
    mode: WorldMode
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