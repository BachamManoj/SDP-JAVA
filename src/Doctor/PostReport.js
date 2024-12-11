import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DoctorDashboard from './DoctorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostReport = () => {
    const [description, setDescription] = useState('');
    const [patientId, setPatientId] = useState('');
    const [doctorId, setDoctorId] = useState('');
    const [appointmentId, setAppointmentId] = useState('');
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState('');
    const [formVisibility, setFormVisibility] = useState({});
    const [viewedReport, setViewedReport] = useState(null);
    const [editDescription, setEditDescription] = useState(''); 

    useEffect(() => {
        const fetchDoctorDetails = async () => {
            try {
                const response = await axios.get('https://sdp-2200030709-production.up.railway.app/getDoctorDetails', {
                    withCredentials: true,
                });
                setDoctorId(response.data.id);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
                setMessage('Error fetching doctor details');
            }
        };

        const fetchAppointments = async () => {
            try {
                const response = await axios.get('https://sdp-2200030709-production.up.railway.app/getPatientAppointments/1');
                setAppointments(response.data);
            } catch (error) {
                console.error('Error fetching patient appointments:', error);
                setMessage('Error fetching patient appointments');
            }
        };

        fetchDoctorDetails();
        fetchAppointments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const reportData = {
            description: description,
            patient: { id: patientId },
            doctor: { id: doctorId },
            appointment: { id: appointmentId },
        };

        try {
            const response = await axios.post('https://sdp-2200030709-production.up.railway.app/createReport', reportData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            setMessage(`Report saved successfully: ${response.data.id}`);

            await updateReportCompleted(appointmentId);

            setFormVisibility((prevVisibility) => ({
                ...prevVisibility,
                [appointmentId]: false,
            }));
        } catch (error) {
            setMessage('Error saving report');
        }
    };

    const updateReportCompleted = async (appointmentId) => {
        try {
            const response = await axios.put(`https://sdp-2200030709-production.up.railway.app/updateReport/${appointmentId}`);
            console.log('Report marked as completed:', response.data);
        } catch (error) {
            console.error('Error updating report status:', error);
            setMessage('Error updating report status');
        }
    };

    const handleViewReportClick = async (appointmentId) => {
        try {
            const response = await axios.get(`https://sdp-2200030709-production.up.railway.app/viewReport/${appointmentId}`);
            setViewedReport(response.data);
            setDescription(response.data.description);
        } catch (error) {
            console.error('Error fetching report:', error);
            setMessage('Error fetching report');
        }
    };

    const handleEditDescription = async (appointmentId) => {
        const updatedReport = {
            description: editDescription,
        };

        try {
            const response = await axios.put(
                `https://sdp-2200030709-production.up.railway.app/editDescription/${appointmentId}`,
                updatedReport,
                { headers: { 'Content-Type': 'application/json' } }
            );
            setViewedReport(response.data);
            setMessage('Report updated successfully');
        } catch (error) {
            console.error('Error updating report:', error);
            setMessage('Error updating report');
        }
    };

    const handlePostReportClick = (appointment) => {
        setAppointmentId(appointment.id);
        setPatientId(appointment.patient.id);
        setDoctorId(appointment.doctor.id);
        setDescription('');
        setFormVisibility((prevVisibility) => ({
            ...prevVisibility,
            [appointment.id]: true,
        }));
    };

    const handleHideForm = (appointmentId) => {
        setFormVisibility((prevVisibility) => ({
            ...prevVisibility,
            [appointmentId]: false,
        }));
        setViewedReport(null);
    };

    return (
        <div className="dashboard-container d-flex">
            <DoctorDashboard />
            <div className="container" style={{ marginTop: '100px' }}>
                <h2 className="mb-4 text-center">Create or Edit Report</h2>

                <h3 className="mb-4">Appointments</h3>
                {appointments.length > 0 ? (
                    <table className="table table-bordered table-striped">
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th>Patient Name</th>
                                <th>Date</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <React.Fragment key={appointment.id}>
                                    <tr>
                                        <td>{appointment.id}</td>
                                        <td>{appointment.patient.firstName} {appointment.patient.lastName}</td>
                                        <td>{new Date(appointment.date).toLocaleString()}</td>
                                        <td>
                                            {appointment.reportCompleted ? (
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => handleViewReportClick(appointment.id)}
                                                >
                                                    View Report
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => handlePostReportClick(appointment)}
                                                >
                                                    Post Report
                                                </button>
                                            )}
                                        </td>
                                    </tr>

                                    {formVisibility[appointment.id] && !appointment.reportCompleted && (
                                        <tr>
                                            <td colSpan="4">
                                                <div className="mt-4">
                                                    <h4>Enter Description for Appointment {appointment.id}</h4>
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="form-group">
                                                            <textarea
                                                                className="form-control"
                                                                rows="4"
                                                                value={description}
                                                                onChange={(e) => setDescription(e.target.value)}
                                                                placeholder="Enter description"
                                                                required
                                                            />
                                                        </div>
                                                        <button type="submit" className="btn btn-success mt-2">Submit Report</button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-danger mt-2 ml-2"
                                                            onClick={() => handleHideForm(appointment.id)}
                                                        >
                                                            Hide
                                                        </button>
                                                    </form>
                                                </div>
                                            </td>
                                        </tr>
                                    )}

                                    {appointment.reportCompleted && viewedReport && viewedReport.appointment.id === appointment.id && (
                                        <tr>
                                            <td colSpan="4">
                                                <div className="mt-4">
                                                    <h4>Report Description for Appointment {appointment.id}</h4>
                                                    <p>{viewedReport.description}</p>

                                                    <h4>Edit Report Description</h4>
                                                    <div className="form-group">
                                                        <textarea
                                                            className="form-control"
                                                            rows="4"
                                                            value={editDescription}
                                                            onChange={(e) => setEditDescription(e.target.value)}
                                                            placeholder="Edit description"
                                                            required
                                                        />
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="btn btn-warning mt-2"
                                                        onClick={() => handleEditDescription(appointment.id)}
                                                    >
                                                        Save Changes
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="btn btn-danger mt-2 ml-2"
                                                        onClick={() => handleHideForm(appointment.id)}
                                                    >
                                                        Hide
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No appointments available</p>
                )}

                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
        </div>
    );
};

export default PostReport;
