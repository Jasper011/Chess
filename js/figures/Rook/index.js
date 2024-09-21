import { Figure } from '../Figure/index.js'

import {calcRookMoves} from '../../helpers.js'

export class Rook extends Figure {
    constructor(color, cages) {
        super('Rook', color, cages);
        this.cost = 5;
    }

    calcMoves() {
        this.moves = [];
        calcRookMoves.apply(this)
    }

}

