import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './AdminDashboard';

const AdminHomepage = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [patientsRes, doctorsRes, appointmentsRes] = await Promise.all([
                    fetch('https://sdp-2200030709-production.up.railway.app/getTotalPatients'),
                    fetch('https://sdp-2200030709-production.up.railway.app/getTotalDoctor'),
                    fetch('https://sdp-2200030709-production.up.railway.app/getTotalAppointment'),
                ]);

                if (!patientsRes.ok || !doctorsRes.ok || !appointmentsRes.ok) {
                    throw new Error('Failed to fetch statistics');
                }

                const totalPatients = await patientsRes.json();
                const totalDoctors = await doctorsRes.json();
                const totalAppointments = await appointmentsRes.json();

                setStats({
                    totalPatients,
                    totalDoctors,
                    totalAppointments,
                });
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="dashboard-container d-flex">
            <AdminDashboard />
            <div className="container" style={{ marginTop: 75 }}>
                <div className="alert alert-primary text-center shadow-sm">
                    <h2>Admin Home Page</h2>
                    <p>Welcome to the admin portal. Manage and update patients, doctors, and appointments efficiently!</p>
                </div>

                <div className="row text-center mb-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white">
                                <h6>Total Patients</h6>
                            </div>
                            <div className="card-body">
                                <h3>{stats.totalPatients}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-warning text-white">
                                <h6>Total Doctors</h6>
                            </div>
                            <div className="card-body">
                                <h3>{stats.totalDoctors}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-info text-white">
                                <h6>Total Appointments</h6>
                            </div>
                            <div className="card-body">
                                <h3>{stats.totalAppointments}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminHomepage;
