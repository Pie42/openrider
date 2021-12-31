import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";
import keyMaps from "../constant/KeyboardConstants.js";

export default class RedoTool extends Tool {
    static get toolName() { return 'Redo'; }
    static get keyLabel() { return 'N'; }
    static get key() { return keyMaps['Redo']; }
    static get icon() { return 'redo'; }

    run() {
        this.track.undoManager.redo();
    }
}