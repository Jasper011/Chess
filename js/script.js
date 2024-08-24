"use strict";
import { whiteFigures, blackFigures } from './games/classic.js';
import { whiteFigures as whiteFiguresDemo, blackFigures as blackFiguresDemo } from './games/testEndGame.js';
import { whiteFigures as whiteFiguresPawnDemo, blackFigures as blackFiguresPawnDemo } from './games/testPawnTransform.js';

// import { Rook } from './figures/Rook/index.js';
import { 
    Figure, 
    Rook, 
    Bishop, 
    King,
    Queen,
    Pawn,
    Horse
} from './figures/index.js';

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
            const id = loadBtn.querySelector('.id').textContent
            loadBtn.addEventListener('click', (event)=>{
                this.loadFromLocalStorage(id)
            })
            loadBtn.querySelector('.deleteSaveBtn').addEventListener('click', (event)=>{
                event.stopPropagation()
                this.removeSaveFromLocalStorage(id)
                this.refreshMenu()
            })
        }
    }

    addHandlersToSaveBtns(){
        for (let saveBtn of document.querySelectorAll('.emptySaveCage')){
            saveBtn.addEventListener('click', ()=>{
                state.saveToLocalStorage(this.getSavesFromLocalStorage().length + 1)
                this.startGame(whiteFigures, blackFigures)
                this.refreshMenu()
            })
        }
    }

    displaySaves(){
        const saves = this.getSavesFromLocalStorage()
        saveListHTML.innerHTML = ''
        for (let i = 0; i < saves.length; i++){
            const save = saves[i]
            const saveHTML = document.createElement('div')
            saveHTML.classList.add('save')
            saveHTML.innerHTML = `<span class="id">${save.id}</span> <span class="moveCount">${save.movesHistory.length} ходов</span><div class="deleteSaveBtn"><img src="img/deleteIcon.png"></div>`
            saveListHTML.append(saveHTML)
        }
        for (let i = saves.length; i < 4; i++){
            const saveBtn = document.createElement('div')
            saveBtn.classList.add('emptySaveCage')
            saveBtn.textContent = 'Сохранить'
            saveListHTML.append(saveBtn)
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

    endGame(){
        const game = document.querySelector('.gameWrapper')
        game.classList.add('hide')
        const modal = document.createElement('div')
        modal.classList.add('endGameModal')
        modal.innerHTML = `
        <h3>Конец игры!</h3>
        <p>Победили ${colorTextRussian[this.turn]}</p>
        `
        const newGameBtn = document.createElement('div')
        newGameBtn.classList.add('newGameBtn')
        newGameBtn.classList.add('btn')
        newGameBtn.textContent = 'Новая игра'
        newGameBtn.addEventListener('click', ()=>{
            state.startGame(whiteFigures, blackFigures);
            modal.remove();
            game.classList.remove('hide')
        })
        modal.append(newGameBtn)
        const saveForReviewBtn = document.createElement('div')
        saveForReviewBtn.classList.add('saveForReviewBtn')
        saveForReviewBtn.classList.add('btn')
        saveForReviewBtn.textContent = 'Сохранить для просмотра'
        modal.append(saveForReviewBtn)
        content.prepend(modal)
    }

    addNewFigureFactory(color) {
        return function (type, coord) {
            if (!Object.keys(figureTypes).includes(type)) return
            let figure;
            if (type=='King') figure = new figureTypes[type](color, cages, state)
            else figure = new figureTypes[type](color, cages);
            figure.place(coord);
            return figure;
        }
    
    }

    startGame(whiteFigures, blackFigures) {
        content.classList.remove('hide')
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


const figureTypes = {
    Rook,
    Bishop,
    King,
    Queen,
    Pawn,
    Horse
}

const placeNewWhiteFigure = state.addNewFigureFactory("white");
const placeNewBlackFigure = state.addNewFigureFactory("black");

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
// 3. Спрашивать подтверждение новой игры/загруки -- Сделать переменную, которая отслеживает, были ли изменения с начал игры/с последнего сохраненного(загруженного) стейта
// 4. 
// 5. Рокировка (в обе стороны) 


// Block 2 - comfort
// 0. + Кнопки для начала игры (и возможно другие) - в целом "главное меню" игры
// 1. + Восстанавливать предыдущий стейт (из ЛокалСторадж)
// 2. Задавать имя игрока 1 и игрока 2 (+ дефолтные имена, + писать чей сейчас ход (не цвет, а имя))
// 3. Придумать минимальный подсчёт очков для финала игры (ходы, фигуры)
// 4. +- Несколько слотов для сохранения текущих игр, и возможность загружать их
// 4.1 Доработать - после загрузки есть проблемы со стейтом (отображжаемым около доски)
// 5. Режим "посмотреть сохраненную игру" где нам по шагам показывается вся история игры
// 5.1 Кнопки "назад"-"вперед", кнопка "стоп", кнопка "играть(воспроизводить)" (х1) ускоренная перемотка вперед-назад (х2-х4)

// 6. Добавить опцию "показывать подсказки фигур противника при наведении"
// 7. При взятии фигуры в руку - создавать под курсором копию взятой фигуры и сделать возможность drag and drop этой фигуры в рамках поля


// Block 3 - сетевая игра
// 0. Почитать про сервер для игры (веб-сервер, возможно рестАпи)
// 1. Несколько игроков играют в "комнатах".