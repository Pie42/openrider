import keyMaps from "../constant/KeyboardConstants.js";

export default class Keyboard {
    constructor() {
        this.controls = new Map();
        this.holding = new Map();
        this.firedOnce = new Map();
    }

    registerControl(name, control) {
        this.controls.set(name, control);
    }

    isDown(name) {
        let holding = !!this.holding.get(name);
        let fireOnce = this.controls.get(name).fireOnce;
        let firedOnce = !!this.firedOnce.get(name);

        if (fireOnce && !firedOnce && holding) {
            this.firedOnce.set(name, true);
            return true;
        }

        return holding && (!fireOnce || !firedOnce);
    }

    test(control, e) {
        let matches = control.codes.map(i=>i%256).indexOf(e.which);
        if (matches >= 0) {
            let match = control.codes[matches] >> 8;
            // testing for each modifier
            return (!e.ctrlKey ^ (match & Keyboard.CTRL))
                && (!e.altKey ^ (match & Keyboard.ALT))
                && (!e.shiftKey ^ (match & Keyboard.SHIFT));
        }
        else {
            return 0;
        }
    }

    onKeyDown(e) {
        if (document.activeElement == document.body) {
            this.controls.forEach((control, key) => {
                if (this.test(control, e)) {
                    e.preventDefault();
                    if (control.repeat) {
                        document.dispatchEvent(new CustomEvent('keyboarddown', { detail: key }));
                    } else if (!this.holding.get(key)) {
                        this.holding.set(key, true);
                        document.dispatchEvent(new CustomEvent('keyboarddown', { detail: key }));
                    }
                }
            });
        }
        else if (document.activeElement.localName == 'input' && e.key == 'Enter') {
            document.getElementById(document.activeElement.dataset.associatedButton).click();
        }
    }

    onKeyUp(e) {
        if (document.activeElement == document.body) {
            this.controls.forEach((control, key) => {
                if (this.test(control, e)) {
                    e.preventDefault();
                    if (this.holding.get(key)) {
                        this.holding.set(key, false);
                        this.firedOnce.set(key, false);
                        document.dispatchEvent(new CustomEvent('keyboardup', { detail: key }));
                    }
                }
            });
        }
    }
}

Keyboard.NONE = 0;
Keyboard.CTRL = 1;
Keyboard.ALT = 2;
Keyboard.SHIFT = 4;