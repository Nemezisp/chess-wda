import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import SignInForm from '../signInForm/signInForm.component';
import RegisterForm from '../registerForm/registerForm.component';
import {setLocalGame} from '../../redux/actions';
import "./userAuthentication.styles.css"

const UserAuthentication = () => {
    const dispatch = useDispatch()

    const [authRoute, setAuthRoute] = useState("signIn")

    return (
        <div className='auth-container'>
            <div className='auth-inner-container'>
                <div className='auth-form-container'>
                    {
                        authRoute === "signIn" && 
                        <SignInForm/>
                    }
                    {
                        authRoute === "register" &&
                        <RegisterForm/>
                    }
                </div>
                <div className='auth-routes-container'>
                    {authRoute === "signIn" && <div className='auth-route-change-button' onClick={() => setAuthRoute("register")}>Register</div>}
                    {authRoute === "register" && <div className='auth-route-change-button' onClick={() => setAuthRoute("signIn")}>Sign In</div>}
                    <div className='auth-route-change-button' onClick={() => dispatch(setLocalGame())}>Change to Local</div>
                </div>
            </div>
        </div> 
    )
}

export default UserAuthentication;