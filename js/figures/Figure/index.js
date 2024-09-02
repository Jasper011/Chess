import { LETTERS } from '../../constants/index.js'

export class Figure {
    // TODO: переделать чтобы конструктор принимал объект
    constructor(type, color, cages) {
        
        state.figures.push(this);
        this.coord = undefined;
        this.type = type;
        this.color = color;
        this.moves = [];
        this.isActive = false;
        this._create()
        this.cages = cages;
        
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
        this.cages
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
                    const attackingFigure = state.figures.find(figure => figure.isActive)
                    if (!attackingFigure) { return }
                    const attackMoves = attackingFigure.moves
                    const move = attackMoves.find(move => move.coord === this.coord && move.type === 'take')
                    if (move) {
                        if (this.type == 'King') {
                            this.deleteFigure()
                            return
                        }
                        chessDesk.removeEventListener('click', move);
                        this.deleteFigure()
                        attackingFigure.place(move.coord)
                        state.refreshScore()
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


            if (true && this.type == 'KING' ) {
                console.log('in IF');
                move['type'] = 'castling'
                this.moves.push(move);
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
            const cageHtmlELem = this.cages.find(cage => cage.dataset.cageName === moveCord)
            cageHtmlELem.classList[action](`${typeOfMove}Highlight`)
        })
    }

    calcMoves() {
        throw new Error('You have to implement the method calcMoves!');
    }
}