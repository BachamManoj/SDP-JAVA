import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import api from "../api/apiClient";

// PDF worker setup
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfView = ({ appointmentId }) => {
  const [pdfUrl, setPdfUrl] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get base URL from axios client (no hardcoding)
  const BASE_URL = api.defaults.baseURL;

  // -------------------------------------------------------------
  // Load PDF Blob from backend with JWT attached via api instance
  // -------------------------------------------------------------
  const fetchMedicalReport = async () => {
    try {
      const response = await api.get(`/allAppointmentReports/${appointmentId}`, {
        responseType: "blob",
      });

      // Create Blob URL for PDF viewer
      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      return URL.createObjectURL(pdfBlob);
    } catch (err) {
      throw new Error("Failed to load PDF");
    }
  };

  // Load PDF on mount or appointmentId change
  useEffect(() => {
    const loadPdf = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = await fetchMedicalReport();
        setPdfUrl(url); // URL for react-pdf <Document />
      } catch (err) {
        setError(err.message);
        setPdfUrl(null);
      } finally {
        setLoading(false);
      }
    };

    if (appointmentId) loadPdf();
  }, [appointmentId]);

  // React-PDF loaded metadata
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // -------------------------------------------------------------
  // UI RENDER
  // -------------------------------------------------------------
  if (loading) return <p>Loading PDF...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ textAlign: "center", padding: 20 }}>
      <h2>Appointment Report</h2>

      {pdfUrl ? (
        <>
          <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} width={600} />
          </Document>

          {/* Pagination */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setPageNumber(pageNumber - 1)}
              disabled={pageNumber <= 1}
            >
              Previous
            </button>

            <span style={{ margin: "0 15px" }}>
              Page {pageNumber} of {numPages}
            </span>

            <button
              onClick={() => setPageNumber(pageNumber + 1)}
              disabled={pageNumber >= numPages}
            >
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No PDF Found</p>
      )}
    </div>
  );
};

export default PdfView;
