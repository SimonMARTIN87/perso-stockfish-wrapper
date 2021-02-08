import Cell from "./Cell";
import { Color } from "./Color";
import { GameState } from "./Game";
import { CompleteCollection, newCollection, PlayerCollection } from "./Pieces/Collection";
import Piece from "./Pieces/Piece";



export default class Board {
    grid: Array<Array<Cell>> = [];
    allCells: Array<Cell> = [];
    static letters: Array<String>  = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    pieces: CompleteCollection;

    constructor(fen?: string) {
        this.pieces = newCollection();
        this.makeGrid(fen);
    }

    makeGrid(fen?: string): void {
        const fenGrid: Array<String> = this.transformFEN(fen);
        for (let x = 0; x < 8; x++) {
            const col: Array<Cell>  = [];
            for (let y = 0; y < 8; y++) {
                const cell: Cell = {x, y};
                col.push(cell);
                this.allCells.push(cell);

                // is there any piece here?
                if (fen) {
                    cell.piece = this.getPieceFromFENGrid(x,y,fenGrid);
                } else {
                    cell.piece = this.getPieceAtStartingPosition(x,y);    
                }
                if (cell.piece) {
                    cell.piece.inGame = true;
                }
            }
            this.grid.push(col);
        }
    }

    transformFEN(fen?: string): Array<String> {
        let lines = fen?.split('/') || [];
        lines = lines.map(line => {
            return line.replace(/\d/g, ([s]) => {
                return ' '.repeat(parseInt(s));
            });
        });
        return lines;
    }

    private getPieceFromFENGrid(x: number, y: number, fen: Array<String>): Piece|undefined {
        const letter = fen[7-y][x];
        if (letter && letter !== ' ') {
            const pieceName: string = letter.toLowerCase();
            const color: Color = pieceName === letter ? Color.Black : Color.White;
            if (Object.keys(this.pieces[color]).includes(pieceName)) {
                const tmp = this.pieces[color][pieceName as keyof PlayerCollection];
                const piece =  Array.isArray(tmp) ? tmp.find(p => !p.inGame) : tmp;
                if (piece) {
                    piece.inGame = true;
                    if (piece.name === 'p') {
                        piece.nbMove = [1,6].includes(y) ? 0 : 1;
                    }
                }
                return piece;
            }

        }
        return undefined;
    }

    private getPieceAtStartingPosition(x:number, y:number): Piece|undefined {
        if (y===1) {
            return this.pieces[Color.White]['p'][x];
        } else if (y === 6) {
            return this.pieces[Color.Black]['p'][x];
        } else if (y === 0 || y === 7){
            const color: Color = y === 0 ? Color.White : Color.Black;
            switch(x) {
                case 0:
                    return this.pieces[color]['r'][0]
                case 7:
                    return this.pieces[color]['r'][1];
                case 1:
                    return this.pieces[color]['n'][0];
                case 6:
                    return this.pieces[color]['n'][1];
                case 2:
                    return this.pieces[color]['b'][0];
                case 5:
                    return this.pieces[color]['b'][1];
                case 3:
                    return this.pieces[color]['q'];
                case 4:
                    return this.pieces[color]['k'];
            }
        }
    }

    getCellByAlgebricName(name: string): Cell|undefined {
        const [letter, num] = name;
        if (letter && num) {
            const x = Board.letters.indexOf(letter.toLowerCase());
            const y = parseInt(num, 10) - 1;
            if (x >= 0 && x < 8 && y >= 0 && y < 8) {
                return this.grid[x][y];
            }
        }
        return undefined;
    }

    static getAlbebricName(cell: Cell): string {
        const letter = Board.letters[cell.x];
        return `${letter}${cell.y+1}`;
    }

    getFENSting(): string {
        let str = '';
        let nbOfVoid = 0;
        for (let y = 7; y >= 0; y--) {
            for (let x = 0; x < 8 ; x++) {
                const cell = this.grid[x][y];
                if (!cell.piece) {
                    nbOfVoid++;
                } else {
                    if (nbOfVoid) {
                        str += nbOfVoid;
                    }
                    str += cell.piece.toString();
                    nbOfVoid = 0;
                }
            }
            if (nbOfVoid > 0) {
                str += nbOfVoid;
                nbOfVoid = 0;
            }

            if( y !== 0) {
                str += '/';
            }
        }
        return str;
    }

    isInCheck(state: GameState): Color|undefined {
        for (const cell of this.allCells) {
            if (cell.piece) {
                const moves = cell.piece.getPossibleMoves(cell, this, state);
                const takesKing = moves.find(c => c.takenPiece?.name === 'k');
                if (takesKing) {
                    return takesKing.takenPiece?.color;
                }
            }
        }
        return undefined;
    }

    isCheckMate(state: GameState): Color|undefined {
        if (state.isInCheck) {
            for(const cell of this.allCells) {
                if (cell.piece?.color === state.isInCheck) {
                    let moves = cell.piece.getPossibleMoves(cell, this, state);
                    moves = moves.filter(move => {
                        move.make();
                        const stillInCheck = move.postState.isInCheck;
                        move.undo();
                        return stillInCheck !== state.isInCheck;
                    });
                    if (moves.length) {
                        return undefined;
                    }
                }
            }
            return state.isInCheck;
        }
        return undefined;
    }

}