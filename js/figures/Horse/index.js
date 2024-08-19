import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'

export class Horse extends Figure {
    constructor(color, cages) {
        super("Horse", color, cages)
    }

    calcMoves() {
        this.moves = []

        const startLetter = LETTERS.findIndex((el) => el === this.coord[0])
        const startNum = +this.coord[1]

        const validMoves = [
            LETTERS[startLetter + 1] + (startNum + 2),
            LETTERS[startLetter + 1] + (startNum - 2),
            LETTERS[startLetter - 1] + (startNum + 2),
            LETTERS[startLetter - 1] + (startNum - 2),
            LETTERS[startLetter + 2] + (startNum + 1),
            LETTERS[startLetter + 2] + (startNum - 1),
            LETTERS[startLetter - 2] + (startNum + 1),
            LETTERS[startLetter - 2] + (startNum - 1),
        ]

        for (let move of validMoves) {
            if (Figure.checkValidCoord(move)) {
                this._checkMove(move)
            }
        }
    }
}
