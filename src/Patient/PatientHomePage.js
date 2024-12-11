import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PatientDashboard from './PatientDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const PatientHomePage = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [pendingBills, setPendingBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await axios.get('https://sdp-2200030709-production.up.railway.app/getPatientDetails', {
          withCredentials: true,
        });
        setPatient(res.data);

        const appointmentsRes = await axios.get(
          `https://sdp-2200030709-production.up.railway.app/getappointments/${res.data.id}`,
          { withCredentials: true }
        );

        const currentDate = new Date();
        const upcomingAppointments = appointmentsRes.data.filter(
          (appointment) => new Date(appointment.date) > currentDate
        );

        setAppointments(upcomingAppointments);

        const billsRes = await axios.get(
          'https://sdp-2200030709-production.up.railway.app/getPatientBillings',
          { withCredentials: true }
        );
        const pending = billsRes.data.filter((bill) => !bill.isPaid);
        setPendingBills(pending);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching patient details, appointments, or bills:', error);
        setLoading(false);
      }
    };

    fetchPatientData();
  }, []);

  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />
      <div className="container" style={{ marginTop: '100px' }}>
        <h2 className="mb-4">Patient Dashboard</h2>

        {loading && (
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        )}

        {patient && (
          <div className="alert alert-info">
            <h4>Welcome, {patient.firstName} {patient.lastName}</h4>
          </div>
        )}

        {/* Cards Section */}
        <div className="row mb-5">
          <div className="col-md-6">
            <div
              className="card text-white bg-primary mb-3"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/patientRecordsbyPatient')}
            >
              <div className="card-body">
                <h5 className="card-title">Reports</h5>
                <p className="card-text">View all your medical reports in one place.</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div
              className="card text-white bg-success mb-3"
              style={{ cursor: 'pointer' }}
              onClick={() => navigate('/MyEPrescription')}
            >
              <div className="card-body">
                <h5 className="card-title">EPrescription</h5>
                <p className="card-text">Access your EPrescriptions online anytime.</p>
              </div>
            </div>
          </div>
        </div>

        {!loading && (
          <>
            <h3 className="mt-4">Upcoming Appointments</h3>
            {appointments.length > 0 ? (
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Appointment ID</th>
                    <th>Doctor Name</th>
                    <th>Appointment Date</th>
                    <th>Time Slot</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.id}</td>
                      <td>{appointment.doctor.name}</td>
                      <td>{new Date(appointment.date).toLocaleDateString('en-GB')}</td>
                      <td>{appointment.timeSlot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-warning" role="alert">
                No upcoming appointments found.
              </div>
            )}

            <h3 className="mt-4">Pending Bills</h3>
            {pendingBills.length > 0 ? (
              <table className="table table-bordered table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    <th>Bill ID</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingBills.map((bill) => (
                    <tr key={bill.id}>
                      <td>{bill.id}</td>
                      <td>₹{bill.amount}</td>
                      <td>{new Date(bill.dueDate).toLocaleDateString('en-GB')}</td>
                      <td>
                        <span className="badge bg-danger">Pending</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="alert alert-success" role="alert">
                No pending bills found.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PatientHomePage;
