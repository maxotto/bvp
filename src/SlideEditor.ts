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
        this.dragControls.addEventListener('dragend', (data) => {
            this.parent.world.orbitControl.enabled = true;
            // TODO Запомнить новое состояние, чтоб сюда смотрел камера при смене слайда
            if (data.object) {
                console.log(data);
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
