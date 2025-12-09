import React, { useState, useEffect } from "react";
import api from "../api/apiClient";
import "./PatientDashboard.css";
import { Link } from "react-router-dom";
import PatientMain from "./PatientMain";

import {
  FaHome,
  FaCalendarAlt,
  FaFileAlt,
  FaReceipt,
  FaNotesMedical,
  FaShoppingCart,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const res = await api.get("/getPatientDetails", { withCredentials: true });
        setPatient(res.data);

        const img = await api.get(`/profile/${res.data.id}/image`, {
          responseType: "blob",
          withCredentials: true,
        });

        const imgURL = URL.createObjectURL(img.data);
        setProfileImage(imgURL);

        return () => URL.revokeObjectURL(imgURL);
      } catch (error) {
        console.error("Error fetching patient details:", error);
      }
    };

    fetchPatient();
  }, []);

  const handleLogout = async () => {
    try {
      await api.post("/logout", {}, { withCredentials: true });
      alert("Logged out successfully.");
      localStorage.removeItem("token");
      localStorage.removeItem("patient");
      window.location.href = "/login";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <>
      <PatientMain />

      <div className="custom-dashboard-container">
        <div className={`custom-sidebar1 ${sidebarCollapsed ? "collapsed" : ""}`}>

          {/* Toggle Button */}
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? "➡" : "⬅"}
          </button>

          {/* Profile Image */}
          {!sidebarCollapsed && profileImage && (
            <div className="custom-profile-image-container">
              <img
                src={profileImage}
                alt="Profile"
                className="custom-profile-image"
              />
            </div>
          )}

          {/* Menu */}
          <div className="custom-navbar-center">
            <Link className="custom-navbar-item" to="/patientHomepage">
              <FaHome className="navbar-icon" />
              {!sidebarCollapsed && " Dashboard"}
            </Link>

            <Link className="custom-navbar-item" to="/bookAppointments">
              <FaCalendarAlt className="navbar-icon" />
              {!sidebarCollapsed && " Book Appointment"}
            </Link>

            <Link className="custom-navbar-item" to="/myAppointments">
              <FaFileAlt className="navbar-icon" />
              {!sidebarCollapsed && " My Appointment"}
            </Link>

            <Link className="custom-navbar-item" to="/MyEPrescription">
              <FaNotesMedical className="navbar-icon" />
              {!sidebarCollapsed && " EPrescription"}
            </Link>

            <Link className="custom-navbar-item" to="/patientRecordsbyPatient">
              <FaFileAlt className="navbar-icon" />
              {!sidebarCollapsed && " Reports"}
            </Link>

            <Link className="custom-navbar-item" to="/myOrdersByPatient">
              <FaShoppingCart className="navbar-icon" />
              {!sidebarCollapsed && " My Orders"}
            </Link>

            <Link className="custom-navbar-item" to="/patientprofile">
              <FaUser className="navbar-icon" />
              {!sidebarCollapsed && " My Profile"}
            </Link>

            <a className="custom-navbar-item" href="#" onClick={handleLogout}>
              <FaSignOutAlt className="navbar-icon" />
              {!sidebarCollapsed && " Logout"}
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;
