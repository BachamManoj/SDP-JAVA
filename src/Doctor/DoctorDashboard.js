import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./DoctorDashboard.css";
import logo from "../images/Life1.png";
import api from "../api/apiClient";

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const res = await api.get("/getDoctorDetails");
        const doctorData = res.data;

        setDoctor(doctorData);

        // Fetch Profile Image
        const imageRes = await api.get(
          `/Doctorprofile/${doctorData.id}/image`,
          { responseType: "blob" }
        );

        setProfileImage(URL.createObjectURL(imageRes.data));
      } catch (err) {
        console.error("Error loading doctor dashboard:", err);
        navigate("/doctorLogin"); // Auto redirect if unauthorized
      }
    };

    loadDoctor();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post("/doctorlogout");

      localStorage.removeItem("token");
      localStorage.removeItem("doctor");

      navigate("/doctorLogin");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div>
      {/* Top Navbar */}
      <div className="custom-navbar-container">
        <nav className="custom-navbar">
          <h1 className="custom-navbar-title">Doctor Dashboard</h1>
        </nav>
      </div>

      {/* Sidebar */}
      <div className="custom-dashboard-container">
        <div className="custom-sidebar">

          <div className="custom-logo-container">
            <img src={logo} alt="Logo" className="custom-hospital-logo" />
          </div>

          {profileImage && (
            <div className="custom-profile-image-container">
              <img
                src={profileImage}
                alt="Profile"
                className="custom-profile-image"
              />
            </div>
          )}

          <div className="custom-navbar-center">
            <Link className="custom-navbar-item" to="/doctorHomepage">
              Dashboard
            </Link>
            <Link className="custom-navbar-item" to="/mySchedule">
              My Schedules
            </Link>
            <Link className="custom-navbar-item" to="/viewMyPaymentsbyPatients">
              View Payments
            </Link>
            <Link className="custom-navbar-item" to="/patientRecordsbyDocter">
              Patient Records
            </Link>
            <Link className="custom-navbar-item" to="/postReportsData">
              Medical Records
            </Link>
            <Link className="custom-navbar-item" to="/feedback">
              My Feedback
            </Link>
            <Link className="custom-navbar-item" to="/updateDoctorProfile">
              My Profile
            </Link>

            <button
              className="custom-navbar-item custom-logout-btn"
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

export default DoctorDashboard;
