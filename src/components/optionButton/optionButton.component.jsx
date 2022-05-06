import React from 'react';
import './optionButton.styles.css'

export const OptionButton = ({onClick, buttonText}) => {
    return (
        <div className = 'option'>
            <button className="option-button" onClick = {onClick}>{buttonText}</button> 
        </div>
    )
}