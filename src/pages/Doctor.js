import React, { useState, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Spinner } from 'react-bootstrap';
import Navbar from './Navbar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Doctor.css'

const Doctor = () => {
  const [doctors, setDoctors] = useState([]); // All doctors
  const [filteredDoctors, setFilteredDoctors] = useState([]); // Doctors to display based on specialty filter
  const [selectedSpecialization, setSelectedSpecialization] = useState("All"); // Selected specialty
  const [showModal, setShowModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

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
        const res = await axios.get('http://localhost:9999/getAllDoctorsList', {}, { withCredentials: true });
        setDoctors(res.data);
        setFilteredDoctors(res.data); // Initially display all doctors
        setLoading(false);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setError("Failed to fetch doctor data.");
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // Filter doctors based on selected specialization
  const fetchDoctorsBySpecialization = useCallback(async () => {
    if (selectedSpecialization === "All") {
      setFilteredDoctors(doctors); // Show all doctors if no specialty is selected
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:9999/getbyspecialty',
        selectedSpecialization,
        { headers: { 'Content-Type': 'text/plain' } },
        { withCredentials: true }
      );

      if (res.data.length > 0) {
        setFilteredDoctors(res.data);
      } else {
        setFilteredDoctors([]); // No doctors found for this specialization
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching doctors by specialization:", err);
      setError("Failed to fetch doctor data for this specialization.");
      setLoading(false);
    }
  }, [selectedSpecialization, doctors]);

  // Trigger doctor fetch when specialization changes
  useEffect(() => {
    fetchDoctorsBySpecialization();
  }, [selectedSpecialization, fetchDoctorsBySpecialization]);

  const handleAppointment = async (doctor) => {
    try {
      setSelectedDoctor(doctor);
      const imageRes = await axios.get(
        `http://localhost:9999/Doctorprofile/${doctor.id}/image`,
        {
          responseType: 'blob', 
          withCredentials: true, 
        }
      );
      setProfileImage(URL.createObjectURL(imageRes.data));
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching doctor's profile image:", error);
      setProfileImage(null); 
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
          <Spinner animation="border" variant="primary" />
          <p>Loading doctors...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        <>
          {/* Specialty Filter Dropdown */}
          <div className="row justify-content-center mb-4">
            <div className="col-md-6 col-sm-8 col-12">
              <select
                className="form-select form-select-lg"
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
              >
                <option value="All">All Specializations</option>
                {specializations.map((specialization) => (
                  <option key={specialization.id} value={specialization.name}>
                    {specialization.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Doctors Table */}
          <div className="table-responsive">
            <table className="table table-striped table-bordered table-hover">
              <thead>
                <tr className="table-dark">
                  <th>Name</th>
                  <th>Specialization</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map((doctor, index) => (
                    <tr key={index}>
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
                    <td colSpan="4" className="text-center">
                      No doctors available for this specialization.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      
      <Modal
        show={showModal}
        onHide={handleClose}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdropClassName="custom-backdrop"
      >
        <Modal.Header closeButton className="text-white">
          <Modal.Title>Book an Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDoctor ? (
            <>
              {profileImage ? (
                <div className="text-center mb-3">
                  <img
                    src={profileImage}
                    alt={`${selectedDoctor.name}'s Profile`}
                    className="rounded-circle"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                </div>
              ) : (
                <p>Profile image not available.</p>
              )}
              <p>
                <strong>Doctor:</strong> {selectedDoctor.name}
              </p>
              <p>
                <strong>Specialization:</strong> {selectedDoctor.specialization}
              </p>
              <h3>Please Login to schedule your appointment.</h3>
            </>
          ) : (
            <p>No doctor selected.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button>
            <Link className="nav-link" to="/patientlogin">Login</Link>
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default Doctor;
