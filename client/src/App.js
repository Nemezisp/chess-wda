import React from 'react';
import './App.css';
import PlayPage from './components/playPage/playPage.component';
import OnlinePlayRegisterPage from './components/onlinePlayRegisterPage/onlinePlayRegisterPage.component';
import StartPage from './components/startPage/startPage.component';
import {connect} from 'react-redux'

const App = ({gameMode}) => {

  return (
    gameMode ? gameMode === 'local' ? <PlayPage/> : <OnlinePlayRegisterPage/>
        : <StartPage/>
  )
}

const mapStateToProps = state => ({
  gameMode: state.gameMode
})

export default connect(mapStateToProps)(App);