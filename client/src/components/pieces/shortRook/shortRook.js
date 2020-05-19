export default class ShortRook {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 4 : -4;
        this.set = 4;
        this.hasMoved = false;
        this.icon = this.player === 1 ? 'white-short_rook.svg' : 'black-short_rook.svg';
        this.symbol = "R4";
        this.pieceName = "Short Rook"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = {
            up: [currentSquare + 10, currentSquare + 20, currentSquare + 30, currentSquare + 40],
            down: [currentSquare - 10, currentSquare - 20, currentSquare - 30, currentSquare - 40],
            left: [currentSquare + 1, currentSquare + 2, currentSquare + 3, currentSquare + 4],
            right: [currentSquare - 1, currentSquare - 2, currentSquare - 3, currentSquare - 4]
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