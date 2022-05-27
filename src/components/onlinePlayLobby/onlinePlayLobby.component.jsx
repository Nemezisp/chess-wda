import React, {useState, useEffect} from 'react';
import './onlinePlayLobby.styles.css';
import {useDispatch, useSelector} from 'react-redux';
import availablePieces from './../pieces/availablePieces';
import {socket} from './../socket';
import UserMenu from '../userMenu/userMenu.component';
import Logo from '../logo/logo.component';
import Popup from 'reactjs-popup';

import { getStartingPositionArray } from '../../utils/helperFunctions';

import {setStartingPosition, setOnlinePlayerNumber, setUniquePieces} from './../../redux/actions';
import { selectOnlineUserData } from '../../redux/selectors';

const OnlinePlayLobby = ({setUserRegistered, setOpponentUsername}) => {
    const dispatch = useDispatch()

    const onlineUserData = useSelector(selectOnlineUserData)
    
    const handleSetStartingPosition = (pieces) => dispatch(setStartingPosition(pieces))
    const handleSetOnlinePlayerNumber = (number) => dispatch(setOnlinePlayerNumber(number))
    const handleSetUniquePieces = (pieces) => dispatch(setUniquePieces(pieces))

    const [users, updateUsers] = useState([])
    const [userChallengedBy, setUserChallengedBy] = useState(null)
    const [userIssuedChallengeTo, setUserIssuedChallengeTo] = useState(null)

    useEffect(() => {
        socket.off('startGame')
        socket.on('startGame', (playerNumber, secondPlayerPieceNames, secondPlayerUsername) => {
            setUserIssuedChallengeTo(null)
            setUserChallengedBy(null)
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
            setOpponentUsername(secondPlayerUsername)
            handleSetStartingPosition(pieces)
        })
        socket.off('challengeIssued')
        socket.on('challengeIssued', id => {
            setUserChallengedBy(id)
        })
        socket.off('challengeCancelled')
        socket.on('challengeCancelled', () => {
            setUserChallengedBy(null)
        })
        socket.off('challengeDeclined')
        socket.on('challengeDeclined', () => {
            setUserIssuedChallengeTo(null)
        })
    }, [onlineUserData])

    socket.once('updateUsers', updatedUsers => {
        updateUsers(updatedUsers)
    })

    const initiateStartGame = (id) => {
        socket.emit('initiateStartGame', id)
    }

    const issueChallenge = (id) => {
        socket.emit('issueChallenge', id)
        setUserIssuedChallengeTo(id)
    }

    const cancelChallenge = (id) => {
        socket.emit('cancelChallenge', id)
        setUserIssuedChallengeTo(null)
    }

    const declineChallenge = (id) => {
        socket.emit('declineChallenge', id)
        setUserChallengedBy(null)
    }

    const acceptChallenge = (id) => {
        setUserChallengedBy(null)
        initiateStartGame(id)
    }

    const handleChangePieces = () => {
        setUserRegistered(false)
        socket.emit('leaveLobby')
    }

    if (users.length) {
        let challenger;
        if (userChallengedBy !== null) {
            challenger = users.filter(user => {return user.id===userChallengedBy})[0]
        }
        return(
            <div>
                <UserMenu/>
                <Logo/>
                <div>
                    <table className = 'current-users-table'>
                        <thead>
                            <tr>
                                <th className='current-users-table-header'>Username</th>
                                <th className='current-users-table-header'>Army</th>
                                <th className='current-users-table-header'>Preffered time</th>
                                <th className='current-users-table-header'>In play</th>
                                <th className='current-users-table-header'>Play with user</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => {
                                return (
                                    <tr key = {user.id} className = 'user-in-lobby'>
                                        <td>{user.username.length > 15 ? user.username.slice(0, 15) + "..." : user.username} </td>
                                        <td>{user.army}</td>
                                        <td>{user.prefferedTime/60000 + ' min'}</td>
                                        <td>{user.inPlay ? 'yes' : 'no' }</td>
                                        {onlineUserData.id === user.id ? <td><button className='lobby-button' onClick = {handleChangePieces}>Change your army</button></td> 
                                                                    : user.inPlay ? <td>In play</td> 
                                                                                  : (user.challengeFrom !== null || user.challengeTo !== null) ? <td>Challenge Active</td> : <td><button className='lobby-button' onClick = {() => issueChallenge(user.id)}>Challenge</button></td>}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
                <Popup className='challenge-popup' open = {userChallengedBy !== null || userIssuedChallengeTo !== null} closeOnDocumentClick = {false} closeOnEscape = {false}>
                    <div style={{height: "100%"}}>
                            {
                                userChallengedBy && 
                                <div className='challenge-container'>
                                    <span>You got challenged by: <b>{challenger.username.length > 15 ? challenger.username.slice(0, 15) + "..." : challenger.username}</b></span>
                                    <span>Time: <b>{challenger.prefferedTime/60000 + ' min'}</b></span>
                                    <span>Army: <b>{challenger.army}</b></span>

                                    <div className='challenge-buttons'>
                                        <button className="user-menu-button user-menu-inverted-button" onClick={() => acceptChallenge(userChallengedBy)}>Accept</button>
                                        <button className="user-menu-button user-menu-inverted-button" onClick={() => declineChallenge(userChallengedBy)}>Decline</button>
                                    </div>
                                </div>
                            }
                            {
                                userIssuedChallengeTo && 
                                <div className='challenge-container'>
                                    <span className='challenge-span'><b>Waiting for challenged user response</b></span>
                                    <button className="user-menu-button user-menu-inverted-button" onClick={() => cancelChallenge(userIssuedChallengeTo)}>Cancel challenge</button>
                                </div>
                            }
                    </div> 
                </Popup>
            </div>
        )
    }
    else {
        return null
    }
}
export default OnlinePlayLobby;