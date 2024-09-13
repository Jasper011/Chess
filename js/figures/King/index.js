import { LETTERS } from '../../constants/index.js'
import { Figure } from '../Figure/index.js'
import { whiteFigures, blackFigures } from "../../games/classic.js";

// Рокировка
// 1. Доступно 2 варианта рокировки, оба варианта предполагают что Король и Ладья НЕ двигались (this.wasMoved)
// 2. Если И король И ладья не двигались, то доступна рокировка - по сути, достпен удлинённый шаг короля (2 клетки, а не одна) 
// 3. При передвижении Короля на две клетки (рокировка), так же сдвинуть и связанную с ним ладью
// 4. Рокировка не доступна, если:
// -  у Короля был шах (wasСhecked) 
// - его путь ракировки пересекает "атака" других фигур
//
// Алгоритм:
// 1) отслеживать, доступна ли ровировка Королю. (показывать возможность)
// 2) Если был сделан длинный шаг (2 клетки), то обозначать данный шаг как "старт рокировки"

// В какой момент отслеживать что шаг - именно рокировка?
// Как определить что нащ шаг - рокировка?
// Как понять, как передвигать ладьи после рокировки?
// 


export class King extends Figure {
    constructor(color, cages, state) {
        super("King", color, cages)
        this.wasMoved = false;
        this.state = state
        this.cost = 0
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

        // TODO: починить И начать учитывать крайние случаи
        if(!this.wasMoved) {
            const num = this.color === 'white' ? 1 : 8;
            const isCastling = true;
            let canLongCastle = true && !this.wasMoved;
            let canShortCastle = true && !this.wasMoved;

            for(let i = startLetter-1; i>0; i--){
                const coord = LETTERS[i]+startNum
                if (this.state.figurePositions[coord]){
                    canLongCastle = false
                }
            }
            for(let i = startLetter + 1; i<7; i++){
                const coord = LETTERS[i]+startNum
                if (this.state.figurePositions[coord]){
                    canShortCastle = false
                }
            }
            if(canLongCastle){
                this._checkMove("c" + num, isCastling)
            }
            if(canShortCastle){
                this._checkMove("g" + num, isCastling)
            }
        }

    }

    deleteFigure(mode = "take") {
        this._toggleMovesHighlight('remove')
        this.figure.remove()
        delete state.figurePositions[this.coord];
        state.figures.splice(state.figures.findIndex(el => (el === this)), 1)
        if (mode === 'take') {
            state.endGame()
        }
    }

    castling() {
        if(this.wasMoved) {
            alert('Король уже ходил, рокировка не получится')
            return
        }
        console.log('Делаем рокировку');
        

    }

}
