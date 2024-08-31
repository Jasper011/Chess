import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'

import { calcBishopMoves, calcRookMoves } from '../helpers.js';

export class Queen extends Figure {
    constructor(color, cages) {
        super('Queen', color, cages);
    }

    calcMoves() {
        this.moves = [];
        calcBishopMoves.apply(this)
        calcRookMoves.apply(this)
        
    }
}