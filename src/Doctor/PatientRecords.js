import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DoctorDashboard from './DoctorDashboard';

const PatientRecords = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const fetchDoctorAndAppointments = async () => {
            setLoading(true);
            setError(null);

            try {
                const doctorResponse = await axios.get('https://sdp-2200030709-production.up.railway.app/getDoctorDetails', { withCredentials: true });
                if (doctorResponse.data) {
                    setDoctor(doctorResponse.data);

                    const appointmentsResponse = await axios.get(
                        `https://sdp-2200030709-production.up.railway.app/getPatientAppointments/${doctorResponse.data.id}`,
                        { withCredentials: true }
                    );

                    if (appointmentsResponse.data) {
                        const filteredAppointments = appointmentsResponse.data
                            .filter((appointment) => appointment.reportCompleted)
                            .map((appointment) => ({
                                ...appointment,
                                patientId: appointment.patient?.id || 'Unknown',
                                patientFirstName: appointment.patient?.firstName || 'Unknown',
                            }));
                        setAppointments(filteredAppointments);
                    }
                }
            } catch (err) {
                setError('Failed to fetch doctor or appointment details');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorAndAppointments();
    }, []);

    const fetchMedicalReport = async (patientId, appointmentId) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.get(
                `https://sdp-2200030709-production.up.railway.app/viewPatientMedicalReport/${patientId}/${appointmentId}`,
                {
                    responseType: 'arraybuffer',
                    withCredentials: true,
                }
            );

            const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } catch (err) {
            setError('Failed to fetch medical report');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container d-flex">
            <DoctorDashboard />
            <div className="container " style={{ marginTop: '100px' }}>
                <div className="card shadow-sm">
                    <div className="card-header  text-white">
                        <h2 className="text-center ">Patient Medical Records</h2>
                    </div>
                    <div className="card-body">
                        {loading && <div className="alert alert-info">Loading...</div>}
                        {error && <div className="alert alert-danger">{error}</div>}

                        {doctor && (
                            <h4 className="mb-4">
                                <span className="badge bg-info">Doctor: {doctor.name}</span>
                            </h4>
                        )}

                        <div className="table-responsive">
                            {appointments.length > 0 ? (
                                <table className="table table-hover table-bordered">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>#</th>
                                            <th>Patient Name</th>
                                            <th>Patient ID</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.map((appointment, index) => (
                                            <tr key={appointment.id}>
                                                <td>{index + 1}</td>
                                                <td>{appointment.patientFirstName}</td>
                                                <td>{appointment.patientId}</td>
                                                <td>
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => fetchMedicalReport(appointment.patientId, appointment.id)}
                                                        disabled={loading}
                                                    >
                                                        <i className="bi bi-file-earmark-pdf"></i> View Medical Report
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <p className="text-muted">No completed reports found</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PatientRecords;
