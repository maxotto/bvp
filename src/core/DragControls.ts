import { EditableGroupState, EditableGroup } from '../core/EditableGroup';
import { Camera, Plane, Raycaster, Vector2, Vector3, Matrix4, Mesh, EventDispatcher, Scene } from 'three';
import { World } from '../types';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

export class DragControls extends EventDispatcher {
    private _camera: Camera;
    private _scene: Scene;
    private _transformControls: TransformControls;
    private _domElement: HTMLElement;
    private _plane: Plane = new Plane();
    private _mouse: Vector2 = new Vector2();
    private _offset: Vector3 = new Vector3();
    private _iniPosition: Vector3 = new Vector3();
    private _intersection: Vector3 = new Vector3();
    private _worldPosition: Vector3 = new Vector3();
    private _inverseMatrix: Matrix4 = new Matrix4();
    private _resizer: Mesh = null;
    private _groupHovered: EditableGroup = null;
    private _selected: EditableGroup = null;
    private _isDragging: boolean = false;
    private _draggables: EditableGroup[] = [];

    constructor(private _world: World) {
        super();
        //collect Editables into _draggables array
        this._camera = this._world.camera;
        this._scene = this._world.scene;
        this._domElement = this._world.renderer.domElement;
        this._transformControls = new TransformControls(this._camera, this._domElement);
        this._transformControls.setMode('translate');
        this._scene.add(this._transformControls);

        this._scene.traverse((e: EditableGroup) => {
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
        document.addEventListener('keydown', this.onDocumentKeyDown, false);
    }

    public deactivate() {
        this._domElement.style.cursor = 'auto';
        this._groupHovered = null;
        this._selected = null;
        this._draggables.forEach(d => {
            d.setState(EditableGroupState.show);
        });
        this._transformControls.detach();
        this._domElement.removeEventListener('mousemove', this.onDocumentMouseMove, false);
        this._domElement.removeEventListener('mousedown', this.onDocumentMouseDown, false);
        this._domElement.removeEventListener('mouseup', this.onDocumentMouseCancel, false);
        this._domElement.removeEventListener('mouseleave', this.onDocumentMouseCancel, false);
        this._domElement.removeEventListener('touchmove', this.onDocumentTouchMove, false);
        this._domElement.removeEventListener('touchstart', this.onDocumentTouchStart, false);
        this._domElement.removeEventListener('touchend', this.onDocumentTouchEnd, false);
        document.removeEventListener('keydown', this.onDocumentKeyDown, false);
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
        let localPosition: Vector3 = new Vector3();
        let globalPosition: Vector3 = new Vector3();

        localPosition.copy(this._intersection.sub(this._offset).applyMatrix4(this._inverseMatrix));
        const resizerType: string = this._resizer.userData.params.type;
        if (resizerType == 'centralPoint') {
            globalPosition.copy(this._iniPosition).add(localPosition);
            editableGroup.position.copy(globalPosition);
        } else {
            console.log('Why? resizerType =', resizerType);
        }
    }


    private onDocumentKeyDown = (event) => {
        if (event.type === 'keydown') {
            var alt = event.altKey ? 'Alt-' : '';
            var ctrl = event.ctrlKey ? 'Ctrl-' : '';
            var buttonPressed = alt + ctrl + event.code;
            // console.log(buttonPressed);
            switch (buttonPressed) {
                case 'Escape': //Stop to show editor
                    this._selected = null;
                    this.attachTransformControl();
                    break;
                case 'Alt-KeyS': // Scale mode toggle   
                    if (this._transformControls.getMode() !== 'scale') {
                        this._transformControls.setMode('scale');
                    } else {
                        this._transformControls.setMode('translate');
                    }
                    // TODO show indicator for mode in ui.dat window
                    break;
            }
        }
    }


    private onDocumentMouseMove = (event) => {
        event.preventDefault();

        const rect: ClientRect = this._domElement.getBoundingClientRect();
        this._mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this._mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster: Raycaster = new Raycaster();

        raycaster.setFromCamera(this._mouse, this._camera);

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


    private attachTransformControl() {
        if (this._selected) {
            this.dispatchEvent({ type: 'editableselected', object: this._selected });
            this._transformControls.attach(this._selected);
        } else {
            this._transformControls.detach();
            this.dispatchEvent({ type: 'editabledeselected' });
        }
    }

    private onDocumentMouseDown = (event) => {
        event.preventDefault();
        if (this._groupHovered) {
            this._selected = this._groupHovered;
        }
        this.attachTransformControl();
    }

    private onDocumentMouseCancel = (event) => {
        event.preventDefault();
        this.dispatchEvent({ type: 'dragend', object: this._selected });
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