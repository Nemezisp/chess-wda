export default class Woody {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 2 : -2;
        this.set = 4;
        this.icon = this.player === 1 ? 'white-woody.svg' : 'black-woody.svg';
        this.symbol = "WD";
        this.pieceName = "Woody"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = [currentSquare-1, currentSquare-2, currentSquare-10, currentSquare-20, 
                                    currentSquare+1, currentSquare+2, currentSquare+10, currentSquare+20]
        for (let square of maybepossibleMoves) {
            if (((this.player === 1 && pieces[square].number <= 0) || (this.player === 2 && pieces[square].number >= 0)) && pieces[square].number !== null){
                possibleMoves.push(square)
            }
        }
        return possibleMoves;
    }
}