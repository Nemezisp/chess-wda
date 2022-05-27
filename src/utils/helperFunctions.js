import King from "../components/pieces/king/king";
import Pawn from "../components/pieces/pawn/pawn";
import Forbidden from "../components/pieces/forbidden/forbidden";
import Empty from "../components/pieces/empty/empty";

export const getStartingPositionArray = (whitePieceList, blackPieceList) => {  //create an array with all pieces on starting squares in 10x12 board representation
    const pieces = [];
    for (let i = 0; i < 120; i++) {
        if (i === 22 ||i === 27) {
            pieces.push(new whitePieceList[0](1))
        } else if (i === 92 ||i === 97) {
            pieces.push(new blackPieceList[0](2))
        } else if (i === 21 ||i === 28){
            pieces.push(new whitePieceList[2](1))
        } else if (i === 91 ||i === 98) {
            pieces.push(new blackPieceList[2](2))
        } else if (i === 23 ||i === 26) {
            pieces.push(new whitePieceList[1](1))
        } else if (i === 93 ||i === 96) {
            pieces.push(new blackPieceList[1](2))
        } else if (i === 24) {
            pieces.push(new King(1))
        } else if (i === 94) {
            pieces.push(new King(2))
        } else if (i === 25) {
            pieces.push(new whitePieceList[3](1))
        } else if (i === 95) {
            pieces.push(new blackPieceList[3](2))
        } else if (i >= 31 && i <= 38) {
            pieces.push(new Pawn(1))
        } else if (i >= 81 && i <= 88) {
            pieces.push(new Pawn(2))
        } else if ((i >= 41 && i <= 48) || (i >= 51 && i <= 58 ) || (i >= 61 && i <= 68 ) || (i >= 71 && i <= 78)){
            pieces.push(new Empty())
        } else {
            pieces.push(new Forbidden ())
        }
    }
    return pieces;
}

export const isEven = (num) => num % 2 === 0; 