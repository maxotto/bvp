import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { XmlLoader } from "./XmlLoader";
import { promisifyLoader, forEachPromise, getGroupGeometry, getCameraState } from './helpers';
import * as THREE from "three";

import { ScenarioData, Slide, World, SVG, HotSpot } from "../types";
import { EditableGroup } from '../core/EditableGroup';
import { showSphere } from '../SlideEditor';

export class WorldLoader {
    private _scenarioFolder: string;
    private _width: number;
    private _height: number;
    private _outSlides: Slide[] = [];
    private _steps: [];
    private _mainSlideDuration: number;
    private _mainBackgroundColor: number;
    private _mainBackgroundPic: string;
    private _cameraFov = 45;
    private _currentObjectName;

    constructor(scenarioFolder: string) {
        this._scenarioFolder = scenarioFolder;
    }
    public load() {
        const scope = this;
        var manager = new THREE.LoadingManager();
        var slideNumber = 0;
        manager.onProgress = function (item, loaded, total) {
            // console.log(item, loaded, total);
        };

        manager.onLoad = function () {
            // console.log('Resources are loaded! Lets start animation!')
        }

        var onProgress = function (xhr) {
            if (xhr.lengthComputable) {
                // var percentComplete = xhr.loaded / xhr.total * 100;
                // console.log(Math.round(percentComplete) + '% downloaded');
            }
        };
        return promisifyLoader(new XmlLoader(manager), onProgress)
            .load('assets/' + this._scenarioFolder + 'scenario.xml')
            .then((scenarioData: ScenarioData) => {
                this._width = +scenarioData.width;
                this._height = +scenarioData.height;
                this._steps = scenarioData.steps;
                this._mainBackgroundColor = scenarioData.mainBackgroundColor;
                this._mainBackgroundPic = scenarioData.mainBackgroundPic;
                this._mainSlideDuration = +scenarioData.mainDuration;
                this._cameraFov = +scenarioData.cameraFov;
                this._currentObjectName = scenarioData.mainBackgroundPic
                return promisifyLoader(new THREE.TextureLoader(manager), onProgress)
                    .load('assets/' + this._scenarioFolder + this._currentObjectName)
                    .then((_texturePainting: THREE.Texture) => {
                        var materialPainting = new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>{
                            color: 0xffffff,
                            map: _texturePainting,
                            side: THREE.DoubleSide
                        });

                        var geometry = new THREE.PlaneBufferGeometry(this._width, this._height);
                        var mesh = new THREE.Mesh(geometry, materialPainting);
                        mesh.name = 'slide0Bg';
                        const cameraState = getCameraState(new THREE.Vector3(0, 0, 0), scenarioData.height, 0, this._cameraFov);
                        const newSlide = <Slide>{
                            width: this._width,
                            height: this._height,
                            background: mesh,
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
                            cameraLookAt: cameraState.cameraLookAt
                        }
                        // mesh.position.x = 0;
                        // mesh.position.y = 0;
                        // mesh.position.z = 0;
                        newSlide.objects = [];
                        let p;
                        if (scenarioData.objects) {
                            p = forEachPromise(scenarioData.objects, (object, context) => {
                                if (object.type == 'svg') {
                                    this._currentObjectName = object['url'];
                                    var svgUrl = 'assets/' + context._scenarioFolder + this._currentObjectName;
                                    return promisifyLoader(new SVGLoader(manager), onProgress)
                                        .load(svgUrl)
                                        .then((svgData) => {
                                            const mesh = loadSVG(
                                                svgData,
                                                -this._width / 2 + (+object['x']),
                                                this._height / 2 + (-object['y']),
                                                +object['z'], +object['scale']
                                            );
                                            newSlide.objects.push(mesh);
                                        });
                                }
                            }, this);
                        } else {
                            p = Promise.resolve(true);
                        }
                        return p.then(() => { this._outSlides.push(newSlide); })
                    }).then((a) => {
                        return forEachPromise(scenarioData.slides, (slide, context) => {
                            ++slideNumber;
                            this._currentObjectName = slide.picture
                            return promisifyLoader(new THREE.TextureLoader(manager), onProgress)
                                .load('assets/' + this._scenarioFolder + this._currentObjectName)
                                .then((_texturePainting: THREE.Texture) => {
                                    var materialPainting = new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>{
                                        color: 0xffffff,
                                        map: _texturePainting,
                                        side: THREE.DoubleSide
                                    });
                                    var scale = slide.width / slide.hotspot.size;
                                    var geometry = new THREE.PlaneBufferGeometry(slide.hotspot.size, slide.height / scale);
                                    var mesh = new THREE.Mesh(geometry, materialPainting);
                                    mesh.name = 'slide' + slideNumber + 'bg';
                                    var topLeft = {
                                        x: -context._width / 2 + (+slide.hotspot.x),
                                        y: context._height / 2 - (+slide.hotspot.y),
                                    }
                                    var center = {
                                        x: topLeft.x + slide.width / 2 / scale,
                                        y: topLeft.y - slide.height / 2 / scale,
                                        z: +(slide.hotspot.z)
                                    }
                                    const cameraState = getCameraState(center, slide.height / scale, +(slide.hotspot.z), context._cameraFov);
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
                                            +(slide.hotspot.z)),
                                        // svg: <any>slide.svg,
                                        transitionDuration: +slide.animation.duration,
                                        scale: scale,
                                        cameraPosition: cameraState.cameraPosition,
                                        cameraLookAt: cameraState.cameraLookAt
                                    }
                                    newSlide.objects = [];
                                    //mesh.position.x = center.x;
                                    //mesh.position.y = center.y;
                                    //mesh.position.z = newSlide.position.z;
                                    let p;
                                    if (slide.objects) {
                                        p = forEachPromise(slide.objects, (svg, context) => {
                                            this._currentObjectName = svg['url'];
                                            var svgUrl = 'assets/' + context._scenarioFolder + this._currentObjectName;
                                            return promisifyLoader(new SVGLoader(manager), onProgress)
                                                .load(svgUrl)
                                                .then((svgData) => {
                                                    const z = +(slide.hotspot.z) + (+svg['z']);
                                                    const mesh = loadSVG(
                                                        svgData,
                                                        (+svg['x']),
                                                        (-svg['y']),
                                                        (+svg['z']),
                                                        (+svg['scale']) / scale,
                                                        slideNumber
                                                    );
                                                    newSlide.objects.push(mesh);
                                                });
                                        }, this);
                                    } else {
                                        p = Promise.resolve();
                                    }
                                    return p.then(() => {
                                        this._outSlides.push(newSlide);
                                    })
                                })
                        }, this);
                    }).then((a) => {
                        return Promise.resolve()
                    });
            }).then(() => {
                return Promise.resolve(<World>{
                    width: this._width,
                    height: this._height,
                    slides: this._outSlides,
                    steps: this._steps,
                    cameraFov: this._cameraFov,
                    mainSlideDuration: this._mainSlideDuration,
                    mainBackgroundColor: this._mainBackgroundColor,
                    draggables: []
                })
            }).catch((e) => { console.log(e); });

        function loadSVG(data, x, y, z, scale, parentSlide = 0) {
            var paths = data.paths;
            var group = new THREE.Group();
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var fillColor = path.userData.style.fill;
                var material = new THREE.MeshBasicMaterial({
                    color: new THREE.Color().setStyle(fillColor),
                    opacity: path.userData.style.fillOpacity,
                    transparent: path.userData.style.fillOpacity < 1,
                    side: THREE.DoubleSide,
                    depthWrite: false,
                    wireframe: false
                });
                var shapes = path.toShapes(true);
                for (var j = 0; j < shapes.length; j++) {
                    var shape = shapes[j];
                    var geometry = new THREE.ShapeBufferGeometry(shape);
                    geometry.applyMatrix(new THREE.Matrix4().makeScale(1, -1, 1)) // <-- this
                    var mesh = new THREE.Mesh(geometry, material);
                    group.add(mesh);
                }
            }
            // new THREE.Box3().setFromObject(group).getCenter(group.position);
            group.scale.multiplyScalar(scale);
            group.renderOrder = z; // to prevent strange overlap
            let _groupGeometry = getGroupGeometry(group);
            group.position.x -= _groupGeometry.size.x / 2;
            group.position.y += _groupGeometry.size.y / 2;
            group.position.z += _groupGeometry.size.z / 2;
            _groupGeometry.parentSlide = parentSlide;
            _groupGeometry.delta.z = 0;
            let eg = new EditableGroup();
            eg.name = 'group_s' + parentSlide + '_o_' + scope._currentObjectName;
            eg.userData = _groupGeometry;
            eg.position.x = x;
            eg.position.y = y;
            eg.position.z = z;
            eg.renderOrder = z; // to prevent strange overlap
            eg.addChild(group);
            return eg;
        }
    }
}