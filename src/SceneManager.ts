import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GeneralLights } from './sceneSubjects/GeneralLights';
import { SceneSubjects } from './sceneSubjects/SceneSubjects';
import { SlidesController } from "./SlidesController";

export class SceneManager {

    private clock = new THREE.Clock();
    private canvas;
    private screenDimensions;

    private scene;
    private renderer;
    public camera;
    public orbitControl;
    public sceneSubjects;
    private world;
    private slidesController;

    constructor(canvas: HTMLCanvasElement, world: any) {
        // console.log(world);
        this.canvas = canvas;
        this.world = world;
        this.screenDimensions = {
            width: this.canvas.width,
            height: this.canvas.height,
            fov: this.world.cameraFov
        }
        this.scene = this.buildScene();
        this.renderer = this.buildRender(this.screenDimensions);
        this.camera = this.buildCamera(this.screenDimensions);
        this.sceneSubjects = this.createSceneSubjects(this.scene, this.world);
        this.orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
        this.orbitControl.screenSpacePanning = true;
        this.orbitControl.target = new THREE.Vector3(0, 0, 0);
        this.orbitControl.update();
        this.slidesController = new SlidesController(this.camera, this.world, this.orbitControl);
    }

    onDocumentKeyDown(event) {
        this.slidesController.handleButton(event);
    }

    buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");

        return scene;
    }

    buildRender({ width, height }) {
        const renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
        const DPR = (window.devicePixelRatio) ? window.devicePixelRatio : 1;
        renderer.setPixelRatio(DPR);
        renderer.setSize(width, height);

        renderer.gammaInput = true;
        renderer.gammaOutput = true;

        return renderer;
    }

    buildCamera({ width, height, fov }) {
        const aspectRatio = width / height;
        const fieldOfView = fov;
        const nearPlane = 1;
        const farPlane = 8000;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        camera.position.z = this.world.height / 2 / Math.tan(this.world.cameraFov / 2 * Math.PI / 180);
        return camera;
    }

    createSceneSubjects(scene, world) {
        const sceneSubjects = [
            new GeneralLights(scene),
            new SceneSubjects(scene, world)
        ];
        return sceneSubjects;
    }

    update() {
        if(this.slidesController.getBusy()){
            TWEEN.update();
        }
        const elapsedTime = this.clock.getElapsedTime();

        for (let i = 0; i < this.sceneSubjects.length; i++)
            this.sceneSubjects[i].update(elapsedTime);

        this.orbitControl.update();
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const { width, height } = this.canvas;

        this.screenDimensions.width = width;
        this.screenDimensions.height = height;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);
    }
}
