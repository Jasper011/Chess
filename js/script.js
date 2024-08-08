"use strict";
import { whiteFigures, blackFigures } from './games/classic.js'
import { whiteFigures as whiteFiguresDemo, blackFigures as blackFiguresDemo } from './games/testEndGame.js';

const chessDesk = document.querySelector('#chessDesk');
const cages = Array.from(chessDesk.querySelectorAll('.chessDeskCage'));
const historyHTML = document.querySelector('#history')
const turnSpan = document.querySelector('.turnSpan');

const colorTextRussian = {
    white: 'Белые',
    black: 'Чёрные'
}

class Board {
    constructor() {
        this.figures = [];
        this.turn = 'black';
        this.cages = {};
        this.prevMoves = []
    }

    addHistoryPoint(pointData){
        console.log(pointData);
        this.prevMoves.push(pointData)
        const point = document.createElement('div')
        point.classList.add('historyPoint') 
        point.innerHTML += `<span class="moveNum">${this.prevMoves.length}.</span>`
        point.innerHTML += `<img src="img/${pointData.figureType}.png" class="figureImg ${pointData.color}">`
        point.innerHTML += `<span class="moves">${pointData.prev}-${pointData.current}</span>`
        historyHTML.append(point)
    }

    changeTurn() {
        turnSpan.classList.remove(this.turn);
        const color = (this.turn === 'white') ? 'black' : 'white'
        turnSpan.classList.add(color);
        turnSpan.textContent = colorTextRussian[color];
        this.turn = color;
        // content.classList.toggle('flip')
    }

    removeAllFigures() {
        // console.trace('Удаляем все фигуры');

        console.log(this.figures);
        let i = this.figures.length - 1;
        // debugger;
        while (i >= 0) {
            const figure = this.figures[i];
            console.log('this.figures.length', this.figures.length);
            console.log(i--, figure);
            if (figure.type == 'King') {
                figure.deleteFigure('init')
                continue
            }

            figure.deleteFigure()

        }
    }
}

const state = new Board();
window.state = state;
state.changeTurn()

const LETTERS = Array.from('abcdefgh')
let count = 0

for (let i = 8; i > 0; i--) {
    for (let j = 0; j < 8; j++) {
        cages[count].dataset.cageName = LETTERS[j] + i;
        count++;
    }
}


function initBoard() {
    state.removeAllFigures()
}

class Figure {
    constructor(type, color) {
        state.figures.push(this);
        this.coord = undefined;
        this.type = type;
        this.color = color;
        this.moves = [];
        this.isActive = false;
        this._create()
    }

    _create() {
        this.figure = document.createElement('div');
        this.figure.classList.add('figure')
        this.figure.classList.add(this.type);
        this.figure.classList.add(this.color);
        this.figure.innerHTML = `<img src="img/${this.type.toLowerCase()}.png" alt="img/${this.type.toLowerCase()}.png">`;
    }

    place(coord) {
        if (!state.cages[coord]) {
            const oldCoord = this.coord;
            delete state.cages[oldCoord]
            this.coord = coord
            this.#moveFigure(coord)
            state.cages[coord] = {
                'color': this.color,
                'type': this.type
            }
            for (let figure of state.figures) {
                figure.calcMoves()
            }
            this.addHandlers()
            if (oldCoord){
                state.addHistoryPoint({
                    color:this.color,
                    prev:oldCoord,
                    current:this.coord,
                    figureType:this.type
                })
            }
        } else {
            console.error("Стейт уже занят")
        }

    }

    #moveFigure(coord) {
        cages
            .find(el => el.dataset.cageName === coord)
            .append(this.figure);
    }

    deleteFigure() {
        this.figure.remove()
        this._toggleMovesHighlight('remove')
        delete state.cages[this.coord];
        state.figures.splice(state.figures.indexOf(this), 1)
    }

    addHandlers() {
        if (this.figure) {
            this.figure.addEventListener('mouseover', e => {
                this._toggleMovesHighlight('add')
                this.figure.addEventListener('mouseout', e => {
                    this._toggleMovesHighlight('remove')
                })
            })
            this.figure.addEventListener('click', e => {
                if (this.color === state.turn) {
                    for (let figure of state.figures) {
                        figure.isActive = false
                        figure.figure.classList.remove('active')
                    }
                    this.figure.classList.add('active')
                    this.isActive = true;
                } else if (this.color !== state.turn) {
                    if (this.type == 'King') {
                        this.deleteFigure()
                        e.preventDefault()
                        return
                    }
                    const attackingFigure = state.figures.find(figure => figure.isActive)
                    if (!attackingFigure) { return }
                    const attackMoves = attackingFigure.moves
                    const move = attackMoves.find(move => move.coord === this.coord && move.type === 'take')
                    if (move) {
                        chessDesk.removeEventListener('click', move);
                        this.deleteFigure()
                        attackingFigure.place(move.coord)
                        attackingFigure.figure.classList.remove('active')
                        attackingFigure.isActive = false;
                        attackingFigure.figure.classList.remove('active')
                        state.changeTurn()
                    }
                }

            })
            chessDesk.addEventListener('click', function move(e) {
                const coord = e.target.dataset.cageName;
                const move = this.moves.find(move => move['coord'] === coord);
                if (move && this.isActive && state.figures.includes(this)) {
                    if (move.type === 'move') {
                        this.place(coord)
                        this.figure.classList.remove('active')
                        this.isActive = false;
                        this.figure.classList.remove('active')
                        state.changeTurn()
                        chessDesk.removeEventListener('click', move);
                    }
                }
            }.bind(this))

        }
    }

    _checkMove(coord) {
        if (coord) {
            let isStop;
            let move = {
                'coord': coord,
            }
            if (!state.cages[coord]) {
                isStop = false;
                move['type'] = 'move'
                this.moves.push(move);
            } else if (state.cages[coord]) {
                isStop = true;
                if (state.cages[coord].color !== this.color) {
                    move['type'] = 'take'
                    this.moves.push(move);
                }
            }
            return isStop;
        }
    }

    _toggleMovesHighlight(action) {
        this.moves.forEach(move => {
            const [moveCord, typeOfMove] = [move['coord'], move['type']];
            cages
                .find(cage => cage.dataset.cageName === moveCord).classList
            [action](`${typeOfMove}Highlight`);
        })
    }

    calcMoves() {
        throw new Error('You have to implement the method calcMoves!');
    }
}

class Rook extends Figure {
    constructor(color) {
        super('Rook', color);
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

class Bishop extends Figure {
    constructor(color) {
        super('Bishop', color);
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

class King extends Figure {
    constructor(color) {
        super("King", color)
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
        delete state.cages[this.coord];
        state.figures.splice(state.figures.findIndex(el => (el === this)), 1)
        if (mode === 'take') {
            initBoard()
        }
    }

}


class Queen extends Figure {
    constructor(color) {
        super('Queen', color);
    }

    calcMoves() {
        this.moves = [];

        let startLetter = LETTERS.findIndex((el, i) => el === this.coord[0])
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
        for (let i = +this.coord[1] - 1; i > 0; i--) {
            const nextCoord = this.coord[0] + i
            if (this._checkMove(nextCoord)) break
        }
        for (let i = +this.coord[1] + 1; i <= 8; i++) {
            const nextCoord = this.coord[0] + i
            if (this._checkMove(nextCoord)) break
        }
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

class Pawn extends Figure {
    constructor(color) {
        super("Pawn", color)
    }

    calcMoves() {
        this.moves = []
        let startLetter = LETTERS.findIndex((el) => el === this.coord[0])
        if (this.color === 'white') {
            let nextTakekoords = [LETTERS[startLetter - 1] + (+this.coord[1] + 1), LETTERS[startLetter + 1] + (+this.coord[1] + 1)]
            nextTakekoords.forEach((coord, i) => {
                if (coord && state.cages[coord] && state.cages[coord].color !== this.color) {
                    this.moves.push({ coord: coord, type: 'take' })
                }
            })
            let nextCoord = LETTERS[startLetter] + (+this.coord[1] + 1)
            if (!state.cages[nextCoord]) {
                this.moves.push({ coord: nextCoord, type: 'move' })
            } else {
                return
            }
            nextCoord = LETTERS[startLetter] + (+this.coord[1] + 2)
            if (!state.cages[nextCoord] && +this.coord[1] == 2) {
                this.moves.push({ coord: nextCoord, type: 'move' })
            } else {
                return
            }
        } else if (this.color === 'black') {
            let nextTakekoords = [LETTERS[startLetter - 1] + (+this.coord[1] - 1), LETTERS[startLetter + 1] + (+this.coord[1] - 1)]
            nextTakekoords.forEach(coord => {
                if (coord && state.cages[coord] && state.cages[coord].color !== this.color) {
                    this.moves.push({ coord: coord, type: 'take' })
                }
            })
            let nextCoord = LETTERS[startLetter] + (+this.coord[1] - 1)
            if (!state.cages[nextCoord]) {
                this.moves.push({ coord: nextCoord, type: 'move' })
            } else {
                return
            }
            nextCoord = LETTERS[startLetter] + (+this.coord[1] - 2)
            if (!state.cages[nextCoord] && +this.coord[1] == 7) {
                this.moves.push({ coord: nextCoord, type: 'move' })
            }
        }
    }
}

class Horse extends Figure {
    constructor(color) {
        super("Horse", color)
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
            if (cages.find(cage => cage.dataset.cageName === move)) {
                this._checkMove(move)
            }
        }
    }
}

const figureTypes = {
    Rook,
    Bishop,
    King,
    Queen,
    Pawn,
    Horse
}

function placeNewFigureFactory(color) {
    return function (type, coord) {
        if (!Object.keys(figureTypes).includes(type)) return
        const figure = new figureTypes[type](color);
        figure.place(coord);
        return figure;
    }

}

const placeNewWhiteFigure = placeNewFigureFactory("white");
const placeNewBlackFigure = placeNewFigureFactory("black");




function startGame(whiteFigures, blackFigures) {
    whiteFigures.forEach(([type, place]) => {
        placeNewWhiteFigure(type, place)
    })
    blackFigures.forEach(([type, place]) => {
        placeNewBlackFigure(type, place)
    })
}
startGame(whiteFigures, blackFigures);
// startGame(whiteFiguresDemo, blackFiguresDemo);