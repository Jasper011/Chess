import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'


import {calcBishopMoves} from '../helpers.js'

export class Bishop extends Figure {
    constructor(color, cages) {
        super('Bishop', color, cages);
    }
    calcMoves() {
        this.moves = [];
        calcBishopMoves.apply(this);
    }
}
