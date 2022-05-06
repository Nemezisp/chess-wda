import React from 'react';
import ChooseButton from './../chooseButton/chooseButton.component';
import './pieceChooseMenu.styles.css';

const PieceChooseMenu = ({classList, player, choose, onMixed}) => {
    return (
        <div className = 'chooser'>
            <ChooseButton classes = {classList[0]} onClick = {() => choose(1, player, 0)} textOnButton = 'FIDE army (classic chess)'/>
            <ChooseButton classes = {classList[1]} onClick = {() => choose(2, player, 1)} textOnButton = 'Colorbound Clobberers'/>
            <ChooseButton classes = {classList[2]} onClick = {() => choose(3, player, 2)} textOnButton = 'Nutty Knights'/>
            <ChooseButton classes = {classList[3]} onClick = {() => choose(4, player, 3)} textOnButton = 'Remarkable Rookies'/>
            <ChooseButton classes = {'mixed ' + classList[4]} onClick = {onMixed} textOnButton = 'Compose your own'/>
        </div>
    )
}

export default PieceChooseMenu;