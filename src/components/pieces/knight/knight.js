export default class Knight {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 2 : -2;
        this.set = 1;
        this.icon = this.player === 1 ? 'white-knight.svg' : 'black-knight.svg';
        this.symbol = "N";
        this.pieceName = "Knight"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = [currentSquare-19, currentSquare-21, currentSquare-8, currentSquare-12, 
                                    currentSquare+12, currentSquare+8, currentSquare+21, currentSquare+19]
        for (let square of maybepossibleMoves) {
            if (((this.player === 1 && pieces[square].number <= 0) || (this.player === 2 && pieces[square].number >= 0)) && pieces[square].number !== null){
                possibleMoves.push(square)
            }
        }
        return possibleMoves;
    }
}