import {Board} from "../Board";
import Cell from "../Cell";
import { GameState } from "../Game";
import { Move } from "./Move";

export class Castle extends Move {
    rookStart: Cell;
    rookEnd: Cell;

    constructor(board: Board, from: Cell, to: Cell, rookStart: Cell, state: GameState) {
        super(board, from, to, state);
        this.rookStart = rookStart;

        if (rookStart.x === 0) {
            this.rookEnd = board.grid[3][rookStart.y];
        } else {
            this.rookEnd = board.grid[5][rookStart.y];
        }
    }

    make(): GameState {
        const postState = super.make();

        this.rookEnd.piece = this.rookStart.piece;
        this.rookStart.piece = undefined;

        return {...postState};
    }

    undo(): GameState {
        this.rookStart.piece = this.rookEnd.piece;
        this.rookEnd.piece = undefined;
        return super.undo();
    }
}