import { Color } from "../Color";
import Bishop from "./Bishop";
import King from "./King";
import Knight from "./Knight";
import Pawn from "./Pawn";
import Piece from "./Piece";
import Queen from "./Queen";
import Rook from "./Rook";

export interface PlayerCollection {
    'p': Array<Pawn>;
    'r': Array<Rook>;
    'n': Array<Knight>;
    'b': Array<Bishop>;
    'q': Queen;
    'k': King;
};

export type CompleteCollection = {
    [C in Color]: PlayerCollection;
}

function onePlayerCollection(color: Color): PlayerCollection {
    const pawns = [];
    for (let x = 0; x < 8; x++) {
        pawns.push(new Pawn(color));
    }
    return {
        'p': pawns,
        'r': [new Rook(color), new Rook(color)],
        'n': [new Knight(color), new Knight(color)],
        'b': [new Bishop(color), new Bishop(color)],
        'q': new Queen(color),
        'k': new King(color)
    };
}

export function newCollection(): CompleteCollection {
    return {
        [Color.White]: onePlayerCollection(Color.White),
        [Color.Black]: onePlayerCollection(Color.Black)
    };
}
