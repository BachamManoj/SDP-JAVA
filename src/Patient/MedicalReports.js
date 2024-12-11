import React, { useState, useEffect } from 'react';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

const MedicalReports = async (patientId) => {
  try {
    const response = await fetch('https://sdp-2200030709-production.up.railway.app/allAppointmentReports/1', {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch PDF');
    }

    const pdfBlob = await response.blob();
    return URL.createObjectURL(pdfBlob); 
  } catch (error) {
    throw new Error(error.message);
  }
};

const PdfView = ({ patientId = 1 }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadPdf = async (id) => {
    try {
      setLoading(true);
      const url = await MedicalReports(id);
      setPdfUrl(url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPdf(patientId);
  }, [patientId]);

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  if (loading) {
    return <p>Loading PDF...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Appointment Report</h1>
      {pdfUrl ? (
        <div>
          <Document
            file={pdfUrl}
            onLoadSuccess={onLoadSuccess}
            loading={<p>Loading PDF...</p>}
          >
            <Page pageNumber={pageNumber} />
          </Document>

          <div>
            <button onClick={goToPreviousPage} disabled={pageNumber <= 1}>
              Previous
            </button>
            <span>Page {pageNumber} of {numPages}</span>
            <button onClick={goToNextPage} disabled={pageNumber >= numPages}>
              Next
            </button>
          </div>
        </div>
      ) : (
        <p>No PDF available</p>
      )}
    </div>
  );
};

export default PdfView;
