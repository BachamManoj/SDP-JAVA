import React, { useEffect, useState } from "react";
import DoctorDashboard from "./DoctorDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import api from "../api/apiClient";

const Feedback = () => {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await api.get("/viewMyFeedback");
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Unable to load feedback. Please try again.");
      }
    };

    fetchFeedback();
  }, []);

  const renderStars = (rating) => {
    if (rating == null) return "Not Rated";

    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;

    return (
      <>
        {[...Array(full)].map((_, i) => (
          <i key={`full-${i}`} className="fa fa-star text-warning"></i>
        ))}
        {[...Array(half)].map((_, i) => (
          <i key={`half-${i}`} className="fa fa-star-half-o text-warning"></i>
        ))}
        {[...Array(empty)].map((_, i) => (
          <i key={`empty-${i}`} className="fa fa-star-o text-muted"></i>
        ))}
      </>
    );
  };

  return (
    <div className="dashboard-container d-flex">
      <DoctorDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
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
                    {appointments.map((appt) => (
                      <tr key={appt.id}>
                        <td>
                          {appt.patient.firstName} {appt.patient.lastName}
                        </td>

                        <td>{new Date(appt.date).toLocaleDateString()}</td>

                        <td>{renderStars(appt.rating)}</td>

                        <td>{appt.ratingDescription || "No feedback provided"}</td>

                        <td>
                          <span
                            className={`badge ${
                              appt.isCompleted ? "bg-success" : "bg-warning"
                            }`}
                          >
                            {appt.isCompleted ? "Completed" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info text-center">
                No feedback available.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;
