import React, {useState, useEffect} from 'react';
import './onlinePlayLobby.styles.css';
import {useDispatch, useSelector} from 'react-redux';
import availablePieces from './../pieces/availablePieces';
import PlayPage from '../playPage/playPage.component';
import {socket} from './../socket';

import Forbidden from './../pieces/forbidden/forbidden';
import Empty from './../pieces/empty/empty';
import King from './../pieces/king/king';
import Pawn from './../pieces/pawn/pawn';

import {setStartingPosition, setOnlinePlayerNumber, setUniquePieces} from './../../redux/actions';
import { selectBoardReady, selectOnlineUserData } from '../../redux/selectors';

let opponentUsername = null;

const OnlinePlayLobby = () => {
    const dispatch = useDispatch()

    const onlineUserData = useSelector(selectOnlineUserData)
    const boardReady = useSelector(selectBoardReady)
    
    const handleSetStartingPosition = (pieces) => dispatch(setStartingPosition(pieces))
    const handleSetOnlinePlayerNumber = (number) => dispatch(setOnlinePlayerNumber(number))
    const handleSetUniquePieces = (pieces) => dispatch(setUniquePieces(pieces))

    const [users, updateUsers] = useState([])

    useEffect(() => {
        socket.off('startGame')
        socket.on('startGame', (playerNumber, secondPlayerPieceNames, secondPlayerUsername) => {
            console.log(onlineUserData)
            let secondPlayerChosenPieces = [];
            for (let piece of availablePieces){
                let tempPiece = new piece(1)
                if (secondPlayerPieceNames.includes(tempPiece.pieceName.replace(/\s/g, "").toLowerCase())){
                    secondPlayerChosenPieces.push(piece)
                }
            }
            handleSetOnlinePlayerNumber(playerNumber)
            let whitePieceList = playerNumber === 1 ? onlineUserData.pieces : secondPlayerChosenPieces
            let blackPieceList = playerNumber === 2 ? onlineUserData.pieces : secondPlayerChosenPieces
            let uniquePieceList = new Set(whitePieceList.concat(blackPieceList))
            handleSetUniquePieces(uniquePieceList)
            let pieces = getStartingPositionArray(whitePieceList, blackPieceList)
            opponentUsername = secondPlayerUsername
            handleSetStartingPosition(pieces)
        })
    }, [onlineUserData])

    socket.once('updateUsers', updatedUsers => {
        updateUsers(updatedUsers)
    })

    const initiateStartGame = (id) => {
        socket.emit('initiateStartGame', id)
    }

    const getStartingPositionArray = (whitePieceList, blackPieceList) => {  //create an array with all pieces on starting squares in 10x12 board representation
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
    

    if (users.length) {
        if (!boardReady) {
            return(
                <table className = 'current-users-table'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Army</th>
                            <th>Preffered time</th>
                            <th>In play</th>
                            <th>Play with user</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => {
                            return (
                                <tr key = {user.id} className = 'user-in-lobby'>
                                    <td>{user.username} </td>
                                    <td>{user.army}</td>
                                    <td>{user.prefferedTime/60000 + ' min'}</td>
                                    <td>{user.inPlay ? 'yes' : 'no' }</td>
                                    {onlineUserData.id === user.id ? <td>That's you</td> 
                                                                   :  user.inPlay ? <td>In play</td> : <td><button onClick = {() => initiateStartGame(user.id)}>Play</button></td>}
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            )
        } else {
            return <PlayPage opponentUsername = {opponentUsername}/>
        }
    }
    else {
        return null
    }
}
export default OnlinePlayLobby