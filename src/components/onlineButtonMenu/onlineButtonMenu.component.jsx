import React from 'react';
import {OptionButton} from '../optionButton/optionButton.component'
import {socket} from './../socket';
import {useDispatch, useSelector} from 'react-redux';
import {setGameResult, acceptDrawOffer} from '../../redux/actions'
import { selectOnlinePlayerNumber, selectDrawOfferActive } from '../../redux/selectors';

const OnlineButtonMenu = () => {
    const dispatch = useDispatch();

    const handleSetGameResult = (result) => dispatch(setGameResult(result))
    const handleAcceptDrawOffer = () => dispatch(acceptDrawOffer())

    const onlinePlayerNumber = useSelector(selectOnlinePlayerNumber)
    const drawOfferActive = useSelector(selectDrawOfferActive)

    const resign = () => {
        let gameResult = onlinePlayerNumber === 1 ? '0-1' : '1-0'
        socket.emit('resign', gameResult)
        handleSetGameResult(gameResult)
    }

    const offerDraw = () => {
        if (drawOfferActive){
            socket.emit('drawOfferAccepted')
            handleAcceptDrawOffer()
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

export default OnlineButtonMenu