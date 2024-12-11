import React, { useState, useEffect } from "react";
import axios from "axios";
import PatientDashboard from "./PatientDashboard";

const PatientReport = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const res = await axios.get('https://sdp-2200030709-production.up.railway.app/getPatientDetails', { withCredentials: true });
        setPatient(res.data);
      } catch (error) {
        console.error("Error fetching patient details", error);
      }
    };

    fetchPatientDetails();
  }, []);

  useEffect(() => {
    if (patient) {
      const fetchAppointments = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`https://sdp-2200030709-production.up.railway.app/getappointments/${patient.id}`);
          const completedAppointments = response.data.filter(appointment => appointment.reportCompleted);
          setAppointments(completedAppointments);
        } catch (error) {
          console.error("Error fetching appointments", error);
        } finally {
          setLoading(false);
        }
      };

      fetchAppointments();
    }
  }, [patient]);

  const fetchReport = async (appointmentId, doctorId) => {
    try {
      const response = await axios.get(`https://sdp-2200030709-production.up.railway.app/viewPatientMedicalReportbyPatient/${appointmentId}/${doctorId}`, {
        responseType: 'arraybuffer', 
        withCredentials: true
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank'); 

    } catch (error) {
      console.error("Error fetching medical report", error);
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />
      <div className="container" style={{marginTop:'100px'}}>
        <h2 className="mb-4">Patient Medical Reports</h2>

       
        {loading && <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>}

        
        {patient && (
          <div className="alert alert-info">
            <h4>Welcome, {patient.firstName} {patient.lastName}</h4>
          </div>
        )}

        
        {!loading && appointments.length > 0 && (
          <table className="table table-bordered table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Appointment ID</th>
                <th>Doctor Name</th>
                <th>Appointment Date</th>
                <th>View Report</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.doctor.name}</td>
                  <td>{new Date(appointment.date).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => fetchReport(appointment.id, appointment.doctor.id)}
                    >
                      View Report
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

       
        {!loading && appointments.length === 0 && (
          <div className="alert alert-warning" role="alert">
            No completed reports found for your appointments.
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientReport;
