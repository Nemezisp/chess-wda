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
      if (!user) { // signout
        dispatch(setCurrentUser(null))
      } else { 
        const userData = await createUserDocumentFromAuth(user)
        if (userData && userData.displayName) { // sign in (Google or email + password)
          dispatch(setCurrentUser(userData))
        }
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