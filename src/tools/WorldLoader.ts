import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { XmlLoader } from "./XmlLoader";
import { promisifyLoader, forEachPromise } from './helpers';
import * as THREE from "three";

import { ScenarioData, Slide, World } from "../types";

export class WorldLoader {
    private _scenarioFolder: string;
    private _width: number;
    private _height: number;
    private _outSlides: Slide[] = [];
    private _steps: [];
    private _mainSlideDuration: number;
    private _mainBackgroundColor: number;
    private _cameraFov = 45;

    constructor(scenarioFolder: string) {
        this._scenarioFolder = scenarioFolder;
    }

    public load() {
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
            .load('assets/'+this._scenarioFolder + 'scenario.xml')
            .then((scenarioData: ScenarioData) => {
                this._width = +scenarioData.width;
                this._height = +scenarioData.height;
                this._steps = scenarioData.steps;
                this._mainBackgroundColor = scenarioData.mainBackgroundColor;
                this._mainSlideDuration = +scenarioData.mainDuration;
                this._cameraFov = +scenarioData.cameraFov;
                return promisifyLoader(new THREE.TextureLoader(manager), onProgress)
                    .load('assets/'+this._scenarioFolder + scenarioData.mainBackgroundPic)
                    .then((_texturePainting: THREE.Texture) => {
                        var materialPainting = new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>{
                            color: 0xffffff,
                            map: _texturePainting,
                            side: THREE.DoubleSide
                        });

                        var geometry = new THREE.PlaneBufferGeometry(this._width, this._height);
                        var mesh = new THREE.Mesh(geometry, materialPainting);
                        const newSlide = <Slide>{
                            width: this._width,
                            height: this._height,
                            background: mesh,
                            position: new THREE.Vector3(0, 0, 0),
                            transitionDuration: +scenarioData.mainDuration,
                            scale: 1,
                            cameraPosition: new THREE.Vector3(0, 0, scenarioData.height / 2 / Math.tan(this._cameraFov / 2 * Math.PI / 180)),
                            cameraLookAt: new THREE.Vector3(0, 0, 0)
                        }
                        mesh.position.x = newSlide.position.x;
                        mesh.position.y = newSlide.position.y;
                        mesh.position.z = newSlide.position.z;
                        newSlide.objects = [];
                        let p;
                        if (scenarioData.svg) {
                            p = forEachPromise(scenarioData.svg, (svg, context) => {
                                var svgUrl = 'assets/'+context._scenarioFolder + svg['url'];
                                return promisifyLoader(new SVGLoader(manager), onProgress)
                                    .load(svgUrl)
                                    .then((svgData) => {
                                        const mesh = loadSVG(svgData, -this._width / 2 + (+svg['x']), this._height / 2 + (-svg['y']), +svg['z'], +svg['scale']);
                                        newSlide.objects.push(mesh);
                                    });
                            }, this);
                        } else {
                            p = Promise.resolve(true);
                        }
                        return p.then(() => { this._outSlides.push(newSlide); })
                    }).then((a) => {
                        return forEachPromise(scenarioData.slides, (slide, context) => {
                            return promisifyLoader(new THREE.TextureLoader(manager), onProgress)
                                .load('assets/'+this._scenarioFolder + slide.picture)
                                .then((_texturePainting: THREE.Texture) => {
                                    var materialPainting = new THREE.MeshBasicMaterial(<THREE.MeshBasicMaterialParameters>{
                                        color: 0xffffff,
                                        map: _texturePainting,
                                        side: THREE.DoubleSide
                                    });
                                    var scale = slide.width / slide.hotspot.size;
                                    var geometry = new THREE.PlaneBufferGeometry(slide.hotspot.size, slide.height / scale);
                                    var mesh = new THREE.Mesh(geometry, materialPainting);
                                    var topLeft = {
                                        x: -context._width / 2 + (+slide.hotspot.x),
                                        y: context._height / 2 - (+slide.hotspot.y),
                                    }
                                    var center = {
                                        x: topLeft.x + slide.width / 2 / scale,
                                        y: topLeft.y - slide.height / 2 / scale,
                                    }
                                    const newSlide = <Slide>{
                                        width: slide.width / scale,
                                        height: slide.height / scale,
                                        background: mesh,
                                        position: new THREE.Vector3(
                                            topLeft.x,
                                            topLeft.y,
                                            +(slide.hotspot.z)),
                                        transitionDuration: +slide.animation.duration,
                                        scale: scale,
                                        cameraPosition: new THREE.Vector3(
                                            center.x,
                                            center.y,
                                            slide.height / scale / 2 / Math.tan(this._cameraFov / 2 * Math.PI / 180) + (+slide.hotspot.z)
                                        ),
                                        cameraLookAt: new THREE.Vector3(
                                            center.x,
                                            center.y,
                                            0)
                                    }
                                    newSlide.objects = [];
                                    mesh.position.x = center.x;
                                    mesh.position.y = center.y;
                                    mesh.position.z = newSlide.position.z;
                                    let p;
                                    if (slide.svg) {
                                        p = forEachPromise(slide.svg, (svg, context) => {
                                            var svgUrl = 'assets/'+context._scenarioFolder + svg['url'];
                                            return promisifyLoader(new SVGLoader(manager), onProgress)
                                                .load(svgUrl)
                                                .then((svgData) => {
                                                    const mesh = loadSVG(
                                                        svgData,
                                                        -this._width / 2 + (+svg['x']),
                                                        this._height / 2 + (-svg['y']),
                                                        +svg['z'],
                                                        (+svg['scale']) / scale,
                                                        ++slideNumber
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
            new THREE.Box3().setFromObject(group).getCenter(group.position);
            group.scale.multiplyScalar(scale);
            group.position.x = x;
            group.position.y = y;
            group.position.z = z;
            group.renderOrder = z; // to prevent strange overlap
            // group.scale.y *= - 1;
            //get group geometry
            var center = new THREE.Vector3();
            var size = new THREE.Vector3();
            var boundingBox = new THREE.Box3().setFromObject(group);
            boundingBox.getCenter(center);
            boundingBox.getSize(size)
            var topLeftCorner = new THREE.Vector3(center.x - size.x / 2, center.y + size.y / 2, center.z);
            var delta = new THREE.Vector3(
                group.position.x - (center.x - size.x / 2),
                group.position.y - (center.y + size.y / 2),
                group.position.z
            );
            group.userData = {
                size: {
                    x: size.x,
                    y: size.y,
                },
                delta: delta,
                parentSlide: parentSlide,

            }
            group.position.add(delta);
            return group;
        }
    }
}