import Board from '../com/Board';
import {Game} from '../com/Game';

export default class BoardPrinter {

    static printGame(game: Game) {
        console.log(game.toFEN());
        if (game.state.isInCheck) {
            if (game.state.isCheckMate) {
                console.log(game.state.isInCheck, 'is checkMate.');                
            } else {
                console.log(game.state.isInCheck, 'is in check');
            }
        }
        console.log('Trait to '+game.state.traitTo);
        BoardPrinter.printBoard(game.board);
    }

    static printBoard(board: Board) {
        let str = '';
        for (let y = 7; y >= 0; y--) {
            for (let x = 0; x < 8 ; x++) {
                const piece = board.grid[x][y].piece;
                if (piece) {
                    str += `[${piece.toString()}]`;
                } else {
                    str += '[ ]';
                }
            }
            str += `\n`;
        }
        console.log(str);
    }
}