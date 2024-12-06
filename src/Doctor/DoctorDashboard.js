import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DoctorDashboard.css'
import { Link } from 'react-router-dom';
import logo from '../images/Life1.png';

const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const res = await axios.get('http://localhost:9999/getDoctorDetails', {
                    withCredentials: true,
                });
                setDoctor(res.data);

                const imageRes = await axios.get(`http://localhost:9999/Doctorprofile/${res.data.id}/image`, {
                    responseType: 'blob',
                    withCredentials: true,
                });
                setProfileImage(URL.createObjectURL(imageRes.data));
            } catch (error) {
                console.error("Error fetching doctor details:", error);
            }
        };

        fetchDoctorDetails();
    }, []);

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:9999/doctorlogout', {}, { withCredentials: true });
            setDoctor(null);
            setProfileImage(null);
            alert("Logged out successfully.");
            window.location.href = '/login';
        } catch (error) {
            console.error("Error logging out:", error);
        }
    };

    return (
        <div>
            <div className="custom-navbar-container">
                <nav className="custom-navbar">
                    <h1 className="custom-navbar-title">Doctor Dashboard</h1>
                </nav>
            </div>
            <div className="custom-dashboard-container" >
                <div className="custom-sidebar">
                    <div className="custom-logo-container">
                        <img src={logo} alt="Hospital Logo" className="custom-hospital-logo" />
                    </div>
                    {profileImage && (
                        <div className="custom-profile-image-container">
                            <img src={profileImage} alt="Profile" className="custom-profile-image" />
                        </div>
                    )}
                    <div className="custom-navbar-center">
                        <Link className="custom-navbar-item" to="/doctorHomepage">Dashboard</Link>
                        <Link className="custom-navbar-item" to="/mySchedule">mySchedules</Link>
                        <Link className="custom-navbar-item" to="/viewMyPaymentsbyPatients">view Payments</Link>
                        <Link className="custom-navbar-item" to="/patientRecordsbyDocter">Patient Records</Link>
                        <Link className="custom-navbar-item" to="/postReportsData">Medical Records</Link>
                        <Link className="custom-navbar-item" to="/feedback">My feedback</Link>
                        <Link className="custom-navbar-item" to="/updateDoctorProfile">My Profile</Link>
                        <a className="custom-navbar-item" href="#" onClick={handleLogout}>Logout</a> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboard;
