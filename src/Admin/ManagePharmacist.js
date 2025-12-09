import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import AdminDashboard from './AdminDashboard';
import api from "../api/apiClient";

const ManagePharmacist = () => {
  const [pharmacists, setPharmacists] = useState([]);
  const [newPharmacist, setNewPharmacist] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showAddPharmacist, setShowAddPharmacist] = useState(false);

  /** Fetch all pharmacists */
  const fetchPharmacists = async () => {
    try {
      const response = await api.get("/managePharmacist");
      setPharmacists(response.data);
      setError("");
    } catch (err) {
      console.error("Error fetching pharmacists:", err);
      setError("Failed to load pharmacists.");
    }
  };

  useEffect(() => {
    fetchPharmacists();
  }, []);

  /** Handle form input changes */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPharmacist((prev) => ({ ...prev, [name]: value }));
  };

  /** Add pharmacist */
  const handleAddPharmacist = async (e) => {
    e.preventDefault();
    try {
      await api.post("/addPharmacist", newPharmacist);

      setMessage("Pharmacist added successfully");
      setError("");

      setNewPharmacist({ name: "", email: "", password: "" });
      setShowAddPharmacist(false);

      fetchPharmacists();
    } catch (err) {
      console.error("Failed to add pharmacist:", err);
      setMessage("");
      setError("Failed to add pharmacist.");
    }
  };

  /** Delete pharmacist */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pharmacist?")) return;

    try {
      await api.delete(`/managePharmacist/${id}`);

      setMessage("Pharmacist deleted successfully");
      setError("");

      fetchPharmacists();
    } catch (err) {
      console.error("Failed to delete pharmacist:", err);
      setMessage("");
      setError("Failed to delete pharmacist.");
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <AdminDashboard />

      <div className="container" style={{ marginTop: 75 }}>
        <h2 className="text-center mb-4">Manage Pharmacists</h2>

        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        {/* All Pharmacists */}
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white">
            <h5>All Pharmacists</h5>
          </div>
          <div className="card-body">
            {pharmacists.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pharmacists.map((pharmacist, index) => (
                    <tr key={pharmacist.id}>
                      <td>{index + 1}</td>
                      <td>{pharmacist.name}</td>
                      <td>{pharmacist.email}</td>
                      <td>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(pharmacist.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No pharmacists available.</p>
            )}
          </div>
        </div>

        {/* Add Pharmacist Button */}
        {!showAddPharmacist && (
          <button
            className="btn btn-primary mb-3"
            onClick={() => setShowAddPharmacist(true)}
          >
            Add Pharmacist
          </button>
        )}

        {/* Add Pharmacist Form */}
        {showAddPharmacist && (
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h5>Add New Pharmacist</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddPharmacist}>
                <div className="mb-3">
                  <label className="form-label">Pharmacist Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={newPharmacist.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={newPharmacist.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={newPharmacist.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                  Add Pharmacist
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManagePharmacist;
