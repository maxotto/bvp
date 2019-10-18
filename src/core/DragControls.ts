import { EditableGroupState, EditableGroup } from '../core/EditableGroup';
import { Camera, Plane, Raycaster, Vector2, Vector3, Matrix4, Mesh, EventDispatcher } from 'three';
import { World } from '../types';
import { getGroupGeometry } from '../tools/helpers';

export class DragControls extends EventDispatcher {
    private _camera: Camera;
    private _domElement: HTMLElement;
    private _plane: Plane = new Plane();
    // private _raycaster: Raycaster = new Raycaster();
    private _mouse: Vector2 = new Vector2();
    private _offset: Vector3 = new Vector3();
    private _iniPosition: Vector3 = new Vector3();
    private _iniWidth: number;
    private _iniScale: number;
    private _intersection: Vector3 = new Vector3();
    private _worldPosition: Vector3 = new Vector3();
    private _inverseMatrix: Matrix4 = new Matrix4();
    private _resizer: Mesh = null;
    private _groupHovered: EditableGroup = null;
    private _isDragging: boolean = false;
    private _draggables: EditableGroup[] = [];

    constructor(private _world: World) {
        super();
        //collect Editables into _draggables array
        this._camera = this._world.camera;
        this._domElement = this._world.renderer.domElement;
        this._world.scene.traverse((e: EditableGroup) => {
            if (e.isEditableGroup) {
                this._draggables.push(e);
            }
        });
    }

    public activate() {
        this._domElement.addEventListener('mousemove', this.onDocumentMouseMove, false);
        this._domElement.addEventListener('mousedown', this.onDocumentMouseDown, false);
        this._domElement.addEventListener('mouseup', this.onDocumentMouseCancel, false);
        this._domElement.addEventListener('mouseleave', this.onDocumentMouseCancel, false);
        this._domElement.addEventListener('touchmove', this.onDocumentTouchMove, false);
        this._domElement.addEventListener('touchstart', this.onDocumentTouchStart, false);
        this._domElement.addEventListener('touchend', this.onDocumentTouchEnd, false);
    }

    public deactivate() {
        this._domElement.style.cursor = 'auto';
        this._groupHovered = null;
        this._resizer = null;
        this._domElement.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        this._domElement.removeEventListener('mousedown', this.onDocumentMouseDown, false);
        this._domElement.removeEventListener('mouseup', this.onDocumentMouseCancel, false);
        this._domElement.removeEventListener('mouseleave', this.onDocumentMouseCancel, false);
        this._domElement.removeEventListener('touchmove', this.onDocumentTouchMove, false);
        this._domElement.removeEventListener('touchstart', this.onDocumentTouchStart, false);
        this._domElement.removeEventListener('touchend', this.onDocumentTouchEnd, false);
    }

    private _adjustEditableByResizer() {
        let found = false;
        let editableGroup: EditableGroup;
        this._resizer.traverseAncestors((obj: EditableGroup) => {
            if (obj.isEditableGroup && !found) {
                found = true;
                editableGroup = obj;
            }
        });
        console.log(editableGroup);
        let localPosition: Vector3 = new Vector3();
        let globalPosition: Vector3 = new Vector3();

        localPosition.copy(this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix));
        const resizerType: string = this._resizer.userData.params.type;
        const resizerPoint: string = this._resizer.userData.params.point;
        if (resizerType == 'centralPoint') {
            globalPosition.copy(this._iniPosition).add(localPosition);
            editableGroup.position.copy(globalPosition);
        } else if (resizerType == 'resizer') {
            //console.log({ globalPosition });
            switch (resizerPoint) {
                case 'tl':
                    break;
                case 'tr':
                    break;
                case 'bl':
                    break;
                case 'br':
                    break;
            }
            console.log(this._iniScale);
            console.log(localPosition.x);
            console.log(localPosition.x * this._iniScale);
            const firstSize = editableGroup.iniData.width;
            console.log({ firstSize });
            const x = firstSize / 2;
            const dX = -1 * (localPosition.x * this._iniScale + firstSize / 2);
            console.log({ dX });
            const scale = (dX + x) / x;
            console.log(scale);
            editableGroup.scale.x = scale;
            editableGroup.scale.y = scale;
        } else {
            console.log('Why? resizerType =', resizerType);
        }
    }

    private onDocumentMouseMove = (event) => {
        event.preventDefault();

        const rect: ClientRect = this._domElement.getBoundingClientRect();
        this._mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this._mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster: Raycaster = new Raycaster();

        raycaster.setFromCamera(this._mouse, this._camera);

        if (this._isDragging && this._resizer) {
            if (raycaster.ray.intersectPlane(this._plane, this._intersection)) {
                this._adjustEditableByResizer();
            }
            this.dispatchEvent({ type: 'drag', object: this._resizer });
            return;

        }

        var intersects = raycaster.intersectObjects(this._draggables, true);

        if (intersects.length > 0) {
            // get hovered EditableGroup
            let found = false;
            intersects[0].object.traverseAncestors((obj: EditableGroup) => {
                if (obj.isEditableGroup && !found) {
                    found = true;
                    this._groupHovered = obj;
                }
            });
            // catch resizer
            if (
                intersects[0].object.userData.params &&
                (
                    intersects[0].object.userData.params.type == 'resizer' ||
                    intersects[0].object.userData.params.type == 'centralPoint'
                )
            ) {
                this._domElement.style.cursor = 'pointer';
                this._resizer = <Mesh>intersects[0].object;
                this._plane.setFromNormalAndCoplanarPoint(
                    this._camera.getWorldDirection(this._plane.normal),
                    this._worldPosition.setFromMatrixPosition(this._resizer.matrixWorld)
                );
                console.log(this._worldPosition);

            } else {
                this._domElement.style.cursor = 'auto';
                this._resizer = null;
            }
        } else {
            this._groupHovered = null;
        }

        //repaint Editables
        this._draggables.forEach(d => {
            if (d == this._groupHovered) {
                d.setState(EditableGroupState.editor);
            } else {
                d.setState(EditableGroupState.show);
            }
        });

    }

    private onDocumentMouseDown = (event) => {
        event.preventDefault();
        const raycaster: Raycaster = new Raycaster();
        raycaster.setFromCamera(this._mouse, this._camera);
        if (this._resizer) {
            this._iniPosition.copy(this._groupHovered.position);
            this._iniWidth = this._groupHovered.userData.size.x;
            this._iniScale = this._groupHovered.scale.x;
            console.log(this._iniScale);
            this._isDragging = true;
            this._domElement.style.cursor = 'move';
            this.dispatchEvent({ type: 'dragstart', object: this._groupHovered });
            if (raycaster.ray.intersectPlane(this._plane, this._intersection)) {
                this._inverseMatrix.getInverse(this._resizer.matrixWorld);
                this._offset.copy(this._intersection).sub(this._worldPosition.setFromMatrixPosition(this._resizer.matrixWorld)).sub(this._resizer.position);
                let localPosition: Vector3 = new Vector3();
                localPosition.copy(this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix));
                console.log(localPosition);

            }
        }
    }

    private onDocumentMouseCancel = (event) => {
        event.preventDefault();
        this._isDragging = false;
        this._domElement.style.cursor = this._resizer ? 'pointer' : 'auto';
        this.dispatchEvent({ type: 'dragend', object: this._groupHovered });
    }

    private onDocumentTouchMove = (event) => {
        event.preventDefault();
    }

    private onDocumentTouchStart = (event) => {
        event.preventDefault();
    }

    private onDocumentTouchEnd = (event) => {
        event.preventDefault();
    }

}