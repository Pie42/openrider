import Vector from "../../numeric/Vector.js";
import Track from "../../track/Track.js";
import Bike from "./Bike.js";

function mod(x, y) {
    return ((x % y) + y) % y;
}

export default class MTB extends Bike {
    /**
     *
     * @param {Track} track
     * @param {BikeRunner} runner
     */
    constructor(track, runner) {
        super(track, runner);

        this.hitbox.size = 14;
        this.backWheel.size = 14;
        this.frontWheel.size = 14;

        this.headToBack.len = 47;
        this.headToBack.lengthTowards = 47;
        this.headToBack.springConstant = 0.2;
        this.headToBack.dampConstant = 0.3;

        this.frontToBack.len = 45;
        this.frontToBack.lengthTowards = 45;
        this.frontToBack.springConstant = 0.2;
        this.frontToBack.dampConstant = 0.3;

        this.headToFront.len = 45;
        this.headToFront.lengthTowards = 45;
        this.headToFront.springConstant = 0.2;
        this.headToFront.dampConstant = 0.3;

        this.rotationFactor = 8;

        //idk i made all of these numbers up
        this.aspectRatio = 1.0;
        this.efficiency = 0.85;
        this.dragCoefficient = 0.0002;
        this.liftCoefficient = 0.2;
        this.wingArea = 1.0;
        this.mass = 20.0;
        this.airDensity = 1.225;
        this.display = document.getElementById('physicsdisplay') || (()=>{let a = document.createElement('p'); a.id = 'physicsdisplay'; return document.body.children[0].appendChild(a)})()
    }

    setBikeInitialState(startPos) {
        this.hitbox.pos = new Vector(startPos.x + 2, startPos.y - 3);
        this.hitbox.oldPos = this.hitbox.pos.clone();
        this.hitbox.displayPos = this.hitbox.pos.clone();
        this.backWheel.pos = new Vector(startPos.x - 23, startPos.y + 35);
        this.backWheel.oldPos = this.backWheel.pos.clone();
        this.backWheel.displayPos = this.backWheel.pos.clone();
        this.frontWheel.pos = new Vector(startPos.x + 23, startPos.y + 35);
        this.frontWheel.oldPos = this.frontWheel.pos.clone();
        this.frontWheel.displayPos = this.frontWheel.pos.clone();
    }

    updatePhysics() {
        if (this.runner.turnPressed) {
            this.turn();
        }
        this.backWheel.speedValue += (this.runner.upPressed - this.backWheel.speedValue) / 10;
        let rotate = this.runner.leftPressed - this.runner.rightPressed;
        this.headToBack.lean(rotate * 5 * this.direction, 5);
        this.headToFront.lean(-rotate * 5 * this.direction, 5);
        this.frontToBack.rotate(rotate / this.rotationFactor);
        if (!rotate && this.runner.upPressed) {
            this.headToBack.lean(-7, 5);
            this.headToFront.lean(7, 5);
        }
        //L = .5 * Cl * r * V^2 * A
        //Cl = 2 * pi * angle (in radians)
        //D = .5 * Cd * r * V^2 * A
        //Cd = Cd0 + Cl^2 / ( pi * Ar * e)
        let velocity = this.frontWheel.velocity.add(this.backWheel.velocity.add(this.hitbox.velocity)).scale(1/3);
        let vangle = Math.atan2(velocity.y, velocity.x);
        //let centre = this.frontWheel.pos.add(this.backWheel.pos.add(this.hitbox.pos)).scale(1/3);
        let centre = this.frontWheel.pos.add(this.backWheel.pos).scale(1/2);
        //let angle = Math.atan2(this.hitbox.pos.y - this.frontWheel.pos.y, this.hitbox.pos.x - this.frontWheel.pos.x) - Math.atan2(-3 - 35, 2 - 23);
        let angle = Math.atan2(-this.hitbox.pos.y + centre.y, this.hitbox.pos.x - centre.x) - 1.4;
        let aoa = mod(angle - vangle, Math.PI);
        //let Cl = this.liftCoefficient * Math.PI * angle;
        //let Cl = this.liftCoefficient * -Math.sin(Math.atan2(velocity.y, velocity.x) - angle);
        let Cl = this.liftCoefficient * Math.sin(angle * 2);
        let L = 0.5 * Cl * this.airDensity * velocity.lengthSquared() * this.wingArea;
        let Cd = this.dragCoefficient + ((Cl ** 2) / (Math.PI * this.aspectRatio * this.efficiency));
        let D = 0.5 * Cd * this.airDensity * velocity.lengthSquared() * this.wingArea;
        //console.log(velocity, angle, Cl, L, Cd, D);
        //this.stuff = new Vector(-D, -L).scale(1 / 50);
        let sAngle = Math.sin(angle),
            cAngle = Math.cos(angle);
        this.stuff = new Vector(sAngle * L - cAngle * D, -cAngle * L + sAngle * D).scale(1 / 50);
        this.display.innerHTML = `angle: ${angle}<br>vangle: ${vangle}<br>aoa: ${aoa}<br>cd: ${Cd}<br>drag: ${D}<br>cl: ${Cl}<br>lift: ${L}`
        //this.display.innerHTML = `Velocity: ${[velocity.x, velocity.y].join(' - ')},<br>stuff: (${[this.stuff.x, this.stuff.y].join(' - ')}),<br>${[Cl, L, Cd, D].join(' - ')}`;
        this.backWheel.velocity.selfAdd(this.stuff);
        this.frontWheel.velocity.selfAdd(this.stuff);
        this.hitbox.velocity.selfAdd(this.stuff);
    }
}