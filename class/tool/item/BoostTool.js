import DirectionalItemTool from "./DirectionalItemTool.js";
import { BOOST_IMAGE } from "../../constant/ToolConstants.js";
import Boost from "../../item/directional/Boost.js";
import Keyboard from "../../keyboard/Keyboard.js";
import Control from "../../keyboard/Control.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import keyMaps from "../../constant/KeyboardConstants.js";

export default class BoostTool extends DirectionalItemTool {
    static get toolName() { return 'Boost'; }
    static get keyLabel() { return 'Shift+B'; }
    static get key() { return keyMaps['Boost']; }
    static get icon() { return BOOST_IMAGE; }
    static get itemClass() { return Boost; }
}