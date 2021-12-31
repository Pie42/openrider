import UIView from './UIView.js';
import UI from './UI.js';
import Track from "../track/Track.js";
import GhostParser from "../parser/GhostParser.js";
    
export default class ExportUI extends UIView {
    createUI(state) {
        let exportTrackButton = document.createElement('button');
        exportTrackButton.style.display = 'block';
        exportTrackButton.innerHTML = 'Export track';
        exportTrackButton.addEventListener('click', () => this.handleExport(state));

        let exportGhostButton = document.createElement('button');
        exportGhostButton.style.display = 'block';
        exportGhostButton.innerHTML = 'Export ghost';
        exportGhostButton.addEventListener('click', () => this.handleGhostExport(state));

        let backButton = document.createElement('button');
        backButton.style.display = 'block';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click', () => UI.swapUI('editor'));

        this.ui.appendChild(exportTrackButton);
        this.ui.appendChild(exportGhostButton);
        this.ui.appendChild(backButton);
    }

    /**
     * 
     * @param {GameState} state 
     */
    handleExport(state) {
        state.manager.push('generator');
        UI.swapUI('editor');
    }

    handleGhostExport(state) {
        let ghostCode = GhostParser.generate(state.track.playerRunner);
        let downloadLink = document.createElement("a");
        downloadLink.download = "ghost.txt";
        let data = new Blob([ghostCode], { type: "text/plain" });
        let url = URL.createObjectURL(data);
        downloadLink.href = url;
        downloadLink.click();
        URL.revokeObjectURL(url);

        UI.swapUI('editor');
    }
}