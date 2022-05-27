import "./userMenu.styles.css";
import { changeUsername, signOutUser } from '../../utils/firebase.utils';
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentUser } from "../../redux/selectors";
import { setCurrentUser } from "../../redux/actions";
import Popup from "reactjs-popup";
import { socket } from "../socket";

const UserMenu = () => {
    const dispatch = useDispatch()

    const [usernameChangePopupOpen, setUsernameChangePopupOpen] = useState(false)
    const [usernameInput, setusernameInput] = useState('')
    const user = useSelector(selectCurrentUser)

    const handleSignOut = async () => {
        await signOutUser()
    }

    const handleChange = (event) => {
        const {value} = event.target;
        setusernameInput(value)
    }

    const resetUsernameField = () => {
        setusernameInput('')
    }

    const handleChangeUsername = async () => {
        if (usernameInput !== "") {
            setUsernameChangePopupOpen(false)
            const newUserData = await changeUsername(user.uid, usernameInput)
            dispatch(setCurrentUser(newUserData))
            socket.emit("updateUsername", usernameInput)
            resetUsernameField()
        }
    }

    return (
        <div className='user-menu-container'>
            <div className="user-menu-inner-container">
                {user.displayName && <div className="logged-as-container">Logged in as {user.displayName.length > 15 ? user.displayName.slice(0, 15) + "..." : user.displayName}</div>}
                <button className="user-menu-button" onClick={() => setUsernameChangePopupOpen(true)}>Change Username</button>
                <button className="user-menu-button" onClick={() => handleSignOut()}>Sign Out</button>
            </div>
            <Popup className='username-popup' open = {usernameChangePopupOpen} closeOnDocumentClick = {false} closeOnEscape = {false}>
                <h3 className="username-change-heading">Change username:</h3>
                <input className="username-change-input" type="text" name="username" onChange={handleChange} required value={usernameInput}></input>
                <button type="submit" className="user-menu-button user-menu-inverted-button" onClick={() => handleChangeUsername()}>Save</button>
                <div className="popup-close" onClick={() => setUsernameChangePopupOpen(false)}>&times;</div>
            </Popup>
        </div>
    )
}

export default UserMenu