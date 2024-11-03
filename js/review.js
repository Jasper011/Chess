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
            this.goBackBtn = this.reviewBtns.querySelector('.goBackBtn');
        }
        if (!this.chessDesk)
            return;
        this.cages = Array.from(this.chessDesk.querySelectorAll('.chessDeskCage'));
        this.figurePositions = {};
        this.figures = [];
        this.movesHistory = movesHistory;
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
        if (this.goForwardBtn)
            this.goForwardBtn.addEventListener('click', this.stepForward.bind(this));
        if (this.goBackBtn)
            this.goBackBtn.addEventListener('click', this.stepBack.bind(this));
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
        const figure = this.getFigureByCoord(move.current); // TODO: Не понятно, что значит. Тип '{}'?
        if (figure)
            figure.place(move.prev);
    }
    stepForward() {
        if (this.step == this.movesHistory.length - 1)
            return;
        const move = this.movesHistory[this.step];
        if (!move)
            return;
        const figure = this.getFigureByCoord(move.prev);
        if (figure)
            figure.place(move.current);
        this.step++;
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
        if (this.figures.length == 0)
            return;
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
