import React from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PharmacistDashboard.css";
import { Link } from 'react-router-dom';
import logo from '../images/Life1.png';

const PharmacistDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post("http://localhost:9999/Pharmacistlogout");
      if (response.status === 200) {
        alert(response.data); 
        navigate("/login"); 
      }
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="navbar-container" style={{ backgroundColor: 'ffff' }}>
        <nav className="navbar">
          <h1 className="navbar-title">Pharmacist Dashboard</h1>
        </nav>
      </div>
      <div className="custom-dashboard-container">
        <div className="custom-sidebar">
          <div className="custom-logo-container">
            <img src={logo} alt="Hospital Logo" className="custom-hospital-logo" />
          </div>
          <div className="custom-navbar-center">
            <Link className="custom-navbar-item" to="/doctorHomepage">Home</Link>
            <Link className="custom-navbar-item" to="/mySchedule">E-Prescriptions</Link>
            <Link className="custom-navbar-item" to="/appointments">Track Orders</Link>
            <Link className="custom-navbar-item" to="/pharmacistMedicineList">Store</Link>
            <Link className="custom-navbar-item" to="/medicalRecords">Pending Bills</Link>
            <Link className="custom-navbar-item" to="/support">Support</Link>
            <button
              className="custom-navbar-item custom-logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
