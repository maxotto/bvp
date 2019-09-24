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
    background: THREE.Mesh,
    position: THREE.Vector3,
    transitionDuration: number,
    scale: number,
    cameraPosition: THREE.Vector3,
    cameraLookAt: THREE.Vector3,
    objects: any[]
}