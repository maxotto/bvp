import * as THREE from "three";

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
        onLoad(scope.parse(text));
      },
      function (u) {
        // console.log({ u });
      },
      function (e) {
        // console.log({ e });
      }
    );
  },
  parse: function (text) {
    function parseNode(node) {
      if (node.nodeType !== 1) return;
      switch (node.nodeName) {
        case "world":
          for (var prop in node.attributes) {
            if (node.attributes.hasOwnProperty(prop)) {
              var propName = node.attributes[prop].name;
              var propValue = node.attributes[prop].value;
              world[propName] = propValue;
            }
          }
          break;
        case "step": 
          if(node.parentNode.nodeName == 'show'){
            if (!world.hasOwnProperty("steps")) {
              world["steps"] = [];
            }
            let newStep = {};
            for (var prop in node.attributes) {
              if (node.attributes.hasOwnProperty(prop)) {
                var propName = node.attributes[prop].name;
                var propValue = node.attributes[prop].value;
                newStep[propName] = propValue;
              }
            }
            world['steps'].push(newStep);
          }
          break;  
        case "svg":
          
          let newSvg = {};
//               console.log(node.parentNode.nodeName)
          for (var prop in node.attributes) {
            if (node.attributes.hasOwnProperty(prop)) {
              var propName = node.attributes[prop].name;
              var propValue = node.attributes[prop].value;
              newSvg[propName] = propValue;
            }
          }
          if(node.parentNode.nodeName == 'world'){
            if (!world.hasOwnProperty("svg")) {
              world["svg"] = [];
            }
            world['svg'].push(newSvg);
          } else if(node.parentNode.nodeName == 'slide'){
            const lastSlideIndex = world["slides"].length -1;
            if (!world["slides"][lastSlideIndex].hasOwnProperty("svg")) {
              world["slides"][lastSlideIndex]['svg'] = [];
            }
            world["slides"][lastSlideIndex]['svg'].push(newSvg);
          }
              break;
        case "slide":
          if (!world.hasOwnProperty("slides")) {
            world["slides"] = [];
          }
          let newSlide = {};
          for (var prop in node.attributes) {
            if (node.attributes.hasOwnProperty(prop)) {
              var propName = node.attributes[prop].name;
              var propValue = node.attributes[prop].value;
              newSlide[propName] = propValue;
            }
          }
          world['slides'].push(newSlide);
          break;
        case 'hotspot':
          world['slides'][world['slides'].length - 1]['hotspot'] = {};
          for (var prop in node.attributes) {
            if (node.attributes.hasOwnProperty(prop)) {
              var propName = node.attributes[prop].name;
              var propValue = node.attributes[prop].value;
              world['slides'][world['slides'].length - 1]['hotspot'][propName] = propValue;
            }
          }
          break;
        case 'animation':
          world['slides'][world['slides'].length - 1]['animation'] = {};
          for (var prop in node.attributes) {
            if (node.attributes.hasOwnProperty(prop)) {
              var propName = node.attributes[prop].name;
              var propValue = node.attributes[prop].value;
              world['slides'][world['slides'].length - 1]['animation'][propName] = propValue;
            }
          }
          break;
      }

      var nodes = node.childNodes;
      //

      for (var i = 0; i < nodes.length; i++) {
        parseNode(nodes[i]);
      }
    }

    var xml = new DOMParser().parseFromString(text, "text/xml"); // application/xml

    let world: any = {};

    parseNode(xml.documentElement);

    return world;
  }
};

export { XmlLoader };
