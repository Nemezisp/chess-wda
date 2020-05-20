import React from 'react';

import {Board} from './../board/board.component';
import PiecePromotionPopup from './../piecePromotionPopup/piecePromotionPopup.component';
import Popup from "reactjs-popup";
import {socket} from './../socket';

import Empty from './../pieces/empty/empty';

import './onlineGame.styles.css'

import {connect} from 'react-redux';
import { setPossibleMoves, makeMove, resetMove, enPassant, changePlayer, updatePreviousMove,
         castling, startPromotion, piecePromotion, addMoveToPreviousMoves, setGameResult,
         activateDrawOffer } from '../../redux/actions';
import availablePieces from './../pieces/availablePieces';


let castlingPossible;
let chosenPieceSquare;
let syncPiecePromotionActive = false;

class OnlineGame extends React.Component {

    componentDidMount() {
        const {changePlayer, makeMove, castling, enPassant, piecePromotion, addMoveToPreviousMoves, 
               onlinePlayerNumber, updatePreviousMove, setGameResult, activateDrawOffer} = this.props

        socket.on('changePlayer', () => {
            changePlayer()
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
            changePlayer()
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

    componentWillUnmount() {
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

    componentDidUpdate(prevProps) {
        const {updatePreviousMove, player} = this.props

        if (player !== prevProps.player) {
            if(!this.checkMate()){
                if (this.isKingInCheck(0, 0)) {
                    updatePreviousMove('+');
                } else {
                    if(!this.checkStalemate()){
                        if (this.checkDrawingConditions()) {
                            socket.emit('gameEnded')
                        }
                    }
                }
            }
        }
    }

    handleClick = (piece, chosenSquare) => {
        const {player, pieces, possibleMoves, previousMoves, piecePromotionActive, addMoveToPreviousMoves, gameResult,
            setPossibleMoves, resetMove, makeMove, startPromotion, changePlayer, movingLocked, onlinePlayerNumber} = this.props; 
        let tempPossibleMoves = [];
        let currentPiece = pieces[chosenSquare];  //take a piece from pieces array 
        console.log(gameResult)
        if (!chosenPieceSquare && !piecePromotionActive && !gameResult && !movingLocked && onlinePlayerNumber === player){ //if a piece is not chosen 
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
                    syncPiecePromotionActive = true
                } else if (castlingPossible && castlingPossible.length !== 0) { //check for castling
                    this.handleCastling(chosenPieceSquare, chosenSquare);
                } else if (!this.handleEnPassant(chosenPieceSquare, chosenSquare)) { //check for enpassant, if not just move a piece
                    makeMove(chosenPieceSquare, chosenSquare);
                    socket.emit('move', chosenPieceSquare, chosenSquare)
                }        

                addMoveToPreviousMoves(tempChosenPiece.symbol, null, chosenPieceSquare, chosenSquare)
                socket.emit('addPreviousMove', tempChosenPiece.symbol, chosenPieceSquare, chosenSquare)

                changePlayer()
                if (!syncPiecePromotionActive) {
                    socket.emit('changePlayer')
                }
                syncPiecePromotionActive = false
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
            socket.emit('castling', rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        }
        else if ((player === 1 && kingEndSquare === 26) || (player === 2 && kingEndSquare === 96)) {//long castle rook move
            let rookStartSquare = kingEndSquare+2;
            let rookEndSquare = kingEndSquare-1;
            castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
            socket.emit('castling', rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        }
        //long castle colorbound piece move
        else if ((player === 1 && kingEndSquare === 27) || (player === 2 && kingEndSquare === 97)){
            let rookStartSquare = kingEndSquare+1;
            let rookEndSquare = kingEndSquare-1;
            castling(rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
            socket.emit('castling', rookStartSquare, rookEndSquare, kingStartSquare, kingEndSquare)
        } else {
            makeMove(kingStartSquare, kingEndSquare)
            socket.emit('move', kingStartSquare, kingEndSquare)
        }
    }

    handleEnPassant = (startSquare, endSquare) => {
        const {player, pieces, previousMoves, enPassant} = this.props; 
        if (previousMoves.length > 1 && (pieces[startSquare].number === 1 || pieces[startSquare].number === -1)){
            if (pieces[startSquare].checkEnPassant(previousMoves, pieces, startSquare, endSquare)){
                let pawnToRemoveSquare = player === 1 ? endSquare-10 : endSquare+10;
                enPassant(startSquare, endSquare, pawnToRemoveSquare)
                socket.emit ('enpassant', startSquare, endSquare, pawnToRemoveSquare)
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
            socket.emit('gameEnded')
            return true;
        }
        return false;
    }

    checkStalemate = () =>{
        const {setGameResult} = this.props
        if (!this.isMovePossible()){
            setGameResult('1/2 : 1/2')
            socket.emit('gameEnded')
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
            if (((this.isEven(a1) && this.isEven(b1))||(!this.isEven(a1) && !this.isEven(b1))) === ((this.isEven(a2) && this.isEven(b2))||(!this.isEven(a2) && !this.isEven(b2)))){
                setGameResult('1/2 : 1/2')
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }

    isEven = (num) => num % 2 === 0; 

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
        const {pieces, possibleMoves, previousMoves, piecePromotionActive, uniquePieceList, piecePromotion, onlinePlayerNumber} = this.props;    
        const lastMove = previousMoves[previousMoves.length-1]

        return (
            <div>
                <Board pieces = {pieces} 
                       possibleMoves = {possibleMoves}
                       squareClick = {this.handleClick}
                       squareSize = 'max(6.25vw, 40px)'
                       reversed = {onlinePlayerNumber === 1 ? false : true}/>
    
                <Popup open = {piecePromotionActive} closeOnDocumentClick = {false} closeOnEscape = {false}
                       contentStyle={{ width: "unset" }}>
                    <PiecePromotionPopup pieceList = {uniquePieceList}
                                         promotion = {piecePromotion}
                                         start = {lastMove ? lastMove[2] : null}  
                                         target = {lastMove ? lastMove[3] : null}
                                         player = {onlinePlayerNumber}
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
    onlinePlayerNumber: state.onlinePlayerNumber,
    previousPositions: state.previousPositions,
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
    setGameResult: (result) => dispatch(setGameResult(result)),
    activateDrawOffer: () =>  dispatch(activateDrawOffer())
})

export default connect(mapStateToProps, mapDispatchToProps)(OnlineGame);