import { SCENERY_BRUSH_IMAGE } from "../../../constant/ToolConstants.js";
import SceneryLine from "../../../item/line/SceneryLine.js";
import Control from "../../../keyboard/Control.js";
import * as KeyCode from "../../../keyboard/KeyCode.js";
import BrushTool from "./BrushTool.js";
import keyMaps from "../../../constant/KeyboardConstants.js";

export default class SceneryBrushTool extends BrushTool {
    static get toolName() { return 'Scenery Brush'; }
    static get keyLabel() { return 'S'; }
    static get key() { return keyMaps['Scenery Brush']; }
    static get icon() { return SCENERY_BRUSH_IMAGE; }
    static get lineClass() { return SceneryLine; }
}