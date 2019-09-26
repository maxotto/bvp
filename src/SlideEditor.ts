import { World } from "./types";

export class SlideEditor {
    constructor(private world: World) {

    }

    public get EditorWorld() {
        return this.world;
    }

    onMouseEvent(event) {
        // console.log(event);
    }

    onKeyboardEvent(event) {
        // console.log(event.code);
    }
}