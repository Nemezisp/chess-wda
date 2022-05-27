import React, {useState} from 'react';
import './mixedArmyPopup.styles.css';
import { Square } from './../square/square.component';
import availablePieces from '../pieces/availablePieces'

let chosenPieces = [null, null, null, null]

export const MixedArmyPopup = ({player, whenChosen}) => {
    if (!(chosenPieces.includes(null))){
        chosenPieces = [null, null, null, null]
    }

    const [currentPieceNumber, setCurrentPieceNumber] = useState(2)

    const multiplier = player === 1 ? 1 : -1;
    
    const addChosenPiece = (chosenPiece) => {
        let tempchosenPieces = [...chosenPieces];
        tempchosenPieces[multiplier*chosenPiece.number-2] = chosenPiece;
        if (!(tempchosenPieces.includes(null))){
            setCurrentPieceNumber(2)
            whenChosen(tempchosenPieces)
        }
        chosenPieces = tempchosenPieces
        setCurrentPieceNumber(currentPieceNumber+1)
    }

    return (
        <div className = 'mixed-army-popup'>
            <p className = 'main-text'>Compose your army:</p>
            <div className = 'choose-set'>
                {availablePieces.map((piece, i) => {
                    piece = new piece(player)
                    if (piece.set && piece.number === currentPieceNumber*multiplier) {
                        return (
                            <div className = 'single-piece scale-up' key = {i}>
                                <p className = 'piece-name'>{piece.pieceName}</p>
                                <Square click = {addChosenPiece} key = {i} piece = {piece} size = 'max(10vw, 60px)'/>
                            </div>)
                    } return null;
                })}
            </div>
        </div>
    ) 
}