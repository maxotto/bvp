import { getWorldFromXml } from './WorldTools'
import { DefaultLoadingManager, FileLoader } from 'three'
// TODO refactor this into TS class
var XmlLoader = function(manager = null) {
  this.manager = manager !== null ? manager : DefaultLoadingManager
}

XmlLoader.prototype = {
  constructor: XmlLoader,

  load: function(url, onLoad, onProgress, onError) {
    var scope = this

    var loader = new FileLoader(scope.manager)
    loader.setPath(scope.path)
    loader.load(
      url,
      function(text) {
        onLoad(getWorldFromXml(text))
      },
      onProgress,
      loadObject => {
        onError(loadObject.target)
      }
    )
  },
}

export { XmlLoader }
