import { LETTERS } from "../constants/index.js";

export function calcBishopMoves() {
    const startLetter = LETTERS.findIndex((el, i) => el === this.coord[0])
    for (let i = +this.coord[1] + 1; i <= 8; i++) {
        const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
        if (this._checkMove(nextCoord)) break
    }
    for (let i = +this.coord[1] - 1; i > 0; i--) {
        const nextCoord = LETTERS[startLetter + i - +this.coord[1]] + i
        if (this._checkMove(nextCoord)) break
    }
    for (let i = +this.coord[1] + 1; i <= 8; i++) {
        const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
        if (this._checkMove(nextCoord)) break
    }
    for (let i = +this.coord[1] - 1; i > 0; i--) {
        const nextCoord = LETTERS[startLetter - i + +this.coord[1]] + i
        if (this._checkMove(nextCoord)) break
    }
}


export function calcRookMoves() {
    for (let i = +this.coord[1] - 1; i > 0; i--) {
        const nextCoord = this.coord[0] + i
        if (this._checkMove(nextCoord)) break
    }
    for (let i = +this.coord[1] + 1; i <= 8; i++) {
        const nextCoord = this.coord[0] + i
        if (this._checkMove(nextCoord)) break
    }
    const startLetter = LETTERS.findIndex((el) => el === this.coord[0])
    for (let i = startLetter - 1; i >= 0; i--) {
        const nextCoord = LETTERS[i] + this.coord[1]
        if (this._checkMove(nextCoord)) break
    }
    for (let i = startLetter + 1; i < 8; i++) {
        const nextCoord = LETTERS[i] + this.coord[1]
        if (this._checkMove(nextCoord)) break
    }
}


