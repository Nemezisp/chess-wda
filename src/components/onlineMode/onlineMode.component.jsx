import OnlinePieceSelection from "../onlinePieceSelection/onlinePieceSelection.component";
import UserAuthentication from "../userAuthentication/userAuthentication.component";
import { onAuthStateChangedListener, createUserDocumentFromAuth } from '../../utils/firebase.utils';
import { setCurrentUser } from "../../redux/actions";
import { selectCurrentUser, selectBoardReady } from "../../redux/selectors";

import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OnlinePlayLobby from "../onlinePlayLobby/onlinePlayLobby.component";
import PlayPage from "../playPage/playPage.component";

const OnlineMode = () => {
    const dispatch = useDispatch()

    const currentUser = useSelector(selectCurrentUser)
    const boardReady = useSelector(selectBoardReady)

    const [userRegistered, setUserRegistered] = useState(false)
    const [opponentUsername, setOpponentUsername] = useState(null)

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
    }, [dispatch])

    return (
      <Fragment>
        {!currentUser && <UserAuthentication/>}
        {currentUser && !userRegistered && <OnlinePieceSelection setUserRegistered={setUserRegistered}/>}
        {currentUser && userRegistered && !boardReady && <OnlinePlayLobby setUserRegistered={setUserRegistered} setOpponentUsername={setOpponentUsername}/>}
        {currentUser && userRegistered && boardReady && <PlayPage opponentUsername = {opponentUsername}/> }
      </Fragment>
    )
}

export default OnlineMode;