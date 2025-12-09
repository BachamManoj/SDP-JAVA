import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/apiClient"; 
import "bootstrap/dist/css/bootstrap.min.css";
import PatientDashboard from "./PatientDashboard";
import "./PatientProfile.css";

const PatientProfile = () => {
  const [patientData, setPatientData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    address: "",
    profileImage: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  /** -------------------------------
   *  FETCH PATIENT PROFILE + IMAGE
   --------------------------------*/
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await api.get("/getPatientDetails", { withCredentials: true });
        setPatientData(res.data);

        const imgRes = await api.get(`/profile/${res.data.id}/image`, {
          responseType: "blob",
          withCredentials: true,
        });

        setImagePreview(URL.createObjectURL(imgRes.data));
      } catch (err) {
        console.error(err);
        setError("Failed to load patient data. Please log in again.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [navigate]);

  /** -------------------------------
   *  HANDLE TEXT CHANGES
   --------------------------------*/
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatientData((prev) => ({ ...prev, [name]: value }));
  };

  /** -------------------------------
   *  HANDLE PROFILE IMAGE UPLOAD
   --------------------------------*/
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setPatientData((prev) => ({ ...prev, profileImage: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  /** -------------------------------
   *  SUBMIT PROFILE UPDATE
   --------------------------------*/
  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    Object.keys(patientData).forEach((key) => {
      formData.append(key, patientData[key]);
    });

    try {
      await api.put(`/updatePatientProfile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  /** -------------------------------
   *  CLEANUP IMAGE URL
   --------------------------------*/
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />

      <div className="profile-content flex-grow-1 container mt-5">
        <div className="profile-form-container card shadow">
          <div className="card-body text-center">
            <h2 className="card-title mb-4">Patient Profile</h2>

            {/* PROFILE IMAGE */}
            <div className="profile-picture mb-4">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Profile"
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "24px",
                    color: "#fff",
                  }}
                >
                  No Image
                </div>
              )}
            </div>

            {/* PROFILE UPDATE FORM */}
            <form onSubmit={handleUpdate}>
              <div className="row">
                {/* First Name */}
                <div className="col-md-6 mb-3">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control"
                    value={patientData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6 mb-3">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control"
                    value={patientData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* DOB */}
                <div className="col-md-6 mb-3">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control"
                    value={patientData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6 mb-3">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="form-select"
                    value={patientData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Contact Number */}
                <div className="col-md-6 mb-3">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    className="form-control"
                    value={patientData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6 mb-3">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={patientData.email}
                    disabled
                  />
                </div>

                {/* Address */}
                <div className="col-md-12 mb-3">
                  <label>Address</label>
                  <textarea
                    name="address"
                    className="form-control"
                    value={patientData.address}
                    onChange={handleChange}
                    required
                    style={{ height: "100px" }}
                  ></textarea>
                </div>

                {/* Profile Image Upload */}
                <div className="col-md-12 mb-3">
                  <label>Profile Picture</label>
                  <input
                    type="file"
                    name="profileImage"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-success mt-3">
                Update Profile
              </button>
            </form>

            {message && <div className="alert alert-success mt-3">{message}</div>}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
