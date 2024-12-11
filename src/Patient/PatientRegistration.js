import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PatientRegistration.css';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const PatientRegistration = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        contactNumber: '',
        email: '',
        password: '',
        address: ''
    });
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setResponse(null);
        setError(null);

        try {
            const data = new FormData();
            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            if (image) data.append("profileImage", image);

            const res = await axios.post('https://sdp-2200030709-production.up.railway.app/patientRegistration', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setResponse(res.data);
            setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                contactNumber: '',
                email: '',
                password: '',
                address: ''
            });
            setImage(null);
            setPreviewImage(null);
        } catch (err) {
            console.error(err);
            setError('Email or Contact already exists.');
        }
    };

    return (
        <div>
            <Navbar/>
            <div className="container mt-5">
                <div className="registration-form-container card">
                    <div className="card-body">
                        <h2 className="card-title text-center mb-4">Patient Signup</h2>
                        <form onSubmit={handleSubmit}>
                        <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            className="form-control custom-input"
                                            placeholder="First Name"
                                            value={formData.firstName}
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
                                            className="form-control custom-input"
                                            placeholder="Last Name"
                                            value={formData.lastName}
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
                                            className="form-control custom-input"
                                            value={formData.dateOfBirth}
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
                                            className="form-select custom-input"
                                            value={formData.gender}
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
                                            className="form-control custom-input"
                                            placeholder="Contact Number"
                                            value={formData.contactNumber}
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
                                            className="form-control custom-input"
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Password</label>
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control custom-input"
                                            placeholder="Password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label>Address</label>
                                        <textarea
                                            name="address"
                                            className="form-control custom-input"
                                            placeholder="Address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            style={{ height: '100px' }}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                            <input type="file" onChange={handleImageChange} accept="image/*" />
                            {previewImage && (
                                <img src={previewImage} alt="Preview" style={{ maxWidth: '100px', marginTop: '10px' }} />
                            )}
                            <button type="submit" className="btn btn-primary">Register</button>
                        </form>
                        {response && <div className="alert alert-success mt-3">{response}</div>}
                        {error && <div className="alert alert-danger mt-3">Error: {error}</div>}
                        <div className="custom-additional-links">
                            <Link className="nav-link" to="/patientlogin">Already having Account? Login</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRegistration;
