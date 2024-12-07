import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './AdminDashboard';

const ManagePatient = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');

    // Fetch all patients
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await fetch('http://localhost:9999/managePatient');
                if (!response.ok) {
                    throw new Error('Failed to fetch patients');
                }
                const data = await response.json();
                setPatients(data);
            } catch (err) {
                console.error(err);
                setError('Unable to fetch patient data. Please try again later.');
            }
        };

        fetchPatients();
    }, []);

    // Delete a patient by ID
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this patient?')) return;

        try {
            const response = await fetch(`http://localhost:9999/managePatient/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete patient');
            }
            setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== id));
        } catch (err) {
            console.error(err);
            setError('Unable to delete patient. Please try again later.');
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
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
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
