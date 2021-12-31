import Tool from "./Tool.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import Control from "../keyboard/Control.js";
import keyMaps from "../constant/KeyboardConstants.js";

export default class FullscreenTool extends Tool {
    static get toolName() { return 'Toggle Fullscreen'; }
    static get keyLabel() { return 'F'; }
    static get key() { return keyMaps['Toggle Fullscreen']; }
    static get icon() { return 'expand'; }

    constructor(track) {
        super(track);

        this.target = this.track.canvas.parentElement;
    }

    run() {
        if (this.fullscreenElement()) {
            this.exitFullscreen();
        } else {
            this.requestFullscreen(this.target);
        }
    }

    fullscreenElement() {
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement ||
            null;
    }

    exitFullscreen() {
        let fn = document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.mozCancelFullScreen ||
            document.mozExitFullScreen ||
            document.msExitFullscreen;
        fn.call(document);
    }

    requestFullscreen(el) {
        let fn = el.requestFullscreen ||
            el.webkitRequestFullscreen ||
            el.mozRequestFullScreen ||
            el.msRequestFullscreen;
        fn.call(el);
    }
}