import { SOLID_BRUSH_IMAGE } from "../../../constant/ToolConstants.js";
import SolidLine from "../../../item/line/SolidLine.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import BrushTool from "./BrushTool.js";
import keyMaps from "../../../constant/KeyboardConstants.js";

export default class SolidBrushTool extends BrushTool {
    static get toolName() { return 'Solid Brush'; }
    static get keyLabel() { return 'A'; }
    static get key() { return keyMaps['Solid Brush']; }
    static get icon() { return SOLID_BRUSH_IMAGE; }
    static get lineClass() { return SolidLine; }
}