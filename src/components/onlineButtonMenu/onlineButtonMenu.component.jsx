import React from 'react';
import {OptionButton} from '../optionButton/optionButton.component'
import {socket} from './../socket';
import {connect} from 'react-redux';
import {setGameResult, acceptDrawOffer} from '../../redux/actions'

const OnlineButtonMenu = ({onlinePlayerNumber, setGameResult, drawOfferActive, acceptDrawOffer}) => {

    const resign = () => {
        let gameResult = onlinePlayerNumber === 1 ? '0-1' : '1-0'
        socket.emit('resign', gameResult)
        setGameResult(gameResult)
    }

    const offerDraw = () => {
        if (drawOfferActive){
            socket.emit('drawOfferAccepted')
            acceptDrawOffer()
        } else {
            socket.emit('drawOffer')
        }
    }

    return (
        <div className = 'online-result-buttons'>
            <OptionButton buttonText = 'Offer a draw' onClick = {offerDraw}/>
            <OptionButton buttonText = 'Resign' onClick = {resign}/>
        </div>
    )
}

const mapStateToProps = state => ({
    onlinePlayerNumber: state.onlinePlayerNumber,
    drawOfferActive: state.drawOfferActive
})

const mapDispatchToProps = dispatch => ({
    setGameResult: (result) => dispatch(setGameResult(result)),
    acceptDrawOffer: () => dispatch(acceptDrawOffer())
})

export default connect(mapStateToProps, mapDispatchToProps)(OnlineButtonMenu)