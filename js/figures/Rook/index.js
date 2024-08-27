import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'

export class Rook extends Figure {
    constructor(color, cages) {
        super('Rook', color, cages);
    }

    calcMoves() {
        this.moves = [];
        for (let i = +this.coord[1] - 1; i > 0; i--) {
            const nextCoord = this.coord[0] + i
            if (this._checkMove(nextCoord)) break
        }
        for (let i = +this.coord[1] + 1; i <= 8; i++) {
            const nextCoord = this.coord[0] + i
            if (this._checkMove(nextCoord)) break
        }
        const startLetter = LETTERS.findIndex((el) => el === this.coord[0])
        for (let i = startLetter - 1; i >= 0; i--) {
            const nextCoord = LETTERS[i] + this.coord[1]
            if (this._checkMove(nextCoord)) break
        }
        for (let i = startLetter + 1; i < 8; i++) {
            const nextCoord = LETTERS[i] + this.coord[1]
            if (this._checkMove(nextCoord)) break
        }
    }

}

console.log(Rook);
