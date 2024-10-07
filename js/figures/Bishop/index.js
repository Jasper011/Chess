import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'


import {calcBishopMoves} from '../../helpers.js'

export class Bishop extends Figure {
    constructor(color, cages) {
        super({type:'Bishop', color:color, cages:cages});
        this.cost = 3;
    }
    calcMoves() {
        this.moves = [];
        calcBishopMoves.apply(this);
    }
}
