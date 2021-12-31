import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";
import keyMaps from "../constant/KeyboardConstants.js";

//this is pretty confusingly named, since "RestartTool" is what enter does in frhd
export default class RestartTool extends Tool {
    static get toolName() { return 'Restart'; }
    static get keyLabel() { return 'Enter'; }
    static get key() { return keyMaps['Restart']; }
    static get icon() { return 'restart'; }

    run() {
        this.track.restart();
    }
}