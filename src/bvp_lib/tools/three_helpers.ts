import * as THREE from 'three'
import { World } from '../types'

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

export function createSnapshot(world: World, slideNumber: number) {
  return 'Snapshot' + slideNumber
}