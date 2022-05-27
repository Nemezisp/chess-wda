import React from 'react';
import { Square } from './../square/square.component'
import './board.styles.css'

import {isEven} from '../../utils/helperFunctions';

export const Board = ({squareClick, possibleMoves, squareSize, pieces, reversed}) => {

    const renderBoard = () => {
        let onClick = squareClick ? squareClick : null
        return (
            pieces.slice(0).reverse().map((piece, i) => {
                i = 119 - i; //as map is on reversed array
                if (piece.number !== null) {
                    let a = i.toString()[0]
                    let b = i.toString()[1]
                    
                    let canBeMovedTo = (possibleMoves.includes(i)) ? true : false;
                    let color = ((isEven(a) && isEven(b))||(!isEven(a) && !isEven(b))) ? 'dark-square' : 'light-square';
                                        
                    return (<Square click = {onClick} 
                                    color = {color} 
                                    index = {i} 
                                    key = {i} 
                                    piece = {piece}
                                    canBeMovedTo = {canBeMovedTo}
                                    size = {squareSize}
                                    reversed = {reversed}/>)
                }
                return null;
            })
        )
    }

    let reversedClass = reversed ? 'reversed' : ''

    return (
        <div className = {'board ' + reversedClass}>
            {renderBoard()}
        </div>
    )  
}