import React from 'react';
import './chooseButton.styles.css';

const ChooseButton = ({classes, onClick, textOnButton}) => {

    return (
        <button className={'glow-on-hover ' + classes} onClick = {onClick}>{textOnButton}</button>
    )

}

export default ChooseButton;