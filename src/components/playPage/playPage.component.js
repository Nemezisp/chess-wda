import React, {useState, useEffect} from 'react';
import Popup from "reactjs-popup";
import Game from '../game/game.component';
import './playPage.styles.css';
import {Help} from '../help/help.component';
import {Options} from '../options/options.component';
import Notation from '../notation/notation.component';
import OnlineButtonMenu from '../onlineButtonMenu/onlineButtonMenu.component';
import {OptionButton} from '../optionButton/optionButton.component'
import { useSelector, useDispatch } from "react-redux";

import {resetGame, toggleHelp, toggleNotation, acceptDrawOffer, declineDrawOffer, setGameResult, resetOnlineGame} from '../../redux/actions';
import { socket } from '../socket';
import { selectBoardReady, selectDrawOfferActive, selectGameMode, selectGameResult, selectHelp, selectNotation, selectOnlinePlayerNumber, selectOnlineUserData, selectPieces, selectActivePlayer, selectUniquePieceList } from '../../redux/selectors';

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
  const activePlayer = useSelector(selectActivePlayer)
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
    if(gameMode === "online") {
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
    }
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
      if (piece.player === player && piece.pieceName !== 'King'){ // draw after time end only if player who's time ended has only a king
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
        {drawOfferActive ? <div className = 'draw-offered-menu show-on-mobile-only'>
                              <span>DRAW OFFERED</span>
                              <OptionButton onClick = {acceptDraw} buttonText = 'Accept'/>
                              <OptionButton onClick = {handleDeclineDrawOffer} buttonText = 'Decline'/>
                            </div>
                          : gameMode === "online" && !gameResult && <div className='show-on-mobile-only'><OnlineButtonMenu/></div>}
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
        {gameMode === "online" && 
          <div className ='opponent-container'>
            <span>{opponentUsername.length > 6 ? opponentUsername.slice(0,6) + '...' : opponentUsername}</span>
            <span className = 'time'> {opponentTime} </span>
          </div>
        }

        <Popup className='help-popup' open={help} closeOnDocumentClick = {false} closeOnEscape = {false}>
            <Help pieceList = {uniquePieceList} player = {gameMode === "online" ? onlinePlayerNumber : activePlayer} close = {handleToggleHelp}/> 
        </Popup> 
        {notation ? renderNotation()
                  : <Options gameMode = {gameMode} help = {handleToggleHelp} notation = {handleToggleNotation} reset = {gameMode === 'local' ? handleResetGame : leaveGame} />}
        
        {gameMode === "online" &&
          <div className = 'player-container'>  
            <span>{username.length > 6 ? username.slice(0,6) + '...' : username}</span>
            <span className = 'time'> {playerTime} </span>
          </div>
        }
      </div>
    )
  }

  const renderLeftBoardSide = () => {
    return (
      <div className = 'left-board-side-small-screen'>
        {gameMode === "online" &&
          <div className = 'player-container-small-screen'>  
            <span>{username.length > 6 ? username.slice(0,6) + '...' : username}</span>
            <span className = 'time'>{playerTime}</span>
          </div>
        }

        <div className = 'left-board-side'>
          {gameResult ? <span className = 'game-ended'>Game Ended</span>
                      : activePlayer === 2 ? <span className = {blackToMoveClass}>Black to move</span> 
                                           : <span className = {whiteToMoveClass}>White to move</span>}
          {drawOfferActive ? <div className = 'draw-offered-menu hide-on-mobile'>
                              <span>Draw Offered</span>
                              <OptionButton onClick = {acceptDraw} buttonText = 'Accept'/>
                              <OptionButton onClick = {handleDeclineDrawOffer} buttonText = 'Decline'/>
                            </div>
                           : gameMode === "online" && !gameResult && <div className='hide-on-mobile grid-row-2'><OnlineButtonMenu/></div>}
        </div>

        {gameMode === "online" && 
          <div className ='opponent-container-small-screen'>
            <span>{opponentUsername.length > 6 ? opponentUsername.slice(0,6) + '...' : opponentUsername}</span>
            <span className = 'time'>{opponentTime}</span>
          </div>
        }
      </div>
    )
  }

  return (
    <div className = 'main-container'>
      {renderLeftBoardSide()}
      <Game/>
      {renderRightBoardSide()}
    </div>
  )
}

export default PlayPage;