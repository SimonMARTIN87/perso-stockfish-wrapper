import Piece from "./Pieces/Piece";

export default interface Cell {
    x: number;
    y: number;
    piece?: Piece;
}