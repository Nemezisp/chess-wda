import React, {useState, useEffect} from 'react';
import Game from '../game/game.component';
import OnlineGame from '../onlineGame/onlineGame.component';
import './playPage.styles.css';
import PieceChooser from '../pieceChooser/pieceChooser.component';
import {Help} from '../help/help.component';
import {Options} from '../options/options.component';
import Notation from '../notation/notation.component';
import OnlineButtonMenu from '../onlineButtonMenu/onlineButtonMenu.component';
import { useSelector, useDispatch } from "react-redux";

import {resetGame, toggleHelp, toggleNotation, acceptDrawOffer, declineDrawOffer, setGameResult, resetOnlineGame} from '../../redux/actions';
import { socket } from '../socket';
import { selectBoardReady, selectDrawOfferActive, selectGameMode, selectGameResult, selectHelp, selectNotation, selectOnlinePlayerNumber, selectOnlineUserData, selectPieces, selectPlayer, selectUniquePieceList } from '../../redux/selectors';

const PlayPage = ({opponentUsername}) => {
  
  const [playerTime, setPlayerTime] = useState(null)
  const [opponentTime, setOpponentTime] = useState(null)

  const dispatch = useDispatch()

  const handleResetGame = () => dispatch(resetGame())
  const handleToggleHelp = () => dispatch(toggleHelp())
  const handleAcceptDrawOffer = () => dispatch(acceptDrawOffer())
  const handleToggleNotation = () => dispatch(toggleNotation())
  const handleDeclineDrawOffer = () => dispatch(declineDrawOffer())
  const handleSetGameResult = (result) => dispatch(setGameResult(result))
  const handleResetOnlineGame = () => dispatch(resetOnlineGame())

  const boardReady = useSelector(selectBoardReady)
  const player = useSelector(selectPlayer)
  const help = useSelector(selectHelp)
  const uniquePieceList = useSelector(selectUniquePieceList)
  const gameResult = useSelector(selectGameResult)
  const gameMode = useSelector(selectGameMode)
  const notation = useSelector(selectNotation)
  const onlinePlayerNumber = useSelector(selectOnlinePlayerNumber)
  const onlineUserData = useSelector(selectOnlineUserData)
  const drawOfferActive = useSelector(selectDrawOfferActive)
  const pieces = useSelector(selectPieces)

  useEffect(() => {
    socket.on('changeTime', (time, id) => {
      id === onlineUserData.id ? setPlayerTime(time) : setOpponentTime(time)
    })

    socket.on('setStartingTime', (time) => {
      setPlayerTime(time)
      setOpponentTime(time)
    })

    socket.on('timeEnded', (id) => {
      if ((id === onlineUserData.id && onlinePlayerNumber === 1) || (id !== onlineUserData.id && onlinePlayerNumber === 2)) {
        if (!checkIfDrawAfterTimeEnded(2)) {
          handleSetGameResult('0-1')
        }
      } else if ((id === onlineUserData.id && onlinePlayerNumber === 2) || (id !== onlineUserData.id && onlinePlayerNumber === 1)) {
        if (!checkIfDrawAfterTimeEnded(1)) {
          handleSetGameResult('1-0')
        }
      }
    })

    socket.on('userLeftGame', (gameEnded) => { 
      if (!(gameEnded) && boardReady) {
        onlinePlayerNumber === 1 ? handleSetGameResult('1-0') : handleSetGameResult('0-1')
      }
    })
  }, [])

  let blackToMoveClass = 'black-move';
  let whiteToMoveClass = 'white-move';

  if (gameMode === 'online') {
    blackToMoveClass = onlinePlayerNumber === 1 ? 'black-move' : 'black-move-reversed'
    whiteToMoveClass = onlinePlayerNumber === 1 ? 'white-move' : 'white-move-reversed'
  }                        

  let username = gameMode === 'online' ?  onlineUserData.username : null

  const checkIfDrawAfterTimeEnded = (player) => {
    for (let piece of pieces) {
      if (piece.player === player && piece.pieceName !== 'King'){
        return false
      }
    } 
    handleSetGameResult('1/2 : 1/2')
    return true
  }

  const acceptDraw = () => {
    socket.emit('drawOfferAccepted')
    handleAcceptDrawOffer()
  }

  const renderNotation = () => {
    return (
      <div className = 'notation-view'>
        <Notation close = {handleToggleNotation}/> 
        {gameMode === 'online' && !gameResult ? <OnlineButtonMenu/> : null}
      </div>
    )
  }

  const leaveGame = () => {
    socket.emit('leaveGame');
    handleResetOnlineGame()
  }

  const renderRightBoardSide = () => {
    return (
      <div className = 'right-board-side'>
        <div className ='opponent-container'>
          <span>{opponentUsername}</span>
          <span className = 'time'>{gameMode === 'online' ? opponentTime : null}</span>
        </div>
        {notation ? renderNotation()
                  : help ? <Help pieceList = {uniquePieceList} player = {player} close = {handleToggleHelp}/> 
                        : <Options gameMode = {gameMode} help = {handleToggleHelp} notation = {handleToggleNotation} reset = {gameMode === 'local' ? handleResetGame : leaveGame} player = {player}/>}
        <div className = 'player-container'>  
          <span>{username}</span>
          <span className = 'time'>{gameMode === 'online' ? playerTime : null}</span>
        </div>
      </div>
    )
  }

  const renderLeftBoardSide = () => {
    return (
      <div className = 'left-board-side-small-screen'>
        <div className = 'player-container-small-screen'>  
          <span>{username}</span>
          <span className = 'time'>{gameMode === 'online' ? playerTime : null}</span>
        </div>
        <div className = 'left-board-side'>
          {gameResult ? <span className = 'game-ended'>GAME ENDED</span>
                      : player === 2 ? <span className = {blackToMoveClass}>BLACK TO MOVE</span> 
                                    : <span className = {whiteToMoveClass}>WHITE TO MOVE</span>}
          {drawOfferActive ? <div className = 'draw-offered-menu'>
                              <span>DRAW OFFERED</span>
                              <button onClick = {acceptDraw}>Accept</button>
                              <button onClick = {handleDeclineDrawOffer}>Decline</button>
                            </div>
                          : null}
        </div>
        <div className ='opponent-container-small-screen'>
          <span>{opponentUsername}</span>
          <span className = 'time'>{gameMode === 'online' ? opponentTime : null}</span>
        </div>
      </div>
    )
  }

  return (
    boardReady ? 
              <div className = 'main-container'>
                {renderLeftBoardSide()}
                {gameMode === 'local' ? <Game/> : <OnlineGame/>}
                {renderRightBoardSide()}
               </div>
               : 
               <PieceChooser/>
  )
}

export default PlayPage;