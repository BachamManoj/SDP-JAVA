import React, { useState, useEffect } from "react";
import api from "../api/apiClient";

const PrescriptionForm = ({ selectedPatient, onClose }) => {
  const [medicineId, setMedicineId] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [medicines, setMedicines] = useState([]);

  const { appointmentId, patientId, doctorId } = selectedPatient;

  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get("/getAllMedicine");
        setMedicines(res.data || []);
      } catch (err) {
        console.error("Error fetching medicines:", err);
      }
    };

    fetchMedicines();
  }, []);

  const handleMedicineChange = (e) => {
    const selectedId = e.target.value;
    setMedicineId(selectedId);

    const med = medicines.find((m) => m.id.toString() === selectedId);
    setMedicineName(med ? med.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!medicineId || !medicineName || !quantity || !description) {
      alert("All fields are required.");
      return;
    }

    const payload = {
      medicine: { id: Number(medicineId) },
      medicineName,
      patient: { id: patientId },
      doctor: { id: doctorId },
      description,
      quantity: Number(quantity),
      appointment: { id: appointmentId },
    };

    try {
      const res = await api.post("/provideEPrescription", payload);

      if (res.data) {
        alert("Prescription added successfully!");
        onClose();
      } else {
        alert("Failed to add prescription.");
      }
    } catch (err) {
      console.error("Error submitting prescription:", err);
      alert("Error submitting prescription.");
    }
  };

  return (
    <div className="prescription-form" style={{ marginTop: "100px" }}>
      <h2>Provide Prescription</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medicine</label>
          <select
            className="form-control"
            value={medicineId}
            onChange={handleMedicineChange}
            required
          >
            <option value="">Select a Medicine</option>
            {medicines.map((med) => (
              <option key={med.id} value={med.id}>
                {med.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Prescription
        </button>

        <button type="button" className="btn btn-secondary ml-2" onClick={onClose}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default PrescriptionForm;
