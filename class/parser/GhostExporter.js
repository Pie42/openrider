import { HME } from "https://taisukef.github.io/h264-mp4-encoder.es/h264-mp4-encoder.es.js";
import GhostRunner from "../bike/GhostRunner.js";

export default class GhostExporter {
    constructor(stateManager) {
        window.HME = HME;
        window.ghostExporter = this;
        this.HME = HME;
        this.stateManager = stateManager;
        this.track = this.stateManager.track;
    }

    exportGhost(ghostCode) {
        //whoops lmao
        this.track = window.game.stateManager.track;
        this.track.playerRunner.reset();
        this.track.ghostRunners.forEach(runner => {
            runner.reset();
        });
        this.track.restart();
        this.track.pause(true, false);
        let ghost = new GhostRunner(this.track, ghostCode),
            index = this.track.ghostRunners.push(ghost);
        ghost.createBike();
        this.track.focalPoint = this.track.ghostRunners[index - 1].instance.hitbox;
        //window.game.setFPS(60);
        let len = +ghost.finalTime,
            canvas = this.track.canvas,
            ctx = canvas.getContext('2d'),
            progress = 0,
            ft = 1000 / 60,
            ft2 = 1000 / 60;
        window.hackyFixToGetThisToStopBreaking = true;
        this.HME.createH264MP4Encoder().then(async encoder => {
            encoder.width = canvas.width;
            encoder.height = canvas.height;
            encoder.frameRate = 60;
            let canvas2 = document.createElement('canvas'),
                ctx2 = canvas2.getContext('2d');
            canvas2.width = canvas.width;
            canvas2.height = canvas.height;
            ctx2.fillStyle = '#ffffff';
            encoder.initialize();

            for (let i = 0; i < len; i++) {
                ctx2.fillRect(0, 0, canvas2.width, canvas2.height);
                ctx2.drawImage(canvas, 0, 0);
                encoder.addFrameRgba(ctx2.getImageData(0, 0, canvas2.width, canvas2.height).data);

                progress += ft / ft2;
                while (progress >= 1) {
                    this.stateManager.fixedUpdate(true);
                    progress--;
                }
                this.stateManager.update(progress, ft2, true);
                //progress++;
                this.stateManager.render(ctx);
                await new Promise(resolve => window.requestAnimationFrame(resolve));
            }

            encoder.finalize();
            const uint8Array = encoder.FS.readFile(encoder.outputFilename);
            this.download(URL.createObjectURL(new Blob([uint8Array], { type: "video/mp4" })), 'poggers ghost.mp4');
            encoder.delete();
            window.hackyFixToGetThisToStopBreaking = false;
        });
    }

    download(url, filename) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename || "download";
        anchor.click();
    }
}