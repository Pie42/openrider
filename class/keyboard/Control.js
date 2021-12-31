import Keyboard from "./Keyboard.js";

export default class Control {
    constructor(keyCodes, modifiers = Keyboard.NONE, fireOnce = false, repeat = false) {
    //constructor(keyMap) {
        if (!Array.isArray(keyCodes)) {
            keyCodes = [keyCodes];
        }

        this.codes = keyCodes;
        this.modifiers = modifiers;
        this.fireOnce = fireOnce;
        this.repeat = repeat;
    }
}