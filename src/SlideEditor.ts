import * as THREE from "three";
import { World, WorldMode, Slide } from "./types";
// import { DragControls } from './tools/MyDragControls';
import { DragControls } from './core/DragControls'
import { getCameraState } from "./tools/helpers";

export class SlideEditor {
    private dragControls;
    constructor(private parent) {
        this.parent.onSwitchToEditorMode.subscribe((a) => {
            this.dragControls.activate();
        });
        this.parent.onSwitchToShowMode.subscribe((a) => {
            this.dragControls.deactivate();
            console.log(WorldMode.show);
        });
        this.dragControls = new DragControls(this.parent.world);
        this.dragControls.addEventListener('dragstart', () => {
            this.parent.world.orbitControl.enabled = false;
        });
        this.dragControls.addEventListener('editableselected', () => {
            this.parent.world.orbitControl.enabled = false;
        });
        this.dragControls.addEventListener('editabledeselected', () => {
            this.parent.world.orbitControl.enabled = true;
        });
        this.dragControls.addEventListener('dragend', (event) => {
            this.parent.world.orbitControl.enabled = true;
            if (event.object) {
                // TODO take in mind SCALE changed while resizing
                if (event.object.name.indexOf('slideGroup_') == 0) {
                    const userData = event.object.userData;
                    const slideIndex = userData.parentSlide;
                    const slide = <Slide>this.parent.world.slides[slideIndex];
                    const center = new THREE.Vector3(
                        event.object.position.x,
                        event.object.position.y,
                        event.object.position.z,
                    );
                    slide.hotspot.x = this.parent.world.width / 2 + center.x;
                    slide.hotspot.y = this.parent.world.height / 2 - center.y;
                    slide.hotspot.z = center.z;
                    const cameraState = getCameraState(
                        center,
                        userData.size.y,
                        event.object.position.z,
                        this.parent.world.cameraFov);
                    slide.cameraPosition = cameraState.cameraPosition;
                    slide.cameraLookAt = cameraState.cameraLookAt;
                    this.parent.world.orbitControl.update();
                }
            }
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
        // console.log(event.type);
    }

    onKeyboardEvent(event) {
        // console.log(event.code);
    }
}

export function showSphere(scene, position, size, color, texture?) {
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
