import React from 'react';
import './optionButton.styles.css'

export const OptionButton = ({onClick, buttonText}) => {
    return (
        <div className = 'option'>
            <a href="/#" className="btn btn-white btn-animation-1" onClick = {onClick}>{buttonText}</a> 
        </div>
    )
}