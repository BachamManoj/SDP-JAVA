import React, { useState, useEffect } from 'react';
import api from "../api/apiClient";     // ✅ CENTRALIZED API
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientDashboard from './PatientDashboard';
import Chat from './Chat';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedDoctorEmail, setSelectedDoctorEmail] = useState(null);
  const [ratings, setRatings] = useState({});
  const [ratingDescriptions, setRatingDescriptions] = useState({});
  const [currentlyRating, setCurrentlyRating] = useState(null);

  // ---------------------------------------------------
  // 📌 FETCH PATIENT DETAILS
  // ---------------------------------------------------
  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await api.get("/getPatientDetails");
        setPatientId(res.data.id);
      } catch (error) {
        setError("Error fetching patient details.");
      }
    };
    fetchPatientDetails();
  }, []);

  // ---------------------------------------------------
  // 📌 FETCH PATIENT APPOINTMENTS
  // ---------------------------------------------------
  useEffect(() => {
    if (!patientId) return;

    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/getappointments/${patientId}`);
        setAppointments(res.data || []);
      } catch (err) {
        setError("Error fetching appointments.");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [patientId]);

  // ---------------------------------------------------
  // 📌 CHAT BUTTON CLICK
  // ---------------------------------------------------
  const handleChatOpen = (doctorEmail) => {
    setSelectedDoctorEmail(doctorEmail);
  };

  // ---------------------------------------------------
  // 📌 SUBMIT RATING
  // ---------------------------------------------------
  const handleRatingSubmit = async (appointmentId) => {
    try {
      const rating = ratings[appointmentId];
      const ratingDescription = ratingDescriptions[appointmentId];

      if (!rating || rating < 1 || rating > 5)
        return alert("Give rating between 1 to 5");

      if (!ratingDescription)
        return alert("Enter rating description");

      await api.put(`/ratebyPatient/${appointmentId}`, {
        rating,
        ratingDescription,
      });

      alert("Rating submitted!");
    } catch (error) {
      alert("Error submitting rating");
    }
  };

  // ---------------------------------------------------
  // 📌 CANCEL APPOINTMENT
  // ---------------------------------------------------
  const handleCancelAppointment = async (appointmentId) => {
    try {
      const res = await api.delete(`/cancleApointment/${appointmentId}`);
      alert(res.data);

      setAppointments((prev) =>
        prev.filter((a) => a.id !== appointmentId)
      );
    } catch (error) {
      alert("Failed to cancel appointment");
    }
  };

  // ---------------------------------------------------
  // 📌 UI
  // ---------------------------------------------------
  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />

      <div className="container" style={{ marginTop: 100 }}>
        <h2 className="text-center mb-4">My Appointments</h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : appointments.length === 0 ? (
          <div className="alert alert-info">No appointments found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Chat</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Rating</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((a, index) => (
                  <tr key={index}>
                    <td>{a.doctor.name}</td>
                    <td>{new Date(a.date).toLocaleDateString("en-GB")}</td>
                    <td>{a.timeSlot}</td>

                    {/* Chat */}
                    <td>
                      <button
                        className="btn btn-link"
                        onClick={() => handleChatOpen(a.doctor.email)}
                      >
                        Chat
                      </button>
                    </td>

                    <td>{a.status}</td>

                    {/* Join Call / Cancel */}
                    <td>
                      {a.isCompleted ? (
                        <a
                          href={a.appointmentUrl}
                          className="btn btn-success"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Call
                        </a>
                      ) : (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelAppointment(a.id)}
                        >
                          Cancel
                        </button>
                      )}
                    </td>

                    {/* Rating Section */}
                    <td>
                      {a.isCompleted && !a.rating ? (
                        <div>
                          <button
                            className="btn btn-warning mb-2"
                            onClick={() => setCurrentlyRating(a.id)}
                          >
                            Rate
                          </button>

                          {currentlyRating === a.id && (
                            <div>
                              {/* Stars */}
                              <div className="star-rating mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    onClick={() =>
                                      setRatings({ ...ratings, [a.id]: star })
                                    }
                                    style={{
                                      cursor: "pointer",
                                      color:
                                        ratings[a.id] >= star ? "gold" : "gray",
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>

                              {/* Description */}
                              <textarea
                                className="form-control"
                                placeholder="Describe your rating"
                                value={ratingDescriptions[a.id] || ""}
                                onChange={(e) =>
                                  setRatingDescriptions({
                                    ...ratingDescriptions,
                                    [a.id]: e.target.value,
                                  })
                                }
                              />

                              <button
                                className="btn btn-primary mt-2"
                                onClick={() => handleRatingSubmit(a.id)}
                              >
                                Submit
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>{a.rating || "Not Rated"}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chat Component */}
      {selectedDoctorEmail && <Chat user2={selectedDoctorEmail} />}
    </div>
  );
};

export default MyAppointments;
