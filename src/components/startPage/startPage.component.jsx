import React from 'react';
import './startPage.styles.css';
import {useDispatch} from 'react-redux';
import ChooseButton from './../chooseButton/chooseButton.component';
import {setLocalGame, setOnlineGame} from '../../redux/actions';

const StartPage = () => {
    const dispatch = useDispatch()

    const handleSetLocalGame = () => dispatch(setLocalGame())
    const handleSetOnlineGame = () => dispatch(setOnlineGame())

    return (
        <div className = 'start-page'>
            <span className = 'local-play-button'><ChooseButton onClick = {() => handleSetLocalGame()} textOnButton = 'Local play'/></span>
            <span className = 'online-play-button'><ChooseButton onClick = {() => handleSetOnlineGame()} textOnButton = 'Online play'/></span>
        </div>
    )
}


export default StartPage