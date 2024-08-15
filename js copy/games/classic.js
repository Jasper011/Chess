const LETTERS = Array.from('abcdefgh');

const whiteFigures = [ 
    ['Rook', 'a1'], 
    ['Rook', 'h1'],
    ['Queen', 'd1'],
    ['King', 'e1'],
    ['Bishop', 'c1'],
    ['Bishop', 'f1'],
    ['Horse', 'b1'],
    ['Horse', 'g1'],
];

for (let i = 0; i <= 7; i++){
    whiteFigures.push(["Pawn", `${LETTERS[i]}2`])
}

const blackFigures = [ 
    ['Rook', 'a8'], 
    ['Rook', 'h8'],
    ['Queen', 'd8'],
    ['King', 'e8'],
    ['Bishop', 'c8'],
    ['Bishop', 'f8'],
    ['Horse', 'b8'],
    ['Horse', 'g8'],
];


for (let i = 0; i <= 7; i++){
    blackFigures.push(["Pawn", `${LETTERS[i]}7`])
}
export {whiteFigures, blackFigures};
