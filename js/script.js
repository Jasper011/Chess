const chessDesk = document.querySelector('#chessDesk');
const cages = Array.from(chessDesk.querySelectorAll('.chessDeskCage'));


let state = {
    figures: []
}

const LETTERS = Array.from('abcdefgh')
count = 0

for (let i = 8; i > 0; i--) {
    for(let j = 0; j < 8; j++){
        state[LETTERS[j]+i] = undefined;
        cages[count].dataset.cageName = LETTERS[j] + i;
        count++;
    }
}


class Figure {
    constructor(type, color) {
        state.figures.push(this)
        this.coord = undefined;
        this.type = type;
        this.color = color;
        this.moves = [];
        this.figure = this._create()
        this.figure.classList.add('figure')
        this.figure.classList.add(this.type)
    }

    _create(){
        let figure = document.createElement('div');
        figure.classList.add(this.type);
        figure.innerHTML = `<img src="img/${this.type.toLowerCase()}.png" alt="img/${this.type.toLowerCase()}.png">`;
        return figure
    }

    place(coord) {
        if (state[coord] === undefined) {
            state[this.coord] = undefined
            this.coord = coord
            cages
                .find(el=> el.dataset.cageName === coord)
                .append(this.figure);
            state[coord] = this.color + this.type
            for (let figure of state.figures) {
                figure.calcMoves()
            }
            this.calcMoves()
            this.addEventListeners()

        }

    }

    addEventListeners(){
        if (this.figure){
            this.figure.addEventListener('mouseover', e => {
                this._showMoves()
                this.figure.addEventListener('mouseout', e => {
                    this._hideMoves()
                })
            })
            this.figure.addEventListener('click', e => {
                this.figure.classList.add('active')

            })
            chessDesk.addEventListener('click', function move(e){
                const cageName = e.target.dataset.cageName;
                if (this.moves.includes(cageName)){
                    this.place(cageName)
                    chessDesk.removeEventListener('click', move);
                }
            }.bind(this))
        }
    }

    _showMoves(){
        this.moves.forEach(move => {
            cages
                .find(cage=> cage.dataset.cageName === move).classList
                .add('highlight');
        })
    }

    _hideMoves(){
        this.moves.forEach(move => {
            cages
                .find(cage=> cage.dataset.cageName === move).classList
                .remove('highlight');
        })
    }

    calcMoves(){}
}

class Rook extends Figure {
    constructor(color) {
        super('Rook', color);
    }

    calcMoves() {
        this.moves = [];

        for (let i = +this.coord[1] - 1; i > 0; i--){
            if(state[`${this.coord[0]}${i}`]) break
            this.moves.push(`${this.coord[0]}${i}`);
        }

        for (let i = +this.coord[1] + 1; i <= 8; i++){
            if(state[`${this.coord[0]}${i}`]) break
            this.moves.push(`${this.coord[0]}${i}`);
        }

        const startLetter = LETTERS.findIndex((el, i) => el === this.coord[0])

        for (let i =  startLetter - 1; i >= 0; i--){
            if(state[`${LETTERS[i]}${this.coord[1]}`]) break
            this.moves.push(`${LETTERS[i]}${this.coord[1]}`);
        }

        for (let i = startLetter + 1; i < 8; i++){
            if(state[`${LETTERS[i]}${this.coord[1]}`]) break
            this.moves.push(`${LETTERS[i]}${this.coord[1]}`);
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
            if (state[nextCoord]) break
            if (nextCoord) this.moves.push(nextCoord)
        }
        for (let i = +this.coord[1] - 1; i > 0; i--){
            const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
            if (state[nextCoord]) break
            if (nextCoord) this.moves.push(nextCoord)
        }
        for(let i = +this.coord[1] + 1; i <= 8; i++){
            const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
            if (state[nextCoord]) break
            if (nextCoord) this.moves.push(nextCoord)
        }
        for(let i = +this.coord[1] - 1; i > 0; i--){
            const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
            if (state[nextCoord]) break
            if (nextCoord) this.moves.push(nextCoord)
        }
    }
}

const a = new Rook('black')
a.place('e2')

const b = new Bishop('black')
b.place('e5')