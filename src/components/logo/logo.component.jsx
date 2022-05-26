import React from 'react';
import "./logo.styles.css"

const Logo = () => {
    return (
        <div className = 'logo-container'>
             <img className='logo' src = {require('./logo.png')}/>
        </div>
    )
}

export default Logo;