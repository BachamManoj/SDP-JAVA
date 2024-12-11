import React, { useState, useEffect } from "react";
import axios from "axios";
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
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const res = await axios.get("https://sdp-2200030709-production.up.railway.app/getDoctorDetails", {
          withCredentials: true,
        });
        setDoctorData(res.data);

        if (res.data.id) {
          const imageRes = await axios.get(
            `https://sdp-2200030709-production.up.railway.app/Doctorprofile/${res.data.id}/image`,
            { responseType: "blob", withCredentials: true }
          );
          setImagePreview(URL.createObjectURL(imageRes.data));
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to load doctor data. Please log in.");
        setLoading(false);
        navigate("/login");
      }
    };

    fetchDoctorData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDoctorData({
      ...doctorData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setDoctorData({
      ...doctorData,
      profileImage: file,
    });
    setImagePreview(URL.createObjectURL(file));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    const formData = new FormData();
    Object.keys(doctorData).forEach((key) => {
      formData.append(key, doctorData[key]);
    });

    try {
      await axios.put(
        `https://sdp-2200030709-production.up.railway.app/updateDoctorProfile/${doctorData.id}`,
        formData,
        {
          withCredentials: true,
        }
      );
      setMessage("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile.");
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container d-flex">
      <DoctorDashboard />
      <div className="profile-content flex-grow-1 container mt-5">
        <div className="profile-form-container card">
          <div className="card-body text-center">
            <h2 className="card-title mb-4">Doctor Profile</h2>

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

            <form onSubmit={handleUpdate}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
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
                </div>
                <div className="col-md-6">
                  <div className="form-group">
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
                </div>
                <div className="col-md-6">
                  <div className="form-group">
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
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={doctorData.email}
                      onChange={handleChange}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
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
                </div>
                <div className="col-md-12">
                  <div className="form-group">
                    <label>Profile Picture</label>
                    <input
                      type="file"
                      name="profileImage"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </div>
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

export default UpdateDoctor;
