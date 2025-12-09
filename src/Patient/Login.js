import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import api from "../api/apiClient";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    try {
      const res = await api.post("/patientLogin", { email, password });

      if (res.data && res.data.token) {
        
        // Store JWT token and patient object
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("patient", JSON.stringify(res.data.patient));

        navigate("/patientHomepage");
      } else {
        setErrorMessage("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setErrorMessage("Invalid email or password. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />

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

          <button type="submit" className="custom-login-button">
            Login
          </button>
        </form>

        <div className="custom-additional-links">
          <Link className="nav-link" to="/patientRegistration">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
