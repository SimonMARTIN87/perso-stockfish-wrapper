import {Board} from "../Board";
import Cell from "../Cell";
import { Color } from "../Color";
import { GameState } from "../Game";
import { Move } from "../Moves/Move";
import {Runner} from "./Runner";

export class Queen extends Runner {
    constructor(color: Color) {
        super('q', color);
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
        //up-left
        result.push( ...this.run(position, board, gameState, -1, 1) );
        // up-right
        result.push( ...this.run(position, board, gameState, 1, 1) );
        // down-left
        result.push( ...this.run(position, board, gameState, -1, -1) );
        // down-right
        result.push( ...this.run(position, board, gameState, 1, -1) );

        return result;
    }
}