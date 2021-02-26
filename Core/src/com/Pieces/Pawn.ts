import {Board} from "../Board";
import Cell from "../Cell";
import { Color } from "../Color";
import { GameState } from "../Game";
import { EnPassant } from "../Moves/EnPassant";
import { Move } from "../Moves/Move";
import { PawnFirstStep } from "../Moves/PawnFirstStep";

import {Piece} from "./Piece";

export class Pawn extends Piece {
    id: number;
    constructor(color: Color) {
        super('p', color);
        this.id = Math.round(Math.random()*100);
    }

    getPossibleMoves(position: Cell, board: Board, gameState: GameState): Array<Move> {
        let result: Array<Move> = [];
        let deltaY = this.color === Color.White ? 1 : -1;
        
        // classic move
        let cell = board.grid[position.x][position.y + deltaY];
        if (!cell.piece) {
            result.push(new Move(board, position, cell, gameState));
        }

        //first step
        if (this.nbMove === 0) {
            const enPassant = cell;
            cell = board.grid[position.x][position.y + deltaY*2];
            if (!cell.piece) {
                result.push(new PawnFirstStep(board, position, cell,enPassant, gameState));   
            }
        }

        // takes
        if (position.x > 0) {
            cell = board.grid[position.x-1][position.y + deltaY];
            if (cell.piece && cell.piece.color !== this.color) {
                result.push(new Move(board, position, cell, gameState));
            }
        }
        if (position.x < 7) {
            cell = board.grid[position.x+1][position.y + deltaY];
            if (cell.piece && cell.piece.color !== this.color) {
                result.push(new Move(board, position, cell, gameState));
            }
        }

        // en passant
        if (gameState.enPassant) {
            if (Math.abs(position.x - gameState.enPassant.x) == 1 &&
                Math.abs(position.y - gameState.enPassant.y) == 1) {
                    let trueTarget = board.grid[gameState.enPassant.x][position.y];
                    result.push(new EnPassant(board,position,gameState.enPassant,trueTarget, gameState));
                }
        }

        return result;
    }

}