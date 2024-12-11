import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch payments data from the backend
    axios
      .get("https://sdp-2200030709-production.up.railway.app/viewAcceptedEPrescription")
      .then((response) => {
        setPayments(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching payment data:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="dashboard-container d-flex">
        <PharmacistDashboard />
        <div className="container" style={{marginTop:'100px'}}>
        <h2 className="text-center mb-4">E-Prescription Payments</h2>
        {loading ? (
            <div className="text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            </div>
        ) : payments.length > 0 ? (
            <table className="table table-bordered table-striped">
            <thead className="table-primary">
                <tr>
                <th>#</th>
                <th>Appointment ID</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Payment Method</th>
                <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {payments.map((payment, index) => (
                <tr key={payment.id}>
                    <td>{index + 1}</td>
                    <td>{payment.appointment.id}</td>
                    <td>₹{payment.amount.toFixed(2)}</td>
                    <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                    <td>{payment.paymentMethod}</td>
                    <td>
                    <span
                        className={`badge ${
                        payment.isPaid ? "bg-success" : "bg-danger"
                        }`}
                    >
                        {payment.isPaid ? "Paid" : "Pending"}
                    </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <div className="alert alert-warning text-center">
            No payments found for accepted e-prescriptions.
            </div>
        )}
        </div>
    </div>
  );
};

export default ViewPayments;
