import { Group, Box3, WireframeGeometry, BoxGeometry, LineSegments, Object3D } from "three";
import { getGroupGeometry } from "../tools/helpers";

export enum EditableGroupState {
    'show',
    'editor'
}

export class EditableGroup extends Group {

    private _selectFrame: LineSegments;
    private _state = EditableGroupState.show;
    public isEditableGroup = true;

    constructor() {
        super();
    }


    public add(...object: Object3D[]) {
        super.add(...object);
        this._updateFrame();
        return this;
    }

    public setState(_state: EditableGroupState) {
        this._state = _state;
        this._updateFrame();
    }

    private _updateFrame() {

        if (this._selectFrame) this.remove(this._selectFrame);
        if (this._state == EditableGroupState.editor) {
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
    
            super.add(this._selectFrame);
        }
    }

}

