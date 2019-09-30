import * as dat from 'dat.gui';
import * as FileSaver from 'file-saver';
import { putWorldToXml } from "./WorldTools";

export class MyDataControls {
    private gui = new dat.GUI({ hideable: false });
    constructor(private world) {
        var FizzyText = function (world) {
            this.message = 'dat.gui';
            this.speed = 0.8;
            this.displayOutline = false;
            this.saveFile = () => {
                console.log('Lets save it');
                const xml = putWorldToXml(world);
                var blob = new Blob([xml], {type: "text/plain;charset=utf-8"});
                FileSaver.saveAs(blob, "scenario.xml");

            };
        };
        var text = new FizzyText(this.world);

        this.gui.add(text, 'message');
        this.gui.add(text, 'speed', -5, 5);
        this.gui.add(text, 'displayOutline');
        this.gui.add(text, 'saveFile').name('Save XML');

    }
    show() {
        this.gui.show();
    }
    hide() {
        this.gui.hide();
    }
}