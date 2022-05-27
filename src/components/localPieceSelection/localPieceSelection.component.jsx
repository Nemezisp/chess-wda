import React, {useState} from 'react';
import Popup from "reactjs-popup";

import Logo from '../logo/logo.component';

import availablePieces from '../pieces/availablePieces'

import { getStartingPositionArray } from '../../utils/helperFunctions';

import {MixedArmyPopup} from '../mixedArmyPopup/mixedArmyPopup.component'
import PieceChooseMenu from '../pieceChooseMenu/pieceChooseMenu.component'
import './localPieceSelection.styles.css'

import {setStartingPosition, setUniquePieces, setOnlineGame} from '../../redux/actions';

import {useDispatch} from 'react-redux';

let player;
let chosenPieces = []
let whitePieceList = []
let blackPieceList = []

const LocalPieceSelection = () => {
    const dispatch = useDispatch()

    const handleSetStartingPositon = (pieces) => dispatch(setStartingPosition(pieces))
    const handleSetUniquePieces = (pieceList) => dispatch(setUniquePieces(pieceList))

    const [mixed, setMixed] = useState(false)

    const [highlightedWhiteButtonIndex, setHighlightedWhiteButtonIndex] = useState(null)
    const [highlightedBlackButtonIndex, setHighlightedBlackButtonIndex] = useState(null)
    const highlightButton = (player, buttonIndex) => {
        player === 1 ? setHighlightedWhiteButtonIndex(buttonIndex) : setHighlightedBlackButtonIndex(buttonIndex) 
    }

    const setchosenPieces = (chosenPieces, player) => {
        player === 1 ? whitePieceList = chosenPieces : blackPieceList = chosenPieces
        if (whitePieceList.length > 0 && blackPieceList.length > 0) { // only if both white and black pieces are chosen we want to proceed further
            const uniquePieceList = new Set(whitePieceList.concat(blackPieceList))
            handleSetUniquePieces(uniquePieceList)
            handleSetStartingPositon(getStartingPositionArray(whitePieceList, blackPieceList))
            whitePieceList = []
            blackPieceList = []
        }
    }

    const chooseMix = (pieces) => {
        highlightButton(player, 4)

        for (let chosenPiece of pieces){
            for (let piece of availablePieces) {
                let tempPiece = new piece(1)
                if (chosenPiece.pieceName === tempPiece.pieceName) {
                    chosenPieces.push(piece)
                    break;
                }
            }
        }
        setchosenPieces(chosenPieces, player)
        player = null;
        setMixed(false)
        chosenPieces = []
    }

    const choose = (set, player, buttonNumber) => {
        highlightButton(player, buttonNumber)

        for (let piece of availablePieces) {
            let currentPiece = new piece(1)
            if (currentPiece.set === set){ 
                chosenPieces.push(piece)
            }
        }
        setchosenPieces(chosenPieces, player)
        chosenPieces = []
    }

    return (
        <div className='chooser-outer-container'>
            <Logo/>
            <div className = 'chooser-container'>
                <h1 className='chooser-top-header'>Choose army for White:</h1>
                <PieceChooseMenu highlightedButtonIndex={highlightedWhiteButtonIndex} player = {1} choose = {choose} onMixed = {() => {setMixed(true)
                                                                                                                             player = 1}} />
                <h1>Choose army for Black:</h1>
                <PieceChooseMenu highlightedButtonIndex={highlightedBlackButtonIndex} player = {2} choose = {choose} onMixed = {() => {setMixed(true)
                                                                                                                             player = 2}} />
                <div className='route-change-button' onClick={() => dispatch(setOnlineGame())}>Switch To Online</div>
            </div>
        
            <Popup className='mixed-popup' open = {mixed} closeOnDocumentClick = {false} closeOnEscape = {false}>
                <MixedArmyPopup whenChosen = {chooseMix} player = {player}/> 
            </Popup>

        </div>
    )
}

export default LocalPieceSelection;