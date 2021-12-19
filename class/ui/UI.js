import Track from "../track/Track.js";
import GameState from "../state/GameState.js";
import EditorUI from './EditorUI.js';
import ExportUI from './ExportUI.js';
import ImportUI from './ImportUI.js';
import RaceUI from './RaceUI.js';
import UploadUI from './UploadUI.js';

const ui = document.getElementById('ui');
export default class UI {
    static swapUI(key) {
        UI.clearUI();
        ui.replaceChildren(...UI.scenes[key].ui.childNodes);
        UI.currentUI = key;
    }

    static clearUI() {
        if (UI.currentUI) {
            UI.scenes[UI.currentUI].ui.replaceChildren(...ui.childNodes);
            UI.currentUI = '';
        }
    }

    static createUI(state) {
        this.scenes = {
            editor: new EditorUI(state),
            export: new ExportUI(state),
            import: new ImportUI(state),
            race: new RaceUI(state),
            upload: new UploadUI(state)
        };
    }

    static getToolbars() {
        return document.querySelectorAll('.toolbar');
    }

    static showToolbars() {
        UI.getToolbars().forEach(toolbar => toolbar.style.display = 'block');
    }

    static hideToolbars() {
        UI.getToolbars().forEach(toolbar => toolbar.style.display = 'none');
    }
}