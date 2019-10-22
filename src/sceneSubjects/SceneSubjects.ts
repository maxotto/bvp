import * as THREE from 'three';
import { World } from '../types';
import { getGroupGeometry } from '../tools/helpers';
import { EditableGroup, EditableGroupState } from '../core/EditableGroup';
import { Group } from 'three';


export class SceneSubjects {
    private scene;
    private world: World;
    private radius = 20;
    private mesh;

    constructor(scene, world: World) {
        this.scene = scene;
        this.world = world;

        this.mesh = new THREE.Mesh(
            new THREE.IcosahedronBufferGeometry(this.radius, 2),
            new THREE.MeshStandardMaterial({ flatShading: true })
        );
        this.mesh.position.set(-300, 50, 120);
        this.scene.add(this.mesh);

        this.createGround();

        world.slides.forEach((slide, index) => {
            let slideGroup;
            if (index === 0) {
                this.createFrame();
                slideGroup = new Group();
            } else {
                slideGroup = new EditableGroup();
                world.draggables.push(slideGroup)
            }
            slideGroup.add(slide.background);
            slide.objects.forEach(object => {
                slideGroup.add(object);
                world.draggables.push(object);
            });
            slideGroup.position.x = slide.position.x + slide.width / 2;
            slideGroup.position.y = slide.position.y - slide.height / 2;
            slideGroup.position.z = slide.position.z;
            slideGroup.name = 'slideGroup_' + index;
            const _groupGeometry = getGroupGeometry(slideGroup);
            _groupGeometry.parentSlide = index;
            _groupGeometry.delta.z = 0;
            slideGroup.userData = _groupGeometry;
            this.scene.add(slideGroup);
        });
    }

    createFrame() {
        var frameBorder = 50;
        var frameGeometry = new THREE.PlaneBufferGeometry(this.world.width + frameBorder, this.world.height + frameBorder);
        var meshFrame = new THREE.Mesh(
            frameGeometry,
            new THREE.MeshBasicMaterial({
                color: +this.world.mainBackgroundColor,
                side: THREE.DoubleSide
            })
        );
        meshFrame.position.z = -50.0;
        this.scene.add(meshFrame);
    }

    createGround() {
        var imageCanvas = document.createElement("canvas");
        var context = imageCanvas.getContext("2d");
        imageCanvas.width = imageCanvas.height = 128;
        context.fillStyle = "#000";
        context.fillRect(0, 0, 128, 128);
        context.fillStyle = "#444";
        context.fillRect(0, 0, 64, 64);
        context.fillRect(64, 64, 64, 64);
        var textureCanvas = new THREE.CanvasTexture(imageCanvas);
        textureCanvas.repeat.set(1000, 1000);
        textureCanvas.wrapS = THREE.RepeatWrapping;
        textureCanvas.wrapT = THREE.RepeatWrapping;
        var materialCanvas = new THREE.MeshBasicMaterial({
            map: textureCanvas,
            side: THREE.DoubleSide
        });
        var geometry = new THREE.PlaneBufferGeometry(100, 100);
        var meshCanvas = new THREE.Mesh(geometry, materialCanvas);
        meshCanvas.rotation.x = -Math.PI / 2;
        meshCanvas.scale.set(500, 500, 500);
        var floorHeight = (-1 * this.world.height) / 2;
        meshCanvas.position.y = floorHeight;
        this.scene.add(meshCanvas);
    }

    update(time) {
        const scale = Math.sin(time / 3.4) + 2;
        const z = Math.sin(time / 2) * 250 + 0;
        const y = Math.sin(time / 2) * 250 + 0;
        const x = Math.cos(time / 2) * 540 + 380;
        // this.mesh.scale.set(scale, scale, scale);
        this.mesh.position.z = z;
        this.mesh.position.y = y;
        this.mesh.position.x = x;
        // console.log(this.mesh.position.z);
    }
}