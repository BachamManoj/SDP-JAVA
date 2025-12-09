import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Navbar from './Navbar';
import api from '../api/apiClient';
import { Link } from 'react-router-dom';
import './Doctor.css';

const Doctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const specializations = [
    { id: 1, name: "Cardiology" },
    { id: 2, name: "Dermatology" },
    { id: 3, name: "Neurology" },
    { id: 4, name: "Pediatrics" },
    { id: 5, name: "Orthopedics" },
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await api.get('/getAllDoctorsList');
        setDoctors(res.data);
        setFilteredDoctors(res.data);
      } catch {
        setError("Failed to fetch doctor data.");
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const fetchDoctorsBySpecialization = useCallback(async () => {
    if (selectedSpecialization === "All") {
      setFilteredDoctors(doctors);
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/getbyspecialty', selectedSpecialization, {
        headers: { 'Content-Type': 'text/plain' }
      });
      setFilteredDoctors(res.data.length > 0 ? res.data : []);
    } catch {
      setError("Failed to fetch doctor data for this specialization.");
    } finally {
      setLoading(false);
    }
  }, [selectedSpecialization, doctors]);

  useEffect(() => {
    fetchDoctorsBySpecialization();
  }, [selectedSpecialization, fetchDoctorsBySpecialization]);

  const handleAppointment = async (doctor) => {
    try {
      setSelectedDoctor(doctor);
      const imgRes = await api.get(`/Doctorprofile/${doctor.id}/image`, {
        responseType: 'blob'
      });
      setProfileImage(URL.createObjectURL(imgRes.data));
    } catch {
      setProfileImage(null);
    } finally {
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="container-fluid">
      <Navbar />
      <h1 className="text-center mb-4 text-primary">Select a Doctor by Specialization</h1>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
          <p>Loading doctors...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <>
          <div className="row justify-content-center mb-4">
            <div className="col-md-6">
              <select
                className="form-select form-select-lg"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="All">All Specializations</option>
                {specializations.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor) => (
                    <tr key={doctor.id}>
                      <td>{doctor.name}</td>
                      <td>{doctor.specialization}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          onClick={() => handleAppointment(doctor)}
                          className="w-100"
                        >
                          Book Appointment
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center">
                      No doctors available for this specialization.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="text-white">
          <Modal.Title>Book an Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor && (
            <>
              {profileImage && (
                <div className="text-center mb-3">
                  <img
                    src={profileImage}
                    alt="Doctor"
                    className="rounded-circle"
                    style={{ width: 150, height: 150, objectFit: 'cover' }}
                  />
                </div>
              )}
              <p><strong>Doctor:</strong> {selectedDoctor.name}</p>
              <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
              <h4>Please login to book an appointment.</h4>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button>
            <Link className="nav-link" to="/patientlogin">Login</Link>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Doctor;
