import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DoctorDashboard from './DoctorDashboard';
import PrescriptionForm from './PrescriptionForm';
import FetchEPrescriptions from './FetchEPrescriptions';
import DoctorChat from './DoctorChat';
import { useNavigate } from 'react-router-dom';

const MyPatients = () => {
  const [patients, setPatients] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showEPrescription, setShowEPrescription] = useState(null);
  const [selectedPatientEmail, setSelectedPatientEmail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const doctorResponse = await axios.get('http://localhost:9999/getDoctorDetails', {
          withCredentials: true,
        });

        if (doctorResponse.data) {
          setDoctor(doctorResponse.data);
          const appointmentsResponse = await axios.get(
            `http://localhost:9999/getPatientAppointments/${doctorResponse.data.id}`
          );
          setPatients(appointmentsResponse.data || []);
        }
      } catch (error) {
        setError('Error fetching doctor or patient data.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, []);

  const handlePrescriptionClick = (patient) => {
    if (patient?.id && patient.patient?.id && doctor?.id) {
      const prescriptionDetails = {
        appointmentId: patient.id,
        patientId: patient.patient.id,
        doctorId: doctor.id,
        patientEmail: patient.patient.email,
      };
      setSelectedPatient(prescriptionDetails);
      setShowPrescriptionForm(true);
    } else {
      console.error('Missing required data for prescription.');
      alert('Unable to provide prescription. Required details are missing.');
    }
  };

  const handleChatClick = (email) => {
    setSelectedPatientEmail(email);
  };

  const handleVideoCallClick = (appointmentId) => {
    navigate('/onlineVideoCall', { state: { appointmentID: appointmentId } });
  };

  return (
    <div className="dashboard-container d-flex" style={{ height: '100vh' }}>
      <DoctorDashboard />
      <div className="container" style={{ marginTop: 100, flex: 1 }}>
        <h2 className="text-center mb-4">My Patients</h2>

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
        ) : patients.length === 0 ? (
          <div className="alert alert-info" role="alert">
            No patients found.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover table-striped">
              <thead className="thead-dark">
                <tr>
                  <th>Patient Name</th>
                  <th>Appointment Date</th>
                  <th>Time Slot</th>
                  <th>Virtual Appointment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <React.Fragment key={index}>
                    <tr>
                      <td>{patient.patient.firstName}</td>
                      <td>{new Date(patient.date).toLocaleDateString('en-CA')}</td>
                      <td>{patient.timeSlot}</td>
                      <td>{patient.isCompleted ? 'Yes' : 'No'}</td>
                      <td>
                        {patient.isCompleted ? (
                          <>
                            <button
                              className="btn btn-primary me-2"
                              onClick={() => handlePrescriptionClick(patient)}
                            >
                              Provide Prescription
                            </button>
                            <button
                              className="btn btn-secondary"
                              onClick={() =>
                                setShowEPrescription(
                                  showEPrescription === patient.id ? null : patient.id
                                )
                              }
                            >
                              {showEPrescription === patient.id ? 'Hide' : 'Show'}
                            </button>
                            <button
                              className="btn btn-link"
                              onClick={() => handleChatClick(patient.patient.email)}
                            >
                              Chat
                            </button>
                          </>
                        ) : (
                          <span className="text-warning">
                            Complete the consultation to enable additional options.
                          </span>
                        )}
                        {!patient.isCompleted && (
                          <button
                            className="btn btn-success ms-2"
                            onClick={() => handleVideoCallClick(patient.id)}
                          >
                            Start Video Call
                          </button>
                        )}
                      </td>
                    </tr>
                    {showEPrescription === patient.id && (
                      <tr>
                        <td colSpan="5">
                          <FetchEPrescriptions appointmentId={patient.id} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showPrescriptionForm && selectedPatient && (
        <div className="prescription-modal">
          <PrescriptionForm
            selectedPatient={selectedPatient}
            onClose={() => setShowPrescriptionForm(false)}
          />
        </div>
      )}

      {selectedPatientEmail && (
        <div
          style={{
            flex: 0.55,
            minHeight: '100vh',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <DoctorChat receiver={selectedPatientEmail} />
        </div>
      )}
    </div>
  );
};

export default MyPatients;
