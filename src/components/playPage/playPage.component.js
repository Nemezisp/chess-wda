import React, {useState, useEffect} from 'react';
import Game from '../game/game.component';
import OnlineGame from '../onlineGame/onlineGame.component';
import './playPage.styles.css';
import PieceChooser from '../pieceChooser/pieceChooser.component';
import {Help} from '../help/help.component';
import {Options} from '../options/options.component';
import Notation from '../notation/notation.component';
import OnlineButtonMenu from '../onlineButtonMenu/onlineButtonMenu.component';
import { connect } from "react-redux";

import {resetGame, toggleHelp, toggleNotation, acceptDrawOffer, declineDrawOffer, setGameResult, resetOnlineGame} from '../../redux/actions';
import { socket } from '../socket';

const PlayPage = ({boardReady, player, help, resetGame, toggleHelp, uniquePieceList, gameResult, toggleNotation, notation, gameMode, onlinePlayerNumber, 
                        onlineUserData, opponentUsername, drawOfferActive, acceptDrawOffer, declineDrawOffer, setGameResult, pieces, resetOnlineGame}) => {

  const [playerTime, setPlayerTime] = useState(null)
  const [opponentTime, setOpponentTime] = useState(null)

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
          setGameResult('0-1')
        }
      } else if ((id === onlineUserData.id && onlinePlayerNumber === 2) || (id !== onlineUserData.id && onlinePlayerNumber === 1)) {
        if (!checkIfDrawAfterTimeEnded(1)) {
          setGameResult('1-0')
        }
      }
    })

    socket.on('userLeftGame', (gameEnded) => { 
      if (!(gameEnded) && boardReady) {
        onlinePlayerNumber === 1 ? setGameResult('1-0') : setGameResult('0-1')
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
    setGameResult('1/2 : 1/2')
    return true
  }

  const acceptDraw = () => {
    socket.emit('drawOfferAccepted')
    acceptDrawOffer()
  }

  const renderNotation = () => {
    return (
      <div className = 'notation-view'>
        <Notation close = {toggleNotation}/> 
        {gameMode === 'online' && !gameResult ? <OnlineButtonMenu/> : null}
      </div>
    )
  }

  const leaveGame = () => {
    socket.emit('leaveGame');
    resetOnlineGame()
  }

  const renderRightBoardSide = () => {
    return (
      <div className = 'right-board-side'>
        <div className ='opponent-container'>
          <span>{opponentUsername}</span>
          <span className = 'time'>{gameMode === 'online' ? opponentTime : null}</span>
        </div>
        {notation ? renderNotation()
                  : help ? <Help pieceList = {uniquePieceList} player = {player} close = {toggleHelp}/> 
                        : <Options gameMode = {gameMode} help = {toggleHelp} notation = {toggleNotation} reset = {gameMode === 'local' ? resetGame : leaveGame} player = {player}/>}
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
                              <button onClick = {declineDrawOffer}>Decline</button>
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

const mapStateToProps = state => ({
  boardReady: state.boardReady,
  player: state.player,
  help: state.help,
  uniquePieceList: state.uniquePieceList,
  gameResult: state.gameResult,
  notation: state.notation,
  gameMode: state.gameMode,
  onlinePlayerNumber: state.onlinePlayerNumber,
  onlineUserData: state.onlineUserData,
  drawOfferActive: state.drawOfferActive,
  pieces: state.pieces
})

const mapDispatchToProps = dispatch => ({
  resetGame: () => dispatch(resetGame()),
  toggleHelp: () => dispatch(toggleHelp()),
  toggleNotation: () => dispatch(toggleNotation()),
  acceptDrawOffer: () => dispatch(acceptDrawOffer()),
  declineDrawOffer: () => dispatch(declineDrawOffer()),
  setGameResult: (result) => dispatch(setGameResult(result)),
  resetOnlineGame: () => dispatch(resetOnlineGame())
})

export default connect(mapStateToProps, mapDispatchToProps)(PlayPage);