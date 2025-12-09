import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import '../Patient/Login.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar';
import api from "../api/apiClient";

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

    try {
      const response = await api.post("/adminLogin", { email, password });

      if (response.status === 200) {
        navigate("/adminpage");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("An error occurred. Please try again.");
      }
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
            <label>
              <FontAwesomeIcon icon={faUser} /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="custom-input-group">
            <label>
              <FontAwesomeIcon icon={faLock} /> Password
            </label>
            <input
              type="password"
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
