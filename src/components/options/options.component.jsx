import React from 'react'
import './options.styles.css'
import {OptionButton} from '../optionButton/optionButton.component'

export const Options = ({help, reset, notation, gameMode}) => {
    return (
        <div className='menu'>
            <OptionButton onClick = {help} buttonText = 'Help'/>
            <OptionButton onClick = {reset} buttonText = {gameMode === 'local' ? 'Setup menu' : 'Leave game'}/>
            <OptionButton onClick = {notation} buttonText = 'Notation'/>
        </div>
    )
}