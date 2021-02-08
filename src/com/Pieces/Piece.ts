import Board from "../Board";
import Cell from "../Cell";
import { Color } from "../Color";
import { GameState } from "../Game";
import { Move } from "../Moves/Move";

export default abstract class Piece {
    name: string;
    color: Color;
    nbMove: number = 0;
    inGame: boolean = false;

    constructor(name: string, color: Color) {
        this.name = name;
        this.color = color;
    }

    toString(): string {
        return this.color === Color.White ? this.name.toUpperCase() : this.name;
    }

    move(): void {
        this.nbMove++;
    }

    checkMove(board: Board, position: Cell, gameState: GameState, dX: number, dY: number): Array<Move> {
        const {x,y} = position;
        if (x + dX >= 0 && x+dX < 8 && y+dY >= 0 && y+dY < 8) {
            const cell = board.grid[x+dX][y+dY];
            if (!cell.piece || cell.piece.color !== this.color) {
                return [new Move(board, position, cell, gameState)];
            }
        }
        return [];
    }

    abstract getPossibleMoves(position: Cell, board: Board, gamestate: GameState): Array<Move>;
}