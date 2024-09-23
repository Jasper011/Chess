import {figureTypes} from './figures/index.js'
import {Figure} from './figures/Figure/index.js'
import { LETTERS } from './constants/index.js';

export class Review{
    constructor(gameLog){
        window.review = this;
        this.chessDesk = document.querySelector('#chessDesk');
        
        
        this.historyHTML = document.querySelector('#history');
        this.turnSpan = document.querySelector('.turnSpan');
        this.reviewBtns = document.querySelector('.reviewBtns')
        if (this.reviewBtns){
            this.goForwardBtn = this.reviewBtns.querySelector('.goForwardBtn')
            this.goBackBtn = this.reviewBtns.querySelector('.goBackBtn')
        }

        this.cages = Array.from(this.chessDesk.querySelectorAll('.chessDeskCage'));
        

        this.figurePositions = {};
        this.figures = []
        this.movesHistory = gameLog.movesHistory
        this.turn = 'white'
        this.whiteStartPosition = gameLog.whiteFigures
        this.blackStartPosition = gameLog.blackFigures

        this.step = 0

        this.placeWhiteFigure = this.addFigureFactory("white");
        this.placeBlackFigure = this.addFigureFactory("black");
    }


    startReview(){
        state.removeAllFigures()
        this.initBoard()
        this.placeAllFigures(this.whiteStartPosition, this.blackStartPosition)
        this.reviewBtns.classList.remove('hide')
        this.addHandlersToReviewBtns()
        
    }



    addHandlersToReviewBtns(){
        this.goForwardBtn.addEventListener('click', this.stepForward.bind(this))
        this.goBackBtn.addEventListener('click', this.stepBack.bind(this))
    }

    initBoard(){
        let count = 0
        for (let i = 8; i > 0; i--) {
            for (let j = 0; j < 8; j++) {
                this.cages[count].dataset.cageName = LETTERS[j] + i;
                count++;
            }
        }
    }

    stepBack(){
        this.step--
        if (this.step < 0) {
            this.step = 0
            return
        }
        const move = this.movesHistory[this.step]
        const figure = this.getFigureByCoord(move.current)
        figure.place(move.prev)
        
    }

    stepForward(){
        if (this.step == this.movesHistory.length-1) return
        const move = this.movesHistory[this.step]
        const figure = this.getFigureByCoord(move.prev)
        figure.place(move.current)
        this.step++
    }

    placeAllFigures(whiteFigures, blackFigures){
        whiteFigures.forEach(([type, place]) => {
            this.placeWhiteFigure(type, place)
        })
        blackFigures.forEach(([type, place]) => {
            this.placeBlackFigure(type, place)
        })
    }
    
    removeAllFigures(){
        if (this.figures.length == 0) return
        let i = this.figures.length - 1;
        while (i >= 0) {
            const figure = this.figures[i];
            i--
            figure.deleteFigure()
        }
    }

    addFigureFactory(color) {
        function addFigure(type, coord) {
            if (!Object.keys(figureTypes).includes(type)) return
            const figure = new ReviewFigure(type, color)
            figure.place(coord)
            
            return figure;
        }
        return addFigure.bind(this)
    }

    getFigureByCoord(coord){
        return this.figures.find(figure=>figure.coord==coord)
    }

}

class ReviewFigure{
    constructor(type, color){
        review.figures.push(this)
        this.type = type;
        this.color = color;
        this.coord = undefined

        this.#create()
    }

    #create() {
        this.figure = document.createElement('div');
        this.figure.classList.add('reviewFigure', this.type, this.color)
        this.figure.innerHTML = `<img src="img/${this.type.toLowerCase()}.png" alt="img/${this.type.toLowerCase()}.png">`;
    }

    place(coord){
        if (!Figure.checkValidCoord(coord)) return
        const oldCoord = this.coord
        delete review.figurePositions[oldCoord]
        if (review.figurePositions[coord]){
            const figure = review.figures.find(figure=>figure.coord==coord)
            if (figure){
                figure.deleteFigure()
            }
        }
        review.figurePositions[coord] = {
            'color': this.color,
            'type': this.type
        }
        this.coord = coord
        review.cages.find(cage=>cage.dataset.cageName==coord).append(this.figure)
    }

    deleteFigure(){
        review.figures.splice(review.figures.indexOf(this), 1)
        this.figure.remove()
        delete review.figurePositions[this.coord]
    }
}