import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api/apiClient";

const FetchEPrescriptions = ({ appointmentId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateForm, setUpdateForm] = useState(null);

  useEffect(() => {
    const loadPrescriptions = async () => {
      try {
        const res = await api.get(`/getEPrescriptionsByAppointment/${appointmentId}`);
        setPrescriptions(res.data || []);
      } catch (err) {
        setError("No E-Prescriptions available.");
      } finally {
        setLoading(false);
      }
    };

    loadPrescriptions();
  }, [appointmentId]);

  const handleEditClick = (prescription) => {
    setUpdateForm({ ...prescription });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.put(`/changeEPrescriptions/${updateForm.id}`, updateForm);

      setPrescriptions((prev) =>
        prev.map((p) => (p.id === updateForm.id ? res.data : p))
      );

      setUpdateForm(null);
    } catch (err) {
      alert("Error updating prescription");
    }
  };

  const deleteEPrescription = async (id) => {
    try {
      await api.delete(`/deleteEPrescription/${id}`);

      setPrescriptions((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Error deleting prescription");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div>
      <h5>EPrescriptions</h5>

      {prescriptions.length === 0 ? (
        <div className="alert alert-info">No prescriptions found for this appointment.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((p, index) => (
                <tr key={p.id}>
                  <td>{index + 1}</td>
                  <td>{p.medicineName}</td>
                  <td>{p.description}</td>
                  <td>{p.quantity}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditClick(p)}
                    >
                      Edit
                    </button>

                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => deleteEPrescription(p.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {updateForm && (
        <div className="mt-4">
          <h5>Edit Prescription</h5>

          <form onSubmit={handleUpdateSubmit}>
            <div className="form-group mb-3">
              <label>Medicine Name</label>
              <input
                type="text"
                name="medicineName"
                className="form-control"
                value={updateForm.medicineName}
                onChange={handleUpdateChange}
              />
            </div>

            <div className="form-group mb-3">
              <label>Description</label>
              <textarea
                name="description"
                className="form-control"
                value={updateForm.description}
                onChange={handleUpdateChange}
              ></textarea>
            </div>

            <div className="form-group mb-3">
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={updateForm.quantity}
                onChange={handleUpdateChange}
              />
            </div>

            <button type="submit" className="btn btn-success">
              Update
            </button>

            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => setUpdateForm(null)}
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default FetchEPrescriptions;
