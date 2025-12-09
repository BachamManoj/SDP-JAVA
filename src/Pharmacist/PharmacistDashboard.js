import React from "react";
import api from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./PharmacistDashboard.css";
import logo from "../images/Life1.png";

const PharmacistDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/Pharmacistlogout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="navbar-container" style={{ backgroundColor: "#373af0ff" }}>
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
            <Link className="custom-navbar-item" to="/pharmacistHomePage">Home</Link>
            <Link className="custom-navbar-item" to="/trackOrder">Accepted Orders</Link>
            <Link className="custom-navbar-item" to="/viewOrdersbyPharmasisct">New Orders</Link>
            <Link className="custom-navbar-item" to="/pharmacistMedicineList">Medicine List</Link>
            <Link className="custom-navbar-item" to="/viewPaymentsByEPharmacist">E-Prescription Payments</Link>
            <Link className="custom-navbar-item" to="/viewPaymentsByEPharmacist">Payments</Link>
            <Link className="custom-navbar-item" to="/pharmacistSupport">Support</Link>

            <button onClick={handleLogout} className="custom-navbar-item custom-logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
