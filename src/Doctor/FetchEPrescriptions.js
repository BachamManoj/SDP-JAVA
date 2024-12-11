import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const FetchEPrescriptions = ({ appointmentId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateForm, setUpdateForm] = useState(null);

  useEffect(() => {
    const fetchEPrescriptions = async () => {
      try {
        const response = await fetch(`https://sdp-2200030709-production.up.railway.app/getEPrescriptionsByAppointment/${appointmentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        setError('No EPrescriptions provided');
      } finally {
        setLoading(false);
      }
    };

    fetchEPrescriptions();
  }, [appointmentId]);

  const handleEditClick = (prescription) => {
    setUpdateForm(prescription);
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://sdp-2200030709-production.up.railway.app/changeEPrescriptions/${updateForm.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateForm),
      });

      if (!response.ok) {
        throw new Error('Failed to update prescription');
      }

      const updatedPrescription = await response.json();
      setPrescriptions((prev) =>
        prev.map((prescription) =>
          prescription.id === updatedPrescription.id ? updatedPrescription : prescription
        )
      );
      setUpdateForm(null); // Close the form after update
    } catch (err) {
      alert('Error updating prescription: ' + err.message);
    }
  };

  const deleteEPrescription = async (id) => {
    try {
      const response = await fetch(`https://sdp-2200030709-production.up.railway.app/deleteEPrescription/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete prescription');
      }

      // Remove deleted prescription from state
      setPrescriptions((prev) =>
        prev.filter((prescription) => prescription.id !== id)
      );
    } catch (err) {
      alert('Error deleting prescription: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  return (
    <div>
      <h5>EPrescriptions</h5>
      {prescriptions.length === 0 ? (
        <div className="alert alert-info">No prescriptions found for this appointment.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {prescriptions.map((prescription, index) => (
                <tr key={prescription.id}>
                  <td>{index + 1}</td>
                  <td>{prescription.medicineName}</td>
                  <td>{prescription.description}</td>
                  <td>{prescription.quantity}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleEditClick(prescription)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm ml-2"
                      onClick={() => deleteEPrescription(prescription.id)}
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
          <h5>Update Prescription</h5>
          <form onSubmit={handleUpdateSubmit}>
            <div className="form-group">
              <label htmlFor="medicineName">Medicine Name</label>
              <input
                type="text"
                id="medicineName"
                name="medicineName"
                className="form-control"
                value={updateForm.medicineName}
                onChange={handleUpdateChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                className="form-control"
                value={updateForm.description}
                onChange={handleUpdateChange}
              ></textarea>
            </div>
            <div className="form-group">
              <label htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
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
              className="btn btn-secondary ml-2"
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
