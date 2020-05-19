export default class ChargingKnight {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 3 : -3;
        this.set = 3;
        this.icon = this.player === 1 ? 'white-charging_knight.svg' : 'black-charging_knight.svg';
        this.symbol = "CN"
        this.pieceName = "Charging Knight"
    }

    maybePossibleMoves (currentSquare, pieces) { 
        let possibleMoves = [];
        const maybepossibleMoves = this.player === 1 ? [currentSquare-1, currentSquare+1, currentSquare-9, currentSquare-10, 
                                    currentSquare-11, currentSquare+12, currentSquare+21, currentSquare+19, currentSquare+8] :
                                    [currentSquare - 1, currentSquare + 1, currentSquare + 9, currentSquare + 10, 
                                    currentSquare + 11, currentSquare-8, currentSquare-19, currentSquare-21, currentSquare-12];
        for (let i=0; i<maybepossibleMoves.length; i++) {
            if (((this.player === 1 && pieces[maybepossibleMoves[i]].number <= 0) || (this.player === 2 && pieces[maybepossibleMoves[i]].number >= 0)) && pieces[maybepossibleMoves[i]].number !== null){
                possibleMoves.push(maybepossibleMoves[i])
            }
        }
        return possibleMoves;
    }
}