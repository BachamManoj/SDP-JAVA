import React from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import './login.css'

const Logins = () => {
  return (
    <div>
      <Navbar />
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-header">Login to Your Account</h1>
          <div className="login-scroll">
            <div className="login-column">
              <div className="login-card">
                <h2>Patient</h2>
                <p>Login to manage your health records and appointments.</p>
                <Link to="/patientlogin">
                  <button className="btn btn-primary login-button">Patient Login</button>
                </Link>
              </div>
            </div>
            <div className="login-column">
              <div className="login-card">
                <h2>Doctor</h2>
                <p>Login to manage patient records and appointments.</p>
                <Link to="/doctorlogin">
                  <button className="btn btn-primary login-button">Doctor Login</button>
                </Link>
              </div>
            </div>
            <div className="login-column">
              <div className="login-card">
                <h2>Pharmacist</h2>
                <p>Login to manage prescriptions.</p>
                <Link to="/pharmacistlogin">
                  <button className="btn btn-primary login-button">Pharmacist Login</button>
                </Link>
              </div>
            </div>
            <div className="login-column">
              <div className="login-card">
                <h2>Admin</h2>
                <p>Login to manage the system and users.</p>
                <Link to="/adminlogin">
                  <button className="btn btn-primary login-button">Admin Login</button>
                </Link>
              </div>
            </div>
            {/* Add more login options here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logins;

