import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {OptionButton} from '../optionButton/optionButton.component';
import './notation.styles.css';
import { setPosition, lockMoving, unlockMoving } from '../../redux/actions';

const Notation = ({previousMoves, previousPositions, gameResult, close, setPosition, lockMoving, unlockMoving, pieces, movingLocked}) => {

    const [startingIndex, setStartingIndex] = useState(0)
    useEffect(() => setStartingIndex(previousMoves.length > 20 ? Math.ceil((previousMoves.length)/2 - 10)*2 : 0), [previousMoves])

    const numberToSquare = (number) => {
        let columnTranslator = [null, 'h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'];
        let column = columnTranslator[parseInt(number.toString()[1])];
        let row = parseInt(number.toString()[0]) - 1;
        return (column.toString() + row.toString())
    }

    const addCaptureToMoveNotation = (isPawn, move, startingSquare, specialCase) => {
        let indexToInsertCapture = specialCase ? move.length-3 : move.length-2
        return(isPawn ? numberToSquare(startingSquare)[0] + move
                      : move.slice(0, indexToInsertCapture) + 'x' + move.slice(indexToInsertCapture, move.length))
    }

    const checkForCapture = (move, pieceSymbol, startingSquare, finalSquare, moveNumber, specialCase) => {
        if (previousPositions.length > 3 && moveNumber > 1) {
            let pieceOnSquareBeforeMove = previousPositions[moveNumber][finalSquare].number
            if (pieceOnSquareBeforeMove || (pieceSymbol === "" && startingSquare.toString()[1] !== finalSquare.toString()[1])){ //second condition for enpassant
                if (pieceSymbol === ""){
                    return(addCaptureToMoveNotation(true, move, startingSquare, specialCase))
                } else {
                   return(addCaptureToMoveNotation(false, move, startingSquare, specialCase))
                }
            }
        }
        return move
    }

    const moveNotation = (move, moveNumber) => {
        const [pieceSymbol, specialCase, startingSquare, finalSquare] = [move[0], move[1], move[2], move[3]]
        let specialCaseToWrite = specialCase ? specialCase : ''

        //castling or king move from starting square
        if (pieceSymbol === 'K' && (startingSquare === 94 || startingSquare === 24)) {
            if (finalSquare === 22 || finalSquare === 92) {
                return('O-O' + specialCaseToWrite)
            }
            else if (finalSquare === 26 || finalSquare === 96 || finalSquare === 27 || finalSquare === 97) {
                return('O-O-O' + specialCaseToWrite)
            } else {
                return(checkForCapture((pieceSymbol+numberToSquare(finalSquare) + specialCaseToWrite), pieceSymbol, startingSquare, finalSquare, moveNumber, specialCase))
            }
        } 

        //piece promotion
        else if (pieceSymbol === "" && (finalSquare.toString()[0] === '9' || finalSquare.toString()[0] === '2')) {
            if (specialCase){
                return(checkForCapture((numberToSquare(finalSquare) + specialCaseToWrite), pieceSymbol, startingSquare, finalSquare, moveNumber, specialCase))
            } else {
                return
            }
        } 

        //normal move
        else {
            return (checkForCapture(pieceSymbol+numberToSquare(finalSquare) + specialCaseToWrite, pieceSymbol, startingSquare, finalSquare, moveNumber, specialCase))
        }
    }

    const onMoveClick = (index) => {
        setPosition([...previousPositions[index+1]])
        index+1 === previousPositions.length-1 ? unlockMoving() : lockMoving()
    }

    const handleKeyDown = (event) => {
        let currentPositionIndex = previousPositions.findIndex(piecesAtIndex => arraysEqual(piecesAtIndex, pieces))

        if (event.key === 'ArrowLeft') {
            if (currentPositionIndex > 0) {
                setPosition([...previousPositions[currentPositionIndex-1]])
                if (!movingLocked){
                    lockMoving()
                }
            } 
            if (Math.ceil(currentPositionIndex/2) === startingIndex && currentPositionIndex !== 0) {
                setStartingIndex(startingIndex-2)
            }
        }
        
        if (event.key === 'ArrowRight') {
            if (currentPositionIndex < previousPositions.length-2) {
                setPosition([...previousPositions[currentPositionIndex+1]])
                if (!movingLocked){
                    lockMoving()
                }
            } else if (currentPositionIndex === previousPositions.length-2) {
                setPosition([...previousPositions[currentPositionIndex+1]])
                unlockMoving()
            }
            if (Math.ceil(currentPositionIndex/2) === startingIndex+10){
                setStartingIndex(startingIndex+2)
            }
        }
    }

    const returnToGame = () => {
        setStartingIndex(previousMoves.length > 20 ? Math.ceil((previousMoves.length)/2 - 10)*2 : 0)
        setPosition(previousPositions[previousPositions.length-1])
        unlockMoving()
    }

    let currentMovesToDisplay = new Array(20).fill(0)
    currentMovesToDisplay.unshift(...previousMoves.slice(startingIndex, startingIndex + 20))

    console.log(currentMovesToDisplay)

    return (
        <div className = 'notation-container' onKeyDown = {handleKeyDown} tabIndex = '0'>
            <table className = 'moves'>
                <tbody>

                    {currentMovesToDisplay.slice(0, 20).map((move, moveNumber) => {
                        let moveIndex = moveNumber+startingIndex
                        let currentPositionIndex = previousPositions.findIndex(piecesAtIndex => arraysEqual(piecesAtIndex, pieces))
                        return(isEven(moveIndex) ? <tr key = {moveIndex}>
                                                        <td className = 'move-number'>{Math.ceil(moveNumber/2)+1+startingIndex/2 + '.'}</td>
                                                        {move ? <td className = 'move-notation'>
                                                                    <div className = {'move-text ' + (moveIndex === currentPositionIndex-1 ? 'current-move' : null)} 
                                                                         onClick = {onMoveClick.bind(this, moveIndex)}>
                                                                        {moveNotation(move, moveIndex)}
                                                                    </div>
                                                                </td> 
                                                              : <td className = 'move-notation'></td>}
                                                        {move ? (previousMoves[moveIndex+1] ? <td className = 'move-notation' onClick = {onMoveClick.bind(this, moveIndex+1)}>
                                                                                                <div className = {'move-text ' + (moveIndex+1 === currentPositionIndex-1 ? 'current-move' : null)} 
                                                                                                     onClick = {onMoveClick.bind(this, moveIndex)}>
                                                                                                    {moveNotation(previousMoves[moveIndex+1], moveIndex+1)}
                                                                                                </div>
                                                                                            </td> 
                                                                                            : <td className = 'move-notation'></td>)
                                                              : <td className = 'move-notation'></td>}
                                                    </tr>
                                    : null)
                    })}

                </tbody>
            </table>
            <p className = 'game-result'>{gameResult}</p>
            {arraysEqual(pieces, previousPositions[previousPositions.length-1]) ? null : <OptionButton onClick = {returnToGame} buttonText = 'Return to game'/>}
            <OptionButton onClick = {close} buttonText = 'Options'/>
        </div>
    )   
}

const isEven = (num) => num % 2 === 0;

const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a === null || b === null) return false;
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }

    return true;
}

const mapStateToProps = state => ({
    previousMoves: state.previousMoves,
    previousPositions: state.previousPositions,
    gameResult: state.gameResult,
    pieces: state.pieces,
    movingLocked: state.movingLocked
})


const mapDispatchToProps = dispatch => ({
    setPosition: pieces => dispatch(setPosition(pieces)),
    lockMoving: () => dispatch(lockMoving()),
    unlockMoving: () => dispatch(unlockMoving())
})


export default connect(mapStateToProps, mapDispatchToProps)(Notation);