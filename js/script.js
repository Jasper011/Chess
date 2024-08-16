"use strict";
import { whiteFigures, blackFigures } from './games/classic.js';
import { whiteFigures as whiteFiguresDemo, blackFigures as blackFiguresDemo } from './games/testEndGame.js';
import { whiteFigures as whiteFiguresPawnDemo, blackFigures as blackFiguresPawnDemo } from './games/testPawnTransform.js';

const chessDesk = document.querySelector('#chessDesk');
const cages = Array.from(chessDesk.querySelectorAll('.chessDeskCage'));
const historyHTML = document.querySelector('#history')
const turnSpan = document.querySelector('.turnSpan');
const pawnTransformTooltipHTML = document.querySelector('.pawnTransformTooltip')
const newGameBtn = document.querySelector('.newGameBtn')
const saveListHTML = document.querySelector('.saves')



const colorTextRussian = {
    white: 'Белые',
    black: 'Чёрные'
}

class Board {
    constructor() {
        this.figures = [];
        this.turn = 'black';
        this.figurePositions = {};
        this.movesHistory = [];
        this.boardFlipMode = false
    }

    initBoard() {
        let count = 0
        for (let i = 8; i > 0; i--) {
            for (let j = 0; j < 8; j++) {
                cages[count].dataset.cageName = LETTERS[j] + i;
                count++;
            }
        }
        this.refreshMenu()
        this.startGame(whiteFigures, blackFigures)
    }

    addHandlersToLoadBtns(){
        for (let loadBtn of saveListHTML.querySelectorAll('.save')){
            loadBtn.addEventListener('click', (event)=>{
                const id = loadBtn.querySelector('.id').textContent
                this.loadFromLocalStorage(id)
                loadBtn.querySelector('.deleteSaveBtn').addEventListener('click', ()=>{
                    this.removeSaveFromLocalStorage(id)
                    this.refreshMenu()
                    event.stopPropagation()
                }, false)
            })
        }
    }

    addHandlersToSaveBtns(){
        for (let saveBtn of document.querySelectorAll('.emptySaveCage')){
            saveBtn.addEventListener('click', ()=>{
                state.saveToLocalStorage(this.getSavesFromLocalStorage().length + 1)
                this.refreshMenu()
            })
        }
    }

    displaySaves(){
        const emtySaveCages = document.querySelectorAll('.emptySaveCage')
        for (let save of this.getSavesFromLocalStorage()){
            const saveHTML = document.createElement('div')
            saveHTML.classList.add('save')
            saveHTML.innerHTML = `<span class="id">${save.id}</span> <span class="moveCount">${save.movesHistory.length} ходов</span><div class="deleteSaveBtn"><img src="img/deleteIcon.png"></div>`
            emtySaveCages[save.id-1].remove()
            saveListHTML.append(saveHTML)
        }
    }

    getSavesFromLocalStorage(){
        let saves = JSON.parse(localStorage.getItem('saves'))
        if (!saves){
            localStorage.setItem('saves', '[]')
            saves = []
        }
        return saves
    }

    saveToLocalStorage(id){
        const saves = this.getSavesFromLocalStorage()
        if (saves.length >= 4){
            console.warn('Максимальное количество сохранений. Удалите одно сохранение, чтобы продолжить!');
            return
        }
        if (!saves.find(save=>save.id==id)){
            saves.push({
                id: id,
                figurePositions: this.figurePositions,
                movesHistory: this.movesHistory,
            })
        }
        localStorage.setItem('saves', JSON.stringify(saves))
    }

    loadFromLocalStorage(id){
        this.removeAllFigures()
        const saves = this.getSavesFromLocalStorage()
        const save = saves.find(save=>save.id==id)
        this.applyState(save)
    }

    cleanLocalStorage(){
        localStorage.setItem('saves', '[]')
    }

    removeSaveFromLocalStorage(id){
        const saves = this.getSavesFromLocalStorage()
        saves.splice(saves.findIndex(save=>save.id==id), 1)
        localStorage.setItem('saves', JSON.stringify(saves))
    }

    applyState(newState){
        if (newState){
            for (let pointData of newState.movesHistory){
                this.addHistoryPoint(pointData)
            }
            for(let position in newState.figurePositions){
                const figure = newState.figurePositions[position]
                if (figure.color == 'white'){
                    placeNewWhiteFigure(figure.type, position)
                } else {
                    placeNewBlackFigure(figure.type, position)
                }
            }
        }
    }

    refreshMenu(){
        this.displaySaves()
        this.addHandlersToLoadBtns()
        this.addHandlersToSaveBtns()
    }

    addHistoryPoint(pointData){
        this.movesHistory.push(pointData)
        const point = document.createElement('div')
        point.classList.add('historyPoint') 
        point.innerHTML = `<span class="moveNum">${this.movesHistory.length}.</span>
        <img src="img/${pointData.figureType}.png" class="figureImg ${pointData.color}">
        <span class="moves">${pointData.prev}-${pointData.current}</span>`
        historyHTML.append(point)
    }

    changeTurn() {
        turnSpan.classList.remove(this.turn);
        const color = (this.turn === 'white') ? 'black' : 'white'
        turnSpan.classList.add(color);
        turnSpan.textContent = colorTextRussian[color];
        this.turn = color;
        if (this.boardFlipMode){
            content.classList.toggle('flip')
        }
    }

    removeAllFigures() {
        if (this.figures.length==0) return
        let i = this.figures.length - 1;
        while (i >= 0) {
            const figure = this.figures[i];
            i--
            if (figure.type == 'King') {
                figure.deleteFigure('init')
                continue
            }

            figure.deleteFigure()

        }
    }

    startGame(whiteFigures, blackFigures) {
        state.removeAllFigures()
        plaseAllFigures(whiteFigures, blackFigures)
        this.cleanHistoyHTML()
        this.turn = 'white'
    }

    cleanHistoyHTML(){
        historyHTML.innerHTML = ''
    }
}

const state = new Board();
newGameBtn.addEventListener('click', ()=>{state.startGame(whiteFigures, blackFigures)})
window.state = state;
state.changeTurn()

const LETTERS = Array.from('abcdefgh')

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
        this.figure.classList.add('figure', this.type, this.color)
        this.figure.innerHTML = `<img src="img/${this.type.toLowerCase()}.png" alt="img/${this.type.toLowerCase()}.png">`;
    }

    place(coord) {
        if (!state.figurePositions[coord]) {
            const oldCoord = this.coord;
            delete state.figurePositions[oldCoord]
            this.coord = coord
            this.#moveFigure(coord)
            state.figurePositions[coord] = {
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

    static checkValidCoord(coord){
        return coord.length == 2 && LETTERS.includes(coord[0]) && +coord[1]>0 && +coord[1]<9
    }

    deleteFigure() {
        this.figure.remove()
        this._toggleMovesHighlight('remove')
        delete state.figurePositions[this.coord];
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
            if (!state.figurePositions[coord]) {
                isStop = false;
                move['type'] = 'move'
                this.moves.push(move);
            } else if (state.figurePositions[coord]) {
                isStop = true;
                if (state.figurePositions[coord].color !== this.color) {
                    move['type'] = 'take'
                    this.moves.push(move);
                }
            }
            return isStop;
        }
    }

    _toggleMovesHighlight(action) {
         this.moves.forEach(({coord: moveCord, type: typeOfMove}) => {
            const cageHtmlELem = cages.find(cage => cage.dataset.cageName === moveCord)
            cageHtmlELem.classList[action](`${typeOfMove}Highlight`)
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
        delete state.figurePositions[this.coord];
        state.figures.splice(state.figures.findIndex(el => (el === this)), 1)
        if (mode === 'take') {
            state.startGame(whiteFigures, blackFigures)
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
            this.transform()
        }
    }

    transform(){
        // this = 
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

function plaseAllFigures(whiteFigures, blackFigures) {
    whiteFigures.forEach(([type, place]) => {
        placeNewWhiteFigure(type, place)
    })
    blackFigures.forEach(([type, place]) => {
        placeNewBlackFigure(type, place)
    })
}

state.initBoard()

// TODO: 

// Block 1 - game
// 1. Трансфрмация фигуры 
// 2. Доработать финал игры (сообщение + обнулять стейт + возможно сохранять последний стейт)
// 3.
// 4.
// 5. Рокировка (в обе стороны) 


// Block 2 - comfort
// 0. Кнопки для начала игры (и возможно другие) - в целом "главное меню" игры
// 1. Восстанавливать предыдущий стейт (из ЛокалСторадж)
// 2. Задавать имя игрока 1 и игрока 2 (+ дефолтные имена, + писать чей сейчас ход (не цвет, а имя))
// 3. Придумать минимальный подсчёт очков для финала игры (ходы, фигуры)
// 4. Несколько слотов для сохранения текущих игр, и возможность загружать их
// 5. Режим "посмотреть сохраненную игру" где нам по шагам показывается вся история игры
// 5.1 Кнопки "назад"-"вперед", кнопка "стоп", кнопка "играть(воспроизводить)" (х1) ускоренная перемотка вперед-назад (х2-х4)


// Block 3 - сетевая игра
// 0. Почитать про сервер для игры (веб-сервер, возможно рестАпи)
// 1. Несколько игроков играют в "комнатах".