import readline from 'readline';
import FileSaver from '../utils/fileSave';
import {Game} from 'perso-chess';
import BoardPrinter from './BoardPrinter';
import { EngineWrapper } from 'perso-chess-engine';

export default class RLInterface {
    rl: readline.Interface;
    game: Game;
    bot: EngineWrapper;

    constructor(game: Game, bot: EngineWrapper) {
        this.game = game;
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.handleInput = this.handleInput.bind(this);
        this.bot = bot;
    }

    start() {
        BoardPrinter.printGame(this.game);
        this.rl.on('line', this.handleInput );
    }

    stop() {
        this.rl.off('line', this.handleInput );
    }

    async handleInput(input: string) {
        try {
            if (input === 'save') {
                await FileSaver.save(this.game);
                console.log('Game saved !');
            } else if (input.startsWith('load')) {
                const fen = await FileSaver.load();
                if (this.game.loadFEN(fen) ) {
                    BoardPrinter.printGame(this.game);
                } else {
                    console.log('load failed !');
                }
            } else if (input === 'undo') {
                this.game.undoLastMove();
                BoardPrinter.printGame(this.game);
            } else if (input.startsWith('grab ')) {
                const target = input.slice(5);
                const cell = this.game.board.getCellByAlgebricName(target);
                if (cell ) {
                    const legalMoves = this.game.computeLegalMoves(cell);
                    legalMoves.forEach(move => console.log(move.getAlgebricName()));
                }
            } else if (input === 'bot') {
                const move = await this.bot.getNextMove(this.game.toFEN());
                console.log({move});
                this.game.algebricMove(move);
                BoardPrinter.printGame(this.game);
            } else {
                console.log(this.game.algebricMove(input));
                BoardPrinter.printGame(this.game);
            }
        } catch (error) {
            console.error(error);
        }
    }
}
    
