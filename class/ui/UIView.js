import Track from "../track/Track.js";

export default class UIView {
    constructor(state) {
        this.ui = document.createElement('div');
        this.createUI(state);
    }

    createUI(state) { }
}