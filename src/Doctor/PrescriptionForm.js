import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PrescriptionForm = ({ selectedPatient, onClose }) => {
  const [medicineId, setMedicineId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState('');
  const [medicines, setMedicines] = useState([]);

  const { appointmentId, patientId, doctorId } = selectedPatient; 
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get('https://sdp-2200030709-production.up.railway.app/getAllMedicine');
        setMedicines(response.data || []);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };
    fetchMedicines();
  }, []);

  const handleMedicineChange = (e) => {
    const selectedMedicineId = e.target.value;
    setMedicineId(selectedMedicineId);

    const selectedMedicine = medicines.find((med) => med.id.toString() === selectedMedicineId);
    setMedicineName(selectedMedicine ? selectedMedicine.name : '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prescription = {
      medicine: {
        id: parseInt(medicineId),
      },
      medicineName,
      patient: {
        id: patientId,
      },
      doctor: {
        id: doctorId,
      },
      description,
      quantity: parseInt(quantity), 
      appointment: {
        id: appointmentId,
      },
    };

    try {
      console.log(prescription)
      const response = await axios.post('https://sdp-2200030709-production.up.railway.app/provideEPrescription', prescription);
      if (response.data) {
        alert('Prescription added successfully!');
        onClose();
      } else {
        alert('Failed to add prescription. Try again.');
      }
    } catch (error) {
      console.error('Error submitting prescription:', error);
      alert('An error occurred while submitting the prescription.');
    }
  };

  return (
    <div className="prescription-form" style={{marginTop:'100px'}}>
      <h2>Provide Prescription</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Medicine</label>
          <select className="form-control" value={medicineId} onChange={handleMedicineChange} required>
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
