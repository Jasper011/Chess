import { LETTERS } from '../../constants/index.js';
import { Figure } from '../Figure/index.js';
export class Pawn extends Figure {
    constructor(color, cages) {
        super({ type: "Pawn", color: color, cages: cages });
        this.cost = 1;
    }
    calcMoves() {
        if (this.coord === undefined)
            return;
        this.moves = [];
        let startLetter = LETTERS.findIndex((el) => this.coord && el === this.coord[0]);
        if (this.color === 'white') {
            if (+this.coord[1] == 8) {
                this.transform();
            }
            let nextTakekoords = [LETTERS[startLetter - 1] + (+this.coord[1] + 1), LETTERS[startLetter + 1] + (+this.coord[1] + 1)];
            nextTakekoords.forEach((coord) => {
                if (coord && state.figurePositions[coord] && state.figurePositions[coord].color !== this.color) {
                    this.moves.push({ coord: coord, type: 'take' });
                }
            });
            let nextCoords = [LETTERS[startLetter] + (+this.coord[1] + 1), LETTERS[startLetter] + (+this.coord[1] + 2)];
            if (!state.figurePositions[nextCoords[0]] && Figure.checkValidCoord(nextCoords[0])) {
                this.moves.push({ coord: nextCoords[0], type: 'move' });
            }
            else {
                return;
            }
            if (!state.figurePositions[nextCoords[1]] && !this.wasMoved) {
                this.moves.push({ coord: nextCoords[1], type: 'move' });
            }
        }
        else if (this.color === 'black') {
            if (+this.coord[1] == 1) {
                this.transform();
            }
            let nextTakekoords = [LETTERS[startLetter - 1] + (+this.coord[1] - 1), LETTERS[startLetter + 1] + (+this.coord[1] - 1)];
            nextTakekoords.forEach((coord) => {
                if (coord && state.figurePositions[coord] && state.figurePositions[coord].color !== this.color) {
                    this.moves.push({ coord: coord, type: 'take' });
                }
            });
            let nextCoords = [LETTERS[startLetter] + (+this.coord[1] - 1), LETTERS[startLetter] + (+this.coord[1] - 2)];
            if (!state.figurePositions[nextCoords[0]] && Figure.checkValidCoord(nextCoords[0])) {
                this.moves.push({ coord: nextCoords[0], type: 'move' });
            }
            else {
                return;
            }
            if (!state.figurePositions[nextCoords[1]] && !this.wasMoved) {
                this.moves.push({ coord: nextCoords[1], type: 'move' });
            }
        }
    }
    transform() {
        const transformTooltip = document.createElement('div');
        transformTooltip.classList.add('transformTooltip');
        transformTooltip.innerHTML = `<div class="tooltipBtn Knight"><img src="img/knight.png"></div>
        <div class="tooltipBtn Rook"><img src="img/rook.png"></div>
        <div class="tooltipBtn Queen"><img src="img/queen.png"></div>
        <div class="tooltipBtn Bishop"><img src="img/bishop.png"></div>`;
        transformTooltip.addEventListener('click', (event) => {
            const target = event.target;
            target && state.transformFigure(this, target.classList[1]); // TODO: Вернется же элемент кнопки и у него будет класс. Что не так?
            transformTooltip.remove();
        });
        document.body.append(transformTooltip);
    }
}
