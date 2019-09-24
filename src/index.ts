import "./style.css";
import { SceneManager } from "./SceneManager";
import { WorldLoader } from './tools/WorldLoader';

const canvas = <HTMLCanvasElement>document.getElementById("canvas");
let sceneManager;

const l = new WorldLoader('presentation1/');
l.load().then((world) => {
    sceneManager = new SceneManager(canvas, world);
    bindEventListeners();
    render();
});


function bindEventListeners() {
    window.onresize = resizeCanvas;
    resizeCanvas();
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