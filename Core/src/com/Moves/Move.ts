import {Board} from "../Board";
import Cell from "../Cell";
import { Color } from "../Color";
import { GameState } from "../Game";
import {Piece} from "../Pieces/index";

export class Move {
    board: Board;
    from: Cell;
    to: Cell;
    piece: Piece;
    takenPiece?: Piece;

    preState: GameState;
    postState: GameState;

    constructor(board: Board, from: Cell, to: Cell, state: GameState) {
        if (!from.piece) {
            throw new Error('origin cell is empty');
        }
        this.board = board;
        this.from = from;
        this.piece = from.piece;
        this.to = to;
        this.takenPiece = to.piece;
        this.preState = {...state};
        this.postState = {...state};
        
    }

    make(): GameState {
        this.to.piece = this.from.piece;
        this.from.piece = undefined;

        //clocks
        if (this.preState.traitTo === Color.Black) {
            this.postState.count++;
        }
        if (this.piece.name === 'p' || this.to.piece) {
            this.postState.halfmoveClock = 0;
        } else {
            this.postState.halfmoveClock ++;
        }

        this.piece.nbMove++;

        this.postState.isInCheck = this.board.whosIsCheck(this.postState);

        if (this.piece.name === 'k') {
            let toRemove = this.piece.color === Color.White ? /KQ/ : /kq/;
            this.postState.canCastle = this.preState.canCastle.replace(toRemove, '');
            if (!this.postState.canCastle.length) {
                this.postState.canCastle = '-';
            }
        }

        //switch players
        this.postState.traitTo = this.preState.traitTo === Color.White ? Color.Black : Color.White;

        this.postState.enPassant = undefined;

        return {...this.postState};
    }
    
    undo(): GameState {
        this.to.piece = this.takenPiece;
        this.from.piece = this.piece;
        this.piece.nbMove--;
        return {...this.preState};
    }

    getAlgebricName(): string {
        let tmp = this.piece.name !== 'p' ? this.piece.name : '' ;
        tmp += Board.getAlbebricName(this.from);
        tmp += this.takenPiece ? 'x' : '';
        return tmp+Board.getAlbebricName(this.to);
    }

    getUCIName(): string {
        return Board.getAlbebricName(this.from)+Board.getAlbebricName(this.to);
    }

    isLegal(): boolean {
        this.make();
        const legal = !this.board.isInCheck(this.preState.traitTo, this.preState);
        this.undo();
        return legal;
    }
    
}