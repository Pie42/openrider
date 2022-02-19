import UIView from './UIView.js';
import UI from './UI.js';
import Track from "../track/Track.js";
import GhostRunner from '../bike/GhostRunner.js';

export default class ImportUI extends UIView {
    createUI(state) {
        let importFileInput = document.createElement('input');
        importFileInput.type = 'file';
        importFileInput.id = 'import';
        importFileInput.style.display = 'none';
        importFileInput.addEventListener('change', () => this.handleTrackImport(state, importFileInput, 'file'));

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
        importButton.id = "importButton";
        importButton.addEventListener('click', () => {
            if (importTextArea.value) {
                this.handleTrackImport(state, importTextArea, 'textarea');
            }
            else if (importIdInput.value) {
                this.handleTrackImport(state, importIdInput, 'number');
            }
        });
        importTextArea.dataset['associatedButton'] = 'importButton';
        importIdInput.dataset['associatedButton'] = 'importButton';

        // this feels a bit hacky to me
        let spacingbr = document.createElement('br');
        spacingbr.style.width = '100%';
        spacingbr.style.content = '';

        let ghostImportFileInput = document.createElement('input');
        ghostImportFileInput.type = 'file';
        ghostImportFileInput.style.display = 'none';
        ghostImportFileInput.addEventListener('change', () => this.handleGhostImport(state, ghostImportFileInput, 'file'));

        let ghostImportFileButton = document.createElement('button');
        ghostImportFileButton.style.display = 'block';
        ghostImportFileButton.innerHTML = 'Import ghost from a file...';
        ghostImportFileButton.addEventListener('click', () => ghostImportFileInput.click());

        let ghostImportTextArea = document.createElement('textarea');
        ghostImportTextArea.style.display = 'block';
        ghostImportTextArea.placeholder = 'Paste a ghost here...';

        let ghostImportButton = document.createElement('button');
        ghostImportButton.style.display = 'block';
        ghostImportButton.innerHTML = 'Import ghost';
        ghostImportButton.id = 'ghostImportButton';
        ghostImportButton.addEventListener('click', () => ghostImportTextArea.value && this.handleGhostImport(state, ghostImportTextArea, 'textarea'));
        ghostImportTextArea.dataset['associatedButton'] = 'ghostImportButton';

        let ghostPlayerImportButton = document.createElement('button');
        ghostPlayerImportButton.style.display = 'block';
        ghostPlayerImportButton.innerHTML = 'Import ghost to player';
        ghostPlayerImportButton.id = 'ghostPlayerImportButton';
        ghostPlayerImportButton.addEventListener('click', () => ghostImportTextArea.value && this.handlePlayerGhostImport(state, ghostImportTextArea));

        let backButton = document.createElement('button');
        backButton.style.display = 'block';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click', () => UI.swapUI('editor'));

        this.ui.appendChild(importFileInput);
        this.ui.appendChild(importFileButton);
        this.ui.appendChild(importTextArea);
        this.ui.appendChild(importIdInput);
        this.ui.appendChild(importButton);
        this.ui.appendChild(spacingbr);
        this.ui.appendChild(ghostImportFileInput);
        this.ui.appendChild(ghostImportFileButton);
        this.ui.appendChild(ghostImportTextArea);
        this.ui.appendChild(ghostImportButton);
        this.ui.appendChild(ghostPlayerImportButton);
        this.ui.appendChild(backButton);
    }

    /**
     * 
     * @param {GameState} state 
     * @param {*} importInput 
     * @param {string} type
     */
    handleTrackImport(state, importInput, type) {
        // for importing from a file
        if (type == 'file') {
            let file = importInput.files[0];

            if (file) {
                let reader = new FileReader();
                reader.onload = () => {
                    this.importTrack(state, importInput, reader.result);
                };

                reader.readAsText(file);
            }
        }
        // for importing by pasting the code
        else if (type == 'textarea') {
            this.importTrack(state, importInput, importInput.value);
        }
        // for importing from a frhd track id
        // note: requires some method of getting cors
        else if (type == 'number') {
            fetch(`http://cdn.freeriderhd.com/free_rider_hd/tracks/prd/${importInput.value}/track-data-v1.js`)
                .then((i) => i.text())
                .then((i) => {
                    let code = i.match(/"code":"(.+?)"/)?.[1];
                    if (code) {
                        this.importTrack(state, importInput, code);
                    }
                    else {
                        console.error(`Track import from id ${importInput.value} failed!`);
                    }
                })
        }
    }

    importTrack(state, importInput, code) {
        UI.hideToolbars();
        state.track.canvas.style.cursor = 'none';
        state.track.event.detachAllEvt();
        state.track = new Track(state.track.canvas, { trackCode: code });
        state.getTrackParser();
        state.manager.pop();
        importInput.value && (importInput.value = '');
        UI.swapUI('editor');
    }

    handleGhostImport(state, importInput, type) {
        if (type == 'file') {
            let file = importInput.files[0];

            if (file) {
                let reader = new FileReader();
                reader.onload = () => {
                    this.importGhost(state, importInput, reader.result);
                };

                reader.readAsText(file);
            }
        }
        else if (type == 'textarea') {
            this.importGhost(state, importInput, importInput.value);
        }
    }

    handlePlayerGhostImport(state, importInput) {
        state.track.playerRunner.importGhost(importInput.value);
    }

    importGhost(state, importInput, code) {
        let ghost = new GhostRunner(state.track, code);
        state.track.ghostRunners.push(ghost);
        ghost.createBike();
        importInput.value && (importInput.value = '');
        UI.swapUI('editor');
    }
}
