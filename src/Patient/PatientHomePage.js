import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import PatientDashboard from "./PatientDashboard";
import "bootstrap/dist/css/bootstrap.min.css";

const PatientHomePage = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await api.get("/getPatientDetails", { withCredentials: true });
        setPatient(res.data);

        const appointmentsRes = await api.get(`/getappointments/${res.data.id}`, {
          withCredentials: true,
        });

        const now = new Date();
        const upcoming = appointmentsRes.data.filter(
          (a) => new Date(a.date) > now
        );
        setAppointments(upcoming);

        const billsRes = await api.get("/getPatientBillings", {
          withCredentials: true,
        });

        setPendingBills(billsRes.data.filter((bill) => !bill.isPaid));
      } catch (error) {
        console.error("Error loading patient data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
        <h2 className="mb-4">Patient Dashboard</h2>

        {loading && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        {patient && (
          <div className="alert alert-info">
            <h4>
              Welcome, {patient.firstName} {patient.lastName}
            </h4>
          </div>
        )}

        {/* Quick Links */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div
              className="card text-white bg-primary mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/patientRecordsbyPatient")}
            >
              <div className="card-body">
                <h5 className="card-title">Reports</h5>
                <p>View all your medical reports.</p>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div
              className="card text-white bg-success mb-3"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/MyEPrescription")}
            >
              <div className="card-body">
                <h5 className="card-title">EPrescription</h5>
                <p>Access your prescriptions anytime.</p>
              </div>
            </div>
          </div>
        </div>

        {!loading && (
          <>
            {/* Upcoming Appointments */}
            <h3 className="mt-4">Upcoming Appointments</h3>

            {appointments.length > 0 ? (
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Appointment ID</th>
                    <th>Doctor Name</th>
                    <th>Appointment Date</th>
                    <th>Time Slot</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((a) => (
                    <tr key={a.id}>
                      <td>{a.id}</td>
                      <td>{a.doctor.name}</td>
                      <td>{new Date(a.date).toLocaleDateString("en-GB")}</td>
                      <td>{a.timeSlot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-warning">No upcoming appointments.</div>
            )}

            {/* Pending Bills */}
            <h3 className="mt-4">Pending Bills</h3>

            {pendingBills.length > 0 ? (
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Bill ID</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBills.map((bill) => (
                    <tr key={bill.id}>
                      <td>{bill.id}</td>
                      <td>₹{bill.amount}</td>
                      <td>{new Date(bill.dueDate).toLocaleDateString("en-GB")}</td>
                      <td>
                        <span className="badge bg-danger">Pending</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-success">No pending bills.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientHomePage;
