const LETTERS = Array.from('abcdefgh');

const whiteFigures = [ 
    ['Rook', 'a5'], 
    ['Rook', 'h1'],
    ['Queen', 'd1'],
    ['King', 'e1'],
    ['Bishop', 'c1'],
    ['Bishop', 'f1'],
    ['Knight', 'b1'],
    ['Knight', 'g1'],
];


for (let i = 0; i <= 7; i++){
    whiteFigures.push(["Pawn", `${LETTERS[i]}2`])
}

const blackFigures = [
    ['King', 'e5'],
    ['Bishop', 'c8'],
    ['Bishop', 'f8'],
    ['Knight', 'b8'],
    ['Knight', 'g8'],
];

for (let i = 0; i <= 7; i++){
    blackFigures.push(["Pawn", `${LETTERS[i]}7`])
}

export {whiteFigures, blackFigures};
