import React, {useState} from 'react';
import Popup from "reactjs-popup";
import './onlinePlayRegisterPage.styles.css'
import PieceChooseMenu from './../pieceChooseMenu/pieceChooseMenu.component';
import {MixedArmyPopup} from './../mixedArmyPopup/mixedArmyPopup.component';
import OnlinePlayLobby from './../onlinePlayLobby/onlinePlayLobby.component';
import availablePieces from './../pieces/availablePieces';
import {connect} from 'react-redux';
import {socket} from './../socket';
import ChooseButton from '../chooseButton/chooseButton.component';

import {setOnlineUserData} from './../../redux/actions';

let chosenPieces = []
let army;

const OnlinePlayRegisterPage = ({setOnlineUserData}) => {
    const [userRegistered, setUserRegistered] = useState(false)
    const [mixed, setMixed] = useState(false)
    const [buttonClasses, setButtonClasses] = useState([null, null, null, null, null]) 
    const [timeButtonClasses, setTimeButtonClasses] = useState([null, null, null])
    const [username, setUsername] = useState('')
    const [preferredTime, setPrefferedTime] = useState(null)


    const chooseMix = (pieces) => {
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
        let newButtonClasses = [null, null, null, null, 'chosen']
        setButtonClasses([...newButtonClasses])
        setMixed(false)

        army = 'Custom army'
    }

    const choose = (set, player, buttonNumber) => {
        chosenPieces = []
        let tempButtonClasses = buttonClasses; 
        tempButtonClasses.forEach((buttonClass, index) => {
            index === buttonNumber ? tempButtonClasses[index] = 'chosen' : tempButtonClasses[index] = null
        })
        setButtonClasses([...tempButtonClasses])

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

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const isUserRegistered = () => {
        if (chosenPieces.length && username && preferredTime) {
            setUserRegistered(true)
            setOnlineUserData({
                username: username,
                pieces: chosenPieces,
                id: socket.id,
                preferredTime: preferredTime
            })
            let pieceNames = chosenPieces.map(piece => {
                let tempPiece = new piece(1)
                console.log(tempPiece.pieceName)
                return tempPiece.pieceName
            })
            socket.emit('registration', username, army, pieceNames, preferredTime)
            return true
        } else {
            return false
        }
    }

    const chooseTime = (time, buttonNumber) => {
        setPrefferedTime(time)
        let tempButtonClasses = [null, null, null]
        tempButtonClasses[buttonNumber] = 'chosen'
        setTimeButtonClasses([...tempButtonClasses])
    }

    return (
        <div>
            {userRegistered ? <OnlinePlayLobby socket = {socket}/> 
            : 
            <div className = 'register-container'>
                <h1>Set your username</h1>
                <div className = 'online-play-form'>
                    <input className = 'username-input' type="text" id="username" value={username} onChange={handleUsernameChange}/>
                </div>
                <h1>Choose your army</h1>
                <PieceChooseMenu classList = {buttonClasses} player = {1} choose = {choose} onMixed = {() => {setMixed(true)}} />
                <h1>Choose preferred time</h1>
                <div className = 'time-chooser'>
                    <ChooseButton onClick = {() => chooseTime(180000, 0)} textOnButton = '3 min' classes = {timeButtonClasses[0]}/>
                    <ChooseButton onClick = {() => chooseTime(300000, 1)} textOnButton = '5 min' classes = {timeButtonClasses[1]}/>
                    <ChooseButton onClick = {() => chooseTime(900000, 2)} textOnButton = '15 min' classes = {timeButtonClasses[2]}/>
                </div>
                <button className = 'submit-button' onClick = {isUserRegistered}>Submit</button>
                <Popup open = {mixed} closeOnDocumentClick = {false} closeOnEscape = {false}>
                    <MixedArmyPopup whenChosen = {chooseMix} player = {1} pieceList = {availablePieces}/> 
                </Popup>
            </div>
            }          
        </div>
    )
}

const mapDispatchToProps = dispatch => ({
    setOnlineUserData: userData => dispatch(setOnlineUserData(userData)),
})

export default connect(null, mapDispatchToProps)(OnlinePlayRegisterPage);