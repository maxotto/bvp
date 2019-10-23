import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GeneralLights } from './sceneSubjects/GeneralLights';
import { SceneSubjects } from './sceneSubjects/SceneSubjects';
import { SlidesController } from "./SlidesController";
import { MyDataControls } from "./tools/datGui";

import { WorldMode, World } from "./types";
import * as Stats from 'stats.js';

export class SceneManager {

    private clock = new THREE.Clock();
    private screenDimensions;
    private myControls;
    public sceneSubjects;
    private slidesController;
    private stats: Stats;

    constructor(private canvas: HTMLCanvasElement, private world: World) {
        this.screenDimensions = {
            width: this.canvas.width,
            height: this.canvas.height,
            fov: this.world.cameraFov
        }
        this.world.scene = this.buildScene();
        this.world.renderer = this.buildRender(this.screenDimensions);
        this.world.camera = this.buildCamera(this.screenDimensions);
        this.sceneSubjects = this.createSceneSubjects(this.world.scene, this.world);
        this.world.orbitControl = new OrbitControls(this.world.camera, this.world.renderer.domElement);
        this.world.orbitControl.screenSpacePanning = true;
        this.world.orbitControl.target = new THREE.Vector3(0, 0, 0);
        this.world.orbitControl.update();
        this.slidesController = new SlidesController(this.world);
        this.slidesController.onSwitchToEditorMode.subscribe((a) => {
            this.changeMode(WorldMode.editor);
        });
        this.slidesController.onSwitchToShowMode.subscribe((a) => {
            this.changeMode(WorldMode.show);
        });
        this.myControls = new MyDataControls(this.world);
        this.changeMode(WorldMode.show);
    }

    changeMode(newMode: WorldMode) {
        this.world.mode = newMode;
        this.world.orbitControl.enabled = (WorldMode[newMode] != 'show');
        if ((WorldMode[newMode] != 'show')) {
            this.myControls.show();
        } else {
            this.myControls.hide();
        }
    }

    onKeyboardEvent(event) {
        this.slidesController.onKeyboardEvent(event);
    }

    onMouseEvent(event) {
        this.slidesController.onMouseEvent(event);
    }

    onTouchEvent(event) {
        this.slidesController.onTouchEvent(event);
    }

    buildScene() {
        const scene = new THREE.Scene();
        scene.background = new THREE.Color("#000");
        scene.fog = new THREE.Fog(0x000000, 50, 4000);
        return scene;
    }

    buildRender({ width, height }) {
        this.stats = new Stats();
        this.stats.showPanel(0);
        this.stats.dom.id = 'stats';
        this.stats.dom.style.display = 'none';
        document.body.appendChild(this.stats.dom);

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
        this.stats.begin();
        if (this.slidesController.getBusy()) {
            TWEEN.update();
        }
        const elapsedTime = this.clock.getElapsedTime();

        for (let i = 0; i < this.sceneSubjects.length; i++)
            this.sceneSubjects[i].update(elapsedTime);

        this.world.orbitControl.update();
        this.world.renderer.render(this.world.scene, this.world.camera);
        this.stats.end();
    }

    onWindowResize() {
        const { width, height } = this.canvas;
        this.screenDimensions.width = width;
        this.screenDimensions.height = height;
        this.world.camera.aspect = width / height;
        this.world.camera.updateProjectionMatrix();
        this.world.renderer.setSize(width, height);
    }
}
