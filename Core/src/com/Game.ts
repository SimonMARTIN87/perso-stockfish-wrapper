import {Board} from "./Board";
import Cell from "./Cell";
import { Color } from "./Color";
import { Move } from "./Moves/Move";


export interface GameState {
    traitTo: Color;
    count: number;
    halfmoveClock: number;
    canCastle: string;
    enPassant?: Cell;
    isInCheck?: Color;
    isCheckMate?: Color;
}

export const defaultGameState: GameState = {
    traitTo: Color.White,
    count: 1,
    halfmoveClock: 0,
    canCastle: 'KQkg'
};

export class Game {
    
    board: Board;
    state: GameState;

    allMoves: Array<Move> = [];


    constructor() {
        this.board = new Board();
        this.state = {...defaultGameState};
    }
    
    computeLegalMoves(position?: Cell): Array<Move> {
        const res = [];
        // 0: is there a piece ?
        if(position?.piece) {
            // 1: get all possible move from the piece
            const allmoves = position.piece.getPossibleMoves(position, this.board, this.state);

            // 2: remove illegal moves
            res.push(...allmoves.filter( move => {
                return move.isLegal();
            }));
        }
        return res;
    }

    makeMove(move: Move): string {
        if (move.from.piece?.color !== this.state.traitTo ) {
            return "waiting for other player";
        }
        this.state = move.make();
        this.state.isCheckMate = this.board.isCheckMate(this.state);
        this.allMoves.push(move);

        return move.getAlgebricName();
        
    }

    algebricMove(target: string): string {
        const matches = /([^x]{0,3})x?(.{2})$/.exec(target);
        if (matches) {
            const origin = matches[1];
            let pieceName = origin.length === 3 ? origin[0].toLowerCase() : null;
            const fromName = origin.length === 3 ? origin.slice(1) : origin;
            let toName = matches[2].toLowerCase();
            // console.log({origin, pieceName, fromName, toName});

            const from = this.board.getCellByAlgebricName(fromName);
            let to = this.board.getCellByAlgebricName(toName);

            //console.log({from, to});

            if (from?.piece) {
                if (pieceName && from.piece.name !== pieceName) {
                    return 'incorrect long notation, bad piece';
                }
                const legalMoves = this.computeLegalMoves(from);
                for (const move of legalMoves) {
                    if (move.to === to) {
                        return this.makeMove(move);
                    }
                }
            } else {
                console.log('no correct origin detected, tying short algebraic notation...');
            }
        
            let candidateMove: Move|null = null;
            pieceName = origin.length === 1 ? origin.toLowerCase() : 'p';
            toName = origin.length === 3 ? origin.slice(1) : origin;
            // console.log({from, to, pieceName});
            if (to) {
                for (const cell of this.board.allCells) {
                    if (cell.piece?.name === pieceName && cell.piece.color === this.state.traitTo) {
                        const legalMoves = this.computeLegalMoves(cell);
                        for(const move of legalMoves) {
                            if (move.to === to) {
                                if (candidateMove) {
                                    return 'ambiguous move';
                                }
                                candidateMove = move;
                            }
                        }
                    }
                }
                if (candidateMove) {
                    return this.makeMove(candidateMove);
                }
            }
        }
        return 'no target';
    }

    toFEN(): string {
        const traitTo = this.state.traitTo.charAt(0).toLowerCase();
        const enPassant = this.state.enPassant ? Board.getAlbebricName(this.state.enPassant) : '-';
        const board = this.board.getFENSting();
        return `${board} ${traitTo} ${this.state.canCastle} ${enPassant} ${this.state.halfmoveClock} ${this.state.count}`;
    }

    loadFEN(fen: string): boolean {
        const regex = /(.+) (.) (.{1,4}) (.{1,2}) (\d) (\d)/;
        const [_,board,trait,castle,enPassant,half,count] = regex.exec(fen) || [];
        if (!board||!trait||!castle||!enPassant||!half||!count ||
            isNaN(parseInt(half)) || isNaN(parseInt(count)) ) {
            return false;
        }
        this.state = {...defaultGameState};
        this.board = new Board(board);
        this.state.traitTo = trait === 'w' ? Color.White : Color.Black;
        this.state.canCastle = castle;
        this.state.enPassant = this.board.getCellByAlgebricName(enPassant);
        this.state.halfmoveClock = parseInt(half);
        this.state.count = parseInt(count);
        this.state.isInCheck = this.board.whosIsCheck(this.state);
        return true;
    }

    undoLastMove(): boolean {
        const move = this.allMoves.pop();
        if (move) {
            this.state = move?.undo();
            return true;
        }
        return false;
    }
    
}