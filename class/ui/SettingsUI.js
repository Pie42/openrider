import UIView from "./UIView.js";
import UI from "./UI.js";
import Track from "../track/Track.js";
import keyMaps from "../constant/KeyboardConstants.js";
import { readableNames } from "../keyboard/KeyCode.js";
    
export default class SettingsUI extends UIView {
    createUI(state) {
        let keybindsDiv = document.createElement('div');

        this.keyboardEvtController = new AbortController();
        this.state = '';

        for (let i in keyMaps) {
            let spacingbr = document.createElement('br');
            spacingbr.style.width = '100%';
            spacingbr.style.content = '';

            let keydiv = document.createElement('div');
            keydiv.classList.add('settings');

            let p1 = document.createElement('p');
            p1.innerHTML = `${i} {keys: [`;
            keydiv.appendChild(p1);
            
            let controldiv = document.createElement('div');
            controldiv.classList.add('settings');
            controldiv.classList.add('settings-hover');
            
            let p2s = [],
                spaceps = [];
            for (let j in keyMaps[i]['codes']) {
                let code = keyMaps[i]['codes'][j],
                    p2 = document.createElement('p'),
                    spacep = document.createElement('p');

                p2.innerHTML = this.formatCode(code);
                p2.title = 'Click to remove!';
                spacep.innerHTML = ', ';
                p2.onclick = () => this.removeCode(state, i, j, p2, spacep, p2s, spaceps, controldiv);
                controldiv.appendChild(p2);
                controldiv.appendChild(spacep);

                p2s.push(p2);
                spaceps.push(spacep);
                if (j == keyMaps[i]['codes'].length - 1) {
                    spacep.style.display = 'none';
                }
            }
            let addButton = document.createElement('p');
            addButton.innerHTML = ' (add)';
            addButton.onclick = () => this.addCode(state, i, p2s, spaceps, addButton, controldiv);
            controldiv.appendChild(addButton);
            keydiv.appendChild(controldiv);

            let p3 = document.createElement('p');
            p3.innerHTML = '], fire once: ';
            keydiv.appendChild(p3);

            let fireoncediv = document.createElement('div');
            fireoncediv.classList.add('settings');
            fireoncediv.classList.add('settings-hover');
            let p4 = document.createElement('p');
            p4.innerHTML = keyMaps[i]?.['fireonce'] ? 'true' : 'false';
            p4.title = 'Click to change!';
            p4.onclick = () => this.changeFireOnce(state, p4, i);
            fireoncediv.appendChild(p4);
            keydiv.appendChild(fireoncediv);

            let p5 = document.createElement('p');
            p5.innerHTML = ', hold to activate: ';
            keydiv.appendChild(p5);

            let holddiv = document.createElement('div');
            holddiv.classList.add('settings');
            holddiv.classList.add('settings-hover');
            let p6 = document.createElement('p');
            p6.innerHTML = keyMaps[i]?.['repeat'] ? 'true' : 'false';
            p6.title = 'Click to change!'
            p6.onclick = () => this.changeFireOnce(state, p4, i);
            holddiv.appendChild(p6);
            keydiv.appendChild(holddiv);

            let p7 = document.createElement('p');
            p7.innerHTML = '}\n';
            keydiv.appendChild(p7);

            keybindsDiv.appendChild(keydiv);
            keybindsDiv.appendChild(spacingbr);
        }

        let backButton = document.createElement('button');
        backButton.style.display = 'block';
        backButton.innerHTML = 'Back';
        backButton.addEventListener('click', () => UI.swapUI('editor'));

        this.ui.appendChild(keybindsDiv);
        this.ui.appendChild(backButton);
    }

    formatCode(code) {
        return (code & 256 ? 'ctrl + ' : '') +
               (code & 512 ? 'alt + ' : '') + 
               (code & 1024 ? 'shift + ' : '') + 
               (readableNames[code % 256] || '');
    }

    updateControl(state, name) {
        state.track.event.keyboard.registerControl(name, keyMaps[name]);
        localStorage.setItem('keys', JSON.stringify(keyMaps));
    }

    removeCode(state, i, index, p2, spacep, p2s, spaceps, controldiv) {
        if (!this.state) {
            controldiv.removeChild(p2);
            controldiv.removeChild(spacep);
            if (index == spaceps.length - 1 && index > 0) {
                spaceps[index - 1].style.display = 'none';
            }
            keyMaps[i]['codes'].splice(index, 1);
            p2s.splice(index, 1);
            spaceps.splice(index, 1);
            this.updateControl(state, i);
        }
    }

    addCode(state, i, p2s, spaceps, addButton, controldiv) {
        if (!this.state) {
            this.state = 'add';
            state.track.event.detachKeyboardEvt();
            let key = {ctrl: false, alt: false, shift: false, code: 0};

            let p2 = document.createElement('p');
            p2.title = 'Click to remove!';
            p2s.push(p2);
            controldiv.insertBefore(p2, addButton);

            let spacep = document.createElement('p');
            spacep.innerHTML = ', ';
            spacep.style.display = 'none';
            spaceps.push(spacep);
            controldiv.insertBefore(spacep, addButton);
            if (spaceps.length > 1) {
                spaceps[spaceps.length - 2].style.display = '';
            };
            p2.onclick = () => {this.removeCode(state, i, spaceps.length - 1, p2, spacep, p2s, spaceps, controldiv)};

            document.addEventListener('keydown', e => this.onKeyDown(e, key, p2), { signal: this.keyboardEvtController.signal });
            document.addEventListener('keyup', e => this.onKeyUp(e, key, state, i), { signal: this.keyboardEvtController.signal });
        }
    }

    onKeyDown(e, key, p2) {
        e.preventDefault();
        if (e.keyCode == 17) {
            key.ctrl = true;
        }
        else if (e.keyCode == 18) {
            key.alt = true;
        }
        else if (e.keyCode == 16) {
            key.shift = true;
        }
        else {
            key.code = e.keyCode;
        }

        let code = key.ctrl * 256 + key.alt * 512 + key.shift * 1024 + key.code;
        p2.innerHTML = this.formatCode(code);
    }

    onKeyUp(e, key, state, i) {
        if (key.code && !e.altKey && !e.ctrlKey && !e.shiftKey) {
            let code = (key.ctrl || 0) * 256 + (key.alt || 0) * 512 + (key.shift || 0) * 1024 + key.code;
            keyMaps[i]['codes'].push(code);
            this.updateControl(state, i);
            state.track.event.attachKeyboardEvt();
            this.keyboardEvtController.abort();
            this.keyboardEvtController = new AbortController();
            this.state = '';
        }
    }

    changeFireOnce(state, p4, i) {
        keyMaps[i]['fireonce'] = !keyMaps[i]['fireonce'];
        p4.innerHTML = keyMaps[i]?.['fireonce'] ? 'true' : 'false';
        this.updateControl(state, i);
    }

    changeHold(state, p6, i) {
        keyMaps[i]['hold'] = !keyMaps[i]['hold'];
        p6.innerHTML = keyMaps[i]?.['hold'] ? 'true' : 'false';
        this.updateControl(state, i);
    }
}