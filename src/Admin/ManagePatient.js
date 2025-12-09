import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './AdminDashboard';
import api from "../api/apiClient";

const ManagePatient = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState("");

    /** Fetch all patients */
    const fetchPatients = async () => {
        try {
            const response = await api.get("/managePatient");
            setPatients(response.data);
        } catch (err) {
            console.error("Error fetching patients:", err);
            setError("Unable to fetch patient data. Please try again later.");
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    /** Delete patient by ID */
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this patient?")) return;

        try {
            await api.delete(`/managePatient/${id}`);
            setPatients((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            console.error("Error deleting patient:", err);
            setError("Unable to delete patient. Please try again later.");
        }
    };

    return (
        <div className="dashboard-container d-flex">
            <AdminDashboard />

            <div className="container" style={{ marginTop: 75 }}>
                <div className="alert alert-primary text-center shadow-sm">
                    <h2>Manage Patients</h2>
                    <p>View, manage, and delete patient records easily.</p>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <table className="table table-bordered table-striped shadow-sm">
                    <thead className="thead-dark">
                        <tr>
                            <th>ID</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Gender</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {patients.length > 0 ? (
                            patients.map((patient) => (
                                <tr key={patient.id}>
                                    <td>{patient.id}</td>
                                    <td>{patient.firstName}</td>
                                    <td>{patient.lastName}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.email}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(patient.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center">
                                    No patients found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagePatient;
