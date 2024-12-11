import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Patient/Navbar'

function DoctorLoginPage() {
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
  
    const doctorLoginData = { email, password }; 
  
    try {
      const response = await fetch('https://sdp-2200030709-production.up.railway.app/doctorlogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(doctorLoginData),
        credentials: 'include' 
      });
  
      if (response.status === 401) {
        setErrorMessage('Invalid email or password. Please try again.');
        return;
      }
  
      if (!response.ok) {
        throw new Error('Login failed');
      }
  
      const doctor = await response.json();
      if (doctor && doctor.email === email) { 
        navigate('/doctorHomepage');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred during login. Please try again.');
    }
  };
  

  return (
    <div>
      <Navbar/>
      <div className="custom-login-container">
        <h2>Doctor Login</h2>
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
          
        </div>
      </div>
    </div>
  );
}

export default DoctorLoginPage;
