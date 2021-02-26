import { Color } from "../Color";
import {Piece, Pawn, Rook, Knight, Bishop, Queen, King} from './index';

export enum PiecesNames {
    'p' = 'p',
    'r' = 'r',
    'n' = 'n',
    'b' = 'b',
    'q' = 'q',
    'k' = 'k'
};

export const piecesNamesAsArray: Array<String> = Object.keys(PiecesNames);

export const piecesNumber: {[x in PiecesNames]: number} = {
    'p':8,
    'r':2,
    'n':2,
    'b':2,
    'q':1,
    'k':1
};

export const piecesClasses = {
    'p': Pawn,
    'r': Rook,
    'n': Knight,
    'b': Bishop,
    'q': Queen,
    'k': King
};

export type PlayerCollection = {
    [p in PiecesNames]: Array<Piece>;
};

export type CompleteCollection = {
    [C in Color]: PlayerCollection;
}

function onePlayerCollection(color: Color): PlayerCollection {
    const res: any = {};
    for (const name in piecesNumber) {
        res[name] = [];
        let n = 0;
        while (n < piecesNumber[name as PiecesNames]) {
            res[name].push( new piecesClasses[name as PiecesNames](color) );
            n++;
        }
    }
    return res as PlayerCollection;
}

export function newCollection(): CompleteCollection {
    return {
        [Color.White]: onePlayerCollection(Color.White),
        [Color.Black]: onePlayerCollection(Color.Black)
    };
}

export class CollectionIterator implements Iterable<Piece> {
    private collection: CompleteCollection;
    private color: Color = Color.White;
    private counter: number = 0;
    private pieceIndex: number = 0;

    constructor(collection: CompleteCollection) {
        this.collection = collection;
    }

    public [Symbol.iterator]() {
        return {
            next: (): IteratorResult<Piece> => {
                const pieceName = piecesNamesAsArray[this.pieceIndex] as PiecesNames;
                let piece: Piece = this.collection[this.color][pieceName]?.[this.counter];
                
                this.counter++;
                if (this.counter >= piecesNumber[pieceName]) {
                    this.pieceIndex++;
                    this.counter = 0;
                }
                if (this.pieceIndex >= piecesNamesAsArray.length) {
                    if (this.color === Color.White) {
                        this.color = Color.Black;
                        this.pieceIndex = 0;
                    }
                }

                return {
                    value: piece,
                    done: piece === undefined
                };
            }
        }
    }
}