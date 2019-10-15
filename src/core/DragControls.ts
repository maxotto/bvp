import { EditableGroupState, EditableGroup } from '../core/EditableGroup';
import { Camera, Plane, Raycaster, Vector2, Vector3, Matrix4, Mesh } from 'three';
import { World } from '../types';

export class DragControls {
    private _camera: Camera;
    private _domElement: HTMLElement;
    private _plane: Plane = new Plane();
    private _raycaster: Raycaster = new Raycaster();
    private _mouse: Vector2 = new Vector2();
    private _offset: Vector3 = new Vector3();
    private _intersection: Vector3 = new Vector3();
    private _worldPosition: Vector3 = new Vector3();
    private _inverseMatrix: Matrix4 = new Matrix4();
    private _selected: EditableGroup = null;
    private _groupHovered: EditableGroup = null;
    private _isDragging: boolean = false;
    private _draggables: EditableGroup[] = [];

    constructor(private _world: World) {
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
        this._selected = null;
        this._domElement.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        this._domElement.removeEventListener('mousedown', this.onDocumentMouseDown, false);
        this._domElement.removeEventListener('mouseup', this.onDocumentMouseCancel, false);
        this._domElement.removeEventListener('mouseleave', this.onDocumentMouseCancel, false);
        this._domElement.removeEventListener('touchmove', this.onDocumentTouchMove, false);
        this._domElement.removeEventListener('touchstart', this.onDocumentTouchStart, false);
        this._domElement.removeEventListener('touchend', this.onDocumentTouchEnd, false);
    }

    private onDocumentMouseMove = (event) => {
        event.preventDefault();
        const rect: ClientRect = this._domElement.getBoundingClientRect();
        this._mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this._mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
        this._raycaster.setFromCamera(this._mouse, this._camera);
        if (!this._selected) { // 
            var intersects = this._raycaster.intersectObjects(this._draggables, true);
            if (intersects.length > 0) {
                let found = false;
                intersects[0].object.traverseAncestors((obj: EditableGroup) => {
                    if (obj.isEditableGroup && !found) {
                        found = true;
                        this._groupHovered = obj;
                    }
                });

            } else {
                this._groupHovered = null;
            }

            this._draggables.forEach(d => {
                if (d == this._groupHovered) {
                    this._groupHovered.setState(EditableGroupState.editor);
                } else {
                    d.setState(EditableGroupState.show);
                }
            });
        }

    }

    private onDocumentMouseDown = (event) => {
        event.preventDefault();
    }

    private onDocumentMouseCancel = (event) => {
        event.preventDefault();
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