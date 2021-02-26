import '../css/pieceView.css';
import { MyElement } from "./MyElement";
import { Piece } from 'perso-chess';

export class PieceView extends MyElement {
    piece: Piece;
    isplaced: boolean = false;

    constructor(piece: Piece) {
        super('piece');
        this.piece = piece;
        //this.el.innerText = piece.toString();
        this.el.classList.add(piece.name, 'piece-'+piece.color);
    }

    setPosition(x: number, y: number) {
        this.el.style.left = (x * 12.5)+'%';
        this.el.style.top = ((7-y) * 12.5)+'%';
        this.isplaced = true;
    }

    deplace() {
        this.isplaced =  false;
    }

    hide() {
        this.el.style.display = 'none';
    }

}