import { Move } from "./Move";
import {Board} from "../Board";
import Cell from "../Cell";
import { GameState } from "../Game";

export class PawnFirstStep extends Move {
    enPassant: Cell;
    constructor(board: Board, from: Cell, to: Cell, enpassant: Cell, state: GameState) {
        super(board, from, to, state);
        this.enPassant = enpassant;
    }

    make(): GameState {
        const postState = super.make();

        postState.enPassant = this.enPassant;

        return {...postState};
    }

    undo() {
        const preState = super.undo();
        preState.enPassant = undefined;
        return preState;
    }
}