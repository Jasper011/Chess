"use strict";
import { whiteFigures, blackFigures } from './games/classic/index.js';
import { Review } from './review.js';
import { LETTERS, colorTextRussian } from "./constants/index.js";
import { figureTypes } from './figures/index.js';
class Board {
    constructor() {
        window.state = this;
        this.enemyHighlight = false;
        this.figures = [];
        this.turn = ['black', ''];
        this.figurePositions = {};
        this.movesHistory = [];
        this.boardFlipMode = false;
        this.score = {
            white: 39,
            black: 39
        };
        this.chessDesk = document.querySelector('#chessDesk');
        this.historyHTML = document.querySelector('#history');
        this.turnSpan = document.querySelector('.turnSpan');
        this.newGameBtn = document.querySelector('.newGameBtn');
        this.saveListHTML = document.querySelector('.saves');
        this.players = document.querySelectorAll('.player');
        this.playerNames = {
            white: 'player1',
            black: 'player2'
        };
        this.turn[1] = this.playerNames[this.turn[0]];
        this.changeTurn();
        this.placeNewWhiteFigure = this.addNewFigureFactory("white");
        this.placeNewBlackFigure = this.addNewFigureFactory("black");
        if (!this.chessDesk) {
            throw new Error('Не хватает хтмл-элменто в ДОМ для запуска скрипта');
        }
        this.cages = Array.from(this.chessDesk.querySelectorAll('.chessDeskCage'));
    }
    getFigureByCoord(coord) {
        const figure = this.figures.find(figure => figure.coord == coord);
        return figure;
    }
    placeAllFigures(whiteFigures, blackFigures) {
        whiteFigures.forEach(([type, place]) => {
            this.placeNewWhiteFigure(type, place);
        });
        blackFigures.forEach(([type, place]) => {
            this.placeNewBlackFigure(type, place);
        });
    }
    initBoard() {
        let count = 0;
        for (let i = 8; i > 0; i--) {
            for (let j = 0; j < 8; j++) {
                this.cages[count].dataset.cageName = LETTERS[j] + i;
                count++;
            }
        }
        this.refreshMenu();
        this.addHandlersToNewGameBtn();
        this.refreshScore();
        this.refreshPlayers();
        this.startGame(whiteFigures, blackFigures);
    }
    invokeConfirmationModal() {
        return new Promise((resolve, reject) => {
            const modal = document.createElement('div');
            modal.classList.add('confirmModal');
            modal.innerHTML = `
            <h3>Подтвердить?</h3>
            <div class="confirmAnswers">
            <div class="yesBtn btn">Да</div><div class="noBtn btn">Нет</div>
            </div>
            `;
            const yesBtn = modal.querySelector('.yesBtn');
            const noBtn = modal.querySelector('.noBtn');
            document.body.append(modal);
            yesBtn && yesBtn.addEventListener('click', () => {
                resolve(true);
                modal.remove();
            });
            noBtn && noBtn.addEventListener('click', () => {
                resolve(false);
                modal.remove();
            });
        });
    }
    addHandlersToPlayers() {
        if (this.players)
            for (let player of this.players) {
                const enterName = player.querySelector('.enterNewName');
                const nameInput = player.querySelector('.nameInput');
                const nameDiv = player.querySelector('.name');
                const changeBtn = player.querySelector('.changeBtn');
                const exitBtn = player.querySelector('.exitBtn');
                function exit() {
                    enterName && enterName.classList.remove('hide');
                    nameInput && nameInput.classList.add('hide');
                    changeBtn && changeBtn.classList.add('hide');
                    exitBtn && exitBtn.classList.add('hide');
                    if (nameInput)
                        nameInput.value = '';
                }
                enterName && enterName.addEventListener('click', () => {
                    enterName.classList.add('hide');
                    nameInput && nameInput.classList.remove('hide');
                    changeBtn && changeBtn.classList.remove('hide');
                    exitBtn && exitBtn.classList.remove('hide');
                    changeBtn && changeBtn.addEventListener('click', () => {
                        if (nameInput && nameInput.value.length > 0) {
                            if (nameDiv)
                                nameDiv.textContent = nameInput.value;
                            this.playerNames[player.classList[1]] = nameInput.value;
                            exit();
                        }
                    });
                    exitBtn && exitBtn.addEventListener('click', exit);
                });
            }
    }
    clearNames() {
        for (let player of this.players) {
            const nameDiv = player.querySelector('.name');
            if (nameDiv)
                nameDiv.textContent = '';
        }
    }
    refreshPlayers() {
        for (let player of this.players) {
            const nameDiv = player.querySelector('.name');
            if (nameDiv)
                nameDiv.textContent = this.playerNames[player.classList[1]];
            const score = player.querySelector('.score');
            if (score)
                score.textContent = this.score[player.classList[1]];
        }
    }
    addHandlersToNewGameBtn() {
        this.newGameBtn && this.newGameBtn.addEventListener('click', () => {
            this.invokeConfirmationModal().then(isConfirmed => {
                if (isConfirmed)
                    this.startGame(whiteFigures, blackFigures);
            });
        });
    }
    addHandlersToLoadBtns() {
        if (this.saveListHTML)
            for (let loadBtn of this.saveListHTML.querySelectorAll('.save')) {
                if (!loadBtn)
                    return;
                const id = loadBtn.querySelector('.id').textContent;
                const save = this.getSavesFromLocalStorage().find(save => save.id == id);
                loadBtn.addEventListener('click', () => {
                    this.invokeConfirmationModal().then(isConfirmed => {
                        if (isConfirmed) {
                            if (loadBtn.classList.contains('readOnly')) {
                                const gameLog = {
                                    whiteFigures,
                                    blackFigures,
                                    movesHistory: save.movesHistory
                                };
                                review.removeAllFigures();
                                review = new Review(gameLog.movesHistory, gameLog.whiteFigures, gameLog.blackFigures);
                                review.startReview();
                                return;
                            }
                            if (id)
                                this.loadFromLocalStorage(id);
                        }
                    });
                });
                loadBtn.querySelector('.deleteSaveBtn')?.addEventListener('click', (event) => {
                    event.stopPropagation();
                    this.invokeConfirmationModal().then(isConfirmed => {
                        if (isConfirmed && id)
                            this.removeSaveFromLocalStorage(id);
                        this.refreshMenu();
                    });
                });
            }
    }
    addHandlersToSaveBtns() {
        for (let saveBtn of document.querySelectorAll('.emptySaveCage')) {
            saveBtn.addEventListener('click', (event) => {
                const target = event.target;
                if (target)
                    state.saveToLocalStorage(target.dataset.id); //Понятно, в чем ошибка, но не понятно, что с ней делать
                this.refreshMenu();
            });
        }
    }
    displaySaves() {
        const saves = this.getSavesFromLocalStorage();
        if (this.saveListHTML)
            this.saveListHTML.innerHTML = '';
        function displaySaveBtn(id) {
            const saveBtn = document.createElement('div');
            saveBtn.classList.add('emptySaveCage');
            saveBtn.textContent = 'Сохранить';
            saveBtn.dataset.id = id;
            this.saveListHTML.append(saveBtn);
        }
        function displayLoadBtn(save) {
            const saveHTML = document.createElement('div');
            saveHTML.classList.add('save');
            saveHTML.innerHTML = `<span class="id">${save.id}</span> <span class="moveCount">${save.movesHistory.length} ходов</span><div class="deleteSaveBtn"><img src="img/deleteIcon.png"></div>`;
            if (save.mode == 'read') {
                saveHTML.classList.add('readOnly');
                saveHTML.innerHTML = `<span class="id">${save.id}</span><img class="readOnlyIcon" src="img/readOnlyIcon.png"> <span class="moveCount">${save.movesHistory.length} ходов</span><div class="deleteSaveBtn"><img src="img/deleteIcon.png"></div>`;
            }
            this.saveListHTML.append(saveHTML);
        }
        for (let i = 1; i <= 4; i++) {
            const save = saves.find((save) => save.id == i);
            if (save) {
                displayLoadBtn.call(this, save);
            }
            else {
                displaySaveBtn.call(this, i);
            }
        }
    }
    getSavesFromLocalStorage() {
        let saves;
        if (localStorage.getItem('saves'))
            saves = JSON.parse(localStorage.getItem('saves'));
        if (!saves) {
            localStorage.setItem('saves', '[]');
            saves = [];
        }
        return saves;
    }
    saveToLocalStorage(id) {
        const saves = this.getSavesFromLocalStorage();
        if (saves.length >= 4) {
            console.warn('Максимальное количество сохранений. Удалите одно сохранение, чтобы продолжить!');
            return;
        }
        if (!saves.find(save => save.id == id)) {
            saves.push({
                id: id,
                mode: 'game',
                figurePositions: this.figurePositions,
                movesHistory: this.movesHistory,
                turn: this.turn[0],
                playerNames: this.playerNames
            });
        }
        localStorage.setItem('saves', JSON.stringify(saves));
    }
    saveForReview() {
        const saves = this.getSavesFromLocalStorage();
        if (saves.length >= 4) {
            console.warn('Максимальное количество сохранений. Удалите одно сохранение, чтобы продолжить!');
            return;
        }
        let id = 0;
        for (let i = 1; i <= 4; i++) {
            if (!saves.find((save) => save.id == i)) {
                id = i;
                break;
            }
        }
        if (!saves.find((save) => save.id == id)) {
            saves.push({
                id: id,
                mode: 'read',
                movesHistory: this.movesHistory,
                turn: this.turn[0]
            });
            localStorage.setItem('saves', JSON.stringify(saves));
        }
        this.startGame(whiteFigures, blackFigures);
    }
    loadFromLocalStorage(id) {
        this.removeAllFigures();
        const saves = this.getSavesFromLocalStorage();
        const save = saves.find((save) => save.id == id);
        this.applyState(save);
    }
    cleanLocalStorage() {
        localStorage.setItem('saves', '[]');
    }
    removeSaveFromLocalStorage(id) {
        const saves = this.getSavesFromLocalStorage();
        saves.splice(saves.findIndex((save) => save.id == id), 1);
        localStorage.setItem('saves', JSON.stringify(saves));
    }
    applyState(newState) {
        if (review)
            review.reviewBtns?.classList.add('hide');
        if (review)
            review.removeAllFigures();
        this.cleanHistoyHTML();
        this.movesHistory = [];
        this.changeTurnToColor(newState.turn);
        if (newState) {
            this.playerNames = newState.playerNames;
            this.refreshPlayers();
            for (let pointData of newState.movesHistory) {
                this.addHistoryPoint(pointData);
            }
            for (let position in newState.figurePositions) {
                const figure = newState.figurePositions[position];
                if (figure.color == 'white') {
                    this.placeNewWhiteFigure(figure.type, position);
                }
                else {
                    this.placeNewBlackFigure(figure.type, position);
                }
            }
        }
    }
    transformFigure(figure, type) {
        figure.deleteFigure();
        this.addNewFigureFactory(figure.color)(type, figure.coord);
        this.refreshScore();
    }
    refreshMenu() {
        this.displaySaves();
        this.addHandlersToLoadBtns();
        this.addHandlersToSaveBtns();
        this.addHandlersToPlayers();
    }
    addHistoryPoint(pointData) {
        this.movesHistory.push(pointData);
        const point = document.createElement('div');
        point.classList.add('historyPoint');
        point.innerHTML = `<span class="moveNum">${this.movesHistory.length}.</span>
        <img src="img/${pointData.figureType.toLowerCase()}.png" class="figureImg ${pointData.color}">
        <span class="moves">${pointData.prev}-${pointData.current}</span>`;
        if (this.historyHTML)
            this.historyHTML.append(point);
    }
    changeTurnToColor(color) {
        if (color == 'white' || color == 'black') {
            this.turnSpan && this.turnSpan.classList.remove(this.turn[0]);
            this.turn[0] = color;
            this.turn[1] = this.playerNames[this.turn[0]];
            this.turnSpan && this.turnSpan.classList.add(this.turn[0]);
            if (this.turnSpan)
                this.turnSpan.textContent = colorTextRussian[color] + `(${this.turn[1]})`;
        }
    }
    changeTurn() {
        if (!this.turnSpan)
            return;
        this.turnSpan.classList.remove(this.turn[0]);
        const color = (this.turn[0] === 'white') ? 'black' : 'white';
        this.turnSpan.classList.add(color);
        this.turn[0] = color;
        this.turn[1] = this.playerNames[this.turn[0]];
        this.turnSpan.textContent = colorTextRussian[color] + `(${this.turn[1]})`;
        if (this.boardFlipMode) {
            if (content)
                content.classList.toggle('flip');
        }
    }
    removeAllFigures() {
        if (this.figures.length == 0)
            return;
        let i = this.figures.length - 1;
        while (i >= 0) {
            const figure = this.figures[i];
            i--;
            if (figure.type == 'King') {
                figure.deleteFigure('init');
                continue;
            }
            figure.deleteFigure();
        }
    }
    endGame() {
        const game = document.querySelector('.gameWrapper');
        if (!game)
            return;
        this.cleanHistoyHTML();
        game.classList.add('hide');
        const modal = document.createElement('div');
        modal.classList.add('endGameModal');
        modal.innerHTML = `
        <h3>Конец игры!</h3>
        <p>Победили ${colorTextRussian[this.turn[0]]}</p>
        `;
        const newGameBtn = document.createElement('div');
        newGameBtn.classList.add('newGameBtn');
        newGameBtn.classList.add('btn');
        newGameBtn.textContent = 'Новая игра';
        newGameBtn.addEventListener('click', () => {
            state.startGame(whiteFigures, blackFigures);
            modal.remove();
            game.classList.remove('hide');
        });
        modal.append(newGameBtn);
        const saveForReviewBtn = document.createElement('div');
        saveForReviewBtn.classList.add('saveForReviewBtn');
        saveForReviewBtn.classList.add('btn');
        saveForReviewBtn.textContent = 'Сохранить для просмотра';
        saveForReviewBtn.addEventListener('click', () => {
            this.saveForReview();
            this.refreshMenu();
            modal.remove();
            game.classList.remove('hide');
        });
        modal.append(saveForReviewBtn);
        if (content)
            content.prepend(modal);
    }
    addNewFigureFactory(color) {
        function addNewFigure(type, coord) {
            if (!Object.keys(figureTypes).includes(type))
                return;
            let figure;
            if (type == 'King' || type == 'Pawn')
                figure = new figureTypes[type](color, this.cages);
            else
                figure = new figureTypes[type](color, this.cages);
            figure.place(coord, true);
            return figure;
        }
        return addNewFigure.bind(this);
    }
    refreshScore() {
        const score = {
            white: 39,
            black: 39
        };
        let i = 0;
        while (i < this.figures.length) {
            const figure = this.figures[i];
            i++;
            if (!figure.cost)
                continue;
            if (figure.color == 'white') {
                score.black -= figure.cost;
            }
            else {
                score.white -= figure.cost;
            }
        }
        this.score = score;
    }
    startGame(whiteFigures, blackFigures) {
        if (review)
            review.reviewBtns?.classList.add('hide');
        console.log('remove rev fig call', review.figures.slice());
        if (review)
            review.removeAllFigures();
        console.log('after remove rev fig call');
        state.removeAllFigures();
        this.movesHistory = [];
        this.score = {
            white: 0,
            black: 0
        };
        const content = document.getElementById('content');
        content?.classList.remove('hide');
        this.placeAllFigures(whiteFigures, blackFigures);
        this.cleanHistoyHTML();
        this.changeTurnToColor('white');
    }
    cleanHistoyHTML() {
        if (this.historyHTML)
            this.historyHTML.innerHTML = '';
    }
}
window.review = new Review([], whiteFigures, blackFigures);
const content = document.getElementById('content');
const state = new Board();
state.initBoard();
