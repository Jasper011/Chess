// type COLOR = 'white' | 'black';
//
// const chessDesk = document.querySelector('#chessDesk');
// const cages = Array.from(chessDesk.querySelectorAll('.chessDeskCage'));
//
//
// let state = {
//     figures: []
// }
//
// const LETTERS = Array.from('abcdefgh')
// count = 0
//
// for (let i = 8; i > 0; i--) {
//     for(let j = 0; j < 8; j++){
//         state[LETTERS[j]+i] = undefined;
//         cages[count].dataset.cageName = LETTERS[j] + i;
//         count++;
//     }
// }
//
//
// class Figure {
//
//     coord: string | undefined;
//     type: string;
//     color: COLOR;
//     moves: string[];
//     isActive: boolean;
//     this.figure
//
//     constructor(type, color: COLOR) {
//         state.figures.push(this)
//         this.coord = undefined;
//         this.type = type;
//         this.color = color;
//         this.moves = [];
//         this.isActive = false;
//
//         // TODO: возможно стоит переделать на просто this._create()
//         // this._create()
//
//         // TODO: this.figure пометить словом HTML
//         this.figure = this._create()
//         this.figure.classList.add('figure')
//         this.figure.classList.add(this.type)
//     }
//
//     _create(){
//         let figure = document.createElement('div');
//         figure.classList.add(this.type);
//         figure.classList.add(this.color);
//         figure.innerHTML = `<img src="img/${this.type.toLowerCase()}.png" alt="img/${this.type.toLowerCase()}.png">`;
//         return figure
//     }
//
//     place(coord) {
//         if (state[coord] === undefined) {
//             const oldCoord = this.coord;
//             state[oldCoord] = undefined
//             this.coord = coord
//             this.#moveFigure(coord)
//             state[coord] = this.color + ' ' + this.type
//             for (let figure of state.figures) {
//                 figure.calcMoves()
//             }
//             this.calcMoves() // TODO: убрать?
//             this.addEventListeners()
//
//         } else {
//             // alert('Клетка уже занята')
//             console.error("Стейт уже занят")
//         }
//
//     }
//
//     #moveFigure(coord) {
//         cages
//             .find(el=> el.dataset.cageName === coord)
//             .append(this.figure);
//     }
//
//     // TODO: add on clicks handlers?
//     addEventListeners(){
//         if (this.figure){
//             this.figure.addEventListener('mouseover', e => {
//                 this._showMoves()
//                 this.figure.addEventListener('mouseout', e => {
//                     this._hideMoves()
//                 })
//             })
//             this.figure.addEventListener('click', e => {
//                 for (let figure of state.figures) {
//                     figure.isActive = false
//                     figure.figure.classList.remove('active')
//                 }
//                 this.figure.classList.add('active')
//                 this.isActive = true;
//             })
//             chessDesk.addEventListener('click', function move(e){
//                 const cageName = e.target.dataset.cageName;
//                 if (this.moves.map(move=>move.split(' ')[0]).includes(cageName) && this.isActive){
//                     this.place(cageName)
//                     this.figure.classList.remove('active')
//                     this.isActive = false;
//                     this.figure.classList.remove('active') // ??
//                     chessDesk.removeEventListener('click', move);
//                 }
//             }.bind(this))
//
//         }
//     }
//
//     _checkMove(cord){
//         if (cord){
//             // TODO: через пол года state[cord].split(' ')[0]  будет неочевидным по сравнению с state[cord].color
//             // 7-8
//             // if(state[cord] && state[cord].color === this.color) return true
//             if(state[cord] && state[cord].split(' ')[0] === this.color) return true
//             else if (state[cord] && state[cord].split(' ')[0] !== this.color){
//                 this.moves.push(cord + ' take');
//                 return true
//             } else if (!state[cord]){
//                 this.moves.push(cord + ' move'); // TOOD: точно нужно это записывать?
//                 return false
//             }
//         }
//     }
//
//     _showMoves(){
//         this.moves.forEach(move => {
//             const moveCord = move.split(' ')[0]
//             const typeOfMove = move.split(' ')[1]
//             cages
//                 .find(cage=> cage.dataset.cageName === moveCord).classList
//                 .add(`${typeOfMove}Highlight`);
//
//         })
//     }
//
//     _hideMoves(){
//         this.moves.forEach(move => {
//             const moveCord = move.split(' ')[0]
//             const typeOfMove = move.split(' ')[1]
//             cages
//                 .find(cage=> cage.dataset.cageName === moveCord).classList
//                 .remove(`${typeOfMove}Highlight`);
//
//         })
//     }
//
//     _addRemoveMoves(action){
//         this.moves.forEach(move => {
//             const moveCord = move.split(' ')[0]
//             const typeOfMove = move.split(' ')[1]
//             // const [moveCord, typeOfMove] = move.split(' ')
//             // const {moveCord, typeOfMove} = { move.coord, move.type }
//             cages
//                 .find(cage=> cage.dataset.cageName === moveCord).classList
//                 [action](`${typeOfMove}Highlight`);
//         })
//     }
//
//     calcMoves(){
//         throw new Error('You have to implement the method calcMoves!');
//     }
// }
//
// class Rook extends Figure {
//     constructor(color: COLOR) {
//         super('Rook', color);
//     }
//
//     calcMoves() {
//         this.moves = [];
//         for (let i = +this.coord[1] - 1; i > 0; i--){
//             const nextCoord = this.coord[0] + i
//             if (this._checkMove(nextCoord)) break
//         }
//         for (let i = +this.coord[1] + 1; i <= 8; i++){
//             const nextCoord = this.coord[0] + i
//             if (this._checkMove(nextCoord)) break
//         }
//         const startLetter = LETTERS.findIndex((el, i) => el === this.coord[0])
//         for (let i =  startLetter - 1; i >= 0; i--){
//             const nextCoord = LETTERS[i] + this.coord[1]
//             if (this._checkMove(nextCoord)) break
//         }
//         for (let i = startLetter + 1; i < 8; i++){
//             const nextCoord = LETTERS[i] + this.coord[1]
//             if (this._checkMove(nextCoord)) break
//         }
//     }
// }
//
// class Bishop extends Figure {
//     constructor(color) {
//         super('Bishop', color);
//     }
//     calcMoves() {
//         this.moves = [];
//
//         const startLetter = LETTERS.findIndex((el, i) => el === this.coord[0])
//         for (let i = +this.coord[1] + 1; i <= 8; i++){
//             const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
//             if (this._checkMove(nextCoord)) break
//         }
//         for (let i = +this.coord[1] - 1; i > 0; i--){
//             const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
//             if (this._checkMove(nextCoord)) break
//         }
//         for(let i = +this.coord[1] + 1; i <= 8; i++){
//             const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
//             if (this._checkMove(nextCoord)) break
//         }
//         for(let i = +this.coord[1] - 1; i > 0; i--){
//             const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
//             if (this._checkMove(nextCoord)) break
//         }
//     }
// }
//
// function placeNewFigure(type, color: COLOR, coord){
//     let figure;
//     if (type==='rook') figure = new Rook(color);
//     else if (type==='bishop') figure = new Bishop(color);
//     else return
//     figure.place(coord);
//     return figure;
// }
//
// // const whiteRook = new Rook('white')
// // const a = placeNewFigure(  new Rook('white'), 'f2')
// // const a = placeNewFigure( whiteRook, 'f2')
// const a = placeNewFigure('rook', 'black', 'f2')
// const b = placeNewFigure('bishop', 'white', 'd4')
// const c = placeNewFigure('rook', 'white', 'f4')