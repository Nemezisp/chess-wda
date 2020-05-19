export default class Bede {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 4 : -4;
        this.set = 2;
        this.hasMoved = false;
        this.icon = this.player === 1 ? 'white-bede.svg' : 'black-bede.svg';
        this.symbol = 'BD'
        this.pieceName = 'Bede'
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = {
            upRight: [currentSquare + 9, currentSquare + 18, currentSquare + 27, currentSquare + 36, currentSquare + 45, currentSquare + 54, currentSquare + 63],
            downLeft: [currentSquare - 9, currentSquare - 18, currentSquare - 27, currentSquare - 36, currentSquare - 45, currentSquare - 54, currentSquare - 63],
            upLeft: [currentSquare + 11, currentSquare + 22, currentSquare + 33, currentSquare + 44, currentSquare + 55, currentSquare + 66, currentSquare + 77],
            downRight: [currentSquare - 11, currentSquare - 22, currentSquare - 33, currentSquare - 44, currentSquare - 55, currentSquare - 66, currentSquare - 77]
        }

        for (let direction of Object.keys(maybepossibleMoves)) {
            for (let i = 0; i < maybepossibleMoves[direction].length; i++){
                let finalSquare = maybepossibleMoves[direction][i]
                let pieceOnSquare = pieces[finalSquare].number;
                if (pieceOnSquare || pieceOnSquare === null) {
                    if ((pieceOnSquare > 0 && this.player === 1) || (pieceOnSquare < 0 && this.player === 2)){
                        break;
                    } else if ((pieceOnSquare < 0 && this.player === 1) || (pieceOnSquare > 0 && this.player === 2)) {
                        possibleMoves.push(finalSquare)
                        break;
                    }
                    break;
                } else {
                    possibleMoves.push(finalSquare)
                }
            }
        }

        const maybepossibleMoves2 = [currentSquare + 20, currentSquare - 20, currentSquare + 2, currentSquare -2] 
        for (let square of maybepossibleMoves2) {
            if (((this.player === 1 && pieces[square].number <= 0) || (this.player === 2 && pieces[square].number >= 0)) && pieces[square].number !== null){
                possibleMoves.push(square)
            }
        }
        return possibleMoves;
    }
}