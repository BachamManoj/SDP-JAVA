import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PharmacistDashboard from './PharmacistDashboard';

const ViewOrders = () => {
    const [orders, setOrders] = useState([]);
    const [orderPrices, setOrderPrices] = useState({});
    const [ePrescriptions, setEPrescriptions] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('https://sdp-2200030709-production.up.railway.app/getAllOrders', { credentials: 'include' });
                if (!response.ok) {
                    if (response.status === 401) throw new Error('Unauthorized access. Please log in as a pharmacist.');
                    throw new Error('Failed to fetch orders.');
                }
                const data = await response.json();
                const filteredOrders = data.filter(order => !order.accept);
                setOrders(filteredOrders);

                const prices = {};
                await Promise.all(
                    filteredOrders.map(async (order) => {
                        const priceResponse = await fetch(
                            `https://sdp-2200030709-production.up.railway.app/getPriceOfOrder/${order.appointment.id}`,
                            { credentials: 'include' }
                        );
                        prices[order.id] = priceResponse.ok ? await priceResponse.json() : 'Error';
                    })
                );
                setOrderPrices(prices);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const fetchEPrescriptions = async (appointmentId) => {
        try {
            const response = await fetch(`https://sdp-2200030709-production.up.railway.app/checkMedicinesAcceptOrder/${appointmentId}`, {
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to fetch ePrescriptions.');
            const data = await response.json();
            setEPrescriptions(data);
            setSelectedAppointment(appointmentId);
        } catch (error) {
            setError(error.message);
        }
    };

    const confirmAcceptOrder = async (appointmentId) => {
        try {
            const response = await fetch(`https://sdp-2200030709-production.up.railway.app/acceptOrder/${appointmentId}`, {
                method: 'POST',
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to accept order.');
            setOrders(orders.map(order => 
                order.appointment.id === appointmentId ? { ...order, accept: true } : order
            ));
            setSelectedAppointment(null);
            setEPrescriptions([]);
            alert('Order accepted successfully');
        } catch (error) {
            setError(error.message);
        }
    };

    if (loading) return <div className="text-center"><div className="spinner-border text-primary" role="status"></div></div>;
    if (error) return <p className="text-danger text-center">{error}</p>;

    return (
        <div className="dashboard-container d-flex">
            <PharmacistDashboard />
            <div className="container" style={{ marginTop: 75 }}>
                <div className="alert alert-info text-center">
                    <h2>New Orders</h2>
                </div>
                {orders.length > 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <table className="table table-hover table-bordered table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Price</th>
                                        <th>Order Date</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <React.Fragment key={order.id}>
                                            <tr>
                                                <td>{order.id}</td>
                                                <td>{order.appointment.patient.firstName}</td>
                                                <td>{order.address}</td>
                                                <td>
                                                    {orderPrices[order.id] !== undefined
                                                        ? orderPrices[order.id] === 'Error'
                                                            ? 'Error fetching price'
                                                            : `₹${orderPrices[order.id].toFixed(2)}`
                                                        : 'Loading...'}
                                                </td>
                                                <td>{order.orderDate}</td>
                                                <td>
                                                    <span className={`badge ${order.isPaid ? 'bg-success' : 'bg-warning'}`}>
                                                        {order.isPaid ? 'Paid' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    {!order.accept && (
                                                        <div>
                                                            <button
                                                                className="btn btn-info btn-sm mb-1"
                                                                onClick={() => fetchEPrescriptions(order.appointment.id)}
                                                            >
                                                                View Medicines
                                                            </button>
                                                            {selectedAppointment === order.appointment.id && (
                                                                <button
                                                                    className="btn btn-success btn-sm"
                                                                    onClick={() => confirmAcceptOrder(order.appointment.id)}
                                                                >
                                                                    Confirm Accept
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                            {selectedAppointment === order.appointment.id && ePrescriptions.length > 0 && (
                                                <tr>
                                                    <td colSpan="7">
                                                        <div className="card shadow">
                                                            <div className="card-header bg-primary text-white text-center">
                                                                <strong>Medicine Details</strong>
                                                            </div>
                                                            <ul className="list-group list-group-flush">
                                                                {ePrescriptions.map((medicine, index) => (
                                                                    <li
                                                                        key={index}
                                                                        className="list-group-item d-flex justify-content-between align-items-center"
                                                                    >
                                                                        <span>{medicine.medicine.name}</span>
                                                                        <span className="badge bg-secondary">{medicine.quantity}</span>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">No unaccepted orders available.</p>
                )}
            </div>
        </div>
    );
};

export default ViewOrders;
