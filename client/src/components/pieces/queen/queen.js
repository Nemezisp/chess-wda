export default class Queen {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 5 : -5;
        this.set = 1;
        this.icon = this.player === 1 ? 'white-queen.svg' : 'black-queen.svg';
        this.symbol = "Q";
        this.pieceName = "Queen"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = {
            upRight: [currentSquare + 9, currentSquare + 18, currentSquare + 27, currentSquare + 36, currentSquare + 45, currentSquare + 54, currentSquare + 63],
            downLeft: [currentSquare - 9, currentSquare - 18, currentSquare - 27, currentSquare - 36, currentSquare - 45, currentSquare - 54, currentSquare - 63],
            upLeft: [currentSquare + 11, currentSquare + 22, currentSquare + 33, currentSquare + 44, currentSquare + 55, currentSquare + 66, currentSquare + 77],
            downRight: [currentSquare - 11, currentSquare - 22, currentSquare - 33, currentSquare - 44, currentSquare - 55, currentSquare - 66, currentSquare - 77],
            up: [currentSquare + 10, currentSquare + 20, currentSquare + 30, currentSquare + 40, currentSquare + 50, currentSquare + 60, currentSquare + 70],
            down: [currentSquare - 10, currentSquare - 20, currentSquare - 30, currentSquare - 40, currentSquare - 50, currentSquare - 60, currentSquare - 70],
            left: [currentSquare + 1, currentSquare + 2, currentSquare + 3, currentSquare + 4, currentSquare + 5, currentSquare + 6, currentSquare + 7],
            right: [currentSquare - 1, currentSquare - 2, currentSquare - 3, currentSquare - 4, currentSquare - 5, currentSquare - 6, currentSquare - 7]
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
        return possibleMoves;
    }
}