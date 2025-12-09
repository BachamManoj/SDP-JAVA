import React, { useEffect, useState } from "react";
import DoctorDashboard from "./DoctorDashboard";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import api from "../api/apiClient";

const DoctorHomePage = () => {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const doctorRes = await api.get("/getDoctorDetails");
        setDoctor(doctorRes.data);

        const appointmentsRes = await api.get("/getDoctorAppointments");

        const today = new Date().setHours(0, 0, 0, 0);

        const upcoming = appointmentsRes.data
          .filter((a) => {
            const apptDate = new Date(a.date).setHours(0, 0, 0, 0);
            return apptDate >= today;
          })
          .sort((a, b) => new Date(a.date) - new Date(b.date));

        setAppointments(upcoming);
      } catch (err) {
        console.error("Doctor Homepage Load Error:", err);
        setError("Unable to load doctor details. Please login again.");
      }
    };

    loadData();
  }, []);

  return (
    <div className="dashboard-container d-flex">
      <DoctorDashboard />

      <div className="container" style={{ marginTop: "100px" }}>
        {error && <div className="alert alert-danger">{error}</div>}

        {!doctor ? (
          <div className="alert alert-warning">Loading doctor details...</div>
        ) : (
          <>
            <div className="alert alert-primary">
              <h2>Welcome, Dr. {doctor.name}</h2>
            </div>

            <div className="row mt-4">
              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card text-center h-100 shadow-lg rounded-3">
                  <div className="card-body">
                    <h5 className="card-title">Post Records</h5>
                    <p>Add medical records for patients.</p>
                    <Link to="/postReportsData" className="btn btn-primary">
                      Go to Records
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card text-center h-100 shadow-lg rounded-3">
                  <div className="card-body">
                    <h5 className="card-title">Patient Records</h5>
                    <p>Access detailed patient history.</p>
                    <Link to="/patientRecordsbyDocter" className="btn btn-success">
                      View Records
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card text-center h-100 shadow-lg rounded-3">
                  <div className="card-body">
                    <h5 className="card-title">Consultation</h5>
                    <p>Start virtual consultations.</p>
                    <Link to="/mySchedule" className="btn btn-warning">
                      Start
                    </Link>
                  </div>
                </div>
              </div>

              <div className="col-md-6 col-lg-3 mb-4">
                <div className="card text-center h-100 shadow-lg rounded-3">
                  <div className="card-body">
                    <h5 className="card-title">E-Prescription</h5>
                    <p>Provide digital prescriptions.</p>
                    <Link to="/mySchedule" className="btn btn-info">
                      Provide
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <h3 className="mb-4">Upcoming Appointments</h3>

              {appointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-bordered table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Patient Name</th>
                        <th>Date</th>
                        <th>Time Slot</th>
                      </tr>
                    </thead>
                    <tbody>
                      {appointments.map((a) => (
                        <tr key={a.id}>
                          <td>{a.patient.firstName}</td>
                          <td>{new Date(a.date).toLocaleDateString()}</td>
                          <td>{a.timeSlot}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">No upcoming appointments.</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorHomePage;
