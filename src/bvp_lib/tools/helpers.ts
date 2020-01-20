import {
  Vector3,
  SphereGeometry,
  MeshStandardMaterial,
  Mesh,
  Color,
  DoubleSide,
  Spherical,
  Box3,
  Group,
  Math as M,
} from 'three'
import { Slide, World } from '../types'
import { EditableGroup } from '../core/EditableGroup'

export function justifyText(str, len, mode?) {
  const re = RegExp('(?:\\s|^)(.{1,' + len + '})(?=\\s|$)', 'g')
  const res = []
  const finalResult = []
  let m
  while ((m = re.exec(str)) !== null) {
    res.push(m[1])
  }
  if (!mode) mode = 'width'
  switch (mode) {
    case 'width':
      for (let i = 0; i < res.length - 1; i++) {
        if (res[i].indexOf(' ') != -1) {
          while (res[i].length < len) {
            for (let j = 0; j < res[i].length - 1; j++) {
              if (res[i][j] == ' ') {
                res[i] = res[i].substring(0, j) + ' ' + res[i].substring(j)
                if (res[i].length == len) break
                while (res[i][j] == ' ') j++
              }
            }
          }
        }
        finalResult.push(res[i])
      }
      finalResult.push(res[res.length - 1])
      return finalResult.join('\n')
    case 'left':
      return res.join('\n')
  }
}

export function calcCameraPosition(
  world: World,
  slide: Slide,
  slideGroup: EditableGroup
) {
  const newCameraPos = slideGroup.position.clone()
  const objectWorldPosition = new Vector3()
  objectWorldPosition.setFromMatrixPosition(slide.background.matrixWorld)
  const directionVector = objectWorldPosition.sub(world.panoCenter) //Get vector from object to panorama center
  const unitDirectionVector = directionVector.normalize() // Convert to unit vector
  newCameraPos.sub(unitDirectionVector.multiplyScalar(slide.distanceToCamera)) //Multiply unit vector times cameraZ distance
  return newCameraPos
}

export function recalcToSpherical(slide: Slide, panoCenter: Vector3) {
  const coordsFromPanoCenter = new Vector3()
    .copy(panoCenter)
    .sub(slide.cameraLookAt)
  const sphereCoordinates = new Spherical().setFromVector3(coordsFromPanoCenter)

  return {
    radius: sphereCoordinates.radius,
    phi: M.radToDeg(sphereCoordinates.phi) - 90,
    theta: M.radToDeg(sphereCoordinates.theta),
  }
}

export function recalcFromSpherical(
  radius,
  phi,
  theta,
  panoCenter,
  worldWidth,
  worldHeight
) {
  const _phi = M.degToRad(-90 - phi)
  const _theta = M.degToRad(0 - theta)
  let tmp = new Vector3().setFromSphericalCoords(radius, _phi, _theta)
  const newCoords = new Vector3(tmp.x, tmp.y, tmp.z)
    .add(panoCenter)
    .add(new Vector3(worldWidth / 2, worldHeight / 2, 0))
  return newCoords
}

/**
 * https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
 */
export function findGetParameters() {
  //
  const queryDict = {}
  location.search
    .substr(1)
    .split('&')
    .forEach(function (item) {
      queryDict[item.split('=')[0]] = item.split('=')[1]
    })
  return queryDict
}

export function promisifyLoader(loader, onProgress) {
  function promiseLoader(url, allowSkip = false) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, onProgress, reject)
    })
  }
  return {
    originalLoader: loader,
    load: promiseLoader,
  }
}

/**
 *
 * @param items An array of items.
 * @param fn A function that accepts an item from the array and returns a promise.
 * @returns {Promise}
 * based on https://stackoverflow.com/questions/31413749/node-js-promise-all-and-foreach/41791149#41791149
 */
export function forEachPromise(items, fn, context) {
  return items.reduce(function (promise, item) {
    return promise.then(function () {
      return fn(item, context)
    })
  }, Promise.resolve())
}

export function calculateJump(pointA, pointB) {
  let jumpBySize = Math.min(pointA.width, pointB.width) / 1.5
  let jumpByZ = 0
  if (pointA.cameraPosition.z <= pointB.cameraPosition.z) {
    jumpByZ = pointB.width / 1.5
  }
  return Math.max(jumpBySize, jumpByZ)
}

export function getGroupGeometry(mesh: Group) {
  var center = new Vector3()
  var size = new Vector3()
  const box = new Box3()
  mesh.traverse(child => {
    var bb = new Box3().setFromObject(child)
    if (bb.max.x < Infinity) {
      box.union(bb)
    }
  })
  box.getCenter(center)
  box.getSize(size)
  var topLeftCorner = new Vector3(
    center.x - size.x / 2,
    -1 * (center.y + size.y / 2),
    0
  )
  var delta = new Vector3(
    mesh.position.x - center.x,
    mesh.position.y - center.y,
    mesh.position.z - center.z
  )
  return {
    box: box,
    size: size,
    center: center,
    topLeftCorner: topLeftCorner,
    delta: delta,
    parentSlide: null,
  }
}

export function getCameraState(
  center: Vector3,
  objectHeight: number,
  iniZ: number,
  cameraFov: number
) {
  const distance =
    objectHeight / 2 / Math.tan(((cameraFov / 2) * Math.PI) / 180)
  const cameraPosition = new Vector3(center.x, center.y, distance + iniZ)
  const cameraLookAt = new Vector3(center.x, center.y, 0)
  return {
    distance: distance,
    cameraPosition: cameraPosition,
    cameraLookAt: cameraLookAt,
  }
}
export function createSphere(position, size, color: Color, params, texture?) {
  const g = new SphereGeometry(size, 32, 32)
  const maretialConf = { color: color }
  if (texture) {
    maretialConf['map'] = texture
    maretialConf['side'] = DoubleSide
  }
  const material = new MeshStandardMaterial(maretialConf)
  const sphere = new Mesh(g, material)
  sphere.userData.params = params
  sphere.name = params.type + '_' + params.point
  sphere.position.x = position.x
  sphere.position.y = position.y
  sphere.position.z = position.z
  return sphere
}
