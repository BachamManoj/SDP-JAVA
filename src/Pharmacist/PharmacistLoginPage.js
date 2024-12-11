import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import '../Patient/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Patient/Navbar';

function PharmacistLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      return;
    }

    const pharmacistLoginData = { email, password };

    try {
      const response = await fetch('https://sdp-2200030709-production.up.railway.app/Pharmacistlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pharmacistLoginData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const result = await response.text();
      if (result === 'Login successful!') {
        navigate('/pharmacistHomePage ');
      } else {
        setErrorMessage('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Invalid email or password. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="custom-login-container">
        <h2>Pharmacist Login</h2>
        {errorMessage && <p className="custom-error-message">{errorMessage}</p>}
        <form onSubmit={handleLogin}>
          <div className="custom-input-group">
            <label htmlFor="email">
              <FontAwesomeIcon icon={faUser} /> Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="custom-input-group">
            <label htmlFor="password">
              <FontAwesomeIcon icon={faLock} /> Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="custom-login-button">Login</button>
        </form>
        
      </div>
    </div>
  );
}

export default PharmacistLoginPage;
