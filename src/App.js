import React, { Fragment } from 'react';
import './App.css';
import StartPage from './components/startPage/startPage.component';
import OnlineMode from './components/onlineMode/onlineMode.component';
import LocalMode from './components/localMode/localMode.component';
import { useSelector } from 'react-redux';
import { selectGameMode } from './redux/selectors';

const App = () => {
  const gameMode = useSelector(selectGameMode)

  return (
    <Fragment>
      {!gameMode && <StartPage/>}
      {gameMode === "local" && <LocalMode/>}
      {gameMode === "online" && <OnlineMode/>}
    </Fragment>
  )
}

export default App;