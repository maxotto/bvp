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
    Vector3,
    Color,
    MeshStandardMaterial
} from "three";

import { promisifyLoader, forEachPromise, getGroupGeometry, getCameraState, createSphere } from '../tools/helpers';

export enum EditableGroupState {
    'show',
    'editor'
}

export class EditableGroup extends Group {

    private _selectFrame: LineSegments;

    public iniData: {
        width: number,
    };

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

        if (this._state == EditableGroupState.editor) {
            const gg = getGroupGeometry(this);
            const box = gg.box;
            var wireframe = new WireframeGeometry(new BoxGeometry(
                box.max.x - box.min.x,
                box.max.y - box.min.y,
                box.max.z - box.min.z,
            ));
            wireframe.scale(1 / this.scale.x, 1 / this.scale.y, 1 / this.scale.z);
            this._selectFrame = new LineSegments(wireframe);
            this._selectFrame.position.x = 0;
            this._selectFrame.position.y = 0;
            this._selectFrame.position.z = 0;
            //this._selectFrame.position.add(gg.center);
            super.add(this._selectFrame);
            this._createResizers();

        } else {
            super.remove(this._selectFrame);
            super.remove(this._centerSphere);
        }
    }

    private _createResizers() {
        const box = new Box3().setFromObject(this._selectFrame);
        const z = 0;
        const w = (box.max.x - box.min.x) / this.scale.x;
        const h = (box.max.y - box.min.y) / this.scale.y;
        const diameter = w / 25;
        this._centerSphere = this._createSphere(
            new Vector3(0, 0, 0),
            w / 30,
            new Color(0x990000),
            { type: 'centralPoint', point: 'center' }
        );
        // super.add(this._centerSphere);
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

