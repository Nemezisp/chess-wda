import React from 'react';
import './square.styles.css';

export const Square = ({color, piece, canBeMovedTo, index, click, size, reversed}) => {
    let className = canBeMovedTo ? color + " can-be-moved-to" : color;

    let reversedClass = reversed ? 'reversed' : '';

    let toRender = piece.number ? 
                   <img className = {reversedClass} alt = {piece.icon} src = {require('./../pieces/piece-icons/' + piece.icon)}/> : <div className = 'empty-square'>&nbsp;</div>;

    let onClick = click ? () => click(piece, index) : null

    return (
        <div onClick = {onClick} className = {className} style = {{height: size, width: size}}>  
            {toRender}  
        </div>
    )
}