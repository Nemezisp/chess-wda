import React  from 'react';
import './piecePromotionPopup.styles.css';
import { Square } from './../square/square.component';
import {useSelector, useDispatch} from 'react-redux'
import {socket} from './../socket';

import {updatePreviousMove} from '../../redux/actions';
import { selectGameMode } from '../../redux/selectors';

const PiecePromotionPopup = ({start, target, pieceList, promotion, player}) => {
    const dispatch = useDispatch()
    
    const handleUpdatePreviousMove = (specialCase) => dispatch(updatePreviousMove(specialCase))

    const gameMode = useSelector(selectGameMode)

    const onClick = (piece) => {
        handleUpdatePreviousMove(piece.symbol);
        promotion(start, target, piece)
        if (gameMode === 'online') {
            socket.emit('promotion', start, target, piece)
        }
    }

    return (
        <div className = 'piece-promotion-popup'>
            <p className = 'main-text'>Choose a piece to promote to:</p>
            <div className = 'promotion-pieces-container'>
                {[...pieceList].map((piece, i) => {
                    piece = new piece(player)
                    return (
                        <div className = 'single-piece scale-up' key = {i}>
                            <p className = 'piece-name'>{piece.pieceName}</p>
                            <Square click = {onClick} index = {i} key = {i} piece = {piece} size = 'max(10vw, 55px)'/>
                        </div>)
                })}
            </div>
        </div>
    ) 
}

export default PiecePromotionPopup