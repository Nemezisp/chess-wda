import { useState } from 'react'

import { signInWithGooglePopup, signInAuthUserWithEmailAndPassword } from '../../utils/firebase.utils'

import "./signInForm.styles.css";

const defaultFormFields = {
    email: '',
    password: '',
}

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields)
    const [isSigningIn, setIsSigningIn] = useState(false)
    const { email, password }= formFields

    const resetFormFields = () => {
        setFormFields(defaultFormFields)
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormFields({...formFields, [name]: value})
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsSigningIn(true)
        try {
            await signInAuthUserWithEmailAndPassword(email, password)
            resetFormFields()
        } catch (err) {
            if (err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
                alert('Wrong email or password!')
            } else {
                console.log('Error logging in', err)
                alert('Error logging in')
            }
        }
        setIsSigningIn(false)
    }

    const signInWithGoogle = async () => {
        await signInWithGooglePopup();
    }

    return (
        <div className='sign-in-form-container'>
            <h2>Already have an account?</h2>
            <span style={{fontSize: "15px"}}>Sign in with your email and password below:</span>
            <form className='auth-form'>
                <div className='auth-input'>
                    <label className='auth-label'>Email</label>
                    <input type="email" name="email" onChange={handleChange} required value={email}></input>
                </div>
                <div className='auth-input'>
                    <label className='auth-label'>Password</label>
                    <input type="password" name="password" onChange={handleChange} required value={password}></input>
                </div>
            </form>
            <div className='sign-in-buttons-container'>
                <button className='auth-button' type="submit"  onClick={handleSubmit}>{isSigningIn ? "Signing in..." : "Sign In"}</button>               
                <button className='auth-button auth-google-button' type="button"  onClick={signInWithGoogle}>{isSigningIn ? "Signing in..." : "Google Sign In"}</button> 
            </div>
        </div>
    )
}

export default SignInForm