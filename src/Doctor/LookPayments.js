import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DoctorDashboard from './DoctorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const LookPayments = () => {
    const [payments, setPayments] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const res = await axios.get('https://sdp-2200030709-production.up.railway.app/getMyPayments', {
                    withCredentials: true,
                });
                setPayments(res.data);
            } catch (err) {
                console.error('Error fetching payments:', err);
                setError('An error occurred while fetching payment data.');
            }
        };

        fetchPayments();
    }, []);

    return (
        <div className="dashboard-container d-flex">
            <DoctorDashboard />
            <div className="container" style={{marginTop:'100px'}}>
                <div className="row">
                    <div className="col-12">
                        <div className="card shadow-lg">
                            <div className="card-header text-center bg-secondary bg-gradient text-white">
                                <h3>Payment Details</h3>
                            </div>
                            <div className="card-body">
                                {error && <div className="alert alert-danger">{error}</div>}
                                {payments.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead className="table-light">
                                                <tr>
                                                    <th>Patient Name</th>
                                                    <th>Amount (₹)</th>
                                                    <th>Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payments.map((payment) => (
                                                    <tr key={payment.id} className="hover-row">
                                                        <td>{payment.appointment.patient.firstName} {payment.appointment.patient.lastName}</td>
                                                        <td>{payment.amount.toFixed(2)}</td>
                                                        <td>
                                                            <span
                                                                className={`badge ${payment.isPaid ? 'bg-success' : 'bg-danger'}`}
                                                            >
                                                                {payment.isPaid ? 'Paid' : 'Not Paid'}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <div className="alert alert-info text-center">No payments found.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LookPayments;
