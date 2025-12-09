import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faLock } from "@fortawesome/free-solid-svg-icons";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../Patient/Navbar";
import api from "../api/apiClient";

function DoctorLoginPage() {
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
      const res = await api.post("/doctorlogin", { email, password });

      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("doctor", JSON.stringify(res.data.doctor));

        navigate("/doctorHomepage");
      } else {
        setErrorMessage("Invalid login response.");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setErrorMessage("Invalid email or password.");
      } else {
        setErrorMessage("Login failed. Try again.");
      }
    }
  };

  return (
    <div>
      <Navbar />

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

          <button type="submit" className="custom-login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default DoctorLoginPage;
