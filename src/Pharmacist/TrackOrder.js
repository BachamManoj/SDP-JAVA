import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PharmacistDashboard from "./PharmacistDashboard";
import api from "../api/apiClient"; // ✅ centralized axios instance

const TrackOrder = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Fetch Orders
  // ---------------------------
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/getAllOrders", { withCredentials: true });

      const acceptedOrders = res.data.filter((order) => order.accept);
      setOrders(acceptedOrders);
    } catch (err) {
      setError("Failed to fetch orders. Please login as pharmacist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ---------------------------
  // Update Order Status
  // ---------------------------
  const updateStatus = async (id, status) => {
    let endpoint = "";

    if (status === "Dispatched") endpoint = `/updateStatusDispatched/${id}`;
    if (status === "In Transit") endpoint = `/updateStatusinTransit/${id}`;
    if (status === "Delivered") endpoint = `/updateStatusDelivered/${id}`;

    try {
      await api.post(endpoint, {}, { withCredentials: true });

      alert(`Order status updated to ${status}`);
      fetchOrders(); // refresh list
    } catch (err) {
      alert("Failed to update status. Try again.");
      console.error(err);
    }
  };

  // ---------------------------
  // Loading / Error
  // ---------------------------
  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  if (error) {
    return <p className="text-danger text-center">{error}</p>;
  }

  // ---------------------------
  // UI
  // ---------------------------
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
              <table className="table table-hover table-bordered">
                <thead className="table-dark">
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
                          ? "Delivered"
                          : order.inTransit
                          ? "In Transit"
                          : order.dispatched
                          ? "Dispatched"
                          : "Pending"}
                      </td>

                      <td>
                        {!order.dispatched && (
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => updateStatus(order.id, "Dispatched")}
                          >
                            Mark Dispatched
                          </button>
                        )}

                        {order.dispatched && !order.inTransit && (
                          <button
                            className="btn btn-info btn-sm"
                            onClick={() => updateStatus(order.id, "In Transit")}
                          >
                            Mark In Transit
                          </button>
                        )}

                        {order.inTransit && !order.delivered && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() => updateStatus(order.id, "Delivered")}
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
          <p className="text-center">No accepted orders found.</p>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
