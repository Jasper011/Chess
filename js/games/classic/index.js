import { LETTERS } from "../../constants/index.js";
const whiteFigures = [
    ['Rook', 'a1'],
    ['Rook', 'h1'],
    ['Queen', 'd1'],
    ['King', 'e1'],
    ['Bishop', 'c1'],
    ['Bishop', 'f1'],
    ['Knight', 'b1'],
    ['Knight', 'g1'],
];
for (let i = 0; i <= 7; i++) {
    whiteFigures.push(["Pawn", `${LETTERS[i]}2`]);
}
const blackFigures = [
    ['Rook', 'a8'],
    ['Rook', 'h8'],
    ['Queen', 'd8'],
    ['King', 'e8'],
    ['Bishop', 'c8'],
    ['Bishop', 'f8'],
    ['Knight', 'b8'],
    ['Knight', 'g8'],
];
for (let i = 0; i <= 7; i++) {
    blackFigures.push(["Pawn", `${LETTERS[i]}7`]);
}
export { whiteFigures, blackFigures };
