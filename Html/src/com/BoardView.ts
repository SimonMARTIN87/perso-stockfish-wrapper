import { Move } from 'perso-chess';
import '../css/boardView.css';
import { MyElement } from './MyElement';

export interface CellElement extends HTMLDivElement {
    move?: Move;
}

export class BoardView extends MyElement{
    cells: Array<CellElement>;

    constructor() {
        super('board');
        this.cells = [];
        this.makeCells();
    }

    private makeCells() {
        for (let y = 0; y<8; y++) {
            for (let x = 0; x<8; x++) {            
                const cell = document.createElement<'div'>('div');
                cell.dataset.x = x.toString();
                cell.dataset.y = (7-y).toString();
                const color = x%2 + y%2 === 1 ? 'white' : 'black';
                cell.classList.add('cell', color);
                
                this.cells.push(cell);
                this.el.appendChild(cell);
            }
        }
    }

    unsetCells() {
        this.cells.forEach(c => {
            c.classList.remove('selected', 'highlight')
            c.move = undefined;
        });
    }

    setSelection(cell?: HTMLElement) {
        cell?.classList.add('selected');
    }

    findCellDiv(x: number, y: number) {
        return this.cells.find(c => c.dataset.x == x.toString() && c.dataset.y == y.toString() );
    }
    
    highlightMoves(moves: Array<Move>) {
        for (const move of moves) {
            const view = this.findCellDiv(move.to.x, move.to.y);
            if (view) {
                view.classList.add('highlight');
                view.move = move;
            }
        }
    }
}