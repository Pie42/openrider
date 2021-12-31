import { SLOWMO_IMAGE } from "../../constant/ToolConstants.js";
import SlowMo from "../../item/SlowMo.js";
import ItemTool from "./ItemTool.js";
import Keyboard from "../../keyboard/Keyboard.js";
import Control from "../../keyboard/Control.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import keyMaps from "../../constant/KeyboardConstants.js";

export default class SlowMoTool extends ItemTool {
    static get toolName() { return 'Slow-Motion'; }
    static get keyLabel() { return 'Shift+S'; }
    static get key() { return keyMaps['Slow-Motion']; }
    static get icon() { return SLOWMO_IMAGE; }
    static get itemClass() { return SlowMo; }
}