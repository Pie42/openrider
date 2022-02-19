import Control from '../keyboard/Control.js';
import * as KeyCode from '../keyboard/KeyCode.js';
import GhostParser from '../parser/GhostParser.js';
import BikeRunner from './BikeRunner.js';
import BikeRenderer from './instance/renderer/BikeRenderer.js';
import keyMap from '../constant/KeyboardConstants.js';

export default class PlayerRunner extends BikeRunner {
    constructor(track, bikeClass) {
        super(track, bikeClass);

        this.track.event.keyboard.registerControl('Up', keyMap['Up']);
        this.track.event.keyboard.registerControl('Down', keyMap['Down']);
        this.track.event.keyboard.registerControl('Left', keyMap['Left']);
        this.track.event.keyboard.registerControl('Right', keyMap['Right']);
        this.track.event.keyboard.registerControl('Z', keyMap['Z']);
        this.ghostReplay = undefined;
        this.ghostKeys = undefined;
        this.useGhost = true;
    }

    onHitTarget() {
        if (this.targetsReached.size >= this.track.targets.size) {
            let ghostString = GhostParser.generate(this);
            console.log(ghostString);
        }
    }

    onHitCheckpoint() {
        this.save();
        this.track.ghostRunners.forEach((runner) => {
            runner.save();
        });
    }

    updateControls() {
        let controls = new Map();
        controls.set('upPressed', this.track.event.keyboard.isDown('Up'));
        controls.set('downPressed', this.track.event.keyboard.isDown('Down'));
        controls.set('leftPressed', this.track.event.keyboard.isDown('Left'));
        controls.set('rightPressed', this.track.event.keyboard.isDown('Right'));
        controls.set('turnPressed', this.track.event.keyboard.isDown('Z'));

        if ([...controls.values()].some(Boolean)) {
            this.track.focalPoint = this.instance.hitbox;
            this.track.toolManager.active = false;
        }

        if (
            this.ghostKeys &&
            this.useGhost &&
            +this.ghostTime > this.track.time
        ) {
            this.ghostKeys.forEach((keyArray, mapKey) => {
                if (keyArray.includes(this.track.time.toString())) {
                    // this[mapKey] refers to the this.xxxPressed properties of BikeRunner
                    this[mapKey] = !this[mapKey];
                    this.instance.keyLog
                        .get(mapKey)
                        .push(this.track.time.toString());
                }
            });
            /*if (this.ghostReplay.time < this.track.time) {
                this.ghostReplay = undefined;
            }*/
        } else {
            controls.forEach((pressed, mapKey) => {
                // this[mapKey] refers to the this.xxxPressed properties of BikeRunner
                if (pressed !== this[mapKey]) {
                    this.instance.keyLog
                        .get(mapKey)
                        .push(this.track.time.toString());
                    this[mapKey] = pressed;
                }
            });
        }

        this.onHitCheckpoint();
    }

    importGhost(ghost) {
        this.ghostReplay = GhostParser.parse(ghost);
        this.ghostKeys = this.ghostReplay.get('keys');
        this.ghostTime = this.ghostReplay.get('time');
        /*let keys = {};
        for (let i in this.ghostReplay.keys) {
            this.keys[i] = this.ghostReplay.keys[i];
        }*/
    }

    renderInstance(ctx) {
        BikeRenderer.render(ctx, this.instance, 1);
    }
}
