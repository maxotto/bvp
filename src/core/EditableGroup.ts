import {
    Group,
    Box3,
    WireframeGeometry,
    BoxGeometry,
    LineSegments,
    Object3D,
    Mesh,
    SphereGeometry,
    DoubleSide,
    MeshPhongMaterial,
    Vector3,
    Color,
    MeshStandardMaterial
} from "three";
import { getGroupGeometry } from "../tools/helpers";

export enum EditableGroupState {
    'show',
    'editor'
}

export class EditableGroup extends Group {

    private _selectFrame: LineSegments;
    private _resizers: {
        tl: Mesh,
        tr: Mesh,
        bl: Mesh,
        br: Mesh,
    }
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

        if (this._selectFrame) {
            super.remove(this._selectFrame);
            super.remove(this._resizers.tl);
            super.remove(this._resizers.tr);
            super.remove(this._resizers.bl);
            super.remove(this._resizers.br);
        }
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
            this._createResizers(box);
        }
    }

    private _createResizers(box: Box3) {
        const z = 0;
        const w = box.max.x - box.min.x;
        const h = box.max.y - box.min.y;
        const diameter = 10;
        this._resizers = {
            tl: this._createSphere(new Vector3(-w/2, h/2, z), diameter, '0x55dd77'),
            tr: this._createSphere(new Vector3(w/2, h/2, z), diameter, '0x55dd77'),
            bl: this._createSphere(new Vector3(-w/2, -h/2, z), diameter, '0x55dd77'),
            br: this._createSphere(new Vector3(w/2, -h/2, z), diameter, '0x55dd77'),
        };
        super.add(this._resizers.tl);
        super.add(this._resizers.tr);
        super.add(this._resizers.bl);
        super.add(this._resizers.br);
    }

    private _createSphere(position, size, color, texture?){
        const g = new SphereGeometry(size, 32, 32);
        const maretialConf = { color: color }
        if (texture) {
            maretialConf['map'] = texture;
            maretialConf['side'] = DoubleSide;
        }
        const material = new MeshStandardMaterial(maretialConf);
        const sphere = new Mesh(g, material);
        sphere.position.x = position.x;
        sphere.position.y = position.y;
        sphere.position.z = position.z;
        return sphere;
    }

}

