import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'

import {calcRookMoves} from '../helpers.js'

export class Rook extends Figure {
    constructor(color, cages) {
        super('Rook', color, cages);
    }

    calcMoves() {
        this.moves = [];
        calcRookMoves.apply(this)
    }

}

