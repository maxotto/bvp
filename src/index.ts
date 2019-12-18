import "./style.css";
import { SceneManager } from "./SceneManager";
import { WorldLoader } from './tools/WorldLoader';
import { World, MouseEvents, KeyboardEvents, TouchEvents } from "./types";
import { findGetParameters } from "./tools/helpers";


const canvas = <HTMLCanvasElement>document.getElementById("canvas");
let sceneManager;
var startButton = document.getElementById('startButton');
startButton.addEventListener('click', init);
const getParams: any = findGetParameters();
console.log(getParams);
if (!getParams.p) {
    alert('Project name required');
    throw new Error("Something went badly wrong!");
}
const l = new WorldLoader(getParams.p);
l.load().then((world) => {
    init();
    sceneManager = new SceneManager(canvas, <World>world);
    bindEventListeners();
    render();
});
function init() {
    var overlay = document.getElementById('overlay');
    overlay.remove();
    var audioElement = <HTMLVideoElement>document.getElementById('music');
    audioElement.play();
}

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

    for (let event in TouchEvents) {
        if (isNaN(Number(event))) {
            document.addEventListener(event, onTouchEvent, false);
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

function onTouchEvent(event) {
    sceneManager.onTouchEvent(event);
}

function resizeCanvas() {
    canvas.style.width = '100%';
    canvas.style.height = '100%';

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    sceneManager.onWindowResize();
}

function render() {
    requestAnimationFrame(render);
    sceneManager.update();
}