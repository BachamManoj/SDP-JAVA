import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import PatientDashboard from './PatientDashboard';
import './PatientProfile.css';

const PatientProfile = () => {
    const [patientData, setPatientData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        email: '',
        address: '',
        profileImage: null
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatientData = async () => {
            try {
                const res = await axios.get('https://sdp-2200030709-production.up.railway.app/getPatientDetails', {
                    withCredentials: true,
                });
                setPatientData(res.data);
                
                if (res.data.id) {
                    const imageRes = await axios.get(`https://sdp-2200030709-production.up.railway.app/profile/${res.data.id}/image`, {
                        responseType: 'blob',
                        withCredentials: true,
                    });
                    setImagePreview(URL.createObjectURL(imageRes.data));
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to load patient data. Please log in.');
                setLoading(false);
                navigate('/login');
            }
        };

        fetchPatientData();
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatientData({
            ...patientData,
            [name]: value
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setPatientData({
            ...patientData,
            profileImage: file
        });
        setImagePreview(URL.createObjectURL(file));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        const formData = new FormData();
        Object.keys(patientData).forEach((key) => {
            formData.append(key, patientData[key]);
        });

        try {
            const res = await axios.put('https://sdp-2200030709-production.up.railway.app/updatePatientProfile', formData, {
                withCredentials: true,
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setMessage('Profile updated successfully.');
        } catch (err) {
            console.error(err);
            setError('Failed to update profile.');
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    if (loading) return <div>Loading...</div>;

    return (
        <div className="dashboard-container d-flex">
            <PatientDashboard />
            <div className="profile-content flex-grow-1 container mt-5">
                <div className="profile-form-container card">
                    <div className="card-body text-center">
                        <h2 className="card-title mb-4">Patient Profile</h2>

                        <div className="profile-picture mb-4">
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="Profile"
                                    style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div
                                    style={{
                                        width: '150px',
                                        height: '150px',
                                        borderRadius: '50%',
                                        backgroundColor: '#ccc',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '24px',
                                        color: '#fff'
                                    }}
                                >
                                    No Image
                                </div>
                            )}
                        </div>

                       
                        <form onSubmit={handleUpdate}>
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            className="form-control"
                                            value={patientData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            className="form-control"
                                            value={patientData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            className="form-control"
                                            value={patientData.dateOfBirth}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Gender</label>
                                        <select
                                            name="gender"
                                            className="form-select"
                                            value={patientData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Contact Number</label>
                                        <input
                                            type="text"
                                            name="contactNumber"
                                            className="form-control"
                                            value={patientData.contactNumber}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            value={patientData.email}
                                            onChange={handleChange}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <textarea
                                            name="address"
                                            className="form-control"
                                            value={patientData.address}
                                            onChange={handleChange}
                                            required
                                            style={{ height: '100px' }}
                                        ></textarea>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label>Profile Picture</label>
                                        <input
                                            type="file"
                                            name="profileImage"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="btn btn-success mt-3">Update Profile</button>
                        </form>
                        {message && <div className="alert alert-success mt-3">{message}</div>}
                        {error && <div className="alert alert-danger mt-3">Error: {error}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientProfile;
