import React, { useState } from 'react';
import './CSS/Login.css';
import login_hotel_logo from '../Components/Assets/hotel_logo.png';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div className='login'>
      <div className="login-container">
        <div className='login-logo'>
            <img src={login_hotel_logo} alt="hotel logo" height="20px" width="150px" />
        </div>
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        <div className="login-fields">
          {!isLogin && (
            <>
              <input type="text" placeholder='First Name' />
              <input type="text" placeholder='Last Name' />
            </>
          )}

          <input type="email" placeholder='Email' />
          
          {!isLogin && (
            <input type="password" placeholder='Confirm Password' />
          )}

          <input type="password" placeholder='Password' />
          {isLogin && (
            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>
          )}
        </div>

        <div className="login-policy">
          <p>By continuing, you agree to our <a href="#">Terms of Service and Privacy Policy.</a> </p>
          <input type="checkbox" />
          <p>I agree to terms of services and privacy policy</p>
        </div>

         <button>{isLogin ? 'Login' : 'Sign Up'}</button> Login-signup button

        <p className='login-login'>
          {isLogin ? "Don't have an Account?" : "Already have an Account?"}
          <span onClick={toggleForm}> Click Here</span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
