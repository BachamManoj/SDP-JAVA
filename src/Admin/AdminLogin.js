import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import '../Patient/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';

function AdminLogin() {
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

    const adminLoginData = { email, password };

    try {
      const response = await fetch('http://localhost:9999/adminLogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminLoginData),
        credentials: 'include',
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorMessage('Invalid email or password. Please try again.');
        } else {
          throw new Error('Login failed');
        }
        return;
      }

      const adminData = await response.json();
      if (adminData) {
        // Store admin session info if needed
        navigate('/adminpage');
      } else {
        setErrorMessage('Invalid email or password. Please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <Navbar />
      <div className="custom-login-container">
        <h2>Admin Login</h2>
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
          <Link className="nav-link" to="/adminRegistration">Register</Link>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
