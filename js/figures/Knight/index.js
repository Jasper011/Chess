import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'

export class Knight extends Figure {
    constructor(color, cages) {
        super({type:"Knight", color:color, cages:cages})
        this.cost = 3;
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
