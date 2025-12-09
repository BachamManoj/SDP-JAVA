import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorDashboard from "./DoctorDashboard";
import api from "../api/apiClient";

const PatientRecords = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");

      try {
        const doctorRes = await api.get("/getDoctorDetails");
        setDoctor(doctorRes.data);

        const apptRes = await api.get("/getDoctorAppointments");

        const completed = apptRes.data
          .filter((appt) => appt.reportCompleted === true)
          .map((appt) => ({
            ...appt,
            patientId: appt.patient?.id,
            patientFirstName: appt.patient?.firstName,
          }));

        setAppointments(completed);
      } catch (err) {
        setError("Failed to fetch doctor or appointment data.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const fetchMedicalReport = async (patientId, appointmentId) => {
    try {
      setLoading(true);
      const res = await api.get(
        `/viewPatientMedicalReport/${patientId}/${appointmentId}`,
        { responseType: "arraybuffer" }
      );

      const blob = new Blob([res.data], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob), "_blank");
    } catch (err) {
      setError("Failed to fetch medical report.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <DoctorDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
        <div className="card shadow-sm">
          <div
            className="card-header text-white text-center"
            style={{ background: "#0d6efd" }}
          >
            <h2>Patient Medical Records</h2>
          </div>

          <div className="card-body">
            {loading && <div className="alert alert-info">Loading...</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            {doctor && (
              <h4 className="mb-4">
                <span className="badge bg-info">Doctor: {doctor.name}</span>
              </h4>
            )}

            <div className="table-responsive">
              {appointments.length > 0 ? (
                <table className="table table-hover table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>#</th>
                      <th>Patient Name</th>
                      <th>Patient ID</th>
                      <th>Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {appointments.map((appt, index) => (
                      <tr key={appt.id}>
                        <td>{index + 1}</td>
                        <td>{appt.patientFirstName}</td>
                        <td>{appt.patientId}</td>
                        <td>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              fetchMedicalReport(appt.patientId, appt.id)
                            }
                          >
                            View Report
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-muted">No completed reports found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRecords;
