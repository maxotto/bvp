import * as THREE from "three";
import { Vector3, SphereGeometry, MeshStandardMaterial, Mesh, Color, DoubleSide } from "three";


/**
 * https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
 */
export function findGetParameters() { //
  const queryDict = {}
  location.search.substr(1).split("&").forEach(function (item) { queryDict[item.split("=")[0]] = item.split("=")[1] })
  return queryDict;
}

export function promisifyLoader(loader, onProgress) {
  function promiseLoader(url, allowSkip = false) {
    return new Promise((resolve, reject) => {
      loader.load(
        url,
        resolve,
        onProgress,
        reject
      );
    });
  }
  return {
    originalLoader: loader,
    load: promiseLoader,
  };
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
      return fn(item, context);
    });
  }, Promise.resolve());
}


export function calculateJump(pointA, pointB) {
  let jumpBySize = Math.min(pointA.width, pointB.width) / 2.5;
  let jumpByZ = 0;
  if (pointA.cameraPosition.z <= pointB.cameraPosition.z) {
    jumpByZ = pointB.width / 1.5;
  }
  return Math.max(jumpBySize, jumpByZ);
}

export function getPointsByCurve(curveFunctionName, ...curveFunctionArgs) {
  let pointsNum = curveFunctionArgs.pop();
  let line: any = new (THREE)[curveFunctionName](...curveFunctionArgs);
  var points = line.getPoints(pointsNum);
  return points;
}

export function getGroupGeometry(mesh: THREE.Group) {
  var center = new THREE.Vector3();
  var size = new THREE.Vector3();
  const box = new THREE.Box3();
  mesh.traverse((child) => {
    var bb = new THREE.Box3().setFromObject(child);
    if (bb.max.x < Infinity) {
      box.union(bb);
    }
  });
  box.getCenter(center);
  box.getSize(size)
  var topLeftCorner = new THREE.Vector3(center.x - size.x / 2, -1 * (center.y + size.y / 2), 0);
  var delta = new THREE.Vector3(
    mesh.position.x - (center.x),
    mesh.position.y - (center.y),
    mesh.position.z - (center.z),
  );
  return {
    box: box,
    size: size,
    center: center,
    topLeftCorner: topLeftCorner,
    delta: delta,
    parentSlide: null
  }
}

export function getCameraState(center: Vector3, objectHeight: number, iniZ: number, cameraFov: number) {
  // TODO https://stackoverflow.com/questions/28123164/position-camera-relative-to-plane
  const cameraPosition = new THREE.Vector3(
    center.x,
    center.y,
    objectHeight / 2 / Math.tan(cameraFov / 2 * Math.PI / 180) + iniZ
  );
  const cameraLookAt = new THREE.Vector3(
    center.x,
    center.y,
    0
  );
  return {
    cameraPosition: cameraPosition,
    cameraLookAt: cameraLookAt
  }

}
export function createSphere(position, size, color: Color, params, texture?) {
  const g = new SphereGeometry(size, 32, 32);
  const maretialConf = { color: color }
  if (texture) {
    maretialConf['map'] = texture;
    maretialConf['side'] = DoubleSide;
  }
  const material = new MeshStandardMaterial(maretialConf);
  const sphere = new Mesh(g, material);
  sphere.userData.params = params;
  sphere.name = params.type + '_' + params.point;
  sphere.position.x = position.x;
  sphere.position.y = position.y;
  sphere.position.z = position.z;
  return sphere;
}