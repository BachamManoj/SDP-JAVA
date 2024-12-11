import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PharmacistDashboard from './PharmacistDashboard';

const TrackOrder = () => {
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateStatus = async (id, status) => {
        let endpoint = '';
        switch (status) {
            case 'Dispatched':
                endpoint = `/updateStatusDispatched/${id}`;
                break;
            case 'In Transit':
                endpoint = `/updateStatusinTransit/${id}`;
                break;
            case 'Delivered':
                endpoint = `/updateStatusDelivered/${id}`;
                break;
            default:
                return;
        }

        try {
            const response = await fetch(`https://sdp-2200030709-production.up.railway.app${endpoint}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert(`Order status updated to ${status}`);
                fetchOrders(); // Refresh the orders list
            } else {
                alert('Failed to update order status');
            }
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Error occurred while updating status');
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://sdp-2200030709-production.up.railway.app/getAllOrders', {
                credentials: 'include',
            });
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Unauthorized access. Please log in as a pharmacist.');
                }
                throw new Error('Failed to fetch orders.');
            }
            const data = await response.json();
            setOrders(data.filter((order) => order.accept)); // Filter orders where accept is true
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status"></div>
            </div>
        );
    }

    if (error) {
        return <p className="text-danger text-center">{error}</p>;
    }

    return (
        <div className="dashboard-container d-flex">
            <PharmacistDashboard />
            <div className="container" style={{ marginTop: 75 }}>
                <div className="alert alert-info text-center">
                    <h2>Track Orders</h2>
                </div>
                {orders.length > 0 ? (
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <table className="table table-hover table-bordered table-striped">
                                <thead className="thead-dark">
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Patient Name</th>
                                        <th>Address</th>
                                        <th>Order Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.appointment.patient.firstName}</td>
                                            <td>{order.address}</td>
                                            <td>{new Date(order.orderDate).toLocaleString()}</td>
                                            <td>
                                                {order.delivered
                                                    ? 'Delivered'
                                                    : order.inTransit
                                                    ? 'In Transit'
                                                    : order.dispatched
                                                    ? 'Dispatched'
                                                    : 'Pending'}
                                            </td>
                                            <td>
                                                {!order.dispatched && (
                                                    <button
                                                        className="btn btn-warning btn-sm"
                                                        onClick={() => updateStatus(order.id, 'Dispatched')}
                                                    >
                                                        Mark Dispatched
                                                    </button>
                                                )}
                                                {order.dispatched && !order.inTransit && (
                                                    <button
                                                        className="btn btn-info btn-sm"
                                                        onClick={() => updateStatus(order.id, 'In Transit')}
                                                    >
                                                        Mark In Transit
                                                    </button>
                                                )}
                                                {order.inTransit && !order.delivered && (
                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => updateStatus(order.id, 'Delivered')}
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">No accepted orders available.</p>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
