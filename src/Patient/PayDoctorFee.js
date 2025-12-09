import React, { useState, useEffect } from "react";
import api from "../api/apiClient";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientDashboard from "./PatientDashboard";

const PayDoctorFee = () => {
  const [payments, setPayments] = useState([]);
  const [ePrescriptionPayments, setEPrescriptionPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /** ------------------------------------------------------
   * FETCH BILLINGS
   ------------------------------------------------------ */
  useEffect(() => {
    const loadPayments = async () => {
      try {
        const res1 = await api.get("/getPatientBillings");
        const res2 = await api.get("/getPatientBillingsEprescription");

        setPayments(res1.data || []);
        setEPrescriptionPayments(res2.data || []);
      } catch (err) {
        setError("Failed to load payment information");
      } finally {
        setLoading(false);
      }
    };

    loadPayments();
  }, []);

  /** ------------------------------------------------------
   * HANDLE RAZORPAY PAYMENT
   ------------------------------------------------------ */
  const handlePayNow = async () => {
    if (!selectedPayment) return setError("Please select a payment");

    setIsProcessing(true);

    try {
      /** Step 1 — Create Razorpay Order */
      const orderRes = await api.post("/payments/createOrder", selectedPayment);
      const order = orderRes.data;

      const options = {
        key: "rzp_test_SBtB9sxEr3rXKz",
        amount: order.amount,
        currency: order.currency,
        name: "Doctor Fee Payment",
        description: "Pay your doctor fee",
        order_id: order.id,

        handler: async (response) => {
          const paymentData = {
            ...selectedPayment,
            paymentDate: new Date().toISOString(),
            isPaid: true,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          try {
            /** Step 2 — Find Payment Method */
            const payInfo = await api.get(
              `/payments/paymentDetails/${response.razorpay_payment_id}`
            );

            const details = payInfo.data;

            if (details.card)
              paymentData.paymentMethod = `Card - ${details.card.network}`;
            else if (details.wallet)
              paymentData.paymentMethod = "Wallet";
            else if (details.vpa)
              paymentData.paymentMethod = "UPI";
            else if (details.bank)
              paymentData.paymentMethod = "Net Banking";
            else paymentData.paymentMethod = "Unknown";

            /** Step 3 — Save Final Payment */
            const confirmRes = await api.put("/payments/payNow", paymentData);
            const updatedPayment = confirmRes.data;

            setEPrescriptionPayments((prev) =>
              prev.map((p) => (p.id === updatedPayment.id ? updatedPayment : p))
            );

            /** Step 4 — If ePrescription → confirm order */
            const isEPres = ePrescriptionPayments.some(
              (p) => p.id === updatedPayment.id
            );

            if (isEPres) {
              const ord = await api.post(
                `/confirmOrder/${updatedPayment.appointment.id}`
              );

              if (ord.status === 200) alert("Order Confirmed Successfully!");
            }
          } catch (err) {
            setError("Error confirming payment");
          } finally {
            setIsProcessing(false);
            setSelectedPayment(null);
          }
        },

        theme: { color: "#3399cc" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err) {
      setError("Payment initialization failed");
      setIsProcessing(false);
    }
  };

  if (loading)
    return <p className="text-center mt-5">Loading payment details...</p>;

  if (error)
    return <p className="text-danger text-center mt-5">Error: {error}</p>;

  /** ------------------------------------------------------
   * UI Rendering
   ------------------------------------------------------ */
  return (
    <div className="dashboard-container d-flex">
      <PatientDashboard />

      <div className="container" style={{ marginTop: 75 }}>
        <h2 className="text-center mb-4">Pending E-Prescription Payments</h2>

        {ePrescriptionPayments.length > 0 ? (
          <table className="table table-striped table-bordered">
            <thead className="table-dark">
              <tr>
                <th>Appointment ID</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Method</th>
                <th>Status</th>
                <th>Pay</th>
              </tr>
            </thead>
            <tbody>
              {ePrescriptionPayments.map((p) => (
                <tr key={p.id}>
                  <td>{p.appointment.id}</td>
                  <td>₹ {p.amount.toFixed(2)}</td>
                  <td>{p.paymentDate || "-"}</td>
                  <td>{p.paymentMethod || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        p.isPaid ? "bg-success" : "bg-warning"
                      }`}
                    >
                      {p.isPaid ? "Paid" : "Unpaid"}
                    </span>
                  </td>
                  <td>
                    {!p.isPaid && (
                      <button
                        className="btn btn-primary"
                        onClick={() => setSelectedPayment(p)}
                      >
                        Select
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center">No outstanding e-prescription fees.</p>
        )}

        {selectedPayment && !isProcessing && (
          <div className="text-center mt-4">
            <button className="btn btn-success" onClick={handlePayNow}>
              Pay Now
            </button>
          </div>
        )}

        {isProcessing && (
          <div className="text-center mt-4">
            <div className="spinner-border text-primary"></div>
            <p>Processing payment...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayDoctorFee;
