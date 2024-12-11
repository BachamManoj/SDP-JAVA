import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from 'react-router-dom';

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState({
    id: null,
    name: "",
    quantity: 0,
    price: 0,
    description: "",
    image: null,
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axios.get("https://sdp-2200030709-production.up.railway.app/getAllMedicine");
      setMedicines(response.data);
      setFilteredMedicines(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching medicines:", error);
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = medicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(query)
    );
    setFilteredMedicines(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://sdp-2200030709-production.up.railway.app/deleteMedicine/${id}`);
      setMedicines(medicines.filter((medicine) => medicine.id !== id));
      setFilteredMedicines(filteredMedicines.filter((medicine) => medicine.id !== id));
      alert("Medicine deleted successfully!");
    } catch (error) {
      console.error("Error deleting medicine:", error);
      alert("Failed to delete medicine.");
    }
  };

  const handleUpdateClick = (medicine) => {
    setIsEditing(true);
    setCurrentMedicine(medicine);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", currentMedicine.name);
    formData.append("quantity", currentMedicine.quantity);
    formData.append("price", currentMedicine.price);
    formData.append("description", currentMedicine.description);
    if (currentMedicine.image) {
      formData.append("image", currentMedicine.image);
    }

    try {
      const response = await axios.put(
        `https://sdp-2200030709-production.up.railway.app/updateMedicine/${currentMedicine.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const updatedMedicine = response.data;
      setMedicines(
        medicines.map((medicine) =>
          medicine.id === updatedMedicine.id ? updatedMedicine : medicine
        )
      );
      setFilteredMedicines(
        filteredMedicines.map((medicine) =>
          medicine.id === updatedMedicine.id ? updatedMedicine : medicine
        )
      );
      alert("Medicine updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating medicine:", error);
      alert("Failed to update medicine.");
    }
  };

  const handleImageChange = (e) => {
    setCurrentMedicine({ ...currentMedicine, image: e.target.files[0] });
  };

  return (
    <div className="dashboard-container d-flex">
      <PharmacistDashboard />
      <div className="container" style={{ margin: "100px" }}>
        <h2>Medicine List</h2>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by Medicine name"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {isEditing ? (
          <div>
            <h3>Edit Medicine</h3>
            <form onSubmit={handleUpdateSubmit}>
              <div className="mb-3">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={currentMedicine.name}
                  onChange={(e) =>
                    setCurrentMedicine({ ...currentMedicine, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label>Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  value={currentMedicine.quantity}
                  onChange={(e) =>
                    setCurrentMedicine({ ...currentMedicine, quantity: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  step="0.01"
                  value={currentMedicine.price}
                  onChange={(e) =>
                    setCurrentMedicine({ ...currentMedicine, price: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label>Description</label>
                <textarea
                  className="form-control"
                  value={currentMedicine.description}
                  onChange={(e) =>
                    setCurrentMedicine({
                      ...currentMedicine,
                      description: e.target.value,
                    })
                  }
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label>Image</label>
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>
              <div className="mb-3">
                <button type="submit" className="btn btn-success me-2">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Description</th>
                    <th>Image</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMedicines.length > 0 ? (
                    filteredMedicines.map((medicine) => (
                      <tr key={medicine.id}>
                        <td>{medicine.id}</td>
                        <td>{medicine.name}</td>
                        <td>{medicine.quantity}</td>
                        <td>{medicine.price.toFixed(2)}</td>
                        <td>{medicine.description}</td>
                        <td>
                          {medicine.image ? (
                            <img
                              src={`data:image/jpeg;base64,${medicine.image}`}
                              alt="Medicine"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            "No image"
                          )}
                        </td>
                        <td>
                          <div className="d-flex justify-content-start">
                            <button
                              className="btn btn-primary btn-sm me-2"
                              onClick={() => handleUpdateClick(medicine)}
                              title="Update"
                            >
                             <FaEdit/>
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(medicine.id)}
                              title="Delete"
                            >
                              <FaTrash/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center">
                        No medicines found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </>
        )}
        <Link className="custom-navbar-item" to="/pharmacistAddMedicine">Add new Medicine</Link>
      </div>
    </div>
  );
};

export default MedicineList;
