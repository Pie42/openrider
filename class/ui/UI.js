import Track from "../track/Track.js";
import GameState from "../state/GameState.js";

const ui = document.getElementById('ui');
export default class UI {
    static swapUI(key) {
        UI.clearUI();
        ui.replaceChildren(...UI.scenes[key].childNodes);
        UI.currentUI = key;
    }

    static clearUI() {
        if (UI.currentUI) {
            UI.scenes[UI.currentUI].replaceChildren(...ui.childNodes);
            UI.currentUI = '';
        }
    }

    static createUI(state) {
        UI.createEditorUI(state);
        UI.createRaceUI(state);
        UI.createUploadUI();
        UI.createImportUI(state);
    }

    /**
     * 
     * @param {GameState} state 
     */
    static createEditorUI(state) {
        let importButton = document.createElement('button');
        importButton.innerHTML = 'Import';
        importButton.addEventListener('click', () => UI.swapUI('import'));

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
        UI.scenes.editor.appendChild(exportButton);
        UI.scenes.editor.appendChild(uploadButton);
    }

    static createRaceUI(state) {

    }

    static createUploadUI() {

    }

    static createImportUI(state) {
        let importFileInput = document.createElement('input');
        importFileInput.type = 'file';
        importFileInput.id = 'import';
        importFileInput.style.display = 'none';
        importFileInput.addEventListener('change', () => UI.handleImport(state, importFileInput, 'file'));

        let importFileButton = document.createElement('button');
        importFileButton.style.display = 'block';
        importFileButton.innerHTML = 'Import from a file...';
        importFileButton.addEventListener('click', () => importFileInput.click());

        let importTextArea = document.createElement('textarea');
        importTextArea.style.display = 'block';
        importTextArea.placeholder = 'Paste a track code here...';

        let importIdInput = document.createElement('input');
        importIdInput.style.display = 'block';
        importIdInput.type = 'number';
        importIdInput.placeholder = 'Paste a frhd track id here...';

        let importButton = document.createElement('button');
        importButton.style.display = 'block';
        importButton.innerHTML = 'Import';
        importButton.addEventListener('click', () => {
            if (importTextArea.value) {
                UI.handleImport(state, importTextArea, 'textarea');
            }
            else if (importIdInput.value) {
                UI.handleImport(state, importIdInput, 'number');
            }
        });

        UI.scenes.import.appendChild(importFileInput);
        UI.scenes.import.appendChild(importFileButton);
        UI.scenes.import.appendChild(importTextArea);
        UI.scenes.import.appendChild(importIdInput);
        UI.scenes.import.appendChild(importButton);
    }

    /**
     * 
     * @param {GameState} state 
     * @param {*} importInput 
     * @param {string} type
     */
    static handleImport(state, importInput, type) {
        if (type == 'file') {
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
                    UI.swapUI('editor');
                };

                reader.readAsText(file);
            }
        }
        //for importing by pasting the code
        else if (type == 'textarea') {
            UI.hideToolbars();
            state.track.canvas.style.cursor = 'none';
            state.track.event.detachAllEvt();
            state.track = new Track(state.track.canvas, { trackCode: importInput.value });
            state.getTrackParser();
            state.manager.pop();
            importInput.value = '';
            UI.swapUI('editor');
        }
        //for importing from a frhd track id
        else if (type == 'number') {
            fetch(`http://cdn.freeriderhd.com/free_rider_hd/tracks/prd/${importInput.value}/track-data-v1.js`)
                .then((i) => i.text())
                .then((i) => {
                    let code = i.match(/"code"\:"(.+?)"/)?.[1];
                    if (code) {
                        UI.hideToolbars();
                        state.track.canvas.style.cursor = 'none';
                        state.track.event.detachAllEvt();
                        state.track = new Track(state.track.canvas, { trackCode: code });
                        state.getTrackParser();
                        state.manager.pop();
                        importInput.value = '';
                        UI.swapUI('editor');
                    }
                    else {
                        console.error(`Track import from id ${importInput.value} failed!`);
                    }
                })
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
    race: document.createElement('div'),
    import: document.createElement('div')
};
