import { Figure } from "./Figure/index.js";
import { Bishop } from "./Bishop/index.js";
import { Rook } from "./Rook/index.js";
import { King } from "./King/index.js";
import { Queen } from "./Queen/index.js";
import { Pawn } from "./Pawn/index.js";
import { Horse } from "./Horse/index.js";

console.log(Rook);

const figureTypes = {
    Rook,
    Bishop,
    King,
    Queen,
    Pawn,
    Horse
}

export { 
    Figure,
    Bishop,
    Rook,
    King,
    Queen,
    Pawn,
    Horse,
    figureTypes
};