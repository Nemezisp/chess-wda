import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import PlayPage from './components/playPage/playPage.component';
import OnlinePlayRegisterPage from './components/onlinePlayRegisterPage/onlinePlayRegisterPage.component';
import StartPage from './components/startPage/startPage.component';
import UserAuthentication from './components/userAuthentication/userAuthentication.component';
import { setCurrentUser } from './redux/actions';
import {connect} from 'react-redux'
import { onAuthStateChangedListener, createUserDocumentFromAuth, getUserFromDatabase } from './utils/firebase.utils';

const App = ({gameMode, currentUser}) => {
  const dispatch = useDispatch()

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      console.log('here', user)
      if(user) {
        await createUserDocumentFromAuth(user)
        const userData = await getUserFromDatabase(user.uid)
        dispatch(setCurrentUser(userData))
      } else {
        dispatch(setCurrentUser(user))
      }
    })
    return unsubscribe
  }, [])

  return (
    gameMode ? gameMode === 'local' ? <PlayPage/> : currentUser ? <OnlinePlayRegisterPage/> : <UserAuthentication/>
             : <StartPage/>
  )
}

const mapStateToProps = state => ({
  gameMode: state.gameMode,
  currentUser: state.currentUser
})

export default connect(mapStateToProps)(App);