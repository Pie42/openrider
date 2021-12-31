import Vector from "../../numeric/Vector.js";
import Track from "../../track/Track.js";
import Bike from "./Bike.js";

export default class PennyFarthing extends Bike {
    /**
     *
     * @param {Track} track
     * @param {BikeRunner} runner
     */
    constructor(track, runner) {
        super(track, runner);

        this.hitbox.size = 14;
        this.backWheel.size = 14;
        this.frontWheel.size = 100;

        this.headToBack.len = 200;
        this.headToBack.lengthTowards = 200;
        this.headToBack.springConstant = 0.2;
        this.headToBack.dampConstant = 0.9;

        this.frontToBack.len = 120;
        this.frontToBack.lengthTowards = 120;
        this.frontToBack.springConstant = 0.2;
        this.frontToBack.dampConstant = 0.9;

        this.headToFront.len = 90;
        this.headToFront.lengthTowards = 110;
        this.headToFront.springConstant = 0.2;
        this.headToFront.dampConstant = 0.7;

        this.rotationFactor = 8;
    }

    setBikeInitialState(startPos) {
        this.hitbox.pos = new Vector(startPos.x + 8.44808974446994, startPos.y - 98.74231766839972);
        this.hitbox.oldPos = this.hitbox.pos.clone();
        this.hitbox.displayPos = this.hitbox.pos.clone();
        this.backWheel.pos = new Vector(startPos.x - 46.537722561563385, startPos.y + 92.37115883419986);
        this.backWheel.oldPos = this.backWheel.pos.clone();
        this.backWheel.displayPos = this.backWheel.pos.clone();
        this.frontWheel.pos = new Vector(startPos.x + 38.08963281709342, startPos.y - 6.371158834199861);
        this.frontWheel.oldPos = this.frontWheel.pos.clone();
        this.frontWheel.displayPos = this.frontWheel.pos.clone();
    }

    turn() {
        this.direction = -this.direction;
        this.frontToBack.turn();
        let headToBack = this.headToBack.len;
        this.headToBack.len = this.headToFront.len;
        this.headToFront.len = headToBack;
    }
}