export default class Chancellor {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 5 : -5;
        this.set = 4;
        this.icon = this.player === 1 ? 'white-chancellor.svg' : 'black-chancellor.svg';
        this.symbol = "CH";
        this.pieceName = "Chancellor"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = {
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

        const maybepossibleMoves2 = [currentSquare-19, currentSquare-21, currentSquare-8, currentSquare-12, 
                                    currentSquare+12, currentSquare+8, currentSquare+21, currentSquare+19]

        for (let square of maybepossibleMoves2) {
            if (((this.player === 1 && pieces[square].number <= 0) || (this.player === 2 && pieces[square].number >= 0)) && pieces[square].number !== null){
                possibleMoves.push(square)
            }
        }
        return possibleMoves;
    }
}