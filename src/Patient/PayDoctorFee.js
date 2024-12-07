import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientDashboard from './PatientDashboard';

const PayDoctorFee = () => {
    const [payments, setPayments] = useState([]);
    const [ePrescriptionPayments, setEPrescriptionPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await fetch('http://localhost:9999/getPatientBillings', { credentials: 'include' });
                const ePresResponse = await fetch('http://localhost:9999/getPatientBillingsEprescription', { credentials: 'include' });

                if (!response.ok || !ePresResponse.ok) {
                    throw new Error('Error fetching payments.');
                }

                const paymentData = await response.json();
                const ePrescriptionData = await ePresResponse.json();

                setPayments(paymentData);
                setEPrescriptionPayments(ePrescriptionData);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    const handlePayNow = async () => {
        if (!selectedPayment) {
            setError('Please select a payment');
            return;
        }
    
        setIsProcessing(true);
        try {
            const orderResponse = await fetch('http://localhost:9999/payments/createOrder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(selectedPayment),
                credentials: 'include',
            });
    
            if (!orderResponse.ok) {
                throw new Error('Failed to create payment order');
            }
    
            const orderData = await orderResponse.json();
            const options = {
                key: 'rzp_test_SBtB9sxEr3rXKz',
                amount: orderData.amount,
                currency: orderData.currency,
                name: 'Doctor Fee Payment',
                description: 'Pay your doctor fee',
                order_id: orderData.id,
                handler: async (response) => {
                    const paymentData = {
                        ...selectedPayment,
                        paymentDate: new Date().toISOString(),
                        paymentMethod: 'Unknown',
                        isPaid: true,
                        razorpayPaymentId: response.razorpay_payment_id,
                        razorpayOrderId: response.razorpay_order_id,
                        razorpaySignature: response.razorpay_signature,
                    };
    
                    try {
                        const paymentDetailsResponse = await fetch(`http://localhost:9999/payments/paymentDetails/${response.razorpay_payment_id}`, {
                            method: 'GET',
                            headers: { 'Authorization': `Bearer ${sessionStorage.getItem('auth_token')}` },
                        });
    
                        if (paymentDetailsResponse.ok) {
                            const paymentDetails = await paymentDetailsResponse.json();
                            if (paymentDetails.card) {
                                paymentData.paymentMethod = `Card - ${paymentDetails.card.network} ${paymentDetails.card.type}`;
                            } else if (paymentDetails.wallet) {
                                paymentData.paymentMethod = 'Wallet';
                            } else if (paymentDetails.vpa) {
                                paymentData.paymentMethod = 'UPI';
                            } else if (paymentDetails.bank) {
                                paymentData.paymentMethod = 'Net Banking';
                            }
                        }
    
                        const confirmResponse = await fetch('http://localhost:9999/payments/payNow', {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(paymentData),
                            credentials: 'include',
                        });
    
                        if (!confirmResponse.ok) {
                            throw new Error('Payment confirmation failed');
                        }
    
                        const updatedPayment = await confirmResponse.json();
                        setPayments(payments.map((p) => (p.id === updatedPayment.id ? updatedPayment : p)));
                        setEPrescriptionPayments(
                            ePrescriptionPayments.map((p) => (p.id === updatedPayment.id ? updatedPayment : p))
                        );
    
                        if (ePrescriptionPayments.some((p) => p.id === selectedPayment.id)) {
                            const confirmOrderResponse = await fetch(`http://localhost:9999/confirmOrder/${selectedPayment.appointment.id}`, {
                                method: 'POST',
                                credentials: 'include',
                            });
    
                            if (!confirmOrderResponse.ok) {
                                throw new Error('Order confirmation failed');
                            }
    
                            const confirmOrderMessage = await confirmOrderResponse.text();
                            console.log(confirmOrderMessage); 
                            alert('Order confirmed successfully!');
                        }
                    } catch (error) {
                        setError(error.message);
                    } finally {
                        setIsProcessing(false);
                        setSelectedPayment(null);
                    }
                },
                prefill: {
                    email: 'user@example.com',
                    contact: '9999999999',
                },
                theme: { color: '#3399cc' },
            };
    
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            setError(error.message);
            setIsProcessing(false);
        }
    };
    
    

    if (loading) {
        return <p>Loading payment details...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="dashboard-container d-flex">
            <PatientDashboard />
            <div className="container" style={{ marginTop: 75 }}>
                

                <h2 className="text-center mt-5 mb-4">DuePayment Fees</h2>
                {ePrescriptionPayments.length > 0 ? (
                    <table className="table table-striped table-bordered">
                        <thead className="thead-dark">
                            <tr>
                                <th>Appointment ID</th>
                                <th>Amount</th>
                                <th>Payment Date</th>
                                <th>Payment Method</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ePrescriptionPayments.map((payment) => (
                                <tr key={payment.id}>
                                    <td>{payment.appointment.id}</td>
                                    <td>Rs {payment.amount.toFixed(2)}</td>
                                    <td>{payment.paymentDate}</td>
                                    <td>{payment.paymentMethod}</td>
                                    <td>
                                        <span className={`badge ${payment.isPaid ? 'bg-success' : 'bg-warning'}`}>
                                            {payment.isPaid ? 'Paid' : 'Unpaid'}
                                        </span>
                                    </td>
                                    <td>
                                        {!payment.isPaid && (
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => setSelectedPayment(payment)}
                                            >
                                                Pay Now
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-center">No outstanding ePrescription fees.</p>
                )}

                {selectedPayment && !isProcessing && (
                    <div className="mt-4">
                        <button className="btn btn-success mt-3" onClick={handlePayNow}>
                            Pay Now
                        </button>
                    </div>
                )}

                {isProcessing && <div className="text-center mt-4">Processing payment...</div>}
            </div>
        </div>
    );
};

export default PayDoctorFee;
