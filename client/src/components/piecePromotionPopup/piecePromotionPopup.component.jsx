import React  from 'react';
import './piecePromotionPopup.styles.css';
import { Square } from './../square/square.component';
import {connect} from 'react-redux'
import {socket} from './../socket';

import {updatePreviousMove} from '../../redux/actions';


const PiecePromotionPopup = ({start, target, pieceList, promotion, player, updatePreviousMove, gameMode}) => {

    const onClick = (piece) => {
        updatePreviousMove(piece.symbol);
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
                        <div className = 'single-piece' key = {i}>
                            <p className = 'piece-name'>{piece.pieceName}</p>
                            <Square click = {onClick} index = {i} key = {i} piece = {piece} size = "max(10vw, 60px)"/>
                        </div>)
                })}
            </div>
        </div>
    ) 
}

const mapDispatchToProps = dispatch => ({
    updatePreviousMove: (specialCase) => dispatch(updatePreviousMove(specialCase))
})

const mapStateToProps = state => ({
    gameMode: state.gameMode
})

export default connect(mapStateToProps, mapDispatchToProps)(PiecePromotionPopup)