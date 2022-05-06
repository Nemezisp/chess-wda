import React from 'react';

import {Board} from './../board/board.component';
import PiecePromotionPopup from './../piecePromotionPopup/piecePromotionPopup.component';
import Popup from "reactjs-popup";

import Empty from './../pieces/empty/empty';

import './game.styles.css'

import {connect} from 'react-redux';
import { setPossibleMoves, makeMove, resetMove, enPassant, changePlayer, updatePreviousMove,
         castling, startPromotion, piecePromotion, addMoveToPreviousMoves, setGameResult } from '../../redux/actions';

let castlingPossible;
let chosenPieceSquare;

class Game extends React.Component {
    componentDidUpdate(prevProps) {
        const {updatePreviousMove} = this.props
        if (this.props.piecePromotionActive !== prevProps.piecePromotionActive){
            this.props.changePlayer()
        }
        if (this.props.player !== prevProps.player) {
            if(!this.checkMate()){
                if (this.isKingInCheck(0, 0)) {
                    updatePreviousMove('+');
                } else {
                    this.checkStalemate()
                }
            }
        }
    }

    handleClick = (piece, chosenSquare) => {
        const {player, pieces, possibleMoves, previousMoves, piecePromotionActive, addMoveToPreviousMoves, gameResult,
            setPossibleMoves, resetMove, makeMove, startPromotion, changePlayer, movingLocked} = this.props; 
        let tempPossibleMoves = [];
        let currentPiece = pieces[chosenSquare];  //take a piece from pieces array 
        if (!chosenPieceSquare && !piecePromotionActive && !gameResult && !movingLocked){ //if a piece is not chosen 
            if((piece.number > 0 && player === 1) || (piece.number < 0 && player === 2)) { //piece has to be in the right color
                let maybePossibleMoves = currentPiece.maybePossibleMoves(chosenSquare, pieces, previousMoves) //all theoretically possible moves
                tempPossibleMoves = this.checkPossibleMoves(maybePossibleMoves, chosenSquare) //check is king in check after every move
                chosenPieceSquare = chosenSquare
            }

            if(((piece.number === 6 && player === 1) || (piece.number === -6 && player === 2)) && !this.isKingInCheck(0, 0)) { //check if castling may be possible
                let possibleKingMoves = this.checkPossibleMoves(piece.maybePossibleMoves(chosenSquare, pieces), chosenSquare);
                castlingPossible = piece.castlingPossible(pieces, possibleKingMoves);
                for (let move of castlingPossible){
                    if (!((move === 27 && this.isKingInCheck(26, 24)) || (move === 97 && this.isKingInCheck(96, 44)))){ //needed for colorbound castling
                        tempPossibleMoves.push(move)
                    }
                }
            }

            if (tempPossibleMoves.length) {
                setPossibleMoves(tempPossibleMoves)
            }

        } else if (chosenPieceSquare){ //if a piece was chosen by last click
            let tempChosenPiece = pieces[chosenPieceSquare];
            if (possibleMoves.includes(chosenSquare)){ //if piece can move to the square
                if ((pieces[chosenPieceSquare].number === 1 && chosenSquare.toString()[0] === '9') || 
                    (pieces[chosenPieceSquare].number === -1 && chosenSquare.toString()[0] === '2')) { //check for pawn promotion
                    startPromotion()
                } else if (castlingPossible && castlingPossible.length !== 0) { //check for castling
                    this.handleCastling(chosenPieceSquare, chosenSquare);
                } else if (!this.handleEnPassant(chosenPieceSquare, chosenSquare)) { //check for enpassant, if not just move a piece
                    makeMove(chosenPieceSquare, chosenSquare);
                }        

                addMoveToPreviousMoves(tempChosenPiece.symbol, null, chosenPieceSquare, chosenSquare)

                changePlayer()

            }
            resetMove()
            chosenPieceSquare = null;
            castlingPossible = false;
        }
    }

    checkPossibleMoves = (maybePossibleMoves, pieceSquare) => {
        let possibleMoves = [];
        for (let move of maybePossibleMoves) {
            if (!this.isKingInCheck(move, pieceSquare)){
                possibleMoves.push(move);
            }
        }
        return possibleMoves;
    }

    isKingInCheck = (endSquare, startSquare, player = this.props.player) => {
        const {pieces, previousMoves} = this.props; 
        let tempPieces = [...pieces];
        if (endSquare && startSquare) { //if we want to check if king would be in check after some move
            [tempPieces[startSquare], tempPieces[endSquare]] = [new Empty(), tempPieces[startSquare]];
        } 
        let kingSquare = player === 1 ? tempPieces.findIndex(piece => piece.number === 6) : tempPieces.findIndex(piece => piece.number === -6); //find a square where king of current player is standing
        for (let square = 0; square < tempPieces.length; square++){
            if(tempPieces[square].number) {
                let attackedSquares = tempPieces[square].maybePossibleMoves(square, tempPieces, previousMoves); 
                if (attackedSquares.includes(parseInt(kingSquare))){ //check if kingSquare is attacked after move
                    return true;
                } 
            }
        }    
        return false;
    }

    handleCastling = (kingStartSquare, kingEndSquare) => {
        const {player, castling, makeMove} = this.props; 
        if ((player === 1 && kingEndSquare === 22) || (player === 2 && kingEndSquare === 92)) { //short castle rook move
            let rookStartSquare = kingEndSquare-1;
            let rookEndSquare = kingEndSquare+1;
            castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        }
        else if ((player === 1 && kingEndSquare === 26) || (player === 2 && kingEndSquare === 96)) {//long castle rook move
            let rookStartSquare = kingEndSquare+2;
            let rookEndSquare = kingEndSquare-1;
            castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        }
        //long castle colorbound piece move
        else if ((player === 1 && kingEndSquare === 27) || (player === 2 && kingEndSquare === 97)){
            let rookStartSquare = kingEndSquare+1;
            let rookEndSquare = kingEndSquare-1;
            castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        } else {
            makeMove(kingStartSquare, kingEndSquare)
        }
    }

    handleEnPassant = (startSquare, endSquare) => {
        const {player, pieces, previousMoves, enPassant} = this.props; 
        if (previousMoves.length > 1 && (pieces[startSquare].number === 1 || pieces[startSquare].number === -1)){
            if (pieces[startSquare].checkEnPassant(previousMoves, pieces, startSquare, endSquare)){
                let pawnToRemoveSquare = player === 1 ? endSquare-10 : endSquare+10;
                enPassant(startSquare, endSquare, pawnToRemoveSquare)
                return true;
            }
        }
        return false;
    }

    checkMate = () => {
        const {updatePreviousMove, setGameResult, player} = this.props
        if (this.isKingInCheck(0, 0) && !this.isMovePossible()){
            let gameResult = player === 1 ? '0-1' : '1-0';
            updatePreviousMove('#')
            setGameResult(gameResult)
            return true;
        }
        return false;
    }

    checkStalemate = () =>{
        const {setGameResult} = this.props
        if (!this.isMovePossible()){
            setGameResult('1/2 : 1/2')
            return true;
        }
        return false;
    }

    isMovePossible = () => {
        const {player, pieces, previousMoves} = this.props; 
        for (let square in pieces) {
            square = parseInt(square);
            if (player === 1 ? pieces[square].number > 0 : pieces[square].number < 0){
                if (this.checkPossibleMoves(pieces[square].maybePossibleMoves(square, pieces, previousMoves), square).length) {
                    return true;
                }
            }
        }
        return false;
    }

    render () {
        const {player, pieces, possibleMoves, previousMoves, piecePromotionActive, uniquePieceList, piecePromotion} = this.props;    
        const lastMove = previousMoves[previousMoves.length-1]

        return (
            <div>
                <Board pieces = {pieces} 
                       possibleMoves = {possibleMoves}
                       squareClick = {this.handleClick}
                       squareSize = 'max(5.7vw, 40px)'/>
    
                <Popup className='promotion-popup' open = {piecePromotionActive} closeOnDocumentClick = {false} closeOnEscape = {false}>
                    <PiecePromotionPopup pieceList = {uniquePieceList}
                                         promotion = {piecePromotion}
                                         start = {lastMove ? lastMove[2] : null}  
                                         target = {lastMove ? lastMove[3] : null}
                                         player = {player}
                                         isKingInCheck = {this.isKingInCheck}/> 
                 </Popup>
            </div>
        );       
    }
}

const mapStateToProps = state => ({
    player: state.player,
    pieces: state.pieces,
    possibleMoves: state.possibleMoves,
    previousMoves: state.previousMoves,
    piecePromotionActive: state.piecePromotionActive,
    chosenPieceSquare: state.chosenPieceSquare,
    uniquePieceList: state.uniquePieceList,
    gameEnded: state.gameEnded,
    movingLocked: state.movingLocked,
    gameResult: state.gameResult
})

const mapDispatchToProps = dispatch => ({
    setPossibleMoves: moves => dispatch(setPossibleMoves(moves)),
    resetMove: () => dispatch(resetMove()),
    makeMove: (startSquare, endSquare) => dispatch(makeMove(startSquare, endSquare)),
    enPassant: (startSquare, endSquare, pawnToRemoveSquare) => dispatch(enPassant(startSquare, endSquare, pawnToRemoveSquare)),
    castling: (rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare) => dispatch(castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)),
    startPromotion: () => dispatch(startPromotion()),
    piecePromotion: (startSquare, endSquare, pieceToPromoteTo) => dispatch(piecePromotion(startSquare, endSquare, pieceToPromoteTo)),
    addMoveToPreviousMoves: (piece, specialCase, startSquare, endSquare) => dispatch(addMoveToPreviousMoves(piece, specialCase, startSquare, endSquare)),
    changePlayer: () => dispatch(changePlayer()),
    updatePreviousMove: (specialCase) => dispatch(updatePreviousMove(specialCase)),
    setGameResult: (result) => dispatch(setGameResult(result))
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);