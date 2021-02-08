import Board from "../Board";
import Cell from "../Cell";
import { GameState } from "../Game";
import { Move } from "../Moves/Move";
import Piece from "./Piece";

export default abstract class Runner extends Piece {
    
    run (position: Cell, board: Board, state: GameState, deltaX: number, deltaY:number): Array<Move> {
        let result: Array<Move> = [];

        let {x,y} = position;
        while( x+deltaX >= 0 && x+deltaX < 8 && y+deltaY >= 0 && y+deltaY < 8  ) {
            const cell = board.grid[x+deltaX][y+deltaY];
            if (!cell.piece) {
                result.push(new Move(board, position,cell,state));
            } else {
                if (cell.piece.color !== this.color) {
                    result.push(new Move(board, position,cell,state));
                }
                break;
            }
            x+=deltaX;
            y+=deltaY;
        }

        return result;
    }
}