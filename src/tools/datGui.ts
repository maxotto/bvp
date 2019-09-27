import * as dat from 'dat.gui';

export class MyDataControls {
    private gui = new dat.GUI({ hideable: false });
    constructor() {
        var FizzyText = function () {
            this.message = 'dat.gui';
            this.speed = 0.8;
            this.displayOutline = false;
            this.explode = function () {
                console.log('Boooom');
            };
        };
        var text = new FizzyText();

        this.gui.add(text, 'message');
        this.gui.add(text, 'speed', -5, 5);
        this.gui.add(text, 'displayOutline');
        this.gui.add(text, 'explode');

    }
    show() {
        this.gui.show();
    }
    hide() {
        this.gui.hide();
    }
}