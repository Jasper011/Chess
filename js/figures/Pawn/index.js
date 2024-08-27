import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'

export class Pawn extends Figure {
    constructor(color, cages, state) {
        super("Pawn", color, cages)
        this.state = state
    }

    calcMoves() {

        this.moves = []
        let startLetter = LETTERS.findIndex((el) => el === this.coord[0])
        if (this.color === 'white') {
            if (+this.coord[1] == 8){
                this.transform()
            }
            let nextTakekoords = [LETTERS[startLetter - 1] + (+this.coord[1] + 1), LETTERS[startLetter + 1] + (+this.coord[1] + 1)]
            nextTakekoords.forEach((coord, i) => {
                if (coord && state.figurePositions[coord] && state.figurePositions[coord].color !== this.color) {
                    this.moves.push({ coord: coord, type: 'take' })
                }
            })
            let nextCoord = LETTERS[startLetter] + (+this.coord[1] + 1)
            if (!state.figurePositions[nextCoord] && Figure.checkValidCoord(nextCoord)) {
                this.moves.push({ coord: nextCoord, type: 'move' })
            } else {
                return
            }
            nextCoord = LETTERS[startLetter] + (+this.coord[1] + 2)
            if (!state.figurePositions[nextCoord] && +this.coord[1] == 2) {
                this.moves.push({ coord: nextCoord, type: 'move' })
            } else {
                return
            }
            
        } else if (this.color === 'black') {
            if (+this.coord[1] == 1){
                this.transform()
            }
            let nextTakekoords = [LETTERS[startLetter - 1] + (+this.coord[1] - 1), LETTERS[startLetter + 1] + (+this.coord[1] - 1)]
            nextTakekoords.forEach(coord => {
                if (coord && state.figurePositions[coord] && state.figurePositions[coord].color !== this.color) {
                    this.moves.push({ coord: coord, type: 'take' })
                }
            })
            let nextCoord = LETTERS[startLetter] + (+this.coord[1] - 1)
            if (!state.figurePositions[nextCoord] && Figure.checkValidCoord(nextCoord)) {
                this.moves.push({ coord: nextCoord, type: 'move' })
            } else {
                return
            }
            nextCoord = LETTERS[startLetter] + (+this.coord[1] - 2)
            if (!state.figurePositions[nextCoord] && +this.coord[1] == 7) {
                this.moves.push({ coord: nextCoord, type: 'move' })
            } else {
                return
            }
        }
    }

    transform(){
        const transformTooltip = document.createElement('div')
        transformTooltip.classList.add('transformTooltip')
        transformTooltip.innerHTML = `<div class="tooltipBtn Horse"><img src="img/horse.png"></div>
        <div class="tooltipBtn Rook"><img src="img/rook.png"></div>
        <div class="tooltipBtn Queen"><img src="img/queen.png"></div>
        <div class="tooltipBtn Bishop"><img src="img/bishop.png"></div>`
        transformTooltip.addEventListener('click', (event)=>{
            this.state.transformFigure(this, event.target.classList[1])
            transformTooltip.remove()
        })
        document.body.append(transformTooltip)
        
    }
}