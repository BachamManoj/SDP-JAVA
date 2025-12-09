import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";
import api from "../api/apiClient";

const ViewPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ----------------------------
  // Fetch Accepted E-Prescription Payments
  // ----------------------------
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/viewAcceptedEPrescription");
        setPayments(res.data || []);
      } catch (err) {
        console.error("Error fetching payment data:", err);
        setError("Failed to load payment information.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="dashboard-container d-flex">
      <PharmacistDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
        <h2 className="text-center mb-4">E-Prescription Payments</h2>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="alert alert-danger text-center">{error}</div>
        )}

        {/* Payments Table */}
        {!loading && !error && payments.length > 0 && (
          <table className="table table-bordered table-striped shadow-sm">
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
                  <td>{payment.appointment?.id || "N/A"}</td>
                  <td>₹{payment.amount?.toFixed(2) || "0.00"}</td>

                  <td>
                    {payment.paymentDate
                      ? new Date(payment.paymentDate).toLocaleString()
                      : "N/A"}
                  </td>

                  <td>{payment.paymentMethod || "N/A"}</td>

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
        )}

        {/* No Payments */}
        {!loading && !error && payments.length === 0 && (
          <div className="alert alert-warning text-center">
            No payments found for accepted e-prescriptions.
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPayments;
