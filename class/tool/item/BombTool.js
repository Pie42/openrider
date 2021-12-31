import { BOMB_IMAGE } from "../../constant/ToolConstants.js";
import Bomb from "../../item/Bomb.js";
import ItemTool from "./ItemTool.js";
import Control from "../../keyboard/Control.js";
import * as KeyCode from "../../keyboard/KeyCode.js";
import Keyboard from "../../keyboard/Keyboard.js";
import keyMaps from "../../constant/KeyboardConstants.js";

export default class BombTool extends ItemTool {
    static get toolName() { return 'Bomb'; }
    static get keyLabel() { return 'Shift+O'; }
    static get key() { return keyMaps['Bomb']; }
    static get icon() { return BOMB_IMAGE; }
    static get itemClass() { return Bomb; }
}