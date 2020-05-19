export default class King {
    constructor(player) {
        this.player = player;
        this.number = player === 1 ? 6 : -6;
        this.hasMoved = false;
        this.icon = this.player === 1 ? 'white-king.svg' : 'black-king.svg';
        this.symbol = "K";
        this.pieceName = "King"
    }

    maybePossibleMoves (currentSquare, pieces) {
        let possibleMoves = [];
        const maybepossibleMoves = [currentSquare-1, currentSquare+1, currentSquare-9, currentSquare-10, currentSquare-11, currentSquare+9, currentSquare+10, currentSquare+11]
        for (let i=0; i<maybepossibleMoves.length; i++) {
            if (((this.player === 1 && pieces[maybepossibleMoves[i]].number <= 0) || (this.player === 2 && pieces[maybepossibleMoves[i]].number >= 0)) && pieces[maybepossibleMoves[i]].number !== null){
                possibleMoves.push(maybepossibleMoves[i])
            }
        }
        return possibleMoves;
    }

    castlingPossible (pieces, possibleKingMoves) {
        let possibleMoves = [];
        if (this.player === 1 && !this.hasMoved){
            if (pieces[21].number === 4 && !pieces[21].hasMoved && !pieces[22].number && !pieces[23].number && possibleKingMoves.includes(23)) { //white short castle
                possibleMoves.push(22) 
            } 
            if (pieces[28].number === 4 && (pieces[21].set === 1 || pieces[21].set === 3) && !pieces[28].hasMoved && !pieces[25].number && !pieces[26].number && !pieces[27].number && possibleKingMoves.includes(25)) { //white long castle 
                possibleMoves.push(26)
            }
            if (pieces[28].number === 4 && pieces[21].set === 2 && !pieces[28].hasMoved && !pieces[25].number && !pieces[26].number && !pieces[27].number && possibleKingMoves.includes(25)) { //white long castle with colorbound piece
                possibleMoves.push(27)
            }
        }

        else if (this.player === 2 && !this.hasMoved){
            if (pieces[91].number === -4 && !pieces[91].hasMoved && !pieces[92].number && !pieces[93].number && possibleKingMoves.includes(93)) { //black short castle
                possibleMoves.push(92) 
            }
            if (pieces[98].number === -4 && (pieces[91].set === 1 || pieces[91].set === 3) && !pieces[98].hasMoved && !pieces[95].number && !pieces[96].number && !pieces[97].number && possibleKingMoves.includes(95)) { //black long castle
                possibleMoves.push(96)
            }
            if (pieces[98].number === -4 && pieces[91].set === 2 && !pieces[98].hasMoved && !pieces[95].number && !pieces[96].number && !pieces[97].number && possibleKingMoves.includes(95)) { //black long castle with colorbound piee
                possibleMoves.push(97)
            }
        }
        return possibleMoves;
    }
}