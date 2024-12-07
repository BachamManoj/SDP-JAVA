import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

function LoginPage() {
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

    const patientLoginData = { email, password };

    try {
      const response = await fetch('https://sdp-2200030709-production.up.railway.app/patientLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientLoginData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const isValidLogin = await response.json();
      if (isValidLogin) {
        navigate('/patientHomepage');
      } else {
        setErrorMessage('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('Invalid email or password.. Please try again.');
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="custom-login-container">
      <h2>Patient Login</h2>
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
      <div className="custom-additional-links">
        <Link className="nav-link" to="/patientRegistration">Register</Link>
      </div>
    </div>
    </div>
  );
}

export default LoginPage;
