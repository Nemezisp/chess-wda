import React from 'react';
import ChooseButton from './../chooseButton/chooseButton.component';
import './pieceChooseMenu.styles.css';

const PieceChooseMenu = ({player, choose, onMixed, highlightedButtonIndex}) => {
    return (
        <div className = 'chooser'>
            <ChooseButton classes = {highlightedButtonIndex === 0 ? "highlighted" : ""} onClick = {() => choose(1, player, 0)} textOnButton = 'FIDE army (classic chess)'/>
            <ChooseButton classes = {highlightedButtonIndex === 1 ? "highlighted" : ""} onClick = {() => choose(2, player, 1)} textOnButton = 'Colorbound Clobberers'/>
            <ChooseButton classes = {highlightedButtonIndex === 2 ? "highlighted" : ""} onClick = {() => choose(3, player, 2)} textOnButton = 'Nutty Knights'/>
            <ChooseButton classes = {highlightedButtonIndex === 3 ? "highlighted" : ""} onClick = {() => choose(4, player, 3)} textOnButton = 'Remarkable Rookies'/>
            <ChooseButton classes = {highlightedButtonIndex === 4 ? "mixed highlighted" : "mixed"} onClick = {onMixed} textOnButton = 'Compose your own'/>
        </div>
    )
}

export default PieceChooseMenu;