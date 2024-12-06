import React, { useState, useEffect } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await axios.get('http://localhost:9999/getPatientDetails', {
          withCredentials: true,
        });
        setPatientId(res.data.id);
      } catch (error) {
        setError('Error fetching patient details. Please try again later.');
        console.error('Error fetching patient details:', error);
      }
    };

    fetchPatientDetails();
  }, []);

  useEffect(() => {
    if (patientId) {
      const fetchAppointments = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await axios.get(
            `http://localhost:9999/getappointments/${patientId}`
          );
          setAppointments(response.data || []);
        } catch (error) {
          setError('Error fetching appointments. Please try again later.');
          console.error('Error fetching appointments:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    }
  }, [patientId]);

  const handleChatOpen = (doctorEmail) => {
    setSelectedDoctorEmail(doctorEmail);
  };

  const handleRatingSubmit = async (appointmentId) => {
    try {
      const rating = ratings[appointmentId];
      const ratingDescription = ratingDescriptions[appointmentId];

      if (!rating || rating < 1 || rating > 5) {
        alert('Please provide a valid rating between 1 and 5.');
        return;
      }
      if (!ratingDescription) {
        alert('Please provide a description for your rating.');
        return;
      }

      await axios.put(
        `http://localhost:9999/ratebyPatient/${appointmentId}`,
        {
          rating: parseInt(rating, 10),
          ratingDescription: ratingDescription.trim(),
        },
        { withCredentials: true }
      );

      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert(error.response?.data || 'Error submitting rating');
    }
  };

  const handleStarRating = (appointmentId, star) => {
    setRatings({
      ...ratings,
      [appointmentId]: star,
    });
  };

  const handleDescriptionChange = (appointmentId, event) => {
    setRatingDescriptions({
      ...ratingDescriptions,
      [appointmentId]: event.target.value,
    });
  };

  const handleCancelAppointment = async (appointmentId) => {
    try {
      const response = await axios.delete(
        `http://localhost:9999/cancleApointment/${appointmentId}`
      );
      alert(response.data);
      setAppointments((prev) =>
        prev.filter((appointment) => appointment.id !== appointmentId)
      );
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Failed to cancel appointment. Try again.');
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />
      <div className="container" style={{ marginTop: 100 }}>
        <h2 className="text-center mb-4">My Appointments</h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : appointments.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No appointments found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Doctor Name</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  
                  <th>Post Queries</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => (
                  <tr key={index}>
                    <td>{appointment.doctor.name}</td>
                    <td>
                      {new Date(appointment.date).toLocaleDateString('en-GB')}
                    </td>
                    <td>{appointment.timeSlot}</td>
                    
                    <td>
                      <button
                        className="btn btn-link ml-2"
                        onClick={() => handleChatOpen(appointment.doctor.email)}
                      >
                        Chat with Doctor
                      </button>
                    </td>
                    <td>{appointment.status}</td>
                    <td>
                      {appointment.isCompleted ? (
                        <a
                          href={appointment.appointmentUrl}
                          className="btn btn-success"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Join Virtual Appointment
                        </a>
                      ) : (
                        <button
                          className="btn btn-danger"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancel Appointment
                        </button>
                      )}
                    </td>
                    <td>
                      {appointment.isCompleted && !appointment.rating ? (
                        <div>
                          <button
                            className="btn btn-warning mb-2"
                            onClick={() => setCurrentlyRating(appointment.id)}
                          >
                            Rate
                          </button>
                          {currentlyRating === appointment.id && (
                            <div>
                              <div className="star-rating mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    onClick={() =>
                                      handleStarRating(appointment.id, star)
                                    }
                                    style={{
                                      cursor: 'pointer',
                                      color:
                                        ratings[appointment.id] >= star
                                          ? 'gold'
                                          : 'gray',
                                    }}
                                  >
                                    &#9733;
                                  </span>
                                ))}
                              </div>
                              <textarea
                                value={ratingDescriptions[appointment.id] || ''}
                                onChange={(e) =>
                                  handleDescriptionChange(appointment.id, e)
                                }
                                placeholder="Describe your rating"
                                className="form-control mt-2"
                              />
                              <button
                                className="btn btn-primary mt-2"
                                onClick={() =>
                                  handleRatingSubmit(appointment.id)
                                }
                              >
                                Submit Rating
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <span>{appointment.rating || 'Not Rated'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {selectedDoctorEmail && <Chat user2={selectedDoctorEmail} />}
    </div>
  );
};

export default MyAppointments;
