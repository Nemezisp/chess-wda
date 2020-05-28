import React from 'react';
import './startPage.styles.css';
import {connect} from 'react-redux';
import ChooseButton from './../chooseButton/chooseButton.component';
import {setLocalGame, setOnlineGame} from '../../redux/actions';

const StartPage = ({setLocalGame, setOnlineGame}) => {
    return (
        <div className = 'start-page'>
            <span className = 'local-play-button'><ChooseButton onClick = {() => setLocalGame()} textOnButton = 'Local play'/></span>
            <span className = 'online-play-button'><ChooseButton onClick = {() => setOnlineGame()} textOnButton = 'Online play'/></span>
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    setLocalGame: () => dispatch(setLocalGame()),
    setOnlineGame: () => dispatch(setOnlineGame())
})

export default connect (null, mapDispatchToProps)(StartPage)