import React, { useState } from "react";
import api from "../api/apiClient";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";
import { useNavigate } from "react-router-dom";

const MedicineAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
  });

  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (image) data.append("image", image);

      await api.post("/addMedicine", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Medicine added successfully!");
      navigate("/pharmacistMedicineList");
    } catch (err) {
      console.error("Error adding medicine:", err);
      alert("Failed to add medicine. Please try again.");
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <PharmacistDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
        <h2>Add Medicine</h2>

        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Medicine Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Price</label>
              <input
                type="number"
                step="0.01"
                className="form-control"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Description (Max 255 chars)</label>
              <textarea
                className="form-control"
                name="description"
                maxLength="255"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">Medicine Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary">
            Add Medicine
          </button>
        </form>
      </div>
    </div>
  );
};

export default MedicineAdd;
