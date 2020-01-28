import * as THREE from 'three'
import { Slide } from '../types'
import { Scene, WebGLRenderer, PerspectiveCamera, PointLight } from 'three'

export function createMaterial(materialClass, params) {
  if (!materialClass) materialClass = 'MeshToonMaterial'
  return new THREE[materialClass](params)
}

export function getPointsByCurve(curveFunctionName, ...curveFunctionArgs) {
  let pointsNum = curveFunctionArgs.pop()
  let line: any = new THREE[curveFunctionName](...curveFunctionArgs)
  var points = line.getPoints(pointsNum)
  return points
}

let count = 0
export function createSnapshot(slide: Slide) {
  count++
  const fov = 45
  const size = 150
  let renderer, scene, camera, mesh
  // const overlay = <HTMLDivElement>document.getElementById('overlayInner')
  renderer = new WebGLRenderer({
    antialias: true,
    //preserveDrawingBuffer: true
  })
  renderer.setSize(size, (size / slide.width) * slide.height)
  // overlay.appendChild(renderer.domElement)

  camera = new PerspectiveCamera(fov, slide.width / slide.height, 1, 1000)
  scene = new Scene()
  let light = new PointLight('#ffffff', 1)
  light.position.set(0, 0, 1500)
  scene.add(light)
  if (slide.background) scene.add(slide.background)
  slide.objects.forEach(element => {
    scene.add(element)
  })
  camera.position.z = slide.distanceToCamera
  renderer.render(scene, camera)

  const pic = renderer.domElement.toDataURL()
  renderer = null
  scene = null
  camera = null
  light = null
  return pic
}
