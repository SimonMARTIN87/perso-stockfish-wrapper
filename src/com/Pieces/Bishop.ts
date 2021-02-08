import Board from "../Board";
import Cell from "../Cell";
import { Color } from "../Color";
import { GameState } from "../Game";
import { Move } from "../Moves/Move";
import Runner from "./Runner";

export default class Bishop extends Runner {
    constructor(color: Color) {
        super('b', color);
    }

    getPossibleMoves(position: Cell, board: Board, gameState: GameState): Array<Move> {
        let result: Array<Move> = [];

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