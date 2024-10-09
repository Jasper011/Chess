var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Figure_instances, _Figure_moveFigure;
import { LETTERS } from '../../constants/index.js';
// const state: State = window.state
const chessDesk = window.chessDesk;
export class Figure {
    constructor({ type, color, cages }) {
        _Figure_instances.add(this);
        state.figures.push(this);
        this.wasMoved = false;
        this.coord = undefined;
        this.type = type;
        this.color = color;
        this.moves = [];
        this.isActive = false;
        this._create();
        this.cages = cages;
    }
    _create() {
        this.figure = document.createElement('div');
        this.figure.classList.add('figure', this.type, this.color);
        this.figure.innerHTML = `<img src="img/${this.type.toLowerCase()}.png" alt="img/${this.type.toLowerCase()}.png">`;
    }
    place(coord, isplace) {
        if (!state.figurePositions[coord]) {
            if (!isplace)
                this.wasMoved = true;
            const oldCoord = this.coord;
            if (oldCoord) {
                delete state.figurePositions[oldCoord];
            }
            this.coord = coord;
            __classPrivateFieldGet(this, _Figure_instances, "m", _Figure_moveFigure).call(this, coord);
            state.figurePositions[coord] = {
                'color': this.color,
                'type': this.type
            };
            for (let figure of state.figures) {
                figure.calcMoves();
            }
            this.addHandlers();
            state.refreshScore();
            state.refreshPlayers();
            if (oldCoord) {
                state.addHistoryPoint({
                    color: this.color,
                    prev: oldCoord,
                    current: this.coord,
                    figureType: this.type
                });
            }
        }
        else {
            console.error("Стейт уже занят");
        }
    }
    static checkValidCoord(coord) {
        return coord.length == 2 && LETTERS.includes(coord[0]) && +coord[1] > 0 && +coord[1] < 9;
    }
    deleteFigure() {
        this.figure.remove();
        this._toggleMovesHighlight('remove');
        // if (this.coord) delete state.figurePositions[this.coord];
        this.coord && delete state.figurePositions[this.coord];
        state.figures.splice(state.figures.indexOf(this), 1);
    }
    addHandlers() {
        if (this.figure) {
            this.figure.addEventListener('mouseover', e => {
                this._toggleMovesHighlight('add');
                this.figure.addEventListener('mouseout', e => {
                    this._toggleMovesHighlight('remove');
                });
            });
            this.figure.addEventListener('click', e => {
                if (this.color === state.turn) {
                    for (let figure of state.figures) {
                        figure.isActive = false;
                        figure.figure.classList.remove('active');
                    }
                    this.figure.classList.add('active');
                    this.isActive = true;
                }
                else if (this.color !== state.turn) {
                    const attackingFigure = state.figures.find(figure => figure.isActive);
                    if (!attackingFigure) {
                        return;
                    }
                    const attackMoves = attackingFigure.moves;
                    const move = attackMoves.find(move => move.coord === this.coord && move.type === 'take');
                    if (move) {
                        if (this.type == 'King') {
                            this.deleteFigure();
                            return;
                        }
                        chessDesk.removeEventListener('click', move);
                        this.deleteFigure();
                        attackingFigure.place(move.coord);
                        attackingFigure.figure.classList.remove('active');
                        attackingFigure.isActive = false;
                        attackingFigure.figure.classList.remove('active');
                        state.changeTurn();
                    }
                }
            });
            chessDesk.addEventListener('click', function move(e) {
                const coord = e.target.dataset.cageName;
                const move = this.moves.find(move => move['coord'] === coord);
                if (move && this.isActive && state.figures.includes(this)) {
                    if (move.type === 'move' || move.type === 'castling') {
                        if (move.type === 'castling') {
                            console.log('inside castling if');
                            const isShortCastling = coord[0] === "g";
                            const num = this.color === "white" ? 1 : 8;
                            let [letter, newLetter] = isShortCastling ? ['h', 'f'] : ['a', 'd'];
                            const rookCoord = letter + num;
                            const foundedRook = state.figures.find(obj => obj.coord === rookCoord && !obj.wasMoved);
                            if (!foundedRook)
                                return;
                            foundedRook.place(newLetter + num);
                            console.log(foundedRook);
                        }
                        this.place(coord);
                        this.figure.classList.remove('active');
                        this.isActive = false;
                        this.figure.classList.remove('active');
                        state.changeTurn();
                        chessDesk.removeEventListener('click', move);
                    }
                }
            }.bind(this));
        }
    }
    // TODO: подумать над входными и выходнынми параметрами, сделать рефакторинг (иф не нужен?)
    _checkMove(coord, isCastling) {
        let isStop = false;
        let move = {
            'coord': coord,
            'type': 'move'
        };
        if (isCastling && this.type == 'King' && !state.figurePositions[coord]) {
            move['type'] = 'castling';
            this.moves.push(move);
        }
        else if (!state.figurePositions[coord]) {
            this.moves.push(move);
        }
        else if (state.figurePositions[coord]) {
            isStop = true;
            if (state.figurePositions[coord].color !== this.color) {
                move['type'] = 'take';
                this.moves.push(move);
            }
        }
        return isStop;
    }
    _toggleMovesHighlight(action) {
        if (this.color == state.turn || state.enemyHighLight) {
            this.moves.forEach(({ coord: moveCord, type: typeOfMove }) => {
                const cageHtmlELem = this.cages.find(cage => cage.dataset.cageName === moveCord);
                cageHtmlELem && cageHtmlELem.classList[action](`${typeOfMove}Highlight`);
            });
        }
    }
    calcMoves() {
        throw new Error('You have to implement the method calcMoves!');
    }
}
_Figure_instances = new WeakSet(), _Figure_moveFigure = function _Figure_moveFigure(coord) {
    this.cages
        .find(el => el.dataset.cageName === coord)?.append(this.figure);
};
