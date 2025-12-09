import React, { useState, useEffect } from "react";
import DoctorDashboard from "./DoctorDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api/apiClient";

const PostReport = () => {
  const [doctorId, setDoctorId] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [openForm, setOpenForm] = useState(null);
  const [descriptions, setDescriptions] = useState({});
  const [viewedReport, setViewedReport] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorRes = await api.get("/getDoctorDetails");
        const id = doctorRes.data.id;
        setDoctorId(id);

        const apptRes = await api.get("getDoctorAppointments");
        setAppointments(apptRes.data);
      } catch {
        setMessage("Error loading doctor or appointment data.");
      }
    };

    loadData();
  }, []);

  const handleSubmit = async (e, appointment) => {
    e.preventDefault();

    const reportData = {
      description: descriptions[appointment.id],
      patient: { id: appointment.patient.id },
      doctor: { id: doctorId },
      appointment: { id: appointment.id },
    };

    try {
      await api.post("/createReport", reportData);
      await api.put(`/updateReport/${appointment.id}`);

      setMessage("Report saved successfully.");
      setOpenForm(null);
      setDescriptions((prev) => ({ ...prev, [appointment.id]: "" }));

      const apptRes = await api.get("/getDoctorAppointments");
      setAppointments(apptRes.data);
    } catch {
      setMessage("Error saving report.");
    }
  };

  const handleViewReport = async (appointmentId) => {
    try {
      const res = await api.get(`/viewReport/${appointmentId}`);
      setViewedReport(res.data);
      setEditDescription(res.data.description);
    } catch {
      setMessage("Error fetching report.");
    }
  };

  const handleEditSubmit = async (appointmentId) => {
    try {
      const res = await api.put(`/editDescription/${appointmentId}`, {
        description: editDescription,
      });

      setViewedReport(res.data);
      setMessage("Report updated successfully.");
    } catch {
      setMessage("Error updating report.");
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <DoctorDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
        <h2 className="mb-4 text-center">Create or Edit Medical Report</h2>
        <h4 className="mb-3">Appointments</h4>

        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <table className="table table-bordered table-striped">
            <thead>
              <tr>
                <th>Appointment ID</th>
                <th>Patient</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((appt) => (
                <React.Fragment key={appt.id}>
                  <tr>
                    <td>{appt.id}</td>
                    <td>
                      {appt.patient.firstName} {appt.patient.lastName}
                    </td>
                    <td>{new Date(appt.date).toLocaleString()}</td>

                    <td>
                      {appt.reportCompleted ? (
                        <button
                          className="btn btn-secondary"
                          onClick={() => handleViewReport(appt.id)}
                        >
                          View Report
                        </button>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            setViewedReport(null);
                            setOpenForm(appt.id);
                          }}
                        >
                          Post Report
                        </button>
                      )}
                    </td>
                  </tr>

                  {openForm === appt.id && !appt.reportCompleted && (
                    <tr>
                      <td colSpan="4">
                        <div className="mt-3">
                          <h5>Enter Report for Appointment {appt.id}</h5>

                          <form onSubmit={(e) => handleSubmit(e, appt)}>
                            <textarea
                              className="form-control"
                              rows="4"
                              value={descriptions[appt.id] || ""}
                              onChange={(e) =>
                                setDescriptions((prev) => ({
                                  ...prev,
                                  [appt.id]: e.target.value,
                                }))
                              }
                              required
                            />

                            <button type="submit" className="btn btn-success mt-2">
                              Submit Report
                            </button>

                            <button
                              type="button"
                              className="btn btn-danger mt-2 ms-2"
                              onClick={() => setOpenForm(null)}
                            >
                              Cancel
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  )}

                  {viewedReport &&
                    viewedReport.appointment?.id === appt.id &&
                    appt.reportCompleted && (
                      <tr>
                        <td colSpan="4">
                          <div className="mt-3">
                            <h5>Report for Appointment {appt.id}</h5>
                            <p>{viewedReport.description}</p>

                            <h5>Edit Report</h5>
                            <textarea
                              className="form-control"
                              rows="4"
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />

                            <button
                              className="btn btn-warning mt-2"
                              onClick={() => handleEditSubmit(appt.id)}
                            >
                              Save Changes
                            </button>

                            <button
                              className="btn btn-danger mt-2 ms-2"
                              onClick={() => setViewedReport(null)}
                            >
                              Hide
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}

        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
};

export default PostReport;
