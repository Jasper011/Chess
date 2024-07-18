const chessDesk = document.querySelector('#chessDesk');
const cages = Array.from(chessDesk.querySelectorAll('.chessDeskCage'));


let state = {}

const LETTERS = Array.from('abcdefgh')
count = 0
console.log(cages)

for (let i = 8; i > 0; i--) {
    for(let j = 0; j < 8; j++){
        state[LETTERS[j]+i] = undefined;
        cages[count].dataset.cageName = LETTERS[j] + i;
        count++;
        // state[LETTERS[j] + i] = cages[count-1]
    }
}


class Figure {
    constructor(type, color) {
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
        figure.innerHTML = `<img src="img/${this.type}.png" alt="img/${this.type}.png">`;
        return figure
    }

    place(coord) {
        this.coord = coord;
        if (state[coord] === undefined) {
            cages
                .find(el=> el.dataset.cageName === coord)
                .append(this.figure);
            state[coord] = this.color + this.type
            this.calcMoves()
        }

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
        console.log(this.moves)
    }
}

const a = new Rook('black')
a.place('e5')


// // TODO: возможо стоит соеденить со стейтом
// figures = [];

// function INIT_Figure {
//     const figure = createFigre('rook');
//     // const figure = new Rook();
//     figures.push(figure);
//     addTouchEvents(figure);
//     placeFigure(figure, 'd6');
// }
//
// function placeFigure(coord, type){
//     // $0.children.length
//     if (!state[coord].querySelector('.figure')){
//         // console.log(state)
//         // TODO: возможность вынести создание фигуры в отдельную функцию
//         let newFigure = document.createElement('div');
//         newFigure.classList.add('figure');
//         newFigure.classList.add(type);
//         newFigure.innerHTML = `<img src="img/${type}.png" alt="img/${type}.png">`;
//         newFigure.coord = coord;
//         newFigure.type = type;
//         initFigure(newFigure, type, coord);
//         figures.push(newFigure);
//         state[coord].append(newFigure);
//         addFigureMoving(newFigure);
//         reInitFigures()
//     }
// }
//
// // TODO: подумать над названием - функция просчитывает возможные(доступные) ходы
// function initFigure(figure){
//     initFigureMoves(figure);
//     showFigureMoves(figure);
//
// }
//
// function initFigureMoves(figure){
//     const coord = figure.coord
//     const type = figure.type
//     figure.moves = []
//     switch (type){
//         case 'rook':
//             for (let i = +coord[1] - 1; i > 0; i--){
//                 if(state[`${coord[0]}${i}`].querySelector('.figure')) break
//                 figure.moves.push(`${coord[0]}${i}`);
//
//             }
//             for (let i = +coord[1] + 1; i <= 8; i++){
//                 if(state[`${coord[0]}${i}`].querySelector('.figure')) break
//                 figure.moves.push(`${coord[0]}${i}`);
//             }
//             const startLetter = LETTERS.findIndex((el, i) => el === coord[0])
//             for (let i =  startLetter - 1; i >= 0; i--){
//                 if(state[`${LETTERS[i]}${coord[1]}`].querySelector('.figure')) break
//                 figure.moves.push(`${LETTERS[i]}${coord[1]}`);
//             }
//             for (let i = startLetter + 1; i < 8; i++){
//                 if(state[`${LETTERS[i]}${coord[1]}`].querySelector('.figure')) break
//                 figure.moves.push(`${LETTERS[i]}${coord[1]}`);
//             }
//     }
// }
//
// function addFigureMoving(figure){
//     figure.addEventListener('click', (e) => {
//         figure.classList.add('active');
//         console.log('click on figure to move')
//         chessDesk.addEventListener('click', function move(e){
//             console.log('click on chessdesk')
//             const cageName = Object.keys(state).find((key) => state[key] === e.target)
//             if (figure.moves.includes(cageName)){
//                 figure.remove()
//
//                 //TODO:Удаляьть фигуру из figures
//
//
//                 placeFigure(cageName, figure.type);
//                 chessDesk.removeEventListener('click', move);
//             } //else {
//             //     e.preventDefault()
//             // }
//         })
//     })
// }
//
// // TODO: перерасчёт доступных ходов
// // recaclAllMoves
// function reInitFigures(){
//     for (let figure of figures){
//         initFigure(figure);
//     }
// }
//
// function showFigureMoves(figure){
//     figure.addEventListener('mouseover', function show(){
//         figure.moves.forEach(move => {
//             // state[move].style.boxShadow = '0 0 100px 100px rgba(0, 255, 19, 0.28) inset';
//             state[move].classList.add('highlight');
//         })
//         figure.addEventListener('mouseout', function hide(){
//             figure.moves.forEach(move => {
//                 // state[move].style.boxShadow = 'none';
//                 state[move].classList.remove('highlight');
//             })
//         })
//     })
//
// }