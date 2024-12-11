import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";
import { useNavigate } from 'react-router-dom';

const MedicineAdd = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    image: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prevData) => ({
        ...prevData,
        image: reader.result.split(",")[1], // Base64 encode
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("https://sdp-2200030709-production.up.railway.app/addMedicine", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 201) {
        alert("Medicine added successfully!");
        setFormData({
          name: "",
          quantity: "",
          price: "",
          description: "",
          image: "",
        });
        navigate('/pharmacistMedicineList');
      }
    } catch (error) {
      console.error("Error adding medicine:", error);
      alert("Failed to add medicine. Please try again.");
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <PharmacistDashboard/>
      <div className="container" style={{marginTop:'100px'}}>
        <h2>Add Medicine</h2>
        <form onSubmit={handleSubmit}>
        <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="name" className="form-label">Medicine Name</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="quantity" className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="price" className="form-label">Price</label>
              <input
                type="number"
                step="0.10"
                className="form-control"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="description" className="form-label">Description (Max 255 Characters)</label>
              <textarea
                className="form-control"
                id="description"
                name="description"
                rows="1"
                value={formData.description}
                onChange={handleChange}
                maxLength={255}
                required
              ></textarea>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <label htmlFor="image" className="form-label">Medicine Image</label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
          </div>

         
          <button type="submit" className="btn btn-primary">Add Medicine</button>
        </form>
      </div>
    </div>
  );
};

export default MedicineAdd;