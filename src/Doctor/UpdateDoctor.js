import React, { useState, useEffect } from "react";
import api from "../api/apiClient";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import DoctorDashboard from "./DoctorDashboard";

const UpdateDoctor = () => {
  const [doctorData, setDoctorData] = useState({
    id: "",
    name: "",
    specialization: "",
    contactNumber: "",
    email: "",
    fee: "",
    profileImage: null,
  });

  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const res = await api.get("/getDoctorDetails");
        setDoctorData({
          id: res.data.id,
          name: res.data.name,
          specialization: res.data.specialization,
          contactNumber: res.data.contactNumber,
          email: res.data.email,
          fee: res.data.fee,
          profileImage: null
        });

        const img = await api.get(`/Doctorprofile/${res.data.id}/image`, {
          responseType: "blob",
        });

        setImagePreview(URL.createObjectURL(img.data));
      } catch (err) {
        setError("Unable to load doctor profile.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [navigate]);

  const handleChange = (e) => {
    setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDoctorData({ ...doctorData, profileImage: file });

    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("name", doctorData.name);
      formData.append("specialization", doctorData.specialization);
      formData.append("contactNumber", doctorData.contactNumber);
      formData.append("email", doctorData.email);
      formData.append("fee", doctorData.fee);
      if (doctorData.profileImage) {
        formData.append("profileImage", doctorData.profileImage);
      }

      await api.put("/updateDoctorProfile", formData);

      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="dashboard-container d-flex">
      <DoctorDashboard />

      <div className="container mt-5 flex-grow-1">
        <div className="card shadow p-4">
          <h2 className="text-center mb-4">Update Doctor Profile</h2>

          <div className="text-center mb-4">
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
                  background: "#ccc",
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

          <form onSubmit={handleUpdate}>
            <div className="row">
              <div className="col-md-6">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={doctorData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  className="form-control"
                  value={doctorData.specialization}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mt-3">
                <label>Contact Number</label>
                <input
                  type="text"
                  name="contactNumber"
                  className="form-control"
                  value={doctorData.contactNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mt-3">
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={doctorData.email}
                  disabled
                />
              </div>

              <div className="col-md-6 mt-3">
                <label>Consultation Fee</label>
                <input
                  type="number"
                  name="fee"
                  className="form-control"
                  value={doctorData.fee}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-12 mt-3">
                <label>Profile Picture</label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <button className="btn btn-success mt-4">Update Profile</button>
          </form>

          {message && <div className="alert alert-success mt-3">{message}</div>}
          {error && <div className="alert alert-danger mt-3">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default UpdateDoctor;
