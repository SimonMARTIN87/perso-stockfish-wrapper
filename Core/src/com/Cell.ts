import {Piece} from "./Pieces/index";

export default interface Cell {
    x: number;
    y: number;
    piece?: Piece;
}