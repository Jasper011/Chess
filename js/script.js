"use strict";
import { whiteFigures, blackFigures } from './games/classic.js';
import { whiteFigures as whiteFiguresDemo, blackFigures as blackFiguresDemo } from './games/testEndGame.js';
import { whiteFigures as whiteFiguresPawnDemo, blackFigures as blackFiguresPawnDemo } from './games/testPawnTransform.js';

import { Review } from './review.js';

import { deepClone } from './helpers.js';

import { LETTERS, colorTextRussian } from "./constants/index.js";

import {
    figureTypes
} from './figures/index.js';

class Board {
    constructor() {
        window.state = this;
        this.enemyHighlight = false;
        this.figures = [];
        this.turn = 'black';
        this.figurePositions = {};
        this.movesHistory = [];
        this.boardFlipMode = false;
        this.score = {
            white: 39,
            black:39
        }

        this.chessDesk = document.querySelector('#chessDesk');
        this.historyHTML = document.querySelector('#history')
        this.turnSpan = document.querySelector('.turnSpan');
        this.newGameBtn = document.querySelector('.newGameBtn')
        this.saveListHTML = document.querySelector('.saves')
        this.players = document.querySelectorAll('.player')
        this.playerNames = {
            white: 'player1',
            black: 'player2'
        }
        this.changeTurn()

        this.placeNewWhiteFigure = this.addNewFigureFactory("white");
        this.placeNewBlackFigure = this.addNewFigureFactory("black");


        if (!this.chessDesk) {
            throw new Error('Не хватает хтмл-элменто в ДОМ для запуска скрипта')
        }
        this.cages = Array.from(this.chessDesk.querySelectorAll('.chessDeskCage'));

    }


    placeAllFigures(whiteFigures, blackFigures){
        whiteFigures.forEach(([type, place]) => {
            this.placeNewWhiteFigure(type, place)
        })
        blackFigures.forEach(([type, place]) => {
            this.placeNewBlackFigure(type, place)
        })
    }

    initBoard() {
        let count = 0
        for (let i = 8; i > 0; i--) {
            for (let j = 0; j < 8; j++) {
                this.cages[count].dataset.cageName = LETTERS[j] + i;
                count++;
            }
        }
        this.refreshMenu()
        this.refreshScore()
        this.refreshPlayers()
        this.startGame(whiteFigures, blackFigures)
    }

    invokeConfirmationModal(){
        return new Promise((resolve, reject) => {
            const modal = document.createElement('div')
            modal.classList.add('confirmModal')
            modal.innerHTML = `
            <h3>Подтвердить?</h3>
            <div class="confirmAnswers">
            <div class="yesBtn btn">Да</div><div class="noBtn btn">Нет</div>
            </div>
            `
            const yesBtn = modal.querySelector('.yesBtn')
            const noBtn = modal.querySelector('.noBtn')

            document.body.append(modal)

            yesBtn.addEventListener('click', () => {
                resolve(true);
                modal.remove()
              });
              noBtn.addEventListener('click', () => {
                resolve(false);
                modal.remove()
              });
        })
    }

    addHandlersToPlayers(){
        for (let player of this.players){
            const enterName = player.querySelector('.enterNewName')
            const nameInput = player.querySelector('.nameInput')
            const nameDiv = player.querySelector('.name')

            const changeBtn = player.querySelector('.changeBtn')
            const exitBtn = player.querySelector('.exitBtn')

            function exit(){
                enterName.classList.remove('hide')
                nameInput.classList.add('hide')
                changeBtn.classList.add('hide')
                exitBtn.classList.add('hide')
                nameInput.value = ''
            }

            enterName.addEventListener('click', ()=>{
                enterName.classList.add('hide')
                nameInput.classList.remove('hide')
                changeBtn.classList.remove('hide')
                exitBtn.classList.remove('hide')
                changeBtn.addEventListener('click', ()=>{
                    if (nameInput.value.length > 0){
                        nameDiv.textContent = nameInput.value
                        this.playerNames[player.classList[1]] = nameInput.value
                        exit()
                    }
                })
                exitBtn.addEventListener('click', exit)
            })
        }
    }

    clearNames(){
        for (let player of this.players){
            const nameDiv = player.querySelector('.name')
            nameDiv.textContent = ''
        }
    }

    refreshPlayers(){
        for (let player of this.players){
            const nameDiv = player.querySelector('.name')
            nameDiv.textContent = this.playerNames[player.classList[1]]
            const score = player.querySelector('.score')
            score.textContent = this.score[player.classList[1]]
        }
    }

    addHandlersToNewGameBtn(){
        this.newGameBtn.addEventListener('click', () => {
            this.invokeConfirmationModal().then(
                isConfirmed=>{
                    if(isConfirmed) this.startGame(whiteFigures, blackFigures)
                }
            )
        })
    }

    addHandlersToLoadBtns() {
        for (let loadBtn of this.saveListHTML.querySelectorAll('.save')) {
            const id = loadBtn.querySelector('.id').textContent
            const save = this.getSavesFromLocalStorage().find(save=>save.id==id)
            loadBtn.addEventListener('click', (event) => {
                this.invokeConfirmationModal().then(
                    isConfirmed=>{
                        if(isConfirmed) {
                            if (loadBtn.classList.contains('readOnly')){
                                const gameLog = {
                                    whiteFigures,
                                    blackFigures,
                                    movesHistory: save.movesHistory
                                }
                                review.removeAllFigures()
                                const reviewState = new Review(gameLog);
                                reviewState.startReview()
                                return
                            }
                            this.loadFromLocalStorage(id)
                        }
                    }
                )
            })
            loadBtn.querySelector('.deleteSaveBtn').addEventListener('click', (event) => {
                event.stopPropagation()
                this.removeSaveFromLocalStorage(id)
                this.refreshMenu()
            })
        }
    }

    addHandlersToSaveBtns() {
        for (let saveBtn of document.querySelectorAll('.emptySaveCage')) {
            saveBtn.addEventListener('click', (event) => {
                state.saveToLocalStorage(event.target.dataset.id)
                this.refreshMenu()
            })
        }
    }

    displaySaves() {
        const saves = this.getSavesFromLocalStorage()
        this.saveListHTML.innerHTML = '';
        function displaySaveBtn(id){
            const saveBtn = document.createElement('div')
            saveBtn.classList.add('emptySaveCage')
            saveBtn.textContent = 'Сохранить'
            saveBtn.dataset.id = id
            this.saveListHTML.append(saveBtn)
        }
        function displayLoadBtn(save){
            const saveHTML = document.createElement('div');
            saveHTML.classList.add('save');
            saveHTML.innerHTML = `<span class="id">${save.id}</span> <span class="moveCount">${save.movesHistory.length} ходов</span><div class="deleteSaveBtn"><img src="img/deleteIcon.png"></div>`
            if (save.mode == 'read'){
                saveHTML.classList.add('readOnly')
                saveHTML.innerHTML = `<span class="id">${save.id}</span><img class="readOnlyIcon" src="img/readOnlyIcon.png"> <span class="moveCount">${save.movesHistory.length} ходов</span><div class="deleteSaveBtn"><img src="img/deleteIcon.png"></div>`
            }
            
            this.saveListHTML.append(saveHTML)
        }
        for (let i = 1; i <= 4; i++){
            const save = saves.find((save)=>save.id==i)
            if (save){
                displayLoadBtn.call(this, save)
            } else {
                displaySaveBtn.call(this, i)
            }
        }
    }



    getSavesFromLocalStorage() {
        let saves = JSON.parse(localStorage.getItem('saves'))
        if (!saves) {
            localStorage.setItem('saves', '[]')
            saves = []
        }
        return saves
    }

    saveToLocalStorage(id) {
        const saves = this.getSavesFromLocalStorage()
        if (saves.length >= 4) {
            console.warn('Максимальное количество сохранений. Удалите одно сохранение, чтобы продолжить!');
            return
        }
        if (!saves.find(save => save.id == id)) {
            saves.push({
                id: id,
                mode:'game',
                figurePositions: this.figurePositions,
                movesHistory: this.movesHistory,
                turn: this.turn,
                playerNames: this.playerNames
            })
        }
        localStorage.setItem('saves', JSON.stringify(saves))
    }

    saveForReview(){
        const saves = this.getSavesFromLocalStorage()
        if (saves.length >= 4) {
            console.warn('Максимальное количество сохранений. Удалите одно сохранение, чтобы продолжить!');
            return
        }
        let id;
        for (let i = 1; i<=4; i++){
            if(!saves.find(save=>save.id==i)){
                id = i
                break
            }
        }
        if (!saves.find(save => save.id == id)) {
            saves.push({
                id: id,
                mode: 'read',
                movesHistory: this.movesHistory,
                turn: this.turn
            })
            localStorage.setItem('saves', JSON.stringify(saves))
        }
        this.startGame(whiteFigures, blackFigures)
    }

    loadFromLocalStorage(id) {
        this.removeAllFigures()
        const saves = this.getSavesFromLocalStorage()
        const save = saves.find(save => save.id == id)
        this.applyState(save)
    }

    cleanLocalStorage() {
        localStorage.setItem('saves', '[]')
    }

    removeSaveFromLocalStorage(id) {
        const saves = this.getSavesFromLocalStorage()
        saves.splice(saves.findIndex(save => save.id == id), 1)
        localStorage.setItem('saves', JSON.stringify(saves))
    }

    applyState(newState) {
        review.reviewBtns.classList.add('hide')
        review.removeAllFigures()
        this.cleanHistoyHTML()
        this.movesHistory = []
        this.changeTurnToColor(newState.turn)
        if (newState) {
            this.playerNames = newState.playerNames
            this.refreshPlayers()
            for (let pointData of newState.movesHistory) {
                this.addHistoryPoint(pointData)
            }
            for (let position in newState.figurePositions) {
                const figure = newState.figurePositions[position]
                if (figure.color == 'white') {
                    this.placeNewWhiteFigure(figure.type, position)
                } else {
                    this.placeNewBlackFigure(figure.type, position)
                }
            }
        }
    }

    transformFigure(figure, type) {
        figure.deleteFigure()
        this.addNewFigureFactory(figure.color)(type, figure.coord)
        this.refreshScore()
    }

    refreshMenu() {
        this.displaySaves()
        this.addHandlersToNewGameBtn()
        this.addHandlersToLoadBtns()
        this.addHandlersToSaveBtns()
        this.addHandlersToPlayers()
    }

    addHistoryPoint(pointData) {
        this.movesHistory.push(pointData)
        const point = document.createElement('div')
        point.classList.add('historyPoint')
        point.innerHTML = `<span class="moveNum">${this.movesHistory.length}.</span>
        <img src="img/${pointData.figureType}.png" class="figureImg ${pointData.color}">
        <span class="moves">${pointData.prev}-${pointData.current}</span>`
        this.historyHTML.append(point)
    }

    changeTurnToColor(color) {
        if (color == 'white' || color == 'black') {
            this.turnSpan.classList.remove(this.turn);
            this.turn = color
            this.turnSpan.classList.add(this.turn);
            this.turnSpan.textContent = colorTextRussian[color];
        }
    }

    changeTurn() {
        this.turnSpan.classList.remove(this.turn);
        const color = (this.turn === 'white') ? 'black' : 'white'
        this.turnSpan.classList.add(color);
        this.turnSpan.textContent = colorTextRussian[color];
        this.turn = color;
        if (this.boardFlipMode) {
            content.classList.toggle('flip')
        }
    }

    removeAllFigures() {
        if (this.figures.length == 0) return
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

    endGame() {
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
        newGameBtn.addEventListener('click', () => {
            state.startGame(whiteFigures, blackFigures);
            modal.remove();
            game.classList.remove('hide')
        })
        modal.append(newGameBtn)
        const saveForReviewBtn = document.createElement('div')
        saveForReviewBtn.classList.add('saveForReviewBtn')
        saveForReviewBtn.classList.add('btn')
        saveForReviewBtn.textContent = 'Сохранить для просмотра'
        saveForReviewBtn.addEventListener('click', ()=>{
            this.saveForReview()
            this.refreshMenu()
            modal.remove();
            game.classList.remove('hide')
        })
        modal.append(saveForReviewBtn)
        content.prepend(modal)
    }

    addNewFigureFactory(color) {
        function addNewFigure(type, coord) {
            if (!Object.keys(figureTypes).includes(type)) return
            let figure;
            if (type == 'King' || type == 'Pawn') figure = new figureTypes[type](color, this.cages, this)
            else figure = new figureTypes[type](color, this.cages);
            figure.place(coord, true);
            return figure;
        }
        return addNewFigure.bind(this)

    }

    refreshScore(){
        const score = {
            white: 39,
            black:39
        }
        for(let figure of this.figures){
            if (figure.color == 'white'){
                score.black -= figure.cost
            } else{
                score.white -= figure.cost
            }
        }
        this.score = score
    }

    startGame(whiteFigures, blackFigures) {
        review.reviewBtns.classList.add('hide')
        this.movesHistory = []
        this.score = {
            white: 0,
            black:0
        }
        content.classList.remove('hide')
        if (review) review.removeAllFigures()
        state.removeAllFigures()
        this.placeAllFigures(whiteFigures, blackFigures)
        this.cleanHistoyHTML()
        this.changeTurnToColor('white')
    }

    cleanHistoyHTML() {
        this.historyHTML.innerHTML = ''
    }
}

new Review({})

const state = new Board();

state.initBoard()


// TODO:

// Block 1 - game
// 1. +Трансфрмация фигуры
// 2. +- Доработать финал игры (сообщение + обнулять стейт + возможно сохранять последний стейт)
// 3. Спрашивать подтверждение новой игры/загруки -- Сделать переменную, которая отслеживает, были ли изменения с начал игры/с последнего сохраненного(загруженного) стейта
// 4. Взятие на проходе
// 5. Рокировка (в обе стороны)


// Block 2 - comfort
// 0. + Кнопки для начала игры (и возможно другие) - в целом "главное меню" игры
// 1. + Восстанавливать предыдущий стейт (из ЛокалСторадж)
// 2. Задавать имя игрока 1 и игрока 2 (+ дефолтные имена, + писать чей сейчас ход (не цвет, а имя))
// 3. +- Придумать минимальный подсчёт очков для финала игры (ходы, фигуры)
// 4. + Несколько слотов для сохранения текущих игр, и возможность загружать их
// 4.1 + Доработать - после загрузки есть проблемы со стейтом (отображжаемым около доски)
// 4.2 + Доработать - после сохранения игра наичнается заново (это плохо)
// 4.3 + Доработать - сохранять в нужный слот, а не следующий в очереди
// 4.4 Доработать - кнопку удалить сделать так, чтобы нельзя было нажать случайно
// 4.5 Предлагать ввести название сохраненной игры
// 4.6* Подумать, как сразу же сохранять игру в тот же слот
// 5. + Режим "посмотреть сохраненную игру" где нам по шагам показывается вся история игры
// 5.1 Кнопки "назад"-"вперед", кнопка "стоп", кнопка "играть(воспроизводить)" (х1) ускоренная перемотка вперед-назад (х2-х4)

// 6. Добавить опцию "показывать подсказки фигур противника при наведении"
// 7. При взятии фигуры в руку - создавать под курсором копию взятой фигуры и сделать возможность drag and drop этой фигуры в рамках поля


// Block 3 - сетевая игра
// 0. Почитать про сервер для игры (веб-сервер, возможно рестАпи)
// 1. Несколько игроков играют в "комнатах".

// Что не позволяет сделать рокировку (что переключает isCastlingAvailable в false)
// 0. Если королю кто-то мешает на пути
// 1. Если король уже ходил (ок)
// 2. Если одна из ладей ходила (ок)
// 3. Если Королю находится под атакой (ему сделали шах), но после - можно (isCheck = true) 
// (проверять, если ли они в доступных ходах фигур противника наш король. Если нет, то isCheck = false)
// 4. Если королю предстоит прыжок через битое поле (проверять 4 возможных поля, если ли они в доступных ходах фигуро противника)
// 4.1 Если влево (C1, D1)
// 4.2 Если вправо (F1, G1)

// Флаг isCastlingAvailable не глобальный в стейте, а просто как сборная часть типа 
// isCastlingAvailable = isWayFree && !kingWasMoved && !rookWasMoved && !isCheck & !isUnderAtack

