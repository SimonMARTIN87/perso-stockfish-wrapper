import Board from "../Board";
import Cell from "../Cell";
import { GameState } from "../Game";
import Piece from "../Pieces/Piece";
import { Move } from "./Move";

export class EnPassant extends Move {
    trueTarget: Cell;
    takenPawn?: Piece;

    constructor(board: Board, from: Cell, to: Cell, trueTarget: Cell, state: GameState) {
        super(board, from, to, state);
        this.trueTarget = trueTarget;
        this.takenPawn = trueTarget.piece;
    }

    make(): GameState {
        const postState = super.make();

        this.trueTarget.piece = undefined;

        return {...postState};
    }

    undo(): GameState {
        this.trueTarget.piece = this.takenPawn;
        return super.undo();
    }
}