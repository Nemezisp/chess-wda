export default class Waffle {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 2 : -2;
        this.set = 2;
        this.icon = this.player === 1 ? 'white-waffle.svg' : 'black-waffle.svg';
        this.symbol = "WA";
        this.pieceName = "Waffle"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = [currentSquare-1, currentSquare-10, currentSquare+1, currentSquare+10, 
                                    currentSquare+18, currentSquare-18, currentSquare+22, currentSquare-22]
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