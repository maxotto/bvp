import * as THREE from "three";
import { Mesh } from "three";

export function promisifyLoader(loader, onProgress) {
  function promiseLoader(url) {
    return new Promise((resolve, reject) => {
      loader.load(url, resolve, onProgress, reject);
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
  var boundingBox = new THREE.Box3().setFromObject(mesh);
  boundingBox.getCenter(center);
  boundingBox.getSize(size)
  var topLeftCorner = new THREE.Vector3(center.x - size.x / 2, center.y + size.y / 2, center.z - size.z / 2);
  var delta = new THREE.Vector3(
    mesh.position.x - (center.x - size.x / 2),
    mesh.position.y - (center.y + size.y / 2),
    mesh.position.z - (center.y + size.z / 2),
  );
  return {
    size: {
      x: size.x,
      y: size.y,
      z: size.z,
    },
    center: center,
    topLeftCorner: topLeftCorner,
    delta: delta,
    parentSlide: null
  }
}

export function getCameraState(center, objectHeight, iniZ, cameraFov) {
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