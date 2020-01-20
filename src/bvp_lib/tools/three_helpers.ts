import * as THREE from 'three'

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
