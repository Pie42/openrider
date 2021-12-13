import Track from "../track/Track.js";
import GameState from "../state/GameState.js";

const ui = document.getElementById('ui');
export default class UI {
    static swapUI(key) {
        ui.replaceChildren(...UI.scenes[key].childNodes);
        UI.currentUI = key;
    }

    static clearUI() {
        if (UI?.currentUI) {
            UI.scenes[UI.currentUI].replaceChildren(...ui.childNodes);
        }
    }

    static createUI(state) {
        UI.createEditorUI(state);
        UI.createRaceUI(state);
        UI.createUploadUI();
    }

    /**
     * 
     * @param {GameState} state 
     */
    static createEditorUI(state) {
        let importButton = document.createElement('button');
        importButton.addEventListener('click', () => importInput.click());
        let importLabel = document.createElement('label');
        importLabel.setAttribute('for', 'import');
        importLabel.innerHTML = 'Import';
        importButton.appendChild(importLabel);

        let importInput = document.createElement('input');
        importInput.type = 'file';
        importInput.id = 'import';
        importInput.style.display = 'none';
        importInput.addEventListener('change', () => UI.handleImport(state, importInput));

        let exportButton = document.createElement('button');
        exportButton.innerHTML = 'Export';
        exportButton.addEventListener('click', () => UI.handleExport(state));

        let uploadButton = document.createElement('button');
        uploadButton.innerHTML = 'Upload';
        uploadButton.addEventListener('click', () => UI.handleUpload(state));

        //console.log(UI, state, UI.scenes);
        window.UI = UI;
        window.state = state;
        UI.scenes.editor.appendChild(importButton);
        UI.scenes.editor.appendChild(importInput);
        UI.scenes.editor.appendChild(exportButton);
        UI.scenes.editor.appendChild(uploadButton);
    }

    static createRaceUI(state) {

    }

    static createUploadUI() {

    }

    /**
     * 
     * @param {GameState} state 
     * @param {*} importInput 
     */
    static handleImport(state, importInput) {
        let file = importInput.files[0];

        if (file) {
            let reader = new FileReader();
            reader.onload = () => {
                UI.hideToolbars();
                state.track.canvas.style.cursor = 'none';
                state.track.event.detachAllEvt();
                state.track = new Track(state.track.canvas, { trackCode: reader.result });
                state.getTrackParser();
                state.manager.pop();
            };

            reader.readAsText(file);
        }
    }

    /**
     * 
     * @param {GameState} state 
     */
    static handleExport(state) {
        state.manager.push('generator');
    }

    /**
     * 
     * @param {GameState} state 
     */
    static handleUpload(state) {
        //UI.clearUI();
        state.manager.getState('generator').isTrackUpload = true;
        state.manager.push('generator');
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

UI.scenes = {
    editor: document.createElement('div'),
    upload: document.createElement('div'),
    race: document.createElement('div')
};
