import Control from "../keyboard/Control.js";
import * as KeyCode from "../keyboard/KeyCode.js";
import GhostParser from "../parser/GhostParser.js";
import BikeRunner from "./BikeRunner.js";
import BikeRenderer from "./instance/renderer/BikeRenderer.js";
import keyMap from "../constant/KeyboardConstants.js";

export default class PlayerRunner extends BikeRunner {
    constructor(track, bikeClass) {
        super(track, bikeClass);

        this.track.event.keyboard.registerControl('Up', keyMap['Up']);
        this.track.event.keyboard.registerControl('Down', keyMap['Down']);
        this.track.event.keyboard.registerControl('Left', keyMap['Left']);
        this.track.event.keyboard.registerControl('Right', keyMap['Right']);
        this.track.event.keyboard.registerControl('Z', keyMap['Z']);
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

        controls.forEach((pressed, mapKey) => {
            // this[mapKey] refers to the this.xxxPressed properties of BikeRunner
            if (pressed !== this[mapKey]) {
                this.instance.keyLog.get(mapKey).push(this.track.time.toString());
                this[mapKey] = pressed;
            }
        });

        if ([...controls.values()].some(Boolean)) {
            this.track.focalPoint = this.instance.hitbox;
            this.track.toolManager.active = false;
        }

        //hope this works
        this.onHitCheckpoint();
    }

    renderInstance(ctx) {
        BikeRenderer.render(ctx, this.instance, 1);
    }
}