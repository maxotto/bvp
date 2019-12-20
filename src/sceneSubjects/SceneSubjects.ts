import * as THREE from 'three';
import { World } from '../types';
import { getGroupGeometry } from '../tools/helpers';
import { EditableGroup, EditableGroupState } from '../core/EditableGroup';
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader';
import { Group } from 'three';


export class SceneSubjects {
    private scene;
    private world: World;
    private radius = 20;
    private mesh;

    constructor(scene, world: World) {
        this.scene = scene;
        this.world = world;

        this.mesh = new THREE.Mesh(
            new THREE.IcosahedronBufferGeometry(this.radius, 2),
            new THREE.MeshStandardMaterial({ flatShading: true })
        );
        this.mesh.position.set(-3000, 50, 120);
        // this.scene.add(this.mesh);

        // this.createGround();
        this.createPanorama();
        // this.createTiger();

        world.slides.forEach((slide, index) => {
            let slideGroup;
            if (index === 0) {
                // this.createFrame();
                this.scene.background = slide.texture;
                console.log(slide.background);
                slideGroup = new Group();
            } else {
                slideGroup = new EditableGroup();
                world.draggables.push(slideGroup)
            }
            slideGroup.add(slide.background);
            slide.objects.forEach(object => {
                slideGroup.add(object);
                world.draggables.push(object);
            });
            slideGroup.position.x = slide.position.x + slide.width / 2;
            slideGroup.position.y = slide.position.y - slide.height / 2;
            slideGroup.position.z = slide.position.z;
            slideGroup.name = 'slideGroup_' + index;
            const _groupGeometry = getGroupGeometry(slideGroup);
            _groupGeometry.parentSlide = index;
            _groupGeometry.delta.z = 0;
            slideGroup.userData = _groupGeometry;
            this.scene.add(slideGroup);
        });
    }

    createTiger() {
        var loader = new SVGLoader();
        loader.load('/assets/NTerebilenko/tiger.svg', (data: any) => {
            var paths = data.paths;
            var group = new THREE.Group();
            group.scale.multiplyScalar(0.25);
            group.position.x = - 70;
            group.position.y = 70;
            group.scale.y *= - 1;
            for (var i = 0; i < paths.length; i++) {
                var path = paths[i];
                var fillColor = path.userData.style.fill;
                if (fillColor !== undefined && fillColor !== 'none') {
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
                        var mesh = new THREE.Mesh(geometry, material);
                        group.add(mesh);
                    }
                }
                var strokeColor = path.userData.style.stroke;
                if (strokeColor !== undefined && strokeColor !== 'none') {
                    var material = new THREE.MeshBasicMaterial({
                        color: new THREE.Color().setStyle(strokeColor),
                        opacity: path.userData.style.strokeOpacity,
                        transparent: path.userData.style.strokeOpacity < 1,
                        side: THREE.DoubleSide,
                        depthWrite: false,
                        wireframe: false
                    });
                    for (var j = 0, jl = path.subPaths.length; j < jl; j++) {
                        var subPath = path.subPaths[j];
                        var geometry = SVGLoader.pointsToStroke(subPath.getPoints(), path.userData.style, 20, 1);
                        if (geometry) {
                            var mesh = new THREE.Mesh(geometry, material);
                            group.add(mesh);
                        }
                    }
                }
            }
            this.scene.add(group);
        });
    }

    createFrame() {
        var frameBorder = 50;
        var frameGeometry = new THREE.PlaneBufferGeometry(this.world.width + frameBorder, this.world.height + frameBorder);
        var meshFrame = new THREE.Mesh(
            frameGeometry,
            new THREE.MeshBasicMaterial({
                color: +this.world.mainBackgroundColor,
                side: THREE.DoubleSide
            })
        );
        meshFrame.position.z = -50.0;
        this.scene.add(meshFrame);
    }

    createGround() {
        var imageCanvas = document.createElement("canvas");
        var context = imageCanvas.getContext("2d");
        imageCanvas.width = imageCanvas.height = 128;
        context.fillStyle = "#000";
        context.fillRect(0, 0, 128, 128);
        context.fillStyle = "#444";
        context.fillRect(0, 0, 64, 64);
        context.fillRect(64, 64, 64, 64);
        var textureCanvas = new THREE.CanvasTexture(imageCanvas);
        textureCanvas.repeat.set(1000, 1000);
        textureCanvas.wrapS = THREE.RepeatWrapping;
        textureCanvas.wrapT = THREE.RepeatWrapping;
        var materialCanvas = new THREE.MeshBasicMaterial({
            map: textureCanvas,
            side: THREE.DoubleSide
        });
        var geometry = new THREE.PlaneBufferGeometry(100, 100);
        var meshCanvas = new THREE.Mesh(geometry, materialCanvas);
        meshCanvas.rotation.x = -Math.PI / 2;
        meshCanvas.scale.set(500, 500, 500);
        var floorHeight = (-1 * this.world.height) / 2;
        meshCanvas.position.y = floorHeight;
        this.scene.add(meshCanvas);
    }

    createPanorama() {
        const geometry = new THREE.SphereBufferGeometry(340, 100, 100);
        //const geometry = new THREE.IcosahedronBufferGeometry(1600, 4);
        // invert the geometry on the x-axis so that all of the faces point inward
        geometry.scale(-1, 1, 1);
        geometry.center();
        const texture = new THREE.TextureLoader().load(this.world.panoramaPic);
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(0, 0, 0);
        mesh.rotation.y = - Math.PI / 2;
        this.scene.add(mesh);
    }

    update(time) {
        /*
        const z = Math.sin(time / 5) * 1650 + 650;
        const y = Math.sin(time / 5) * 350 + 0;
        const x = Math.cos(time / 5) * 1650 + 0;
        this.mesh.position.z = z;
        this.mesh.position.y = y;
        this.mesh.position.x = x;
        */
    }
}