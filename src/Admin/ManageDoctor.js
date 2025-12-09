import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './AdminDashboard';
import api from '../api/apiClient';

const ManageDoctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [showAddDoctor, setShowAddDoctor] = useState(false);
    const [doctor, setDoctor] = useState({
        name: '',
        specialization: '',
        contactNumber: '',
        email: '',
        password: '',
        fee: '',
    });
    const [profileImage, setProfileImage] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const specialties = [
        { id: 1, name: "Cardiology" },
        { id: 2, name: "Dermatology" },
        { id: 3, name: "Neurology" },
        { id: 4, name: "Pediatrics" },
        { id: 5, name: "Orthopedics" },
    ];

    /** Fetch all doctors */
    const fetchDoctors = async () => {
        try {
            const response = await api.get("/manageDoctors");
            setDoctors(response.data);
        } catch (err) {
            console.error("Error fetching doctors:", err);
        }
    };

    useEffect(() => {
        fetchDoctors();
    }, []);

    /** Handle text inputs */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor((prev) => ({ ...prev, [name]: value }));
    };

    /** Handle image upload */
    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    /** Add new doctor */
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("doctor", new Blob([JSON.stringify(doctor)], { type: "application/json" }));
        if (profileImage) formData.append("profileImage", profileImage);

        try {
            const response = await api.post("/addDoctor", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(response.data);
            setError("");
            setDoctor({
                name: "",
                specialization: "",
                contactNumber: "",
                email: "",
                password: "",
                fee: "",
            });
            setProfileImage(null);
            setShowAddDoctor(false);
            fetchDoctors();
        } catch (err) {
            setMessage("");
            setError(err.response?.data || "Failed to add doctor.");
        }
    };

    /** Delete a doctor */
    const handleDelete = async (doctorId) => {
        if (!window.confirm("Are you sure you want to delete this doctor?")) return;

        try {
            await api.delete(`/manageDoctor/${doctorId}`);
            setMessage("Doctor deleted successfully.");
            setError("");
            fetchDoctors();
        } catch (err) {
            setMessage("");
            setError("Failed to delete doctor.");
        }
    };

    return (
        <div className="dashboard-container d-flex">
            <AdminDashboard />

            <div className="container" style={{ marginTop: 75 }}>
                <h2 className="text-center mb-4">Manage Doctors</h2>

                {message && <div className="alert alert-success">{message}</div>}
                {error && <div className="alert alert-danger">{error}</div>}

                {/* Doctor List */}
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-primary text-white">
                        <h5>All Doctors</h5>
                    </div>

                    <div className="card-body">
                        {doctors.length > 0 ? (
                            <table className="table table-striped">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Specialization</th>
                                        <th>Contact</th>
                                        <th>Fee</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {doctors.map((doc, index) => (
                                        <tr key={doc.id}>
                                            <td>{index + 1}</td>
                                            <td>{doc.name}</td>
                                            <td>{doc.specialization}</td>
                                            <td>{doc.contactNumber}</td>
                                            <td>{doc.fee}</td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(doc.id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p>No doctors available.</p>
                        )}
                    </div>
                </div>

                {/* Add Doctor Button */}
                {!showAddDoctor && (
                    <button
                        className="btn btn-primary mb-3"
                        onClick={() => setShowAddDoctor(true)}
                    >
                        Add Doctor
                    </button>
                )}

                {/* Add Doctor Form */}
                {showAddDoctor && (
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary text-white">
                            <h5>Add New Doctor</h5>
                        </div>

                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Doctor's Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={doctor.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Specialization</label>
                                    <select
                                        className="form-select"
                                        name="specialization"
                                        value={doctor.specialization}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>Select Specialization</option>
                                        {specialties.map((spec) => (
                                            <option key={spec.id} value={spec.name}>
                                                {spec.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Contact Number</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="contactNumber"
                                        value={doctor.contactNumber}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={doctor.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={doctor.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Consultation Fee</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        name="fee"
                                        value={doctor.fee}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">Profile Image</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={handleFileChange}
                                        accept="image/*"
                                    />
                                </div>

                                <button type="submit" className="btn btn-primary w-100">
                                    Add Doctor
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageDoctor;
