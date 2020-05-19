export default class Pawn {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 1 : -1;
        this.hasMoved = false;
        this.icon = this.player === 1 ? 'white-pawn.svg' : 'black-pawn.svg';
        this.symbol = "";
        this.pieceName = "Pawn"
    }

    maybePossibleMoves (currentSquare, pieces, previousMoves) {
        let possibleMoves = [];
        let lastMove = previousMoves[previousMoves.length-1]
        if (this.player === 1){ 
            if (!pieces[currentSquare + 10].number){
                possibleMoves.push(currentSquare + 10);
                if (!this.hasMoved && !pieces[currentSquare + 20].number) { //first pawn move
                    possibleMoves.push(currentSquare + 20);
                }
            } 
            if (pieces[currentSquare+11].number < 0){ //capture to the left 
                possibleMoves.push(currentSquare+11)
            } 
            if (pieces[currentSquare+9].number < 0){ //capture to the right
                possibleMoves.push(currentSquare+9)
            }
            if (pieces[currentSquare+1].number === -1 && lastMove[3] === currentSquare+1 && lastMove[2] === currentSquare+21){ // enpassant to the left
                possibleMoves.push(currentSquare+11)
            }
            if (pieces[currentSquare-1].number === -1 && lastMove[3] === currentSquare-1 && lastMove[2] === currentSquare+19){ // enpassant to the right
                possibleMoves.push(currentSquare + 9)
            }
        }
        else if (this.player === 2){ 
            if (!pieces[currentSquare - 10].number){
                possibleMoves.push(currentSquare-10);
                if (!this.hasMoved && !pieces[currentSquare - 20].number) { //first pawn move
                    possibleMoves.push(currentSquare-20);
                }
            }
            if (pieces[currentSquare-11].number > 0){   //capturing to the left
                possibleMoves.push(currentSquare-11)
            } 
            if (pieces[currentSquare-9].number > 0){   //capturing to the right
                possibleMoves.push(currentSquare-9)
            }
            if (pieces[currentSquare-1].number === 1 && lastMove[3] === currentSquare-1 && lastMove[2] === currentSquare-21) { //enpassant to the left
                possibleMoves.push(currentSquare-11)
            }
            if (pieces[currentSquare+1].number === 1 && lastMove[3] === currentSquare+1 && lastMove[2] === currentSquare-19) { //enpassant to the right
                possibleMoves.push(currentSquare-9)
            }
        }
        return possibleMoves;
    }

    checkEnPassant (previousMoves, pieces, lastSquare, currentSquare) {
        let lastMove = previousMoves[previousMoves.length-1]
        if (lastSquare.toString()[0] !== currentSquare.toString()[0]){ //if move on which we check for en passant was a capture
            if (this.player === 1 && currentSquare.toString()[0] === '7') {
                if (lastMove[3] === (lastMove[2] - 20)){ //if last move was by two squares
                    if(pieces[currentSquare-10].number === -1){ //if piece standing on the square that the last move was made to is a black pawn
                        return true;
                    }
                }
            } else if (this.player === 2 && currentSquare.toString()[0] === '4'){
                if (lastMove[3] === (lastMove[2] + 20)){//if last move was by two squares
                    if(pieces[currentSquare+10].number === 1){ //if piece standing on the square that the last move was made to is a white pawn
                        return true;
                    }
                }
            }
        }
        return false;
    }
}