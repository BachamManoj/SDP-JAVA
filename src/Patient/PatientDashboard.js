import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './PatientDashboard.css';
import { Link } from 'react-router-dom';
import PatientMain from './PatientMain';
import { FaBars, FaTimes, FaHome, FaCalendarAlt, FaFileAlt, FaReceipt, FaNotesMedical, FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

const PatientDashboard = () => {
    const [patient, setPatient] = useState(null);
    const [profileImage, setProfileImage] = useState(null);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            try {
                const res = await axios.get('http://localhost:9999/getPatientDetails', {
                    withCredentials: true,
                });
                setPatient(res.data);

                const imageRes = await axios.get(`http://localhost:9999/profile/${res.data.id}/image`, {
                    responseType: 'blob',
                    withCredentials: true,
                });
                setProfileImage(URL.createObjectURL(imageRes.data));
            } catch (error) {
                console.error("Error fetching patient details:", error);
            }
        };

        fetchPatientDetails();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:9999/logout', {}, { withCredentials: true });
            setPatient(null);
            setProfileImage(null);
            alert("Logged out successfully.");
            window.location.href = '/login';
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div>
            <PatientMain />
            <div className="custom-dashboard-container">
                <div className={`custom-sidebar1 ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <button 
                className="sidebar-toggle" 
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                {sidebarCollapsed ? '➡' : '⬅'}
                </button>

                    {!sidebarCollapsed && profileImage && (
                        <div className="custom-profile-image-container">
                            <img src={profileImage} alt="Profile" className="custom-profile-image" />
                        </div>
                    )}

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
                        <Link className="custom-navbar-item" to="/billing">
                            <FaReceipt className="navbar-icon" />
                            {!sidebarCollapsed && " Billing"}
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
        </div>
    );
};

export default PatientDashboard;
