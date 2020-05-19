export default class HalfDuck {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 3 : -3;
        this.set = 4;
        this.icon = this.player === 1 ? 'white-half_duck.svg' : 'black-half_duck.svg';
        this.symbol = "HD";
        this.pieceName = "Half Duck"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = [currentSquare-9, currentSquare+9, currentSquare+11, currentSquare-11, 
                                    currentSquare+3, currentSquare-3, currentSquare+2, currentSquare-2,
                                    currentSquare+20, currentSquare-20, currentSquare+30, currentSquare-30]
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