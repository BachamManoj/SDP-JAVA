import React, { useEffect, useState } from "react";
import api from "../api/apiClient";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const MedicineList = () => {
  const [medicines, setMedicines] = useState([]);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [currentMedicine, setCurrentMedicine] = useState({
    id: "",
    name: "",
    quantity: "",
    price: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    loadMedicines();
  }, []);

  // Load medicines
  const loadMedicines = async () => {
    try {
      const res = await api.get("/getAllMedicine");
      setMedicines(res.data);
      setFilteredMedicines(res.data);
    } catch (err) {
      console.error("Error fetching medicines:", err);
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = medicines.filter((m) =>
      m.name.toLowerCase().includes(query)
    );

    setFilteredMedicines(filtered);
  };

  // Delete Medicine
  const handleDelete = async (id) => {
    try {
      await api.delete(`/deleteMedicine/${id}`);

      const updated = medicines.filter((m) => m.id !== id);
      setMedicines(updated);
      setFilteredMedicines(updated);

      alert("Medicine deleted successfully!");
    } catch (err) {
      alert("Failed to delete medicine.");
      console.error(err);
    }
  };

  // Start Editing
  const startEditing = (medicine) => {
    setCurrentMedicine({
      ...medicine,
      image: null,
    });
    setIsEditing(true);
  };

  // Update Medicine
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", currentMedicine.name);
    data.append("quantity", currentMedicine.quantity);
    data.append("price", currentMedicine.price);
    data.append("description", currentMedicine.description);

    if (currentMedicine.image) {
      data.append("image", currentMedicine.image);
    }

    try {
      const res = await api.put(
        `/updateMedicine/${currentMedicine.id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updated = medicines.map((m) =>
        m.id === res.data.id ? res.data : m
      );

      setMedicines(updated);
      setFilteredMedicines(updated);

      alert("Medicine updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      alert("Failed to update medicine.");
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <PharmacistDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
        <h2 className="mb-3">Medicine List</h2>

        {/* Search */}
        <input
          type="text"
          className="form-control mb-4"
          placeholder="Search medicine by name..."
          value={searchQuery}
          onChange={handleSearch}
        />

        {/* Edit Form */}
        {isEditing && (
          <div className="card p-3 mb-4 shadow">
            <h4>Edit Medicine</h4>

            <form onSubmit={handleUpdateSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={currentMedicine.name}
                    onChange={(e) =>
                      setCurrentMedicine({
                        ...currentMedicine,
                        name: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    value={currentMedicine.quantity}
                    onChange={(e) =>
                      setCurrentMedicine({
                        ...currentMedicine,
                        quantity: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    value={currentMedicine.price}
                    onChange={(e) =>
                      setCurrentMedicine({
                        ...currentMedicine,
                        price: e.target.value,
                      })
                    }
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
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

                <div className="col-md-6 mb-3">
                  <label>Update Image</label>
                  <input
                    type="file"
                    className="form-control"
                    onChange={(e) =>
                      setCurrentMedicine({
                        ...currentMedicine,
                        image: e.target.files[0],
                      })
                    }
                  />
                </div>
              </div>

              <button className="btn btn-success me-2">Save Changes</button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        )}

        {/* Medicine Table */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-bordered table-hover shadow-sm">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Description</th>
                <th>Image</th>
                <th style={{ width: "120px" }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredMedicines.length > 0 ? (
                filteredMedicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>{medicine.id}</td>
                    <td>{medicine.name}</td>
                    <td>{medicine.quantity}</td>
                    <td>₹{medicine.price.toFixed(2)}</td>
                    <td>{medicine.description}</td>

                    <td>
                      {medicine.image ? (
                        <img
                          src={`data:image/jpeg;base64,${medicine.image}`}
                          alt="Medicine"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>

                    <td>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => startEditing(medicine)}
                      >
                        <FaEdit />
                      </button>

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(medicine.id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center" colSpan="7">
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <Link to="/pharmacistAddMedicine" className="btn btn-primary mt-3">
          Add New Medicine
        </Link>
      </div>
    </div>
  );
};

export default MedicineList;
