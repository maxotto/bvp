import * as THREE from "three";
import TWEEN from '@tweenjs/tween.js';
import { getPointsByCurve, calculateJump } from './tools/helpers';

export class SlidesController {
    private world;
    private camera;
    private busy = false;
    private step = 0;
    private orbitControl;
    constructor(camera, world, orbitControl){
        this.camera = camera;
        this.world = world;
        this.orbitControl = orbitControl;
    }

    getBusy(){
        return this.busy;
    }

    handleButton(event){
        var start, finish;
        if(!this.busy){
            var alt = event.altKey?'Alt-':'';
            var buttonPressed = alt + event.keyCode;
            switch (buttonPressed) {
                case '87':
                    start = this.step;
                    finish = this.step+1;
                    break;
                case '83':
                    start = this.step;
                    finish = this.step-1;
                    break;
            }
            if (finish>=0 && finish <=this.world.steps.length-1) {
                this.step = finish;
                this.showNext(start, finish);
            }
        }
    }

    showNext(start, finish){
        this.busy = true;
        let startSlideIndex = +this.world.steps[start]['slide'];
        let finishSlideIndex = +this.world.steps[finish]['slide'];
        const duration = this.world.slides[finishSlideIndex].transitionDuration;
        const startPoint = new THREE.Vector3(
            this.world.slides[startSlideIndex].cameraPosition.x,
            this.world.slides[startSlideIndex].cameraPosition.y,
            this.world.slides[startSlideIndex].cameraPosition.z
            );
        const finishPoint = new THREE.Vector3(
            this.world.slides[finishSlideIndex].cameraPosition.x,
            this.world.slides[finishSlideIndex].cameraPosition.y,
            this.world.slides[finishSlideIndex].cameraPosition.z
            );
        const jump = calculateJump(this.world.slides[startSlideIndex], this.world.slides[finishSlideIndex]);
        const middlePoint = new THREE.Vector3(
            startPoint.x - (startPoint.x - finishPoint.x) / 2,
            startPoint.y - (startPoint.y - finishPoint.y) / 2,
            startPoint.z - (startPoint.z - finishPoint.z) / 2 + jump,
            );
        const pNums = 1500;
        const points = getPointsByCurve('QuadraticBezierCurve3',
            startPoint,
            middlePoint,
            finishPoint, pNums);
        const from = { index: 0 };
        const to = { index: pNums };
        new TWEEN.Tween(from)
            .to(to, duration)
            .easing(TWEEN.Easing.Quadratic.InOut) // change here
            .onUpdate(() => {
                const pointNum = Math.ceil(from.index);
                this.camera.position.set(points[pointNum].x, points[pointNum].y, points[pointNum].z);
                this.orbitControl.target = new THREE.Vector3(
                    points[pointNum].x,
                    points[pointNum].y,
                    0
                );
            })
            .onComplete(() => {
                this.camera.position.set(finishPoint.x, finishPoint.y, finishPoint.z);
                this.orbitControl.target = new THREE.Vector3(
                    this.world.slides[finishSlideIndex].cameraLookAt.x,
                    this.world.slides[finishSlideIndex].cameraLookAt.y,
                    this.world.slides[finishSlideIndex].cameraLookAt.z
                );
                this.busy = false;
            })
            .start();    
    }
}