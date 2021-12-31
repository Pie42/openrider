import BMX from "../bike/instance/BMX.js";
import MTB from "../bike/instance/MTB.js";
import PennyFarthing from "../bike/instance/PennyFarthing.js";
import Glider from "../bike/instance/Glider.js";
import BMXRenderer from "../bike/instance/renderer/BMXRenderer.js";
import MTBRenderer from "../bike/instance/renderer/MTBRenderer.js";
import PennyFarthingRenderer from "../bike/instance/renderer/PennyFarthingRenderer.js";

export const
    BIKE_MAP = { 'BMX': BMX, 'MTB': MTB, 'PennyFarthing': PennyFarthing, 'Glider': Glider },
    SWITCH_MAP = { 'BMX': MTB, 'MTB': BMX, 'PennyFarthing': PennyFarthing, 'Glider': Glider },
    RENDERER_MAP = { 'BMX': BMXRenderer, 'MTB': MTBRenderer, 'PennyFarthing': PennyFarthingRenderer, 'Glider': MTBRenderer };