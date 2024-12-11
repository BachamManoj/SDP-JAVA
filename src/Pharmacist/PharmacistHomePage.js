import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PharmacistDashboard from './PharmacistDashboard';
import { Link } from 'react-router-dom';

const PharmacistHomePage = () => {
    const [orderCounts, setOrderCounts] = useState({
        delivered: 0,
        inTransit: 0,
        dispatched: 0,
    });

    useEffect(() => {
        fetch('https://sdp-2200030709-production.up.railway.app/getAllOrders', {
            method: 'GET',
            credentials: 'include',
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }
                return response.json();
            })
            .then((orders) => {
                const deliveredCount = orders.filter((order) => order.delivered).length;
                const inTransitCount = orders.filter((order) => order.inTransit).length;
                const dispatchedCount = orders.filter((order) => order.dispatched).length;

                setOrderCounts({
                    delivered: deliveredCount,
                    inTransit: inTransitCount,
                    dispatched: dispatchedCount,
                });
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
            });
    }, []);

    return (
        <div className="dashboard-container d-flex">
            <PharmacistDashboard />
            <div className="container" style={{ marginTop: 75 }}>
                <div className="alert alert-primary text-center shadow-sm">
                    <h2>Pharmacist Home Page</h2>
                    <p>Welcome to the pharmacist portal. Manage and track orders efficiently!</p>
                </div>

                <div className="row text-center mb-4">
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-success text-white">
                                <h6>Orders Delivered</h6>
                            </div>
                            <div className="card-body">
                                <h3>{orderCounts.delivered}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-warning text-white">
                                <h6>Orders In Transit</h6>
                            </div>
                            <div className="card-body">
                                <h3>{orderCounts.inTransit}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card shadow-sm">
                            <div className="card-header bg-info text-white">
                                <h6>Orders Dispatched</h6>
                            </div>
                            <div className="card-body">
                                <h3>{orderCounts.dispatched}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-info text-white">
                                <h5>Track Orders</h5>
                            </div>
                            <div className="card-body">
                                <p>
                                    View all orders placed by patients. Update the status to
                                    <strong> Dispatched</strong>, <strong>In Transit</strong>, or
                                    <strong> Delivered</strong>.
                                </p>
                                <button className="btn btn-info btn-block">
                                    <Link to="/trackOrder" className="text-white text-decoration-none">
                                        Track Orders
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="card shadow-sm mb-4">
                            <div className="card-header bg-success text-white">
                                <h5>Payment Management</h5>
                            </div>
                            <div className="card-body">
                                <p>
                                    Verify payment statuses and mark completed orders as paid.
                                    <strong> Accept Orders</strong>
                                </p>
                                <button className="btn btn-success btn-block">
                                    <Link
                                        to="/viewPaymentsByEPharmacist"
                                        className="text-white text-decoration-none"
                                    >
                                        View Payments
                                    </Link>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PharmacistHomePage;
