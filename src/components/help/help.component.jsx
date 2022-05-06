import React, { useState } from 'react';
import {Board} from './../board/board.component'
import './help.styles.css'
import Empty from '../pieces/empty/empty';
import Forbidden from '../pieces/forbidden/forbidden';
import {OptionButton} from '../optionButton/optionButton.component';

export const Help = ({pieceList, close}) => {

    const player = 1;
    const [pieceNumber, setPieceNumber] = useState(0);

    const emptyBoard = () => {
        let pieces = [];
        for (let i = 0; i < 120; i++) {
            if ((i >= 21 && i <= 28) || (i >= 31 && i <= 38) || (i >= 41 && i <= 48) || (i >= 51 && i <= 58) || (i >= 61 && i <= 68) || (i >= 71 && i <= 78) || (i >= 81 && i <= 88) || (i >= 91 && i <= 98)){
                pieces.push(new Empty());
            } else {
                pieces.push(new Forbidden());
            }
        }
        return pieces;
    }

    let square;
    let piece = [...pieceList][pieceNumber];
    let tempPiece = new piece(player);
    let pieces = emptyBoard();
    if (tempPiece.set === 4 && (tempPiece.number === 4 || tempPiece.number === -4)) {
        square = player === 1 ? 46 : 73;
    } else {
        square = player === 1 ? 55 : 65;
    }

    piece = new piece(player);
    pieces[square] = piece;

    return (
        <div className='help-container'> 
            <div className = 'arrows'>
                {pieceNumber > 0 ? <img src = {require('./../../assets/arrow-icon.png')} className = 'arrow-reversed' alt = 'arrow' onClick = {() => setPieceNumber(pieceNumber-1)}/> : null}
                {pieceNumber < [...pieceList].length-1 ? <img src = {require('./../../assets/arrow-icon.png')} alt = 'arrow' className = 'arrow' onClick = {() => setPieceNumber(pieceNumber+1)}/> : null}
            </div>
            <span className = 'help-piece-name'>{piece.pieceName}</span>
            <Board pieces = {pieces} 
                   possibleMoves = {piece.maybePossibleMoves(square, pieces)}
                   squareSize = {'max(4vw, 30px)'}/>
            <div className='help-option-button-container'>
                <OptionButton onClick = {close} buttonText = 'Go back'/>
            </div>
        </div>
    )        
}