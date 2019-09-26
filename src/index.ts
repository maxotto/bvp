import "./style.css";
import { SceneManager } from "./SceneManager";
import { WorldLoader } from './tools/WorldLoader';
import { World, MouseEvents, KeyboardEvents } from "./types";


const canvas = <HTMLCanvasElement>document.getElementById("canvas");
let sceneManager;

const l = new WorldLoader('presentation1/');
l.load().then((world) => {
    sceneManager = new SceneManager(canvas, <World>world);
    bindEventListeners();
    render();
});


function bindEventListeners() {
    window.onresize = resizeCanvas;
    for (let event in MouseEvents) {
        if (isNaN(Number(event))) {
            document.addEventListener(event, onMouseEvent, false);
        }
    }
    for (let event in KeyboardEvents) {
        if (isNaN(Number(event))) {
            document.addEventListener(event, onKeyboardEvent, false);
        }
    }
    resizeCanvas();
}

function onMouseEvent(event) {
    sceneManager.onMouseEvent(event);
}

function onKeyboardEvent(event) {
    sceneManager.onKeyboardEvent(event);
}

function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    sceneManager.onWindowResize();
}

function render() {
    requestAnimationFrame(render);
    sceneManager.update();
}