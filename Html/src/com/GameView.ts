import '../css/gameView.css';
import { BoardView, CellElement } from "./BoardView";
import { MyElement } from "./MyElement";
import { CollectionIterator, Game } from 'perso-chess';
import { PieceView } from "./PieceView";
import { ManualInput } from './ManualInput';
import { BotButton } from './BotButton';

export class GameView extends MyElement {
    boardView: BoardView;
    game: Game;
    piecesViews: Array<PieceView>;
    manualInput: ManualInput;
    botButton: BotButton;
    socket: WebSocket;
    
    constructor(game: Game) {
        super('game');
        this.game = game;

        this.boardView = new BoardView();
        this.boardView.addToDom(this.el);
        this.boardView.el.addEventListener('click', this.handleClick.bind(this));

        this.piecesViews = [];
        this.makePieces();
        this.placePieces();

        this.manualInput = new ManualInput(this.handleManualMove.bind(this));
        this.manualInput.addToDom(this.el);

        this.botButton = new BotButton(this.handleBotButton.bind(this));
        this.botButton.addToDom(this.el);

        this.socket = new WebSocket('ws://localhost:8080');
        this.socket.onmessage = this.handleBotMessage.bind(this);

    }

    private makePieces() {
        const iterator: CollectionIterator = new CollectionIterator(this.game.board.pieces);
        for(const piece of iterator) {
            const view = new PieceView(piece);
            this.piecesViews.push(view);
            view.addToDom(this.boardView.el);
        }
    }

    private placePieces() {
        this.piecesViews.forEach(v => v.deplace());
        for (const cell of this.game.board.allCells) {
            if (cell.piece) {
                const view = this.piecesViews.find(v => v.piece === cell.piece);
                view?.setPosition(cell.x, cell.y);
            }
        }
        this.piecesViews.forEach(v => {
            if (!v.isplaced) {
                v.hide();
            }
        })
    }

    handleClick(event: MouseEvent) {
        const cell = event.target as CellElement;
        if (cell.move) {
            this.game.makeMove(cell.move);
            this.boardView.unsetCells();
            this.placePieces();
        } else {
            this.boardView.unsetCells();
            const trueX = parseInt(cell.dataset.x||'', 10);
            const trueY = parseInt(cell.dataset.y||'', 10);

            const gameCell = this.game.board.grid[trueX][trueY];
            if (gameCell.piece?.color === this.game.state.traitTo) {
                this.boardView.setSelection(cell);
                const moves = this.game.computeLegalMoves(gameCell);
                this.boardView.highlightMoves(moves);
            } else {
                this.boardView.setSelection(undefined);
            }
        }

    }

    handleManualMove(event: Event) {
        console.log(this.game.algebricMove(this.manualInput.value));
        this.placePieces();
        this.manualInput.reset();
    }

    handleBotButton(event: Event) {
        this.socket.send(this.game.toFEN());
    }

    handleBotMessage(event: MessageEvent<string>) {
        const res = JSON.parse(event.data);
        console.log(this.game.algebricMove(res.move));
        this.botButton.label = res.score;
        this.placePieces();
    }

    
}