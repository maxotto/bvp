import * as THREE from "three";
import { getWorldFromXml } from './WorldTools';

var XmlLoader = function (manager = null) {
  this.manager = manager !== null ? manager : THREE.DefaultLoadingManager;
};

XmlLoader.prototype = {
  constructor: XmlLoader,

  load: function (url, onLoad, onProgress, onError) {
    var scope = this;

    var loader = new THREE.FileLoader(scope.manager);
    loader.setPath(scope.path);
    loader.load(
      url,
      function (text) {
        onLoad(getWorldFromXml(text));
      },
      function (u) {
        // console.log({ u });
      },
      function (e) {
        // console.log({ e });
      }
    );
  },
};

export { XmlLoader };
