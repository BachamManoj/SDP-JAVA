import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import api from "../api/apiClient";
import PatientDashboard from "./PatientDashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-datepicker/dist/react-datepicker.css";
import "./Appointment.css";

const Appointment = () => {
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [speciality, setSpeciality] = useState("");
    const [patient, setPatient] = useState({});
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState("");

    const [availableSlots, setAvailableSlots] = useState([]);
    const [generatedSlots, setGeneratedSlots] = useState([]);
    const [bookedDates, setBookedDates] = useState([]);

    // Generate slots once
    useEffect(() => {
        const slots = [];
        let time = new Date();
        time.setHours(9, 0, 0, 0);
        const end = new Date();
        end.setHours(17, 0, 0, 0);

        while (time < end) {
            slots.push(
                time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                })
            );
            time.setMinutes(time.getMinutes() + 30);
        }

        setGeneratedSlots(slots);
        setAvailableSlots(slots);
    }, []);

    // Load Patient
    useEffect(() => {
        const loadData = async () => {
            try {
                const patientRes = await api.get("/getPatientDetails");
                setPatient(patientRes.data);

                const booked = await api.get(`/getAlreadybookedDates/${patientRes.data.id}`);
                const formatted = booked.data.map((d) =>
                    new Date(d).toLocaleDateString("en-CA")
                );
                setBookedDates(formatted);

            } catch (err) {
                console.log("Error:", err);
                alert("Your session has expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            }
        };

        loadData();
    }, []);

    // Fetch doctors by specialty
    const fetchDoctors = useCallback(async () => {
        if (!speciality) return;

        try {
            const res = await api.post("/getbyspecialty", speciality, {
                headers: { "Content-Type": "text/plain" },
            });

            setDoctors(res.data);
            setSelectedDoctor(null);
        } catch {
            setDoctors([]);
        }
    }, [speciality]);

    useEffect(() => {
        fetchDoctors();
    }, [fetchDoctors]);

    // Fetch booked timeslots
    const fetchBookedSlots = useCallback(async () => {
        if (!selectedDoctor || !selectedDate) return;

        try {
            const dateStr = selectedDate.toLocaleDateString("en-CA");
            const res = await api.get(
                `/getDoctorFreeSlot/${selectedDoctor.id}/${dateStr}`
            );
            filterSlots(res.data);
        } catch (err) {
            console.log(err);
        }
    }, [selectedDoctor, selectedDate, generatedSlots]);

    useEffect(() => {
        fetchBookedSlots();
    }, [fetchBookedSlots]);

    // Filter booked slots
    const filterSlots = (booked) => {
        const all = generatedSlots.map((s) => s.slice(0, 5));
        const taken = booked.map((s) => s.slice(0, 5));
        setAvailableSlots(all.filter((slot) => !taken.includes(slot)));
    };

    // Submit Appointment
    const submitAppointment = async () => {
        if (!selectedDoctor || !selectedDate || !selectedTime) {
            alert("Please fill all required fields.");
            return;
        }

        try {
            const dateStr = selectedDate.toLocaleDateString("en-CA");

            const body = {
                patient,
                doctor: selectedDoctor,
                date: dateStr,
                timeSlot: selectedTime,
            };

            const res = await api.post("/makeAppointment", body);
            alert(res.data || "Appointment booked successfully!");

        } catch {
            alert("Failed to create appointment.");
        }
    };

    // Disable unavailable Dates
    const isDateDisabled = (date) =>
        bookedDates.includes(date.toLocaleDateString("en-CA"));

    const specialties = [
        { id: 1, name: "Cardiology" },
        { id: 2, name: "Dermatology" },
        { id: 3, name: "Neurology" },
        { id: 4, name: "Pediatrics" },
        { id: 5, name: "Orthopedics" },
    ];

    return (
        <div className="dashboard-container d-flex">
            <PatientDashboard />

            <div className="container" style={{ marginTop: "150px" }}>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-lg">
                            <div className="card-header bg-primary text-white text-center py-3">
                                <h2>Book an Appointment</h2>
                            </div>

                            <div className="card-body">
                                
                                {/* Specialty */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Select Specialty</label>
                                    <select
                                        className="form-select"
                                        value={speciality}
                                        onChange={(e) => setSpeciality(e.target.value)}
                                    >
                                        <option value="">Choose a specialty</option>
                                        {specialties.map((spec) => (
                                            <option key={spec.id} value={spec.name}>
                                                {spec.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Doctor */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold">Select Doctor</label>
                                    <select
                                        className="form-select"
                                        value={selectedDoctor?.id || ""}
                                        onChange={(e) =>
                                            setSelectedDoctor(
                                                doctors.find(
                                                    (doc) => doc.id === parseInt(e.target.value)
                                                )
                                            )
                                        }
                                        disabled={!doctors.length}
                                    >
                                        <option value="">Choose a doctor</option>
                                        {doctors.map((doc) => (
                                            <option key={doc.id} value={doc.id}>
                                                {doc.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Date + Time */}
                                <div className="row">
                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold">Select Date</label>
                                        <ReactDatePicker
                                            selected={selectedDate}
                                            onChange={setSelectedDate}
                                            minDate={new Date()}
                                            filterDate={(d) => !isDateDisabled(d)}
                                            dateFormat="yyyy-MM-dd"
                                            className="form-control"
                                        />
                                    </div>

                                    <div className="col-md-6 mb-4">
                                        <label className="form-label fw-bold">Select Time Slot</label>
                                        <select
                                            className="form-select"
                                            value={selectedTime}
                                            onChange={(e) => setSelectedTime(e.target.value)}
                                            disabled={!selectedDate || !availableSlots.length}
                                        >
                                            <option value="">Choose a time slot</option>
                                            {availableSlots.map((slot, i) => (
                                                <option key={i} value={slot}>
                                                    {slot}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button
                                        className="btn btn-success px-4 py-2"
                                        disabled={!selectedDoctor || !selectedDate || !selectedTime}
                                        onClick={submitAppointment}
                                    >
                                        Book Appointment
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Appointment;
