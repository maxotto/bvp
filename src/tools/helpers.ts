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
