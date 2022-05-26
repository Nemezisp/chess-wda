import { useState } from 'react'
import { setCurrentUser } from '../../redux/actions';
import { createAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from '../../utils/firebase.utils';
import { useDispatch } from 'react-redux';

import "./registerForm.styles.css";

const defaultFormFields = {
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
}

const RegisterForm = () => {
    const dispatch = useDispatch()

    const [formFields, setFormFields] = useState(defaultFormFields)
    const [isRegistering, setIsRegistering] = useState(false)
    const { displayName, email, password, confirmPassword }= formFields

    const resetFormFields = () => {
        setFormFields(defaultFormFields)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setIsRegistering(true)
        if (confirmPassword !== password) {
            alert("Passwords do not match");
            setIsRegistering(false)
            return
        } 
        try {
            const {user} = await createAuthUserWithEmailAndPassword(email, password)
            const userData = await createUserDocumentFromAuth(user, {displayName})
            dispatch(setCurrentUser(userData))
            resetFormFields()
        } catch (err) {
            if (err.code === "auth/email-already-in-use") {
                alert('Cannot create user, email already in use')
            } else if (err.code === "auth/weak-password") {
                alert('Password should be at least 6 characters')
            } else {
                console.log('User creation encountered an error', err)
                alert('User creation encountered an error')
            }
        }
        setIsRegistering(false)
    }

    const handleChange = (event) => {
        const {name, value} = event.target;
        setFormFields({...formFields, [name]: value})
    }

    return (
        <div className='register-form-container'>
            <h2>Don't have an account?</h2>
            <span style={{fontSize: "15px"}}>Register with your email and password below:</span>
            <form className='auth-form'>
                <div className='auth-input'>
                    <label className='auth-label'>Username</label>
                    <input type="text" name="displayName" onChange={handleChange} required value={displayName}></input>
                </div>
                <div className='auth-input'>
                    <label className='auth-label'>Email</label>
                    <input type="email" name="email" onChange={handleChange} required value={email}></input>
                </div>
                <div className='auth-input'>
                    <label className='auth-label'>Password</label>
                    <input type="password" name="password" onChange={handleChange} required value={password}></input>
                </div>
                <div className='auth-input'>
                    <label className='auth-label'>Confirm password</label>
                    <input type="password" name="confirmPassword" onChange={handleChange} required value={confirmPassword}></input>
                </div>
            </form>
            <div className='register-buttons-container'>
                <button className='auth-button' type="submit" onClick={handleSubmit}>{isRegistering ? "Registering..." : "Register"}</button>        
            </div>
        </div>
    )
}

export default RegisterForm