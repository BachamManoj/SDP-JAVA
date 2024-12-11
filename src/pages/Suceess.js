import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';


function SuccessPage() {
  const [patientDetails, setPatientDetails] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const response = await fetch('https://sdp-2200030709-production.up.railway.app/getPatientDetails', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setPatientDetails(data);
        } else {
          navigate('/login');
          setError('Failed to fetch patient details. Please log in again.');
        }
      } catch (error) {
        console.error('Error fetching patient details:', error);
        setError('An error occurred. Please try again later.');
      }
    };

    fetchPatientDetails();
  }, []);

  return (
    <div>
      <Navbar/>
      <h2>Welcome!</h2>
      {error && <p>{error}</p>} 
      {patientDetails ? (
        <div>
          <h3>Patient Details</h3>
          <p>Name: {patientDetails.firstName}</p>
          <p>Email: {patientDetails.email}</p>
          <p>Contact: {patientDetails.contactNumber}</p>
        </div>
      ) : (
        <p>Loading patient details...</p>
      )}
    </div>
  );
}

export default SuccessPage;
