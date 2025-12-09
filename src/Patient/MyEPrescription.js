import React, { useState, useEffect } from "react";
import api from "../api/apiClient";       // ✅ CENTRALIZED API
import { useNavigate } from "react-router-dom";
import PatientDashboard from "./PatientDashboard";

const MyEPrescription = () => {
  const [ePrescriptions, setEPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientId, setPatientId] = useState(null);

  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [showAddressInput, setShowAddressInput] = useState(false);
  const navigate = useNavigate();

  // ---------------------------------------------------
  // FETCH PATIENT DETAILS
  // ---------------------------------------------------
  useEffect(() => {
    const loadPatient = async () => {
      try {
        const res = await api.get("/getPatientDetails");
        if (res.data?.id) setPatientId(res.data.id);
      } catch (err) {
        setError("Unable to load patient details.");
      }
    };
    loadPatient();
  }, []);

  // ---------------------------------------------------
  // FETCH ePRESCRIPTIONS
  // ---------------------------------------------------
  useEffect(() => {
    if (!patientId) return;

    const loadEP = async () => {
      try {
        const res = await api.get(`/viewMyEPrescriptionByPatient/${patientId}`);
        setEPrescriptions(res.data || []);
      } catch (err) {
        setError("Unable to load ePrescriptions.");
      } finally {
        setLoading(false);
      }
    };
    loadEP();
  }, [patientId]);

  // ---------------------------------------------------
  // ACCEPT & PAY
  // ---------------------------------------------------
  const handleAcceptAndPay = async () => {
    if (!deliveryAddress.trim()) {
      return alert("Delivery address required");
    }

    try {
      // ✔ CREATE ORDER  
      await api.post("/create", {
        appointment: { id: selectedAppointmentId },
        address: deliveryAddress,
      });

      // ✔ GET PRICE  
      const priceRes = await api.get(
        `/acceptandgetEPrescriptionPrice/${selectedAppointmentId}`
      );

      navigate("/billing", {
        state: {
          appointmentId: selectedAppointmentId,
          paymentAmount: priceRes.data,
        },
      });
    } catch (err) {
      setError("Payment processing failed.");
    } finally {
      setShowAddressInput(false);
      setDeliveryAddress("");
    }
  };

  // ---------------------------------------------------
  // RENDER EPRESCRIPTIONS GROUPED BY APPOINTMENT
  // ---------------------------------------------------
  const renderEP = () => {
    if (ePrescriptions.length === 0)
      return <p>No ePrescriptions found.</p>;

    const grouped = ePrescriptions.reduce((acc, ep) => {
      acc[ep.appointment.id] = acc[ep.appointment.id] || [];
      acc[ep.appointment.id].push(ep);
      return acc;
    }, {});

    return Object.keys(grouped).map((appointmentId) => {
      const group = grouped[appointmentId];
      const appointment = group[0].appointment;
      const allNotAccepted = group.every((ep) => !ep.accept);

      return (
        <div key={appointmentId} className="mb-4">
          <h4>Appointment: {appointmentId}</h4>

          {/* Delivery Address Input */}
          {showAddressInput && selectedAppointmentId === appointmentId && (
            <div className="my-3">
              <input
                className="form-control my-2"
                placeholder="Delivery Address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
              />
              <button className="btn btn-primary" onClick={handleAcceptAndPay}>
                Submit & Pay
              </button>
              <button
                className="btn btn-secondary ms-2"
                onClick={() => setShowAddressInput(false)}
              >
                Cancel
              </button>
            </div>
          )}

          {/* Table */}
          <table className="table table-striped mt-3">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Doctor</th>
                <th>Qty</th>
                <th>Description</th>
                <th>Issued On</th>
              </tr>
            </thead>
            <tbody>
              {group.map((ep, i) => (
                <tr key={i}>
                  <td>{ep.medicineName}</td>
                  <td>{ep.doctor.name}</td>
                  <td>{ep.quantity}</td>
                  <td>{ep.description}</td>
                  <td>{new Date(ep.appointment.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Accept Button */}
          {appointment.isCompleted && (
            <div className="text-center">
              {allNotAccepted ? (
                <button
                  className="btn btn-success"
                  onClick={() => {
                    setSelectedAppointmentId(appointmentId);
                    setShowAddressInput(true);
                  }}
                >
                  Accept & Pay
                </button>
              ) : (
                <button className="btn btn-secondary" disabled>
                  Already Accepted
                </button>
              )}
            </div>
          )}
        </div>
      );
    });
  };

  // ---------------------------------------------------
  // UI
  // ---------------------------------------------------
  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />

      <div className="container" style={{ marginTop: 80 }}>
        <h2 className="text-center mb-4">My ePrescriptions</h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" />
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : (
          renderEP()
        )}
      </div>
    </div>
  );
};

export default MyEPrescription;
