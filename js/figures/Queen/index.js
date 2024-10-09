import { Figure } from '../Figure/index.js';
import { calcBishopMoves, calcRookMoves } from '../../helpers.js';
export class Queen extends Figure {
    constructor(color, cages) {
        super({ type: 'Queen', color: color, cages: cages });
        this.cost = 9;
    }
    calcMoves() {
        this.moves = [];
        calcBishopMoves.apply(this);
        calcRookMoves.apply(this);
    }
}
