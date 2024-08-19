import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'

export class Bishop extends Figure {
    constructor(color, cages) {
        super('Bishop', color, cages);
    }
    calcMoves() {
        this.moves = [];

        const startLetter = LETTERS.findIndex((el, i) => el === this.coord[0])
        for (let i = +this.coord[1] + 1; i <= 8; i++) {
            const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
            if (this._checkMove(nextCoord)) break
        }
        for (let i = +this.coord[1] - 1; i > 0; i--) {
            const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
            if (this._checkMove(nextCoord)) break
        }
        for (let i = +this.coord[1] + 1; i <= 8; i++) {
            const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
            if (this._checkMove(nextCoord)) break
        }
        for (let i = +this.coord[1] - 1; i > 0; i--) {
            const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
            if (this._checkMove(nextCoord)) break
        }
    }
}
