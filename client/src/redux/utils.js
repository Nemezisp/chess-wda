import Empty from '../components/pieces/empty/empty';

export const makeMove = (pieces, startSquare, endSquare) => {
    [pieces[startSquare], pieces[endSquare]] = [new Empty(), pieces[startSquare]];
    pieces[endSquare].hasMoved = true;
    return pieces;
}

export const enPassant = (pieces, startSquare, endSquare, pawnToRemoveSquare) => {
    [pieces[startSquare], pieces[endSquare], pieces[pawnToRemoveSquare]] = [new Empty(), pieces[startSquare], new Empty()];
    return pieces;
}

export const castling = (pieces, rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare) => {
    [pieces[rookStartSquare], pieces[rookEndSquare], pieces[kingStartSquare], pieces[kingEndSquare]] = [new Empty(), pieces[rookStartSquare], new Empty(), pieces[kingStartSquare]];
    pieces[kingEndSquare].hasMoved = true;
    pieces[rookEndSquare].hasMoved = true;
    return pieces;
}

export const piecePromotion = (pieces, startSquare, endSquare, pieceToPromoteTo) => {
    [pieces[startSquare], pieces[endSquare]] = [new Empty(), pieceToPromoteTo];    
    return pieces;
}