export default class Fibnif {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 2 : -2;
        this.set = 3;
        this.icon = this.player === 1 ? 'white-fibnif.svg' : 'black-fibnif.svg';
        this.symbol = "FN";
        this.pieceName = "Fibnif"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = [currentSquare+21, currentSquare+19, currentSquare-19, currentSquare-21, 
                                    currentSquare-11, currentSquare+9, currentSquare-9, currentSquare+11]
        for (let i=0; i<maybepossibleMoves.length; i++) {
            if (((this.player === 1 && pieces[maybepossibleMoves[i]].number <= 0) || (this.player === 2 && pieces[maybepossibleMoves[i]].number >= 0)) && pieces[maybepossibleMoves[i]].number !== null){
                possibleMoves.push(maybepossibleMoves[i])
            }
        }
        return possibleMoves;
    }
}