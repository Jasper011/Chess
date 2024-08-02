"use strict";

const chessDesk = document.querySelector('#chessDesk');
const cages = Array.from(chessDesk.querySelectorAll('.chessDeskCage'));

const turnSpan = document.querySelector('.turnSpan');

const colorTextRussian = {
    white: 'Белые',
    black:  'Чёрные'
}

class Board {
    constructor() {
        this.figures = [];
        this.turn = 'black';
    }

    changeTurn() {
        turnSpan.classList.remove(this.turn);
        const color = (this.turn === 'white') ? 'black' : 'white'
        turnSpan.classList.add(color);
        turnSpan.textContent = colorTextRussian[color];
        this.turn = color;
    }
}

// TODO: не нужно
let state = {
    figures: [],
    turn: 'black',
    changeTurn() {
        turnSpan.classList.remove(state.turn);
        const color = (state.turn === 'white') ? 'black' : 'white'
        turnSpan.classList.add(color);
        turnSpan.textContent = colorTextRussian[color];
        state.turn = color;
    }
}

// const state = new Board();

state.changeTurn()

// init board
const LETTERS = Array.from('abcdefgh')
let count = 0

for (let i = 8; i > 0; i--) {
    for (let j = 0; j < 8; j++) {
        cages[count].dataset.cageName = LETTERS[j] + i;
        count++;
    }
}


function initBoard(){
    for (let figure of state.figures){
        figure.deleteFigure('end game')
    }
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

    _create(){
        this.figure = document.createElement('div');
        this.figure.classList.add('figure')
        this.figure.classList.add(this.type);
        this.figure.classList.add(this.color);
        this.figure.innerHTML = `<img src="img/${this.type.toLowerCase()}.png" alt="img/${this.type.toLowerCase()}.png">`;
    }

    place(coord) {
        console.log(coord);
        if (!state[coord]) {
            const oldCoord = this.coord;
            delete state[oldCoord]
            this.coord = coord
            this.#moveFigure(coord)
            // console.log(this);
            // console.log(state);
            state[coord] = {
                'color':this.color,
                'type':this.type
            }
            for (let figure of state.figures) {
                figure.calcMoves()
            }
            this.addHandlers()

        } else {
            console.error("Стейт уже занят")
        }

    }

    #moveFigure(coord) {
        cages
            .find(el=> el.dataset.cageName === coord)
            .append(this.figure);
    }

    deleteFigure(mode="take"){
        this.figure.remove()
        state.figures.splice(state.figures.indexOf(this), 1);
        state[this.coord] = undefined;
        this._toggleMovesHighlight('remove')
        // if (mode !== "end game" && this.type === "King"){
        //     initBoard()
        // }
    }

    addHandlers(){
        if (this.figure){
            this.figure.addEventListener('mouseover', e => {
                this._toggleMovesHighlight('add')
                this.figure.addEventListener('mouseout', e => {
                    this._toggleMovesHighlight('remove')
                })
            })
            this.figure.addEventListener('click', e => {
                if (this.color === state.turn){
                    for (let figure of state.figures) {
                        figure.isActive = false
                        figure.figure.classList.remove('active')
                    }
                    this.figure.classList.add('active')
                    this.isActive = true;
                } else if (this.color !== state.turn){
                    const attackingFigure = state.figures.find(figure=>figure.isActive)
                    if (!attackingFigure) {return}
                    const attackMoves = attackingFigure.moves
                    const move = attackMoves.find(move=>move.coord === this.coord && move.type === 'take')
                    if (move) {
                        this.deleteFigure()
                        attackingFigure.place(move.coord)
                        attackingFigure.figure.classList.remove('active')
                        attackingFigure.isActive = false;
                        attackingFigure.figure.classList.remove('active')
                        state.changeTurn()
                    }
                }

            })
            chessDesk.addEventListener('click', function move(e){
                const coord = e.target.dataset.cageName;
                const move = this.moves.find(move=>move['coord'] === coord);
                if (move && this.isActive){
                    if (move.type === 'move'){
                        this.place(coord)
                        this.figure.classList.remove('active')
                        this.isActive = false;
                        this.figure.classList.remove('active')
                        state.changeTurn()
                        chessDesk.removeEventListener('click', move);
                    } else if (move.type === 'take'){
                        console.log('take')
                    }
                }
            }.bind(this))

        }
    }

    _checkMove(cord){
        if (cord){
            let isStop;
            let move = {
                'coord': cord,
            }
            if (!state[cord]) {
                isStop = false;
                move['type'] = 'move'
                this.moves.push(move);
            } else if (state[cord]){
                isStop = true;
                if (state[cord].color !== this.color){
                    move['type'] = 'take'
                    this.moves.push(move);
                }
            }
            return isStop;
        }
    }

    _toggleMovesHighlight(action){
        this.moves.forEach(move => {
            const [moveCord, typeOfMove] = [move['coord'], move['type']];
            cages
                .find(cage=> cage.dataset.cageName === moveCord).classList
                [action](`${typeOfMove}Highlight`);
        })
    }

    calcMoves(){
        throw new Error('You have to implement the method calcMoves!');
    }
}

class Rook extends Figure {
    constructor(color) {
        super('Rook', color);
    }

    calcMoves() {
        this.moves = [];
        for (let i = +this.coord[1] - 1; i > 0; i--){
            const nextCoord = this.coord[0] + i
            if (this._checkMove(nextCoord)) break
        }
        for (let i = +this.coord[1] + 1; i <= 8; i++){
            const nextCoord = this.coord[0] + i
            if (this._checkMove(nextCoord)) break
        }
        const startLetter = LETTERS.findIndex((el, i) => el === this.coord[0])
        for (let i =  startLetter - 1; i >= 0; i--){
            const nextCoord = LETTERS[i] + this.coord[1]
            if (this._checkMove(nextCoord)) break
        }
        for (let i = startLetter + 1; i < 8; i++){
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
        for (let i = +this.coord[1] + 1; i <= 8; i++){
            const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
            if (this._checkMove(nextCoord)) break
        }
        for (let i = +this.coord[1] - 1; i > 0; i--){
            const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
            if (this._checkMove(nextCoord)) break
        }
        for(let i = +this.coord[1] + 1; i <= 8; i++){
            const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
            if (this._checkMove(nextCoord)) break
        }
        for(let i = +this.coord[1] - 1; i > 0; i--){
            const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
            if (this._checkMove(nextCoord)) break
        }
    }
}

class King extends Figure{
    constructor(color){
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

    deleteFigure(){
        alert('Game end!')
    }

}


class Queen extends Figure {
    constructor(color) {
        super('Rook', color);
    }

    calcMoves() {
        Rook().calcMoves();
        // rookMoves.calcMoves();
        Bishop().calcMoves();
        // bishopMoves.calcMoves();
    }
}

const dynamicTypes = {
    Rook,
    Bishop,
    King,
}



function placeNewFigure(type, color, coord){
    let figure;
    if (type==='rook') figure = new Rook(color);
    else if (type==='bishop') figure = new Bishop(color);
    else if (type==='King') figure = new King(color);
    else return
    figure.place(coord);
    return figure;
}

function placeNewFigureFactory(color){
    return function (type, coord) {
        if (!Object.keys(dynamicTypes).includes(type)) return
        const figure = new dynamicTypes[type](color);
        figure.place(coord);
        return figure;
    }

}

const placeNewWhiteFigure = placeNewFigureFactory("white");
const placeNewBlackFigure = placeNewFigureFactory("black");


const whiteFigures = [ 
    ['Rook', 'f3'], 
    ['Rook', 'f2'],
    ['King', 'a2']
];

const blackFigures = [ 
    ['Rook', 'a4'], 
    ['Rook', 'a6']
];


whiteFigures.forEach(([type, place])=>{
    placeNewWhiteFigure(type, place)
})
blackFigures.forEach(([type, place])=>{
    placeNewBlackFigure(type, place)
})