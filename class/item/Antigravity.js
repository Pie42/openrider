import Item from "./Item.js";
import Vector from "../numeric/Vector.js";

export default class Antigravity extends Item {
    static get itemName() { return 'Antigravity'; }
    static get color() { return '#0ff'; }
    static get code() { return 'A'; }

    onTouch(part) {
        part.bike.gravity.set(new Vector(0, 0));
    }
}