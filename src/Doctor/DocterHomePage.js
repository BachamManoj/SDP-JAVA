import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorDashboard from './DoctorDashboard';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const DoctorHomePage = () => {
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDoctorDetailsAndAppointments = async () => {
            try {
                // Fetch doctor details
                const doctorResponse = await axios.get('http://localhost:9999/getDoctorDetails', {
                    withCredentials: true,
                });
                setDoctor(doctorResponse.data);

                // Fetch and filter upcoming appointments
                const appointmentsResponse = await axios.get(
                    `http://localhost:9999/getPatientAppointments/${doctorResponse.data.id}`,
                    {
                        withCredentials: true,
                    }
                );
                
                // Get current date for filtering (ignore time part)
                const currentDate = new Date().setHours(0, 0, 0, 0);
                
                // Filter appointments for those after the current date
                const upcomingAppointments = appointmentsResponse.data.filter(appointment => {
                    const appointmentDate = new Date(appointment.date).setHours(0, 0, 0, 0);
                    return appointmentDate >= currentDate; // Filter for future appointments
                });

                // Sort appointments by date
                const sortedAppointments = upcomingAppointments.sort(
                    (a, b) => new Date(a.date) - new Date(b.date)
                );
                setAppointments(sortedAppointments);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('An error occurred while fetching data');
            }
        };

        fetchDoctorDetailsAndAppointments();
    }, []);

    return (
        <div className="dashboard-container d-flex">
            <DoctorDashboard />
            <div className="container" style={{ marginTop: '100px' }}>
                {error && <div className="alert alert-danger">{error}</div>}
                {doctor ? (
                    <>
                        <div className="alert alert-primary">
                            <h2>Welcome, Dr. {doctor.name}</h2>
                        </div>
                        <div className="row" style={{ marginTop: '50px' }}>
                            {/* Cards Section */}
                            <div className="col-md-6 col-lg-3 mb-4">
                                <div className="card text-center h-100 shadow-lg rounded-3">
                                    <div className="card-body">
                                        <h5 className="card-title">Post Records</h5>
                                        <p className="card-text">Add medical records for patients.</p>
                                        <Link to="/postReportsData" className="btn btn-primary">
                                            Go to Post Records
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3 mb-4">
                                <div className="card text-center h-100 shadow-lg rounded-3">
                                    <div className="card-body">
                                        <h5 className="card-title">View Patient Records</h5>
                                        <p className="card-text">Access detailed records of your patients.</p>
                                        <Link to="/patientRecordsbyDocter" className="btn btn-success">
                                            View Records
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3 mb-4">
                                <div className="card text-center h-100 shadow-lg rounded-3">
                                    <div className="card-body">
                                        <h5 className="card-title">Virtual Consultation</h5>
                                        <p className="card-text">Host or join virtual consultations.</p>
                                        <Link to="/mySchedule" className="btn btn-warning">
                                            Start Consultation
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-3 mb-4">
                                <div className="card text-center h-100 shadow-lg rounded-3">
                                    <div className="card-body">
                                        <h5 className="card-title">E-Prescription</h5>
                                        <p className="card-text">Provide electronic prescriptions to patients.</p>
                                        <Link to="/mySchedule" className="btn btn-info">
                                            Provide Prescription
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Appointments Section */}
                        <div className="mt-5">
                            <h3 className="mb-4">Upcoming Appointments</h3>
                            {appointments.length > 0 ? (
                                <div className="table-responsive">
                                    <table className="table table-bordered table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Patient Name</th>
                                                <th>Appointment Date</th>
                                                <th>Time Slot</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((appointment) => (
                                                <tr key={appointment.id}>
                                                    <td>{appointment.patient.firstName}</td>
                                                    <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                                    <td>{appointment.timeSlot}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="alert alert-info">No upcoming appointments found.</div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="alert alert-warning">Loading doctor details...</div>
                )}
            </div>
        </div>
    );
};

export default DoctorHomePage;
