import React, { useState } from "react";
import api from "../api/apiClient"; // CENTRALIZED API
import "bootstrap/dist/css/bootstrap.min.css";
import "./PatientRegistration.css";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";

const PatientRegistration = () => {
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    contactNumber: "",
    email: "",
    password: "",
    address: "",
  });

  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  /** ----------------------------
   * HANDLE INPUT CHANGE
   ----------------------------- */
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /** ----------------------------
   * HANDLE IMAGE UPLOAD
   ----------------------------- */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Only JPG, JPEG, PNG formats are allowed.");
      return;
    }

    setImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  /** ----------------------------
   * HANDLE FORM SUBMIT
   ----------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("profileImage", image);

      const res = await api.post("/patientRegistration", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMsg(res.data);

      // RESET FORM
      setFormData({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "",
        contactNumber: "",
        email: "",
        password: "",
        address: "",
      });
      setImage(null);
      setPreviewImage(null);
    } catch (err) {
      console.error(err);
      setErrorMsg(
        err.response?.data || "Email or Contact already exists. Try again."
      );
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container mt-5">
        <div className="registration-form-container card shadow">
          <div className="card-body">
            <h2 className="card-title text-center mb-4">Patient Signup</h2>

            <form onSubmit={handleSubmit}>
              <div className="row">

                {/* First Name */}
                <div className="col-md-6">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    className="form-control custom-input"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Last Name */}
                <div className="col-md-6">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    className="form-control custom-input"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* DOB */}
                <div className="col-md-6">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    className="form-control custom-input"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Gender */}
                <div className="col-md-6">
                  <label>Gender</label>
                  <select
                    name="gender"
                    className="form-select custom-input"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Contact */}
                <div className="col-md-6">
                  <label>Contact Number</label>
                  <input
                    type="text"
                    name="contactNumber"
                    className="form-control custom-input"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="col-md-6">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    className="form-control custom-input"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Password */}
                <div className="col-md-6">
                  <label>Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control custom-input"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Address */}
                <div className="col-md-6">
                  <label>Address</label>
                  <textarea
                    name="address"
                    className="form-control custom-input"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    style={{ height: "100px" }}
                  ></textarea>
                </div>
              </div>

              {/* IMAGE UPLOAD */}
              <div className="mt-3">
                <input type="file" accept="image/*" onChange={handleImageChange} />

                {previewImage && (
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      maxWidth: "100px",
                      marginTop: "10px",
                      borderRadius: "5px",
                    }}
                  />
                )}
              </div>

              <button type="submit" className="btn btn-primary mt-3">
                Register
              </button>
            </form>

            {successMsg && <div className="alert alert-success mt-3">{successMsg}</div>}

            {errorMsg && (
              <div className="alert alert-danger mt-3">Error: {errorMsg}</div>
            )}

            <div className="custom-additional-links mt-3">
              <Link className="nav-link" to="/patientlogin">
                Already have an account? Login
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientRegistration;
