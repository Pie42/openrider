import UIView from "./UIView.js";
import UI from "./UI.js";

export default class EditorUI extends UIView {
    createUI(state) {
        let importButton = document.createElement('button');
        importButton.innerHTML = 'Import';
        importButton.addEventListener('click', () => UI.swapUI('import'));

        let exportButton = document.createElement('button');
        exportButton.innerHTML = 'Export';
        exportButton.addEventListener('click', () => UI.swapUI('export'));

        let uploadButton = document.createElement('button');
        uploadButton.innerHTML = 'Upload';
        uploadButton.addEventListener('click', () => this.handleUpload(state));

        let settingsButton = document.createElement('button');
        settingsButton.innerHTML = 'Settings';
        settingsButton.addEventListener('click', () => UI.swapUI('settings'));

        this.ui.appendChild(importButton);
        this.ui.appendChild(exportButton);
        this.ui.appendChild(uploadButton);
        this.ui.appendChild(settingsButton);
    }

    /**
     * 
     * @param {GameState} state 
     */
    handleUpload(state) {
        //UI.clearUI();
        state.manager.getState('generator').isTrackUpload = true;
        state.manager.push('generator');
    }
}