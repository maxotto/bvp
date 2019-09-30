import * as THREE from "three";
import { World, WorldMode } from "./types";
import { DragControls } from './tools/MyDragControls';
import { getCameraState } from "./tools/helpers";

export class SlideEditor {
    private dragControls;
    constructor(private parent) {
        console.log(parent.world);
        this.initDragControls();
        this.parent.onSwitchToEditorMode.subscribe((a) => {
            console.log(WorldMode.editor);
            this.dragControls.activate();
        });
        this.parent.onSwitchToShowMode.subscribe((a) => {
            this.dragControls.deactivate();
            console.log(WorldMode.show);
        });
    }

    initDragControls() {
        this.dragControls = new DragControls(
            this.parent.world.draggables,
            this.parent.world.camera,
            this.parent.world.renderer.domElement
        );

        this.dragControls.setSlide(0);
        this.dragControls.deactivate();

        this.dragControls.addEventListener('dragstart', () => {
            this.parent.orbitControls.enabled = false;
        });

        this.dragControls.addEventListener('dragend', (event) => {
            this.parent.orbitControls.enabled = true;
            console.log(event.object);
            const newX = Math.round((this.parent.world.width / 2 + event.object.position.x) * 10) / 10;
            const newY = Math.round((this.parent.world.height / 2 - event.object.position.y) * 10) / 10;
            const newZ = Math.round((event.object.position.z) * 10) / 10;
            // по результату перемещения надо откорректировать позицию камеры для правильного показа переехавшего слайда.
            const userData = event.object.userData;
            const slideIndex = userData.parentSlide;
            const slide = this.parent.world.slides[slideIndex];
            console.log({ slide });
            const center = new THREE.Vector3(
                slide.position.x + event.object.position.x + userData.size.x / 2,
                slide.position.y + event.object.position.y - userData.size.y / 2,
                slide.position.z + event.object.position.z + userData.size.z / 2,
            );
            // showSphere(this.world.scene, center, 8, '0x55dd77');
            const cameraState = getCameraState(
                center,
                userData.size.y,
                slide.position.z + event.object.position.z,
                this.parent.world.cameraFov);
            slide.cameraPosition = cameraState.cameraPosition;
            slide.cameraLookAt = cameraState.cameraPosition;
        });
    }

    onMouseEvent(event) {
        const type = event.type;
        const func = 'on' + type;
        (this)[func](event);
    }
    onmousemove(event) {
        //console.log(event.type);
    }

    onmousedown(event) {
        //console.log(event.type);
    }

    onmouseup(event) {
        //console.log(event.type);
    }

    onclick(event) {
        //console.log(event.type);
    }

    ondblclick(event) {
        //console.log(event.type);
    }

    onmouseover(event) {
        //console.log(event.type);
    }

    onmousewheel(event) {
        //console.log(event.type);
    }

    onmouseout(event) {
        //console.log(event.type);
    }

    oncontextmenu(event) {
        console.log(event.type);
    }

    onKeyboardEvent(event) {
        // console.log(event.code);
    }
}

function showSphere(scene, position, size, color, texture?) {
    var g = new THREE.SphereGeometry(size, 32, 32);
    var maretialConf = { color: color }
    if (texture) {
        maretialConf['map'] = texture;
        maretialConf['side'] = THREE.DoubleSide;
    }
    var material = new THREE.MeshPhongMaterial(maretialConf);
    var sphere = new THREE.Mesh(g, material);
    sphere.position.x = position.x;
    sphere.position.y = position.y;
    sphere.position.z = position.z;
    scene.add(sphere);
}