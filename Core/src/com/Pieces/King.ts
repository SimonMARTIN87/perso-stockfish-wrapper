import {Board} from "../Board";
import Cell from "../Cell";
import { Color } from "../Color";
import { GameState } from "../Game";
import { Castle } from "../Moves/Castle";
import { Move } from "../Moves/Move";
import {Piece} from "./Piece";

export class King extends Piece {
    constructor(color: Color) {
        super('k', color);
    }

    getPossibleMoves(position: Cell, board: Board, state: GameState): Array<Move> {
        const result: Array<Move> = [];

        result.push(...this.checkMove(board, position, state, -1,-1));
        result.push(...this.checkMove(board, position, state, -1,1));
        result.push(...this.checkMove(board, position, state, 0,-1));
        result.push(...this.checkMove(board, position, state, 0,1));
        result.push(...this.checkMove(board, position, state, 1,-1));
        result.push(...this.checkMove(board, position, state, 1,1));

        const [kingSide] = this.checkMove(board, position, state, 1,0);
        if (kingSide) {
            result.push(kingSide);
            if (this.nbMove === 0 && state.canCastle.includes(this.toUpperOrNot('k'))) {
                if (kingSide.isLegal()) {
                    const rookStart = board.grid[7][position.y];
                    const kingEnd = board.grid[6][position.y];
                    result.push(new Castle(board,position,kingEnd,rookStart, state));
                }
            }
        }
        const [queenSide] = this.checkMove(board, position, state, -1,0);
        if (queenSide) {
            result.push(queenSide);
            if (this.nbMove === 0 && state.canCastle.includes(this.toUpperOrNot('q'))) {
                if (queenSide.isLegal()) {
                    const rookStart = board.grid[0][position.y];
                    const kingEnd = board.grid[2][position.y];
                    result.push(new Castle(board,position,kingEnd,rookStart, state));
                }
            }
        }

        return result;
    }

    private toUpperOrNot(str: string): string {
        return this.color === Color.White ? str.toUpperCase() : str.toLowerCase(); 
    }
}