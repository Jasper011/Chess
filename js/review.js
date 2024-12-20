var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ReviewFigure_instances, _ReviewFigure_create;
import { figureTypes } from './figures/index.js';
import { Figure } from './figures/Figure/index.js';
import { LETTERS } from './constants/index.js';
export class Review {
    constructor(movesHistory, whiteFigures, blackFigures) {
        window.review = this;
        this.chessDesk = document.querySelector('#chessDesk');
        this.historyHTML = document.querySelector('#history');
        this.turnSpan = document.querySelector('.turnSpan');
        this.reviewBtns = document.querySelector('.reviewBtns');
        if (this.reviewBtns) {
            this.goForwardBtn = this.reviewBtns.querySelector('.goForwardBtn');
            this.playBtn = this.reviewBtns.querySelector('.playBtn');
            this.stopBtn = this.reviewBtns.querySelector('.stopBtn');
            this.goBackBtn = this.reviewBtns.querySelector('.goBackBtn');
        }
        if (!this.chessDesk)
            return;
        this.cages = Array.from(this.chessDesk.querySelectorAll('.chessDeskCage'));
        this.figurePositions = {};
        this.figures = [];
        this.movesHistory = movesHistory;
        this.takeHistory = [];
        this.turn = 'white';
        this.whiteStartPosition = whiteFigures;
        this.blackStartPosition = blackFigures;
        this.step = 0;
        this.placeWhiteFigure = this.addFigureFactory("white");
        this.placeBlackFigure = this.addFigureFactory("black");
    }
    startReview() {
        state.removeAllFigures();
        this.initBoard();
        this.placeAllFigures(this.whiteStartPosition, this.blackStartPosition);
        if (this.reviewBtns)
            this.reviewBtns.classList.remove('hide');
        this.addHandlersToReviewBtns();
    }
    addHandlersToReviewBtns() {
        this.goForwardBtn?.addEventListener('click', this.stepForward.bind(this));
        this.goBackBtn?.addEventListener('click', this.stepBack.bind(this));
        this.playBtn?.addEventListener('click', this.playGame.bind(this));
    }
    initBoard() {
        let count = 0;
        for (let i = 8; i > 0; i--) {
            for (let j = 0; j < 8; j++) {
                this.cages[count].dataset.cageName = LETTERS[j] + i;
                count++;
            }
        }
    }
    stepBack() {
        this.step--;
        if (this.step < 0) {
            this.step = 0;
            return;
        }
        const move = this.movesHistory[this.step];
        if (!move)
            return;
        this.removeHistoryPoint();
        const figure = this.getFigureByCoord(move.current);
        if (figure && move.prev)
            figure.place(move.prev);
        for (let take of this.takeHistory) {
            if (take.step == this.step) {
                if (take.color == 'white') {
                    this.placeWhiteFigure(take.type, take.position);
                    this.takeHistory.splice(this.takeHistory.indexOf(take), 1);
                }
                else {
                    this.placeBlackFigure(take.type, take.position);
                    this.takeHistory.splice(this.takeHistory.indexOf(take), 1);
                }
            }
        }
    }
    stepForward() {
        if (this.step == this.movesHistory.length)
            return;
        const move = this.movesHistory[this.step];
        this.addHistoryPoint(move);
        if (!move)
            return;
        let figure;
        if (move.prev)
            figure = this.getFigureByCoord(move.prev);
        if (figure)
            figure.place(move.current);
        this.step++;
    }
    playGame() {
        this.goBackBtn?.classList.add('blocked');
        this.goForwardBtn?.classList.add('blocked');
        this.playBtn?.classList.add('hide');
        this.stopBtn?.classList.remove('hide');
        const intervalId = setInterval(() => {
            this.stepForward();
            console.log('forward');
        }, 1500);
        this.stopBtn?.addEventListener('click', () => {
            clearInterval(intervalId);
            this.goBackBtn?.classList.remove('blocked');
            this.goForwardBtn?.classList.remove('blocked');
            this.playBtn?.classList.remove('hide');
            this.stopBtn?.classList.add('hide');
        });
    }
    addHistoryPoint(pointData) {
        const point = document.createElement('div');
        point.classList.add('historyPoint');
        point.innerHTML = `<span class="moveNum">${this.movesHistory.length}.</span>
        <img src="img/${pointData.figureType.toLowerCase()}.png" class="figureImg ${pointData.color}">
        <span class="moves">${pointData.prev}-${pointData.current}</span>`;
        if (this.historyHTML)
            this.historyHTML.append(point);
    }
    removeHistoryPoint() {
        if (this.historyHTML)
            this.historyHTML.lastElementChild?.remove();
    }
    placeAllFigures(whiteFigures, blackFigures) {
        whiteFigures.forEach(([type, place]) => {
            this.placeWhiteFigure(type, place);
        });
        blackFigures.forEach(([type, place]) => {
            this.placeBlackFigure(type, place);
        });
    }
    removeAllFigures() {
        console.log('inside remove rev fig', this.figures);
        if (this.figures.length == 0)
            return;
        console.log('after check');
        let i = this.figures.length - 1;
        while (i >= 0) {
            const figure = this.figures[i];
            i--;
            figure.deleteFigure();
        }
    }
    addFigureFactory(color) {
        function addFigure(type, coord) {
            if (!Object.keys(figureTypes).includes(type))
                return;
            const figure = new ReviewFigure(type, color);
            figure.place(coord);
            return figure;
        }
        return addFigure.bind(this);
    }
    getFigureByCoord(coord) {
        const figure = this.figures.find(figure => figure.coord == coord);
        return figure;
    }
}
class ReviewFigure {
    constructor(type, color) {
        _ReviewFigure_instances.add(this);
        review.figures.push(this);
        this.type = type;
        this.color = color;
        this.coord = undefined;
        __classPrivateFieldGet(this, _ReviewFigure_instances, "m", _ReviewFigure_create).call(this);
    }
    place(coord) {
        if (!Figure.checkValidCoord(coord))
            return;
        const oldCoord = this.coord;
        delete review.figurePositions[oldCoord];
        if (review.figurePositions[coord]) {
            const figure = review.figures.find(figure => figure.coord == coord);
            if (figure) {
                figure.deleteFigure();
                review.takeHistory.push({
                    step: review.step,
                    type: figure.type,
                    color: figure.color,
                    position: figure.coord,
                });
            }
        }
        review.figurePositions[coord] = {
            'color': this.color,
            'type': this.type
        };
        this.coord = coord;
        review.cages.find(cage => cage.dataset.cageName == coord).append(this.figure);
    }
    deleteFigure() {
        review.figures.splice(review.figures.indexOf(this), 1);
        this.figure.remove();
        delete review.figurePositions[this.coord];
    }
}
_ReviewFigure_instances = new WeakSet(), _ReviewFigure_create = function _ReviewFigure_create() {
    this.figure = document.createElement('div');
    this.figure.classList.add('reviewFigure', this.type, this.color);
    this.figure.innerHTML = `<img src="img/${this.type.toLowerCase()}.png" alt="img/${this.type.toLowerCase()}.png">`;
};
