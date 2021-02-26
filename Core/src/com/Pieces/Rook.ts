import {Board} from "../Board";
import Cell from "../Cell";
import { Color } from "../Color";
import { GameState } from "../Game";
import { Move } from "../Moves/Move";
import {Runner} from "./Runner";

export class Rook extends Runner {
    constructor(color: Color) {
        super('r', color);
    }

    getPossibleMoves(position: Cell, board: Board, gameState: GameState): Array<Move> {
        let result: Array<Move> = [];

        // up
        result.push( ...this.run(position, board, gameState, 0, 1) );
        // right
        result.push( ...this.run(position, board, gameState, 1, 0) );
        // down
        result.push( ...this.run(position, board, gameState, 0, -1) );
        // left
        result.push( ...this.run(position, board, gameState, -1, 0) );

        return result;
    }
}