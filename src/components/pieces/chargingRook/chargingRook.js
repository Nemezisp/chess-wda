export default class ChargingRook {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 4 : -4;
        this.set = 3;
        this.hasMoved = false;
        this.icon = this.player === 1 ? 'white-charging_rook.svg' : 'black-charging_rook.svg';
        this.symbol = "CR"
        this.pieceName = "Charging Rook"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = this.player === 1 ? {
            up: [currentSquare + 10, currentSquare + 20, currentSquare + 30, currentSquare + 40, currentSquare + 50, currentSquare + 60, currentSquare + 70],
            left: [currentSquare + 1, currentSquare + 2, currentSquare + 3, currentSquare + 4, currentSquare + 5, currentSquare + 6, currentSquare + 7],
            right: [currentSquare - 1, currentSquare - 2, currentSquare - 3, currentSquare - 4, currentSquare - 5, currentSquare - 6, currentSquare - 7]
        } : {
            down: [currentSquare - 10, currentSquare - 20, currentSquare - 30, currentSquare - 40, currentSquare - 50, currentSquare - 60, currentSquare + 70],
            left: [currentSquare + 1, currentSquare + 2, currentSquare + 3, currentSquare + 4, currentSquare + 5, currentSquare + 6, currentSquare + 7],
            right: [currentSquare - 1, currentSquare - 2, currentSquare - 3, currentSquare - 4, currentSquare - 5, currentSquare - 6, currentSquare - 7]
        };

        for (let direction of Object.keys(maybepossibleMoves)) {
            for (let i = 0; i < maybepossibleMoves[direction].length; i++){
                let finalSquare = maybepossibleMoves[direction][i]
                let pieceOnSquare = pieces[finalSquare].number;
                if (pieceOnSquare || pieceOnSquare === null) {
                    if ((pieceOnSquare > 0 && this.player === 1) || (pieceOnSquare < 0 && this.player === 2)){
                        break;
                    } else if ((pieceOnSquare < 0 && this.player === 1) || (pieceOnSquare > 0 && this.player === 2)) {
                        possibleMoves.push(finalSquare);
                        break;
                    }
                    break;
                } else {
                    possibleMoves.push(finalSquare);
                }
            }
        }

        const maybepossibleMoves2 = this.player === 1 ? [currentSquare-9, currentSquare-10, currentSquare-11] : [currentSquare + 9, currentSquare + 10, currentSquare + 11];
        for (let i=0; i<maybepossibleMoves2.length; i++) {
            if (((this.player === 1 && pieces[maybepossibleMoves2[i]].number <= 0) || (this.player === 2 && pieces[maybepossibleMoves2[i]].number >= 0)) && pieces[maybepossibleMoves2[i]].number !== null){
                possibleMoves.push(maybepossibleMoves2[i]);
            }
        }
        return possibleMoves;
    }
}