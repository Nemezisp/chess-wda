import React from 'react';

import {Board} from '../board/board.component';
import PiecePromotionPopup from '../piecePromotionPopup/piecePromotionPopup.component';
import Popup from "reactjs-popup";
import {socket} from '../socket';

import Empty from '../pieces/empty/empty';

import './game.styles.css'

import {connect} from 'react-redux';
import { setPossibleMoves, makeMove, resetMove, enPassant, changeActivePlayer, updatePreviousMove,
         castling, startPromotion, piecePromotion, addMoveToPreviousMoves, setGameResult,
         activateDrawOffer } from '../../redux/actions';
import availablePieces from '../pieces/availablePieces';

import { isEven } from '../../utils/helperFunctions';

let castlingPossible;
let chosenPieceSquare;
let syncPiecePromotionActive = false;

class Game extends React.Component {

    componentDidMount() {
        if (this.props.gameMode === "online") {
            const {changeActivePlayer, makeMove, castling, enPassant, piecePromotion, addMoveToPreviousMoves, 
                onlinePlayerNumber, updatePreviousMove, setGameResult, activateDrawOffer} = this.props
 
            socket.on('changePlayer', () => {
                changeActivePlayer()
            })
 
            socket.on('move', (startSquare, finalSquare) => {
                makeMove(startSquare, finalSquare)
            })
 
            socket.on('castling', (rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare) => {
                castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
            })
 
            socket.on('enpassant', (startSquare, endSquare, pawnToRemoveSquare) => {
                enPassant(startSquare, endSquare, pawnToRemoveSquare)
            })
 
            socket.on('promotion', (start, target, piece) => {
                let pieceToPromoteTo;
                let pieceName = piece.icon.split('-')[1].split('.')[0].replace(/_/g, "").toUpperCase()
                for (let availablePiece of availablePieces){
                    let tempPiece = new availablePiece(1)
                    if (tempPiece.pieceName.replace(/\s/g, "").toUpperCase() === pieceName){
                        pieceToPromoteTo = new availablePiece(onlinePlayerNumber === 1 ? 2 : 1)
                    }
                }
                updatePreviousMove(pieceToPromoteTo.symbol)
                piecePromotion(start, target, pieceToPromoteTo)
                changeActivePlayer()
            })
 
            socket.on('addPreviousMove', (pieceSymbol, startSquare, finalSquare) => {
                addMoveToPreviousMoves(pieceSymbol, null, startSquare, finalSquare)
            })
    
            socket.on('resign', (gameResult) => {
                setGameResult(gameResult)
            })
    
            socket.on('drawOffer', () =>{
                activateDrawOffer()
            })
            
            socket.on('drawOfferAccepted', () => {
                setGameResult('1/2 : 1/2')
            })
        }
    }

    componentWillUnmount() {
        if (this.props.gameMode === "online") {
            socket.off('changePlayer')
            socket.off('move')
            socket.off('castling')
            socket.off('enpassant')
            socket.off('promotion')
            socket.off('addPreviousMove')
            socket.off('resign')
            socket.off('drawOffer')
            socket.off('drawOfferAccepted')
        }
    }

    componentDidUpdate(prevProps) {
        const {updatePreviousMove, activePlayer, gameMode, piecePromotionActive} = this.props

        if (gameMode === "local" && piecePromotionActive !== prevProps.piecePromotionActive){
            this.props.changeActivePlayer()
        }

        if (activePlayer !== prevProps.activePlayer) {
            if(!this.checkMate()){
                if (this.isKingInCheck(0, 0)) {
                    updatePreviousMove('+');
                } else if (gameMode === "online") {
                    if(!this.checkStalemate()){
                        if (this.checkDrawingConditions()) {
                            socket.emit('gameEnded')
                        }
                    }
                } else if (gameMode === "local") {
                    this.checkStalemate()
                }
            }
        }
    }

    handleClick = (piece, chosenSquare) => {
        const {activePlayer, pieces, possibleMoves, previousMoves, piecePromotionActive, addMoveToPreviousMoves, gameResult,
            setPossibleMoves, resetMove, makeMove, startPromotion, changeActivePlayer, movingLocked, onlinePlayerNumber, gameMode} = this.props; 
        let tempPossibleMoves = [];
        let currentPiece = pieces[chosenSquare];  //take a piece from pieces array 
        if (!chosenPieceSquare && !piecePromotionActive && !gameResult && !movingLocked && (gameMode === "local" || onlinePlayerNumber === activePlayer)){ //if a piece is not chosen 
            if((piece.number > 0 && activePlayer === 1) || (piece.number < 0 && activePlayer === 2)) { //piece has to be in the right color
                let maybePossibleMoves = currentPiece.maybePossibleMoves(chosenSquare, pieces, previousMoves) //all theoretically possible moves
                tempPossibleMoves = this.checkPossibleMoves(maybePossibleMoves, chosenSquare) //check is king in check after every move
                chosenPieceSquare = chosenSquare
            }

            if(((piece.number === 6 && activePlayer === 1) || (piece.number === -6 && activePlayer === 2)) && !this.isKingInCheck(0, 0)) { //check if castling may be possible
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
                    syncPiecePromotionActive = true
                } else if (castlingPossible && castlingPossible.length !== 0) { //check for castling
                    this.handleCastling(chosenPieceSquare, chosenSquare);
                } else if (!this.handleEnPassant(chosenPieceSquare, chosenSquare)) { //check for enpassant, if not just move a piece
                    makeMove(chosenPieceSquare, chosenSquare);
                    gameMode === "online" && socket.emit('move', chosenPieceSquare, chosenSquare)
                }        

                addMoveToPreviousMoves(tempChosenPiece.symbol, null, chosenPieceSquare, chosenSquare)
                gameMode === "online" && socket.emit('addPreviousMove', tempChosenPiece.symbol, chosenPieceSquare, chosenSquare)

                changeActivePlayer()
                if (gameMode === "online" && !syncPiecePromotionActive) {
                    socket.emit('changePlayer')
                }
                syncPiecePromotionActive = false
            }
            resetMove()
            chosenPieceSquare = null;
            castlingPossible = false;
        }
    }

    handleCastling = (kingStartSquare, kingEndSquare) => {
        const {activePlayer, castling, makeMove, gameMode} = this.props; 
        if ((activePlayer === 1 && kingEndSquare === 22) || (activePlayer === 2 && kingEndSquare === 92)) { //short castle rook move
            let rookStartSquare = kingEndSquare-1;
            let rookEndSquare = kingEndSquare+1;
            castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
            gameMode === "online" && socket.emit('castling', rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        }
        else if ((activePlayer === 1 && kingEndSquare === 26) || (activePlayer === 2 && kingEndSquare === 96)) {//long castle rook move
            let rookStartSquare = kingEndSquare+2;
            let rookEndSquare = kingEndSquare-1;
            castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
            gameMode === "online" && socket.emit('castling', rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        }
        //long castle colorbound piece move
        else if ((activePlayer === 1 && kingEndSquare === 27) || (activePlayer === 2 && kingEndSquare === 97)){
            let rookStartSquare = kingEndSquare+1;
            let rookEndSquare = kingEndSquare-1;
            castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
            gameMode === "online" && socket.emit('castling', rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        } else {
            makeMove(kingStartSquare, kingEndSquare)
            gameMode === "online" && socket.emit('move', kingStartSquare, kingEndSquare)
        }
    }

    handleEnPassant = (startSquare, endSquare) => {
        const {activePlayer, pieces, previousMoves, enPassant, gameMode} = this.props; 
        if (previousMoves.length > 1 && (pieces[startSquare].number === 1 || pieces[startSquare].number === -1)){
            if (pieces[startSquare].checkEnPassant(previousMoves, pieces, startSquare, endSquare)){
                let pawnToRemoveSquare = activePlayer === 1 ? endSquare-10 : endSquare+10;
                enPassant(startSquare, endSquare, pawnToRemoveSquare)
                gameMode === "online" && socket.emit ('enpassant', startSquare, endSquare, pawnToRemoveSquare)
                return true;
            }
        }
        return false;
    }

    checkMate = () => {
        const {updatePreviousMove, setGameResult, activePlayer, gameMode} = this.props
        if (this.isKingInCheck(0, 0) && !this.isMovePossible()){
            let gameResult = activePlayer === 1 ? '0-1' : '1-0';
            updatePreviousMove('#')
            setGameResult(gameResult)
            gameMode === "online" && socket.emit('gameEnded')
            return true;
        }
        return false;
    }

    checkStalemate = () =>{
        const {setGameResult, gameMode} = this.props
        if (!this.isMovePossible()){
            setGameResult('1/2 : 1/2')
            gameMode === "online" && socket.emit('gameEnded')
            return true;
        }
        return false;
    }

    checkDrawingConditions = () => { 
        let activePieces = {};
        const {pieces, setGameResult} = this.props

        for (let pieceSquare in pieces) {
            let piece = pieces[pieceSquare]
            if (piece.number === 1 || piece.number === 4 || piece.number === 5 || piece.number === -1 || 
                piece.number === -4 || piece.number === -5 || activePieces.length > 4 ){
                return false
            } else if (piece.number) {
                activePieces[pieceSquare] = piece
            }
        }

        let activePiecesNumber = Object.keys(activePieces).length
        if (activePiecesNumber === 2){ //only kings
            setGameResult('1/2 : 1/2')
            return true
        } else if (activePiecesNumber === 3){ //kings and one bishop/knight/fad/waffle/bede
            for (let piece of Object.values(activePieces)) {
                if (((piece.number === 2 || piece.number === -2) && (piece.set === 1 || piece.set === 2)) ||
                    ((piece.number === 3 || piece.number === -3) && (piece.set === 1 || piece.set === 2)) ||
                    ((piece.number === 4 || piece.number === -4) && piece.set === 2)){
                    setGameResult('1/2 : 1/2')
                    return true
                }
            }
        } else if (activePiecesNumber === 4){ //kings and two bishops/fads of the same square color
            let fadsAndBishopsSquares = []
            for (let {pieceSquare, piece} of Object.entries(activePieces)){
                if ((piece.number === 3 || piece.number === -3) && (piece.set === 1 || piece.set === 2)){
                    fadsAndBishopsSquares.push(pieceSquare)
                } else if (!(piece.number === 6 || piece.number === -6)) {
                    return false
                }
            } 
            let a1 = fadsAndBishopsSquares[0].toString()[0]
            let b1 = fadsAndBishopsSquares[0].toString()[1]
            let a2 = fadsAndBishopsSquares[1].toString()[0]
            let b2 = fadsAndBishopsSquares[1].toString()[1]
            if (((isEven(a1) && isEven(b1))||(!isEven(a1) && !isEven(b1))) === ((isEven(a2) && isEven(b2))||(!isEven(a2) && !isEven(b2)))){
                setGameResult('1/2 : 1/2')
                return true
            } else {
                return false
            }
        } else {
            return false
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

    isMovePossible = () => {
        const {activePlayer, pieces, previousMoves} = this.props; 
        for (let square in pieces) {
            square = parseInt(square);
            if (activePlayer === 1 ? pieces[square].number > 0 : pieces[square].number < 0){
                if (this.checkPossibleMoves(pieces[square].maybePossibleMoves(square, pieces, previousMoves), square).length) {
                    return true;
                }
            }
        }
        return false;
    }

    isKingInCheck = (endSquare, startSquare, player = this.props.activePlayer) => {
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

    render () {
        const {pieces, possibleMoves, previousMoves, piecePromotionActive, uniquePieceList, piecePromotion, onlinePlayerNumber, gameMode, activePlayer} = this.props;    
        const lastMove = previousMoves[previousMoves.length-1]

        return (
            <div>
                <Board pieces = {pieces} 
                       possibleMoves = {possibleMoves}
                       squareClick = {this.handleClick}
                       squareSize = 'max(5.7vw, 40px)'
                       reversed = {onlinePlayerNumber === 2 ? true : false}/>
    
                <Popup className='promotion-popup' open = {piecePromotionActive} closeOnDocumentClick = {false} closeOnEscape = {false}>
                    <PiecePromotionPopup pieceList = {uniquePieceList}
                                         promotion = {piecePromotion}
                                         start = {lastMove ? lastMove[2] : null}  
                                         target = {lastMove ? lastMove[3] : null}
                                         player = {gameMode === "online" ? onlinePlayerNumber : activePlayer}
                                         isKingInCheck = {this.isKingInCheck}/> 
                 </Popup>
            </div>
        );       
    }
}

const mapStateToProps = state => ({
    activePlayer: state.activePlayer,
    pieces: state.pieces,
    possibleMoves: state.possibleMoves,
    previousMoves: state.previousMoves,
    piecePromotionActive: state.piecePromotionActive,
    chosenPieceSquare: state.chosenPieceSquare,
    uniquePieceList: state.uniquePieceList,
    gameEnded: state.gameEnded,
    movingLocked: state.movingLocked,
    onlinePlayerNumber: state.onlinePlayerNumber,
    previousPositions: state.previousPositions,
    gameResult: state.gameResult,
    gameMode: state.gameMode
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
    changeActivePlayer: () => dispatch(changeActivePlayer()),
    updatePreviousMove: (specialCase) => dispatch(updatePreviousMove(specialCase)),
    setGameResult: (result) => dispatch(setGameResult(result)),
    activateDrawOffer: () =>  dispatch(activateDrawOffer())
})

export default connect(mapStateToProps, mapDispatchToProps)(Game);