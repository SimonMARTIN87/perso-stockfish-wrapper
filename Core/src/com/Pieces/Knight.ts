import {Board} from "../Board";
import Cell from "../Cell";
import { Color } from "../Color";
import { GameState } from "../Game";
import { Move } from "../Moves/Move";
import {Piece} from "./Piece";

export class Knight extends Piece {
    constructor(color: Color) {
        super('n', color);
    }

    getPossibleMoves(position: Cell, board: Board, gameState: GameState): Array<Move> {
        const result: Array<Move> = [];

        result.push(...this.checkMove(board, position, gameState, -2,1));
        result.push(...this.checkMove(board, position, gameState, -2,-1));
        result.push(...this.checkMove(board, position, gameState, 2,1));
        result.push(...this.checkMove(board, position, gameState, 2,-1));
        result.push(...this.checkMove(board, position, gameState, 1,-2));
        result.push(...this.checkMove(board, position, gameState, 1,2));
        result.push(...this.checkMove(board, position, gameState, -1,-2));
        result.push(...this.checkMove(board, position, gameState, -1,2));

        return result;
    }
}