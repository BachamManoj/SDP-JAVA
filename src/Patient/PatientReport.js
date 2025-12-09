import React, { useState, useEffect } from "react";
import api from "../api/apiClient";    // ✅ Use centralized axios with JWT
import PatientDashboard from "./PatientDashboard";

const PatientReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);
  const [error, setError] = useState(null);

  const BASE_URL = api.defaults.baseURL;   // ❤️ No hardcoding

  // ---------------------------------------------------
  // FETCH PATIENT DETAILS (JWT protected)
  // ---------------------------------------------------
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await api.get("/getPatientDetails");
        setPatient(res.data);
      } catch (err) {
        console.error("Error fetching patient details", err);
        setError("Failed to load patient details.");
      }
    };

    fetchPatientDetails();
  }, []);

  // ---------------------------------------------------
  // FETCH COMPLETED APPOINTMENTS
  // ---------------------------------------------------
  useEffect(() => {
    if (!patient) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/getappointments/${patient.id}`);

        // Filter completed appointments with report
        const completedAppointments = res.data.filter(
          (appt) => appt.reportCompleted
        );

        setAppointments(completedAppointments);
      } catch (err) {
        console.error("Error fetching appointments", err);
        setError("Unable to fetch appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patient]);

  // ---------------------------------------------------
  // FETCH MEDICAL REPORT PDF
  // ---------------------------------------------------
  const fetchReport = async (appointmentId, doctorId) => {
    try {
      const res = await api.get(
        `/viewPatientMedicalReportbyPatient/${appointmentId}/${doctorId}`,
        { responseType: "arraybuffer" }       // needed for PDF
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");
    } catch (err) {
      console.error("Error fetching medical report", err);
      alert("Failed to load report. Try again later.");
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
        <h2 className="mb-4">Patient Medical Reports</h2>

        {/* Error */}
        {error && <div className="alert alert-danger text-center">{error}</div>}

        {/* Welcome Message */}
        {patient && !error && (
          <div className="alert alert-info">
            <h4>
              Welcome, {patient.firstName} {patient.lastName}
            </h4>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center mt-3">
            <div className="spinner-border text-primary"></div>
          </div>
        )}

        {/* Reports Table */}
        {!loading && appointments.length > 0 && (
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Appointment ID</th>
                <th>Doctor Name</th>
                <th>Appointment Date</th>
                <th>View Report</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <tr key={appt.id}>
                  <td>{appt.id}</td>
                  <td>{appt.doctor.name}</td>
                  <td>{new Date(appt.date).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => fetchReport(appt.id, appt.doctor.id)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* No reports */}
        {!loading && appointments.length === 0 && !error && (
          <div className="alert alert-warning text-center">
            No completed reports found for your appointments.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientReport;
