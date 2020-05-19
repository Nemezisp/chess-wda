export default class Fad {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 3 : -3;
        this.set = 2;
        this.icon = this.player === 1 ? 'white-fad.svg' : 'black-fad.svg';
        this.symbol = "FD";
        this.pieceName = "Fad"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = [currentSquare-9, currentSquare+9, currentSquare+11, currentSquare-11, 
                                    currentSquare+20, currentSquare-20, currentSquare+2, currentSquare-2,
                                    currentSquare-18, currentSquare+18, currentSquare+22, currentSquare-22]
        for (let square of maybepossibleMoves) {
            if(pieces[square]) {
                if (((this.player === 1 && pieces[square].number <= 0) || (this.player === 2 && pieces[square].number >= 0)) && pieces[square].number !== null){
                    possibleMoves.push(square)
                }
            }
        }
        return possibleMoves;
    }
}