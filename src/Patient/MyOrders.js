import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import PatientDashboard from './PatientDashboard';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTruck, faBoxOpen, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeStatusIndex, setActiveStatusIndex] = useState(null);

    useEffect(() => {
        axios
            .get('http://localhost:9999/getOrdersbyPatient', { withCredentials: true })
            .then((response) => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching orders:', error);
                setLoading(false);
            });
    }, []);

    const getStatusText = (order) => {
        if (order.delivered) return 'Delivered';
        if (order.inTransit) return 'In Transit';
        if (order.dispatched) return 'Dispatched';
        return 'Unknown';
    };

    const getStatusClass = (order) => {
        if (order.delivered) return 'badge-success';
        if (order.inTransit) return 'badge-warning';
        if (order.dispatched) return 'badge-info';
        return 'badge-secondary';
    };

    const renderParcelStages = (order) => {
        const stages = [
            { name: 'Dispatched', icon: faTruck, status: order.dispatched },
            { name: 'In Transit', icon: faBoxOpen, status: order.inTransit },
            { name: 'Delivered', icon: faCheckCircle, status: order.delivered },
        ];

        return (
            <div className="row mt-2">
                <div className="col-12">
                    <div className="d-flex justify-content-between">
                        {stages.map((stage, index) => (
                            <div key={index} className="stage text-center">
                                <FontAwesomeIcon
                                    icon={stage.icon}
                                    size="2x"
                                    className={stage.status ? 'text-success' : 'text-muted'}
                                />
                                <br />
                                <span className={stage.status ? 'text-success' : 'text-muted'}>{stage.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="dashboard-container d-flex">
            <PatientDashboard />
            <div className="container" style={{ marginTop: 75 }}>
                <div className="alert alert-primary text-center shadow-sm">
                    <h2>My Orders</h2>
                    <p>View the status and details of your orders below.</p>
                </div>
                {loading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only">Loading...</span>
                        </div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="alert alert-info text-center">
                        <p>No orders found!</p>
                    </div>
                ) : (
                    <table className="table table-striped shadow-sm">
                        <thead className="thead-dark">
                            <tr>
                                <th>#</th>
                                <th>Order Date</th>
                                <th>Address</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order, index) => (
                                <React.Fragment key={order.id}>
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{new Date(order.orderDate).toLocaleString()}</td>
                                        <td>{order.address}</td>
                                        <td>
                                            <span className={`badge bg-success ${getStatusClass(order)}`}>
                                                {getStatusText(order)}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => setActiveStatusIndex(index === activeStatusIndex ? null : index)}
                                            >
                                                {activeStatusIndex === index ? 'Hide Status' : 'Show Status'}
                                            </button>
                                        </td>
                                    </tr>
                                    {activeStatusIndex === index && (
                                        <tr>
                                            <td colSpan="5">
                                                {renderParcelStages(order)}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            <style>
                {`
                    .stage {
                        display: inline-block;
                        width: 30%;
                        text-align: center;
                    }

                    .stage .text-success {
                        color: #28a745;
                    }

                    .stage .text-muted {
                        color: #6c757d;
                    }

                    .mt-2 {
                        margin-top: 1rem;
                    }
                `}
            </style>
        </div>
    );
};

export default MyOrders;
