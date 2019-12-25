import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader'
import { XmlLoader } from './XmlLoader'
import {
  promisifyLoader,
  forEachPromise,
  getGroupGeometry,
  getCameraState,
  createSphere,
  recalcFromSpherical,
} from './helpers'
import * as THREE from 'three'

import {
  ScenarioData,
  Slide,
  World,
  SVG,
  HotSpot,
  WorldCoordinatesType,
} from '../types'
import { EditableGroup } from '../core/EditableGroup'
import { showSphere } from '../SlideEditor'
import {
  Mesh,
  Vector3,
  Color,
  WireframeGeometry,
  BoxGeometry,
  LineSegments,
} from 'three'

export class WorldLoader {
  private _scenarioFolder: string
  private _width: number
  private _height: number
  private _outSlides: Slide[] = []
  private _steps: []
  private _mainSlideDuration: number
  private _mainBackgroundColor: number
  private _mainBackgroundPic: string
  private _panoramaPic: string
  private _panoX: number
  private _panoY: number
  private _panoZ: number
  private _panoRadius: number
  private _panoCenter: Vector3
  private _cameraFov: number
  private _currentObjectName

  constructor(scenarioFolder: string) {
    this._scenarioFolder = scenarioFolder + '/'
  }
  public load() {
    const scope = this
    var manager = new THREE.LoadingManager()
    var slideNumber = 0
    manager.onProgress = function(item, loaded, total) {}

    manager.onLoad = function() {}

    var onProgress = function(xhr) {
      if (xhr.lengthComputable) {
      }
    }
    return promisifyLoader(new XmlLoader(manager), onProgress)
      .load('assets/' + this._scenarioFolder + 'scenario.xml')
      .then((scenarioData: ScenarioData) => {
        this._width = +scenarioData.width
        this._height = +scenarioData.height
        this._steps = scenarioData.steps
        this._mainBackgroundColor = scenarioData.mainBackgroundColor
        this._mainBackgroundPic = scenarioData.mainBackgroundPic
        this._panoramaPic = scenarioData.panoramaPic
        this._panoX = +scenarioData.panoX
        this._panoY = +scenarioData.panoY
        this._panoZ = +scenarioData.panoZ
        this._panoRadius = +scenarioData.panoRadius
        this._mainSlideDuration = +scenarioData.mainDuration
        this._cameraFov = +scenarioData.cameraFov
        this._currentObjectName = scenarioData.mainBackgroundPic
        this._panoCenter = new Vector3(this._panoX, this._panoY, this._panoZ)
        return promisifyLoader(new THREE.TextureLoader(manager), onProgress)
          .load('assets/' + this._scenarioFolder + this._currentObjectName)
          .then((_texturePainting: THREE.Texture) => {
            var materialPainting = new THREE.MeshBasicMaterial(<
              THREE.MeshBasicMaterialParameters
            >{
              color: 0xffffff,
              map: _texturePainting,
              side: THREE.DoubleSide,
            })

            var geometry = new THREE.PlaneBufferGeometry(0.001, 0.001)
            var mesh = new THREE.Mesh(geometry, materialPainting)
            mesh.name = 'slide0Bg'
            const cameraState = getCameraState(
              new THREE.Vector3(0, 0, 0),
              12000,
              0,
              this._cameraFov
            )
            const newSlide = <Slide>{
              width: this._width,
              height: this._height,
              background: mesh,
              texture: _texturePainting,
              hotspot: null,
              picture: this._currentObjectName,
              position: new THREE.Vector3(
                -this._width / 2,
                this._height / 2,
                0
              ),
              objects: <any>scenarioData.objects,
              transitionDuration: +scenarioData.mainDuration,
              scale: 1,
              cameraPosition: cameraState.cameraPosition,
              distanceToCamera: cameraState.distance,
              cameraLookAt: cameraState.cameraLookAt,
            }
            newSlide.objects = []
            let p
            if (scenarioData.objects) {
              p = forEachPromise(
                scenarioData.objects,
                (object, context) => {
                  if (object.type == 'svg') {
                    this._currentObjectName = object['url']
                    var svgUrl =
                      'assets/' +
                      context._scenarioFolder +
                      this._currentObjectName
                    return promisifyLoader(new SVGLoader(manager), onProgress)
                      .load(svgUrl)
                      .then(svgData => {
                        const mesh = loadSVG(
                          svgData,
                          -this._width / 2 + +object['x'],
                          this._height / 2 + -object['y'],
                          +object['z'],
                          +object['scale']
                        )
                        newSlide.objects.push(mesh)
                      })
                  }
                },
                this
              )
            } else {
              p = Promise.resolve(true)
            }
            return p.then(() => {
              this._outSlides.push(newSlide)
            })
          })
          .then(a => {
            return forEachPromise(
              scenarioData.slides,
              (slide, context) => {
                ++slideNumber
                this._currentObjectName = slide.picture
                return promisifyLoader(
                  new THREE.TextureLoader(manager),
                  onProgress
                )
                  .load(
                    'assets/' + this._scenarioFolder + this._currentObjectName
                  )
                  .then((_texturePainting: THREE.Texture) => {
                    var materialPainting = new THREE.MeshBasicMaterial(<
                      THREE.MeshBasicMaterialParameters
                    >{
                      color: 0xffffff,
                      map: _texturePainting,
                      side: THREE.DoubleSide,
                      transparent: true,
                    })
                    if (
                      this.getWorldCoordinatesType() ==
                      WorldCoordinatesType.sphere
                    ) {
                      if (
                        slide.hotspot.radius &&
                        slide.hotspot.phi &&
                        slide.hotspot.theta
                      ) {
                        const panoCenter = new Vector3(
                          this._panoX,
                          this._panoY,
                          this._panoZ
                        )
                        const newCoords = this.recalcFromSpherical(
                          slide,
                          panoCenter,
                          context
                        )
                        slide.hotspot.x = newCoords.x
                        slide.hotspot.y = newCoords.y
                        slide.hotspot.z = newCoords.z
                      }
                    }
                    var scale = slide.width / slide.hotspot.size
                    var geometry = new THREE.PlaneBufferGeometry(
                      slide.hotspot.size,
                      slide.height / scale
                    )
                    var mesh = new THREE.Mesh(geometry, materialPainting)
                    mesh.name = 'slide' + slideNumber + 'bg'
                    var topLeft = {
                      x: -context._width / 2 + +slide.hotspot.x,
                      y: context._height / 2 - +slide.hotspot.y,
                    }
                    var center = new Vector3(
                      topLeft.x + slide.width / 2 / scale,
                      topLeft.y - slide.height / 2 / scale,
                      +slide.hotspot.z
                    )
                    const cameraState = getCameraState(
                      center,
                      slide.height / scale,
                      +slide.hotspot.z,
                      context._cameraFov
                    )
                    const newSlide = <Slide>{
                      width: slide.width / scale,
                      height: slide.height / scale,
                      background: mesh,
                      picture: this._currentObjectName,
                      hotspot: slide.hotspot,
                      objects: [],
                      position: new THREE.Vector3(
                        topLeft.x,
                        topLeft.y,
                        +slide.hotspot.z
                      ),
                      transitionDuration: +slide.animation.duration,
                      scale: scale,
                      distanceToCamera: cameraState.distance,
                      cameraPosition: cameraState.cameraPosition,
                      cameraLookAt: cameraState.cameraLookAt,
                    }
                    newSlide.objects = []
                    let p
                    if (slide.objects) {
                      p = forEachPromise(
                        slide.objects,
                        (svg, context) => {
                          this._currentObjectName = svg['url']
                          var svgUrl =
                            'assets/' +
                            context._scenarioFolder +
                            this._currentObjectName
                          return promisifyLoader(
                            new SVGLoader(manager),
                            onProgress
                          )
                            .load(svgUrl)
                            .then(svgData => {
                              const z = +slide.hotspot.z + +svg['z']
                              const mesh = loadSVG(
                                svgData,
                                +svg['x'] - newSlide.width / 2,
                                -svg['y'] + newSlide.height / 2,
                                z,
                                +svg['scale'] / scale,
                                slideNumber
                              )
                              newSlide.objects.push(mesh)
                            })
                        },
                        this
                      )
                    } else {
                      p = Promise.resolve()
                    }
                    return p.then(() => {
                      this._outSlides.push(newSlide)
                    })
                  })
              },
              this
            )
          })
          .then(a => {
            return Promise.resolve()
          })
      })
      .then(() => {
        return Promise.resolve(<World>{
          type: this.getWorldCoordinatesType(),
          width: this._width,
          height: this._height,
          slides: this._outSlides,
          steps: this._steps,
          cameraFov: this._cameraFov,
          mainSlideDuration: this._mainSlideDuration,
          mainBackgroundColor: this._mainBackgroundColor,
          panoramaPic: 'assets/' + this._scenarioFolder + this._panoramaPic,
          panoCenter: this._panoCenter,
          panoRadius: this._panoRadius,
          draggables: [],
        })
      })
      .catch(e => {
        console.log(e)
      })

    function loadSVG(data, x, y, z, scale, parentSlide = 0) {
      // TODO make this part alive againg
      var paths = data.paths
      var group = new THREE.Group()
      group.position.x = 0
      group.position.y = 0
      group.position.z = 0
      group.scale.y *= -1
      group.renderOrder = z
      for (var i = 0; i < paths.length; i++) {
        var path = paths[i]
        var fillColor = path.userData.style.fill
        if (fillColor !== undefined && fillColor !== 'none') {
          var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setStyle(fillColor),
            opacity: path.userData.style.fillOpacity,
            transparent: path.userData.style.fillOpacity < 1,
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: false,
          })
          var shapes = path.toShapes(true)
          for (var j = 0; j < shapes.length; j++) {
            var shape = shapes[j]
            var geometry = new THREE.ShapeBufferGeometry(shape)
            var mesh = new THREE.Mesh(geometry, material)
            mesh.renderOrder = z
            group.add(mesh)
          }
        }
        var strokeColor = path.userData.style.stroke
        if (strokeColor !== undefined && strokeColor !== 'none') {
          var material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setStyle(strokeColor),
            opacity: path.userData.style.strokeOpacity,
            transparent: path.userData.style.strokeOpacity < 1,
            side: THREE.DoubleSide,
            depthWrite: false,
            wireframe: false,
          })
          for (var j = 0, jl = path.subPaths.length; j < jl; j++) {
            var subPath = path.subPaths[j]
            var geometry = SVGLoader.pointsToStroke(
              subPath.getPoints(),
              path.userData.style,
              20,
              1
            )
            if (geometry) {
              var mesh = new THREE.Mesh(geometry, material)
              mesh.renderOrder = z
              group.add(mesh)
            }
          }
        }
      }
      group.scale.multiplyScalar(scale)
      // group.geometry.getCenter();
      let _groupGeometry = getGroupGeometry(group)
      let box = _groupGeometry.box
      var wireframe = new WireframeGeometry(
        new BoxGeometry(
          box.max.x - box.min.x,
          box.max.y - box.min.y,
          box.max.z - box.min.z
        )
      )
      console.log(group)
      wireframe.scale(1 / scale, 1 / scale, 1 / scale)
      let _selectFrame = new LineSegments(wireframe)
      _selectFrame.position.x = 0
      _selectFrame.position.y = 0
      _selectFrame.position.z = 50
      group.add(_selectFrame)
      return group
      //this._selectFrame.position.add(gg.center);
      //group.position.x -= _groupGeometry.size.x / 2 + _groupGeometry.topLeftCorner.x;
      //group.position.y += _groupGeometry.size.y / 2 - _groupGeometry.topLeftCorner.y;
      //group.position.z += _groupGeometry.size.z / 2;
      const s = createSphere(group.position, 20, new Color(0x990000), {
        type: 'centralPoint',
        point: 'center',
      })
      // var box = new THREE.BoxHelper(group, new Color(0x990000));
      // group.add(s);
      // group.add(box);
      //return group;
      _groupGeometry.parentSlide = parentSlide
      _groupGeometry.delta.z = 0
      let eg = new EditableGroup()
      eg.name = 'group_s' + parentSlide + '_o_' + scope._currentObjectName
      eg.userData = _groupGeometry

      // eg.position.copy(new Vector3(x, y, z)).add(_groupGeometry.center).sub(_groupGeometry.topLeftCorner);

      eg.renderOrder = z // to prevent strange overlap
      eg.add(group)
      // _groupGeometry = getGroupGeometry(eg);

      /// console.log(_groupGeometry);
      const bg = createBackGround(_groupGeometry.size.x, _groupGeometry.size.y)
      bg.position.add(_groupGeometry.topLeftCorner)
      group.add(bg)
      group.scale.multiplyScalar(scale)
      eg.position.x = x
      eg.position.y = y
      eg.position.z = z
      eg.position.add(
        new Vector3(
          -_groupGeometry.topLeftCorner.x * scale,
          _groupGeometry.topLeftCorner.y * scale,
          0
        )
      )
      return eg
    }

    function createBackGround(x, y) {
      var shape = new THREE.Shape()
      shape.moveTo(0, 0)
      shape.lineTo(x, 0)
      shape.lineTo(x, y)
      shape.lineTo(0, y)
      shape.lineTo(0, 0)
      var geometry = new THREE.ShapeBufferGeometry(shape)
      var material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(0xea177c),
        opacity: 0.5,
        transparent: true,
        depthWrite: false,
        wireframe: false,
      })
      const mesh = new THREE.Mesh(geometry, material)
      return mesh
    }
  }

  private getWorldCoordinatesType() {
    let result = WorldCoordinatesType.vector
    if (this._panoCenter && this._panoRadius && this._panoramaPic) {
      result = WorldCoordinatesType.sphere
    }
    return result
  }

  private recalcFromSpherical(slide: Slide, panoCenter, context) {
    const pos = recalcFromSpherical(
      slide.hotspot.radius,
      slide.hotspot.phi,
      slide.hotspot.theta,
      panoCenter,
      context._width,
      context._height
    )
    // do correction to center
    return pos.sub(
      new Vector3(
        slide.hotspot.size / 2,
        (slide.hotspot.size / 2 / slide.height) * slide.width,
        0
      )
    )
  }
}
