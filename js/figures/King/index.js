import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'

export class King extends Figure {
    constructor(color, cages) {
        super("King", color, cages)
    }

    calcMoves() {
        this.moves = []
        const startLetter = LETTERS.findIndex((el, i) => el === this.coord[0])
        const startNum = +this.coord[1]

        const endNum = startNum === 8 ? startNum : startNum + 1;
        const endLet = startLetter === 7 ? startLetter : startLetter + 1;
        for (let i = (startNum === 1) ? startNum : (startNum - 1); i <= endNum; i++) {
            for (let j = startLetter === 0 ? startLetter : startLetter - 1; j <= endLet; j++) {
                this._checkMove(LETTERS[j] + i)
            }
        }

    }

    deleteFigure(mode = "take") {
        this._toggleMovesHighlight('remove')
        this.figure.remove()
        delete state.figurePositions[this.coord];
        state.figures.splice(state.figures.findIndex(el => (el === this)), 1)
        if (mode === 'take') {
            state.startGame(whiteFigures, blackFigures)
        }
    }

}
