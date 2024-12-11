import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorDashboard from './DoctorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome icons

const Feedback = () => {
    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await axios.get('https://sdp-2200030709-production.up.railway.app/viewMyFeedback', {
                    withCredentials: true,
                });
                setAppointments(res.data);
            } catch (err) {
                console.error('Error fetching feedback:', err);
                setError('An error occurred while fetching feedback.');
            }
        };

        fetchFeedback();
    }, []);

    // Function to render stars based on rating
    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStars = rating % 1 >= 0.5 ? 1 : 0;
        const emptyStars = 5 - fullStars - halfStars;

        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <i key={`full-${index}`} className="fa fa-star text-warning"></i>
                ))}
                {[...Array(halfStars)].map((_, index) => (
                    <i key={`half-${index}`} className="fa fa-star-half-o text-warning"></i>
                ))}
                {[...Array(emptyStars)].map((_, index) => (
                    <i key={`empty-${index}`} className="fa fa-star-o text-muted"></i>
                ))}
            </>
        );
    };

    return (
        <div className="dashboard-container d-flex">
            <DoctorDashboard />
            <div className="container" style={{ marginTop: '100px' }}>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-lg">
                            <div className="card-header text-center bg-info text-white">
                                <h3>Patient Feedback</h3>
                            </div>
                            <div className="card-body">
                                {error && <div className="alert alert-danger">{error}</div>}
                                {appointments.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Patient Name</th>
                                                    <th>Appointment Date</th>
                                                    <th>Rating</th>
                                                    <th>Feedback</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointments.map((appointment) => (
                                                    <tr key={appointment.id}>
                                                        <td>{appointment.patient.firstName} {appointment.patient.lastName}</td>
                                                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                                        <td>
                                                            {appointment.rating != null ? (
                                                                <div>{renderStars(appointment.rating)}</div>
                                                            ) : (
                                                                'Not Rated'
                                                            )}
                                                        </td>
                                                        <td>{appointment.ratingDescription || 'No feedback provided'}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${
                                                                    appointment.isCompleted ? 'bg-success' : 'bg-warning'
                                                                }`}
                                                            >
                                                                {appointment.isCompleted ? 'Completed' : 'Pending'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center">No feedback available.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
