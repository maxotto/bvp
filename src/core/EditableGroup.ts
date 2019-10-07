import { Group, Box3, WireframeGeometry, BoxGeometry, LineSegments, Object3D } from "three";
import { getGroupGeometry } from "../tools/helpers";

enum EditableGroupState {
    'show',
    'editor'
}

export class EditableGroup extends Group {

    private _selectFrame: LineSegments;
    private _state = EditableGroupState.editor;
    public isEditableGroup = true;

    constructor() {
        super();
    }


    public addChild(...object: Object3D[]) {
        super.add(...object);
        this._updateFrame();
        /*
        if (this.children.length == 1) {
            this.createFrame();
        } else {
        }
        */
        return this;
    }

    public setState(_state: EditableGroupState) {
        this._state = _state;
        if (this._state == EditableGroupState.editor) {
            this.add(this._selectFrame);
        } else {
            this.remove(this._selectFrame);
        }
    }

    public createFrame() {
        const box = new Box3().setFromObject(this);
        var wireframe = new WireframeGeometry(new BoxGeometry(
            box.max.x - box.min.x,
            box.max.y - box.min.y,
            box.max.z - box.min.z,
        ));

        this._selectFrame = new LineSegments(wireframe);
        this.add(this._selectFrame);
    }

    private _updateFrame() {
        this.remove(this._selectFrame);
        const box = new Box3().setFromObject(this);
        var wireframe = new WireframeGeometry(new BoxGeometry(
            box.max.x - box.min.x,
            box.max.y - box.min.y,
            box.max.z - box.min.z,
        ));
        this._selectFrame = new LineSegments(wireframe);
        this._selectFrame.position.x = 0;
        this._selectFrame.position.y = 0;
        this._selectFrame.position.z = (box.max.z - box.min.z) / 2;
        this.add(this._selectFrame);
    }

}

