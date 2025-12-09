import React from 'react';
import './PatientMain.css'; 
import logo from '../images/LOGO.jpg';

const PatientMain = () => {
    return (
        <div className="navbar-container">
            <nav className="navbar">
                <div className="custom-logo-container">
                    <img src={logo} alt="Hospital Logo" className="custom-hospital-logo" />    
                </div>
                <h1 className="navbar-title">Patient Dashboard</h1>
            </nav>
        </div>
    );
};

export default PatientMain;