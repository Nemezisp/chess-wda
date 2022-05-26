import React, {useState} from 'react';
import Popup from "reactjs-popup";

import Forbidden from './../pieces/forbidden/forbidden';
import Empty from './../pieces/empty/empty';
import King from './../pieces/king/king';
import Pawn from './../pieces/pawn/pawn';

import Logo from '../logo/logo.component';

import availablePieces from './../pieces/availablePieces';

import {MixedArmyPopup} from './../mixedArmyPopup/mixedArmyPopup.component';
import PieceChooseMenu from './../pieceChooseMenu/pieceChooseMenu.component';
import './pieceChooser.styles.css'

import {setStartingPosition, setUniquePieces, setOnlineGame} from '../../redux/actions';

import {useDispatch} from 'react-redux';

let player;
let chosenPieces = []
let whitePieceList = []
let blackPieceList = []

const PieceChooser = () => {
    const dispatch = useDispatch()

    const handleSetStartingPositon = (pieces) => dispatch(setStartingPosition(pieces))
    const handleSetUniquePieces = (pieceList) => dispatch(setUniquePieces(pieceList))

    const [mixed, setMixed] = useState(false)
    const [buttonWhiteClasses, setButtonWhiteClasses] = useState([null, null, null, null, null]) 
    const [buttonBlackClasses, setButtonBlackClasses] = useState([null, null, null, null, null]) 

    const setchosenPieces = (chosenPieces, player) => {
        player === 1 ? whitePieceList = chosenPieces : blackPieceList = chosenPieces
        if (whitePieceList.length > 0 && blackPieceList.length > 0) {
            let uniquePieceList = new Set(whitePieceList.concat(blackPieceList))
            handleSetUniquePieces(uniquePieceList)
            handleSetStartingPositon(getStartingPositionArray())
            whitePieceList = []
            blackPieceList = []
        }
    }

    const getStartingPositionArray = () => {  //create an array with all pieces on starting squares in 10x12 board representation
        const pieces = [];
        for (let i = 0; i < 120; i++) {
            if (i === 22 ||i === 27) {
                pieces.push(new whitePieceList[0](1))
            } else if (i === 92 ||i === 97) {
                pieces.push(new blackPieceList[0](2))
            } else if (i === 21 ||i === 28){
                pieces.push(new whitePieceList[2](1))
            } else if (i === 91 ||i === 98) {
                pieces.push(new blackPieceList[2](2))
            } else if (i === 23 ||i === 26) {
                pieces.push(new whitePieceList[1](1))
            } else if (i === 93 ||i === 96) {
                pieces.push(new blackPieceList[1](2))
            } else if (i === 24) {
                pieces.push(new King(1))
            } else if (i === 94) {
                pieces.push(new King(2))
            } else if (i === 25) {
                pieces.push(new whitePieceList[3](1))
            } else if (i === 95) {
                pieces.push(new blackPieceList[3](2))
            } else if (i >= 31 && i <= 38) {
                pieces.push(new Pawn(1))
            } else if (i >= 81 && i <= 88) {
                pieces.push(new Pawn(2))
            } else if ((i >= 41 && i <= 48) || (i >= 51 && i <= 58 ) || (i >= 61 && i <= 68 ) || (i >= 71 && i <= 78)){
                pieces.push(new Empty())
            } else {
                pieces.push(new Forbidden ())
            }
        }
        return pieces;
    }

    const chooseMix = (pieces) => {
        for (let chosenPiece of pieces){
            for (let piece of availablePieces) {
                let tempPiece = new piece(1)
                if (chosenPiece.pieceName === tempPiece.pieceName) {
                    chosenPieces.push(piece)
                    break;
                }
            }
        }
        let newButtonClasses = [null, null, null, null, 'chosen']
        player === 1 ? setButtonWhiteClasses([...newButtonClasses]) : setButtonBlackClasses([...newButtonClasses])
        setchosenPieces(chosenPieces, player)
        player = null;
        setMixed(false)
        chosenPieces = []
    }

    const choose = (set, player, buttonNumber) => {
        let tempButtonClasses = player === 1 ? buttonWhiteClasses : buttonBlackClasses; 
        tempButtonClasses.forEach((buttonClass, index) => {
            index === buttonNumber ? tempButtonClasses[index] = 'chosen' : tempButtonClasses[index] = null
        })
        player === 1 ? setButtonWhiteClasses([...tempButtonClasses]) : setButtonBlackClasses([...tempButtonClasses])

        for (let piece of availablePieces) {
            let current = new piece(1)
            if (current.set === set){ 
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
                <PieceChooseMenu classList = {buttonWhiteClasses} player = {1} choose = {choose} onMixed = {() => {setMixed(true)
                                                                                                                player = 1}} />
                <h1>Choose army for Black:</h1>
                <PieceChooseMenu classList = {buttonBlackClasses} player = {2} choose = {choose} onMixed = {() => {setMixed(true)
                                                                                                            player = 2}} />
                <div className='route-change-button' onClick={() => dispatch(setOnlineGame())}>Switch To Online</div>
            </div>
        
            <Popup className='mixed-popup' open = {mixed} closeOnDocumentClick = {false} closeOnEscape = {false}>
                <MixedArmyPopup whenChosen = {chooseMix} player = {player} pieceList = {availablePieces}/> 
            </Popup>

        </div>
    )
}

export default PieceChooser;