import * as THREE from "three";

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


export function calculateJump(pointA, pointB){
  let jumpBySize = Math.min(pointA.width, pointB.width)/2.5;
  let jumpByZ = 0;
  if(pointA.cameraPosition.z <= pointB.cameraPosition.z){
      jumpByZ = pointB.width/1.5;
  } 
  return Math.max(jumpBySize, jumpByZ);
}

export function getPointsByCurve(curveFunctionName, ...curveFunctionArgs) {
  let pointsNum = curveFunctionArgs.pop();
  let line: any = new (THREE)[curveFunctionName](...curveFunctionArgs);
  var points = line.getPoints(pointsNum);
  return points;
}
