import React, {useState, useEffect} from 'react';
import Popup from "reactjs-popup";
import './onlinePieceSelection.styles.css'
import PieceChooseMenu from '../pieceChooseMenu/pieceChooseMenu.component';
import {MixedArmyPopup} from '../mixedArmyPopup/mixedArmyPopup.component';
import availablePieces from '../pieces/availablePieces';
import {useDispatch, useSelector} from 'react-redux';
import {socket} from '../socket';
import ChooseButton from '../chooseButton/chooseButton.component';
import { OptionButton } from '../optionButton/optionButton.component';
import {setOnlineUserData} from '../../redux/actions';
import {selectCurrentUser} from '../../redux/selectors';
import UserMenu from "../userMenu/userMenu.component";
import Logo from '../logo/logo.component';

let chosenPieces = []
let army;

const OnlinePieceSelection = ({setUserRegistered}) => {
    const [mixed, setMixed] = useState(false)
    const [timeButtonClasses, setTimeButtonClasses] = useState([null, null, null])
    const [preferredTime, setPrefferedTime] = useState(null)

    const user = useSelector(selectCurrentUser)
    const username = user ? user.displayName : null

    const dispatch = useDispatch()
    const handleSetOnlineUserData = (userData) => dispatch(setOnlineUserData(userData))

    useEffect(() => {
        socket.on('register', (id, username, preferredTime) => {
            handleSetOnlineUserData({
                username: username,
                pieces: chosenPieces,
                id: id,
                preferredTime: preferredTime
            })
        })
    }, [])

    const [highlightedArmyButtonIndex, setHighlightedArmyButtonIndex] = useState(null)
    const highlightButton = (buttonIndex) => {
        setHighlightedArmyButtonIndex(buttonIndex)
    }

    const chooseMix = (pieces) => {
        highlightButton(4)

        chosenPieces = []
        for (let chosenPiece of pieces){
            for (let piece of availablePieces) {
                let tempPiece = new piece(1)
                if (chosenPiece.pieceName === tempPiece.pieceName) {
                    chosenPieces.push(piece)
                    break;
                }
            }
        }

        setMixed(false)

        army = 'Custom army'
    }

    const choose = (set, player, buttonNumber) => {
        highlightButton(buttonNumber)

        for (let piece of availablePieces) {
            let tempPiece = new piece(1)
            if (tempPiece.set === set){ 
                chosenPieces.push(piece)
            }
        }
        
        switch(set){
            case(1): 
                army = 'FIDE Army';
                break;
            case(2): 
                army = 'Colorbound Clobberers';
                break;
            case(3): 
                army = 'Nutty Knights';
                break;
            case(4): 
                army = 'Remarkable Rookies';
                break;
            default:
                army =  'something is wrong';
                break;
        }

    }

    const isUserRegistered = () => {
        if (chosenPieces.length && preferredTime) {
            let pieceNames = chosenPieces.map(piece => {
                let tempPiece = new piece(1)
                return tempPiece.pieceName
            })
            socket.emit('registration', username, army, pieceNames, preferredTime)
            setTimeButtonClasses([null, null, null])
            setHighlightedArmyButtonIndex(null)
            setUserRegistered(true)
            return true
        } else {
            return false
        }
    }

    const chooseTime = (time, buttonNumber) => {
        setPrefferedTime(time)
        let tempButtonClasses = [null, null, null]
        tempButtonClasses[buttonNumber] = 'highlighted'
        setTimeButtonClasses([...tempButtonClasses])
    }

    return (
        <div>
            <div className='online-container'>
                <UserMenu/>
                <div className = 'register-container'>
                    <Logo/>
                    <h1 className='online-register-header'>Choose your army</h1>
                    <div className='online-chooser-container'>
                        <PieceChooseMenu highlightedButtonIndex={highlightedArmyButtonIndex} player = {1} choose = {choose} onMixed = {() => {setMixed(true)}} />
                    </div>
                    <h1 className='online-register-header'>Choose preferred time</h1>
                    <div className = 'time-chooser'>
                        <ChooseButton onClick = {() => chooseTime(180000, 0)} textOnButton = '3 min' classes = {timeButtonClasses[0]}/>
                        <ChooseButton onClick = {() => chooseTime(300000, 1)} textOnButton = '5 min' classes = {timeButtonClasses[1]}/>
                        <ChooseButton onClick = {() => chooseTime(900000, 2)} textOnButton = '15 min' classes = {timeButtonClasses[2]}/>
                    </div>
                    <div className='online-register-submit-container'>
                        <OptionButton onClick = {() => isUserRegistered()} buttonText = 'Submit'/>
                    </div>
                    <Popup className='mixed-popup' open = {mixed} closeOnDocumentClick = {false} closeOnEscape = {false}>
                        <MixedArmyPopup whenChosen = {chooseMix} player = {1}/> 
                    </Popup>
                </div>
            </div>
        </div>
    )
}

export default OnlinePieceSelection;