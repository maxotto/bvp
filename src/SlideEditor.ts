import * as THREE from "three";
import { World, WorldMode, Slide } from "./types";
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
            this.parent.world.orbitControl.enabled = false;
        });

        this.dragControls.addEventListener('dragend', (event) => {
            this.parent.world.orbitControl.enabled = true;
            console.log(event.object);
            // по результату перемещения надо откорректировать позицию камеры для правильного показа переехавшего слайда.
            const userData = event.object.userData;
            const slideIndex = userData.parentSlide;
            const slide = <Slide>this.parent.world.slides[slideIndex];
            const center = new THREE.Vector3(
                slide.position.x + event.object.position.x + userData.size.x / 2,
                slide.position.y + event.object.position.y - userData.size.y / 2,
                slide.position.z + event.object.position.z + userData.size.z / 2,
            );
            const topLeft = new THREE.Vector3(
                slide.position.x + event.object.position.x,
                slide.position.y + event.object.position.y,
                slide.position.z + event.object.position.z,
            );
            slide.hotspot.x = this.parent.world.width / 2 + topLeft.x;
            slide.hotspot.y = this.parent.world.height / 2 - topLeft.y;
            slide.hotspot.z = topLeft.z;
            console.log(topLeft);
            console.log({ slide });
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

    onTouchEvent(event) {
        const type = event.type;
        const func = 'on' + type;
        (this)[func](event);
    }

    ontouchstart(event) {
        //console.log(event.type);
    }

    ontouchmove(event) {
        //console.log(event.type);
    }

    ontouchend(event) {
        //console.log(event.type);
    }

    ontouchenter(event) {
        //console.log(event.type);
    }

    ontouchleave(event) {
        //console.log(event.type);
    }

    ontouchcancel(event) {
        //console.log(event.type);
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