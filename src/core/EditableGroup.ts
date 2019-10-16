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
    private _centerSphere: Mesh;
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
        if (this._state != _state) {
            this._state = _state;
            this._updateFrame();
        }
    }

    private _updateFrame() {

        if (this._selectFrame) {
            super.remove(this._selectFrame);
            super.remove(this._resizers.tl);
            super.remove(this._resizers.tr);
            super.remove(this._resizers.bl);
            super.remove(this._resizers.br);
            super.remove(this._centerSphere);
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
            this._centerSphere = this._createSphere(new Vector3(0, 0, 0), (box.max.x - box.min.x) / 30, new Color(0x990000), { type: 'centralPoint', point: 'center' });
            super.add(this._centerSphere);

            this._createResizers(box);
        }
    }

    private _createResizers(box: Box3) {
        const z = 0;
        const w = box.max.x - box.min.x;
        const h = box.max.y - box.min.y;
        const diameter = w / 25;
        this._resizers = {
            tl: this._createSphere(new Vector3(-w / 2, h / 2, z), diameter, new Color(0x55dd77), { type: 'resizer', point: 'tl' }),
            tr: this._createSphere(new Vector3(w / 2, h / 2, z), diameter, new Color(0x55dd77), { type: 'resizer', point: 'tr' }),
            bl: this._createSphere(new Vector3(-w / 2, -h / 2, z), diameter, new Color(0x55dd77), { type: 'resizer', point: 'bl' }),
            br: this._createSphere(new Vector3(w / 2, -h / 2, z), diameter, new Color(0x55dd77), { type: 'resizer', point: 'br' }),
        };
        super.add(this._resizers.tl);
        super.add(this._resizers.tr);
        super.add(this._resizers.bl);
        super.add(this._resizers.br);
    }

    private _createSphere(position, size, color: Color, params, texture?) {
        const g = new SphereGeometry(size, 32, 32);
        const maretialConf = { color: color }
        if (texture) {
            maretialConf['map'] = texture;
            maretialConf['side'] = DoubleSide;
        }
        const material = new MeshStandardMaterial(maretialConf);
        const sphere = new Mesh(g, material);
        sphere.userData.params = params;
        sphere.name = params.type + '_' + params.point;
        sphere.position.x = position.x;
        sphere.position.y = position.y;
        sphere.position.z = position.z;
        return sphere;
    }

}

